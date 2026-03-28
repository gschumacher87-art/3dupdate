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

  // ===== LIGHTNING STRIKES =====
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
      mountain.push({ x, height: randomHeight() });
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

  function init(viewWidth, viewHeight) {
    vw = viewWidth;
    vh = viewHeight;

    clouds = [];
    strikes = [];
    initMountain();
  }

  function reset() {
    clouds = [];
    strikes = [];
    initMountain();
  }

  function update(viewHeight, viewWidth, dragon, onScore, onHit) {

    // ===== CLOUDS =====
    if (Math.random() < 0.02) spawnCloud();

    for (const c of clouds) {
      c.x -= groundSpeed * 0.3;
    }

    clouds = clouds.filter(c => c.x > -100);

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

    // ===== GROUND HIT =====
    const groundY = getGroundY(dragon.x);
    if (dragon.y + dragon.size / 2 > groundY) {
      onHit();
    }

    // ===== CLOUD CEILING HIT =====
    if (dragon.y - dragon.size / 2 < 25) {
      onHit();
    }

    // ===== LIGHTNING STRIKE HIT =====
    for (const s of strikes) {
      if (Math.abs(dragon.x - s.x) < 20) {
        onHit();
      }
      s.life--;
    }

    strikes = strikes.filter(s => s.life > 0);

    if (Math.random() < 0.02) spawnStrike();
  }

  function draw(ctx) {

    // ===== GREY FLICKER CLOUD CEILING =====
    const flicker = Math.random() * 40;
    ctx.fillStyle = `rgb(${80 + flicker}, ${80 + flicker}, ${80 + flicker})`;
    ctx.fillRect(0, 0, vw(), 25);

    // ===== CLOUDS =====
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (const c of clouds) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.arc(c.x - c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ===== MOUNTAIN =====
    ctx.fillStyle = '#5c3b1e';
    ctx.beginPath();
    ctx.moveTo(0, vh());

    for (const m of mountain) {
      ctx.lineTo(m.x, vh() - m.height);
    }

    ctx.lineTo(vw(), vh());
    ctx.closePath();
    ctx.fill();

    // ===== SNOW CAPS =====
    ctx.fillStyle = 'white';

    for (let i = 1; i < mountain.length - 1; i++) {
      const m = mountain[i];

      if (m.height > 110) {
        const peakX = m.x;
        const peakY = vh() - m.height;

        ctx.beginPath();
        ctx.moveTo(peakX - 10, peakY + 10);
        ctx.lineTo(peakX, peakY);
        ctx.lineTo(peakX + 10, peakY + 10);
        ctx.closePath();
        ctx.fill();
      }
    }

    // ===== LIGHTNING STRIKES =====
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