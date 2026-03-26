const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// FULL DEVICE SAFE SIZE (no weird scaling)
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// LOAD SPRITE
const dragon = new Image();
dragon.src = './dragon.png';

// SPRITE SETTINGS
const frameWidth = 256;   // EXACT frame width
const frameHeight = 256;  // EXACT frame height
const totalFrames = 3;

let frame = 0;

// FIXED POSITION (NO JIGGLE)
const x = 100;
const y = canvas.height / 2;

// ANIMATION LOOP
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        dragon,
        frame * frameWidth, 0,     // crop X, Y
        frameWidth, frameHeight,   // crop size
        x, y,                      // draw position (FIXED)
        frameWidth, frameHeight    // draw size
    );

    frame = (frame + 1) % totalFrames;

    setTimeout(() => requestAnimationFrame(animate), 120);
}

// START AFTER LOAD
dragon.onload = () => {
    animate();
};