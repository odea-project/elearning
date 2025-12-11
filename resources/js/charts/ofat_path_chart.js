/**
 * OFAT Path Chart - D3.js Visualization
 * Shows how OFAT explores only thin slices of the design space
 * 
 * Features:
 * - 2D design space
 * - OFAT path shown as orthogonal lines along axes
 * - Large shaded "unexplored" region
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-ofat-path';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`OFAT Path Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        unexplored: isPerformanceMode ? 'rgba(139, 0, 0, 0.2)' : 'rgba(139, 0, 0, 0.1)',
        unexploredBorder: isPerformanceMode ? '#ff6b6b' : '#8B0000',
        ofatPath: isPerformanceMode ? '#4ecdc4' : '#1a4d7a',
        ofatPoint: isPerformanceMode ? '#ffd93d' : '#d4a012',
        startPoint: isPerformanceMode ? '#888888' : '#666666',
        axis: isPerformanceMode ? '#888888' : '#666666'
    };

    // Dimensions
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = container.clientWidth - margin.left - margin.right || 260;
    const height = 210 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales (normalized 0-1 for simplicity)
    const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    // Draw the design space (unexplored region)
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', colors.unexplored)
        .attr('stroke', colors.unexploredBorder)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4');

    // OFAT path data
    const ofatPath = [
        { x: 0.3, y: 0.5 },  // Start point
        { x: 0.3, y: 0.5 },  // Horizontal line start
        { x: 0.7, y: 0.5 },  // After varying X (found optimum at 0.7)
        { x: 0.7, y: 0.5 },  // Vertical line start
        { x: 0.7, y: 0.8 }   // After varying Y (found optimum at 0.8)
    ];

    // Draw OFAT horizontal path
    svg.append('line')
        .attr('x1', xScale(0.3))
        .attr('x2', xScale(0.7))
        .attr('y1', yScale(0.5))
        .attr('y2', yScale(0.5))
        .attr('stroke', colors.ofatPath)
        .attr('stroke-width', 4)
        .attr('marker-end', 'url(#arrowhead)');

    // Draw OFAT vertical path
    svg.append('line')
        .attr('x1', xScale(0.7))
        .attr('x2', xScale(0.7))
        .attr('y1', yScale(0.5))
        .attr('y2', yScale(0.8))
        .attr('stroke', colors.ofatPath)
        .attr('stroke-width', 4)
        .attr('marker-end', 'url(#arrowhead)');

    // Arrow marker definition
    svg.append('defs')
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', colors.ofatPath);

    // Start point
    svg.append('circle')
        .attr('cx', xScale(0.3))
        .attr('cy', yScale(0.5))
        .attr('r', 6)
        .attr('fill', colors.startPoint);

    svg.append('text')
        .attr('x', xScale(0.3))
        .attr('y', yScale(0.5) + 20)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '9px')
        .text('Start');

    // Intermediate point
    svg.append('circle')
        .attr('cx', xScale(0.7))
        .attr('cy', yScale(0.5))
        .attr('r', 6)
        .attr('fill', colors.ofatPoint);

    // Final "optimum"
    svg.append('circle')
        .attr('cx', xScale(0.7))
        .attr('cy', yScale(0.8))
        .attr('r', 8)
        .attr('fill', colors.ofatPoint)
        .attr('stroke', colors.text)
        .attr('stroke-width', 2);

    svg.append('text')
        .attr('x', xScale(0.7) + 15)
        .attr('y', yScale(0.8) + 4)
        .style('fill', colors.ofatPoint)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text('OFAT "Optimum"');

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickValues([0, 0.5, 1]).tickFormat(d => d === 0 ? 'Low' : d === 1 ? 'High' : ''))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '10px');

    svg.append('g')
        .call(d3.axisLeft(yScale).tickValues([0, 0.5, 1]).tickFormat(d => d === 0 ? 'Low' : d === 1 ? 'High' : ''))
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

    // Unexplored label
    svg.append('text')
        .attr('x', xScale(0.2))
        .attr('y', yScale(0.2))
        .attr('text-anchor', 'middle')
        .style('fill', colors.unexploredBorder)
        .style('font-size', '10px')
        .style('font-style', 'italic')
        .text('Unexplored');

    console.log('OFAT Path Chart initialized');

})();
