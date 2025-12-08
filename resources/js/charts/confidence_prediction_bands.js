/* -------------------------------------*/
/* CONFIDENCE & PREDICTION BANDS CHART */
/* Interactive regression visualization */
/* -------------------------------------*/
(function () {
  function initConfidencePredictionChart() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initConfidencePredictionChart, 100);
      return;
    }

    const containerId = 'confidence-prediction-bands-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Theme-aware colors
    const theme = {
      // Main colors
      pointColor: isPerformanceMode ? '#0066aa' : '#00aaff',
      lineColor: isPerformanceMode ? '#cc3300' : '#ff6644',
      ciColor: isPerformanceMode ? '#0066aa' : '#4488ff',
      piColor: isPerformanceMode ? '#666666' : '#888888',
      // Text colors
      titleColor: isPerformanceMode ? '#000000' : '#ffffff',
      axisTextColor: isPerformanceMode ? '#333333' : '#aaaaaa',
      axisLineColor: isPerformanceMode ? '#666666' : '#555555',
      labelColor: isPerformanceMode ? '#000000' : '#ffffff',
      // Background
      bgColor: isPerformanceMode ? '#f5f5f5' : '#1a1a2e'
    };

    // Configuration
    const margin = { top: 50, right: 40, bottom: 70, left: 80 };
    const width = 880 - margin.left - margin.right;
    const height = 680 - margin.top - margin.bottom;

    // Generate sample calibration data
    const trueSlope = 0.1;
    const trueIntercept = 0.02;
    const noise = 0.015;
    
    // Calibration points
    const xValues = [0, 1, 2, 3, 4, 5, 6];
    const data = xValues.map(x => ({
      x: x,
      y: trueIntercept + trueSlope * x + (Math.random() - 0.5) * 2 * noise
    }));

    // Calculate regression
    const n = data.length;
    const sumX = d3.sum(data, d => d.x);
    const sumY = d3.sum(data, d => d.y);
    const sumXY = d3.sum(data, d => d.x * d.y);
    const sumX2 = d3.sum(data, d => d.x * d.x);
    const meanX = sumX / n;
    const meanY = sumY / n;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = meanY - slope * meanX;

    // Residual standard error
    const SSres = d3.sum(data, d => Math.pow(d.y - (intercept + slope * d.x), 2));
    const se = Math.sqrt(SSres / (n - 2));

    // Sum of squared deviations from mean x
    const Sxx = d3.sum(data, d => Math.pow(d.x - meanX, 2));

    // t-value for 95% CI (df = n-2)
    const tValue = 2.571; // t(0.025, 5)

    // Generate prediction points
    const xRange = d3.range(0, 6.5, 0.1);
    const predictions = xRange.map(x => {
      const yHat = intercept + slope * x;
      
      // CI width
      const ciWidth = tValue * se * Math.sqrt(1/n + Math.pow(x - meanX, 2) / Sxx);
      
      // PI width (includes extra "1 +" for individual prediction)
      const piWidth = tValue * se * Math.sqrt(1 + 1/n + Math.pow(x - meanX, 2) / Sxx);
      
      return {
        x: x,
        yHat: yHat,
        ciLower: yHat - ciWidth,
        ciUpper: yHat + ciWidth,
        piLower: yHat - piWidth,
        piUpper: yHat + piWidth
      };
    });

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Background
    svg.append('rect')
      .attr('x', -margin.left)
      .attr('y', -margin.top)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('fill', theme.bgColor)
      .attr('rx', 8);

    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 6.5])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 0.75])
      .range([height, 0]);

    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Confidence vs Prediction Intervals');

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(7))
      .selectAll('text')
      .attr('fill', theme.axisTextColor)
      .attr('font-size', '14px');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', theme.axisLineColor);

    // X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.axisTextColor)
      .attr('font-size', '15px')
      .text('Concentration (mg/L)');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll('text')
      .attr('fill', theme.axisTextColor)
      .attr('font-size', '14px');

    svg.selectAll('.domain, .tick line')
      .attr('stroke', theme.axisLineColor);

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -55)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.axisTextColor)
      .attr('font-size', '15px')
      .text('Absorbance');

    // Prediction interval band (draw first, so it's behind)
    const piArea = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.piLower))
      .y1(d => yScale(d.piUpper))
      .curve(d3.curveLinear);

    svg.append('path')
      .datum(predictions)
      .attr('fill', theme.piColor)
      .attr('opacity', 0.25)
      .attr('d', piArea);

    // Confidence interval band
    const ciArea = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.ciLower))
      .y1(d => yScale(d.ciUpper))
      .curve(d3.curveLinear);

    svg.append('path')
      .datum(predictions)
      .attr('fill', theme.ciColor)
      .attr('opacity', 0.35)
      .attr('d', ciArea);

    // Regression line
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.yHat))
      .curve(d3.curveLinear);

    svg.append('path')
      .datum(predictions)
      .attr('fill', 'none')
      .attr('stroke', theme.lineColor)
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // Data points
    svg.selectAll('.point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 8)
      .attr('fill', theme.pointColor)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    // Legend
    const legendX = width - 150;
    const legendY = 20;
    const legendSpacing = 26;

    // CI legend
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .attr('width', 22)
      .attr('height', 14)
      .attr('fill', theme.ciColor)
      .attr('opacity', 0.5);

    svg.append('text')
      .attr('x', legendX + 30)
      .attr('y', legendY + 12)
      .attr('fill', theme.labelColor)
      .attr('font-size', '13px')
      .text('95% Confidence');

    // PI legend
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY + legendSpacing)
      .attr('width', 22)
      .attr('height', 14)
      .attr('fill', theme.piColor)
      .attr('opacity', 0.4);

    svg.append('text')
      .attr('x', legendX + 30)
      .attr('y', legendY + legendSpacing + 12)
      .attr('fill', theme.labelColor)
      .attr('font-size', '13px')
      .text('95% Prediction');

    // Regression line legend
    svg.append('line')
      .attr('x1', legendX)
      .attr('x2', legendX + 22)
      .attr('y1', legendY + 2 * legendSpacing + 7)
      .attr('y2', legendY + 2 * legendSpacing + 7)
      .attr('stroke', theme.lineColor)
      .attr('stroke-width', 3);

    svg.append('text')
      .attr('x', legendX + 30)
      .attr('y', legendY + 2 * legendSpacing + 12)
      .attr('fill', theme.labelColor)
      .attr('font-size', '13px')
      .text('Regression');

    // Add annotation showing CI narrowest at mean
    const meanYHat = intercept + slope * meanX;
    
    // Vertical line at mean
    svg.append('line')
      .attr('x1', xScale(meanX))
      .attr('x2', xScale(meanX))
      .attr('y1', yScale(0))
      .attr('y2', yScale(meanYHat))
      .attr('stroke', theme.axisTextColor)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('opacity', 0.6);

    // Annotation text
    svg.append('text')
      .attr('x', xScale(meanX))
      .attr('y', height + 32)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.ciColor)
      .attr('font-size', '12px')
      .text('x̄ (narrowest CI)');

    // Add equation
    svg.append('text')
      .attr('x', 10)
      .attr('y', 28)
      .attr('fill', theme.labelColor)
      .attr('font-size', '14px')
      .attr('font-style', 'italic')
      .text(`ŷ = ${intercept.toFixed(3)} + ${slope.toFixed(4)}·x`);

    svg.append('text')
      .attr('x', 10)
      .attr('y', 48)
      .attr('fill', theme.axisTextColor)
      .attr('font-size', '12px')
      .text(`R² = 0.998, sₑ = ${se.toFixed(4)}`);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfidencePredictionChart);
  } else {
    initConfidencePredictionChart();
  }

  // Redraw on slide change
  if (typeof Reveal !== 'undefined') {
    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'confidence-bands-intro') {
        setTimeout(initConfidencePredictionChart, 200);
      }
    });
  }

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('confidence-prediction-bands-chart');
      if (container && container.offsetParent !== null) {
        initConfidencePredictionChart();
      }
    }, 250);
  });
})();
