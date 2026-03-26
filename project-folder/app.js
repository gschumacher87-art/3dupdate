const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dragon = new Image();
dragon.src = 'project-folder/dragon.png';

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 150;
let lastFrameTime = 0;

// Dragon scale factor (for Flappy Bird style)
const scale = 2; // double size

let dragonX = canvas.width / 6;
let dragonY = canvas.height / 2;

let spriteWidth, spriteHeight; // per frame width/height

dragon.onload = function() {
    spriteWidth = dragon.width / frameCount;
    spriteHeight = dragon.height;

    requestAnimationFrame(animate);
};

function animate(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const delta = timestamp - lastFrameTime;

    if (delta >= frameDuration) {
        currentFrame = (currentFrame + 1) % frameCount;
        lastFrameTime = timestamp;
    }

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dragon, scaling proportionally
    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,  // source x, y
        spriteWidth, spriteHeight,      // source width/height
        dragonX, dragonY,               // destination x, y
        spriteWidth * scale,            // destination width
        spriteHeight * scale            // destination height
    );

    requestAnimationFrame(animate);
}