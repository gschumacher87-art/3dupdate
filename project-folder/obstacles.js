const obstacles = (() => {

  let pipes = [];
  let pipeWidth = 80;
  let pipeGap = 180;
  let speed = 3;

  let vw, vh;

  // ===== INIT =====
  function init(viewWidth, viewHeight) {
    vw = viewWidth;
    vh = viewHeight;
    pipes = [];
  }

  function reset() {
    pipes = [];
  }

  // ===== CREATE =====
  function createPipe() {
    const topHeight = Math.random() * (vh() - pipeGap - 100) + 50;

    return {
      x: vw(),
      topHeight,
      passed: false,
      topBolt: generateBolt(topHeight),
      bottomBolt: generateBolt(vh() - (topHeight + pipeGap))
    };
  }

  function generateBolt(height) {
    const segments = [];
    const step = 20;

    let x = 0;
    let y = 0;

    while (y < height) {
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

  // ===== UPDATE =====
  function update(viewHeight, viewWidth, dragon, onScore, onHit) {

    if (pipes.length === 0 || pipes[pipes.length - 1].x < viewWidth() - 250) {
      pipes.push(createPipe());
    }

    for (const p of pipes) {
      p.x -= speed;

      // scoring
      if (!p.passed && p.x + pipeWidth < dragon.x) {
        p.passed = true;
        onScore();
      }

      // collision (still rectangular = stable)
      const inX = dragon.x + dragon.size / 2 > p.x &&
                  dragon.x - dragon.size / 2 < p.x + pipeWidth;

      const hitTop = dragon.y - dragon.size / 2 < p.topHeight;
      const hitBottom = dragon.y + dragon.size / 2 > p.topHeight + pipeGap;

      if (inX && (hitTop || hitBottom)) {
        onHit();
      }
    }

    // cleanup
    while (pipes.length && pipes[0].x < -pipeWidth) {
      pipes.shift();
    }
  }

  // ===== DRAW (LIGHTNING) =====
  function draw(ctx, viewHeight) {
    for (const p of pipes) {
      drawBolt(ctx, p.x + pipeWidth / 2, 0, p.topBolt);
      drawBolt(ctx, p.x + pipeWidth / 2, p.topHeight + pipeGap, p.bottomBolt);
    }
  }

  function drawBolt(ctx, baseX, offsetY, segments) {
    const flicker = Math.random() * 3;

    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 3 + flicker;

    ctx.shadowBlur = 20 + flicker * 5;
    ctx.shadowColor = 'cyan';

    ctx.beginPath();

    let prev = { x: baseX, y: offsetY };

    for (const s of segments) {
      const jitterX = s.x + (Math.random() - 0.5) * 10;
      const jitterY = s.y + (Math.random() - 0.5) * 10;

      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(baseX + jitterX, offsetY + jitterY);

      prev = { x: baseX + jitterX, y: offsetY + jitterY };
    }

    ctx.stroke();

    // inner white core
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;

    ctx.beginPath();

    prev = { x: baseX, y: offsetY };

    for (const s of segments) {
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(baseX + s.x, offsetY + s.y);

      prev = { x: baseX + s.x, y: offsetY + s.y };
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