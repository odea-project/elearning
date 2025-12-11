/**
 * Design Space Concept Chart - D3.js Visualization
 * Shows the concept of experimental design space (2D representation)
 * 
 * Features:
 * - 2D square representing factor space
 * - Axes labeled with factor names and ranges
 * - Shaded region showing "unexplored" area
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-design-space-concept';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Design Space Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        grid: isPerformanceMode ? '#404060' : '#dddddd',
        spaceColor: isPerformanceMode ? 'rgba(78, 205, 196, 0.2)' : 'rgba(26, 77, 122, 0.15)',
        spaceBorder: isPerformanceMode ? '#4ecdc4' : '#1a4d7a',
        axis: isPerformanceMode ? '#888888' : '#666666',
        optimum: isPerformanceMode ? '#ff6b6b' : '#702914',
        question: isPerformanceMode ? '#ffd93d' : '#d4a012'
    };

    // Dimensions
    const margin = { top: 30, right: 30, bottom: 60, left: 70 };
    const width = container.clientWidth - margin.left - margin.right || 280;
    const height = 240 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([10, 50])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([5, 9])
        .range([height, 0]);

    // Draw the design space (shaded rectangle)
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', colors.spaceColor)
        .attr('stroke', colors.spaceBorder)
        .attr('stroke-width', 2);

    // Grid lines
    svg.selectAll('.grid-v')
        .data([20, 30, 40])
        .enter()
        .append('line')
        .attr('x1', d => xScale(d))
        .attr('x2', d => xScale(d))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', colors.grid)
        .attr('stroke-dasharray', '3,3');

    svg.selectAll('.grid-h')
        .data([6, 7, 8])
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', colors.grid)
        .attr('stroke-dasharray', '3,3');

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(5))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    // Axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 45)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Coagulant Dose (mg/L)');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('pH Value');

    // Unknown optimum marker with question mark
    const optX = xScale(35);
    const optY = yScale(6.5);

    svg.append('circle')
        .attr('cx', optX)
        .attr('cy', optY)
        .attr('r', 18)
        .attr('fill', colors.optimum)
        .attr('opacity', 0.7);

    svg.append('text')
        .attr('x', optX)
        .attr('y', optY + 6)
        .attr('text-anchor', 'middle')
        .style('fill', '#ffffff')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('?');

    // Label for design space
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('fill', colors.spaceBorder)
        .style('font-size', '11px')
        .style('font-style', 'italic')
        .text('Design Space: All possible experiments');

    console.log('Design Space Concept Chart initialized');

})();
