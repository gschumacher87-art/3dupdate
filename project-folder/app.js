const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const dragon = new Image();
dragon.src = 'project-folder/dragon.png';

dragon.onload = function() {
    console.log('Dragon loaded!', dragon.width, dragon.height);
    ctx.drawImage(dragon, 0, 0);
};

dragon.onerror = function() {
    console.error('Failed to load dragon.png');
};