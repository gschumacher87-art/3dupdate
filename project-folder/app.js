const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = 800;
canvas.height = 600;

// Load dragon sprite sheet
const dragon = new Image();
dragon.src = 'project-folder/dragon.png';

// Sprite properties
const frameCount = 3;          // total frames in the sprite
let currentFrame = 0;           // current frame to draw
const spriteWidth = 100;        // width of a single frame (adjust to your sprite)
const spriteHeight = 100;       // height of a single frame (adjust to your sprite)
const x = (canvas.width - spriteWidth) / 2;
const y = (canvas.height - spriteHeight) / 2;

// Animate the sprite
dragon.onload = function() {
    setInterval(() => {
        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw current frame
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,       // source x, y
            spriteWidth, spriteHeight,           // source width, height
            x, y,                                // destination x, y
            spriteWidth, spriteHeight            // destination width, height
        );

        // Next frame
        currentFrame = (currentFrame + 1) % frameCount;
    }, 200); // change frame every 200ms
};