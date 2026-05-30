const COLORS = ['#f5c542','#ffe566','#ffffff','#22df65','#1db954','#ffd700','#fff7a0','#ffb347'];
const PIECE_COUNT = 150;

export function launchConfetti() {
  const container = document.createElement('div');
  container.style.cssText =
    'position:fixed;inset:0;pointer-events:none;z-index:9998;overflow:hidden;';
  document.body.appendChild(container);

  for (let i = 0; i < PIECE_COUNT; i++) {
    const piece = document.createElement('div');
    const color    = COLORS[Math.floor(Math.random() * COLORS.length)];
    const size     = 5 + Math.random() * 10;
    const isCircle = Math.random() > 0.45;
    const x        = Math.random() * 100;
    const delay    = Math.random() * 1.4;
    const duration = 2.5 + Math.random() * 2.5;
    const rotStart = Math.random() * 360;
    const rotEnd   = rotStart + 360 + Math.random() * 720;

    piece.style.cssText = [
      'position:absolute',
      `left:${x}%`,
      `top:-${size + 10}px`,
      `width:${size}px`,
      `height:${isCircle ? size : size * (0.35 + Math.random() * 0.65)}px`,
      `background:${color}`,
      `border-radius:${isCircle ? '50%' : '2px'}`,
      `--rot-start:${rotStart}deg`,
      `--rot-end:${rotEnd}deg`,
      `animation:confettiFall ${duration}s ${delay}s ease-in forwards`,
    ].join(';');

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5500);
}
