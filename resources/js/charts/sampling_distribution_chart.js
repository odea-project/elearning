// sampling_distribution_chart.js
// Visualization showing sampling distributions for different sample sizes

(function() {
  function drawSamplingDistributionChart() {
    const container = document.getElementById('chart-sampling-distributions');
    if (!container) return;
    
    // Clear existing SVG if any
    d3.select(container).select('svg').remove();

    // Parameters
    const trueMean = 8.0;
    const popSD = 1.0;
    const sampleSizes = [5, 30, 100];
    const numSimulations = 1000;

    // Generate sampling distributions
    const samplingDistributions = sampleSizes.map(n => {
      const means = [];
      for (let i = 0; i < numSimulations; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
          // Generate normal random variable
          const u1 = Math.random();
          const u2 = Math.random();
          const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
          sum += trueMean + z * popSD;
        }
        means.push(sum / n);
      }
      return {n, means, se: popSD / Math.sqrt(n)};
    });

    // Dimensions - use container width with fallback
    const margin = {top: 20, right: 20, bottom: 40, left: 50};
    const containerWidth = container.clientWidth > 0 ? container.clientWidth : 500;
    const width = containerWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG with viewBox for responsiveness
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([trueMean - 1, trueMean + 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 0.04])
      .range([height, 0]);

    // Colors for different sample sizes - brighter colors
    const colors = ['#ff6b35', '#00d4ff', '#00ff88'];

    // Create histogram bins
    const histogram = d3.histogram()
      .domain(xScale.domain())
      .thresholds(40);

    // Draw distributions
    samplingDistributions.forEach((dist, i) => {
      const bins = histogram(dist.means);
      
      // Normalize to density
      const binWidth = bins[0].x1 - bins[0].x0;
      const density = bins.map(bin => ({
        x0: bin.x0,
        x1: bin.x1,
        y: bin.length / (numSimulations * binWidth)
      }));

      // Draw histogram
      svg.selectAll(`.bar-${i}`)
        .data(density)
        .enter()
        .append('rect')
        .attr('class', `bar-${i}`)
        .attr('x', d => xScale(d.x0))
        .attr('y', d => yScale(d.y))
        .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
        .attr('height', d => height - yScale(d.y))
        .attr('fill', colors[i])
        .attr('opacity', 0.6);

      // Draw theoretical normal curve
      const curve = d3.range(xScale.domain()[0], xScale.domain()[1], 0.01).map(x => ({
        x: x,
        y: (1 / (dist.se * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - trueMean) / dist.se, 2))
      }));

      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

      svg.append('path')
        .datum(curve)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', colors[i])
        .attr('stroke-width', 3)
        .attr('opacity', 0.95);
    });

    // Mean line
    svg.append('line')
      .attr('x1', xScale(trueMean))
      .attr('x2', xScale(trueMean))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ffee00')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.9);

    // Axes
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .classed('d3-axis', true);
    xAxisGroup.selectAll('text')
      .style('font-size', '12px');

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .classed('d3-axis', true);
    yAxisGroup.selectAll('text')
      .style('font-size', '12px');

  // Axes labels
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 35)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .classed('d3-axis-label--small', true)
    .text('Sample Mean');

  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -35)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .classed('d3-axis-label--small', true)
    .text('Density');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 100}, 20)`);

    sampleSizes.forEach((n, i) => {
      const se = (popSD / Math.sqrt(n)).toFixed(3);
      
      legend.append('rect')
        .attr('x', 0)
        .attr('y', i * 25)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors[i])
        .attr('stroke', colors[i])
        .attr('stroke-width', 2)
        .attr('opacity', 0.8);

      legend.append('text')
        .attr('x', 20)
        .attr('y', i * 25 + 12)
        .style('fill', '#ffffff')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(`n=${n}, SE=${se}`);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawSamplingDistributionChart);
  } else {
    drawSamplingDistributionChart();
  }

  // Redraw on slide change with delay to ensure container is sized
  if (window.Reveal) {
    window.Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'lln-intuition') {
        setTimeout(drawSamplingDistributionChart, 200);
      }
    });
  }

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('chart-sampling-distributions');
      if (container && container.offsetParent !== null) {
        drawSamplingDistributionChart();
      }
    }, 250);
  });
})();
