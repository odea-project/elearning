(function() {
  function createSeededRandom(seed) {
    let value = seed;
    return () => {
      value = (value * 48271) % 0x7fffffff;
      return value / 0x7fffffff;
    };
  }

  function sampleNormal(rng) {
    const u1 = Math.max(rng(), Number.EPSILON);
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  function sampleLogNormal(n, meanLog, sdLog, rng) {
    const samples = [];
    for (let i = 0; i < n; i += 1) {
      const z = sampleNormal(rng);
      samples.push(Math.exp(meanLog + sdLog * z));
    }
    return samples;
  }

  function formatLegend(svg, items, x, y) {
    const group = svg.append('g').attr('transform', `translate(${x},${y})`);
    items.forEach((item, index) => {
      const row = group.append('g').attr('transform', `translate(0, ${index * 18})`);
      row.append('line')
        .attr('x1', 0)
        .attr('x2', 26)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', item.color)
        .attr('stroke-width', item.width)
        .attr('stroke-dasharray', item.dash || null);
      row.append('text')
        .attr('x', 32)
        .attr('y', 4)
        .attr('fill', '#06d6a0')
        .attr('font-size', 16)
        .attr('font-weight', 700)
        .text(item.label);
    });
  }

  window.initEcdfComparison = function initEcdfComparison(targetId = 'ecdf-visual') {
    if (!window.d3) {
      console.warn('D3 not loaded. ECDF plot will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;

    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight, 720);
    const margin = { top: 40, right: 32, bottom: 56, left: 68 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const rng = createSeededRandom(512);
    const data = sampleLogNormal(240, Math.log(2), 0.5, rng).sort((a, b) => a - b);
    const ecdfPoints = data.map((value, index) => ({
      x: value,
      y: (index + 1) / data.length
    }));

    const maxValue = ecdfPoints[ecdfPoints.length - 1].x * 1.05;

    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
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
      .attr('stroke', '#06d6a0')
      .attr('stroke-width', 4)
      .attr('d', stepLine);

    svg.selectAll('.ecdf-point')
      .data(ecdfPoints.filter((_, idx) => idx % 12 === 0))
      .join('circle')
      .attr('class', 'ecdf-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5)
      .attr('fill', '#ffd60a')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.8);

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .call(g => g.selectAll('text')
        .attr('fill', '#ff139dff')
        .attr('font-size', 16))
      .call(g => g.selectAll('line, path')
        .attr('stroke', '#ff139dff')
        .attr('stroke-width', 1.6));

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .call(g => g.selectAll('text')
        .attr('fill', '#ff139dff')
        .attr('font-size', 16))
      .call(g => g.selectAll('line, path')
        .attr('stroke', '#ff139dff')
        .attr('stroke-width', 1.6));

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ff139dff')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('[NO3-] mg/L');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -46)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ff139dff')
      .attr('font-size', 16)
      .attr('font-weight', 700)
      .text('F(x)');

    svg.append('text')
      .attr('x', width - 220)
      .attr('y', height - 44)
      .attr('fill', '#ff139dff')
      .attr('font-size', 16)
      .text(`Sample size: ${data.length}`);

    formatLegend(svg, [
      { color: '#06d6a0', label: 'Empirical CDF', width: 4 }
    ], width - 210, 20);
  };
})();

