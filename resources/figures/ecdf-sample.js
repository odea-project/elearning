(function() {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_STEP = '#06d6a0';
  const COLOR_DOTS_FILL = '#ffd60a';
  const COLOR_DOTS_STROKE = '#ff6b35';

  const SAMPLE_VALUES = [2, 5, 3, 8];

  function prepareEcdf(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    return sorted.map((value, index) => ({
      x: value,
      y: (index + 1) / n
    }));
  }

  window.initEcdfSample = function initEcdfSample(targetId = 'ecdf-sample-visual') {
    if (!window.d3) {
      console.warn('D3 not loaded. ECDF sample plot will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 640;
    const containerHeight = Math.max(node.clientHeight, 520);
    const margin = { top: 40, right: 32, bottom: 52, left: 54 };

    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const ecdfPoints = prepareEcdf(SAMPLE_VALUES);
    const maxX = Math.max(...SAMPLE_VALUES) + 1;

    const xScale = d3.scaleLinear()
      .domain([0, maxX])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([height, 0]);

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const stepLine = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveStepAfter);

    svg.append('path')
      .datum(ecdfPoints)
      .attr('fill', 'none')
      .attr('stroke', COLOR_STEP)
      .attr('stroke-width', 4)
      .attr('d', stepLine);

    svg.selectAll('.ecdf-dot')
      .data(ecdfPoints)
      .join('circle')
      .attr('class', 'ecdf-dot')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', COLOR_DOTS_FILL)
      .attr('stroke', COLOR_DOTS_STROKE)
      .attr('stroke-width', 1.9);

    svg.selectAll('.ecdf-label')
      .data(ecdfPoints)
      .join('text')
      .attr('class', 'ecdf-label')
      .attr('x', d => xScale(d.x) + 6)
      .attr('y', d => yScale(d.y) - 6)
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 13)
      .attr('font-weight', 700)
      .text(d => `${(d.y * 100).toFixed(0)}%`);

    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(SAMPLE_VALUES.length + 1))
      .classed('d3-axis', true);
    xAxisGroup.selectAll('text')
      .attr('font-size', 16)
      .attr('font-weight', 700);

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);
    yAxisGroup.selectAll('text')
      .attr('font-size', 16)
      .attr('font-weight', 700);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 38)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Sample value x');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('ECDF: F(x)');

    svg.append('text')
      .attr('x', Math.min(width - 160, width * 0.4))
      .attr('y', 0)
      .attr('fill', COLOR_AXIS)
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('Empirical CDF for [2, 3, 5, 8]');
  };
})();

