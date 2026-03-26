import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameWidth;
let gameHeight;

function resizeCanvas() {
    gameWidth = window.innerWidth * 0.8;
    gameHeight = window.innerHeight * 0.8;
    canvas.width = gameWidth;
    canvas.height = gameHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ===== DRAGON SPRITE =====
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';
const frameCount = 3;
let currentFrame = 0;
const frameDuration = 250;
let lastFrameTime = 0;

// Dragon physics + position
const dragonObj = {
    xRatio: 0.25, // horizontal screen position
    y: 0,
    width: 0,
    height: 0,
    velocity: 0,
    gravity: 0.5,
    lift: -10
};

// Setup input controls
setupControls(dragonObj, canvas);

dragon.onload = function () {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    function updateSize() {
        const scale = (gameWidth / 5) / spriteWidth;
        dragonObj.width = spriteWidth * scale;
        dragonObj.height = spriteHeight * scale;
    }

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        // Advance frame
        if (delta >= frameDuration) {
            currentFrame = (currentFrame + 1) % frameCount;
            lastFrameTime = timestamp;
        }

        updateSize();

        // Physics
        dragonObj.velocity += dragonObj.gravity;
        dragonObj.y += dragonObj.velocity;

        // Boundaries
        if (dragonObj.y + dragonObj.height > gameHeight) {
            dragonObj.y = gameHeight - dragonObj.height;
            dragonObj.velocity = 0;
        }
        if (dragonObj.y < 0) {
            dragonObj.y = 0;
            dragonObj.velocity = 0;
        }

        // Stable horizontal X
        const drawX = Math.round(gameWidth * dragonObj.xRatio - dragonObj.width / 2);
        const drawY = Math.round(dragonObj.y);

        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, gameWidth, gameHeight);

        // Draw the dragon frame
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0, // source frame
            spriteWidth, spriteHeight,
            drawX, drawY,                  // destination on canvas
            dragonObj.width, dragonObj.height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};
