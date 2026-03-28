const enemies = (() => {

  let list = [];
  let bullets = [];

  function init() {}

  function reset() {
    list = [];
    bullets = [];
  }

  function spawn(viewWidth) {
    const x = viewWidth();
    const y = obstacles.getGroundY(x);

    list.push({
      x,
      y,
      shootTimer: Math.random() * 60 + 30
    });
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    if (Math.random() < 0.01) spawn(viewWidth);

    for (const e of list) {
      e.x -= 3;
      e.y = obstacles.getGroundY(e.x);

      e.shootTimer--;
      if (e.shootTimer <= 0) {
        e.shootTimer = 60;

        bullets.push({
          x: e.x,
          y: e.y - 10,
          vx: -4,
          vy: (dragon.y - e.y) * 0.05
        });
      }
    }

    list = list.filter(e => e.x > -50);

    for (const b of bullets) {
      b.x += b.vx;
      b.y += b.vy;

      const dx = b.x - dragon.x;
      const dy = b.y - dragon.y;

      if (Math.sqrt(dx * dx + dy * dy) < dragon.size / 2) {
        onHit();
      }
    }

    bullets = bullets.filter(b => b.x > -50);
  }

  function draw(ctx) {

    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 2;

    for (const e of list) {
      const y = e.y;

      ctx.beginPath();
      ctx.arc(e.x, y - 12, 4, 0, Math.PI * 2);
      ctx.moveTo(e.x, y - 8);
      ctx.lineTo(e.x, y);
      ctx.moveTo(e.x, y - 5);
      ctx.lineTo(e.x - 5, y - 2);
      ctx.moveTo(e.x, y - 5);
      ctx.lineTo(e.x + 5, y - 2);
      ctx.moveTo(e.x, y);
      ctx.lineTo(e.x - 4, y + 6);
      ctx.moveTo(e.x, y);
      ctx.lineTo(e.x + 4, y + 6);
      ctx.stroke();
    }

    ctx.fillStyle = 'red';
    for (const b of bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return { init, reset, update, draw };

})();