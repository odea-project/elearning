(function() {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_CURVE = '#1864ab';
  const COLOR_FILL = '#f9844a';
  const COLOR_HIGHLIGHT = 'rgba(249, 132, 74, 0.28)';

  function normalPdf(x, mean = 0, sd = 1) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -((x - mean) ** 2) / (2 * sd * sd);
    return coefficient * Math.exp(exponent);
  }

  window.initPValueVisual = function initPValueVisual(targetId = 'pvalue-visual') {
    if (!window.d3) {
      console.warn('D3 not loaded. p-value visual will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight || 0, 600);

    const margin = { top: 40, right: 40, bottom: 56, left: 56 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Standard normal curve with shaded p-value tail areas.');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xDomain = [-3.2, 3.2];
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);

    const yMax = normalPdf(0);
    const yScale = d3.scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);

    const lineData = d3.range(xDomain[0], xDomain[1] + 0.001, 0.01)
      .map(x => ({ x, y: normalPdf(x) }));

    const observed = 1.65; // approx 0.099 two-tailed

    const areaGenerator = d3.area()
      .x(d => xScale(d.x))
      .y0(() => yScale(0))
      .y1(d => yScale(d.y))
      .curve(d3.curveCardinal.tension(0.6));

    const tailDataRight = lineData.filter(d => d.x >= observed);
    const tailDataLeft = lineData.filter(d => d.x <= -observed);

    g.append('path')
      .datum(tailDataRight)
      .attr('fill', COLOR_HIGHLIGHT)
      .attr('stroke', COLOR_FILL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

    g.append('path')
      .datum(tailDataLeft)
      .attr('fill', COLOR_HIGHLIGHT)
      .attr('stroke', COLOR_FILL)
      .attr('stroke-width', 1.5)
      .attr('d', areaGenerator);

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

    const addObsMarker = (value, label) => {
      const xPos = xScale(value);
      g.append('line')
        .attr('x1', xPos)
        .attr('x2', xPos)
        .attr('y1', yScale(0))
        .attr('y2', yScale(normalPdf(value)))
        .attr('stroke', COLOR_CURVE)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,4');

      g.append('text')
        .attr('x', xPos + (value > 0 ? 6 : -6))
        .attr('y', yScale(normalPdf(value)) - 10)
        .attr('text-anchor', value > 0 ? 'start' : 'end')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 13)
        .attr('font-weight', 700)
        .text(label);
    };

    addObsMarker(observed, '+1.65 = observed KS z');
    addObsMarker(-observed, '-1.65');

    const axisBottom = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .classed('d3-axis', true);
    axisBottom.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

    const axisLeft = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);
    axisLeft.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 44)
    .attr('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .classed('d3-axis-label--small', true)
    .text('Standardized test statistic z');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(height / 2))
    .attr('y', -44)
    .attr('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .classed('d3-axis-label--small', true)
    .text('Probability density');

    g.append('text')
      .attr('x', width * 0.57)
      .attr('y', yScale(normalPdf(observed)) - 36)
      .attr('fill', COLOR_FILL)
      .attr('font-size', 13)
      .attr('font-weight', 700)
      .text('Shaded tails = p-value');

    g.append('text')
      .attr('x', width - 10)
      .attr('y', 20)
      .attr('text-anchor', 'end')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 12)
      .attr('font-weight', 600)
      .text('Two-sided p ≈ 0.10');
  };
})();
