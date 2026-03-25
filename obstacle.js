export class Pipe {
  constructor(x, topHeight, gapHeight = 180, width = 60) {
    this.x = x;
    this.topHeight = topHeight;
    this.gapHeight = gapHeight; // now correctly passed from app.js
    this.width = width;
    this.scored = false;
  }

  move(speed = 2) { // slower = matches snake pacing
    this.x -= speed;
  }

  draw(ctx, canvasHeight) {
    ctx.fillStyle = 'red';

    // Top pipe
    ctx.fillRect(this.x, 0, this.width, this.topHeight);

    // Bottom pipe
    ctx.fillRect(
      this.x,
      this.topHeight + this.gapHeight,
      this.width,
      canvasHeight - (this.topHeight + this.gapHeight)
    );
  }

  checkCollision(dragon) {
    return (
      dragon.x + dragon.size > this.x &&
      dragon.x < this.x + this.width &&
      (
        dragon.y < this.topHeight ||
        dragon.y + dragon.size > this.topHeight + this.gapHeight
      )
    );
  }
}