// project-folder/app.js
import { Dragon } from './dragon.js';
import { Collectible } from './collectible.js';
import { Pipe } from './obstacle.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const gridSize = 20;
let score = 0;
let gameRunning = false;

let dragon = null;
let pipes = [];
let collectibles = [];

let currentDirection = 'right';
let nextDirection = 'right';
let lastTick = 0;
const tickRate = 200; // game tick
const minPipeDistance = 250;

// --- Load dragon sprite ---
const dragonSprite = new Image();
dragonSprite.src = './dragon.png'; // relative to app.js
dragonSprite.onload = () => {
  dragon = new Dragon(5 * gridSize, 5 * gridSize);
  dragon.sprite = dragonSprite;
  requestAnimationFrame(gameLoop);
};

// --- Start button ---
document.getElementById('startBtn').addEventListener('click', () => {
  resetGame();
  gameRunning = true;
  document.getElementById('startBtn').style.display = 'none';
});

// --- Keyboard controls ---
document.addEventListener('keydown', e => {
  const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  const dir = dirMap[e.code];
  if (dir && !isOpposite(dir, currentDirection)) nextDirection = dir;
});

// --- Mobile buttons ---
['up','down','left','right'].forEach(dir => {
  const btn = document.getElementById(dir);
  btn.addEventListener('click', () => { if (!isOpposite(dir, currentDirection)) nextDirection = dir; });
  btn.addEventListener('touchstart', e => { e.preventDefault(); if (!isOpposite(dir, currentDirection)) nextDirection = dir; });
});

// --- Helpers ---
function isOpposite(dir1, dir2){
  return (dir1==='up' && dir2==='down')||(dir1==='down'&&dir2==='up')||
         (dir1==='left' && dir2==='right')||(dir1==='right'&&dir2==='left');
}

function resetGame(){
  score = 0;
  dragon = new Dragon(5*gridSize,5*gridSize);
  dragon.sprite = dragonSprite;
  currentDirection = 'right';
  nextDirection = 'right';
  pipes = [];
  collectibles = [];
  lastTick = 0;
  gameRunning = true;
}

function shouldSpawnPipe(){
  if(!pipes.length) return true;
  const lastPipe = pipes[pipes.length-1];
  return lastPipe.x < canvas.width - minPipeDistance;
}

// --- Game loop ---
function gameLoop(timestamp){
  if(!dragon) return; // wait for sprite

  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(!lastTick) lastTick = timestamp;
  if(gameRunning && timestamp - lastTick > tickRate){
    lastTick = timestamp;

    // Move dragon
    currentDirection = nextDirection;
    dragon.move(currentDirection, gridSize);

    // Move pipes
    pipes.forEach(p => p.move());

    // Check collisions with pipes
    pipes.forEach(p => {
      if(p.checkCollision(dragon)){
        gameRunning = false;
        alert('Game Over!');
      }
      if(!p.scored && dragon.x > p.x + p.width){
        score++;
        dragon.grow();
        p.scored = true;
      }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(p => p.x + p.width > 0);

    // Check collectibles
    collectibles.forEach(c => {
      if(c.checkCollision(dragon)){
        score++;
        dragon.grow();
        c.collected = true;
      }
    });
    collectibles = collectibles.filter(c => !c.collected);

    // Spawn new pipe if needed
    if(shouldSpawnPipe()){
      const topHeight = Math.random() * (canvas.height - 150 - 100) + 50;
      pipes.push(new Pipe(canvas.width, topHeight));
    }
  }

  // Draw everything
  dragon.draw(ctx);
  pipes.forEach(p => p.draw(ctx, canvas.height));
  collectibles.forEach(c => c.draw(ctx));

  // Update score
  document.getElementById('score').textContent = 'Score: ' + score;

  requestAnimationFrame(gameLoop);
}