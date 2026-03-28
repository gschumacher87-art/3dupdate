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

// ===== INPUT =====
function flap() {
  dragon.flap(gameOver, resetGame);
}

window.addEventListener('click', flap);
window.addEventListener('touchstart', flap, { passive: true });
window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') flap();
});

// ===== RESET =====
function resetGame() {
  score = 0;
  gameOver = false;

  dragon.reset(viewWidth, viewHeight);
  obstacles.reset();
}

// ===== START AFTER IMAGE LOAD =====
dragon.img.onload = () => {
  dragon.init(viewWidth, viewHeight);
  obstacles.init(viewWidth, viewHeight);

  requestAnimationFrame(loop);
};

// ===== LOOP =====
function loop() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, viewWidth(), viewHeight());

  if (!gameOver) {
    dragon.update();

    obstacles.update(
      viewHeight,
      viewWidth,
      dragon.get(),
      () => score++,
      () => gameOver = true
    );

    const d = dragon.get();

    if (d.y + d.size / 2 > viewHeight()) {
      gameOver = true;
    }

    if (d.y - d.size / 2 < 0) {
      d.y = d.size / 2;
    }
  }

  // ===== DRAW =====
  obstacles.draw(ctx, viewHeight);
  dragon.draw(ctx);

  // ===== UI =====
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);

  if (gameOver) {
    ctx.font = '28px Arial';
    ctx.fillText('Game Over - tap to restart', 20, 80);
  }

  requestAnimationFrame(loop);
}