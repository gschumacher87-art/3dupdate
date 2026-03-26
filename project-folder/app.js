const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dragon = new Image();
dragon.src = './dragon.png';

dragon.onload = () => {
  ctx.drawImage(dragon, 100, 100, 150, 150);
};

dragon.onerror = () => {
  console.log("IMAGE NOT FOUND");
};