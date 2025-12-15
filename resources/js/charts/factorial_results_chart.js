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

    function createVisualization() {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Factorial Results Chart: Container #${containerId} not found`);
            return;
        }

        // Clear any existing content
        container.innerHTML = '';

        // Check for performance mode
        const isPerformanceMode = document.body.classList.contains('performance-mode');
        
        // Color scheme - performance mode = white background, normal = dark background
        const colors = isPerformanceMode ? {
            // Performance mode (light background)
            text: '#000000',
            textSecondary: '#333333',
            grid: '#999999',
            lowValue: '#a8d5e5',
            highValue: '#c0392b',
            axis: '#333333',
            square: '#1a4d7a',
            pointStroke: '#000000',
            labelLight: '#ffffff',
            labelDark: '#000000'
        } : {
            // Normal mode (dark background)
            text: '#ecf0f1',
            textSecondary: '#aaaaaa',
            grid: '#555555',
            lowValue: '#2d4a6d',
            highValue: '#ff6b6b',
            axis: '#888888',
            square: '#4ecdc4',
            pointStroke: '#ffffff',
            labelLight: '#ffffff',
            labelDark: '#1a1a2e'
        };

        // Dimensions - larger and more quadratic
        const margin = { top: 40, right: 70, bottom: 60, left: 80 };
        const size = Math.min(container.clientWidth || 450, 450);
        const width = size - margin.left - margin.right;
        const height = size - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', size)
            .attr('height', size)
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
            .attr('stroke', colors.square)
            .attr('stroke-width', 3);

        // Draw axes
        const xAxis = svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues([-1, 1]).tickFormat(d => d === -1 ? '15°C' : '25°C'));
        
        xAxis.selectAll('text')
            .style('fill', colors.text)
            .style('font-size', '14px');
        xAxis.selectAll('line, path')
            .style('stroke', colors.axis);

        const yAxis = svg.append('g')
            .call(d3.axisLeft(yScale).tickValues([-1, 1]).tickFormat(d => d === -1 ? '50 mg/L' : '150 mg/L'));
        
        yAxis.selectAll('text')
            .style('fill', colors.text)
            .style('font-size', '14px');
        yAxis.selectAll('line, path')
            .style('stroke', colors.axis);

        // Axis labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .style('fill', colors.text)
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Temperature (X₁)');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -60)
            .attr('text-anchor', 'middle')
            .style('fill', colors.text)
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Carbon Source (X₂)');

        // Draw data points with response values
        const pointRadius = 38;

        svg.selectAll('.data-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'data-point')
            .attr('cx', d => xScale(d.x1))
            .attr('cy', d => yScale(d.x2))
            .attr('r', pointRadius)
            .attr('fill', d => colorScale(d.response))
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 3)
            .attr('opacity', 0.9);

        // Response value labels
        svg.selectAll('.response-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'response-label')
            .attr('x', d => xScale(d.x1))
            .attr('y', d => yScale(d.x2) + 6)
            .attr('text-anchor', 'middle')
            .style('fill', d => d.response > 20 ? colors.labelLight : colors.labelDark)
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text(d => d.response.toFixed(1));

        // Legend
        const legendWidth = 18;
        const legendHeight = height * 0.6;
        const legendX = width + 15;
        const legendY = (height - legendHeight) / 2;

        // Gradient for legend
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'response-gradient-results')
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
            .style('fill', 'url(#response-gradient-results)')
            .attr('stroke', colors.axis)
            .attr('stroke-width', 1);

        // Legend labels
        svg.append('text')
            .attr('x', legendX + legendWidth + 8)
            .attr('y', legendY + 5)
            .style('fill', colors.text)
            .style('font-size', '12px')
            .text('High');

        svg.append('text')
            .attr('x', legendX + legendWidth + 8)
            .attr('y', legendY + legendHeight)
            .style('fill', colors.text)
            .style('font-size', '12px')
            .text('Low');

        console.log('Factorial Results Chart initialized');
    }

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createVisualization);
    } else {
        setTimeout(createVisualization, 100);
    }

    // Handle Reveal.js slide changes
    if (typeof Reveal !== 'undefined') {
        Reveal.on('slidechanged', event => {
            if (event.currentSlide.querySelector(`#${containerId}`)) {
                setTimeout(createVisualization, 100);
            }
        });
        Reveal.on('ready', event => {
            if (event.currentSlide.querySelector(`#${containerId}`)) {
                setTimeout(createVisualization, 100);
            }
        });
    }

    // Handle resize
    window.addEventListener('resize', () => {
        if (document.getElementById(containerId)) {
            createVisualization();
        }
    });
})();
