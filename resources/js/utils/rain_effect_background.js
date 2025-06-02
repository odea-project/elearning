Reveal.on('ready', () => {
  const bgContainer = document.querySelector('.reveal .backgrounds');
  if (!bgContainer) {
    console.error('Hintergrund-Container nicht gefunden!');
    return;
  }
  const canvas = document.createElement('canvas');
  canvas.classList.add('rain-canvas');
  bgContainer.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const drops = Array.from({ length: 500 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    xs: -1 + Math.random() * 2,
    ys: 8 + Math.random() * 12
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    for (const d of drops) {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.xs, d.y + d.ys);
      ctx.stroke();
      d.x += d.xs; d.y += d.ys;
      if (d.x < 0 || d.x > canvas.width || d.y > canvas.height) {
        d.x = Math.random() * canvas.width;
        d.y = -20;
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
});