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
    for (let i = 0; i < mountain.length - 1; i++) {
      const m1 = mountain[i];
      const m2 = mountain[i + 1];

      if (x >= m1.x && x <= m2.x) {
        const t = (x - m1.x) / (m2.x - m1.x);
        const h = m1.height * (1 - t) + m2.height * t;
        return vh() - h;
      }
    }
    return vh();
  }

  // ===== TREES =====
  let trees = [];
  let treeCooldown = 0;

  function spawnTreePair() {

    const baseX = vw();
    const groundY = getGroundY(baseX);

    const t = Math.min(1, (window.stats?.time || 0) / 60);
    const spacing = 130 - (t * 30);

    const tall = vh() * 0.5;
    const short = vh() * 0.15;

    let height1, height2;

    if (Math.random() < 0.5) {
      height1 = tall;
      height2 = short;
    } else {
      height1 = short;
      height2 = tall;
    }

    height1 += (Math.random() - 0.5) * 20;
    height2 += (Math.random() - 0.5) * 20;

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
      x: baseX + spacing,
      width: 40,
      height: height2,
      y: groundY - height2,
      burning: false,
      burnTime: 0,
      counted: false
    });

    treeCooldown = 160 - (t * 60);
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

    if (Math.random() < 0.02) spawnCloud();
    for (const c of clouds) c.x -= groundSpeed * 0.3;
    clouds = clouds.filter(c => c.x > -100);

    for (const m of mountain) m.x -= groundSpeed;

    if (mountain.length && mountain[0].x < -segmentWidth) {
      mountain.shift();
      const last = mountain[mountain.length - 1];
      mountain.push({
        x: last.x + segmentWidth,
        height: randomHeight(last.height)
      });
    }

    treeCooldown--;
    if (treeCooldown <= 0) spawnTreePair();

    for (const t of trees) {
      t.x -= groundSpeed;

      const gy = getGroundY(t.x);
      t.y = gy - t.height;

      if (t.burning) t.burnTime--;
    }

    trees = trees.filter(t => t.x > -50 && t.burnTime > -20);

    const groundY = getGroundY(dragon.x);
    if (dragon.y + dragon.size / 2 > groundY) onHit();

    // ===== FIXED TREE COLLISION (TRUNK ONLY) =====
    for (const t of trees) {

      const trunkX = t.x + t.width * 0.35;
      const trunkW = t.width * 0.3;
      const trunkY = t.y + t.height * 0.55;
      const trunkH = t.height * 0.45;

      if (
        dragon.x + dragon.size / 2 > trunkX &&
        dragon.x - dragon.size / 2 < trunkX + trunkW &&
        dragon.y + dragon.size / 2 > trunkY &&
        dragon.y - dragon.size / 2 < trunkY + trunkH &&
        !t.burning
      ) {
        onHit();
      }
    }

    if (dragon.y - dragon.size / 2 < 30) onHit();

    for (const s of strikes) s.life--;
    strikes = strikes.filter(s => s.life > 0);
    if (Math.random() < 0.02) spawnStrike();

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
        }
      }
    }
  }

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

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const c of clouds) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.arc(c.x - c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#5c3b1e';
    ctx.beginPath();
    ctx.moveTo(0, vh());
    for (const m of mountain) {
      ctx.lineTo(m.x, vh() - m.height);
    }
    ctx.closePath();
    ctx.fill();

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
    }

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