const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ======================
// CANVAS (ALL DEVICES)
// ======================
let x, y;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Flappy Bird position (left + centered)
    x = canvas.width * 0.2;
    y = canvas.height * 0.45;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ======================
// LOAD SPRITE
// ======================
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ======================
// ANIMATION
// ======================
let frame = 0;
const totalFrames = 3;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // auto-detect frame size (NO GUESSING)
    const frameWidth = dragon.width / totalFrames;
    const frameHeight = dragon.height;

    // draw (FIXED POSITION = NO JIGGLE)
    ctx.drawImage(
        dragon,
        frame * frameWidth, 0,
        frameWidth, frameHeight,
        x, y,
        frameWidth, frameHeight
    );

    // next frame
    frame = (frame + 1) % totalFrames;

    requestAnimationFrame(animate);
}

// ======================
// START SAFELY
// ======================
dragon.onload = () => {
    console.log("dragon loaded");
    animate();
};

dragon.onerror = () => {
    console.log("image failed to load");
};