const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full window canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load dragon sprite
const dragon = new Image();
dragon.src = 'project-folder/dragon.png';

const frameCount = 3;   // number of frames
let currentFrame = 0;

dragon.onload = function() {
    // Auto-detect frame size (assuming frames are horizontal)
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Scale to fit canvas
        const scale = Math.min(canvas.width / spriteWidth / 3, canvas.height / spriteHeight / 3);
        const drawWidth = spriteWidth * scale;
        const drawHeight = spriteHeight * scale;
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,  // source x, y
            spriteWidth, spriteHeight,      // source width/height
            x, y,                           // destination x/y
            drawWidth, drawHeight            // destination width/height
        );

        currentFrame = (currentFrame + 1) % frameCount;
    }, 200);
};