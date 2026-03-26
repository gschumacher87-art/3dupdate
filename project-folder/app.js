import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Store CSS (game) size separately
let gameWidth;
let gameHeight;

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    gameWidth = window.innerWidth * 0.8;
    gameHeight = window.innerHeight * 0.8;

    // Set internal resolution (sharp)
    canvas.width = gameWidth * dpr;
    canvas.height = gameHeight * dpr;

    // Set visual size
    canvas.style.width = gameWidth + 'px';
    canvas.style.height = gameHeight + 'px';

    // Reset + scale
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Dragon sprite
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

const frameCount = 3;
let currentFrame = 0;
let frameDirection = 1;
const frameDuration = 250;
let lastFrameTime = 0;

const dragonObj = {
    xRatio: 0.25,
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

    function getScale() {
        return (gameWidth / 5) / spriteWidth;
    }

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

        // Physics (USE gameHeight, NOT canvas.height)
        dragonObj.velocity += dragonObj.gravity;
        dragonObj.y += dragonObj.velocity;

        const scale = getScale();
        dragonObj.width = spriteWidth * scale;
        dragonObj.height = spriteHeight * scale;

        if (dragonObj.y + dragonObj.height > gameHeight) {
            dragonObj.y = gameHeight - dragonObj.height;
            dragonObj.velocity = 0;
        }

        if (dragonObj.y < 0) {
            dragonObj.y = 0;
            dragonObj.velocity = 0;
        }

        const frameOffsets = getFrameOffsets(scale);

        const drawX = Math.round(gameWidth * dragonObj.xRatio + frameOffsets[currentFrame].x);
        const drawY = Math.round(dragonObj.y + frameOffsets[currentFrame].y);

        // Clear using game size
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, gameWidth, gameHeight);

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