// inflated_error_rates_multiple_tests.js
// Visualization showing how Type I error rate inflates with multiple tests
// Formula: P(at least one Type I error) = 1 - (1 - α)^n

(function() {
  function drawInflatedErrorRatesChart() {
    const container = document.getElementById('inflated-error-chart');
    if (!container) return;
    
    // Clear existing content
    d3.select(container).selectAll('*').remove();

    // Chart dimensions
    const width = 1528;
    const height = 702;
    const margin = {top: 60, right: 150, bottom: 80, left: 100};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background-color', 'rgba(0, 0, 0, 0.0)')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate data for three alpha levels
    const alphas = [
      { value: 0.05, label: 'α = 0.05', color: '#ff6b35' },
      { value: 0.01, label: 'α = 0.01', color: '#00d4ff' },
      { value: 0.001, label: 'α = 0.001', color: '#00ff88' }
    ];

    const maxTests = 50;
    const datasets = alphas.map(alpha => {
      const data = [];
      for (let n = 1; n <= maxTests; n++) {
        // Formula: P(at least one Type I error) = 1 - (1 - α)^n
        const errorRate = 1 - Math.pow(1 - alpha.value, n);
        data.push({ x: n, y: errorRate });
      }
      return {
        data,
        alpha: alpha.value,
        label: alpha.label,
        color: alpha.color
      };
    });

    // Scales
    const xScale = d3.scaleLinear()
      .domain([1, maxTests])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    // Grid lines
    const yGridLines = svg.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(yScale.ticks(10))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#444')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    const xGridLines = svg.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(xScale.ticks(10))
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#444')
      .attr('stroke-width', 1)
      .attr('opacity', 0.3);

    // Axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(10)
      .tickSizeOuter(0);

    const yAxis = d3.axisLeft(yScale)
      .ticks(10)
      .tickFormat(d => d3.format('.0%')(d))
      .tickSizeOuter(0);

    const xAxisGroup = svg.append('g')
      .attr('class', 'd3-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    const yAxisGroup = svg.append('g')
      .attr('class', 'd3-axis')
      .call(yAxis);

    // Axis labels
    svg.append('text')
      .attr('class', 'd3-axis-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 60)
      .style('text-anchor', 'middle')
      .text('Number of Tests (n)');

    svg.append('text')
      .attr('class', 'd3-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -70)
      .style('text-anchor', 'middle')
      .text('P(≥1 Type I Error)');

    // Title
    svg.append('text')
      .attr('class', 'd3-chart-title')
      .attr('x', innerWidth / 2)
      .attr('y', -30)
      .style('text-anchor', 'middle')
      .text('Inflated Error Rate with Multiple Tests');

    // Line generator
    const lineGenerator = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Draw lines for each alpha
    datasets.forEach((dataset, index) => {
      const alphaClass = `alpha${index}`;
      
      // Draw line
      svg.append('path')
        .datum(dataset.data)
        .attr('class', `line-${alphaClass}`)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', dataset.color)
        .attr('stroke-width', 4)
        .style('shape-rendering', 'crispEdges');

      // Draw points
      svg.selectAll(`.point-${alphaClass}`)
        .data(dataset.data.filter((d, i) => i % 5 === 0)) // Show every 5th point
        .enter()
        .append('rect')
        .attr('class', `point-${alphaClass}`)
        .attr('x', d => xScale(d.x) - 4)
        .attr('y', d => yScale(d.y) - 4)
        .attr('width', 8)
        .attr('height', 8)
        .attr('fill', dataset.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('width', 12)
            .attr('height', 12)
            .attr('x', xScale(d.x) - 6)
            .attr('y', yScale(d.y) - 6);
          
          // Show tooltip
          svg.append('text')
            .attr('class', 'tooltip')
            .attr('x', xScale(d.x) + 10)
            .attr('y', yScale(d.y) - 10)
            .style('fill', '#fff')
            .style('font-size', '14px')
            .style('font-family', 'monospace')
            .text(`n=${d.x}, p=${(d.y * 100).toFixed(1)}%`);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('width', 8)
            .attr('height', 8)
            .attr('x', xScale(d.x) - 4)
            .attr('y', yScale(d.y) - 4);
          
          svg.selectAll('.tooltip').remove();
        });

      // Legend
      const legendY = 20 + index * 40;
      
      svg.append('line')
        .attr('x1', innerWidth + 20)
        .attr('x2', innerWidth + 60)
        .attr('y1', legendY)
        .attr('y2', legendY)
        .attr('stroke', dataset.color)
        .attr('stroke-width', 4);

      svg.append('text')
        .attr('class', 'd3-legend-text')
        .attr('x', innerWidth + 70)
        .attr('y', legendY + 5)
        .style('fill', dataset.color)
        .text(dataset.label);
    });

    // Add reference line at 50%
    svg.append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', yScale(0.5))
      .attr('y2', yScale(0.5))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '10,5')
      .attr('opacity', 0.5);

    svg.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', yScale(0.5) - 10)
      .style('text-anchor', 'end')
      .style('fill', '#fff')
      .style('font-size', '14px')
      .style('font-family', 'monospace')
      .text('50%');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawInflatedErrorRatesChart);
  } else {
    drawInflatedErrorRatesChart();
  }

  // Redraw on slide change
  if (window.Reveal) {
    window.Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'anova1-inflated-error-rate') {
        setTimeout(drawInflatedErrorRatesChart, 200);
      }
    });
  }

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('inflated-error-chart');
      if (container && container.offsetParent !== null) {
        drawInflatedErrorRatesChart();
      }
    }, 250);
  });
})();
