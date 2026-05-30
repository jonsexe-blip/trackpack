export function createPack(artists, trackCount = 25) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pack-wrapper';

  const artistRowsHTML = artists.slice(0, 4).map(a => `
    <div class="pack-artist-row">
      <img class="pack-artist-row-bg" src="${a.imageUrl}" alt="" aria-hidden="true" />
      <div class="pack-artist-row-overlay"></div>
      <img class="pack-artist-row-thumb" src="${a.imageUrl}" alt="${a.name}" />
      <span class="pack-artist-row-name">${a.name}</span>
    </div>
  `).join('');

  wrapper.innerHTML = `
    <div class="pack-body">
      <div class="pack-gleam"></div>
      <div class="pack-top">
        <div class="pack-top-label">Spotify TrackPack</div>
        <div class="pack-logo">TRACKPACK</div>
        <div class="pack-edition">${artists.length} Artist Edition</div>
      </div>
      <div class="pack-artists-strip">
        ${artistRowsHTML}
      </div>
      <div class="pack-bottom">
        <div class="pack-barcode"></div>
        <span class="pack-count-label">Tracks Inside</span>
        <span class="pack-count">${trackCount}</span>
      </div>
      <div class="pack-foil-overlay"></div>
      <div class="pack-tear-line"></div>
    </div>
  `;

  return wrapper;
}
