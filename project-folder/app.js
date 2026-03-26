// project-folder/app.js
import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full window canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Dragon sprite
const dragon = new Image();
dragon.src = 'project-folder/dragon.png';

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 200; // ms per frame
let lastFrameTime = 0;

// Dragon physics
const dragonObj = {
    x: canvas.width / 4, // left quarter of screen
    y: canvas.height / 2,
    width: 0, // will be set after load
    height: 0,
    velocity: 0,
    gravity: 0.5,
    lift: -10
};

// Set up controls
setupControls(dragonObj, canvas);

dragon.onload = function() {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    // Precompute scale for drawing
    const scale = Math.min(canvas.width / spriteWidth / 3, canvas.height / spriteHeight / 3);
    dragonObj.width = spriteWidth * scale;
    dragonObj.height = spriteHeight * scale;

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        if (delta >= frameDuration) {
            currentFrame = (currentFrame + 1) % frameCount;
            lastFrameTime = timestamp;
        }

        // Physics
        dragonObj.velocity += dragonObj.gravity;
        dragonObj.y += dragonObj.velocity;

        // Prevent leaving canvas
        if (dragonObj.y + dragonObj.height > canvas.height) {
            dragonObj.y = canvas.height - dragonObj.height;
            dragonObj.velocity = 0;
        }
        if (dragonObj.y < 0) {
            dragonObj.y = 0;
            dragonObj.velocity = 0;
        }

        // Black background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- Draw dragon centered ---
        const centerX = dragonObj.x + dragonObj.width / 2;
        const centerY = dragonObj.y + dragonObj.height / 2;

        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,  // source x, y
            spriteWidth, spriteHeight,      // source width, height
            centerX - dragonObj.width / 2,  // destination x
            centerY - dragonObj.height / 2, // destination y
            dragonObj.width,                // destination width
            dragonObj.height                // destination height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};