/**
 * Comment Model
 * Represents a comment on a track
 */

class Comment {
  constructor(data) {
    this.id = data.id;
    this.track_id = data.track_id;
    this.user_email = data.user_email;
    this.user_name = data.user_name || null;
    this.content = data.content;
    this.timestamp = data.timestamp || Date.now();
    this.created_by = data.created_by || data.user_email;
    this.created_at = data.created_at || new Date().toISOString();
    this.updated_at = data.updated_at || new Date().toISOString();
  }

  /**
   * Validate comment data
   * @param {Object} data - Comment data to validate
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

    if (!data.content || typeof data.content !== 'string' || data.content.trim() === '') {
      errors.push('Comment content is required');
    }

    if (data.content && data.content.length > 1000) {
      errors.push('Comment content must be less than 1000 characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if user can update this comment
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canUpdate(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Check if user can delete this comment
   * @param {string} userEmail - Email of the user
   * @param {string} userRole - Role of the user
   * @returns {boolean}
   */
  canDelete(userEmail, userRole) {
    return this.created_by === userEmail || userRole === 'admin';
  }

  /**
   * Update comment content
   * @param {string} newContent - New content
   */
  updateContent(newContent) {
    if (newContent && newContent.trim() !== '') {
      this.content = newContent;
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
      track_id: this.track_id,
      user_email: this.user_email,
      user_name: this.user_name,
      content: this.content,
      timestamp: this.timestamp,
      created_by: this.created_by,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Comment;
