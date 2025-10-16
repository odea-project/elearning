/**
 * Matrix-style rain animation used for certain slides. Runs on-demand once the
 * deck is ready so it respects the Reveal background container structure.
 */
Reveal.on('ready', () => {
  const bgContainer = document.querySelector('.reveal .backgrounds');
  if (!bgContainer) return;

  const canvas = document.createElement('canvas');
  canvas.classList.add('rain-canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.background = 'transparent';
  bgContainer.appendChild(canvas);
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

  function draw() {
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

    requestAnimationFrame(draw);
  }

  resize();
  draw();
});
