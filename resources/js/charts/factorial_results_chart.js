/**
 * Factorial Results Chart - D3.js Visualization
 * Shows a 2x2 factorial design with response values at each corner
 * 
 * Features:
 * - 2D grid showing factor space
 * - Response values displayed at each corner point
 * - Color intensity based on response magnitude
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-results-visualization';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Factorial Results Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        grid: isPerformanceMode ? '#404060' : '#cccccc',
        lowValue: isPerformanceMode ? '#2d4a6d' : '#cce5ff',
        highValue: isPerformanceMode ? '#ff6b6b' : '#702914',
        axis: isPerformanceMode ? '#888888' : '#666666'
    };

    // Dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = container.clientWidth - margin.left - margin.right || 280;
    const height = 240 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Experimental data
    const data = [
        { x1: -1, x2: -1, response: 12.3 },
        { x1: +1, x2: -1, response: 18.7 },
        { x1: -1, x2: +1, response: 15.1 },
        { x1: +1, x2: +1, response: 28.9 }
    ];

    // Scales
    const xScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([height, 0]);

    // Color scale for response values
    const colorScale = d3.scaleLinear()
        .domain([d3.min(data, d => d.response), d3.max(data, d => d.response)])
        .range([colors.lowValue, colors.highValue]);

    // Draw the factorial square
    svg.append('rect')
        .attr('x', xScale(-1))
        .attr('y', yScale(1))
        .attr('width', xScale(1) - xScale(-1))
        .attr('height', yScale(-1) - yScale(1))
        .attr('fill', 'none')
        .attr('stroke', colors.axis)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

    // Draw axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickValues([-1, 1]).tickFormat(d => d === -1 ? '15°C' : '25°C'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '11px');

    svg.append('g')
        .call(d3.axisLeft(yScale).tickValues([-1, 1]).tickFormat(d => d === -1 ? '50 mg/L' : '150 mg/L'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '11px');

    // Axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Temperature');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Carbon Source');

    // Draw data points with response values
    const pointRadius = 28;

    svg.selectAll('.data-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'data-point')
        .attr('cx', d => xScale(d.x1))
        .attr('cy', d => yScale(d.x2))
        .attr('r', pointRadius)
        .attr('fill', d => colorScale(d.response))
        .attr('stroke', colors.text)
        .attr('stroke-width', 2)
        .attr('opacity', 0.9);

    // Response value labels
    svg.selectAll('.response-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'response-label')
        .attr('x', d => xScale(d.x1))
        .attr('y', d => yScale(d.x2) + 5)
        .attr('text-anchor', 'middle')
        .style('fill', d => d.response > 20 ? '#ffffff' : colors.text)
        .style('font-size', '13px')
        .style('font-weight', 'bold')
        .text(d => d.response.toFixed(1));

    // Legend
    const legendWidth = 15;
    const legendHeight = height * 0.6;
    const legendX = width + 10;
    const legendY = (height - legendHeight) / 2;

    // Gradient for legend
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'response-gradient')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors.lowValue);

    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors.highValue);

    svg.append('rect')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('width', legendWidth)
        .attr('height', legendHeight)
        .style('fill', 'url(#response-gradient)');

    // Legend labels
    svg.append('text')
        .attr('x', legendX + legendWidth + 5)
        .attr('y', legendY + 5)
        .style('fill', colors.text)
        .style('font-size', '9px')
        .text('High');

    svg.append('text')
        .attr('x', legendX + legendWidth + 5)
        .attr('y', legendY + legendHeight)
        .style('fill', colors.text)
        .style('font-size', '9px')
        .text('Low');

    console.log('Factorial Results Chart initialized');

})();
