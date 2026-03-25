import { Dragon } from './dragon.js';
import { Collectible } from './collectible.js';
import { Pipe } from './obstacle.js';

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

const dragon = new Dragon(100, canvas.height / 2);

// Start button
document.getElementById('startBtn').addEventListener('click', () => {
  resetGame();
  gameRunning = true;
});

// Arrow keys
document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'ArrowUp': dragon.move('up'); break;
    case 'ArrowDown': dragon.move('down'); break;
    case 'ArrowLeft': dragon.move('left'); break;
    case 'ArrowRight': dragon.move('right'); break;
  }
});

// Mobile buttons
['up','down','left','right'].forEach(dir => {
  document.getElementById(dir).addEventListener('touchstart', e => { e.preventDefault(); dragon.move(dir); });
  document.getElementById(dir).addEventListener('click', () => dragon.move(dir));
});

function resetGame() {
  score = 0;
  dragon.x = 100;
  dragon.y = canvas.height / 2;
  dragon.tail = [];
  dragon.maxTail = 5;
  pipes = [];
  collectibles = [];
  lastPipeTime = 0;
}

function gameLoop(timestamp) {
  if (!gameRunning) return requestAnimationFrame(gameLoop);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Auto forward
  dragon.move('right');
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

  // Collectibles (optional)
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