export class Dragon {
  constructor(x, y, size = 50) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{ x: x, y: y }];
    this.maxTail = 5;

    // Animation
    this.velocityY = 0; // tilt
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
    const wingFlap = Math.sin(Date.now() / 100) * 15; // smooth flap

    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillStyle = `rgba(255,140,0,${1 - i / this.tail.length})`; 
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

    // Draw body
    ctx.save();
    ctx.translate(this.x + this.size/2, this.y + this.size/2);
    ctx.rotate(this.velocityY * 0.2);
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size/2, this.size/3, 0, 0, Math.PI*2);
    ctx.fill();

    // Draw wings
    ctx.fillStyle = '#cc3300';

    // Top wing
    ctx.beginPath();
    ctx.moveTo(-this.size/2, 0);
    ctx.lineTo(-this.size/2 - 15, -wingFlap - 5);
    ctx.lineTo(-this.size/2, -wingFlap - 10);
    ctx.fill();

    // Bottom wing
    ctx.beginPath();
    ctx.moveTo(-this.size/2, 0);
    ctx.lineTo(-this.size/2 - 15, wingFlap + 5);
    ctx.lineTo(-this.size/2, wingFlap + 10);
    ctx.fill();

    // Draw eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(this.size/6, -this.size/10, this.size/10, this.size/10, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(this.size/6, -this.size/10, this.size/20, this.size/20, 0, 0, Math.PI*2);
    ctx.fill();

    // Draw tongue
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(this.size/2, 0);
    ctx.lineTo(this.size/2 + 5, 5);
    ctx.lineTo(this.size/2, 10);
    ctx.fill();

    ctx.restore();
  }
}