const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // your 3-frame dragon sprite

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 200; // ms per frame
let lastFrameTime = 0;

// Fixed dragon position (won’t move unless you change these)
let dragonX = 300;
let dragonY = 200;
let dragonScale = 1.5;

dragon.onload = function() {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        // Only update animation frame
        if (delta >= frameDuration) {
            currentFrame = (currentFrame + 1) % frameCount;
            lastFrameTime = timestamp;
        }

        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw dragon at fixed position
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0, // source x
            spriteWidth, spriteHeight,     // source width/height
            dragonX, dragonY,              // fixed canvas position
            spriteWidth * dragonScale,
            spriteHeight * dragonScale
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};