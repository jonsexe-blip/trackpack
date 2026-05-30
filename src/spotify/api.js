const BASE = 'https://api.spotify.com/v1';

async function request(path, token, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Spotify API ${res.status}`);
  }
  return res.json();
}

export function getMe(token) {
  return request('/me', token);
}

export function searchArtists(query, token, limit = 10) {
  const q = encodeURIComponent(query);
  return request(`/search?q=${q}&type=artist&limit=${limit}`, token);
}

export function getArtistAlbums(artistId, token, limit = 10, includeGroups = 'album') {
  return request(
    `/artists/${artistId}/albums?include_groups=${includeGroups}&limit=${limit}&market=US`,
    token
  );
}

// Batch-fetch albums in chunks of 20 (Spotify's per-request limit)
export async function getAlbumsBatch(albumIds, token) {
  const CHUNK = 20;
  const albums = [];
  for (let i = 0; i < albumIds.length; i += CHUNK) {
    const ids = albumIds.slice(i, i + CHUNK).join(',');
    const res = await request(`/albums?ids=${ids}&market=US`, token);
    if (res?.albums) albums.push(...res.albums);
  }
  return { albums };
}

export function getRelatedArtists(artistId, token) {
  return request(`/artists/${artistId}/related-artists`, token);
}

export function getArtistTopTracks(artistId, token) {
  return request(`/artists/${artistId}/top-tracks?market=US`, token);
}

export function createPlaylist(userId, name, isPublic, description, token) {
  return request(`/users/${userId}/playlists`, token, {
    method: 'POST',
    body: JSON.stringify({ name, public: isPublic, description }),
  });
}

// Spotify caps at 100 URIs per call — batch automatically
export async function addTracksToPlaylist(playlistId, uris, token) {
  const BATCH = 100;
  for (let i = 0; i < uris.length; i += BATCH) {
    await request(`/playlists/${playlistId}/tracks`, token, {
      method: 'POST',
      body: JSON.stringify({ uris: uris.slice(i, i + BATCH) }),
    });
  }
}
