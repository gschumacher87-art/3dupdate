const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ======================
// CANVAS
// ======================
let x, y;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    x = canvas.width * 0.2;
    y = canvas.height * 0.45;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ======================
// IMAGE
// ======================
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ======================
// SPRITE SETTINGS
// ======================
const totalFrames = 3;
let frame = 0;

// controls flap speed (lower = faster)
let frameDelay = 0;
const flapSpeed = 6;

// ======================
// LOOP
// ======================
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const frameWidth = dragon.width / totalFrames;
    const frameHeight = dragon.height;

    const size = canvas.width * 0.12;

    ctx.drawImage(
        dragon,
        frame * frameWidth, 0,   // slice frame
        frameWidth, frameHeight,
        x, y,
        size, size
    );

    // CONTROLLED FLAP (stable)
    frameDelay++;
    if (frameDelay >= flapSpeed) {
        frame = (frame + 1) % totalFrames;
        frameDelay = 0;
    }

    requestAnimationFrame(draw);
}

// ======================
// START
// ======================
dragon.onload = () => {
    draw();
};