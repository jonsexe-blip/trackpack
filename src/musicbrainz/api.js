const MB_BASE = 'https://musicbrainz.org/ws/2';

/**
 * Returns a Set of lowercase names that are musically "related" to artistName
 * via band membership — members of the band if it's a group, or the band(s)
 * the artist belonged to if they're a solo act.
 * Returns an empty Set on any failure so it's always safe to await.
 */
/**
 * Returns the MusicBrainz artist type ('Person', 'Group', 'Orchestra', etc.)
 * for the given artist name, or null if not found / uncertain.
 */
export async function getArtistType(artistName) {
  try {
    const q = new URLSearchParams({ query: `artist:"${artistName}"`, fmt: 'json', limit: 3 });
    const res = await fetch(`${MB_BASE}/artist/?${q}`);
    if (!res.ok) return null;
    const data = await res.json();
    const match = (data?.artists || []).find(a => a.score >= 85);
    return match?.type || null;
  } catch {
    return null;
  }
}

export async function getRelatedArtistNames(artistName) {
  try {
    const q = new URLSearchParams({ query: `artist:"${artistName}"`, fmt: 'json', limit: 1 });
    const searchRes = await fetch(`${MB_BASE}/artist/?${q}`);
    if (!searchRes.ok) return new Set();

    const searchData = await searchRes.json();
    const top = searchData?.artists?.[0];
    // Require a confident match
    if (!top || top.score < 85) return new Set();

    const relRes = await fetch(`${MB_BASE}/artist/${top.id}?inc=artist-rels&fmt=json`);
    if (!relRes.ok) return new Set();

    const relData = await relRes.json();
    const names = new Set();

    for (const rel of relData?.relations || []) {
      if (rel.type === 'member of band' && rel.artist?.name) {
        names.add(rel.artist.name.toLowerCase());
      }
    }

    return names;
  } catch {
    return new Set();
  }
}
