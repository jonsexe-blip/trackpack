/**
 * Attaches a holographic shimmer effect to a card element.
 * The card's ::before pseudo-element uses CSS custom props --mouse-x and --mouse-y
 * (set as 0–1 fractions) to position the conic-gradient shimmer origin.
 */
export function attachHoloEffect(cardEl) {
  const onMove = (e) => {
    const rect = cardEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    cardEl.style.setProperty('--mouse-x', x.toFixed(3));
    cardEl.style.setProperty('--mouse-y', y.toFixed(3));
  };

  const onLeave = () => {
    cardEl.style.removeProperty('--mouse-x');
    cardEl.style.removeProperty('--mouse-y');
  };

  cardEl.addEventListener('mousemove', onMove);
  cardEl.addEventListener('mouseleave', onLeave);

  // Return cleanup function
  return () => {
    cardEl.removeEventListener('mousemove', onMove);
    cardEl.removeEventListener('mouseleave', onLeave);
  };
}
