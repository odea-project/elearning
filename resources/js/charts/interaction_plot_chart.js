/**
 * Interaction Plot Chart - D3.js Visualization
 * Shows interaction between two factors in factorial design
 * 
 * Features:
 * - Two lines showing effect of X1 at different levels of X2
 * - Non-parallel lines indicate interaction
 * - Interactive hover showing exact values
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-interaction-plot';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Interaction Plot Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        grid: isPerformanceMode ? '#404060' : '#dddddd',
        lineLow: isPerformanceMode ? '#4ecdc4' : '#1a4d7a',
        lineHigh: isPerformanceMode ? '#ff6b6b' : '#702914',
        axis: isPerformanceMode ? '#888888' : '#666666',
        point: isPerformanceMode ? '#ffffff' : '#333333'
    };

    // Dimensions
    const margin = { top: 20, right: 100, bottom: 50, left: 60 };
    const width = container.clientWidth - margin.left - margin.right || 280;
    const height = 260 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Experimental data organized for interaction plot
    const dataLowX2 = [
        { x1: -1, response: 12.3 },
        { x1: +1, response: 18.7 }
    ];

    const dataHighX2 = [
        { x1: -1, response: 15.1 },
        { x1: +1, response: 28.9 }
    ];

    // Scales
    const xScale = d3.scaleLinear()
        .domain([-1.2, 1.2])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([8, 32])
        .range([height, 0]);

    // Grid lines
    svg.selectAll('.grid-line-h')
        .data([10, 15, 20, 25, 30])
        .enter()
        .append('line')
        .attr('class', 'grid-line-h')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d))
        .attr('stroke', colors.grid)
        .attr('stroke-width', 0.5);

    // Draw axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickValues([-1, 1]).tickFormat(d => d === -1 ? 'Low (−1)' : 'High (+1)'))
        .selectAll('text')
        .style('fill', colors.text)
        .style('font-size', '11px');

    svg.append('g')
        .call(d3.axisLeft(yScale).ticks(5))
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
        .text('Temperature (X₁)');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -45)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Degradation Rate (mg/L·h)');

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.x1))
        .y(d => yScale(d.response));

    // Draw line for low X2
    svg.append('path')
        .datum(dataLowX2)
        .attr('fill', 'none')
        .attr('stroke', colors.lineLow)
        .attr('stroke-width', 3)
        .attr('d', line);

    // Draw line for high X2
    svg.append('path')
        .datum(dataHighX2)
        .attr('fill', 'none')
        .attr('stroke', colors.lineHigh)
        .attr('stroke-width', 3)
        .attr('d', line);

    // Draw points for low X2
    svg.selectAll('.point-low')
        .data(dataLowX2)
        .enter()
        .append('circle')
        .attr('class', 'point-low')
        .attr('cx', d => xScale(d.x1))
        .attr('cy', d => yScale(d.response))
        .attr('r', 6)
        .attr('fill', colors.lineLow)
        .attr('stroke', colors.point)
        .attr('stroke-width', 2);

    // Draw points for high X2
    svg.selectAll('.point-high')
        .data(dataHighX2)
        .enter()
        .append('circle')
        .attr('class', 'point-high')
        .attr('cx', d => xScale(d.x1))
        .attr('cy', d => yScale(d.response))
        .attr('r', 6)
        .attr('fill', colors.lineHigh)
        .attr('stroke', colors.point)
        .attr('stroke-width', 2);

    // Value labels
    svg.selectAll('.value-label-low')
        .data(dataLowX2)
        .enter()
        .append('text')
        .attr('class', 'value-label-low')
        .attr('x', d => xScale(d.x1))
        .attr('y', d => yScale(d.response) - 12)
        .attr('text-anchor', 'middle')
        .style('fill', colors.lineLow)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text(d => d.response.toFixed(1));

    svg.selectAll('.value-label-high')
        .data(dataHighX2)
        .enter()
        .append('text')
        .attr('class', 'value-label-high')
        .attr('x', d => xScale(d.x1))
        .attr('y', d => yScale(d.response) - 12)
        .attr('text-anchor', 'middle')
        .style('fill', colors.lineHigh)
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text(d => d.response.toFixed(1));

    // Legend
    const legendX = width + 10;
    const legendY = 30;

    // Low X2 legend
    svg.append('line')
        .attr('x1', legendX)
        .attr('x2', legendX + 25)
        .attr('y1', legendY)
        .attr('y2', legendY)
        .attr('stroke', colors.lineLow)
        .attr('stroke-width', 3);

    svg.append('text')
        .attr('x', legendX + 30)
        .attr('y', legendY + 4)
        .style('fill', colors.text)
        .style('font-size', '10px')
        .text('X₂ = Low');

    // High X2 legend
    svg.append('line')
        .attr('x1', legendX)
        .attr('x2', legendX + 25)
        .attr('y1', legendY + 25)
        .attr('y2', legendY + 25)
        .attr('stroke', colors.lineHigh)
        .attr('stroke-width', 3);

    svg.append('text')
        .attr('x', legendX + 30)
        .attr('y', legendY + 29)
        .style('fill', colors.text)
        .style('font-size', '10px')
        .text('X₂ = High');

    // Annotation for interaction
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', yScale(11))
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '10px')
        .style('font-style', 'italic')
        .text('Lines not parallel → Interaction!');

    console.log('Interaction Plot Chart initialized');

})();
