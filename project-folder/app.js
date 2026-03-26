const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ===== CANVAS =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ===== IMAGE (root-based path for GitHub) =====
const dragon = new Image();
dragon.src = '/project-folder/dragon.png';

// ===== SPRITE =====
const frames = 3;
let frame = 0;
let tick = 0;
const speed = 6;

// ===== POSITION (flappy style) =====
function getPos() {
  return {
    x: canvas.width * 0.2,
    y: canvas.height * 0.45
  };
}

// ===== LOOP =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const { x, y } = getPos();

  const fw = dragon.width / frames;
  const fh = dragon.height;

  const size = canvas.width * 0.12;

  ctx.drawImage(
    dragon,
    frame * fw, 0,
    fw, fh,
    x - size / 2,
    y - size / 2,
    size, size
  );

  tick++;
  if (tick >= speed) {
    frame = (frame + 1) % frames;
    tick = 0;
  }

  requestAnimationFrame(loop);
}

// ===== START =====
dragon.onload = () => {
  loop();
};

dragon.onerror = () => {
  console.log('IMAGE NOT FOUND');
};