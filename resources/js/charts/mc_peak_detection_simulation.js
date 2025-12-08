/* ----------------------------------------------------*/
/* MONTE CARLO PEAK DETECTION SIMULATION               */
/* Interactive: vary S/N, width, baseline to see       */
/* how detection rate changes                          */
/* ----------------------------------------------------*/
(function () {
  function initMCPeakDetection() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initMCPeakDetection, 100);
      return;
    }

    const containerId = 'mc-peak-detection-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Theme-aware colors
    const theme = {
      bgColor: isPerformanceMode ? '#f8f9fa' : '#1a1a2e',
      panelBg: isPerformanceMode ? '#ffffff' : '#252540',
      panelBorder: isPerformanceMode ? '#dee2e6' : '#444466',
      titleColor: isPerformanceMode ? '#1a1a1a' : '#ffffff',
      textColor: isPerformanceMode ? '#333333' : '#cccccc',
      labelColor: isPerformanceMode ? '#2c3e50' : '#ffffff',
      
      peakColor: isPerformanceMode ? '#27ae60' : '#44dd88',
      noiseColor: isPerformanceMode ? '#95a5a6' : '#666688',
      thresholdColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      baselineColor: isPerformanceMode ? '#f39c12' : '#f9ca24',
      
      detectedColor: isPerformanceMode ? '#27ae60' : '#44dd88',
      missedColor: isPerformanceMode ? '#c0392b' : '#ff4757',
      
      buttonBg: isPerformanceMode ? '#3498db' : '#4a9eff',
      buttonHover: isPerformanceMode ? '#2980b9' : '#3388dd',
      sliderTrack: isPerformanceMode ? '#bdc3c7' : '#444466',
      sliderThumb: isPerformanceMode ? '#3498db' : '#4a9eff',
      
      curveColors: [
        isPerformanceMode ? '#2980b9' : '#4ecdc4',
        isPerformanceMode ? '#27ae60' : '#44dd88',
        isPerformanceMode ? '#e67e22' : '#fd9644',
        isPerformanceMode ? '#8e44ad' : '#a55eea'
      ]
    };

    // Simulation parameters
    let params = {
      targetSN: 5,
      signalHeight: 100,
      noiseSD: 20,        // Calculated from S/N
      peakWidth: 0.4,
      baselineDrift: 0,
      numSimulations: 500
    };

    // Results storage for curve
    let snCurveData = [];

    // Layout
    const totalWidth = 1300;
    const totalHeight = 580;

    // Create main container
    const mainDiv = d3.select(container)
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('gap', '8px');

    // Title
    mainDiv.append('div')
      .style('color', theme.titleColor)
      .style('font-size', '22px')
      .style('font-weight', 'bold')
      .text('Peak Detection: Finding the Critical S/N');

    // Main content row
    const contentRow = mainDiv.append('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('align-items', 'flex-start');

    // ===== LEFT: Controls Panel =====
    const controlsPanel = contentRow.append('div')
      .style('background', theme.panelBg)
      .style('border', `2px solid ${theme.panelBorder}`)
      .style('border-radius', '10px')
      .style('padding', '15px')
      .style('width', '280px');

    controlsPanel.append('div')
      .style('color', theme.titleColor)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('margin-bottom', '15px')
      .style('text-align', 'center')
      .text('🎛️ Simulation Parameters');

    // S/N Slider
    createSlider(controlsPanel, 'Target S/N', 'targetSN', 1, 15, 0.5, params.targetSN, val => {
      params.targetSN = val;
      params.noiseSD = params.signalHeight / val;
      updateNoiseDisplay();
    });

    // Noise display
    const noiseDisplay = controlsPanel.append('div')
      .attr('class', 'noise-display')
      .style('color', theme.textColor)
      .style('font-size', '12px')
      .style('margin-bottom', '15px')
      .style('padding', '8px')
      .style('background', isPerformanceMode ? '#ecf0f1' : '#1a2a4a')
      .style('border-radius', '5px')
      .style('text-align', 'center');

    function updateNoiseDisplay() {
      noiseDisplay.html(`Signal: ${params.signalHeight} AU | Noise σ: ${params.noiseSD.toFixed(1)} AU`);
    }
    updateNoiseDisplay();

    // Peak Width Slider
    createSlider(controlsPanel, 'Peak Width (min)', 'peakWidth', 0.1, 1.0, 0.05, params.peakWidth, val => {
      params.peakWidth = val;
    });

    // Baseline Drift Slider
    createSlider(controlsPanel, 'Baseline Drift', 'baselineDrift', 0, 30, 1, params.baselineDrift, val => {
      params.baselineDrift = val;
    });

    // Number of simulations
    createSlider(controlsPanel, 'Simulations (N)', 'numSim', 100, 2000, 100, params.numSimulations, val => {
      params.numSimulations = val;
    });

    // Run button
    const runButton = controlsPanel.append('button')
      .style('width', '100%')
      .style('padding', '12px')
      .style('margin-top', '15px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', theme.buttonBg)
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .text('▶ Run MC Simulation')
      .on('click', runSimulation)
      .on('mouseover', function() { d3.select(this).style('background', theme.buttonHover); })
      .on('mouseout', function() { d3.select(this).style('background', theme.buttonBg); });

    // Scan S/N button
    const scanButton = controlsPanel.append('button')
      .style('width', '100%')
      .style('padding', '12px')
      .style('margin-top', '10px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', isPerformanceMode ? '#27ae60' : '#44dd88')
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .text('📈 Scan S/N Range')
      .on('click', scanSNRange);

    // ===== MIDDLE: Example Peaks Panel =====
    const peaksPanel = contentRow.append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('gap', '10px');

    // Peak SVG
    const peakSvg = peaksPanel.append('svg')
      .attr('width', 450)
      .attr('height', 220);

    peakSvg.append('rect')
      .attr('width', 450)
      .attr('height', 220)
      .attr('fill', theme.panelBg)
      .attr('stroke', theme.panelBorder)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    peakSvg.append('text')
      .attr('x', 225)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Example Simulated Peaks');

    // Peak plot area
    const peakPlotG = peakSvg.append('g')
      .attr('transform', 'translate(50, 40)');

    const peakXScale = d3.scaleLinear().domain([0, 3]).range([0, 380]);
    const peakYScale = d3.scaleLinear().domain([0, 150]).range([150, 0]);

    peakPlotG.append('g')
      .attr('transform', 'translate(0, 150)')
      .call(d3.axisBottom(peakXScale).ticks(6))
      .attr('color', theme.textColor);

    peakPlotG.append('g')
      .call(d3.axisLeft(peakYScale).ticks(5))
      .attr('color', theme.textColor);

    // Threshold line
    const threshLine = peakPlotG.append('line')
      .attr('class', 'threshold-line')
      .attr('x1', 0)
      .attr('x2', 380)
      .attr('stroke', theme.thresholdColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Peak paths (will show multiple examples)
    const peakPathsG = peakPlotG.append('g').attr('class', 'peak-paths');

    // Results panel below peaks
    const resultsBox = peaksPanel.append('div')
      .style('background', theme.panelBg)
      .style('border', `2px solid ${theme.panelBorder}`)
      .style('border-radius', '10px')
      .style('padding', '15px')
      .style('width', '450px')
      .style('text-align', 'center');

    resultsBox.append('div')
      .style('color', theme.titleColor)
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('margin-bottom', '10px')
      .text('📊 Simulation Results');

    const resultStats = resultsBox.append('div')
      .style('display', 'grid')
      .style('grid-template-columns', '1fr 1fr')
      .style('gap', '10px');

    const detectionRateBox = resultStats.append('div')
      .style('background', isPerformanceMode ? '#e8f8f5' : '#1a4a3c')
      .style('padding', '12px')
      .style('border-radius', '8px');

    detectionRateBox.append('div')
      .style('color', theme.textColor)
      .style('font-size', '12px')
      .text('Detection Rate');

    const detectionRateValue = detectionRateBox.append('div')
      .attr('class', 'detection-rate')
      .style('color', theme.detectedColor)
      .style('font-size', '28px')
      .style('font-weight', 'bold')
      .text('—');

    const snInfoBox = resultStats.append('div')
      .style('background', isPerformanceMode ? '#ebf5fb' : '#1a3a5c')
      .style('padding', '12px')
      .style('border-radius', '8px');

    snInfoBox.append('div')
      .style('color', theme.textColor)
      .style('font-size', '12px')
      .text('Target S/N');

    const snInfoValue = snInfoBox.append('div')
      .attr('class', 'sn-info')
      .style('color', theme.curveColors[0])
      .style('font-size', '28px')
      .style('font-weight', 'bold')
      .text('—');

    // Insight text
    const insightText = resultsBox.append('div')
      .attr('class', 'insight')
      .style('margin-top', '10px')
      .style('padding', '10px')
      .style('background', isPerformanceMode ? '#fef9e7' : '#3a3a2e')
      .style('border-radius', '5px')
      .style('color', theme.textColor)
      .style('font-size', '13px')
      .text('Run simulation to see detection probability');

    // ===== RIGHT: S/N Curve Panel =====
    const curvePanel = contentRow.append('div');

    const curveSvg = curvePanel.append('svg')
      .attr('width', 480)
      .attr('height', 500);

    curveSvg.append('rect')
      .attr('width', 480)
      .attr('height', 500)
      .attr('fill', theme.panelBg)
      .attr('stroke', theme.panelBorder)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    curveSvg.append('text')
      .attr('x', 240)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Detection Rate vs. S/N');

    // Curve plot
    const curveMargin = { top: 50, right: 30, bottom: 60, left: 60 };
    const curveWidth = 480 - curveMargin.left - curveMargin.right;
    const curveHeight = 500 - curveMargin.top - curveMargin.bottom;

    const curvePlotG = curveSvg.append('g')
      .attr('transform', `translate(${curveMargin.left}, ${curveMargin.top})`);

    const curveXScale = d3.scaleLinear().domain([0, 15]).range([0, curveWidth]);
    const curveYScale = d3.scaleLinear().domain([0, 100]).range([curveHeight, 0]);

    // Grid lines
    curvePlotG.append('g')
      .attr('class', 'grid-y')
      .selectAll('line')
      .data([25, 50, 75, 95])
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', curveWidth)
      .attr('y1', d => curveYScale(d))
      .attr('y2', d => curveYScale(d))
      .attr('stroke', theme.panelBorder)
      .attr('stroke-dasharray', d => d === 95 ? '4,4' : '2,2')
      .attr('stroke-width', d => d === 95 ? 2 : 1);

    // 95% label
    curvePlotG.append('text')
      .attr('x', curveWidth - 5)
      .attr('y', curveYScale(95) - 5)
      .attr('text-anchor', 'end')
      .attr('fill', theme.detectedColor)
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('95% threshold');

    // Axes
    curvePlotG.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${curveHeight})`)
      .call(d3.axisBottom(curveXScale).ticks(8))
      .attr('color', theme.textColor);

    curvePlotG.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(curveYScale).ticks(5).tickFormat(d => d + '%'))
      .attr('color', theme.textColor);

    // Axis labels
    curvePlotG.append('text')
      .attr('x', curveWidth / 2)
      .attr('y', curveHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Signal-to-Noise Ratio');

    curvePlotG.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -curveHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Detection Rate (%)');

    // Curve path
    const curvePath = curvePlotG.append('path')
      .attr('class', 'sn-curve')
      .attr('fill', 'none')
      .attr('stroke', theme.curveColors[0])
      .attr('stroke-width', 3);

    // Data points
    const curveDotsG = curvePlotG.append('g').attr('class', 'curve-dots');

    // Current point marker
    const currentMarker = curvePlotG.append('g').attr('class', 'current-marker').style('display', 'none');
    
    currentMarker.append('circle')
      .attr('r', 8)
      .attr('fill', theme.thresholdColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    currentMarker.append('line')
      .attr('class', 'marker-line-v')
      .attr('stroke', theme.thresholdColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    currentMarker.append('line')
      .attr('class', 'marker-line-h')
      .attr('stroke', theme.thresholdColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Critical S/N display
    const criticalSNText = curvePlotG.append('text')
      .attr('class', 'critical-sn')
      .attr('x', curveWidth / 2)
      .attr('y', curveHeight + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.detectedColor)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('');

    // ===== HELPER FUNCTIONS =====
    function createSlider(parent, label, id, min, max, step, initial, onChange) {
      const sliderDiv = parent.append('div')
        .style('margin-bottom', '12px');

      const labelRow = sliderDiv.append('div')
        .style('display', 'flex')
        .style('justify-content', 'space-between')
        .style('margin-bottom', '5px');

      labelRow.append('span')
        .style('color', theme.textColor)
        .style('font-size', '13px')
        .text(label);

      const valueSpan = labelRow.append('span')
        .style('color', theme.labelColor)
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .text(initial);

      sliderDiv.append('input')
        .attr('type', 'range')
        .attr('min', min)
        .attr('max', max)
        .attr('step', step)
        .attr('value', initial)
        .style('width', '100%')
        .style('cursor', 'pointer')
        .on('input', function() {
          const val = parseFloat(this.value);
          valueSpan.text(val);
          onChange(val);
        });
    }

    function gaussianRandom(mean, sd) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return mean + sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    function generatePeak(signalHeight, noiseSD, peakWidth, baselineDrift) {
      const points = [];
      const peakCenter = 1.5;
      const numPoints = 100;
      
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 3;
        // Gaussian peak
        const signal = signalHeight * Math.exp(-0.5 * Math.pow((t - peakCenter) / peakWidth, 2));
        // Baseline drift (linear)
        const baseline = baselineDrift * (t / 3);
        // Add noise
        const noise = gaussianRandom(0, noiseSD);
        points.push({ t, signal: Math.max(0, signal + baseline + noise), trueSignal: signal });
      }
      
      return points;
    }

    // F-distribution critical value approximation (for α = 0.05)
    // Using Wilson-Hilferty approximation for F critical values
    function getFCritical(df1, df2, alpha = 0.05) {
      // Approximate F critical values for common cases
      // For peak detection: df1 = 2 (peak params), df2 = n - 3 (residual)
      // These are pre-computed for α = 0.05
      if (df2 >= 100) return 3.0;
      if (df2 >= 60) return 3.15;
      if (df2 >= 30) return 3.32;
      if (df2 >= 20) return 3.49;
      if (df2 >= 10) return 4.10;
      return 4.74; // df2 = 5
    }

    // Global F-test for peak detection
    // Compares: Model with peak (Gaussian) vs. Null model (baseline only)
    function detectPeakFTest(points, alpha = 0.05) {
      const n = points.length;
      const y = points.map(d => d.signal);
      const t = points.map(d => d.t);
      
      // === NULL MODEL: Linear baseline only ===
      // y = a + b*t
      const meanT = d3.mean(t);
      const meanY = d3.mean(y);
      
      let ssT = 0, ssTY = 0;
      for (let i = 0; i < n; i++) {
        ssT += (t[i] - meanT) ** 2;
        ssTY += (t[i] - meanT) * (y[i] - meanY);
      }
      
      const b_null = ssTY / ssT;
      const a_null = meanY - b_null * meanT;
      
      // Residual sum of squares for null model
      let RSS_null = 0;
      for (let i = 0; i < n; i++) {
        const predicted = a_null + b_null * t[i];
        RSS_null += (y[i] - predicted) ** 2;
      }
      
      // === FULL MODEL: Linear baseline + Gaussian peak ===
      // y = a + b*t + h * exp(-0.5 * ((t - μ) / σ)²)
      // Simplified approach: fit Gaussian to residuals from baseline
      
      // Find peak region (where residuals are highest)
      const residuals = y.map((yi, i) => yi - (a_null + b_null * t[i]));
      const maxResIdx = residuals.indexOf(Math.max(...residuals));
      const peakCenter = t[maxResIdx];
      
      // Estimate peak parameters using moment method
      // Peak height estimate
      const h_est = Math.max(...residuals);
      
      // Peak width estimate (from half-max points)
      const halfMax = h_est / 2;
      let leftIdx = maxResIdx, rightIdx = maxResIdx;
      while (leftIdx > 0 && residuals[leftIdx] > halfMax) leftIdx--;
      while (rightIdx < n - 1 && residuals[rightIdx] > halfMax) rightIdx++;
      const fwhm = t[rightIdx] - t[leftIdx];
      const sigma_est = fwhm / 2.35; // FWHM to sigma conversion
      
      // Calculate RSS for full model
      let RSS_full = 0;
      for (let i = 0; i < n; i++) {
        const gaussianPart = h_est * Math.exp(-0.5 * ((t[i] - peakCenter) / Math.max(sigma_est, 0.1)) ** 2);
        const predicted = a_null + b_null * t[i] + gaussianPart;
        RSS_full += (y[i] - predicted) ** 2;
      }
      
      // === F-TEST ===
      // df_null = n - 2 (baseline: intercept + slope)
      // df_full = n - 5 (baseline + peak: intercept, slope, height, center, width)
      // But we fix center at max, so effectively n - 4
      const df_null = n - 2;
      const df_full = n - 4;
      const df_diff = df_null - df_full; // = 2 (extra parameters)
      
      // F statistic
      const F_stat = ((RSS_null - RSS_full) / df_diff) / (RSS_full / df_full);
      
      // Critical F value
      const F_crit = getFCritical(df_diff, df_full, alpha);
      
      // Return detection result and F statistic
      return {
        detected: F_stat > F_crit,
        F_stat: F_stat,
        F_crit: F_crit,
        pValue: F_stat > F_crit ? '< 0.05' : '≥ 0.05'
      };
    }

    function runSimulation() {
      params.noiseSD = params.signalHeight / params.targetSN;
      
      let detected = 0;
      const examplePeaks = [];
      const exampleResults = [];
      
      for (let i = 0; i < params.numSimulations; i++) {
        const peak = generatePeak(
          params.signalHeight,
          params.noiseSD,
          params.peakWidth,
          params.baselineDrift
        );
        
        const result = detectPeakFTest(peak);
        if (result.detected) {
          detected++;
        }
        
        // Store first 5 peaks for display
        if (i < 5) {
          examplePeaks.push(peak);
          exampleResults.push(result);
        }
      }
      
      const rate = (detected / params.numSimulations * 100);
      
      // Update displays
      updatePeakDisplay(examplePeaks, exampleResults);
      updateResults(rate, params.targetSN);
      updateCurrentMarker(params.targetSN, rate);
      
      // Add to curve data
      const existing = snCurveData.findIndex(d => Math.abs(d.sn - params.targetSN) < 0.1);
      if (existing >= 0) {
        snCurveData[existing] = { sn: params.targetSN, rate: rate };
      } else {
        snCurveData.push({ sn: params.targetSN, rate: rate });
        snCurveData.sort((a, b) => a.sn - b.sn);
      }
      updateCurve();
    }

    async function scanSNRange() {
      snCurveData = [];
      const snValues = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 10, 12, 15];
      
      for (const sn of snValues) {
        params.noiseSD = params.signalHeight / sn;
        
        let detected = 0;
        for (let i = 0; i < 200; i++) {
          const peak = generatePeak(
            params.signalHeight,
            params.noiseSD,
            params.peakWidth,
            params.baselineDrift
          );
          const result = detectPeakFTest(peak);
          if (result.detected) {
            detected++;
          }
        }
        
        const rate = (detected / 200 * 100);
        snCurveData.push({ sn: sn, rate: rate });
        
        updateCurve();
        await new Promise(r => setTimeout(r, 50));
      }
      
      // Find critical S/N (95% detection)
      findCriticalSN();
    }

    function updatePeakDisplay(peaks, results) {
      peakPathsG.selectAll('path').remove();
      peakPathsG.selectAll('text').remove();
      
      // Remove threshold line (not relevant for F-test)
      threshLine.attr('opacity', 0);
      
      const line = d3.line()
        .x(d => peakXScale(d.t))
        .y(d => peakYScale(d.signal))
        .curve(d3.curveLinear);
      
      peaks.forEach((peak, i) => {
        const result = results[i];
        peakPathsG.append('path')
          .attr('d', line(peak))
          .attr('fill', 'none')
          .attr('stroke', result.detected ? theme.detectedColor : theme.missedColor)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.7);
      });
      
      // Show F-value for first peak
      if (results.length > 0) {
        const r = results[0];
        peakPathsG.append('text')
          .attr('x', 380)
          .attr('y', 15)
          .attr('text-anchor', 'end')
          .attr('fill', theme.textColor)
          .attr('font-size', '11px')
          .text(`F = ${r.F_stat.toFixed(1)} (crit: ${r.F_crit.toFixed(1)})`);
      }
    }

    function updateResults(rate, sn) {
      detectionRateValue.text(rate.toFixed(1) + '%')
        .style('color', rate >= 95 ? theme.detectedColor : (rate >= 80 ? theme.baselineColor : theme.missedColor));
      
      snInfoValue.text(sn.toFixed(1));
      
      let insight = '';
      if (rate >= 95) {
        insight = `✅ Excellent! At S/N = ${sn.toFixed(1)}, peaks are reliably detected (${rate.toFixed(1)}%)`;
      } else if (rate >= 80) {
        insight = `⚠️ Marginal: ${rate.toFixed(1)}% detection. Consider increasing S/N above ${sn.toFixed(1)}`;
      } else {
        insight = `❌ Poor detection (${rate.toFixed(1)}%). S/N = ${sn.toFixed(1)} is too low!`;
      }
      insightText.text(insight);
    }

    function updateCurrentMarker(sn, rate) {
      currentMarker.style('display', 'block');
      
      currentMarker.select('circle')
        .attr('cx', curveXScale(sn))
        .attr('cy', curveYScale(rate));
      
      currentMarker.select('.marker-line-v')
        .attr('x1', curveXScale(sn))
        .attr('x2', curveXScale(sn))
        .attr('y1', curveYScale(rate))
        .attr('y2', curveHeight);
      
      currentMarker.select('.marker-line-h')
        .attr('x1', 0)
        .attr('x2', curveXScale(sn))
        .attr('y1', curveYScale(rate))
        .attr('y2', curveYScale(rate));
    }

    function updateCurve() {
      if (snCurveData.length < 2) return;
      
      const line = d3.line()
        .x(d => curveXScale(d.sn))
        .y(d => curveYScale(d.rate))
        .curve(d3.curveMonotoneX);
      
      curvePath.attr('d', line(snCurveData));
      
      // Update dots
      const dots = curveDotsG.selectAll('circle').data(snCurveData);
      
      dots.enter()
        .append('circle')
        .merge(dots)
        .attr('cx', d => curveXScale(d.sn))
        .attr('cy', d => curveYScale(d.rate))
        .attr('r', 5)
        .attr('fill', d => d.rate >= 95 ? theme.detectedColor : (d.rate >= 80 ? theme.baselineColor : theme.missedColor))
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
      
      dots.exit().remove();
    }

    function findCriticalSN() {
      // Interpolate to find S/N at 95%
      for (let i = 0; i < snCurveData.length - 1; i++) {
        const d1 = snCurveData[i];
        const d2 = snCurveData[i + 1];
        
        if (d1.rate < 95 && d2.rate >= 95) {
          // Linear interpolation
          const criticalSN = d1.sn + (95 - d1.rate) * (d2.sn - d1.sn) / (d2.rate - d1.rate);
          criticalSNText.text(`Critical S/N for 95% detection: ${criticalSN.toFixed(1)}`);
          return;
        }
      }
      
      if (snCurveData.length > 0 && snCurveData[0].rate >= 95) {
        criticalSNText.text('95% detection achieved at all tested S/N values');
      } else {
        criticalSNText.text('95% detection not achieved in tested range');
      }
    }
  }

  // Initialize
  function init() {
    initMCPeakDetection();
    
    if (typeof Reveal !== 'undefined') {
      Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#mc-peak-detection-chart')) {
          setTimeout(initMCPeakDetection, 100);
        }
      });
    }

    // Re-init on performance mode toggle
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const container = document.getElementById('mc-peak-detection-chart');
          if (container && container.offsetParent !== null) {
            initMCPeakDetection();
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
