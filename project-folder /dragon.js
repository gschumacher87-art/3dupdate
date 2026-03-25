// dragon.js
export class Dragon {
  constructor(x, y, size = 64) { // size matches your sprite
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: x, y: y }];
    this.maxTail = 5;

    this.velocityY = 0; // for tilt
    this.sprite = null; // assign from app.js

    // Animation for sprite sheet (if multi-frame)
    this.frameIndex = 0;
    this.totalFrames = 3; // adjust if your sprite sheet has multiple frames
    this.frameWidth = 64;
    this.frameHeight = 64;
  }

  move(direction, gridSize = 20) {
    switch (direction) {
      case 'up': this.y -= gridSize; this.velocityY = -1; break;
      case 'down': this.y += gridSize; this.velocityY = 1; break;
      case 'left': this.x -= gridSize; break;
      case 'right': this.x += gridSize; break;
    }

    // Keep within canvas bounds
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x > window.innerWidth*0.8 - this.size) this.x = window.innerWidth*0.8 - this.size;
    if (this.y > window.innerHeight*0.8 - this.size) this.y = window.innerHeight*0.8 - this.size;

    // Add new head to tail
    this.tail.unshift({ x: this.x, y: this.y });
    if (this.tail.length > this.maxTail) this.tail.pop();
  }

  grow() {
    this.maxTail++;
  }

  draw(ctx) {
    if (!this.sprite) return; // do nothing if sprite not loaded

    // --- Draw tail ---
    for (let i = 0; i < this.tail.length; i++) {
      ctx.globalAlpha = 1 - i / this.tail.length;
      ctx.drawImage(
        this.sprite,
        0, 0, this.frameWidth, this.frameHeight, // full sprite
        this.tail[i].x, this.tail[i].y,
        this.size, this.size
      );
    }
    ctx.globalAlpha = 1;

    // --- Draw main dragon with tilt ---
    ctx.save();
    ctx.translate(this.x + this.size/2, this.y + this.size/2);
    ctx.rotate(this.velocityY * 0.2); // tilt

    ctx.drawImage(
      this.sprite,
      this.frameIndex * this.frameWidth, 0,
      this.frameWidth, this.frameHeight,
      -this.size/2, -this.size/2,
      this.size, this.size
    );

    ctx.restore();

    // --- Animate sprite frames if multi-frame ---
    this.frameIndex = (this.frameIndex + 1) % this.totalFrames;
  }
}
