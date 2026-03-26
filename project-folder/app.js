const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dragon = new Image();
dragon.src = 'https://raw.githubusercontent.com/gschumacher87-art/3dupdate/main/project-folder/dragon.png';

let x, y;

function setPosition() {
    x = canvas.width * 0.2;
    y = canvas.height * 0.45;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dragon, x, y, 150, 150);
    requestAnimationFrame(draw);
}

dragon.onload = () => {
    setPosition();
    draw();
};