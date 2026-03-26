const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ======================
// CANVAS SETUP
// ======================
let x = 0;
let y = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Flappy Bird position (center anchored)
    x = canvas.width * 0.2;
    y = canvas.height * 0.45;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ======================
// LOAD IMAGE
// ======================
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ======================
// SPRITE SETTINGS
// ======================
const totalFrames = 3;
let frame = 0;
let tick = 0;
const flapSpeed = 6;

// ======================
// LOOP
// ======================
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameWidth = dragon.width / totalFrames;
    const frameHeight = dragon.height;

    const size = canvas.width * 0.12;

    // CENTER-LOCKED DRAW (key fix)
    ctx.drawImage(
        dragon,
        frame * frameWidth, 0,
        frameWidth, frameHeight,
        x - size / 2,
        y - size / 2,
        size,
        size
    );

    // STABLE FRAME TIMING
    tick++;
    if (tick >= flapSpeed) {
        frame = (frame + 1) % totalFrames;
        tick = 0;
    }

    requestAnimationFrame(loop);
}

// ======================
// START
// ======================
dragon.onload = () => {
    loop();
};