/**
 * Matrix-style rain animation used for certain slides. Runs on-demand once the
 * deck is ready so it respects the Reveal background container structure.
 */
Reveal.on('ready', () => {
  // Check if matrix rain canvas already exists
  let canvas = document.querySelector('.matrix-rain-canvas');
  if (canvas) {
    console.log('Matrix rain canvas already exists, skipping creation');
    return;
  }

  canvas = document.createElement('canvas');
  canvas.classList.add('matrix-rain-canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.background = 'transparent';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const fontSize = 8;
  let columns = 0;
  let drops = [];
  const letters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array(columns).fill(0);
    ctx.font = fontSize + 'px monospace';
  }
  window.addEventListener('resize', resize);

  let animationId;
  function draw() {
    // Check if canvas is still in DOM
    if (!document.body.contains(canvas)) {
      console.warn('Matrix rain canvas removed from DOM, stopping animation');
      cancelAnimationFrame(animationId);
      return;
    }

    // 1) Fading: entferne nur die Zeichen, ohne mit Schwarz zu malen
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // je kleiner der Alpha, desto länger die Trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2) Zurück auf normales Zeichnen
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(2, 166, 255, 0.4)';
    for (let i = 0; i < columns; i++) {
      const text = letters.charAt(Math.floor(Math.random() * letters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      else drops[i]++;
    }

    animationId = requestAnimationFrame(draw);
  }

  resize();
  draw();
});
