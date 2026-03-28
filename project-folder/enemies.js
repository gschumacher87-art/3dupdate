const enemies = (() => {

  let list = [];
  let bullets = [];

  function init() {}

  function reset() {
    list = [];
    bullets = [];
  }

  // ===== SPAWN IN CLEAN GAPS ONLY =====
  function spawn(viewWidth) {

    const trees = obstacles.getTrees ? obstacles.getTrees() : [];
    if (!trees || trees.length < 2) return;

    for (let i = 0; i < trees.length - 1; i++) {

      const t1 = trees[i];
      const t2 = trees[i + 1];

      if (!t1 || !t2) continue;

      const gapStart = t1.x + t1.width;
      const gapEnd = t2.x;
      const gapSize = gapEnd - gapStart;

      // 👇 ONLY LARGE CLEAN GAPS
      if (gapSize > 120) {

        const x = gapStart + gapSize / 2;

        const groundY = obstacles.getGroundY(x);

        // 👇 LOCK HEIGHT INSIDE GAP (NOT RANDOM CHAOS)
        const y = groundY - (80 + gapSize * 0.3);

        list.push({
          x,
          y,
          size: 20,
          dead: false,
          shootTimer: 60
        });

        return;
      }
    }
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    // ===== SPAWN =====
    if (Math.random() < 0.015) spawn(viewWidth);

    // ===== ENEMIES =====
    for (const e of list) {
      if (!e || e.dead) continue;

      e.x -= 3;

      const groundY = obstacles.getGroundY(e.x);
      const ceiling = 40;
      const floor = groundY - 40;

      // 👇 KEEP THEM IN PLAYABLE ZONE
      if (e.y > floor) e.y = floor;
      if (e.y < ceiling) e.y = ceiling;

      e.shootTimer--;
      if (e.shootTimer <= 0) {
        e.shootTimer = 80;

        bullets.push({
          x: e.x,
          y: e.y,
          vx: -4,
          vy: (dragon.y - e.y) * 0.04
        });
      }
    }

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