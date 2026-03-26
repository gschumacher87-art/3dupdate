const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// TEST DRAW (proves canvas works)
ctx.fillStyle = "red";
ctx.fillRect(50, 50, 200, 200);