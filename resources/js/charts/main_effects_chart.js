/**
 * Main Effects Plot Chart - D3.js Visualization
 * Shows the main effect of each factor in a factorial design
 * 
 * Features:
 * - Side-by-side panels for each factor
 * - Lines connecting average response at low and high levels
 * - Steeper slope indicates larger effect
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-main-effects';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Main Effects Chart: Container #${containerId} not found`);
        return;
    }

    // Check for performance mode
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color scheme
    const colors = {
        background: isPerformanceMode ? '#1a1a2e' : '#ffffff',
        text: isPerformanceMode ? '#e0e0e0' : '#333333',
        grid: isPerformanceMode ? '#404060' : '#dddddd',
        lineX1: isPerformanceMode ? '#4ecdc4' : '#1a4d7a',
        lineX2: isPerformanceMode ? '#ff6b6b' : '#702914',
        axis: isPerformanceMode ? '#888888' : '#666666',
        point: isPerformanceMode ? '#ffffff' : '#333333',
        meanLine: isPerformanceMode ? '#888888' : '#999999'
    };

    // Dimensions
    const margin = { top: 30, right: 20, bottom: 50, left: 50 };
    const totalWidth = container.clientWidth || 400;
    const panelWidth = (totalWidth - margin.left - margin.right - 40) / 2;
    const height = 280 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', totalWidth)
        .attr('height', height + margin.top + margin.bottom);

    // Main effects data
    const meanResponse = 18.75;
    
    const effectX1 = {
        name: 'Temperature (X₁)',
        data: [
            { level: -1, label: 'Low\n15°C', mean: 13.7 },  // (12.3 + 15.1) / 2
            { level: +1, label: 'High\n25°C', mean: 23.8 }  // (18.7 + 28.9) / 2
        ],
        effect: 10.1
    };

    const effectX2 = {
        name: 'Carbon (X₂)',
        data: [
            { level: -1, label: 'Low\n50 mg/L', mean: 15.5 },  // (12.3 + 18.7) / 2
            { level: +1, label: 'High\n150 mg/L', mean: 22.0 } // (15.1 + 28.9) / 2
        ],
        effect: 6.5
    };

    // Function to create one panel
    function createPanel(data, xOffset, lineColor) {
        const g = svg.append('g')
            .attr('transform', `translate(${xOffset},${margin.top})`);

        // Scales
        const xScale = d3.scalePoint()
            .domain([-1, 1])
            .range([20, panelWidth - 20])
            .padding(0.5);

        const yScale = d3.scaleLinear()
            .domain([10, 28])
            .range([height, 0]);

        // Grid lines
        g.selectAll('.grid-line')
            .data([12, 16, 20, 24])
            .enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('x1', 0)
            .attr('x2', panelWidth)
            .attr('y1', d => yScale(d))
            .attr('y2', d => yScale(d))
            .attr('stroke', colors.grid)
            .attr('stroke-width', 0.5);

        // Mean line
        g.append('line')
            .attr('x1', 0)
            .attr('x2', panelWidth)
            .attr('y1', yScale(meanResponse))
            .attr('y2', yScale(meanResponse))
            .attr('stroke', colors.meanLine)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5');

        // Y-axis
        g.append('g')
            .call(d3.axisLeft(yScale).ticks(5))
            .selectAll('text')
            .style('fill', colors.text)
            .style('font-size', '10px');

        // X-axis
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat((d, i) => data.data[i].label.split('\n')[0]))
            .selectAll('text')
            .style('fill', colors.text)
            .style('font-size', '10px');

        // Secondary x-axis labels (real values)
        data.data.forEach((d, i) => {
            const parts = d.label.split('\n');
            if (parts[1]) {
                g.append('text')
                    .attr('x', xScale(d.level))
                    .attr('y', height + 30)
                    .attr('text-anchor', 'middle')
                    .style('fill', colors.text)
                    .style('font-size', '9px')
                    .text(parts[1]);
            }
        });

        // Connect line
        g.append('line')
            .attr('x1', xScale(data.data[0].level))
            .attr('x2', xScale(data.data[1].level))
            .attr('y1', yScale(data.data[0].mean))
            .attr('y2', yScale(data.data[1].mean))
            .attr('stroke', lineColor)
            .attr('stroke-width', 3);

        // Points
        g.selectAll('.effect-point')
            .data(data.data)
            .enter()
            .append('circle')
            .attr('class', 'effect-point')
            .attr('cx', d => xScale(d.level))
            .attr('cy', d => yScale(d.mean))
            .attr('r', 7)
            .attr('fill', lineColor)
            .attr('stroke', colors.point)
            .attr('stroke-width', 2);

        // Value labels
        g.selectAll('.value-label')
            .data(data.data)
            .enter()
            .append('text')
            .attr('class', 'value-label')
            .attr('x', d => xScale(d.level))
            .attr('y', d => yScale(d.mean) - 15)
            .attr('text-anchor', 'middle')
            .style('fill', lineColor)
            .style('font-size', '11px')
            .style('font-weight', 'bold')
            .text(d => d.mean.toFixed(1));

        // Title
        g.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('fill', colors.text)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(data.name);

        // Effect annotation
        g.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .style('fill', lineColor)
            .style('font-size', '10px')
            .style('font-weight', 'bold')
            .text(`Effect: ${data.effect.toFixed(1)}`);
    }

    // Create both panels
    createPanel(effectX1, margin.left, colors.lineX1);
    createPanel(effectX2, margin.left + panelWidth + 40, colors.lineX2);

    // Y-axis label (shared)
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -(height / 2 + margin.top))
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .style('fill', colors.text)
        .style('font-size', '11px')
        .text('Mean Response (mg/L·h)');

    console.log('Main Effects Chart initialized');

})();
