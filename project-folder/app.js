const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full window canvas
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // relative to index.html

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 200;
let lastFrameTime = 0;

// Fixed position
let dragonX = canvas.width / 2 - 50; // roughly center
let dragonY = canvas.height / 2 - 50;

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
            currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight,
            dragonX, dragonY,
            spriteWidth, spriteHeight
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};