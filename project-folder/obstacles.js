const pipes = [];
const lightning = [];

let pipeWidth;
let pipeGap;

const pipeSpeed = 2;
const pipeSpawnEvery = 140;
let pipeTimer = 0;

const lightningSpawnEvery = 220;
let lightningTimer = 0;

const lightningImg = new Image();
lightningImg.src = 'project-folder/lightning.png';

function init(viewWidth, viewHeight) {
  pipeWidth = Math.floor(viewWidth() * 0.08);
  pipeGap = Math.floor(viewHeight() * 0.25);
}

function reset() {
  pipes.length = 0;
  lightning.length = 0;

  pipeTimer = 0;
  lightningTimer = 0;
}

function addPipe(viewHeight, viewWidth) {
  const minTop = 60;
  const maxTop = viewHeight() - pipeGap - 120;

  const topHeight = Math.floor(Math.random() * (maxTop - minTop + 1)) + minTop;

  pipes.push({
    x: viewWidth(),
    topHeight,
    passed: false
  });
}

function addLightning(viewWidth, viewHeight) {
  lightning.push({
    x: viewWidth(),
    y: 0,
    width: 80,
    height: viewHeight(),
    life: 20
  });
}

function update(viewHeight, viewWidth, dragonData, onScore, onHit) {
  pipeTimer++;
  lightningTimer++;

  if (pipeTimer >= pipeSpawnEvery) {
    addPipe(viewHeight, viewWidth);
    pipeTimer = 0;
  }

  if (lightningTimer >= lightningSpawnEvery) {
    addLightning(viewWidth, viewHeight);
    lightningTimer = 0;
  }

  // ===== PIPES =====
  for (const p of pipes) {
    p.x -= pipeSpeed;

    const hitboxScale = 0.7;
    const hitSize = dragonData.size * hitboxScale;

    const dragonLeft = dragonData.x - hitSize / 2;
    const dragonRight = dragonData.x + hitSize / 2;
    const dragonTop = dragonData.y - hitSize / 2;
    const dragonBottom = dragonData.y + hitSize / 2;

    const pipeLeft = p.x;
    const pipeRight = p.x + pipeWidth;
    const topPipeBottom = p.topHeight;
    const bottomPipeTop = p.topHeight + pipeGap;

    if (!p.passed && pipeRight < dragonLeft) {
      p.passed = true;
      onScore();
    }

    const hitPipe =
      dragonRight > pipeLeft &&
      dragonLeft < pipeRight &&
      (dragonTop < topPipeBottom || dragonBottom > bottomPipeTop);

    if (hitPipe) onHit();
  }

  // ===== LIGHTNING =====
  for (const l of lightning) {
    l.x -= pipeSpeed;
    l.life--;

    const hitboxScale = 0.7;
    const hitSize = dragonData.size * hitboxScale;

    const dragonLeft = dragonData.x - hitSize / 2;
    const dragonRight = dragonData.x + hitSize / 2;
    const dragonTop = dragonData.y - hitSize / 2;
    const dragonBottom = dragonData.y + hitSize / 2;

    const lightningLeft = l.x;
    const lightningRight = l.x + l.width;

    const hitLightning =
      dragonRight > lightningLeft &&
      dragonLeft < lightningRight;

    if (hitLightning && l.life > 0) onHit();
  }

  // cleanup pipes
  while (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }

  // cleanup lightning
  while (lightning.length && (lightning[0].x + lightning[0].width < 0 || lightning[0].life <= 0)) {
    lightning.shift();
  }
}

function draw(ctx, viewHeight) {
  // ===== PIPES =====
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

  // ===== LIGHTNING =====
  for (const l of lightning) {
    if (l.life > 0) {
      ctx.globalCompositeOperation = 'lighter';

      ctx.drawImage(
        lightningImg,
        l.x,
        l.y,
        l.width,
        l.height
      );

      ctx.globalCompositeOperation = 'source-over';
    }
  }
}

window.obstacles = {
  init,
  reset,
  update,
  draw
};