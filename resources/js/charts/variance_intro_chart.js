// variance_intro_chart.js
// Visualization showing two datasets with same mean, different spreads

(function() {
  function drawVarianceIntroChart() {
    const container = document.getElementById('chart-two-datasets');
    if (!container) return;
    
    // Clear existing SVG if any
    d3.select(container).select('svg').remove();

    // Data
    const siteA = [7.8, 8.0, 7.9, 8.1, 8.2];
    const siteB = [5.0, 7.0, 8.0, 9.0, 11.0];
    const meanValue = 8.0;

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
      .domain([4, 12])
      .range([0, width]);

    const yScale = d3.scaleBand()
      .domain(['Site A', 'Site B'])
      .range([0, height])
      .padding(0.3);

    // Axes
    const xAxisGroup = svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .classed('d3-axis', true);
    xAxisGroup.selectAll('text')
      .style('font-size', '14px');

    const yAxisGroup = svg.append('g')
      .call(d3.axisLeft(yScale))
      .classed('d3-axis', true);
    yAxisGroup.selectAll('text')
      .style('font-size', '14px');

  // Axes labels
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 35)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .classed('d3-axis-label--small', true)
    .text('Dissolved Oxygen (mg/L)');

    // Mean line
    svg.append('line')
      .attr('x1', xScale(meanValue))
      .attr('x2', xScale(meanValue))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.9);

    svg.append('text')
      .attr('x', xScale(meanValue) + 5)
      .attr('y', 15)
      .style('fill', '#00ff88')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text('Mean = 8.0');

    // Plot Site A points
    svg.selectAll('.pointA')
      .data(siteA)
      .enter()
      .append('circle')
      .attr('class', 'pointA')
      .attr('cx', d => xScale(d))
      .attr('cy', yScale('Site A') + yScale.bandwidth() / 2)
      .attr('r', 7)
      .attr('fill', '#00d4ff')
      .attr('stroke', '#5ce1ff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    // Plot Site B points
    svg.selectAll('.pointB')
      .data(siteB)
      .enter()
      .append('circle')
      .attr('class', 'pointB')
      .attr('cx', d => xScale(d))
      .attr('cy', yScale('Site B') + yScale.bandwidth() / 2)
      .attr('r', 7)
      .attr('fill', '#ff6b35')
      .attr('stroke', '#ffaa00')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);

    // Add spread indicators (range bars)
    const rangeA = [Math.min(...siteA), Math.max(...siteA)];
    const rangeB = [Math.min(...siteB), Math.max(...siteB)];

    svg.append('line')
      .attr('x1', xScale(rangeA[0]))
      .attr('x2', xScale(rangeA[1]))
      .attr('y1', yScale('Site A') + yScale.bandwidth() + 5)
      .attr('y2', yScale('Site A') + yScale.bandwidth() + 5)
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 3);

    svg.append('line')
      .attr('x1', xScale(rangeB[0]))
      .attr('x2', xScale(rangeB[1]))
      .attr('y1', yScale('Site B') + yScale.bandwidth() + 5)
      .attr('y2', yScale('Site B') + yScale.bandwidth() + 5)
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 3);

    // Style axes
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#ffffff')
      .style('stroke-width', 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawVarianceIntroChart);
  } else {
    drawVarianceIntroChart();
  }

  // Redraw on slide change with delay to ensure container is sized
  if (window.Reveal) {
    window.Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'why-more-than-mean') {
        setTimeout(drawVarianceIntroChart, 200);
      }
    });
  }

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('chart-two-datasets');
      if (container && container.offsetParent !== null) {
        drawVarianceIntroChart();
      }
    }, 250);
  });
})();
