const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.style.touchAction = 'none';

// ===== CANVAS =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ===== IMAGE =====
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ===== SPRITE =====
const frames = 3;
let frame = 0;
let tick = 0;
const speed = 6;

// ===== FLAPPY PHYSICS =====
let velocity = 0;
const gravity = 0.5;
const lift = -8;

// ===== PRE-CALC =====
let fw, fh, size, x, y;

function flap() {
  velocity = lift;
}

window.addEventListener('click', flap);
window.addEventListener('touchstart', flap, { passive: true });
window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') flap();
});

dragon.onload = () => {
  fw = Math.floor(dragon.width / frames);
  fh = Math.floor(dragon.height);

  size = Math.floor(canvas.width * 0.12);
  x = Math.floor(canvas.width * 0.2);
  y = Math.floor(canvas.height * 0.45);

  requestAnimationFrame(loop);
};

// ===== LOOP =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  velocity += gravity;
  y += velocity;

  if (y + size > canvas.height) {
    y = canvas.height - size;
    velocity = 0;
  }

  if (y < 0) {
    y = 0;
    velocity = 0;
  }

  ctx.drawImage(
    dragon,
    frame * fw, 0,
    fw, fh,
    x - size / 2,
    y - size / 2,
    size,
    size
  );

  tick++;
  if (tick >= speed) {
    frame = (frame + 1) % frames;
    tick = 0;
  }

  requestAnimationFrame(loop);
}
