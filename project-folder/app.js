// project-folder/app.js

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- Load dragon sprite sheet ---
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png'; // relative to index.html

// Sprite animation setup
const frameWidth = 64;
const frameHeight = 64;
const totalFrames = 3;
let frameIndex = 0;

// Animation loop
function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw current frame in center
  ctx.drawImage(
    dragonSprite,
    frameIndex * frameWidth, 0,  // source x, y
    frameWidth, frameHeight,     // source width, height
    canvas.width / 2 - frameWidth / 2,
    canvas.height / 2 - frameHeight / 2,
    frameWidth,
    frameHeight
  );

  // Advance frame
  frameIndex = (frameIndex + 1) % totalFrames;

  requestAnimationFrame(drawFrame);
}

// Start animation after sprite loads
dragonSprite.onload = () => {
  console.log('Sprite loaded!');
  drawFrame();
};

dragonSprite.onerror = () => console.error('Failed to load sprite. Check path!');