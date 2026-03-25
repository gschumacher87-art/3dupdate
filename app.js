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

// Snake-style direction
let currentDirection = 'right';
let nextDirection = 'right';

// Movement tick
const tickRate = 150; // ms per move, adjust for speed
let lastTick = 0;

// Start button
document.getElementById('startBtn').addEventListener('click', () => {
  resetGame();
  gameRunning = true;
});

// Keyboard controls
document.addEventListener('keydown', e => {
  const dir = { 'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right' }[e.code];
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

// Main game loop
function gameLoop(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Only move dragon on tick if game is running
  if (gameRunning) {
    if (!lastTick) lastTick = timestamp;
    if (timestamp - lastTick > tickRate) {
      currentDirection = nextDirection;
      dragon.move(currentDirection, gridSize);
      lastTick = timestamp;
    }
  }

  // Draw dragon
  dragon.draw(ctx);

  // Pipes
  if (!lastPipeTime || timestamp - lastPipeTime > pipeInterval) {
    let topHeight = Math.random() * (canvas.height - 150 - 100) + 50;
    pipes.push(new Pipe(canvas.width, topHeight));
    lastPipeTime = timestamp;
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].move();
    pipes[i].draw(ctx, canvas.height);

    if (gameRunning && pipes[i].checkCollision(dragon)) {
      gameRunning = false;
      alert('Game Over!');
    }

    if (!pipes[i].scored && dragon.x > pipes[i].x + pipes[i].width) {
      score++;
      dragon.grow();
      pipes[i].scored = true;
    }

    if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
  }

  // Collectibles
  collectibles.forEach(c => {
    c.draw(ctx);
    if (gameRunning && c.checkCollision(dragon)) {
      score++;
      dragon.grow();
    }
  });

  // Update score
  document.getElementById('score').textContent = 'Score: ' + score;

  requestAnimationFrame(gameLoop);
}

// Start the loop immediately so canvas renders
gameLoop();
