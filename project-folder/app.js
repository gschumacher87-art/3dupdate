const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Make canvas full window size
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;   // 80% of screen width
    canvas.height = window.innerHeight * 0.8; // 80% of screen height
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load dragon sprite sheet
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // adjust path if needed

// Sprite properties
const frameCount = 3;      // number of frames
let currentFrame = 0;

// Set this to **one frame's actual width/height in pixels**
const spriteWidth = 100;   
const spriteHeight = 100;  

// Animate dragon
dragon.onload = function() {
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaled size
        const scale = Math.min(canvas.width / spriteWidth / 3, canvas.height / spriteHeight / 3);
        const drawWidth = spriteWidth * scale;
        const drawHeight = spriteHeight * scale;
        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        // Draw current frame
        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,      // source x, y
            spriteWidth, spriteHeight,          // source width, height
            x, y,                               // destination x, y
            drawWidth, drawHeight                // destination width, height
        );

        // Next frame
        currentFrame = (currentFrame + 1) % frameCount;
    }, 200); // frame every 200ms
};