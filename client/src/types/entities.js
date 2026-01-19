/**
 * Database Entity Schemas
 * These define the structure of data entities in the radio application
 */

/**
 * @typedef {Object} Track
 * @property {string} id - Unique track identifier
 * @property {string} title - Track title
 * @property {string} [artist] - Artist name
 * @property {string} [description] - Track description
 * @property {string} [file_url] - URL to the audio file
 * @property {string} [youtube_url] - YouTube video URL
 * @property {number} [duration] - Duration in seconds
 * @property {string} [album_art] - URL to album artwork
 * @property {'Electronic'|'Ambient'|'Lo-Fi'|'Classical'|'Jazz'|'Pop'|'Rock'|'Hip Hop'|'Other'} [genre='Other'] - Music genre
 * @property {'Chill'|'Energetic'|'Melancholic'|'Focus'|'Party'|'Romance'|'Sleep'} [mood='Chill'] - Track mood
 * @property {string[]} [tags] - Associated tags
 * @property {'original'|'royalty_free'} license_type - License type of the track
 * @property {boolean} license_confirmed - Confirmation that the user has rights to upload
 * @property {number} [play_count=0] - Number of times the track has been played
 * @property {string} [created_by] - Email of the user who created the track
 * @property {string} [created_at] - ISO timestamp of creation
 * @property {string} [updated_at] - ISO timestamp of last update
 */

/**
 * @typedef {Object} Playlist
 * @property {string} id - Unique playlist identifier
 * @property {string} name - Playlist name
 * @property {string} [description] - Playlist description
 * @property {string[]} [tracks] - List of track IDs
 * @property {string} [created_by] - Email of the user who created the playlist
 * @property {string} [created_at] - ISO timestamp of creation
 * @property {string} [updated_at] - ISO timestamp of last update
 */

/**
 * @typedef {Object} Favorite
 * @property {string} id - Unique favorite identifier
 * @property {string} track_id - ID of the favorited track
 * @property {string} user_email - Email of the user who favorited
 * @property {string} [created_by] - Email of the user who created the favorite
 * @property {string} [created_at] - ISO timestamp of creation
 */

/**
 * @typedef {Object} Comment
 * @property {string} id - Unique comment identifier
 * @property {string} track_id - ID of the track being commented on
 * @property {string} user_email - Email of the user who commented
 * @property {string} [user_name] - Display name of the user
 * @property {string} content - The comment text
 * @property {number} [timestamp] - Unix timestamp (deprecated, use created_at)
 * @property {string} [created_by] - Email of the user who created the comment
 * @property {string} [created_at] - ISO timestamp of creation
 * @property {string} [updated_at] - ISO timestamp of last update
 */

// Genre options for Track
export const GENRES = [
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

// Mood options for Track
export const MOODS = [
  'Chill',
  'Energetic',
  'Melancholic',
  'Focus',
  'Party',
  'Romance',
  'Sleep'
];

// License types for Track
export const LICENSE_TYPES = [
  'original',
  'royalty_free'
];

/**
 * Validation helper for Track entity
 * @param {Partial<Track>} track - Track data to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateTrack(track) {
  const errors = [];

  if (!track.title || typeof track.title !== 'string' || track.title.trim() === '') {
    errors.push('Title is required');
  }

  if (!track.license_type || !LICENSE_TYPES.includes(track.license_type)) {
    errors.push('Valid license_type is required (original or royalty_free)');
  }

  if (track.license_confirmed !== true) {
    errors.push('License confirmation is required');
  }

  if (track.genre && !GENRES.includes(track.genre)) {
    errors.push(`Invalid genre. Must be one of: ${GENRES.join(', ')}`);
  }

  if (track.mood && !MOODS.includes(track.mood)) {
    errors.push(`Invalid mood. Must be one of: ${MOODS.join(', ')}`);
  }

  if (track.duration && (typeof track.duration !== 'number' || track.duration < 0)) {
    errors.push('Duration must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validation helper for Playlist entity
 * @param {Partial<Playlist>} playlist - Playlist data to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validatePlaylist(playlist) {
  const errors = [];

  if (!playlist.name || typeof playlist.name !== 'string' || playlist.name.trim() === '') {
    errors.push('Playlist name is required');
  }

  if (playlist.tracks && !Array.isArray(playlist.tracks)) {
    errors.push('Tracks must be an array of track IDs');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validation helper for Favorite entity
 * @param {Partial<Favorite>} favorite - Favorite data to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateFavorite(favorite) {
  const errors = [];

  if (!favorite.track_id || typeof favorite.track_id !== 'string') {
    errors.push('track_id is required');
  }

  if (!favorite.user_email || typeof favorite.user_email !== 'string') {
    errors.push('user_email is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validation helper for Comment entity
 * @param {Partial<Comment>} comment - Comment data to validate
 * @returns {{valid: boolean, errors: string[]}}
 */
export function validateComment(comment) {
  const errors = [];

  if (!comment.track_id || typeof comment.track_id !== 'string') {
    errors.push('track_id is required');
  }

  if (!comment.user_email || typeof comment.user_email !== 'string') {
    errors.push('user_email is required');
  }

  if (!comment.content || typeof comment.content !== 'string' || comment.content.trim() === '') {
    errors.push('Comment content is required');
  }

  if (comment.content && comment.content.length > 1000) {
    errors.push('Comment content must be less than 1000 characters');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Default values for creating a new Track
 * @returns {Partial<Track>}
 */
export function getDefaultTrack() {
  return {
    genre: 'Other',
    mood: 'Chill',
    tags: [],
    play_count: 0,
    license_confirmed: false
  };
}

/**
 * Default values for creating a new Playlist
 * @returns {Partial<Playlist>}
 */
export function getDefaultPlaylist() {
  return {
    tracks: []
  };
}
