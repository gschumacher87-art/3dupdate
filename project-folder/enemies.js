const enemies = (() => {

  let list = [];
  let bullets = [];

  function init() {}

  function reset() {
    list = [];
    bullets = [];
  }

  // ===== SPAWN TYPES =====
  function spawn(viewWidth) {

    // 50% ground gap enemy, 50% flying enemy
    if (Math.random() < 0.5) {
      spawnGround(viewWidth);
    } else {
      spawnFlying(viewWidth);
    }
  }

  // ===== GROUND GAP ENEMY =====
  function spawnGround(viewWidth) {

    const trees = obstacles.getTrees ? obstacles.getTrees() : [];
    if (!trees || trees.length < 2) return;

    for (let i = 0; i < trees.length - 1; i++) {

      const t1 = trees[i];
      const t2 = trees[i + 1];

      if (!t1 || !t2) continue;

      const gapStart = t1.x + t1.width;
      const gapEnd = t2.x;
      const gapSize = gapEnd - gapStart;

      if (gapSize > 120) {

        const x = gapStart + gapSize / 2;
        const groundY = obstacles.getGroundY(x);
        const y = groundY - (80 + gapSize * 0.3);

        list.push({
          x,
          y,
          size: 20,
          dead: false,
          type: 'ground',
          shootTimer: 60
        });

        return;
      }
    }
  }

  // ===== FLYING ENEMY =====
  function spawnFlying(viewWidth) {

    const x = viewWidth();
    const y = 60 + Math.random() * (window.innerHeight * 0.5);

    list.push({
      x,
      y,
      size: 20,
      dead: false,
      type: 'flying',
      shootTimer: 80,
      wave: Math.random() * Math.PI * 2
    });
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    // ===== SPAWN =====
    if (Math.random() < 0.02) spawn(viewWidth);

    // ===== ENEMIES =====
    for (const e of list) {
      if (!e || e.dead) continue;

      e.x -= 3;

      if (e.type === 'ground') {

        const groundY = obstacles.getGroundY(e.x);
        const ceiling = 40;
        const floor = groundY - 40;

        if (e.y > floor) e.y = floor;
        if (e.y < ceiling) e.y = ceiling;

      } else if (e.type === 'flying') {

        // wave movement
        e.wave += 0.1;
        e.y += Math.sin(e.wave) * 1.5;

        // keep in screen
        if (e.y < 40) e.y = 40;
        if (e.y > viewHeight() * 0.7) e.y = viewHeight() * 0.7;
      }

      // ===== SHOOT =====
      e.shootTimer--;
      if (e.shootTimer <= 0) {
        e.shootTimer = e.type === 'flying' ? 70 : 80;

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

    // ===== FIREBALL HIT =====
    const fireballs = window.dragon.getFireballs();

    for (const f of fireballs) {
      if (!f) continue;

      for (const e of list) {
        if (!e || e.dead) continue;

        if (
          Math.abs(f.x - e.x) < e.size &&
          Math.abs(f.y - e.y) < e.size
        ) {
          e.dead = true;
          f.dead = true;
        }
      }
    }
  }

  function draw(ctx) {

    ctx.lineWidth = 2;

    for (const e of list) {
      if (!e || e.dead) continue;

      const y = e.y;

      if (e.type === 'ground') {
        ctx.strokeStyle = '#ffcc00';
      } else {
        ctx.strokeStyle = '#00ffff'; // flying = different color
      }

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