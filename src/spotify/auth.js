import { CLIENT_ID, REDIRECT_URI, SCOPES } from './config.js';

const STORAGE_KEYS = {
  accessToken:  'tp_access_token',
  refreshToken: 'tp_refresh_token',
  expiresAt:    'tp_expires_at',
  userId:       'tp_user_id',
  displayName:  'tp_display_name',
  pkceVerifier: 'tp_pkce_verifier',
};

// ─── PKCE helpers ─────────────────────────────────────────────────────────────

function randomBytes(length) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return arr;
}

function base64urlEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateVerifier() {
  return base64urlEncode(randomBytes(32));
}

async function generateChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64urlEncode(digest);
}

// ─── Public auth API ──────────────────────────────────────────────────────────

export async function redirectToSpotify() {
  const verifier = generateVerifier();
  const challenge = await generateChallenge(verifier);

  sessionStorage.setItem(STORAGE_KEYS.pkceVerifier, verifier);

  const params = new URLSearchParams({
    client_id:             CLIENT_ID,
    response_type:         'code',
    redirect_uri:          REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge:        challenge,
    scope:                 SCOPES,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function handleOAuthCallback(code) {
  const verifier = sessionStorage.getItem(STORAGE_KEYS.pkceVerifier);
  if (!verifier) throw new Error('PKCE verifier missing — start auth flow again');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      grant_type:    'authorization_code',
      code,
      redirect_uri:  REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error_description || 'Token exchange failed');
  }

  const data = await res.json();
  storeTokens(data.access_token, data.refresh_token, data.expires_in);
  sessionStorage.removeItem(STORAGE_KEYS.pkceVerifier);

  // Clear code from URL without reloading
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  window.history.replaceState({}, '', url.toString());

  return data.access_token;
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
  if (!refreshToken) return null;

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     CLIENT_ID,
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    logout();
    return null;
  }

  const data = await res.json();
  storeTokens(
    data.access_token,
    data.refresh_token || refreshToken,
    data.expires_in
  );
  return data.access_token;
}

function storeTokens(accessToken, refreshToken, expiresIn) {
  const expiresAt = Date.now() + expiresIn * 1000 - 60_000; // 1 min early buffer
  localStorage.setItem(STORAGE_KEYS.accessToken,  accessToken);
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  localStorage.setItem(STORAGE_KEYS.expiresAt,    String(expiresAt));
}

export function storeUserInfo(userId, displayName) {
  localStorage.setItem(STORAGE_KEYS.userId,      userId);
  localStorage.setItem(STORAGE_KEYS.displayName, displayName);
}

export async function getValidToken() {
  const token     = localStorage.getItem(STORAGE_KEYS.accessToken);
  const expiresAt = Number(localStorage.getItem(STORAGE_KEYS.expiresAt));

  if (!token) return null;

  if (Date.now() < expiresAt) return token;

  // Token expired — try to refresh
  return refreshAccessToken();
}

export function getStoredUserInfo() {
  return {
    userId:      localStorage.getItem(STORAGE_KEYS.userId),
    displayName: localStorage.getItem(STORAGE_KEYS.displayName),
  };
}

export function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.accessToken);
}

export function logout() {
  Object.values(STORAGE_KEYS).forEach(k => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}
