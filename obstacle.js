export class Pipe {
  constructor(x, topHeight, gapHeight = 180, width = 60) {
    this.x = x;
    this.topHeight = topHeight;
    this.gapHeight = gapHeight;
    this.width = width;
    this.scored = false;
  }

  move(speed = 2) { // slower = snake style
    this.x -= speed;
  }

  draw(ctx, canvasHeight) {
    // --- Top pipe ---
    // Pipe lip
    ctx.fillStyle = '#4d0000';
    ctx.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);

    // Main pipe
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x, 0, this.width, this.topHeight);

    // Top pipe shading
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x, 0, 5, this.topHeight); // left edge
    ctx.fillRect(this.x + this.width - 5, 0, 5, this.topHeight); // right edge

    // --- Bottom pipe ---
    // Pipe lip
    ctx.fillStyle = '#4d0000';
    ctx.fillRect(this.x - 5, this.topHeight + this.gapHeight, this.width + 10, 20);

    // Main pipe
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x, this.topHeight + this.gapHeight, this.width, canvasHeight - (this.topHeight + this.gapHeight));

    // Bottom pipe shading
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(this.x, this.topHeight + this.gapHeight, 5, canvasHeight - (this.topHeight + this.gapHeight)); // left edge
    ctx.fillRect(this.x + this.width - 5, this.topHeight + this.gapHeight, 5, canvasHeight - (this.topHeight + this.gapHeight)); // right edge
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