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

      // scoring
      if (!p.passed && p.x + pipeWidth < dragon.x) {
        p.passed = true;
        onScore();
      }

      // collision
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

  // ===== DRAW (ORIGINAL PIPES) =====
  function draw(ctx, viewHeight) {
    ctx.fillStyle = 'lime';

    for (const p of pipes) {

      // top pipe
      ctx.fillRect(p.x, 0, pipeWidth, p.topHeight);

      // bottom pipe
      ctx.fillRect(
        p.x,
        p.topHeight + pipeGap,
        pipeWidth,
        viewHeight() - (p.topHeight + pipeGap)
      );
    }
  }

  return {
    init,
    reset,
    update,
    draw
  };

})();