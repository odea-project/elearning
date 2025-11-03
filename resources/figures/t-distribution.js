/**
 * t-distribution.js
 * 
 * Interactive visualization comparing t-distributions with different degrees of freedom
 * to the standard normal distribution. Shows how t-distributions approach normal as df increases.
 */

function initTDistribution(containerId) {
  // Configuration
  const COLOR_NORMAL = '#e63946';     // Red for normal distribution
  const COLOR_T = '#ca8a00ff';        // Blue for t-distribution
  const COLOR_AXIS = '#ff139dff';
  const COLOR_GRID = '#e0e0e0';
  const COLOR_TEXT = '#ff9900ff';

  const margin = { top: 20, right: 30, bottom: 90, left: 50 };
  const container = document.getElementById(containerId);
  if (!container) return;

  // Check if already initialized to prevent duplicate initialization
  if (container.hasAttribute('data-initialized')) {
    return;
  }
  container.setAttribute('data-initialized', 'true');

  const containerWidth = container.clientWidth || 550;
  const containerHeight = container.clientHeight || 350;
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Clear previous content
  container.innerHTML = '';

  // Add slider container
  const sliderContainer = document.createElement('div');
  sliderContainer.style.marginTop = '10px';
  sliderContainer.style.padding = '10px';
  sliderContainer.style.textAlign = 'center';
  sliderContainer.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
      <label for="${containerId}-df-slider" style="color: ${COLOR_TEXT}; font-size: 14px; font-weight: 600;">
        Degrees of Freedom (df):
      </label>
      <input type="range" id="${containerId}-df-slider" min="1" max="30" value="3" step="1" 
             style="width: 250px; cursor: pointer;">
      <span id="${containerId}-df-value" style="color: ${COLOR_T}; font-size: 16px; font-weight: bold; min-width: 30px;">3</span>
    </div>
  `;
  container.appendChild(sliderContainer);

  // Create SVG
  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Generate data
  const xRange = [-4, 4];
  const nPoints = 200;
  const xValues = d3.range(xRange[0], xRange[1], (xRange[1] - xRange[0]) / nPoints);

  // Standard normal PDF
  const normalPDF = (x) => {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  };

  // t-distribution PDF
  const gamma = (z) => {
    // Lanczos approximation for gamma function
    const g = 7;
    const C = [0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];

    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }

    z -= 1;
    let x = C[0];
    for (let i = 1; i < g + 2; i++) {
      x += C[i] / (z + i);
    }

    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  };

  const tPDF = (x, df) => {
    const numerator = gamma((df + 1) / 2);
    const denominator = Math.sqrt(df * Math.PI) * gamma(df / 2);
    return (numerator / denominator) * Math.pow(1 + (x * x) / df, -(df + 1) / 2);
  };

  // Generate distribution data
  const normalData = xValues.map(x => ({ x, y: normalPDF(x) }));
  
  // Function to generate t-distribution data for any df
  const getTData = (df) => xValues.map(x => ({ x, y: tPDF(x, df) }));

  // Initial df value
  let currentDF = 3;
  let tData = getTData(currentDF);

  // Scales
  const xScale = d3.scaleLinear()
    .domain(xRange)
    .range([0, width]);

  // Use fixed scale to prevent jumping
  const yScale = d3.scaleLinear()
    .domain([0, 0.45])
    .range([height, 0]);

  // Grid lines
  const xGrid = g.append('g')
    .attr('class', 'grid')
    .attr('opacity', 0.3);

  xGrid.selectAll('line')
    .data(xScale.ticks(8))
    .join('line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', COLOR_GRID)
    .attr('stroke-width', 1);

  const yGrid = g.append('g')
    .attr('class', 'grid')
    .attr('opacity', 0.3);

  yGrid.selectAll('line')
    .data(yScale.ticks(5))
    .join('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))
    .attr('stroke', COLOR_GRID)
    .attr('stroke-width', 1);

  // Line generator
  const line = d3.line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(d3.curveNatural);

  // Draw t-distribution (will be updated by slider)
  const tCurve = g.append('path')
    .datum(tData)
    .attr('class', 't-curve')
    .attr('fill', 'none')
    .attr('stroke', COLOR_T)
    .attr('stroke-width', 3)
    .attr('d', line);

  // Draw normal distribution (on top)
  const normalCurve = g.append('path')
    .datum(normalData)
    .attr('class', 'normal-curve')
    .attr('fill', 'none')
    .attr('stroke', COLOR_NORMAL)
    .attr('stroke-width', 3)
    .attr('d', line);

  // X-axis
  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(7))
    .classed('d3-axis', true);

  // Y-axis
  g.append('g')
    .call(d3.axisLeft(yScale).ticks(5))
    .classed('d3-axis', true);

  // X-axis label
  g.append('text')
    .attr('x', width / 2)
    .attr('y', height + 42)
    .attr('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('t-value');

  // Y-axis label
  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -40)
    .attr('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('Density');

  // Legend
  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 120}, 20)`);

  const legendData = [
    { label: 'Normal', color: COLOR_NORMAL, width: 3 },
    { label: `t (df=${currentDF})`, color: COLOR_T, width: 3, id: 't-label' }
  ];

  legendData.forEach((item, i) => {
    const legendRow = legend.append('g')
      .attr('transform', `translate(0, ${i * 22})`)
      .attr('class', item.id || '');

    legendRow.append('line')
      .attr('x1', 0)
      .attr('x2', 30)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', item.color)
      .attr('stroke-width', item.width);

    legendRow.append('text')
      .attr('x', 35)
      .attr('y', 4)
      .attr('class', 'legend-text')
      .style('fill', COLOR_TEXT)
      .style('font-size', '12px')
      .text(item.label);
  });

  // Annotations
  // Arrow marker definition
  g.append('defs')
    .append('marker')
    .attr('id', 'arrow-t')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')
    .attr('fill', COLOR_T);

  // Annotation elements (will be updated)
  const annotation = g.append('g').attr('class', 'annotation');
  
  const updateAnnotation = (df) => {
    annotation.selectAll('*').remove();
    
    if (df <= 5) {
      const arrowY = yScale(tPDF(-2.5, df));
      annotation.append('line')
        .attr('x1', xScale(-2.5))
        .attr('y1', arrowY - 20)
        .attr('x2', xScale(-2.5))
        .attr('y2', arrowY - 2)
        .attr('stroke', COLOR_T)
        .attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrow-t)');

      annotation.append('text')
        .attr('x', xScale(-2.5))
        .attr('y', arrowY - 25)
        .attr('text-anchor', 'middle')
        .style('fill', COLOR_T)
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text('Heavier tails');
    } else if (df >= 25) {
      annotation.append('text')
        .attr('x', width / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .style('fill', COLOR_T)
        .style('font-size', '11px')
        .style('font-weight', '600')
        .text('Approaching normal distribution');
    }
  };

  updateAnnotation(currentDF);

  // Slider event listener
  const slider = document.getElementById(`${containerId}-df-slider`);
  const dfValue = document.getElementById(`${containerId}-df-value`);

  slider.addEventListener('input', function() {
    currentDF = parseInt(this.value);
    dfValue.textContent = currentDF;

    // Update t-distribution curve
    tData = getTData(currentDF);
    tCurve.datum(tData)
      .transition()
      .duration(200)
      .attr('d', line);

    // Update legend
    legend.select('.t-label .legend-text')
      .text(`t (df=${currentDF})`);

    // Update annotation
    updateAnnotation(currentDF);
  });
}

// Export for use in slides
if (typeof window !== 'undefined') {
  window.initTDistribution = initTDistribution;
}
