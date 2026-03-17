(function () {
  const slideId = 'log-transform-bridge-slide';
  const plotId = 'nts-log-transform-bridge-plot';
  const toggleId = 'nts-log-transform-toggle';
  const knobId = 'nts-log-transform-toggle-knob';
  const panelGaussianId = 'nts-log-transform-panel-gaussian';
  const panelLogId = 'nts-log-transform-panel-log';
  const labelGaussianId = 'nts-log-transform-label-gaussian';
  const labelLogId = 'nts-log-transform-label-log';

  function gaussian(x, amplitude, mean, sigma) {
    const z = (x - mean) / sigma;
    return amplitude * Math.exp(-0.5 * z * z);
  }

  function draw() {
    const container = document.getElementById(plotId);
    const toggle = document.getElementById(toggleId);
    const knob = document.getElementById(knobId);
    const panelGaussian = document.getElementById(panelGaussianId);
    const panelLog = document.getElementById(panelLogId);
    const labelGaussian = document.getElementById(labelGaussianId);
    const labelLog = document.getElementById(labelLogId);

    if (!container || !toggle || !knob || !panelGaussian || !panelLog || !labelGaussian || !labelLog) {
      return;
    }

    if (container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    const width = 800;
    const height = 600;
    const margin = { top: 56, right: 28, bottom: 74, left: 84 };
    const xMin = -3.4;
    const xMax = 3.4;
    const yMin = -5.2;
    const yMax = 1.25;
    const amplitude = 1.08;
    const mean = 0;
    const sigma = 0.82;

    const xValues = d3.range(xMin, xMax + 1e-9, 0.05);
    const gaussianCurve = xValues.map((x) => ({ x, y: gaussian(x, amplitude, mean, sigma) }));
    const logCurve = xValues.map((x) => ({
      x,
      y: Math.log(Math.max(gaussian(x, amplitude, mean, sigma), 1e-6)),
    }));
    const sampleXs = d3.range(-2.7, 2.71, 0.45);

    const fig = plotUtils.createFigure(plotId, width, height, margin);
    plotUtils.addAxes(fig, [xMin, xMax], [yMin, yMax], 7, 6);

    d3.select(`#${plotId} svg`)
      .style('background', 'linear-gradient(180deg, rgba(4, 17, 26, 0.42), rgba(4, 17, 26, 0.14))')
      .style('border-radius', '14px')
      .style('border', '2px solid rgba(0, 255, 255, 0.16)')
      .style('box-shadow', '0 0 24px rgba(0, 255, 255, 0.08)');

    const gridValues = d3.range(yMin, yMax + 1e-9, (yMax - yMin) / 5);
    fig.svg.append('g')
      .selectAll('line')
      .data(gridValues)
      .enter()
      .append('line')
      .attr('x1', fig.xScale(xMin))
      .attr('x2', fig.xScale(xMax))
      .attr('y1', (value) => fig.yScale(value))
      .attr('y2', (value) => fig.yScale(value))
      .attr('stroke', 'rgba(255, 255, 255, 0.10)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '5 7');

    fig.svg.append('line')
      .attr('x1', fig.xScale(xMin))
      .attr('x2', fig.xScale(xMax))
      .attr('y1', fig.yScale(0))
      .attr('y2', fig.yScale(0))
      .attr('stroke', 'rgba(255, 209, 102, 0.55)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8 7');

    const line = d3.line()
      .x((point) => fig.xScale(point.x))
      .y((point) => fig.yScale(point.y))
      .curve(d3.curveMonotoneX);

    const glowPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 95, 210, 0.26)')
      .attr('stroke-width', 12)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    const curvePath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#ff5fd2')
      .attr('stroke-width', 5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    const samplePoints = fig.svg.append('g')
      .selectAll('circle')
      .data(sampleXs)
      .enter()
      .append('circle')
      .attr('r', 4.5)
      .attr('fill', '#00ffd5')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2)
      .attr('opacity', 0.95);

    const gaussianTitle = fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', -18)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Gaussian peak on the original intensity scale');

    const logTitle = fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', -18)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .style('opacity', 0)
      .text('Log-transformed peak becomes quadratic');

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 54)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Centered retention time');

    const gaussianYLabel = fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -58)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '11px')
      .text('Intensity');

    const logYLabel = fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -58)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '11px')
      .style('opacity', 0)
      .text('log(Intensity)');

    let currentMix = 0;

    function mixedY(x, mix) {
      const g = gaussian(x, amplitude, mean, sigma);
      const l = Math.log(Math.max(g, 1e-6));
      return g * (1 - mix) + l * mix;
    }

    function renderVisualState(mix) {
      const mixedCurve = xValues.map((x) => ({ x, y: mixedY(x, mix) }));
      glowPath.attr('d', line(mixedCurve));
      curvePath.attr('d', line(mixedCurve));

      samplePoints
        .attr('cx', (x) => fig.xScale(x))
        .attr('cy', (x) => fig.yScale(mixedY(x, mix)));

      gaussianTitle.style('opacity', 1 - mix);
      logTitle.style('opacity', mix);
      gaussianYLabel.style('opacity', 1 - mix);
      logYLabel.style('opacity', mix);
    }

    function applyCopyState(isLog) {
      panelGaussian.style.opacity = isLog ? '0' : '1';
      panelGaussian.style.transform = isLog ? 'translateY(-14px)' : 'translateY(0px)';
      panelGaussian.style.pointerEvents = isLog ? 'none' : 'auto';

      panelLog.style.opacity = isLog ? '1' : '0';
      panelLog.style.transform = isLog ? 'translateY(0px)' : 'translateY(14px)';
      panelLog.style.pointerEvents = isLog ? 'auto' : 'none';

      labelGaussian.style.opacity = isLog ? '0.45' : '1';
      labelGaussian.style.color = isLog ? '#8aa3ad' : '#00ffd5';
      labelLog.style.opacity = isLog ? '1' : '0.45';
      labelLog.style.color = isLog ? '#ffd166' : '#8aa3ad';
    }

    function applyToggleChrome(isLog) {
      const track = toggle.nextElementSibling;
      if (track) {
        track.style.background = isLog ? '#7c3aed' : '#10303a';
        track.style.borderColor = isLog ? '#ffd166' : 'rgba(0, 255, 255, 0.28)';
      }
      knob.style.transform = isLog ? 'translateX(28px)' : 'translateX(0px)';
      knob.style.background = isLog ? '#ffd166' : '#00ffd5';
    }

    function animateTo(targetMix) {
      const startMix = currentMix;
      d3.select({})
        .transition()
        .duration(750)
        .ease(d3.easeCubicInOut)
        .tween('curve-morph', function () {
          const interpolate = d3.interpolateNumber(startMix, targetMix);
          return function (t) {
            renderVisualState(interpolate(t));
          };
        })
        .on('end', function () {
          currentMix = targetMix;
          renderVisualState(currentMix);
        });
    }

    function syncState(animate) {
      const isLog = !!toggle.checked;
      applyToggleChrome(isLog);
      applyCopyState(isLog);
      if (animate) {
        animateTo(isLog ? 1 : 0);
      } else {
        currentMix = isLog ? 1 : 0;
        renderVisualState(currentMix);
      }
    }

    toggle.addEventListener('change', function () {
      syncState(true);
    });

    syncState(false);
  }

  function register() {
    if (
      typeof window.d3 === 'undefined' ||
      typeof window.plotUtils === 'undefined' ||
      typeof window.Reveal === 'undefined'
    ) {
      setTimeout(register, 80);
      return;
    }

    plotUtils.renderOnSlideOnce({ slideId, containerId: plotId, draw });
  }

  register();
})();