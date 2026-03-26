const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load dragon sprite (3 frames horizontal)
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // relative to index.html

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 150;
let lastFrameTime = 0;

// Dragon position and fixed draw size
let dragonX, dragonY;
const dragonDrawWidth = 100;   // fixed width
const dragonDrawHeight = 100;  // fixed height

let spriteWidth, spriteHeight;

dragon.onload = function() {
    spriteWidth = dragon.width / frameCount;
    spriteHeight = dragon.height;

    // Center vertically, left for Flappy Bird style
    dragonX = canvas.width / 6;
    dragonY = canvas.height / 2 - dragonDrawHeight / 2;

    requestAnimationFrame(animate);
};

function animate(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const delta = timestamp - lastFrameTime;

    if (delta >= frameDuration) {
        currentFrame = (currentFrame + 1) % frameCount;
        lastFrameTime = timestamp;
    }

    // Black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dragon with fixed size
    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,
        spriteWidth, spriteHeight,
        dragonX, dragonY,
        dragonDrawWidth, dragonDrawHeight
    );

    requestAnimationFrame(animate);
}

// Error handling if image fails to load
dragon.onerror = function() {
    console.error("Failed to load dragon.png. Make sure the path is correct.");
};