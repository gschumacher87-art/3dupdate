const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

canvas.style.touchAction = 'none';

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
let gameOver = false;
let lastTime = performance.now();

// ===== GLOBAL STATS (FIXED) =====
window.stats = {
  time: 0,
  enemies: 0,
  trees: 0
};

// ===== BEST (SAVED) =====
let best = {
  time: 0,
  enemies: 0,
  trees: 0
};

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

  function getY() {
    return y;
  }

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

document.body.appendChild(fireBtn);

// ===== INPUT =====
window.addEventListener('touchstart', (e) => {
  if (e.target === fireBtn) return;

  if (gameOver) {
    resetGame();
    return;
  }

  input.up = true;
}, { passive: true });

window.addEventListener('touchend', () => { input.up = false; });

window.addEventListener('mousedown', (e) => {
  if (e.target === fireBtn) return;

  if (gameOver) {
    resetGame();
    return;
  }

  input.up = true;
});

window.addEventListener('mouseup', () => { input.up = false; });

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
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (gameOver) {
      resetGame();
      return;
    }
    input.up = true;
  }
  if (e.code === 'KeyF') fire();
});

window.addEventListener('keyup', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') input.up = false;
});

// ===== RESET =====
function resetGame() {
  gameOver = false;
  lastTime = performance.now();

  window.stats.time = 0;
  window.stats.enemies = 0;
  window.stats.trees = 0;

  dragon.reset(viewWidth, viewHeight);
  obstacles.reset();
  enemies.reset();
}

// ===== START =====
dragon.img.onload = () => {
  dragon.init(viewWidth, viewHeight);
  obstacles.init(viewWidth, viewHeight);
  enemies.init();

  requestAnimationFrame(loop);
};

// ===== LOOP =====
function loop(time) {

  try {

    const deltaTime = time - lastTime;
    if (deltaTime > 1000) {
      lastTime = time;
      return requestAnimationFrame(loop);
    }
    lastTime = time;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, viewWidth(), viewHeight());

    ground.update();

    if (!gameOver) {

      window.stats.time += deltaTime / 1000;

      const d = dragon.get();

      enemies.update(
        viewWidth,
        viewHeight,
        d,
        () => {
          gameOver = true;
          saveBest();
        }
      );

      dragon.update(
        viewWidth,
        viewHeight,
        enemies.getList(),
        input
      );

      obstacles.update(
        viewHeight,
        viewWidth,
        d,
        () => {
          window.stats.trees++;
        },
        () => {
          gameOver = true;
          saveBest();
        }
      );

      if (d.y + d.size / 2 > ground.getY()) {
        gameOver = true;
        saveBest();
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

    if (gameOver) {
      ctx.font = '26px Arial';
      ctx.fillText('Game Over - tap to restart', 20, 120);

      ctx.font = '18px Arial';
      ctx.fillText(`Best Time: ${best.time.toFixed(1)}s`, 20, 160);
      ctx.fillText(`Best Enemies: ${best.enemies}`, 20, 185);
      ctx.fillText(`Best Trees: ${best.trees}`, 20, 210);
    }

  } catch (err) {
    console.error('LOOP CRASH:', err);
  }

  requestAnimationFrame(loop);
}