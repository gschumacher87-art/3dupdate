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
function update(viewWidth, viewHeight, enemies = [], input) {

  // ===== CONTROLLED FLIGHT =====
  if (input && input.up) {
    velocity -= 0.8;
  } else {
    velocity += 0.5;
  }

  if (velocity < -7) velocity = -7;
  if (velocity > 7) velocity = 7;

  y += velocity;

  y = Math.round(y);
  velocity = Math.round(velocity * 1000) / 1000;

  if (fireCooldown > 0) fireCooldown--;

  for (const f of fireballs) {
    f.x += f.vx;

    // ===== TRAIL =====
    f.trail.push({ x: f.x, y: f.y });
    if (f.trail.length > 5) f.trail.shift();

    // ===== SAFE ENEMY HIT =====
    for (const e of (enemies || [])) {
      if (!e || e.dead) continue;

      if (
        f.x < e.x + e.size &&
        f.x + f.size > e.x &&
        f.y < e.y + e.size &&
        f.y + f.size > e.y
      ) {
        e.dead = true;
        f.dead = true;
      }
    }
  }

  fireballs = fireballs.filter(f =>
    !f.dead &&
    f.x < viewWidth() + 50
  );
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
    y: y,
    vx: 8,
    size: 10,
    trail: [],
    dead: false
  });

  // ✅ FIX: add slight lift when shooting (removes drop feel)
  velocity -= 1;
}

// ===== DRAW =====
function draw(ctx) {
  const drawX = Math.round(x - size / 2);
  const drawY = Math.round(y - size / 2);

  ctx.drawImage(dragonImg, drawX, drawY, size, size);

  // ===== FIRE TRAIL =====
  for (const f of fireballs) {
    for (let i = 0; i < f.trail.length; i++) {
      const t = f.trail[i];
      const alpha = i / f.trail.length;

      ctx.fillStyle = `rgba(255,150,0,${alpha})`;
      ctx.beginPath();
      ctx.arc(t.x, t.y, 4 * alpha, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ===== FIREBALL =====
  for (const f of fireballs) {
    const gradient = ctx.createRadialGradient(
      f.x, f.y, 2,
      f.x, f.y, f.size
    );

    gradient.addColorStop(0, 'yellow');
    gradient.addColorStop(0.5, 'orange');
    gradient.addColorStop(1, 'red');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== DATA =====
function get() {
  return {
    x,
    y: y + size * 0.1,
    size: size * 0.7
  };
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