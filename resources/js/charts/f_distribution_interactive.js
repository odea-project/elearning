/**
 * Interactive F-Distribution PDF Visualization
 * 
 * This chart displays the probability density function (PDF) of the F-distribution
 * with interactive sliders for the two degrees of freedom parameters.
 * 
 * Features:
 * - Two sliders for df1 (numerator df, 2-10) and df2 (denominator df, 10-50)
 * - Real-time curve updates as sliders are adjusted
 * - Critical value marker at α = 0.05 (numerically computed via CDF inversion)
 * - Shaded rejection region
 * - Distribution parameters display
 * 
 * Technical Notes:
 * - Critical values computed via Simpson integration + binary search
 * - Slider ranges limited to df1≥2, df2≥10 for numerical stability
 * - For extreme parameters (df1=1, small df2), Simpson integration may underestimate
 *   CDF in heavy-tail regions, leading to inaccurate critical values
 * 
 * Dependencies: D3.js v7
 */

(function() {
  'use strict';

  // Gamma function approximation (Lanczos approximation)
  function gamma(z) {
    const g = 7;
    const C = [
      0.99999999999980993,
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];

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
  }

  // Beta function
  function beta(a, b) {
    return gamma(a) * gamma(b) / gamma(a + b);
  }

  // F-distribution PDF
  function fDistributionPDF(x, df1, df2) {
    if (x <= 0) return 0;

    const numerator = Math.pow(df1 * x, df1) * Math.pow(df2, df2);
    const denominator = Math.pow(df1 * x + df2, df1 + df2);
    const coefficient = 1 / (x * beta(df1 / 2, df2 / 2));

    return coefficient * Math.sqrt(numerator / denominator);
  }

  // Numerische CDF der F-Verteilung über Simpson-Regel
  function fCDF(x, df1, df2) {
    if (x <= 0) return 0;

    const n = 200; // muss gerade sein für Simpson
    const h = x / n;
    let sum = fDistributionPDF(0, df1, df2) + fDistributionPDF(x, df1, df2);

    for (let i = 1; i < n; i++) {
      const xi = i * h;
      const weight = (i % 2 === 0) ? 2 : 4;
      sum += weight * fDistributionPDF(xi, df1, df2);
    }

    return (h / 3) * sum;
  }

  // Calculate critical value for F-distribution at α using numerical methods
  function fCriticalValue(df1, df2, alpha = 0.05) {
    const target = 1 - alpha;

    // obere Schranke suchen (so lange erhöhen, bis CDF ~ target oder größer)
    let low = 0;
    let high = 5;

    while (fCDF(high, df1, df2) < target) {
      high *= 2;
      if (high > 1e4) break; // Sicherheitsbremse
    }

    // Binärsuche
    for (let i = 0; i < 40; i++) { // 40 Iterationen sind mehr als genug
      const mid = (low + high) / 2;
      const cdfMid = fCDF(mid, df1, df2);

      if (cdfMid < target) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2;
  }

  function drawFDistributionChart() {
    // Check if container exists
    const container = document.getElementById('f-distribution-chart');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Chart dimensions
    const width = 600;
    const height = 450;
    const margin = { top: 40, right: 40, bottom: 80, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Initial parameters (chosen for numerical stability)
    let df1 = 3;
    let df2 = 20;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'f-distribution-svg');

    // Create plot group
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLinear()
      .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([plotHeight, 0]);

    // Add axes
    const xAxis = g.append('g')
      .attr('class', 'd3-axis')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(8));

    const yAxis = g.append('g')
      .attr('class', 'd3-axis')
      .call(d3.axisLeft(yScale).ticks(6));

    // Add axis labels
    svg.append('text')
      .attr('class', 'd3-axis-label')
      .attr('x', margin.left + plotWidth / 2)
      .attr('y', height - 20)
      .style('text-anchor', 'middle')
      .text('F-value');

    svg.append('text')
      .attr('class', 'd3-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -margin.top - plotHeight / 2)
      .attr('y', 15)
      .style('text-anchor', 'middle')
      .text('Probability Density');

    // Add title
    const title = svg.append('text')
      .attr('class', 'd3-chart-title')
      .attr('x', width / 2)
      .attr('y', 20)
      .style('text-anchor', 'middle')
      .text(`F-Distribution: df₁ = ${df1}, df₂ = ${df2}`);

    // Create gradient for shaded area
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'rejection-gradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ff6b35')
      .attr('stop-opacity', 0.1);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ff6b35')
      .attr('stop-opacity', 0.3);

    // Add rejection region path (will be updated)
    const rejectionPath = g.append('path')
      .attr('class', 'rejection-region')
      .attr('fill', 'url(#rejection-gradient)');

    // Add F-distribution curve path
    const curvePath = g.append('path')
      .attr('class', 'f-curve')
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 3);

    // Add critical value line
    const criticalLine = g.append('line')
      .attr('class', 'critical-line')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Add critical value label
    const criticalLabel = g.append('text')
      .attr('class', 'd3-legend-text')
      .style('fill', '#ff6b35')
      .style('font-size', '12px')
      .attr('text-anchor', 'middle');

    // Function to update the chart
    function updateChart() {
      // Calculate critical value first (needed for x-axis domain)
      const fCrit = fCriticalValue(df1, df2);

      // X-Domain so wählen, dass F_crit sicher drin ist
      const maxX = Math.max(6, fCrit * 1.3);
      xScale.domain([0, maxX]);
      xAxis.transition().duration(300).call(d3.axisBottom(xScale).ticks(8));

      // Generate data points
      const dataPoints = [];
      const numPoints = 200;
      
      for (let i = 0; i <= numPoints; i++) {
        const x = (i / numPoints) * maxX;
        const y = fDistributionPDF(x, df1, df2);
        dataPoints.push({ x, y });
      }

      // Update y-scale domain based on max value
      const maxY = d3.max(dataPoints, d => d.y);
      yScale.domain([0, maxY * 1.1]);
      yAxis.transition().duration(300).call(d3.axisLeft(yScale).ticks(6));

      // Create line generator
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);

      // Update curve
      curvePath
        .datum(dataPoints)
        .transition()
        .duration(300)
        .attr('d', line);
      
      // Update critical line (fCrit already calculated at start of function)
      criticalLine
        .transition()
        .duration(300)
        .attr('x1', xScale(fCrit))
        .attr('x2', xScale(fCrit))
        .attr('y1', 0)
        .attr('y2', plotHeight);

      // Update critical label
      criticalLabel
        .transition()
        .duration(300)
        .attr('x', xScale(fCrit))
        .attr('y', -10)
        .text(`F_crit ≈ ${fCrit.toFixed(2)}`);

      // Update rejection region
      const rejectionData = dataPoints.filter(d => d.x >= fCrit);
      if (rejectionData.length > 0) {
        // Add points to close the area
        const areaData = [
          { x: fCrit, y: 0 },
          ...rejectionData,
          { x: maxX, y: 0 }
        ];

        const area = d3.line()
          .x(d => xScale(d.x))
          .y(d => yScale(d.y))
          .curve(d3.curveMonotoneX);

        rejectionPath
          .datum(areaData)
          .transition()
          .duration(300)
          .attr('d', area);
      }

      // Update title
      title.text(`F-Distribution: df₁ = ${df1}, df₂ = ${df2}`);
    }

    // Create controls container - single row layout
    const controls = d3.select(container)
      .append('div')
      .attr('class', 'f-distribution-controls')
      .style('margin-top', '15px')
      .style('display', 'flex')
      .style('flex-direction', 'row')
      .style('align-items', 'center')
      .style('gap', '20px');

    // DF1 Slider (between groups)
    const df1Control = controls.append('div')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '8px');

    df1Control.append('label')
      .style('color', '#00d4ff')
      .style('font-weight', 'bold')
      .style('font-size', '13px')
      .style('white-space', 'nowrap')
      .text(`df₁ (between): ${df1}`);

    const df1Slider = df1Control.append('input')
      .attr('type', 'range')
      .attr('min', 2)  // Min = 2 for numerical stability of Simpson integration
      .attr('max', 10)
      .attr('step', 1)
      .attr('value', df1)
      .style('width', '120px')
      .style('cursor', 'pointer');

    df1Control.append('span')
      .style('color', '#ffffff')
      .style('font-size', '12px')
      .style('min-width', '20px')
      .text(df1);

    // DF2 Slider (within groups)
    const df2Control = controls.append('div')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '8px');

    df2Control.append('label')
      .style('color', '#00d4ff')
      .style('font-weight', 'bold')
      .style('font-size', '13px')
      .style('white-space', 'nowrap')
      .text(`df₂ (within): ${df2}`);

    const df2Slider = df2Control.append('input')
      .attr('type', 'range')
      .attr('min', 10)  // Min = 10 for numerical stability of Simpson integration
      .attr('max', 50)
      .attr('step', 1)
      .attr('value', df2)
      .style('width', '120px')
      .style('cursor', 'pointer');

    df2Control.append('span')
      .style('color', '#ffffff')
      .style('font-size', '12px')
      .style('min-width', '20px')
      .text(df2);

    // Slider event handlers
    df1Slider.on('input', function() {
      df1 = +this.value;
      df1Control.select('label').text(`df₁ (between): ${df1}`);
      df1Control.select('span').text(df1);
      updateChart();
    });

    df2Slider.on('input', function() {
      df2 = +this.value;
      df2Control.select('label').text(`df₂ (within): ${df2}`);
      df2Control.select('span').text(df2);
      updateChart();
    });

    // Initial draw
    updateChart();
  }

  // Initialize on slide change
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.id === 'anova1-f-statistic-interpretation') {
        drawFDistributionChart();
      }
    });

    // Also initialize if already on the slide
    if (Reveal.getCurrentSlide().id === 'anova1-f-statistic-interpretation') {
      setTimeout(drawFDistributionChart, 100);
    }
  } else {
    // Fallback if Reveal is not available
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', drawFDistributionChart);
    } else {
      drawFDistributionChart();
    }
  }

})();
