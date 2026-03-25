export class Dragon {
  constructor(x, y, width = 40, height = 40, speed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;

    this.tail = [];
    this.maxTail = 5;
    this.direction = 'right'; // auto forward

    this.velocityY = 0;
  }

  move(direction) {
    if (direction) this.direction = direction;

    // Auto forward + directional
    switch (this.direction) {
      case 'up': this.y -= this.speed; break;
      case 'down': this.y += this.speed; break;
      case 'left': this.x -= this.speed; break;
      case 'right': this.x += this.speed; break;
    }

    // Keep in bounds
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > window.innerWidth * 0.8) this.x = window.innerWidth * 0.8 - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > window.innerHeight * 0.8) this.y = window.innerHeight * 0.8 - this.height;

    // Tail
    this.tail.unshift({ x: this.x, y: this.y });
    if (this.tail.length > this.maxTail) this.tail.pop();
  }

  grow(amount = 1) {
    this.maxTail += amount;
  }

  draw(ctx) {
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillStyle = `rgba(0,255,0,${1 - i / this.tail.length})`;
      ctx.fillRect(this.tail[i].x, this.tail[i].y, this.width, this.height);
    }
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
