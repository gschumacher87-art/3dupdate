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
      life: 20
    });
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

  // ===== CREATE =====
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

    // ===== PIPES (UNCHANGED) =====
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

    // ===== LIGHTNING UPDATE =====
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

    // ===== PIPES (UNCHANGED) =====
    ctx.fillStyle = 'lime';

    for (const p of pipes) {

      ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);

      ctx.fillRect(
        p.x,
        p.topHeight + pipeGap,
        pipeWidth,
        viewHeight() - (p.topHeight + pipeGap)
      );
    }

    // ===== LIGHTNING DRAW =====
    for (const l of lightning) {
      drawBolt(ctx, l.x);
    }
  }

  function drawBolt(ctx, x) {
    const step = 20;
    let y = 0;
    let offsetX = 0;

    ctx.strokeStyle = 'cyan';
    ctx.lineWidth = 2 + Math.random() * 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'cyan';

    ctx.beginPath();
    ctx.moveTo(x, 0);

    while (y < vh()) {
      offsetX += (Math.random() - 0.5) * 30;
      y += step;

      ctx.lineTo(x + offsetX, y);
    }

    ctx.stroke();

    // core
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x, 0);

    y = 0;
    offsetX = 0;

    while (y < vh()) {
      offsetX += (Math.random() - 0.5) * 10;
      y += step;

      ctx.lineTo(x + offsetX, y);
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