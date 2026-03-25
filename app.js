import { Dragon } from './dragon.js';
import { Collectible } from './collectible.js';
import { Pipe } from './obstacle.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const gridSize = 20;
let score = 0;
let gameRunning = false;

let dragon = new Dragon(5 * gridSize, 5 * gridSize);
let pipes = [];
let collectibles = [];
let lastPipeTime = 0;
let pipeInterval = 2000;

// Snake-style directions
let currentDirection = 'right';
let nextDirection = 'right';

// Movement tick
const tickRate = 200; // slower for proper pacing
let lastTick = 0;

// Start button
document.getElementById('startBtn').addEventListener('click', () => {
  resetGame();
  gameRunning = true;
});

// Keyboard controls
document.addEventListener('keydown', e => {
  const dirMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right'
  };
  const dir = dirMap[e.code];
  if (dir && !isOpposite(dir, currentDirection)) nextDirection = dir;
});

// Mobile buttons
['up', 'down', 'left', 'right'].forEach(dir => {
  const btn = document.getElementById(dir);
  btn.addEventListener('click', () => { if (!isOpposite(dir, currentDirection)) nextDirection = dir; });
  btn.addEventListener('touchstart', e => { e.preventDefault(); if (!isOpposite(dir, currentDirection)) nextDirection = dir; });
});

function isOpposite(dir1, dir2) {
  return (dir1 === 'up' && dir2 === 'down') ||
         (dir1 === 'down' && dir2 === 'up') ||
         (dir1 === 'left' && dir2 === 'right') ||
         (dir1 === 'right' && dir2 === 'left');
}

function resetGame() {
  score = 0;
  dragon = new Dragon(5 * gridSize, 5 * gridSize);
  currentDirection = 'right';
  nextDirection = 'right';
  pipes = [];
  collectibles = [];
  lastPipeTime = 0;
  lastTick = 0;
  gameRunning = true;
}

// --- Game loop ---
function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // --- Tick updates ---
  if (!lastTick) lastTick = timestamp;
  if (gameRunning && timestamp - lastTick > tickRate) {
    lastTick = timestamp;

    // Move dragon
    currentDirection = nextDirection;
    dragon.move(currentDirection, gridSize);

    // Move pipes
    pipes.forEach(p => p.move());

    // Check collisions with pipes
    pipes.forEach(p => {
      if (p.checkCollision(dragon)) {
        gameRunning = false;
        alert('Game Over!');
      }
      if (!p.scored && dragon.x > p.x + p.width) {
        score++;
        dragon.grow(1); // grow gradually
        p.scored = true;
      }
    });

    // Remove off-screen pipes
    pipes = pipes.filter(p => p.x + p.width > 0);

    // Check collectibles
    collectibles.forEach(c => {
      if (c.checkCollision(dragon)) {
        score++;
        dragon.grow(1);
        c.collected = true;
      }
    });

    // Remove collected collectibles
    collectibles = collectibles.filter(c => !c.collected);

    // Generate new pipe
    if (!lastPipeTime || timestamp - lastPipeTime > pipeInterval) {
      let topHeight = Math.random() * (canvas.height - 150 - 100) + 50;
      pipes.push(new Pipe(canvas.width, topHeight));
      lastPipeTime = timestamp;
    }
  }

  // --- Draw everything ---
  dragon.draw(ctx);
  pipes.forEach(p => p.draw(ctx, canvas.height));
  collectibles.forEach(c => c.draw(ctx));

  // Update score
  document.getElementById('score').textContent = 'Score: ' + score;

  requestAnimationFrame(gameLoop);
}

// Start loop immediately
gameLoop();