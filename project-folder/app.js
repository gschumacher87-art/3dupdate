const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Dragon sprite
const dragonSprite = new Image();
dragonSprite.src = './dragon.png'; // relative to app.js

dragonSprite.onload = () => {
  // Draw once when loaded
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const x = (canvas.width - dragonSprite.width) / 2;
  const y = (canvas.height - dragonSprite.height) / 2;

  ctx.drawImage(dragonSprite, x, y);
};