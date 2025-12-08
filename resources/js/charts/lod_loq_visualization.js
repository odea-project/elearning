/**
 * LOD/LOQ Visualization with Alpha/Beta Error
 * Shows overlapping distributions for blank and signal
 * Demonstrates detection limit concepts
 */

(function() {
  const containerId = 'lod-loq-chart';
  
  function createLodLoqChart() {
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
      blankColor: isPerformanceMode ? '#3498db' : '#5dade2',
      lodColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      loqColor: isPerformanceMode ? '#27ae60' : '#4ecdc4',
      alphaColor: isPerformanceMode ? '#e74c3c' : '#ff6b6b',
      betaColor: isPerformanceMode ? '#9b59b6' : '#bb8fce',
      gridColor: isPerformanceMode ? '#cccccc' : '#444444'
    };

    // Layout
    const width = 780;
    const height = 720;
    const margin = { top: 50, right: 40, bottom: 80, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', theme.bgColor)
      .attr('rx', 8);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Parameters
    const blankMean = 0;
    const blankSD = 1;
    const lodMean = 3.29 * blankSD; // LOD at 3.29σ
    const loqMean = 10 * blankSD; // LOQ at 10σ
    const signalSD = blankSD; // Assume same SD for signal

    // Scales
    const xScale = d3.scaleLinear()
      .domain([-3, 14])
      .range([0, plotWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 0.45])
      .range([plotHeight, 0]);

    // Normal distribution function
    function normalPDF(x, mean, sd) {
      const exp = -0.5 * Math.pow((x - mean) / sd, 2);
      return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exp);
    }

    // Generate distribution data
    function generateDistribution(mean, sd, xMin, xMax) {
      const data = [];
      for (let x = xMin; x <= xMax; x += 0.05) {
        data.push({ x: x, y: normalPDF(x, mean, sd) });
      }
      return data;
    }

    // Area generator
    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(plotHeight)
      .y1(d => yScale(d.y))
      .curve(d3.curveNatural);

    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveNatural);

    // Blank distribution
    const blankData = generateDistribution(blankMean, blankSD, -3, 6);
    
    g.append('path')
      .datum(blankData)
      .attr('d', area)
      .attr('fill', theme.blankColor)
      .attr('opacity', 0.3);

    g.append('path')
      .datum(blankData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.blankColor)
      .attr('stroke-width', 2.5);

    // LOD distribution
    const lodData = generateDistribution(lodMean, signalSD, 0, 8);
    
    g.append('path')
      .datum(lodData)
      .attr('d', area)
      .attr('fill', theme.lodColor)
      .attr('opacity', 0.25);

    g.append('path')
      .datum(lodData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.lodColor)
      .attr('stroke-width', 2.5);

    // LOQ distribution
    const loqData = generateDistribution(loqMean, signalSD, 5, 14);
    
    g.append('path')
      .datum(loqData)
      .attr('d', area)
      .attr('fill', theme.loqColor)
      .attr('opacity', 0.25);

    g.append('path')
      .datum(loqData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.loqColor)
      .attr('stroke-width', 2.5);

    // Critical value line (decision threshold)
    const criticalValue = blankMean + 1.645 * blankSD; // ~95% one-sided
    
    g.append('line')
      .attr('x1', xScale(criticalValue))
      .attr('x2', xScale(criticalValue))
      .attr('y1', 0)
      .attr('y2', plotHeight)
      .attr('stroke', theme.textColor)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,4');

    // Alpha error region (false positive)
    const alphaData = blankData.filter(d => d.x >= criticalValue);
    if (alphaData.length > 1) {
      g.append('path')
        .datum(alphaData)
        .attr('d', area)
        .attr('fill', theme.alphaColor)
        .attr('opacity', 0.5);
    }

    // Beta error region (false negative) - for LOD distribution
    const betaData = lodData.filter(d => d.x <= criticalValue);
    if (betaData.length > 1) {
      g.append('path')
        .datum(betaData)
        .attr('d', area)
        .attr('fill', theme.betaColor)
        .attr('opacity', 0.5);
    }

    // Vertical lines for means
    // Blank mean
    g.append('line')
      .attr('x1', xScale(blankMean))
      .attr('x2', xScale(blankMean))
      .attr('y1', yScale(normalPDF(blankMean, blankMean, blankSD)))
      .attr('y2', plotHeight)
      .attr('stroke', theme.blankColor)
      .attr('stroke-width', 2);

    // LOD mean
    g.append('line')
      .attr('x1', xScale(lodMean))
      .attr('x2', xScale(lodMean))
      .attr('y1', yScale(normalPDF(lodMean, lodMean, signalSD)))
      .attr('y2', plotHeight)
      .attr('stroke', theme.lodColor)
      .attr('stroke-width', 2);

    // LOQ mean
    g.append('line')
      .attr('x1', xScale(loqMean))
      .attr('x2', xScale(loqMean))
      .attr('y1', yScale(normalPDF(loqMean, loqMean, signalSD)))
      .attr('y2', plotHeight)
      .attr('stroke', theme.loqColor)
      .attr('stroke-width', 2);

    // Labels
    // Blank label
    g.append('text')
      .attr('x', xScale(blankMean))
      .attr('y', yScale(normalPDF(blankMean, blankMean, blankSD)) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.blankColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('Blank');

    // LOD label
    g.append('text')
      .attr('x', xScale(lodMean))
      .attr('y', yScale(normalPDF(lodMean, lodMean, signalSD)) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.lodColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('LOD');

    // LOQ label
    g.append('text')
      .attr('x', xScale(loqMean))
      .attr('y', yScale(normalPDF(loqMean, loqMean, signalSD)) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.loqColor)
      .attr('font-size', '13px')
      .attr('font-weight', 'bold')
      .text('LOQ');

    // Critical value label
    g.append('text')
      .attr('x', xScale(criticalValue))
      .attr('y', -8)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '11px')
      .text('Decision threshold');

    // Alpha/Beta annotations
    // Alpha arrow and label
    const alphaX = xScale(criticalValue + 0.8);
    const alphaY = yScale(0.08);
    
    g.append('text')
      .attr('x', alphaX)
      .attr('y', alphaY)
      .attr('text-anchor', 'start')
      .attr('fill', theme.alphaColor)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('α error');

    g.append('text')
      .attr('x', alphaX)
      .attr('y', alphaY + 15)
      .attr('text-anchor', 'start')
      .attr('fill', theme.alphaColor)
      .attr('font-size', '10px')
      .text('(false positive)');

    // Beta arrow and label
    const betaX = xScale(lodMean - 2);
    const betaY = yScale(0.12);
    
    g.append('text')
      .attr('x', betaX)
      .attr('y', betaY)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.betaColor)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('β error');

    g.append('text')
      .attr('x', betaX)
      .attr('y', betaY + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.betaColor)
      .attr('font-size', '10px')
      .text('(false negative)');

    // Distance annotations
    // 3.29σ annotation for LOD
    const annotY = plotHeight + 25;
    
    g.append('line')
      .attr('x1', xScale(blankMean))
      .attr('x2', xScale(lodMean))
      .attr('y1', annotY)
      .attr('y2', annotY)
      .attr('stroke', theme.lodColor)
      .attr('stroke-width', 2)
      .attr('marker-start', 'url(#arrowLeft)')
      .attr('marker-end', 'url(#arrowRight)');

    g.append('text')
      .attr('x', xScale((blankMean + lodMean) / 2))
      .attr('y', annotY - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.lodColor)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('3.29σ');

    // 10σ annotation for LOQ
    g.append('line')
      .attr('x1', xScale(blankMean))
      .attr('x2', xScale(loqMean))
      .attr('y1', annotY + 18)
      .attr('y2', annotY + 18)
      .attr('stroke', theme.loqColor)
      .attr('stroke-width', 2);

    g.append('text')
      .attr('x', xScale((blankMean + loqMean) / 2))
      .attr('y', annotY + 13)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.loqColor)
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('10σ');

    // Arrow markers
    const defs = svg.append('defs');
    
    defs.append('marker')
      .attr('id', 'arrowRight')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', theme.lodColor);

    defs.append('marker')
      .attr('id', 'arrowLeft')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 2)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M10,-5L0,0L10,5')
      .attr('fill', theme.lodColor);

    // X-axis
    g.append('g')
      .attr('transform', `translate(0, ${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(8).tickFormat(d => d + 'σ'))
      .selectAll('text')
      .attr('fill', theme.textColor)
      .attr('font-size', '11px');

    g.selectAll('.domain, .tick line')
      .attr('stroke', theme.axisColor);

    // X-axis label
    svg.append('text')
      .attr('x', margin.left + plotWidth / 2)
      .attr('y', height - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .text('Signal (in units of σ_blank)');

    // Y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + plotHeight / 2))
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.textColor)
      .attr('font-size', '12px')
      .text('Probability density');

    // Legend box
    const legendX = plotWidth - 120;
    const legendY = 10;
    
    g.append('rect')
      .attr('x', legendX - 5)
      .attr('y', legendY - 5)
      .attr('width', 130)
      .attr('height', 75)
      .attr('fill', theme.bgColor)
      .attr('stroke', theme.gridColor)
      .attr('stroke-width', 1)
      .attr('rx', 4)
      .attr('opacity', 0.9);

    // Legend items
    const legendItems = [
      { color: theme.blankColor, label: 'Blank (μ = 0)' },
      { color: theme.lodColor, label: 'LOD (μ = 3.29σ)' },
      { color: theme.loqColor, label: 'LOQ (μ = 10σ)' }
    ];

    legendItems.forEach((item, i) => {
      g.append('rect')
        .attr('x', legendX)
        .attr('y', legendY + i * 22)
        .attr('width', 15)
        .attr('height', 12)
        .attr('fill', item.color)
        .attr('opacity', 0.6);

      g.append('text')
        .attr('x', legendX + 22)
        .attr('y', legendY + i * 22 + 10)
        .attr('fill', theme.textColor)
        .attr('font-size', '11px')
        .text(item.label);
    });
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLodLoqChart);
  } else {
    createLodLoqChart();
  }

  // Re-render on theme change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        setTimeout(createLodLoqChart, 100);
      }
    });
  });
  
  observer.observe(document.body, { attributes: true });
})();
