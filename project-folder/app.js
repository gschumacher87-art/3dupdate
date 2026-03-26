const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full window canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load dragon sprite (3 frames horizontal)
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // your sprite

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 150; // flap speed
let lastFrameTime = 0;

// Dragon size (double Flappy Bird style)
const dragonWidth = 100;
const dragonHeight = 100;

// Dragon position (slightly more left)
let dragonX = canvas.width / 6; // closer to left edge
let dragonY = canvas.height / 2;

dragon.onload = function() {
    requestAnimationFrame(animate);
};

function animate(timestamp) {
    if (!lastFrameTime) lastFrameTime = timestamp;
    const delta = timestamp - lastFrameTime;

    // Update frame for flapping
    if (delta >= frameDuration) {
        currentFrame = (currentFrame + 1) % frameCount;
        lastFrameTime = timestamp;
    }

    // Clear canvas (black background)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dragon
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,
        spriteWidth, spriteHeight,
        dragonX, dragonY,
        dragonWidth, dragonHeight
    );

    requestAnimationFrame(animate);
}