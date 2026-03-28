const enemies = (() => {

  let list = [];
  let bullets = [];

  function init() {}

  function reset() {
    list = [];
    bullets = [];
  }

  // ===== SPAWN IN TREE GAPS =====
  function spawn(viewWidth) {

    const trees = obstacles.getTrees ? obstacles.getTrees() : [];

    if (!trees || trees.length < 2) return;

    // find a usable gap
    for (let i = 0; i < trees.length - 1; i++) {

      const t1 = trees[i];
      const t2 = trees[i + 1];

      const gapStart = t1.x + t1.width;
      const gapEnd = t2.x;
      const gapSize = gapEnd - gapStart;

      if (gapSize > 80) {

        const x = gapStart + gapSize / 2;

        const groundY = obstacles.getGroundY(x);

        // spawn in air (inside gap)
        const y = groundY - (Math.random() * 120 + 60);

        list.push({
          x,
          y,
          size: 20,
          dead: false,
          shootTimer: 40
        });

        return;
      }
    }
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    // ===== SPAWN =====
    if (Math.random() < 0.02) spawn(viewWidth);

    // ===== ENEMIES =====
    for (const e of list) {
      if (!e || e.dead) continue;

      e.x -= 3;

      // keep them floating (not snapping to ground)
      const groundY = obstacles.getGroundY(e.x);
      const maxY = groundY - 40;

      if (e.y > maxY) e.y = maxY;

      e.shootTimer--;
      if (e.shootTimer <= 0) {
        e.shootTimer = 60;

        bullets.push({
          x: e.x,
          y: e.y,
          vx: -4,
          vy: (dragon.y - e.y) * 0.05
        });
      }
    }

    // REMOVE DEAD + OFFSCREEN
    list = list.filter(e => e && !e.dead && e.x > -50);

    // ===== BULLETS =====
    for (const b of bullets) {
      b.x += b.vx;
      b.y += b.vy;

      const dx = b.x - dragon.x;
      const dy = b.y - dragon.y;

      if (Math.sqrt(dx * dx + dy * dy) < dragon.size / 2) {
        if (onHit) onHit();
      }
    }

    bullets = bullets.filter(b => b.x > -50);
  }

  function draw(ctx) {

    // ===== ENEMIES =====
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth = 2;

    for (const e of list) {
      if (!e || e.dead) continue;

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

    // ===== BULLETS =====
    ctx.fillStyle = 'red';
    for (const b of bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getList() {
    return list;
  }

  return { init, reset, update, draw, getList };

})();