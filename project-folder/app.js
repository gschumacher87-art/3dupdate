
// project-folder/app.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
    drawSprite();
}
window.addEventListener('resize', resizeCanvas);

// Load sprite
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png';

dragonSprite.onload = () => {
    console.log('Sprite loaded');
    resizeCanvas();
};

dragonSprite.onerror = () => {
    console.error('Failed to load dragon.png. Check file location!');
};

// Draw the first frame centered
function drawSprite() {
    if (!dragonSprite.complete) return;

    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const totalFrames = 3; // your sprite sheet frames horizontally
    const frameWidth = dragonSprite.width / totalFrames;
    const frameHeight = dragonSprite.height;

    const drawSize = Math.min(canvas.width, canvas.height) / 4; // scales for screen

    const x = canvas.width / 2 - drawSize / 2;
    const y = canvas.height / 2 - drawSize / 2;

    ctx.drawImage(
        dragonSprite,
        0, 0, frameWidth, frameHeight, // source rectangle = first frame
        x, y, drawSize, drawSize        // destination rectangle
    );
}