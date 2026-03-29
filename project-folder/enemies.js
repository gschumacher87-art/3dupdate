const enemies = (() => {

  let list = [];

  function init() {}

  function reset() {
    list = [];
  }

  // ===== SPAWN TYPES =====
  function spawn(viewWidth) {
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

        const SPAWN_OFFSET = 120;
        const x = gapStart + gapSize / 2 + SPAWN_OFFSET;

        const groundY = obstacles.getGroundY(x);
        const y = groundY - (80 + gapSize * 0.3);

        list.push({
          x,
          y,
          size: 20,
          dead: false,
          counted: false, // 👈 prevents double count
          type: 'ground'
        });

        return;
      }
    }
  }

  // ===== FLYING GHOST =====
  function spawnFlying(viewWidth) {

    const SPAWN_OFFSET = 120;
    const x = viewWidth() + SPAWN_OFFSET;

    const y = 60 + Math.random() * (window.innerHeight * 0.5);

    list.push({
      x,
      y,
      size: 20,
      dead: false,
      counted: false, // 👈 same here
      type: 'ghost',
      wave: Math.random() * Math.PI * 2
    });
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    // ===== SPAWN =====
    if (Math.random() < 0.02) spawn(viewWidth);

    // ===== MOVE / COLLISION =====
    for (const e of list) {
      if (!e || e.dead) continue;

      e.x -= 3;

      if (e.type === 'ground') {

        const groundY = obstacles.getGroundY(e.x);
        const ceiling = 40;
        const floor = groundY - 40;

        if (e.y > floor) e.y = floor;
        if (e.y < ceiling) e.y = ceiling;

      } else if (e.type === 'ghost') {

        e.wave += 0.08;
        e.y += Math.sin(e.wave) * 1.2;

        if (e.y < 40) e.y = 40;
        if (e.y > viewHeight() * 0.7) e.y = viewHeight() * 0.7;
      }

      // ===== DRAGON HIT =====
      const dx = e.x - dragon.x;
      const dy = e.y - dragon.y;

      if (Math.sqrt(dx * dx + dy * dy) < (e.size + dragon.size) * 0.5) {
        if (onHit) onHit();
      }
    }

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

          // ===== COUNT ENEMY (FIX) =====
          if (!e.counted) {
            e.counted = true;
            if (window.stats) window.stats.enemies++;
          }
        }
      }
    }

    // ===== CLEANUP =====
    list = list.filter(e => e && !e.dead && e.x > -50);
  }

  function draw(ctx) {

    ctx.lineWidth = 2;

    for (const e of list) {
      if (!e || e.dead) continue;

      const y = e.y;

      if (e.type === 'ground') {

        ctx.strokeStyle = '#ffcc00';

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

      } else if (e.type === 'ghost') {

        ctx.strokeStyle = '#ffffff';

        ctx.beginPath();
        ctx.arc(e.x, y - 8, 8, Math.PI, 0);
        ctx.lineTo(e.x + 8, y + 6);

        ctx.lineTo(e.x + 4, y + 2);
        ctx.lineTo(e.x, y + 6);
        ctx.lineTo(e.x - 4, y + 2);
        ctx.lineTo(e.x - 8, y + 6);

        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(e.x - 3, y - 4, 1.5, 0, Math.PI * 2);
        ctx.arc(e.x + 3, y - 4, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
    }
  }

  function getList() {
    return list;
  }

  return { init, reset, update, draw, getList };

})();