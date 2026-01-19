---
title: "Cluster Analysis II – PCA & Multivariate Analysis"
author: "Gerrit Renner"
keywords: ["PCA", "principal component analysis", "dimensionality reduction", "loadings", "scores", "scree plot", "eigenvalues", "biplot", "PLS-DA", "ASCA"]
requirements: ["Cluster Analysis I", "Variance", "Distances"]
description: "Principal Component Analysis and extensions for multivariate environmental data"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Hierarchical Cluster Analysis
- Mean
- Variance

---

<!-- .slide:id="pca-cold-opener" -->
## The Classification Puzzle

<div id="pca-puzzle-container" style="display: flex; width: 100%; height: 850px; gap: 20px;">
  <div id="puzzle-left" style="flex: 0 0 38%; display: flex; flex-direction: column;">
    <div style="margin-bottom: 10px; font-size: 0.75em;">
      <span style="color: #ffd43b;">Click two column headers to select properties for plotting</span>
    </div>
    <div id="puzzle-table" style="flex: 1; overflow: auto;"></div>
    <div style="margin-top: 12px; display: flex; gap: 10px; align-items: center;">
      <button id="btn-scatter" style="padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold;">Scatter + K-Means</button>
      <button id="btn-dendro" style="padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold;">Dendrogram</button>
    </div>
    <div id="puzzle-message" style="margin-top: 12px; padding: 12px; border-radius: 8px; font-size: 0.75em; text-align: center;"></div>
  </div>
  <div id="puzzle-right" style="flex: 1;">
    <div id="puzzle-plot" style="width: 100%; height: 100%;"></div>
  </div>
</div>

<script>
(function() {
  const containerId = 'pca-puzzle-container';
  let selectedCols = [0, 1];
  let viewMode = 'scatter';

  function seededRandom(seed) {
    let s = seed >>> 0;
    return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
  }

  // Carefully crafted data: 10 samples × 10 properties
  // Designed so different pairs yield different clusterings
  const sampleNames = ['A1', 'A2', 'A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5'];
  const propNames = ['pH', 'EC', 'NO₃', 'PO₄', 'DO', 'Cl', 'SO₄', 'Ca', 'Mg', 'K'];
  
  // Data matrix designed for inconsistent clustering
  const rawData = [
    [7.2, 450, 12, 0.8, 8.5, 35, 42, 65, 18, 4.2],   // S1
    [6.8, 620, 28, 1.5, 6.2, 52, 38, 48, 25, 6.8],   // S2
    [7.5, 380, 8,  0.4, 9.1, 28, 55, 72, 12, 3.1],   // S3
    [6.5, 710, 35, 2.1, 5.5, 68, 32, 42, 32, 8.5],   // S4
    [7.8, 290, 5,  0.3, 9.8, 22, 61, 85, 8,  2.4],   // S5
    [6.9, 580, 22, 1.2, 7.0, 45, 45, 55, 22, 5.5],   // S6
    [7.1, 520, 18, 1.0, 7.5, 40, 48, 60, 20, 4.8],   // S7
    [6.6, 680, 32, 1.8, 5.8, 62, 35, 45, 28, 7.8],   // S8
    [7.6, 340, 6,  0.5, 9.5, 25, 58, 78, 10, 2.8],   // S9
    [7.0, 550, 20, 1.1, 7.2, 42, 46, 58, 21, 5.2],   // S10
  ];
  
  // Unknown sample (Sample 11) - right in the middle of everything
  const unknownSample = [7.05, 515, 16, 0.95, 7.8, 38, 47, 61, 19, 4.9];
  
  // Scramble data to create inconsistent clustering per property pair
  const rng = seededRandom(42);
  const data = rawData.map((row, i) => {
    const scrambled = row.map((val, j) => {
      // Add property-specific perturbations that flip cluster membership
      const flip = ((i + j) % 3 === 0) ? 1 : -1;
      const noise = (rng() - 0.5) * 0.3 * val * flip;
      return val + noise;
    });
    return scrambled;
  });

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', tableBg: '#fff', tableHeader: '#1f77b4', tableHeaderText: '#fff',
      selectedHeader: '#d62728', rowEven: '#f0f0f0', rowOdd: '#fff', text: '#222',
      cluster1: '#d62728', cluster2: '#1f77b4', unknown: '#ff7f0e', gridLine: '#ccc',
      msgBg: 'rgba(255,200,150,0.95)', btnActive: '#1f77b4', btnInactive: '#888'
    } : {
      bg: '#0b1220', tableBg: '#152238', tableHeader: '#2d4a6f', tableHeaderText: '#e2e8f0',
      selectedHeader: '#ff6b6b', rowEven: '#1a2d4a', rowOdd: '#152238', text: '#e2e8f0',
      cluster1: '#ff6b6b', cluster2: '#74c0fc', unknown: '#ffd43b', gridLine: '#46586d',
      msgBg: 'rgba(30,58,95,0.95)', btnActive: '#74c0fc', btnInactive: '#555'
    };

    // Style buttons
    const btnScatter = document.getElementById('btn-scatter');
    const btnDendro = document.getElementById('btn-dendro');
    if (btnScatter && btnDendro) {
      btnScatter.style.background = viewMode === 'scatter' ? theme.btnActive : theme.btnInactive;
      btnScatter.style.color = '#fff';
      btnDendro.style.background = viewMode === 'dendro' ? theme.btnActive : theme.btnInactive;
      btnDendro.style.color = '#fff';
      btnScatter.onclick = () => { viewMode = 'scatter'; init(); };
      btnDendro.onclick = () => { viewMode = 'dendro'; init(); };
    }

    renderTable(theme);
    if (viewMode === 'scatter') {
      renderScatterPlot(theme);
    } else {
      renderDendrogram(theme);
    }
    updateMessage(theme);
  }

  function renderTable(theme) {
    const tableDiv = document.getElementById('puzzle-table');
    if (!tableDiv) return;
    tableDiv.innerHTML = '';

    const isPerf = document.body.classList.contains('performance-mode');

    const table = document.createElement('table');
    table.style.cssText = `width: 100%; border-collapse: collapse; font-size: 0.6em; background: ${theme.tableBg};`;

    // Header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const sampleHeader = document.createElement('th');
    sampleHeader.textContent = 'Sample';
    sampleHeader.style.cssText = `padding: 6px 4px; background: ${theme.tableHeader}; color: ${theme.tableHeaderText}; position: sticky; top: 0; z-index: 2;`;
    headerRow.appendChild(sampleHeader);

    propNames.forEach((prop, i) => {
      const th = document.createElement('th');
      th.textContent = prop;
      th.dataset.col = i;
      const isSelected = selectedCols.includes(i);
      th.style.cssText = `padding: 6px 4px; cursor: pointer; position: sticky; top: 0; z-index: 1; transition: all 0.2s;
        background: ${isSelected ? theme.selectedHeader : theme.tableHeader}; 
        color: ${theme.tableHeaderText}; font-weight: ${isSelected ? 'bold' : 'normal'};
        border: ${isSelected ? '2px solid #fff' : 'none'};`;
      th.onclick = () => selectColumn(i);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Data rows
    const tbody = document.createElement('tbody');
    
    // Regular samples
    data.forEach((row, i) => {
      const tr = document.createElement('tr');
      tr.style.background = i % 2 === 0 ? theme.rowEven : theme.rowOdd;
      
      const sampleCell = document.createElement('td');
      sampleCell.textContent = sampleNames[i];
      sampleCell.style.cssText = `padding: 5px 4px; font-weight: bold; color: ${theme.text};`;
      tr.appendChild(sampleCell);

      row.forEach((val, j) => {
        const td = document.createElement('td');
        td.textContent = val.toFixed(1);
        td.style.cssText = `padding: 5px 4px; text-align: center; color: ${theme.text};
          background: ${selectedCols.includes(j) ? (isPerf ? 'rgba(214,39,40,0.15)' : 'rgba(255,107,107,0.2)') : 'transparent'};`;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // Unknown sample row
    const unknownRow = document.createElement('tr');
    unknownRow.style.cssText = `background: ${isPerf ? 'rgba(255,127,14,0.25)' : 'rgba(255,212,59,0.2)'}; border-top: 2px dashed ${theme.unknown};`;
    
    const unknownLabel = document.createElement('td');
    unknownLabel.textContent = '??? ';
    unknownLabel.style.cssText = `padding: 5px 4px; font-weight: bold; color: ${theme.unknown};`;
    unknownRow.appendChild(unknownLabel);

    unknownSample.forEach((val, j) => {
      const td = document.createElement('td');
      td.textContent = val.toFixed(1);
      td.style.cssText = `padding: 5px 4px; text-align: center; color: ${theme.unknown};
        background: ${selectedCols.includes(j) ? (isPerf ? 'rgba(255,127,14,0.3)' : 'rgba(255,212,59,0.3)') : 'transparent'};`;
      unknownRow.appendChild(td);
    });
    tbody.appendChild(unknownRow);

    table.appendChild(tbody);
    tableDiv.appendChild(table);
  }

  function selectColumn(colIndex) {
    if (selectedCols.includes(colIndex)) {
      if (selectedCols.length > 1) {
        selectedCols = selectedCols.filter(c => c !== colIndex);
      }
    } else {
      if (selectedCols.length >= 2) {
        selectedCols.shift();
      }
      selectedCols.push(colIndex);
    }
    init();
  }

  function kMeans(points, k = 2, maxIter = 50) {
    const rng = seededRandom(selectedCols[0] * 100 + selectedCols[1]);
    let centroids = points.slice(0, k).map(p => ({ x: p.x + (rng() - 0.5) * 2, y: p.y + (rng() - 0.5) * 2 }));
    let assignments = new Array(points.length).fill(0);

    for (let iter = 0; iter < maxIter; iter++) {
      // Assign points to nearest centroid
      points.forEach((p, i) => {
        let minDist = Infinity;
        centroids.forEach((c, j) => {
          const dist = Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2);
          if (dist < minDist) { minDist = dist; assignments[i] = j; }
        });
      });

      // Update centroids
      centroids = centroids.map((_, j) => {
        const clusterPoints = points.filter((_, i) => assignments[i] === j);
        if (clusterPoints.length === 0) return centroids[j];
        return {
          x: clusterPoints.reduce((s, p) => s + p.x, 0) / clusterPoints.length,
          y: clusterPoints.reduce((s, p) => s + p.y, 0) / clusterPoints.length
        };
      });
    }
    return { assignments, centroids };
  }

  function renderScatterPlot(theme) {
    const plotDiv = document.getElementById('puzzle-plot');
    if (!plotDiv) return;
    plotDiv.innerHTML = '';

    const width = plotDiv.clientWidth || 500;
    const height = plotDiv.clientHeight || 700;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };

    const svg = d3.select('#puzzle-plot').append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const col1 = selectedCols[0];
    const col2 = selectedCols[1] !== undefined ? selectedCols[1] : selectedCols[0];

    // Prepare points for clustering
    const points = data.map((row, i) => ({ x: row[col1], y: row[col2], idx: i, name: sampleNames[i] }));
    const unknownPoint = { x: unknownSample[col1], y: unknownSample[col2], idx: -1, name: '???' };

    // Run k-means
    const { assignments, centroids } = kMeans(points);

    // Find cluster for unknown
    let unknownCluster = 0;
    let minDist = Infinity;
    centroids.forEach((c, j) => {
      const dist = Math.sqrt((unknownPoint.x - c.x) ** 2 + (unknownPoint.y - c.y) ** 2);
      if (dist < minDist) { minDist = dist; unknownCluster = j; }
    });

    // Scales
    const allX = [...points.map(p => p.x), unknownPoint.x];
    const allY = [...points.map(p => p.y), unknownPoint.y];
    const xPad = (d3.max(allX) - d3.min(allX)) * 0.15;
    const yPad = (d3.max(allY) - d3.min(allY)) * 0.15;

    const xScale = d3.scaleLinear().domain([d3.min(allX) - xPad, d3.max(allX) + xPad]).range([0, w]);
    const yScale = d3.scaleLinear().domain([d3.min(allY) - yPad, d3.max(allY) + yPad]).range([h, 0]);

    // Grid lines
    g.append('g').selectAll('line').data(xScale.ticks(5)).enter().append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d)).attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.gridLine).attr('opacity', 0.3);
    g.append('g').selectAll('line').data(yScale.ticks(5)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.gridLine).attr('opacity', 0.3);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text').style('fill', theme.text).style('font-size', '12px');
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text').style('fill', theme.text).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.text);

    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h + 45).attr('text-anchor', 'middle')
      .attr('fill', theme.text).attr('font-size', '14px').text(propNames[col1]);
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -45)
      .attr('text-anchor', 'middle').attr('fill', theme.text).attr('font-size', '14px').text(propNames[col2]);

    // Draw cluster regions (convex hulls)
    const clusterColors = [theme.cluster1, theme.cluster2];
    for (let c = 0; c < 2; c++) {
      const clusterPoints = points.filter((_, i) => assignments[i] === c);
      if (clusterPoints.length >= 3) {
        const hull = d3.polygonHull(clusterPoints.map(p => [xScale(p.x), yScale(p.y)]));
        if (hull) {
          g.append('path')
            .attr('d', 'M' + hull.join('L') + 'Z')
            .attr('fill', clusterColors[c])
            .attr('opacity', 0.15)
            .attr('stroke', clusterColors[c])
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        }
      }
    }

    // Draw centroids
    centroids.forEach((c, i) => {
      g.append('text')
        .attr('x', xScale(c.x)).attr('y', yScale(c.y))
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', clusterColors[i]).attr('font-size', '28px').attr('font-weight', 'bold')
        .text('✕');
    });

    // Draw data points
    points.forEach((p, i) => {
      const cluster = assignments[i];
      g.append('circle')
        .attr('cx', xScale(p.x)).attr('cy', yScale(p.y))
        .attr('r', 12)
        .attr('fill', clusterColors[cluster])
        .attr('stroke', '#fff').attr('stroke-width', 2)
        .attr('opacity', 0.9);
      g.append('text')
        .attr('x', xScale(p.x)).attr('y', yScale(p.y) + 1)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', '#fff').attr('font-size', '10px').attr('font-weight', 'bold')
        .text(p.name);
    });

    // Draw unknown point with question mark
    g.append('circle')
      .attr('cx', xScale(unknownPoint.x)).attr('cy', yScale(unknownPoint.y))
      .attr('r', 16)
      .attr('fill', theme.unknown)
      .attr('stroke', '#fff').attr('stroke-width', 3);
    g.append('text')
      .attr('x', xScale(unknownPoint.x)).attr('y', yScale(unknownPoint.y) + 2)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('fill', '#000').attr('font-size', '16px').attr('font-weight', 'bold')
      .text('?');

    // Title
    svg.append('text').attr('x', width / 2).attr('y', 25).attr('text-anchor', 'middle')
      .attr('fill', theme.text).attr('font-size', '14px')
      .text(`K-Means Clustering (k=2): ${propNames[col1]} vs ${propNames[col2]}`);

    // Store cluster info for message
    window._puzzleClusterInfo = {
      assignments: assignments,
      unknownCluster: unknownCluster,
      clusterColors: clusterColors
    };
  }

  function renderDendrogram(theme) {
    const plotDiv = document.getElementById('puzzle-plot');
    if (!plotDiv) return;
    plotDiv.innerHTML = '';

    const width = plotDiv.clientWidth || 500;
    const height = plotDiv.clientHeight || 700;
    const margin = { top: 50, right: 30, bottom: 80, left: 50 };

    const svg = d3.select('#puzzle-plot').append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    // Use ALL dimensions for dendrogram clustering (not just the two selected)
    const allSamples = [...data.map((row, i) => ({ name: sampleNames[i], vals: row, isUnknown: false })),
                        { name: '???', vals: unknownSample, isUnknown: true }];

    // Euclidean distance for all dimensions
    function euclidean(a, b) {
      let sum = 0;
      for (let i = 0; i < a.length; i++) {
        sum += (a[i] - b[i]) ** 2;
      }
      return Math.sqrt(sum);
    }

    // Build distance matrix
    const n = allSamples.length;
    const distMatrix = [];
    for (let i = 0; i < n; i++) {
      distMatrix[i] = [];
      for (let j = 0; j < n; j++) {
        distMatrix[i][j] = euclidean(allSamples[i].vals, allSamples[j].vals);
      }
    }

    // Agglomerative clustering
    let clusters = allSamples.map((s, i) => ({ id: i, members: [i], height: 0 }));
    const merges = [];
    let nextId = n;

    while (clusters.length > 1) {
      let minDist = Infinity;
      let minI = 0, minJ = 1;
      
      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          // Average linkage
          let dist = 0;
          let count = 0;
          for (const mi of clusters[i].members) {
            for (const mj of clusters[j].members) {
              dist += distMatrix[mi][mj];
              count++;
            }
          }
          dist /= count;
          if (dist < minDist) {
            minDist = dist;
            minI = i;
            minJ = j;
          }
        }
      }

      const newCluster = {
        id: nextId++,
        members: [...clusters[minI].members, ...clusters[minJ].members],
        height: minDist,
        children: [clusters[minI], clusters[minJ]]
      };
      
      merges.push({ c1: clusters[minI], c2: clusters[minJ], merged: newCluster, dist: minDist });
      clusters = clusters.filter((_, i) => i !== minI && i !== minJ);
      clusters.push(newCluster);
    }

    const root = clusters[0];

    // Layout dendrogram
    const yScale = d3.scaleLinear().domain([0, root.height * 1.1]).range([h, 0]);
    
    // Assign x positions to leaves
    let leafIndex = 0;
    function assignX(node) {
      if (!node.children) {
        node.x = leafIndex++;
        return;
      }
      node.children.forEach(assignX);
      node.x = (node.children[0].x + node.children[1].x) / 2;
    }
    assignX(root);

    const xScale = d3.scaleLinear().domain([0, n]).range([30, w - 30]);

    // Draw dendrogram
    function drawNode(node) {
      if (!node.children) return;
      
      const x = xScale(node.x);
      const y = yScale(node.height);
      const x1 = xScale(node.children[0].x);
      const x2 = xScale(node.children[1].x);
      const y1 = yScale(node.children[0].height);
      const y2 = yScale(node.children[1].height);

      // Vertical lines
      g.append('line').attr('x1', x1).attr('y1', y).attr('x2', x1).attr('y2', y1)
        .attr('stroke', theme.text).attr('stroke-width', 2);
      g.append('line').attr('x1', x2).attr('y1', y).attr('x2', x2).attr('y2', y2)
        .attr('stroke', theme.text).attr('stroke-width', 2);
      // Horizontal line
      g.append('line').attr('x1', x1).attr('y1', y).attr('x2', x2).attr('y2', y)
        .attr('stroke', theme.text).attr('stroke-width', 2);

      node.children.forEach(drawNode);
    }
    drawNode(root);

    // Draw leaf labels with colors (A samples vs B samples)
    const colors = allSamples.map((s) => s.name.startsWith('A') ? theme.cluster1 : theme.cluster2);
    
    function drawLeaves(node) {
      if (!node.children) {
        const sample = allSamples[node.members[0]];
        const x = xScale(node.x);
        const color = sample.isUnknown ? theme.unknown : colors[node.members[0]];
        
        g.append('circle')
          .attr('cx', x).attr('cy', h + 5)
          .attr('r', sample.isUnknown ? 14 : 10)
          .attr('fill', color);
        g.append('text')
          .attr('x', x).attr('y', h + 30)
          .attr('text-anchor', 'middle')
          .attr('fill', color)
          .attr('font-size', sample.isUnknown ? '14px' : '11px')
          .attr('font-weight', 'bold')
          .text(sample.name);
        return;
      }
      node.children.forEach(drawLeaves);
    }
    drawLeaves(root);

    // Y axis
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text').style('fill', theme.text).style('font-size', '11px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.text);
    
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -35)
      .attr('text-anchor', 'middle').attr('fill', theme.text).attr('font-size', '12px')
      .text('Distance');

    // Title
    svg.append('text').attr('x', width / 2).attr('y', 30).attr('text-anchor', 'middle')
      .attr('fill', theme.text).attr('font-size', '14px')
      .text('Dendrogram: All 10 Properties');

    window._puzzleClusterInfo = null;
  }

  function updateMessage(theme) {
    const msgDiv = document.getElementById('puzzle-message');
    if (!msgDiv) return;

    msgDiv.style.background = theme.msgBg;
    msgDiv.style.color = theme.text;
    msgDiv.style.border = `2px solid ${theme.unknown}`;

    const col1 = selectedCols[0];
    const col2 = selectedCols[1] !== undefined ? selectedCols[1] : selectedCols[0];

    if (viewMode === 'scatter' && window._puzzleClusterInfo) {
      const info = window._puzzleClusterInfo;
      const cluster1Members = sampleNames.filter((_, i) => info.assignments[i] === 0);
      const cluster2Members = sampleNames.filter((_, i) => info.assignments[i] === 1);
      
      msgDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 6px;">🤔 Where does the unknown sample belong?</div>
        <div style="font-size: 0.85em;">
          <span style="color: ${info.clusterColors[0]}">●</span> Cluster 1: ${cluster1Members.join(', ')} &nbsp;|&nbsp;
          <span style="color: ${info.clusterColors[1]}">●</span> Cluster 2: ${cluster2Members.join(', ')}
        </div>
        <div style="margin-top: 6px; font-size: 0.8em; opacity: 0.9;">
          ↻ Try different property combinations – do the clusters stay consistent?
        </div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 6px;">🌳 Hierarchical clustering also shows mixed patterns</div>
        <div style="font-size: 0.85em;">
          The tree structure changes with different properties. No clear groupings emerge!
        </div>
      `;
    }
  }

  init();
  
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>


---

<!-- .slide:id="pca-intro" -->
## What means dimensionality reduction?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Let's say we have measurements of water samples two variables:
-: Nitrate (NO₃) and Phosphate (PO₄) concentrations

***

-! We can plot each sample as a point in 2D space
-: X-axis: NO₃, Y-axis: PO₄
-: Each point's position shows its chemistry

***

-! Now we want to reduce dimensionality from 2D to 1D
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Naiv Way: Drop one variable 
-: e.g., PO₄
-: Lose information about phosphate levels 
-: This is mostly useless & misleading


***

<div id="scatter-drop-demo" style="width: 100%; height: 400px;"></div>
<script>
(function() {
  const containerId = 'scatter-drop-demo';
  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const width = container.clientWidth || 450;
    const height = 400;
    const margin = { top: 40, right: 30, bottom: 50, left: 60 };
    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#ccc', point: '#1f77b4', text: '#222'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', point: '#74c0fc', text: '#e2e8f0'
    };
    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    // Sample data
    const samples = [
      { no3: 2, po4: 1, group: 0 },
      { no3: 3, po4: 5, group: 0 },
      { no3: 5, po4: 4, group: 1 },
      { no3: 6, po4: 1, group: 1 },
      { no3: 5.2, po4: 7, group: 1 },
      { no3: 5.8, po4: 18, group: 2 },
    ];
    // Scales
    const xScale = d3.scaleLinear().domain([0, 8]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 20]).range([h, 0]);
    // Grid lines
    g.append('g').selectAll('line').data(xScale.ticks(5)).enter().append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d)).attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    g.append('g').selectAll('line').data(yScale.ticks(5)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text').style('fill', theme.text).style('font-size', '12px');
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text').style('fill', theme.text).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h + 40).attr('text-anchor', 'middle')
      .attr('fill', theme.text).attr('font-size', '14px').text('Nitrate (NO₃)');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -45)
      .attr('text-anchor', 'middle').attr('fill', theme.text).attr('font-size', '14px').text('Phosphate (PO₄)');
    // Draw points
    const pointColors = ['#ff7f0e', '#2ca02c', '#d62728'];
    g.selectAll('circle').data(samples).enter().append('circle')
      .attr('cx', d => xScale(d.no3))
      .attr('cy', d => yScale(d.po4))
      .attr('r', 8)
      .attr('fill', d => pointColors[d.group])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    // Title
    svg.append('text').attr('x', width / 2).attr('y',
      25).attr('text-anchor', 'middle')
      .attr('fill', theme.text).attr('font-size', '14px')
      .text('Dropping PO₄ Loses Important Information');
    // Toggle Button for dropping PO₄
    const btn = svg.append('g').attr('cursor', 'pointer');
    btn.append('rect')
      .attr('x', width - 110).attr('y', height - 40)
      .attr('width', 100).attr('height', 30)
      .attr('rx', 5).attr('ry', 5)
      .attr('fill', isPerf ? '#d3d3d3' : '#374151');  
    const btnText = btn.append('text')
      .attr('x', width - 60).attr('y', height - 20)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('fill', isPerf ? '#000' : '#e2e8f0')
      .attr('font-size', '12px') 
      .text('Drop PO₄');
    let dropped = false;
    btn.on('click', () => {
      dropped = !dropped;
      if (dropped) {
        // Remove points and redraw on NO₃ axis only
        g.selectAll('circle').remove();
        g.selectAll('line').remove();
        g.selectAll('text').remove();
        // Redraw axes
        g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(5))
          .selectAll('text').style('fill', theme.text).style('font-size', '12px');
        g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
        // Axis label
        g.append('text').attr('x', w / 2).attr('y', h + 40).attr('text-anchor', 'middle')
          .attr('fill', theme.text).attr('font-size', '14px').text('Nitrate (NO₃)');
        // Draw points on NO₃ axis
        g.selectAll('circle').data(samples).enter().append('circle')
          .attr('cx', d => xScale(d.no3))
          .attr('cy', yScale(0))
          .attr('r', 8)
          .attr('fill', d => pointColors[d.group])
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        btnText.text('Restore PO₄');
      } else {
        init();
      }
    });
    // Toggle Button to drop NO₃
    const btn2 = svg.append('g').attr('cursor', 'pointer');
    btn2.append('rect')
      .attr('x', width - 220).attr('y', height - 40)
      .attr('width', 100).attr('height', 30)
      .attr('rx', 5).attr('ry', 5)
      .attr('fill', isPerf ? '#d3d3d3' : '#374151');  
    const btn2Text = btn2.append('text')
      .attr('x', width - 170).attr('y', height - 20)
      .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
      .attr('fill', isPerf ? '#000' : '#e2e8f0')
      .attr('font-size', '12px')
      .text('Drop NO₃');
    let droppedNo3 = false;
    btn2.on('click', () => {
      droppedNo3 = !droppedNo3;
      if (droppedNo3) {
        // Remove points and redraw on PO₄ axis only
        g.selectAll('circle').remove();
        g.selectAll('line').remove();
        g.selectAll('text').remove();
        // Redraw axes
        g.append('g').call(d3.axisLeft(yScale).ticks(5))
          .selectAll('text').style('fill', theme.text).style('font-size', '12px');
        g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
        // Axis label
        g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -45)
          .attr('text-anchor', 'middle').attr('fill', theme.text).attr('font-size', '14px').text('Phosphate (PO₄)');
        // Draw points on PO₄ axis
        g.selectAll('circle').data(samples).enter().append('circle')
          .attr('cx', xScale(0))
          .attr('cy', d => yScale(d.po4))
          .attr('r', 8)
          .attr('fill', d => pointColors[d.group])
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        btn2Text.text('Restore NO₃');
      } else {
        init();
      }
    });
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-intro-2" -->
## What means dimensionality reduction? (cont.)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Better Way: Find new axis capturing most variation

***

-? How to find this axis?

***

-< Approach: Linear combinations of original variables
-: Re-weight NO₃ and PO₄ to form new variable
-: x' = a·NO₃ + b·PO₄
-: y' = c·NO₃ + d·PO₄

```
original: x = 1·NO₃ + 0·PO₄
          y = 0·NO₃ + 1·PO₄

new:     x' =  1.2·NO₃ + 0.3·PO₄
         y' = -0.3·NO₃ + 1.2·PO₄
```
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Click twice on the plot to select new points that define the new axis
-: Using these two new axes, we can project each point onto the new 1D axis to get reduced representation

***

<div id="scatter-pca-demo" style="width: 100%; height: 460px;"></div>
<script>
(function() {
  const containerId = 'scatter-pca-demo';
  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 460;
    const margin = { top: 40, right: 30, bottom: 110, left: 70 };
    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4',
      axis: '#222',
      grid: '#ccc',
      text: '#222',
      axisLine: '#ff7f0e',
      marker: '#d62728',
      btnBg: '#d3d3d3',
      btnText: '#000',
      pointStroke: '#fff'
    } : {
      bg: '#0b1220',
      axis: '#cbd5e1',
      grid: '#46586d',
      text: '#e2e8f0',
      axisLine: '#ffa94d',
      marker: '#ff6b6b',
      btnBg: '#374151',
      btnText: '#e2e8f0',
      pointStroke: '#fff'
    };
    const svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    // Background
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', theme.bg)
      .attr('rx', 10)
      .style('pointer-events', 'all');
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    // -----------------------------
    // Data
    // -----------------------------
    const samples = [
      { no3: 2,   po4: 1,  group: 0 },
      { no3: 3,   po4: 5,  group: 0 },
      { no3: 5,   po4: 4,  group: 1 },
      { no3: 6,   po4: 1,  group: 1 },
      { no3: 5.2, po4: 7,  group: 1 },
      { no3: 5.8, po4: 18, group: 2 },
    ];
    const pointColors = [ '#1f77b4', '#ff7f0e', '#2ca02c' ];
    // -----------------------------
    // Helpers
    // -----------------------------
    function mean(arr, key) {
      return arr.reduce((s, d) => s + d[key], 0) / arr.length;
    }
    function variance(arr, key) {
      const m = mean(arr, key);
      return arr.reduce((s, d) => {
        const z = d[key] - m;
        return s + z * z;
      }, 0) / arr.length; // population variance
    }
    function varianceArray(vals) {
      const m = vals.reduce((s, v) => s + v, 0) / vals.length;
      return vals.reduce((s, v) => {
        const z = v - m;
        return s + z * z;
      }, 0) / vals.length;
    }
    function fmt(x) {
      return Number.isFinite(x) ? x.toFixed(2) : '–';
    }
    // Convert pointer coords to plot pixel coords robustly
    function pointerToPlotPixels(event) {
      const [sx, sy] = d3.pointer(event, svg.node());
      return [sx - margin.left, sy - margin.top];
    }
    // Clip a parametric line P(t) = (x0,y0) + t*(dx,dy) to plot box [xMin,xMax]x[yMin,yMax]
    // Return endpoints in DATA coords: {x1,y1,x2,y2}
    function clipLineToBox(x0, y0, dx, dy, xMin, xMax, yMin, yMax) {
      const candidates = [];
      if (Math.abs(dx) > 1e-12) {
        let t = (xMin - x0) / dx;
        let y = y0 + t * dy;
        if (y >= yMin && y <= yMax) candidates.push({ x: xMin, y });
        t = (xMax - x0) / dx;
        y = y0 + t * dy;
        if (y >= yMin && y <= yMax) candidates.push({ x: xMax, y });
      }
      if (Math.abs(dy) > 1e-12) {
        let t = (yMin - y0) / dy;
        let x = x0 + t * dx;
        if (x >= xMin && x <= xMax) candidates.push({ x, y: yMin });
        t = (yMax - y0) / dy;
        x = x0 + t * dx;
        if (x >= xMin && x <= xMax) candidates.push({ x, y: yMax });
      }
      if (candidates.length < 2) return null;
      let best = null;
      let bestDist = -1;
      for (let i = 0; i < candidates.length; i++) {
        for (let j = i + 1; j < candidates.length; j++) {
          const a = candidates[i], b = candidates[j];
          const dist = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (dist > bestDist) {
            bestDist = dist;
            best = { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
          }
        }
      }
      return best;
    }
    // Transform point (x,y) into new coords (u,v) relative to anchor (x0,y0)
    // using an orthonormal basis in SCALED space (screen aspect aware).
    function toNewCoords(x, y, x0, y0, e1, e2, sx, sy) {
      const rx = (x - x0) * sx;
      const ry = (y - y0) * sy;
      const u = rx * e1.x + ry * e1.y;
      const v = rx * e2.x + ry * e2.y;
      return { u, v };
    }
    // -----------------------------
    // Scales + axes (original)
    // -----------------------------
    const xScale = d3.scaleLinear().domain([0, 8]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 20]).range([h, 0]);
    // Grid
    g.append('g').selectAll('line')
      .data(xScale.ticks(5))
      .enter().append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    g.append('g').selectAll('line')
      .data(yScale.ticks(5))
      .enter().append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(5));
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).ticks(5));
    xAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
    yAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.text)
      .attr('font-size', '14px')
      .text('Define New Axes and Transform Coordinates');
    // Hint
    const hintText = svg.append('text')
      .attr('x', width - 190)
      .attr('y', 25)
      .attr('text-anchor', 'start')
      .attr('fill', theme.axisLine)
      .attr('font-size', '12px')
      .text('Click twice inside plot to define Axis 1');
    function clearAxisLabels() {
      g.selectAll('.axis-label-orig-x').remove();
      g.selectAll('.axis-label-orig-y').remove();
      g.selectAll('.axis-label-u').remove();
      g.selectAll('.axis-label-v').remove();
      g.selectAll('.axis-label-proj').remove();
    }
    // Original axis labels with variances
    function renderOriginalAxisLabels() {
      const varX = variance(samples, 'no3');
      const varY = variance(samples, 'po4');
      g.selectAll('.axis-label-orig-x').remove();
      g.selectAll('.axis-label-orig-y').remove();
      g.append('text')
        .attr('class', 'axis-label-orig-x')
        .attr('x', w / 2)
        .attr('y', h + 32)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.text)
        .attr('font-size', '14px')
        .text(`Nitrate (NO₃)   Var(x) = ${fmt(varX)}`);
      g.append('text')
        .attr('class', 'axis-label-orig-y')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', -55)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.text)
        .attr('font-size', '14px')
        .text(`Phosphate (PO₄)   Var(y) = ${fmt(varY)}`);
    }
    renderOriginalAxisLabels();
    // -----------------------------
    // Draw points
    // -----------------------------
    const pointsG = g.append('g').attr('class', 'points');
    const circles = pointsG.selectAll('circle')
      .data(samples)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.no3))
      .attr('cy', d => yScale(d.po4))
      .attr('r', 8)
      .attr('fill', d => pointColors[d.group])
      .attr('stroke', theme.pointStroke)
      .attr('stroke-width', 2);
    // -----------------------------
    // Axes definition + visuals
    // -----------------------------
    let axisClicks = [];     // clicked points in DATA coords (two points)
    let axisDefined = false;
    let viewMode = 'original'; // original | uv | proj1 | proj2
    // New axes lines
    const axis1Line = g.append('line')
      .attr('stroke', theme.axisLine)
      .attr('stroke-width', 3)
      .attr('opacity', 0);
    const axis2Line = g.append('line')
      .attr('stroke', theme.axisLine)
      .attr('stroke-width', 2)
      .attr('opacity', 0)
      .attr('stroke-dasharray', '6 4');
    // Click markers
    const markerG = g.append('g').attr('class', 'axis-markers');
    function renderClickMarkers() {
      const sel = markerG.selectAll('circle').data(axisClicks);
      sel.enter()
        .append('circle')
        .attr('r', 6)
        .attr('fill', theme.marker)
        .attr('stroke', theme.pointStroke)
        .attr('stroke-width', 2)
        .merge(sel)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y));
      sel.exit().remove();
    }
    // Axis labels (near line endpoints)
    const axis1Label = g.append('text')
      .attr('fill', theme.axisLine)
      .attr('font-size', '12px')
      .attr('opacity', 0)
      .style('pointer-events', 'none')
      .text('Axis 1');
    const axis2Label = g.append('text')
      .attr('fill', theme.axisLine)
      .attr('font-size', '12px')
      .attr('opacity', 0)
      .style('pointer-events', 'none')
      .text('Axis 2 (orthogonal)');
    // Anchor: Axis 1 must pass through the two selected points.
    // We use P1 as anchor so the axis line goes through P1 and (by direction) P2.
    function getAnchor() {
      if (axisClicks.length >= 1) return { x0: axisClicks[0].x, y0: axisClicks[0].y };
      return { x0: mean(samples, 'no3'), y0: mean(samples, 'po4') };
    }
    function computeUVAndVars() {
      if (axisClicks.length !== 2) return null;
      const p1 = axisClicks[0];
      const p2 = axisClicks[1];
      const dxData = p2.x - p1.x;
      const dyData = p2.y - p1.y;
      const nData = Math.hypot(dxData, dyData);
      if (nData < 1e-12) return null;
      const dx1 = dxData / nData;
      const dy1 = dyData / nData;
      const sx = Math.abs(xScale(1) - xScale(0)) || 1;
      const sy = Math.abs(yScale(1) - yScale(0)) || 1;
      const dxScaled = dxData * sx;
      const dyScaled = dyData * sy;
      const nScaled = Math.hypot(dxScaled, dyScaled);
      if (nScaled < 1e-12) return null;
      const e1 = { x: dxScaled / nScaled, y: dyScaled / nScaled };
      const e2 = { x: -e1.y, y: e1.x };
      let dx2 = e2.x / sx;
      let dy2 = e2.y / sy;
      const n2 = Math.hypot(dx2, dy2);
      if (n2 < 1e-12) return null;
      dx2 /= n2; dy2 /= n2;
      const { x0, y0 } = getAnchor();
      const uv = samples.map(d => toNewCoords(d.no3, d.po4, x0, y0, e1, e2, sx, sy));
      const uVals = uv.map(p => p.u);
      const vVals = uv.map(p => p.v);
      return { dx1, dy1, dx2, dy2, x0, y0, uv, varU: varianceArray(uVals), varV: varianceArray(vVals) };
    }
    function clearAxes() {
      axisDefined = false;
      axisClicks = [];
      axis1Line.attr('opacity', 0).attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0);
      axis2Line.attr('opacity', 0).attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 0);
      axis1Label.text('Axis 1').attr('opacity', 0);
      axis2Label.text('Axis 2 (orthogonal)').attr('opacity', 0);
      markerG.selectAll('*').remove();
      hintText.text('Click twice inside plot to define Axis 1');
    }
    function drawAxesFromClicks() {
      const info = computeUVAndVars();
      if (!info) { clearAxes(); return; }
      const { dx1, dy1, dx2, dy2, x0, y0, varU, varV } = info;
      const xMin = xScale.domain()[0], xMax = xScale.domain()[1];
      const yMin = yScale.domain()[0], yMax = yScale.domain()[1];
      // Axis 1 through (x0,y0) with direction (dx,dy)
      const a1 = clipLineToBox(x0, y0, dx1, dy1, xMin, xMax, yMin, yMax);
      // Axis 2 orthogonal through same anchor in screen aspect-aware basis
      const a2 = clipLineToBox(x0, y0, dx2, dy2, xMin, xMax, yMin, yMax);
      if (a1) {
        axis1Line
          .attr('opacity', 0.9)
          .attr('x1', xScale(a1.x1)).attr('y1', yScale(a1.y1))
          .attr('x2', xScale(a1.x2)).attr('y2', yScale(a1.y2));
        axis1Label
          .text(`Axis 1 (u)   Var(u) = ${fmt(varU)}`)
          .attr('x', xScale(a1.x2) - 8)
          .attr('y', yScale(a1.y2) - 8)
          .attr('opacity', 0.95);
      }
      if (a2) {
        axis2Line
          .attr('opacity', 0.55)
          .attr('x1', xScale(a2.x1)).attr('y1', yScale(a2.y1))
          .attr('x2', xScale(a2.x2)).attr('y2', yScale(a2.y2));
        axis2Label
          .text(`Axis 2 (v ⟂ u)   Var(v) = ${fmt(varV)}`)
          .attr('x', xScale(a2.x2) - 8)
          .attr('y', yScale(a2.y2) - 8)
          .attr('opacity', 0.75);
      }
      axisDefined = true;
      hintText.text('Axes defined. Use button to switch coordinate view.');
    }
    // -----------------------------
    // Views
    // -----------------------------
    function computeUVScales(uv, includeZero) {
      const uExtent = d3.extent(uv, d => d.u);
      const vExtent = d3.extent(uv, d => d.v);
      function padExtent(ext, frac, includeZeroVal) {
        let min = ext[0], max = ext[1];
        if (includeZeroVal) {
          min = Math.min(min, 0);
          max = Math.max(max, 0);
        }
        const span = (max - min) || 1;
        const pad = span * frac;
        return [min - pad, max + pad];
      }
      const uDom = padExtent(uExtent, 0.15, includeZero);
      const vDom = padExtent(vExtent, 0.15, includeZero);
      const uScale = d3.scaleLinear().domain(uDom).range([0, w]);
      const vScale = d3.scaleLinear().domain(vDom).range([h, 0]);
      return { uScale, vScale, uDom, vDom };
    }
    function applyTransformView() {
      if (!axisDefined) return;
      const info = computeUVAndVars();
      if (!info) return;
      const { uv, varU, varV } = info;
      const { uScale, vScale } = computeUVScales(uv, false);
      xAxis.call(d3.axisBottom(uScale).ticks(5));
      yAxis.call(d3.axisLeft(vScale).ticks(5));
      xAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
      yAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
      g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
      // Replace axis labels to show u/v variances
      clearAxisLabels();
      g.append('text')
        .attr('class', 'axis-label-u')
        .attr('x', w / 2)
        .attr('y', h + 55)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.text)
        .attr('font-size', '14px')
        .text(`u (along Axis 1)   Var(u) = ${fmt(varU)}`);
      g.append('text')
        .attr('class', 'axis-label-v')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', -55)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.text)
        .attr('font-size', '14px')
        .text(`v (along Axis 2)   Var(v) = ${fmt(varV)}`);
      // Fade the axis lines (defined in original space)
      axis1Line.attr('opacity', 0.15);
      axis2Line.attr('opacity', 0.10);
      axis1Label.attr('opacity', 0.15);
      axis2Label.attr('opacity', 0.10);
      markerG.attr('opacity', 0.15);
      circles
        .attr('cx', (d, i) => uScale(uv[i].u))
        .attr('cy', (d, i) => vScale(uv[i].v));
    }
    function applyProjectionView(axisIndex) {
      if (!axisDefined) return;
      const info = computeUVAndVars();
      if (!info) return;
      const { uv, varU, varV } = info;
      const { uScale, vScale } = computeUVScales(uv, true);
      xAxis.call(d3.axisBottom(uScale).ticks(5));
      yAxis.call(d3.axisLeft(vScale).ticks(5));
      xAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
      yAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
      g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
      clearAxisLabels();
      g.append('text')
        .attr('class', 'axis-label-u')
        .attr('x', w / 2)
        .attr('y', h + 32)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.text)
        .attr('font-size', '14px')
        .text(`u (along Axis 1)   Var(u) = ${fmt(varU)}`);
      g.append('text')
        .attr('class', 'axis-label-v')
        .attr('transform', 'rotate(-90)')
        .attr('x', -h / 2)
        .attr('y', -55)
        .attr('text-anchor', 'middle')
        .attr('fill', theme.text)
        .attr('font-size', '14px')
        .text(`v (along Axis 2)   Var(v) = ${fmt(varV)}`);
      axis1Line.attr('opacity', 0.15);
      axis2Line.attr('opacity', 0.10);
      axis1Label.attr('opacity', 0.15);
      axis2Label.attr('opacity', 0.10);
      markerG.attr('opacity', 0.15);
      circles
        .attr('cx', (d, i) => {
          const u = axisIndex === 1 ? uv[i].u : 0;
          return uScale(u);
        })
        .attr('cy', (d, i) => {
          const v = axisIndex === 2 ? uv[i].v : 0;
          return vScale(v);
        });
      hintText.text(axisIndex === 1 ? 'Projection onto Axis 1 (v = 0)' : 'Projection onto Axis 2 (u = 0)');
    }
    function restoreOriginalView() {
      xAxis.call(d3.axisBottom(xScale).ticks(5));
      yAxis.call(d3.axisLeft(yScale).ticks(5));
      xAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
      yAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
      g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
      // Restore original axis labels
      clearAxisLabels();
      renderOriginalAxisLabels();
      circles
        .attr('cx', d => xScale(d.no3))
        .attr('cy', d => yScale(d.po4));
      axis1Line.attr('opacity', axisDefined ? 0.9 : 0);
      axis2Line.attr('opacity', axisDefined ? 0.55 : 0);
      axis1Label.attr('opacity', axisDefined ? 0.95 : 0);
      axis2Label.attr('opacity', axisDefined ? 0.75 : 0);
      markerG.attr('opacity', 1.0);
    }
    function setView(mode) {
      viewMode = mode;
      if (viewMode === 'uv') {
        applyTransformView();
      } else if (viewMode === 'proj1') {
        applyProjectionView(1);
      } else if (viewMode === 'proj2') {
        applyProjectionView(2);
      } else {
        restoreOriginalView();
        hintText.text('Axes defined. Use button to switch coordinate view.');
      }
    }
    // -----------------------------
    // Click handling
    // -----------------------------
    svg.on('click', function(event) {
      // Prevent clicks on buttons from defining axes
      if (event.target && event.target.closest && event.target.closest('.toggle-btn')) return;
      if (event.target && event.target.closest && event.target.closest('.proj1-btn')) return;
      if (event.target && event.target.closest && event.target.closest('.proj2-btn')) return;
      if (event.target && event.target.closest && event.target.closest('.reset-btn')) return;
      const [xPix, yPix] = pointerToPlotPixels(event);
      if (xPix < 0 || xPix > w || yPix < 0 || yPix > h) return;
      if (viewMode !== 'original') return; // keep predictable
      if (axisClicks.length < 2) {
        axisClicks.push({ x: xScale.invert(xPix), y: yScale.invert(yPix) });
        renderClickMarkers();
        if (axisClicks.length === 2) drawAxesFromClicks();
      } else {
        // third click resets axis definition
        clearAxes();
      }
    });
    // -----------------------------
    // Buttons
    // -----------------------------
    function makeButton(opts) {
      const { cls, x, y, wBtn, hBtn, label } = opts;
      const btn = svg.append('g')
        .attr('class', cls)
        .attr('cursor', 'pointer');
      btn.append('rect')
        .attr('x', x).attr('y', y)
        .attr('width', wBtn).attr('height', hBtn)
        .attr('rx', 6).attr('ry', 6)
        .attr('fill', theme.btnBg)
        .attr('opacity', 0.95);
      const t = btn.append('text')
        .attr('x', x + wBtn / 2)
        .attr('y', y + hBtn / 2 + 0.5)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', theme.btnText)
        .attr('font-size', '12px')
        .text(label);
      return { btn, text: t };
    }
    const toggle = makeButton({
      cls: 'toggle-btn',
      x: width - 220,
      y: height - 32,
      wBtn: 210,
      hBtn: 30,
      label: 'Show in new coordinates (u,v)'
    });
    const proj1 = makeButton({
      cls: 'proj1-btn',
      x: width - 220,
      y: height - 64,
      wBtn: 210,
      hBtn: 28,
      label: 'Project onto Axis 1'
    });
    const proj2 = makeButton({
      cls: 'proj2-btn',
      x: width - 220,
      y: height - 96,
      wBtn: 210,
      hBtn: 28,
      label: 'Project onto Axis 2'
    });
    const reset = makeButton({
      cls: 'reset-btn',
      x: 10,
      y: height - 42,
      wBtn: 90,
      hBtn: 30,
      label: 'Reset'
    });
    toggle.btn.on('click', function(event) {
      event.stopPropagation();
      if (!axisDefined) {
        hintText.text('Define Axis 1 first (two clicks).');
        return;
      }
      if (viewMode === 'uv') {
        setView('original');
      } else {
        setView('uv');
      }
      toggle.text.text(viewMode === 'uv'
        ? 'Show in original coordinates (x,y)'
        : 'Show in new coordinates (u,v)');
    });
    proj1.btn.on('click', function(event) {
      event.stopPropagation();
      if (!axisDefined) {
        hintText.text('Define Axis 1 first (two clicks).');
        return;
      }
      if (viewMode !== 'uv') {
        hintText.text('Switch to new coordinates (u,v) first.');
        return;
      }
      setView('proj1');
      toggle.text.text('Show in new coordinates (u,v)');
    });
    proj2.btn.on('click', function(event) {
      event.stopPropagation();
      if (!axisDefined) {
        hintText.text('Define Axis 1 first (two clicks).');
        return;
      }
      if (viewMode !== 'uv') {
        hintText.text('Switch to new coordinates (u,v) first.');
        return;
      }
      setView('proj2');
      toggle.text.text('Show in new coordinates (u,v)');
    });
    reset.btn.on('click', function(event) {
      event.stopPropagation();
      viewMode = 'original';
      restoreOriginalView();
      clearAxes();
      toggle.text.text('Show in new coordinates (u,v)');
    });
    // Initial state
    clearAxes();
  }
  init();
  // Reveal.js lifecycle hooks
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => {
      if (e.currentSlide && e.currentSlide.querySelector(`#${containerId}`)) init();
    });
    Reveal.on('ready', e => {
      if (e.currentSlide && e.currentSlide.querySelector(`#${containerId}`)) init();
    });
  }
  // Resize handling
  window.addEventListener('resize', () => {
    if (document.getElementById(containerId)) init();
  });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="why-pca" -->
## Why Do We Need PCA?

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! High-dimensional data is common in water science

-: pH, conductivity, NO₃, PO₄, DO, turbidity, PFAS compounds, metals...
-: Often 10–50+ variables per sample

***

-! The curse of dimensionality

-: Visualization fails beyond 3D
-: Distances become less meaningful
-: Many variables are correlated (redundant information)

***

-? How can we simplify without losing the essential patterns?
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Example: Water Quality Monitoring

<div style="background: #1e3a5f; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.75em;">
Dataset: 50 groundwater samples, 12 chemical variables
</div>

-! Goal: Find the main gradients in water chemistry

-: Are samples similar by location? By aquifer type?
-: Which variables drive the differences?

***

-= PCA compresses 12 dimensions into 2–3 while preserving most variation
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-solution-preview" -->
## PCA Reveals Hidden Structure

<div id="pca-solution-demo" style="width: 100%; height: 850px;"></div>

<script>
(function() {
  const containerId = 'pca-solution-demo';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 900;
    const height = 850;
    const margin = { top: 60, right: 180, bottom: 70, left: 80 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#ccc',
      aquifer1: '#1f77b4', aquifer2: '#d62728', aquifer3: '#2ca02c',
      text: '#222', annotation: '#555'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d',
      aquifer1: '#74c0fc', aquifer2: '#ff6b6b', aquifer3: '#51cf66',
      text: '#e2e8f0', annotation: '#94a3b8'
    };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    // Generate synthetic PCA data for 50 groundwater samples
    // 3 aquifer types, 2 locations (upstream/downstream)
    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(2024);
    function gauss() { return Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-9))) * Math.cos(2 * Math.PI * rng()); }

    // Aquifer types determine PC1 (mineralization gradient)
    // Location determines PC2 (depth/recharge gradient)
    const aquifers = [
      { name: 'Alluvial', pc1Center: -3.5, color: theme.aquifer1 },
      { name: 'Limestone', pc1Center: 0, color: theme.aquifer2 },
      { name: 'Sandstone', pc1Center: 3.5, color: theme.aquifer3 }
    ];
    const locations = [
      { name: 'Upstream', pc2Offset: 2 },
      { name: 'Downstream', pc2Offset: -2 }
    ];

    const samples = [];
    let sampleId = 1;
    aquifers.forEach((aq, ai) => {
      locations.forEach((loc, li) => {
        // ~8-9 samples per group
        const nSamples = ai === 1 ? 9 : 8;
        for (let i = 0; i < nSamples; i++) {
          samples.push({
            id: sampleId++,
            aquifer: aq.name,
            aquiferIdx: ai,
            location: loc.name,
            locationIdx: li,
            pc1: aq.pc1Center + gauss() * 0.9,
            pc2: loc.pc2Offset + gauss() * 0.8,
            color: aq.color
          });
        }
      });
    });

    // Scales
    const xScale = d3.scaleLinear().domain([-6, 6]).range([0, w]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([h, 0]);

    // Grid
    g.append('g').selectAll('line.h').data(d3.range(-5, 6)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    g.append('g').selectAll('line.v').data(d3.range(-6, 7)).enter().append('line')
      .attr('y1', 0).attr('y2', h).attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(6))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    // Axis labels
    g.append('text').attr('x', w / 2).attr('y', h + 50).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '15px').attr('font-weight', 'bold')
      .text('PC1 (45%) — Mineralization Gradient');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -55)
      .attr('text-anchor', 'middle').attr('fill', theme.axis).attr('font-size', '15px').attr('font-weight', 'bold')
      .text('PC2 (25%) — Depth / Recharge');

    // Draw cluster ellipses for each aquifer type
    aquifers.forEach((aq, ai) => {
      const aqSamples = samples.filter(s => s.aquiferIdx === ai);
      const cx = d3.mean(aqSamples, d => d.pc1);
      const cy = d3.mean(aqSamples, d => d.pc2);
      const rx = d3.deviation(aqSamples, d => d.pc1) * 2.2 || 1.5;
      const ry = d3.deviation(aqSamples, d => d.pc2) * 2.2 || 1.5;
      
      g.append('ellipse')
        .attr('cx', xScale(cx)).attr('cy', yScale(cy))
        .attr('rx', Math.abs(xScale(rx) - xScale(0))).attr('ry', Math.abs(yScale(ry) - yScale(0)))
        .attr('fill', aq.color).attr('opacity', 0.12)
        .attr('stroke', aq.color).attr('stroke-width', 2).attr('stroke-dasharray', '6,4');
    });

    // Draw horizontal separation line for location
    g.append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', yScale(0)).attr('y2', yScale(0))
      .attr('stroke', theme.annotation).attr('stroke-width', 1.5).attr('stroke-dasharray', '10,5').attr('opacity', 0.6);
    
    // Location annotations
    g.append('text').attr('x', w - 10).attr('y', yScale(3.5)).attr('text-anchor', 'end')
      .attr('fill', theme.annotation).attr('font-size', '13px').attr('font-style', 'italic')
      .text('↑ Upstream (recharge zone)');
    g.append('text').attr('x', w - 10).attr('y', yScale(-3.5)).attr('text-anchor', 'end')
      .attr('fill', theme.annotation).attr('font-size', '13px').attr('font-style', 'italic')
      .text('↓ Downstream (discharge zone)');

    // Draw data points
    samples.forEach(s => {
      const shape = s.locationIdx === 0 ? 'circle' : 'rect';
      if (shape === 'circle') {
        g.append('circle')
          .attr('cx', xScale(s.pc1)).attr('cy', yScale(s.pc2))
          .attr('r', 8)
          .attr('fill', s.color).attr('opacity', 0.85)
          .attr('stroke', '#fff').attr('stroke-width', 1.5);
      } else {
        g.append('rect')
          .attr('x', xScale(s.pc1) - 7).attr('y', yScale(s.pc2) - 7)
          .attr('width', 14).attr('height', 14)
          .attr('fill', s.color).attr('opacity', 0.85)
          .attr('stroke', '#fff').attr('stroke-width', 1.5)
          .attr('rx', 2);
      }
    });

    // Title
    svg.append('text').attr('x', width / 2).attr('y', 30).attr('text-anchor', 'middle')
      .attr('fill', theme.text).attr('font-size', '16px').attr('font-weight', 'bold')
      .text('50 Groundwater Samples • 12 Variables → 2 Principal Components');

    // Legend
    const legend = svg.append('g').attr('transform', `translate(${width - 165}, ${margin.top + 20})`);
    
    legend.append('text').attr('x', 0).attr('y', 0)
      .attr('fill', theme.text).attr('font-size', '13px').attr('font-weight', 'bold').text('Aquifer Type');
    
    aquifers.forEach((aq, i) => {
      legend.append('circle').attr('cx', 10).attr('cy', 25 + i * 28).attr('r', 8).attr('fill', aq.color);
      legend.append('text').attr('x', 25).attr('y', 30 + i * 28)
        .attr('fill', theme.text).attr('font-size', '12px').text(aq.name);
    });

    legend.append('text').attr('x', 0).attr('y', 120)
      .attr('fill', theme.text).attr('font-size', '13px').attr('font-weight', 'bold').text('Location');
    
    legend.append('circle').attr('cx', 10).attr('cy', 145).attr('r', 7)
      .attr('fill', theme.axis).attr('opacity', 0.6);
    legend.append('text').attr('x', 25).attr('y', 150)
      .attr('fill', theme.text).attr('font-size', '12px').text('Upstream');
    
    legend.append('rect').attr('x', 3).attr('y', 165).attr('width', 14).attr('height', 14)
      .attr('fill', theme.axis).attr('opacity', 0.6).attr('rx', 2);
    legend.append('text').attr('x', 25).attr('y', 177)
      .attr('fill', theme.text).attr('font-size', '12px').text('Downstream');

    // Info box
    const infoBox = svg.append('g').attr('transform', `translate(${margin.left + 15}, ${height - 55})`);
    infoBox.append('rect').attr('x', -10).attr('y', -18).attr('width', 520).attr('height', 45)
      .attr('fill', isPerf ? 'rgba(31,119,180,0.15)' : 'rgba(116,192,252,0.15)')
      .attr('stroke', theme.aquifer1).attr('stroke-width', 1).attr('rx', 6);
    infoBox.append('text').attr('x', 0).attr('y', 0)
      .attr('fill', theme.text).attr('font-size', '13px')
      .text('✓ PC1 separates aquifer types (chemistry differences)');
    infoBox.append('text').attr('x', 0).attr('y', 20)
      .attr('fill', theme.text).attr('font-size', '13px')
      .text('✓ PC2 separates locations (recharge vs discharge)');
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>

---

<!-- .slide:id="pca-fundamentals" -->
## PCA Fundamentals

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! PCA finds new axes that maximize variance

-: PC1 points in the direction of greatest data spread
-: PC2 is perpendicular and captures the next most spread

***

-! Loadings describe each PC

-: Coefficients showing how original variables combine
-: High loading = variable contributes strongly to that PC

***

-! Scores are sample coordinates in PC space

-: Used for visualization (score plots)
-: Reveal sample groupings and outliers
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pca-axis-rotation" style="width: 100%; height: 700px;"></div>

<script>
(function() {
  const containerId = 'pca-axis-rotation';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;
    const size = Math.min(width, height);
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', point: '#1f77b4', pc1: '#d62728', pc2: '#2ca02c', axis: '#222', grid: '#999'
    } : {
      bg: '#0b1220', point: '#74c0fc', pc1: '#ff6b6b', pc2: '#51cf66', axis: '#cbd5e1', grid: '#46586d'
    };

    const svg = d3.select(`#${containerId}`).append('svg')
      .attr('width', size).attr('height', size);
    svg.append('rect').attr('width', size).attr('height', size).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = size - margin.left - margin.right;
    const h = size - margin.top - margin.bottom;

    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(77);

    const points = [];
    for (let i = 0; i < 60; i++) {
      const t = (rng() - 0.5) * 6;
      points.push({ x: t + (rng() - 0.5) * 1.2, y: 0.7 * t + (rng() - 0.5) * 1.5 });
    }

    const xScale = d3.scaleLinear().domain([-5, 5]).range([0, w]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([h, 0]);

    g.append('g').selectAll('line').data(d3.range(-5, 6)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    g.append('g').selectAll('line').data(d3.range(-5, 6)).enter().append('line')
      .attr('y1', 0).attr('y2', h).attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text').style('fill', theme.axis);
    g.append('g').call(d3.axisLeft(yScale).ticks(5)).selectAll('text').style('fill', theme.axis);
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    g.append('text').attr('x', w / 2).attr('y', h + 40).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '13px').text('Conductivity (scaled)');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -45)
      .attr('text-anchor', 'middle').attr('fill', theme.axis).attr('font-size', '13px').text('TDS (scaled)');

    g.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y))
      .attr('r', 6).attr('fill', theme.point).attr('opacity', 0.8);

    const angle = Math.atan(0.7);
    const pc1Dir = [Math.cos(angle), Math.sin(angle)];
    const pc2Dir = [-Math.sin(angle), Math.cos(angle)];

    function drawArrow(dir, color, label, offset) {
      const len = 3.8;
      g.append('line')
        .attr('x1', xScale(0)).attr('y1', yScale(0))
        .attr('x2', xScale(dir[0] * len)).attr('y2', yScale(dir[1] * len))
        .attr('stroke', color).attr('stroke-width', 3).attr('marker-end', 'url(#arrow-' + label + ')');
      g.append('text')
        .attr('x', xScale(dir[0] * len) + offset[0])
        .attr('y', yScale(dir[1] * len) + offset[1])
        .attr('fill', color).attr('font-size', '14px').attr('font-weight', 'bold').text(label);
    }

    const defs = svg.append('defs');
    ['PC1', 'PC2'].forEach((id, i) => {
      defs.append('marker').attr('id', 'arrow-' + id).attr('viewBox', '0 0 10 10')
        .attr('refX', 9).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto-start-reverse')
        .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', i === 0 ? theme.pc1 : theme.pc2);
    });

    drawArrow(pc1Dir, theme.pc1, 'PC1', [8, 5]);
    drawArrow(pc2Dir, theme.pc2, 'PC2', [-30, -5]);
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-steps" -->
## PCA Step-by-Step

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
Step 1: Preprocessing

-> Center the data (subtract the mean of each variable)
-> Scale if variables have different units (e.g., pH vs. conductivity in µS/cm)

-< Auto scaling (standardization): mean=0, std=1
$$ \mathbf{X}_c = \frac{\mathbf{X} - \mu}{\sigma} $$

<!-- /position -->
<!-- position={row: 1, column: 2} -->

Step 2: Compute Covariance Matrix

-> Measures how variables vary together

***

$$ \mathbf{corr}(\mathbf{X}) = \begin{bmatrix}
p_{11} & p_{12} & \cdots & p_{1n} \\\\
p_{21} & p_{22} & \cdots & p_{2n} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
p_{n1} & p_{n2} & \cdots & p_{nn}
\end{bmatrix} $$

-: p_ij = correlation between variable i and j:
-: $p_{ij} = \frac{cov(X_i, X_j)}{\sigma_{X_i} \sigma_{X_j}}$
-: $corr(X) = \frac{1}{n-1} X_c^T X_c$

```r
# Example R code to compute correlation matrix
corr_matrix <- cor(scale(data))
```

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-steps-2" -->
## PCA Step-by-Step (Cont.)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

Step 3: Eigenvalue Decomposition

-> Eigenvectors become the PC directions (loadings)
-> Eigenvalues indicate variance captured by each PC
-< Number of Eigenvectors = number of original variables

***

Step 4: Projection

-> Multiply centered data by eigenvectors
-> Result: Scores (sample coordinates in PC space)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Mathematical Summary

$$ \mathbf{T} = \mathbf{X}_c \cdot \mathbf{P} $$

-: T = score matrix (samples × PCs)
-: X_c = centered data matrix
-: P = loading matrix (eigenvectors)

***

-= Total variance is preserved: sum of all eigenvalues equals total variance of X
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="eigenvalues-variance" -->
## Interpreting Eigenvalues

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Eigenvalues quantify variance per PC

-: Larger eigenvalue = more variance explained
-: Convert to percentage: λᵢ / Σλ × 100%

***

-! Scree Plot visualizes eigenvalues

-: Bar or line chart of eigenvalue vs. PC number
-: Look for the elbow where values drop off

***

Common Selection Criteria

-> Cumulative variance: keep enough PCs to explain 80–90%
-> Elbow method: stop at the bend in the scree plot
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="scree-plot-demo" style="width: 100%; height: 700px;"></div>

<script>
(function() {
  const containerId = 'scree-plot-demo';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;
    const margin = { top: 40, right: 40, bottom: 60, left: 70 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', bar: '#1f77b4', line: '#d62728', axis: '#222', grid: '#bbb', thresh: '#ff7f0e'
    } : {
      bg: '#0b1220', bar: '#74c0fc', line: '#ff6b6b', axis: '#cbd5e1', grid: '#46586d', thresh: '#ffd43b'
    };

    const eigenvalues = [3.8, 1.9, 0.95, 0.55, 0.35, 0.25, 0.12, 0.08];
    const total = eigenvalues.reduce((a, b) => a + b, 0);
    const pct = eigenvalues.map(e => (e / total * 100));
    const cumPct = pct.reduce((acc, v) => { acc.push((acc.length ? acc[acc.length - 1] : 0) + v); return acc; }, []);

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand().domain(d3.range(1, 9)).range([0, w]).padding(0.3);
    const yScaleBar = d3.scaleLinear().domain([0, 50]).range([h, 0]);
    const yScaleLine = d3.scaleLinear().domain([0, 100]).range([h, 0]);

    g.append('g').selectAll('line').data([10, 20, 30, 40, 50]).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScaleBar(d)).attr('y2', d => yScaleBar(d))
      .attr('stroke', theme.grid).attr('opacity', 0.4);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).tickFormat(d => 'PC' + d))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.append('g').call(d3.axisLeft(yScaleBar).ticks(5).tickFormat(d => d + '%'))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.append('g').attr('transform', `translate(${w},0)`).call(d3.axisRight(yScaleLine).ticks(5).tickFormat(d => d + '%'))
      .selectAll('text').style('fill', theme.line).style('font-size', '11px');

    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    g.selectAll('rect.bar').data(pct).enter().append('rect')
      .attr('x', (d, i) => xScale(i + 1)).attr('y', d => yScaleBar(d))
      .attr('width', xScale.bandwidth()).attr('height', d => h - yScaleBar(d))
      .attr('fill', theme.bar).attr('opacity', 0.85);

    const line = d3.line().x((d, i) => xScale(i + 1) + xScale.bandwidth() / 2).y(d => yScaleLine(d));
    g.append('path').datum(cumPct).attr('d', line)
      .attr('fill', 'none').attr('stroke', theme.line).attr('stroke-width', 2.5);
    g.selectAll('circle.cum').data(cumPct).enter().append('circle')
      .attr('cx', (d, i) => xScale(i + 1) + xScale.bandwidth() / 2).attr('cy', d => yScaleLine(d))
      .attr('r', 5).attr('fill', theme.line);

    g.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', yScaleLine(80)).attr('y2', yScaleLine(80))
      .attr('stroke', theme.thresh).attr('stroke-width', 2).attr('stroke-dasharray', '6,4');
    g.append('text').attr('x', w - 5).attr('y', yScaleLine(80) - 8)
      .attr('text-anchor', 'end').attr('fill', theme.thresh).attr('font-size', '12px').text('80% threshold');

    g.append('text').attr('x', w / 2).attr('y', h + 45).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '13px').text('Principal Component');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -50)
      .attr('text-anchor', 'middle').attr('fill', theme.axis).attr('font-size', '13px').text('Variance Explained (%)');
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="excursion-coordinate-systems" -->
## Coordinate Systems and Data Spaces

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Measurement data are not just numbers

-: They are points in a coordinate system
-: Each variable defines one axis

***

-! A dataset with n samples and p variables

-: Lives in a p-dimensional space
-: Our water quality data: 12 variables = 12D space

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="coord-data-space" style="width: 100%; height: 650px;"></div>

<script>
(function() {
  const containerId = 'coord-data-space';
  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 650;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', point: '#1f77b4', axis: '#222', grid: '#bbb', highlight: '#d62728'
    } : {
      bg: '#0b1220', point: '#74c0fc', axis: '#cbd5e1', grid: '#46586d', highlight: '#ff6b6b'
    };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(42);

    const points = [];
    for (let i = 0; i < 25; i++) {
      points.push({ x: 2 + rng() * 6, y: 1 + rng() * 5, id: i + 1 });
    }

    const xScale = d3.scaleLinear().domain([0, 10]).range([0, w]);
    const yScale = d3.scaleLinear().domain([0, 8]).range([h, 0]);

    // Grid
    g.append('g').selectAll('line').data(d3.range(0, 11)).enter().append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d)).attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    g.append('g').selectAll('line').data(d3.range(0, 9)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);

    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    g.append('text').attr('x', w / 2).attr('y', h + 45).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '14px').attr('font-weight', 'bold').text('Variable 1 (e.g., pH)');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -45)
      .attr('text-anchor', 'middle').attr('fill', theme.axis).attr('font-size', '14px').attr('font-weight', 'bold').text('Variable 2 (e.g., EC)');

    // Data points
    g.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y))
      .attr('r', 8).attr('fill', theme.point).attr('opacity', 0.85)
      .attr('stroke', '#fff').attr('stroke-width', 1.5);

    // Annotation
    svg.append('text').attr('x', width / 2).attr('y', 25).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '14px').text('25 samples in 2D space');

    // Highlight one point
    const hp = points[5];
    g.append('circle').attr('cx', xScale(hp.x)).attr('cy', yScale(hp.y))
      .attr('r', 14).attr('fill', 'none').attr('stroke', theme.highlight).attr('stroke-width', 3);
    g.append('text').attr('x', xScale(hp.x) + 20).attr('y', yScale(hp.y) - 10)
      .attr('fill', theme.highlight).attr('font-size', '12px')
      .text(`Sample 6: (${hp.x.toFixed(1)}, ${hp.y.toFixed(1)})`);
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="axes-are-vectors" -->
## Axes Are Vectors

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Key Insight

-: Every axis of a coordinate system is a vector
-: In 2D: x-axis = (1, 0) and y-axis = (0, 1)

***

-! Standard Coordinate System

-: The axis vectors form the identity matrix

$$ e_1 = \begin{pmatrix} 1 \\\\ 0 \end{pmatrix}, \quad e_2 = \begin{pmatrix} 0 \\\\ 1 \end{pmatrix}, \quad \Rightarrow \quad I = \begin{pmatrix} 1 & 0 \\\\ 0 & 1 \end{pmatrix} $$

***

-< Any point can be written as

$$ \vec{p} = x \cdot \vec{e}_1 + y \cdot \vec{e}_2 $$
-: where e₁ = (1, 0) and e₂ = (0, 1)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="axes-vectors-viz" style="width: 100%; height: 650px;"></div>

<script>
(function() {
  const containerId = 'axes-vectors-viz';
  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 650;
    const margin = { top: 40, right: 40, bottom: 50, left: 50 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#bbb', e1: '#d62728', e2: '#2ca02c', point: '#1f77b4'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', e1: '#ff6b6b', e2: '#51cf66', point: '#74c0fc'
    };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const cx = w / 2, cy = h / 2;
    const scale = Math.min(w, h) / 8;

    // Grid
    for (let i = -4; i <= 4; i++) {
      g.append('line').attr('x1', cx + i * scale).attr('x2', cx + i * scale).attr('y1', 0).attr('y2', h)
        .attr('stroke', theme.grid).attr('opacity', 0.3);
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', cy - i * scale).attr('y2', cy - i * scale)
        .attr('stroke', theme.grid).attr('opacity', 0.3);
    }

    // Main axes
    g.append('line').attr('x1', 0).attr('x2', w).attr('y1', cy).attr('y2', cy)
      .attr('stroke', theme.axis).attr('stroke-width', 1);
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.axis).attr('stroke-width', 1);

    // Arrow markers
    const defs = svg.append('defs');
    [['e1', theme.e1], ['e2', theme.e2], ['pt', theme.point]].forEach(([id, col]) => {
      defs.append('marker').attr('id', `arr-${id}-${containerId}`).attr('viewBox', '0 0 10 10')
        .attr('refX', 9).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
        .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', col);
    });

    // e1 vector (1,0)
    g.append('line').attr('x1', cx).attr('y1', cy)
      .attr('x2', cx + 2 * scale).attr('y2', cy)
      .attr('stroke', theme.e1).attr('stroke-width', 4).attr('marker-end', `url(#arr-e1-${containerId})`);
    g.append('text').attr('x', cx + 2.2 * scale).attr('y', cy + 25)
      .attr('fill', theme.e1).attr('font-size', '16px').attr('font-weight', 'bold').text('e₁ = (1, 0)');

    // e2 vector (0,1)
    g.append('line').attr('x1', cx).attr('y1', cy)
      .attr('x2', cx).attr('y2', cy - 2 * scale)
      .attr('stroke', theme.e2).attr('stroke-width', 4).attr('marker-end', `url(#arr-e2-${containerId})`);
    g.append('text').attr('x', cx + 10).attr('y', cy - 2.2 * scale)
      .attr('fill', theme.e2).attr('font-size', '16px').attr('font-weight', 'bold').text('e₂ = (0, 1)');

    // Example point
    const px = 3, py = 2;
    g.append('circle').attr('cx', cx + px * scale).attr('cy', cy - py * scale)
      .attr('r', 10).attr('fill', theme.point);
    g.append('text').attr('x', cx + px * scale + 15).attr('y', cy - py * scale - 10)
      .attr('fill', theme.point).attr('font-size', '14px').attr('font-weight', 'bold').text(`P = (${px}, ${py})`);

    // Decomposition lines
    g.append('line').attr('x1', cx).attr('y1', cy).attr('x2', cx + px * scale).attr('y2', cy)
      .attr('stroke', theme.e1).attr('stroke-width', 2).attr('stroke-dasharray', '5,3').attr('opacity', 0.7);
    g.append('line').attr('x1', cx + px * scale).attr('y1', cy).attr('x2', cx + px * scale).attr('y2', cy - py * scale)
      .attr('stroke', theme.e2).attr('stroke-width', 2).attr('stroke-dasharray', '5,3').attr('opacity', 0.7);

    // Labels
    g.append('text').attr('x', cx + px * scale / 2).attr('y', cy + 18)
      .attr('text-anchor', 'middle').attr('fill', theme.e1).attr('font-size', '12px').text('3 × e₁');
    g.append('text').attr('x', cx + px * scale + 15).attr('y', cy - py * scale / 2)
      .attr('fill', theme.e2).attr('font-size', '12px').text('2 × e₂');

    svg.append('text').attr('x', width / 2).attr('y', 25).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '14px').text('Standard basis vectors span the coordinate system');
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="coord-system-is-matrix" -->
## A Coordinate System Is a Matrix

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Coordinate System = Basis

-: Consists of multiple basis vectors
-: These vectors form a matrix

$$ \vec{b}\_1 = \begin{pmatrix} b\_{11} \\\\ b\_{21} \end{pmatrix}, \quad \vec{b}\_2 = \begin{pmatrix} b\_{12} \\\\ b\_{22} \end{pmatrix}$$
$$ \Rightarrow \quad \mathbf{B} = \begin{pmatrix} b\_{11} & b\_{12} \\\\ b\_{21} & b\_{22} \end{pmatrix} $$

***

-! Key Consequence

-: Change the basis vectors → change the coordinate system
-: But the **data points themselves don't move**!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="coord-matrix-viz" style="width: 100%; height: 580px;"></div>
<div style="display: flex; align-items: center; gap: 15px; margin-top: 10px; padding: 0 20px;">
  <span style="font-size: 0.8em;">Rotation:</span>
  <input type="range" id="coord-angle-slider" min="0" max="90" value="0" style="flex: 1;">
  <span id="coord-angle-value" style="font-size: 0.8em; min-width: 40px;">0°</span>
</div>

<script>
(function() {
  const containerId = 'coord-matrix-viz';
  let angle = 0;

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const slider = document.getElementById('coord-angle-slider');
    const valueDisplay = document.getElementById('coord-angle-value');
    if (slider) {
      angle = +slider.value;
      if (valueDisplay) valueDisplay.textContent = angle + '°';
      slider.oninput = () => { angle = +slider.value; if (valueDisplay) valueDisplay.textContent = angle + '°'; init(); };
    }

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 580;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#888', grid: '#ccc', b1: '#d62728', b2: '#2ca02c', point: '#1f77b4', oldAxis: '#bbb'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', b1: '#ff6b6b', b2: '#51cf66', point: '#74c0fc', oldAxis: '#555'
    };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const cx = w / 2, cy = h / 2;
    const scale = Math.min(w, h) / 8;

    const rad = angle * Math.PI / 180;
    const b1 = [Math.cos(rad), Math.sin(rad)];
    const b2 = [-Math.sin(rad), Math.cos(rad)];

    // Data points
    const pts = [[2, 1], [1, 2.5], [3, 2], [2.5, 3], [1.5, 1.5], [3.5, 1], [0.5, 3]];

    // Old axes (faded)
    g.append('line').attr('x1', cx - 4 * scale).attr('x2', cx + 4 * scale).attr('y1', cy).attr('y2', cy)
      .attr('stroke', theme.oldAxis).attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', cy - 4 * scale).attr('y2', cy + 4 * scale)
      .attr('stroke', theme.oldAxis).attr('stroke-width', 1).attr('stroke-dasharray', '4,4');

    // New axes
    const defs = svg.append('defs');
    [['b1', theme.b1], ['b2', theme.b2]].forEach(([id, col]) => {
      defs.append('marker').attr('id', `arr-${id}-cm`).attr('viewBox', '0 0 10 10')
        .attr('refX', 9).attr('refY', 5).attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
        .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', col);
    });

    // Draw rotated grid
    for (let i = -3; i <= 3; i++) {
      if (i === 0) continue;
      // Lines parallel to b1
      const startX = cx + i * b2[0] * scale - 4 * b1[0] * scale;
      const startY = cy - i * b2[1] * scale + 4 * b1[1] * scale;
      const endX = cx + i * b2[0] * scale + 4 * b1[0] * scale;
      const endY = cy - i * b2[1] * scale - 4 * b1[1] * scale;
      g.append('line').attr('x1', startX).attr('y1', startY).attr('x2', endX).attr('y2', endY)
        .attr('stroke', theme.b2).attr('opacity', 0.2);
      // Lines parallel to b2
      const startX2 = cx + i * b1[0] * scale - 4 * b2[0] * scale;
      const startY2 = cy - i * b1[1] * scale + 4 * b2[1] * scale;
      const endX2 = cx + i * b1[0] * scale + 4 * b2[0] * scale;
      const endY2 = cy - i * b1[1] * scale - 4 * b2[1] * scale;
      g.append('line').attr('x1', startX2).attr('y1', startY2).attr('x2', endX2).attr('y2', endY2)
        .attr('stroke', theme.b1).attr('opacity', 0.2);
    }

    // b1 axis
    g.append('line').attr('x1', cx - 3.5 * b1[0] * scale).attr('y1', cy + 3.5 * b1[1] * scale)
      .attr('x2', cx + 3.5 * b1[0] * scale).attr('y2', cy - 3.5 * b1[1] * scale)
      .attr('stroke', theme.b1).attr('stroke-width', 2);
    g.append('line').attr('x1', cx).attr('y1', cy)
      .attr('x2', cx + 2 * b1[0] * scale).attr('y2', cy - 2 * b1[1] * scale)
      .attr('stroke', theme.b1).attr('stroke-width', 4).attr('marker-end', 'url(#arr-b1-cm)');

    // b2 axis
    g.append('line').attr('x1', cx - 3.5 * b2[0] * scale).attr('y1', cy + 3.5 * b2[1] * scale)
      .attr('x2', cx + 3.5 * b2[0] * scale).attr('y2', cy - 3.5 * b2[1] * scale)
      .attr('stroke', theme.b2).attr('stroke-width', 2);
    g.append('line').attr('x1', cx).attr('y1', cy)
      .attr('x2', cx + 2 * b2[0] * scale).attr('y2', cy - 2 * b2[1] * scale)
      .attr('stroke', theme.b2).attr('stroke-width', 4).attr('marker-end', 'url(#arr-b2-cm)');

    // Labels
    g.append('text').attr('x', cx + 2.3 * b1[0] * scale).attr('y', cy - 2.3 * b1[1] * scale + 5)
      .attr('fill', theme.b1).attr('font-size', '14px').attr('font-weight', 'bold').text('b₁');
    g.append('text').attr('x', cx + 2.3 * b2[0] * scale + 5).attr('y', cy - 2.3 * b2[1] * scale)
      .attr('fill', theme.b2).attr('font-size', '14px').attr('font-weight', 'bold').text('b₂');

    // Data points (fixed in original coordinates)
    pts.forEach((p, i) => {
      const px = cx + p[0] * scale;
      const py = cy - p[1] * scale;
      g.append('circle').attr('cx', px).attr('cy', py).attr('r', 8)
        .attr('fill', theme.point).attr('opacity', 0.9).attr('stroke', '#fff').attr('stroke-width', 1.5);
    });

    // Matrix display
    const matrixG = svg.append('g').attr('transform', `translate(${width - 340}, ${height - 80})`);
    matrixG.append('text').attr('x', 0).attr('y', 0).attr('fill', theme.axis).attr('font-size', '32px').text('Basis Matrix B:');
    matrixG.append('text').attr('x', 0).attr('y', 32).attr('fill', theme.b1).attr('font-size', '33px').attr('font-family', 'monospace')
      .text(`b₁ = (${b1[0].toFixed(2)}, ${b1[1].toFixed(2)})`);
    matrixG.append('text').attr('x', 0).attr('y', 62).attr('fill', theme.b2).attr('font-size', '33px').attr('font-family', 'monospace')
      .text(`b₂ = (${b2[0].toFixed(2)}, ${b2[1].toFixed(2)})`);
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="coord-transform-matrix" -->
## Coordinate Transformation via Matrix Multiplication

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Data Matrix X

-: Rows = samples, Columns = variables
-: Each row is a point in p-dimensional space

***

-! Transformation to new coordinates

$$ X_{\text{new}} = X \cdot B $$

-: Same points, different coordinates
-: Different coordinate system

***

-= We transform our description, not the reality itself
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="matrix-transform-viz" style="width: 100%; height: 550px;"></div>
<div style="display: flex; gap: 15px; margin-top: 10px; padding: 0 20px; align-items: center;">
  <button id="btn-transform-toggle" style="padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; font-size: 0.9em;">Transform</button>
  <span id="transform-status" style="font-size: 0.75em;"></span>
</div>

<script>
(function() {
  const containerId = 'matrix-transform-viz';
  let transformed = false;

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const btn = document.getElementById('btn-transform-toggle');
    const status = document.getElementById('transform-status');
    
    const isPerf = document.body.classList.contains('performance-mode');
    if (btn) {
      btn.style.background = isPerf ? '#1f77b4' : '#74c0fc';
      btn.style.color = isPerf ? '#fff' : '#000';
      btn.onclick = () => { transformed = !transformed; init(); };
    }

    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#bbb', point: '#d62728', newPoint: '#2ca02c'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', point: '#ff6b6b', newPoint: '#51cf66'
    };

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const cx = w / 2, cy = h / 2;
    const scale = Math.min(w, h) / 10;

    // Original points
    const original = [[1, 2], [2, 1], [3, 3], [1.5, 3.5], [3.5, 2]];
    // Transformation matrix B (45° rotation + slight scale)
    const angle = Math.PI / 4;
    const B = [[Math.cos(angle), -Math.sin(angle)], [Math.sin(angle), Math.cos(angle)]];
    
    // Transformed points
    const transformedPts = original.map(p => [
      p[0] * B[0][0] + p[1] * B[1][0],
      p[0] * B[0][1] + p[1] * B[1][1]
    ]);

    const pts = transformed ? transformedPts : original;

    // Grid
    for (let i = -5; i <= 5; i++) {
      g.append('line').attr('x1', cx + i * scale).attr('x2', cx + i * scale).attr('y1', 0).attr('y2', h)
        .attr('stroke', theme.grid).attr('opacity', 0.3);
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', cy - i * scale).attr('y2', cy - i * scale)
        .attr('stroke', theme.grid).attr('opacity', 0.3);
    }

    // Axes
    g.append('line').attr('x1', 0).attr('x2', w).attr('y1', cy).attr('y2', cy)
      .attr('stroke', theme.axis).attr('stroke-width', 1.5);
    g.append('line').attr('x1', cx).attr('x2', cx).attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.axis).attr('stroke-width', 1.5);

    // Points
    const color = transformed ? theme.newPoint : theme.point;
    pts.forEach((p, i) => {
      g.append('circle').attr('cx', cx + p[0] * scale).attr('cy', cy - p[1] * scale)
        .attr('r', 10).attr('fill', color).attr('opacity', 0.9).attr('stroke', '#fff').attr('stroke-width', 2);
      g.append('text').attr('x', cx + p[0] * scale + 12).attr('y', cy - p[1] * scale + 4)
        .attr('fill', theme.axis).attr('font-size', '11px')
        .text(`(${p[0].toFixed(1)}, ${p[1].toFixed(1)})`);
    });

    // Status text
    if (status) {
      if (transformed) {
        status.innerHTML = `<span style="color:${theme.newPoint}">● Transformed coordinates (X × B)</span>`;
      } else {
        status.innerHTML = `<span style="color:${theme.point}">● Original coordinates</span>`;
      }
    }

    // Matrix display
    svg.append('text').attr('x', 20).attr('y', height - 60).attr('fill', theme.axis).attr('font-size', '12px')
      .text('B = rotation matrix (45°)');
    svg.append('text').attr('x', 20).attr('y', height - 40).attr('fill', theme.axis).attr('font-size', '11px').attr('font-family', 'monospace')
      .text(`[${B[0][0].toFixed(2)}, ${B[1][0].toFixed(2)}]`);
    svg.append('text').attr('x', 20).attr('y', height - 25).attr('fill', theme.axis).attr('font-size', '11px').attr('font-family', 'monospace')
      .text(`[${B[0][1].toFixed(2)}, ${B[1][1].toFixed(2)}]`);
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) { transformed = false; init(); } });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="which-coord-system" -->
## Which Coordinate System Is Best?

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-? Central Question

-: There are infinitely many coordinate systems
-: Which one describes the data best?

***

-! Sensible axes should

-: Capture as much variation as possible
-: Contain as little redundancy as possible
-: Be orthogonal (uncorrelated)

***

-= PCA finds the optimal coordinate system for describing the data
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="best-coord-viz" style="width: 100%; height: 550px;"></div>
<div style="display: flex; align-items: center; gap: 15px; margin-top: 10px; padding: 0 20px;">
  <span style="font-size: 0.8em;">Axis angle:</span>
  <input type="range" id="best-coord-slider" min="0" max="180" value="0" style="flex: 1;">
  <span id="best-coord-angle" style="font-size: 0.8em; min-width: 40px;">0°</span>
</div>
<div id="variance-display" style="text-align: center; margin-top: 8px; font-size: 0.85em;"></div>

<script>
(function() {
  const containerId = 'best-coord-viz';
  let angle = 0;

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const slider = document.getElementById('best-coord-slider');
    const angleDisplay = document.getElementById('best-coord-angle');
    const varDisplay = document.getElementById('variance-display');
    if (slider) {
      angle = +slider.value;
      if (angleDisplay) angleDisplay.textContent = angle + '°';
      slider.oninput = () => { angle = +slider.value; if (angleDisplay) angleDisplay.textContent = angle + '°'; init(); };
    }

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#bbb', point: '#1f77b4', projAxis: '#d62728', proj: '#2ca02c'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', point: '#74c0fc', projAxis: '#ff6b6b', proj: '#51cf66'
    };

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const cx = w / 2, cy = h / 2;
    const sc = Math.min(w, h) / 10;

    // Correlated data cloud
    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(123);
    function gauss() { return Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-9))) * Math.cos(2 * Math.PI * rng()); }
    
    const pts = [];
    const dataAngle = 35 * Math.PI / 180; // True PC1 direction
    for (let i = 0; i < 40; i++) {
      const t = gauss() * 2.5;
      const n = gauss() * 0.8;
      pts.push([t * Math.cos(dataAngle) - n * Math.sin(dataAngle), t * Math.sin(dataAngle) + n * Math.cos(dataAngle)]);
    }

    // Grid
    for (let i = -5; i <= 5; i++) {
      g.append('line').attr('x1', cx + i * sc).attr('x2', cx + i * sc).attr('y1', 0).attr('y2', h)
        .attr('stroke', theme.grid).attr('opacity', 0.2);
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', cy - i * sc).attr('y2', cy - i * sc)
        .attr('stroke', theme.grid).attr('opacity', 0.2);
    }

    const rad = angle * Math.PI / 180;
    const dir = [Math.cos(rad), Math.sin(rad)];

    // Project points onto axis and calculate variance
    const projections = pts.map(p => p[0] * dir[0] + p[1] * dir[1]);
    const mean = projections.reduce((a, b) => a + b, 0) / projections.length;
    const variance = projections.reduce((a, b) => a + (b - mean) ** 2, 0) / projections.length;
    const maxVar = 7.5; // Approximate max variance

    // Draw projection axis
    g.append('line')
      .attr('x1', cx - 5 * dir[0] * sc).attr('y1', cy + 5 * dir[1] * sc)
      .attr('x2', cx + 5 * dir[0] * sc).attr('y2', cy - 5 * dir[1] * sc)
      .attr('stroke', theme.projAxis).attr('stroke-width', 3);

    // Draw projections
    pts.forEach(p => {
      const proj = p[0] * dir[0] + p[1] * dir[1];
      const px = proj * dir[0];
      const py = proj * dir[1];
      g.append('line')
        .attr('x1', cx + p[0] * sc).attr('y1', cy - p[1] * sc)
        .attr('x2', cx + px * sc).attr('y2', cy - py * sc)
        .attr('stroke', theme.proj).attr('stroke-width', 1).attr('opacity', 0.4);
      g.append('circle')
        .attr('cx', cx + px * sc).attr('cy', cy - py * sc)
        .attr('r', 4).attr('fill', theme.proj).attr('opacity', 0.7);
    });

    // Draw points
    pts.forEach(p => {
      g.append('circle').attr('cx', cx + p[0] * sc).attr('cy', cy - p[1] * sc)
        .attr('r', 6).attr('fill', theme.point).attr('opacity', 0.8);
    });

    // Variance display
    const varPct = (variance / maxVar * 100).toFixed(0);
    const isOptimal = Math.abs(angle - 35) < 5;
    if (varDisplay) {
      varDisplay.innerHTML = `<span style="color:${theme.projAxis}">Variance captured: <strong>${varPct}%</strong></span>` +
        (isOptimal ? ` <span style="color:${theme.proj}">✓ Optimal!</span>` : '');
    }
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) { angle = 0; const s = document.getElementById('best-coord-slider'); if(s) s.value = 0; init(); } });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="eigenvectors-intro" -->
## Eigenvectors: Special Directions in Space

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! What is an Eigenvector?

-: A vector that doesn't change direction under transformation
-: It only gets scaled by a factor λ (eigenvalue)

$$ A \vec{v} = \lambda \vec{v} $$

***

-! Connection to PCA

-: The covariance matrix describes spread & correlation
-: Its eigenvectors are the principal directions of variance
-: These become the PCA axes

***

-= Eigenvectors of the covariance matrix = Principal Components

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="eigenvector-viz" style="width: 100%; height: 550px;"></div>
<div style="display: flex; align-items: center; gap: 15px; margin-top: 10px; padding: 0 20px;">
  <button id="btn-apply-transform" style="padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold;">Apply Matrix A</button>
  <button id="btn-reset-transform" style="padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold;">Reset</button>
</div>

<script>
(function() {
  const containerId = 'eigenvector-viz';
  let showTransformed = false;

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const btnApply = document.getElementById('btn-apply-transform');
    const btnReset = document.getElementById('btn-reset-transform');

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#bbb', eigen: '#d62728', other: '#1f77b4', ellipse: '#888'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', eigen: '#ff6b6b', other: '#74c0fc', ellipse: '#555'
    };

    if (btnApply) {
      btnApply.textContent = 'Transform to eigenbasis';
      btnApply.style.background = isPerf ? '#1f77b4' : '#74c0fc';
      btnApply.style.color = isPerf ? '#fff' : '#000';
      btnApply.onclick = () => { showTransformed = true; init(); };
    }
    if (btnReset) {
      btnReset.textContent = 'Reset';
      btnReset.style.background = isPerf ? '#888' : '#555';
      btnReset.style.color = '#fff';
      btnReset.onclick = () => { showTransformed = false; init(); };
    }

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    const cx = w / 2, cy = h / 2;

    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(42);
    function gauss() {
      const u = Math.max(rng(), 1e-9);
      const v = Math.max(rng(), 1e-9);
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    }

    const theta = 32 * Math.PI / 180;
    const s1 = 2.6;
    const s2 = 0.9;
    const n = 80;
    const pts = d3.range(n).map(() => {
      const u = gauss() * s1;
      const v = gauss() * s2;
      const x = u * Math.cos(theta) - v * Math.sin(theta);
      const y = u * Math.sin(theta) + v * Math.cos(theta);
      return { u, v, x, y };
    });
    const displayPts = showTransformed
      ? pts.map(p => ({ x: p.u, y: p.v }))
      : pts.map(p => ({ x: p.x, y: p.y }));

    const maxAbs = d3.max(displayPts, p => Math.max(Math.abs(p.x), Math.abs(p.y))) || 1;
    const lim = maxAbs * 1.25;
    const xScale = d3.scaleLinear().domain([-lim, lim]).range([0, w]);
    const yScale = d3.scaleLinear().domain([-lim, lim]).range([h, 0]);

    // Grid
    const ticks = d3.range(-4, 5);
    ticks.forEach(i => {
      const gx = xScale(i);
      const gy = yScale(i);
      g.append('line').attr('x1', gx).attr('x2', gx).attr('y1', 0).attr('y2', h)
        .attr('stroke', theme.grid).attr('opacity', 0.25);
      g.append('line').attr('x1', 0).attr('x2', w).attr('y1', gy).attr('y2', gy)
        .attr('stroke', theme.grid).attr('opacity', 0.25);
    });

    // Axes
    g.append('line').attr('x1', 0).attr('x2', w).attr('y1', yScale(0)).attr('y2', yScale(0))
      .attr('stroke', theme.axis).attr('stroke-width', 1);
    g.append('line').attr('x1', xScale(0)).attr('x2', xScale(0)).attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.axis).attr('stroke-width', 1);

    // Draw points
    g.selectAll('circle')
      .data(displayPts)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4.5)
      .attr('fill', theme.other)
      .attr('opacity', 0.75);

    // Ellipse outline (2-sigma)
    function ellipsePath(rx, ry, ang, steps) {
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const ex = rx * Math.cos(t);
        const ey = ry * Math.sin(t);
        const x = ex * Math.cos(ang) - ey * Math.sin(ang);
        const y = ex * Math.sin(ang) + ey * Math.cos(ang);
        pts.push([x, y]);
      }
      return d3.line().x(d => xScale(d[0])).y(d => yScale(d[1]))(pts);
    }
    const ellAngle = showTransformed ? 0 : theta;
    g.append('path')
      .attr('d', ellipsePath(2 * s1, 2 * s2, ellAngle, 120))
      .attr('fill', 'none')
      .attr('stroke', theme.ellipse)
      .attr('stroke-width', 2)
      .attr('opacity', 0.8);

    // Eigenvectors (principal directions)
    function drawEigenvector(angle, length, label, color) {
      const dx = Math.cos(angle) * length;
      const dy = Math.sin(angle) * length;
      g.append('line')
        .attr('x1', xScale(0)).attr('y1', yScale(0))
        .attr('x2', xScale(dx)).attr('y2', yScale(dy))
        .attr('stroke', color).attr('stroke-width', 4);
      g.append('line')
        .attr('x1', xScale(0)).attr('y1', yScale(0))
        .attr('x2', xScale(-dx)).attr('y2', yScale(-dy))
        .attr('stroke', color).attr('stroke-width', 4);
      g.append('text')
        .attr('x', xScale(dx * 1.05)).attr('y', yScale(dy * 1.05))
        .attr('fill', color).attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .text(label);
    }
    const pc1Angle = showTransformed ? 0 : theta;
    const pc2Angle = showTransformed ? Math.PI / 2 : theta + Math.PI / 2;
    drawEigenvector(pc1Angle, 2.6, 'PC1 (max variance)', theme.eigen);
    drawEigenvector(pc2Angle, 1.4, 'PC2 (min variance)', theme.eigen);

    const info = showTransformed
      ? 'Eigenbasis: axes align with variance directions'
      : 'Original space: correlated, tilted ellipse';
    svg.append('text')
      .attr('x', width / 2).attr('y', 30).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '18px')
      .text(info);
  }
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) { showTransformed = false; init(); } });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>

-: In this example, the original data has only two variables (x and y), therefore only two eigenvectors (PC1 and PC2) exist. However, in real datasets with many variables, PCA identifies multiple principal components corresponding to the directions of maximum variance in the data, i.e, reducing dimensionality while preserving as much information as possible.

<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="three-matrices" -->
## The Three Key Matrices in PCA
<!-- layout={rows: 1, columns: 3} -->
<!-- position={row: 1, column: 1} -->
### Data Matrix (X)
-: Rows = samples 
-: Columns = variables
-: Original measurements
-: Each row is a point in p-dimensional space
<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Covariance Matrix (C)
-: Square matrix (p × p)
-: Shows variable variances & covariances
-: Eigenvectors of C = principal directions of variance
<!-- /position -->
<!-- position={row: 1, column: 3} -->
### Basis Matrix (B)
-: Columns = eigenvectors of C
-: Each eigenvector is a principal component
-: Used to transform data to new coordinates
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-in-r" -->
## Performing PCA in R

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The prcomp() function in base R
-: center = TRUE subtracts column means
-: scale. = TRUE divides by standard deviation

***

-! biplot() function
-: Visualizes scores (samples) and loadings (variables)
-: Arrows represent variable contributions to PCs

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="pca-in-r-webr-container"></div>
  <div id="pca-in-r-biplot" style="border: 0px solid #2d3a66; border-radius: 8px; min-height: 220px; display: flex; align-items: center; justify-content: center; color: #9efcffcc; font-size: 0.9em; text-align: center; padding: 12px;">
    Run the WebR example to render the PCA biplot.
  </div>
  <button id="pca-in-r-open-plot" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'pca-in-r-webr-container';
  const plotContainerId = 'pca-in-r-biplot';
  const openBtnId = 'pca-in-r-open-plot';
  const slideId = 'pca-in-r';

  const code = `# PCA example with iris
data(iris)

# Standardize variables
data_scaled <- scale(iris[, 1:4])

# Run PCA
pca_result <- prcomp(data_scaled, center = TRUE, scale. = TRUE)

cat("Summary (variance explained):\n")
print(summary(pca_result))

# Biplot (scores + loadings)
biplot(pca_result, cex = 0.7, col = c("#1f77b4", "#d62728"))`;

  const fallbackOutput = `[Simulated]
PCA biplot for iris data showing score points and variable loadings.`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run PCA Biplot (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 480,
        background: '#ffffff',
        altText: 'PCA biplot generated in WebR',
        loadingMessage: 'Rendering biplot... ',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the PCA biplot.'
      },
      popupButtonId: openBtnId
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-variance-results" -->
## PCA Results: Variance Explained

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
Example Output

<div style="background: #1e3a5f; padding: 12px; border-radius: 8px; font-size: 0.7em; margin: 10px 0;">
<pre style="margin: 0; color: #e2e8f0;">
Importance of components:
                         PC1    PC2    PC3
Std. deviation         1.89   1.41   0.98
Proportion of Var      0.45   0.25   0.12
Cumulative Proportion  0.45   0.70   0.82
</pre>
</div>

***

-! First two PCs explain 70% of total variance

-: PC1 alone captures 45%
-: Adding PC2 brings cumulative to 70%

***

-! Decision: Keep 2 or 3 PCs?

-: 2 PCs for visualization
-: 3 PCs to exceed 80% threshold
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pca-variance-barplot" style="width: 100%; height: 700px;"></div>

<script>
(function() {
  const containerId = 'pca-variance-barplot';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 700;
    const margin = { top: 50, right: 30, bottom: 60, left: 60 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', bar: '#1f77b4', axis: '#222', grid: '#ccc', highlight: '#d62728'
    } : {
      bg: '#0b1220', bar: '#74c0fc', axis: '#cbd5e1', grid: '#46586d', highlight: '#ff6b6b'
    };

    const data = [
      { pc: 'PC1', pct: 45 },
      { pc: 'PC2', pct: 25 },
      { pc: 'PC3', pct: 12 },
      { pc: 'PC4', pct: 8 },
      { pc: 'PC5', pct: 5 },
      { pc: 'PC6', pct: 3 },
      { pc: 'PC7', pct: 1.5 },
      { pc: 'PC8', pct: 0.5 }
    ];

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand().domain(data.map(d => d.pc)).range([0, w]).padding(0.25);
    const yScale = d3.scaleLinear().domain([0, 50]).range([h, 0]);

    g.append('g').selectAll('line').data([10, 20, 30, 40, 50]).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.4);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale))
      .selectAll('text').style('fill', theme.axis).style('font-size', '13px');
    g.append('g').call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + '%'))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    g.selectAll('rect.bar').data(data).enter().append('rect')
      .attr('x', d => xScale(d.pc)).attr('y', d => yScale(d.pct))
      .attr('width', xScale.bandwidth()).attr('height', d => h - yScale(d.pct))
      .attr('fill', (d, i) => i < 2 ? theme.highlight : theme.bar).attr('opacity', 0.85);

    g.selectAll('text.label').data(data).enter().append('text')
      .attr('x', d => xScale(d.pc) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.pct) - 8)
      .attr('text-anchor', 'middle').attr('fill', theme.axis).attr('font-size', '12px')
      .text(d => d.pct + '%');

    g.append('text').attr('x', w / 2).attr('y', -25).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '14px').text('Variance Explained per PC');
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-loadings-scores" -->
## Loadings and Scores

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Loadings: Variable Contributions

<div style="background: #1e3a5f; padding: 10px; border-radius: 8px; font-size: 0.65em; margin: 8px 0;">
<pre style="margin: 0; color: #e2e8f0;">
         PC1     PC2
pH      -0.25   0.62
EC       0.48   0.18
NO3      0.52  -0.15
PO4      0.45  -0.28
DO      -0.32   0.45
Cl       0.28   0.35
SO4      0.15   0.38
</pre>
</div>

-! PC1 interpretation

-: High positive: EC, NO₃, PO₄ (mineralization/nutrients)
-: Negative: pH, DO (organic pollution signal)

***

-! PC2 interpretation

-: High positive: pH, DO, SO₄ (oxygen-rich, alkaline)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Scores: Sample Coordinates

-: Each sample gets a score on each PC
-: Plot PC1 vs PC2 to visualize sample distribution

***

-! Biplot combines both

-: Points = samples (scores)
-: Arrows = variables (loadings)
-: Arrow direction shows correlation with PCs
-: Arrow length indicates contribution strength

***

<div style="background: #2d4a3e; padding: 10px; border-radius: 8px; font-size: 0.75em; margin: 8px 0;">
Arrows pointing same direction → positively correlated variables
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-biplot" -->
## PCA Biplot: Scores and Loadings

<div id="pca-biplot-viz" style="width: 100%; height: 820px;"></div>

<script>
(function() {
  const containerId = 'pca-biplot-viz';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 900;
    const height = 820;
    const margin = { top: 50, right: 120, bottom: 60, left: 70 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', point: ['#d62728', '#2ca02c', '#1f77b4'], arrow: '#333', axis: '#222', grid: '#bbb'
    } : {
      bg: '#0b1220', point: ['#ff6b6b', '#51cf66', '#74c0fc'], arrow: '#ffd43b', axis: '#cbd5e1', grid: '#46586d'
    };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(99);
    function gauss() { return Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-9))) * Math.cos(2 * Math.PI * rng()); }

    const regions = [
      { name: 'Region A', cx: -2.5, cy: 1.5 },
      { name: 'Region B', cx: 2.0, cy: 2.0 },
      { name: 'Region C', cx: 1.0, cy: -2.5 }
    ];
    const scores = [];
    regions.forEach((r, i) => {
      for (let j = 0; j < 15; j++) {
        scores.push({ x: r.cx + gauss() * 0.9, y: r.cy + gauss() * 0.9, region: i });
      }
    });

    const loadings = [
      { name: 'EC', x: 0.48, y: 0.18 },
      { name: 'NO₃', x: 0.52, y: -0.15 },
      { name: 'PO₄', x: 0.45, y: -0.28 },
      { name: 'pH', x: -0.25, y: 0.62 },
      { name: 'DO', x: -0.32, y: 0.45 },
      { name: 'Cl', x: 0.28, y: 0.35 },
      { name: 'SO₄', x: 0.15, y: 0.38 }
    ];
    const loadingScale = 5;

    const xScale = d3.scaleLinear().domain([-5, 5]).range([0, w]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([h, 0]);

    g.append('g').selectAll('line.h').data(d3.range(-5, 6)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);
    g.append('g').selectAll('line.v').data(d3.range(-5, 6)).enter().append('line')
      .attr('y1', 0).attr('y2', h).attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.3);

    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(5))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.append('g').call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text').style('fill', theme.axis).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    g.append('text').attr('x', w / 2).attr('y', h + 45).attr('text-anchor', 'middle')
      .attr('fill', theme.axis).attr('font-size', '14px').text('PC1 (45%)');
    g.append('text').attr('transform', 'rotate(-90)').attr('x', -h / 2).attr('y', -50)
      .attr('text-anchor', 'middle').attr('fill', theme.axis).attr('font-size', '14px').text('PC2 (25%)');

    const defs = svg.append('defs');
    defs.append('marker').attr('id', 'biplot-arrow').attr('viewBox', '0 0 10 10')
      .attr('refX', 9).attr('refY', 5).attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', theme.arrow);

    loadings.forEach(l => {
      g.append('line')
        .attr('x1', xScale(0)).attr('y1', yScale(0))
        .attr('x2', xScale(l.x * loadingScale)).attr('y2', yScale(l.y * loadingScale))
        .attr('stroke', theme.arrow).attr('stroke-width', 2).attr('marker-end', 'url(#biplot-arrow)');
      g.append('text')
        .attr('x', xScale(l.x * loadingScale) + (l.x > 0 ? 8 : -8))
        .attr('y', yScale(l.y * loadingScale) + (l.y > 0 ? -5 : 12))
        .attr('text-anchor', l.x > 0 ? 'start' : 'end')
        .attr('fill', theme.arrow).attr('font-size', '13px').attr('font-weight', 'bold')
        .text(l.name);
    });

    g.selectAll('circle.score').data(scores).enter().append('circle')
      .attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y))
      .attr('r', 7).attr('fill', d => theme.point[d.region]).attr('opacity', 0.85);

    const legend = svg.append('g').attr('transform', `translate(${width - 110}, 80)`);
    regions.forEach((r, i) => {
      legend.append('circle').attr('cx', 0).attr('cy', i * 25).attr('r', 7).attr('fill', theme.point[i]);
      legend.append('text').attr('x', 15).attr('y', i * 25 + 5)
        .attr('fill', theme.axis).attr('font-size', '12px').text(r.name);
    });
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>

---

<!-- .slide:id="pca-interpretation" -->
## Interpreting the PCA Output

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! PC1: Mineralization / Nutrient Gradient

-: High positive loadings: EC, NO₃, PO₄
-: Samples with high PC1 scores have elevated nutrients
-: Likely influenced by agricultural land use

***

-! PC2: Oxygen / pH Gradient

-: High positive loadings: pH, DO
-: Samples with high PC2 scores are well-oxygenated
-: May indicate surface water influence or recharge zones

***

-= Domain knowledge is essential for meaningful interpretation
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Patterns in the Score Plot

-! Region A (red): Low PC1, high PC2

-: Cleaner groundwater, less agricultural impact

***

-! Region B (green): high PC1, high PC2

-: Mixed signature, possible surface water mixing

***

-! Region C (blue): moderate PC1, low PC2

-: Nutrient-enriched, lower oxygen
-: Strongest agricultural influence

***

-! Connection to K-means: PCA scores can be input for clustering
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-limitations" -->
## Limits of PCA

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! PCA captures the largest overall variance

-: If dominant variance is unrelated to group differences, separation disappears
-: Subtle group effects can be masked by stronger sample-to-sample variation
-: Clusters may be real but not visible in PC1/PC2

***

-! Typical symptom

-: Mixed colors in the score plot
-: No clear boundaries even with known labels

-= Consider supervised methods (e.g., PLS-DA) when class separation is key
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pca-limitations-scores" style="width: 100%; height: 700px;"></div>

<script>
(function() {
  const containerId = 'pca-limitations-scores';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 700;
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', axis: '#222', grid: '#bbb', classA: '#d62728', classB: '#1f77b4', text: '#222'
    } : {
      bg: '#0b1220', axis: '#cbd5e1', grid: '#46586d', classA: '#ff6b6b', classB: '#74c0fc', text: '#e2e8f0'
    };

    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(77);
    function gauss() { return Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-9))) * Math.cos(2 * Math.PI * rng()); }

    const points = [];
    for (let i = 0; i < 70; i++) {
      const x = gauss() * 2.4 + gauss() * 0.4;
      const y = gauss() * 1.8 + gauss() * 0.6;
      const cls = i % 2;
      points.push({ x, y, cls });
    }

    const xScale = d3.scaleLinear().domain([-6, 6]).range([0, width - margin.left - margin.right]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([height - margin.top - margin.bottom, 0]);

    const svg = d3.select(`#${containerId}`).append('svg')
      .attr('width', width)
      .attr('height', height);
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', theme.bg)
      .attr('rx', 10);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    g.append('g').selectAll('line')
      .data(xScale.ticks(6))
      .enter().append('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.grid).attr('opacity', 0.25);
    g.append('g').selectAll('line')
      .data(yScale.ticks(6))
      .enter().append('line')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.25);

    const xAxis = g.append('g')
      .attr('transform', `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(6));
    const yAxis = g.append('g')
      .call(d3.axisLeft(yScale).ticks(6));
    xAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
    yAxis.selectAll('text').style('fill', theme.text).style('font-size', '12px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);

    g.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 5.5)
      .attr('fill', d => d.cls === 0 ? theme.classA : theme.classB)
      .attr('opacity', 0.7)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5);

    g.append('text')
      .attr('x', w / 2)
      .attr('y', h + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.text)
      .attr('font-size', '13px')
      .text('PC1');
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -h / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.text)
      .attr('font-size', '13px')
      .text('PC2');
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 28)
      .attr('text-anchor', 'middle')
      .attr('fill', theme.text)
      .attr('font-size', '14px')
      .text('Score plot: groups overlap when variance is dominated by other effects');
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide && e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide && e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => {
    if (document.getElementById(containerId)) init();
  });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pca-to-plsda" -->
## From PCA to PLS-DA

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! PLS-DA = Partial Least Squares Discriminant Analysis

-: A supervised dimensionality reduction method
-: Uses class labels to guide component extraction

***

-! Key difference from PCA

-: PCA maximizes variance in X (features)
-: PLS-DA maximizes covariance between X and Y (class labels)

***

-! When to use PLS-DA

-: Classification problems with many correlated variables
-: When you want to find variables that discriminate between groups
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pca-vs-plsda-concept" style="width: 100%; height: 700px;"></div>

<script>
(function() {
  const containerId = 'pca-vs-plsda-concept';

  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;
    const margin = { top: 40, right: 30, bottom: 50, left: 50 };

    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#f7f7f4', classA: '#d62728', classB: '#1f77b4', axis: '#222', grid: '#bbb', pca: '#888', plsda: '#2ca02c'
    } : {
      bg: '#0b1220', classA: '#ff6b6b', classB: '#74c0fc', axis: '#cbd5e1', grid: '#46586d', pca: '#888', plsda: '#51cf66'
    };

    const svg = d3.select(`#${containerId}`).append('svg').attr('width', width).attr('height', height);
    svg.append('rect').attr('width', width).attr('height', height).attr('fill', theme.bg).attr('rx', 10);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    function seededRandom(seed) {
      let s = seed >>> 0;
      return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
    }
    const rng = seededRandom(55);
    function gauss() { return Math.sqrt(-2 * Math.log(Math.max(rng(), 1e-9))) * Math.cos(2 * Math.PI * rng()); }

    const points = [];
    for (let i = 0; i < 25; i++) {
      points.push({ x: -1 + gauss() * 1.2, y: 2 + gauss() * 1.5, cls: 0 });
      points.push({ x: 1.5 + gauss() * 1.2, y: -1 + gauss() * 1.5, cls: 1 });
    }

    const xScale = d3.scaleLinear().domain([-5, 5]).range([0, w]);
    const yScale = d3.scaleLinear().domain([-5, 5]).range([h, 0]);

    g.append('g').selectAll('line.h').data(d3.range(-5, 6)).enter().append('line')
      .attr('x1', 0).attr('x2', w).attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.25);
    g.append('g').selectAll('line.v').data(d3.range(-5, 6)).enter().append('line')
      .attr('y1', 0).attr('y2', h).attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.25);

    g.selectAll('circle').data(points).enter().append('circle')
      .attr('cx', d => xScale(d.x)).attr('cy', d => yScale(d.y))
      .attr('r', 6).attr('fill', d => d.cls === 0 ? theme.classA : theme.classB).attr('opacity', 0.8);

    const defs = svg.append('defs');
    defs.append('marker').attr('id', 'arr-pca-comp').attr('viewBox', '0 0 10 10')
      .attr('refX', 9).attr('refY', 5).attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', theme.pca);
    defs.append('marker').attr('id', 'arr-plsda-comp').attr('viewBox', '0 0 10 10')
      .attr('refX', 9).attr('refY', 5).attr('markerWidth', 5).attr('markerHeight', 5).attr('orient', 'auto')
      .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', theme.plsda);

    const pcaAngle = Math.atan(1.2);
    const plsdaAngle = Math.atan(-1.2);
    const len = 4;

    g.append('line').attr('x1', xScale(0)).attr('y1', yScale(0))
      .attr('x2', xScale(Math.cos(pcaAngle) * len)).attr('y2', yScale(Math.sin(pcaAngle) * len))
      .attr('stroke', theme.pca).attr('stroke-width', 3).attr('stroke-dasharray', '8,4')
      .attr('marker-end', 'url(#arr-pca-comp)');
    g.append('text').attr('x', xScale(Math.cos(pcaAngle) * len) + 5).attr('y', yScale(Math.sin(pcaAngle) * len) - 10)
      .attr('fill', theme.pca).attr('font-size', '13px').text('PCA (max variance)');

    g.append('line').attr('x1', xScale(0)).attr('y1', yScale(0))
      .attr('x2', xScale(Math.cos(plsdaAngle) * len)).attr('y2', yScale(Math.sin(plsdaAngle) * len))
      .attr('stroke', theme.plsda).attr('stroke-width', 3)
      .attr('marker-end', 'url(#arr-plsda-comp)');
    g.append('text').attr('x', xScale(Math.cos(plsdaAngle) * len) + 5).attr('y', yScale(Math.sin(plsdaAngle) * len) + 18)
      .attr('fill', theme.plsda).attr('font-size', '13px').text('PLS-DA (max separation)');

    const legend = g.append('g').attr('transform', `translate(${w - 120}, 10)`);
    legend.append('circle').attr('cx', 0).attr('cy', 0).attr('r', 6).attr('fill', theme.classA);
    legend.append('text').attr('x', 12).attr('y', 5).attr('fill', theme.axis).attr('font-size', '12px').text('River water');
    legend.append('circle').attr('cx', 0).attr('cy', 22).attr('r', 6).attr('fill', theme.classB);
    legend.append('text').attr('x', 12).attr('y', 27).attr('fill', theme.axis).attr('font-size', '12px').text('Groundwater');
  }

  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector(`#${containerId}`)) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById(containerId)) init(); });
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="plsda-vs-pca-matrices" -->
## PLS-DA vs. PCA: Matrix Differences
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! PCA focuses on X only
-: Decomposes X into scores (T) and loadings (P)
-: $X = T P^T + E$
-: Maximizes variance in X

***

-! Corrlation matrix in PCA

$$C = \frac{1}{n-1} X^T X$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! PLS-DA incorporates Y
-: Decomposes X and Y into scores (T, U) and loadings (P, Q)
-: $X = T P^T + E$, $Y = U Q^T + F$
-: Maximizes covariance between T and U

***

-! Cross-covariance matrix in PLS-DA
$$C_{XY} = \frac{1}{n-1} X^T Y$$
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="plsda-example" -->
## PLS-DA: Water Source Classification

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Example: Distinguishing water sources

-: River water vs. groundwater samples
-: 8 chemical variables measured
-: Goal: Find discriminating chemical signatures

***

-! PLS-DA outputs

-: Score plot colored by class
-: Loadings identify variables driving separation
-: VIP scores rank variable importance

***

```r
library(mixOmics)
plsda_result <- plsda(X, Y, ncomp = 2)
plotIndiv(plsda_result)
plotVar(plsda_result)
```
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Interpretation

-! Variables with high VIP scores discriminate best

<div style="background: #1e3a5f; padding: 10px; border-radius: 8px; font-size: 0.7em; margin: 10px 0;">
<pre style="margin: 0; color: #e2e8f0;">
Variable Importance (VIP):
  DO:    1.85  ← most important
  NO₃:   1.62
  EC:    1.45
  pH:    0.92
  Cl:    0.78
</pre>
</div>

***

-! Dissolved oxygen and nitrate best separate river from groundwater

***

-! Caution: Overfitting risk

-: Always validate with cross-validation
-: Use permutation tests to assess significance
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="plsda-validation" -->
## PLS-DA: Validation is Critical

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Why validation matters

-: PLS-DA can overfit, especially with few samples
-: Model may capture noise instead of true patterns

***

-! Cross-validation strategies

-: Leave-one-out (LOO): good for small datasets
-: Repeated CV: more robust estimates

<div style="font-size: 0.6em;">

$$CV\ Accuracy = \frac{TP + TN}{TP + TN + FP + FN}$$

</div>

***

-! Metrics to evaluate

-: Classification accuracy
-: Q² (predictive ability) $Q^2 = 1 - \frac{PRESS}{TSS}$, where PRESS = prediction error sum of squares, TSS = total sum of squares
-: Confusion matrix
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Permutation testing

-: Randomly shuffle class labels many times (e.g., 1000)
-: Fit PLS-DA to each permuted dataset
-: Compare real Q² to permuted distribution

***

<div style="background: #2d4a3e; padding: 12px; border-radius: 8px; font-size: 0.75em; margin: 10px 0;">
If real Q² is much higher than permuted Q² values, the model is capturing true class differences
</div>

***

-= Never trust PLS-DA results without proper validation
<!-- /position -->
<!-- /layout -->
