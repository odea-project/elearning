/**
 * power-visualization.js
 * 
 * Interactive visualization showing how sample size and effect size affect
 * the t-distribution and the relationship between alpha, beta, and power.
 * Shows two overlapping distributions: H0 (centered at 0) and H1 (centered at effect).
 */

function initPowerVisualization(containerId) {
  // Configuration
  const COLOR_H0 = '#1a588bff';        // Blue for H0 distribution
  const COLOR_H1 = '#e63946';          // Red for H1 distribution
  const COLOR_ALPHA = '#ff9100ff';     // Orange for alpha region
  const COLOR_BETA = '#06d6a0';        // Green for beta region
  const COLOR_POWER = '#f77f00';       // Power region
  const COLOR_GRID = '#e0e0e0';
  const COLOR_TEXT = '#ff9900ff';
  const COLOR_CRITICAL = '#ca8a00ff';

  const margin = { top: 30, right: 30, bottom: 60, left: 60 };
  const container = document.getElementById(containerId);
  if (!container) return;

  // Check if already initialized
  if (container.hasAttribute('data-initialized')) {
    return;
  }
  container.setAttribute('data-initialized', 'true');

  const containerWidth = container.clientWidth || 800;
  const containerHeight = container.clientHeight || 500;
  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  // Clear previous content
  container.innerHTML = '';

  // Create SVG
  const svg = d3.select(`#${containerId}`)
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight);

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Add sliders container below SVG
  const controlsContainer = document.createElement('div');
  controlsContainer.style.marginTop = '15px';
  controlsContainer.style.padding = '15px';
  controlsContainer.style.display = 'flex';
  controlsContainer.style.flexDirection = 'column';
  controlsContainer.style.gap = '20px';
  controlsContainer.innerHTML = `
    <div style="display: flex; align-items: center; gap: 15px;">
      <label style="color: ${COLOR_TEXT}; font-size: 14px; font-weight: 600; min-width: 180px;">
        Effect Size (Cohen's d):
      </label>
      <input type="range" id="${containerId}-effect-slider" min="0.1" max="8" step="0.1" value="0.8" 
             style="flex: 1; cursor: pointer; height: 6px;">
      <span id="${containerId}-effect-value" style="color: ${COLOR_H1}; font-size: 16px; font-weight: bold; min-width: 40px;">0.8</span>
    </div>
    <div style="display: flex; align-items: center; gap: 15px;">
      <label style="color: ${COLOR_TEXT}; font-size: 14px; font-weight: 600; min-width: 180px;">
        Sample Size (per group):
      </label>
      <input type="range" id="${containerId}-n-slider" min="5" max="100" step="5" value="30" 
             style="flex: 1; cursor: pointer; height: 6px;">
      <span id="${containerId}-n-value" style="color: ${COLOR_H1}; font-size: 16px; font-weight: bold; min-width: 40px;">30</span>
    </div>
  `;
  container.appendChild(controlsContainer);

  // Statistical functions
  const normalPDF = (x, mean = 0, sd = 1) => {
    const z = (x - mean) / sd;
    return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
  };

  const normalCDF = (x, mean = 0, sd = 1) => {
    const z = (x - mean) / sd;
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - prob : prob;
  };

  // t-distribution functions
  const gamma = (z) => {
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

  const tPDF = (x, df, mean = 0, se = 1) => {
    const t = (x - mean) / se;
    const numerator = gamma((df + 1) / 2);
    const denominator = Math.sqrt(df * Math.PI) * gamma(df / 2) * se;
    return (numerator / denominator) * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
  };

  // Calculate critical value for t-distribution (approximation)
  const tCritical = (df, alpha = 0.05) => {
    // Simple approximation for two-tailed critical value
    // For more accuracy, would use inverse t-distribution
    if (df >= 30) return 1.96; // Normal approximation
    if (df >= 20) return 2.086;
    if (df >= 15) return 2.131;
    if (df >= 10) return 2.228;
    if (df >= 5) return 2.571;
    return 3.182; // df = 5
  };

  // t-distribution CDF (approximation using normal CDF for large df)
  const tCDF = (x, df, mean = 0, se = 1) => {
    const t = (x - mean) / se;
    if (df > 30) {
      // Use normal approximation for large df
      return normalCDF(t);
    }
    // For smaller df, this is a rough approximation
    // A proper implementation would use incomplete beta function
    const z = t / Math.sqrt(1 + t * t / df);
    return normalCDF(z);
  };

  // Initial values
  let effectSize = 0.8;
  let sampleSize = 30;

  const updateVisualization = () => {
    // Calculate parameters
    const df = 2 * (sampleSize - 1); // Two-sample t-test
    const se = Math.sqrt(2 / sampleSize); // Standard error for Cohen's d
    
    // Calculate non-centrality parameter (expected t-value under H1)
    // For two-sample t-test: t = effect_size / se
    const ncp = effectSize / se; // Non-centrality parameter (mean of H1 distribution)
    
    const alpha = 0.05;
    const criticalValue = tCritical(df, alpha);

    // Generate x range (t-values)
    const xMin = -1;
    const xMax = Math.max(5, ncp + 3);
    const nPoints = 300;
    const xValues = d3.range(xMin, xMax, (xMax - xMin) / nPoints);

    // Generate distribution data
    // H0: t-distribution centered at 0 with se=1 (standard t-distribution)
    // H1: t-distribution centered at ncp with se=1 (non-central t-distribution approximation)
    const h0Data = xValues.map(x => ({ x, y: tPDF(x, df, 0, 1) }));
    const h1Data = xValues.map(x => ({ x, y: tPDF(x, df, ncp, 1) }));

    // Calculate regions
    const alphaData = xValues.filter(x => x >= criticalValue).map(x => ({ x, y: tPDF(x, df, 0, 1) }));
    const betaData = xValues.filter(x => x < criticalValue).map(x => ({ x, y: tPDF(x, df, ncp, 1) }));
    const powerData = xValues.filter(x => x >= criticalValue).map(x => ({ x, y: tPDF(x, df, ncp, 1) }));

    // Update scales
    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width]);

    const maxY = Math.max(
      d3.max(h0Data, d => d.y),
      d3.max(h1Data, d => d.y)
    ) * 1.1;

    const yScale = d3.scaleLinear()
      .domain([0, maxY])
      .range([height, 0]);

    // Clear previous elements
    g.selectAll('*').remove();

    // Grid lines
    const xGrid = g.append('g').attr('class', 'grid').attr('opacity', 0.15);
    xGrid.selectAll('line')
      .data(xScale.ticks(8))
      .join('line')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', COLOR_GRID)
      .attr('stroke-width', 1);

    const yGrid = g.append('g').attr('class', 'grid').attr('opacity', 0.15);
    yGrid.selectAll('line')
      .data(yScale.ticks(5))
      .join('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', COLOR_GRID)
      .attr('stroke-width', 1);

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(height)
      .y1(d => yScale(d.y))
      .curve(d3.curveNatural);

    // Draw alpha region (Type I error)
    if (alphaData.length > 0) {
      g.append('path')
        .datum(alphaData)
        .attr('fill', COLOR_ALPHA)
        .attr('opacity', 0.4)
        .attr('d', area);
    }

    // Draw beta region (Type II error)
    if (betaData.length > 0) {
      g.append('path')
        .datum(betaData)
        .attr('fill', COLOR_BETA)
        .attr('opacity', 0.4)
        .attr('d', area);
    }

    // Draw power region
    if (powerData.length > 0) {
      g.append('path')
        .datum(powerData)
        .attr('fill', COLOR_POWER)
        .attr('opacity', 0.3)
        .attr('d', area);
    }

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveNatural);

    // Draw H0 distribution
    g.append('path')
      .datum(h0Data)
      .attr('fill', 'none')
      .attr('stroke', COLOR_H0)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Draw H1 distribution
    g.append('path')
      .datum(h1Data)
      .attr('fill', 'none')
      .attr('stroke', COLOR_H1)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Critical value line
    g.append('line')
      .attr('x1', xScale(criticalValue))
      .attr('x2', xScale(criticalValue))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', COLOR_CRITICAL)
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '6,4');

    // Zero line
    g.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#666')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.5);

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
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('t-value');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Probability Density');

    // Labels on distributions
    g.append('text')
      .attr('x', xScale(0))
      .attr('y', yScale(tPDF(0, df, 0, 1)) - 15)
      .attr('text-anchor', 'middle')
      .style('fill', COLOR_H0)
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('H₀');

    g.append('text')
      .attr('x', xScale(ncp))
      .attr('y', yScale(tPDF(ncp, df, ncp, 1)) - 15)
      .attr('text-anchor', 'middle')
      .style('fill', COLOR_H1)
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('H₁');

    // Critical value label
    g.append('text')
      .attr('x', xScale(criticalValue))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('fill', COLOR_CRITICAL)
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .text(`Critical: ${criticalValue.toFixed(2)}`);

    // Calculate region values using CDF
    // Beta is the probability of failing to reject H0 when H1 is true
    // This is P(t < critical value | H1 is true) = CDF of H1 at critical value
    const betaValue = tCDF(criticalValue, df, ncp, 1);
    const powerValue = 1 - betaValue;
    const alphaValue = 0.05;

    // Update display divs if they exist
    const betaDisplay = document.getElementById('beta-display');
    const powerDisplay = document.getElementById('power-display');
    
    if (betaDisplay) {
      betaDisplay.textContent = betaValue.toFixed(3);
    }
    
    if (powerDisplay) {
      powerDisplay.textContent = powerValue.toFixed(3);
    }

    // Legend
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 180}, ${0})`);

    const legendData = [
      { label: 'H₀ (null)', color: COLOR_H0, type: 'line' },
      { label: 'H₁ (alternative)', color: COLOR_H1, type: 'line' },
      { label: `α (Type I error)`, color: COLOR_ALPHA, type: 'rect' },
      { label: `β (Type II error)`, color: COLOR_BETA, type: 'rect' },
      { label: `Power (1-β)`, color: COLOR_POWER, type: 'rect' }
    ];

    legendData.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 28})`);

      if (item.type === 'line') {
        legendRow.append('line')
          .attr('x1', 0)
          .attr('x2', 25)
          .attr('y1', 0)
          .attr('y2', 0)
          .attr('stroke', item.color)
          .attr('stroke-width', 3);
      } else {
        legendRow.append('rect')
          .attr('x', 0)
          .attr('y', -6)
          .attr('width', 25)
          .attr('height', 12)
          .attr('fill', item.color)
          .attr('opacity', 0.5);
      }

      legendRow.append('text')
        .attr('x', 30)
        .attr('y', 4)
        .style('fill', COLOR_TEXT)
        .style('font-size', '0.5em')
        .style('font-weight', 'bold')
        .text(item.label);
    });
  };

  // Slider event listeners
  const effectSlider = document.getElementById(`${containerId}-effect-slider`);
  const nSlider = document.getElementById(`${containerId}-n-slider`);
  const effectValue = document.getElementById(`${containerId}-effect-value`);
  const nValue = document.getElementById(`${containerId}-n-value`);

  effectSlider.addEventListener('input', function() {
    effectSize = parseFloat(this.value);
    effectValue.textContent = effectSize.toFixed(1);
    updateVisualization();
  });

  nSlider.addEventListener('input', function() {
    sampleSize = parseInt(this.value);
    nValue.textContent = sampleSize;
    updateVisualization();
  });

  // Initial draw
  updateVisualization();
}

// Export for use in slides
if (typeof window !== 'undefined') {
  window.initPowerVisualization = initPowerVisualization;
}
