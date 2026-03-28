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
let score = 0;
let lastTime = performance.now();

// ===== INPUT =====
function flap() {
  dragon.flap(gameOver, resetGame);
}
function fire() {
  if (!gameOver) dragon.fire();
}

window.addEventListener('click', flap);
window.addEventListener('touchstart', flap, { passive: true });

window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') flap();
  if (e.code === 'KeyF') fire();
});

// ===== RESET =====
function resetGame() {
  score = 0;
  gameOver = false;
  lastTime = performance.now();

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

  const deltaTime = time - lastTime;
  if (deltaTime > 1000) {
    lastTime = time;
    return requestAnimationFrame(loop);
  }
  lastTime = time;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, viewWidth(), viewHeight());

  if (!gameOver) {

    score += deltaTime / 1000;

    dragon.update();

    const d = dragon.get();

    obstacles.update(
      viewHeight,
      viewWidth,
      d,
      () => {},
      () => gameOver = true
    );

    enemies.update(
      viewWidth,
      viewHeight,
      d,
      () => gameOver = true
    );

    if (d.y + d.size / 2 > viewHeight()) gameOver = true;
  }

  obstacles.draw(ctx, viewHeight);
  enemies.draw(ctx);
  dragon.draw(ctx);

  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);

  if (gameOver) {
    ctx.font = '28px Arial';
    ctx.fillText('Game Over - tap to restart', 20, 80);
  }

  requestAnimationFrame(loop);
}