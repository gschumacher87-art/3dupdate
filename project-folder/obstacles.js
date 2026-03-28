const obstacles = (() => {

  let vw, vh;

  // ===== SETTINGS =====
  const groundSpeed = 3;
  const cloudSpeedFactor = 0.3;
  const lightningSpeedFactor = 1.5;

  // ===== CLOUDS =====
  let clouds = [];

  function spawnCloud() {
    clouds.push({
      x: vw(),
      y: Math.random() * vh() * 0.4,
      size: Math.random() * 40 + 40
    });
  }

  // ===== LIGHTNING =====
  let lightning = [];

  function spawnLightning() {
    lightning.push({
      x: vw(),
      life: 12,
      segments: generateBolt()
    });
  }

  function generateBolt() {
    const segments = [];
    let x = 0, y = 0;

    while (y < vh()) {
      x += (Math.random() - 0.5) * 40;
      y += 20;

      segments.push({ x, y });

      if (Math.random() < 0.2) {
        segments.push({
          x: x + (Math.random() - 0.5) * 50,
          y: y + 20
        });
      }
    }

    return segments;
  }

  // ===== ENEMIES =====
  let enemies = [];
  let bullets = [];

  function spawnEnemy() {
    const x = vw();
    const y = getGroundY(x);

    enemies.push({
      x,
      y,
      size: 12,
      shootTimer: Math.random() * 60 + 30
    });
  }

  // ===== MOUNTAIN =====
  let mountain = [];
  const segmentWidth = 40;

  function randomHeight() {
    const r = Math.random();
    if (r < 0.6) return Math.random() * 40 + 60;
    if (r < 0.9) return Math.random() * 60 + 80;
    return Math.random() * 80 + 120;
  }

  function initMountain() {
    mountain = [];

    let x = 0;
    while (x < vw() + 200) {
      mountain.push({
        x,
        height: randomHeight()
      });
      x += segmentWidth;
    }
  }

  function getGroundY(x) {
    const i = Math.floor(x / segmentWidth);
    const m1 = mountain[i];
    const m2 = mountain[i + 1];

    if (!m1 || !m2) return vh();

    const t = (x % segmentWidth) / segmentWidth;
    const h = m1.height * (1 - t) + m2.height * t;

    return vh() - h;
  }

  // ===== INIT =====
  function init(viewWidth, viewHeight) {
    vw = viewWidth;
    vh = viewHeight;

    clouds = [];
    lightning = [];
    enemies = [];
    bullets = [];
    initMountain();
  }

  function reset() {
    clouds = [];
    lightning = [];
    enemies = [];
    bullets = [];
    initMountain();
  }

  // ===== UPDATE =====
  function update(viewHeight, viewWidth, dragon, onScore, onHit) {

    // ===== MOUNTAIN =====
    for (const m of mountain) {
      m.x -= groundSpeed;
    }

    if (mountain.length && mountain[0].x < -segmentWidth) {
      mountain.shift();
      mountain.push({
        x: mountain[mountain.length - 1].x + segmentWidth,
        height: randomHeight()
      });
    }

    // ===== CLOUDS =====
    if (Math.random() < 0.02) spawnCloud();

    for (const c of clouds) {
      c.x -= groundSpeed * cloudSpeedFactor;
    }

    clouds = clouds.filter(c => c.x > -100);

    // ===== ENEMIES =====
    if (Math.random() < 0.01) spawnEnemy();

    for (const e of enemies) {
      e.x -= groundSpeed;

      e.y = getGroundY(e.x);

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

    enemies = enemies.filter(e => e.x > -50);

    // ===== BULLETS =====
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

    // ===== GROUND COLLISION =====
    const groundY = getGroundY(dragon.x);

    if (dragon.y + dragon.size / 2 > groundY) {
      onHit();
    }

    // ===== LIGHTNING =====
    if (Math.random() < 0.02) spawnLightning();

    for (const l of lightning) {
      l.x -= groundSpeed * lightningSpeedFactor;
      l.life--;
    }

    lightning = lightning.filter(l => l.life > 0);
  }

  // ===== DRAW =====
  function draw(ctx) {

    // clouds
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const c of clouds) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.arc(c.x - c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // mountain base
    ctx.fillStyle = '#5c3b1e';
    ctx.beginPath();
    ctx.moveTo(0, vh());
    for (const m of mountain) {
      ctx.lineTo(m.x, vh() - m.height);
    }
    ctx.lineTo(vw(), vh());
    ctx.closePath();
    ctx.fill();

    // enemies (stick figures)
    ctx.strokeStyle = 'black';
    for (const e of enemies) {
      const y = e.y;

      ctx.beginPath();
      ctx.arc(e.x, y - 12, 4, 0, Math.PI * 2); // head
      ctx.moveTo(e.x, y - 8);
      ctx.lineTo(e.x, y); // body
      ctx.moveTo(e.x, y - 5);
      ctx.lineTo(e.x - 5, y - 2); // arm
      ctx.moveTo(e.x, y - 5);
      ctx.lineTo(e.x + 5, y - 2); // arm
      ctx.moveTo(e.x, y);
      ctx.lineTo(e.x - 4, y + 6); // leg
      ctx.moveTo(e.x, y);
      ctx.lineTo(e.x + 4, y + 6); // leg
      ctx.stroke();
    }

    // bullets
    ctx.fillStyle = 'red';
    for (const b of bullets) {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // lightning
    for (const l of lightning) {
      drawBolt(ctx, l);
    }
  }

  function drawBolt(ctx, l) {
    const flicker = Math.random() * 3;

    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2 + flicker;

    ctx.shadowBlur = 15 + flicker * 5;
    ctx.shadowColor = 'cyan';

    ctx.beginPath();

    let prev = { x: l.x, y: 0 };

    for (const s of l.segments) {
      const jitterX = s.x + (Math.random() - 0.5) * 10;
      const jitterY = s.y + (Math.random() - 0.5) * 10;

      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(l.x + jitterX, jitterY);

      prev = { x: l.x + jitterX, y: jitterY };
    }

    ctx.stroke();

    ctx.shadowBlur = 0;
  }

  return {
    init,
    reset,
    update,
    draw
  };

})();