export class Collectible {
  constructor(x, y, size = 20) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.collected = false;
  }

  draw(ctx) {
    if (!this.collected) {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.arc(this.x + this.size/2, this.y + this.size/2, this.size/2, 0, Math.PI*2);
      ctx.fill();
    }
  }

  checkCollision(dragon) {
    if (this.collected) return false;
    if (dragon.x < this.x + this.size &&
        dragon.x + dragon.size > this.x &&
        dragon.y < this.y + this.size &&
        dragon.y + dragon.size > this.y) {
      this.collected = true;
      return true;
    }
    return false;
  }
}