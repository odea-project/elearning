/* -------------------------------------*/
/* STANDARD-SAMPLE-STANDARD DEMO CHART  */
/* Drift correction visualization       */
/* 2x2 grid: short/long term × raw/corr */
/* -------------------------------------*/
(function () {
  function initSSSDemo() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initSSSDemo, 100);
      return;
    }

    const containerId = 'sss-demo-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Theme-aware colors
    const theme = {
      standardColor: isPerformanceMode ? '#0066aa' : '#00aaff',
      sampleColors: [
        isPerformanceMode ? '#cc6600' : '#ff9944',
        isPerformanceMode ? '#009966' : '#44dd88',
        isPerformanceMode ? '#cc3366' : '#ff6699',
        isPerformanceMode ? '#6633cc' : '#aa66ff'
      ],
      driftLineColor: isPerformanceMode ? '#990000' : '#ff4444',
      correctedLineColor: isPerformanceMode ? '#006600' : '#00cc66',
      trueValueColor: isPerformanceMode ? '#006600' : '#00ff88',
      titleColor: isPerformanceMode ? '#000000' : '#ffffff',
      textColor: isPerformanceMode ? '#333333' : '#cccccc',
      axisColor: isPerformanceMode ? '#666666' : '#888888',
      gridColor: isPerformanceMode ? '#cccccc' : '#333344',
      bgColor: isPerformanceMode ? '#f5f5f5' : '#1a1a2e',
      panelBg: isPerformanceMode ? '#e8e8e8' : '#252540',
      errorBarColor: isPerformanceMode ? '#444444' : '#aaaaaa'
    };

    // Generate synthetic data
    const generateShortTermData = () => {
      // Short-term: ~15 measurements over ~2 hours
      // Drift: linear drift over time
      const data = {
        standards: [],
        samples: []
      };
      
      const trueStandardValue = 100;
      const trueSampleValues = [85, 72, 93, 78]; // 4 different samples
      const driftRate = 0.15; // units per minute
      const noise = 1.5;
      
      // Standards at beginning, middle, end (bracketing)
      const standardTimes = [0, 30, 60, 90, 120];
      standardTimes.forEach(t => {
        const drift = t * driftRate;
        const measured = trueStandardValue + drift + (Math.random() - 0.5) * noise * 2;
        data.standards.push({
          time: t,
          measured: measured,
          true: trueStandardValue,
          error: noise * 0.8
        });
      });
      
      // Samples between standards
      const sampleTimes = [10, 20, 40, 50, 70, 80, 100, 110];
      sampleTimes.forEach((t, i) => {
        const sampleIdx = i % 4;
        const drift = t * driftRate;
        const measured = trueSampleValues[sampleIdx] + drift + (Math.random() - 0.5) * noise * 2;
        data.samples.push({
          time: t,
          measured: measured,
          true: trueSampleValues[sampleIdx],
          sampleId: sampleIdx,
          error: noise * 0.8
        });
      });
      
      return data;
    };

    const generateLongTermData = () => {
      // Long-term: measurements over 30 days
      // Drift: non-linear (polynomial) trend
      const data = {
        standards: [],
        samples: []
      };
      
      const trueStandardValue = 100;
      const trueSampleValues = [85, 72, 93, 78];
      const noise = 2.0;
      
      // Standards every few days
      const standardDays = [0, 5, 10, 15, 20, 25, 30];
      standardDays.forEach(d => {
        // Polynomial drift: a*d + b*d² 
        const drift = 0.3 * d + 0.02 * d * d;
        const measured = trueStandardValue + drift + (Math.random() - 0.5) * noise * 2;
        data.standards.push({
          time: d,
          measured: measured,
          true: trueStandardValue,
          error: noise * 0.8
        });
      });
      
      // Samples throughout
      for (let d = 1; d <= 29; d += 2) {
        const sampleIdx = Math.floor(Math.random() * 4);
        const drift = 0.3 * d + 0.02 * d * d;
        const measured = trueSampleValues[sampleIdx] + drift + (Math.random() - 0.5) * noise * 2;
        data.samples.push({
          time: d,
          measured: measured,
          true: trueSampleValues[sampleIdx],
          sampleId: sampleIdx,
          error: noise * 0.8
        });
      }
      
      return data;
    };

    // Calculate drift correction
    const calculateCorrection = (data, isLongTerm) => {
      const standards = data.standards;
      const samples = data.samples;
      
      // Fit polynomial to standards
      // For short-term: linear (degree 1)
      // For long-term: quadratic (degree 2)
      const degree = isLongTerm ? 2 : 1;
      
      // Simple polynomial regression
      const x = standards.map(s => s.time);
      const y = standards.map(s => s.measured - s.true);
      
      let coeffs;
      if (degree === 1) {
        // Linear: y = a + bx
        const n = x.length;
        const sumX = d3.sum(x);
        const sumY = d3.sum(y);
        const sumXY = d3.sum(x.map((xi, i) => xi * y[i]));
        const sumX2 = d3.sum(x.map(xi => xi * xi));
        
        const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const a = (sumY - b * sumX) / n;
        coeffs = [a, b];
      } else {
        // Quadratic: simple least squares
        // Using normal equations for degree 2
        const n = x.length;
        const sumX = d3.sum(x);
        const sumX2 = d3.sum(x.map(xi => xi * xi));
        const sumX3 = d3.sum(x.map(xi => xi * xi * xi));
        const sumX4 = d3.sum(x.map(xi => xi * xi * xi * xi));
        const sumY = d3.sum(y);
        const sumXY = d3.sum(x.map((xi, i) => xi * y[i]));
        const sumX2Y = d3.sum(x.map((xi, i) => xi * xi * y[i]));
        
        // Solve 3x3 system (simplified)
        const a0 = sumY / n - (sumX2 / n) * (sumX2Y - sumX2 * sumY / n) / (sumX4 - sumX2 * sumX2 / n);
        const a1 = (sumXY - sumX * sumY / n) / (sumX2 - sumX * sumX / n);
        const a2 = (sumX2Y - sumX2 * sumY / n) / (sumX4 - sumX2 * sumX2 / n);
        coeffs = [a0 * 0.3, a1 * 0.8, a2 * 0.1]; // Adjusted for stability
      }
      
      // Apply correction
      const getDrift = (t) => {
        if (degree === 1) {
          return coeffs[0] + coeffs[1] * t;
        } else {
          // Use linear interpolation between standards for stability
          for (let i = 0; i < standards.length - 1; i++) {
            if (t >= standards[i].time && t <= standards[i + 1].time) {
              const t0 = standards[i].time;
              const t1 = standards[i + 1].time;
              const d0 = standards[i].measured - standards[i].true;
              const d1 = standards[i + 1].measured - standards[i + 1].true;
              return d0 + (d1 - d0) * (t - t0) / (t1 - t0);
            }
          }
          // Extrapolate
          const last = standards[standards.length - 1];
          const prev = standards[standards.length - 2];
          const slope = (last.measured - last.true - (prev.measured - prev.true)) / (last.time - prev.time);
          return (last.measured - last.true) + slope * (t - last.time);
        }
      };
      
      // Actually use piecewise linear interpolation for both (more stable)
      const getDriftInterp = (t) => {
        for (let i = 0; i < standards.length - 1; i++) {
          if (t >= standards[i].time && t <= standards[i + 1].time) {
            const t0 = standards[i].time;
            const t1 = standards[i + 1].time;
            const d0 = standards[i].measured - standards[i].true;
            const d1 = standards[i + 1].measured - standards[i + 1].true;
            return d0 + (d1 - d0) * (t - t0) / (t1 - t0);
          }
        }
        // Before first standard
        if (t < standards[0].time) {
          return standards[0].measured - standards[0].true;
        }
        // After last standard
        return standards[standards.length - 1].measured - standards[standards.length - 1].true;
      };
      
      const correctedSamples = samples.map(s => ({
        ...s,
        corrected: s.measured - getDriftInterp(s.time)
      }));
      
      // Generate drift curve points
      const tMin = Math.min(...standards.map(s => s.time));
      const tMax = Math.max(...standards.map(s => s.time));
      const driftCurve = [];
      for (let t = tMin; t <= tMax; t += (tMax - tMin) / 50) {
        driftCurve.push({
          time: t,
          drift: getDriftInterp(t)
        });
      }
      
      return { correctedSamples, driftCurve, coeffs };
    };

    // Generate data
    const shortTermData = generateShortTermData();
    const longTermData = generateLongTermData();
    
    const shortTermCorrection = calculateCorrection(shortTermData, false);
    const longTermCorrection = calculateCorrection(longTermData, true);

    // Layout configuration
    const totalWidth = 1200;
    const totalHeight = 700;
    const margin = { top: 50, right: 30, bottom: 40, left: 60 };
    const panelGap = 40;
    const panelWidth = (totalWidth - margin.left - margin.right - panelGap) / 2;
    const panelHeight = (totalHeight - margin.top - margin.bottom - panelGap - 60) / 2;

    // Create main container
    const mainDiv = d3.select(container)
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('gap', '5px');

    // Title
    mainDiv.append('div')
      .style('color', theme.titleColor)
      .style('font-size', '22px')
      .style('font-weight', 'bold')
      .style('margin-bottom', '5px')
      .text('Standard-Sample-Standard Drift Correction');

    // SVG container
    const svg = mainDiv.append('svg')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

    // Background
    svg.append('rect')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('fill', theme.bgColor)
      .attr('rx', 10);

    // Column headers
    svg.append('text')
      .attr('x', margin.left + panelWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Short-Term Drift (Minutes)');

    svg.append('text')
      .attr('x', margin.left + panelWidth + panelGap + panelWidth / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Long-Term Drift (Days)');

    // Row labels
    svg.append('text')
      .attr('x', 15)
      .attr('y', margin.top + panelHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('transform', `rotate(-90, 15, ${margin.top + panelHeight / 2})`)
      .text('Raw Data');

    svg.append('text')
      .attr('x', 15)
      .attr('y', margin.top + panelHeight + panelGap + panelHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('transform', `rotate(-90, 15, ${margin.top + panelHeight + panelGap + panelHeight / 2})`)
      .text('Corrected');

    // Function to draw a panel
    const drawPanel = (data, correction, xOffset, yOffset, xLabel, isRaw, isLongTerm) => {
      const g = svg.append('g')
        .attr('transform', `translate(${xOffset}, ${yOffset})`);

      // Panel background
      g.append('rect')
        .attr('width', panelWidth)
        .attr('height', panelHeight)
        .attr('fill', theme.panelBg)
        .attr('rx', 6);

      // Scales
      const xExtent = d3.extent([...data.standards, ...data.samples], d => d.time);
      const xScale = d3.scaleLinear()
        .domain([xExtent[0] - (xExtent[1] - xExtent[0]) * 0.05, xExtent[1] + (xExtent[1] - xExtent[0]) * 0.05])
        .range([45, panelWidth - 20]);

      let yMin, yMax;
      if (isRaw) {
        const allValues = [...data.standards.map(d => d.measured), ...data.samples.map(d => d.measured)];
        yMin = d3.min(allValues) - 5;
        yMax = d3.max(allValues) + 5;
      } else {
        // Corrected values should be close to true values
        const allTrue = [...data.samples.map(d => d.true)];
        const allCorrected = correction.correctedSamples.map(d => d.corrected);
        yMin = Math.min(d3.min(allTrue), d3.min(allCorrected)) - 5;
        yMax = Math.max(d3.max(allTrue), d3.max(allCorrected)) + 5;
        // Also include standard true value
        yMin = Math.min(yMin, data.standards[0].true - 5);
        yMax = Math.max(yMax, data.standards[0].true + 5);
      }

      const yScale = d3.scaleLinear()
        .domain([yMin, yMax])
        .range([panelHeight - 30, 15]);

      // Grid lines
      const yTicks = yScale.ticks(5);
      yTicks.forEach(tick => {
        g.append('line')
          .attr('x1', 45)
          .attr('x2', panelWidth - 20)
          .attr('y1', yScale(tick))
          .attr('y2', yScale(tick))
          .attr('stroke', theme.gridColor)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', 0.5);
      });

      // X axis
      const xAxis = d3.axisBottom(xScale).ticks(5);
      g.append('g')
        .attr('transform', `translate(0, ${panelHeight - 30})`)
        .call(xAxis)
        .selectAll('text, line, path')
        .attr('fill', theme.axisColor)
        .attr('stroke', theme.axisColor);

      // Y axis
      const yAxis = d3.axisLeft(yScale).ticks(5);
      g.append('g')
        .attr('transform', 'translate(45, 0)')
        .call(yAxis)
        .selectAll('text, line, path')
        .attr('fill', theme.axisColor)
        .attr('stroke', theme.axisColor);

      // Y axis label
      g.append('text')
        .attr('x', -panelHeight / 2)
        .attr('y', 12)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '11px')
        .text('Signal');

      if (isRaw) {
        // Draw drift line through standards
        const driftLine = d3.line()
          .x(d => xScale(d.time))
          .y(d => yScale(data.standards[0].true + d.drift))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(correction.driftCurve)
          .attr('fill', 'none')
          .attr('stroke', theme.driftLineColor)
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '6,4')
          .attr('d', driftLine);

        // Draw standards
        data.standards.forEach(std => {
          // Error bar
          g.append('line')
            .attr('x1', xScale(std.time))
            .attr('x2', xScale(std.time))
            .attr('y1', yScale(std.measured - std.error))
            .attr('y2', yScale(std.measured + std.error))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          // Error bar caps
          g.append('line')
            .attr('x1', xScale(std.time) - 4)
            .attr('x2', xScale(std.time) + 4)
            .attr('y1', yScale(std.measured - std.error))
            .attr('y2', yScale(std.measured - std.error))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);
          g.append('line')
            .attr('x1', xScale(std.time) - 4)
            .attr('x2', xScale(std.time) + 4)
            .attr('y1', yScale(std.measured + std.error))
            .attr('y2', yScale(std.measured + std.error))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          // Point
          g.append('rect')
            .attr('x', xScale(std.time) - 6)
            .attr('y', yScale(std.measured) - 6)
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', theme.standardColor)
            .attr('stroke', isPerformanceMode ? '#003366' : '#0088ff')
            .attr('stroke-width', 2);
        });

        // Draw samples
        data.samples.forEach(sample => {
          const color = theme.sampleColors[sample.sampleId];
          
          // Error bar
          g.append('line')
            .attr('x1', xScale(sample.time))
            .attr('x2', xScale(sample.time))
            .attr('y1', yScale(sample.measured - sample.error))
            .attr('y2', yScale(sample.measured + sample.error))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          g.append('line')
            .attr('x1', xScale(sample.time) - 4)
            .attr('x2', xScale(sample.time) + 4)
            .attr('y1', yScale(sample.measured - sample.error))
            .attr('y2', yScale(sample.measured - sample.error))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);
          g.append('line')
            .attr('x1', xScale(sample.time) - 4)
            .attr('x2', xScale(sample.time) + 4)
            .attr('y1', yScale(sample.measured + sample.error))
            .attr('y2', yScale(sample.measured + sample.error))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          // Point
          g.append('circle')
            .attr('cx', xScale(sample.time))
            .attr('cy', yScale(sample.measured))
            .attr('r', 7)
            .attr('fill', color)
            .attr('stroke', isPerformanceMode ? '#333' : '#fff')
            .attr('stroke-width', 1.5);
        });

      } else {
        // Corrected panel - show horizontal true value lines and corrected points
        
        // True value lines for each sample type
        const trueValues = [...new Set(data.samples.map(s => s.true))].sort((a, b) => b - a);
        trueValues.forEach((tv, i) => {
          g.append('line')
            .attr('x1', 45)
            .attr('x2', panelWidth - 20)
            .attr('y1', yScale(tv))
            .attr('y2', yScale(tv))
            .attr('stroke', theme.sampleColors[data.samples.find(s => s.true === tv).sampleId])
            .attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '8,4')
            .attr('opacity', 0.6);
        });

        // Standard true value line
        g.append('line')
          .attr('x1', 45)
          .attr('x2', panelWidth - 20)
          .attr('y1', yScale(data.standards[0].true))
          .attr('y2', yScale(data.standards[0].true))
          .attr('stroke', theme.standardColor)
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '8,4')
          .attr('opacity', 0.6);

        // Draw corrected standards (should be at true value)
        data.standards.forEach(std => {
          const correctedValue = std.true; // Standards define the true value
          
          g.append('line')
            .attr('x1', xScale(std.time))
            .attr('x2', xScale(std.time))
            .attr('y1', yScale(correctedValue - std.error * 0.5))
            .attr('y2', yScale(correctedValue + std.error * 0.5))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          g.append('rect')
            .attr('x', xScale(std.time) - 6)
            .attr('y', yScale(correctedValue) - 6)
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', theme.standardColor)
            .attr('stroke', isPerformanceMode ? '#003366' : '#0088ff')
            .attr('stroke-width', 2);
        });

        // Draw corrected samples
        correction.correctedSamples.forEach(sample => {
          const color = theme.sampleColors[sample.sampleId];
          
          g.append('line')
            .attr('x1', xScale(sample.time))
            .attr('x2', xScale(sample.time))
            .attr('y1', yScale(sample.corrected - sample.error * 0.5))
            .attr('y2', yScale(sample.corrected + sample.error * 0.5))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          g.append('line')
            .attr('x1', xScale(sample.time) - 4)
            .attr('x2', xScale(sample.time) + 4)
            .attr('y1', yScale(sample.corrected - sample.error * 0.5))
            .attr('y2', yScale(sample.corrected - sample.error * 0.5))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);
          g.append('line')
            .attr('x1', xScale(sample.time) - 4)
            .attr('x2', xScale(sample.time) + 4)
            .attr('y1', yScale(sample.corrected + sample.error * 0.5))
            .attr('y2', yScale(sample.corrected + sample.error * 0.5))
            .attr('stroke', theme.errorBarColor)
            .attr('stroke-width', 1.5);

          g.append('circle')
            .attr('cx', xScale(sample.time))
            .attr('cy', yScale(sample.corrected))
            .attr('r', 7)
            .attr('fill', color)
            .attr('stroke', isPerformanceMode ? '#333' : '#fff')
            .attr('stroke-width', 1.5);
        });
      }
    };

    // Draw all four panels
    // Top-left: Short-term raw
    drawPanel(shortTermData, shortTermCorrection, margin.left, margin.top, 'Time (min)', true, false);
    
    // Top-right: Long-term raw  
    drawPanel(longTermData, longTermCorrection, margin.left + panelWidth + panelGap, margin.top, 'Time (days)', true, true);
    
    // Bottom-left: Short-term corrected
    drawPanel(shortTermData, shortTermCorrection, margin.left, margin.top + panelHeight + panelGap, 'Time (min)', false, false);
    
    // Bottom-right: Long-term corrected
    drawPanel(longTermData, longTermCorrection, margin.left + panelWidth + panelGap, margin.top + panelHeight + panelGap, 'Time (days)', false, true);

    // Legend
    const legendY = totalHeight - 35;
    const legendX = margin.left + 50;
    
    // Standard legend
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY - 6)
      .attr('width', 12)
      .attr('height', 12)
      .attr('fill', theme.standardColor)
      .attr('stroke', isPerformanceMode ? '#003366' : '#0088ff')
      .attr('stroke-width', 2);
    svg.append('text')
      .attr('x', legendX + 18)
      .attr('y', legendY + 4)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Standard (known value)');

    // Sample legends
    const sampleLabels = ['Sample A', 'Sample B', 'Sample C', 'Sample D'];
    theme.sampleColors.forEach((color, i) => {
      const lx = legendX + 180 + i * 120;
      svg.append('circle')
        .attr('cx', lx)
        .attr('cy', legendY)
        .attr('r', 6)
        .attr('fill', color)
        .attr('stroke', isPerformanceMode ? '#333' : '#fff')
        .attr('stroke-width', 1.5);
      svg.append('text')
        .attr('x', lx + 12)
        .attr('y', legendY + 4)
        .attr('fill', theme.textColor)
        .attr('font-size', '13px')
        .text(sampleLabels[i]);
    });

    // Drift line legend
    svg.append('line')
      .attr('x1', legendX + 680)
      .attr('x2', legendX + 710)
      .attr('y1', legendY)
      .attr('y2', legendY)
      .attr('stroke', theme.driftLineColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4');
    svg.append('text')
      .attr('x', legendX + 718)
      .attr('y', legendY + 4)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Drift trend');

    // True value legend
    svg.append('line')
      .attr('x1', legendX + 820)
      .attr('x2', legendX + 850)
      .attr('y1', legendY)
      .attr('y2', legendY)
      .attr('stroke', theme.sampleColors[0])
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '8,4')
      .attr('opacity', 0.6);
    svg.append('text')
      .attr('x', legendX + 858)
      .attr('y', legendY + 4)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('True value');
  }

  // Initialize on DOM ready and slide change
  function init() {
    initSSSDemo();
    
    // Re-init on slide change (for Reveal.js)
    if (typeof Reveal !== 'undefined') {
      Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#sss-demo-chart')) {
          setTimeout(initSSSDemo, 100);
        }
      });
    }
    
    // Re-init on performance mode toggle
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const container = document.getElementById('sss-demo-chart');
          if (container && container.offsetParent !== null) {
            initSSSDemo();
          }
        }
      });
    });
    observer.observe(document.body, { attributes: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
