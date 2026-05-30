export const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// Must match exactly what's registered in your Spotify Developer Dashboard
export const REDIRECT_URI = window.location.origin;

export const SCOPES = [
  'user-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
].join(' ');
