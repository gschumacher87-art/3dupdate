// ===== LIGHTNING PIPES (OBSTACLES) =====
const pipes = [];
const pipeWidth = 80;
const pipeGap = 180;
const pipeSpeed = 3;

function createPipe() {
  const topHeight = Math.random() * (viewHeight() - pipeGap - 100) + 50;

  return {
    x: viewWidth(),
    topHeight,
    passed: false,
    topBolt: generateBolt(topHeight),
    bottomBolt: generateBolt(viewHeight() - (topHeight + pipeGap))
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

    // branching
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
function updatePipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x < viewWidth() - 250) {
    pipes.push(createPipe());
  }

  for (const p of pipes) {
    p.x -= pipeSpeed;
  }

  // remove offscreen
  while (pipes.length && pipes[0].x < -pipeWidth) {
    pipes.shift();
  }
}

// ===== DRAW =====
function drawPipes() {
  for (const p of pipes) {

    drawBolt(p.x + pipeWidth / 2, 0, p.topBolt);
    drawBolt(p.x + pipeWidth / 2, p.topHeight + pipeGap, p.bottomBolt);

  }
}

function drawBolt(baseX, offsetY, segments) {
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

  // inner core
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