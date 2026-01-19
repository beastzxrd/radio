/**
 * Models Index
 * Exports all data models for the radio application
 */

const Track = require('./Track');
const Playlist = require('./Playlist');
const Favorite = require('./Favorite');
const Comment = require('./Comment');

module.exports = {
  Track,
  Playlist,
  Favorite,
  Comment
};
