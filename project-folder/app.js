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

// ===== TIME TRACKING =====
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

// ===== FIRE BUTTON (UI) =====
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

fireBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  fire();
}, { passive: false });

fireBtn.addEventListener('click', fire);

// ===== RESET =====
function resetGame() {
  score = 0;
  gameOver = false;

  lastTime = performance.now();

  dragon.reset(viewWidth, viewHeight);
  obstacles.reset();
}

// ===== START =====
dragon.img.onload = () => {
  dragon.init(viewWidth, viewHeight);
  obstacles.init(viewWidth, viewHeight);

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

    obstacles.update(
      viewHeight,
      viewWidth,
      dragon.get(),
      () => {},
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
  ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);

  if (gameOver) {
    ctx.font = '28px Arial';
    ctx.fillText('Game Over - tap to restart', 20, 80);
  }

  requestAnimationFrame(loop);
}