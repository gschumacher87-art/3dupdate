const enemies = (() => {

  let list = [];

  // ===== BOOST (ADDED) =====
  let shotBoost = 0;

  function init() {}

  function reset() {
    list = [];
    shotBoost = 0; // ADDED
  }

  // ===== SPAWN CONTROL =====
  function getSpawnConfig(time) {

    if (time < 3) return { max: 0, type: 'none' };

    if (time < 7) return { max: 4, type: 'small' };

    if (time < 12) return { max: 4, type: 'mix1' };

    if (time < 20) return { max: 4, type: 'medium' };

    if (time < 30) return { max: 5, type: 'mix2' };

    return { max: 6, type: 'mixed' };
  }

  function spawn(viewWidth, viewHeight, type) {

    const SPAWN_OFFSET = 120;

    const x = viewWidth() + SPAWN_OFFSET;
    const y = 60 + Math.random() * (viewHeight() * 0.5);

    let state = 'small';

    if (type === 'medium') state = 'medium';
    if (type === 'mix1') state = Math.random() < 0.3 ? 'medium' : 'small';
    if (type === 'mix2') state = Math.random() < 0.3 ? 'large' : 'medium';
    if (type === 'mixed') {
      const r = Math.random();
      if (r < 0.5) state = 'small';
      else if (r < 0.85) state = 'medium';
      else state = 'large';
    }

    list.push({
      x,
      y,
      state,
      hp: state === 'small' ? 1 : state === 'medium' ? 2 : 3,
      size: state === 'small' ? 20 : state === 'medium' ? 28 : 36,
      dead: false,
      counted: false,
      type: 'ghost',
      wave: Math.random() * Math.PI * 2,
      life: 0
    });
  }

  function update(viewWidth, viewHeight, dragon, onHit) {

    const time = window.stats?.time || 0;
    const config = getSpawnConfig(time);

    // ===== CONTROLLED SPAWN =====
    if (list.length < config.max && config.type !== 'none') {
      if (Math.random() < 0.05) {
        spawn(viewWidth, viewHeight, config.type);
      }
    }

    for (const e of list) {
      if (!e || e.dead) continue;

      e.x -= 3;

      // ===== FLOAT =====
      e.wave += 0.08;
      e.y += Math.sin(e.wave) * 1.2;

      if (e.y < 40) e.y = 40;
      if (e.y > viewHeight() * 0.7) e.y = viewHeight() * 0.7;

      // ===== GROWTH =====
      e.life += 1 / 60;

      if (e.state === 'small' && e.life > 3) {
        e.state = 'medium';
        e.hp = 2;
        e.size = 28;
      }

      if (e.state === 'medium' && e.life > 6) {
        e.state = 'large';
        e.hp = 3;
        e.size = 36;
      }

      // ===== COLLISION =====
      const dx = e.x - dragon.x;
      const dy = e.y - dragon.y;

      if (Math.sqrt(dx * dx + dy * dy) < (e.size + dragon.size) * 0.5) {
        if (onHit) onHit();
      }
    }

    // ===== FIREBALL HITS =====
    const fireballs = window.dragon.getFireballs();

    for (const f of fireballs) {
      if (!f) continue;

      for (const e of list) {
        if (!e || e.dead) continue;

        if (
          Math.abs(f.x - e.x) < e.size &&
          Math.abs(f.y - e.y) < e.size
        ) {
          f.dead = true;

          e.hp--;

          if (e.hp <= 0) {
            e.dead = true;

            if (!e.counted) {
              e.counted = true;
              if (window.stats) window.stats.enemies++;

              // ===== BOOST TRIGGER (ADDED) =====
              shotBoost++;
              if (shotBoost >= 3) {
                window.dragon.activateBoost?.();
                shotBoost = 0;
              }
            }
          } else {
            // ===== SHRINK ON HIT =====
            if (e.hp === 2) {
              e.state = 'medium';
              e.size = 28;
            } else if (e.hp === 1) {
              e.state = 'small';
              e.size = 20;
            }
          }
        }
      }
    }

    list = list.filter(e => e && !e.dead && e.x > -50);
  }

  function draw(ctx) {

    for (const e of list) {
      if (!e || e.dead) continue;

      const y = e.y;

      // ===== COLOR BY SIZE =====
      if (e.state === 'small') ctx.fillStyle = '#ffd400';
      if (e.state === 'medium') ctx.fillStyle = '#ff9f00';
      if (e.state === 'large') ctx.fillStyle = '#ff3b00';

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.arc(e.x, y - e.size * 0.4, e.size * 0.4, Math.PI, 0);
      ctx.lineTo(e.x + e.size * 0.4, y + e.size * 0.3);

      ctx.lineTo(e.x + e.size * 0.2, y);
      ctx.lineTo(e.x, y + e.size * 0.3);
      ctx.lineTo(e.x - e.size * 0.2, y);
      ctx.lineTo(e.x - e.size * 0.4, y + e.size * 0.3);

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // ===== EYES =====
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(e.x - e.size * 0.15, y - e.size * 0.2, 2, 0, Math.PI * 2);
      ctx.arc(e.x + e.size * 0.15, y - e.size * 0.2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function getList() {
    return list;
  }

  return { init, reset, update, draw, getList };

})();