(function () {
  const slideId = 'piecewise-parabola-slide';
  const plotId = 'piecewise-parabola-plot';
  const toggleId = 'piecewise-parabola-scale-toggle';
  const knobId = 'piecewise-parabola-scale-toggle-knob';
  const labelLinearId = 'piecewise-parabola-label-linear';
  const labelLogId = 'piecewise-parabola-label-log';
  const modeToggleId = 'piecewise-parabola-mode-toggle';
  const modeKnobId = 'piecewise-parabola-mode-toggle-knob';
  const labelMergedId = 'piecewise-parabola-label-merged';
  const labelSeparateId = 'piecewise-parabola-label-separate';

  function modelValue(x, params) {
    const quadratic = x < 0 ? params.beta2 * x * x : params.beta3 * x * x;
    return params.beta0 + params.beta1 * x + quadratic;
  }

  function buildCurve(params, xMin, xMax, step) {
    return d3.range(xMin, xMax + 1e-9, step).map((x) => {
      const logValue = modelValue(x, params);
      return {
        x,
        logValue,
        intensity: Math.exp(logValue),
      };
    });
  }

  function buildComponentCurve(params, coefficient, xMin, xMax, step) {
    return d3.range(xMin, xMax + 1e-9, step).map((x) => {
      const logValue = params.beta0 + params.beta1 * x + coefficient * x * x;
      return {
        x,
        logValue,
        intensity: Math.exp(logValue),
      };
    });
  }

  function dynamicParameters(t) {
    const beta0 = 3.1;
    const beta1 = Math.sin(t * 0.8) * 0.1;
    const quadMidpoint = -0.175;
    const quadAmplitude = 0.125;
    const beta2 = quadMidpoint + Math.sin(t * 0.47 + 0.7) * quadAmplitude;
    const beta3 = quadMidpoint + Math.cos(t * 0.62 - 0.35) * quadAmplitude;

    return { beta0, beta1, beta2, beta3 };
  }

  function fmt(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
  }

  function draw() {
    const container = document.getElementById(plotId);
    const toggle = document.getElementById(toggleId);
    const knob = document.getElementById(knobId);
    const labelLinear = document.getElementById(labelLinearId);
    const labelLog = document.getElementById(labelLogId);
    const modeToggle = document.getElementById(modeToggleId);
    const modeKnob = document.getElementById(modeKnobId);
    const labelMerged = document.getElementById(labelMergedId);
    const labelSeparate = document.getElementById(labelSeparateId);

    if (!container || !toggle || !knob || !labelLinear || !labelLog || !modeToggle || !modeKnob || !labelMerged || !labelSeparate) return;
    if (container.dataset.bound === '1') return;
    container.dataset.bound = '1';

    const width = 800;
    const height = 600;
    const margin = { top: 58, right: 30, bottom: 76, left: 94 };
    const xMin = -7;
    const xMax = 7;
    const fig = plotUtils.createFigure(plotId, width, height, margin);

    const linearYDomain = [0.04, 30];
    const logYDomain = [-3.2, 3.6];

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, fig.width]);
    const yLinearScale = d3.scaleLinear().domain(linearYDomain).range([fig.height, 0]);
    const yLogScale = d3.scaleLinear().domain(logYDomain).range([fig.height, 0]);

    fig.xScale = xScale;
    fig.yScale = yLinearScale;

    const xAxis = d3.axisBottom(xScale).ticks(7).tickSizeOuter(0);
    const yAxisLinear = d3.axisLeft(yLinearScale).ticks(6).tickSizeOuter(0);
    const yAxisLog = d3.axisLeft(yLogScale).ticks(7).tickSizeOuter(0);

    fig.xAxisGroup.call(xAxis);
    fig.yAxisGroup.call(yAxisLinear);

    fig.xAxisGroup.selectAll('path, line').style('stroke', 'var(--d3-axis-line-color)').style('stroke-width', '2px');
    fig.yAxisGroup.selectAll('path, line').style('stroke', 'var(--d3-axis-line-color)').style('stroke-width', '2px');
    fig.xAxisGroup.selectAll('text').style('fill', 'var(--d3-axis-text-color)').style('font-size', '14px').style('font-family', "'Press Start 2P', monospace");
    fig.yAxisGroup.selectAll('text').style('fill', 'var(--d3-axis-text-color)').style('font-size', '14px').style('font-family', "'Press Start 2P', monospace");

    d3.select(`#${plotId} svg`)
      .style('background', 'linear-gradient(180deg, rgba(4, 17, 26, 0.42), rgba(4, 17, 26, 0.16))')
      .style('border-radius', '14px')
      .style('border', '2px solid rgba(0, 255, 255, 0.16)')
      .style('box-shadow', '0 0 24px rgba(0, 255, 255, 0.08)');

    const gridGroup = fig.svg.append('g');
    const centerLine = fig.svg.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('stroke', '#ffd166')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8 7');

    const centerText = fig.svg.append('text')
      .attr('x', xScale(0) + 10)
      .style('fill', '#ffd166')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px')
      .text('junction at x = 0');

    const leftHint = fig.svg.append('text')
      .attr('x', xScale(-4.7))
      .style('fill', '#00ffd5')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px')
      .text('left half uses beta2');

    const rightHint = fig.svg.append('text')
      .attr('x', xScale(1.25))
      .style('fill', '#ff8ae0')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px')
      .text('right half uses beta3');

    const titleText = fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', -18)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Asymmetric peak from two quadratic halves');

    const xLabel = fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 56)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('x');

    const yLabelLinear = fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -68)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '11px')
      .text('exp(beta...) intensity');

    const yLabelLog = fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -68)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '11px')
      .style('opacity', 0)
      .text('log intensity');

    const parameterText = fig.svg.append('text')
      .attr('x', 0)
      .attr('y', fig.height + 20)
      .style('fill', '#c9f7ff')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '10px');

    const peakGlow = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 255, 213, 0.24)')
      .attr('stroke-width', 12)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    const peakPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#00ffd5')
      .attr('stroke-width', 5)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round');

    const leftSolidPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#00ffd5')
      .attr('stroke-width', 4.2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0);

    const rightSolidPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', '#ff8ae0')
      .attr('stroke-width', 4.2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('opacity', 0);

    const leftGhostPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0, 255, 213, 0.82)')
      .attr('stroke-width', 2.4)
      .attr('stroke-dasharray', '7 7')
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0.8);

    const rightGhostPath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(255, 138, 224, 0.82)')
      .attr('stroke-width', 2.4)
      .attr('stroke-dasharray', '7 7')
      .attr('stroke-linecap', 'round')
      .attr('opacity', 0.8);

    const samplePoints = fig.svg.append('g')
      .selectAll('circle')
      .data(d3.range(-6, 6.01, 1.2))
      .enter()
      .append('circle')
      .attr('r', 4.2)
      .attr('fill', '#ff8ae0')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.1)
      .attr('opacity', 0.95);

    let isLogView = false;
    let isSeparateMode = false;
    let latestCurve = [];
    let latestLeftGhostCurve = [];
    let latestRightGhostCurve = [];

    function currentScale() {
      return isLogView ? yLogScale : yLinearScale;
    }

    function currentY(point) {
      return isLogView ? point.logValue : point.intensity;
    }

    function updateAxes() {
      const scale = currentScale();
      fig.yScale = scale;
      const axis = isLogView ? yAxisLog : yAxisLinear;
      fig.yAxisGroup.transition().duration(450).ease(d3.easeCubicInOut).call(axis);
      fig.yAxisGroup.selectAll('path, line').style('stroke', 'var(--d3-axis-line-color)').style('stroke-width', '2px');
      fig.yAxisGroup.selectAll('text').style('fill', 'var(--d3-axis-text-color)').style('font-size', '14px').style('font-family', "'Press Start 2P', monospace");

      const gridValues = (isLogView ? d3.range(logYDomain[0], logYDomain[1] + 1e-9, 1) : d3.range(linearYDomain[0], linearYDomain[1] + 1e-9, 5));
      const lines = gridGroup.selectAll('line').data(gridValues);
      lines.enter()
        .append('line')
        .merge(lines)
        .transition()
        .duration(450)
        .ease(d3.easeCubicInOut)
        .attr('x1', xScale(xMin))
        .attr('x2', xScale(xMax))
        .attr('y1', (value) => scale(value))
        .attr('y2', (value) => scale(value))
        .attr('stroke', 'rgba(255, 255, 255, 0.10)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5 7');
      lines.exit().remove();

      centerLine.transition().duration(450).ease(d3.easeCubicInOut)
        .attr('y1', scale(isLogView ? logYDomain[0] : linearYDomain[0]))
        .attr('y2', scale(isLogView ? logYDomain[1] : linearYDomain[1]));
      centerText.transition().duration(450).ease(d3.easeCubicInOut)
        .attr('y', scale(isLogView ? logYDomain[1] - 0.3 : linearYDomain[1] - 1.5));
      leftHint.transition().duration(450).ease(d3.easeCubicInOut)
        .attr('y', scale(isLogView ? logYDomain[1] - 0.75 : linearYDomain[1] - 4.5));
      rightHint.transition().duration(450).ease(d3.easeCubicInOut)
        .attr('y', scale(isLogView ? logYDomain[0] + 0.55 : linearYDomain[0] + 3.4));

      yLabelLinear.transition().duration(300).style('opacity', isLogView ? 0 : 1);
      yLabelLog.transition().duration(300).style('opacity', isLogView ? 1 : 0);
      if (isSeparateMode) {
        titleText.text(isLogView ? 'Separate parabolas on a log y-axis' : 'Separate parabolas behind the merged peak');
      } else {
        titleText.text(isLogView ? 'Same peak, but on a log y-axis' : 'Asymmetric peak from two quadratic halves');
      }
    }

    function renderCurve(curve, leftGhostCurve, rightGhostCurve) {
      latestCurve = curve;
      latestLeftGhostCurve = leftGhostCurve;
      latestRightGhostCurve = rightGhostCurve;
      const scale = currentScale();
      const line = d3.line()
        .x((point) => xScale(point.x))
        .y((point) => scale(currentY(point)))
        .curve(d3.curveMonotoneX);

      const leftGhostLine = d3.line()
        .defined((point) => point.x >= 0)
        .x((point) => xScale(point.x))
        .y((point) => scale(currentY(point)))
        .curve(d3.curveMonotoneX);

      const rightGhostLine = d3.line()
        .defined((point) => point.x < 0)
        .x((point) => xScale(point.x))
        .y((point) => scale(currentY(point)))
        .curve(d3.curveMonotoneX);

      const leftSolidLine = d3.line()
        .defined((point) => point.x < 0)
        .x((point) => xScale(point.x))
        .y((point) => scale(currentY(point)))
        .curve(d3.curveMonotoneX);

      const rightSolidLine = d3.line()
        .defined((point) => point.x >= 0)
        .x((point) => xScale(point.x))
        .y((point) => scale(currentY(point)))
        .curve(d3.curveMonotoneX);

      peakGlow.attr('d', line(curve));
      peakPath.attr('d', line(curve));
      leftGhostPath.attr('d', leftGhostLine(leftGhostCurve));
      rightGhostPath.attr('d', rightGhostLine(rightGhostCurve));
      leftSolidPath.attr('d', leftSolidLine(leftGhostCurve));
      rightSolidPath.attr('d', rightSolidLine(rightGhostCurve));

      peakGlow.attr('opacity', isSeparateMode ? 0 : 1);
      peakPath.attr('opacity', isSeparateMode ? 0 : 1);
      leftSolidPath.attr('opacity', isSeparateMode ? 1 : 0);
      rightSolidPath.attr('opacity', isSeparateMode ? 1 : 0);
      samplePoints.attr('opacity', isSeparateMode ? 0 : 0.95);

      samplePoints
        .data(curve.filter((_, index) => index % 20 === 0))
        .attr('cx', (point) => xScale(point.x))
        .attr('cy', (point) => scale(currentY(point)));
    }

    function applyToggleChrome() {
      const track = toggle.nextElementSibling;
      if (track) {
        track.style.background = isLogView ? '#7c3aed' : '#10303a';
        track.style.borderColor = isLogView ? '#ffd166' : 'rgba(0, 255, 255, 0.28)';
      }
      knob.style.transform = isLogView ? 'translateX(28px)' : 'translateX(0px)';
      knob.style.background = isLogView ? '#ffd166' : '#00ffd5';
      labelLinear.style.opacity = isLogView ? '0.45' : '1';
      labelLinear.style.color = isLogView ? '#8aa3ad' : '#00ffd5';
      labelLog.style.opacity = isLogView ? '1' : '0.45';
      labelLog.style.color = isLogView ? '#ffd166' : '#8aa3ad';
    }

    function applyModeToggleChrome() {
      const track = modeToggle.nextElementSibling;
      if (track) {
        track.style.background = isSeparateMode ? '#3a1030' : '#10303a';
        track.style.borderColor = isSeparateMode ? 'rgba(255, 138, 224, 0.55)' : 'rgba(0, 255, 255, 0.28)';
      }
      modeKnob.style.transform = isSeparateMode ? 'translateX(28px)' : 'translateX(0px)';
      modeKnob.style.background = isSeparateMode ? '#ff8ae0' : '#00ffd5';
      labelMerged.style.opacity = isSeparateMode ? '0.45' : '1';
      labelMerged.style.color = isSeparateMode ? '#8aa3ad' : '#00ffd5';
      labelSeparate.style.opacity = isSeparateMode ? '1' : '0.45';
      labelSeparate.style.color = isSeparateMode ? '#ff8ae0' : '#8aa3ad';
    }

    toggle.addEventListener('change', function () {
      isLogView = !!toggle.checked;
      applyToggleChrome();
      updateAxes();
      renderCurve(latestCurve, latestLeftGhostCurve, latestRightGhostCurve);
    });

    modeToggle.addEventListener('change', function () {
      isSeparateMode = !!modeToggle.checked;
      applyModeToggleChrome();
      updateAxes();
      renderCurve(latestCurve, latestLeftGhostCurve, latestRightGhostCurve);
    });

    applyToggleChrome();
    applyModeToggleChrome();
    updateAxes();

    const start = Date.now();
    d3.timer(function () {
      const t = (Date.now() - start) / 1000;
      const params = dynamicParameters(t);
      const curve = buildCurve(params, xMin, xMax, 0.08);
      const leftGhostCurve = buildComponentCurve(params, params.beta2, xMin, xMax, 0.08);
      const rightGhostCurve = buildComponentCurve(params, params.beta3, xMin, xMax, 0.08);
      parameterText.text(`beta1 ${fmt(params.beta1)}   beta2 ${fmt(params.beta2)}   beta3 ${fmt(params.beta3)}`);
      renderCurve(curve, leftGhostCurve, rightGhostCurve);
    });
  }

  function register() {
    if (typeof window.d3 === 'undefined' || typeof window.plotUtils === 'undefined' || typeof window.Reveal === 'undefined') {
      setTimeout(register, 80);
      return;
    }

    plotUtils.renderOnSlideOnce({ slideId, containerId: plotId, draw });
  }

  register();
})();