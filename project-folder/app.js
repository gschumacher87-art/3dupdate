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

// ===== GROUND (FIXED + CLEAN) =====
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

    // main fill
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, y, w, height);

    // overlap fix (kills 1px gaps on iPhone)
    ctx.fillRect(0, y - 1, w, height + 2);

    // grass top edge
    ctx.fillStyle = '#3f7a36';
    ctx.fillRect(0, y, w, 4);
  }

  return { update, draw, getY };
})();

// ===== INPUT =====
function flap() {
  dragon.flap(gameOver, resetGame);
}

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

// ===== INPUT HANDLING =====
window.addEventListener('touchstart', () => flap(), { passive: true });
window.addEventListener('click', flap);

fireBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  fire();
  flap();
}, { passive: false });

fireBtn.addEventListener('click', () => {
  fire();
  flap();
});

window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') flap();
  if (e.code === 'KeyF') {
    fire();
    flap();
  }
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

  try {

    const deltaTime = time - lastTime;
    if (deltaTime > 1000) {
      lastTime = time;
      return requestAnimationFrame(loop);
    }
    lastTime = time;

    // ===== CLEAR =====
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, viewWidth(), viewHeight());

    // ===== UPDATE GROUND (CRITICAL) =====
    ground.update();

    if (!gameOver) {

      score += deltaTime / 1000;

      const d = dragon.get();

      enemies.update(
        viewWidth,
        viewHeight,
        d,
        () => gameOver = true
      );

      dragon.update(
        viewWidth,
        viewHeight,
        enemies.getList()
      );

      obstacles.update(
        viewHeight,
        viewWidth,
        d,
        () => {},
        () => gameOver = true
      );

      // ===== GROUND COLLISION (FIXED) =====
      if (d.y + d.size / 2 > ground.getY()) {
        gameOver = true;
      }
    }

    // ===== DRAW ORDER =====
    obstacles.draw(ctx);
    enemies.draw(ctx);

    // ground seals everything clean
    ground.draw(ctx);

    dragon.draw(ctx);

    // ===== UI =====
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${Math.floor(score)}`, 20, 40);

    if (gameOver) {
      ctx.font = '28px Arial';
      ctx.fillText('Game Over - tap to restart', 20, 80);
    }

  } catch (err) {
    console.error('LOOP CRASH:', err);
  }

  requestAnimationFrame(loop);
}