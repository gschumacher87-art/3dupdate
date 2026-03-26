 const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to window
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Dragon sprite
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // ensure path is correct

const FRAME_COUNT = 3;
let currentFrame = 0;
const FRAME_DURATION = 150; // ms per frame
let lastTime = 0;

let spriteWidth, spriteHeight;

// Center position
let dragonX, dragonY;

dragon.onload = () => {
    spriteWidth = dragon.width / FRAME_COUNT;
    spriteHeight = dragon.height;

    // center dragon
    dragonX = (canvas.width - spriteWidth) / 2;
    dragonY = (canvas.height - spriteHeight) / 2;

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

    // Draw current frame at center
    ctx.drawImage(
        dragon,
        currentFrame * spriteWidth, 0,
        spriteWidth, spriteHeight,
        dragonX, dragonY,
        spriteWidth, spriteHeight
    );

    requestAnimationFrame(animate);
}

dragon.onerror = () => {
    console.error("Failed to load dragon.png. Check path.");
};