/**
 * Factorial Grid Chart - D3.js Visualization
 * Shows a 2x2 factorial design grid with corner points
 * 
 * Features:
 * - 2D grid showing factor space (X1 vs X2)
 * - Corner points at (-1,-1), (+1,-1), (-1,+1), (+1,+1)
 * - Labels for low/high levels on axes
 * - Interactive highlighting of each experimental run
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-factorial-grid';
    
    function createVisualization() {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Factorial Grid Chart: Container #${containerId} not found`);
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
            point: '#1a4d7a',
            pointHighlight: '#c0392b',
            pointStroke: '#000000',
            axis: '#333333',
            square: '#1a4d7a',
            runLabel: '#ffffff'
        } : {
            // Normal mode (dark background)
            text: '#ecf0f1',
            textSecondary: '#aaaaaa',
            grid: '#555555',
            point: '#4ecdc4',
            pointHighlight: '#ff6b6b',
            pointStroke: '#ffffff',
            axis: '#888888',
            square: '#4ecdc4',
            runLabel: '#1a1a2e'
        };

        // Dimensions - larger and more quadratic
        const margin = { top: 40, right: 50, bottom: 60, left: 70 };
        const size = Math.min(container.clientWidth || 600, 600);
        const width = size - margin.left - margin.right;
        const height = size - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', size)
            .attr('height', size)
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
            .attr('stroke', colors.square)
            .attr('stroke-width', 3);

        // Draw axes
        const xAxis = svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickValues([-1, 0, 1]).tickFormat(d => d === -1 ? 'Low (−1)' : d === 1 ? 'High (+1)' : '0'));
        
        xAxis.selectAll('text')
            .style('fill', colors.text)
            .style('font-size', '13px');
        xAxis.selectAll('line, path')
            .style('stroke', colors.axis);

        const yAxis = svg.append('g')
            .call(d3.axisLeft(yScale).tickValues([-1, 0, 1]).tickFormat(d => d === -1 ? 'Low (−1)' : d === 1 ? 'High (+1)' : '0'));
        
        yAxis.selectAll('text')
            .style('fill', colors.text)
            .style('font-size', '13px');
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
            .text('Factor X₁');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .style('fill', colors.text)
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Factor X₂');

        // Draw design points
        svg.selectAll('.design-point')
            .data(designPoints)
            .enter()
            .append('circle')
            .attr('class', 'design-point')
            .attr('cx', d => xScale(d.x1))
            .attr('cy', d => yScale(d.x2))
            .attr('r', 18)
            .attr('fill', colors.point)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 3)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 24)
                    .attr('fill', colors.pointHighlight);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 18)
                    .attr('fill', colors.point);
            });

        // Run number labels
        svg.selectAll('.run-label')
            .data(designPoints)
            .enter()
            .append('text')
            .attr('class', 'run-label')
            .attr('x', d => xScale(d.x1))
            .attr('y', d => yScale(d.x2) + 6)
            .attr('text-anchor', 'middle')
            .style('fill', colors.runLabel)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('pointer-events', 'none')
            .text(d => d.run);

        // Coordinate labels
        svg.selectAll('.coord-label')
            .data(designPoints)
            .enter()
            .append('text')
            .attr('class', 'coord-label')
            .attr('x', d => xScale(d.x1))
            .attr('y', d => yScale(d.x2) + 38)
            .attr('text-anchor', 'middle')
            .style('fill', colors.textSecondary)
            .style('font-size', '12px')
            .text(d => d.label);

        console.log('Factorial Grid Chart initialized');
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
