import { getState, transitionTo, getFullDeck } from '../state.js';
import { createPack } from '../components/pack.js';
import { createCard } from '../components/card.js';
import { animatePackTear } from '../animations/pack-tear.js';

export function renderPackOpenScreen(container) {
  container.innerHTML = '';

  const { chosenArtists } = getState();
  const deck = getFullDeck();

  const screen = document.createElement('div');
  screen.className = 'screen pack-open-screen';

  const h2 = document.createElement('h2');
  h2.textContent = 'Your TrackPack is Ready';

  const hint = document.createElement('p');
  hint.className = 'pack-hint';
  hint.textContent = 'Click the pack to open it';

  // Artist chips (reminder of what's inside)
  const chipsSection = document.createElement('div');
  chipsSection.className = 'pack-selected-artists';
  chipsSection.innerHTML = `
    <p>Inside: tracks from</p>
    <div class="pack-artist-chips">
      ${chosenArtists.map(a => `<span class="pack-chip">${a.name}</span>`).join('')}
    </div>
  `;

  // The pack graphic
  const packEl = createPack(chosenArtists, deck.length);

  screen.appendChild(h2);
  screen.appendChild(packEl);
  screen.appendChild(hint);
  screen.appendChild(chipsSection);
  container.appendChild(screen);

  // Pre-render cards (hidden, positioned off-screen), attached to body for animation
  const cardEls = deck.map(card => {
    const el = createCard(card, () => {}); // dismiss no-op during animation
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
    document.body.appendChild(el);
    return el;
  });

  // Build a ghost grid to get target slot positions
  const ghostGrid = buildGhostGrid(deck.length);
  document.body.appendChild(ghostGrid);

  // Force layout so getBoundingClientRect works
  ghostGrid.getBoundingClientRect();

  const slotEls = Array.from(ghostGrid.querySelectorAll('.card-slot'));

  let opened = false;

  async function openPack() {
    if (opened) return;
    opened = true;
    hint.style.display = 'none';
    packEl.style.cursor = 'default';

    await animatePackTear(packEl, cardEls, ghostGrid, slotEls);

    // Clean up ghost grid and card animation state
    document.body.removeChild(ghostGrid);
    cardEls.forEach(el => {
      if (el.parentNode === document.body) document.body.removeChild(el);
    });

    transitionTo('card-grid');
  }

  packEl.addEventListener('click', openPack);
  packEl.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPack(); }
  });
  packEl.setAttribute('tabindex', '0');
  packEl.setAttribute('role', 'button');
  packEl.setAttribute('aria-label', 'Open your TrackPack');
}

// Build a hidden grid matching the real card-grid layout for measuring slot positions
function buildGhostGrid(cardCount) {
  const ghost = document.createElement('div');
  ghost.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: -1;
    visibility: hidden;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    padding-top: 120px;
  `;

  const grid = document.createElement('div');
  grid.className = 'card-grid';
  grid.style.flex = '1';

  for (let i = 0; i < cardCount; i++) {
    const slot = document.createElement('div');
    slot.className = 'card-slot';
    grid.appendChild(slot);
  }

  ghost.appendChild(grid);
  return ghost;
}
