/* -------------------------------------*/
/* BOOTSTRAP DEMONSTRATION CHART        */
/* Interactive bootstrap visualization  */
/* -------------------------------------*/
(function () {
  function initBootstrapDemo() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initBootstrapDemo, 100);
      return;
    }

    const containerId = 'bootstrap-demo-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Theme-aware colors
    const theme = {
      pointColor: isPerformanceMode ? '#0066aa' : '#00aaff',
      pointHighlight: isPerformanceMode ? '#cc3300' : '#ff6644',
      histColor: isPerformanceMode ? '#0088aa' : '#4488ff',
      meanLineColor: isPerformanceMode ? '#cc0000' : '#ff4444',
      ciColor: isPerformanceMode ? '#008800' : '#00dd66',
      titleColor: isPerformanceMode ? '#000000' : '#ffffff',
      textColor: isPerformanceMode ? '#333333' : '#cccccc',
      axisColor: isPerformanceMode ? '#666666' : '#555555',
      bgColor: isPerformanceMode ? '#f5f5f5' : '#1a1a2e',
      buttonBg: isPerformanceMode ? '#0066aa' : '#4488ff',
      buttonText: '#ffffff'
    };

    // Original data (water quality measurements)
    const originalData = [12.3, 15.1, 11.8, 14.2, 13.5, 16.8, 12.9, 14.7];
    const originalMean = d3.mean(originalData);

    // State
    let bootstrapMeans = [];
    let isRunning = false;
    let animationId = null;

    // Layout configuration
    const totalWidth = 1400;
    const totalHeight = 580;
    const margin = { top: 60, right: 40, bottom: 50, left: 60 };

    // Create main container
    const mainDiv = d3.select(container)
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('gap', '10px');

    // Title
    mainDiv.append('div')
      .style('color', theme.titleColor)
      .style('font-size', '22px')
      .style('font-weight', 'bold')
      .text('Bootstrap Resampling Demonstration');

    // SVG container
    const svg = mainDiv.append('svg')
      .attr('width', totalWidth)
      .attr('height', totalHeight);

    // Background
    svg.append('rect')
      .attr('width', totalWidth)
      .attr('height', totalHeight)
      .attr('fill', theme.bgColor)
      .attr('rx', 10);

    // Left panel: Original data
    const leftWidth = 320;
    const leftHeight = 280;
    const leftX = 60;
    const leftY = 70;

    // Left panel title
    svg.append('text')
      .attr('x', leftX + leftWidth / 2)
      .attr('y', leftY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Original Data (n=8)');

    // Left panel background
    svg.append('rect')
      .attr('x', leftX)
      .attr('y', leftY)
      .attr('width', leftWidth)
      .attr('height', leftHeight)
      .attr('fill', isPerformanceMode ? '#e8e8e8' : '#252540')
      .attr('rx', 8);

    // Draw original data points
    const pointsPerRow = 4;
    const pointSpacingX = leftWidth / (pointsPerRow + 1);
    const pointSpacingY = leftHeight / 3;

    const originalPoints = svg.selectAll('.orig-point')
      .data(originalData)
      .enter()
      .append('g')
      .attr('class', 'orig-point');

    originalPoints.append('circle')
      .attr('cx', (d, i) => leftX + pointSpacingX * ((i % pointsPerRow) + 1))
      .attr('cy', (d, i) => leftY + pointSpacingY * (Math.floor(i / pointsPerRow) + 1))
      .attr('r', 26)
      .attr('fill', theme.pointColor)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    originalPoints.append('text')
      .attr('x', (d, i) => leftX + pointSpacingX * ((i % pointsPerRow) + 1))
      .attr('y', (d, i) => leftY + pointSpacingY * (Math.floor(i / pointsPerRow) + 1))
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', '#ffffff')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => d.toFixed(1));

    // Original mean display
    svg.append('text')
      .attr('x', leftX + leftWidth / 2)
      .attr('y', leftY + leftHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '15px')
      .text(`Original Mean: ${originalMean.toFixed(2)} mg/L`);

    // Middle panel: Current resample
    const midX = 460;
    const midY = 70;
    const midWidth = 320;
    const midHeight = 280;

    svg.append('text')
      .attr('x', midX + midWidth / 2)
      .attr('y', midY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Current Resample');

    svg.append('rect')
      .attr('x', midX)
      .attr('y', midY)
      .attr('width', midWidth)
      .attr('height', midHeight)
      .attr('fill', isPerformanceMode ? '#e8e8e8' : '#252540')
      .attr('rx', 8)
      .attr('id', 'resample-box');

    // Resample group
    const resampleGroup = svg.append('g').attr('id', 'resample-group');

    // Resample mean text
    const resampleMeanText = svg.append('text')
      .attr('x', midX + midWidth / 2)
      .attr('y', midY + midHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.pointHighlight)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('Resample Mean: —');

    // Arrow between panels
    svg.append('path')
      .attr('d', `M${leftX + leftWidth + 15},${leftY + leftHeight / 2} L${midX - 15},${midY + midHeight / 2}`)
      .attr('stroke', theme.textColor)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('opacity', 0.6);

    // Arrowhead marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', theme.textColor);

    // Right panel: Histogram of bootstrap means
    const histX = 860;
    const histY = 70;
    const histWidth = 480;
    const histHeight = 280;

    svg.append('text')
      .attr('x', histX + histWidth / 2)
      .attr('y', histY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Bootstrap Distribution of Means');

    svg.append('rect')
      .attr('x', histX)
      .attr('y', histY)
      .attr('width', histWidth)
      .attr('height', histHeight)
      .attr('fill', isPerformanceMode ? '#e8e8e8' : '#252540')
      .attr('rx', 8);

    const histGroup = svg.append('g')
      .attr('transform', `translate(${histX}, ${histY})`);

    // Arrow to histogram
    svg.append('path')
      .attr('d', `M${midX + midWidth + 15},${midY + midHeight / 2} L${histX - 15},${histY + histHeight / 2}`)
      .attr('stroke', theme.textColor)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('opacity', 0.6);

    // Bottom panel: Statistics
    const statsY = 420;
    const statsGroup = svg.append('g')
      .attr('transform', `translate(${totalWidth / 2}, ${statsY})`);

    const iterationText = statsGroup.append('text')
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '16px')
      .text('Iterations: 0');

    const bootstrapSEText = statsGroup.append('text')
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.ciColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Bootstrap SE: —');

    const ciText = statsGroup.append('text')
      .attr('y', 60)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.ciColor)
      .attr('font-size', '16px')
      .text('95% CI: —');

    // Controls
    const controlsDiv = mainDiv.append('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('margin-top', '5px');

    // Start/Stop button
    const startButton = controlsDiv.append('button')
      .style('padding', '12px 30px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', theme.buttonBg)
      .style('color', theme.buttonText)
      .style('border', 'none')
      .style('border-radius', '6px')
      .style('cursor', 'pointer')
      .text('▶ Start Bootstrap')
      .on('click', toggleBootstrap);

    // Reset button
    controlsDiv.append('button')
      .style('padding', '12px 30px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', isPerformanceMode ? '#666666' : '#555555')
      .style('color', theme.buttonText)
      .style('border', 'none')
      .style('border-radius', '6px')
      .style('cursor', 'pointer')
      .text('↺ Reset')
      .on('click', reset);

    // Speed control
    const speedDiv = controlsDiv.append('div')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '10px');

    speedDiv.append('span')
      .style('color', theme.textColor)
      .style('font-size', '14px')
      .text('Speed:');

    const speedSelect = speedDiv.append('select')
      .style('padding', '8px 12px')
      .style('font-size', '14px')
      .style('border-radius', '4px');

    speedSelect.append('option').attr('value', '500').text('Slow');
    speedSelect.append('option').attr('value', '100').attr('selected', true).text('Medium');
    speedSelect.append('option').attr('value', '20').text('Fast');
    speedSelect.append('option').attr('value', '1').text('Instant (1000)');

    // Functions
    function resample() {
      const sample = [];
      for (let i = 0; i < originalData.length; i++) {
        const idx = Math.floor(Math.random() * originalData.length);
        sample.push({ value: originalData[idx], origIdx: idx });
      }
      return sample;
    }

    function drawResample(sample) {
      resampleGroup.selectAll('*').remove();

      // Calculate spacing for middle panel
      const midPointSpacingX = midWidth / (pointsPerRow + 1);
      const midPointSpacingY = midHeight / 3;

      sample.forEach((d, i) => {
        const g = resampleGroup.append('g');
        
        const cx = midX + midPointSpacingX * ((i % pointsPerRow) + 1);
        const cy = midY + midPointSpacingY * (Math.floor(i / pointsPerRow) + 1);

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', 26)
          .attr('fill', theme.pointHighlight)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .attr('opacity', 0)
          .transition()
          .duration(50)
          .attr('opacity', 1);

        g.append('text')
          .attr('x', cx)
          .attr('y', cy)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('fill', '#ffffff')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .text(d.value.toFixed(1));
      });

      const mean = d3.mean(sample, s => s.value);
      resampleMeanText.text(`Resample Mean: ${mean.toFixed(2)} mg/L`);
      return mean;
    }

    function updateHistogram() {
      histGroup.selectAll('*').remove();

      if (bootstrapMeans.length < 2) return;

      const binCount = Math.min(25, Math.ceil(Math.sqrt(bootstrapMeans.length)));
      const extent = d3.extent(bootstrapMeans);
      const padding = (extent[1] - extent[0]) * 0.1 || 0.5;

      const xScale = d3.scaleLinear()
        .domain([extent[0] - padding, extent[1] + padding])
        .range([40, histWidth - 20]);

      const bins = d3.bin()
        .domain(xScale.domain())
        .thresholds(binCount)(bootstrapMeans);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(bins, b => b.length)])
        .range([histHeight - 40, 20]);

      // Draw bars
      histGroup.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.x0) + 1)
        .attr('y', d => yScale(d.length))
        .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
        .attr('height', d => histHeight - 40 - yScale(d.length))
        .attr('fill', theme.histColor)
        .attr('opacity', 0.8);

      // Mean line
      const bootMean = d3.mean(bootstrapMeans);
      histGroup.append('line')
        .attr('x1', xScale(bootMean))
        .attr('x2', xScale(bootMean))
        .attr('y1', 15)
        .attr('y2', histHeight - 35)
        .attr('stroke', theme.meanLineColor)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '6,3');

      // Mean label
      histGroup.append('text')
        .attr('x', xScale(bootMean))
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.meanLineColor)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('Mean');

      // Y axis
      histGroup.append('g')
        .attr('transform', `translate(38, 0)`)
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll('text')
        .attr('fill', theme.textColor)
        .attr('font-size', '11px');

      // X axis
      histGroup.append('g')
        .attr('transform', `translate(0, ${histHeight - 38})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(d => d.toFixed(1)))
        .selectAll('text')
        .attr('fill', theme.textColor)
        .attr('font-size', '11px');

      histGroup.selectAll('.domain, .tick line')
        .attr('stroke', theme.axisColor);

      // X axis label
      histGroup.append('text')
        .attr('x', histWidth / 2)
        .attr('y', histHeight - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '12px')
        .text('Sample Mean (mg/L)');

      // Y axis label
      histGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -histHeight / 2)
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '12px')
        .text('Frequency');
    }

    function updateStats() {
      iterationText.text(`Iterations: ${bootstrapMeans.length}`);

      if (bootstrapMeans.length >= 10) {
        const se = d3.deviation(bootstrapMeans);
        bootstrapSEText.text(`Bootstrap SE: ${se.toFixed(3)} mg/L`);

        if (bootstrapMeans.length >= 50) {
          const sorted = [...bootstrapMeans].sort((a, b) => a - b);
          const ci025 = sorted[Math.floor(sorted.length * 0.025)];
          const ci975 = sorted[Math.floor(sorted.length * 0.975)];
          ciText.text(`95% CI: [${ci025.toFixed(2)}, ${ci975.toFixed(2)}] mg/L (Percentile Method)`);
        }
      }
    }

    function runIteration() {
      const sample = resample();
      const mean = drawResample(sample);
      bootstrapMeans.push(mean);
      updateHistogram();
      updateStats();
    }

    function toggleBootstrap() {
      if (isRunning) {
        isRunning = false;
        startButton.text('▶ Start Bootstrap');
        if (animationId) {
          clearTimeout(animationId);
          animationId = null;
        }
      } else {
        isRunning = true;
        startButton.text('⏸ Pause');
        runLoop();
      }
    }

    function runLoop() {
      if (!isRunning) return;

      const speed = parseInt(speedSelect.node().value);
      
      if (speed === 1) {
        // Instant mode: run 1000 iterations at once
        for (let i = 0; i < 1000; i++) {
          const sample = resample();
          const mean = d3.mean(sample, s => s.value);
          bootstrapMeans.push(mean);
        }
        drawResample(resample());
        updateHistogram();
        updateStats();
        isRunning = false;
        startButton.text('▶ Start Bootstrap');
      } else {
        runIteration();
        animationId = setTimeout(runLoop, speed);
      }
    }

    function reset() {
      isRunning = false;
      startButton.text('▶ Start Bootstrap');
      if (animationId) {
        clearTimeout(animationId);
        animationId = null;
      }
      bootstrapMeans = [];
      resampleGroup.selectAll('*').remove();
      resampleMeanText.text('Resample Mean: —');
      histGroup.selectAll('*').remove();
      iterationText.text('Iterations: 0');
      bootstrapSEText.text('Bootstrap SE: —');
      ciText.text('95% CI: —');
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBootstrapDemo);
  } else {
    initBootstrapDemo();
  }

  // Redraw on slide change
  if (typeof Reveal !== 'undefined') {
    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'bootstrap-visual') {
        setTimeout(initBootstrapDemo, 200);
      }
    });
  }
})();
