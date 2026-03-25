const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Dragon sprite setup
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png'; // sprite sheet with 3 frames

const spriteWidth = 64;   // width of one frame
const spriteHeight = 64;  // height of one frame
const scale = 2;          // how big we draw it on canvas
let frameIndex = 0;
const totalFrames = 3;    // number of frames
const frameSpeed = 10;    // higher = slower animation
let tick = 0;

dragonSprite.onload = () => {
    requestAnimationFrame(gameLoop);
};

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw current frame
    ctx.drawImage(
        dragonSprite,
        frameIndex * spriteWidth, 0,      // source x, y
        spriteWidth, spriteHeight,        // source width, height
        canvas.width / 2 - (spriteWidth*scale)/2,  // dest x
        canvas.height / 2 - (spriteHeight*scale)/2,// dest y
        spriteWidth * scale,              // dest width
        spriteHeight * scale              // dest height
    );

    // Animate frames
    tick++;
    if (tick % frameSpeed === 0) {
        frameIndex = (frameIndex + 1) % totalFrames;
    }

    requestAnimationFrame(gameLoop);
}