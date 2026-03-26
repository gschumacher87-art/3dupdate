const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ===== CANVAS =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ===== IMAGE (GUARANTEED LOAD) =====
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ===== SPRITE =====
const frames = 3;
let frame = 0;
let tick = 0;
const speed = 6;

// ===== LOOP =====
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const fw = dragon.width / frames;
  const fh = dragon.height;

  const size = canvas.width * 0.12;

  const x = canvas.width * 0.2;
  const y = canvas.height * 0.45;

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

// ===== START =====
dragon.onload = () => {
  loop();
};

dragon.onerror = () => {
  console.log("FAILED TO LOAD IMAGE");
};