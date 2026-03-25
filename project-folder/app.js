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
// Path **relative to index.html** because <script> is in project-folder/
dragonSprite.src = 'project-folder/dragon.png';

// Simple test: draw once after load
dragonSprite.onload = () => {
  console.log('Sprite loaded!', dragonSprite.width, dragonSprite.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw the sprite at center, scale to 64x64
  ctx.drawImage(
    dragonSprite,
    canvas.width / 2 - 32,
    canvas.height / 2 - 32,
    64,
    64
  );
};

dragonSprite.onerror = () => console.error('Failed to load sprite. Check path!');