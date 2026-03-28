const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.style.touchAction = 'none';

// ===== VIEW SIZE =====
const viewWidth = () => canvas.clientWidth;
const viewHeight = () => canvas.clientHeight;

// ===== RESIZE =====
function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resize);
resize();

// ===== PLAYER =====
const dragon = {
  x: 100,
  y: 200,
  velocity: 0
};

const gravity = 0.5;
const lift = -8;

// ===== INPUT =====
canvas.addEventListener('touchstart', () => dragon.velocity = lift);
canvas.addEventListener('mousedown', () => dragon.velocity = lift);

// ===== LIGHTNING SYSTEM =====
let lightning = [];

function spawnLightning() {
  lightning.push({
    x: viewWidth() + 50,
    segments: generateBolt(),
    life: 10 // frames visible
  });
}

function generateBolt() {
  const segments = [];
  const step = 20;
  let x = 0;
  let y = 0;

  while (y < viewHeight()) {
    x += (Math.random() - 0.5) * 40; // horizontal jitter
    y += step;

    segments.push({ x, y });

    // occasional branch
    if (Math.random() < 0.2) {
      segments.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + step
      });
    }
  }

  return segments;
}

// ===== GAME LOOP =====
function update() {
  // physics
  dragon.velocity += gravity;
  dragon.y += dragon.velocity;

  // spawn lightning randomly
  if (Math.random() < 0.03) {
    spawnLightning();
  }

  // move lightning
  for (const l of lightning) {
    l.x -= 6;
    l.life--;
  }

  // remove dead lightning
  lightning = lightning.filter(l => l.life > 0 && l.x > -100);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ===== DRAW DRAGON =====
  ctx.fillStyle = 'blue';
  ctx.fillRect(dragon.x, dragon.y, 30, 30);

  // ===== DRAW LIGHTNING =====
  for (const l of lightning) {
    const flicker = Math.random() * 4;

    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 3 + flicker;

    ctx.shadowBlur = 20 + flicker * 5;
    ctx.shadowColor = 'cyan';

    ctx.beginPath();

    const baseX = l.x;

    let prev = { x: baseX, y: 0 };

    for (const s of l.segments) {
      const jitterX = s.x + (Math.random() - 0.5) * 10;
      const jitterY = s.y + (Math.random() - 0.5) * 10;

      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(baseX + jitterX, jitterY);

      prev = { x: baseX + jitterX, y: jitterY };
    }

    ctx.stroke();

    // inner bright core
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    prev = { x: baseX, y: 0 };

    for (const s of l.segments) {
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(baseX + s.x, s.y);
      prev = { x: baseX + s.x, y: s.y };
    }

    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

// ===== LOOP =====
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();