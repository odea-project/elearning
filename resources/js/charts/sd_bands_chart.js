// sd_bands_chart.js
// Visualization showing data with ±1 SD shaded band

(function() {
  function drawSDBandsChart() {
    const container = document.getElementById('chart-sd-bands');
    if (!container) return;
    
    // Clear existing SVG if any
    d3.select(container).select('svg').remove();

    // Generate sample data (normal distribution)
    const mean = 8.0;
    const sd = 0.5;
    const n = 40;
    const data = [];
    
    for (let i = 0; i < n; i++) {
      // Box-Muller transform for normal distribution
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      data.push(mean + z * sd);
    }

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
      .domain([mean - 3*sd, mean + 3*sd])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, n])
      .range([height, 0]);

    // ±1 SD shaded region
    svg.append('rect')
      .attr('x', xScale(mean - sd))
      .attr('y', 0)
      .attr('width', xScale(mean + sd) - xScale(mean - sd))
      .attr('height', height)
      .attr('fill', '#00d4ff')
      .attr('opacity', 0.25);

    // Mean line
    svg.append('line')
      .attr('x1', xScale(mean))
      .attr('x2', xScale(mean))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5');

    // ±1 SD lines
    svg.append('line')
      .attr('x1', xScale(mean - sd))
      .attr('x2', xScale(mean - sd))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.9);

    svg.append('line')
      .attr('x1', xScale(mean + sd))
      .attr('x2', xScale(mean + sd))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '3,3')
      .attr('opacity', 0.9);

    // Plot data points
    data.forEach((value, index) => {
      const isWithinSD = value >= mean - sd && value <= mean + sd;
      svg.append('circle')
        .attr('cx', xScale(value))
        .attr('cy', yScale(index))
        .attr('r', 5)
        .attr('fill', isWithinSD ? '#00d4ff' : '#dddddd')
        .attr('stroke', isWithinSD ? '#5ce1ff' : '#ffffff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9);
    });

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#ffffff');

    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#ffffff');

    // Axes labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 35)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Value');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -35)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Observation #');

    // Labels
    svg.append('text')
      .attr('x', xScale(mean))
      .attr('y', 15)
      .style('text-anchor', 'middle')
      .style('fill', '#00ff88')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('μ');

    svg.append('text')
      .attr('x', xScale(mean - sd))
      .attr('y', 15)
      .style('text-anchor', 'middle')
      .style('fill', '#ff6b35')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('μ-σ');

    svg.append('text')
      .attr('x', xScale(mean + sd))
      .attr('y', 15)
      .style('text-anchor', 'middle')
      .style('fill', '#ff6b35')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('μ+σ');

    // Count points within ±1 SD
    const withinSD = data.filter(v => v >= mean - sd && v <= mean + sd).length;
    const percentage = ((withinSD / n) * 100).toFixed(1);

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .style('text-anchor', 'middle')
      .style('fill', '#9efcff')
      .style('font-size', '13px')
      .text(`${percentage}% within ±1 SD`);

    // Style axes
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#ffffff')
      .style('stroke-width', 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawSDBandsChart);
  } else {
    drawSDBandsChart();
  }

  // Redraw on slide change with delay to ensure container is sized
  if (window.Reveal) {
    window.Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'standard-deviation') {
        setTimeout(drawSDBandsChart, 200);
      }
    });
  }

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('chart-sd-bands');
      if (container && container.offsetParent !== null) {
        drawSDBandsChart();
      }
    }, 250);
  });
})();
