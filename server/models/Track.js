/**
 * Track Model
 * Represents a music track in the radio application
 */

const GENRES = [
  'Electronic',
  'Ambient',
  'Lo-Fi',
  'Classical',
  'Jazz',
  'Pop',
  'Rock',
  'Hip Hop',
  'Other'
];

const MOODS = [
  'Chill',
  'Energetic',
  'Melancholic',
  'Focus',
  'Party',
  'Romance',
  'Sleep'
];

const LICENSE_TYPES = ['original', 'royalty_free'];

class Track {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.artist = data.artist || null;
    this.description = data.description || null;
    this.file_url = data.file_url || null;
    this.youtube_url = data.youtube_url || null;
    this.duration = data.duration || null;
    this.album_art = data.album_art || null;
    this.genre = data.genre || 'Other';
    this.mood = data.mood || 'Chill';
    this.tags = data.tags || [];
    this.license_type = data.license_type;
    this.license_confirmed = data.license_confirmed || false;
    this.play_count = data.play_count || 0;
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Validate track data
   * @param {Object} data - Track data to validate
   * @returns {{valid: boolean, errors: string[]}}
   */
  static validate(data) {
    const errors = [];

    // Required fields
    if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
      errors.push('Title is required');
    }

    if (!data.license_type || !LICENSE_TYPES.includes(data.license_type)) {
      errors.push('Valid license_type is required (original or royalty_free)');
    }

    if (data.license_confirmed !== true) {
      errors.push('License confirmation is required');
    }

    // Optional field validations
    if (data.genre && !GENRES.includes(data.genre)) {
      errors.push(`Invalid genre. Must be one of: ${GENRES.join(', ')}`);
    }

    if (data.mood && !MOODS.includes(data.mood)) {
      errors.push(`Invalid mood. Must be one of: ${MOODS.join(', ')}`);
    }

    if (data.duration && (typeof data.duration !== 'number' || data.duration < 0)) {
      errors.push('Duration must be a positive number');
    }

    if (data.tags && !Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    }

    if (data.play_count && (typeof data.play_count !== 'number' || data.play_count < 0)) {
      errors.push('Play count must be a non-negative number');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user can update this track
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canUpdate(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Check if user can delete this track
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canDelete(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Increment play count
   */
  incrementPlayCount() {
    this.play_count += 1;
    this.updated_at = new Date().toISOString();
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      artist: this.artist,
      description: this.description,
      file_url: this.file_url,
      youtube_url: this.youtube_url,
      duration: this.duration,
      album_art: this.album_art,
      genre: this.genre,
      mood: this.mood,
      tags: this.tags,
      license_type: this.license_type,
      license_confirmed: this.license_confirmed,
      play_count: this.play_count,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Track;
