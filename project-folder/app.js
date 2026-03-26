const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Use the new perfectly centered dragon sprite
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon_centered.png';

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 150;
let lastFrameTime = 0;

// Dragon draw size
const dragonDrawWidth = 100;
const dragonDrawHeight = 100;

// Fixed position (center)
let dragonX = canvas.width / 2;
let dragonY = canvas.height / 2;

let spriteWidth, spriteHeight;

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

    // Black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw dragon at fixed position (no jiggle)
    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,
        spriteWidth, spriteHeight,
        dragonX - dragonDrawWidth / 2,
        dragonY - dragonDrawHeight / 2,
        dragonDrawWidth,
        dragonDrawHeight
    );

    requestAnimationFrame(animate);
}

dragon.onerror = function() {
    console.error("Failed to load dragon_centered.png. Check path.");
};