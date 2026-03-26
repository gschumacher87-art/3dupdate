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
const frameDuration = 2500;
let lastFrameTime = 0;

// Dragon fixed size
const dragonDrawWidth = 100;
const dragonDrawHeight = 100;

// Center-ish starting positions (Flappy Bird style)
const frameOffsets = [
    { x: canvas.width / 0, y: canvas.height / 2 }, // Frame 0
    { x: canvas.width / 2, y: canvas.height / 2 }, // Frame 1
    { x: canvas.width / 6, y: canvas.height / 2 }  // Frame 2
];

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

    // Use the X/Y for the current frame
    const pos = frameOffsets[currentFrame];

    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,
        spriteWidth, spriteHeight,
        pos.x - dragonDrawWidth / 2, // center align
        pos.y - dragonDrawHeight / 2,
        dragonDrawWidth,
        dragonDrawHeight
    );

    requestAnimationFrame(animate);
}

dragon.onerror = function() {
    console.error("Failed to load dragon.png. Check path.");
};