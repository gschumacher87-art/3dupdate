const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let width = window.innerWidth * 0.8;
let height = window.innerHeight * 0.8;
canvas.width = width;
canvas.height = height;

const gravity = 0.6;
const flapPower = -10;
let score = 0;

// Dragon setup
const dragon = {
  x: 100,
  y: height / 2,
  width: 40,
  height: 40,
  velocity: 0,
  tail: [],
  maxTail: 5
};

// Pipes
const pipes = [];
const pipeWidth = 60;
const gapHeight = 150;
let pipeInterval = 2000;
let lastPipeTime = 0;

// Controls
document.addEventListener('keydown', e => {
  if (e.code === 'Space') dragon.velocity = flapPower;
});
document.addEventListener('click', () => dragon.velocity = flapPower);

// Game loop
function gameLoop(timestamp) {
  ctx.clearRect(0, 0, width, height);

  // Dragon physics
  dragon.velocity += gravity;
  dragon.y += dragon.velocity;

  // Boundaries
  if (dragon.y < 0) dragon.y = 0;
  if (dragon.y + dragon.height > height) {
    dragon.y = height - dragon.height;
    dragon.velocity = 0;
  }

  // Tail
  dragon.tail.unshift({ x: dragon.x, y: dragon.y });
  if (dragon.tail.length > dragon.maxTail) dragon.tail.pop();

  // Draw tail
  for (let i = 0; i < dragon.tail.length; i++) {
    ctx.fillStyle = `rgba(0,255,0,${1 - i / dragon.tail.length})`;
    ctx.fillRect(dragon.tail[i].x, dragon.tail[i].y, dragon.width, dragon.height);
  }

  // Draw dragon
  ctx.fillStyle = '#00ff00';
  ctx.fillRect(dragon.x, dragon.y, dragon.width, dragon.height);

  // Pipes generation
  if (!lastPipeTime || timestamp - lastPipeTime > pipeInterval) {
    let topHeight = Math.random() * (height - gapHeight - 100) + 50;
    pipes.push({ x: width, topHeight });
    lastPipeTime = timestamp;
  }

  // Move pipes
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].x -= 3;

    // Draw top pipe
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(pipes[i].x, 0, pipeWidth, pipes[i].topHeight);
    // Draw bottom pipe
    ctx.fillRect(pipes[i].x, pipes[i].topHeight + gapHeight, pipeWidth, height - pipes[i].topHeight - gapHeight);

    // Collision
    if (
      dragon.x + dragon.width > pipes[i].x &&
      dragon.x < pipes[i].x + pipeWidth &&
      (dragon.y < pipes[i].topHeight || dragon.y + dragon.height > pipes[i].topHeight + gapHeight)
    ) {
      resetGame();
      return;
    }

    // Passed pipe
    if (!pipes[i].scored && dragon.x > pipes[i].x + pipeWidth) {
      score++;
      dragon.maxTail++; // grow tail when passing pipe
      pipes[i].scored = true;
    }

    // Remove off-screen pipes
    if (pipes[i].x + pipeWidth < 0) pipes.splice(i, 1);
  }

  // Update score
  document.getElementById('score').textContent = 'Score: ' + score;

  requestAnimationFrame(gameLoop);
}

// Reset
function resetGame() {
  score = 0;
  dragon.y = height / 2;
  dragon.velocity = 0;
  dragon.tail = [];
  dragon.maxTail = 5;
  pipes.length = 0;
}

gameLoop();
