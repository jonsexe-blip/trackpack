import { DISCOVERY_SONGS } from '../data/similar.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeDiscoveryCard(entry, basedOnArtistId) {
  return {
    id: `disc_${entry.song.id}_${Math.random().toString(36).slice(2, 7)}`,
    type: 'discovery',
    song: { ...entry.song, artistId: entry.artist.id, albumId: entry.album.id },
    artist: entry.artist,
    album: entry.album,
    basedOnArtistId,
  };
}

/**
 * Pick 5 discovery cards from similar artists.
 * Prefers entries that match chosen artist IDs.
 * Returns { deck: PlaylistCard[], reserve: PlaylistCard[] }
 */
export function generateDiscoveryDeck(chosenArtists, count = 5) {
  const chosenIds = new Set(chosenArtists.map(a => a.id));

  // Filter to entries that have at least one matching basedOnArtistId
  const relevant = DISCOVERY_SONGS.filter(entry =>
    entry.basedOnArtistIds.some(id => chosenIds.has(id))
  );

  // Deduplicate by similar artist — prefer one song per similar artist
  const seenArtists = new Set();
  const deduped = [];
  for (const entry of shuffle(relevant)) {
    if (!seenArtists.has(entry.artist.id)) {
      seenArtists.add(entry.artist.id);
      deduped.push(entry);
    }
  }

  // Fill up to count from remaining if deduped is short
  const remaining = shuffle(relevant.filter(e => !deduped.includes(e)));
  const pool = [...deduped, ...remaining];

  const deck = [];
  const reserve = [];
  pool.forEach((entry, i) => {
    const basedOn = entry.basedOnArtistIds.find(id => chosenIds.has(id)) || entry.basedOnArtistIds[0];
    const card = makeDiscoveryCard(entry, basedOn);
    if (i < count) deck.push(card);
    else reserve.push(card);
  });

  return { deck, reserve };
}
