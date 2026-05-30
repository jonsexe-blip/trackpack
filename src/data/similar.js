// Discovery songs from similar artists.
// Each entry ties a similar artist to a song and album so the card has everything it needs.

function ms(min, sec) { return (min * 60 + sec) * 1000; }

export const DISCOVERY_SONGS = [
  // --- Kendrick-adjacent ---
  {
    artist: { id: 'j_cole', name: 'J. Cole', imageUrl: 'https://picsum.photos/seed/jcole_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'kod_album', name: 'KOD', artUrl: 'https://picsum.photos/seed/kod_album/200/200', year: 2018 },
    song:   { id: 'sim_01', name: 'MIDDLE CHILD', durationMs: ms(3,42) },
    basedOnArtistIds: ['kendrick'],
  },
  {
    artist: { id: 'j_cole', name: 'J. Cole', imageUrl: 'https://picsum.photos/seed/jcole_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'fhd_album', name: '2014 Forest Hills Drive', artUrl: 'https://picsum.photos/seed/fhd_album/200/200', year: 2014 },
    song:   { id: 'sim_02', name: 'Love Yourz', durationMs: ms(3,44) },
    basedOnArtistIds: ['kendrick'],
  },
  {
    artist: { id: 'schoolboy_q', name: 'ScHoolboy Q', imageUrl: 'https://picsum.photos/seed/schoolboyq_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'oxymoron_album', name: 'Oxymoron', artUrl: 'https://picsum.photos/seed/oxymoron_album/200/200', year: 2014 },
    song:   { id: 'sim_03', name: 'Studio', durationMs: ms(4,8) },
    basedOnArtistIds: ['kendrick'],
  },
  {
    artist: { id: 'vince_staples', name: 'Vince Staples', imageUrl: 'https://picsum.photos/seed/vince_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'bigfish_album', name: 'Big Fish Theory', artUrl: 'https://picsum.photos/seed/bigfish_album/200/200', year: 2017 },
    song:   { id: 'sim_04', name: 'Big Fish', durationMs: ms(2,38) },
    basedOnArtistIds: ['kendrick'],
  },
  {
    artist: { id: 'ab_soul', name: 'Ab-Soul', imageUrl: 'https://picsum.photos/seed/absoul_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'ces_album', name: 'Control System', artUrl: 'https://picsum.photos/seed/ces_album/200/200', year: 2012 },
    song:   { id: 'sim_05', name: 'Terrorist Threats', durationMs: ms(5,35) },
    basedOnArtistIds: ['kendrick'],
  },
  // --- Taylor-adjacent ---
  {
    artist: { id: 'olivia_rodrigo', name: 'Olivia Rodrigo', imageUrl: 'https://picsum.photos/seed/olivia_artist/400/400', genres: ['Pop'] },
    album:  { id: 'sour_album', name: 'SOUR', artUrl: 'https://picsum.photos/seed/sour_album/200/200', year: 2021 },
    song:   { id: 'sim_06', name: 'drivers license', durationMs: ms(4,2) },
    basedOnArtistIds: ['taylor'],
  },
  {
    artist: { id: 'olivia_rodrigo', name: 'Olivia Rodrigo', imageUrl: 'https://picsum.photos/seed/olivia_artist/400/400', genres: ['Pop'] },
    album:  { id: 'guts_album', name: 'GUTS', artUrl: 'https://picsum.photos/seed/guts_album/200/200', year: 2023 },
    song:   { id: 'sim_07', name: 'vampire', durationMs: ms(3,39) },
    basedOnArtistIds: ['taylor'],
  },
  {
    artist: { id: 'lorde', name: 'Lorde', imageUrl: 'https://picsum.photos/seed/lorde_artist/400/400', genres: ['Indie Pop'] },
    album:  { id: 'melodrama_album', name: 'Melodrama', artUrl: 'https://picsum.photos/seed/melodrama_album/200/200', year: 2017 },
    song:   { id: 'sim_08', name: 'Green Light', durationMs: ms(3,54) },
    basedOnArtistIds: ['taylor'],
  },
  {
    artist: { id: 'phoebe_bridgers', name: 'Phoebe Bridgers', imageUrl: 'https://picsum.photos/seed/phoebe_artist/400/400', genres: ['Indie Folk'] },
    album:  { id: 'punisher_album', name: 'Punisher', artUrl: 'https://picsum.photos/seed/punisher_album/200/200', year: 2020 },
    song:   { id: 'sim_09', name: 'Savior Complex', durationMs: ms(4,8) },
    basedOnArtistIds: ['taylor'],
  },
  {
    artist: { id: 'sabrina_carpenter', name: 'Sabrina Carpenter', imageUrl: 'https://picsum.photos/seed/sabrina_artist/400/400', genres: ['Pop'] },
    album:  { id: 'espresso_album', name: 'Short n\' Sweet', artUrl: 'https://picsum.photos/seed/snsweet_album/200/200', year: 2024 },
    song:   { id: 'sim_10', name: 'Espresso', durationMs: ms(2,55) },
    basedOnArtistIds: ['taylor'],
  },
  // --- Radiohead-adjacent ---
  {
    artist: { id: 'thom_yorke', name: 'Thom Yorke', imageUrl: 'https://picsum.photos/seed/thom_artist/400/400', genres: ['Alternative'] },
    album:  { id: 'eraser_album', name: 'The Eraser', artUrl: 'https://picsum.photos/seed/eraser_album/200/200', year: 2006 },
    song:   { id: 'sim_11', name: 'Analyse', durationMs: ms(4,19) },
    basedOnArtistIds: ['radiohead'],
  },
  {
    artist: { id: 'portishead', name: 'Portishead', imageUrl: 'https://picsum.photos/seed/portishead_artist/400/400', genres: ['Trip-Hop'] },
    album:  { id: 'dummy_album', name: 'Dummy', artUrl: 'https://picsum.photos/seed/dummy_album/200/200', year: 1994 },
    song:   { id: 'sim_12', name: 'Glory Box', durationMs: ms(5,6) },
    basedOnArtistIds: ['radiohead'],
  },
  {
    artist: { id: 'massive_attack', name: 'Massive Attack', imageUrl: 'https://picsum.photos/seed/massive_artist/400/400', genres: ['Trip-Hop'] },
    album:  { id: 'mezzanine_album', name: 'Mezzanine', artUrl: 'https://picsum.photos/seed/mezzanine_album/200/200', year: 1998 },
    song:   { id: 'sim_13', name: 'Teardrop', durationMs: ms(5,29) },
    basedOnArtistIds: ['radiohead'],
  },
  {
    artist: { id: 'bjork', name: 'Björk', imageUrl: 'https://picsum.photos/seed/bjork_artist/400/400', genres: ['Art Pop'] },
    album:  { id: 'homogenic_album', name: 'Homogenic', artUrl: 'https://picsum.photos/seed/homogenic_album/200/200', year: 1997 },
    song:   { id: 'sim_14', name: 'Jóga', durationMs: ms(5,4) },
    basedOnArtistIds: ['radiohead'],
  },
  {
    artist: { id: 'sigur_ros', name: 'Sigur Rós', imageUrl: 'https://picsum.photos/seed/sigurros_artist/400/400', genres: ['Post-Rock'] },
    album:  { id: 'agaetis_album', name: 'Ágætis byrjun', artUrl: 'https://picsum.photos/seed/agaetis_album/200/200', year: 1999 },
    song:   { id: 'sim_15', name: 'Svefn-g-englar', durationMs: ms(10,4) },
    basedOnArtistIds: ['radiohead'],
  },
  // --- Doja-adjacent ---
  {
    artist: { id: 'sza', name: 'SZA', imageUrl: 'https://picsum.photos/seed/sza_artist/400/400', genres: ['R&B'] },
    album:  { id: 'sos_album', name: 'SOS', artUrl: 'https://picsum.photos/seed/sos_album/200/200', year: 2022 },
    song:   { id: 'sim_16', name: 'Kill Bill', durationMs: ms(2,33) },
    basedOnArtistIds: ['doja', 'kendrick'],
  },
  {
    artist: { id: 'lizzo', name: 'Lizzo', imageUrl: 'https://picsum.photos/seed/lizzo_artist/400/400', genres: ['R&B', 'Pop'] },
    album:  { id: 'special_album', name: 'Special', artUrl: 'https://picsum.photos/seed/special_album/200/200', year: 2022 },
    song:   { id: 'sim_17', name: 'About Damn Time', durationMs: ms(3,13) },
    basedOnArtistIds: ['doja'],
  },
  {
    artist: { id: 'cardi_b', name: 'Cardi B', imageUrl: 'https://picsum.photos/seed/cardib_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'invasion_album', name: 'Invasion of Privacy', artUrl: 'https://picsum.photos/seed/invasion_album/200/200', year: 2018 },
    song:   { id: 'sim_18', name: 'Bodak Yellow', durationMs: ms(3,45) },
    basedOnArtistIds: ['doja'],
  },
  {
    artist: { id: 'nicki_minaj', name: 'Nicki Minaj', imageUrl: 'https://picsum.photos/seed/nicki_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'pinkprint_album', name: 'The Pinkprint', artUrl: 'https://picsum.photos/seed/pinkprint_album/200/200', year: 2014 },
    song:   { id: 'sim_19', name: 'Anaconda', durationMs: ms(4,12) },
    basedOnArtistIds: ['doja'],
  },
  {
    artist: { id: 'rico_nasty', name: 'Rico Nasty', imageUrl: 'https://picsum.photos/seed/rico_artist/400/400', genres: ['Hip-Hop'] },
    album:  { id: 'nightmare_album', name: 'Nightmare Vacation', artUrl: 'https://picsum.photos/seed/nightmare_album/200/200', year: 2020 },
    song:   { id: 'sim_20', name: 'IPHONE', durationMs: ms(2,17) },
    basedOnArtistIds: ['doja'],
  },
];
