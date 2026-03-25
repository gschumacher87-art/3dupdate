export class Dragon {
  constructor(x, y, size = 20) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.tail = [{x: x, y: y}];
    this.maxTail = 5;
  }

  move(direction, gridSize = 20) {
    switch (direction) {
      case 'up': this.y -= gridSize; break;
      case 'down': this.y += gridSize; break;
      case 'left': this.x -= gridSize; break;
      case 'right': this.x += gridSize; break;
    }

    // Keep within canvas bounds
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x > window.innerWidth*0.8 - this.size) this.x = window.innerWidth*0.8 - this.size;
    if (this.y > window.innerHeight*0.8 - this.size) this.y = window.innerHeight*0.8 - this.size;

    // Add new head to tail
    this.tail.unshift({x: this.x, y: this.y});
    if (this.tail.length > this.maxTail) this.tail.pop();
  }

  grow() {
    this.maxTail++;
  }

  draw(ctx) {
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillStyle = `rgba(0,255,0,${1 - i / this.tail.length})`;
      ctx.fillRect(this.tail[i].x, this.tail[i].y, this.size, this.size);
    }
  }
}
