(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_CURVE = '#1864ab';
  const COLOR_FILL = '#f9844a';
  const COLOR_CRITICAL = '#e63946';
  const COLOR_HIGHLIGHT = 'rgba(249, 132, 74, 0.28)';

  function normalPdf(x, mean = 0, sd = 1) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -((x - mean) ** 2) / (2 * sd * sd);
    return coefficient * Math.exp(exponent);
  }

  window.initNullDistribution = function initNullDistribution(targetId = 'null-distribution-chart') {
    if (!window.d3) {
      console.warn('D3 not loaded. Null distribution chart will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight || 0, 490);

    const margin = { top: 40, right: 40, bottom: 56, left: 56 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Null distribution showing critical regions for hypothesis testing');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = [-4, 4];
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);

    const yMax = normalPdf(0);
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.15])
      .range([height, 0]);

    const lineData = d3.range(xDomain[0], xDomain[1] + 0.001, 0.02)
      .map(x => ({ x, y: normalPdf(x) }));

    // Critical value for α = 0.05 (two-tailed)
    const criticalValue = 1.96;

    const areaGenerator = d3.area()
      .x(d => xScale(d.x))
      .y0(() => yScale(0))
      .y1(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.6));

    // Right tail
    const tailDataRight = lineData.filter(d => d.x >= criticalValue);
    g.append('path')
      .datum(tailDataRight)
      .attr('fill', COLOR_HIGHLIGHT)
      .attr('stroke', COLOR_FILL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

    // Left tail
    const tailDataLeft = lineData.filter(d => d.x <= -criticalValue);
    g.append('path')
      .datum(tailDataLeft)
      .attr('fill', COLOR_HIGHLIGHT)
      .attr('stroke', COLOR_FILL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

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

    // Critical value markers
    const addCriticalMarker = (value, label) => {
      const xPos = xScale(value);
      g.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', yScale(0))
        .attr('y2', yScale(normalPdf(value)))
        .attr('stroke', COLOR_CRITICAL)
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '4,3');

      g.append('text')
        .attr('x', xPos + (value > 0 ? 6 : -6))
        .attr('y', yScale(normalPdf(value)) - 10)
        .attr('text-anchor', value > 0 ? 'start' : 'end')
        .classed('d3-chart-body-text', true)
        .attr('fill', COLOR_CRITICAL)
        .text(label);
    };

    addCriticalMarker(criticalValue, 'Critical value');
    addCriticalMarker(-criticalValue, 'Critical value');

    // Axes
    const axisBottom = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(9))
      .classed('d3-axis', true);

    const axisLeft = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);

    // Axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Test Statistic (assuming H₀ is true)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Probability Density');

    // Annotations
    g.append('text')
      .attr('x', width / 2)
      .attr('y', yScale(yMax * 0.4))
      .attr('text-anchor', 'middle')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_CURVE)
      .attr('font-weight', 'bold')
      .text('Distribution under H₀');

    g.append('text')
      .attr('x', xScale(criticalValue + 0.1))
      .attr('y', yScale(normalPdf(criticalValue)) - 50)
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_FILL)
      .text('Rejection region');

    g.append('text')
      .attr('x', xScale(-criticalValue - 0.1))
      .attr('y', yScale(normalPdf(-criticalValue)) - 50)
      .attr('text-anchor', 'end')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_FILL)
      .text('Rejection region');

    g.append('text')
      .attr('x', width - 10)
      .attr('y', 20)
      .attr('text-anchor', 'end')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_AXIS)
      .text('α/2 = 0.025 each tail');
  };
})();
