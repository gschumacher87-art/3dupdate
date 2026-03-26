const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// FULL SCREEN (stable on all devices)
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// LOAD IMAGE (USE YOUR GITHUB URL)
const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

// ANIMATION
let frame = 0;
const totalFrames = 3;

const x = 100;
let y = 200;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // AUTO FRAME SIZE (no guessing)
    const frameWidth = dragon.width / totalFrames;
    const frameHeight = dragon.height;

    ctx.drawImage(
        dragon,
        frame * frameWidth, 0,
        frameWidth, frameHeight,
        x, y,
        frameWidth, frameHeight
    );

    frame = (frame + 1) % totalFrames;

    requestAnimationFrame(animate);
}

// START ONLY WHEN READY
dragon.onload = () => {
    console.log("loaded");
    animate();
};

dragon.onerror = () => {
    console.log("failed to load image");
};