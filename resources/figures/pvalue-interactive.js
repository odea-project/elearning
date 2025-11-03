(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_CURVE = '#1864ab';
  const COLOR_FILL = '#f9844a';
  const COLOR_HIGHLIGHT = 'rgba(249, 132, 74, 0.28)';
  const COLOR_SLIDER = '#06d6a0';

  function normalPdf(x, mean = 0, sd = 1) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -((x - mean) ** 2) / (2 * sd * sd);
    return coefficient * Math.exp(exponent);
  }

  function normalCdf(x, mean = 0, sd = 1) {
    const z = (x - mean) / (sd * Math.sqrt(2));
    return 0.5 * (1 + erf(z));
  }

  function erf(x) {
    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * absX);
    const poly = (((a5 * t + a4) * t + a3) * t + a2) * t + a1;
    const approx = 1 - poly * Math.exp(-absX * absX);
    return sign * approx;
  }

  window.initPValueInteractive = function initPValueInteractive(targetId = 'pvalue-interactive-chart') {
    if (!window.d3) {
      console.warn('D3 not loaded. P-value interactive chart will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight || 0, 400);

    const margin = { top: 60, right: 40, bottom: 80, left: 56 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Interactive p-value visualization');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = [-4, 4];
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);

    const yMax = normalPdf(0);
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);

    const lineData = d3.range(xDomain[0], xDomain[1] + 0.001, 0.02)
      .map(x => ({ x, y: normalPdf(x) }));

    let observedValue = 1.5;

    const areaGenerator = d3.area()
      .x(d => xScale(d.x))
      .y0(() => yScale(0))
      .y1(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.6));

    // Tail areas (will be updated)
    const rightTailPath = g.append('path')
      .attr('fill', COLOR_HIGHLIGHT)
      .attr('stroke', COLOR_FILL)
      .attr('stroke-width', 1.5);

    const leftTailPath = g.append('path')
      .attr('fill', COLOR_HIGHLIGHT)
      .attr('stroke', COLOR_FILL)
      .attr('stroke-width', 1.5);

    // Main curve
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.6));

    g.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', COLOR_CURVE)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Observed value marker
    const markerLine = g.append('line')
      .attr('y1', yScale(0))
      .attr('stroke', COLOR_SLIDER)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,4');

    const markerText = g.append('text')
      .attr('y', yScale(normalPdf(observedValue)) - 12)
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_SLIDER)
      .attr('font-weight', 'bold');

    // P-value display
    const pValueText = g.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_FILL)
      .attr('font-size', '1.2em')
      .attr('font-weight', 'bold');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(9))
      .classed('d3-axis', true);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);

    // Axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 36)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Test Statistic');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Probability Density');

    // Slider
    const sliderY = height + 60;
    const sliderGroup = g.append('g')
      .attr('transform', `translate(0,${sliderY})`);

    sliderGroup.append('line')
      .attr('x1', xScale(-3.5))
      .attr('x2', xScale(3.5))
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', COLOR_AXIS)
      .attr('stroke-width', 2);

    const sliderHandle = sliderGroup.append('circle')
      .attr('r', 8)
      .attr('fill', COLOR_SLIDER)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer');

    function updateVisualization(value) {
      observedValue = value;

      // Update tail areas
      const tailDataRight = lineData.filter(d => d.x >= Math.abs(value));
      const tailDataLeft = lineData.filter(d => d.x <= -Math.abs(value));

      rightTailPath.datum(tailDataRight).attr('d', areaGenerator);
      leftTailPath.datum(tailDataLeft).attr('d', areaGenerator);

      // Update marker
      const xPos = xScale(value);
      markerLine
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y2', yScale(normalPdf(value)));

      markerText
        .attr('x', xPos + 6)
        .text(`Observed: ${value.toFixed(2)}`);

      // Calculate two-tailed p-value
      const pValue = 2 * (1 - normalCdf(Math.abs(value)));
      pValueText.text(`Two-tailed p-value: ${pValue.toFixed(4)}`);

      // Update slider handle
      sliderHandle.attr('cx', xPos);
    }

    // Drag behavior
    const drag = d3.drag()
      .on('drag', function(event) {
        const x = Math.max(xScale(-3.5), Math.min(xScale(3.5), event.x));
        const value = xScale.invert(x);
        updateVisualization(value);
      });

    sliderHandle.call(drag);

    // Initialize
    updateVisualization(observedValue);
  };
})();
