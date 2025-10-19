// sd_vs_se_chart.js
// Bar chart comparing SD and SE error bars

(function() {
  function drawSDvsSEChart() {
    const container = document.getElementById('chart-sd-vs-se');
    if (!container) return;
    
    // Clear existing SVG if any
    d3.select(container).select('svg').remove();

    // Sample data for three groups
    const groups = [
      {name: 'Group A', mean: 8.0, sd: 1.5, n: 10},
      {name: 'Group B', mean: 7.2, sd: 1.2, n: 20},
      {name: 'Group C', mean: 8.5, sd: 1.8, n: 30}
    ];

    // Calculate SE for each group
    groups.forEach(g => {
      g.se = g.sd / Math.sqrt(g.n);
    });

    // Dimensions - use container width with fallback
    const margin = {top: 40, right: 120, bottom: 50, left: 60};
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
    const xScale = d3.scaleBand()
      .domain(groups.map(g => g.name))
      .range([0, width])
      .padding(0.3);

    const yScale = d3.scaleLinear()
      .domain([0, 12])
      .range([height, 0]);

    // Draw bars (means)
    svg.selectAll('.bar')
      .data(groups)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.name))
      .attr('y', d => yScale(d.mean))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - yScale(d.mean))
      .attr('fill', '#00d4ff')
      .attr('stroke', '#5ce1ff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    // Draw SD error bars (in orange/red)
    svg.selectAll('.sd-error')
      .data(groups)
      .enter()
      .append('line')
      .attr('class', 'sd-error')
      .attr('x1', d => xScale(d.name) + xScale.bandwidth() * 0.3)
      .attr('x2', d => xScale(d.name) + xScale.bandwidth() * 0.3)
      .attr('y1', d => yScale(d.mean - d.sd))
      .attr('y2', d => yScale(d.mean + d.sd))
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 4);

    // SD caps
    svg.selectAll('.sd-cap-top')
      .data(groups)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.name) + xScale.bandwidth() * 0.2)
      .attr('x2', d => xScale(d.name) + xScale.bandwidth() * 0.4)
      .attr('y1', d => yScale(d.mean + d.sd))
      .attr('y2', d => yScale(d.mean + d.sd))
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 4);

    svg.selectAll('.sd-cap-bottom')
      .data(groups)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.name) + xScale.bandwidth() * 0.2)
      .attr('x2', d => xScale(d.name) + xScale.bandwidth() * 0.4)
      .attr('y1', d => yScale(d.mean - d.sd))
      .attr('y2', d => yScale(d.mean - d.sd))
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 4);

    // Draw SE error bars (in bright green)
    svg.selectAll('.se-error')
      .data(groups)
      .enter()
      .append('line')
      .attr('class', 'se-error')
      .attr('x1', d => xScale(d.name) + xScale.bandwidth() * 0.7)
      .attr('x2', d => xScale(d.name) + xScale.bandwidth() * 0.7)
      .attr('y1', d => yScale(d.mean - d.se))
      .attr('y2', d => yScale(d.mean + d.se))
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 4);

    // SE caps
    svg.selectAll('.se-cap-top')
      .data(groups)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.name) + xScale.bandwidth() * 0.6)
      .attr('x2', d => xScale(d.name) + xScale.bandwidth() * 0.8)
      .attr('y1', d => yScale(d.mean + d.se))
      .attr('y2', d => yScale(d.mean + d.se))
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 4);

    svg.selectAll('.se-cap-bottom')
      .data(groups)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d.name) + xScale.bandwidth() * 0.6)
      .attr('x2', d => xScale(d.name) + xScale.bandwidth() * 0.8)
      .attr('y1', d => yScale(d.mean - d.se))
      .attr('y2', d => yScale(d.mean - d.se))
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 4);

    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '13px')
      .style('fill', '#ffffff');

    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#ffffff');

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -40)
      .style('text-anchor', 'middle')
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Value');

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 10}, ${height / 2 - 30})`);

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 25)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 4);

    legend.append('text')
      .attr('x', 30)
      .attr('y', 4)
      .style('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('SD bars');

    legend.append('line')
      .attr('x1', 0)
      .attr('x2', 25)
      .attr('y1', 25)
      .attr('y2', 25)
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 4);

    legend.append('text')
      .attr('x', 30)
      .attr('y', 29)
      .style('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('SE bars');

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -15)
      .style('text-anchor', 'middle')
      .style('fill', '#9efcff')
      .style('font-size', '14px')
      .text('Same Data, Different Error Bars');

    // Style axes
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#ffffff')
      .style('stroke-width', 1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawSDvsSEChart);
  } else {
    drawSDvsSEChart();
  }

  // Redraw on slide change with delay to ensure container is sized
  if (window.Reveal) {
    window.Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'sd-vs-se-plots') {
        setTimeout(drawSDvsSEChart, 200);
      }
    });
  }

  // Redraw on window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('chart-sd-vs-se');
      if (container && container.offsetParent !== null) {
        drawSDvsSEChart();
      }
    }, 250);
  });
})();
