const obstacles = (() => {

  let vw, vh;

  const groundSpeed = 3;
  const lightningSpeedFactor = 1.5;

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
    lightning = [];
    initMountain();
  }

  function reset() {
    lightning = [];
    initMountain();
  }

  function update(viewHeight, viewWidth, dragon, onScore, onHit) {

    for (const m of mountain) m.x -= groundSpeed;

    if (mountain.length && mountain[0].x < -segmentWidth) {
      mountain.shift();
      mountain.push({
        x: mountain[mountain.length - 1].x + segmentWidth,
        height: randomHeight()
      });
    }

    const groundY = getGroundY(dragon.x);
    if (dragon.y + dragon.size / 2 > groundY) onHit();

    // ceiling
    if (dragon.y - dragon.size / 2 < 20) onHit();

    if (Math.random() < 0.02) spawnLightning();

    for (const l of lightning) {
      l.x -= groundSpeed * lightningSpeedFactor;
      l.life--;
    }

    lightning = lightning.filter(l => l.life > 0);
  }

  function draw(ctx) {

    // ceiling lightning
    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x < vw(); x += 20) {
      ctx.lineTo(x, Math.random() * 10);
    }
    ctx.stroke();

    // mountain
    ctx.fillStyle = '#5c3b1e';
    ctx.beginPath();
    ctx.moveTo(0, vh());
    for (const m of mountain) {
      ctx.lineTo(m.x, vh() - m.height);
    }
    ctx.lineTo(vw(), vh());
    ctx.closePath();
    ctx.fill();

    // snow caps
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
        ctx.fill();
      }
    }

    // lightning bolts
    for (const l of lightning) {
      ctx.strokeStyle = 'cyan';
      ctx.beginPath();
      let prev = { x: l.x, y: 0 };
      for (const s of l.segments) {
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(l.x + s.x, s.y);
        prev = { x: l.x + s.x, y: s.y };
      }
      ctx.stroke();
    }
  }

  return { init, reset, update, draw, getGroundY };

})();