const dragonImg = new Image();
dragonImg.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

let x, y, size;
let velocity = 0;

const gravity = 0.5;
const lift = -8;

function init(viewWidth, viewHeight) {
  size = Math.floor(viewWidth() * 0.12);
  size = Math.max(32, Math.round(size));

  x = Math.floor(viewWidth() * 0.2);
  y = Math.floor(viewHeight() * 0.45);
}

function reset(viewWidth, viewHeight) {
  velocity = 0;

  x = Math.floor(viewWidth() * 0.2);
  y = Math.floor(viewHeight() * 0.45);
}

function update() {
  velocity += gravity;
  y += velocity;

  y = Math.round(y);
  velocity = Math.round(velocity * 1000) / 1000;
}

function flap(gameOver, resetGame) {
  if (gameOver) {
    resetGame();
    return;
  }
  velocity = lift;
}

function draw(ctx) {
  const drawX = Math.round(x - size / 2);
  const drawY = Math.round(y - size / 2);

  ctx.drawImage(dragonImg, drawX, drawY, size, size);
}

function get() {
  return { x, y, size };
}

window.dragon = {
  init,
  reset,
  update,
  flap,
  draw,
  get,
  img: dragonImg
};