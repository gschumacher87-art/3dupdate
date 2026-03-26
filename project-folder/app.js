lconst canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

canvas.style.touchAction = 'none';

// ===== CANVAS =====
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
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
const speed = 6;

// ===== FLAPPY PHYSICS =====
let velocity = 0;
const gravity = 0.5;
const lift = -8;

// ===== GAME STATE =====
let gameOver = false;
let score = 0;

// ===== PIPES =====
const pipes = [];
let pipeWidth = Math.floor(canvas.width * 0.08);
let pipeGap = Math.floor(canvas.height * 0.25);
const pipeSpeed = 2;
const pipeSpawnEvery = 140;
let pipeTimer = 0;

// ===== PRE-CALC =====
let fw, fh, size, x, y;

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

function resetGame() {
  velocity = 0;
  score = 0;
  gameOver = false;
  pipes.length = 0;
  pipeTimer = 0;
  x = Math.floor(canvas.width * 0.2);
  y = Math.floor(canvas.height * 0.45);
}

function addPipe() {
  const minTop = 60;
  const maxTop = canvas.height - pipeGap - 120;
  const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  pipes.push({
    x: canvas.width,
    topHeight,
    passed: false
  });
}

dragon.onload = () => {
  fw = Math.floor(dragon.width / frames);
  fh = Math.floor(dragon.height);

  size = Math.floor(canvas.width * 0.12);

  pipeWidth = Math.floor(canvas.width * 0.08);
  pipeGap = Math.floor(canvas.height * 0.25);

  x = Math.floor(canvas.width * 0.2);
  y = Math.floor(canvas.height * 0.45);

  requestAnimationFrame(loop);
};

// ===== LOOP =====
function loop() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!gameOver) {
    velocity += gravity;
    y += velocity;

    // 🔒 HARD LOCK (FIXES JITTER)
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

      if (hitPipe) {
        gameOver = true;
      }
    }

    while (pipes.length && pipes[0].x + pipeWidth < 0) {
      pipes.shift();
    }

    if (y + size / 2 > canvas.height) {
      y = canvas.height - size / 2;
      gameOver = true;
    }

    if (y - size / 2 < 0) {
      y = size / 2;
      velocity = 0;
    }
  }

  ctx.fillStyle = 'lime';
  for (const p of pipes) {
    ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
    ctx.fillRect(
      p.x,
      p.topHeight + pipeGap,
      pipeWidth,
      canvas.height - (p.topHeight + pipeGap)
    );
  }

  const drawX = Math.round(x - size / 2);
  const drawY = Math.round(y - size / 2);

  ctx.drawImage(
    dragon,
    frame * fw, 0,
    fw, fh,
    drawX, drawY,
    size, size
  );

  ctx.fillStyle = 'white';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 20, 40);

  if (gameOver) {
    ctx.fillStyle = 'white';
    ctx.font = '28px Arial';
    ctx.fillText('Game Over - tap to restart', 20, 80);
  }

  tick++;
  if (tick >= speed) {
    frame = (frame + 1) % frames;
    tick = 0;
  }

  requestAnimationFrame(loop);
}