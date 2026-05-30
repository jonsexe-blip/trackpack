import gsap from 'gsap';
import { launchConfetti } from '../components/confetti.js';

/**
 * Full pack-opening animation sequence.
 *
 * Phases:
 *   1. Pack shakes (excitement build)
 *   2. Pack scales up (tension)
 *   3. Pack top tears away (clip-path)
 *   4. Cards fan out from behind the pack
 *   5. Cards fly to their target grid positions
 *
 * @param {HTMLElement} packEl         - the .pack-wrapper element
 * @param {HTMLElement[]} cardEls      - array of card elements (already rendered, hidden)
 * @param {HTMLElement} gridContainer  - the .card-grid element (used for Flip target positions)
 * @param {HTMLElement[]} slotEls      - array of .card-slot elements matching cardEls order
 * @returns {Promise} resolves when animation completes
 */
export function animatePackTear(packEl, cardEls, gridContainer, slotEls) {
  return new Promise(resolve => {
    const packBody = packEl.querySelector('.pack-body');
    const packTop = packEl.querySelector('.pack-top');

    // Start all cards invisible and stacked at the pack's center
    gsap.set(cardEls, {
      opacity: 0,
      scale: 0.35,
      x: 0,
      y: 0,
      rotation: 0,
      transformOrigin: 'center center',
      position: 'fixed',
      zIndex: 100,
    });

    // Record pack center position for card origin
    const packRect = packEl.getBoundingClientRect();
    const packCx = packRect.left + packRect.width / 2;
    const packCy = packRect.top + packRect.height / 2;

    gsap.set(cardEls, {
      left: packCx,
      top: packCy,
      xPercent: -50,
      yPercent: -50,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Clean up fixed positioning before resolving
        gsap.set(cardEls, { clearProps: 'position,zIndex,left,top,xPercent,yPercent' });
        resolve();
      }
    });

    // Phase 1: Pack shakes
    tl.to(packBody, {
      x: -10, duration: 0.07, ease: 'power1.inOut', repeat: 5, yoyo: true,
    });

    // Phase 2: Scale up (tension)
    tl.to(packBody, {
      scale: 1.08, duration: 0.25, ease: 'power2.out',
    });

    // Phase 3: Tear — top section clips away
    tl.to(packTop, {
      yPercent: -110,
      opacity: 0,
      duration: 0.3,
      ease: 'power3.in',
    });

    // Phase 3.5: White flash at the tear moment
    const flashEl = document.createElement('div');
    flashEl.style.cssText =
      'position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:9999;';
    document.body.appendChild(flashEl);

    tl.to(flashEl, { opacity: 0.92, duration: 0.07, ease: 'none' }, '>');
    tl.to(flashEl, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => flashEl.remove(),
    }, '>');

    // Phase 4: Cards fan out from the pack — staggered
    tl.to(cardEls, {
      opacity: 1,
      scale: 0.55,
      stagger: {
        amount: 0.35,
        from: 'center',
      },
      ease: 'back.out(1.2)',
      duration: 0.3,
    }, '-=0.05');

    // Fan cards out in a spread pattern
    cardEls.forEach((card, i) => {
      const total = cardEls.length;
      const spread = Math.min(total * 18, 160); // degrees of total spread
      const angle = -spread / 2 + (i / Math.max(total - 1, 1)) * spread;
      const radius = 80;
      const fanX = Math.sin(angle * Math.PI / 180) * radius;
      const fanY = -Math.abs(Math.cos(angle * Math.PI / 180)) * 40;

      tl.to(card, {
        x: `+=${fanX}`,
        y: `+=${fanY}`,
        rotation: angle * 0.4,
        duration: 0.3,
        ease: 'power2.out',
      }, '<0.02');
    });

    // Brief pause to see the fan
    tl.to({}, { duration: 0.25 });

    // Phase 5: Cards fly to their grid slot positions
    cardEls.forEach((cardEl, i) => {
      const slot = slotEls[i];
      if (!slot) return;

      const slotRect = slot.getBoundingClientRect();
      const targetCx = slotRect.left + slotRect.width / 2;
      const targetCy = slotRect.top + slotRect.height / 2;

      // Current position is packCx/packCy + fan offset (tracked via gsap)
      tl.to(cardEl, {
        left: targetCx,
        top: targetCy,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
      }, i === 0 ? '-=0.1' : `<0.04`);
    });

    // Pack fades out as cards fly away
    tl.to(packEl, {
      opacity: 0,
      scale: 0.85,
      duration: 0.4,
      ease: 'power2.in',
    }, '-=0.6');

    // After all cards land: confetti explosion
    tl.call(() => launchConfetti());
  });
}
