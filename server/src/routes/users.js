import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, email, display_name, avatar_url, bio, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by username
router.get('/:username', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.username, u.display_name, u.avatar_url, u.bio, u.created_at,
              COUNT(DISTINCT t.id) as tracks_count,
              COUNT(DISTINCT f.follower_id) as followers_count,
              COUNT(DISTINCT fw.following_id) as following_count
       FROM users u
       LEFT JOIN tracks t ON u.id = t.user_id
       LEFT JOIN follows f ON u.id = f.following_id
       LEFT JOIN follows fw ON u.id = fw.follower_id
       WHERE u.username = $1
       GROUP BY u.id`,
      [req.params.username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's tracks
router.get('/:username/tracks', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.username, u.display_name, u.avatar_url as user_avatar
       FROM tracks t
       JOIN users u ON t.user_id = u.id
       WHERE u.username = $1
       ORDER BY t.created_at DESC`,
      [req.params.username]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get user tracks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/me', authenticateToken, async (req, res) => {
  const { display_name, bio, avatar_url } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET display_name = COALESCE($1, display_name),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, username, email, display_name, avatar_url, bio, created_at`,
      [display_name, bio, avatar_url, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Follow/Unfollow user
router.post('/:username/follow', authenticateToken, async (req, res) => {
  try {
    // Get user id by username
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [req.params.username]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const followingId = userResult.rows[0].id;

    if (followingId === req.user.id) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    const checkFollow = await pool.query(
      'SELECT * FROM follows WHERE follower_id = $1 AND following_id = $2',
      [req.user.id, followingId]
    );

    if (checkFollow.rows.length > 0) {
      // Unfollow
      await pool.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
        [req.user.id, followingId]
      );
      res.json({ following: false });
    } else {
      // Follow
      await pool.query(
        'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
        [req.user.id, followingId]
      );
      res.json({ following: true });
    }
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
