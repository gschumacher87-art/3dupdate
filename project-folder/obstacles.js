// ===== DRAW =====
function draw(ctx) {

  // clouds
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  for (const c of clouds) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.size * 0.6, 0, Math.PI * 2);
    ctx.arc(c.x + c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
    ctx.arc(c.x - c.size * 0.5, c.y + 5, c.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // mountain base
  ctx.fillStyle = '#5c3b1e';
  ctx.beginPath();
  ctx.moveTo(0, vh());
  for (const m of mountain) {
    ctx.lineTo(m.x, vh() - m.height);
  }
  ctx.lineTo(vw(), vh());
  ctx.closePath();
  ctx.fill();

  // ===== ENEMIES (VISIBLE NOW) =====
  ctx.strokeStyle = '#ffcc00'; // bright yellow
  ctx.lineWidth = 2;
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#ffcc00';

  for (const e of enemies) {
    const y = e.y;

    ctx.beginPath();
    ctx.arc(e.x, y - 12, 4, 0, Math.PI * 2); // head
    ctx.moveTo(e.x, y - 8);
    ctx.lineTo(e.x, y); // body
    ctx.moveTo(e.x, y - 5);
    ctx.lineTo(e.x - 5, y - 2);
    ctx.moveTo(e.x, y - 5);
    ctx.lineTo(e.x + 5, y - 2);
    ctx.moveTo(e.x, y);
    ctx.lineTo(e.x - 4, y + 6);
    ctx.moveTo(e.x, y);
    ctx.lineTo(e.x + 4, y + 6);
    ctx.stroke();
  }

  ctx.shadowBlur = 0;

  // bullets
  ctx.fillStyle = 'red';
  for (const b of bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // lightning
  for (const l of lightning) {
    drawBolt(ctx, l);
  }
}