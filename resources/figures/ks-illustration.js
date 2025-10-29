(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_ECDF = '#06d6a0';
  const COLOR_REF = '#118ab2';
  const COLOR_DOT = '#ffd60a';
  const COLOR_DOT_STROKE = '#ff6b35';
  const COLOR_HIGHLIGHT = '#ff6b35';

  function createSampleData() {
    const theoretical = d3.range(0, 1.001, 0.01);
    const ecdf = theoretical.map(t => ({
      x: t,
      y: Math.pow(t, 1.3)
    }));
    const ref = theoretical.map(t => ({
      x: t,
      y: t
    }));
    const differences = ecdf.map((point, i) => ({
      x: point.x,
      diff: Math.abs(point.y - ref[i].y),
      emp: point.y,
      theo: ref[i].y
    }));
    const maxDiff = differences.reduce((a, b) => (b.diff > a.diff ? b : a), differences[0]);
    return { ecdf, ref, maxDiff };
  }

  window.initKsIllustration = function initKsIllustration(targetId = 'ks-illustration') {
    if (!window.d3) {
      console.warn('D3 not loaded. KS illustration will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const width = Math.max((container.node().clientWidth || 640) - 80, 320);
    const height = 560;

    const data = createSampleData();

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    const svg = container
      .append('svg')
      .attr('width', width + 80)
      .attr('height', height + 80)
      .append('g')
      .attr('transform', 'translate(52,26)');

    svg.append('path')
      .datum(data.ref)
      .attr('fill', 'none')
      .attr('stroke', COLOR_REF)
      .attr('stroke-width', 3.5)
      .attr('d', d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y)));

    svg.append('path')
      .datum(data.ecdf)
      .attr('fill', 'none')
      .attr('stroke', COLOR_ECDF)
      .attr('stroke-width', 3)
      .attr('d', d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y)))
      .attr('filter', null);

    svg.append('line')
      .attr('x1', xScale(data.maxDiff.x))
      .attr('x2', xScale(data.maxDiff.x))
      .attr('y1', yScale(data.maxDiff.emp))
      .attr('y2', yScale(data.maxDiff.theo))
      .attr('stroke', COLOR_HIGHLIGHT)
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '4,3')
      .attr('marker-start', 'url(#ks-arrow)')
      .attr('marker-end', 'url(#ks-arrow)');

    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'ks-arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', COLOR_HIGHLIGHT);

    svg.append('circle')
      .attr('cx', xScale(data.maxDiff.x))
      .attr('cy', yScale(data.maxDiff.emp))
      .attr('r', 6)
      .attr('fill', COLOR_DOT)
      .attr('stroke', COLOR_DOT_STROKE)
      .attr('stroke-width', 1.8);

    svg.append('circle')
      .attr('cx', xScale(data.maxDiff.x))
      .attr('cy', yScale(data.maxDiff.theo))
      .attr('r', 6)
      .attr('fill', COLOR_DOT)
      .attr('stroke', COLOR_DOT_STROKE)
      .attr('stroke-width', 1.8);

    svg.append('text')
      .attr('x', xScale(data.maxDiff.x) + 8)
      .attr('y', yScale((data.maxDiff.emp + data.maxDiff.theo) / 2))
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_HIGHLIGHT)
      .text(`D = ${data.maxDiff.diff.toFixed(2)}`);

    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .classed('d3-axis', true);

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -46)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('F(x)');

    const legend = svg.append('g')
      .attr('transform', `translate(${width - 150}, 10)`);

    const legendItems = [
      { color: COLOR_ECDF, label: 'Empirical CDF' },
      { color: COLOR_REF, label: 'Reference CDF' },
      { color: COLOR_HIGHLIGHT, label: 'Max distance D' }
    ];

    legendItems.forEach((item, index) => {
      const row = legend.append('g')
        .attr('transform', `translate(0, ${index * 18})`);
      row.append('line')
        .attr('x1', 0)
        .attr('x2', 26)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', item.color)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', index === 2 ? '4,3' : '0');
      row.append('text')
        .attr('x', 32)
        .attr('y', 4)
        .classed('d3-legend-text', true)
        .text(item.label);
    });
  };
})();

