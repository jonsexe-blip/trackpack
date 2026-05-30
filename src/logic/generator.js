export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function distribute(total, count) {
  const base  = Math.floor(total / count);
  const extra = total % count;
  return Array.from({ length: count }, (_, i) => base + (i < extra ? 1 : 0));
}

// Round-robin across albums so no album is exhausted before others are sampled
function buildInterleavedQueue(artistId, albumsByArtist, songsByArtist) {
  const albums = shuffle(albumsByArtist[artistId] || []);
  const songsByAlbum = albums.map(album =>
    shuffle((songsByArtist[artistId] || []).filter(s => s.albumId === album.id))
  );

  const queue = [];
  let remaining = true;
  while (remaining) {
    remaining = false;
    for (const albumSongs of songsByAlbum) {
      if (albumSongs.length > 0) {
        queue.push(albumSongs.shift());
        remaining = true;
      }
    }
  }
  return queue;
}

function makeCard(song, artist, album, type = 'core') {
  return {
    id:    `card_${song.id}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    song,
    artist,
    album,
  };
}

/**
 * Generate a 20-card core deck from pre-fetched data.
 * Works with both mock and Spotify data.
 *
 * @param {object[]} chosenArtists
 * @param {object}   songsByArtist  - { [artistId]: Song[] }
 * @param {object}   albumsByArtist - { [artistId]: Album[] }
 * @returns {{ deck: PlaylistCard[], reserve: PlaylistCard[] }}
 */
export function generateCoreDeck(chosenArtists, songsByArtist, albumsByArtist, coreCount = 20) {
  const TARGET = coreCount;

  // Build interleaved queues up front
  const queues = chosenArtists.map(artist =>
    buildInterleavedQueue(artist.id, albumsByArtist, songsByArtist)
  );

  // Initial equal-ish quotas
  const quotas = distribute(TARGET, chosenArtists.length);

  // Redistribute unused quota from under-stocked artists to those with capacity
  let surplus = 0;
  queues.forEach((q, i) => {
    if (q.length < quotas[i]) {
      surplus += quotas[i] - q.length;
      quotas[i] = q.length;
    }
  });
  if (surplus > 0) {
    const capable = queues
      .map((q, i) => ({ i, room: q.length - quotas[i] }))
      .filter(x => x.room > 0)
      .sort((a, b) => b.room - a.room);
    for (const { i } of capable) {
      const give = Math.min(surplus, queues[i].length - quotas[i]);
      quotas[i] += give;
      surplus -= give;
      if (surplus <= 0) break;
    }
  }

  const deck    = [];
  const reserve = [];

  chosenArtists.forEach((artist, i) => {
    const queue = queues[i];
    const quota = quotas[i];
    queue.forEach((song, j) => {
      const album = (albumsByArtist[artist.id] || []).find(a => a.id === song.albumId);
      const card  = makeCard(song, artist, album || { id: '', name: '', artUrl: '', year: 0 }, 'core');
      if (j < quota) deck.push(card);
      else           reserve.push(card);
    });
  });

  return { deck: shuffle(deck), reserve: shuffle(reserve) };
}

export function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}
