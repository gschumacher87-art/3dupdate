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

const frameCount = 3;        // number of frames in sprite
let currentFrame = 0;
let frameDirection = 1;       // ping-pong animation direction
const frameDuration = 150;    // ms per frame
let lastFrameTime = 0;

// Dragon physics
const dragonObj = {
    x: canvas.width / 4,
    y: canvas.height / 2,
    width: 0,
    height: 0,
    velocity: 0,
    gravity: 0.5,
    lift: -10
};

// Setup controls
setupControls(dragonObj, canvas);

dragon.onload = function () {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    // Scale dragon to roughly 1/5 canvas width
    const scale = (canvas.width / 5) / spriteWidth;
    dragonObj.width = spriteWidth * scale;
    dragonObj.height = spriteHeight * scale;

    // Optional per-frame offsets for visual alignment
    const frameOffsetX = [-5, 0, 5];

    function updateFrame() {
        currentFrame += frameDirection;
        if (currentFrame >= frameCount - 1 || currentFrame <= 0) frameDirection *= -1;
    }

    function animate(timestamp) {
        // Handle frame timing
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;
        if (delta >= frameDuration) {
            updateFrame();
            lastFrameTime = timestamp;
        }

        // Physics: gravity
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

        // Draw dragon
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            dragonObj.x + frameOffsetX[currentFrame],
            dragonObj.y,
            dragonObj.width,
            dragonObj.height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};