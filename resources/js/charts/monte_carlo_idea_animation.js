/* ----------------------------------------------------*/
/* MONTE CARLO IDEA ANIMATION                          */
/* Shows: Distributions → Generate Data → Analyze      */
/* Peak detection example with controlled noise        */
/* ----------------------------------------------------*/
(function () {
  function initMonteCarloIdea() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initMonteCarloIdea, 100);
      return;
    }

    const containerId = 'monte-carlo-idea-chart';
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
      
      // Distribution boxes
      distBoxBg: isPerformanceMode ? '#e8f4fd' : '#1a3a5c',
      distBoxBorder: isPerformanceMode ? '#3498db' : '#4a9eff',
      
      // Peak colors
      peakColor: isPerformanceMode ? '#2ecc71' : '#44dd88',
      noiseColor: isPerformanceMode ? '#95a5a6' : '#666688',
      signalColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      baselineColor: isPerformanceMode ? '#f39c12' : '#f9ca24',
      
      // Result colors
      detectedColor: isPerformanceMode ? '#27ae60' : '#44dd88',
      missedColor: isPerformanceMode ? '#c0392b' : '#ff4757',
      
      // UI
      buttonBg: isPerformanceMode ? '#9b59b6' : '#a55eea',
      buttonHover: isPerformanceMode ? '#8e44ad' : '#8854d0',
      arrowColor: isPerformanceMode ? '#7f8c8d' : '#888888',
      
      // Distribution curves
      distCurveSignal: isPerformanceMode ? '#2980b9' : '#4ecdc4',
      distCurveNoise: isPerformanceMode ? '#e67e22' : '#fd9644',
      distCurveWidth: isPerformanceMode ? '#16a085' : '#26de81'
    };

    // Parameters with distributions
    let params = {
      signalHeight: { mean: 100, sd: 10, name: 'Signal Height', unit: 'AU', color: theme.distCurveSignal },
      noiseLevel: { mean: 20, sd: 5, name: 'Noise σ', unit: 'AU', color: theme.distCurveNoise },
      peakWidth: { mean: 0.5, sd: 0.05, name: 'Peak Width', unit: 'min', color: theme.distCurveWidth }
    };

    // State
    let simulationResults = [];
    let isAnimating = false;
    let animationSpeed = 400;
    let currentIteration = 0;

    // Layout
    const totalWidth = 1350;
    const totalHeight = 620;
    
    // Panel positions
    const distPanelX = 40;
    const distPanelY = 80;
    const distPanelWidth = 280;
    const distPanelHeight = 450;
    
    const peakPanelX = 380;
    const peakPanelY = 80;
    const peakPanelWidth = 500;
    const peakPanelHeight = 300;
    
    const resultPanelX = 380;
    const resultPanelY = 410;
    const resultPanelWidth = 500;
    const resultPanelHeight = 120;
    
    const statsPanelX = 940;
    const statsPanelY = 80;
    const statsPanelWidth = 370;
    const statsPanelHeight = 450;

    // Create main container
    const mainDiv = d3.select(container)
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('gap', '10px');

    // Title
    mainDiv.append('div')
      .style('color', theme.titleColor)
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('margin-bottom', '5px')
      .text('Monte Carlo: Simulate to Understand Uncertainty');

    // SVG
    const svg = mainDiv.append('svg')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${totalWidth} ${totalHeight}`);

    // Background
    svg.append('rect')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('fill', theme.bgColor)
      .attr('rx', 12);

    // ===== DISTRIBUTION PANEL (LEFT) =====
    const distPanel = svg.append('g').attr('class', 'distribution-panel');
    
    distPanel.append('text')
      .attr('x', distPanelX + distPanelWidth / 2)
      .attr('y', distPanelY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('📊 Parameter Distributions');

    distPanel.append('rect')
      .attr('x', distPanelX)
      .attr('y', distPanelY)
      .attr('width', distPanelWidth)
      .attr('height', distPanelHeight)
      .attr('fill', theme.distBoxBg)
      .attr('stroke', theme.distBoxBorder)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    // Draw distribution boxes
    const distBoxHeight = 130;
    const distBoxGap = 15;
    const paramKeys = Object.keys(params);
    
    paramKeys.forEach((key, i) => {
      const p = params[key];
      const boxY = distPanelY + 20 + i * (distBoxHeight + distBoxGap);
      const boxX = distPanelX + 15;
      const boxW = distPanelWidth - 30;
      
      const g = distPanel.append('g').attr('class', `dist-box-${key}`);
      
      // Box background
      g.append('rect')
        .attr('x', boxX)
        .attr('y', boxY)
        .attr('width', boxW)
        .attr('height', distBoxHeight)
        .attr('fill', isPerformanceMode ? '#fff' : '#1a2a4a')
        .attr('stroke', p.color)
        .attr('stroke-width', 2)
        .attr('rx', 6);

      // Parameter name
      g.append('text')
        .attr('x', boxX + 10)
        .attr('y', boxY + 22)
        .attr('fill', theme.labelColor)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(p.name);

      // Distribution info
      g.append('text')
        .attr('x', boxX + 10)
        .attr('y', boxY + 42)
        .attr('fill', theme.textColor)
        .attr('font-size', '12px')
        .text(`μ = ${p.mean} ${p.unit}, σ = ${p.sd}`);

      // Mini normal distribution curve
      const curveData = [];
      const curveWidth = boxW - 20;
      const curveHeight = 60;
      const curveY = boxY + 55;
      
      for (let x = 0; x <= curveWidth; x += 2) {
        const xVal = p.mean - 3 * p.sd + (x / curveWidth) * 6 * p.sd;
        const yVal = Math.exp(-0.5 * Math.pow((xVal - p.mean) / p.sd, 2));
        curveData.push({ x: boxX + 10 + x, y: curveY + curveHeight - yVal * curveHeight * 0.9 });
      }

      const line = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasis);
      
      g.append('path')
        .attr('d', line(curveData))
        .attr('fill', 'none')
        .attr('stroke', p.color)
        .attr('stroke-width', 2.5);

      // Current sampled value indicator (hidden initially)
      g.append('circle')
        .attr('class', `sample-indicator-${key}`)
        .attr('cx', boxX + boxW / 2)
        .attr('cy', curveY + curveHeight - 5)
        .attr('r', 6)
        .attr('fill', theme.signalColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('opacity', 0);

      // Sampled value text
      g.append('text')
        .attr('class', `sample-value-${key}`)
        .attr('x', boxX + boxW - 10)
        .attr('y', boxY + 22)
        .attr('text-anchor', 'end')
        .attr('fill', theme.signalColor)
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('opacity', 0)
        .text('');
    });

    // ===== ARROW 1: Distributions → Peak =====
    const arrow1StartX = distPanelX + distPanelWidth + 10;
    const arrow1EndX = peakPanelX - 10;
    const arrow1Y = peakPanelY + peakPanelHeight / 2;

    svg.append('defs').append('marker')
      .attr('id', 'arrowhead-mc')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', theme.arrowColor);

    svg.append('path')
      .attr('d', `M${arrow1StartX},${arrow1Y} L${arrow1EndX},${arrow1Y}`)
      .attr('stroke', theme.arrowColor)
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead-mc)');

    svg.append('text')
      .attr('x', (arrow1StartX + arrow1EndX) / 2)
      .attr('y', arrow1Y - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .attr('font-style', 'italic')
      .text('sample &');
    
    svg.append('text')
      .attr('x', (arrow1StartX + arrow1EndX) / 2)
      .attr('y', arrow1Y + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .attr('font-style', 'italic')
      .text('generate');

    // ===== PEAK PANEL (CENTER) =====
    const peakPanel = svg.append('g').attr('class', 'peak-panel');
    
    peakPanel.append('text')
      .attr('x', peakPanelX + peakPanelWidth / 2)
      .attr('y', peakPanelY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('📈 Simulated Chromatogram');

    peakPanel.append('rect')
      .attr('x', peakPanelX)
      .attr('y', peakPanelY)
      .attr('width', peakPanelWidth)
      .attr('height', peakPanelHeight)
      .attr('fill', theme.panelBg)
      .attr('stroke', theme.panelBorder)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    // Peak plot area
    const plotMargin = { top: 30, right: 20, bottom: 40, left: 50 };
    const plotWidth = peakPanelWidth - plotMargin.left - plotMargin.right;
    const plotHeight = peakPanelHeight - plotMargin.top - plotMargin.bottom;
    
    const plotG = peakPanel.append('g')
      .attr('transform', `translate(${peakPanelX + plotMargin.left}, ${peakPanelY + plotMargin.top})`);

    // Scales
    const xScale = d3.scaleLinear().domain([0, 3]).range([0, plotWidth]);
    const yScale = d3.scaleLinear().domain([0, 150]).range([plotHeight, 0]);

    // Axes
    plotG.append('g')
      .attr('transform', `translate(0, ${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .attr('color', theme.textColor);

    plotG.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .attr('color', theme.textColor);

    // Axis labels
    plotG.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', plotHeight + 35)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .text('Time (min)');

    plotG.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -plotHeight / 2)
      .attr('y', -35)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .text('Signal (AU)');

    // Path for chromatogram
    const chromPath = plotG.append('path')
      .attr('class', 'chromatogram-line')
      .attr('fill', 'none')
      .attr('stroke', theme.peakColor)
      .attr('stroke-width', 2);

    // Detection threshold line
    const thresholdLine = plotG.append('line')
      .attr('class', 'threshold-line')
      .attr('x1', 0)
      .attr('x2', plotWidth)
      .attr('y1', yScale(30))
      .attr('y2', yScale(30))
      .attr('stroke', theme.missedColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5,5')
      .attr('opacity', 0.7);

    plotG.append('text')
      .attr('x', plotWidth - 5)
      .attr('y', yScale(30) - 5)
      .attr('text-anchor', 'end')
      .attr('fill', theme.missedColor)
      .attr('font-size', '10px')
      .text('Detection threshold (3σ)');

    // ===== RESULT PANEL =====
    const resultPanel = svg.append('g').attr('class', 'result-panel');
    
    resultPanel.append('rect')
      .attr('x', resultPanelX)
      .attr('y', resultPanelY)
      .attr('width', resultPanelWidth)
      .attr('height', resultPanelHeight)
      .attr('fill', theme.panelBg)
      .attr('stroke', theme.panelBorder)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    // Result icon and text
    const resultIcon = resultPanel.append('text')
      .attr('class', 'result-icon')
      .attr('x', resultPanelX + 60)
      .attr('y', resultPanelY + 70)
      .attr('text-anchor', 'middle')
      .attr('font-size', '50px')
      .text('❓');

    const resultText = resultPanel.append('text')
      .attr('class', 'result-text')
      .attr('x', resultPanelX + 130)
      .attr('y', resultPanelY + 55)
      .attr('fill', theme.textColor)
      .attr('font-size', '16px')
      .text('Detection Result:');

    const resultValue = resultPanel.append('text')
      .attr('class', 'result-value')
      .attr('x', resultPanelX + 130)
      .attr('y', resultPanelY + 85)
      .attr('fill', theme.labelColor)
      .attr('font-size', '22px')
      .attr('font-weight', 'bold')
      .text('— waiting —');

    // S/N display
    const snText = resultPanel.append('text')
      .attr('class', 'sn-text')
      .attr('x', resultPanelX + 350)
      .attr('y', resultPanelY + 55)
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('Signal/Noise:');

    const snValue = resultPanel.append('text')
      .attr('class', 'sn-value')
      .attr('x', resultPanelX + 350)
      .attr('y', resultPanelY + 85)
      .attr('fill', theme.distCurveSignal)
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text('—');

    // ===== ARROW 2: Peak → Stats =====
    const arrow2StartX = peakPanelX + peakPanelWidth + 10;
    const arrow2EndX = statsPanelX - 10;
    const arrow2Y = peakPanelY + peakPanelHeight / 2;

    svg.append('path')
      .attr('d', `M${arrow2StartX},${arrow2Y} L${arrow2EndX},${arrow2Y}`)
      .attr('stroke', theme.arrowColor)
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead-mc)');

    svg.append('text')
      .attr('x', (arrow2StartX + arrow2EndX) / 2)
      .attr('y', arrow2Y - 12)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .attr('font-style', 'italic')
      .text('analyze &');
    
    svg.append('text')
      .attr('x', (arrow2StartX + arrow2EndX) / 2)
      .attr('y', arrow2Y + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .attr('font-style', 'italic')
      .text('collect');

    // ===== STATISTICS PANEL (RIGHT) =====
    const statsPanel = svg.append('g').attr('class', 'stats-panel');
    
    statsPanel.append('text')
      .attr('x', statsPanelX + statsPanelWidth / 2)
      .attr('y', statsPanelY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('📊 Monte Carlo Results');

    statsPanel.append('rect')
      .attr('x', statsPanelX)
      .attr('y', statsPanelY)
      .attr('width', statsPanelWidth)
      .attr('height', statsPanelHeight)
      .attr('fill', theme.panelBg)
      .attr('stroke', theme.panelBorder)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    // Iteration counter
    const iterText = statsPanel.append('text')
      .attr('x', statsPanelX + 20)
      .attr('y', statsPanelY + 35)
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('Iterations:');

    const iterValue = statsPanel.append('text')
      .attr('class', 'iter-value')
      .attr('x', statsPanelX + 110)
      .attr('y', statsPanelY + 35)
      .attr('fill', theme.labelColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('0');

    // Detection rate
    const rateText = statsPanel.append('text')
      .attr('x', statsPanelX + 20)
      .attr('y', statsPanelY + 65)
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('Detection Rate:');

    const rateValue = statsPanel.append('text')
      .attr('class', 'rate-value')
      .attr('x', statsPanelX + 140)
      .attr('y', statsPanelY + 65)
      .attr('fill', theme.detectedColor)
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text('—');

    // Mini histogram of S/N values
    const histMargin = { top: 100, right: 20, bottom: 50, left: 50 };
    const histWidth = statsPanelWidth - histMargin.left - histMargin.right;
    const histHeight = 180;
    
    const histG = statsPanel.append('g')
      .attr('transform', `translate(${statsPanelX + histMargin.left}, ${statsPanelY + histMargin.top})`);

    histG.append('text')
      .attr('x', histWidth / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.labelColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('S/N Distribution of Simulations');

    // Histogram axes (will update with data)
    const histXScale = d3.scaleLinear().domain([0, 15]).range([0, histWidth]);
    const histYScale = d3.scaleLinear().domain([0, 20]).range([histHeight, 0]);

    histG.append('g')
      .attr('class', 'hist-x-axis')
      .attr('transform', `translate(0, ${histHeight})`)
      .call(d3.axisBottom(histXScale).ticks(8))
      .attr('color', theme.textColor);

    histG.append('g')
      .attr('class', 'hist-y-axis')
      .call(d3.axisLeft(histYScale).ticks(5))
      .attr('color', theme.textColor);

    histG.append('text')
      .attr('x', histWidth / 2)
      .attr('y', histHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '11px')
      .text('Signal/Noise Ratio');

    // Threshold line on histogram
    histG.append('line')
      .attr('class', 'hist-threshold')
      .attr('x1', histXScale(3))
      .attr('x2', histXScale(3))
      .attr('y1', 0)
      .attr('y2', histHeight)
      .attr('stroke', theme.missedColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '4,4');

    histG.append('text')
      .attr('x', histXScale(3) + 5)
      .attr('y', 15)
      .attr('fill', theme.missedColor)
      .attr('font-size', '10px')
      .text('S/N = 3');

    // Histogram bars group
    const barsG = histG.append('g').attr('class', 'histogram-bars');

    // Summary stats at bottom
    const summaryY = statsPanelY + statsPanelHeight - 70;
    
    statsPanel.append('text')
      .attr('x', statsPanelX + 20)
      .attr('y', summaryY)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Mean S/N:');

    const meanSNValue = statsPanel.append('text')
      .attr('class', 'mean-sn')
      .attr('x', statsPanelX + 100)
      .attr('y', summaryY)
      .attr('fill', theme.distCurveSignal)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('—');

    statsPanel.append('text')
      .attr('x', statsPanelX + 180)
      .attr('y', summaryY)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('SD:');

    const sdSNValue = statsPanel.append('text')
      .attr('class', 'sd-sn')
      .attr('x', statsPanelX + 210)
      .attr('y', summaryY)
      .attr('fill', theme.distCurveNoise)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('—');

    // Key insight
    const insightBox = statsPanel.append('g').attr('class', 'insight-box');
    
    insightBox.append('rect')
      .attr('x', statsPanelX + 15)
      .attr('y', summaryY + 20)
      .attr('width', statsPanelWidth - 30)
      .attr('height', 40)
      .attr('fill', isPerformanceMode ? '#e8f8f5' : '#1a4a3c')
      .attr('stroke', theme.detectedColor)
      .attr('stroke-width', 1)
      .attr('rx', 5);

    const insightText = insightBox.append('text')
      .attr('class', 'insight-text')
      .attr('x', statsPanelX + statsPanelWidth / 2)
      .attr('y', summaryY + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.detectedColor)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('Run simulation to see detection probability!');

    // ===== CONTROLS =====
    const controlsDiv = mainDiv.append('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('margin-top', '10px')
      .style('align-items', 'center');

    const runOneButton = controlsDiv.append('button')
      .style('padding', '12px 25px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', theme.buttonBg)
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s')
      .text('🎲 Run 1 Simulation')
      .on('click', () => runSimulation(1))
      .on('mouseover', function() { d3.select(this).style('background', theme.buttonHover); })
      .on('mouseout', function() { d3.select(this).style('background', theme.buttonBg); });

    const run10Button = controlsDiv.append('button')
      .style('padding', '12px 25px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', theme.distCurveSignal)
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .text('⚡ Run 10x')
      .on('click', () => runSimulation(10));

    const run100Button = controlsDiv.append('button')
      .style('padding', '12px 25px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', theme.distCurveWidth)
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .text('🚀 Run 100x')
      .on('click', () => runSimulation(100));

    const resetButton = controlsDiv.append('button')
      .style('padding', '12px 20px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', isPerformanceMode ? '#7f8c8d' : '#555566')
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .text('↺ Reset')
      .on('click', reset);

    // ===== HELPER FUNCTIONS =====
    function gaussianRandom(mean, sd) {
      let u = 0, v = 0;
      while (u === 0) u = Math.random();
      while (v === 0) v = Math.random();
      return mean + sd * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    function generatePeak(signalHeight, noiseLevel, peakWidth) {
      const points = [];
      const peakCenter = 1.5;
      const numPoints = 150;
      
      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 3;
        // Gaussian peak
        const signal = signalHeight * Math.exp(-0.5 * Math.pow((t - peakCenter) / peakWidth, 2));
        // Add noise
        const noise = gaussianRandom(0, noiseLevel);
        points.push({ t, signal: Math.max(0, signal + noise), trueSignal: signal });
      }
      
      return points;
    }

    // F-distribution critical value approximation (for α = 0.05)
    function getFCritical(df1, df2) {
      if (df2 >= 100) return 3.0;
      if (df2 >= 60) return 3.15;
      if (df2 >= 30) return 3.32;
      if (df2 >= 20) return 3.49;
      if (df2 >= 10) return 4.10;
      return 4.74;
    }

    // Global F-test for peak detection
    function detectPeakFTest(points) {
      const n = points.length;
      const y = points.map(d => d.signal);
      const t = points.map(d => d.t);
      
      // NULL MODEL: Linear baseline (y = a + b*t)
      const meanT = d3.mean(t);
      const meanY = d3.mean(y);
      
      let ssT = 0, ssTY = 0;
      for (let i = 0; i < n; i++) {
        ssT += (t[i] - meanT) ** 2;
        ssTY += (t[i] - meanT) * (y[i] - meanY);
      }
      
      const b_null = ssTY / ssT;
      const a_null = meanY - b_null * meanT;
      
      let RSS_null = 0;
      for (let i = 0; i < n; i++) {
        const predicted = a_null + b_null * t[i];
        RSS_null += (y[i] - predicted) ** 2;
      }
      
      // FULL MODEL: Baseline + Gaussian peak
      const residuals = y.map((yi, i) => yi - (a_null + b_null * t[i]));
      const maxResIdx = residuals.indexOf(Math.max(...residuals));
      const peakCenter = t[maxResIdx];
      const h_est = Math.max(...residuals);
      
      const halfMax = h_est / 2;
      let leftIdx = maxResIdx, rightIdx = maxResIdx;
      while (leftIdx > 0 && residuals[leftIdx] > halfMax) leftIdx--;
      while (rightIdx < n - 1 && residuals[rightIdx] > halfMax) rightIdx++;
      const fwhm = t[rightIdx] - t[leftIdx];
      const sigma_est = fwhm / 2.35;
      
      let RSS_full = 0;
      for (let i = 0; i < n; i++) {
        const gaussianPart = h_est * Math.exp(-0.5 * ((t[i] - peakCenter) / Math.max(sigma_est, 0.1)) ** 2);
        const predicted = a_null + b_null * t[i] + gaussianPart;
        RSS_full += (y[i] - predicted) ** 2;
      }
      
      // F-TEST
      const df_null = n - 2;
      const df_full = n - 4;
      const df_diff = 2;
      
      const F_stat = ((RSS_null - RSS_full) / df_diff) / (RSS_full / df_full);
      const F_crit = getFCritical(df_diff, df_full);
      
      return {
        detected: F_stat > F_crit,
        F_stat: F_stat,
        F_crit: F_crit
      };
    }

    function calculateSN(signalHeight, noiseLevel) {
      return signalHeight / noiseLevel;
    }

    async function runSimulation(count) {
      if (isAnimating) return;
      isAnimating = true;

      for (let i = 0; i < count; i++) {
        // Sample parameters
        const sampledSignal = gaussianRandom(params.signalHeight.mean, params.signalHeight.sd);
        const sampledNoise = Math.abs(gaussianRandom(params.noiseLevel.mean, params.noiseLevel.sd));
        const sampledWidth = Math.abs(gaussianRandom(params.peakWidth.mean, params.peakWidth.sd));

        // Show sampled values (only for single runs or last of batch)
        if (count === 1 || i === count - 1) {
          updateSampledValues(sampledSignal, sampledNoise, sampledWidth);
        }

        // Generate chromatogram
        const chromData = generatePeak(sampledSignal, sampledNoise, sampledWidth);
        
        // Update plot (only for single runs or last of batch)
        if (count === 1 || i === count - 1) {
          updateChromatogram(chromData);
        }

        // Detect peak using F-test
        const result = detectPeakFTest(chromData);
        const sn = calculateSN(sampledSignal, sampledNoise);

        // Store result
        simulationResults.push({ sn, detected: result.detected, F_stat: result.F_stat, signalHeight: sampledSignal, noiseLevel: sampledNoise });
        currentIteration++;

        // Update result display
        if (count === 1 || i === count - 1) {
          updateResultDisplay(result.detected, sn, result.F_stat, result.F_crit);
        }

        // Small delay for single runs
        if (count === 1) {
          await new Promise(r => setTimeout(r, animationSpeed));
        }
      }

      // Update statistics
      updateStatistics();
      
      isAnimating = false;
    }

    function updateSampledValues(signal, noise, width) {
      // Update signal indicator
      const signalBox = svg.select('.dist-box-signalHeight');
      const signalP = params.signalHeight;
      const signalX = distPanelX + 15 + 10 + ((signal - signalP.mean + 3 * signalP.sd) / (6 * signalP.sd)) * (distPanelWidth - 50);
      
      svg.select('.sample-indicator-signalHeight')
        .attr('cx', Math.max(distPanelX + 25, Math.min(distPanelX + distPanelWidth - 25, signalX)))
        .transition().duration(200).attr('opacity', 1);
      
      svg.select('.sample-value-signalHeight')
        .text(signal.toFixed(1))
        .transition().duration(200).attr('opacity', 1);

      // Update noise indicator
      const noiseP = params.noiseLevel;
      const noiseBoxY = distPanelY + 20 + 1 * (distBoxHeight + distBoxGap);
      const noiseX = distPanelX + 15 + 10 + ((noise - noiseP.mean + 3 * noiseP.sd) / (6 * noiseP.sd)) * (distPanelWidth - 50);
      
      svg.select('.sample-indicator-noiseLevel')
        .attr('cx', Math.max(distPanelX + 25, Math.min(distPanelX + distPanelWidth - 25, noiseX)))
        .transition().duration(200).attr('opacity', 1);
      
      svg.select('.sample-value-noiseLevel')
        .text(noise.toFixed(1))
        .transition().duration(200).attr('opacity', 1);

      // Update width indicator
      const widthP = params.peakWidth;
      const widthX = distPanelX + 15 + 10 + ((width - widthP.mean + 3 * widthP.sd) / (6 * widthP.sd)) * (distPanelWidth - 50);
      
      svg.select('.sample-indicator-peakWidth')
        .attr('cx', Math.max(distPanelX + 25, Math.min(distPanelX + distPanelWidth - 25, widthX)))
        .transition().duration(200).attr('opacity', 1);
      
      svg.select('.sample-value-peakWidth')
        .text(width.toFixed(3))
        .transition().duration(200).attr('opacity', 1);
    }

    function updateChromatogram(data) {
      const line = d3.line()
        .x(d => xScale(d.t))
        .y(d => yScale(d.signal))
        .curve(d3.curveLinear);

      chromPath.transition()
        .duration(200)
        .attr('d', line(data));
    }

    function updateResultDisplay(detected, sn, F_stat, F_crit) {
      resultIcon.text(detected ? '✅' : '❌');
      resultValue
        .text(detected ? 'DETECTED (F-test)' : 'NOT DETECTED')
        .attr('fill', detected ? theme.detectedColor : theme.missedColor);
      
      // Show both S/N and F-value
      snValue.text(`${sn.toFixed(2)} (F=${F_stat ? F_stat.toFixed(1) : '—'})`);
    }

    function updateStatistics() {
      // Update iteration count
      iterValue.text(currentIteration);

      if (simulationResults.length === 0) return;

      // Calculate detection rate
      const detectedCount = simulationResults.filter(r => r.detected).length;
      const rate = (detectedCount / simulationResults.length * 100).toFixed(1);
      rateValue.text(`${rate}% (${detectedCount}/${simulationResults.length})`);

      // Calculate S/N statistics
      const snValues = simulationResults.map(r => r.sn);
      const meanSN = d3.mean(snValues);
      const sdSN = d3.deviation(snValues);
      
      meanSNValue.text(meanSN.toFixed(2));
      sdSNValue.text(sdSN ? sdSN.toFixed(2) : '—');

      // Update histogram
      updateHistogram(snValues);

      // Update insight
      if (simulationResults.length >= 10) {
        const rateNum = parseFloat(rate);
        let insightMsg = '';
        if (rateNum >= 95) {
          insightMsg = `✓ ${rate}% detection at mean S/N = ${meanSN.toFixed(1)}`;
        } else if (rateNum >= 80) {
          insightMsg = `⚠ Only ${rate}% detection - increase signal or reduce noise`;
        } else {
          insightMsg = `✗ Low detection (${rate}%) - S/N too low!`;
        }
        insightText.text(insightMsg);
      }
    }

    function updateHistogram(snValues) {
      // Create bins
      const maxSN = Math.max(15, d3.max(snValues) + 1);
      histXScale.domain([0, maxSN]);
      
      const histogram = d3.histogram()
        .domain([0, maxSN])
        .thresholds(20);
      
      const bins = histogram(snValues);
      
      const maxCount = d3.max(bins, d => d.length);
      histYScale.domain([0, Math.max(5, maxCount)]);

      // Update axes
      histG.select('.hist-x-axis')
        .transition().duration(300)
        .call(d3.axisBottom(histXScale).ticks(8));

      histG.select('.hist-y-axis')
        .transition().duration(300)
        .call(d3.axisLeft(histYScale).ticks(5));

      // Update threshold line
      histG.select('.hist-threshold')
        .attr('x1', histXScale(3))
        .attr('x2', histXScale(3));

      // Update bars
      const bars = barsG.selectAll('rect').data(bins);

      bars.enter()
        .append('rect')
        .merge(bars)
        .transition().duration(300)
        .attr('x', d => histXScale(d.x0) + 1)
        .attr('y', d => histYScale(d.length))
        .attr('width', d => Math.max(0, histXScale(d.x1) - histXScale(d.x0) - 2))
        .attr('height', d => histHeight - histYScale(d.length))
        .attr('fill', d => (d.x0 + d.x1) / 2 >= 3 ? theme.detectedColor : theme.missedColor)
        .attr('opacity', 0.7);

      bars.exit().remove();
    }

    function reset() {
      simulationResults = [];
      currentIteration = 0;
      isAnimating = false;

      // Reset displays
      iterValue.text('0');
      rateValue.text('—');
      meanSNValue.text('—');
      sdSNValue.text('—');
      
      resultIcon.text('❓');
      resultValue.text('— waiting —').attr('fill', theme.labelColor);
      snValue.text('—');

      // Clear chromatogram
      chromPath.attr('d', '');

      // Hide sample indicators
      svg.selectAll('[class^="sample-indicator"]').attr('opacity', 0);
      svg.selectAll('[class^="sample-value"]').attr('opacity', 0);

      // Clear histogram
      barsG.selectAll('rect').remove();

      // Reset insight
      insightText.text('Run simulation to see detection probability!');
    }
  }

  // Initialize
  function init() {
    initMonteCarloIdea();
    
    if (typeof Reveal !== 'undefined') {
      Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#monte-carlo-idea-chart')) {
          setTimeout(initMonteCarloIdea, 100);
        }
      });
    }

    // Re-init on performance mode toggle
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const container = document.getElementById('monte-carlo-idea-chart');
          if (container && container.offsetParent !== null) {
            initMonteCarloIdea();
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
