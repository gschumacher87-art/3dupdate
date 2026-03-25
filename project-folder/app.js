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

// --- Load dragon sprite ---
const dragonSprite = new Image();
dragonSprite.src = 'project-folder/dragon.png';

// Sprite sheet settings
const frameWidth = 64;   // width of a single dragon in the sheet
const frameHeight = 64;  // height of a single dragon
let frameIndex = 0;      // current frame to display
const totalFrames = 3;   // number of frames in the sheet

// Draw function
function drawDragon() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw only one frame
  ctx.drawImage(
    dragonSprite,
    frameIndex * frameWidth, 0, // source x, y
    frameWidth, frameHeight,    // source width, height
    canvas.width / 2 - frameWidth / 2, // canvas x
    canvas.height / 2 - frameHeight / 2, // canvas y
    frameWidth, frameHeight     // destination width, height
  );

  // Move to next frame
  frameIndex = (frameIndex + 1) % totalFrames;

  requestAnimationFrame(drawDragon);
}

// Start after sprite loads
dragonSprite.onload = () => {
  console.log('Sprite loaded!', dragonSprite.width, dragonSprite.height);
  drawDragon();
};

dragonSprite.onerror = () => console.error('Failed to load sprite. Check path!');