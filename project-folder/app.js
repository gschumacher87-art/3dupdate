const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full window canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load dragon PNG sprite (3 frames horizontal)
const dragon = new Image();
dragon.src = 'project-folder/dragon.png'; // your dragon

const frameCount = 3;
let currentFrame = 0;
const frameDuration = 200; // ms per frame
let lastFrameTime = 0;

dragon.onload = function() {
    const spriteWidth = dragon.width / frameCount;
    const spriteHeight = dragon.height;

    // Precompute offsets to keep dragon stationary
    // Here we assume wingspan varies a little per frame
    const offsets = [0, 0, 0]; // tweak if needed, e.g. [0, 5, -3]

    function animate(timestamp) {
        if (!lastFrameTime) lastFrameTime = timestamp;
        const delta = timestamp - lastFrameTime;

        if (delta >= frameDuration) {
            currentFrame = (currentFrame + 1) % frameCount;
            lastFrameTime = timestamp;
        }

        // Black background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(canvas.width / spriteWidth / 3, canvas.height / spriteHeight / 3);
        const drawWidth = spriteWidth * scale;
        const drawHeight = spriteHeight * scale;

        // Stationary center
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const x = centerX - drawWidth / 2 + offsets[currentFrame];
        const y = centerY - drawHeight / 2;

        ctx.drawImage(
            dragon,
            currentFrame * spriteWidth, 0,
            spriteWidth, spriteHeight,
            x, y,
            drawWidth, drawHeight
        );

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
};