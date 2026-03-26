const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ======================
// CANVAS (ALL DEVICES)
// ======================
let x, y;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Flappy Bird position
    x = canvas.width * 0.2;
    y = canvas.height * 0.45;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ======================
// LOAD SPRITE
// ======================
const dragon = new Image();
dragon.src = './dragon.png'; // MUST be inside project-folder

// ======================
// SPRITE (MATCHES IMAGE)
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

    // PERFECT CENTER LOCK (NO JIGGLE)
    ctx.drawImage(
        dragon,
        frame * frameWidth, 0,
        frameWidth, frameHeight,
        x - size / 2,
        y - size / 2,
        size,
        size
    );

    // FLAP CONTROL
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