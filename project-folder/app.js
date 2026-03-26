 const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Dragon sprite
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // Make sure path is correct

const FRAME_COUNT = 3;
let currentFrame = 0;
const FRAME_DURATION = 150; // ms per frame
let lastTime = 0;

let spriteWidth, spriteHeight;

// Offsets per frame to prevent jiggle
let frameOffsets = [];

dragon.onload = () => {
    spriteWidth = dragon.width / FRAME_COUNT;
    spriteHeight = dragon.height;

    // Manually set offsets for each frame (adjust these numbers to your sprite)
    frameOffsets = [
        { x: canvas.width/2 - spriteWidth/2, y: canvas.height/2 - spriteHeight/2 }, // Frame 0
        { x: canvas.width/2 - spriteWidth/2, y: canvas.height/2 - spriteHeight/2 }, // Frame 1
        { x: canvas.width/2 - spriteWidth/2, y: canvas.height/2 - spriteHeight/2 }  // Frame 2
    ];

    requestAnimationFrame(animate);
};

function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;

    if (delta > FRAME_DURATION) {
        currentFrame = (currentFrame + 1) % FRAME_COUNT;
        lastTime = timestamp;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw dragon using frame offsets
    const pos = frameOffsets[currentFrame];
    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,
        spriteWidth, spriteHeight,
        pos.x, pos.y,
        spriteWidth, spriteHeight
    );

    requestAnimationFrame(animate);
}

dragon.onerror = () => {
    console.error("Failed to load dragon.png. Check path.");
};