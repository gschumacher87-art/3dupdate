const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;  // fixed size for now
canvas.height = 600;

const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // make sure this path is correct

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 200;
let lastFrameTime = 0;

// Fixed position
let dragonX = 300;
let dragonY = 200;

// Draw when loaded
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

        // Draw dragon at fixed position (flapping only)
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,  // source x, y
            spriteWidth, spriteHeight,      // source width/height
            dragonX, dragonY,               // destination x, y
            spriteWidth, spriteHeight       // draw at natural size
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};