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

  // ===== TREES =====
  let trees = [];
  let treeCooldown = 0;

  function spawnTreePair() {

    const baseX = vw();
    const groundY = getGroundY(baseX);

    // ===== DIFFICULTY SCALE =====
    const t = Math.min(1, (window.stats?.time || 0) / 60);

    const gapSize = 140 - (t * 40) + Math.random() * 20;

    // ===== PATTERN =====
    const pattern = Math.random();

    let height1, height2;

    if (pattern < 0.33) {
      // LOW GAP (forces drop)
      height1 = 160 + Math.random() * 40;
      height2 = 60 + Math.random() * 40;

    } else if (pattern < 0.66) {
      // HIGH GAP (forces climb)
      height1 = 60 + Math.random() * 40;
      height2 = 160 + Math.random() * 40;

    } else {
      // MID (tight)
      height1 = 100 + Math.random() * 60;
      height2 = 100 + Math.random() * 60;
    }

    trees.push({
      x: baseX,
      width: 40,
      height: height1,
      y: groundY - height1,
      burning: false,
      burnTime: 0,
      counted: false
    });

    trees.push({
      x: baseX + gapSize,
      width: 40,
      height: height2,
      y: groundY - height2,
      burning: false,
      burnTime: 0,
      counted: false
    });

    treeCooldown = 140 - (t * 60) + Math.random() * 40;
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

    // TREES
    treeCooldown--;
    if (treeCooldown <= 0) spawnTreePair();

    for (const t of trees) {

      t.x -= groundSpeed;

      // ===== LOCK TO GROUND (FIX) =====
      const groundY = getGroundY(t.x);
      t.y = groundY - t.height;

      if (t.burning) t.burnTime--;
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
        !t.burning
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

    // FIREBALLS
    const fireballs = window.dragon.getFireballs();

    for (const f of fireballs) {
      if (!f) continue;

      for (const t of trees) {

        if (!t || t.burning) continue;

        if (
          f.x > t.x &&
          f.x < t.x + t.width &&
          f.y > t.y
        ) {

          t.burning = true;
          t.burnTime = 30;
          f.dead = true;

          if (!t.counted) {
            t.counted = true;
            if (onScore) onScore();
          }

          if (typeof enemies !== 'undefined' && enemies.getList) {
            const list = enemies.getList();

            for (const e of list) {
              if (!e) continue;

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

      ctx.fillStyle = t.burning ? 'orange' : '#5b3a1e';
      ctx.fillRect(
        t.x + t.width * 0.35,
        t.y + t.height * 0.55,
        t.width * 0.3,
        t.height * 0.45
      );

      ctx.fillStyle = t.burning ? 'red' : '#2ecc71';

      ctx.beginPath();
      ctx.moveTo(t.x, t.y + t.height * 0.6);
      ctx.lineTo(t.x + t.width / 2, t.y + t.height * 0.2);
      ctx.lineTo(t.x + t.width, t.y + t.height * 0.6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(t.x + t.width * 0.1, t.y + t.height * 0.45);
      ctx.lineTo(t.x + t.width / 2, t.y + t.height * 0.05);
      ctx.lineTo(t.x + t.width * 0.9, t.y + t.height * 0.45);
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
    getGroundY,
    getTrees: () => trees
  };

})();