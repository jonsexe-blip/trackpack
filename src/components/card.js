import { attachHoloEffect } from './card-holo.js';
import { formatDuration } from '../logic/generator.js';

export function createCard(playlistCard, onDismiss) {
  const { id, type, song, artist, album } = playlistCard;

  const card = document.createElement('div');
  card.className = `track-card ${type}`;
  card.dataset.cardId = id;
  card.dataset.cardType = type;

  card.innerHTML = `
    <img class="card-artist-bg" src="${album.artUrl}" alt="${album.name}" loading="lazy" />
    <div class="card-inner-mat"></div>

    <!-- TOP: artist name header + dismiss button -->
    <div class="card-header">
      <div class="card-header-content">
        <span class="card-artist-name">${artist.name}</span>
      </div>
      <button class="card-dismiss" title="Remove this track" aria-label="Remove ${song.name}">
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="1" y1="1" x2="9" y2="9"/>
          <line x1="9" y1="1" x2="1" y2="9"/>
        </svg>
      </button>
    </div>

    <!-- BOTTOM: song title + album name -->
    <div class="card-bands">
      <div class="card-title-band">
        <span class="card-song-name">${song.name}</span>
      </div>
      <div class="card-album-band">
        <span class="card-album-name">${album.name}</span>
      </div>
    </div>
  `;

  card.querySelector('.card-dismiss').addEventListener('click', (e) => {
    e.stopPropagation();
    onDismiss(id, type, artist.id);
  });

  // Stagger gleam sweeps so not all cards flash simultaneously
  card.style.setProperty('--gleam-delay',    `${(Math.random() * 3).toFixed(2)}s`);
  card.style.setProperty('--gleam-duration', `${(3.5 + Math.random() * 2).toFixed(2)}s`);

  attachHoloEffect(card);
  return card;
}
