(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_LINE_PDF = '#06d6a0';
  const COLOR_LINE_CDF = '#dda900ff';
  const COLOR_FILL = '#06d6a022';
  const COLOR_DOTS_FILL = '#ffd60a';
  const COLOR_DOTS_STROKE = '#ff6b35';

  function normalPdf(x, mean, sd) {
    const coeff = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * ((x - mean) / sd) ** 2;
    return coeff * Math.exp(exponent);
  }

  function normalCdf(x, mean, sd) {
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
    const poly =
      (((a5 * t + a4) * t + a3) * t + a2) * t + a1;
    const approx = 1 - poly * Math.exp(-absX * absX);
    return sign * approx;
  }

  function createScales(container, width, height, xDomain, yDomain) {
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([height, 0]);

    const svg = container
      .append('svg')
      .attr('width', width + 80)
      .attr('height', height + 80)
      .append('g')
      .attr('transform', 'translate(50,30)');

    return { xScale, yScale, svg };
  }

  function renderPdf(containerId, mean, sd) {
    const container = d3.select(`#${containerId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const width = Math.max(container.node().clientWidth - 80, 300);
    const height = 540;
    const xDomain = [mean - 4 * sd, mean + 4 * sd];
    const xValues = d3.range(xDomain[0], xDomain[1] + 0.01, 0.1);
    const yValues = xValues.map(x => normalPdf(x, mean, sd));
    const yMax = d3.max(yValues) * 1.1;

    const { xScale, yScale, svg } = createScales(
      container,
      width,
      height,
      xDomain,
      [0, yMax]
    );

    svg.append('path')
      .datum(xValues)
      .attr('fill', COLOR_FILL)
      .attr('stroke', 'none')
      .attr('d', d3.area()
        .x(d => xScale(d))
        .y0(yScale(0))
        .y1(d => yScale(normalPdf(d, mean, sd))));

    svg.append('path')
      .datum(xValues)
      .attr('fill', 'none')
      .attr('stroke', COLOR_LINE_PDF)
      .attr('stroke-width', 4)
      .attr('d', d3.line()
        .x(d => xScale(d))
        .y(d => yScale(normalPdf(d, mean, sd))));

    svg.append('line')
      .attr('x1', xScale(mean))
      .attr('x2', xScale(mean))
      .attr('y1', yScale(0))
      .attr('y2', yScale(yMax))
      .attr('stroke', COLOR_LINE_PDF)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3');

    svg.append('text')
      .attr('x', xScale(mean) + 6)
      .attr('y', yScale(normalPdf(mean, mean, sd)) - 10)
      .attr('fill', COLOR_LINE_PDF)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .text(`mean = ${mean}`);

    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .classed('d3-axis', true);
    xAxisGroup.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);
    yAxisGroup.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 42)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('f(x)');
  }

  function renderCdf(containerId, mean, sd) {
    const container = d3.select(`#${containerId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const width = Math.max(container.node().clientWidth - 80, 300);
    const height = 540;
    const xDomain = [mean - 4 * sd, mean + 4 * sd];
    const xValues = d3.range(xDomain[0], xDomain[1] + 0.01, 0.1);
    const yValues = xValues.map(x => normalCdf(x, mean, sd));

    const { xScale, yScale, svg } = createScales(
      container,
      width,
      height,
      xDomain,
      [0, 1]
    );

    svg.append('path')
      .datum(xValues)
      .attr('fill', 'none')
      .attr('stroke', COLOR_LINE_CDF)
      .attr('stroke-width', 4)
      .attr('d', d3.line()
        .x(d => xScale(d))
        .y((d, i) => yScale(yValues[i])));

    svg.selectAll('.cdf-point')
      .data([-sd, mean, sd])
      .join('circle')
      .attr('class', 'cdf-point')
      .attr('cx', d => xScale(d))
      .attr('cy', d => yScale(normalCdf(d, mean, sd)))
      .attr('r', 5)
      .attr('fill', COLOR_DOTS_FILL)
      .attr('stroke', COLOR_DOTS_STROKE)
      .attr('stroke-width', 1.8);

    svg.selectAll('.cdf-label')
      .data([-sd, mean, sd])
      .join('text')
      .attr('class', 'cdf-label')
      .attr('x', d => xScale(d) + 6)
      .attr('y', d => yScale(normalCdf(d, mean, sd)) - 6)
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 13)
      .attr('font-weight', 700)
      .text(d => `F(${d.toFixed(1)}) = ${normalCdf(d, mean, sd).toFixed(2)}`);

    const cdfXAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .classed('d3-axis', true);
    cdfXAxisGroup.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

    const cdfYAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);
    cdfYAxisGroup.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 42)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('F(x)');
  }

  window.initNormalDistributionPlots = function initNormalDistributionPlots(pdfId, cdfId, mean = 0, sd = 1) {
    renderPdf(pdfId, mean, sd);
    renderCdf(cdfId, mean, sd);
  };
})();
