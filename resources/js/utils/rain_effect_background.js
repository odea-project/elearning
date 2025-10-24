/**
 * Adds a subtle rain overlay to the slide background. Rendered on a canvas so
 * it does not interfere with pointer events.
 */
Reveal.on('ready', () => {
  // Check if rain canvas already exists
  let canvas = document.querySelector('.rain-canvas');
  if (canvas) {
    console.log('Rain canvas already exists, skipping creation');
    return;
  }

  const bgContainer = document.querySelector('.reveal .backgrounds');
  if (!bgContainer) {
    console.error('Hintergrund-Container nicht gefunden!');
    return;
  }
  
  canvas = document.createElement('canvas');
  canvas.classList.add('rain-canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1'; // Behind everything but still visible
  
  // Append to body instead of backgrounds to prevent removal
  document.body.appendChild(canvas);
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

  let animationId;
  function draw() {
    // Check if canvas is still in DOM
    if (!document.body.contains(canvas)) {
      console.warn('Rain canvas removed from DOM, stopping animation');
      cancelAnimationFrame(animationId);
      return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 3;
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
    animationId = requestAnimationFrame(draw);
  }
  draw();
});