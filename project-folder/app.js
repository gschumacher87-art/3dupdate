import { Dragon } from './dragon.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let dragon = null;
const gridSize = 20;

// Load dragon sprite
const dragonSprite = new Image();
dragonSprite.src = './dragon.png';
dragonSprite.onload = () => {
  dragon = new Dragon(canvas.width / 2, canvas.height / 2, 64);
  dragon.sprite = dragonSprite;
  requestAnimationFrame(gameLoop);
};

// Direction
let direction = null;

// Keyboard controls
document.addEventListener('keydown', e => {
  if(e.code === 'ArrowUp') direction = 'up';
  else if(e.code === 'ArrowDown') direction = 'down';
  else if(e.code === 'ArrowLeft') direction = 'left';
  else if(e.code === 'ArrowRight') direction = 'right';
});

// Game loop
function gameLoop() {
  if(!dragon) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(direction) {
    dragon.move(direction, gridSize);
  }

  dragon.draw(ctx);

  requestAnimationFrame(gameLoop);
}