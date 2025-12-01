/**
 * Simple Scatter Plot: Nitrate vs Algal Growth
 * Full-slide visualization without regression line
 * Uses standard d3-charts.css classes for consistent styling
 */

function createNitrateAlgalScatterPlot(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing content
  d3.select(container).selectAll('*').remove();

  // Data: Nitrate (mg/L) vs Algal growth (µg/L)
  const data = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 35 },
    { x: 4, y: 50 },
    { x: 5, y: 70 }
  ];

  // Dimensions - full slide
  const width = 1400;
  const height = 750;
  const margin = { top: 60, right: 80, bottom: 100, left: 120 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const xScale = d3.scaleLinear()
    .domain([0, 6])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, 80])
    .range([innerHeight, 0]);

  // Grid lines (subtle)
  g.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line.horizontal')
    .data(yScale.ticks(8))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', innerWidth)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', '#2d3a66')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4');

  g.selectAll('line.vertical')
    .data(xScale.ticks(6))
    .enter()
    .append('line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#2d3a66')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,4');

  // X axis - using d3-axis class from d3-charts.css
  const xAxisGroup = g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(6))
    .classed('d3-axis', true);

  // X axis label - using d3-axis-label class
  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 60)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('Nitrate Concentration (mg/L)');

  // Y axis - using d3-axis class
  const yAxisGroup = g.append('g')
    .call(d3.axisLeft(yScale).ticks(8))
    .classed('d3-axis', true);

  // Y axis label - using d3-axis-label class
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -70)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('Algal Growth (µg/L Chlorophyll-a)');

  // Data points with animation
  const points = g.selectAll('.data-point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'data-point')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 0)
    .attr('fill', '#00d4ff')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 3)
    .style('filter', 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.6))');

  // Animate points appearing
  points.transition()
    .duration(800)
    .delay((d, i) => i * 200)
    .attr('r', 18)
    .ease(d3.easeElasticOut);

  // Add data labels next to points - using d3-body-text styling
  const labels = g.selectAll('.data-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'data-label')
    .attr('x', d => xScale(d.x) + 25)
    .attr('y', d => yScale(d.y) + 6)
    .classed('d3-legend-text', true)
    .style('opacity', 0)
    .text(d => `(${d.x}, ${d.y})`);

  labels.transition()
    .duration(500)
    .delay((d, i) => 800 + i * 200)
    .style('opacity', 0.9);

  // Add hover effects
  points
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 24)
        .attr('fill', '#ff6b35');
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 18)
        .attr('fill', '#00d4ff');
    });

  // Title - using d3-chart-title class
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', 40)
    .style('text-anchor', 'middle')
    .classed('d3-chart-title', true)
    .text('Water Quality Data: Nitrate vs Algal Growth');
}

// Initialize when DOM is ready
(function() {
  const containerId = 'nitrate-algal-scatter';
  const slideId = 'example-plot';

  function init() {
    const container = document.getElementById(containerId);
    if (!container) return;
    createNitrateAlgalScatterPlot(containerId);
  }

  // Handle Reveal.js slide changes
  function setupRevealHandlers() {
    if (window.Reveal && typeof window.Reveal.on === 'function') {
      window.Reveal.on('slidechanged', event => {
        if (event.currentSlide && event.currentSlide.getAttribute('id') === slideId) {
          init();
        }
      });
      window.Reveal.on('ready', event => {
        if (event.currentSlide && event.currentSlide.getAttribute('id') === slideId) {
          init();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setupRevealHandlers();
    });
  } else {
    init();
    setupRevealHandlers();
  }
})();
