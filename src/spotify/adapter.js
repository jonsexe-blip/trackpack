// Convert Spotify API objects → TrackPack internal format

export function adaptArtist(sp) {
  return {
    id:       sp.id,
    name:     sp.name,
    imageUrl: sp.images?.[0]?.url || `https://picsum.photos/seed/${sp.id}/400/400`,
    genres:   sp.genres?.slice(0, 2) || [],
    spotifyUrl: sp.external_urls?.spotify || null,
  };
}

// Only true represses — not deluxe/live/collection editions which have valid release dates
const REMASTER_RE = /\bremaster(ed)?\b|\breissue\b|\bre-issue\b|\banniversary\b|\bexpanded\b/i;

export function adaptAlbum(sp, artistId) {
  const releaseYear = parseInt(sp.release_date, 10);

  // Classic albums on Spotify often appear only as remasters with the remaster's
  // release date (e.g. "Rio" → 2009 Remaster, release_date: 2009). Extract the
  // original era year from the title when possible; fall back to 0 so the year
  // filter skips these rather than incorrectly excluding them.
  let year = releaseYear;
  if (REMASTER_RE.test(sp.name)) {
    const yearsInName = (sp.name.match(/\b(19[5-9]\d|20[0-2]\d)\b/g) || []).map(Number);
    const originalYear = yearsInName.find(y => y < releaseYear);
    year = originalYear !== undefined ? originalYear : 0;
  }

  return {
    id:       sp.id,
    artistId: artistId || sp.artists?.[0]?.id,
    name:     sp.name,
    artUrl:   sp.images?.[0]?.url || `https://picsum.photos/seed/${sp.id}/200/200`,
    year,
  };
}

export function adaptTrack(sp, artistId, albumId) {
  return {
    id:         sp.id,
    artistId:   artistId || sp.artists?.[0]?.id,
    albumId:    albumId  || sp.album?.id,
    name:       sp.name,
    durationMs: sp.duration_ms,
    uri:        sp.uri,
    previewUrl: sp.preview_url || null,
  };
}
