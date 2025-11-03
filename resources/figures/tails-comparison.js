(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_ONE_TAIL = '#06d6a0';
  const COLOR_TWO_TAIL = '#ff6b35';
  const COLOR_HIGHLIGHT_ONE = 'rgba(6, 214, 160, 0.25)';
  const COLOR_HIGHLIGHT_TWO = 'rgba(255, 107, 53, 0.25)';

  function normalPdf(x, mean = 0, sd = 1) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -((x - mean) ** 2) / (2 * sd * sd);
    return coefficient * Math.exp(exponent);
  }

  window.initTailsComparison = function initTailsComparison(targetId = 'tails-comparison-chart') {
    if (!window.d3) {
      console.warn('D3 not loaded. Tails comparison chart will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight || 0, 540);

    const margin = { top: 30, right: 40, bottom: 56, left: 56 };
    const plotHeight = (containerHeight - margin.top - margin.bottom - 40) / 2;
    const width = containerWidth - margin.left - margin.right;

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Comparison of one-tailed and two-tailed tests');

    const xDomain = [-4, 4];
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);

    const yMax = normalPdf(0);
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([plotHeight, 0]);

    const lineData = d3.range(xDomain[0], xDomain[1] + 0.001, 0.02)
      .map(x => ({ x, y: normalPdf(x) }));

    const observedValue = 1.65;

    const areaGenerator = d3.area()
      .x(d => xScale(d.x))
      .y0(() => yScale(0))
      .y1(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.6));

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.6));

    // ONE-TAILED TEST (top)
    const gOne = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    gOne.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .attr('fill', COLOR_ONE_TAIL)
      .attr('font-weight', 'bold')
      .attr('font-size', '1.1em')
      .text('One-Tailed Test (Right Tail)');

    // Right tail only
    const tailDataRight = lineData.filter(d => d.x >= observedValue);
    gOne.append('path')
      .datum(tailDataRight)
      .attr('fill', COLOR_HIGHLIGHT_ONE)
      .attr('stroke', COLOR_ONE_TAIL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

    // Main curve
    gOne.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', COLOR_ONE_TAIL)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Marker
    const xPos = xScale(observedValue);
    gOne.append('line')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', yScale(0))
      .attr('y2', yScale(normalPdf(observedValue)))
      .attr('stroke', COLOR_ONE_TAIL)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,4');

    gOne.append('text')
      .attr('x', xPos + 8)
      .attr('y', yScale(normalPdf(observedValue)) - 10)
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_ONE_TAIL)
      .text(`Observed: ${observedValue}`);

    // P-value annotation
    gOne.append('text')
      .attr('x', xScale(2.5))
      .attr('y', yScale(yMax * 0.3))
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_ONE_TAIL)
      .attr('font-weight', 'bold')
      .text('p ≈ 0.0495');

    // Axes
    gOne.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(9))
      .classed('d3-axis', true);

    gOne.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);

    gOne.append('text')
      .attr('x', width / 2)
      .attr('y', plotHeight + 44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Test Statistic');

    gOne.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(plotHeight / 2))
      .attr('y', -44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Density');

    // TWO-TAILED TEST (bottom)
    const gTwo = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + plotHeight + 40})`);

    gTwo.append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .attr('fill', COLOR_TWO_TAIL)
      .attr('font-weight', 'bold')
      .attr('font-size', '1.1em')
      .text('Two-Tailed Test (Both Tails)');

    // Both tails
    const tailDataLeft = lineData.filter(d => d.x <= -observedValue);
    gTwo.append('path')
      .datum(tailDataRight)
      .attr('fill', COLOR_HIGHLIGHT_TWO)
      .attr('stroke', COLOR_TWO_TAIL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

    gTwo.append('path')
      .datum(tailDataLeft)
      .attr('fill', COLOR_HIGHLIGHT_TWO)
      .attr('stroke', COLOR_TWO_TAIL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

    // Main curve
    gTwo.append('path')
      .datum(lineData)
      .attr('fill', 'none')
      .attr('stroke', COLOR_TWO_TAIL)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Markers
    gTwo.append('line')
      .attr('x1', xPos)
      .attr('x2', xPos)
      .attr('y1', yScale(0))
      .attr('y2', yScale(normalPdf(observedValue)))
      .attr('stroke', COLOR_TWO_TAIL)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,4');

    gTwo.append('line')
      .attr('x1', xScale(-observedValue))
      .attr('x2', xScale(-observedValue))
      .attr('y1', yScale(0))
      .attr('y2', yScale(normalPdf(observedValue)))
      .attr('stroke', COLOR_TWO_TAIL)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,4');

    gTwo.append('text')
      .attr('x', xPos + 8)
      .attr('y', yScale(normalPdf(observedValue)) - 10)
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_TWO_TAIL)
      .text(`+${observedValue}`);

    gTwo.append('text')
      .attr('x', xScale(-observedValue) - 8)
      .attr('y', yScale(normalPdf(observedValue)) - 10)
      .attr('text-anchor', 'end')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_TWO_TAIL)
      .text(`-${observedValue}`);

    // P-value annotation
    gTwo.append('text')
      .attr('x', xScale(2.5))
      .attr('y', yScale(yMax * 0.3))
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_TWO_TAIL)
      .attr('font-weight', 'bold')
      .text('p ≈ 0.0990');

    // Axes
    gTwo.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(9))
      .classed('d3-axis', true);

    gTwo.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);

    gTwo.append('text')
      .attr('x', width / 2)
      .attr('y', plotHeight + 44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Test Statistic');

    gTwo.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(plotHeight / 2))
      .attr('y', -44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Density');
  };
})();
