// project-folder/app.js

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// --- Make canvas responsive ---
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // initial sizing

// --- Load dragon sprite ---
const dragonSprite = new Image();
dragonSprite.src = './dragon.png'; // relative to app.js

dragonSprite.onload = () => {
    console.log('Dragon sprite loaded successfully.');
    drawDragon(); // draw once loaded
};

dragonSprite.onerror = () => {
    console.error('Failed to load dragon sprite. Check path!');
};

// --- Dragon position ---
let dragonX = canvas.width / 2;
let dragonY = canvas.height / 2;
let dragonSize = 64; // pixels

// --- Draw function ---
function drawDragon() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
        dragonSprite,
        dragonX - dragonSize / 2,
        dragonY - dragonSize / 2,
        dragonSize,
        dragonSize
    );
}