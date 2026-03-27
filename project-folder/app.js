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

// ===== IMAGE =====
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ===== SPRITE =====
const frames = 3;
let frame = 0;
let tick = 0;
const speed = 60;

// 🔧 MANUAL FRAME OFFSETS (YOU TUNE THESE)
const frameOffsetX = [12, 2, 8];
const frameOffsetY = [0, 0, 0];

// ===== PHYSICS =====
let velocity = 0;
const gravity = 0.5;
const lift = -8;

// ===== GAME STATE =====
let gameOver = false;
let score = 0;

// ===== PIPES =====
const pipes = [];
let pipeWidth;
let pipeGap;
const pipeSpeed = 2;
const pipeSpawnEvery = 140;
let pipeTimer = 0;

// ===== PRE-CALC =====
let fw, fh, size, x, y;

// ===== INPUT =====
function flap() {
  if (gameOver) {
    resetGame();
    return;
  }
  velocity = lift;
}

window.addEventListener('click', flap);
window.addEventListener('touchstart', flap, { passive: true });
window.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'ArrowUp') flap();
});

// ===== RESET =====
function resetGame() {
  velocity = 0;
  score = 0;
  gameOver = false;
  pipes.length = 0;
  pipeTimer = 0;

  x = Math.floor(viewWidth() * 0.2);
  y = Math.floor(viewHeight() * 0.45);
}

// ===== PIPES =====
function addPipe() {
  const minTop = 60;
  const maxTop = viewHeight() - pipeGap - 120;
  const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  pipes.push({
    x: viewWidth(),
    topHeight,
    passed: false
  });
}

// ===== IMAGE LOAD =====
dragon.onload = () => {
  fw = Math.floor(dragon.width / frames);
  fh = Math.floor(dragon.height);

  size = Math.floor(viewWidth() * 0.12);
  size = Math.max(32, Math.round(size));

  pipeWidth = Math.floor(viewWidth() * 0.08);
  pipeGap = Math.floor(viewHeight() * 0.25);

  x = Math.floor(viewWidth() * 0.2);
  y = Math.floor(viewHeight() * 0.45);

  requestAnimationFrame(loop);
};

// ===== LOOP =====
function loop() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, viewWidth(), viewHeight());

  if (!gameOver) {
    velocity += gravity;
    y += velocity;

    y = Math.round(y);
    velocity = Math.round(velocity * 1000) / 1000;

    pipeTimer++;
    if (pipeTimer >= pipeSpawnEvery) {
      addPipe();
      pipeTimer = 0;
    }

    for (const p of pipes) {
      p.x -= pipeSpeed;

      const hitboxScale = 0.7;
      const hitSize = size * hitboxScale;

      const dragonLeft = x - hitSize / 2;
      const dragonRight = x + hitSize / 2;
      const dragonTop = y - hitSize / 2;
      const dragonBottom = y + hitSize / 2;

      const pipeLeft = p.x;
      const pipeRight = p.x + pipeWidth;
      const topPipeBottom = p.topHeight;
      const bottomPipeTop = p.topHeight + pipeGap;

      if (!p.passed && pipeRight < dragonLeft) {
        p.passed = true;
        score++;
      }

      const hitPipe =
        dragonRight > pipeLeft &&
        dragonLeft < pipeRight &&
        (dragonTop < topPipeBottom || dragonBottom > bottomPipeTop);

      if (hitPipe) gameOver = true;
    }

    while (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }

    if (y + size / 2 > viewHeight()) {
      y = viewHeight() - size / 2;
      gameOver = true;
    }

    if (y - size / 2 < 0) {
      y = size / 2;
      velocity = 0;
    }
  }

  // ===== DRAW PIPES =====
  ctx.fillStyle = 'lime';
  for (const p of pipes) {
    ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
    ctx.fillRect(
      p.x,
      p.topHeight + pipeGap,
      pipeWidth,
      viewHeight() - (p.topHeight + pipeGap)
    );
  }

  // ===== DRAW DRAGON (WITH MANUAL OFFSET) =====
  const baseX = Math.round(x - size / 2);
  const baseY = Math.round(y - size / 2);

  const drawX = baseX + frameOffsetX[frame];
  const drawY = baseY + frameOffsetY[frame];

  ctx.drawImage(
    dragon,
    frame * fw, 0,
    fw, fh,
    drawX,
    drawY,
    size,
    size
  );

  // ===== UI =====
  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);

  if (gameOver) {
    ctx.font = '28px Arial';
    ctx.fillText('Game Over - tap to restart', 20, 80);
  }

  // ===== ANIMATION =====
  tick++;
  if (tick >= speed) {
    frame = (frame + 1) % frames;
    tick = 0;
  }

  requestAnimationFrame(loop);
}