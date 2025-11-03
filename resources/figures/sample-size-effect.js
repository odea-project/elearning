(function () {
  const COLOR_AXIS = '#ff139dff';
  const COLOR_SMALL = '#e63946';
  const COLOR_MEDIUM = '#f77f00';
  const COLOR_LARGE = '#06d6a0';
  const HIGHLIGHT_SMALL = 'rgba(230, 57, 70, 0.25)';
  const HIGHLIGHT_MEDIUM = 'rgba(247, 127, 0, 0.25)';
  const HIGHLIGHT_LARGE = 'rgba(6, 214, 160, 0.25)';

  function normalPdf(x, mean = 0, sd = 1) {
    const coefficient = 1 / (sd * Math.sqrt(2 * Math.PI));
    const exponent = -((x - mean) ** 2) / (2 * sd * sd);
    return coefficient * Math.exp(exponent);
  }

  window.initSampleSizeEffect = function initSampleSizeEffect(targetId = 'sample-size-chart') {
    if (!window.d3) {
      console.warn('D3 not loaded. Sample size effect chart will not render.');
      return;
    }

    const container = d3.select(`#${targetId}`);
    if (container.empty()) return;
    container.selectAll('*').remove();

    const node = container.node();
    const containerWidth = node.clientWidth || 720;
    const containerHeight = Math.max(node.clientHeight || 0, 400);

    const margin = { top: 50, right: 40, bottom: 60, left: 56 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = container.append('svg')
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .attr('role', 'img')
      .attr('aria-label', 'Effect of sample size on hypothesis testing');

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Same effect size (mean difference = 0.5), different sample sizes
    const trueEffect = 0.5;
    const configs = [
      { n: 10, color: COLOR_SMALL, highlight: HIGHLIGHT_SMALL, label: 'n=10', se: 1/Math.sqrt(10) },
      { n: 50, color: COLOR_MEDIUM, highlight: HIGHLIGHT_MEDIUM, label: 'n=50', se: 1/Math.sqrt(50) },
      { n: 200, color: COLOR_LARGE, highlight: HIGHLIGHT_LARGE, label: 'n=200', se: 1/Math.sqrt(200) }
    ];

    const xDomain = [-1.5, 2.5];
    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range([0, width]);

    // Find max y for scaling
    const maxY = Math.max(...configs.map(c => normalPdf(trueEffect, trueEffect, c.se)));
    const yScale = d3.scaleLinear()
      .domain([0, maxY * 1.15])
      .range([height, 0]);

    // Generate distributions
    configs.forEach(config => {
      const lineData = d3.range(xDomain[0], xDomain[1] + 0.001, 0.02)
        .map(x => ({ x, y: normalPdf(x, trueEffect, config.se) }));

      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveCardinal.tension(0.6));

      // Area under curve
      const areaGenerator = d3.area()
        .x(d => xScale(d.x))
        .y0(() => yScale(0))
        .y1(d => yScale(d.y))
        .curve(d3.curveCardinal.tension(0.6));

      g.append('path')
        .datum(lineData)
        .attr('fill', config.highlight)
        .attr('d', areaGenerator);

      // Curve
      g.append('path')
        .datum(lineData)
        .attr('fill', 'none')
        .attr('stroke', config.color)
        .attr('stroke-width', 2.5)
        .attr('d', line);
    });

    // Null hypothesis line (H₀: mean = 0)
    g.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', yScale(0))
      .attr('y2', 0)
      .attr('stroke', COLOR_AXIS)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,4');

    g.append('text')
      .attr('x', xScale(0) - 10)
      .attr('y', 15)
      .attr('text-anchor', 'end')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_AXIS)
      .text('H₀: μ = 0');

    // True effect line
    g.append('line')
      .attr('x1', xScale(trueEffect))
      .attr('x2', xScale(trueEffect))
      .attr('y1', yScale(0))
      .attr('y2', 0)
      .attr('stroke', COLOR_LARGE)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,4');

    g.append('text')
      .attr('x', xScale(trueEffect) + 10)
      .attr('y', 15)
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_LARGE)
      .text('True effect = 0.5');

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .classed('d3-axis', true);

    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);

    // Axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height + 48)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Sample Mean (Effect Size)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(height / 2))
      .attr('y', -44)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .classed('d3-axis-label--small', true)
      .text('Probability Density');

    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 180}, 20)`);

    configs.forEach((config, idx) => {
      const row = legend.append('g')
        .attr('transform', `translate(0, ${idx * 22})`);

      row.append('line')
        .attr('x1', 0)
        .attr('x2', 28)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', config.color)
        .attr('stroke-width', 3);

      row.append('text')
        .attr('x', 34)
        .attr('y', 4)
        .classed('d3-legend-text', true)
        .text(config.label);
    });

    // Title
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -25)
      .attr('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .attr('fill', COLOR_AXIS)
      .attr('font-weight', 'bold')
      .text('Same Effect Size, Different Sample Sizes');

    // Annotation
    g.append('text')
      .attr('x', width / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .classed('d3-chart-body-text', true)
      .attr('fill', COLOR_AXIS)
      .attr('font-size', '0.9em')
      .text('Larger n → Narrower distribution → Easier to detect effect → Smaller p-value');
  };
})();
