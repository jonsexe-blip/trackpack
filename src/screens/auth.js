import { redirectToSpotify } from '../spotify/auth.js';

export function renderLoginScreen(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen login-screen';

  screen.innerHTML = `
    <!-- Left: fanned card preview -->
    <div class="login-left" aria-hidden="true">
      <div class="login-card-fan">
        <div class="demo-card demo-card--1 demo-disc">
          <div class="demo-card-header"></div>
          <div class="demo-card-body"></div>
          <div class="demo-card-foot"></div>
        </div>
        <div class="demo-card demo-card--2 demo-core">
          <div class="demo-card-header"></div>
          <div class="demo-card-body"></div>
          <div class="demo-card-foot"></div>
        </div>
        <div class="demo-card demo-card--3 demo-core">
          <div class="demo-card-header"></div>
          <div class="demo-card-body"></div>
          <div class="demo-card-foot"></div>
          <div class="demo-card-gleam"></div>
        </div>
        <div class="demo-card demo-card--4 demo-disc">
          <div class="demo-card-header"></div>
          <div class="demo-card-body"></div>
          <div class="demo-card-foot"></div>
        </div>
        <div class="demo-card demo-card--5 demo-core">
          <div class="demo-card-header"></div>
          <div class="demo-card-body"></div>
          <div class="demo-card-foot"></div>
        </div>
      </div>
      <div class="login-left-fade"></div>
    </div>

    <!-- Right: login content -->
    <div class="login-right">
      <div class="login-brand">
        <svg class="login-brand-icon" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="31" fill="#1DB954"/>
          <rect x="18" y="22" width="28" height="5" rx="2.5" fill="white"/>
          <rect x="18" y="30" width="22" height="5" rx="2.5" fill="white"/>
          <rect x="18" y="38" width="16" height="5" rx="2.5" fill="white"/>
        </svg>
        <span class="login-brand-name">TrackPack</span>
      </div>

      <h1 class="login-headline">Build a playlist<br>the fun way</h1>
      <p class="login-tagline">Open a pack of 25 song cards from your favorite artists, swap out the ones you don't want, and save directly to Spotify.</p>

      <ol class="login-steps">
        <li class="login-step">
          <span class="step-num step-num--green">1</span>
          <div>
            <strong>Pick 2–4 artists</strong>
            <span>Search Spotify for artists you love</span>
          </div>
        </li>
        <li class="login-step">
          <span class="step-num step-num--gold">2</span>
          <div>
            <strong>Open your TrackPack</strong>
            <span>25 song cards fly out of a sealed pack</span>
          </div>
        </li>
        <li class="login-step">
          <span class="step-num step-num--green">3</span>
          <div>
            <strong>Curate &amp; save</strong>
            <span>Swap songs you don't want, then save to Spotify</span>
          </div>
        </li>
      </ol>

      <button class="btn-spotify" id="connect-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.276-1.216c3.809-.87 7.076-.496 9.712 1.115a.622.622 0 01.206.858zm1.223-2.722a.779.779 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.519-.972c3.632-1.102 8.147-.568 11.234 1.328a.779.779 0 01.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.866 13.115 1.337a.935.935 0 01-.955 1.61z"/>
        </svg>
        Connect with Spotify
      </button>
      <p class="login-privacy">We only request permission to create playlists. No data is stored on our servers.</p>
    </div>
  `;

  screen.querySelector('#connect-btn').addEventListener('click', () => {
    redirectToSpotify();
  });

  container.appendChild(screen);
}
