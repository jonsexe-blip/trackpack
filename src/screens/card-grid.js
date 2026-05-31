import { getState, dismissCard, getActiveTrackUris, transitionTo } from '../state.js';

const FILTER_LABELS = {
  noSingles:     'No singles',
  noHoliday:     'No holiday',
  noLive:        'No live',
  noRemix:       'No remixes',
  noAcoustic:    'No acoustic',
  noInstrumental:'No instrumentals',
};

function buildFilterChips(filters) {
  const chips = [];
  for (const [key, label] of Object.entries(FILTER_LABELS)) {
    if (filters[key]) chips.push(label);
  }
  if (filters.yearMin && filters.yearMax) {
    chips.push(`${filters.yearMin}–${filters.yearMax}`);
  } else if (filters.yearMin) {
    chips.push(`From ${filters.yearMin}`);
  } else if (filters.yearMax) {
    chips.push(`Until ${filters.yearMax}`);
  }
  const disc = filters.discoveryCount ?? 5;
  if (disc !== 5) chips.push(`${disc} discovery`);
  if (filters.discoveryPopularity?.key) {
    const label = { mainstream: 'Mainstream', known: 'Known', hidden: 'Hidden' }[filters.discoveryPopularity.key];
    if (label) chips.push(`${label} artists`);
  }
  if (filters.discoveryArtistType) {
    chips.push(filters.discoveryArtistType === 'Person' ? 'Solo discovery' : 'Bands discovery');
  }
  return chips;
}
import { createCard } from '../components/card.js';
import { animateCardExit } from '../animations/card-exit.js';
import { animateCardEnter } from '../animations/card-enter.js';
import { createPlaylist, addTracksToPlaylist } from '../spotify/api.js';

function buildDiscoveryNotice(found, requested, filters) {
  const reasons = [];
  if (filters?.discoveryArtistType) {
    const label = filters.discoveryArtistType === 'Person' ? 'solo artists' : 'bands';
    reasons.push(`limited to ${label}`);
  }
  if (filters?.discoveryPopularity?.key) {
    const label = { mainstream: 'mainstream', known: 'mid-level', hidden: 'hidden' }[filters.discoveryPopularity.key];
    if (label) reasons.push(`${label} popularity only`);
  }
  const reasonText = reasons.length ? ` — filters active: ${reasons.join(', ')}` : ' — not enough similar artists found';
  return `
    <div class="discovery-notice">
      <span class="discovery-notice-icon">&#9432;</span>
      Found ${found} of ${requested} discovery tracks${reasonText}
    </div>
  `;
}

function generatePlaylistName(artists) {
  const names  = artists.map(a => a.name);
  const firsts = names.map(n => n.split(/\s+/)[0]);
  const A = firsts[0];
  const B = firsts[1] || firsts[0];
  const Z = firsts[firsts.length - 1];

  const picks = [
    `The ${A}–${Z} Cinematic Universe`,
    `${A} x ${B}: The Collab That Never Happened`,
    `What If ${A} and ${B} Were the Same Person`,
    `${A}'s ${B}-Coded Era`,
    `If ${names[0]} Wrote ${Z}'s Album`,
    `${A} Met ${B} at 2am and This Playlist Happened`,
    `The "${firsts.join(' × ')}" Problem`,
    `${names[0]} Said ${Z} Appreciation Mix`,
    `Extremely Normal ${A} × ${B} Playlist`,
    `${A} × ${Z} — No Notes`,
    `We Put ${names.join(' & ')} in a Blender`,
    `${A}'s ${B}-Approved Bops`,
    `The ${firsts.join(', ')} Situation`,
    `${A} × ${B}: Better Together (Don't Fact-Check This)`,
    `Un${A.toLowerCase()}able ft. ${firsts.slice(1).join(' & ') || B}`,
  ];

  return picks[Math.floor(Math.random() * picks.length)];
}

export function renderCardGridScreen(container) {
  container.innerHTML = '';

  const { coreDeck, discoveryDeck, chosenArtists, activeFilters } = getState();
  const fullDeck = [...coreDeck, ...discoveryDeck];

  const screen = document.createElement('div');
  screen.className = 'screen card-grid-screen';

  // ─── Header ───────────────────────────────────────────────────────────────

  const header = document.createElement('div');
  header.className = 'grid-header';

  const filterChips = buildFilterChips(activeFilters || {});
  const chipsHTML = filterChips.length
    ? `<div class="active-filters-row">${filterChips.map(c => `<span class="active-filter-chip">${c}</span>`).join('')}</div>`
    : '';

  const requestedDiscovery = activeFilters?.discoveryCount ?? 5;
  const foundDiscovery = discoveryDeck.length;
  const discoveryShortfall = requestedDiscovery > 0 && foundDiscovery < requestedDiscovery;
  const discoveryNoticeHTML = discoveryShortfall ? buildDiscoveryNotice(foundDiscovery, requestedDiscovery, activeFilters) : '';

  header.innerHTML = `
    <div class="grid-header-left">
      <h2>Your TrackPack</h2>
      <p>${fullDeck.length} tracks · from ${chosenArtists.map(a => a.name).join(', ')}</p>
      ${chipsHTML}
      ${discoveryNoticeHTML}
    </div>
    <div class="grid-legend">
      <div class="legend-item">
        <div class="legend-dot core"></div>
        <span>Artist tracks</span>
      </div>
      <div class="legend-item">
        <div class="legend-dot discovery"></div>
        <span>Discovery</span>
      </div>
    </div>
  `;

  // ─── Card grid ────────────────────────────────────────────────────────────

  const grid = document.createElement('div');
  grid.className = 'card-grid';

  const slotMap = new Map(); // cardId → slotEl

  const COLS = 5;

  fullDeck.forEach((playlistCard, index) => {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    slot.dataset.slotFor = playlistCard.id;

    const cardEl = createCard(playlistCard, handleDismiss);

    const col = index % COLS;
    const tilt = (col - (COLS - 1) / 2) * 2.8;
    cardEl.style.setProperty('--card-tilt', `${tilt}deg`);

    slot.appendChild(cardEl);
    slotMap.set(playlistCard.id, slot);
    grid.appendChild(slot);
  });

  // ─── Footer ───────────────────────────────────────────────────────────────

  const footer = document.createElement('div');
  footer.className = 'grid-footer';

  const footerLeft = document.createElement('div');
  footerLeft.className = 'grid-footer-left';

  const newPackBtn = document.createElement('button');
  newPackBtn.className = 'btn btn-secondary';
  newPackBtn.innerHTML = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.42"/>
    </svg>
    New Pack
  `;
  newPackBtn.addEventListener('click', () => transitionTo('artist-select'));

  const footerInfo = document.createElement('div');
  footerInfo.className = 'grid-footer-info';
  footerInfo.innerHTML = `<strong>${fullDeck.length}</strong> tracks ready`;

  footerLeft.appendChild(newPackBtn);
  footerLeft.appendChild(footerInfo);

  const saveBtnWrap = document.createElement('div');
  saveBtnWrap.className = 'save-btn-wrap';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-gold';
  saveBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
    Save to Spotify
  `;

  saveBtn.addEventListener('click', () => showSaveModal());

  saveBtnWrap.appendChild(saveBtn);
  footer.appendChild(footerLeft);
  footer.appendChild(saveBtnWrap);

  screen.appendChild(header);
  screen.appendChild(grid);
  screen.appendChild(footer);
  container.appendChild(screen);

  // ─── Animate cards in ─────────────────────────────────────────────────────

  const allCardEls = grid.querySelectorAll('.track-card');
  allCardEls.forEach((el, i) => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.opacity = '1';
      animateCardEnter(el);
    }, i * 55);
  });

  // ─── Dismiss handler ──────────────────────────────────────────────────────

  async function handleDismiss(cardId, cardType, artistId) {
    const slot = slotMap.get(cardId);
    if (!slot) return;

    const cardEl = slot.querySelector('.track-card');
    if (!cardEl) return;

    const dismissBtn = cardEl.querySelector('.card-dismiss');
    if (dismissBtn) dismissBtn.disabled = true;

    const replacement = dismissCard(cardId, cardType, artistId);

    await animateCardExit(cardEl);
    cardEl.remove();

    if (replacement) {
      const newCardEl = createCard(replacement, handleDismiss);
      const existingTilt = cardEl.style.getPropertyValue('--card-tilt');
      if (existingTilt) newCardEl.style.setProperty('--card-tilt', existingTilt);
      newCardEl.style.opacity = '0';
      slot.dataset.slotFor = replacement.id;
      slot.appendChild(newCardEl);
      slotMap.set(replacement.id, slot);
      slotMap.delete(cardId);
      newCardEl.style.opacity = '1';
      animateCardEnter(newCardEl);
    } else {
      slot.innerHTML = `
        <div class="card-placeholder">
          <span class="card-placeholder-icon">&#9835;</span>
        </div>
      `;
    }

    const remaining = grid.querySelectorAll('.track-card').length;
    footerInfo.innerHTML = `<strong>${remaining}</strong> tracks ready`;
  }

  // ─── Save modal ───────────────────────────────────────────────────────────

  function showSaveModal() {
    const defaultName = generatePlaylistName(chosenArtists);

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <h3>Save to Spotify</h3>
      <p class="modal-desc">Give your playlist a name and save it directly to your Spotify account.</p>
      <input
        class="modal-input"
        type="text"
        value="${defaultName}"
        maxlength="100"
        placeholder="Playlist name"
        id="playlist-name-input"
      />
      <div class="modal-actions">
        <button class="btn-cancel" id="modal-cancel">Cancel</button>
        <button class="btn btn-primary" id="modal-save">Save Playlist</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input     = modal.querySelector('#playlist-name-input');
    const cancelBtn = modal.querySelector('#modal-cancel');
    const saveBtn2  = modal.querySelector('#modal-save');

    input.focus();
    input.select();

    cancelBtn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

    saveBtn2.addEventListener('click', async () => {
      const name = input.value.trim() || defaultName;
      saveBtn2.disabled = true;
      cancelBtn.disabled = true;
      modal.querySelector('.modal-actions').innerHTML = `<p class="modal-saving">Saving to Spotify…</p>`;

      try {
        const { accessToken, userId } = getState();
        const uris = getActiveTrackUris();

        const playlist = await createPlaylist(
          userId,
          name,
          true,
          `Created with TrackPack — ${chosenArtists.map(a => a.name).join(', ')}`,
          accessToken
        );
        await addTracksToPlaylist(playlist.id, uris, accessToken);

        showSuccessModal(overlay, modal, name, playlist.external_urls?.spotify);
      } catch (err) {
        console.error('[TrackPack] Save failed:', err);
        modal.querySelector('.modal-saving').textContent = `Failed: ${err.message}`;
        const retryBtn = document.createElement('button');
        retryBtn.className = 'btn btn-primary';
        retryBtn.textContent = 'Try Again';
        retryBtn.addEventListener('click', () => { overlay.remove(); showSaveModal(); });
        modal.querySelector('.modal-saving').after(retryBtn);
      }
    });
  }

  function showSuccessModal(overlay, modal, name, spotifyUrl) {
    modal.innerHTML = `
      <div class="modal-success">
        <span class="modal-success-icon">🎉</span>
        <h3>Playlist Saved!</h3>
        <p>"${name}" has been added to your Spotify library.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          ${spotifyUrl ? `
            <a href="${spotifyUrl}" target="_blank" rel="noopener" class="btn-open-spotify">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 01-.276-1.216c3.809-.87 7.076-.496 9.712 1.115a.622.622 0 01.206.858zm1.223-2.722a.779.779 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.519.781.781 0 01.519-.972c3.632-1.102 8.147-.568 11.234 1.328a.779.779 0 01.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.866 13.115 1.337a.935.935 0 01-.955 1.61z"/>
              </svg>
              Open in Spotify
            </a>
          ` : ''}
          <button class="btn-cancel" id="success-close">Close</button>
        </div>
      </div>
    `;
    modal.querySelector('#success-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  }
}

