import { Dragon } from './dragon.js';
import { Pipe } from './obstacle.js';
import { Collectible } from './collectible.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

let score = 0;
let pipes = [];
let collectibles = [];
let lastPipeTime = 0;
let pipeInterval = 2000;
let gameRunning = false;

// Grid settings
const gridSize = 20; // Snake-style grid step

const dragon = new Dragon(5 * gridSize, 5 * gridSize, gridSize, gridSize, gridSize);

// Direction queue to prevent instant reverse
let nextDirection = 'right';

// Start button
document.getElementById('startBtn').addEventListener('click', () => {
  resetGame();
  gameRunning = true;
});

// Keyboard controls
document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'ArrowUp': if (dragon.direction !== 'down') nextDirection = 'up'; break;
    case 'ArrowDown': if (dragon.direction !== 'up') nextDirection = 'down'; break;
    case 'ArrowLeft': if (dragon.direction !== 'right') nextDirection = 'left'; break;
    case 'ArrowRight': if (dragon.direction !== 'left') nextDirection = 'right'; break;
  }
});

// On-screen buttons (touch + click)
['up','down','left','right'].forEach(dir => {
  const btn = document.getElementById(dir);
  btn.addEventListener('click', () => { if (validDirection(dir)) nextDirection = dir; });
  btn.addEventListener('touchstart', e => { e.preventDefault(); if (validDirection(dir)) nextDirection = dir; });
});

function validDirection(dir) {
  return !(
    (dir === 'up' && dragon.direction === 'down') ||
    (dir === 'down' && dragon.direction === 'up') ||
    (dir === 'left' && dragon.direction === 'right') ||
    (dir === 'right' && dragon.direction === 'left')
  );
}

function resetGame() {
  score = 0;
  dragon.x = 5 * gridSize;
  dragon.y = 5 * gridSize;
  dragon.tail = [];
  dragon.maxTail = 5;
  dragon.direction = 'right';
  nextDirection = 'right';
  pipes = [];
  collectibles = [];
  lastPipeTime = 0;
}

function gameLoop(timestamp) {
  if (!gameRunning) return requestAnimationFrame(gameLoop);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update direction
  dragon.direction = nextDirection;

  // Move dragon
  dragon.move(dragon.direction);
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

    if (pipes[i].checkCollision(dragon)) {
      gameRunning = false;
      alert('Game Over!');
    }

    if (!pipes[i].scored && dragon.x > pipes[i].x + pipes[i].width) {
      score++;
      dragon.grow();
      pipes[i].scored = true;
    }

    if (pipes[i].x + pipes[i].width < 0) pipes.splice(i,1);
  }

  // Collectibles
  collectibles.forEach(c => {
    c.draw(ctx);
    if (c.checkCollision(dragon)) {
      score++;
      dragon.grow();
    }
  });

  document.getElementById('score').textContent = 'Score: ' + score;

  requestAnimationFrame(gameLoop);
}

gameLoop();
