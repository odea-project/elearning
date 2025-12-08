/**
 * Bootstrap Harmonic Mean Demonstration
 * Shows bootstrap resampling for flow velocities
 * using harmonic mean as the statistic
 */

(function() {
  const containerId = 'bootstrap-harmonic-chart';
  
  function createBootstrapHarmonicDemo() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Theme detection
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    const theme = {
      bgColor: isPerformanceMode ? '#f5f5f5' : '#1e1e2e',
      textColor: isPerformanceMode ? '#333333' : '#e0e0e0',
      titleColor: isPerformanceMode ? '#1a1a2e' : '#ffffff',
      axisColor: isPerformanceMode ? '#666666' : '#888888',
      pointColor: isPerformanceMode ? '#2980b9' : '#4a90d9',
      pointHighlight: isPerformanceMode ? '#27ae60' : '#4ecdc4',
      histColor: isPerformanceMode ? '#3498db' : '#5dade2',
      meanLineColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      ciColor: isPerformanceMode ? '#27ae60' : '#4ecdc4',
      buttonBg: isPerformanceMode ? '#2980b9' : '#4a7c59',
      buttonText: '#ffffff',
      arithColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      harmColor: isPerformanceMode ? '#27ae60' : '#4ecdc4'
    };

    // Original flow velocity data (m/s) - measurements from different river sections
    const originalData = [0.8, 1.2, 0.5, 2.0, 0.9, 1.5, 0.6, 1.1];
    
    // Calculate original means
    const arithmeticMean = d3.mean(originalData);
    const harmonicMean = originalData.length / d3.sum(originalData.map(v => 1/v));

    // Bootstrap storage
    let bootstrapHarmonicMeans = [];
    let bootstrapArithmeticMeans = [];
    let isRunning = false;
    let animationId = null;

    // Layout configuration - 1400x580 like the other bootstrap demo
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
      .text('Bootstrap: Harmonic Mean of Flow Velocities');

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

    svg.append('text')
      .attr('x', leftX + leftWidth / 2)
      .attr('y', leftY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Flow Velocities (n=8)');

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

    // Original means display
    svg.append('text')
      .attr('x', leftX + leftWidth / 2)
      .attr('y', leftY + leftHeight + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(`Harmonic Mean: ${harmonicMean.toFixed(3)} m/s`);

    svg.append('text')
      .attr('x', leftX + leftWidth / 2)
      .attr('y', leftY + leftHeight + 48)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '14px')
      .text(`(Arithmetic: ${arithmeticMean.toFixed(3)} m/s)`);

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

    // Resample mean texts
    const resampleHarmonicText = svg.append('text')
      .attr('x', midX + midWidth / 2)
      .attr('y', midY + midHeight + 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('Harmonic Mean: —');

    const resampleArithText = svg.append('text')
      .attr('x', midX + midWidth / 2)
      .attr('y', midY + midHeight + 48)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '13px')
      .text('(Arithmetic: —)');

    // Arrow between panels
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead-harm')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', theme.textColor);

    svg.append('path')
      .attr('d', `M${leftX + leftWidth + 15},${leftY + leftHeight / 2} L${midX - 15},${midY + midHeight / 2}`)
      .attr('stroke', theme.textColor)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead-harm)')
      .attr('opacity', 0.6);

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
      .text('Bootstrap Distribution');

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
      .attr('marker-end', 'url(#arrowhead-harm)')
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

    // Harmonic mean stats
    const harmStatsGroup = statsGroup.append('g')
      .attr('transform', 'translate(-250, 30)');

    harmStatsGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('Harmonic Mean');

    const harmSEText = harmStatsGroup.append('text')
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '14px')
      .text('Bootstrap SE: —');

    const harmCIText = harmStatsGroup.append('text')
      .attr('y', 48)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '14px')
      .text('95% CI: —');

    // Arithmetic mean stats (for comparison)
    const arithStatsGroup = statsGroup.append('g')
      .attr('transform', 'translate(250, 30)');

    arithStatsGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('Arithmetic Mean');

    const arithSEText = arithStatsGroup.append('text')
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '14px')
      .text('Bootstrap SE: —');

    const arithCIText = arithStatsGroup.append('text')
      .attr('y', 48)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '14px')
      .text('95% CI: —');

    // Key insight box
    const insightY = 530;
    svg.append('rect')
      .attr('x', 400)
      .attr('y', insightY)
      .attr('width', 600)
      .attr('height', 40)
      .attr('fill', isPerformanceMode ? '#e8f5e9' : '#253d2e')
      .attr('stroke', theme.harmColor)
      .attr('stroke-width', 2)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', 700)
      .attr('y', insightY + 26)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('💡 Harmonic mean is always ≤ arithmetic mean (equality only if all values equal)');

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

    function calcHarmonicMean(values) {
      return values.length / d3.sum(values.map(v => 1/v));
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

      const values = sample.map(s => s.value);
      const harmMean = calcHarmonicMean(values);
      const arithMean = d3.mean(values);
      
      resampleHarmonicText.text(`Harmonic Mean: ${harmMean.toFixed(3)} m/s`);
      resampleArithText.text(`(Arithmetic: ${arithMean.toFixed(3)} m/s)`);
      
      return { harmonic: harmMean, arithmetic: arithMean };
    }

    function updateHistogram() {
      histGroup.selectAll('*').remove();

      if (bootstrapHarmonicMeans.length < 2) return;

      // Combine both distributions for scale
      const allMeans = [...bootstrapHarmonicMeans, ...bootstrapArithmeticMeans];
      const extent = d3.extent(allMeans);
      const padding = (extent[1] - extent[0]) * 0.1 || 0.1;

      const xScale = d3.scaleLinear()
        .domain([extent[0] - padding, extent[1] + padding])
        .range([50, histWidth - 20]);

      const binCount = Math.min(25, Math.ceil(Math.sqrt(bootstrapHarmonicMeans.length)));

      // Harmonic mean bins
      const harmBins = d3.bin()
        .domain(xScale.domain())
        .thresholds(binCount)(bootstrapHarmonicMeans);

      // Arithmetic mean bins
      const arithBins = d3.bin()
        .domain(xScale.domain())
        .thresholds(binCount)(bootstrapArithmeticMeans);

      const maxCount = Math.max(
        d3.max(harmBins, b => b.length),
        d3.max(arithBins, b => b.length)
      );

      const yScale = d3.scaleLinear()
        .domain([0, maxCount])
        .range([histHeight - 45, 25]);

      // Draw arithmetic bars (behind)
      histGroup.selectAll('.bar-arith')
        .data(arithBins)
        .enter()
        .append('rect')
        .attr('class', 'bar-arith')
        .attr('x', d => xScale(d.x0) + 1)
        .attr('y', d => yScale(d.length))
        .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
        .attr('height', d => histHeight - 45 - yScale(d.length))
        .attr('fill', theme.arithColor)
        .attr('opacity', 0.4);

      // Draw harmonic bars (front)
      histGroup.selectAll('.bar-harm')
        .data(harmBins)
        .enter()
        .append('rect')
        .attr('class', 'bar-harm')
        .attr('x', d => xScale(d.x0) + 1)
        .attr('y', d => yScale(d.length))
        .attr('width', d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 2))
        .attr('height', d => histHeight - 45 - yScale(d.length))
        .attr('fill', theme.harmColor)
        .attr('opacity', 0.7);

      // Mean lines
      const harmBootMean = d3.mean(bootstrapHarmonicMeans);
      const arithBootMean = d3.mean(bootstrapArithmeticMeans);

      // Harmonic mean line
      histGroup.append('line')
        .attr('x1', xScale(harmBootMean))
        .attr('x2', xScale(harmBootMean))
        .attr('y1', 20)
        .attr('y2', histHeight - 40)
        .attr('stroke', theme.harmColor)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '6,3');

      // Arithmetic mean line
      histGroup.append('line')
        .attr('x1', xScale(arithBootMean))
        .attr('x2', xScale(arithBootMean))
        .attr('y1', 20)
        .attr('y2', histHeight - 40)
        .attr('stroke', theme.arithColor)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '6,3');

      // Legend
      histGroup.append('rect')
        .attr('x', histWidth - 150)
        .attr('y', 10)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', theme.harmColor)
        .attr('opacity', 0.7);
      
      histGroup.append('text')
        .attr('x', histWidth - 132)
        .attr('y', 20)
        .attr('fill', theme.textColor)
        .attr('font-size', '11px')
        .text('Harmonic');

      histGroup.append('rect')
        .attr('x', histWidth - 150)
        .attr('y', 28)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', theme.arithColor)
        .attr('opacity', 0.4);
      
      histGroup.append('text')
        .attr('x', histWidth - 132)
        .attr('y', 38)
        .attr('fill', theme.textColor)
        .attr('font-size', '11px')
        .text('Arithmetic');

      // Y axis
      histGroup.append('g')
        .attr('transform', `translate(48, 0)`)
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll('text')
        .attr('fill', theme.textColor)
        .attr('font-size', '11px');

      // X axis
      histGroup.append('g')
        .attr('transform', `translate(0, ${histHeight - 43})`)
        .call(d3.axisBottom(xScale).ticks(6).tickFormat(d => d.toFixed(2)))
        .selectAll('text')
        .attr('fill', theme.textColor)
        .attr('font-size', '11px');

      histGroup.selectAll('.domain, .tick line')
        .attr('stroke', theme.axisColor);

      // X axis label
      histGroup.append('text')
        .attr('x', histWidth / 2)
        .attr('y', histHeight - 8)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '12px')
        .text('Mean Flow Velocity (m/s)');

      // Y axis label
      histGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -histHeight / 2)
        .attr('y', 14)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '12px')
        .text('Frequency');
    }

    function updateStats() {
      iterationText.text(`Iterations: ${bootstrapHarmonicMeans.length}`);

      if (bootstrapHarmonicMeans.length >= 10) {
        const harmSE = d3.deviation(bootstrapHarmonicMeans);
        const arithSE = d3.deviation(bootstrapArithmeticMeans);
        
        harmSEText.text(`Bootstrap SE: ${harmSE.toFixed(4)} m/s`);
        arithSEText.text(`Bootstrap SE: ${arithSE.toFixed(4)} m/s`);

        if (bootstrapHarmonicMeans.length >= 50) {
          const harmSorted = [...bootstrapHarmonicMeans].sort((a, b) => a - b);
          const harmCI025 = harmSorted[Math.floor(harmSorted.length * 0.025)];
          const harmCI975 = harmSorted[Math.floor(harmSorted.length * 0.975)];
          harmCIText.text(`95% CI: [${harmCI025.toFixed(3)}, ${harmCI975.toFixed(3)}]`);

          const arithSorted = [...bootstrapArithmeticMeans].sort((a, b) => a - b);
          const arithCI025 = arithSorted[Math.floor(arithSorted.length * 0.025)];
          const arithCI975 = arithSorted[Math.floor(arithSorted.length * 0.975)];
          arithCIText.text(`95% CI: [${arithCI025.toFixed(3)}, ${arithCI975.toFixed(3)}]`);
        }
      }
    }

    function runIteration() {
      const sample = resample();
      const means = drawResample(sample);
      bootstrapHarmonicMeans.push(means.harmonic);
      bootstrapArithmeticMeans.push(means.arithmetic);
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
      
      if (speed <= 1) {
        // Instant mode - run 1000 iterations
        for (let i = 0; i < 1000; i++) {
          const sample = resample();
          const values = sample.map(s => s.value);
          bootstrapHarmonicMeans.push(calcHarmonicMean(values));
          bootstrapArithmeticMeans.push(d3.mean(values));
        }
        drawResample(resample()); // Show one example
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
      bootstrapHarmonicMeans = [];
      bootstrapArithmeticMeans = [];
      resampleGroup.selectAll('*').remove();
      histGroup.selectAll('*').remove();
      resampleHarmonicText.text('Harmonic Mean: —');
      resampleArithText.text('(Arithmetic: —)');
      iterationText.text('Iterations: 0');
      harmSEText.text('Bootstrap SE: —');
      harmCIText.text('95% CI: —');
      arithSEText.text('Bootstrap SE: —');
      arithCIText.text('95% CI: —');
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBootstrapHarmonicDemo);
  } else {
    createBootstrapHarmonicDemo();
  }

  // Re-render on theme change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        setTimeout(createBootstrapHarmonicDemo, 100);
      }
    });
  });
  
  observer.observe(document.body, { attributes: true });
})();
