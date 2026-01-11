---
title: "Cluster Analysis I"
author: "Gerrit Renner"
keywords: ["cluster analysis", "distance", "Minkowski", "hierarchical clustering", "k-means", "dendrogram", "similarity"]
requirements: ["Distances", "Variance", "ANOVA"]
description: "Introduction to cluster analysis for grouping environmental samples"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Distances
- Variance
- ANOVA

---


<!-- .slide:id="motivation-why-clustering" -->
## Why Clustering?

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Environmental datasets often contain hidden structure

-: Samples may form natural groups based on origin, contamination, or composition

-: These groupings are not known beforehand

***

-? How can we discover structure in data without predefined labels?
<!-- /position -->

<!-- position={row: 1, column: 2} -->
**The Core Idea**

-! Cluster analysis finds groups of similar objects

-: Objects within a cluster are more alike than objects in different clusters

-: No supervisor tells us which group an object belongs to

***

-= Clustering is an exploratory technique for pattern discovery

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="motivation-scatter-table" -->
## Scatter Data (Sample)

<div style="font-size: 0.5em;">

| x1 | y1 | x2 | y2 | x3 | y3 | x4 | y4 | x5 | y5 | x6 | y6 | x7 | y7 | x8 | y8 | x9 | y9 | x10 | y10 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| -0.71 | -0.94 | -0.72 | -0.67 | -1.02 | -1.20 | -0.99 | -0.70 | -0.54 | -0.89 | -1.04 | -1.02 | -1.15 | -0.68 | -0.80 | -1.94 | -1.08 | -1.22 | -1.32 | -1.06 |
| -1.25 | -0.73 | -0.89 | -1.21 | -1.38 | -1.08 | -1.37 | -0.62 | -1.16 | -1.16 | -1.40 | -0.30 | -0.54 | -1.21 | -1.30 | -1.72 | -1.17 | -1.11 | -1.10 | -1.21 |
| -1.13 | -0.84 | -0.93 | -1.69 | -0.88 | -1.01 | -0.76 | -0.64 | -1.18 | -1.50 | -1.75 | -0.82 | -1.45 | -1.03 | -0.73 | -1.22 | -1.21 | -1.11 | -1.50 | -1.44 |
| -0.77 | -0.48 | -1.30 | -0.86 | -1.76 | -0.61 | -1.22 | -1.08 | 0.95 | 0.24 | 1.14 | 0.78 | 0.98 | 0.54 | 1.09 | 0.42 | 1.61 | 0.93 | 0.83 | 0.73 |
| 1.17 | -0.11 | 1.10 | 0.96 | 0.98 | 0.25 | 1.46 | 0.30 | 1.61 | 0.67 | 0.58 | 1.15 | 0.84 | 0.55 | 1.58 | 0.54 | 1.10 | 0.64 | 1.17 | 0.29 |
| 1.18 | 0.85 | 0.91 | 0.42 | 0.83 | 0.59 | 1.28 | 0.73 | 1.19 | 0.34 | 1.40 | 1.13 | 1.13 | 1.18 | 0.85 | -0.02 | 1.43 | 1.09 | 1.32 | 0.89 |
| 1.23 | 0.83 | 1.26 | 0.98 | 0.80 | 0.71 | 0.85 | 0.72 | 0.76 | 1.03 | 1.39 | 0.61 | 1.17 | 1.01 | -0.26 | 1.52 | 0.20 | 0.65 | -0.44 | 1.12 |
| 0.38 | 1.44 | -0.12 | 0.94 | -0.15 | 1.61 | -0.42 | 1.36 | 0.05 | 1.15 | 0.17 | 1.48 | -0.11 | 1.15 | -0.70 | 1.20 | -0.65 | 1.30 | -1.02 | 1.52 |
| -0.65 | 1.05 | 0.31 | 1.14 | 0.13 | 1.34 | -0.44 | 1.88 | 0.00 | 1.24 | -0.18 | 1.64 | -0.69 | 1.31 | 0.66 | 1.04 | -0.60 | 1.03 | 0.07 | 0.73 |
| -0.87 | 0.58 | 0.37 | 1.27 | -0.23 | 1.16 | 0.18 | 1.26 | -0.34 | 1.16 | -0.39 | 1.44 | -0.39 | 1.44 | -0.50 | 1.30 | -0.28 | 1.40 | 0.45 | 1.29 |

</div>

---

<!-- .slide:id="motivation-3d-scatter" -->
## Clustered Samples in 2D

<div id="cluster-3d-scatter" style="width: 100%; height: 820px;"></div>

<script>
(function() {
  const containerId = 'cluster-3d-scatter';

  function init() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined' || typeof d3Utils === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = 820;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    const isPerformanceMode = document.body.classList.contains('performance-mode');
    const theme = isPerformanceMode ? {
      panelFill: '#f7f7f4',
      panelStroke: '#222222',
      axis: '#222222',
      grid: '#7f7f7f',
      text: '#111111',
      pointStroke: '#111111',
      pointFill: '#e42ae4ff'
    } : {
      panelFill: '#0b1220',
      panelStroke: '#3b4a5a',
      axis: '#cbd5e1',
      grid: '#46586d',
      text: '#e2e8f0',
      pointStroke: '#0b1220',
      pointFill: '#4dd2ff'
    };

    fig.svg.append('rect')
      .attr('x', -margin.left + 4)
      .attr('y', -margin.top + 4)
      .attr('width', fig.width + margin.left + margin.right - 8)
      .attr('height', fig.height + margin.top + margin.bottom - 8)
      .attr('rx', 10)
      .attr('fill', 'none')
      .attr('stroke', 'none');

    function seededRandom(seed) {
      let state = seed >>> 0;
      return function() {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 4294967296;
      };
    }

    const rng = seededRandom(42);

    function gaussian() {
      const u1 = Math.max(rng(), 1e-9);
      const u2 = rng();
      return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    }

    const clusterCenters = [
      { x: -1.2, y: -1.0 },
      { x: 1.1, y: 0.7 },
      { x: -0.2, y: 1.2 }
    ];
    const clusterSizes = [34, 33, 33];
    const spread = 0.35;

    const points = [];
    clusterCenters.forEach((center, idx) => {
      for (let i = 0; i < clusterSizes[idx]; i++) {
        points.push({
          x: center.x + gaussian() * spread,
          y: center.y + gaussian() * spread,
          cluster: idx
        });
      }
    });

    const xExtent = d3.extent(points, d => d.x);
    const yExtent = d3.extent(points, d => d.y);
    const padX = (xExtent[1] - xExtent[0]) * 0.15;
    const padY = (yExtent[1] - yExtent[0]) * 0.15;

    const scales = d3Utils.createXYScales(
      points,
      fig.width,
      fig.height,
      'x',
      'y',
      xExtent[0] - padX,
      xExtent[1] + padX,
      yExtent[0] - padY,
      yExtent[1] + padY
    );

    const majorTicksY = 6;
    const majorTicksX = Math.max(majorTicksY, Math.round(majorTicksY * (fig.width / fig.height)));
    const minorTicksY = majorTicksY * 4;
    const minorTicksX = majorTicksX * 4;

    plotUtils.addAxes(
      fig,
      [xExtent[0] - padX, xExtent[1] + padX],
      [yExtent[0] - padY, yExtent[1] + padY],
      majorTicksX,
      majorTicksY
    );
    fig.xAxisGroup.selectAll('path, line').style('stroke', theme.axis).style('stroke-width', '1.5px');
    fig.yAxisGroup.selectAll('path, line').style('stroke', theme.axis).style('stroke-width', '1.5px');
    fig.xAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '11px')
      .style('font-family', "'Montserrat', sans-serif");
    fig.yAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '11px')
      .style('font-family', "'Montserrat', sans-serif");

    const minorGridGroupY = fig.svg.append('g').attr('class', 'grid grid-minor');
    minorGridGroupY
      .call(d3.axisLeft(scales.y).ticks(minorTicksY).tickSize(-fig.width).tickFormat(''));
    minorGridGroupY.selectAll('line').attr('stroke', theme.grid).attr('opacity', 0.28);
    minorGridGroupY.selectAll('path').attr('stroke', 'none');

    const minorGridGroupX = fig.svg.append('g').attr('class', 'grid grid-minor');
    minorGridGroupX
      .attr('transform', `translate(0, ${fig.height})`)
      .call(d3.axisBottom(scales.x).ticks(minorTicksX).tickSize(-fig.height).tickFormat(''));
    minorGridGroupX.selectAll('line').attr('stroke', theme.grid).attr('opacity', 0.28);
    minorGridGroupX.selectAll('path').attr('stroke', 'none');

    const majorGridGroupY = fig.svg.append('g').attr('class', 'grid grid-major');
    majorGridGroupY
      .call(d3.axisLeft(scales.y).ticks(majorTicksY).tickSize(-fig.width).tickFormat(''));
    majorGridGroupY.selectAll('line').attr('stroke', theme.grid).attr('opacity', 0.55);
    majorGridGroupY.selectAll('path').attr('stroke', 'none');

    const majorGridGroupX = fig.svg.append('g').attr('class', 'grid grid-major');
    majorGridGroupX
      .attr('transform', `translate(0, ${fig.height})`)
      .call(d3.axisBottom(scales.x).ticks(majorTicksX).tickSize(-fig.height).tickFormat(''));
    majorGridGroupX.selectAll('line').attr('stroke', theme.grid).attr('opacity', 0.55);
    majorGridGroupX.selectAll('path').attr('stroke', 'none');

    majorGridGroupY.lower();

    const pointGroup = fig.svg.append('g').attr('class', 'points');
    pointGroup.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => scales.x(d.x))
      .attr('cy', d => scales.y(d.y))
      .attr('r', isPerformanceMode ? 7 : 6)
      .attr('fill', theme.pointFill)
      .attr('stroke', theme.pointStroke)
      .attr('stroke-width', 1)
      .attr('opacity', 0.9);
  }

  init();

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        init();
      }
    });
    Reveal.on('ready', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        init();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (document.getElementById(containerId)) {
      init();
    }
  });
})();
</script>

---

<!-- .slide:id="similarity-vs-distance" -->
## Similarity vs. Distance

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Two Ways to Quantify Relationships**

-! **Similarity**: how alike are two objects?
-: High similarity → objects are close
-: Range often normalized: 0 (different) to 1 (identical)

***

-! **Distance** (dissimilarity): how different are two objects?
-: High distance → objects are far apart
-: Range often 0 to ∞

***

-= Similarity and distance are *inversely related*

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Conceptual Relationship**

| Similarity | Distance |
|:----------:|:--------:|
| High | Low |
| Low | High |

***

-! Clustering algorithms typically work with **distance matrices**

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="minkowski-distance" -->
## Minkowski Distance as Unifying Concept

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**A Family of Distance Measures**

-! Minkowski distance is a generalized formula controlled by parameter *p*

$$d = \left( \sum_{i=1}^{n} |x_i - y_i|^p \right)^{\frac{1}{p}}$$

-: Changing *p* produces different distance behaviors

-: Each variant emphasizes different aspects of the data

***

-! Common special cases:
-: p = 1 → Manhattan distance
-: p = 2 → Euclidean distance
-: p → ∞ → Chebyshev distance

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Why This Matters**

-! The choice of distance metric affects clustering results

-: Different metrics can reveal different structures in the same data

<div id="fig-minkowski-compact" style="width: 100%; height: auto;"></div>

<script>
(function() {
  const containerId = 'fig-minkowski-compact';

  function render() {
    if (typeof d3 === 'undefined') {
      setTimeout(render, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container || container.querySelector('svg')) return;

    const width = 655;
    const height = 145;
    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('max-width', '100%')
      .style('height', 'auto');

    const isPerformanceMode = document.body.classList.contains('performance-mode');
    const colors = isPerformanceMode ? {
      axis: '#222222',
      grid: '#9a9a9a',
      label: '#111111',
      point: '#111111',
      manhattan: '#c0392b',
      euclid: '#1e8449',
      cheby: '#1f618d'
    } : {
      axis: '#cbd5e1',
      grid: '#425569',
      label: '#e2e8f0',
      point: '#e2e8f0',
      manhattan: '#ff6b6b',
      euclid: '#00ff88',
      cheby: '#00d4ff'
    };

    const gap = 16;
    const panelW = (width - gap * 2) / 3;
    const panelH = 120;
    const top = 18;

    const panels = [
      { title: 'p=1', color: colors.manhattan, mode: 'manhattan' },
      { title: 'p=2', color: colors.euclid, mode: 'euclid' },
      { title: 'p=inf', color: colors.cheby, mode: 'cheby' }
    ];

    const A = { x: 2, y: 2 };
    const B = { x: 8, y: 6 };
    const maxDist = 6;

    panels.forEach((panel, i) => {
      const panelX = i * (panelW + gap);
      const g = svg.append('g').attr('transform', `translate(${panelX}, ${top})`);

      const margin = { top: 14, right: 10, bottom: 18, left: 18 };
      const innerW = panelW - margin.left - margin.right;
      const innerH = panelH - margin.top - margin.bottom;
      const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerW]);
      const yScale = d3.scaleLinear().domain([0, 8]).range([innerH, 0]);

      const gridX = [2, 5, 8];
      const gridY = [2, 4, 6];

      gridX.forEach(x => {
        g.append('line')
          .attr('x1', margin.left + xScale(x))
          .attr('y1', margin.top)
          .attr('x2', margin.left + xScale(x))
          .attr('y2', margin.top + innerH)
          .attr('stroke', colors.grid)
          .attr('stroke-width', 0.7)
          .attr('opacity', 0.45);
      });

      gridY.forEach(y => {
        g.append('line')
          .attr('x1', margin.left)
          .attr('y1', margin.top + yScale(y))
          .attr('x2', margin.left + innerW)
          .attr('y2', margin.top + yScale(y))
          .attr('stroke', colors.grid)
          .attr('stroke-width', 0.7)
          .attr('opacity', 0.45);
      });

      const ax = margin.left + xScale(A.x);
      const ay = margin.top + yScale(A.y);
      const bx = margin.left + xScale(B.x);
      const by = margin.top + yScale(B.y);

      if (panel.mode === 'manhattan') {
        g.append('path')
          .attr('d', `M${ax},${ay} L${bx},${ay} L${bx},${by}`)
          .attr('fill', 'none')
          .attr('stroke', panel.color)
          .attr('stroke-width', 3.5);
      } else if (panel.mode === 'euclid') {
        g.append('line')
          .attr('x1', ax)
          .attr('y1', ay)
          .attr('x2', bx)
          .attr('y2', by)
          .attr('stroke', panel.color)
          .attr('stroke-width', 3.5);
      } else {
        g.append('rect')
          .attr('x', margin.left + xScale(A.x))
          .attr('y', margin.top + yScale(A.y + maxDist))
          .attr('width', xScale(A.x + maxDist) - xScale(A.x))
          .attr('height', yScale(A.y) - yScale(A.y + maxDist))
          .attr('fill', 'none')
          .attr('stroke', panel.color)
          .attr('stroke-width', 3)
          .attr('stroke-dasharray', '5,3');
      }

      g.append('circle').attr('cx', ax).attr('cy', ay).attr('r', 5.5).attr('fill', colors.point);
      g.append('circle').attr('cx', bx).attr('cy', by).attr('r', 5.5).attr('fill', colors.point);

      g.append('text')
        .attr('x', ax - 6)
        .attr('y', ay - 6)
        .attr('fill', colors.label)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('A');

      g.append('text')
        .attr('x', bx + 4)
        .attr('y', by - 6)
        .attr('fill', colors.label)
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('B');

      g.append('text')
        .attr('x', margin.left + innerW / 2)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .attr('fill', colors.label)
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .text(panel.title);
    });
  }

  render();
})();
</script>

***

-? Which distance is "correct"? → Depends on the scientific question and data characteristics

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="manhattan-distance" -->
## Manhattan Distance (p = 1)

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Manhattan Distance**

-! Also called *city-block* distance

-: Travel only along *grid lines*, no diagonal shortcuts

-: Sum of absolute differences across all variables

***

-! When is it useful?
-: Variables measured on *different scales* or units
-: Outliers should *not* dominate the distance

***

<div style="font-size: 0.6em;">

| Property | Behavior |
|:---------|:---------|
| Path shape | Staircase |
| Sensitivity to outliers | Moderate |
| Typical use | Robust comparisons |

</div>
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="fig-manhattan" style="width: 100%; height: 420px;"></div>

<script>
(function() {
  const container = document.getElementById('fig-manhattan');
  if (!container || container.querySelector('svg')) return;
  
  const width = 400, height = 380;
  const margin = {top: 20, right: 30, bottom: 40, left: 50};
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  
  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%').style('height', 'auto');
  
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerW]);
  const yScale = d3.scaleLinear().domain([0, 8]).range([innerH, 0]);
  
  // Grid
  for (let i = 0; i <= 10; i++) {
    g.append('line').attr('x1', xScale(i)).attr('x2', xScale(i)).attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.4);
  }
  for (let j = 0; j <= 8; j++) {
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', yScale(j)).attr('y2', yScale(j))
      .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.4);
  }
  
  // Axes
  g.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(xScale).ticks(5)).selectAll('text').style('fill','#ccc').style('font-size','11px');
  g.append('g').call(d3.axisLeft(yScale).ticks(4)).selectAll('text').style('fill','#ccc').style('font-size','11px');
  g.selectAll('.domain, .tick line').attr('stroke', '#555');
  
  const A = {x: 2, y: 2}, B = {x: 8, y: 6};
  
  // Manhattan path (A -> horizontal -> vertical -> B)
  g.append('path')
    .attr('d', `M${xScale(A.x)},${yScale(A.y)} L${xScale(B.x)},${yScale(A.y)} L${xScale(B.x)},${yScale(B.y)}`)
    .attr('fill', 'none').attr('stroke', '#00d4ff').attr('stroke-width', 3);
  
  // Points
  g.append('circle').attr('cx', xScale(A.x)).attr('cy', yScale(A.y)).attr('r', 8).attr('fill', '#ff6b6b');
  g.append('circle').attr('cx', xScale(B.x)).attr('cy', yScale(B.y)).attr('r', 8).attr('fill', '#ff6b6b');
  
  // Labels
  g.append('text').attr('x', xScale(A.x)-6).attr('y', yScale(A.y)+4).text('A').attr('fill','#fff').style('font-size','14px').style('font-weight','bold');
  g.append('text').attr('x', xScale(B.x)-6).attr('y', yScale(B.y)+5).text('B').attr('fill','#fff').style('font-size','14px').style('font-weight','bold');
  
  // Distance label
  g.append('text').attr('x', xScale(5)).attr('y', yScale(A.y)+25).text('|Δx|=6').attr('fill','#00d4ff').style('font-size','12px').attr('text-anchor','middle');
  g.append('text').attr('x', xScale(B.x)+25).attr('y', yScale(4)).text('|Δy|=4').attr('fill','#00d4ff').style('font-size','12px');
  g.append('text').attr('x', xScale(5)).attr('y', yScale(7.5)).text('d = 6 + 4 = 10').attr('fill','#e65468ff').style('font-size','13px').attr('text-anchor','middle');
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="euclidean-distance" -->
## Euclidean Distance (p = 2)

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Euclidean Distance**

-! *Straight-line* between 2 points

-: Corresponds to everyday intuition of "closeness"

-: The *most commonly used* distance metric

***

-! When is it useful?
-: Variables are on *comparable scales*
-: Data are approximately *spherically distributed*

***

<div style="font-size: 0.6em;">

| Property | Behavior |
|:---------|:---------|
| Path shape | Direct line |
| Sensitivity to outliers | High |
| Typical use | Standard clustering |

</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="fig-euclidean" style="width: 100%; height: 420px;"></div>

<script>
(function() {
  const container = document.getElementById('fig-euclidean');
  if (!container || container.querySelector('svg')) return;
  
  const width = 400, height = 380;
  const margin = {top: 20, right: 30, bottom: 40, left: 50};
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  
  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%').style('height', 'auto');
  
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerW]);
  const yScale = d3.scaleLinear().domain([0, 8]).range([innerH, 0]);
  
  // Grid
  for (let i = 0; i <= 10; i++) {
    g.append('line').attr('x1', xScale(i)).attr('x2', xScale(i)).attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.4);
  }
  for (let j = 0; j <= 8; j++) {
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', yScale(j)).attr('y2', yScale(j))
      .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.4);
  }
  
  // Axes
  g.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(xScale).ticks(5)).selectAll('text').style('fill','#ccc').style('font-size','11px');
  g.append('g').call(d3.axisLeft(yScale).ticks(4)).selectAll('text').style('fill','#ccc').style('font-size','11px');
  g.selectAll('.domain, .tick line').attr('stroke', '#555');
  
  const A = {x: 2, y: 2}, B = {x: 8, y: 6};
  
  // Faint Manhattan path for comparison
  g.append('path')
    .attr('d', `M${xScale(A.x)},${yScale(A.y)} L${xScale(B.x)},${yScale(A.y)} L${xScale(B.x)},${yScale(B.y)}`)
    .attr('fill', 'none').attr('stroke', '#00d4ff').attr('stroke-width', 1.5).attr('opacity', 0.3).attr('stroke-dasharray', '4,3');
  
  // Euclidean path (straight line)
  g.append('line')
    .attr('x1', xScale(A.x)).attr('y1', yScale(A.y))
    .attr('x2', xScale(B.x)).attr('y2', yScale(B.y))
    .attr('stroke', '#00ff88').attr('stroke-width', 3);
  
  // Points
  g.append('circle').attr('cx', xScale(A.x)).attr('cy', yScale(A.y)).attr('r', 8).attr('fill', '#ff6b6b');
  g.append('circle').attr('cx', xScale(B.x)).attr('cy', yScale(B.y)).attr('r', 8).attr('fill', '#ff6b6b');
  
  // Labels
  g.append('text').attr('x', xScale(A.x)-6).attr('y', yScale(A.y)+4).text('A').attr('fill','#fff').style('font-size','14px').style('font-weight','bold');
  g.append('text').attr('x', xScale(B.x)-6).attr('y', yScale(B.y)+5).text('B').attr('fill','#fff').style('font-size','14px').style('font-weight','bold');
  
  // Distance label
  g.append('text').attr('x', xScale(5)).attr('y', yScale(7.5)).text('d = √(6² + 4²) ≈ 7.21').attr('fill','#e65468ff').style('font-size','13px').attr('text-anchor','middle');
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="chebyshev-distance" -->
## Chebyshev Distance (p → ∞)

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Chebyshev Distance**

-! Also called *chessboard* distance

-: Only the *largest difference* across variables counts

-: All other variable differences are ignored

***

-! When is it useful?
-: One *critical variable* must not exceed a threshold
-: Worst-case scenarios matter most

***

<div style="font-size: 0.6em;">

| Property | Behavior |
|:---------|:---------|
| Path shape | Dominated by largest gap |
| Sensitivity to outliers | Very high |
| Typical use | Threshold-based decisions |

</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="fig-chebyshev" style="width: 100%; height: 420px;"></div>

<script>
(function() {
  const container = document.getElementById('fig-chebyshev');
  if (!container || container.querySelector('svg')) return;
  
  const width = 400, height = 380;
  const margin = {top: 20, right: 30, bottom: 40, left: 50};
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  
  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%').style('height', 'auto');
  
  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
  
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerW]);
  const yScale = d3.scaleLinear().domain([0, 8]).range([innerH, 0]);
  
  // Grid
  for (let i = 0; i <= 10; i++) {
    g.append('line').attr('x1', xScale(i)).attr('x2', xScale(i)).attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.4);
  }
  for (let j = 0; j <= 8; j++) {
    g.append('line').attr('x1', 0).attr('x2', innerW).attr('y1', yScale(j)).attr('y2', yScale(j))
      .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.4);
  }
  
  // Axes
  g.append('g').attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(xScale).ticks(5)).selectAll('text').style('fill','#ccc').style('font-size','11px');
  g.append('g').call(d3.axisLeft(yScale).ticks(4)).selectAll('text').style('fill','#ccc').style('font-size','11px');
  g.selectAll('.domain, .tick line').attr('stroke', '#555');
  
  const A = {x: 2, y: 2}, B = {x: 8, y: 6};
  const maxDist = 6; // max(|8-2|, |6-2|) = max(6,4) = 6
  
  // L∞ ball (square) around A that just reaches B
  g.append('rect')
    .attr('x', xScale(A.x - maxDist)).attr('y', yScale(A.y + maxDist))
    .attr('width', xScale(2*maxDist) - xScale(0)).attr('height', yScale(0) - yScale(2*maxDist))
    .attr('fill', 'none').attr('stroke', '#ff9f43').attr('stroke-width', 2).attr('stroke-dasharray', '6,3');
  
  // Highlight the dominant dimension (Δx = 6)
  g.append('line')
    .attr('x1', xScale(A.x)).attr('y1', yScale(A.y))
    .attr('x2', xScale(B.x)).attr('y2', yScale(A.y))
    .attr('stroke', '#ff9f43').attr('stroke-width', 3);
  
  // Points
  g.append('circle').attr('cx', xScale(A.x)).attr('cy', yScale(A.y)).attr('r', 8).attr('fill', '#ff6b6b');
  g.append('circle').attr('cx', xScale(B.x)).attr('cy', yScale(B.y)).attr('r', 8).attr('fill', '#ff6b6b');
  
  // Labels
  g.append('text').attr('x', xScale(A.x)-6).attr('y', yScale(A.y)+4).text('A').attr('fill','#fff').style('font-size','14px').style('font-weight','bold');
  g.append('text').attr('x', xScale(B.x)-6).attr('y', yScale(B.y)+5).text('B').attr('fill','#fff').style('font-size','14px').style('font-weight','bold');
  
  // Distance labels
  g.append('text').attr('x', xScale(5)).attr('y', yScale(A.y)+25).text('|Δx|=6 ← max').attr('fill','#ff9f43').style('font-size','12px').attr('text-anchor','middle');
  g.append('text').attr('x', xScale(5)).attr('y', yScale(7.5)).text('d = max(6, 4) = 6').attr('fill','#e65468ff').style('font-size','13px').attr('text-anchor','middle');
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="distance-choice-effect" -->
## Effect of Distance Choice

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Same Data, Different Distances**

-! Changing the distance metric *changes the clustering result*

-: Points that appear "close" under one metric may be "far" under another

-: Cluster boundaries shift depending on how distance is computed

***

-! There is *no universally correct* distance
-: Choice depends on data structure and research question
-: Always justify your choice based on domain knowledge

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="fig-distance-choice" style="width: 100%; height: 420px;"></div>

<script>
(function() {
  const container = document.getElementById('fig-distance-choice');
  if (!container || container.querySelector('svg')) return;
  
  const width = 540, height = 380;
  const panelW = 160, panelH = 280;
  const gap = 20;
  const marginTop = 40, marginLeft = 20;
  
  const svg = d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%').style('height', 'auto');
  
  // Same 5 points for all panels
  const points = [
    {id: 'A', x: 1, y: 6},
    {id: 'B', x: 2, y: 5},
    {id: 'C', x: 5, y: 3},
    {id: 'D', x: 7, y: 4},
    {id: 'E', x: 6, y: 1}
  ];
  
  // Different cluster assignments per metric (illustrative)
  const clusters = {
    manhattan: {A: 1, B: 1, C: 2, D: 2, E: 2},
    euclidean: {A: 1, B: 1, C: 2, D: 2, E: 3},
    chebyshev: {A: 1, B: 1, C: 1, D: 2, E: 2}
  };
  
  const clusterColors = {1: '#ff6b6b', 2: '#00d4ff', 3: '#00ff88'};
  const titles = ['Manhattan', 'Euclidean', 'Chebyshev'];
  const keys = ['manhattan', 'euclidean', 'chebyshev'];
  
  keys.forEach((key, i) => {
    const offsetX = marginLeft + i * (panelW + gap);
    const g = svg.append('g').attr('transform', `translate(${offsetX},${marginTop})`);
    
    // Panel background
    g.append('rect').attr('width', panelW).attr('height', panelH)
      .attr('fill', 'none').attr('stroke', 'none');
    
    // Title
    g.append('text').attr('x', panelW/2).attr('y', -12)
      .text(titles[i]).attr('fill', '#e65468ff').style('font-size', '13px').attr('text-anchor', 'middle');
    
    const xScale = d3.scaleLinear().domain([0, 8]).range([15, panelW - 15]);
    const yScale = d3.scaleLinear().domain([0, 8]).range([panelH - 15, 15]);
    
    // Light grid
    for (let t = 0; t <= 8; t += 2) {
      g.append('line').attr('x1', xScale(t)).attr('x2', xScale(t)).attr('y1', 15).attr('y2', panelH - 15)
        .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.5);
      g.append('line').attr('x1', 15).attr('x2', panelW - 15).attr('y1', yScale(t)).attr('y2', yScale(t))
        .attr('stroke', '#334').attr('stroke-width', 0.5).attr('opacity', 0.5);
    }
    
    // Draw cluster hulls (simplified: just draw circles with cluster color)
    points.forEach(p => {
      const clusterNum = clusters[key][p.id];
      g.append('circle')
        .attr('cx', xScale(p.x)).attr('cy', yScale(p.y))
        .attr('r', 12).attr('fill', clusterColors[clusterNum]).attr('opacity', 0.85);
      g.append('text')
        .attr('x', xScale(p.x)).attr('y', yScale(p.y) + 4)
        .text(p.id).attr('fill', '#fff').style('font-size', '10px').attr('text-anchor', 'middle');
    });
  });
})();
</script>

***

-? Key question before clustering:
-: Which distance best reflects *meaningful similarity* for your samples?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="vector-distance" -->
## Distance Between Two Vectors

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Two n-dimensional vectors**

-! **a** = (a₁, a₂, …, aₙ)  
-! **b** = (b₁, b₂, …, bₙ)

*** 

-! Minkowski distance (general form) 
$$d_p(a,b) = \left( \sum_{i=1}^{n} |a_i - b_i|^p \right)^{\frac{1}{p}}$$

-: p = 1 → Manhattan  
-: p = 2 → Euclidean  
-: p → ∞ → Chebyshev (max |xᵢ − yᵢ|)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Quick example (Euclidean, p = 2)**

Let a = (2, 3, 1), b = (5, 1, 4)

$$d_2 = \sqrt{(2-5)^2 + (3-1)^2 + (1-4)^2} $$
$$= \sqrt{9 + 4 + 9} = \sqrt{22} \approx 4.69$$

*** 

-? Distances depend on scaling → standardize variables when units differ.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="minkowski-distance-webr" -->
## Minkowski Distance (WebR)

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Compute distances in R**

-! Choose vectors **a**, **b** and a power **p**
-: Compute Manhattan (p=1), Euclidean (p=2), and any p
-: Chebyshev uses max |aᵢ − bᵢ|

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="minkowski-distance-webr-container"></div>

<script>
(function() {
  const containerId = 'minkowski-distance-webr-container';
  const code = `# Vectors
a <- c(2, 3, 1)
b <- c(5, 1, 4)

# Minkowski distance function
dist_minkowski <- function(a, b, p) {
  (sum(abs(a - b)^p))^(1/p)
}

# Distances
d1 <- dist_minkowski(a, b, 1)   # Manhattan
d2 <- dist_minkowski(a, b, 2)   # Euclidean
d3 <- dist_minkowski(a, b, 3)   # Example p=3
dinf <- max(abs(a - b))         # Chebyshev

cat("a =", a, "\\n")
cat("b =", b, "\\n")
cat("p=1  (Manhattan):", d1, "\\n")
cat("p=2  (Euclidean):", d2, "\\n")
cat("p=3  (Example):  ", d3, "\\n")
cat("p=Inf(Chebyshev):", dinf, "\\n")`;
  const fallback = () => {
    return `[Simulated in JavaScript]
a = 2 3 1
b = 5 1 4
p=1  (Manhattan): 8
p=2  (Euclidean): 4.690416
p=3  (Example):   4.160168
p=Inf(Chebyshev): 3`;
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'minkowski-distance-webr',
      fallback,
      runLabel: 'Run Minkowski Distance (WebR)'
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hca-overview" -->
## What is Hierarchical Clustering?

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Hierarchical Cluster Analysis**

-! A method that builds a *nested sequence* of clusters

-: No need to specify the number of clusters in advance

-: Result is a *hierarchy* from individual objects to one all-encompassing group

***

-! Two main approaches:
-: **Agglomerative** (bottom-up): start separate, merge stepwise
-: **Divisive** (top-down): start together, split stepwise

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 520 320" style="width: 100%; height: auto;">
  
  <defs>
    <style>
      .hca-node { fill: #2a3b52; stroke: #9fb4c8; stroke-width: 2; }
      .hca-line { stroke: #9fb4c8; stroke-width: 2; fill: none; }
      .hca-label { fill: #e2e8f0; font-size: 14px; font-weight: 600; }
      .hca-caption { fill: #9fb4c8; font-size: 12px; }
    </style>
  </defs>
  <!-- Level 0: individual objects -->
  <circle class="hca-node" cx="60" cy="270" r="14"></circle>
  <circle class="hca-node" cx="160" cy="270" r="14"></circle>
  <circle class="hca-node" cx="260" cy="270" r="14"></circle>
  <circle class="hca-node" cx="360" cy="270" r="14"></circle>
  <circle class="hca-node" cx="460" cy="270" r="14"></circle>
  <text class="hca-label" x="60" y="275" text-anchor="middle">A</text>
  <text class="hca-label" x="160" y="275" text-anchor="middle">B</text>
  <text class="hca-label" x="260" y="275" text-anchor="middle">C</text>
  <text class="hca-label" x="360" y="275" text-anchor="middle">D</text>
  <text class="hca-label" x="460" y="275" text-anchor="middle">E</text>
  <!-- Level 1 merges -->
  <line class="hca-line" x1="60" y1="256" x2="110" y2="210"></line>
  <line class="hca-line" x1="160" y1="256" x2="110" y2="210"></line>
  <circle class="hca-node" cx="110" cy="210" r="14"></circle>
  <line class="hca-line" x1="360" y1="256" x2="410" y2="210"></line>
  <line class="hca-line" x1="460" y1="256" x2="410" y2="210"></line>
  <circle class="hca-node" cx="410" cy="210" r="14"></circle>
  <!-- Level 2 merges -->
  <line class="hca-line" x1="110" y1="196" x2="210" y2="150"></line>
  <line class="hca-line" x1="260" y1="256" x2="210" y2="150"></line>
  <circle class="hca-node" cx="210" cy="150" r="14"></circle>
  <line class="hca-line" x1="410" y1="196" x2="310" y2="150"></line>
  <circle class="hca-node" cx="310" cy="150" r="14"></circle>
  <!-- Level 3 final merge -->
  <line class="hca-line" x1="210" y1="136" x2="260" y2="90"></line>
  <line class="hca-line" x1="310" y1="136" x2="260" y2="90"></line>
  <circle class="hca-node" cx="260" cy="90" r="16"></circle>
  <text class="hca-label" x="260" y="96" text-anchor="middle">All</text>
  <text class="hca-caption" x="260" y="24" text-anchor="middle">Nested clusters: bottom-up merging</text>
</svg>

***

-! We focus on the **agglomerative** approach
-: More commonly used in practice
-: Intuitive merging logic

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hca-step-by-step" -->
## Step-by-Step Process

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Agglomerative Algorithm**

-! Step 1: Each object starts as its *own cluster*

-! Step 2: Find the *two closest* clusters

-! Step 3: Merge them into a *single cluster*

-! Step 4: Update distances to the new cluster

-! Step 5: Repeat until *one cluster* remains

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="hca-step-animation" style="width: 100%; height: 520px;"></div>

<script>
(function() {
  const containerId = 'hca-step-animation';
  const slideId = 'hca-step-by-step';
  let loopTimer = null;

  function render() {
    if (typeof d3 === 'undefined') {
      setTimeout(render, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;
    if (loopTimer) {
      clearTimeout(loopTimer);
      loopTimer = null;
    }
    container.innerHTML = '';

    const width = container.clientWidth || 520;
    const height = width;
    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('max-width', '100%')
      .style('height', 'auto');

    const isPerformanceMode = document.body.classList.contains('performance-mode');
    const colors = isPerformanceMode ? {
      point: '#111111',
      stroke: '#333333',
      merge: '#2c7a7b',
      text: '#111111',
      hint: '#444444'
    } : {
      point: '#0b1220',
      stroke: '#9fb4c8',
      merge: '#00d4ff',
      text: '#e2e8f0',
      hint: '#9fb4c8'
    };

    const points = [
      { id: 'A', x: width * 0.1, y: height * 0.85 },
      { id: 'B', x: width * 0.3, y: height * 0.85 },
      { id: 'C', x: width * 0.5, y: height * 0.85 },
      { id: 'D', x: width * 0.7, y: height * 0.85 },
      { id: 'E', x: width * 0.9, y: height * 0.85 }
    ];

    const labels = svg.append('g');
    const nodes = svg.append('g');
    const links = svg.append('g');
    const stepText = svg.append('text')
      .attr('x', width / 2)
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.hint)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text('Step 0: 5 singletons');

    nodes.selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 14)
      .attr('fill', colors.point)
      .attr('stroke', colors.stroke)
      .attr('stroke-width', 2);

    labels.selectAll('text')
      .data(points)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .attr('font-size', '13px')
      .attr('font-weight', '700')
      .text(d => d.id);

    const merges = [
      { step: 1, text: 'Step 1: Merge A+B', left: 'A', right: 'B', y: height * 0.65, label: 'AB' },
      { step: 2, text: 'Step 2: Merge D+E', left: 'D', right: 'E', y: height * 0.65, label: 'DE' },
      { step: 3, text: 'Step 3: Merge (A,B)+C', left: 'AB', right: 'C', y: height * 0.45, label: 'ABC' },
      { step: 4, text: 'Step 4: Merge (A,B,C)+(D,E)', left: 'ABC', right: 'DE', y: height * 0.25, label: 'ALL' }
    ];

    const clusterPos = {
      A: points[0],
      B: points[1],
      C: points[2],
      D: points[3],
      E: points[4]
    };

    function drawDendrogramMerge(leftId, rightId, yMerge, label) {
      const left = clusterPos[leftId];
      const right = clusterPos[rightId];
      const xMid = (left.x + right.x) / 2;

      const leftUp = links.append('line')
        .attr('x1', left.x)
        .attr('y1', left.y - 14)
        .attr('x2', left.x)
        .attr('y2', yMerge)
        .attr('stroke', colors.merge)
        .attr('stroke-width', 3)
        .attr('opacity', 0);

      const rightUp = links.append('line')
        .attr('x1', right.x)
        .attr('y1', right.y - 14)
        .attr('x2', right.x)
        .attr('y2', yMerge)
        .attr('stroke', colors.merge)
        .attr('stroke-width', 3)
        .attr('opacity', 0);

      const join = links.append('line')
        .attr('x1', left.x)
        .attr('y1', yMerge)
        .attr('x2', right.x)
        .attr('y2', yMerge)
        .attr('stroke', colors.merge)
        .attr('stroke-width', 3)
        .attr('opacity', 0);

      leftUp.transition().duration(600).attr('opacity', 1);
      rightUp.transition().duration(600).attr('opacity', 1);
      join.transition().duration(600).attr('opacity', 1);

      nodes.append('circle')
        .attr('cx', xMid)
        .attr('cy', yMerge)
        .attr('r', 10)
        .attr('fill', colors.point)
        .attr('stroke', colors.stroke)
        .attr('stroke-width', 2)
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .attr('opacity', 1);

      labels.append('text')
        .attr('x', xMid)
        .attr('y', yMerge - 12)
        .attr('text-anchor', 'middle')
        .attr('fill', colors.text)
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .attr('opacity', 0)
        .text(label)
        .transition()
        .duration(600)
        .attr('opacity', 1);

      clusterPos[label] = { x: xMid, y: yMerge };
    }

    function runSequence() {
      let delay = 800;
      merges.forEach((merge, idx) => {
        setTimeout(() => {
          stepText.text(merge.text);
          drawDendrogramMerge(merge.left, merge.right, merge.y, merge.label);
        }, delay);
        delay += 900;
      });

      loopTimer = setTimeout(() => {
        if (typeof Reveal !== 'undefined') {
          const current = Reveal.getCurrentSlide && Reveal.getCurrentSlide();
          if (!current || current.id !== slideId) return;
        }
        render();
      }, delay + 600);
    }

    runSequence();
  }

  render();

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.id === slideId) {
        render();
      }
    });
    Reveal.on('ready', event => {
      if (event.currentSlide.id === slideId) {
        render();
      }
    });
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="distance-matrix-construction" -->
## Constructing the Distance Matrix

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**The Distance Matrix**

-! A *symmetric table* of pairwise distances between all objects

-: Diagonal entries are zero (distance to self)

-: Off-diagonal entries show how *dissimilar* each pair is

***

-! The matrix is the *input* to hierarchical clustering
-: Computed once before clustering begins
-: Updated after each merge (cluster distances)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Example: 5 Water Samples**

<div style="font-size: 0.8em;">

|   | A | B | C | D | E |
|:-:|:-:|:-:|:-:|:-:|:-:|
| A | 0 | 2 | 8 | 7 | 3 |
| B | 2 | 0 | 9 | 8 | 2 |
| C | 8 | 9 | 0 | 1 | 7 |
| D | 7 | 8 | 1 | 0 | 6 |
| E | 3 | 2 | 7 | 6 | 0 |

</div>

***

-? Which pair is *most similar*? → C and D (distance = 1)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="linkage-strategies" -->
## Linkage Strategies

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**The Linkage Question**

-! Once clusters contain *multiple objects*, how do we measure distance *between clusters*?

-: Different rules → different clustering results

***

-! Three common strategies:
-: **Single linkage**: nearest neighbor
-: **Complete linkage**: farthest neighbor
-: **Average linkage**: mean of all pairwise distances

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Conceptual Definitions**

<div style="font-size: 0.7em;">

| Linkage | Distance = |
|:--------|:-----------|
| Single | *Minimum* distance between any two members |
| Complete | *Maximum* distance between any two members |
| Average | *Mean* of all pairwise distances |

</div>

***

-! The linkage choice shapes the *geometry* of resulting clusters

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="linkage-comparison" -->
## Comparing Linkage Methods

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Single Linkage**

-! Tends to produce *elongated, chain-like* clusters

-: Can link distant objects through intermediates

-: Sensitive to noise and outliers

***

**Complete Linkage**

-! Tends to produce *compact, spherical* clusters

-: Avoids chaining by considering worst-case distances

-: More robust to outliers

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Diagram idea: Same dataset clustered with single vs. complete linkage; single shows chaining effect, complete shows compact groups*

***

**Average Linkage**

-! A *compromise* between single and complete

-: Balances sensitivity and robustness

-: Often a reasonable default choice

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="dendrogram-intro" -->
## What is a Dendrogram?

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Dendrogram**

-! A *tree-like diagram* representing the clustering hierarchy

-: Shows *which objects merged* and *at what distance*

-: The full clustering history in one visualization

***

-! Key terminology:
-: *Leaves*: individual objects at the bottom
-: *Branches*: merged clusters
-: *Height*: distance at which a merge occurs

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 420 380" style="width: 100%; height: auto; max-height: 420px;">
  
  <!-- Background -->
  <rect width="420" height="380" fill="transparent"/>
  <!-- Y-axis (Distance) -->
  <line x1="60" y1="40" x2="60" y2="320" stroke="#888" stroke-width="1.5"/>
  <text x="30" y="180" fill="#9efcff" font-size="13" transform="rotate(-90, 30, 180)" text-anchor="middle">Distance</text>
  <!-- Y-axis ticks -->
  <line x1="55" y1="320" x2="60" y2="320" stroke="#888" stroke-width="1"/>
  <text x="48" y="324" fill="#aaa" font-size="11" text-anchor="end">0</text>
  <line x1="55" y1="250" x2="60" y2="250" stroke="#888" stroke-width="1"/>
  <text x="48" y="254" fill="#aaa" font-size="11" text-anchor="end">1</text>
  <line x1="55" y1="180" x2="60" y2="180" stroke="#888" stroke-width="1"/>
  <text x="48" y="184" fill="#aaa" font-size="11" text-anchor="end">2</text>
  <line x1="55" y1="110" x2="60" y2="110" stroke="#888" stroke-width="1"/>
  <text x="48" y="114" fill="#aaa" font-size="11" text-anchor="end">3</text>
  <line x1="55" y1="40" x2="60" y2="40" stroke="#888" stroke-width="1"/>
  <text x="48" y="44" fill="#aaa" font-size="11" text-anchor="end">4</text>
  <!-- Leaves (A, B, C, D, E) at y=320 -->
  <text x="100" y="345" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">A</text>
  <text x="160" y="345" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">B</text>
  <text x="220" y="345" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">C</text>
  <text x="280" y="345" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">D</text>
  <text x="340" y="345" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">E</text>
  <!-- Vertical lines from leaves -->
  <line x1="100" y1="320" x2="100" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="160" y1="320" x2="160" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="220" y1="320" x2="220" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="280" y1="320" x2="280" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="340" y1="320" x2="340" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 1: A+B at height 1 (y=250) -->
  <line x1="100" y1="250" x2="160" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="130" y1="250" x2="130" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 2: C+D at height 2 (y=180) -->
  <line x1="220" y1="180" x2="280" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="250" y1="180" x2="250" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 3: (A,B)+(C,D) at height 3 (y=110) -->
  <line x1="130" y1="110" x2="250" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <line x1="190" y1="110" x2="190" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 4: ((A,B,C,D))+E at height ~3.8 (y=55) -->
  <line x1="190" y1="55" x2="340" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <line x1="340" y1="110" x2="340" y2="55" stroke="#00d4ff" stroke-width="2"/>
</svg>

***

-! The dendrogram encodes *all possible clusterings*
-: From n clusters (each object alone) to 1 cluster (all together)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="dendrogram-reading" -->
## Reading a Dendrogram

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**How to Interpret**

-! *Vertical position* of a merge = distance at fusion

-: Low merge → objects are *very similar*
-: High merge → objects are *quite different*

***

-! *Horizontal proximity* of leaves does *not* imply similarity

-: Only the *height of the connecting branch* matters

***

-! Cutting at a specific height yields a *fixed number of clusters*

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 420 400" style="width: 100%; height: auto; max-height: 420px;">

  <!-- Background -->
  <rect width="420" height="400" fill="transparent"/>
  <!-- Y-axis (Distance) -->
  <line x1="60" y1="40" x2="60" y2="320" stroke="#888" stroke-width="1.5"/>
  <text x="30" y="180" fill="#9efcff" font-size="12" transform="rotate(-90, 30, 180)" text-anchor="middle">Distance</text>
  <!-- Y-axis ticks -->
  <line x1="55" y1="320" x2="60" y2="320" stroke="#888" stroke-width="1"/>
  <text x="48" y="324" fill="#aaa" font-size="10" text-anchor="end">0</text>
  <line x1="55" y1="250" x2="60" y2="250" stroke="#888" stroke-width="1"/>
  <text x="48" y="254" fill="#aaa" font-size="10" text-anchor="end">1</text>
  <line x1="55" y1="180" x2="60" y2="180" stroke="#888" stroke-width="1"/>
  <text x="48" y="184" fill="#aaa" font-size="10" text-anchor="end">2</text>
  <line x1="55" y1="110" x2="60" y2="110" stroke="#888" stroke-width="1"/>
  <text x="48" y="114" fill="#aaa" font-size="10" text-anchor="end">3</text>
  <line x1="55" y1="40" x2="60" y2="40" stroke="#888" stroke-width="1"/>
  <text x="48" y="44" fill="#aaa" font-size="10" text-anchor="end">4</text>
  <!-- Leaves (A, B, C, D, E) at y=320 -->
  <text x="100" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">A</text>
  <text x="160" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">B</text>
  <text x="220" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">C</text>
  <text x="280" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">D</text>
  <text x="340" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">E</text>
  <!-- Vertical lines from leaves -->
  <line x1="100" y1="320" x2="100" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="160" y1="320" x2="160" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="220" y1="320" x2="220" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="280" y1="320" x2="280" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="340" y1="320" x2="340" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 1: A+B at height 1 (y=250) -->
  <line x1="100" y1="250" x2="160" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="130" y1="250" x2="130" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 2: C+D at height 2 (y=180) -->
  <line x1="220" y1="180" x2="280" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="250" y1="180" x2="250" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 3: (A,B)+(C,D) at height 3 (y=110) -->
  <line x1="130" y1="110" x2="250" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <line x1="190" y1="110" x2="190" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 4: ((A,B,C,D))+E at height ~3.8 (y=55) -->
  <line x1="190" y1="55" x2="340" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <line x1="340" y1="110" x2="340" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <!-- Annotation: LOW merge (A+B) = high similarity -->
  <line x1="130" y1="250" x2="130" y2="265" stroke="#00ff88" stroke-width="1.5" stroke-dasharray="3,2"/>
  <circle cx="130" cy="272" r="3" fill="#00ff88"/>
  <text x="130" y="290" fill="#00ff88" font-size="10" text-anchor="middle">low merge</text>
  <text x="130" y="302" fill="#00ff88" font-size="9" text-anchor="middle">→ similar</text>
  <!-- Annotation: HIGH merge (all+E) = low similarity -->
  <line x1="265" y1="55" x2="265" y2="25" stroke="#ff6b6b" stroke-width="1.5" stroke-dasharray="3,2"/>
  <circle cx="265" cy="18" r="3" fill="#ff6b6b"/>
  <text x="265" y="10" fill="#ff6b6b" font-size="10" text-anchor="middle">high merge → dissimilar</text>
  <!-- Vertical guide line at height 2 -->
  <line x1="65" y1="180" x2="360" y2="180" stroke="#ff9f43" stroke-width="1" stroke-dasharray="5,3" opacity="0.6"/>
  <text x="375" y="184" fill="#ff9f43" font-size="9" text-anchor="start">h=2</text>
  <!-- Height indicator arrow -->
  <line x1="385" y1="320" x2="385" y2="55" stroke="#888" stroke-width="1"/>
  <polygon points="385,55 382,65 388,65" fill="#888"/>
  <text x="400" y="190" fill="#888" font-size="9" transform="rotate(-90, 400, 190)" text-anchor="middle">height</text>
</svg>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="cutoff-threshold" -->
## Choosing a Cut-off Threshold

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**The Cut-off Decision**

-! Drawing a *horizontal line* through the dendrogram defines the number of clusters

-: Higher cut → fewer, larger clusters
-: Lower cut → more, smaller clusters

***

-! There is *no single correct answer*
-: Clustering is exploratory, not confirmatory

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 420 400" style="width: 100%; height: auto; max-height: 420px;">
  
  <!-- Background -->
  <rect width="420" height="400" fill="transparent"/>
  <!-- Y-axis (Distance) -->
  <line x1="60" y1="40" x2="60" y2="320" stroke="#888" stroke-width="1.5"/>
  <text x="30" y="180" fill="#9efcff" font-size="12" transform="rotate(-90, 30, 180)" text-anchor="middle">Distance</text>
  <!-- Y-axis ticks -->
  <line x1="55" y1="320" x2="60" y2="320" stroke="#888" stroke-width="1"/>
  <text x="48" y="324" fill="#aaa" font-size="10" text-anchor="end">0</text>
  <line x1="55" y1="250" x2="60" y2="250" stroke="#888" stroke-width="1"/>
  <text x="48" y="254" fill="#aaa" font-size="10" text-anchor="end">1</text>
  <line x1="55" y1="180" x2="60" y2="180" stroke="#888" stroke-width="1"/>
  <text x="48" y="184" fill="#aaa" font-size="10" text-anchor="end">2</text>
  <line x1="55" y1="110" x2="60" y2="110" stroke="#888" stroke-width="1"/>
  <text x="48" y="114" fill="#aaa" font-size="10" text-anchor="end">3</text>
  <line x1="55" y1="40" x2="60" y2="40" stroke="#888" stroke-width="1"/>
  <text x="48" y="44" fill="#aaa" font-size="10" text-anchor="end">4</text>
  <!-- Leaves (A, B, C, D, E) at y=320 -->
  <text x="100" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">A</text>
  <text x="160" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">B</text>
  <text x="220" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">C</text>
  <text x="280" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">D</text>
  <text x="340" y="340" fill="#fff" font-size="13" text-anchor="middle" font-weight="bold">E</text>
  <!-- Dendrogram structure -->
  <!-- Vertical lines from leaves -->
  <line x1="100" y1="320" x2="100" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="160" y1="320" x2="160" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="220" y1="320" x2="220" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="280" y1="320" x2="280" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="340" y1="320" x2="340" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 1: A+B at height 1 (y=250) -->
  <line x1="100" y1="250" x2="160" y2="250" stroke="#00d4ff" stroke-width="2"/>
  <line x1="130" y1="250" x2="130" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 2: C+D at height 2 (y=180) -->
  <line x1="220" y1="180" x2="280" y2="180" stroke="#00d4ff" stroke-width="2"/>
  <line x1="250" y1="180" x2="250" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 3: (A,B)+(C,D) at height 3 (y=110) -->
  <line x1="130" y1="110" x2="250" y2="110" stroke="#00d4ff" stroke-width="2"/>
  <line x1="190" y1="110" x2="190" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <!-- Merge 4: ((A,B,C,D))+E at height ~3.8 (y=55) -->
  <line x1="190" y1="55" x2="340" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <line x1="340" y1="110" x2="340" y2="55" stroke="#00d4ff" stroke-width="2"/>
  <!-- CUT A: High cut at h=2.5 (y=145) → 2 clusters -->
  <line x1="65" y1="145" x2="370" y2="145" stroke="#ff6b6b" stroke-width="2"/>
  <text x="380" y="149" fill="#ff6b6b" font-size="10" text-anchor="start">Cut A</text>
  <!-- Cluster brackets for Cut A -->
  <rect x="85" y="350" width="200" height="8" fill="#ff6b6b" fill-opacity="0.3" rx="2"/>
  <rect x="325" y="350" width="30" height="8" fill="#ff6b6b" fill-opacity="0.3" rx="2"/>
  <text x="185" y="370" fill="#ff6b6b" font-size="9" text-anchor="middle">Cut A → 2 clusters</text>
  <!-- CUT B: Low cut at h=1.5 (y=215) → 4 clusters -->
  <line x1="65" y1="215" x2="370" y2="215" stroke="#00ff88" stroke-width="2"/>
  <text x="380" y="219" fill="#00ff88" font-size="10" text-anchor="start">Cut B</text>
  <!-- Cluster indicators for Cut B (small markers below leaves) -->
  <circle cx="100" cy="385" r="4" fill="#00ff88" fill-opacity="0.7"/>
  <circle cx="160" cy="385" r="4" fill="#00ff88" fill-opacity="0.7"/>
  <line x1="100" y1="385" x2="160" y2="385" stroke="#00ff88" stroke-width="1.5" opacity="0.5"/>
  <circle cx="220" cy="385" r="4" fill="#00ff88" fill-opacity="0.7"/>
  <circle cx="280" cy="385" r="4" fill="#00ff88" fill-opacity="0.7"/>
  <circle cx="340" cy="385" r="4" fill="#00ff88" fill-opacity="0.7"/>
  <text x="220" y="398" fill="#00ff88" font-size="9" text-anchor="middle">Cut B → 4 clusters</text>
</svg>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hca-r-example" -->
## Hierarchical Clustering in R
<!-- Hands-on slide. WebR code block: hclust() and plot() on small environmental dataset. Reproducible example. -->

---

<!-- .slide:id="kmeans-intro" -->
## What is k-Means Clustering?

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**k-Means Clustering**

-! A *partitioning* method that divides data into exactly *k* groups

-: Each object belongs to *one and only one* cluster

-: No nested hierarchy — just a flat partition

***

-! Core principle:
-: Minimize the *variation within* each cluster
-: Objects in a cluster should be as *similar* as possible

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 400 340" style="width: 100%; height: auto; max-height: 380px;">
  
  <!-- Background -->
  <rect width="400" height="340" fill="transparent"/>
  <!-- Cluster 1 (top-left) - red -->
  <ellipse cx="100" cy="100" rx="70" ry="55" fill="#ff6b6b" fill-opacity="0.15" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="70" cy="85" r="8" fill="#ff6b6b"/>
  <circle cx="95" cy="70" r="8" fill="#ff6b6b"/>
  <circle cx="120" cy="90" r="8" fill="#ff6b6b"/>
  <circle cx="85" cy="115" r="8" fill="#ff6b6b"/>
  <circle cx="110" cy="125" r="8" fill="#ff6b6b"/>
  <circle cx="130" cy="105" r="8" fill="#ff6b6b"/>
  <!-- Centroid 1 -->
  <circle cx="100" cy="98" r="14" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
  <line x1="92" y1="90" x2="108" y2="106" stroke="#ff6b6b" stroke-width="2"/>
  <line x1="108" y1="90" x2="92" y2="106" stroke="#ff6b6b" stroke-width="2"/>
  <!-- Cluster 2 (top-right) - cyan -->
  <ellipse cx="300" cy="120" rx="65" ry="50" fill="#00d4ff" fill-opacity="0.15" stroke="#00d4ff" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="270" cy="105" r="8" fill="#00d4ff"/>
  <circle cx="295" cy="90" r="8" fill="#00d4ff"/>
  <circle cx="320" cy="100" r="8" fill="#00d4ff"/>
  <circle cx="280" cy="130" r="8" fill="#00d4ff"/>
  <circle cx="310" cy="140" r="8" fill="#00d4ff"/>
  <circle cx="330" cy="120" r="8" fill="#00d4ff"/>
  <!-- Centroid 2 -->
  <circle cx="300" cy="115" r="14" fill="none" stroke="#00d4ff" stroke-width="2.5"/>
  <line x1="292" y1="107" x2="308" y2="123" stroke="#00d4ff" stroke-width="2"/>
  <line x1="308" y1="107" x2="292" y2="123" stroke="#00d4ff" stroke-width="2"/>
  <!-- Cluster 3 (bottom-center) - green -->
  <ellipse cx="200" cy="260" rx="80" ry="50" fill="#00ff88" fill-opacity="0.15" stroke="#00ff88" stroke-width="1" stroke-dasharray="4,3"/>
  <circle cx="160" cy="250" r="8" fill="#00ff88"/>
  <circle cx="185" cy="235" r="8" fill="#00ff88"/>
  <circle cx="210" cy="245" r="8" fill="#00ff88"/>
  <circle cx="175" cy="275" r="8" fill="#00ff88"/>
  <circle cx="220" cy="280" r="8" fill="#00ff88"/>
  <circle cx="240" cy="255" r="8" fill="#00ff88"/>
  <!-- Centroid 3 -->
  <circle cx="200" cy="258" r="14" fill="none" stroke="#00ff88" stroke-width="2.5"/>
  <line x1="192" y1="250" x2="208" y2="266" stroke="#00ff88" stroke-width="2"/>
  <line x1="208" y1="250" x2="192" y2="266" stroke="#00ff88" stroke-width="2"/>
  <!-- Label -->
  <text x="360" y="30" fill="#9efcff" font-size="14" text-anchor="end">k = 3</text>
</svg>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="kmeans-algorithm" -->
## The k-Means Algorithm

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Iterative Refinement**

-! Step 1: Choose *k* initial cluster centers (centroids)

-! Step 2: *Assign* each object to the nearest centroid

-! Step 3: *Recalculate* centroids as the mean of assigned objects

-! Step 4: Repeat Steps 2–3 until assignments *stabilize*

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 480 340" style="width: 100%; height: auto; max-height: 380px;">
  
  <!-- Panel 1: Initialize -->
  <g transform="translate(10,30)">
    <text x="65" y="-8" fill="#9efcff" font-size="12" text-anchor="middle">Initialize</text>
    <rect x="0" y="0" width="140" height="280" fill="#1a1a2e" stroke="#334" stroke-width="1" rx="4"/>
    <!-- Points (gray, unassigned) -->
    <circle cx="30" cy="50" r="6" fill="#888"/>
    <circle cx="50" cy="35" r="6" fill="#888"/>
    <circle cx="70" cy="55" r="6" fill="#888"/>
    <circle cx="40" cy="75" r="6" fill="#888"/>
    <circle cx="100" cy="130" r="6" fill="#888"/>
    <circle cx="120" cy="115" r="6" fill="#888"/>
    <circle cx="110" cy="150" r="6" fill="#888"/>
    <circle cx="55" cy="220" r="6" fill="#888"/>
    <circle cx="75" cy="235" r="6" fill="#888"/>
    <circle cx="90" cy="210" r="6" fill="#888"/>
    <!-- Initial centroids (random) -->
    <circle cx="45" cy="55" r="10" fill="none" stroke="#ff6b6b" stroke-width="2"/>
    <line x1="39" y1="49" x2="51" y2="61" stroke="#ff6b6b" stroke-width="1.5"/>
    <line x1="51" y1="49" x2="39" y2="61" stroke="#ff6b6b" stroke-width="1.5"/>
    <circle cx="110" cy="130" r="10" fill="none" stroke="#00d4ff" stroke-width="2"/>
    <line x1="104" y1="124" x2="116" y2="136" stroke="#00d4ff" stroke-width="1.5"/>
    <line x1="116" y1="124" x2="104" y2="136" stroke="#00d4ff" stroke-width="1.5"/>
    <circle cx="70" cy="220" r="10" fill="none" stroke="#00ff88" stroke-width="2"/>
    <line x1="64" y1="214" x2="76" y2="226" stroke="#00ff88" stroke-width="1.5"/>
    <line x1="76" y1="214" x2="64" y2="226" stroke="#00ff88" stroke-width="1.5"/>
  </g>
  <!-- Arrow 1 -->
  <path d="M155,170 L165,170" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
  <!-- Panel 2: Assign -->
  <g transform="translate(170,30)">
    <text x="65" y="-8" fill="#9efcff" font-size="12" text-anchor="middle">Assign</text>
    <rect x="0" y="0" width="140" height="280" fill="#1a1a2e" stroke="#334" stroke-width="1" rx="4"/>
    <!-- Points now colored by cluster -->
    <circle cx="30" cy="50" r="6" fill="#ff6b6b"/>
    <circle cx="50" cy="35" r="6" fill="#ff6b6b"/>
    <circle cx="70" cy="55" r="6" fill="#ff6b6b"/>
    <circle cx="40" cy="75" r="6" fill="#ff6b6b"/>
    <circle cx="100" cy="130" r="6" fill="#00d4ff"/>
    <circle cx="120" cy="115" r="6" fill="#00d4ff"/>
    <circle cx="110" cy="150" r="6" fill="#00d4ff"/>
    <circle cx="55" cy="220" r="6" fill="#00ff88"/>
    <circle cx="75" cy="235" r="6" fill="#00ff88"/>
    <circle cx="90" cy="210" r="6" fill="#00ff88"/>
    <!-- Centroids (same position) -->
    <circle cx="45" cy="55" r="10" fill="none" stroke="#ff6b6b" stroke-width="2"/>
    <line x1="39" y1="49" x2="51" y2="61" stroke="#ff6b6b" stroke-width="1.5"/>
    <line x1="51" y1="49" x2="39" y2="61" stroke="#ff6b6b" stroke-width="1.5"/>
    <circle cx="110" cy="130" r="10" fill="none" stroke="#00d4ff" stroke-width="2"/>
    <line x1="104" y1="124" x2="116" y2="136" stroke="#00d4ff" stroke-width="1.5"/>
    <line x1="116" y1="124" x2="104" y2="136" stroke="#00d4ff" stroke-width="1.5"/>
    <circle cx="70" cy="220" r="10" fill="none" stroke="#00ff88" stroke-width="2"/>
    <line x1="64" y1="214" x2="76" y2="226" stroke="#00ff88" stroke-width="1.5"/>
    <line x1="76" y1="214" x2="64" y2="226" stroke="#00ff88" stroke-width="1.5"/>
  </g>
  <!-- Arrow 2 -->
  <path d="M315,170 L325,170" stroke="#555" stroke-width="2" marker-end="url(#arrowhead)"/>
  <!-- Panel 3: Update -->
  <g transform="translate(330,30)">
    <text x="65" y="-8" fill="#9efcff" font-size="12" text-anchor="middle">Update</text>
    <rect x="0" y="0" width="140" height="280" fill="#1a1a2e" stroke="#334" stroke-width="1" rx="4"/>
    <!-- Points colored -->
    <circle cx="30" cy="50" r="6" fill="#ff6b6b"/>
    <circle cx="50" cy="35" r="6" fill="#ff6b6b"/>
    <circle cx="70" cy="55" r="6" fill="#ff6b6b"/>
    <circle cx="40" cy="75" r="6" fill="#ff6b6b"/>
    <circle cx="100" cy="130" r="6" fill="#00d4ff"/>
    <circle cx="120" cy="115" r="6" fill="#00d4ff"/>
    <circle cx="110" cy="150" r="6" fill="#00d4ff"/>
    <circle cx="55" cy="220" r="6" fill="#00ff88"/>
    <circle cx="75" cy="235" r="6" fill="#00ff88"/>
    <circle cx="90" cy="210" r="6" fill="#00ff88"/>
    <!-- Old centroids (faint) -->
    <circle cx="45" cy="55" r="8" fill="none" stroke="#ff6b6b" stroke-width="1" opacity="0.3"/>
    <circle cx="110" cy="130" r="8" fill="none" stroke="#00d4ff" stroke-width="1" opacity="0.3"/>
    <circle cx="70" cy="220" r="8" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.3"/>
    <!-- New centroids (moved) -->
    <circle cx="48" cy="54" r="10" fill="none" stroke="#ff6b6b" stroke-width="2.5"/>
    <line x1="42" y1="48" x2="54" y2="60" stroke="#ff6b6b" stroke-width="1.5"/>
    <line x1="54" y1="48" x2="42" y2="60" stroke="#ff6b6b" stroke-width="1.5"/>
    <circle cx="110" cy="132" r="10" fill="none" stroke="#00d4ff" stroke-width="2.5"/>
    <line x1="104" y1="126" x2="116" y2="138" stroke="#00d4ff" stroke-width="1.5"/>
    <line x1="116" y1="126" x2="104" y2="138" stroke="#00d4ff" stroke-width="1.5"/>
    <circle cx="73" cy="222" r="10" fill="none" stroke="#00ff88" stroke-width="2.5"/>
    <line x1="67" y1="216" x2="79" y2="228" stroke="#00ff88" stroke-width="1.5"/>
    <line x1="79" y1="216" x2="67" y2="228" stroke="#00ff88" stroke-width="1.5"/>
    <!-- Movement arrows -->
    <line x1="45" y1="55" x2="47" y2="54" stroke="#ff6b6b" stroke-width="1" stroke-dasharray="2,1"/>
    <line x1="70" y1="220" x2="72" y2="221" stroke="#00ff88" stroke-width="1" stroke-dasharray="2,1"/>
  </g>
  
  <!-- Arrowhead marker definition -->
  <defs>
    <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#555"/>
    </marker>
  </defs>
</svg>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="kmeans-initialization" -->
## Initialization and Convergence

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**The Initialization Problem**

-! k-Means is *sensitive* to initial centroid placement

-: Different starting positions → different final clusters

-: The algorithm finds a *local* optimum, not necessarily the global best

***

-! Common solution:
-: Run the algorithm *multiple times* with random starts
-: Keep the result with the *lowest* within-cluster variation

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 400 340" style="width: 100%; height: auto; max-height: 380px;">
  
  <!-- Panel 1: Run 1 -->
  <g transform="translate(10,35)">
    <text x="85" y="-12" fill="#9efcff" font-size="13" text-anchor="middle">Run 1</text>
    <rect x="0" y="0" width="180" height="260" fill="#1a1a2e" stroke="#334" stroke-width="1" rx="4"/>  
    <!-- Cluster regions (faint) -->
    <ellipse cx="55" cy="70" rx="45" ry="40" fill="#ff6b6b" fill-opacity="0.12"/>
    <ellipse cx="130" cy="140" rx="40" ry="45" fill="#00d4ff" fill-opacity="0.12"/>
    <ellipse cx="85" cy="215" rx="50" ry="35" fill="#00ff88" fill-opacity="0.12"/>
    <!-- Points -->
    <circle cx="35" cy="55" r="6" fill="#ff6b6b"/>
    <circle cx="55" cy="45" r="6" fill="#ff6b6b"/>
    <circle cx="75" cy="60" r="6" fill="#ff6b6b"/>
    <circle cx="45" cy="85" r="6" fill="#ff6b6b"/>
    <circle cx="65" cy="90" r="6" fill="#ff6b6b"/>
    <circle cx="110" cy="120" r="6" fill="#00d4ff"/>
    <circle cx="135" cy="110" r="6" fill="#00d4ff"/>
    <circle cx="150" cy="135" r="6" fill="#00d4ff"/>
    <circle cx="125" cy="160" r="6" fill="#00d4ff"/>
    <circle cx="140" cy="170" r="6" fill="#00d4ff"/>
    <circle cx="55" cy="200" r="6" fill="#00ff88"/>
    <circle cx="80" cy="190" r="6" fill="#00ff88"/>
    <circle cx="100" cy="215" r="6" fill="#00ff88"/>
    <circle cx="70" cy="230" r="6" fill="#00ff88"/>
    <circle cx="95" cy="235" r="6" fill="#00ff88"/>
    <!-- Centroids -->
    <circle cx="55" cy="67" r="9" fill="none" stroke="#ff6b6b" stroke-width="2"/>
    <line x1="49" y1="61" x2="61" y2="73" stroke="#ff6b6b" stroke-width="1.5"/>
    <line x1="61" y1="61" x2="49" y2="73" stroke="#ff6b6b" stroke-width="1.5"/>
    <circle cx="132" cy="139" r="9" fill="none" stroke="#00d4ff" stroke-width="2"/>
    <line x1="126" y1="133" x2="138" y2="145" stroke="#00d4ff" stroke-width="1.5"/>
    <line x1="138" y1="133" x2="126" y2="145" stroke="#00d4ff" stroke-width="1.5"/>
    <circle cx="80" cy="214" r="9" fill="none" stroke="#00ff88" stroke-width="2"/>
    <line x1="74" y1="208" x2="86" y2="220" stroke="#00ff88" stroke-width="1.5"/>
    <line x1="86" y1="208" x2="74" y2="220" stroke="#00ff88" stroke-width="1.5"/>
  </g>
  <!-- Panel 2: Run 2 (different result) -->
  <g transform="translate(210,35)">
    <text x="85" y="-12" fill="#9efcff" font-size="13" text-anchor="middle">Run 2</text>
    <rect x="0" y="0" width="180" height="260" fill="#1a1a2e" stroke="#334" stroke-width="1" rx="4"/>
    <!-- Different cluster regions -->
    <ellipse cx="55" cy="100" rx="50" ry="70" fill="#ff6b6b" fill-opacity="0.12"/>
    <ellipse cx="130" cy="160" rx="45" ry="70" fill="#00d4ff" fill-opacity="0.12"/>
    <!-- Same points, different colors (different assignment) -->
    <circle cx="35" cy="55" r="6" fill="#ff6b6b"/>
    <circle cx="55" cy="45" r="6" fill="#ff6b6b"/>
    <circle cx="75" cy="60" r="6" fill="#ff6b6b"/>
    <circle cx="45" cy="85" r="6" fill="#ff6b6b"/>
    <circle cx="65" cy="90" r="6" fill="#ff6b6b"/>
    <circle cx="110" cy="120" r="6" fill="#00d4ff"/>
    <circle cx="135" cy="110" r="6" fill="#00d4ff"/>
    <circle cx="150" cy="135" r="6" fill="#00d4ff"/>
    <circle cx="125" cy="160" r="6" fill="#00d4ff"/>
    <circle cx="140" cy="170" r="6" fill="#00d4ff"/>
    <!-- These bottom points split differently -->
    <circle cx="55" cy="200" r="6" fill="#ff6b6b"/>
    <circle cx="80" cy="190" r="6" fill="#00d4ff"/>
    <circle cx="100" cy="215" r="6" fill="#00d4ff"/>
    <circle cx="70" cy="230" r="6" fill="#ff6b6b"/>
    <circle cx="95" cy="235" r="6" fill="#00d4ff"/>
    <!-- Centroids (different positions) -->
    <circle cx="55" cy="102" r="9" fill="none" stroke="#ff6b6b" stroke-width="2"/>
    <line x1="49" y1="96" x2="61" y2="108" stroke="#ff6b6b" stroke-width="1.5"/>
    <line x1="61" y1="96" x2="49" y2="108" stroke="#ff6b6b" stroke-width="1.5"/>
    <circle cx="118" cy="165" r="9" fill="none" stroke="#00d4ff" stroke-width="2"/>
    <line x1="112" y1="159" x2="124" y2="171" stroke="#00d4ff" stroke-width="1.5"/>
    <line x1="124" y1="159" x2="112" y2="171" stroke="#00d4ff" stroke-width="1.5"/>
  </g>
  <!-- Bottom note -->
  <text x="200" y="325" fill="#888" font-size="11" text-anchor="middle">different start → different result</text>
</svg>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="kmeans-strengths-limitations" -->
## Strengths and Limitations

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Strengths**

-! *Fast* and computationally efficient

-! Scales well to *large datasets*

-! Results are *easy to interpret*

-! Works well when clusters are roughly *spherical* and *similar in size*

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Limitations**

-! Must specify *k* in advance

-! Assumes clusters are *convex* and *equally sized*

-! Sensitive to *outliers* (they pull centroids)

-! Cannot detect *elongated* or *irregular* cluster shapes

***

-? When clusters have very different sizes or shapes, k-Means may fail

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="kmeans-r-example" -->
## k-Means in R

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Using k-Means in R**

-! R provides the `kmeans()` function

-: Specify data and number of clusters *k*

-: Option to set number of random starts

***

-! Output includes:
-: Cluster assignments for each object
-: Centroid coordinates
-: Within-cluster sum of squares

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Placeholder: WebR interactive example*

***

| Output component | Interpretation |
|:-----------------|:---------------|
| Cluster vector | Which cluster each object belongs to |
| Centers | Location of each centroid |
| Within SS | Compactness of clusters |

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hca-vs-kmeans" -->
## Hierarchical vs. k-Means

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**When to Use Which?**

-! **Hierarchical clustering**:
-: Exploratory, no fixed k
-: Small to medium datasets
-: Want to see the full hierarchy

***

-! **k-Means**:
-: k is known or can be estimated
-: Large datasets
-: Need fast, scalable results

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Comparison**

| Aspect | Hierarchical | k-Means |
|:-------|:-------------|:--------|
| Specify k? | No | Yes |
| Output | Dendrogram | Partition |
| Scalability | Limited | High |
| Cluster shape | Flexible | Spherical |

***

-= The two methods *complement* each other — not competitors

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-why" -->
## Why Validate Clusters?

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**The Validation Problem**

-! Clustering algorithms *always* produce groups

-: Even random data will be partitioned into clusters

-: Finding clusters does *not* mean they are meaningful

***

-! We must ask:
-: Are the clusters *real* or artifacts?
-: Are they *stable* under small data changes?
-: Do they make *scientific sense*?

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Clustering ≠ Truth**

-! Clustering is *exploratory*, not confirmatory

-: It generates hypotheses, not proofs

***

*Conceptual schematic: Two datasets — one with clear structure, one with noise — both clustered into 3 groups; question mark over which is meaningful*

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-concepts" -->
## Cluster Validation Concepts

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Internal Validation**

-! Evaluates clustering based on the *data itself*

-: Are objects *within* a cluster close to each other?

-: Are objects in *different* clusters far apart?

***

-! Key idea: *compact and well-separated* clusters are better

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**External Validation**

-! Compares clustering to *external information*

-: Known group labels (if available)

-: Independent measurements or classifications

***

| Validation type | Based on |
|:----------------|:---------|
| Internal | Data structure only |
| External | Independent reference |

***

-! In practice, internal validation is more common (external labels often unavailable)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-cluster-separation" -->
## Using ANOVA for Cluster Separation

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Testing Cluster Differences**

-! After clustering, treat cluster labels as a *grouping factor*

-: Use **ANOVA** to test if clusters differ on each variable

-: Significant differences suggest clusters capture *real structure*

***

-! This connects clustering back to hypothesis testing

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Interpretation Caution**

-! ANOVA *after* clustering is *descriptive*, not confirmatory

-: The clusters were *defined* to maximize separation

-: p-values should not be interpreted as independent tests

***

-? Use ANOVA to *characterize* clusters, not to *prove* they exist

***

*Diagram idea: Boxplots of a variable across clusters; significant ANOVA result shown*

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="interpretation-emphasis" -->
## Interpretation Over Automation

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Clustering Requires Judgment**

-! Algorithms provide *candidates*, not answers

-: The analyst must decide if clusters are *meaningful*

-: Domain knowledge is *essential*

***

-! Ask yourself:
-: Do these clusters make *scientific sense*?
-: Can I *explain* why these samples group together?
-: Would a colleague reach the *same interpretation*?

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Common Pitfalls**

-! Over-trusting the algorithm

-! Ignoring outliers without justification

-! Claiming causation from correlation

-! Treating exploratory results as confirmatory

***

-= Clustering is a *tool for discovery*, not a substitute for critical thinking

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="summary" -->
## Summary

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Key Concepts**

-! *Distance measures* quantify dissimilarity
-: Manhattan, Euclidean, Chebyshev as special cases of **Minkowski**

***

-! *Hierarchical clustering* builds a nested hierarchy
-: Visualized as a dendrogram
-: Cut-off determines number of clusters

***

-! *k-Means* partitions data into k groups
-: Fast but requires specifying k

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Take-Home Messages**

-! Distance choice *matters* — justify it

-! Clustering *always* finds groups — validate them

-! Use ANOVA to *characterize*, not confirm

-! Interpretation requires *domain expertise*

***

-= Clustering is exploratory: it raises questions, not answers

<!-- /position -->
<!-- /layout -->

<!-- ============================================================
     OVERFLOW DEBUG REPORTER (DISABLED BY DEFAULT)
     Enable by setting: window.__DOE_DEBUG__ = true
     before Reveal.js initialization or in browser console.
     
     FULL-DECK SCAN MODE:
     - Open deck with URL parameter ?scan=1 for auto-scan
     - Or call window.__DOE_SCAN_ALL__() manually
     - Report saved to window.__DOE_OVERFLOW_REPORT_ALL__
     - JSON file automatically downloaded
     ============================================================ -->
<script>
(function() {
  // ============================================================
  // CONFIGURATION
  // ============================================================
  const MAX_COLUMN_HEIGHT_PX = 910; // Authoritative design-space constraint

  // ============================================================
  // GLOBAL FLAGS AND STORAGE (preserved from original)
  // ============================================================
  if (typeof window.__DOE_DEBUG__ === 'undefined') {
    window.__DOE_DEBUG__ = false;
  }
  
  window.__DOE_OVERFLOW_REPORT__ = [];
  window.__DOE_OVERFLOW_REPORT_ALL__ = null;

  // ============================================================
  // ORIGINAL PER-SLIDE MEASURE FUNCTION (preserved)
  // ============================================================
  const measureOverflow = () => {
    if (!window.__DOE_DEBUG__) return;
    
    const slide = document.querySelector('section.present');
    if (!slide) return;
    
    const slideId = slide.id || 'unknown';
    const timestamp = new Date().toISOString();
    
    // Measure slide overflow
    const slideOverflowY = Math.max(0, slide.scrollHeight - slide.clientHeight);
    const slideOverflowX = Math.max(0, slide.scrollWidth - slide.clientWidth);
    
    // Measure title overflow
    const title = slide.querySelector('h1, h2');
    let titleOverflowY = 0;
    if (title) {
      titleOverflowY = Math.max(0, title.scrollHeight - title.clientHeight);
    }
    
    // Measure grid columns
    const columns = [];
    const gridCols = slide.querySelectorAll('.custom-grid > div');
    let worstColIdx = -1;
    let worstColOverflow = 0;
    
    gridCols.forEach((col, i) => {
      const colOverflow = Math.max(0, col.scrollHeight - col.clientHeight);
      columns.push({ index: i, overflow: colOverflow });
      if (colOverflow > worstColOverflow) {
        worstColOverflow = colOverflow;
        worstColIdx = i;
      }
    });
    
    // Build report entry
    const entry = {
      slideId,
      slideOverflowY,
      slideOverflowX,
      titleOverflowY,
      columns,
      timestamp
    };
    
    // Update or add to report
    const existingIdx = window.__DOE_OVERFLOW_REPORT__.findIndex(e => e.slideId === slideId);
    if (existingIdx >= 0) {
      window.__DOE_OVERFLOW_REPORT__[existingIdx] = entry;
    } else {
      window.__DOE_OVERFLOW_REPORT__.push(entry);
    }
    
    // Console log
    const worstColStr = worstColIdx >= 0 ? `worstCol=${worstColIdx} +${worstColOverflow}px` : 'noCols';
    const status = (slideOverflowY > 0 || worstColOverflow > 0) ? 'OVERFLOW' : 'FIT OK';
    console.log(`[DOE-${status}] ${slideId} | slideY=${slideOverflowY} titleY=${titleOverflowY} ${worstColStr}`);
    
    // Optional in-slide badge
    let badge = slide.querySelector('.doe-debug-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'doe-debug-badge';
      badge.style.cssText = 'position:absolute;top:5px;right:5px;padding:3px 8px;border-radius:4px;font-size:11px;font-family:monospace;z-index:100;';
      slide.style.position = 'relative';
      slide.appendChild(badge);
    }
    
    if (slideOverflowY > 0 || worstColOverflow > 0) {
      badge.textContent = `OVERFLOW +${Math.max(slideOverflowY, worstColOverflow)}px`;
      badge.style.background = '#e06c75';
      badge.style.color = 'white';
    } else {
      badge.textContent = 'FIT OK';
      badge.style.background = '#98c379';
      badge.style.color = '#1a2340';
    }
  };

  // ============================================================
  // FULL-DECK SCAN FUNCTION (NEW)
  // ============================================================
  const scanAllSlides = async () => {
    const revealEl = document.querySelector('.reveal');
    if (!revealEl) {
      console.error('[DOE-SCAN] .reveal element not found');
      return null;
    }

    // Read CSS variables from .reveal (informational only)
    const revealStyle = getComputedStyle(revealEl);
    const cssVars = {
      slideWidth: revealStyle.getPropertyValue('--slide-width').trim() || 'not set',
      slideHeight: revealStyle.getPropertyValue('--slide-height').trim() || 'not set',
      slideScale: revealStyle.getPropertyValue('--slide-scale').trim() || 'not set',
      viewportWidth: revealStyle.getPropertyValue('--viewport-width').trim() || 'not set',
      viewportHeight: revealStyle.getPropertyValue('--viewport-height').trim() || 'not set'
    };

    // Get all slides (including nested)
    const allSlides = Array.from(document.querySelectorAll('.reveal .slides section'));
    const violations = [];
    const slidesWithViolationsSet = new Set();

    // Helper: wait for two animation frames
    const waitForLayout = () => new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });

    // Process each slide
    for (let slideIndex = 0; slideIndex < allSlides.length; slideIndex++) {
      const section = allSlides[slideIndex];

      // Store original inline styles
      const origDisplay = section.style.display;
      const origVisibility = section.style.visibility;
      const origPosition = section.style.position;

      // Temporarily make measurable
      section.style.display = 'block';
      section.style.visibility = 'hidden';
      section.style.position = 'absolute';

      // Wait for layout stabilization
      await waitForLayout();

      // Determine slide identity
      const slideId = section.id || `index-${slideIndex}`;

      // Find columns
      const columns = section.querySelectorAll('.custom-grid > div');

      // Measure each column
      columns.forEach((col, colIndex) => {
        const scrollHeight = col.scrollHeight;
        const overflowPx = Math.max(0, scrollHeight - MAX_COLUMN_HEIGHT_PX);

        if (overflowPx > 0) {
          violations.push({
            slideId,
            slideIndex,
            columnIndex: colIndex,
            scrollHeight,
            overflowPx
          });
          slidesWithViolationsSet.add(slideId);
        }
      });

      // Restore original inline styles
      section.style.display = origDisplay;
      section.style.visibility = origVisibility;
      section.style.position = origPosition;
    }

    // Build final report
    const report = {
      meta: {
        generatedAt: new Date().toISOString(),
        columnMaxHeightPx: MAX_COLUMN_HEIGHT_PX,
        slideWidth: cssVars.slideWidth,
        slideHeight: cssVars.slideHeight,
        slideScale: cssVars.slideScale,
        viewportWidth: cssVars.viewportWidth,
        viewportHeight: cssVars.viewportHeight,
        totalSlidesScanned: allSlides.length,
        slidesWithViolations: slidesWithViolationsSet.size
      },
      violations
    };

    // Store report globally
    window.__DOE_OVERFLOW_REPORT_ALL__ = report;

    // Log summary
    console.log(`[DOE-SCAN] scanned=${allSlides.length} slidesWithViolations=${slidesWithViolationsSet.size} violations=${violations.length}`);

    // Download report as JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'overflow-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return report;
  };

  // Expose scan function globally
  window.__DOE_SCAN_ALL__ = scanAllSlides;

  // ============================================================
  // EVENT HANDLERS (always registered)
  // ============================================================
  const registerRevealHandlers = () => {
    if (typeof Reveal !== 'undefined') {
      Reveal.on('ready', () => {
        measureOverflow();
        checkAutoScan();
      });
      Reveal.on('slidechanged', measureOverflow);
    } else {
      // Fallback: try again after Reveal loads
      setTimeout(registerRevealHandlers, 500);
    }
  };

  // ============================================================
  // AUTO-SCAN TRIGGER (checks for ?scan=1)
  // ============================================================
  const checkAutoScan = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('scan') === '1') {
      console.log('[DOE-SCAN] Auto-scan triggered by URL parameter');
      // Small delay to ensure full render
      setTimeout(() => {
        window.__DOE_SCAN_ALL__();
      }, 500);
    }
  };

  // ============================================================
  // INITIALIZATION
  // ============================================================
  const init = () => {
    registerRevealHandlers();
  };

  // Initialize when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Fallback auto-scan check on window load (if Reveal ready event missed)
  window.addEventListener('load', () => {
    // If Reveal is ready but auto-scan hasn't run yet
    if (typeof Reveal !== 'undefined' && Reveal.isReady && Reveal.isReady()) {
      checkAutoScan();
    }
  });

  // Also expose manual trigger (preserved)
  window.__DOE_MEASURE__ = measureOverflow;
})();
</script>
