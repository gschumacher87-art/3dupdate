const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// === Load sprite sheet ===
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png'; // path from index.html

const frameWidth = 64;   // width of one dragon frame
const frameHeight = 64;  // height of one dragon frame
const totalFrames = 3;   // number of frames in your sprite sheet

let currentFrame = 0;
let lastFrameTime = 0;
const frameDuration = 200; // ms per frame

dragonSprite.onload = () => {
    console.log('Sprite loaded!');
    requestAnimationFrame(animate);
};

dragonSprite.onerror = () => console.error('Failed to load sprite. Check path!');

function animate(timestamp) {
    // --- clear canvas ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // --- update frame ---
    if (!lastFrameTime) lastFrameTime = timestamp;
    if (timestamp - lastFrameTime > frameDuration) {
        currentFrame = (currentFrame + 1) % totalFrames;
        lastFrameTime = timestamp;
    }

    // --- draw current frame in center ---
    const x = canvas.width / 2 - frameWidth / 2;
    const y = canvas.height / 2 - frameHeight / 2;
    ctx.drawImage(
        dragonSprite,
        currentFrame * frameWidth, 0,  // source x, y
        frameWidth, frameHeight,       // source width, height
        x, y,                          // dest x, y
        frameWidth, frameHeight        // dest width, height
    );

    requestAnimationFrame(animate);
}