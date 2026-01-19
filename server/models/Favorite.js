/**
 * Favorite Model
 * Represents a user's favorite track
 */

class Favorite {
  constructor(data) {
    this.id = data.id;
    this.track_id = data.track_id;
    this.user_email = data.user_email;
    this.created_by = data.created_by || data.user_email;
    this.created_at = data.created_at || new Date().toISOString();
  }

  /**
   * Validate favorite data
   * @param {Object} data - Favorite data to validate
   * @returns {{valid: boolean, errors: string[]}}
   */
  static validate(data) {
    const errors = [];

    if (!data.track_id || typeof data.track_id !== 'string') {
      errors.push('track_id is required');
    }

    if (!data.user_email || typeof data.user_email !== 'string') {
      errors.push('user_email is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user can read this favorite
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canRead(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Check if user can delete this favorite
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canDelete(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Convert to plain object
   * @returns {Object}
   */
  toJSON() {
    return {
      id: this.id,
      track_id: this.track_id,
      user_email: this.user_email,
      created_by: this.created_by,
      created_at: this.created_at
    };
  }
}

module.exports = Favorite;
