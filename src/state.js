/**
 * App state machine.
 * Screens: 'login' → 'artist-select' → 'pack-open' → 'card-grid'
 */

const state = {
  screen: 'login',

  // Auth
  accessToken:  null,
  userId:       null,
  displayName:  null,

  // Playlist building
  activeFilters:    {},
  chosenArtists:    [],
  coreDeck:         [],
  coreReserve:      [],
  discoveryDeck:    [],
  discoveryReserve: [],
  dismissedIds:     new Set(),

  // Live card registry — tracks every currently-displayed card (for saving)
  activeCards: new Map(), // cardId → PlaylistCard
};

const listeners = [];

export function getState() {
  return {
    ...state,
    dismissedIds: new Set(state.dismissedIds),
    activeCards:  new Map(state.activeCards),
  };
}

export function subscribe(fn) {
  listeners.push(fn);
  return () => {
    const i = listeners.indexOf(fn);
    if (i >= 0) listeners.splice(i, 1);
  };
}

function notify(event, payload) {
  listeners.forEach(fn => fn(event, payload, getState()));
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function setAuth(accessToken, userId, displayName) {
  state.accessToken  = accessToken;
  state.userId       = userId;
  state.displayName  = displayName;
  notify('authChanged', { accessToken, userId, displayName });
}

export function clearAuth() {
  state.accessToken = null;
  state.userId      = null;
  state.displayName = null;
  notify('authChanged', null);
}

// ─── Screen transitions ───────────────────────────────────────────────────────

export function transitionTo(screen) {
  state.screen = screen;
  notify('screenChange', screen);
}

// ─── Artist + deck ────────────────────────────────────────────────────────────

export function setChosenArtists(artists) {
  state.chosenArtists = artists;
  notify('chosenArtists', artists);
}

export function setActiveFilters(filters) {
  state.activeFilters = { ...filters };
}

export function setDecks(coreDeck, coreReserve, discoveryDeck, discoveryReserve) {
  state.coreDeck         = coreDeck;
  state.coreReserve      = coreReserve;
  state.discoveryDeck    = discoveryDeck;
  state.discoveryReserve = discoveryReserve;
  state.dismissedIds     = new Set();

  // Initialize active card registry
  state.activeCards = new Map();
  [...coreDeck, ...discoveryDeck].forEach(card => state.activeCards.set(card.id, card));

  notify('decksReady', null);
}

// ─── Active card tracking ─────────────────────────────────────────────────────

export function registerCard(card) {
  state.activeCards.set(card.id, card);
}

export function unregisterCard(cardId) {
  state.activeCards.delete(cardId);
}

// ─── Dismiss + replace ────────────────────────────────────────────────────────

export function dismissCard(cardId, cardType, artistId) {
  state.dismissedIds.add(cardId);
  state.activeCards.delete(cardId);

  let replacement = null;
  if (cardType === 'core' && state.coreReserve.length > 0) {
    // Prefer a replacement from the same artist
    const sameIdx = artistId
      ? state.coreReserve.findIndex(c => c.artist?.id === artistId)
      : -1;
    if (sameIdx >= 0) {
      replacement = state.coreReserve.splice(sameIdx, 1)[0];
    } else {
      replacement = state.coreReserve.shift();
    }
  } else if (cardType === 'discovery' && state.discoveryReserve.length > 0) {
    replacement = state.discoveryReserve.shift();
  }

  if (replacement) state.activeCards.set(replacement.id, replacement);

  notify('cardDismissed', { cardId, replacement });
  return replacement;
}

// ─── Selectors ────────────────────────────────────────────────────────────────

export function getFullDeck() {
  return [...state.coreDeck, ...state.discoveryDeck];
}

export function getActiveTrackUris() {
  return [...state.activeCards.values()]
    .map(card => card.song?.uri)
    .filter(Boolean);
}
