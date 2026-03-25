 // project-folder/app.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    drawSprite(); // redraw on resize
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load sprite sheet
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png';

const totalFrames = 3;       // frames in sheet
const drawSize = 128;        // scaled size on canvas
let frameWidth, frameHeight; // will get from image

dragonSprite.onload = () => {
    frameWidth = dragonSprite.width / totalFrames;
    frameHeight = dragonSprite.height;
    drawSprite();
};

function drawSprite() {
    if (!dragonSprite.complete) return;

    // clear canvas
    ctx.fillStyle = '#222'; // dark background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw first frame scaled
    const x = canvas.width / 2 - drawSize / 2;
    const y = canvas.height / 2 - drawSize / 2;
    ctx.drawImage(
        dragonSprite,
        0, 0, frameWidth, frameHeight, // source frame
        x, y, drawSize, drawSize       // scaled size
    );
}

dragonSprite.onerror = () => console.error('Failed to load sprite!');