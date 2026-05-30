import gsap from 'gsap';

/**
 * Animate a card out (flip + shrink + fade).
 * Returns a promise that resolves when the animation is done.
 */
export function animateCardExit(cardEl) {
  return new Promise(resolve => {
    const tl = gsap.timeline({ onComplete: resolve });
    tl
      .to(cardEl, { rotateY: 90, duration: 0.18, ease: 'power2.in' })
      .to(cardEl, { rotateY: 180, scaleX: 0.6, scaleY: 0.6, opacity: 0, duration: 0.18, ease: 'power2.out' });
  });
}
