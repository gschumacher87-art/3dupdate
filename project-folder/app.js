const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dragon = new Image();
dragon.src = 'dragon.png'; // your 3-frame sprite in one row

const SPRITE_WIDTH = 64; // width of one frame
const SPRITE_HEIGHT = 64; // height of one frame
let frame = 0;
const totalFrames = 3;
const FRAME_DELAY = 200; // milliseconds per frame

let lastTime = 0;

function animate(time) {
    if (!lastTime) lastTime = time;
    const delta = time - lastTime;

    if (delta > FRAME_DELAY) {
        frame = (frame + 1) % totalFrames;
        lastTime = time;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Always draw at same x, y so frames align
    const x = canvas.width / 2 - SPRITE_WIDTH / 2;
    const y = canvas.height / 2 - SPRITE_HEIGHT / 2;

    ctx.drawImage(
        dragon,
        frame * SPRITE_WIDTH, 0, // source x, y
        SPRITE_WIDTH, SPRITE_HEIGHT, // source width, height
        x, y, // destination x, y
        SPRITE_WIDTH, SPRITE_HEIGHT // destination width, height
    );

    requestAnimationFrame(animate);
}

dragon.onload = () => {
    requestAnimationFrame(animate);
};