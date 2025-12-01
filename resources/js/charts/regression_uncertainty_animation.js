/**
 * Regression Uncertainty Animation
 * Continuously generates sample datasets and shows regression lines
 * Uses FIFO approach with 5 visible sets, oldest fades to 20%
 */

function createRegressionUncertaintyAnimation(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing content
  d3.select(container).selectAll('*').remove();

  // Dimensions
  const containerWidth = container.clientWidth > 0 ? container.clientWidth : 700;
  const width = containerWidth;
  const height = 500;
  const margin = { top: 40, right: 40, bottom: 60, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // True population parameters (unknown to the "samples")
  const trueIntercept = 5;
  const trueSlope = 3;
  const noiseSD = 8;

  // Sample parameters
  const sampleSize = 8;
  const xMin = 0;
  const xMax = 15;
  const yMin = -10;
  const yMax = 60;

  // FIFO queue for sample sets (max 5)
  const maxSets = 5;
  const sampleSets = [];

  // Opacity levels: newest=1.0, oldest=0.2
  const opacities = [1.0, 0.8, 0.6, 0.4, 0.2];

  // Color palette for the sets
  const colors = ['#00d4ff', '#ff6b35', '#00ff88', '#ff00ff', '#ffff00'];

  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales
  const xScale = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([yMin, yMax])
    .range([innerHeight, 0]);

  // Draw axes
  const xAxisGroup = g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale).ticks(8))
    .classed('d3-axis', true);

  xAxisGroup.selectAll('text').style('font-size', '14px');

  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 45)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('x (Predictor)');

  const yAxisGroup = g.append('g')
    .call(d3.axisLeft(yScale).ticks(8))
    .classed('d3-axis', true);

  yAxisGroup.selectAll('text').style('font-size', '14px');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -50)
    .style('text-anchor', 'middle')
    .classed('d3-axis-label', true)
    .text('y (Response)');

  // Draw true regression line (dashed, subtle)
  g.append('line')
    .attr('class', 'true-line')
    .attr('x1', xScale(xMin))
    .attr('y1', yScale(trueIntercept + trueSlope * xMin))
    .attr('x2', xScale(xMax))
    .attr('y2', yScale(trueIntercept + trueSlope * xMax))
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '10,5')
    .attr('opacity', 0.6);

  // Label for true line
  g.append('text')
    .attr('x', xScale(xMax) - 5)
    .attr('y', yScale(trueIntercept + trueSlope * xMax) - 10)
    .style('text-anchor', 'end')
    .style('fill', '#ffffff')
    .style('font-size', '12px')
    .style('opacity', 0.7)
    .text('True: y = ' + trueIntercept + ' + ' + trueSlope + 'x');

  // Group for sample elements (lines and points)
  const samplesGroup = g.append('g').attr('class', 'samples-group');

  // Info text
  const infoText = g.append('text')
    .attr('x', 10)
    .attr('y', 20)
    .style('fill', '#9efcff')
    .style('font-size', '14px')
    .style('font-weight', 'bold');

  // Generate random sample with noise
  function generateSample() {
    const points = [];
    for (let i = 0; i < sampleSize; i++) {
      const x = xMin + Math.random() * (xMax - xMin);
      // Box-Muller for normal noise
      const u1 = Math.random();
      const u2 = Math.random();
      const noise = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2) * noiseSD;
      const y = trueIntercept + trueSlope * x + noise;
      points.push({ x, y });
    }
    return points;
  }

  // Calculate regression coefficients using matrix operations
  function calculateRegression(points) {
    const n = points.length;
    
    // Create design matrix X and response vector y
    let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
    
    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXX += p.x * p.x;
      sumXY += p.x * p.y;
    }
    
    // Normal equation solution for simple linear regression
    const denom = n * sumXX - sumX * sumX;
    const intercept = (sumY * sumXX - sumX * sumXY) / denom;
    const slope = (n * sumXY - sumX * sumY) / denom;
    
    return { intercept, slope };
  }

  // Add a new sample set
  function addNewSampleSet() {
    const points = generateSample();
    const { intercept, slope } = calculateRegression(points);
    const colorIndex = sampleSets.length % colors.length;
    
    const newSet = {
      points,
      intercept,
      slope,
      color: colors[colorIndex],
      id: Date.now()
    };
    
    // Add to front of array
    sampleSets.unshift(newSet);
    
    // Remove oldest if more than max
    if (sampleSets.length > maxSets) {
      sampleSets.pop();
    }
    
    updateVisualization();
  }

  // Update the visualization
  function updateVisualization() {
    // Update info text
    if (sampleSets.length > 0) {
      const latest = sampleSets[0];
      infoText.text(`Latest: β₀ = ${latest.intercept.toFixed(2)}, β₁ = ${latest.slope.toFixed(2)}`);
    }

    // Bind data to regression lines
    const lines = samplesGroup.selectAll('.regression-line')
      .data(sampleSets, d => d.id);

    // Enter new lines
    lines.enter()
      .append('line')
      .attr('class', 'regression-line')
      .attr('x1', xScale(xMin))
      .attr('y1', d => yScale(d.intercept + d.slope * xMin))
      .attr('x2', xScale(xMax))
      .attr('y2', d => yScale(d.intercept + d.slope * xMax))
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2.5)
      .attr('opacity', 0)
      .transition()
      .duration(500)
      .attr('opacity', 1.0);

    // Update existing lines (transition opacity)
    lines.transition()
      .duration(500)
      .attr('opacity', (d, i) => opacities[i] || 0.2)
      .attr('stroke-width', (d, i) => i === 0 ? 2.5 : 2);

    // Remove exiting lines
    lines.exit()
      .transition()
      .duration(300)
      .attr('opacity', 0)
      .remove();

    // Bind data to point groups
    const pointGroups = samplesGroup.selectAll('.point-group')
      .data(sampleSets, d => d.id);

    // Enter new point groups
    const enterGroups = pointGroups.enter()
      .append('g')
      .attr('class', 'point-group')
      .attr('opacity', 0);

    enterGroups.each(function(setData) {
      const group = d3.select(this);
      group.selectAll('circle')
        .data(setData.points)
        .enter()
        .append('circle')
        .attr('cx', p => xScale(p.x))
        .attr('cy', p => yScale(p.y))
        .attr('r', 5)
        .attr('fill', setData.color)
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1);
    });

    enterGroups.transition()
      .duration(500)
      .attr('opacity', 1.0);

    // Update existing point groups
    pointGroups.transition()
      .duration(500)
      .attr('opacity', (d, i) => opacities[i] || 0.2);

    // Remove exiting point groups
    pointGroups.exit()
      .transition()
      .duration(300)
      .attr('opacity', 0)
      .remove();
  }

  // Animation interval
  let animationInterval = null;
  let isAnimating = false;

  // Start animation
  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Add first sample immediately
    addNewSampleSet();
    
    // Then add new samples every 2 seconds
    animationInterval = setInterval(() => {
      addNewSampleSet();
    }, 2000);
  }

  // Stop animation
  function stopAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
    isAnimating = false;
  }

  // Add control buttons
  const buttonContainer = d3.select(container)
    .insert('div', ':first-child')
    .style('margin-bottom', '10px')
    .style('display', 'flex')
    .style('gap', '10px');

  buttonContainer.append('button')
    .text('▶ Start Animation')
    .style('padding', '8px 16px')
    .style('background', '#0f172a')
    .style('color', '#9efcff')
    .style('border', '1px solid #2d3a66')
    .style('border-radius', '6px')
    .style('cursor', 'pointer')
    .style('font-size', '0.85em')
    .style('font-weight', '600')
    .on('click', function() {
      if (isAnimating) {
        stopAnimation();
        d3.select(this).text('▶ Start Animation');
      } else {
        startAnimation();
        d3.select(this).text('⏸ Pause Animation');
      }
    });

  buttonContainer.append('button')
    .text('↻ Reset')
    .style('padding', '8px 16px')
    .style('background', '#0f172a')
    .style('color', '#ff6b35')
    .style('border', '1px solid #2d3a66')
    .style('border-radius', '6px')
    .style('cursor', 'pointer')
    .style('font-size', '0.85em')
    .style('font-weight', '600')
    .on('click', function() {
      stopAnimation();
      sampleSets.length = 0;
      samplesGroup.selectAll('*').remove();
      infoText.text('');
      buttonContainer.select('button').text('▶ Start Animation');
    });

  // Add legend
  const legend = g.append('g')
    .attr('transform', `translate(${innerWidth - 180}, 10)`);

  legend.append('rect')
    .attr('x', -10)
    .attr('y', -10)
    .attr('width', 190)
    .attr('height', 80)
    .attr('fill', 'rgba(15, 23, 42, 0.8)')
    .attr('rx', 5);

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', 10)
    .attr('x2', 30)
    .attr('y2', 10)
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '6,3');

  legend.append('text')
    .attr('x', 40)
    .attr('y', 15)
    .style('fill', '#ffffff')
    .style('font-size', '12px')
    .text('True regression line');

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', 35)
    .attr('x2', 30)
    .attr('y2', 35)
    .attr('stroke', '#00d4ff')
    .attr('stroke-width', 2.5);

  legend.append('text')
    .attr('x', 40)
    .attr('y', 40)
    .style('fill', '#00d4ff')
    .style('font-size', '12px')
    .text('Sample regression lines');

  legend.append('circle')
    .attr('cx', 15)
    .attr('cy', 58)
    .attr('r', 5)
    .attr('fill', '#00d4ff')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 1);

  legend.append('text')
    .attr('x', 40)
    .attr('y', 62)
    .style('fill', '#9efcff')
    .style('font-size', '12px')
    .text('Sample data points');

  // Handle slide visibility - start/stop animation
  function handleSlideChange() {
    const slideElement = container.closest('section');
    if (!slideElement) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting && isAnimating) {
          stopAnimation();
          buttonContainer.select('button').text('▶ Start Animation');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(slideElement);
  }

  handleSlideChange();

  // Return control functions for external use
  return {
    start: startAnimation,
    stop: stopAnimation,
    reset: function() {
      stopAnimation();
      sampleSets.length = 0;
      samplesGroup.selectAll('*').remove();
      infoText.text('');
    }
  };
}

// Initialize when DOM is ready
(function() {
  const containerId = 'regression-uncertainty-chart';
  const slideId = 'uncertainties-intro-0';

  function init() {
    const container = document.getElementById(containerId);
    if (!container) return;
    createRegressionUncertaintyAnimation(containerId);
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
