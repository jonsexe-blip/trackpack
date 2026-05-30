import { subscribe, getState, setAuth, transitionTo } from './state.js';
import { renderLoginScreen } from './screens/auth.js';
import { renderArtistSelectScreen } from './screens/artist-select.js';
import { renderPackOpenScreen } from './screens/pack-open.js';
import { renderCardGridScreen } from './screens/card-grid.js';
import {
  handleOAuthCallback,
  getValidToken,
  getStoredUserInfo,
  storeUserInfo,
  logout,
} from './spotify/auth.js';
import { getMe } from './spotify/api.js';

const screenContainer = document.getElementById('screen-container');
const authStatusEl    = document.getElementById('auth-status');

function renderAuthStatus(displayName) {
  if (!displayName) {
    authStatusEl.innerHTML = '';
    return;
  }
  authStatusEl.innerHTML = `
    <span class="auth-user">${displayName}</span>
    <button class="btn-logout" id="logout-btn">Log out</button>
  `;
  document.getElementById('logout-btn').addEventListener('click', () => {
    logout();
    setAuth(null, null, null);
    renderAuthStatus(null);
    transitionTo('login');
  });
}

function render(screen) {
  switch (screen) {
    case 'login':         renderLoginScreen(screenContainer);        break;
    case 'artist-select': renderArtistSelectScreen(screenContainer); break;
    case 'pack-open':     renderPackOpenScreen(screenContainer);     break;
    case 'card-grid':     renderCardGridScreen(screenContainer);     break;
  }
}

subscribe((event, payload) => {
  if (event === 'screenChange') render(payload);
  if (event === 'authChanged') {
    renderAuthStatus(payload?.displayName ?? null);
  }
});

async function boot() {
  // Handle OAuth redirect callback
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    try {
      await handleOAuthCallback(code);
    } catch (err) {
      console.error('[TrackPack] OAuth callback failed:', err);
      render('login');
      return;
    }
  }

  // Check for valid token
  const token = await getValidToken();
  if (!token) {
    render('login');
    return;
  }

  // Load or fetch user info
  let { userId, displayName } = getStoredUserInfo();
  if (!userId) {
    try {
      const me = await getMe(token);
      userId      = me.id;
      displayName = me.display_name || me.id;
      storeUserInfo(userId, displayName);
    } catch (err) {
      console.error('[TrackPack] Failed to load user info:', err);
      render('login');
      return;
    }
  }

  setAuth(token, userId, displayName);
  renderAuthStatus(displayName);
  render('artist-select');
}

boot();
