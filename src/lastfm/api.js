const BASE = 'https://ws.audioscrobbler.com/2.0/';

export async function getSimilarArtists(artistName, apiKey, limit = 12) {
  const params = new URLSearchParams({
    method:  'artist.getSimilar',
    artist:  artistName,
    api_key: apiKey,
    format:  'json',
    limit,
  });
  const res = await fetch(`${BASE}?${params}`);
  if (!res.ok) throw new Error(`Last.fm ${res.status}`);
  const data = await res.json();
  // Each entry: { name, match (similarity 0–1), url, image[] }
  return data.similarartists?.artist || [];
}
