const dragonImg = new Image();
dragonImg.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

let x, y, size;
let velocity = 0;

const gravity = 0.5;
const lift = -8;

// ===== FIRE =====
let fireballs = [];
let fireCooldown = 0;

// ===== INIT =====
function init(viewWidth, viewHeight) {
  size = Math.floor(viewWidth() * 0.12);
  size = Math.max(32, Math.round(size));

  x = Math.floor(viewWidth() * 0.2);
  y = Math.floor(viewHeight() * 0.45);
}

function reset(viewWidth, viewHeight) {
  velocity = 0;

  fireballs = [];
  fireCooldown = 0;

  x = Math.floor(viewWidth() * 0.2);
  y = Math.floor(viewHeight() * 0.45);
}

// ===== UPDATE =====
function update() {
  velocity += gravity;
  y += velocity;

  y = Math.round(y);
  velocity = Math.round(velocity * 1000) / 1000;

  // fire cooldown
  if (fireCooldown > 0) fireCooldown--;

  // fireballs
  for (const f of fireballs) {
    f.x += 8;
  }

  fireballs = fireballs.filter(f => f.x < window.innerWidth + 50);
}

// ===== INPUT =====
function flap(gameOver, resetGame) {
  if (gameOver) {
    resetGame();
    return;
  }
  velocity = lift;
}

function fire() {
  if (fireCooldown > 0) return;

  fireCooldown = 15;

  fireballs.push({
    x: x + size / 2,
    y: y
  });
}

// ===== DRAW =====
function draw(ctx) {
  const drawX = Math.round(x - size / 2);
  const drawY = Math.round(y - size / 2);

  ctx.drawImage(dragonImg, drawX, drawY, size, size);

  // fireballs
  ctx.fillStyle = 'orange';
  for (const f of fireballs) {
    ctx.beginPath();
    ctx.arc(f.x, f.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== DATA =====
function get() {
  return { x, y, size };
}

function getFireballs() {
  return fireballs;
}

window.dragon = {
  init,
  reset,
  update,
  flap,
  fire,
  draw,
  get,
  getFireballs,
  img: dragonImg
};