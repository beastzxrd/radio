/**
 * Playlist Model
 * Represents a user's playlist
 */

class Playlist {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description || null;
    this.tracks = data.tracks || [];
    this.created_by = data.created_by;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Validate playlist data
   * @param {Object} data - Playlist data to validate
   * @returns {{valid: boolean, errors: string[]}}
   */
  static validate(data) {
    const errors = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
      errors.push('Playlist name is required');
    }

    if (data.tracks && !Array.isArray(data.tracks)) {
      errors.push('Tracks must be an array of track IDs');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user can read this playlist
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canRead(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Check if user can update this playlist
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canUpdate(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Check if user can delete this playlist
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canDelete(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Add track to playlist
   * @param {string} trackId - ID of the track to add
   */
  addTrack(trackId) {
    if (!this.tracks.includes(trackId)) {
      this.tracks.push(trackId);
      this.updated_at = new Date().toISOString();
    }
  }

  /**
   * Remove track from playlist
   * @param {string} trackId - ID of the track to remove
   */
  removeTrack(trackId) {
    const index = this.tracks.indexOf(trackId);
    if (index > -1) {
      this.tracks.splice(index, 1);
      this.updated_at = new Date().toISOString();
    }
  }

  /**
   * Reorder tracks in playlist
   * @param {string[]} newOrder - New order of track IDs
   */
  reorderTracks(newOrder) {
    if (Array.isArray(newOrder) && newOrder.length === this.tracks.length) {
      this.tracks = newOrder;
      this.updated_at = new Date().toISOString();
    }
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      tracks: this.tracks,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Playlist;
