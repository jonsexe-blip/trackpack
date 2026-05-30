/**
 * Creates a debounced search input element.
 * @param {function} onSearch - called with the current query string after debounce
 * @param {string} placeholder
 * @returns {HTMLElement} wrapper div containing the input
 */
export function createSearchInput(onSearch, placeholder = 'Search artists...') {
  const wrap = document.createElement('div');
  wrap.className = 'search-wrap';

  const icon = document.createElement('span');
  icon.className = 'search-icon';
  icon.innerHTML = '&#9881;'; // replaced below with SVG
  icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`;

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = placeholder;
  input.setAttribute('aria-label', placeholder);

  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => onSearch(input.value.trim().toLowerCase()), 200);
  });

  wrap.appendChild(icon);
  wrap.appendChild(input);
  return wrap;
}
