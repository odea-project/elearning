(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_LINE_PDF = '#06d6a0';
  const COLOR_LINE_CDF = '#118ab2';
  const COLOR_FILL = '#06d6a022';
  const COLOR_DOT_FILL = '#ffd60a';
  const COLOR_DOT_STROKE = '#ff6b35';

  function logNormalPdf(x, meanLog, sdLog) {
    if (x <= 0) return 0;
    const coeff = 1 / (x * sdLog * Math.sqrt(2 * Math.PI));
    const exponent = -((Math.log(x) - meanLog) ** 2) / (2 * sdLog * sdLog);
    return coeff * Math.exp(exponent);
  }

  function logNormalCdf(x, meanLog, sdLog) {
    if (x <= 0) return 0;
    const z = (Math.log(x) - meanLog) / (sdLog * Math.sqrt(2));
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

  function buildSvg(container, width, height) {
    return container.append('svg')
      .attr('width', width + 80)
      .attr('height', height + 80)
      .append('g')
      .attr('transform', 'translate(52,30)');
  }

  function renderLogNormalPdf(containerId, meanLog, sdLog) {
    const container = d3.select(`#${containerId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const width = Math.max((container.node().clientWidth || 640) - 80, 320);
    const height = 540;

    const xMin = Math.max(0.01, Math.exp(meanLog - 3 * sdLog) * 0.6);
    const xMax = Math.exp(meanLog + 3 * sdLog) * 1.4;
    const xValues = d3.range(xMin, xMax, (xMax - xMin) / 240);
    const yValues = xValues.map(x => logNormalPdf(x, meanLog, sdLog));
    const yMax = d3.max(yValues) * 1.1;

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

    const svg = buildSvg(container, width, height);

    svg.append('path')
      .datum(xValues)
      .attr('fill', COLOR_FILL)
      .attr('stroke', 'none')
      .attr('d', d3.area()
        .x(d => xScale(d))
        .y0(yScale(0))
        .y1(d => yScale(logNormalPdf(d, meanLog, sdLog))));

    svg.append('path')
      .datum(xValues)
      .attr('fill', 'none')
      .attr('stroke', COLOR_LINE_PDF)
      .attr('stroke-width', 4)
      .attr('d', d3.line()
        .x(d => xScale(d))
        .y(d => yScale(logNormalPdf(d, meanLog, sdLog))));

    const meanValue = Math.exp(meanLog + 0.5 * sdLog * sdLog);
    svg.append('line')
      .attr('x1', xScale(meanValue))
      .attr('x2', xScale(meanValue))
      .attr('y1', yScale(0))
      .attr('y2', yScale(yMax))
      .attr('stroke', COLOR_LINE_PDF)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,3');

    svg.append('text')
      .attr('x', xScale(meanValue) + 6)
      .attr('y', yScale(logNormalPdf(meanValue, meanLog, sdLog)) - 10)
      .attr('fill', COLOR_LINE_PDF)
      .attr('font-size', 14)
      .attr('font-weight', 700)
      .text(`mean approx ${meanValue.toFixed(2)}`);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.7));

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.7));

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 42)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('f(x)');
  }

  function renderLogNormalCdf(containerId, meanLog, sdLog) {
    const container = d3.select(`#${containerId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const width = Math.max((container.node().clientWidth || 640) - 80, 320);
    const height = 540;

    const xMin = Math.max(0.01, Math.exp(meanLog - 3 * sdLog) * 0.6);
    const xMax = Math.exp(meanLog + 3 * sdLog) * 1.4;
    const xValues = d3.range(xMin, xMax, (xMax - xMin) / 240);
    const yValues = xValues.map(x => logNormalCdf(x, meanLog, sdLog));

    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    const svg = buildSvg(container, width, height);

    svg.append('path')
      .datum(xValues)
      .attr('fill', 'none')
      .attr('stroke', COLOR_LINE_CDF)
      .attr('stroke-width', 4)
      .attr('d', d3.line()
        .x((d, i) => xScale(xValues[i]))
        .y((d, i) => yScale(yValues[i])));

    const referencePoints = [
      { label: 'Median', value: Math.exp(meanLog) },
      { label: 'Mean', value: Math.exp(meanLog + 0.5 * sdLog * sdLog) },
      { label: 'P90', value: Math.exp(meanLog + 1.2816 * sdLog) }
    ];

    svg.selectAll('.ln-cdf-point')
      .data(referencePoints)
      .join('circle')
      .attr('class', 'ln-cdf-point')
      .attr('cx', d => xScale(d.value))
      .attr('cy', d => yScale(logNormalCdf(d.value, meanLog, sdLog)))
      .attr('r', 5)
      .attr('fill', COLOR_DOT_FILL)
      .attr('stroke', COLOR_DOT_STROKE)
      .attr('stroke-width', 1.8);

    svg.selectAll('.ln-cdf-label')
      .data(referencePoints)
      .join('text')
      .attr('class', 'ln-cdf-label')
      .attr('x', d => xScale(d.value) + 6)
      .attr('y', d => yScale(logNormalCdf(d.value, meanLog, sdLog)) - 6)
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 13)
      .attr('font-weight', 700)
      .text(d => `${d.label}`);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.7));

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .call(g => g.selectAll('text')
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700))
      .call(g => g.selectAll('line, path')
        .attr('stroke', COLOR_AXIS)
        .attr('stroke-width', 1.7));

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 42)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('F(x)');
  }

  window.initLogNormalDistributionPlots = function initLogNormalDistributionPlots(pdfId, cdfId, meanLog = 0, sdLog = 0.5) {
    renderLogNormalPdf(pdfId, meanLog, sdLog);
    renderLogNormalCdf(cdfId, meanLog, sdLog);
  };
})();

