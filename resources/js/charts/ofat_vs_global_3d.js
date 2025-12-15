// OFAT vs Global Maximum - Multi-Panel Design Space Visualization
// Shows how OFAT misses the true optimum due to interactions
// Layout: Factor 1 slice | Factor 2 slice | 3D Design Space

(function() {
    const containerId = 'chart-ofat-vs-global-3d';
    
    function createVisualization() {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const width = container.clientWidth || 1200;
        const height = container.clientHeight || 550;
        
        // Check for performance mode
        const isPerformanceMode = document.body.classList.contains('performance-mode');
        
        // Color scheme based on mode
        const colors = isPerformanceMode ? {
            // Performance mode: high contrast for white background
            textPrimary: '#000000',
            textSecondary: '#333333',
            axisColor: '#333333',
            gridColor: '#999999',
            arrowColor: '#000000',
            step1Line: '#c0392b',      // Darker red
            step1Point: '#c0392b',
            step2Line: '#d35400',      // Darker orange  
            step2Point: '#d35400',
            ofatResult: '#a93226',     // Dark red
            globalMax: '#1e8449',      // Dark green
            surfaceStroke: 'rgba(0,0,0,0.15)',
            pointStroke: '#000000'
        } : {
            // Normal mode: for dark background
            textPrimary: '#ecf0f1',
            textSecondary: '#aaa',
            axisColor: '#aaa',
            gridColor: '#666',
            arrowColor: '#fff',
            step1Line: '#ff6b6b',
            step1Point: '#ff6b6b',
            step2Line: '#ffa502',
            step2Point: '#ffa502',
            ofatResult: '#e74c3c',
            globalMax: '#2ecc71',
            surfaceStroke: 'rgba(255,255,255,0.1)',
            pointStroke: '#fff'
        };
        
        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        // Panel layout
        const panelGap = 40;
        const panel1Width = width * 0.22;
        const panel2Width = width * 0.22;
        const panel3Width = width * 0.50;
        const panelHeight = height - 80;
        const topMargin = 50;
        
        // Response surface function with interaction and quadratic terms
        function responseFunction(x, y) {
            return 48 + 4*x + 4*y - 4*x*x - 4*y*y + 3*x*y;
        }
        
        // Find maximum along a line
        function findMaxAlongX(yFixed, xMin, xMax, steps = 100) {
            let maxZ = -Infinity;
            let maxX = xMin;
            for (let i = 0; i <= steps; i++) {
                const x = xMin + (xMax - xMin) * i / steps;
                const z = responseFunction(x, yFixed);
                if (z > maxZ) {
                    maxZ = z;
                    maxX = x;
                }
            }
            return { x: maxX, y: yFixed, z: maxZ };
        }
        
        function findMaxAlongY(xFixed, yMin, yMax, steps = 100) {
            let maxZ = -Infinity;
            let maxY = yMin;
            for (let i = 0; i <= steps; i++) {
                const y = yMin + (yMax - yMin) * i / steps;
                const z = responseFunction(xFixed, y);
                if (z > maxZ) {
                    maxZ = z;
                    maxY = y;
                }
            }
            return { x: xFixed, y: maxY, z: maxZ };
        }
        
        // Design space bounds
        const xRange = [-1, 1];
        const yRange = [-1, 1];
        const zRange = [35, 55];
        
        // Calculate global maximum
        const globalMax = { x: 0.8, y: 0.8, z: responseFunction(0.8, 0.8) };
        
        // OFAT path
        const startPoint = { x: -1, y: -1, z: responseFunction(-1, -1) };
        const ofatStep1 = findMaxAlongX(-1, -1, 1);
        const ofatStep2 = findMaxAlongY(ofatStep1.x, -1, 1);
        
        // =====================
        // PANEL 1: Factor 1 (X1) slice at Y=-1
        // =====================
        const panel1X = 30;
        const panel1 = svg.append('g')
            .attr('transform', `translate(${panel1X}, ${topMargin})`);
        
        // Panel 1 scales
        const x1Scale = d3.scaleLinear().domain(xRange).range([0, panel1Width - 40]);
        const z1Scale = d3.scaleLinear().domain(zRange).range([panelHeight - 40, 0]);
        
        // Generate curve data for Y=-1
        const curve1Data = [];
        for (let i = 0; i <= 100; i++) {
            const x = xRange[0] + (xRange[1] - xRange[0]) * i / 100;
            curve1Data.push({ x, z: responseFunction(x, -1) });
        }
        
        // Draw curve
        const line1 = d3.line()
            .x(d => x1Scale(d.x))
            .y(d => z1Scale(d.z))
            .curve(d3.curveCardinal);
        
        panel1.append('path')
            .attr('d', line1(curve1Data))
            .attr('fill', 'none')
            .attr('stroke', colors.step1Line)
            .attr('stroke-width', 3);
        
        // Axes
        panel1.append('g')
            .attr('transform', `translate(0, ${panelHeight - 40})`)
            .call(d3.axisBottom(x1Scale).ticks(5))
            .selectAll('text, line, path')
            .attr('stroke', colors.axisColor)
            .attr('fill', colors.axisColor);
        
        panel1.append('g')
            .call(d3.axisLeft(z1Scale).ticks(5))
            .selectAll('text, line, path')
            .attr('stroke', colors.axisColor)
            .attr('fill', colors.axisColor);
        
        // Start point
        panel1.append('circle')
            .attr('cx', x1Scale(startPoint.x))
            .attr('cy', z1Scale(startPoint.z))
            .attr('r', 8)
            .attr('fill', colors.step1Point)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 2);
        
        // OFAT maximum on this slice
        panel1.append('circle')
            .attr('cx', x1Scale(ofatStep1.x))
            .attr('cy', z1Scale(ofatStep1.z))
            .attr('r', 10)
            .attr('fill', colors.step2Point)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 2);
        
        // Arrow showing direction
        panel1.append('line')
            .attr('x1', x1Scale(startPoint.x) + 15)
            .attr('y1', z1Scale(startPoint.z))
            .attr('x2', x1Scale(ofatStep1.x) - 15)
            .attr('y2', z1Scale(ofatStep1.z))
            .attr('stroke', colors.arrowColor)
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
        
        // Labels
        panel1.append('text')
            .attr('x', (panel1Width - 40) / 2)
            .attr('y', panelHeight - 5)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('X₁ (Factor 1)');
        
        panel1.append('text')
            .attr('x', -panelHeight / 2 + 20)
            .attr('y', -35)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Response Y');
        
        // Title
        panel1.append('text')
            .attr('x', (panel1Width - 40) / 2)
            .attr('y', -25)
            .attr('fill', colors.step1Line)
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Step 1: Vary X₁');
        
        panel1.append('text')
            .attr('x', (panel1Width - 40) / 2)
            .attr('y', -8)
            .attr('fill', colors.textSecondary)
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle')
            .text('(X₂ fixed at -1)');
        
        // =====================
        // PANEL 2: Factor 2 (X2) slice at X=ofatStep1.x
        // =====================
        const panel2X = panel1X + panel1Width + panelGap;
        const panel2 = svg.append('g')
            .attr('transform', `translate(${panel2X}, ${topMargin})`);
        
        // Panel 2 scales
        const x2Scale = d3.scaleLinear().domain(yRange).range([0, panel2Width - 40]);
        const z2Scale = d3.scaleLinear().domain(zRange).range([panelHeight - 40, 0]);
        
        // Generate curve data for X=ofatStep1.x
        const curve2Data = [];
        for (let i = 0; i <= 100; i++) {
            const y = yRange[0] + (yRange[1] - yRange[0]) * i / 100;
            curve2Data.push({ y, z: responseFunction(ofatStep1.x, y) });
        }
        
        // Draw curve
        const line2 = d3.line()
            .x(d => x2Scale(d.y))
            .y(d => z2Scale(d.z))
            .curve(d3.curveCardinal);
        
        panel2.append('path')
            .attr('d', line2(curve2Data))
            .attr('fill', 'none')
            .attr('stroke', colors.step2Line)
            .attr('stroke-width', 3);
        
        // Axes
        panel2.append('g')
            .attr('transform', `translate(0, ${panelHeight - 40})`)
            .call(d3.axisBottom(x2Scale).ticks(5))
            .selectAll('text, line, path')
            .attr('stroke', colors.axisColor)
            .attr('fill', colors.axisColor);
        
        panel2.append('g')
            .call(d3.axisLeft(z2Scale).ticks(5))
            .selectAll('text, line, path')
            .attr('stroke', colors.axisColor)
            .attr('fill', colors.axisColor);
        
        // Starting point for step 2 (= end of step 1)
        panel2.append('circle')
            .attr('cx', x2Scale(-1))
            .attr('cy', z2Scale(ofatStep1.z))
            .attr('r', 10)
            .attr('fill', colors.step2Point)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 2);
        
        // OFAT final "optimum"
        panel2.append('circle')
            .attr('cx', x2Scale(ofatStep2.y))
            .attr('cy', z2Scale(ofatStep2.z))
            .attr('r', 12)
            .attr('fill', colors.ofatResult)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 3);
        
        // Arrow showing direction
        panel2.append('line')
            .attr('x1', x2Scale(-1) + 15)
            .attr('y1', z2Scale(ofatStep1.z))
            .attr('x2', x2Scale(ofatStep2.y) - 15)
            .attr('y2', z2Scale(ofatStep2.z))
            .attr('stroke', colors.arrowColor)
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead)');
        
        // Labels
        panel2.append('text')
            .attr('x', (panel2Width - 40) / 2)
            .attr('y', panelHeight - 5)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('X₂ (Factor 2)');
        
        panel2.append('text')
            .attr('x', -panelHeight / 2 + 20)
            .attr('y', -35)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .text('Response Y');
        
        // Title
        panel2.append('text')
            .attr('x', (panel2Width - 40) / 2)
            .attr('y', -25)
            .attr('fill', colors.step2Line)
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Step 2: Vary X₂');
        
        panel2.append('text')
            .attr('x', (panel2Width - 40) / 2)
            .attr('y', -8)
            .attr('fill', colors.textSecondary)
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle')
            .text(`(X₁ fixed at ${ofatStep1.x.toFixed(1)})`);
        
        // =====================
        // PANEL 3: 3D Design Space
        // =====================
        const panel3X = panel2X + panel2Width + panelGap;
        const panel3 = svg.append('g')
            .attr('transform', `translate(${panel3X}, ${topMargin})`);
        
        // 3D projection parameters
        const center3X = panel3Width * 0.45;
        const center3Y = panelHeight * 0.55;
        const scale3X = panelHeight * 0.35;
        const scale3Y = panelHeight * 0.24;
        const scale3Z = panelHeight * 0.015;
        
        const angleX = Math.PI / 6;
        const angleZ = -Math.PI / 4;
        
        function project3D(x, y, z) {
            const rx = x * Math.cos(angleZ) - y * Math.sin(angleZ);
            const ry = x * Math.sin(angleZ) + y * Math.cos(angleZ);
            const px = center3X + rx * scale3X;
            const py = center3Y - ry * scale3Y * Math.cos(angleX) - (z - 45) * scale3Z;
            return { x: px, y: py, depth: ry };
        }
        
        // Generate surface grid
        const gridSize = 25;
        const surfacePoints = [];
        
        for (let i = 0; i <= gridSize; i++) {
            for (let j = 0; j <= gridSize; j++) {
                const x = xRange[0] + (xRange[1] - xRange[0]) * i / gridSize;
                const y = yRange[0] + (yRange[1] - yRange[0]) * j / gridSize;
                const z = responseFunction(x, y);
                surfacePoints.push({ x, y, z, i, j });
            }
        }
        
        // Color scale
        const zMin = d3.min(surfacePoints, d => d.z);
        const zMax = d3.max(surfacePoints, d => d.z);
        const colorScale = d3.scaleSequential(d3.interpolateViridis)
            .domain([zMin, zMax]);
        
        // Draw surface polygons
        const surfaceGroup = panel3.append('g').attr('class', 'surface');
        const polygons = [];
        
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const idx = i * (gridSize + 1) + j;
                const p1 = surfacePoints[idx];
                const p2 = surfacePoints[idx + 1];
                const p3 = surfacePoints[idx + gridSize + 2];
                const p4 = surfacePoints[idx + gridSize + 1];
                
                const proj1 = project3D(p1.x, p1.y, p1.z);
                const proj2 = project3D(p2.x, p2.y, p2.z);
                const proj3 = project3D(p3.x, p3.y, p3.z);
                const proj4 = project3D(p4.x, p4.y, p4.z);
                
                const avgZ = (p1.z + p2.z + p3.z + p4.z) / 4;
                const avgDepth = (proj1.depth + proj2.depth + proj3.depth + proj4.depth) / 4;
                
                polygons.push({
                    points: [proj1, proj2, proj3, proj4],
                    z: avgZ,
                    depth: avgDepth
                });
            }
        }
        
        polygons.sort((a, b) => a.depth - b.depth);
        
        polygons.forEach(poly => {
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
        
        // Draw OFAT path on surface
        const ofatGroup = panel3.append('g').attr('class', 'ofat-path');
        
        // Step 1 path (Y = -1)
        const slice1Points = [];
        for (let i = 0; i <= 50; i++) {
            const x = xRange[0] + (xRange[1] - xRange[0]) * i / 50;
            slice1Points.push(project3D(x, -1, responseFunction(x, -1)));
        }
        
        const sliceLine = d3.line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(d3.curveCardinal);
        
        ofatGroup.append('path')
            .attr('d', sliceLine(slice1Points))
            .attr('fill', 'none')
            .attr('stroke', colors.step1Line)
            .attr('stroke-width', 4)
            .attr('opacity', 0.9);
        
        // Step 2 path (X = ofatStep1.x)
        const slice2Points = [];
        for (let i = 0; i <= 50; i++) {
            const y = yRange[0] + (yRange[1] - yRange[0]) * i / 50;
            slice2Points.push(project3D(ofatStep1.x, y, responseFunction(ofatStep1.x, y)));
        }
        
        ofatGroup.append('path')
            .attr('d', sliceLine(slice2Points))
            .attr('fill', 'none')
            .attr('stroke', colors.step2Line)
            .attr('stroke-width', 4)
            .attr('opacity', 0.9);
        
        // Points on 3D surface
        const pointsGroup = panel3.append('g').attr('class', 'points');
        
        // Start point
        const startProj = project3D(startPoint.x, startPoint.y, startPoint.z);
        pointsGroup.append('circle')
            .attr('cx', startProj.x)
            .attr('cy', startProj.y)
            .attr('r', 8)
            .attr('fill', colors.step1Line)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 2);
        
        // Step 1 max
        const step1Proj = project3D(ofatStep1.x, ofatStep1.y, ofatStep1.z);
        pointsGroup.append('circle')
            .attr('cx', step1Proj.x)
            .attr('cy', step1Proj.y)
            .attr('r', 10)
            .attr('fill', colors.step2Line)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 2);
        
        // OFAT final
        const step2Proj = project3D(ofatStep2.x, ofatStep2.y, ofatStep2.z);
        pointsGroup.append('circle')
            .attr('cx', step2Proj.x)
            .attr('cy', step2Proj.y)
            .attr('r', 12)
            .attr('fill', colors.ofatResult)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 3);
        
        pointsGroup.append('text')
            .attr('x', step2Proj.x - 10)
            .attr('y', step2Proj.y + 25)
            .attr('fill', colors.ofatResult)
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('OFAT');
        
        // Global maximum
        const globalProj = project3D(globalMax.x, globalMax.y, globalMax.z);
        pointsGroup.append('circle')
            .attr('cx', globalProj.x)
            .attr('cy', globalProj.y)
            .attr('r', 14)
            .attr('fill', colors.globalMax)
            .attr('stroke', colors.pointStroke)
            .attr('stroke-width', 3);
        
        pointsGroup.append('text')
            .attr('x', globalProj.x + 5)
            .attr('y', globalProj.y - 20)
            .attr('fill', colors.globalMax)
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Global Max');
        
        // Dashed line between OFAT and global
        pointsGroup.append('line')
            .attr('x1', step2Proj.x)
            .attr('y1', step2Proj.y)
            .attr('x2', globalProj.x)
            .attr('y2', globalProj.y)
            .attr('stroke', colors.textPrimary)
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '6,3')
            .attr('opacity', 0.7);
        
        // Axis labels for 3D
        const axisLabels = panel3.append('g').attr('class', 'axis-labels');
        
        const x1End = project3D(1.4, -1, 40);
        axisLabels.append('text')
            .attr('x', x1End.x)
            .attr('y', x1End.y + 18)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('X₁');
        
        const x2End = project3D(-1, 1.4, 40);
        axisLabels.append('text')
            .attr('x', x2End.x - 18)
            .attr('y', x2End.y)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('X₂');
        
        // Title for panel 3
        panel3.append('text')
            .attr('x', panel3Width / 2 - 20)
            .attr('y', -25)
            .attr('fill', colors.textPrimary)
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .text('Full Design Space');
        
        panel3.append('text')
            .attr('x', panel3Width / 2 - 20)
            .attr('y', -8)
            .attr('fill', colors.axisColor)
            .attr('font-size', '11px')
            .attr('text-anchor', 'middle')
            .text('(with interaction & curvature)');
        
        // Arrow marker definition
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 0 10 10')
            .attr('refX', 8)
            .attr('refY', 5)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0 0 L 10 5 L 0 10 z')
            .attr('fill', colors.arrowColor);
        
        // Bottom legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width / 2 - 200}, ${height - 25})`);
        
        const legendItems = [
            { color: colors.step1Line, label: 'Start', shape: 'circle' },
            { color: colors.step2Line, label: 'After Step 1', shape: 'circle' },
            { color: colors.ofatResult, label: 'OFAT Result', shape: 'circle' },
            { color: colors.globalMax, label: 'True Optimum', shape: 'circle' }
        ];
        
        legendItems.forEach((item, i) => {
            const g = legend.append('g')
                .attr('transform', `translate(${i * 110}, 0)`);
            
            g.append('circle')
                .attr('cx', 8)
                .attr('cy', 0)
                .attr('r', 7)
                .attr('fill', item.color);
            
            g.append('text')
                .attr('x', 22)
                .attr('y', 4)
                .attr('fill', colors.textPrimary)
                .attr('font-size', '11px')
                .text(item.label);
        });
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
