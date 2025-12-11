/**
 * Interactive Design Space Visualization - D3.js
 * Shows how the design space changes with number of factors
 * 
 * 1 Factor: 1D axis with response line (2D plot)
 * 2 Factors: 2D grid top-down with heatmap (factor space view)
 * 3 Factors: 3D isometric cube with experimental points
 * 4+ Factors: Informative "beyond visualization" message
 * 
 * Uses CSS variables from d3-charts.css and performance-mode.css
 * Consistent visual progression: extending coordinate system dimensionally
 */

(function() {
    'use strict';

    const containerId = 'chart-design-space-interactive';
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.warn(`Design Space Interactive: Container #${containerId} not found`);
        return;
    }

    // ============================================
    // Color System - CSS Variable Integration
    // ============================================
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    
    // Color palette derived from CSS variables and performance mode
    const colors = {
        // Background
        background: isPerformanceMode ? '#ffffff' : '#0a0a1a',
        
        // Text colors
        text: isPerformanceMode ? 'rgb(0, 122, 126)' : 'rgb(0, 255, 220)',
        
        // Axis colors
        axis: isPerformanceMode ? 'rgb(0, 122, 126)' : 'rgb(0, 255, 220)',
        axisLabel: isPerformanceMode ? 'rgb(0, 100, 104)' : 'rgb(255, 0, 149)',
        
        // Grid colors
        gridMajor: isPerformanceMode ? 'rgba(0, 122, 126, 0.4)' : 'rgba(0, 255, 220, 0.25)',
        gridMinor: isPerformanceMode ? 'rgba(0, 122, 126, 0.15)' : 'rgba(0, 255, 220, 0.08)',
        
        // Data visualization colors
        primary: isPerformanceMode ? '#007a7e' : '#00ffdc',
        primaryLight: isPerformanceMode ? 'rgba(0, 122, 126, 0.6)' : 'rgba(0, 255, 220, 0.6)',
        secondary: isPerformanceMode ? '#005a5e' : '#ff0095',
        
        // Highlight/accent
        highlight: isPerformanceMode ? '#d4a012' : '#ffd93d',
        highlightGlow: isPerformanceMode ? 'rgba(212, 160, 18, 0.4)' : 'rgba(255, 217, 61, 0.5)',
        
        // Response scale (low to high)
        responseLow: isPerformanceMode ? '#e8f4f4' : '#0a2a2a',
        responseMid: isPerformanceMode ? '#4db8bc' : '#00aa90',
        responseHigh: isPerformanceMode ? '#007a7e' : '#00ffdc',
        
        // UI elements
        buttonBg: isPerformanceMode ? '#f0f4f4' : '#1a1a3e',
        buttonActive: isPerformanceMode ? '#007a7e' : '#00ffdc',
        buttonText: isPerformanceMode ? '#333333' : '#00ffdc',
        buttonActiveText: isPerformanceMode ? '#ffffff' : '#0a0a1a',
        buttonBorder: isPerformanceMode ? '#007a7e' : '#00ffdc',
        
        // Title
        title: isPerformanceMode ? '#000000' : '#9efcff',
        subtitle: isPerformanceMode ? '#333333' : '#ffd166',
        
        // Special
        forbidden: isPerformanceMode ? '#8B0000' : '#ff6b6b'
    };

    // ============================================
    // Dimensions
    // ============================================
    const width = 650;
    const height = 550;
    const margin = { top: 50, right: 40, bottom: 70, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom - 70;

    // Clear container
    container.innerHTML = '';

    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', colors.background);

    // Defs for gradients and markers
    const defs = svg.append('defs');
    
    // Arrow marker for axes
    defs.append('marker')
        .attr('id', 'axis-arrow')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', colors.axis);

    // Main plot group
    const plotGroup = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Current state
    let currentFactors = 2;

    // ============================================
    // Helper Functions
    // ============================================
    
    /**
     * Draw major and minor grid lines
     */
    function drawGrid(group, xScale, yScale, options = {}) {
        const {
            xTicks = 5,
            yTicks = 5,
            showMinor = true,
            minorDivisions = 4
        } = options;

        const gridGroup = group.append('g').attr('class', 'grid');
        
        // Minor grid lines
        if (showMinor) {
            const xDomain = xScale.domain();
            const yDomain = yScale.domain();
            const xStep = (xDomain[1] - xDomain[0]) / (xTicks * minorDivisions);
            const yStep = (yDomain[1] - yDomain[0]) / (yTicks * minorDivisions);
            
            for (let x = xDomain[0]; x <= xDomain[1] + 0.001; x += xStep) {
                gridGroup.append('line')
                    .attr('x1', xScale(x))
                    .attr('x2', xScale(x))
                    .attr('y1', 0)
                    .attr('y2', yScale.range()[0])
                    .attr('stroke', colors.gridMinor)
                    .attr('stroke-width', 0.5);
            }
            
            for (let y = yDomain[0]; y <= yDomain[1] + 0.001; y += yStep) {
                gridGroup.append('line')
                    .attr('x1', 0)
                    .attr('x2', xScale.range()[1])
                    .attr('y1', yScale(y))
                    .attr('y2', yScale(y))
                    .attr('stroke', colors.gridMinor)
                    .attr('stroke-width', 0.5);
            }
        }
        
        // Major grid lines
        const xMajorStep = (xScale.domain()[1] - xScale.domain()[0]) / xTicks;
        const yMajorStep = (yScale.domain()[1] - yScale.domain()[0]) / yTicks;
        
        for (let x = xScale.domain()[0]; x <= xScale.domain()[1] + 0.001; x += xMajorStep) {
            gridGroup.append('line')
                .attr('x1', xScale(x))
                .attr('x2', xScale(x))
                .attr('y1', 0)
                .attr('y2', yScale.range()[0])
                .attr('stroke', colors.gridMajor)
                .attr('stroke-width', 1);
        }
        
        for (let y = yScale.domain()[0]; y <= yScale.domain()[1] + 0.001; y += yMajorStep) {
            gridGroup.append('line')
                .attr('x1', 0)
                .attr('x2', xScale.range()[1])
                .attr('y1', yScale(y))
                .attr('y2', yScale(y))
                .attr('stroke', colors.gridMajor)
                .attr('stroke-width', 1);
        }
        
        return gridGroup;
    }

    /**
     * Draw styled axes with tick marks
     */
    function drawAxes(group, xScale, yScale, options = {}) {
        const {
            xLabel = 'X',
            yLabel = 'Y',
            xTicks = 5,
            yTicks = 5,
            fontSize = 12
        } = options;

        // X-axis
        const xAxisGroup = group.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${yScale.range()[0]})`);
        
        xAxisGroup.append('line')
            .attr('x1', 0)
            .attr('x2', xScale.range()[1])
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', colors.axis)
            .attr('stroke-width', 2);
        
        const xTickValues = d3.ticks(xScale.domain()[0], xScale.domain()[1], xTicks);
        xTickValues.forEach(tick => {
            xAxisGroup.append('line')
                .attr('x1', xScale(tick))
                .attr('x2', xScale(tick))
                .attr('y1', 0)
                .attr('y2', 6)
                .attr('stroke', colors.axis)
                .attr('stroke-width', 1.5);
            
            xAxisGroup.append('text')
                .attr('x', xScale(tick))
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.text)
                .style('font-size', `${fontSize}px`)
                .style('font-family', "'Montserrat', sans-serif")
                .style('font-weight', '600')
                .text(tick);
        });
        
        group.append('text')
            .attr('x', xScale.range()[1] / 2)
            .attr('y', yScale.range()[0] + 45)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.axisLabel)
            .style('font-size', '13px')
            .style('font-family', "'Montserrat', sans-serif")
            .style('font-weight', '700')
            .text(xLabel);

        // Y-axis
        const yAxisGroup = group.append('g').attr('class', 'y-axis');
        
        yAxisGroup.append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', yScale.range()[0])
            .attr('y2', 0)
            .attr('stroke', colors.axis)
            .attr('stroke-width', 2);
        
        const yTickValues = d3.ticks(yScale.domain()[0], yScale.domain()[1], yTicks);
        yTickValues.forEach(tick => {
            yAxisGroup.append('line')
                .attr('x1', 0)
                .attr('x2', -6)
                .attr('y1', yScale(tick))
                .attr('y2', yScale(tick))
                .attr('stroke', colors.axis)
                .attr('stroke-width', 1.5);
            
            yAxisGroup.append('text')
                .attr('x', -10)
                .attr('y', yScale(tick) + 4)
                .attr('text-anchor', 'end')
                .attr('fill', colors.text)
                .style('font-size', `${fontSize}px`)
                .style('font-family', "'Montserrat', sans-serif")
                .style('font-weight', '600')
                .text(tick);
        });
        
        group.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -yScale.range()[0] / 2)
            .attr('y', -45)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.axisLabel)
            .style('font-size', '13px')
            .style('font-family', "'Montserrat', sans-serif")
            .style('font-weight', '700')
            .text(yLabel);
    }

    /**
     * Draw chart title and subtitle
     */
    function drawTitle(group, text, subtitle = null) {
        group.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.title)
            .style('font-size', '16px')
            .style('font-family', "'Montserrat', sans-serif")
            .style('font-weight', '800')
            .text(text);
        
        if (subtitle) {
            group.append('text')
                .attr('x', plotWidth / 2)
                .attr('y', -4)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.subtitle)
                .style('font-size', '11px')
                .style('font-family', "'Montserrat', sans-serif")
                .style('font-weight', '600')
                .text(subtitle);
        }
    }

    /**
     * Isometric projection for 3D visualization
     */
    function isoProject(x, y, z, config) {
        const { centerX, centerY, scale, angleX = Math.PI/6, angleY = Math.PI/6 } = config;
        const px = centerX + (x - y) * Math.cos(angleX) * scale;
        const py = centerY - z * scale * 0.8 + (x + y) * Math.sin(angleY) * scale * 0.5;
        return { x: px, y: py };
    }

    // ============================================
    // Control Panel
    // ============================================
    const controlY = height - 50;
    
    const controlGroup = svg.append('g')
        .attr('transform', `translate(${width/2}, ${controlY})`);

    controlGroup.append('text')
        .attr('x', 0)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .attr('fill', colors.text)
        .style('font-size', '13px')
        .style('font-family', "'Montserrat', sans-serif")
        .style('font-weight', '700')
        .text('Number of Factors:');

    const buttons = [
        { factors: 1, label: '1' },
        { factors: 2, label: '2' },
        { factors: 3, label: '3' },
        { factors: 4, label: '4+' }
    ];

    const buttonWidth = 45;
    const buttonHeight = 28;
    const buttonSpacing = 12;
    const totalButtonWidth = buttons.length * buttonWidth + (buttons.length - 1) * buttonSpacing;
    const buttonStartX = -totalButtonWidth / 2;

    const buttonGroups = controlGroup.selectAll('.factor-button')
        .data(buttons)
        .enter()
        .append('g')
        .attr('class', 'factor-button')
        .attr('transform', (d, i) => `translate(${buttonStartX + i * (buttonWidth + buttonSpacing)}, 0)`)
        .style('cursor', 'pointer')
        .on('click', function(event, d) {
            currentFactors = d.factors;
            updateButtons();
            drawDesignSpace(d.factors);
        });

    buttonGroups.append('rect')
        .attr('class', 'button-bg')
        .attr('width', buttonWidth)
        .attr('height', buttonHeight)
        .attr('rx', 4)
        .attr('ry', 4)
        .style('fill', d => d.factors === currentFactors ? colors.buttonActive : colors.buttonBg)
        .style('stroke', colors.buttonBorder)
        .style('stroke-width', 1.5);

    buttonGroups.append('text')
        .attr('class', 'button-text')
        .attr('x', buttonWidth / 2)
        .attr('y', buttonHeight / 2 + 5)
        .attr('text-anchor', 'middle')
        .style('fill', d => d.factors === currentFactors ? colors.buttonActiveText : colors.buttonText)
        .style('font-size', '14px')
        .style('font-family', "'Montserrat', sans-serif")
        .style('font-weight', '700')
        .text(d => d.label);

    function updateButtons() {
        controlGroup.selectAll('.button-bg')
            .style('fill', d => d.factors === currentFactors ? colors.buttonActive : colors.buttonBg);
        controlGroup.selectAll('.button-text')
            .style('fill', d => d.factors === currentFactors ? colors.buttonActiveText : colors.buttonText);
    }

    // ============================================
    // Main Drawing Controller
    // ============================================
    function drawDesignSpace(factors) {
        plotGroup.selectAll('*').remove();

        switch(factors) {
            case 1: draw1Factor(); break;
            case 2: draw2Factors(); break;
            case 3: draw3Factors(); break;
            default: drawForbidden();
        }
    }

    // ============================================
    // 1 Factor: 2D Line Plot (X₁ vs Response Y)
    // ============================================
    function draw1Factor() {
        const xScale = d3.scaleLinear().domain([-1, 1]).range([0, plotWidth]);
        const yScale = d3.scaleLinear().domain([0, 100]).range([plotHeight, 0]);

        drawTitle(plotGroup, '1 Factor → Design Space is a LINE', 'Factor X₁ defines a 1D exploration space');

        // Grid
        drawGrid(plotGroup, xScale, yScale, { xTicks: 4, yTicks: 5, showMinor: true, minorDivisions: 4 });

        // Axes
        drawAxes(plotGroup, xScale, yScale, {
            xLabel: 'Factor X₁ (coded: −1 to +1)',
            yLabel: 'Response Y',
            xTicks: 4,
            yTicks: 5
        });

        // Response curve (possible outcomes along the factor axis)
        const lineData = d3.range(-1, 1.02, 0.04).map(x => ({
            x: x,
            y: 50 + 30 * x + 8 * x * x
        }));

        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);

        // Glow effect
        plotGroup.append('path')
            .datum(lineData)
            .attr('fill', 'none')
            .attr('stroke', colors.primary)
            .attr('stroke-width', 10)
            .attr('opacity', 0.2)
            .attr('d', line);

        // Main response line
        plotGroup.append('path')
            .datum(lineData)
            .attr('fill', 'none')
            .attr('stroke', colors.primary)
            .attr('stroke-width', 3)
            .attr('d', line);

        // Experimental points at factorial corners (−1 and +1)
        const cornerPoints = [
            { x: -1, y: 50 + 30*(-1) + 8*1, label: 'Low (−1)' },
            { x: 1, y: 50 + 30*(1) + 8*1, label: 'High (+1)' }
        ];

        cornerPoints.forEach(p => {
            plotGroup.append('circle')
                .attr('cx', xScale(p.x))
                .attr('cy', yScale(p.y))
                .attr('r', 12)
                .attr('fill', colors.highlightGlow);
            
            plotGroup.append('circle')
                .attr('cx', xScale(p.x))
                .attr('cy', yScale(p.y))
                .attr('r', 8)
                .attr('fill', colors.highlight)
                .attr('stroke', colors.primary)
                .attr('stroke-width', 2);
        });

        // Annotation
        plotGroup.append('text')
            .attr('x', plotWidth - 10)
            .attr('y', 30)
            .attr('text-anchor', 'end')
            .attr('fill', colors.subtitle)
            .style('font-size', '11px')
            .style('font-family', "'Montserrat', sans-serif")
            .style('font-style', 'italic')
            .text('2¹ = 2 experiments');

        // Design space indicator line
        plotGroup.append('line')
            .attr('x1', xScale(-1))
            .attr('x2', xScale(1))
            .attr('y1', plotHeight + 30)
            .attr('y2', plotHeight + 30)
            .attr('stroke', colors.primary)
            .attr('stroke-width', 3);
        
        plotGroup.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', plotHeight + 27)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.primary)
            .style('font-size', '10px')
            .style('font-weight', '700')
            .text('Design Space (1D)');
    }

    // ============================================
    // 2 Factors: Top-Down View with Heatmap
    // ============================================
    function draw2Factors() {
        const xScale = d3.scaleLinear().domain([-1, 1]).range([0, plotWidth]);
        const yScale = d3.scaleLinear().domain([-1, 1]).range([plotHeight, 0]);

        drawTitle(plotGroup, '2 Factors → Design Space is a SURFACE', 'Factors X₁, X₂ define a 2D exploration area');

        // Response function for heatmap coloring
        function response(x1, x2) {
            return 50 + 20*x1 + 15*x2 + 10*x1*x2 + 5*x1*x1 + 3*x2*x2;
        }

        // Color scale for response values
        const colorScale = d3.scaleSequential()
            .domain([30, 100])
            .interpolator(t => isPerformanceMode ? d3.interpolateBlues(t) : d3.interpolateViridis(t));

        // Draw heatmap cells
        const gridRes = 20;
        const cellWidth = plotWidth / gridRes;
        const cellHeight = plotHeight / gridRes;

        for (let i = 0; i < gridRes; i++) {
            for (let j = 0; j < gridRes; j++) {
                const x1 = -1 + (i + 0.5) * 2 / gridRes;
                const x2 = -1 + (j + 0.5) * 2 / gridRes;
                const y = response(x1, x2);
                
                plotGroup.append('rect')
                    .attr('x', i * cellWidth)
                    .attr('y', plotHeight - (j + 1) * cellHeight)
                    .attr('width', cellWidth + 0.5)
                    .attr('height', cellHeight + 0.5)
                    .attr('fill', colorScale(y))
                    .attr('opacity', 0.8);
            }
        }

        // Major grid overlay
        const majorStep = 0.5;
        for (let v = -1; v <= 1.001; v += majorStep) {
            plotGroup.append('line')
                .attr('x1', xScale(v))
                .attr('x2', xScale(v))
                .attr('y1', 0)
                .attr('y2', plotHeight)
                .attr('stroke', colors.gridMajor)
                .attr('stroke-width', 1);
            
            plotGroup.append('line')
                .attr('x1', 0)
                .attr('x2', plotWidth)
                .attr('y1', yScale(v))
                .attr('y2', yScale(v))
                .attr('stroke', colors.gridMajor)
                .attr('stroke-width', 1);
        }

        // Axes
        drawAxes(plotGroup, xScale, yScale, {
            xLabel: 'Factor X₁ (coded)',
            yLabel: 'Factor X₂ (coded)',
            xTicks: 4,
            yTicks: 4
        });

        // Corner experimental points (2² = 4 factorial points)
        const corners = [
            { x1: -1, x2: -1 },
            { x1: 1, x2: -1 },
            { x1: -1, x2: 1 },
            { x1: 1, x2: 1 }
        ];

        corners.forEach(p => {
            plotGroup.append('circle')
                .attr('cx', xScale(p.x1))
                .attr('cy', yScale(p.x2))
                .attr('r', 14)
                .attr('fill', colors.highlightGlow);
            
            plotGroup.append('circle')
                .attr('cx', xScale(p.x1))
                .attr('cy', yScale(p.x2))
                .attr('r', 10)
                .attr('fill', colors.highlight)
                .attr('stroke', isPerformanceMode ? '#333' : '#fff')
                .attr('stroke-width', 2);
        });

        // Color legend
        const legendWidth = 15;
        const legendHeight = plotHeight * 0.6;
        const legendX = plotWidth + 15;
        const legendY = (plotHeight - legendHeight) / 2;

        const legendGradient = defs.append('linearGradient')
            .attr('id', 'legend-gradient-2d')
            .attr('x1', '0%').attr('y1', '100%')
            .attr('x2', '0%').attr('y2', '0%');
        
        for (let i = 0; i <= 10; i++) {
            legendGradient.append('stop')
                .attr('offset', `${i * 10}%`)
                .attr('stop-color', colorScale(30 + i * 7));
        }

        plotGroup.append('rect')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('fill', 'url(#legend-gradient-2d)')
            .attr('stroke', colors.axis)
            .attr('stroke-width', 1);

        plotGroup.append('text')
            .attr('x', legendX + legendWidth + 5)
            .attr('y', legendY + 8)
            .attr('fill', colors.text)
            .style('font-size', '9px')
            .text('High');

        plotGroup.append('text')
            .attr('x', legendX + legendWidth + 5)
            .attr('y', legendY + legendHeight)
            .attr('fill', colors.text)
            .style('font-size', '9px')
            .text('Low');

        plotGroup.append('text')
            .attr('x', legendX + legendWidth/2)
            .attr('y', legendY - 8)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.subtitle)
            .style('font-size', '10px')
            .style('font-weight', '600')
            .text('Response Y');

        // Annotation
        plotGroup.append('text')
            .attr('x', plotWidth - 10)
            .attr('y', 15)
            .attr('text-anchor', 'end')
            .attr('fill', colors.subtitle)
            .style('font-size', '11px')
            .style('font-style', 'italic')
            .text('2² = 4 experiments');
    }

    // ============================================
    // 3 Factors: Isometric 3D Cube
    // ============================================
    function draw3Factors() {
        drawTitle(plotGroup, '3 Factors → Design Space is a VOLUME', 'Factors X₁, X₂, X₃ define a 3D exploration cube');

        const cubeScale = 140;
        const centerX = plotWidth / 2;
        const centerY = plotHeight / 2 + 10;
        const config = { centerX, centerY, scale: cubeScale };

        // Response function
        function response(x1, x2, x3) {
            return 0.3 + 0.25*x1 + 0.2*x2 + 0.15*x3 + 0.1*x1*x2 + 0.08*x1*x3;
        }

        // Cube vertices (normalized -1 to 1, mapped to 0-1 for projection)
        const vertices = [
            [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
            [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
        ].map(v => v.map(c => (c + 1) / 2));

        function projectVertex(v) {
            return isoProject(v[0], v[1], v[2], config);
        }

        // Edge definitions
        const backEdges = [[0, 3], [0, 4], [3, 7]];
        const frontEdges = [[0, 1], [1, 2], [2, 3], [4, 5], [5, 6], [6, 7], [4, 7], [1, 5], [2, 6]];

        // Draw back edges (dashed)
        backEdges.forEach(([i, j]) => {
            const p1 = projectVertex(vertices[i]);
            const p2 = projectVertex(vertices[j]);
            plotGroup.append('line')
                .attr('x1', p1.x).attr('y1', p1.y)
                .attr('x2', p2.x).attr('y2', p2.y)
                .attr('stroke', colors.axis)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4')
                .attr('opacity', 0.5);
        });

        // Draw grid on back faces
        const gridLines = 4;
        
        // Back XY plane (z = 0)
        for (let i = 0; i <= gridLines; i++) {
            const t = i / gridLines;
            const h1 = isoProject(0, t, 0, config);
            const h2 = isoProject(1, t, 0, config);
            plotGroup.append('line')
                .attr('x1', h1.x).attr('y1', h1.y)
                .attr('x2', h2.x).attr('y2', h2.y)
                .attr('stroke', colors.gridMinor)
                .attr('stroke-width', 0.5);
            const v1 = isoProject(t, 0, 0, config);
            const v2 = isoProject(t, 1, 0, config);
            plotGroup.append('line')
                .attr('x1', v1.x).attr('y1', v1.y)
                .attr('x2', v2.x).attr('y2', v2.y)
                .attr('stroke', colors.gridMinor)
                .attr('stroke-width', 0.5);
        }

        // Bottom XZ plane (y = 0)
        for (let i = 0; i <= gridLines; i++) {
            const t = i / gridLines;
            const h1 = isoProject(0, 0, t, config);
            const h2 = isoProject(1, 0, t, config);
            plotGroup.append('line')
                .attr('x1', h1.x).attr('y1', h1.y)
                .attr('x2', h2.x).attr('y2', h2.y)
                .attr('stroke', colors.gridMinor)
                .attr('stroke-width', 0.5);
            const v1 = isoProject(t, 0, 0, config);
            const v2 = isoProject(t, 0, 1, config);
            plotGroup.append('line')
                .attr('x1', v1.x).attr('y1', v1.y)
                .attr('x2', v2.x).attr('y2', v2.y)
                .attr('stroke', colors.gridMinor)
                .attr('stroke-width', 0.5);
        }

        // Left YZ plane (x = 0)
        for (let i = 0; i <= gridLines; i++) {
            const t = i / gridLines;
            const h1 = isoProject(0, 0, t, config);
            const h2 = isoProject(0, 1, t, config);
            plotGroup.append('line')
                .attr('x1', h1.x).attr('y1', h1.y)
                .attr('x2', h2.x).attr('y2', h2.y)
                .attr('stroke', colors.gridMinor)
                .attr('stroke-width', 0.5);
            const v1 = isoProject(0, t, 0, config);
            const v2 = isoProject(0, t, 1, config);
            plotGroup.append('line')
                .attr('x1', v1.x).attr('y1', v1.y)
                .attr('x2', v2.x).attr('y2', v2.y)
                .attr('stroke', colors.gridMinor)
                .attr('stroke-width', 0.5);
        }

        // Color scale for experimental points
        const colorScale = d3.scaleSequential()
            .domain([0.2, 0.9])
            .interpolator(t => isPerformanceMode ? d3.interpolateBlues(t) : d3.interpolateViridis(t));

        // Generate corner data and sort by depth
        const cornerData = [];
        for (let x1 = -1; x1 <= 1; x1 += 2) {
            for (let x2 = -1; x2 <= 1; x2 += 2) {
                for (let x3 = -1; x3 <= 1; x3 += 2) {
                    const nx = (x1 + 1) / 2;
                    const ny = (x2 + 1) / 2;
                    const nz = (x3 + 1) / 2;
                    const resp = response(x1, x2, x3);
                    const proj = isoProject(nx, ny, nz, config);
                    cornerData.push({ x1, x2, x3, nx, ny, nz, resp, proj, depth: nx + ny - nz });
                }
            }
        }

        cornerData.sort((a, b) => a.depth - b.depth);

        // Draw experimental points at cube corners
        cornerData.forEach(p => {
            plotGroup.append('circle')
                .attr('cx', p.proj.x)
                .attr('cy', p.proj.y)
                .attr('r', 14)
                .attr('fill', colors.highlightGlow)
                .attr('opacity', 0.6);
            
            plotGroup.append('circle')
                .attr('cx', p.proj.x)
                .attr('cy', p.proj.y)
                .attr('r', 10)
                .attr('fill', colorScale(p.resp))
                .attr('stroke', colors.highlight)
                .attr('stroke-width', 2);
        });

        // Draw front edges
        frontEdges.forEach(([i, j]) => {
            const p1 = projectVertex(vertices[i]);
            const p2 = projectVertex(vertices[j]);
            plotGroup.append('line')
                .attr('x1', p1.x).attr('y1', p1.y)
                .attr('x2', p2.x).attr('y2', p2.y)
                .attr('stroke', colors.axis)
                .attr('stroke-width', 2);
        });

        // Axis labels
        const axisLabelOffset = 1.2;
        const labels = [
            { pos: isoProject(axisLabelOffset, 0, 0, config), text: 'X₁' },
            { pos: isoProject(0, axisLabelOffset, 0, config), text: 'X₂' },
            { pos: isoProject(0, 0, axisLabelOffset, config), text: 'X₃' }
        ];

        labels.forEach(l => {
            plotGroup.append('text')
                .attr('x', l.pos.x)
                .attr('y', l.pos.y)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.axisLabel)
                .style('font-size', '14px')
                .style('font-family', "'Montserrat', sans-serif")
                .style('font-weight', '800')
                .text(l.text);
        });

        // Color legend
        const legendWidth = 15;
        const legendHeight = 120;
        const legendX = plotWidth - 30;
        const legendY = 20;

        const legend3dGradient = defs.append('linearGradient')
            .attr('id', 'legend-gradient-3d')
            .attr('x1', '0%').attr('y1', '100%')
            .attr('x2', '0%').attr('y2', '0%');
        
        for (let i = 0; i <= 10; i++) {
            legend3dGradient.append('stop')
                .attr('offset', `${i * 10}%`)
                .attr('stop-color', colorScale(0.2 + i * 0.07));
        }

        plotGroup.append('rect')
            .attr('x', legendX)
            .attr('y', legendY)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr('fill', 'url(#legend-gradient-3d)')
            .attr('stroke', colors.axis)
            .attr('stroke-width', 1);

        plotGroup.append('text')
            .attr('x', legendX - 5)
            .attr('y', legendY + 5)
            .attr('text-anchor', 'end')
            .attr('fill', colors.text)
            .style('font-size', '9px')
            .text('High');

        plotGroup.append('text')
            .attr('x', legendX - 5)
            .attr('y', legendY + legendHeight)
            .attr('text-anchor', 'end')
            .attr('fill', colors.text)
            .style('font-size', '9px')
            .text('Low');

        plotGroup.append('text')
            .attr('x', legendX + legendWidth/2)
            .attr('y', legendY - 8)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.subtitle)
            .style('font-size', '10px')
            .style('font-weight', '600')
            .text('Response Y');

        // Annotation
        plotGroup.append('text')
            .attr('x', 10)
            .attr('y', plotHeight - 10)
            .attr('fill', colors.subtitle)
            .style('font-size', '11px')
            .style('font-style', 'italic')
            .text('2³ = 8 experiments at cube corners');
    }

    // ============================================
    // 4+ Factors: Beyond Visualization
    // ============================================
    function drawForbidden() {
        // Clean background panel
        plotGroup.append('rect')
            .attr('x', 20)
            .attr('y', 20)
            .attr('width', plotWidth - 40)
            .attr('height', plotHeight - 40)
            .attr('rx', 8)
            .attr('fill', isPerformanceMode ? '#f5f5f5' : '#12122a')
            .attr('stroke', colors.forbidden)
            .attr('stroke-width', 2);

        drawTitle(plotGroup, '4+ Factors → Beyond 3D Visualization');

        const centerX = plotWidth / 2;
        const centerY = plotHeight / 2;

        // Draw overlapping coordinate axes to show complexity
        const axisLength = 60;
        const numAxes = 5;
        
        for (let i = 0; i < numAxes; i++) {
            const angle = (i / numAxes) * Math.PI - Math.PI/2;
            const endX = centerX + Math.cos(angle) * axisLength;
            const endY = centerY + Math.sin(angle) * axisLength;
            
            plotGroup.append('line')
                .attr('x1', centerX)
                .attr('y1', centerY)
                .attr('x2', endX)
                .attr('y2', endY)
                .attr('stroke', colors.axis)
                .attr('stroke-width', 2)
                .attr('opacity', 0.4)
                .attr('stroke-dasharray', '4,3');
            
            plotGroup.append('text')
                .attr('x', centerX + Math.cos(angle) * (axisLength + 15))
                .attr('y', centerY + Math.sin(angle) * (axisLength + 15) + 4)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.axis)
                .style('font-size', '11px')
                .style('opacity', 0.6)
                .text(`X${i + 1}`);
        }

        // Question mark in center
        plotGroup.append('text')
            .attr('x', centerX)
            .attr('y', centerY + 8)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.forbidden)
            .style('font-size', '48px')
            .style('font-weight', '800')
            .text('?');

        // Information box
        const boxY = plotHeight - 100;
        
        plotGroup.append('rect')
            .attr('x', 50)
            .attr('y', boxY)
            .attr('width', plotWidth - 100)
            .attr('height', 70)
            .attr('rx', 6)
            .attr('fill', isPerformanceMode ? '#fff8e1' : '#2a1a1a')
            .attr('stroke', colors.subtitle)
            .attr('stroke-width', 1);

        plotGroup.append('text')
            .attr('x', centerX)
            .attr('y', boxY + 22)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.subtitle)
            .style('font-size', '13px')
            .style('font-weight', '700')
            .text('4 Factors = 5 Dimensions (including response)');

        plotGroup.append('text')
            .attr('x', centerX)
            .attr('y', boxY + 42)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.text)
            .style('font-size', '11px')
            .text('Cannot be visualized directly — use mathematical analysis!');

        plotGroup.append('text')
            .attr('x', centerX)
            .attr('y', boxY + 58)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.primary)
            .style('font-size', '11px')
            .style('font-weight', '600')
            .text('2⁴ = 16 experiments cover the design space systematically');

        // Top annotation
        plotGroup.append('text')
            .attr('x', centerX)
            .attr('y', 60)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.forbidden)
            .style('font-size', '12px')
            .style('font-weight', '600')
            .text('⚠ Human spatial intuition limited to 3D');
    }

    // ============================================
    // Initialize
    // ============================================
    drawDesignSpace(currentFactors);

    console.log('Design Space Interactive Chart initialized (v2 - consistent styling)');

})();
