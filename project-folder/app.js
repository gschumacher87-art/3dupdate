const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Set canvas size explicitly
canvas.width = 400;
canvas.height = 400;

// Dragon sprite
const dragonSprite = new Image();
dragonSprite.src = './dragon.png'; // relative to app.js

dragonSprite.onload = () => {
  // Draw sprite centered
  const x = (canvas.width - 64) / 2; // assuming dragon.png is 64x64
  const y = (canvas.height - 64) / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(dragonSprite, x, y, 64, 64);
};