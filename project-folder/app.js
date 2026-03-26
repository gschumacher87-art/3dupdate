const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full window canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load dragon sprite (3 frames horizontally)
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // make sure this path is correct

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 200; // ms per frame
let lastFrameTime = 0;

// Fixed dragon position
let dragonX = 300; // adjust X
let dragonY = 200; // adjust Y
let dragonScale = 1.5;

dragon.onload = function() {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        if (delta >= frameDuration) {
            currentFrame = (currentFrame + 1) % frameCount;
            lastFrameTime = timestamp;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw dragon at fixed position
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,  // source x, y
            spriteWidth, spriteHeight,      // source width/height
            dragonX, dragonY,               // canvas position
            spriteWidth * dragonScale,      // draw width
            spriteHeight * dragonScale      // draw height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};