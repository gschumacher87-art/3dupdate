// project-folder/app.js
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Responsive canvas
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load sprite sheet
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png'; // relative to index.html

dragonSprite.onload = () => {
    console.log('Sprite loaded:', dragonSprite.width, 'x', dragonSprite.height);

    // Assume 3 frames horizontally in the sheet
    const totalFrames = 3;
    const frameWidth = dragonSprite.width / totalFrames;
    const frameHeight = dragonSprite.height;

    // Draw first frame in center
    const x = canvas.width / 2 - frameWidth / 2;
    const y = canvas.height / 2 - frameHeight / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        dragonSprite,        // image
        0, 0,                // source x, y (first frame)
        frameWidth, frameHeight, // source width, height
        x, y,                // canvas x, y
        frameWidth, frameHeight  // canvas width, height
    );
};

dragonSprite.onerror = () => console.error('Failed to load sprite. Check path!');