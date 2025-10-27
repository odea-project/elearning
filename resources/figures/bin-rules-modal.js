(function() {
  const containerId = 'bin-rules-visual';
  const slideId = 'bin_rules_practice';
  const expandButtonId = 'bin-rules-expand';
  const overlayId = 'bin-rules-overlay';
  const overlayPlotId = 'bin-rules-overlay-plot';
  let previousBodyOverflow = null;

  const renderVisualization = () => {
    if (typeof d3 === 'undefined' || !window.initBinRulesVisual) {
      setTimeout(renderVisualization, 120);
      return;
    }
    window.initBinRulesVisual(containerId);
  };

  const maybeRender = (slide) => {
    if (!slide) return;
    const id = slide.getAttribute('id');
    if (id === slideId) {
      renderVisualization();
    }
  };

  const teardownOverlay = () => {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.remove();
    if (previousBodyOverflow !== null) {
      document.body.style.overflow = previousBodyOverflow;
      previousBodyOverflow = null;
    } else {
      document.body.style.overflow = '';
    }
    document.removeEventListener('keydown', handleKeydown, true);
  };

  const ensureRenderOverlay = () => {
    if (typeof d3 === 'undefined' || !window.initBinRulesVisual) {
      setTimeout(ensureRenderOverlay, 120);
      return;
    }
    requestAnimationFrame(() => window.initBinRulesVisual(overlayPlotId));
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      teardownOverlay();
    }
  };

  const createOverlay = () => {
    if (document.getElementById(overlayId)) {
      ensureRenderOverlay();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 1200',
      'background: rgba(9, 12, 24, 0.88)',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'padding: 32px 24px'
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background: #0b152c',
      'border: 1px solid #26406d',
      'border-radius: 12px',
      'box-shadow: 0 18px 46px rgba(8, 10, 24, 0.65)',
      'width: min(1100px, 92vw)',
      'height: min(90vh, 720px)',
      'padding: 24px 24px 20px',
      'display: flex',
      'flex-direction: column',
      'gap: 16px'
    ].join(';');

    const actionBar = document.createElement('div');
    actionBar.style.cssText = [
      'display: flex',
      'justify-content: flex-end'
    ].join(';');

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close histogram overlay');
    closeButton.style.cssText = [
      'background: transparent',
      'color: #9efcff',
      'border: 1px solid #2d3a66',
      'border-radius: 999px',
      'padding: 6px 14px',
      'cursor: pointer',
      'font-size: 0.9em',
      'font-weight: 600'
    ].join(';');
    closeButton.innerHTML = '<i class="fas fa-times"></i> Close';
    closeButton.addEventListener('click', teardownOverlay);

    const overlayPlot = document.createElement('div');
    overlayPlot.id = overlayPlotId;
    overlayPlot.style.cssText = [
      'flex: 1 1 auto',
      'width: 100%',
      'min-height: 60vh',
      'border: 1px solid #2d3a66',
      'border-radius: 8px',
      'padding: 12px',
      'background: rgba(17, 25, 46, 0.45)',
      'overflow: hidden'
    ].join(';');

    actionBar.appendChild(closeButton);
    panel.appendChild(actionBar);
    panel.appendChild(overlayPlot);
    overlay.appendChild(panel);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        teardownOverlay();
      }
    });

    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    document.addEventListener('keydown', handleKeydown, true);
    ensureRenderOverlay();
  };

  const setup = () => {
    maybeRender(document.getElementById(slideId));

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => maybeRender(document.getElementById(slideId)), { once: true });
    }

    const expandButton = document.getElementById(expandButtonId);
    if (expandButton) {
      expandButton.addEventListener('click', createOverlay);
    }

    if (window.Reveal && typeof window.Reveal.on === 'function') {
      window.Reveal.on('ready', event => maybeRender(event && event.currentSlide));
      window.Reveal.on('slidechanged', event => {
        maybeRender(event && event.currentSlide);
        teardownOverlay();
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();

