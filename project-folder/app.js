import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas dynamically with devicePixelRatio
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * 0.8 * dpr;
    canvas.height = window.innerHeight * 0.8 * dpr;
    canvas.style.width = `${window.innerWidth * 0.8}px`;
    canvas.style.height = `${window.innerHeight * 0.8}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Dragon sprite
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';
const frameCount = 3;
let currentFrame = 0;
let frameDirection = 1;       // ping-pong
const frameDuration = 250;
let lastFrameTime = 0;

// Dragon object
const dragonObj = {
    xRatio: 0.25, // relative x-position (1/4 of canvas width)
    y: 0,
    width: 0,
    height: 0,
    velocity: 0,
    gravity: 0.5,
    lift: -10
};

setupControls(dragonObj, canvas);

dragon.onload = function () {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    // Function to get scale relative to canvas
    function getScale() {
        return (canvas.width / 5) / spriteWidth;
    }

    // Scaled manual offsets for animation frames
    function getFrameOffsets(scale) {
        return [
            { x: -30 * scale, y: 0 },
            { x: -5 * scale, y: 0 },
            { x: 32 * scale, y: 0 }
        ];
    }

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        if (delta >= frameDuration) {
            currentFrame += frameDirection;
            if (currentFrame === frameCount - 1 || currentFrame === 0) frameDirection *= -1;
            lastFrameTime = timestamp;
        }

        // Physics
        dragonObj.velocity += dragonObj.gravity;
        dragonObj.y += dragonObj.velocity;

        if (dragonObj.y + dragonObj.height > canvas.height) {
            dragonObj.y = canvas.height - dragonObj.height;
            dragonObj.velocity = 0;
        }
        if (dragonObj.y < 0) {
            dragonObj.y = 0;
            dragonObj.velocity = 0;
        }

        // Dynamic scaling & offsets
        const scale = getScale();
        dragonObj.width = spriteWidth * scale;
        dragonObj.height = spriteHeight * scale;
        const frameOffsets = getFrameOffsets(scale);

        // Draw position relative to canvas
        const drawX = Math.round(canvas.width * dragonObj.xRatio + frameOffsets[currentFrame].x);
        const drawY = Math.round(dragonObj.y + frameOffsets[currentFrame].y);

        // Clear background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw dragon frame
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth,
            0,
            spriteWidth,
            spriteHeight,
            drawX,
            drawY,
            dragonObj.width,
            dragonObj.height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};