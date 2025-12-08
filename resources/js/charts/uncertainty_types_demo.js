/* -------------------------------------*/
/* UNCERTAINTY TYPES DARTBOARD DEMO    */
/* Interactive dartboard visualization */
/* -------------------------------------*/
(function () {
  function initDartboardChart() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initDartboardChart, 100);
      return;
    }

    const containerId = 'uncertainty-types-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Theme-aware colors
    const theme = {
      // Dart colors - saturated colors that work on both backgrounds
      randomColor: '#0099bb',     // teal-blue - visible on both
      systematicColor: '#cc7700', // darker orange - visible on both  
      modelColor: '#cc3333',      // darker red - visible on both
      perfectColor: '#00aa66',    // green - visible on both
      // Board colors
      boardBg: isPerformanceMode ? '#e0e0e0' : '#2a2a2a',
      boardStroke: isPerformanceMode ? '#888888' : '#444444',
      ringRed: isPerformanceMode ? '#aa2222' : '#8b0000',
      ringGreen: isPerformanceMode ? '#1a5a2a' : '#1a472a',
      bullseye: '#dd3333',
      crosshair: isPerformanceMode ? '#00000044' : '#ffffff44',
      // Text colors
      labelColor: isPerformanceMode ? '#000000' : '#ffffff',
      modelLabelColor: '#cc3333',
      statusColor: isPerformanceMode ? '#444444' : '#aaaaaa',
      meanColor: '#00aa66',
      // Toggle colors
      toggleOffBg: isPerformanceMode ? '#cccccc' : '#333333',
      toggleKnob: isPerformanceMode ? '#333333' : '#ffffff'
    };

    // Configuration
    const config = {
      width: 650,
      height: 520,
      boardRadius: 150,
      ringColors: [theme.ringRed, theme.ringGreen, theme.ringRed, theme.ringGreen, theme.ringRed],
      bullseyeColor: theme.bullseye,
      dartColor: theme.randomColor,
      dartRadius: 8,
      numDarts: 15,
      randomSpread: 30,      // Spread for random uncertainty
      systematicOffset: { x: 55, y: -35 }, // Bias offset
      transitionDuration: 800
    };

    // State
    let state = {
      random: false,
      systematic: false,
      model: false,
      showSecondBoard: false,
      darts: []
    };

    // Generate initial dart positions (perfect throws at center)
    function generateDarts() {
      const darts = [];
      for (let i = 0; i < config.numDarts; i++) {
        darts.push({
          id: i,
          baseX: 0,
          baseY: 0,
          randomOffsetX: (Math.random() - 0.5) * 2 * config.randomSpread,
          randomOffsetY: (Math.random() - 0.5) * 2 * config.randomSpread
        });
      }
      return darts;
    }

    state.darts = generateDarts();

    // Calculate dart position based on active uncertainties
    function getDartPosition(dart, forSecondBoard = false) {
      let x = dart.baseX;
      let y = dart.baseY;

      // Add random uncertainty (spread)
      if (state.random) {
        x += dart.randomOffsetX;
        y += dart.randomOffsetY;
      }

      // Add systematic uncertainty (bias) - applies to both boards
      if (state.systematic) {
        x += config.systematicOffset.x;
        y += config.systematicOffset.y;
      }

      return { x, y };
    }

    // Create main container
    const mainContainer = d3.select(container)
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('gap', '15px');

    // Create toggle controls
    const controlsDiv = mainContainer.append('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('justify-content', 'center')
      .style('flex-wrap', 'wrap');

    // Toggle switch component
    function createToggle(parent, label, color, onChange) {
      const toggleContainer = parent.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '8px');

      const switchLabel = toggleContainer.append('label')
        .style('position', 'relative')
        .style('display', 'inline-block')
        .style('width', '50px')
        .style('height', '26px');

      const input = switchLabel.append('input')
        .attr('type', 'checkbox')
        .style('opacity', '0')
        .style('width', '0')
        .style('height', '0');

      const slider = switchLabel.append('span')
        .style('position', 'absolute')
        .style('cursor', 'pointer')
        .style('top', '0')
        .style('left', '0')
        .style('right', '0')
        .style('bottom', '0')
        .style('background-color', theme.toggleOffBg)
        .style('transition', '0.3s')
        .style('border-radius', '26px');

      slider.append('span')
        .style('position', 'absolute')
        .style('content', '""')
        .style('height', '20px')
        .style('width', '20px')
        .style('left', '3px')
        .style('bottom', '3px')
        .style('background-color', theme.toggleKnob)
        .style('transition', '0.3s')
        .style('border-radius', '50%');

      toggleContainer.append('span')
        .text(label)
        .style('color', color)
        .style('font-weight', 'bold')
        .style('font-size', '0.9em');

      input.on('change', function() {
        const checked = this.checked;
        slider.style('background-color', checked ? color : theme.toggleOffBg);
        slider.select('span')
          .style('transform', checked ? 'translateX(24px)' : 'translateX(0)');
        onChange(checked);
      });

      return input;
    }

    // Create toggles
    createToggle(controlsDiv, 'Random', theme.randomColor, (checked) => {
      state.random = checked;
      if (checked) {
        // Regenerate random offsets for new throw
        state.darts.forEach(d => {
          d.randomOffsetX = (Math.random() - 0.5) * 2 * config.randomSpread;
          d.randomOffsetY = (Math.random() - 0.5) * 2 * config.randomSpread;
        });
      }
      updateDarts();
    });

    createToggle(controlsDiv, 'Systematic', theme.systematicColor, (checked) => {
      state.systematic = checked;
      updateDarts();
    });

    createToggle(controlsDiv, 'Model', theme.modelColor, (checked) => {
      state.model = checked;
      state.showSecondBoard = checked;
      updatePerspective();
      updateDarts();
    });

    // Create SVG container for boards
    const svgContainer = mainContainer.append('div')
      .style('position', 'relative')
      .style('width', config.width + 'px')
      .style('height', config.height + 'px')
      .style('perspective', '1000px');

    // Board wrapper for 3D transform
    const boardWrapper = svgContainer.append('div')
      .attr('class', 'board-wrapper')
      .style('position', 'absolute')
      .style('width', '100%')
      .style('height', '100%')
      .style('transform-style', 'preserve-3d')
      .style('transition', 'transform 0.8s ease-in-out');

    // Create SVG
    const svg = boardWrapper.append('svg')
      .attr('width', config.width)
      .attr('height', config.height)
      .attr('viewBox', `0 0 ${config.width} ${config.height}`)
      .style('position', 'absolute')
      .style('backface-visibility', 'visible');

    // Definitions for gradients and filters
    const defs = svg.append('defs');

    // Drop shadow filter
    const filter = defs.append('filter')
      .attr('id', 'dartShadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feDropShadow')
      .attr('dx', '2')
      .attr('dy', '2')
      .attr('stdDeviation', '2')
      .attr('flood-color', '#000')
      .attr('flood-opacity', '0.5');

    // Board positions
    const board1Center = { x: config.width / 2 - 20, y: config.height / 2 };
    const board2Center = { x: config.width / 2 + 200, y: config.height / 2 - 25 };

    // Draw dartboard function
    function drawDartboard(group, cx, cy, radius, label, isSecondBoard = false) {
      const boardGroup = group.append('g')
        .attr('transform', `translate(${cx}, ${cy})`);

      // Board background
      boardGroup.append('circle')
        .attr('r', radius + 10)
        .attr('fill', theme.boardBg)
        .attr('stroke', theme.boardStroke)
        .attr('stroke-width', 3);

      // Concentric rings
      const ringRadii = [1, 0.8, 0.6, 0.4, 0.2];
      ringRadii.forEach((ratio, i) => {
        boardGroup.append('circle')
          .attr('r', radius * ratio)
          .attr('fill', config.ringColors[i])
          .attr('stroke', isPerformanceMode ? '#666666' : '#333333')
          .attr('stroke-width', 1);
      });

      // Bullseye
      boardGroup.append('circle')
        .attr('r', radius * 0.08)
        .attr('fill', config.bullseyeColor);

      // Crosshair
      boardGroup.append('line')
        .attr('x1', -radius - 5)
        .attr('x2', radius + 5)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', theme.crosshair)
        .attr('stroke-width', 1);

      boardGroup.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', -radius - 5)
        .attr('y2', radius + 5)
        .attr('stroke', theme.crosshair)
        .attr('stroke-width', 1);

      // Label
      boardGroup.append('text')
        .attr('y', radius + 30)
        .attr('text-anchor', 'middle')
        .attr('fill', isSecondBoard ? theme.modelLabelColor : theme.labelColor)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text(label);

      return boardGroup;
    }

    // Main board group
    const mainBoardGroup = svg.append('g').attr('class', 'main-board');
    drawDartboard(mainBoardGroup, board1Center.x, board1Center.y, config.boardRadius, 'Target (Truth)');

    // Second board group (for model uncertainty)
    const secondBoardGroup = svg.append('g')
      .attr('class', 'second-board')
      .style('opacity', 0);
    drawDartboard(secondBoardGroup, board2Center.x, board2Center.y, config.boardRadius * 0.7, 'Wrong Model', true);

    // Darts group
    const dartsGroup = svg.append('g').attr('class', 'darts');

    // Draw darts
    function drawDart(group, x, y, color) {
      const dart = group.append('g')
        .attr('transform', `translate(${x}, ${y})`)
        .attr('filter', 'url(#dartShadow)');

      // Dart body (circle)
      dart.append('circle')
        .attr('r', config.dartRadius)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);

      // Inner highlight
      dart.append('circle')
        .attr('r', config.dartRadius * 0.4)
        .attr('fill', '#fff')
        .attr('opacity', 0.6);

      return dart;
    }

    // Update darts positions
    function updateDarts() {
      // Clear existing darts
      dartsGroup.selectAll('*').remove();

      // Determine which board to target
      const targetCenter = state.model ? board2Center : board1Center;
      const boardRadius = state.model ? config.boardRadius * 0.7 : config.boardRadius;

      // Draw darts
      state.darts.forEach((dart, i) => {
        const pos = getDartPosition(dart, state.model);
        const x = targetCenter.x + pos.x;
        const y = targetCenter.y + pos.y;

        // Determine dart color based on uncertainty type
        let color = theme.randomColor;
        if (state.systematic && !state.model) {
          color = theme.systematicColor; // Orange for systematic bias
        }
        if (state.model) {
          color = theme.modelColor; // Red for model error
        }

        // Animate dart placement
        const dartGroup = dartsGroup.append('g')
          .attr('transform', `translate(${targetCenter.x}, ${targetCenter.y}) scale(0)`)
          .attr('opacity', 0);

        drawDart(dartGroup, 0, 0, color);

        dartGroup.transition()
          .delay(i * 30)
          .duration(300)
          .attr('transform', `translate(${x}, ${y}) scale(1)`)
          .attr('opacity', 1);
      });

      // Update mean indicator
      updateMeanIndicator(targetCenter);
    }

    // Mean indicator
    const meanGroup = svg.append('g').attr('class', 'mean-indicator');

    function updateMeanIndicator(targetCenter) {
      meanGroup.selectAll('*').remove();

      if (!state.random && !state.systematic && !state.model) return;

      // Calculate mean position
      let sumX = 0, sumY = 0;
      state.darts.forEach(dart => {
        const pos = getDartPosition(dart, state.model);
        sumX += pos.x;
        sumY += pos.y;
      });
      const meanX = targetCenter.x + sumX / state.darts.length;
      const meanY = targetCenter.y + sumY / state.darts.length;

      // Draw mean marker
      meanGroup.append('circle')
        .attr('cx', meanX)
        .attr('cy', meanY)
        .attr('r', 12)
        .attr('fill', 'none')
        .attr('stroke', theme.meanColor)
        .attr('stroke-width', 3)
        .attr('opacity', 0)
        .transition()
        .delay(config.numDarts * 30 + 200)
        .duration(400)
        .attr('opacity', 1);

      // Cross in center
      meanGroup.append('line')
        .attr('x1', meanX - 8)
        .attr('x2', meanX + 8)
        .attr('y1', meanY)
        .attr('y2', meanY)
        .attr('stroke', theme.meanColor)
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition()
        .delay(config.numDarts * 30 + 200)
        .duration(400)
        .attr('opacity', 1);

      meanGroup.append('line')
        .attr('x1', meanX)
        .attr('x2', meanX)
        .attr('y1', meanY - 8)
        .attr('y2', meanY + 8)
        .attr('stroke', theme.meanColor)
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition()
        .delay(config.numDarts * 30 + 200)
        .duration(400)
        .attr('opacity', 1);

      // Label
      meanGroup.append('text')
        .attr('x', meanX + 18)
        .attr('y', meanY + 5)
        .attr('fill', theme.meanColor)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('Mean')
        .attr('opacity', 0)
        .transition()
        .delay(config.numDarts * 30 + 200)
        .duration(400)
        .attr('opacity', 1);
    }

    // Update perspective for model uncertainty
    function updatePerspective() {
      if (state.showSecondBoard) {
        // Show second board with animation
        boardWrapper.style('transform', 'rotateY(-15deg) translateX(-60px)');
        
        secondBoardGroup.transition()
          .duration(config.transitionDuration)
          .style('opacity', 1);
          
        // Fade main board slightly
        mainBoardGroup.transition()
          .duration(config.transitionDuration)
          .style('opacity', 0.5);
      } else {
        // Reset to normal view
        boardWrapper.style('transform', 'rotateY(0deg) translateX(0px)');
        
        secondBoardGroup.transition()
          .duration(config.transitionDuration)
          .style('opacity', 0);
          
        mainBoardGroup.transition()
          .duration(config.transitionDuration)
          .style('opacity', 1);
      }
    }

    // Initial draw
    updateDarts();

    // Status text
    const statusDiv = mainContainer.append('div')
      .attr('class', 'status-text')
      .style('text-align', 'center')
      .style('font-size', '0.85em')
      .style('color', theme.statusColor)
      .style('margin-top', '5px')
      .style('min-height', '40px');

    function updateStatus() {
      let status = [];
      if (state.random) status.push(`<span style="color:${theme.randomColor}">Random: Spread around mean</span>`);
      if (state.systematic) status.push(`<span style="color:${theme.systematicColor}">Systematic: Biased from target</span>`);
      if (state.model) status.push(`<span style="color:${theme.modelColor}">Model: Wrong target entirely</span>`);
      
      if (status.length === 0) {
        statusDiv.html(`<span style="color:${theme.perfectColor}">Perfect throws: No uncertainty</span>`);
      } else {
        statusDiv.html(status.join(' | '));
      }
    }

    // Update status when toggles change
    const originalUpdateDarts = updateDarts;
    updateDarts = function() {
      originalUpdateDarts();
      updateStatus();
    };

    updateStatus();
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDartboardChart);
  } else {
    initDartboardChart();
  }

  // Redraw on slide change
  if (typeof Reveal !== 'undefined') {
    Reveal.addEventListener('slidechanged', event => {
      if (event.currentSlide.id === 'types-of-uncertainty') {
        setTimeout(initDartboardChart, 200);
      }
    });
  }

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const container = document.getElementById('uncertainty-types-chart');
      if (container && container.offsetParent !== null) {
        initDartboardChart();
      }
    }, 250);
  });
})();
