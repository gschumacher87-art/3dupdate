const obstacles = (() => {

  let pipes = [];
  let pipeWidth = 80;
  let pipeGap = 180;
  let speed = 3;

  let vw, vh;

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
    const step = 20;

    let x = 0;
    let y = 0;

    while (y < vh()) {
      x += (Math.random() - 0.5) * 40;
      y += step;

      segments.push({ x, y });

      if (Math.random() < 0.2) {
        segments.push({
          x: x + (Math.random() - 0.5) * 50,
          y: y + step
        });
      }
    }

    return segments;
  }

  // ===== INIT =====
  function init(viewWidth, viewHeight) {
    vw = viewWidth;
    vh = viewHeight;
    pipes = [];
    lightning = [];
  }

  function reset() {
    pipes = [];
    lightning = [];
  }

  // ===== CREATE PIPE =====
  function createPipe() {
    const topHeight = Math.random() * (vh() - pipeGap - 100) + 50;

    return {
      x: vw(),
      topHeight,
      passed: false
    };
  }

  // ===== UPDATE =====
  function update(viewHeight, viewWidth, dragon, onScore, onHit) {

    if (pipes.length === 0 || pipes[pipes.length - 1].x < viewWidth() - 250) {
      pipes.push(createPipe());
    }

    for (const p of pipes) {
      p.x -= speed;

      if (!p.passed && p.x + pipeWidth < dragon.x) {
        p.passed = true;
        onScore();
      }

      const inX = dragon.x + dragon.size / 2 > p.x &&
                  dragon.x - dragon.size / 2 < p.x + pipeWidth;

      const hitTop = dragon.y - dragon.size / 2 < p.topHeight;
      const hitBottom = dragon.y + dragon.size / 2 > p.topHeight + pipeGap;

      if (inX && (hitTop || hitBottom)) {
        onHit();
      }
    }

    while (pipes.length && pipes[0].x < -pipeWidth) {
      pipes.shift();
    }

    // ===== LIGHTNING =====
    if (Math.random() < 0.02) {
      spawnLightning();
    }

    for (const l of lightning) {
      l.x -= speed * 1.5;
      l.life--;
    }

    lightning = lightning.filter(l => l.life > 0);
  }

  // ===== DRAW =====
  function draw(ctx, viewHeight) {

    // ===== TOP PIPES (UNCHANGED) =====
    ctx.fillStyle = 'lime';

    for (const p of pipes) {
      ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);
    }

    // ===== MOUNTAIN RANGE (BOTTOM) =====
    ctx.fillStyle = 'darkgreen';

    for (const p of pipes) {

      const baseY = p.topHeight + pipeGap;

      ctx.beginPath();

      // start left
      ctx.moveTo(p.x, viewHeight());

      // jagged mountain peaks
      const steps = 6;
      const stepWidth = pipeWidth / steps;

      for (let i = 0; i <= steps; i++) {
        const x = p.x + i * stepWidth;
        const peakOffset = (Math.random() - 0.5) * 40;

        ctx.lineTo(x, baseY + peakOffset);
      }

      // right side down
      ctx.lineTo(p.x + pipeWidth, viewHeight());

      ctx.closePath();
      ctx.fill();
    }

    // ===== LIGHTNING =====
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

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    ctx.beginPath();

    prev = { x: l.x, y: 0 };

    for (const s of l.segments) {
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(l.x + s.x, s.y);

      prev = { x: l.x + s.x, y: s.y };
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