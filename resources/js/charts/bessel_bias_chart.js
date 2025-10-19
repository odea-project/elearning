/**
 * Bessel's Correction Bias Demonstration
 * Shows distribution of variance estimates from many random samples
 * Compares biased (÷n) vs unbiased (÷n-1) estimators
 */

function createBesselBiasChart(container) {
  // Clear any existing chart
  d3.select(container).select('svg').remove();

  // Get container width (with fallback)
  const containerWidth = container.clientWidth > 0 ? container.clientWidth : 500;
  const width = containerWidth;
  const height = 800;
  const margin = { top: 20, right: 20, bottom: 60, left: 60 };

  // Known population parameters
  const population = [];
  const popMean = 50;
  const popSD = 15;
  const popVariance = popSD * popSD; // 225
  
  // Generate a large population (normal distribution)
  for (let i = 0; i < 10000; i++) {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    population.push(popMean + z0 * popSD);
  }

  // Simulation parameters
  const numSamples = 1000;
  const sampleSize = 5;
  const biasedEstimates = [];
  const unbiasedEstimates = [];

  // Draw many random samples and calculate variance estimates
  for (let i = 0; i < numSamples; i++) {
    // Draw random sample
    const sample = [];
    for (let j = 0; j < sampleSize; j++) {
      const randomIndex = Math.floor(Math.random() * population.length);
      sample.push(population[randomIndex]);
    }

    // Calculate sample mean
    const sampleMean = sample.reduce((a, b) => a + b, 0) / sampleSize;

    // Calculate sum of squared deviations
    const sumSqDev = sample.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0);

    // Biased estimator (÷n)
    biasedEstimates.push(sumSqDev / sampleSize);

    // Unbiased estimator (÷n-1)
    unbiasedEstimates.push(sumSqDev / (sampleSize - 1));
  }

  // Calculate means of the estimates
  const meanBiased = biasedEstimates.reduce((a, b) => a + b, 0) / numSamples;
  const meanUnbiased = unbiasedEstimates.reduce((a, b) => a + b, 0) / numSamples;

  // KDE (Kernel Density Estimation) function
  function kernelDensityEstimator(kernel, X) {
    return function(V) {
      return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
    };
  }

  function epanechnikovKernel(bandwidth) {
    return function(v) {
      const u = v / bandwidth;
      return Math.abs(u) <= 1 ? 0.75 * (1 - u * u) / bandwidth : 0;
    };
  }

  // Set up x-axis range for KDE
  const xMin = 100;
  const xMax = 400;
  const numPoints = 200;
  const xValues = d3.range(xMin, xMax, (xMax - xMin) / numPoints);

  // Calculate bandwidth (Scott's rule)
  const bandwidth = 1.06 * Math.min(
    d3.deviation(biasedEstimates),
    d3.deviation(unbiasedEstimates)
  ) * Math.pow(numSamples, -0.2);

  // Calculate KDE for both distributions
  const kde = kernelDensityEstimator(epanechnikovKernel(bandwidth), xValues);
  const biasedKDE = kde(biasedEstimates);
  const unbiasedKDE = kde(unbiasedEstimates);

  // Create SVG
  const svg = d3.select(container)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Scales
  const xScale = d3.scaleLinear()
    .domain([xMin, xMax])
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max([...biasedKDE, ...unbiasedKDE], d => d[1]) * 1.1])
    .range([innerHeight, 0]);

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .style('color', '#ffffff')
    .selectAll('text')
    .style('fill', '#ffffff');

  g.append('text')
    .attr('x', innerWidth / 2)
    .attr('y', innerHeight + 45)
    .style('text-anchor', 'middle')
    .style('fill', '#ffffff')
    .style('font-size', '14px')
    .text('Variance Estimate');

  // Y axis
  g.append('g')
    .call(d3.axisLeft(yScale))
    .style('color', '#ffffff')
    .selectAll('text')
    .style('fill', '#ffffff');

  g.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -innerHeight / 2)
    .attr('y', -45)
    .style('text-anchor', 'middle')
    .style('fill', '#ffffff')
    .style('font-size', '14px')
    .text('Density');

  // Create area generator
  const area = d3.area()
    .x(d => xScale(d[0]))
    .y0(innerHeight)
    .y1(d => yScale(d[1]))
    .curve(d3.curveBasis);

  // Draw biased KDE (orange)
  g.append('path')
    .datum(biasedKDE)
    .attr('fill', '#ff6b35')
    .attr('opacity', 0.5)
    .attr('d', area);

  g.append('path')
    .datum(biasedKDE)
    .attr('fill', 'none')
    .attr('stroke', '#ff6b35')
    .attr('stroke-width', 2.5)
    .attr('d', d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveBasis)
    );

  // Draw unbiased KDE (cyan)
  g.append('path')
    .datum(unbiasedKDE)
    .attr('fill', '#00d4ff')
    .attr('opacity', 0.5)
    .attr('d', area);

  g.append('path')
    .datum(unbiasedKDE)
    .attr('fill', 'none')
    .attr('stroke', '#00d4ff')
    .attr('stroke-width', 2.5)
    .attr('d', d3.line()
      .x(d => xScale(d[0]))
      .y(d => yScale(d[1]))
      .curve(d3.curveBasis)
    );

  // True population variance line
  g.append('line')
    .attr('x1', xScale(popVariance))
    .attr('x2', xScale(popVariance))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#00ff88')
    .attr('stroke-width', 3)
    .attr('stroke-dasharray', '8,4');

  // Mean of biased estimates
  g.append('line')
    .attr('x1', xScale(meanBiased))
    .attr('x2', xScale(meanBiased))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#ff6b35')
    .attr('stroke-width', 2);

  // Mean of unbiased estimates
  g.append('line')
    .attr('x1', xScale(meanUnbiased))
    .attr('x2', xScale(meanUnbiased))
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', '#00d4ff')
    .attr('stroke-width', 2);

  // Legend
  const legend = g.append('g')
    .attr('transform', `translate(${innerWidth - 220}, 20)`);

  const legendData = [
    { color: '#00ff88', label: `True σ² = ${popVariance.toFixed(0)}`, dash: true },
    { color: '#ff6b35', label: `Biased (÷n): ${meanBiased.toFixed(1)}`, dash: false },
    { color: '#00d4ff', label: `Unbiased (÷n-1): ${meanUnbiased.toFixed(1)}`, dash: false }
  ];

  legendData.forEach((d, i) => {
    const legendRow = legend.append('g')
      .attr('transform', `translate(0, ${i * 25})`);

    if (d.dash) {
      legendRow.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 8)
        .attr('y2', 8)
        .attr('stroke', d.color)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '6,3');
    } else {
      legendRow.append('path')
        .attr('d', 'M 0,8 Q 5,0 10,8 T 20,8')
        .attr('stroke', d.color)
        .attr('stroke-width', 2.5)
        .attr('fill', 'none');
      
      legendRow.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 20)
        .attr('height', 16)
        .attr('fill', d.color)
        .attr('opacity', 0.3);
    }

    legendRow.append('text')
      .attr('x', 28)
      .attr('y', 12)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text(d.label);
  });

  // Add title showing sample size
  g.append('text')
    .attr('x', 10)
    .attr('y', -5)
    .style('fill', '#ffffff')
    .style('font-size', '13px')
    .style('font-style', 'italic')
    .text(`${numSamples} samples of n=${sampleSize} from population (μ=${popMean}, σ=${popSD})`);
}

// Initialize on page load and handle resize
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('bessel-bias-chart');
  if (container) {
    createBesselBiasChart(container);

    // Add button click handler
    const rerunButton = document.getElementById('rerun-bessel');
    if (rerunButton) {
      rerunButton.addEventListener('click', () => {
        createBesselBiasChart(container);
      });
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        createBesselBiasChart(container);
      }, 250);
    });
  }
});

// Handle reveal.js slide changes
if (typeof Reveal !== 'undefined') {
  Reveal.on('slidechanged', (event) => {
    setTimeout(() => {
      const container = document.getElementById('bessel-bias-chart');
      if (container && container.offsetParent !== null) {
        createBesselBiasChart(container);
        
        // Re-attach button handler after slide change
        const rerunButton = document.getElementById('rerun-bessel');
        if (rerunButton) {
          rerunButton.onclick = () => createBesselBiasChart(container);
        }
      }
    }, 200);
  });
}
