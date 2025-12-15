/**
 * Response Surface 3D Chart - D3.js Visualization
 * Shows the fitted response surface from factorial design
 * with the 4 design points and the regression plane
 * 
 * Model: Y = 18.75 + 5.05*X1 + 3.25*X2 + 1.85*X1*X2
 * 
 * Features:
 * - 3D wireframe surface of the fitted model
 * - Design points at corners showing actual values
 * - Axis labels and legend
 * - Support for performance mode (dark/light theme)
 */

(function() {
    'use strict';

    const containerId = 'chart-response-surface-3d';

    function createVisualization() {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.warn(`Response Surface 3D Chart: Container #${containerId} not found`);
            return;
        }

        // Clear any existing content
        container.innerHTML = '';

        // Check for performance mode
        const isPerformanceMode = document.body.classList.contains('performance-mode');
        
        // Color scheme
        const colors = isPerformanceMode ? {
            // Performance mode (light background)
            text: '#000000',
            textSecondary: '#333333',
            axisLine: '#333333',
            gridLine: 'rgba(0,0,0,0.15)',
            surfaceLow: '#3498db',
            surfaceHigh: '#c0392b',
            surfaceStroke: 'rgba(0,0,0,0.25)',
            pointFill: '#1a4d7a',
            pointStroke: '#000000',
            pointLabel: '#000000'
        } : {
            // Normal mode (dark background)
            text: '#ecf0f1',
            textSecondary: '#aaaaaa',
            axisLine: '#888888',
            gridLine: 'rgba(255,255,255,0.1)',
            surfaceLow: '#3498db',
            surfaceHigh: '#e74c3c',
            surfaceStroke: 'rgba(255,255,255,0.2)',
            pointFill: '#4ecdc4',
            pointStroke: '#ffffff',
            pointLabel: '#ffffff'
        };

        // Dimensions
        const width = container.clientWidth || 900;
        const height = container.clientHeight || 650;
        const margin = { top: 60, right: 80, bottom: 80, left: 80 };

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2 + 120})`);

        // Model coefficients from our regression
        const b0 = 18.75;
        const b1 = 5.05;
        const b2 = 3.25;
        const b12 = 1.85;

        // Response function
        function responseFunction(x1, x2) {
            return b0 + b1 * x1 + b2 * x2 + b12 * x1 * x2;
        }

        // Design points with actual data
        const designPoints = [
            { x1: -1, x2: -1, y: 12.3 },
            { x1: +1, x2: -1, y: 18.7 },
            { x1: -1, x2: +1, y: 15.1 },
            { x1: +1, x2: +1, y: 28.9 }
        ];

        // 3D projection parameters
        const scale = Math.min(width, height) * 0.24;
        const angleX = 0.65;
        const angleY = -0.45;
        const zScale = 8;

        // 3D to 2D projection
        function project3D(x, y, z) {
            const cosX = Math.cos(angleX);
            const sinX = Math.sin(angleX);
            const cosY = Math.cos(angleY);
            const sinY = Math.sin(angleY);

            const x1 = x * cosY - y * sinY;
            const y1 = x * sinX * sinY + y * sinX * cosY + z * cosX;
            const z1 = x * cosX * sinY + y * cosX * cosY - z * sinX;

            return {
                x: x1 * scale,
                y: -y1 * scale,
                z: z1
            };
        }

        // Generate surface grid
        const gridSize = 25;
        const xRange = [-1.2, 1.2];
        const yRange = [-1.2, 1.2];
        const zMin = 10;
        const zMax = 32;

        // Color scale for surface
        const colorScale = d3.scaleLinear()
            .domain([zMin, zMax])
            .range([colors.surfaceLow, colors.surfaceHigh]);

        // Generate grid points
        const surfacePolygons = [];
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const x0 = xRange[0] + (xRange[1] - xRange[0]) * i / gridSize;
                const x1 = xRange[0] + (xRange[1] - xRange[0]) * (i + 1) / gridSize;
                const y0 = yRange[0] + (yRange[1] - yRange[0]) * j / gridSize;
                const y1 = yRange[0] + (yRange[1] - yRange[0]) * (j + 1) / gridSize;

                const z00 = (responseFunction(x0, y0) - zMin) / zScale;
                const z10 = (responseFunction(x1, y0) - zMin) / zScale;
                const z01 = (responseFunction(x0, y1) - zMin) / zScale;
                const z11 = (responseFunction(x1, y1) - zMin) / zScale;

                const p00 = project3D(x0, y0, z00);
                const p10 = project3D(x1, y0, z10);
                const p01 = project3D(x0, y1, z01);
                const p11 = project3D(x1, y1, z11);

                const avgZ = (responseFunction(x0, y0) + responseFunction(x1, y0) + 
                             responseFunction(x0, y1) + responseFunction(x1, y1)) / 4;

                surfacePolygons.push({
                    points: [p00, p10, p11, p01],
                    z: avgZ,
                    depth: (p00.z + p10.z + p11.z + p01.z) / 4
                });
            }
        }

        // Sort by depth for proper rendering
        surfacePolygons.sort((a, b) => a.depth - b.depth);

        // Draw base grid (floor)
        const floorGroup = g.append('g').attr('class', 'floor');
        const floorZ = 0;
        
        // Floor grid lines
        for (let i = -1; i <= 1; i += 0.5) {
            const p1 = project3D(i, -1.2, floorZ);
            const p2 = project3D(i, 1.2, floorZ);
            floorGroup.append('line')
                .attr('x1', p1.x).attr('y1', p1.y)
                .attr('x2', p2.x).attr('y2', p2.y)
                .attr('stroke', colors.gridLine)
                .attr('stroke-width', 1);

            const p3 = project3D(-1.2, i, floorZ);
            const p4 = project3D(1.2, i, floorZ);
            floorGroup.append('line')
                .attr('x1', p3.x).attr('y1', p3.y)
                .attr('x2', p4.x).attr('y2', p4.y)
                .attr('stroke', colors.gridLine)
                .attr('stroke-width', 1);
        }

        // Draw surface
        const surfaceGroup = g.append('g').attr('class', 'surface');
        
        surfacePolygons.forEach(poly => {
            const pathData = `M ${poly.points[0].x},${poly.points[0].y} 
                              L ${poly.points[1].x},${poly.points[1].y} 
                              L ${poly.points[2].x},${poly.points[2].y} 
                              L ${poly.points[3].x},${poly.points[3].y} Z`;
            
            surfaceGroup.append('path')
                .attr('d', pathData)
                .attr('fill', colorScale(poly.z))
                .attr('stroke', colors.surfaceStroke)
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.85);
        });

        // Draw axes
        const axisGroup = g.append('g').attr('class', 'axes');
        
        // X1 axis
        const x1Start = project3D(-1.3, -1.3, 0);
        const x1End = project3D(1.5, -1.3, 0);
        axisGroup.append('line')
            .attr('x1', x1Start.x).attr('y1', x1Start.y)
            .attr('x2', x1End.x).attr('y2', x1End.y)
            .attr('stroke', colors.axisLine)
            .attr('stroke-width', 2);
        
        // X1 label
        const x1Label = project3D(1.7, -1.3, 0);
        axisGroup.append('text')
            .attr('x', x1Label.x)
            .attr('y', x1Label.y)
            .attr('fill', colors.text)
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('X₁ (Temp)');

        // X2 axis
        const x2Start = project3D(-1.3, -1.3, 0);
        const x2End = project3D(-1.3, 1.5, 0);
        axisGroup.append('line')
            .attr('x1', x2Start.x).attr('y1', x2Start.y)
            .attr('x2', x2End.x).attr('y2', x2End.y)
            .attr('stroke', colors.axisLine)
            .attr('stroke-width', 2);
        
        // X2 label
        const x2Label = project3D(-1.3, 1.8, 0);
        axisGroup.append('text')
            .attr('x', x2Label.x)
            .attr('y', x2Label.y)
            .attr('fill', colors.text)
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('X₂ (Carbon)');

        // Z axis (Response)
        const zStart = project3D(-1.3, -1.3, 0);
        const zEnd = project3D(-1.3, -1.3, 2.5);
        axisGroup.append('line')
            .attr('x1', zStart.x).attr('y1', zStart.y)
            .attr('x2', zEnd.x).attr('y2', zEnd.y)
            .attr('stroke', colors.axisLine)
            .attr('stroke-width', 2);
        
        // Z label
        const zLabel = project3D(-1.3, -1.3, 2.8);
        axisGroup.append('text')
            .attr('x', zLabel.x)
            .attr('y', zLabel.y)
            .attr('fill', colors.text)
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Y (Response)');

        // Axis tick marks
        [-1, 0, 1].forEach(v => {
            const tickX1 = project3D(v, -1.35, 0);
            axisGroup.append('text')
                .attr('x', tickX1.x)
                .attr('y', tickX1.y + 18)
                .attr('fill', colors.textSecondary)
                .attr('font-size', '13px')
                .attr('text-anchor', 'middle')
                .text(v === -1 ? '−1' : v === 1 ? '+1' : '0');

            const tickX2 = project3D(-1.45, v, 0);
            axisGroup.append('text')
                .attr('x', tickX2.x - 12)
                .attr('y', tickX2.y)
                .attr('fill', colors.textSecondary)
                .attr('font-size', '13px')
                .attr('text-anchor', 'middle')
                .text(v === -1 ? '−1' : v === 1 ? '+1' : '0');
        });

        // Z axis ticks
        [10, 15, 20, 25, 30].forEach(v => {
            const zTick = project3D(-1.35, -1.35, (v - zMin) / zScale);
            axisGroup.append('text')
                .attr('x', zTick.x - 20)
                .attr('y', zTick.y)
                .attr('fill', colors.textSecondary)
                .attr('font-size', '12px')
                .attr('text-anchor', 'end')
                .text(v);
        });

        // Draw design points
        const pointsGroup = g.append('g').attr('class', 'design-points');
        
        designPoints.forEach(point => {
            const zValue = (point.y - zMin) / zScale;
            const proj = project3D(point.x1, point.x2, zValue);
            
            // Vertical line from floor to point
            const floorProj = project3D(point.x1, point.x2, 0);
            pointsGroup.append('line')
                .attr('x1', floorProj.x)
                .attr('y1', floorProj.y)
                .attr('x2', proj.x)
                .attr('y2', proj.y)
                .attr('stroke', colors.textSecondary)
                .attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '4,3')
                .attr('opacity', 0.6);

            // Point on surface
            pointsGroup.append('circle')
                .attr('cx', proj.x)
                .attr('cy', proj.y)
                .attr('r', 12)
                .attr('fill', colors.pointFill)
                .attr('stroke', colors.pointStroke)
                .attr('stroke-width', 3);

            // Value label
            pointsGroup.append('text')
                .attr('x', proj.x)
                .attr('y', proj.y - 20)
                .attr('fill', colors.pointLabel)
                .attr('font-size', '15px')
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(point.y.toFixed(1));
        });

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 35)
            .attr('fill', colors.text)
            .attr('font-size', '22px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Fitted Response Surface: Ŷ = 18.75 + 5.05X₁ + 3.25X₂ + 1.85X₁X₂');

        // Model equation box
        const eqBox = svg.append('g')
            .attr('transform', `translate(${width - 200}, ${height - 100})`);

        eqBox.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 180)
            .attr('height', 80)
            .attr('fill', isPerformanceMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)')
            .attr('stroke', colors.textSecondary)
            .attr('stroke-width', 1)
            .attr('rx', 5);

        eqBox.append('text')
            .attr('x', 90)
            .attr('y', 22)
            .attr('fill', colors.text)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Model Coefficients');

        const coeffs = ['b₀ = 18.75', 'b₁ = 5.05', 'b₂ = 3.25', 'b₁₂ = 1.85'];
        eqBox.append('text')
            .attr('x', 90)
            .attr('y', 48)
            .attr('fill', colors.textSecondary)
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle')
            .text('b₀=18.75  b₁=5.05');

        eqBox.append('text')
            .attr('x', 90)
            .attr('y', 68)
            .attr('fill', colors.textSecondary)
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle')
            .text('b₂=3.25  b₁₂=1.85');

        // Color legend
        const legendGroup = svg.append('g')
            .attr('transform', `translate(${width - 60}, 80)`);

        const legendHeight = 150;
        const legendWidth = 18;

        // Gradient
        const gradientId = 'response-surface-gradient-' + Math.random().toString(36).substr(2, 9);
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', gradientId)
            .attr('x1', '0%')
            .attr('y1', '100%')
            .attr('x2', '0%')
            .attr('y2', '0%');

        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', colors.surfaceLow);

        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', colors.surfaceHigh);

        legendGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .style('fill', `url(#${gradientId})`)
            .attr('stroke', colors.axisLine)
            .attr('stroke-width', 1);

        legendGroup.append('text')
            .attr('x', legendWidth + 8)
            .attr('y', 8)
            .attr('fill', colors.text)
            .attr('font-size', '12px')
            .text('High');

        legendGroup.append('text')
            .attr('x', legendWidth + 8)
            .attr('y', legendHeight - 2)
            .attr('fill', colors.text)
            .attr('font-size', '12px')
            .text('Low');

        legendGroup.append('text')
            .attr('x', legendWidth / 2)
            .attr('y', -10)
            .attr('fill', colors.text)
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle')
            .text('Response');

        console.log('Response Surface 3D Chart initialized');
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
