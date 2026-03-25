export class Pipe {
  constructor(x, topHeight, width = 60, gapHeight = 150) {
    this.x = x;
    this.topHeight = topHeight;
    this.width = width;
    this.gapHeight = gapHeight;
    this.scored = false;
  }

  move(speed = 3) { this.x -= speed; }

  draw(ctx, canvasHeight) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, 0, this.width, this.topHeight);
    ctx.fillRect(this.x, this.topHeight + this.gapHeight, this.width, canvasHeight - this.topHeight - this.gapHeight);
  }

  checkCollision(dragon) {
    return dragon.x + dragon.size > this.x &&
           dragon.x < this.x + this.width &&
           (dragon.y < this.topHeight || dragon.y + dragon.size > this.topHeight + this.gapHeight);
  }
}