const obstacles = (() => {

  let vw, vh;

  const groundSpeed = 3;

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
  let strikes = [];

  function spawnStrike() {
    strikes.push({
      x: Math.random() * vw(),
      life: 10,
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
    }

    return segments;
  }

  // ===== MOUNTAIN =====
  let mountain = [];
  const segmentWidth = 40;

  function randomHeight(prev = 100) {
    let next = prev + (Math.random() - 0.5) * 30;
    return Math.max(60, Math.min(160, next));
  }

  function initMountain() {
    mountain = [];
    let x = 0;
    let lastHeight = 100;

    while (x < vw() + 200) {
      lastHeight = randomHeight(lastHeight);
      mountain.push({ x, height: lastHeight });
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

  // ===== TREES (CLUSTERS + GAPS) =====
  let trees = [];
  let treeCooldown = 0;

  function spawnTreeCluster() {
    const count = Math.floor(Math.random() * 3) + 2; // 2–4 trees
    let baseX = vw();

    for (let i = 0; i < count; i++) {
      const x = baseX + i * 50;
      const groundY = getGroundY(x);

      const height = Math.random() * 120 + 120; // TALLER TREES

      trees.push({
        x,
        width: 40,
        height,
        y: groundY - height,
        burning: false,
        burnTime: 0
      });
    }

    treeCooldown = Math.random() * 80 + 80; // BIG GAPS
  }

  // ===== INIT =====
  function init(viewWidth, viewHeight) {
    vw = viewWidth;
    vh = viewHeight;

    clouds = [];
    strikes = [];
    trees = [];
    initMountain();
  }

  function reset() {
    clouds = [];
    strikes = [];
    trees = [];
    initMountain();
  }

  // ===== UPDATE =====
  function update(viewHeight, viewWidth, dragon, onScore, onHit) {

    // CLOUDS
    if (Math.random() < 0.02) spawnCloud();
    for (const c of clouds) c.x -= groundSpeed * 0.3;
    clouds = clouds.filter(c => c.x > -100);

    // MOUNTAIN
    for (const m of mountain) m.x -= groundSpeed;

    if (mountain.length && mountain[0].x < -segmentWidth) {
      mountain.shift();
      const last = mountain[mountain.length - 1];
      mountain.push({
        x: last.x + segmentWidth,
        height: randomHeight(last.height)
      });
    }

    // TREES (CLUSTERS)
    treeCooldown--;
    if (treeCooldown <= 0) spawnTreeCluster();

    for (const t of trees) {
      t.x -= groundSpeed;

      // burning timer
      if (t.burning) {
        t.burnTime--;
      }
    }

    trees = trees.filter(t => t.x > -50 && t.burnTime > -20);

    // GROUND COLLISION
    const groundY = getGroundY(dragon.x);
    if (dragon.y + dragon.size / 2 > groundY) onHit();

    // TREE COLLISION
    for (const t of trees) {
      if (
        dragon.x + dragon.size / 2 > t.x &&
        dragon.x - dragon.size / 2 < t.x + t.width &&
        dragon.y + dragon.size / 2 > t.y &&
        !t.burning // safe if burning
      ) {
        onHit();
      }
    }

    // CEILING
    if (dragon.y - dragon.size / 2 < 30) onHit();

    // LIGHTNING
    for (const s of strikes) s.life--;
    strikes = strikes.filter(s => s.life > 0);
    if (Math.random() < 0.02) spawnStrike();

    // ===== FIREBALL INTERACTION =====
    const fireballs = dragon.getFireballs();

    for (const f of fireballs) {
      for (const t of trees) {

        if (t.burning) continue;

        if (
          f.x > t.x &&
          f.x < t.x + t.width &&
          f.y > t.y
        ) {
          t.burning = true;
          t.burnTime = 30;
          f.dead = true;

          // 🔥 burn enemies nearby
          if (window.enemies) {
            for (const e of enemies.getList()) {
              if (
                Math.abs(e.x - t.x) < 40 &&
                Math.abs(e.y - t.y) < t.height
              ) {
                e.dead = true;
              }
            }
          }
        }
      }
    }
  }

  // ===== DRAW =====
  function draw(ctx) {

    const flicker = Math.random() * 30;

    ctx.fillStyle = `rgb(${70 + flicker}, ${70 + flicker}, ${70 + flicker})`;
    ctx.fillRect(0, 0, vw(), 30);

    ctx.fillStyle = `rgb(${90 + flicker}, ${90 + flicker}, ${90 + flicker})`;

    ctx.beginPath();
    ctx.moveTo(0, 30);
    for (let x = 0; x <= vw(); x += 20) {
      const y = 30 + Math.sin(x * 0.05 + Date.now() * 0.005) * 5;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(0,0,0,0.2)`;
    ctx.fillRect(0, 0, vw(), 15);

    // CLOUDS
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const c of clouds) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.arc(c.x - c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // MOUNTAIN
    ctx.fillStyle = '#5c3b1e';
    ctx.beginPath();
    ctx.moveTo(0, vh());
    for (const m of mountain) {
      ctx.lineTo(m.x, vh() - m.height);
    }
    ctx.closePath();
    ctx.fill();

    // TREES
    for (const t of trees) {

      // trunk
      ctx.fillStyle = t.burning ? 'orange' : '#5b3a1e';
      ctx.fillRect(t.x + t.width / 3, t.y + t.height - 20, t.width / 3, 20);

      // leaves
      ctx.fillStyle = t.burning ? 'red' : 'green';

      ctx.beginPath();
      ctx.moveTo(t.x, t.y + 30);
      ctx.lineTo(t.x + t.width / 2, t.y);
      ctx.lineTo(t.x + t.width, t.y + 30);
      ctx.closePath();
      ctx.fill();
    }

    // LIGHTNING
    for (const s of strikes) {
      ctx.strokeStyle = 'cyan';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'cyan';

      ctx.beginPath();
      let prev = { x: s.x, y: 0 };

      for (const seg of s.segments) {
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(s.x + seg.x, seg.y);
        prev = { x: s.x + seg.x, y: seg.y };
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  }

  return {
    init,
    reset,
    update,
    draw,
    getGroundY
  };

})();