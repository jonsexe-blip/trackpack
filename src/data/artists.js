export const ARTISTS = [
  {
    id: 'kendrick',
    name: 'Kendrick Lamar',
    imageUrl: 'https://picsum.photos/seed/kendrick_artist/400/400',
    genres: ['Hip-Hop', 'West Coast Rap'],
    similarArtistIds: ['j_cole', 'schoolboy_q', 'sza', 'ab_soul', 'vince_staples'],
  },
  {
    id: 'taylor',
    name: 'Taylor Swift',
    imageUrl: 'https://picsum.photos/seed/taylor_artist/400/400',
    genres: ['Pop', 'Country Pop'],
    similarArtistIds: ['olivia_rodrigo', 'lorde', 'gracie_abrams', 'phoebe_bridgers', 'sabrina_carpenter'],
  },
  {
    id: 'radiohead',
    name: 'Radiohead',
    imageUrl: 'https://picsum.photos/seed/radiohead_artist/400/400',
    genres: ['Alternative Rock', 'Art Rock'],
    similarArtistIds: ['thom_yorke', 'portishead', 'massive_attack', 'bjork', 'sigur_ros'],
  },
  {
    id: 'doja',
    name: 'Doja Cat',
    imageUrl: 'https://picsum.photos/seed/doja_artist/400/400',
    genres: ['Pop', 'R&B', 'Hip-Hop'],
    similarArtistIds: ['sza', 'lizzo', 'cardi_b', 'nicki_minaj', 'rico_nasty'],
  },
];

export const SIMILAR_ARTISTS = [
  { id: 'j_cole',            name: 'J. Cole',           imageUrl: 'https://picsum.photos/seed/jcole_artist/400/400',     genres: ['Hip-Hop'] },
  { id: 'schoolboy_q',       name: 'ScHoolboy Q',       imageUrl: 'https://picsum.photos/seed/schoolboyq_artist/400/400', genres: ['Hip-Hop'] },
  { id: 'sza',               name: 'SZA',               imageUrl: 'https://picsum.photos/seed/sza_artist/400/400',        genres: ['R&B'] },
  { id: 'ab_soul',           name: 'Ab-Soul',           imageUrl: 'https://picsum.photos/seed/absoul_artist/400/400',     genres: ['Hip-Hop'] },
  { id: 'vince_staples',     name: 'Vince Staples',     imageUrl: 'https://picsum.photos/seed/vince_artist/400/400',      genres: ['Hip-Hop'] },
  { id: 'olivia_rodrigo',    name: 'Olivia Rodrigo',    imageUrl: 'https://picsum.photos/seed/olivia_artist/400/400',     genres: ['Pop'] },
  { id: 'lorde',             name: 'Lorde',             imageUrl: 'https://picsum.photos/seed/lorde_artist/400/400',      genres: ['Indie Pop'] },
  { id: 'gracie_abrams',     name: 'Gracie Abrams',     imageUrl: 'https://picsum.photos/seed/gracie_artist/400/400',     genres: ['Indie Pop'] },
  { id: 'phoebe_bridgers',   name: 'Phoebe Bridgers',   imageUrl: 'https://picsum.photos/seed/phoebe_artist/400/400',     genres: ['Indie Folk'] },
  { id: 'sabrina_carpenter', name: 'Sabrina Carpenter', imageUrl: 'https://picsum.photos/seed/sabrina_artist/400/400',    genres: ['Pop'] },
  { id: 'thom_yorke',        name: 'Thom Yorke',        imageUrl: 'https://picsum.photos/seed/thom_artist/400/400',       genres: ['Alternative'] },
  { id: 'portishead',        name: 'Portishead',        imageUrl: 'https://picsum.photos/seed/portishead_artist/400/400', genres: ['Trip-Hop'] },
  { id: 'massive_attack',    name: 'Massive Attack',    imageUrl: 'https://picsum.photos/seed/massive_artist/400/400',    genres: ['Trip-Hop'] },
  { id: 'bjork',             name: 'Björk',             imageUrl: 'https://picsum.photos/seed/bjork_artist/400/400',      genres: ['Art Pop'] },
  { id: 'sigur_ros',         name: 'Sigur Rós',         imageUrl: 'https://picsum.photos/seed/sigurros_artist/400/400',   genres: ['Post-Rock'] },
  { id: 'lizzo',             name: 'Lizzo',             imageUrl: 'https://picsum.photos/seed/lizzo_artist/400/400',      genres: ['R&B', 'Pop'] },
  { id: 'cardi_b',           name: 'Cardi B',           imageUrl: 'https://picsum.photos/seed/cardib_artist/400/400',     genres: ['Hip-Hop'] },
  { id: 'nicki_minaj',       name: 'Nicki Minaj',       imageUrl: 'https://picsum.photos/seed/nicki_artist/400/400',      genres: ['Hip-Hop'] },
  { id: 'rico_nasty',        name: 'Rico Nasty',        imageUrl: 'https://picsum.photos/seed/rico_artist/400/400',       genres: ['Hip-Hop'] },
];

export function getArtistById(id) {
  return ARTISTS.find(a => a.id === id) || SIMILAR_ARTISTS.find(a => a.id === id) || null;
}
