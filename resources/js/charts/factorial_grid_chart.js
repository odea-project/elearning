/**
 * Factorial Grid Chart - D3.js Visualization
 * Shows a 2x2 factorial design grid with corner points
 * 
 * PLACEHOLDER - To be implemented
 * 
 * Features to implement:
 * - 2D grid showing factor space (X1 vs X2)
 * - Corner points at (-1,-1), (+1,-1), (-1,+1), (+1,+1)
 * - Labels for low/high levels on axes
 * - Optional: animate highlighting of each experimental run
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-factorial-grid';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Factorial Grid Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        grid: isPerformanceMode ? '#404060' : '#cccccc',
        point: isPerformanceMode ? '#4ecdc4' : '#1a4d7a',
        pointHighlight: isPerformanceMode ? '#ff6b6b' : '#702914',
        axis: isPerformanceMode ? '#888888' : '#666666'
    };

    // Dimensions
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    const width = container.clientWidth - margin.left - margin.right || 300;
    const height = 280 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const xScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([-1.5, 1.5])
        .range([height, 0]);

    // Design points
    const designPoints = [
        { x1: -1, x2: -1, label: '(−1, −1)', run: 1 },
        { x1: +1, x2: -1, label: '(+1, −1)', run: 2 },
        { x1: -1, x2: +1, label: '(−1, +1)', run: 3 },
        { x1: +1, x2: +1, label: '(+1, +1)', run: 4 }
    ];

    // Draw grid lines at 0
    svg.append('line')
        .attr('x1', xScale(-1.5))
        .attr('x2', xScale(1.5))
        .attr('y1', yScale(0))
        .attr('y2', yScale(0))
        .attr('stroke', colors.grid)
        .attr('stroke-dasharray', '4,4');

    svg.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(0))
        .attr('y1', yScale(-1.5))
        .attr('y2', yScale(1.5))
        .attr('stroke', colors.grid)
        .attr('stroke-dasharray', '4,4');

    // Draw the factorial square
    svg.append('rect')
        .attr('x', xScale(-1))
        .attr('y', yScale(1))
        .attr('width', xScale(1) - xScale(-1))
        .attr('height', yScale(-1) - yScale(1))
        .attr('fill', 'none')
        .attr('stroke', colors.axis)
        .attr('stroke-width', 2);

    // Draw axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickValues([-1, 0, 1]).tickFormat(d => d === -1 ? 'Low (−1)' : d === 1 ? 'High (+1)' : '0'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    svg.append('g')
        .call(d3.axisLeft(yScale).tickValues([-1, 0, 1]).tickFormat(d => d === -1 ? 'Low (−1)' : d === 1 ? 'High (+1)' : '0'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    // Axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .text('Factor X₁');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -35)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .text('Factor X₂');

    // Draw design points
    svg.selectAll('.design-point')
        .data(designPoints)
        .enter()
        .append('circle')
        .attr('class', 'design-point')
        .attr('cx', d => xScale(d.x1))
        .attr('cy', d => yScale(d.x2))
        .attr('r', 10)
        .attr('fill', colors.point)
        .attr('stroke', colors.text)
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 14)
                .attr('fill', colors.pointHighlight);
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 10)
                .attr('fill', colors.point);
        });

    // Run number labels
    svg.selectAll('.run-label')
        .data(designPoints)
        .enter()
        .append('text')
        .attr('class', 'run-label')
        .attr('x', d => xScale(d.x1))
        .attr('y', d => yScale(d.x2) + 4)
        .attr('text-anchor', 'middle')
        .style('fill', '#ffffff')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .style('pointer-events', 'none')
        .text(d => d.run);

    console.log('Factorial Grid Chart initialized');

})();
