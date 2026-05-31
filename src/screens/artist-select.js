import { createSearchInput } from '../components/search-input.js';
import { setChosenArtists, transitionTo, setDecks, setActiveFilters, getState } from '../state.js';
import { generateCoreDeck } from '../logic/generator.js';
import { searchArtists } from '../spotify/api.js';
import { adaptArtist } from '../spotify/adapter.js';
import { fetchArtistData, fetchDiscoveryData } from '../spotify/fetcher.js';

const MIN_ARTISTS = 2;
const MAX_ARTISTS = 4;

// Always filtered — never shown to the user as a toggle
const ALWAYS_EXCLUDE = /\baudio commentary\b|\bcommentary track\b|\bcommentary\b|\binterview\b|\bskit\b|\bspoken word\b|\bnarration\b|\bdialogue\b|\bmonologue\b/i;

const FILTERS = [
  { key: 'noSingles',     label: 'No singles',       pattern: null },
  { key: 'noHoliday',     label: 'No holiday',       pattern: /\bchristmas\b|\bxmas\b|\bholiday\b|\bnoel\b|\bjingle bells\b|\bsanta claus\b|\brudolph\b|\bsilent night\b|\bwinter wonderland\b|\bdeck the halls\b|\bhanukkah\b|\bkwanzaa\b|\bsleigh ride\b|\bchristmas eve\b|\bchristmas day\b|\bholiday season\b|\bseason's greetings\b/i },
  { key: 'noLive',        label: 'No live',          pattern: /\blive\b|\blive at\b|\blive from\b|\blive in\b|\(live/i },
  { key: 'noRemix',       label: 'No remixes',       pattern: /\bremix\b|\brmx\b|\bremixed\b/i },
  { key: 'noAcoustic',    label: 'No acoustic',      pattern: /\bacoustic\b|\bunplugged\b/i },
  { key: 'noInstrumental',label: 'No instrumentals', pattern: /\binstrumental\b/i },
];

function applyFilters(songsByArtist, albumsByArtist, activeFilters) {
  const activePatterns = FILTERS
    .filter(f => f.pattern && activeFilters[f.key])
    .map(f => f.pattern);

  const yearMin = activeFilters.yearMin ? parseInt(activeFilters.yearMin, 10) : null;
  const yearMax = activeFilters.yearMax ? parseInt(activeFilters.yearMax, 10) : null;
  const filterByYear = yearMin !== null || yearMax !== null;

  // Build albumId → year and albumId → name lookups once if needed
  let albumYearMap = null;
  let albumNameMap = null;
  if (filterByYear || activePatterns.length) {
    albumYearMap = new Map();
    albumNameMap = new Map();
    Object.values(albumsByArtist).forEach(albums =>
      albums.forEach(a => {
        albumYearMap.set(a.id, a.year);
        albumNameMap.set(a.id, a.name);
      })
    );
  }

  if (!activePatterns.length && !filterByYear) {
    // Still apply the always-on exclusion even with no user filters active
    const result = {};
    for (const [artistId, songs] of Object.entries(songsByArtist)) {
      result[artistId] = songs.filter(s => !ALWAYS_EXCLUDE.test(s.name));
    }
    return result;
  }

  const result = {};
  for (const [artistId, songs] of Object.entries(songsByArtist)) {
    result[artistId] = songs.filter(song => {
      if (ALWAYS_EXCLUDE.test(song.name)) return false;
      const albumName = albumNameMap?.get(song.albumId) || '';
      if (activePatterns.some(p => p.test(song.name) || p.test(albumName))) return false;
      if (filterByYear) {
        const year = albumYearMap.get(song.albumId);
        // year === 0 means a true remaster with no detectable original date — let it through
        if (year > 0) {
          if (yearMin !== null && year < yearMin) return false;
          if (yearMax !== null && year > yearMax) return false;
        }
      }
      return true;
    });
  }
  return result;
}

export function renderArtistSelectScreen(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen artist-select-screen';

  const h2 = document.createElement('h2');
  h2.textContent = 'Choose Your Artists';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = `Search for ${MIN_ARTISTS}–${MAX_ARTISTS} artists to build your TrackPack.`;

  const counter = document.createElement('div');
  counter.className = 'selection-counter';
  counter.innerHTML = `<span class="counter-dot"></span><span class="counter-text">0 / ${MAX_ARTISTS} selected — pick at least ${MIN_ARTISTS}</span>`;

  const selected = new Map();
  const activeFilters = { discoveryCount: 5 };

  function updateCounter() {
    const n = selected.size;
    const ready = n >= MIN_ARTISTS;
    counter.classList.toggle('ready', ready);
    counter.querySelector('.counter-text').textContent = ready
      ? `${n} selected — ready to open!`
      : `${n} / ${MAX_ARTISTS} selected — pick at least ${MIN_ARTISTS}`;
    generateBtn.disabled = !ready;
    updateChips();
  }

  // ─── Filter chips ──────────────────────────────────────────────────────────

  const filterRow = document.createElement('div');
  filterRow.className = 'filter-row';

  function clearWarning() {
    screen.querySelector('.filter-warning')?.remove();
  }

  FILTERS.forEach(f => {
    const chip = document.createElement('button');
    chip.className = 'filter-chip';
    chip.textContent = f.label;
    chip.dataset.key = f.key;
    chip.addEventListener('click', () => {
      activeFilters[f.key] = !activeFilters[f.key];
      chip.classList.toggle('active', !!activeFilters[f.key]);
      clearWarning();
    });
    filterRow.appendChild(chip);
  });

  // Year range inputs
  const yearRange = document.createElement('div');
  yearRange.className = 'year-range';

  const yearRangeLabel = document.createElement('span');
  yearRangeLabel.className = 'year-range-label';
  yearRangeLabel.textContent = 'Year';

  const yearFromInput = document.createElement('input');
  yearFromInput.type = 'number';
  yearFromInput.className = 'year-input';
  yearFromInput.placeholder = 'From';
  yearFromInput.min = 1950;
  yearFromInput.max = new Date().getFullYear();

  const yearSep = document.createElement('span');
  yearSep.className = 'year-separator';
  yearSep.textContent = '–';

  const yearToInput = document.createElement('input');
  yearToInput.type = 'number';
  yearToInput.className = 'year-input';
  yearToInput.placeholder = 'To';
  yearToInput.min = 1950;
  yearToInput.max = new Date().getFullYear();

  yearFromInput.addEventListener('input', () => {
    activeFilters.yearMin = yearFromInput.value || null;
    yearFromInput.classList.toggle('active', !!yearFromInput.value);
    clearWarning();
  });
  yearToInput.addEventListener('input', () => {
    activeFilters.yearMax = yearToInput.value || null;
    yearToInput.classList.toggle('active', !!yearToInput.value);
    clearWarning();
  });

  yearRange.appendChild(yearRangeLabel);
  yearRange.appendChild(yearFromInput);
  yearRange.appendChild(yearSep);
  yearRange.appendChild(yearToInput);
  filterRow.appendChild(yearRange);

  // Discovery count slider
  const discoveryRow = document.createElement('div');
  discoveryRow.className = 'discovery-row';

  const discoveryLabel = document.createElement('span');
  discoveryLabel.className = 'filter-section-label';
  discoveryLabel.textContent = 'Discovery Tracks';

  const discoverySliderWrap = document.createElement('div');
  discoverySliderWrap.className = 'discovery-slider-wrap';

  const discoverySlider = document.createElement('input');
  discoverySlider.type = 'range';
  discoverySlider.className = 'discovery-slider';
  discoverySlider.min = 0;
  discoverySlider.max = 15;
  discoverySlider.value = 5;

  const discoveryValue = document.createElement('span');
  discoveryValue.className = 'discovery-value';
  discoveryValue.textContent = '5';

  function updateDiscoverySlider() {
    const v = parseInt(discoverySlider.value, 10);
    activeFilters.discoveryCount = v;
    discoveryValue.textContent = v;
    const pct = (v / 15) * 100;
    discoverySlider.style.setProperty('--pct', `${pct}%`);
  }
  updateDiscoverySlider();

  discoverySlider.addEventListener('input', updateDiscoverySlider);

  discoverySliderWrap.appendChild(discoverySlider);
  discoverySliderWrap.appendChild(discoveryValue);
  discoveryRow.appendChild(discoveryLabel);
  discoveryRow.appendChild(discoverySliderWrap);

  // Popularity tier toggle
  const POPULARITY_TIERS = [
    { key: 'mainstream', label: 'Mainstream', min: 75, max: 100 },
    { key: 'known',      label: 'Known',      min: 50, max: 75  },
    { key: 'hidden',     label: 'Hidden',     min: 0,  max: 50  },
  ];

  const popularityRow = document.createElement('div');
  popularityRow.className = 'popularity-row';

  const popularityLabel = document.createElement('span');
  popularityLabel.className = 'filter-section-label';
  popularityLabel.textContent = 'Artist Fame';
  popularityRow.appendChild(popularityLabel);

  const tierGroup = document.createElement('div');
  tierGroup.className = 'tier-group';

  POPULARITY_TIERS.forEach(tier => {
    const btn = document.createElement('button');
    btn.className = 'tier-btn';
    btn.textContent = tier.label;
    btn.dataset.key = tier.key;
    btn.addEventListener('click', () => {
      const already = activeFilters.discoveryPopularity?.key === tier.key;
      activeFilters.discoveryPopularity = already ? null : { key: tier.key, min: tier.min, max: tier.max };
      tierGroup.querySelectorAll('.tier-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.key === tier.key && !already)
      );
    });
    tierGroup.appendChild(btn);
  });

  popularityRow.appendChild(tierGroup);
  discoveryRow.appendChild(popularityRow);

  // Artist type toggle
  const artistTypeRow = document.createElement('div');
  artistTypeRow.className = 'popularity-row';

  const artistTypeLabel = document.createElement('span');
  artistTypeLabel.className = 'filter-section-label';
  artistTypeLabel.textContent = 'Artist Type';
  artistTypeRow.appendChild(artistTypeLabel);

  const typeGroup = document.createElement('div');
  typeGroup.className = 'tier-group';

  [{ key: 'Person', label: 'Solo' }, { key: 'Group', label: 'Bands' }].forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'tier-btn';
    btn.textContent = opt.label;
    btn.dataset.key = opt.key;
    btn.addEventListener('click', () => {
      const already = activeFilters.discoveryArtistType === opt.key;
      activeFilters.discoveryArtistType = already ? null : opt.key;
      typeGroup.querySelectorAll('.tier-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.key === opt.key && !already)
      );
    });
    typeGroup.appendChild(btn);
  });

  artistTypeRow.appendChild(typeGroup);
  discoveryRow.appendChild(artistTypeRow);

  filterRow.appendChild(discoveryRow);

  // ─── Search input ──────────────────────────────────────────────────────────

  let searchTimeout = null;

  const searchWrap = createSearchInput((query) => {
    clearTimeout(searchTimeout);
    if (!query.trim()) {
      grid.innerHTML = '<div class="search-loading"><span class="search-loading-dot"></span><span class="search-loading-dot"></span><span class="search-loading-dot"></span></div>';
      return;
    }
    searchTimeout = setTimeout(() => runSearch(query.trim()), 300);
  });

  async function runSearch(query) {
    grid.innerHTML = '<div class="search-loading"><span class="search-loading-dot"></span><span class="search-loading-dot"></span><span class="search-loading-dot"></span></div>';
    try {
      const token = getState().accessToken;
      const res = await searchArtists(query, token, 12);
      const artists = (res?.artists?.items || []).filter(Boolean).map(adaptArtist);
      renderCards(artists);
    } catch (err) {
      grid.innerHTML = `<div class="search-error">Search failed — ${err.message}</div>`;
    }
  }

  // ─── Artist grid ───────────────────────────────────────────────────────────

  const grid = document.createElement('div');
  grid.className = 'artist-grid';
  grid.innerHTML = `
    <div class="search-empty">
      <div class="search-empty-icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </div>
      <p class="search-empty-title">Search for an artist</p>
      <p class="search-empty-hint">Try: The Beatles, Taylor Swift, Kendrick Lamar…</p>
    </div>
  `;

  function renderCards(artists) {
    grid.innerHTML = '';
    if (!artists.length) {
      grid.innerHTML = `
        <div class="search-empty">
          <div class="search-empty-icon search-empty-icon--dim">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <p class="search-empty-title">No artists found</p>
          <p class="search-empty-hint">Try a different spelling or search term</p>
        </div>
      `;
      return;
    }

    artists.forEach(artist => {
      const card = document.createElement('div');
      card.className = 'artist-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', selected.has(artist.id) ? 'true' : 'false');
      card.dataset.artistId = artist.id;

      if (selected.has(artist.id)) card.classList.add('selected');
      if (!selected.has(artist.id) && selected.size >= MAX_ARTISTS) card.classList.add('disabled');

      const genreText = artist.genres[0] || '';
      card.innerHTML = `
        <img src="${artist.imageUrl}" alt="${artist.name}" loading="lazy" />
        <div class="artist-card-info">
          <div class="artist-card-name">${artist.name}</div>
          ${genreText ? `<div class="artist-card-genre">${genreText}</div>` : ''}
        </div>
        ${selected.has(artist.id) ? `<div class="selected-badge" aria-hidden="true">&#10003;</div>` : ''}
      `;

      const toggle = () => {
        if (selected.has(artist.id)) {
          selected.delete(artist.id);
        } else if (selected.size < MAX_ARTISTS) {
          selected.set(artist.id, artist);
        }
        updateCounter();
        grid.querySelectorAll('.artist-card').forEach(el => {
          const id = el.dataset.artistId;
          if (!id) return;
          const isSel = selected.has(id);
          el.classList.toggle('selected', isSel);
          el.classList.toggle('disabled', !isSel && selected.size >= MAX_ARTISTS);
          el.setAttribute('aria-pressed', isSel ? 'true' : 'false');
          const badge = el.querySelector('.selected-badge');
          if (isSel && !badge) {
            const b = document.createElement('div');
            b.className = 'selected-badge';
            b.setAttribute('aria-hidden', 'true');
            b.innerHTML = '&#10003;';
            el.appendChild(b);
          } else if (!isSel && badge) {
            badge.remove();
          }
        });
      };

      card.addEventListener('click', toggle);
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });

      grid.appendChild(card);
    });
  }

  // ─── Selected artists chips ────────────────────────────────────────────────

  const chipsWrap = document.createElement('div');
  chipsWrap.className = 'selected-artists-preview';

  function updateChips() {
    chipsWrap.innerHTML = '';
    selected.forEach(artist => {
      const chip = document.createElement('span');
      chip.className = 'selected-chip';
      chip.innerHTML = `
        <img class="selected-chip-img" src="${artist.imageUrl}" alt="" />
        ${artist.name}
      `;
      chipsWrap.appendChild(chip);
    });
  }

  // ─── Open Pack button ──────────────────────────────────────────────────────

  const generateBtn = document.createElement('button');
  generateBtn.className = 'btn btn-primary';
  generateBtn.textContent = 'Open Pack';
  generateBtn.disabled = true;

  generateBtn.addEventListener('click', async () => {
    const artists = [...selected.values()];
    setChosenArtists(artists);

    generateBtn.disabled = true;
    generateBtn.textContent = 'Loading…';

    const overlay = document.createElement('div');
    overlay.className = 'pack-loading-overlay';
    overlay.innerHTML = `
      <div class="pack-loading-spinner"></div>
      <p class="pack-loading-text">Building your TrackPack…</p>
    `;
    document.body.appendChild(overlay);

    try {
      const token = getState().accessToken;
      const discoveryCount = activeFilters.discoveryCount ?? 5;

      const { albumsByArtist, songsByArtist: rawSongs } = await fetchArtistData(artists, token, {
        noSingles: !!activeFilters.noSingles,
      });
      const songsByArtist = applyFilters(rawSongs, albumsByArtist, activeFilters);

      // Check for artists that ended up with zero songs after filtering
      const emptyArtists = artists.filter(a => !(songsByArtist[a.id]?.length));
      if (emptyArtists.length > 0) {
        overlay.remove();
        showFilterWarning(emptyArtists, activeFilters);
        generateBtn.disabled = false;
        generateBtn.textContent = 'Open Pack';
        return;
      }

      const { deck: coreDeck, reserve: coreReserve } = generateCoreDeck(artists, songsByArtist, albumsByArtist);
      let discoveryDeck = [], discoveryReserve = [];
      if (discoveryCount > 0) {
        ({ deck: discoveryDeck, reserve: discoveryReserve } = await fetchDiscoveryData(artists, token, discoveryCount, {
          popularityRange:   activeFilters.discoveryPopularity  || null,
          artistTypeFilter:  activeFilters.discoveryArtistType  || null,
        }));
      }

      setDecks(coreDeck, coreReserve, discoveryDeck, discoveryReserve);
      setActiveFilters(activeFilters);
      overlay.remove();
      transitionTo('pack-open');
    } catch (err) {
      console.error('[TrackPack] Failed to load artist data:', err);
      overlay.remove();
      generateBtn.textContent = 'Failed — try again';
      setTimeout(() => {
        generateBtn.textContent = 'Open Pack';
        generateBtn.disabled = selected.size < MIN_ARTISTS;
      }, 2500);
    }
  });

  function showFilterWarning(emptyArtists, filters) {
    clearWarning();
    const names = emptyArtists.map(a => `<strong>${a.name}</strong>`).join(', ');
    const tips = [];
    if (filters.yearMin || filters.yearMax) {
      const range = `${filters.yearMin || '…'}–${filters.yearMax || '…'}`;
      tips.push(`widen your year range (currently ${range})`);
    }
    const activeLabels = FILTERS.filter(f => filters[f.key]).map(f => f.label.toLowerCase());
    if (activeLabels.length) tips.push(`disable: ${activeLabels.join(', ')}`);

    const warn = document.createElement('div');
    warn.className = 'filter-warning';
    warn.innerHTML = `
      <span class="filter-warning-icon">!</span>
      <span>No songs found for ${names} with current filters.
        ${tips.length ? `Try: ${tips.join(' — or — ')}.` : 'Try removing some filters.'}
      </span>
    `;
    sidebar.appendChild(warn);
  }

  // ─── Sidebar ───────────────────────────────────────────────────────────────

  const sidebar = document.createElement('div');
  sidebar.className = 'select-sidebar';

  const badge = document.createElement('div');
  badge.className = 'step-badge';
  badge.innerHTML = `<span class="step-badge-dot"></span>Step 1 of 3`;

  const filterSection = document.createElement('div');
  filterSection.className = 'filter-section';

  const filterSectionLabel = document.createElement('span');
  filterSectionLabel.className = 'filter-section-label';
  filterSectionLabel.textContent = 'Filters';
  filterSection.appendChild(filterSectionLabel);
  filterSection.appendChild(filterRow);

  const sidebarSelected = document.createElement('div');
  sidebarSelected.className = 'sidebar-selected';

  const sidebarSelectedLabel = document.createElement('span');
  sidebarSelectedLabel.className = 'sidebar-selected-label';
  sidebarSelectedLabel.textContent = 'Selected';
  sidebarSelected.appendChild(sidebarSelectedLabel);
  sidebarSelected.appendChild(chipsWrap);

  const sidebarFooter = document.createElement('div');
  sidebarFooter.className = 'sidebar-footer';
  sidebarFooter.appendChild(generateBtn);

  sidebar.appendChild(badge);
  sidebar.appendChild(h2);
  sidebar.appendChild(subtitle);
  sidebar.appendChild(counter);
  sidebar.appendChild(filterSection);
  sidebar.appendChild(sidebarSelected);
  sidebar.appendChild(sidebarFooter);

  // ─── Main ──────────────────────────────────────────────────────────────────

  const main = document.createElement('div');
  main.className = 'select-main';

  main.appendChild(searchWrap);
  main.appendChild(grid);

  screen.appendChild(sidebar);
  screen.appendChild(main);
  container.appendChild(screen);
}
