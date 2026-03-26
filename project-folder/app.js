import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

const frameCount = 3;
let currentFrame = 0;
let frameDirection = 1;       // ping-pong direction
const frameDuration = 1500;
let lastFrameTime = 0;

const dragonObj = {
    x: canvas.width / 4,
    y: canvas.height / 2,
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

    const scale = (canvas.width / 5) / spriteWidth;
    dragonObj.width = spriteWidth * scale;
    dragonObj.height = spriteHeight * scale;

    // Manual offsets to keep body visually centered
    const frameOffsets = [
        { x: -20, y: 0 },   // frame 0
        { x: 0, y: 0 }, // frame 1 (wings right)
        { x: 0, y: 0 }    // frame 2 (wings left)
    ];

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        if (delta >= frameDuration) {
            currentFrame += frameDirection;
            if (currentFrame === frameCount - 1 || currentFrame === 0) frameDirection *= -1; // reverse ping-pong
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

        // Round positions
        const drawX = Math.round(dragonObj.x + frameOffsets[currentFrame].x);
        const drawY = Math.round(dragonObj.y + frameOffsets[currentFrame].y);

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
            drawX,
            drawY,
            dragonObj.width,
            dragonObj.height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};