# Radio Application - Data Entities

This document describes the data entities (schemas) used in the radio application.

## Entities Overview

The application uses four main entities:

1. **Track** - Audio tracks/songs
2. **Playlist** - User-created playlists
3. **Favorite** - User favorites
4. **Comment** - Comments on tracks

## Track Entity

Represents a music track in the system.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Auto | - | Unique identifier |
| `title` | string | ✓ | - | Track title |
| `artist` | string | - | null | Artist name |
| `description` | string | - | null | Track description |
| `file_url` | string | - | null | URL to audio file |
| `youtube_url` | string | - | null | YouTube video URL |
| `duration` | number | - | null | Duration in seconds |
| `album_art` | string | - | null | Album artwork URL |
| `genre` | enum | - | "Other" | Music genre |
| `mood` | enum | - | "Chill" | Track mood |
| `tags` | string[] | - | [] | Associated tags |
| `license_type` | enum | ✓ | - | License type |
| `license_confirmed` | boolean | ✓ | false | Rights confirmation |
| `play_count` | number | - | 0 | Number of plays |
| `created_by` | string | Auto | - | Creator email |
| `created_at` | datetime | Auto | - | Creation timestamp |
| `updated_at` | datetime | Auto | - | Update timestamp |

### Genre Options
- Electronic
- Ambient
- Lo-Fi
- Classical
- Jazz
- Pop
- Rock
- Hip Hop
- Other

### Mood Options
- Chill
- Energetic
- Melancholic
- Focus
- Party
- Romance
- Sleep

### License Types
- `original` - Original content
- `royalty_free` - Royalty-free licensed content

### Access Control (RLS)
- **Create**: Authenticated users only
- **Read**: Public (all users)
- **Update**: Owner or admin
- **Delete**: Owner or admin

## Playlist Entity

Represents a user's playlist.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Auto | - | Unique identifier |
| `name` | string | ✓ | - | Playlist name |
| `description` | string | - | null | Playlist description |
| `tracks` | string[] | - | [] | Array of track IDs |
| `created_by` | string | Auto | - | Creator email |
| `created_at` | datetime | Auto | - | Creation timestamp |
| `updated_at` | datetime | Auto | - | Update timestamp |

### Access Control (RLS)
- **Create**: Authenticated users only
- **Read**: Owner or admin
- **Update**: Owner or admin
- **Delete**: Owner or admin

## Favorite Entity

Represents a user's favorite track.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Auto | - | Unique identifier |
| `track_id` | string | ✓ | - | ID of favorited track |
| `user_email` | string | ✓ | - | User's email |
| `created_by` | string | Auto | - | Creator email |
| `created_at` | datetime | Auto | - | Creation timestamp |

### Access Control (RLS)
- **Create**: Authenticated users only
- **Read**: Owner or admin
- **Update**: Owner or admin
- **Delete**: Owner or admin

## Comment Entity

Represents a comment on a track.

### Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Auto | - | Unique identifier |
| `track_id` | string | ✓ | - | ID of commented track |
| `user_email` | string | ✓ | - | Commenter's email |
| `user_name` | string | - | null | Display name |
| `content` | string | ✓ | - | Comment text (max 1000 chars) |
| `timestamp` | number | - | now | Unix timestamp (deprecated) |
| `created_by` | string | Auto | - | Creator email |
| `created_at` | datetime | Auto | - | Creation timestamp |
| `updated_at` | datetime | Auto | - | Update timestamp |

### Access Control (RLS)
- **Create**: Authenticated users only
- **Read**: Public (all users)
- **Update**: Owner or admin
- **Delete**: Owner or admin

## Usage Examples

### Client-Side (JavaScript)

```javascript
import { validateTrack, GENRES, MOODS } from '@/types/entities';

// Create a new track
const trackData = {
  title: "Summer Vibes",
  artist: "DJ Cool",
  genre: "Electronic",
  mood: "Energetic",
  license_type: "original",
  license_confirmed: true
};

// Validate
const { valid, errors } = validateTrack(trackData);
if (!valid) {
  console.error('Validation errors:', errors);
}
```

### Server-Side (Node.js)

```javascript
const { Track } = require('./models');

// Create new track instance
const track = new Track({
  title: "Midnight Dreams",
  artist: "Night Owl",
  genre: "Lo-Fi",
  mood: "Chill",
  license_type: "royalty_free",
  license_confirmed: true,
  created_by: "user@example.com"
});

// Check permissions
if (track.canUpdate(userEmail, userRole)) {
  track.incrementPlayCount();
}

// Convert to JSON for response
res.json(track.toJSON());
```

## File Locations

- **Client Types**: `/client/src/types/entities.js`
- **Server Models**: `/server/models/*.js`
- **JSON Schema**: `/shared/schemas/entities.json`

## Validation

All entities include validation helpers that check:
- Required fields are present
- Field types are correct
- Enum values are valid
- String lengths are within limits
- Numbers are in valid ranges

Use the validation functions before creating or updating entities to ensure data integrity.
