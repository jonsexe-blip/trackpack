// Albums and songs per main artist.
// artUrl uses picsum with a deterministic seed so images are stable.

function ms(min, sec) { return (min * 60 + sec) * 1000; }

export const ALBUMS = {
  kendrick: [
    {
      id: 'gkmc', artistId: 'kendrick', name: 'good kid, m.A.A.d city',
      artUrl: 'https://picsum.photos/seed/gkmc_album/200/200', year: 2012,
    },
    {
      id: 'tpab', artistId: 'kendrick', name: 'To Pimp a Butterfly',
      artUrl: 'https://picsum.photos/seed/tpab_album/200/200', year: 2015,
    },
    {
      id: 'damn', artistId: 'kendrick', name: 'DAMN.',
      artUrl: 'https://picsum.photos/seed/damn_album/200/200', year: 2017,
    },
  ],
  taylor: [
    {
      id: 'folklore', artistId: 'taylor', name: 'folklore',
      artUrl: 'https://picsum.photos/seed/folklore_album/200/200', year: 2020,
    },
    {
      id: 'midnights', artistId: 'taylor', name: 'Midnights',
      artUrl: 'https://picsum.photos/seed/midnights_album/200/200', year: 2022,
    },
    {
      id: 'eras', artistId: 'taylor', name: '1989 (Taylor\'s Version)',
      artUrl: 'https://picsum.photos/seed/1989tv_album/200/200', year: 2023,
    },
  ],
  radiohead: [
    {
      id: 'ok_computer', artistId: 'radiohead', name: 'OK Computer',
      artUrl: 'https://picsum.photos/seed/okcomputer_album/200/200', year: 1997,
    },
    {
      id: 'kid_a', artistId: 'radiohead', name: 'Kid A',
      artUrl: 'https://picsum.photos/seed/kida_album/200/200', year: 2000,
    },
    {
      id: 'in_rainbows', artistId: 'radiohead', name: 'In Rainbows',
      artUrl: 'https://picsum.photos/seed/inrainbows_album/200/200', year: 2007,
    },
  ],
  doja: [
    {
      id: 'hot_pink', artistId: 'doja', name: 'Hot Pink',
      artUrl: 'https://picsum.photos/seed/hotpink_album/200/200', year: 2019,
    },
    {
      id: 'planet_her', artistId: 'doja', name: 'Planet Her',
      artUrl: 'https://picsum.photos/seed/planether_album/200/200', year: 2021,
    },
    {
      id: 'scarlet', artistId: 'doja', name: 'Scarlet',
      artUrl: 'https://picsum.photos/seed/scarlet_album/200/200', year: 2023,
    },
  ],
};

export const SONGS = {
  kendrick: [
    // good kid, m.A.A.d city
    { id: 'k_01', artistId: 'kendrick', albumId: 'gkmc', name: 'Backseat Freestyle',       durationMs: ms(3,34) },
    { id: 'k_02', artistId: 'kendrick', albumId: 'gkmc', name: 'Swimming Pools (Drank)',    durationMs: ms(5,13) },
    { id: 'k_03', artistId: 'kendrick', albumId: 'gkmc', name: 'Poetic Justice',            durationMs: ms(4,59) },
    { id: 'k_04', artistId: 'kendrick', albumId: 'gkmc', name: 'Money Trees',               durationMs: ms(6,26) },
    { id: 'k_05', artistId: 'kendrick', albumId: 'gkmc', name: 'm.A.A.d city',              durationMs: ms(5,50) },
    { id: 'k_06', artistId: 'kendrick', albumId: 'gkmc', name: 'Sing About Me',             durationMs: ms(7,39) },
    { id: 'k_07', artistId: 'kendrick', albumId: 'gkmc', name: 'The Art of Peer Pressure',  durationMs: ms(5,30) },
    { id: 'k_08', artistId: 'kendrick', albumId: 'gkmc', name: 'Compton',                   durationMs: ms(4,26) },
    // To Pimp a Butterfly
    { id: 'k_09', artistId: 'kendrick', albumId: 'tpab', name: 'King Kunta',                durationMs: ms(3,54) },
    { id: 'k_10', artistId: 'kendrick', albumId: 'tpab', name: 'Alright',                   durationMs: ms(3,39) },
    { id: 'k_11', artistId: 'kendrick', albumId: 'tpab', name: 'These Walls',               durationMs: ms(5,2) },
    { id: 'k_12', artistId: 'kendrick', albumId: 'tpab', name: "i",                         durationMs: ms(5,36) },
    { id: 'k_13', artistId: 'kendrick', albumId: 'tpab', name: 'The Blacker the Berry',     durationMs: ms(5,29) },
    { id: 'k_14', artistId: 'kendrick', albumId: 'tpab', name: 'Complexion',                durationMs: ms(4,24) },
    { id: 'k_15', artistId: 'kendrick', albumId: 'tpab', name: 'How Much a Dollar Cost',    durationMs: ms(4,21) },
    { id: 'k_16', artistId: 'kendrick', albumId: 'tpab', name: 'Hood Politics',             durationMs: ms(4,52) },
    // DAMN.
    { id: 'k_17', artistId: 'kendrick', albumId: 'damn', name: 'HUMBLE.',                   durationMs: ms(2,57) },
    { id: 'k_18', artistId: 'kendrick', albumId: 'damn', name: 'DNA.',                      durationMs: ms(3,5) },
    { id: 'k_19', artistId: 'kendrick', albumId: 'damn', name: 'LOYALTY.',                  durationMs: ms(3,47) },
    { id: 'k_20', artistId: 'kendrick', albumId: 'damn', name: 'LOVE.',                     durationMs: ms(3,32) },
    { id: 'k_21', artistId: 'kendrick', albumId: 'damn', name: 'ELEMENT.',                  durationMs: ms(3,27) },
    { id: 'k_22', artistId: 'kendrick', albumId: 'damn', name: 'FEEL.',                     durationMs: ms(3,35) },
    { id: 'k_23', artistId: 'kendrick', albumId: 'damn', name: 'XXX.',                      durationMs: ms(4,14) },
    { id: 'k_24', artistId: 'kendrick', albumId: 'damn', name: 'FEAR.',                     durationMs: ms(7,42) },
  ],
  taylor: [
    // folklore
    { id: 't_01', artistId: 'taylor', albumId: 'folklore', name: 'the 1',                   durationMs: ms(3,30) },
    { id: 't_02', artistId: 'taylor', albumId: 'folklore', name: 'cardigan',                 durationMs: ms(3,59) },
    { id: 't_03', artistId: 'taylor', albumId: 'folklore', name: 'exile',                    durationMs: ms(4,45) },
    { id: 't_04', artistId: 'taylor', albumId: 'folklore', name: 'august',                   durationMs: ms(4,21) },
    { id: 't_05', artistId: 'taylor', albumId: 'folklore', name: 'illicit affairs',          durationMs: ms(3,9) },
    { id: 't_06', artistId: 'taylor', albumId: 'folklore', name: 'seven',                    durationMs: ms(3,28) },
    { id: 't_07', artistId: 'taylor', albumId: 'folklore', name: 'mirrorball',               durationMs: ms(3,52) },
    { id: 't_08', artistId: 'taylor', albumId: 'folklore', name: 'my tears ricochet',        durationMs: ms(4,15) },
    // Midnights
    { id: 't_09', artistId: 'taylor', albumId: 'midnights', name: 'Anti-Hero',              durationMs: ms(3,20) },
    { id: 't_10', artistId: 'taylor', albumId: 'midnights', name: 'Lavender Haze',          durationMs: ms(3,22) },
    { id: 't_11', artistId: 'taylor', albumId: 'midnights', name: 'Midnight Rain',          durationMs: ms(2,54) },
    { id: 't_12', artistId: 'taylor', albumId: 'midnights', name: 'Bejeweled',              durationMs: ms(3,13) },
    { id: 't_13', artistId: 'taylor', albumId: 'midnights', name: 'Snow on the Beach',      durationMs: ms(4,16) },
    { id: 't_14', artistId: 'taylor', albumId: 'midnights', name: 'Karma',                  durationMs: ms(3,24) },
    { id: 't_15', artistId: 'taylor', albumId: 'midnights', name: 'Mastermind',             durationMs: ms(3,11) },
    { id: 't_16', artistId: 'taylor', albumId: 'midnights', name: 'Question...?',           durationMs: ms(3,46) },
    // 1989 (Taylor's Version)
    { id: 't_17', artistId: 'taylor', albumId: 'eras', name: 'Shake It Off (TV)',           durationMs: ms(3,39) },
    { id: 't_18', artistId: 'taylor', albumId: 'eras', name: 'Blank Space (TV)',            durationMs: ms(3,51) },
    { id: 't_19', artistId: 'taylor', albumId: 'eras', name: 'Style (TV)',                  durationMs: ms(3,51) },
    { id: 't_20', artistId: 'taylor', albumId: 'eras', name: 'Bad Blood (TV)',              durationMs: ms(3,31) },
    { id: 't_21', artistId: 'taylor', albumId: 'eras', name: 'Wildest Dreams (TV)',         durationMs: ms(3,40) },
    { id: 't_22', artistId: 'taylor', albumId: 'eras', name: 'Out of the Woods (TV)',       durationMs: ms(3,55) },
    { id: 't_23', artistId: 'taylor', albumId: 'eras', name: 'Clean (TV)',                  durationMs: ms(4,31) },
    { id: 't_24', artistId: 'taylor', albumId: 'eras', name: 'How You Get the Girl (TV)',   durationMs: ms(4,10) },
  ],
  radiohead: [
    // OK Computer
    { id: 'r_01', artistId: 'radiohead', albumId: 'ok_computer', name: 'Airbag',            durationMs: ms(4,44) },
    { id: 'r_02', artistId: 'radiohead', albumId: 'ok_computer', name: 'Paranoid Android',  durationMs: ms(6,23) },
    { id: 'r_03', artistId: 'radiohead', albumId: 'ok_computer', name: 'Subterranean Homesick Alien', durationMs: ms(4,27) },
    { id: 'r_04', artistId: 'radiohead', albumId: 'ok_computer', name: 'Exit Music',        durationMs: ms(4,24) },
    { id: 'r_05', artistId: 'radiohead', albumId: 'ok_computer', name: 'Let Down',          durationMs: ms(4,59) },
    { id: 'r_06', artistId: 'radiohead', albumId: 'ok_computer', name: 'Karma Police',      durationMs: ms(4,21) },
    { id: 'r_07', artistId: 'radiohead', albumId: 'ok_computer', name: 'No Surprises',      durationMs: ms(3,48) },
    { id: 'r_08', artistId: 'radiohead', albumId: 'ok_computer', name: 'Climbing Up the Walls', durationMs: ms(4,45) },
    // Kid A
    { id: 'r_09', artistId: 'radiohead', albumId: 'kid_a', name: 'Everything in Its Right Place', durationMs: ms(4,11) },
    { id: 'r_10', artistId: 'radiohead', albumId: 'kid_a', name: 'Kid A',                   durationMs: ms(4,44) },
    { id: 'r_11', artistId: 'radiohead', albumId: 'kid_a', name: 'The National Anthem',     durationMs: ms(5,51) },
    { id: 'r_12', artistId: 'radiohead', albumId: 'kid_a', name: 'How to Disappear Completely', durationMs: ms(5,56) },
    { id: 'r_13', artistId: 'radiohead', albumId: 'kid_a', name: 'Idioteque',               durationMs: ms(5,9) },
    { id: 'r_14', artistId: 'radiohead', albumId: 'kid_a', name: 'Motion Picture Soundtrack', durationMs: ms(7,1) },
    { id: 'r_15', artistId: 'radiohead', albumId: 'kid_a', name: 'In Limbo',               durationMs: ms(3,31) },
    { id: 'r_16', artistId: 'radiohead', albumId: 'kid_a', name: 'Optimistic',             durationMs: ms(5,15) },
    // In Rainbows
    { id: 'r_17', artistId: 'radiohead', albumId: 'in_rainbows', name: '15 Step',          durationMs: ms(3,57) },
    { id: 'r_18', artistId: 'radiohead', albumId: 'in_rainbows', name: 'Bodysnatchers',    durationMs: ms(4,1) },
    { id: 'r_19', artistId: 'radiohead', albumId: 'in_rainbows', name: 'Nude',             durationMs: ms(4,15) },
    { id: 'r_20', artistId: 'radiohead', albumId: 'in_rainbows', name: 'Weird Fishes/Arpeggi', durationMs: ms(5,18) },
    { id: 'r_21', artistId: 'radiohead', albumId: 'in_rainbows', name: 'All I Need',       durationMs: ms(3,49) },
    { id: 'r_22', artistId: 'radiohead', albumId: 'in_rainbows', name: 'Faust Arp',        durationMs: ms(2,9) },
    { id: 'r_23', artistId: 'radiohead', albumId: 'in_rainbows', name: 'Reckoner',         durationMs: ms(4,50) },
    { id: 'r_24', artistId: 'radiohead', albumId: 'in_rainbows', name: 'House of Cards',   durationMs: ms(5,28) },
  ],
  doja: [
    // Hot Pink
    { id: 'd_01', artistId: 'doja', albumId: 'hot_pink', name: 'Say So',                   durationMs: ms(3,57) },
    { id: 'd_02', artistId: 'doja', albumId: 'hot_pink', name: 'Like That',                durationMs: ms(3,30) },
    { id: 'd_03', artistId: 'doja', albumId: 'hot_pink', name: 'Juicy',                    durationMs: ms(2,51) },
    { id: 'd_04', artistId: 'doja', albumId: 'hot_pink', name: 'Bottom Bitch',             durationMs: ms(3,27) },
    { id: 'd_05', artistId: 'doja', albumId: 'hot_pink', name: 'Cyber Sex',                durationMs: ms(3,49) },
    { id: 'd_06', artistId: 'doja', albumId: 'hot_pink', name: 'Streets',                  durationMs: ms(3,17) },
    { id: 'd_07', artistId: 'doja', albumId: 'hot_pink', name: 'Addiction',                durationMs: ms(3,6) },
    { id: 'd_08', artistId: 'doja', albumId: 'hot_pink', name: 'Rules',                    durationMs: ms(2,6) },
    // Planet Her
    { id: 'd_09', artistId: 'doja', albumId: 'planet_her', name: 'Woman',                  durationMs: ms(2,54) },
    { id: 'd_10', artistId: 'doja', albumId: 'planet_her', name: 'Kiss Me More',           durationMs: ms(3,38) },
    { id: 'd_11', artistId: 'doja', albumId: 'planet_her', name: 'Need to Know',           durationMs: ms(3,31) },
    { id: 'd_12', artistId: 'doja', albumId: 'planet_her', name: 'Get Into It (Yuh)',      durationMs: ms(2,52) },
    { id: 'd_13', artistId: 'doja', albumId: 'planet_her', name: 'I Don\'t Do Drugs',      durationMs: ms(3,26) },
    { id: 'd_14', artistId: 'doja', albumId: 'planet_her', name: 'Options',                durationMs: ms(3,19) },
    { id: 'd_15', artistId: 'doja', albumId: 'planet_her', name: 'Been Like This',         durationMs: ms(2,51) },
    { id: 'd_16', artistId: 'doja', albumId: 'planet_her', name: 'You Right',              durationMs: ms(3,46) },
    // Scarlet
    { id: 'd_17', artistId: 'doja', albumId: 'scarlet', name: 'Paint the Town Red',        durationMs: ms(3,39) },
    { id: 'd_18', artistId: 'doja', albumId: 'scarlet', name: 'Agora Hills',               durationMs: ms(3,35) },
    { id: 'd_19', artistId: 'doja', albumId: 'scarlet', name: 'Shutcho',                   durationMs: ms(2,37) },
    { id: 'd_20', artistId: 'doja', albumId: 'scarlet', name: 'Demons',                    durationMs: ms(3,6) },
    { id: 'd_21', artistId: 'doja', albumId: 'scarlet', name: 'Skull and Bones',           durationMs: ms(2,45) },
    { id: 'd_22', artistId: 'doja', albumId: 'scarlet', name: 'Often',                     durationMs: ms(3,12) },
    { id: 'd_23', artistId: 'doja', albumId: 'scarlet', name: 'Ouchies',                   durationMs: ms(2,57) },
    { id: 'd_24', artistId: 'doja', albumId: 'scarlet', name: 'Fuck the Girls',            durationMs: ms(3,3) },
  ],
};

export function getSongsForArtist(artistId) {
  return SONGS[artistId] || [];
}

export function getAlbumsForArtist(artistId) {
  return ALBUMS[artistId] || [];
}

export function getAlbumById(albumId) {
  for (const albums of Object.values(ALBUMS)) {
    const found = albums.find(a => a.id === albumId);
    if (found) return found;
  }
  return null;
}
