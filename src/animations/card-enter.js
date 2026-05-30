import gsap from 'gsap';

/**
 * Animate a card entering the grid from above.
 * The card should already be in the DOM at its target position but invisible.
 */
export function animateCardEnter(cardEl) {
  gsap.fromTo(
    cardEl,
    { y: -140, opacity: 0, scale: 0.75, rotateY: -15 },
    { y: 0, opacity: 1, scale: 1, rotateY: 0, duration: 0.42, ease: 'back.out(1.4)' }
  );
}
