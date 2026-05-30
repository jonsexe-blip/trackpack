import { getArtistAlbums, getAlbumsBatch, searchArtists, getArtistTopTracks } from './api.js';
import { adaptAlbum, adaptTrack, adaptArtist } from './adapter.js';
import { getSimilarArtists } from '../lastfm/api.js';
import { getRelatedArtistNames } from '../musicbrainz/api.js';

/**
 * Fetch albums + tracks for each chosen artist.
 * Returns { albumsByArtist, songsByArtist } in internal format.
 */
export async function fetchArtistData(chosenArtists, token, { noSingles = false } = {}) {
  const albumsByArtist = {};
  const songsByArtist  = {};
  const includeGroups  = noSingles ? 'album' : 'album,single';

  await Promise.all(chosenArtists.map(async (artist) => {
    albumsByArtist[artist.id] = [];
    songsByArtist[artist.id]  = [];

    const albumsRes = await getArtistAlbums(artist.id, token, 50, includeGroups);
    const albumItems = albumsRes?.items || [];
    if (!albumItems.length) return;

    const fullAlbumsRes = await getAlbumsBatch(albumItems.map(a => a.id), token);
    const fullAlbums = fullAlbumsRes?.albums || [];

    fullAlbums.forEach(spAlbum => {
      if (!spAlbum) return;
      const album = adaptAlbum(spAlbum, artist.id);
      albumsByArtist[artist.id].push(album);

      const tracks = spAlbum.tracks?.items || [];
      tracks.forEach(spTrack => {
        if (!spTrack || spTrack.is_local) return;
        const track = adaptTrack(spTrack, artist.id, album.id);
        songsByArtist[artist.id].push(track);
      });
    });
  }));

  return { albumsByArtist, songsByArtist };
}

/**
 * Fetch 5 discovery cards using Last.fm similar-artist data to identify
 * candidates, then resolve them to real Spotify tracks.
 */
export async function fetchDiscoveryData(chosenArtists, token, count = 5, { popularityRange = null } = {}) {
  const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
  const chosenNames = new Set(chosenArtists.map(a => a.name.toLowerCase()));
  const chosenIds   = new Set(chosenArtists.map(a => a.id));

  // 1. Fetch Last.fm similar artists + MusicBrainz member/band relations in parallel
  const [similarArrays, relatedNameSets] = await Promise.all([
    Promise.all(chosenArtists.map(a => getSimilarArtists(a.name, apiKey).catch(() => []))),
    Promise.all(chosenArtists.map(a => getRelatedArtistNames(a.name).catch(() => new Set()))),
  ]);

  // Block list: chosen artists + their members / parent bands
  const blockedNames = new Set(chosenNames);
  for (const nameSet of relatedNameSets) {
    for (const name of nameSet) blockedNames.add(name);
  }

  // 2. Flatten, deduplicate by name, exclude blocked artists, sort by match score
  const seen = new Set();
  const pool = [];
  for (const list of similarArrays) {
    for (const entry of list) {
      const key = entry.name.toLowerCase();
      if (!seen.has(key) && !blockedNames.has(key)) {
        seen.add(key);
        pool.push(entry);
      }
    }
  }
  pool.sort((a, b) => parseFloat(b.match) - parseFloat(a.match));

  // 3. For each candidate: search Spotify for their profile, then get a top track
  const candidates = pool.slice(0, count * 5);
  const cards = await Promise.all(candidates.map(async (entry) => {
    try {
      const searchRes = await searchArtists(entry.name, token, 1);
      const sp = searchRes?.artists?.items?.[0];
      // Skip if Spotify resolved this to a chosen or blocked artist
      if (!sp || chosenIds.has(sp.id) || blockedNames.has(sp.name.toLowerCase())) return null;
      // Skip if outside the requested popularity tier
      if (popularityRange && (sp.popularity < popularityRange.min || sp.popularity > popularityRange.max)) return null;

      const trackRes = await getArtistTopTracks(sp.id, token);
      const tracks = trackRes?.tracks || [];
      if (!tracks.length) return null;

      const pick = tracks[Math.floor(Math.random() * Math.min(3, tracks.length))];
      const artist = adaptArtist(sp);
      const album  = adaptAlbum(pick.album, sp.id);
      const song   = adaptTrack(pick, sp.id, album.id);
      return {
        id:              `disc_${song.id}_${Math.random().toString(36).slice(2, 6)}`,
        type:            'discovery',
        song,
        artist,
        album,
        basedOnArtistId: sp.id,
      };
    } catch {
      return null;
    }
  }));

  // Deduplicate by resolved Spotify artist ID (multiple Last.fm names can map to the same artist)
  const seenIds = new Set();
  const valid = cards.filter(card => {
    if (!card) return false;
    if (seenIds.has(card.artist.id)) return false;
    seenIds.add(card.artist.id);
    return true;
  });

  return { deck: valid.slice(0, count), reserve: valid.slice(count) };
}
