const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.style.touchAction = 'manipulation';

// ===== HOME SCREEN (FIXED CLEAN) =====
let homeScreen, playBtn, bestTimeText, bestEnemiesText;

function updateHomeStats() {
  if (!bestTimeText || !bestEnemiesText) return;
  bestTimeText.innerText = `Best Time: ${best.time.toFixed(1)}s`;
  bestEnemiesText.innerText = `Best Enemies: ${best.enemies}`;
}

// ===== VIEW SIZE =====
const viewWidth = () => canvas.clientWidth;
const viewHeight = () => canvas.clientHeight;

// ===== CANVAS =====
function resize() {
  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);

  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();

// ===== GAME STATE =====
let gameOver = true;
let lastTime = performance.now();

// ===== GLOBAL STATS =====
window.stats = { time: 0, enemies: 0, trees: 0 };

// ===== BEST =====
let best = { time: 0, enemies: 0, trees: 0 };
const saved = localStorage.getItem('dragon_best');
if (saved) best = JSON.parse(saved);

// ===== SAVE BEST =====
function saveBest() {
  if (window.stats.time > best.time) best.time = window.stats.time;
  if (window.stats.enemies > best.enemies) best.enemies = window.stats.enemies;
  if (window.stats.trees > best.trees) best.trees = window.stats.trees;

  localStorage.setItem('dragon_best', JSON.stringify(best));
}

// ===== GROUND =====
const ground = (() => {
  let height = 0;
  let y = 0;

  function update() {
    height = Math.floor(viewHeight() * 0.15);
    y = Math.floor(viewHeight() - height);
  }

  function getY() { return y; }

  function draw(ctx) {
    const w = Math.floor(viewWidth());
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, y, w, height);
    ctx.fillRect(0, y - 1, w, height + 2);
    ctx.fillStyle = '#3f7a36';
    ctx.fillRect(0, y, w, 4);
  }

  return { update, draw, getY };
})();

// ===== INPUT =====
let input = { up: false };
let hold = false;

function fire() {
  if (!gameOver) dragon.fire();
}

// ===== FIRE BUTTON =====
const fireBtn = document.createElement('button');
fireBtn.innerText = '🔥';
fireBtn.style.position = 'absolute';
fireBtn.style.bottom = '20px';
fireBtn.style.right = '20px';
fireBtn.style.fontSize = '28px';
fireBtn.style.padding = '10px 16px';
fireBtn.style.borderRadius = '10px';
fireBtn.style.border = 'none';
fireBtn.style.background = 'orange';
fireBtn.style.color = 'white';
fireBtn.style.zIndex = 10;
fireBtn.style.webkitTapHighlightColor = 'transparent';

document.body.appendChild(fireBtn);

// ===== INPUT =====
window.addEventListener('touchstart', (e) => {
  if (homeScreen && homeScreen.style.display !== 'none') return;
  if (e.target === fireBtn) return;

  hold = true;
  input.up = true;
}, { passive: true });

window.addEventListener('touchend', () => {
  hold = false;
  input.up = false;
});

window.addEventListener('mousedown', (e) => {
  if (homeScreen && homeScreen.style.display !== 'none') return;
  if (e.target === fireBtn) return;

  hold = true;
  input.up = true;
});

window.addEventListener('mouseup', () => {
  hold = false;
  input.up = false;
});

fireBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  e.stopPropagation();
  fire();
}, { passive: false });

fireBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  fire();
});

window.addEventListener('keydown', e => {
  if (homeScreen && homeScreen.style.display !== 'none') return;

  if (e.code === 'Space' || e.code === 'ArrowUp') {
    hold = true;
    input.up = true;
  }
  if (e.code === 'KeyF') fire();
});

window.addEventListener('keyup', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    hold = false;
    input.up = false;
  }
});

// ===== RESET =====
function resetGame() {
  lastTime = performance.now();

  window.stats.time = 0;
  window.stats.enemies = 0;
  window.stats.trees = 0;

  dragon.reset(viewWidth, viewHeight);
  obstacles.reset();
  enemies.reset();
}

// ===== START (CLEAN FIX) =====
function startGame() {

  // grab DOM safely
  homeScreen = document.getElementById('homeScreen');
  playBtn = document.getElementById('playBtn');
  bestTimeText = document.getElementById('bestTime');
  bestEnemiesText = document.getElementById('bestEnemies');

  updateHomeStats();
  if (homeScreen) homeScreen.style.display = 'flex';

  if (playBtn) {
    playBtn.onclick = () => {

      homeScreen.style.display = 'none';

      resetGame();

      dragon.init(viewWidth, viewHeight);
      obstacles.init(viewWidth, viewHeight);
      enemies.init();

      gameOver = false;
    };
  }

  requestAnimationFrame(loop);
}

// ===== START SAFE (NO CACHE BUG) =====
window.addEventListener('load', startGame);

// ===== LOOP =====
function loop(time) {

  try {

    const deltaTime = time - lastTime;
    lastTime = time;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, viewWidth(), viewHeight());

    ground.update();

    if (!gameOver) {

      window.stats.time += deltaTime / 1000;

      const d = dragon.get();

      const hitbox = {
        x: d.x,
        y: d.y + d.size * 0.2,
        size: d.size * 0.6
      };

      enemies.update(viewWidth, viewHeight, hitbox, () => {
        gameOver = true;
        saveBest();
        updateHomeStats();
        homeScreen.style.display = 'flex';
      });

      dragon.update(viewWidth, viewHeight, enemies.getList(), input);

      obstacles.update(viewHeight, viewWidth, hitbox, () => {
        window.stats.trees++;
      }, () => {
        gameOver = true;
        saveBest();
        updateHomeStats();
        homeScreen.style.display = 'flex';
      });

      if (hitbox.y + hitbox.size / 2 > ground.getY()) {
        gameOver = true;
        saveBest();
        updateHomeStats();
        homeScreen.style.display = 'flex';
      }
    }

    obstacles.draw(ctx);
    enemies.draw(ctx);
    ground.draw(ctx);
    dragon.draw(ctx);

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';

    ctx.fillText(`Time: ${window.stats.time.toFixed(1)}s`, 20, 30);
    ctx.fillText(`Enemies: ${window.stats.enemies}`, 20, 55);
    ctx.fillText(`Trees: ${window.stats.trees}`, 20, 80);

  } catch (err) {
    console.error('LOOP CRASH:', err);
  }

  requestAnimationFrame(loop);
}