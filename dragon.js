export class Dragon {
  constructor(x, y, size = 30) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: x, y: y }];
    this.maxTail = 5;

    // Animation
    this.wingFlap = 0;
    this.flapDirection = 1;
    this.velocityY = 0; // for tilt effect
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

    // Wing flap animation
    this.wingFlap += 0.3 * this.flapDirection;
    if (this.wingFlap > 5 || this.wingFlap < -5) this.flapDirection *= -1;
  }

  grow() {
    this.maxTail++;
  }

  draw(ctx) {
    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillStyle = `rgba(0,200,0,${1 - i / this.tail.length})`;
      ctx.beginPath();
      ctx.ellipse(
        this.tail[i].x + this.size/2,
        this.tail[i].y + this.size/2,
        this.size/2,
        this.size/3,
        0,
        0,
        Math.PI*2
      );
      ctx.fill();
    }

    // Draw dragon body
    ctx.save();
    ctx.translate(this.x + this.size/2, this.y + this.size/2);
    ctx.rotate(this.velocityY * 0.2); // tilt forward/back
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size/2, this.size/3, 0, 0, Math.PI*2);
    ctx.fill();

    // Draw wings
    ctx.fillStyle = '#33cc33';
    ctx.beginPath();
    ctx.moveTo(-this.size/2, 0);
    ctx.lineTo(-this.size/2 - 10, -this.wingFlap);
    ctx.lineTo(-this.size/2, -this.wingFlap*1.5);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-this.size/2, 0);
    ctx.lineTo(-this.size/2 - 10, this.wingFlap);
    ctx.lineTo(-this.size/2, this.wingFlap*1.5);
    ctx.fill();

    ctx.restore();
  }
}