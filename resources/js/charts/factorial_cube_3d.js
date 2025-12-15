// 3-Factor Full Factorial Design (2³) with Center Points
// Shows the cube structure of a 3-factor design

(function() {
    const containerId = 'chart-factorial-cube-3d';
    
    function createVisualization() {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = '';
        
        const width = container.clientWidth || 600;
        const height = container.clientHeight || 500;
        
        const svg = d3.select(`#${containerId}`)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        // 3D projection parameters
        const centerX = width * 0.5;
        const centerY = height * 0.48;
        const scale = Math.min(width, height) * 0.32;
        
        const angleX = Math.PI / -6;  // Tilt
        const angleZ = -Math.PI / 5; // Rotation
        
        function project3D(x, y, z) {
            // Rotate around Z axis
            const rx = x * Math.cos(angleZ) - y * Math.sin(angleZ);
            const ry = x * Math.sin(angleZ) + y * Math.cos(angleZ);
            
            // Apply tilt
            const py = ry * Math.cos(angleX) - z * Math.sin(angleX);
            const pz = ry * Math.sin(angleX) + z * Math.cos(angleX);
            
            return { 
                x: centerX + rx * scale, 
                y: centerY - py * scale * 0.8 - pz * scale * 0.5,
                depth: ry + pz
            };
        }
        
        // Define the 8 corner points of 2³ design
        const corners = [
            { x: -1, y: -1, z: -1, label: '1', run: '(−,−,−)' },
            { x:  1, y: -1, z: -1, label: '2', run: '(+,−,−)' },
            { x: -1, y:  1, z: -1, label: '3', run: '(−,+,−)' },
            { x:  1, y:  1, z: -1, label: '4', run: '(+,+,−)' },
            { x: -1, y: -1, z:  1, label: '5', run: '(−,−,+)' },
            { x:  1, y: -1, z:  1, label: '6', run: '(+,−,+)' },
            { x: -1, y:  1, z:  1, label: '7', run: '(−,+,+)' },
            { x:  1, y:  1, z:  1, label: '8', run: '(+,+,+)' }
        ];
        
        // Center point(s)
        const centerPoints = [
            { x: 0, y: 0, z: 0, label: 'CP', run: '(0,0,0)' }
        ];
        
        // Project all points
        corners.forEach(p => {
            const proj = project3D(p.x, p.y, p.z);
            p.px = proj.x;
            p.py = proj.y;
            p.depth = proj.depth;
        });
        
        centerPoints.forEach(p => {
            const proj = project3D(p.x, p.y, p.z);
            p.px = proj.x;
            p.py = proj.y;
            p.depth = proj.depth;
        });
        
        // Define edges of the cube
        const edges = [
            // Bottom face
            [0, 1], [1, 3], [3, 2], [2, 0],
            // Top face
            [4, 5], [5, 7], [7, 6], [6, 4],
            // Vertical edges
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];
        
        // Draw edges (back edges first, then front)
        const edgesGroup = svg.append('g').attr('class', 'edges');
        
        // Sort edges by average depth
        const edgeData = edges.map(([i, j]) => ({
            p1: corners[i],
            p2: corners[j],
            depth: (corners[i].depth + corners[j].depth) / 2
        }));
        edgeData.sort((a, b) => a.depth - b.depth);
        
        edgeData.forEach(edge => {
            const isBack = edge.depth < 0;
            edgesGroup.append('line')
                .attr('x1', edge.p1.px)
                .attr('y1', edge.p1.py)
                .attr('x2', edge.p2.px)
                .attr('y2', edge.p2.py)
                .attr('stroke', isBack ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)')
                .attr('stroke-width', isBack ? 2 : 3)
                .attr('stroke-dasharray', isBack ? '8,4' : 'none');
        });
        
        // Draw filled faces (semi-transparent) for better depth perception
        const faces = [
            { points: [0, 1, 3, 2], color: 'rgba(26, 77, 122, 0.2)' },  // Bottom
            { points: [4, 5, 7, 6], color: 'rgba(45, 80, 22, 0.2)' },   // Top
            { points: [0, 1, 5, 4], color: 'rgba(112, 41, 20, 0.15)' }, // Front
            { points: [2, 3, 7, 6], color: 'rgba(112, 41, 20, 0.1)' },  // Back
            { points: [0, 2, 6, 4], color: 'rgba(100, 100, 100, 0.1)' }, // Left
            { points: [1, 3, 7, 5], color: 'rgba(100, 100, 100, 0.15)' } // Right
        ];
        
        // Sort faces by depth
        faces.forEach(face => {
            face.depth = face.points.reduce((sum, i) => sum + corners[i].depth, 0) / 4;
        });
        faces.sort((a, b) => a.depth - b.depth);
        
        const facesGroup = svg.append('g').attr('class', 'faces');
        faces.forEach(face => {
            const pathData = face.points.map((i, idx) => 
                `${idx === 0 ? 'M' : 'L'} ${corners[i].px},${corners[i].py}`
            ).join(' ') + ' Z';
            
            facesGroup.append('path')
                .attr('d', pathData)
                .attr('fill', face.color)
                .attr('stroke', 'none');
        });
        
        // Sort all points by depth for proper rendering
        const allPoints = [...corners, ...centerPoints];
        allPoints.sort((a, b) => a.depth - b.depth);
        
        // Draw points
        const pointsGroup = svg.append('g').attr('class', 'points');
        
        allPoints.forEach(p => {
            const isCenter = p.label === 'CP';
            const g = pointsGroup.append('g');
            
            // Point circle
            g.append('circle')
                .attr('cx', p.px)
                .attr('cy', p.py)
                .attr('r', isCenter ? 14 : 12)
                .attr('fill', isCenter ? '#ffa502' : '#2ecc71')
                .attr('stroke', '#fff')
                .attr('stroke-width', 3);
            
            // Run number inside circle
            g.append('text')
                .attr('x', p.px)
                .attr('y', p.py + 5)
                .attr('fill', '#fff')
                .attr('font-size', isCenter ? '11px' : '12px')
                .attr('font-weight', 'bold')
                .attr('text-anchor', 'middle')
                .text(p.label);
        });
        
        // Axis labels
        const axisGroup = svg.append('g').attr('class', 'axes');
        
        // X1 axis
        const x1Start = project3D(-1.3, -1, -1);
        const x1End = project3D(1.5, -1, -1);
        axisGroup.append('line')
            .attr('x1', x1Start.x)
            .attr('y1', x1Start.y)
            .attr('x2', x1End.x)
            .attr('y2', x1End.y)
            .attr('stroke', '#ff6b6b')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrowRed)');
        
        axisGroup.append('text')
            .attr('x', x1End.x + 15)
            .attr('y', x1End.y + 5)
            .attr('fill', '#ff6b6b')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text('X₁');
        
        // X2 axis
        const x2Start = project3D(-1, -1.3, -1);
        const x2End = project3D(-1, 1.5, -1);
        axisGroup.append('line')
            .attr('x1', x2Start.x)
            .attr('y1', x2Start.y)
            .attr('x2', x2End.x)
            .attr('y2', x2End.y)
            .attr('stroke', '#3498db')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrowBlue)');
        
        axisGroup.append('text')
            .attr('x', x2End.x - 25)
            .attr('y', x2End.y - 5)
            .attr('fill', '#3498db')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text('X₂');
        
        // X3 axis
        const x3Start = project3D(-1, -1, -1.3);
        const x3End = project3D(-1, -1, 1.5);
        axisGroup.append('line')
            .attr('x1', x3Start.x)
            .attr('y1', x3Start.y)
            .attr('x2', x3End.x)
            .attr('y2', x3End.y)
            .attr('stroke', '#9b59b6')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#arrowPurple)');
        
        axisGroup.append('text')
            .attr('x', x3End.x - 5)
            .attr('y', x3End.y - 15)
            .attr('fill', '#9b59b6')
            .attr('font-size', '18px')
            .attr('font-weight', 'bold')
            .text('X₃');
        
        // Arrow markers
        const defs = svg.append('defs');
        
        ['Red', 'Blue', 'Purple'].forEach((color, i) => {
            const colors = ['#ff6b6b', '#3498db', '#9b59b6'];
            defs.append('marker')
                .attr('id', `arrow${color}`)
                .attr('viewBox', '0 0 10 10')
                .attr('refX', 5)
                .attr('refY', 5)
                .attr('markerWidth', 6)
                .attr('markerHeight', 6)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M 0 0 L 10 5 L 0 10 z')
                .attr('fill', colors[i]);
        });
        
        // Legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width - 180}, 20)`);
        
        legend.append('rect')
            .attr('x', -10)
            .attr('y', -10)
            .attr('width', 175)
            .attr('height', 95)
            .attr('fill', 'rgba(0,0,0,0.4)')
            .attr('rx', 8);
        
        // Corner points
        legend.append('circle')
            .attr('cx', 12)
            .attr('cy', 15)
            .attr('r', 10)
            .attr('fill', '#2ecc71');
        
        legend.append('text')
            .attr('x', 30)
            .attr('y', 20)
            .attr('fill', '#ecf0f1')
            .attr('font-size', '14px')
            .text('Corner (2³ = 8)');
        
        // Center point
        legend.append('circle')
            .attr('cx', 12)
            .attr('cy', 50)
            .attr('r', 10)
            .attr('fill', '#ffa502');
        
        legend.append('text')
            .attr('x', 30)
            .attr('y', 55)
            .attr('fill', '#ecf0f1')
            .attr('font-size', '14px')
            .text('Center Point');
        
        // Total
        legend.append('text')
            .attr('x', 10)
            .attr('y', 78)
            .attr('fill', '#ecf0f1')
            .attr('font-size', '13px')
            .attr('font-weight', 'bold')
            .text('Total: 8 + 3–5 CP');
        
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createVisualization);
    } else {
        setTimeout(createVisualization, 100);
    }
    
    // Handle Reveal.js
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
    
    window.addEventListener('resize', () => {
        if (document.getElementById(containerId)) {
            createVisualization();
        }
    });
})();
