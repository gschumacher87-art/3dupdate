import { setupControls } from './controls.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameWidth = window.innerWidth * 0.8;
let gameHeight = window.innerHeight * 0.8;

canvas.width = gameWidth;
canvas.height = gameHeight;

window.addEventListener('resize', () => {
    gameWidth = window.innerWidth * 0.8;
    gameHeight = window.innerHeight * 0.8;
    canvas.width = gameWidth;
    canvas.height = gameHeight;
});

// Dragon sprite
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 250;
let lastFrameTime = 0;

// Dragon object
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

dragon.onload = () => {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    const scale = (gameWidth / 5) / spriteWidth;
    dragonObj.width = spriteWidth * scale;
    dragonObj.height = spriteHeight * scale;

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        if (delta >= frameDuration) {
            currentFrame = (currentFrame + 1) % frameCount; // simple looping
            lastFrameTime = timestamp;
        }

        // Physics
        dragonObj.velocity += dragonObj.gravity;
        dragonObj.y += dragonObj.velocity;

        if (dragonObj.y + dragonObj.height > gameHeight) {
            dragonObj.y = gameHeight - dragonObj.height;
            dragonObj.velocity = 0;
        }
        if (dragonObj.y < 0) {
            dragonObj.y = 0;
            dragonObj.velocity = 0;
        }

        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, gameWidth, gameHeight);

        // Draw sprite centered at X
        const drawX = Math.round(gameWidth * dragonObj.xRatio - dragonObj.width / 2);
        const drawY = Math.round(dragonObj.y);

        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight,
            drawX, drawY,
            dragonObj.width, dragonObj.height
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};
