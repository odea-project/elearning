/**
 * Harmonic Mean Flow Velocity Demonstration
 * Interactive visualization showing why arithmetic mean fails for flow velocities
 * and demonstrates harmonic mean calculation with animated boat
 */

(function() {
  const containerId = 'harmonic-mean-demo-chart';
  
  function createHarmonicMeanDemo() {
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
      riverColor: isPerformanceMode ? '#4a90d9' : '#3a7bd5',
      fastColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      slowColor: isPerformanceMode ? '#27ae60' : '#4ecdc4',
      boatColor: isPerformanceMode ? '#8b4513' : '#d4a574',
      arithColor: isPerformanceMode ? '#c0392b' : '#ff6b6b',
      harmColor: isPerformanceMode ? '#2980b9' : '#4ecdc4',
      buttonBg: isPerformanceMode ? '#2980b9' : '#4a7c59',
      buttonText: '#ffffff',
      highlightBg: isPerformanceMode ? '#fff3cd' : '#3d3d5c',
      correctBg: isPerformanceMode ? '#d4edda' : '#253d2e',
      wrongBg: isPerformanceMode ? '#f8d7da' : '#3d2525'
    };

    // Layout configuration - 1400x580 to match bootstrap demo
    const totalWidth = 1400;
    const totalHeight = 560;

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
      .text('Flow Velocity: Why Arithmetic Mean Fails');

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

    // Scenario parameters
    const distancePerSection = 100; // meters
    
    // Left panel: River visualization
    const riverX = 50;
    const riverY = 60;
    const riverWidth = 600;
    const riverHeight = 180;

    // River section title
    svg.append('text')
      .attr('x', riverX + riverWidth / 2)
      .attr('y', riverY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('River with Two Sections (100m each)');

    // River gradient background
    const defs = svg.append('defs');
    
    const riverGradient = defs.append('linearGradient')
      .attr('id', 'riverGradient')
      .attr('x1', '0%')
      .attr('x2', '100%');
    
    riverGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', theme.fastColor)
      .attr('stop-opacity', 0.25);
    
    riverGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', theme.fastColor)
      .attr('stop-opacity', 0.25);
    
    riverGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', theme.slowColor)
      .attr('stop-opacity', 0.25);
    
    riverGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', theme.slowColor)
      .attr('stop-opacity', 0.25);

    svg.append('rect')
      .attr('x', riverX)
      .attr('y', riverY)
      .attr('width', riverWidth)
      .attr('height', riverHeight)
      .attr('fill', 'url(#riverGradient)')
      .attr('stroke', theme.riverColor)
      .attr('stroke-width', 3)
      .attr('rx', 8);

    // Section divider
    svg.append('line')
      .attr('x1', riverX + riverWidth / 2)
      .attr('x2', riverX + riverWidth / 2)
      .attr('y1', riverY)
      .attr('y2', riverY + riverHeight)
      .attr('stroke', theme.textColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '8,4');

    // Section labels
    svg.append('text')
      .attr('x', riverX + riverWidth / 4)
      .attr('y', riverY + 28)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.fastColor)
      .attr('font-size', '17px')
      .attr('font-weight', 'bold')
      .text('Fast Section');

    svg.append('text')
      .attr('x', riverX + riverWidth / 4)
      .attr('y', riverY + 52)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.fastColor)
      .attr('font-size', '15px')
      .text('v₁ = 2.0 m/s');

    svg.append('text')
      .attr('x', riverX + 3 * riverWidth / 4)
      .attr('y', riverY + 28)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.slowColor)
      .attr('font-size', '17px')
      .attr('font-weight', 'bold')
      .text('Slow Section');

    svg.append('text')
      .attr('x', riverX + 3 * riverWidth / 4)
      .attr('y', riverY + 52)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.slowColor)
      .attr('font-size', '15px')
      .text('v₂ = 0.5 m/s');

    // Distance labels below river
    svg.append('text')
      .attr('x', riverX + riverWidth / 4)
      .attr('y', riverY + riverHeight + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('d = 100 m');

    svg.append('text')
      .attr('x', riverX + 3 * riverWidth / 4)
      .attr('y', riverY + riverHeight + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('d = 100 m');

    // Flow arrows
    ['fast', 'slow'].forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', type === 'fast' ? theme.fastColor : theme.slowColor);
    });

    // Draw flow arrows
    for (let i = 0; i < 4; i++) {
      const arrowY = riverY + 80 + (i % 2) * 40;
      const isFast = i < 2;
      const baseX = isFast ? riverX + 50 + (i % 2) * 100 : riverX + riverWidth / 2 + 50 + (i % 2) * 100;
      const arrowLen = isFast ? 80 : 35;
      
      svg.append('path')
        .attr('d', `M${baseX},${arrowY} L${baseX + arrowLen},${arrowY}`)
        .attr('stroke', isFast ? theme.fastColor : theme.slowColor)
        .attr('stroke-width', 3)
        .attr('marker-end', `url(#arrow-${isFast ? 'fast' : 'slow'})`);
    }

    // Boat emoji/shape
    const boatGroup = svg.append('g')
      .attr('id', 'boat-group')
      .attr('transform', `translate(${riverX + 15}, ${riverY + riverHeight / 2 + 10})`);

    boatGroup.append('text')
      .attr('font-size', '36px')
      .attr('text-anchor', 'middle')
      .text('🚣');

    // Right panel: Calculation comparison
    const calcX = 720;
    const calcY = 60;
    const calcWidth = 620;

    svg.append('text')
      .attr('x', calcX + calcWidth / 2)
      .attr('y', calcY - 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Which Average is Correct?');

    // Arithmetic mean box
    const arithBoxX = calcX + 20;
    const arithBoxY = calcY;
    const boxWidth = 280;
    const boxHeight = 175;

    svg.append('rect')
      .attr('x', arithBoxX)
      .attr('y', arithBoxY)
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('fill', theme.wrongBg)
      .attr('stroke', theme.arithColor)
      .attr('stroke-width', 2)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', arithBoxX + boxWidth / 2)
      .attr('y', arithBoxY + 24)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('Arithmetic Mean ✗');

    svg.append('text')
      .attr('x', arithBoxX + boxWidth / 2)
      .attr('y', arithBoxY + 50)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('v̄ = (v₁ + v₂) / 2');

    svg.append('text')
      .attr('x', arithBoxX + boxWidth / 2)
      .attr('y', arithBoxY + 73)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('v̄ = (2.0 + 0.5) / 2 = 1.25 m/s');

    svg.append('text')
      .attr('x', arithBoxX + boxWidth / 2)
      .attr('y', arithBoxY + 100)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .text('Expected time: 200m / 1.25 m/s');

    svg.append('text')
      .attr('x', arithBoxX + boxWidth / 2)
      .attr('y', arithBoxY + 125)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text('t = 160 s');

    svg.append('text')
      .attr('x', arithBoxX + boxWidth / 2)
      .attr('y', arithBoxY + 155)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.arithColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('❌ WRONG!');

    // Harmonic mean box
    const harmBoxX = calcX + 320;
    const harmBoxY = calcY;

    svg.append('rect')
      .attr('x', harmBoxX)
      .attr('y', harmBoxY)
      .attr('width', boxWidth)
      .attr('height', boxHeight)
      .attr('fill', theme.correctBg)
      .attr('stroke', theme.harmColor)
      .attr('stroke-width', 2)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', harmBoxX + boxWidth / 2)
      .attr('y', harmBoxY + 24)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('Harmonic Mean ✓');

    svg.append('text')
      .attr('x', harmBoxX + boxWidth / 2)
      .attr('y', harmBoxY + 50)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('v̄ₕ = n / Σ(1/vᵢ)');

    svg.append('text')
      .attr('x', harmBoxX + boxWidth / 2)
      .attr('y', harmBoxY + 73)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('v̄ₕ = 2 / (1/2 + 1/0.5) = 0.8 m/s');

    svg.append('text')
      .attr('x', harmBoxX + boxWidth / 2)
      .attr('y', harmBoxY + 100)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .text('Expected time: 200m / 0.8 m/s');

    svg.append('text')
      .attr('x', harmBoxX + boxWidth / 2)
      .attr('y', harmBoxY + 125)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text('t = 250 s');

    svg.append('text')
      .attr('x', harmBoxX + boxWidth / 2)
      .attr('y', harmBoxY + 155)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('✅ CORRECT!');

    // Bottom panel: Verification
    const verifyY = 290;
    
    svg.append('text')
      .attr('x', totalWidth / 2)
      .attr('y', verifyY)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Verification: Actual Travel Time');

    // Time calculation boxes
    const timeBoxY = verifyY + 18;
    const timeBoxWidth = 280;
    const timeBoxHeight = 70;

    // Section 1 time
    svg.append('rect')
      .attr('x', 180)
      .attr('y', timeBoxY)
      .attr('width', timeBoxWidth)
      .attr('height', timeBoxHeight)
      .attr('fill', theme.highlightBg)
      .attr('stroke', theme.fastColor)
      .attr('stroke-width', 2)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', 180 + timeBoxWidth / 2)
      .attr('y', timeBoxY + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.fastColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('Fast Section');

    svg.append('text')
      .attr('x', 180 + timeBoxWidth / 2)
      .attr('y', timeBoxY + 48)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('t₁ = 100m / 2.0 m/s = 50 s');

    // Plus sign
    svg.append('text')
      .attr('x', 505)
      .attr('y', timeBoxY + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text('+');

    // Section 2 time
    svg.append('rect')
      .attr('x', 550)
      .attr('y', timeBoxY)
      .attr('width', timeBoxWidth)
      .attr('height', timeBoxHeight)
      .attr('fill', theme.highlightBg)
      .attr('stroke', theme.slowColor)
      .attr('stroke-width', 2)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', 550 + timeBoxWidth / 2)
      .attr('y', timeBoxY + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.slowColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('Slow Section');

    svg.append('text')
      .attr('x', 550 + timeBoxWidth / 2)
      .attr('y', timeBoxY + 48)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('t₂ = 100m / 0.5 m/s = 200 s');

    // Equals sign
    svg.append('text')
      .attr('x', 875)
      .attr('y', timeBoxY + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text('=');

    // Total time
    svg.append('rect')
      .attr('x', 920)
      .attr('y', timeBoxY)
      .attr('width', 180)
      .attr('height', timeBoxHeight)
      .attr('fill', isPerformanceMode ? '#e3f2fd' : '#1e3a5f')
      .attr('stroke', theme.harmColor)
      .attr('stroke-width', 3)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', 1010)
      .attr('y', timeBoxY + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('Total Time');

    svg.append('text')
      .attr('x', 1010)
      .attr('y', timeBoxY + 52)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text('250 s');

    // Stats display during animation
    const statsY = 420;
    
    const statsGroup = svg.append('g')
      .attr('transform', `translate(${riverX + riverWidth / 2}, ${statsY})`);

    const currentTimeText = statsGroup.append('text')
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Elapsed: 0.0 s');

    const currentSectionText = statsGroup.append('text')
      .attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('Section: —');

    const currentDistText = statsGroup.append('text')
      .attr('y', 52)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '14px')
      .text('Distance: 0 m');

    // Key insight box
    const insightY = 480;
    
    svg.append('rect')
      .attr('x', 720)
      .attr('y', insightY - 55)
      .attr('width', 620)
      .attr('height', 105)
      .attr('fill', theme.correctBg)
      .attr('stroke', theme.harmColor)
      .attr('stroke-width', 2)
      .attr('rx', 10);

    svg.append('text')
      .attr('x', 1030)
      .attr('y', insightY - 28)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.harmColor)
      .attr('font-size', '15px')
      .attr('font-weight', 'bold')
      .text('💡 Key Insight');

    svg.append('text')
      .attr('x', 1030)
      .attr('y', insightY)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Use Harmonic Mean when averaging rates (e.g., velocity, concentration/time)');

    svg.append('text')
      .attr('x', 1030)
      .attr('y', insightY + 22)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Slower values dominate the result → makes physical sense!');

    // Animation state
    let animationId = null;
    let isAnimating = false;
    let elapsedTime = 0;
    
    const fastTime = 50; // seconds for fast section
    const slowTime = 200; // seconds for slow section
    const totalTime = 250;
    const timeScale = 0.5; // Animation speed factor
    
    function updateBoatPosition(time) {
      let xPos, section, distance;
      
      if (time <= fastTime) {
        // In fast section
        const progress = time / fastTime;
        xPos = riverX + 15 + progress * (riverWidth / 2 - 30);
        section = 'Fast (2.0 m/s)';
        distance = (time * 2.0).toFixed(0);
      } else if (time <= totalTime) {
        // In slow section
        const slowProgress = (time - fastTime) / slowTime;
        xPos = riverX + riverWidth / 2 + slowProgress * (riverWidth / 2 - 30);
        section = 'Slow (0.5 m/s)';
        distance = (100 + (time - fastTime) * 0.5).toFixed(0);
      } else {
        xPos = riverX + riverWidth - 30;
        section = 'Finished!';
        distance = '200';
      }
      
      boatGroup.attr('transform', `translate(${xPos}, ${riverY + riverHeight / 2 + 10})`);
      currentTimeText.text(`Elapsed: ${Math.min(time, totalTime).toFixed(1)} s`);
      currentSectionText.text(`Section: ${section}`);
      currentDistText.text(`Distance: ${distance} m`);
    }
    
    function animateBoat() {
      if (!isAnimating) return;
      
      elapsedTime += timeScale * 2; // Increment time
      
      if (elapsedTime > totalTime + 20) {
        // Reset after pause
        elapsedTime = 0;
      }
      
      updateBoatPosition(elapsedTime);
      
      animationId = setTimeout(animateBoat, 50);
    }

    // Controls
    const controlsDiv = mainDiv.append('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('align-items', 'center');

    const startButton = controlsDiv.append('button')
      .style('padding', '12px 30px')
      .style('font-size', '15px')
      .style('font-weight', 'bold')
      .style('background', theme.buttonBg)
      .style('color', theme.buttonText)
      .style('border', 'none')
      .style('border-radius', '6px')
      .style('cursor', 'pointer')
      .text('▶ Start Animation')
      .on('click', function() {
        if (isAnimating) {
          isAnimating = false;
          startButton.text('▶ Continue');
          if (animationId) clearTimeout(animationId);
        } else {
          isAnimating = true;
          startButton.text('⏸ Pause');
          animateBoat();
        }
      });

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
      .on('click', function() {
        isAnimating = false;
        startButton.text('▶ Start Animation');
        if (animationId) clearTimeout(animationId);
        elapsedTime = 0;
        updateBoatPosition(0);
      });

    // Speed slider
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
      .style('border-radius', '4px')
      .on('change', function() {
        // Adjust time scale based on selection
      });

    speedSelect.append('option').attr('value', '0.25').text('0.25x');
    speedSelect.append('option').attr('value', '0.5').attr('selected', true).text('0.5x');
    speedSelect.append('option').attr('value', '1').text('1x');
    speedSelect.append('option').attr('value', '2').text('2x');
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHarmonicMeanDemo);
  } else {
    createHarmonicMeanDemo();
  }

  // Re-render on theme change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        setTimeout(createHarmonicMeanDemo, 100);
      }
    });
  });
  
  observer.observe(document.body, { attributes: true });
})();
