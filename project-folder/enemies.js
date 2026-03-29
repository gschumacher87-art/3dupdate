const enemies = (() => {

  let list = [];

  function init() {}

  function reset() {
    list = [];
  }

  // ===== SPAWN (GHOSTS ONLY) =====
  function spawn(viewWidth) {
    spawnFlying(viewWidth);
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
      counted: false,
      type: 'ghost',
      wave: Math.random() * Math.PI * 2
    });
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    if (Math.random() < 0.02) spawn(viewWidth);

    for (const e of list) {
      if (!e || e.dead) continue;

      e.x -= 3;

      if (e.type === 'ghost') {

        e.wave += 0.08;
        e.y += Math.sin(e.wave) * 1.2;

        if (e.y < 40) e.y = 40;
        if (e.y > viewHeight() * 0.7) e.y = viewHeight() * 0.7;
      }

      const dx = e.x - dragon.x;
      const dy = e.y - dragon.y;

      if (Math.sqrt(dx * dx + dy * dy) < (e.size + dragon.size) * 0.5) {
        if (onHit) onHit();
      }
    }

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

          if (!e.counted) {
            e.counted = true;
            if (window.stats) window.stats.enemies++;
          }
        }
      }
    }

    list = list.filter(e => e && !e.dead && e.x > -50);
  }

  function draw(ctx) {

    ctx.lineWidth = 2;

    for (const e of list) {
      if (!e || e.dead) continue;

      const y = e.y;

      if (e.type === 'ghost') {

        // ===== BODY =====
        ctx.fillStyle = '#ffd400'; // yellow fill
        ctx.strokeStyle = '#ffffff'; // ✅ WHITE outline (changed)
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(e.x, y - 8, 8, Math.PI, 0);
        ctx.lineTo(e.x + 8, y + 6);

        ctx.lineTo(e.x + 4, y + 2);
        ctx.lineTo(e.x, y + 6);
        ctx.lineTo(e.x - 4, y + 2);
        ctx.lineTo(e.x - 8, y + 6);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // ===== EYES =====
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(e.x - 3, y - 4, 2, 0, Math.PI * 2);
        ctx.arc(e.x + 3, y - 4, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function getList() {
    return list;
  }

  return { init, reset, update, draw, getList };

})();