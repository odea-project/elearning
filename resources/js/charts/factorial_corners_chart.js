/**
 * Factorial Corners Chart - D3.js Visualization
 * Shows factorial design points at corners vs OFAT path
 * Illustrates why corner sampling is efficient
 * 
 * Features:
 * - 2D design space with factorial corner points
 * - Comparison overlay with OFAT path (faded)
 * - Annotations explaining corner strategy
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-factorial-corners';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Factorial Corners Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        grid: isPerformanceMode ? '#404060' : '#dddddd',
        factorial: isPerformanceMode ? '#4ecdc4' : '#1a4d7a',
        factorialFill: isPerformanceMode ? 'rgba(78, 205, 196, 0.2)' : 'rgba(26, 77, 122, 0.15)',
        ofatFaded: isPerformanceMode ? 'rgba(255, 107, 107, 0.3)' : 'rgba(139, 0, 0, 0.2)',
        axis: isPerformanceMode ? '#888888' : '#666666',
        connector: isPerformanceMode ? '#4ecdc4' : '#1a4d7a'
    };

    // Dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 55 };
    const width = container.clientWidth - margin.left - margin.right || 260;
    const height = 210 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([-1.3, 1.3])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([-1.3, 1.3])
        .range([height, 0]);

    // Draw factorial space (filled square)
    svg.append('rect')
        .attr('x', xScale(-1))
        .attr('y', yScale(1))
        .attr('width', xScale(1) - xScale(-1))
        .attr('height', yScale(-1) - yScale(1))
        .attr('fill', colors.factorialFill)
        .attr('stroke', colors.factorial)
        .attr('stroke-width', 2);

    // Draw connecting lines between factorial points
    const cornerConnections = [
        [[-1, -1], [1, -1]],
        [[1, -1], [1, 1]],
        [[1, 1], [-1, 1]],
        [[-1, 1], [-1, -1]],
        [[-1, -1], [1, 1]],  // Diagonal
        [[-1, 1], [1, -1]]   // Diagonal
    ];

    cornerConnections.forEach(([p1, p2]) => {
        svg.append('line')
            .attr('x1', xScale(p1[0]))
            .attr('x2', xScale(p2[0]))
            .attr('y1', yScale(p1[1]))
            .attr('y2', yScale(p2[1]))
            .attr('stroke', colors.connector)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '3,3')
            .attr('opacity', 0.5);
    });

    // Factorial corner points
    const factorialPoints = [
        { x: -1, y: -1, label: '1' },
        { x: 1, y: -1, label: '2' },
        { x: -1, y: 1, label: '3' },
        { x: 1, y: 1, label: '4' }
    ];

    // Draw factorial points
    svg.selectAll('.factorial-point')
        .data(factorialPoints)
        .enter()
        .append('circle')
        .attr('class', 'factorial-point')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 14)
        .attr('fill', colors.factorial)
        .attr('stroke', colors.text)
        .attr('stroke-width', 2);

    // Point labels
    svg.selectAll('.point-label')
        .data(factorialPoints)
        .enter()
        .append('text')
        .attr('class', 'point-label')
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y) + 5)
        .attr('text-anchor', 'middle')
        .style('fill', '#ffffff')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text(d => d.label);

    // Faded OFAT path for comparison
    svg.append('line')
        .attr('x1', xScale(-0.5))
        .attr('x2', xScale(0.5))
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', colors.ofatFaded)
        .attr('stroke-width', 3);

    svg.append('line')
        .attr('x1', xScale(0.5))
        .attr('x2', xScale(0.5))
        .attr('y1', yScale(0))
        .attr('y2', yScale(0.7))
        .attr('stroke', colors.ofatFaded)
        .attr('stroke-width', 3);

    svg.append('text')
        .attr('x', xScale(0))
        .attr('y', yScale(0) + 20)
        .attr('text-anchor', 'middle')
        .style('fill', colors.ofatFaded)
        .style('font-size', '9px')
        .text('OFAT path');

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickValues([-1, 0, 1]).tickFormat(d => d === -1 ? 'Low' : d === 1 ? 'High' : '0'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    svg.append('g')
        .call(d3.axisLeft(yScale).tickValues([-1, 0, 1]).tickFormat(d => d === -1 ? 'Low' : d === 1 ? 'High' : '0'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    // Axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 38)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '11px')
        .text('Factor X₁');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '11px')
        .text('Factor X₂');

    // Annotation
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .style('fill', colors.factorial)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('4 corner experiments → Full coverage');

    console.log('Factorial Corners Chart initialized');

})();
