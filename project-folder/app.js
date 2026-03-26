// project-folder/app.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to 80% of window
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
const frameDuration = 200; // ms per frame
let lastFrameTime = 0;

let spriteWidth, spriteHeight;
// Dragon position (will stay centered)
let dragonX, dragonY;

dragon.onload = function() {
    spriteWidth = dragon.width / frameCount;
    spriteHeight = dragon.height;

    // Center the dragon
    dragonX = (canvas.width - spriteWidth) / 2;
    dragonY = (canvas.height - spriteHeight) / 2;

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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dragon at fixed position
    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0, // source x, y
        spriteWidth, spriteHeight,     // source width/height
        dragonX, dragonY,              // destination x, y
        spriteWidth, spriteHeight      // draw width/height
    );

    requestAnimationFrame(animate);
}