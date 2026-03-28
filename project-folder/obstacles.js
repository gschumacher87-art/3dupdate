const pipes = [];

let pipeWidth;
let pipeGap;

const pipeSpeed = 2;
const pipeSpawnEvery = 140;
let pipeTimer = 0;

function init(viewWidth, viewHeight) {
  pipeWidth = Math.floor(viewWidth() * 0.08);
  pipeGap = Math.floor(viewHeight() * 0.25);
}

function reset() {
  pipes.length = 0;
  pipeTimer = 0;
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

function update(viewHeight, viewWidth, dragonData, onScore, onHit) {
  pipeTimer++;

  if (pipeTimer >= pipeSpawnEvery) {
    addPipe(viewHeight, viewWidth);
    pipeTimer = 0;
  }

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

  while (pipes.length && pipes[0].x + pipeWidth < 0) {
    pipes.shift();
  }
}

function draw(ctx, viewHeight) {
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
}

window.obstacles = {
  init,
  reset,
  update,
  draw
};