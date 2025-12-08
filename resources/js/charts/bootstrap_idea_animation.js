/* -------------------------------------*/
/* BOOTSTRAP IDEA ANIMATION             */
/* Shows resampling with replacement    */
/* Values fly from sample to bootstrap  */
/* -------------------------------------*/
(function () {
  function initBootstrapIdea() {
    // Check dependencies
    if (typeof d3 === 'undefined') {
      setTimeout(initBootstrapIdea, 100);
      return;
    }

    const containerId = 'bootstrap-idea-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Detect performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');

    // Theme-aware colors
    const theme = {
      sampleBoxBg: isPerformanceMode ? '#d4e6f1' : '#1a3a5c',
      sampleBoxBorder: isPerformanceMode ? '#2874a6' : '#4a9eff',
      bootstrapBoxBg: isPerformanceMode ? '#d5f5e3' : '#1a4a3c',
      bootstrapBoxBorder: isPerformanceMode ? '#1e8449' : '#44dd88',
      valueColors: isPerformanceMode 
        ? ['#c0392b', '#2874a6', '#1e8449', '#d35400', '#8e44ad', '#16a085', '#c0392b', '#2874a6']
        : ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#a55eea', '#26de81', '#fd9644', '#778beb'],
      flyingColor: isPerformanceMode ? '#e74c3c' : '#ff4757',
      titleColor: isPerformanceMode ? '#1a1a1a' : '#ffffff',
      textColor: isPerformanceMode ? '#333333' : '#cccccc',
      labelColor: isPerformanceMode ? '#2c3e50' : '#ffffff',
      bgColor: isPerformanceMode ? '#f8f9fa' : '#1a1a2e',
      buttonBg: isPerformanceMode ? '#3498db' : '#4a9eff',
      buttonHover: isPerformanceMode ? '#2980b9' : '#3388dd',
      arrowColor: isPerformanceMode ? '#7f8c8d' : '#888888'
    };

    // Original data
    const originalData = [12.3, 15.1, 11.8, 14.2, 13.5, 16.8, 12.9, 14.7];
    
    // State
    let bootstrapSamples = [];
    let currentBootstrapIndex = 0;
    let isAnimating = false;
    let animationSpeed = 300;

    // Layout
    const totalWidth = 1300;
    const totalHeight = 620;
    const sampleBoxX = 80;
    const sampleBoxY = 120;
    const sampleBoxWidth = 340;
    const sampleBoxHeight = 380;
    
    const bootstrapStartX = 520;
    const bootstrapBoxWidth = 180;
    const bootstrapBoxHeight = 220;
    const bootstrapGap = 25;

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
      .text('Bootstrap: Resampling with Replacement');

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

    // ===== SAMPLE BOX (LEFT) =====
    svg.append('text')
      .attr('x', sampleBoxX + sampleBoxWidth / 2)
      .attr('y', sampleBoxY - 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text('Original Sample (n=8)');

    // Sample box
    svg.append('rect')
      .attr('x', sampleBoxX)
      .attr('y', sampleBoxY)
      .attr('width', sampleBoxWidth)
      .attr('height', sampleBoxHeight)
      .attr('fill', theme.sampleBoxBg)
      .attr('stroke', theme.sampleBoxBorder)
      .attr('stroke-width', 3)
      .attr('rx', 12);

    // Box label
    svg.append('text')
      .attr('x', sampleBoxX + sampleBoxWidth / 2)
      .attr('y', sampleBoxY + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.labelColor)
      .attr('font-size', '14px')
      .attr('opacity', 0.8)
      .text('📦 Sample Box');

    // Draw original values in sample box
    const valueRadius = 32;
    const cols = 4;
    const rows = 2;
    const spacingX = sampleBoxWidth / (cols + 1);
    const spacingY = (sampleBoxHeight - 80) / (rows + 1);

    const sampleGroup = svg.append('g').attr('class', 'sample-values');
    
    originalData.forEach((val, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = sampleBoxX + spacingX * (col + 1);
      const cy = sampleBoxY + 60 + spacingY * (row + 1);

      const g = sampleGroup.append('g')
        .attr('class', `original-value-${i}`)
        .attr('data-index', i);

      g.append('circle')
        .attr('cx', cx)
        .attr('cy', cy)
        .attr('r', valueRadius)
        .attr('fill', theme.valueColors[i])
        .attr('stroke', isPerformanceMode ? '#333' : '#fff')
        .attr('stroke-width', 2)
        .style('filter', isPerformanceMode ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))');

      g.append('text')
        .attr('x', cx)
        .attr('y', cy)
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('fill', isPerformanceMode ? '#fff' : '#fff')
        .attr('font-size', '15px')
        .attr('font-weight', 'bold')
        .text(val.toFixed(1));

      // Index label below
      g.append('text')
        .attr('x', cx)
        .attr('y', cy + valueRadius + 14)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '11px')
        .text(`x${i + 1}`);
    });

    // Mean display under sample box
    const originalMean = d3.mean(originalData);
    svg.append('text')
      .attr('x', sampleBoxX + sampleBoxWidth / 2)
      .attr('y', sampleBoxY + sampleBoxHeight + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '16px')
      .html(`Mean: ${originalMean.toFixed(2)} mg/L`);

    // ===== ARROW =====
    const arrowStartX = sampleBoxX + sampleBoxWidth + 20;
    const arrowEndX = bootstrapStartX - 20;
    const arrowY = sampleBoxY + sampleBoxHeight / 2;

    // Arrow with "with replacement" label
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead-idea')
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
      .attr('d', `M${arrowStartX},${arrowY} L${arrowEndX},${arrowY}`)
      .attr('stroke', theme.arrowColor)
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowhead-idea)');

    svg.append('text')
      .attr('x', (arrowStartX + arrowEndX) / 2)
      .attr('y', arrowY - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .attr('font-style', 'italic')
      .text('resample with');
    
    svg.append('text')
      .attr('x', (arrowStartX + arrowEndX) / 2)
      .attr('y', arrowY + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .attr('font-style', 'italic')
      .text('replacement');

    // ===== BOOTSTRAP BOXES (RIGHT) =====
    svg.append('text')
      .attr('x', bootstrapStartX + (bootstrapBoxWidth * 2 + bootstrapGap) / 2)
      .attr('y', sampleBoxY - 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '20px')
      .attr('font-weight', 'bold')
      .text('Bootstrap Resamples');

    // Create 4 bootstrap boxes (2x2 grid)
    const bootstrapBoxes = [];
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const bx = bootstrapStartX + col * (bootstrapBoxWidth + bootstrapGap);
      const by = sampleBoxY + row * (bootstrapBoxHeight + bootstrapGap);

      const boxG = svg.append('g').attr('class', `bootstrap-box-${i}`);
      
      boxG.append('rect')
        .attr('x', bx)
        .attr('y', by)
        .attr('width', bootstrapBoxWidth)
        .attr('height', bootstrapBoxHeight)
        .attr('fill', theme.bootstrapBoxBg)
        .attr('stroke', theme.bootstrapBoxBorder)
        .attr('stroke-width', 2)
        .attr('rx', 8)
        .attr('opacity', 0.5);

      boxG.append('text')
        .attr('x', bx + bootstrapBoxWidth / 2)
        .attr('y', by + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.labelColor)
        .attr('font-size', '13px')
        .attr('opacity', 0.7)
        .text(`Resample ${i + 1}`);

      // Mean display
      boxG.append('text')
        .attr('class', `bootstrap-mean-${i}`)
        .attr('x', bx + bootstrapBoxWidth / 2)
        .attr('y', by + bootstrapBoxHeight - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.textColor)
        .attr('font-size', '12px')
        .text('Mean: —');

      bootstrapBoxes.push({
        x: bx,
        y: by,
        width: bootstrapBoxWidth,
        height: bootstrapBoxHeight,
        values: [],
        group: boxG
      });
    }

    // ===== STATISTICS PANEL =====
    const statsX = bootstrapStartX + (bootstrapBoxWidth * 2 + bootstrapGap) + 60;
    const statsY = sampleBoxY + 20;

    svg.append('rect')
      .attr('x', statsX)
      .attr('y', statsY)
      .attr('width', 250)
      .attr('height', 200)
      .attr('fill', isPerformanceMode ? '#ecf0f1' : '#252540')
      .attr('stroke', isPerformanceMode ? '#bdc3c7' : '#444466')
      .attr('stroke-width', 2)
      .attr('rx', 8);

    svg.append('text')
      .attr('x', statsX + 125)
      .attr('y', statsY + 30)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.titleColor)
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Bootstrap Statistics');

    const statsGroup = svg.append('g');
    
    const meansListText = statsGroup.append('text')
      .attr('x', statsX + 20)
      .attr('y', statsY + 60)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Resample means:');

    const meansList = statsGroup.append('text')
      .attr('x', statsX + 20)
      .attr('y', statsY + 85)
      .attr('fill', theme.valueColors[0])
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text('—');

    const bootstrapSELabel = statsGroup.append('text')
      .attr('x', statsX + 20)
      .attr('y', statsY + 125)
      .attr('fill', theme.textColor)
      .attr('font-size', '13px')
      .text('Bootstrap SE:');

    const bootstrapSEValue = statsGroup.append('text')
      .attr('x', statsX + 20)
      .attr('y', statsY + 150)
      .attr('fill', isPerformanceMode ? '#1e8449' : '#44dd88')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('—');

    const infoText = statsGroup.append('text')
      .attr('x', statsX + 20)
      .attr('y', statsY + 180)
      .attr('fill', theme.textColor)
      .attr('font-size', '11px')
      .attr('opacity', 0.7)
      .text('(SD of resample means)');

    // ===== ANIMATION LAYER =====
    const animationLayer = svg.append('g').attr('class', 'animation-layer');

    // ===== CONTROLS =====
    const controlsDiv = mainDiv.append('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('margin-top', '10px')
      .style('align-items', 'center');

    const sampleButton = controlsDiv.append('button')
      .style('padding', '14px 35px')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('background', theme.buttonBg)
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .style('transition', 'all 0.2s')
      .text('🎲 Draw Resample')
      .on('click', drawOneResample)
      .on('mouseover', function() { d3.select(this).style('background', theme.buttonHover); })
      .on('mouseout', function() { d3.select(this).style('background', theme.buttonBg); });

    const resetButton = controlsDiv.append('button')
      .style('padding', '14px 25px')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('background', isPerformanceMode ? '#7f8c8d' : '#555566')
      .style('color', '#ffffff')
      .style('border', 'none')
      .style('border-radius', '8px')
      .style('cursor', 'pointer')
      .text('↺ Reset')
      .on('click', reset);

    // Speed selector
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
      .style('border-radius', '6px')
      .style('border', '1px solid ' + theme.arrowColor)
      .on('change', function() {
        animationSpeed = +this.value;
      });

    speedSelect.append('option').attr('value', '500').text('Slow');
    speedSelect.append('option').attr('value', '300').attr('selected', true).text('Medium');
    speedSelect.append('option').attr('value', '100').text('Fast');
    speedSelect.append('option').attr('value', '30').text('Very Fast');

    // ===== FUNCTIONS =====
    function generateResample() {
      const resample = [];
      for (let i = 0; i < originalData.length; i++) {
        const idx = Math.floor(Math.random() * originalData.length);
        resample.push({
          value: originalData[idx],
          sourceIndex: idx
        });
      }
      return resample;
    }

    function getSourcePosition(sourceIndex) {
      const col = sourceIndex % cols;
      const row = Math.floor(sourceIndex / cols);
      return {
        x: sampleBoxX + spacingX * (col + 1),
        y: sampleBoxY + 60 + spacingY * (row + 1)
      };
    }

    function getTargetPosition(boxIndex, valueIndex) {
      const box = bootstrapBoxes[boxIndex];
      const smallRadius = 18;
      const bCols = 4;
      const bSpacingX = box.width / (bCols + 1);
      const bSpacingY = (box.height - 60) / 3;
      const col = valueIndex % bCols;
      const row = Math.floor(valueIndex / bCols);
      return {
        x: box.x + bSpacingX * (col + 1),
        y: box.y + 35 + bSpacingY * (row + 1)
      };
    }

    async function animateValue(sourceIndex, boxIndex, valueIndex, value) {
      return new Promise(resolve => {
        const source = getSourcePosition(sourceIndex);
        const target = getTargetPosition(boxIndex, valueIndex);

        // Highlight source
        svg.select(`.original-value-${sourceIndex} circle`)
          .transition()
          .duration(animationSpeed * 0.3)
          .attr('r', valueRadius + 8)
          .transition()
          .duration(animationSpeed * 0.3)
          .attr('r', valueRadius);

        // Create flying copy
        const flyingG = animationLayer.append('g');
        
        flyingG.append('circle')
          .attr('cx', source.x)
          .attr('cy', source.y)
          .attr('r', valueRadius)
          .attr('fill', theme.valueColors[sourceIndex])
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .attr('opacity', 0.9)
          .style('filter', isPerformanceMode ? 'none' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))');

        flyingG.append('text')
          .attr('x', source.x)
          .attr('y', source.y)
          .attr('text-anchor', 'middle')
          .attr('dy', '0.35em')
          .attr('fill', '#fff')
          .attr('font-size', '15px')
          .attr('font-weight', 'bold')
          .text(value.toFixed(1));

        // Animate to target
        flyingG.transition()
          .duration(animationSpeed)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${target.x - source.x}, ${target.y - source.y}) scale(0.6)`)
          .on('end', () => {
            flyingG.remove();
            
            // Add value to bootstrap box
            const smallRadius = 18;
            const box = bootstrapBoxes[boxIndex];
            
            box.group.append('circle')
              .attr('cx', target.x)
              .attr('cy', target.y)
              .attr('r', 0)
              .attr('fill', theme.valueColors[sourceIndex])
              .attr('stroke', isPerformanceMode ? '#333' : '#fff')
              .attr('stroke-width', 1.5)
              .transition()
              .duration(100)
              .attr('r', smallRadius);

            box.group.append('text')
              .attr('x', target.x)
              .attr('y', target.y)
              .attr('text-anchor', 'middle')
              .attr('dy', '0.35em')
              .attr('fill', '#fff')
              .attr('font-size', '11px')
              .attr('font-weight', 'bold')
              .attr('opacity', 0)
              .text(value.toFixed(1))
              .transition()
              .duration(100)
              .attr('opacity', 1);

            resolve();
          });
      });
    }

    async function drawOneResample() {
      if (isAnimating) return;
      if (currentBootstrapIndex >= 4) {
        // All boxes full, show message or reset
        return;
      }

      isAnimating = true;
      sampleButton.style('opacity', '0.6').style('pointer-events', 'none');

      const resample = generateResample();
      const boxIndex = currentBootstrapIndex;

      // Highlight active box
      bootstrapBoxes[boxIndex].group.select('rect')
        .transition()
        .duration(200)
        .attr('opacity', 1)
        .attr('stroke-width', 3);

      // Animate each value
      for (let i = 0; i < resample.length; i++) {
        await animateValue(resample[i].sourceIndex, boxIndex, i, resample[i].value);
        await new Promise(r => setTimeout(r, animationSpeed * 0.2));
      }

      // Calculate and display mean
      const mean = d3.mean(resample, d => d.value);
      bootstrapSamples.push(mean);
      
      svg.select(`.bootstrap-mean-${boxIndex}`)
        .text(`Mean: ${mean.toFixed(2)}`);

      // Update statistics
      updateStatistics();

      currentBootstrapIndex++;
      
      if (currentBootstrapIndex >= 4) {
        sampleButton.text('✓ All Boxes Full').style('background', isPerformanceMode ? '#27ae60' : '#44dd88');
      } else {
        sampleButton.style('opacity', '1').style('pointer-events', 'auto');
      }
      
      isAnimating = false;
    }

    function updateStatistics() {
      if (bootstrapSamples.length === 0) {
        meansList.text('—');
        bootstrapSEValue.text('—');
        return;
      }

      const meansStr = bootstrapSamples.map(m => m.toFixed(2)).join(', ');
      meansList.text(meansStr);

      if (bootstrapSamples.length >= 2) {
        const se = d3.deviation(bootstrapSamples);
        bootstrapSEValue.text(se.toFixed(3) + ' mg/L');
      }
    }

    function reset() {
      isAnimating = false;
      currentBootstrapIndex = 0;
      bootstrapSamples = [];

      // Clear bootstrap boxes
      bootstrapBoxes.forEach((box, i) => {
        box.group.selectAll('circle').remove();
        box.group.selectAll('text:not(:first-child)').remove();
        box.group.select('rect')
          .attr('opacity', 0.5)
          .attr('stroke-width', 2);
        svg.select(`.bootstrap-mean-${i}`).text('Mean: —');
      });

      // Clear animation layer
      animationLayer.selectAll('*').remove();

      // Reset button
      sampleButton
        .text('🎲 Draw Resample')
        .style('opacity', '1')
        .style('pointer-events', 'auto')
        .style('background', theme.buttonBg);

      // Reset statistics
      updateStatistics();
    }
  }

  // Initialize
  function init() {
    initBootstrapIdea();
    
    if (typeof Reveal !== 'undefined') {
      Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#bootstrap-idea-chart')) {
          setTimeout(initBootstrapIdea, 100);
        }
      });
    }

    // Re-init on performance mode toggle
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const container = document.getElementById('bootstrap-idea-chart');
          if (container && container.offsetParent !== null) {
            initBootstrapIdea();
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
