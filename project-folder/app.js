// project-folder/app.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    drawSprite();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load sprite
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png'; // relative to index.html

const drawSize = 128; // scaled size for display

dragonSprite.onload = () => {
    console.log('Sprite loaded!');
    drawSprite();
};

dragonSprite.onerror = () => console.error('Failed to load sprite! Check path.');

// Draw sprite centered
function drawSprite() {
    if (!dragonSprite.complete) return;

    // clear canvas with dark background
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw first frame of sprite sheet
    const x = canvas.width / 2 - drawSize / 2;
    const y = canvas.height / 2 - drawSize / 2;

    // assume full sheet width = 3 frames horizontally
    const frameWidth = dragonSprite.width / 3;
    const frameHeight = dragonSprite.height;

    ctx.drawImage(
        dragonSprite,
        0, 0, frameWidth, frameHeight, // source rectangle (first frame)
        x, y, drawSize, drawSize       // destination on canvas
    );
}