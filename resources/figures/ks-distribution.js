(function () {
  const COLOR_AXIS = '#ff139dff';
  const SERIES_COLORS = ['#06d6a0', '#ff6b35', '#118ab2'];

  function kolmogorovCdfScaled(n, d) {
    if (d <= 0) return 0;
    const scaled = n * d * d;
    let sum = 0;
    for (let k = 1; k <= 80; k += 1) {
      const term = Math.exp(-2 * k * k * scaled);
      const signed = (k % 2 === 1) ? term : -term;
      sum += signed;
      if (term < 1e-8) break;
    }
    const value = 1 - 2 * sum;
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }

  function buildData(sampleSizes, maxD = 0.35) {
    const steps = 160;
    const results = sampleSizes.map((n, idx) => {
      const points = [];
      for (let i = 0; i <= steps; i += 1) {
        const d = (maxD * i) / steps;
        points.push({ d, value: kolmogorovCdfScaled(n, d) });
      }
      return { n, color: SERIES_COLORS[idx % SERIES_COLORS.length], points };
    });
    const maxValue = Math.max(...results.flatMap(series => series.points.map(p => p.value)));
    return { results, maxValue };
  }

  window.initKsDistribution = function initKsDistribution(targetId = 'ks-distribution-chart') {
    if (!window.d3) {
      console.warn('D3 not loaded. KS distribution chart will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const width = Math.max((node.clientWidth || 640) - 80, 320);
    const height = 560;

    const sampleSizes = [20, 50, 100];
    const { results } = buildData(sampleSizes);

    const xScale = d3.scaleLinear()
      .domain([0, 0.35])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    const svg = container.append('svg')
      .attr('width', width + 80)
      .attr('height', height + 80)
      .append('g')
      .attr('transform', 'translate(52, 28)');

    results.forEach(series => {
      svg.append('path')
        .datum(series.points)
        .attr('fill', 'none')
        .attr('stroke', series.color)
        .attr('stroke-width', 4)
        .attr('d', d3.line()
          .x(p => xScale(p.d))
          .y(p => yScale(p.value))
          .curve(d3.curveMonotoneX));
    });

    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .classed('d3-axis', true);
    xAxisGroup.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .classed('d3-axis', true);
    yAxisGroup.selectAll('text')
      .attr('font-size', 14)
      .attr('font-weight', 700);

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('D (maximum CDF difference)');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -(height / 2))
    .attr('y', -44)
    .attr('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('CDF: P(D_n <= D)');

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 10)`);

    results.forEach((series, idx) => {
      const row = legend.append('g')
        .attr('transform', `translate(0, ${idx * 18})`);
      row.append('line')
        .attr('x1', 0)
        .attr('x2', 28)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', series.color)
        .attr('stroke-width', 4);
      row.append('text')
        .attr('x', 34)
        .attr('y', 4)
        .attr('fill', COLOR_AXIS)
        .attr('font-size', 14)
        .attr('font-weight', 700)
        .text(`n = ${series.n}`);
    });
  };
})();


