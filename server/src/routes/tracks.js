import express from 'express';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { uploadAudio, uploadImage, uploadToCloudinary } from '../middleware/upload.js';
import pool from '../config/database.js';

const router = express.Router();

// Upload audio file
router.post('/upload', authenticateToken, uploadAudio.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó un archivo de audio' });
    }

    // Subir a Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'video', // Cloudinary usa 'video' para audio
      folder: 'radio/tracks',
      format: 'mp3',
    });

    res.json({
      url: result.secure_url,
      duration: result.duration,
      format: result.format,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload audio error:', error);
    res.status(500).json({ error: 'Error al subir el archivo de audio' });
  }
});

// Upload image file
router.post('/upload-image', authenticateToken, uploadImage.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó una imagen' });
    }

    // Subir a Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
      folder: 'radio/images',
      transformation: [
        { width: 500, height: 500, crop: 'fill' }
      ]
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
});

// Get all tracks
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { limit = 50, offset = 0, sort = '-created_at' } = req.query;
    
    let orderBy = 'created_at DESC';
    if (sort === 'plays') orderBy = 'plays_count DESC';
    if (sort === 'likes') orderBy = 'likes_count DESC';
    
    const result = await pool.query(
      `SELECT t.*, u.username, u.display_name, u.avatar_url as user_avatar
       FROM tracks t
       LEFT JOIN users u ON t.user_id = u.id
       ORDER BY ${orderBy}
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get tracks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single track
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.username, u.display_name, u.avatar_url as user_avatar
       FROM tracks t
       LEFT JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    // Increment play count
    await pool.query(
      'UPDATE tracks SET plays_count = plays_count + 1 WHERE id = $1',
      [req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create track
router.post('/', authenticateToken, async (req, res) => {
  const { title, artist, album, genre, duration, file_url, album_art } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO tracks (title, artist, album, genre, duration, file_url, album_art, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [title, artist || req.user.username, album, genre, duration, file_url, album_art, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update track
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, artist, album, genre, album_art } = req.body;

  try {
    // Check ownership
    const checkOwner = await pool.query(
      'SELECT user_id FROM tracks WHERE id = $1',
      [req.params.id]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    if (checkOwner.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await pool.query(
      `UPDATE tracks 
       SET title = COALESCE($1, title),
           artist = COALESCE($2, artist),
           album = COALESCE($3, album),
           genre = COALESCE($4, genre),
           album_art = COALESCE($5, album_art),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING *`,
      [title, artist, album, genre, album_art, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete track
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check ownership
    const checkOwner = await pool.query(
      'SELECT user_id FROM tracks WHERE id = $1',
      [req.params.id]
    );

    if (checkOwner.rows.length === 0) {
      return res.status(404).json({ error: 'Track not found' });
    }

    if (checkOwner.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.query('DELETE FROM tracks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Track deleted successfully' });
  } catch (error) {
    console.error('Delete track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/Unlike track
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const checkLike = await pool.query(
      'SELECT * FROM likes WHERE user_id = $1 AND track_id = $2',
      [req.user.id, req.params.id]
    );

    if (checkLike.rows.length > 0) {
      // Unlike
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND track_id = $2',
        [req.user.id, req.params.id]
      );
      await pool.query(
        'UPDATE tracks SET likes_count = likes_count - 1 WHERE id = $1',
        [req.params.id]
      );
      res.json({ liked: false });
    } else {
      // Like
      await pool.query(
        'INSERT INTO likes (user_id, track_id) VALUES ($1, $2)',
        [req.user.id, req.params.id]
      );
      await pool.query(
        'UPDATE tracks SET likes_count = likes_count + 1 WHERE id = $1',
        [req.params.id]
      );
      res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like track error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
