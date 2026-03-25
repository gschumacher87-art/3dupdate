const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Load dragon image
const dragon = new Image();
dragon.src = 'project-folder/dragon.png';

dragon.onload = function() {
    // Draw dragon at center
    const x = (canvas.width - dragon.width) / 2;
    const y = (canvas.height - dragon.height) / 2;
    ctx.drawImage(dragon, x, y);
};