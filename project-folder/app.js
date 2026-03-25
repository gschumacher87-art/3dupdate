const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.8;

// Load sprite
const dragonSprite = new Image();
dragonSprite.src = './project-folder/dragon.png'; // absolute relative to index.html works too

dragonSprite.onload = () => {
    console.log('Sprite loaded!');
    ctx.drawImage(dragonSprite, canvas.width/2 - 32, canvas.height/2 - 32, 64, 64);
};

dragonSprite.onerror = () => console.error('Failed to load sprite. Check path!');