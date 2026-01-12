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

<!-- .slide:id="intuitive-cluster-definition" -->
---
## What is a Cluster?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The term cluster is quite intuitive and commonly used in data analysis jargon.

***

-? But how would you define a cluster formally?
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="cluster-relative-wrapper" style="width: 100%; height: 700px; display: flex; flex-direction: column; gap: 12px;">
  <div id="cluster-relative-plot" style="width: 100%; height: 610px; display: flex; align-items: center; justify-content: center;"></div>
  <div style="display: flex; justify-content: center; gap: 12px;">
    <button id="cluster-zoom-stage-1" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600;">Zoom out</button>
    <button id="cluster-zoom-stage-2" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600;" disabled>Zoom out further</button>
  </div>
</div>

<script>
(function() {
  const plotId = 'cluster-relative-plot';
  const zoomStage1Id = 'cluster-zoom-stage-1';
  const zoomStage2Id = 'cluster-zoom-stage-2';
  const stateKey = '__clusterRelativeState__';
  const state = window[stateKey] || { level: 0, points: null, bound: false, setLevel: null, syncButtons: null };
  window[stateKey] = state;

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function gaussian(rng) {
    const u1 = Math.max(rng(), 1e-9);
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  function buildPoints() {
    const rng = seededRandom(17);
    let id = 0;
    const points = [];
    const addCluster = (cx, cy, count, spread, level) => {
      for (let i = 0; i < count; i++) {
        points.push({
          id: id++,
          x: cx + gaussian(rng) * spread,
          y: cy + gaussian(rng) * spread,
          level
        });
      }
    };

    addCluster(0, 0, 44, 0.36, 0);
    addCluster(4.8, -3.6, 40, 0.75, 1);

    const outerCenters = [
      { x: -160, y: -140 },
      { x: 150, y: 120 },
      { x: -170, y: 150 },
      { x: 165, y: -155 },
      { x: 0, y: 175 }
    ];
    outerCenters.forEach(center => addCluster(center.x, center.y, 36, 12, 2));
    for (let i = 0; i < 140; i++) {
      points.push({
        id: id++,
        x: (rng() * 2 - 1) * 200,
        y: (rng() * 2 - 1) * 200,
        level: 2
      });
    }
    return points;
  }

  function getTheme() {
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    return isPerformanceMode ? {
      panelFill: '#f7f7f4',
      gridMajor: '#222222',
      gridMinor: '#5f5f5f',
      pointFill: '#111827',
      pointStroke: '#111827'
    } : {
      panelFill: '#0b1220',
      gridMajor: '#4b5f74',
      gridMinor: '#37475a',
      pointFill: '#6ee7ff',
      pointStroke: '#0b1220'
    };
  }

  function init() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    const container = document.getElementById(plotId);
    if (!container) return;

    const theme = getTheme();
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;
    const size = Math.min(width, height);
    const margin = { top: 18, right: 18, bottom: 18, left: 18 };

    const fig = plotUtils.createFigure(plotId, size, size, margin);
    const rootSvg = d3.select(`#${plotId} svg`);
    rootSvg.style('display', 'block').style('margin', '0 auto');
    rootSvg.insert('rect', ':first-child')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', size)
      .attr('height', size)
      .attr('rx', 10)
      .attr('fill', theme.panelFill);

    const xScale = d3.scaleLinear().range([0, fig.width]);
    const yScale = d3.scaleLinear().range([fig.height, 0]);

    const gridMinorY = fig.svg.append('g').attr('class', 'grid-minor');
    const gridMinorX = fig.svg.append('g').attr('class', 'grid-minor')
      .attr('transform', `translate(0, ${fig.height})`);
    const gridMajorY = fig.svg.append('g').attr('class', 'grid-major');
    const gridMajorX = fig.svg.append('g').attr('class', 'grid-major')
      .attr('transform', `translate(0, ${fig.height})`);

    const pointGroup = fig.svg.append('g').attr('class', 'points');

    if (!state.points) {
      state.points = buildPoints();
    }
    const points = state.points;

    pointGroup.selectAll('circle')
      .data(points, d => d.id)
      .enter()
      .append('circle')
      .attr('r', 6.5)
      .attr('fill', theme.pointFill)
      .attr('stroke', theme.pointStroke)
      .attr('stroke-width', 1.2);

    const domains = {
      0: [-2.2, 2.2],
      1: [-7.5, 7.5],
      2: [-220, 220]
    };
    const minorTicks = 24;
    const majorTicks = 6;

    function styleGrid() {
      const applyStyle = (group, color, opacity, widthPx) => {
        group.selectAll('line')
          .attr('stroke', color)
          .attr('stroke-width', widthPx)
          .attr('opacity', opacity)
          .attr('shape-rendering', 'crispEdges');
        group.selectAll('path').attr('stroke', 'none');
        group.selectAll('text').remove();
      };

      applyStyle(gridMinorY, theme.gridMinor, 0.28, 1);
      applyStyle(gridMinorX, theme.gridMinor, 0.28, 1);
      applyStyle(gridMajorY, theme.gridMajor, 0.55, 1.3);
      applyStyle(gridMajorX, theme.gridMajor, 0.55, 1.3);
    }

    function update(level, animate) {
      state.level = level;
      xScale.domain(domains[level]);
      yScale.domain(domains[level]);

      const minorAxisY = d3.axisLeft(yScale).ticks(minorTicks).tickSize(-fig.width).tickFormat('');
      const minorAxisX = d3.axisBottom(xScale).ticks(minorTicks).tickSize(-fig.height).tickFormat('');
      const majorAxisY = d3.axisLeft(yScale).ticks(majorTicks).tickSize(-fig.width).tickFormat('');
      const majorAxisX = d3.axisBottom(xScale).ticks(majorTicks).tickSize(-fig.height).tickFormat('');

      if (animate) {
        const t = fig.svg.transition().duration(900).ease(d3.easeCubicInOut);
        gridMinorY.transition(t).call(minorAxisY);
        gridMinorX.transition(t).call(minorAxisX);
        gridMajorY.transition(t).call(majorAxisY);
        gridMajorX.transition(t).call(majorAxisX);
        pointGroup.selectAll('circle')
          .transition(t)
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('opacity', d => (d.level <= level ? 0.9 : 0));
      } else {
        gridMinorY.call(minorAxisY);
        gridMinorX.call(minorAxisX);
        gridMajorY.call(majorAxisY);
        gridMajorX.call(majorAxisX);
        pointGroup.selectAll('circle')
          .attr('cx', d => xScale(d.x))
          .attr('cy', d => yScale(d.y))
          .attr('opacity', d => (d.level <= level ? 0.9 : 0));
      }

      styleGrid();
    }

    function syncButtons() {
      const zoom1 = document.getElementById(zoomStage1Id);
      const zoom2 = document.getElementById(zoomStage2Id);
      if (!zoom1 || !zoom2) return;
      zoom1.disabled = state.level >= 1;
      zoom2.disabled = state.level >= 2;
      zoom1.style.opacity = zoom1.disabled ? '0.5' : '1';
      zoom2.style.opacity = zoom2.disabled ? '0.5' : '1';
      zoom1.style.cursor = zoom1.disabled ? 'not-allowed' : 'pointer';
      zoom2.style.cursor = zoom2.disabled ? 'not-allowed' : 'pointer';
    }

    state.setLevel = update;
    state.syncButtons = syncButtons;

    if (!state.bound) {
      const zoom1 = document.getElementById(zoomStage1Id);
      const zoom2 = document.getElementById(zoomStage2Id);
      if (zoom1) {
        zoom1.addEventListener('click', () => {
          if (state.level < 1 && state.setLevel) {
            state.setLevel(1, true);
            state.syncButtons();
          }
        });
      }
      if (zoom2) {
        zoom2.addEventListener('click', () => {
          if (state.level < 2 && state.setLevel) {
            state.setLevel(2, true);
            state.syncButtons();
          }
        });
      }
      state.bound = true;
    }

    update(state.level, false);
    syncButtons();
  }

  init();

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector(`#${plotId}`)) {
        init();
      }
    });
    Reveal.on('ready', event => {
      if (event.currentSlide.querySelector(`#${plotId}`)) {
        init();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (document.getElementById(plotId)) {
      init();
    }
  });
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="cluster-definition" -->
## Cluster as Relative Structure

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**What the zoom taught us**

-! A cluster is not absolute; it depends on what surrounds it

-: Points with similar properties are close in feature space

-: We only perceive a cluster when there are other points farther away

*** 

-! A practical rule: we need at least a few points to call it a cluster
-: Three points is a reasonable minimum in practice, but more is better

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Working definition**

-! A cluster is a local density anomaly in the feature space

-: Within-group distances are small

-: Between-group distances are large

*** 

-= Same logic as ANOVA: differences between groups >> differences within groups

<!-- /position -->
<!-- /layout -->

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

-< From pure values, it's hard to see patterns or groupings among samples

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

$$d = \left( \sum_{i=1}^{n} |a_i - b_i|^p \right)^{\frac{1}{p}}$$

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

<!-- .slide:id="manhattan-map" -->
## Manhattan City Blocks

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
<div id="manhattan-city-map" style="width: 100%; height: 650px; border-radius: 12px; overflow: hidden;"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

<script>
(function() {
  const containerId = 'manhattan-city-map';
  const stateKey = '__manhattanMapState__';
  const state = window[stateKey] || { map: null, ready: false };
  window[stateKey] = state;

  function init() {
    if (typeof L === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    if (state.map) {
      state.map.invalidateSize();
      return;
    }

    state.map = L.map(containerId, {
      center: [40.7831, -73.9712],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(state.map);

    const bounds = L.latLngBounds(
      [40.695, -74.045],
      [40.88, -73.89]
    );
    state.map.setMaxBounds(bounds.pad(0.15));
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
    if (state.map) {
      state.map.invalidateSize();
    }
  });
})();
</script>

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

<!-- .slide:id="chebyshev-chessboard" -->
## Chebyshev Distance on a Chessboard

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

<div id="chebyshev-chessboard-figure" style="width: 100%; height: auto;"></div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

*Visualizing Chebyshev Distance*
-! Minimum number of moves a king needs to travel between squares on a chessboard
-: King can move in any direction (horizontally, vertically, diagonally)
-: Distance equals the maximum of horizontal and vertical displacements
-: Respresents worst-case scenario among all dimensions

***

$$\lim_{p \to \infty} \left( \sum_{i=1}^{n} |a_i - b_i|^p \right)^{\frac{1}{p}} = \max_{i} |a_i - b_i|$$

<!-- /position -->
<!-- /layout -->

<script>
(function() {
  const containerId = 'chebyshev-chessboard-figure';

  function render() {
    if (typeof d3 === 'undefined') {
      setTimeout(render, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const size = Math.min(container.clientWidth || 460, container.clientHeight || 460);
    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${size} ${size}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', 'auto');

    const isPerformanceMode = document.body.classList.contains('performance-mode');
    const palettes = isPerformanceMode ? [
      { light: '#f5d48c', dark: '#e4b860' },
      { light: '#b7d7f0', dark: '#8fbbe4' },
      { light: '#b9e3d1', dark: '#8fd0b8' },
      { light: '#d2c6f0', dark: '#b7a4e2' },
      { light: '#f3c0d7', dark: '#e79aba' }
    ] : [
      { light: '#f59e0b', dark: '#d97706' },
      { light: '#60a5fa', dark: '#3b82f6' },
      { light: '#34d399', dark: '#10b981' },
      { light: '#a78bfa', dark: '#8b5cf6' },
      { light: '#f472b6', dark: '#ec4899' }
    ];

    const boardSize = 8;
    const cell = size / boardSize;
    const center = Math.floor(boardSize / 2);

    const cells = [];
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const dist = Math.max(Math.abs(row - center), Math.abs(col - center));
        cells.push({ row, col, dist, parity: (row + col) % 2 });
      }
    }

    const group = svg.append('g');
    group.selectAll('rect')
      .data(cells)
      .enter()
      .append('rect')
      .attr('x', d => d.col * cell)
      .attr('y', d => d.row * cell)
      .attr('width', cell)
      .attr('height', cell)
      .attr('fill', d => {
        const palette = palettes[Math.min(d.dist, palettes.length - 1)];
        return d.parity === 0 ? palette.light : palette.dark;
      })
      .attr('stroke', isPerformanceMode ? '#1f2937' : '#0b1220')
      .attr('stroke-width', 2);

    group.selectAll('text')
      .data(cells)
      .enter()
      .append('text')
      .attr('x', d => d.col * cell + cell / 2)
      .attr('y', d => d.row * cell + cell / 2 + 6)
      .attr('text-anchor', 'middle')
      .attr('font-size', Math.max(12, cell * 0.32))
      .attr('font-weight', '700')
      .attr('fill', isPerformanceMode ? '#111827' : '#0b1220')
      .text(d => d.dist);
  }

  render();

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        render();
      }
    });
    Reveal.on('ready', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        render();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (document.getElementById(containerId)) {
      render();
    }
  });
})();
</script>

---

<!-- .slide:id="distance-choice-effect" -->
## Effect of Distance Choice

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Same Data, Different Distances**

-! 5 samples with normalized analyte concentrations 
-: Fe, Cu, Pb, NO3, TOC, Pesticides, PFAS
-: Normalization considers regulatory limits and typical ranges

***

<div style="font-size: 0.6em;">

| Analyte | A | B | C | D | E |
|:--------|:---|:---|:---|:---|:---|
| Fe | 0.60 | 0.55 | 0.60 | 0.90 | 0.88 |
| Cu | 0.70 | 0.65 | 0.70 | 0.85 | 0.82 |
| Pb | 0.80 | 0.70 | *3.00* | 0.95 | 0.90 |
| NO3 | 0.50 | 0.60 | 0.55 | 0.80 | 0.78 |
| TOC | 0.60 | 0.65 | 0.60 | 0.90 | 0.86 |
| Pesticides | 0.40 | 0.50 | 0.45 | 0.70 | *2.30* |
| PFAS | 0.50 | 0.55 | 0.50 | 0.80 | 0.82 |

</div>

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

  const isPerformanceMode = document.body.classList.contains('performance-mode');
  const theme = isPerformanceMode ? {
    grid: '#5f5f5f',
    text: '#111111',
    title: '#1f2937',
    groupA: '#c0392b',
    groupB: '#1f618d',
    highlight: '#e67e22'
  } : {
    grid: '#334155',
    text: '#e2e8f0',
    title: '#f472b6',
    groupA: '#ff6b6b',
    groupB: '#4dd2ff',
    highlight: '#f59e0b'
  };

  const analytes = ['Fe', 'Cu', 'Pb', 'NO3', 'TOC', 'Pesticides', 'PFAS'];
  const samples = [
    { id: 'A', group: 1, values: { Fe: 0.6, Cu: 0.7, Pb: 0.8, NO3: 0.5, TOC: 0.6, Pesticides: 0.4, PFAS: 0.5 } },
    { id: 'B', group: 1, values: { Fe: 0.55, Cu: 0.65, Pb: 0.7, NO3: 0.6, TOC: 0.65, Pesticides: 0.5, PFAS: 0.55 } },
    { id: 'C', group: 1, values: { Fe: 0.6, Cu: 0.7, Pb: 3.0, NO3: 0.55, TOC: 0.6, Pesticides: 0.45, PFAS: 0.5 }, exceed: true },
    { id: 'D', group: 2, values: { Fe: 0.9, Cu: 0.85, Pb: 0.95, NO3: 0.8, TOC: 0.9, Pesticides: 0.7, PFAS: 0.8 } },
    { id: 'E', group: 2, values: { Fe: 0.88, Cu: 0.82, Pb: 0.9, NO3: 0.78, TOC: 0.86, Pesticides: 2.3, PFAS: 0.82 }, exceed: true }
  ];

  function distance(a, b, metric) {
    let total = 0;
    let max = 0;
    for (const key of analytes) {
      const diff = Math.abs(a.values[key] - b.values[key]);
      if (metric === 'manhattan') {
        total += diff;
      } else if (metric === 'euclidean') {
        total += diff * diff;
      } else {
        if (diff > max) max = diff;
      }
    }
    if (metric === 'euclidean') return Math.sqrt(total);
    if (metric === 'chebyshev') return max;
    return total;
  }

  function computeDistanceMatrix(metric) {
    const n = samples.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = distance(samples[i], samples[j], metric);
        matrix[i][j] = d;
        matrix[j][i] = d;
      }
    }
    return matrix;
  }

  function multiplyMatrixVector(B, v) {
    const n = B.length;
    const result = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += B[i][j] * v[j];
      }
      result[i] = sum;
    }
    return result;
  }

  function normalize(v) {
    const norm = Math.sqrt(v.reduce((acc, val) => acc + val * val, 0));
    if (norm === 0) return v;
    return v.map(val => val / norm);
  }

  function powerIteration(B, seed, iterations = 80) {
    let v = normalize(seed.slice());
    for (let i = 0; i < iterations; i++) {
      const w = multiplyMatrixVector(B, v);
      v = normalize(w);
    }
    const Bv = multiplyMatrixVector(B, v);
    const lambda = v.reduce((acc, val, idx) => acc + val * Bv[idx], 0);
    return { vector: v, value: lambda };
  }

  function classicalMDS(distanceMatrix) {
    const n = distanceMatrix.length;
    const d2 = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) => distanceMatrix[i][j] * distanceMatrix[i][j])
    );
    const rowMeans = d2.map(row => row.reduce((a, b) => a + b, 0) / n);
    const colMeans = Array.from({ length: n }, (_, j) =>
      d2.reduce((acc, row) => acc + row[j], 0) / n
    );
    const totalMean = rowMeans.reduce((a, b) => a + b, 0) / n;

    const B = Array.from({ length: n }, (_, i) =>
      Array.from({ length: n }, (_, j) =>
        -0.5 * (d2[i][j] - rowMeans[i] - colMeans[j] + totalMean)
      )
    );

    const seed1 = [0.3, 0.7, -0.2, 0.5, -0.6];
    const eig1 = powerIteration(B, seed1);
    const deflated = B.map((row, i) =>
      row.map((val, j) => val - eig1.value * eig1.vector[i] * eig1.vector[j])
    );
    const seed2 = [0.6, -0.1, 0.4, -0.7, 0.2];
    const eig2 = powerIteration(deflated, seed2);

    const lambda1 = Math.max(eig1.value, 0);
    const lambda2 = Math.max(eig2.value, 0);
    return samples.map((sample, i) => ({
      id: sample.id,
      group: sample.group,
      exceed: sample.exceed,
      x: eig1.vector[i] * Math.sqrt(lambda1),
      y: eig2.vector[i] * Math.sqrt(lambda2)
    }));
  }

  const titles = ['Manhattan', 'Euclidean', 'Chebyshev'];
  const keys = ['manhattan', 'euclidean', 'chebyshev'];

  keys.forEach((key, i) => {
    const coords = classicalMDS(computeDistanceMatrix(key));
    const offsetX = marginLeft + i * (panelW + gap);
    const g = svg.append('g').attr('transform', `translate(${offsetX},${marginTop})`);

    g.append('rect').attr('width', panelW).attr('height', panelH)
      .attr('fill', 'none').attr('stroke', 'none');

    g.append('text').attr('x', panelW / 2).attr('y', -12)
      .text(titles[i]).attr('fill', theme.title).style('font-size', '13px').attr('text-anchor', 'middle');

    const xExtent = d3.extent(coords, d => d.x);
    const yExtent = d3.extent(coords, d => d.y);
    const padX = (xExtent[1] - xExtent[0]) * 0.2 || 1;
    const padY = (yExtent[1] - yExtent[0]) * 0.2 || 1;
    const xScale = d3.scaleLinear().domain([xExtent[0] - padX, xExtent[1] + padX]).range([15, panelW - 15]);
    const yScale = d3.scaleLinear().domain([yExtent[0] - padY, yExtent[1] + padY]).range([panelH - 15, 15]);

    for (let t = 0; t < 4; t++) {
      const gx = 15 + (panelW - 30) * (t / 3);
      const gy = 15 + (panelH - 30) * (t / 3);
      g.append('line').attr('x1', gx).attr('x2', gx).attr('y1', 15).attr('y2', panelH - 15)
        .attr('stroke', theme.grid).attr('stroke-width', 0.5).attr('opacity', 0.5);
      g.append('line').attr('x1', 15).attr('x2', panelW - 15).attr('y1', gy).attr('y2', gy)
        .attr('stroke', theme.grid).attr('stroke-width', 0.5).attr('opacity', 0.5);
    }

    coords.forEach(point => {
      const fill = point.group === 1 ? theme.groupA : theme.groupB;
      g.append('circle')
        .attr('cx', xScale(point.x)).attr('cy', yScale(point.y))
        .attr('r', 11).attr('fill', fill).attr('opacity', 0.9);
      if (point.exceed) {
        g.append('circle')
          .attr('cx', xScale(point.x)).attr('cy', yScale(point.y))
          .attr('r', 14).attr('fill', 'none').attr('stroke', theme.highlight).attr('stroke-width', 2.5);
      }
      g.append('text')
        .attr('x', xScale(point.x)).attr('y', yScale(point.y) + 4)
        .text(point.id).attr('fill', theme.text).style('font-size', '10px').attr('text-anchor', 'middle');
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

-! Use three vectors **a**, **b**, **c**
-: Base R `dist()` computes Manhattan, Euclidean, and Minkowski p
-: Chebyshev uses `method = "maximum"`

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="minkowski-distance-webr-container"></div>

<script>
(function() {
  const containerId = 'minkowski-distance-webr-container';
  const code = `# Vectors
a <- c(2, 3, 1)
b <- c(5, 1, 4)
c <- c(3, 4, 2)

data <- rbind(a = a, b = b, c = c)

cat("Data:\
")
print(data)
cat("
")

cat("Manhattan (p=1):\
")
print(as.matrix(dist(data, method = "minkowski", p = 1)))
cat("
")

cat("Euclidean (p=2):\
")
print(as.matrix(dist(data, method = "euclidean")))
cat("
")

cat("Minkowski (p=3):\
")
print(as.matrix(dist(data, method = "minkowski", p = 3)))
cat("
")

cat("Chebyshev (max):\
")
print(as.matrix(dist(data, method = "maximum")))`;
  const fallback = () => {
    return `[Simulated in JavaScript]
Data:
  [,1] [,2] [,3]
a    2    3    1
b    5    1    4
c    3    4    2

Manhattan (p=1):
  a b c
a 0 8 3
b 8 0 5
c 3 5 0

Euclidean (p=2):
      a     b     c
a 0.000 4.690 1.732
b 4.690 0.000 3.742
c 1.732 3.742 0.000

Minkowski (p=3):
      a     b     c
a 0.000 4.160 1.442
b 4.160 0.000 3.266
c 1.442 3.266 0.000

Chebyshev (max):
  a b c
a 0 3 1
b 3 0 2
c 1 2 0`;
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'minkowski-distance-webr',
      fallback,
      runLabel: 'Run Minkowski Distance (WebR)',
      minHeight: '30px'
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

<!-- .slide:id="hca-cover" -->
## Hierarchical Clustering Analysis (HCA)
<div id="hca-cover-dendrogram" style="width: 100%; height: 1300px;"></div>

<script>
(function() {
  const containerId = 'hca-cover-dendrogram';

  function seededRandom(seed) {
    let state = seed >>> 0;
    return function() {
      state = (1664525 * state + 1013904223) >>> 0;
      return state / 4294967296;
    };
  }

  function gaussian(rng) {
    const u1 = Math.max(rng(), 1e-9);
    const u2 = rng();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  function buildPoints() {
    const rng = seededRandom(42);
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
          x: center.x + gaussian(rng) * spread,
          y: center.y + gaussian(rng) * spread
        });
      }
    });

    return points;
  }

  function euclidean(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function buildDistanceMatrix(points) {
    const n = points.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = euclidean(points[i], points[j]);
        matrix[i][j] = d;
        matrix[j][i] = d;
      }
    }
    return matrix;
  }

  function averageDistance(a, b, distMatrix) {
    let sum = 0;
    for (let i = 0; i < a.points.length; i++) {
      const ai = a.points[i];
      for (let j = 0; j < b.points.length; j++) {
        const bj = b.points[j];
        sum += distMatrix[ai][bj];
      }
    }
    return sum / (a.points.length * b.points.length);
  }

  function agglomerative(points) {
    const distMatrix = buildDistanceMatrix(points);
    let clusters = points.map((_, idx) => ({
      points: [idx],
      node: { name: `P${idx}`, distance: 0 }
    }));

    while (clusters.length > 1) {
      let bestI = 0;
      let bestJ = 1;
      let bestDist = Infinity;

      for (let i = 0; i < clusters.length; i++) {
        for (let j = i + 1; j < clusters.length; j++) {
          const d = averageDistance(clusters[i], clusters[j], distMatrix);
          if (d < bestDist) {
            bestDist = d;
            bestI = i;
            bestJ = j;
          }
        }
      }

      const left = clusters[bestI];
      const right = clusters[bestJ];
      const merged = {
        points: left.points.concat(right.points),
        node: {
          distance: bestDist,
          children: [left.node, right.node]
        }
      };

      clusters = clusters.filter((_, idx) => idx !== bestI && idx !== bestJ);
      clusters.push(merged);
    }

    return clusters[0].node;
  }

  function render() {
    if (typeof d3 === 'undefined') {
      setTimeout(render, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 720;
    const margin = 24;

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '70%')
      .style('height', '70%')
      .style('display', 'block')
      .style('margin', '0 auto');

    const isPerformanceMode = document.body.classList.contains('performance-mode');
    const theme = isPerformanceMode ? {
      stroke: '#1f2937',
      strokeLight: '#4b5563'
    } : {
      stroke: '#9ecbff',
      strokeLight: '#4c6f94'
    };

    const points = buildPoints();
    const tree = agglomerative(points);
    const root = d3.hierarchy(tree, d => d.children);
    const clusterLayout = d3.cluster().size([height - margin * 2, width - margin * 2]);
    clusterLayout(root);

    const maxDist = root.data.distance || 1;
    root.each(node => {
      node.y = (node.data.distance / maxDist) * (width - margin * 2) + margin;
      node.x = node.x + margin;
    });

    const palette = isPerformanceMode
      ? ['#c0392b', '#1f618d', '#1e8449']
      : ['#ff6b6b', '#4dd2ff', '#00ff88'];

    function collectDistances(node, list) {
      list.push(node.data.distance || 0);
      if (node.children) {
        node.children.forEach(child => collectDistances(child, list));
      }
    }

    function countClusters(cut) {
      let count = 0;
      root.each(node => {
        const parentDist = node.parent ? node.parent.data.distance : Infinity;
        if ((node.data.distance || 0) <= cut && parentDist > cut) {
          count += 1;
        }
      });
      return count;
    }

    const distances = [];
    collectDistances(root, distances);
    const unique = Array.from(new Set(distances)).sort((a, b) => a - b);
    let cut = unique[Math.floor(unique.length * 0.7)] || maxDist * 0.7;
    let best = { cut, diff: Infinity };
    unique.forEach(value => {
      const clusters = countClusters(value);
      const diff = Math.abs(clusters - 3);
      if (diff < best.diff) {
        best = { cut: value, diff };
      }
    });
    cut = best.cut;

    let clusterIndex = 0;
    root.each(node => {
      const parentDist = node.parent ? node.parent.data.distance : Infinity;
      if ((node.data.distance || 0) <= cut && parentDist > cut) {
        node.clusterId = clusterIndex % palette.length;
        clusterIndex += 1;
      }
    });

    function clusterForNode(node) {
      let current = node;
      while (current && current.clusterId === undefined) {
        current = current.parent;
      }
      return current ? current.clusterId : null;
    }

    svg.append('g')
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr('d', d => `M${d.source.y},${d.source.x}V${d.target.x}H${d.target.y}`)
      .attr('fill', 'none')
      .attr('stroke', d => {
        const id = clusterForNode(d.target);
        return id === null ? theme.stroke : palette[id];
      })
      .attr('stroke-width', 2.4)
      .attr('opacity', 0.9);

    svg.append('rect')
      .attr('x', margin)
      .attr('y', margin)
      .attr('width', width - margin * 2)
      .attr('height', height - margin * 2)
      .attr('fill', 'none')
      .attr('stroke', theme.strokeLight)
      .attr('stroke-width', 1)
      .attr('opacity', 0.35);
  }

  render();

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        render();
      }
    });
    Reveal.on('ready', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        render();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (document.getElementById(containerId)) {
      render();
    }
  });
})();
</script>

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

***

-< Remember: in R, use `dist()` to compute distance matrices!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Example: 5 Water Samples**

<div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin: 8px 0 10px;">
  <span style="font-size: 0.8em;">Combine C+D</span>
  <label style="position: relative; display: inline-block; width: 44px; height: 24px;">
    <input id="distance-matrix-toggle" type="checkbox" style="opacity: 0; width: 0; height: 0;">
    <span style="position: absolute; cursor: pointer; inset: 0; background: #1f2937; border-radius: 12px; transition: background 0.2s;"></span>
    <span id="distance-matrix-toggle-knob" style="position: absolute; height: 18px; width: 18px; left: 3px; top: 3px; background: #9efcff; border-radius: 50%; transition: transform 0.2s;"></span>
  </label>
</div>

<div style="font-size: 0.8em;">
  <table id="distance-matrix-table" style="width: 100%; border-collapse: collapse; text-align: center;">
    <thead></thead>
    <tbody></tbody>
  </table>
</div>

<script>
(function() {
  const tableId = 'distance-matrix-table';
  const toggleId = 'distance-matrix-toggle';
  const knobId = 'distance-matrix-toggle-knob';

  const baseMatrix = {
    headers: ['A', 'B', 'C', 'D', 'E'],
    rows: [
      ['A', '0', '2', '8', '7', '3'],
      ['B', '2', '0', '9', '8', '2'],
      ['C', '8', '9', '0', '1', '7'],
      ['D', '7', '8', '1', '0', '6'],
      ['E', '3', '2', '7', '6', '0']
    ]
  };

  const combinedMatrix = {
    headers: ['A', 'B', 'E', 'CD'],
    rows: [
      ['A', '0', '2', '3', '?'],
      ['B', '2', '0', '2', '?'],
      ['E', '3', '2', '0', '?'],
      ['CD', '?', '?', '?', '0']
    ]
  };

  function render(matrix) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const headerRow = document.createElement('tr');
    const corner = document.createElement('th');
    corner.textContent = '';
    corner.style.border = '1px solid #334';
    corner.style.padding = '4px 6px';
    headerRow.appendChild(corner);
    matrix.headers.forEach(label => {
      const th = document.createElement('th');
      th.textContent = label;
      th.style.border = '1px solid #334';
      th.style.padding = '4px 6px';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    matrix.rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach((value, idx) => {
        const cell = document.createElement(idx === 0 ? 'th' : 'td');
        cell.textContent = value;
        cell.style.border = '1px solid #334';
        cell.style.padding = '4px 6px';
        if (value === '1') {
          cell.style.fontWeight = '700';
          cell.style.color = '#9efcff';
        }
        tr.appendChild(cell);
      });
      tbody.appendChild(tr);
    });
  }

  function bind() {
    const toggle = document.getElementById(toggleId);
    const knob = document.getElementById(knobId);
    if (!toggle) return;
    const update = () => {
      if (toggle.checked) {
        render(combinedMatrix);
        if (knob) knob.style.transform = 'translateX(20px)';
        toggle.nextElementSibling.style.background = '#0f766e';
      } else {
        render(baseMatrix);
        if (knob) knob.style.transform = 'translateX(0px)';
        toggle.nextElementSibling.style.background = '#1f2937';
      }
    };
    toggle.addEventListener('change', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
</script>

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
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div style="display: flex; align-items: center; gap: 12px; font-size: 0.85em;">
    <span style="min-width: 90px;">Linkage:</span>
    <input id="linkage-method-slider" type="range" min="0" max="2" step="1" value="0" style="flex: 1;">
    <span id="linkage-method-label" style="min-width: 110px; font-weight: 700;">Single</span>
  </div>

  <div style="font-size: 0.8em;">
    <table id="linkage-comparison-table" style="width: 100%; border-collapse: collapse; text-align: center;">
      <thead></thead>
      <tbody></tbody>
    </table>
  </div>
</div>

<script>
(function() {
  const sliderId = 'linkage-method-slider';
  const labelId = 'linkage-method-label';
  const tableId = 'linkage-comparison-table';
  const methods = ['Single', 'Complete', 'Average'];

  const distances = {
    A: { B: 2, C: 8, D: 7, E: 3 },
    B: { A: 2, C: 9, D: 8, E: 2 },
    C: { A: 8, B: 9, D: 1, E: 7 },
    D: { A: 7, B: 8, C: 1, E: 6 },
    E: { A: 3, B: 2, C: 7, D: 6 }
  };

  const baseRows = [
    { label: 'C', values: ['8', '9', '0', '1', '7'] },
    { label: 'D', values: ['7', '8', '1', '0', '6'] }
  ];

  const headers = ['A', 'B', 'C', 'D', 'E'];

  function linkageValue(methodIndex, key) {
    const cVal = distances.C[key];
    const dVal = distances.D[key];
    if (methodIndex === 0) return Math.min(cVal, dVal);
    if (methodIndex === 1) return Math.max(cVal, dVal);
    return (cVal + dVal) / 2;
  }

  function render(methodIndex) {
    const table = document.getElementById(tableId);
    const label = document.getElementById(labelId);
    if (!table || !label) return;
    label.textContent = methods[methodIndex];

    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    thead.innerHTML = '';
    tbody.innerHTML = '';

    const headerRow = document.createElement('tr');
    const corner = document.createElement('th');
    corner.textContent = '';
    corner.style.border = '1px solid #334';
    corner.style.padding = '4px 6px';
    headerRow.appendChild(corner);
    headers.forEach(labelText => {
      const th = document.createElement('th');
      th.textContent = labelText;
      th.style.border = '1px solid #334';
      th.style.padding = '4px 6px';
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    baseRows.forEach(row => {
      const tr = document.createElement('tr');
      const th = document.createElement('th');
      th.textContent = row.label;
      th.style.border = '1px solid #334';
      th.style.padding = '4px 6px';
      tr.appendChild(th);
      row.values.forEach(value => {
        const td = document.createElement('td');
        td.textContent = value;
        td.style.border = '1px solid #334';
        td.style.padding = '4px 6px';
        if (value === '1') {
          td.style.fontWeight = '700';
          td.style.color = '#9efcff';
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    const cdRow = document.createElement('tr');
    const cdLabel = document.createElement('th');
    cdLabel.textContent = 'CD';
    cdLabel.style.border = '1px solid #334';
    cdLabel.style.padding = '4px 6px';
    cdRow.appendChild(cdLabel);

    headers.forEach(key => {
      const td = document.createElement('td');
      td.style.border = '1px solid #334';
      td.style.padding = '4px 6px';
      if (key === 'C' || key === 'D') {
        td.textContent = '—';
        td.style.opacity = '0.6';
      } else {
        const value = linkageValue(methodIndex, key);
        td.textContent = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1);
        td.style.fontWeight = '700';
        td.style.background = 'rgba(148, 163, 184, 0.15)';
      }
      cdRow.appendChild(td);
    });
    tbody.appendChild(cdRow);
  }

  function bind() {
    const slider = document.getElementById(sliderId);
    if (!slider) return;
    const update = () => render(parseInt(slider.value, 10));
    slider.addEventListener('input', update);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
</script>

***

**Average Linkage**

-! A *compromise* between single and complete

-: Balances sensitivity and robustness

-: Often a reasonable default choice

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="distance-matrix-steps" -->
## Reducing the Distance Matrix

<div style="display: flex; flex-direction: column; gap: 12px;">
  <div style="display: flex; align-items: center; gap: 12px;">
    <button id="distance-step-prev" style="padding: 6px 12px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em;">Prev</button>
    <button id="distance-step-next" style="padding: 6px 12px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em;">Next</button>
    <span id="distance-step-label" style="min-width: 180px; font-weight: 700; text-align: center;">Step 1 of 5</span>
  </div>
  <div id="distance-matrix-container" style="width: 100%; height: 920px; position: relative;"></div>
</div>

<script>
(function() {
  const containerId = 'distance-matrix-container';
  const labelId = 'distance-step-label';
  const prevId = 'distance-step-prev';
  const nextId = 'distance-step-next';
  const stateKey = '__distanceMatrixAnimState__';
  
  // Full clustering sequence with merge info
  const clusteringSteps = [
    {
      labels: ['A', 'B', 'C', 'D', 'E'],
      matrix: [
        [0, 2, 8, 7, 3],
        [2, 0, 9, 8, 2],
        [8, 9, 0, 1, 7],
        [7, 8, 1, 0, 6],
        [3, 2, 7, 6, 0]
      ],
      merge: { i: 2, j: 3, newLabel: 'CD', distance: 1 }
    },
    {
      labels: ['A', 'B', 'E', 'CD'],
      matrix: [
        [0, 2, 3, 7.5],
        [2, 0, 2, 8.5],
        [3, 2, 0, 6.5],
        [7.5, 8.5, 6.5, 0]
      ],
      merge: { i: 0, j: 1, newLabel: 'AB', distance: 2 }
    },
    {
      labels: ['E', 'CD', 'AB'],
      matrix: [
        [0, 6.5, 2.5],
        [6.5, 0, 8.0],
        [2.5, 8.0, 0]
      ],
      merge: { i: 0, j: 2, newLabel: 'ABE', distance: 2.5 }
    },
    {
      labels: ['CD', 'ABE'],
      matrix: [
        [0, 7.0],
        [7.0, 0]
      ],
      merge: { i: 0, j: 1, newLabel: 'ABCDE', distance: 7.0 }
    },
    {
      labels: ['ABCDE'],
      matrix: [[0]],
      merge: null
    }
  ];

  const CELL_SIZE = 100;
  const HEADER_SIZE = 100;
  const FADE_DURATION = 600;
  const MOVE_DURATION = 800;
  const PAUSE_DURATION = 900;
  const COLORS = {
    bg: '#0f172a',
    cellBg: '#1e293b',
    cellBorder: '#334155',
    headerBg: '#0f172a',
    text: '#e2e8f0',
    headerText: '#9efcff',
    highlight: '#ef4444',
    highlightBg: 'rgba(239, 68, 68, 0.2)',
    newCluster: '#22c55e',
    newClusterBg: 'rgba(34, 197, 94, 0.2)',
    minValue: '#fbbf24'
  };

  let state = window[stateKey];
  if (!state) {
    state = { currentStep: 0, animating: false, svg: null, elements: new Map() };
    window[stateKey] = state;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function createSVG(container) {
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.display = 'block';
    svg.style.margin = '0 auto';
    
    container.innerHTML = '';
    container.appendChild(svg);
    return svg;
  }

  function findMinDistance(step) {
    const { matrix } = step;
    let min = Infinity;
    let minPos = null;
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix[i].length; j++) {
        if (matrix[i][j] < min && matrix[i][j] > 0) {
          min = matrix[i][j];
          minPos = { i, j, value: matrix[i][j] };
        }
      }
    }
    return minPos;
  }

  function getTableOrigin(n, svgWidth, svgHeight) {
    const tableWidth = HEADER_SIZE + n * CELL_SIZE;
    const tableHeight = HEADER_SIZE + n * CELL_SIZE;
    return {
      x: (svgWidth - tableWidth) / 2,
      y: (svgHeight - tableHeight) / 2 + 20
    };
  }

  function createRect(x, y, w, h, fill, stroke, strokeWidth) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', w);
    rect.setAttribute('height', h);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeWidth);
    return rect;
  }

  function createText(x, y, text, fill, fontSize, fontWeight) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    el.setAttribute('x', x);
    el.setAttribute('y', y);
    el.setAttribute('text-anchor', 'middle');
    el.setAttribute('dominant-baseline', 'middle');
    el.setAttribute('fill', fill);
    el.setAttribute('font-size', fontSize);
    el.setAttribute('font-weight', fontWeight);
    el.textContent = text;
    return el;
  }

  function createGroup(transform = '') {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (transform) g.setAttribute('transform', transform);
    return g;
  }

  function drawTable(svg, step, options = {}) {
    const { labels, matrix, merge } = step;
    const n = labels.length;
    const svgWidth = parseInt(svg.getAttribute('width'));
    const svgHeight = parseInt(svg.getAttribute('height'));
    const origin = getTableOrigin(n, svgWidth, svgHeight);
    const minPos = findMinDistance(step);
    
    const {
      highlightMerge = false,
      newClusterIndices = [],
      skipIndices = []
    } = options;

    svg.innerHTML = '';
    state.elements.clear();

    const mainGroup = createGroup();
    svg.appendChild(mainGroup);

    // Draw corner cell
    const corner = createRect(origin.x, origin.y, HEADER_SIZE, HEADER_SIZE, COLORS.headerBg, COLORS.cellBorder, 2);
    corner.setAttribute('class', 'corner-cell');
    mainGroup.appendChild(corner);

    // Track actual position for collapsed display
    let rowOffset = 0;
    let colOffset = 0;
    const rowPositions = [];
    const colPositions = [];
    
    for (let i = 0; i < n; i++) {
      if (skipIndices.includes(i)) {
        rowPositions.push(-1);
        colPositions.push(-1);
      } else {
        rowPositions.push(rowOffset);
        colPositions.push(colOffset);
        rowOffset++;
        colOffset++;
      }
    }

    for (let i = 0; i < n; i++) {
      if (skipIndices.includes(i)) continue;
      
      const visualRow = rowPositions[i];
      const visualCol = colPositions[i];
      
      // Row header group
      const rowHeaderGroup = createGroup(`translate(${origin.x}, ${origin.y + HEADER_SIZE + visualRow * CELL_SIZE})`);
      rowHeaderGroup.setAttribute('data-row', i);
      rowHeaderGroup.setAttribute('data-visual-row', visualRow);
      
      const isRowHighlight = highlightMerge && merge && (i === merge.i || i === merge.j);
      const isRowNew = newClusterIndices.includes(i);
      
      const rowHeaderRect = createRect(0, 0, HEADER_SIZE, CELL_SIZE, 
        isRowNew ? COLORS.newClusterBg : (isRowHighlight ? COLORS.highlightBg : COLORS.headerBg),
        isRowNew ? COLORS.newCluster : (isRowHighlight ? COLORS.highlight : COLORS.cellBorder),
        isRowNew || isRowHighlight ? 6 : 2);
      
      const rowHeaderText = createText(HEADER_SIZE / 2, CELL_SIZE / 2, labels[i],
        isRowNew ? COLORS.newCluster : COLORS.headerText, '28', '700');
      
      rowHeaderGroup.appendChild(rowHeaderRect);
      rowHeaderGroup.appendChild(rowHeaderText);
      mainGroup.appendChild(rowHeaderGroup);
      state.elements.set(`row-header-${i}`, rowHeaderGroup);

      // Column header group
      const colHeaderGroup = createGroup(`translate(${origin.x + HEADER_SIZE + visualCol * CELL_SIZE}, ${origin.y})`);
      colHeaderGroup.setAttribute('data-col', i);
      colHeaderGroup.setAttribute('data-visual-col', visualCol);
      
      const isColHighlight = highlightMerge && merge && (i === merge.i || i === merge.j);
      const isColNew = newClusterIndices.includes(i);
      
      const colHeaderRect = createRect(0, 0, CELL_SIZE, HEADER_SIZE,
        isColNew ? COLORS.newClusterBg : (isColHighlight ? COLORS.highlightBg : COLORS.headerBg),
        isColNew ? COLORS.newCluster : (isColHighlight ? COLORS.highlight : COLORS.cellBorder),
        isColNew || isColHighlight ? 6 : 2);
      
      const colHeaderText = createText(CELL_SIZE / 2, HEADER_SIZE / 2, labels[i],
        isColNew ? COLORS.newCluster : COLORS.headerText, '28', '700');
      
      colHeaderGroup.appendChild(colHeaderRect);
      colHeaderGroup.appendChild(colHeaderText);
      mainGroup.appendChild(colHeaderGroup);
      state.elements.set(`col-header-${i}`, colHeaderGroup);

      // Data cells for this row
      for (let j = 0; j < n; j++) {
        if (skipIndices.includes(j)) continue;
        
        const visualColJ = colPositions[j];
        
        const cellGroup = createGroup(`translate(${origin.x + HEADER_SIZE + visualColJ * CELL_SIZE}, ${origin.y + HEADER_SIZE + visualRow * CELL_SIZE})`);
        cellGroup.setAttribute('data-row', i);
        cellGroup.setAttribute('data-col', j);
        
        const isCellRowHighlight = highlightMerge && merge && (i === merge.i || i === merge.j);
        const isCellColHighlight = highlightMerge && merge && (j === merge.i || j === merge.j);
        const isCellHighlight = isCellRowHighlight || isCellColHighlight;
        const isCellNew = newClusterIndices.includes(i) || newClusterIndices.includes(j);
        const isMin = minPos && ((i === minPos.i && j === minPos.j) || (i === minPos.j && j === minPos.i));
        
        const cellRect = createRect(0, 0, CELL_SIZE, CELL_SIZE,
          isCellNew ? COLORS.newClusterBg : (isCellHighlight ? COLORS.highlightBg : COLORS.cellBg),
          isCellNew ? COLORS.newCluster : (isCellHighlight ? COLORS.highlight : COLORS.cellBorder),
          isCellNew || isCellHighlight ? 4 : 2);
        
        const value = i === j ? 0 : matrix[i][j];
        const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(1);
        const cellText = createText(CELL_SIZE / 2, CELL_SIZE / 2, displayValue,
          isMin ? COLORS.minValue : (isCellNew ? COLORS.newCluster : COLORS.text),
          '26', isMin ? '700' : '400');
        
        cellGroup.appendChild(cellRect);
        cellGroup.appendChild(cellText);
        mainGroup.appendChild(cellGroup);
        state.elements.set(`cell-${i}-${j}`, cellGroup);
      }
    }

    // Add highlight borders for merge rows/cols
    if (highlightMerge && merge && !skipIndices.includes(merge.i)) {
      const highlightOverlay = createGroup();
      highlightOverlay.setAttribute('class', 'highlight-overlay');
      
      [merge.i, merge.j].forEach(idx => {
        if (skipIndices.includes(idx)) return;
        const vRow = rowPositions[idx];
        const vCol = colPositions[idx];
        const visibleCount = n - skipIndices.length;
        
        // Full row highlight
        const rowBorder = createRect(
          origin.x, origin.y + HEADER_SIZE + vRow * CELL_SIZE,
          HEADER_SIZE + visibleCount * CELL_SIZE, CELL_SIZE,
          'none', COLORS.highlight, 3);
        rowBorder.setAttribute('rx', '4');
        highlightOverlay.appendChild(rowBorder);
        
        // Full column highlight
        const colBorder = createRect(
          origin.x + HEADER_SIZE + vCol * CELL_SIZE, origin.y,
          CELL_SIZE, HEADER_SIZE + visibleCount * CELL_SIZE,
          'none', COLORS.highlight, 3);
        colBorder.setAttribute('rx', '4');
        highlightOverlay.appendChild(colBorder);
      });
      
      mainGroup.appendChild(highlightOverlay);
    }

    return { origin, n, mainGroup };
  }

  // Animate opacity of specific elements with fade in/out
  function animateOpacity(elements, fromOpacity, toOpacity, duration) {
    return new Promise(resolve => {
      if (elements.length === 0) {
        resolve();
        return;
      }
      
      elements.forEach(el => {
        el.style.opacity = fromOpacity;
        el.style.transition = `opacity ${duration}ms ease-in-out`;
      });
      
      // Force reflow
      if (elements[0]) elements[0].getBoundingClientRect();
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          elements.forEach(el => {
            el.style.opacity = toOpacity;
          });
        });
      });
      
      setTimeout(resolve, duration);
    });
  }

  // Smoothly animate elements using requestAnimationFrame
  function animateCollapse(elementMoves, duration) {
    return new Promise(resolve => {
      if (elementMoves.length === 0) {
        resolve();
        return;
      }
      
      const startTime = performance.now();
      
      // Store initial positions
      elementMoves.forEach(move => {
        const transform = move.element.getAttribute('transform') || '';
        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (match) {
          move.startX = parseFloat(match[1]);
          move.startY = parseFloat(match[2]);
        } else {
          move.startX = 0;
          move.startY = 0;
        }
      });
      
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      
      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        
        elementMoves.forEach(move => {
          const currentX = move.startX + (move.targetX - move.startX) * easedProgress;
          const currentY = move.startY + (move.targetY - move.startY) * easedProgress;
          move.element.setAttribute('transform', `translate(${currentX}, ${currentY})`);
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      }
      
      requestAnimationFrame(animate);
    });
  }

  async function animateForward(svg, fromStep, toStep) {
    const { merge } = fromStep;
    if (!merge) {
      drawTable(svg, toStep);
      return;
    }

    const fromN = fromStep.labels.length;
    const svgWidth = parseInt(svg.getAttribute('width'));
    const svgHeight = parseInt(svg.getAttribute('height'));

    // Phase 1: Draw base table without highlights
    drawTable(svg, fromStep, { highlightMerge: false });
    await sleep(300);

    // Phase 1b: Fade in highlights on merge rows/cols
    const highlightOverlay = createGroup();
    highlightOverlay.setAttribute('class', 'highlight-overlay');
    highlightOverlay.style.opacity = '0';
    
    const origin = getTableOrigin(fromN, svgWidth, svgHeight);
    
    [merge.i, merge.j].forEach(idx => {
      // Full row highlight
      const rowBorder = createRect(
        origin.x, origin.y + HEADER_SIZE + idx * CELL_SIZE,
        HEADER_SIZE + fromN * CELL_SIZE, CELL_SIZE,
        'none', COLORS.highlight, 3);
      rowBorder.setAttribute('rx', '4');
      highlightOverlay.appendChild(rowBorder);
      
      // Full column highlight
      const colBorder = createRect(
        origin.x + HEADER_SIZE + idx * CELL_SIZE, origin.y,
        CELL_SIZE, HEADER_SIZE + fromN * CELL_SIZE,
        'none', COLORS.highlight, 3);
      colBorder.setAttribute('rx', '4');
      highlightOverlay.appendChild(colBorder);
    });
    
    svg.querySelector('g').appendChild(highlightOverlay);
    
    // Fade in the highlight borders
    await animateOpacity([highlightOverlay], '0', '1', FADE_DURATION);
    
    // Also animate cell backgrounds to highlighted state
    state.elements.forEach((el, key) => {
      const row = parseInt(el.getAttribute('data-row'));
      const col = el.getAttribute('data-col') !== null ? parseInt(el.getAttribute('data-col')) : -1;
      if (row === merge.i || row === merge.j || col === merge.i || col === merge.j) {
        const rect = el.querySelector('rect');
        if (rect) {
          rect.style.transition = `fill ${FADE_DURATION}ms ease-in-out, stroke ${FADE_DURATION}ms ease-in-out`;
          rect.setAttribute('fill', COLORS.highlightBg);
          rect.setAttribute('stroke', COLORS.highlight);
        }
      }
    });
    
    await sleep(PAUSE_DURATION);

    // Phase 2: Add new cluster row/column WITHOUT redrawing everything
    // Keep the existing table in place, just add new elements at the edge
    const expandedLabels = [...fromStep.labels, merge.newLabel];
    const expandedN = expandedLabels.length;
    const expandedMatrix = [];
    
    for (let i = 0; i < expandedN; i++) {
      expandedMatrix[i] = [];
      for (let j = 0; j < expandedN; j++) {
        if (i < fromN && j < fromN) {
          expandedMatrix[i][j] = fromStep.matrix[i][j];
        } else if (i === expandedN - 1 && j === expandedN - 1) {
          expandedMatrix[i][j] = 0;
        } else if (i === expandedN - 1) {
          expandedMatrix[i][j] = (fromStep.matrix[merge.i][j] + fromStep.matrix[merge.j][j]) / 2;
        } else if (j === expandedN - 1) {
          expandedMatrix[i][j] = (fromStep.matrix[i][merge.i] + fromStep.matrix[i][merge.j]) / 2;
        }
      }
    }
    
    // Use the SAME origin as the current table (fromN size) - don't recenter yet
    const currentOrigin = origin; // Keep using the origin from Phase 1
    const mainGroup = svg.querySelector('g');
    const newClusterElements = [];
    const newClusterIdx = expandedN - 1;
    
    // Add new column header
    const colHeaderGroup = createGroup(`translate(${currentOrigin.x + HEADER_SIZE + newClusterIdx * CELL_SIZE}, ${currentOrigin.y})`);
    colHeaderGroup.setAttribute('data-col', newClusterIdx);
    colHeaderGroup.setAttribute('data-visual-col', newClusterIdx);
    colHeaderGroup.style.opacity = '0';
    
    const colHeaderRect = createRect(0, 0, CELL_SIZE, HEADER_SIZE,
      COLORS.newClusterBg, COLORS.newCluster, 6);
    const colHeaderText = createText(CELL_SIZE / 2, HEADER_SIZE / 2, merge.newLabel,
      COLORS.newCluster, '28', '700');
    
    colHeaderGroup.appendChild(colHeaderRect);
    colHeaderGroup.appendChild(colHeaderText);
    mainGroup.appendChild(colHeaderGroup);
    state.elements.set(`col-header-${newClusterIdx}`, colHeaderGroup);
    newClusterElements.push(colHeaderGroup);
    
    // Add new row header
    const rowHeaderGroup = createGroup(`translate(${currentOrigin.x}, ${currentOrigin.y + HEADER_SIZE + newClusterIdx * CELL_SIZE})`);
    rowHeaderGroup.setAttribute('data-row', newClusterIdx);
    rowHeaderGroup.setAttribute('data-visual-row', newClusterIdx);
    rowHeaderGroup.style.opacity = '0';
    
    const rowHeaderRect = createRect(0, 0, HEADER_SIZE, CELL_SIZE,
      COLORS.newClusterBg, COLORS.newCluster, 6);
    const rowHeaderText = createText(HEADER_SIZE / 2, CELL_SIZE / 2, merge.newLabel,
      COLORS.newCluster, '28', '700');
    
    rowHeaderGroup.appendChild(rowHeaderRect);
    rowHeaderGroup.appendChild(rowHeaderText);
    mainGroup.appendChild(rowHeaderGroup);
    state.elements.set(`row-header-${newClusterIdx}`, rowHeaderGroup);
    newClusterElements.push(rowHeaderGroup);
    
    // Add cells for new row (including intersection with existing columns)
    for (let j = 0; j < expandedN; j++) {
      const cellGroup = createGroup(`translate(${currentOrigin.x + HEADER_SIZE + j * CELL_SIZE}, ${currentOrigin.y + HEADER_SIZE + newClusterIdx * CELL_SIZE})`);
      cellGroup.setAttribute('data-row', newClusterIdx);
      cellGroup.setAttribute('data-col', j);
      cellGroup.style.opacity = '0';
      
      const isCellHighlight = j === merge.i || j === merge.j;
      const value = expandedMatrix[newClusterIdx][j];
      const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(1);
      
      const cellRect = createRect(0, 0, CELL_SIZE, CELL_SIZE,
        COLORS.newClusterBg,
        isCellHighlight ? COLORS.highlight : COLORS.newCluster,
        4);
      const cellText = createText(CELL_SIZE / 2, CELL_SIZE / 2, displayValue,
        COLORS.newCluster, '26', '400');
      
      cellGroup.appendChild(cellRect);
      cellGroup.appendChild(cellText);
      mainGroup.appendChild(cellGroup);
      state.elements.set(`cell-${newClusterIdx}-${j}`, cellGroup);
      newClusterElements.push(cellGroup);
    }
    
    // Add cells for new column (for existing rows, not the new row which was already added)
    for (let i = 0; i < fromN; i++) {
      const cellGroup = createGroup(`translate(${currentOrigin.x + HEADER_SIZE + newClusterIdx * CELL_SIZE}, ${currentOrigin.y + HEADER_SIZE + i * CELL_SIZE})`);
      cellGroup.setAttribute('data-row', i);
      cellGroup.setAttribute('data-col', newClusterIdx);
      cellGroup.style.opacity = '0';
      
      const isCellHighlight = i === merge.i || i === merge.j;
      const value = expandedMatrix[i][newClusterIdx];
      const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(1);
      
      const cellRect = createRect(0, 0, CELL_SIZE, CELL_SIZE,
        COLORS.newClusterBg,
        isCellHighlight ? COLORS.highlight : COLORS.newCluster,
        4);
      const cellText = createText(CELL_SIZE / 2, CELL_SIZE / 2, displayValue,
        COLORS.newCluster, '26', '400');
      
      cellGroup.appendChild(cellRect);
      cellGroup.appendChild(cellText);
      mainGroup.appendChild(cellGroup);
      state.elements.set(`cell-${i}-${newClusterIdx}`, cellGroup);
      newClusterElements.push(cellGroup);
    }
    
    await sleep(100);
    // Fade in new cluster row/column
    await animateOpacity(newClusterElements, '0', '1', FADE_DURATION);
    await sleep(PAUSE_DURATION);

    // Phase 3: Fade out the merged rows/columns AND the corresponding cells in the new cluster row/col
    const elementsToFade = [];
    state.elements.forEach((el, key) => {
      const row = parseInt(el.getAttribute('data-row'));
      const col = el.getAttribute('data-col') !== null ? parseInt(el.getAttribute('data-col')) : -1;
      
      // Fade entire old rows/columns (but not the new cluster row/col headers)
      if ((row === merge.i || row === merge.j) && row !== expandedN - 1) {
        elementsToFade.push(el);
      } else if ((col === merge.i || col === merge.j) && col !== expandedN - 1 && row !== expandedN - 1) {
        // Fade cells in old columns (but not the header which was already handled above)
        elementsToFade.push(el);
      } else if (row === expandedN - 1 && (col === merge.i || col === merge.j)) {
        // Also fade the cells in the NEW cluster row that correspond to the merged columns
        elementsToFade.push(el);
      } else if (col === expandedN - 1 && (row === merge.i || row === merge.j)) {
        // Also fade the cells in the NEW cluster column that correspond to the merged rows
        elementsToFade.push(el);
      }
    });
    
    // Also fade highlight overlay
    const overlay = svg.querySelector('.highlight-overlay');
    if (overlay) elementsToFade.push(overlay);
    
    await animateOpacity(elementsToFade, '1', '0', FADE_DURATION);
    await sleep(PAUSE_DURATION);

    // Phase 4: Smooth collapse - animate remaining elements to their new positions
    // Calculate how many positions each element needs to shift
    const fadeIndicesSet = new Set([merge.i, merge.j]);
    
    // For each remaining index, calculate how many faded indices are before it
    function countFadedBefore(idx) {
      let count = 0;
      fadeIndicesSet.forEach(fadedIdx => {
        if (fadedIdx < idx) count++;
      });
      return count;
    }
    
    const newOrigin = getTableOrigin(fromN - 1, svgWidth, svgHeight); // Target is one smaller than expanded (which was fromN+1)
    const expandedOrigin = getTableOrigin(expandedN, svgWidth, svgHeight);
    
    const elementMoves = [];
    
    // Move all non-faded elements
    for (let i = 0; i < expandedN; i++) {
      if (fadeIndicesSet.has(i)) continue; // Skip faded rows
      
      const rowShift = countFadedBefore(i);
      const newRowIdx = i - rowShift;
      
      // Row header
      const rowHeader = state.elements.get(`row-header-${i}`);
      if (rowHeader) {
        const targetX = newOrigin.x;
        const targetY = newOrigin.y + HEADER_SIZE + newRowIdx * CELL_SIZE;
        elementMoves.push({
          element: rowHeader,
          targetX: targetX,
          targetY: targetY
        });
      }
      
      // Column header
      const colHeader = state.elements.get(`col-header-${i}`);
      if (colHeader) {
        const targetX = newOrigin.x + HEADER_SIZE + newRowIdx * CELL_SIZE;
        const targetY = newOrigin.y;
        elementMoves.push({
          element: colHeader,
          targetX: targetX,
          targetY: targetY
        });
      }
      
      // Data cells
      for (let j = 0; j < expandedN; j++) {
        if (fadeIndicesSet.has(j)) continue; // Skip faded columns
        
        const colShift = countFadedBefore(j);
        const newColIdx = j - colShift;
        
        const cell = state.elements.get(`cell-${i}-${j}`);
        if (cell) {
          const targetX = newOrigin.x + HEADER_SIZE + newColIdx * CELL_SIZE;
          const targetY = newOrigin.y + HEADER_SIZE + newRowIdx * CELL_SIZE;
          elementMoves.push({
            element: cell,
            targetX: targetX,
            targetY: targetY
          });
        }
      }
    }
    
    // Also animate the corner cell
    const cornerCell = svg.querySelector('.corner-cell');
    if (cornerCell) {
      elementMoves.push({
        element: cornerCell,
        targetX: newOrigin.x,
        targetY: newOrigin.y,
        isRect: true
      });
    }
    
    // For rect elements (corner), we need different handling
    const rectMoves = elementMoves.filter(m => m.isRect);
    const groupMoves = elementMoves.filter(m => !m.isRect);
    
    // Animate corner cell separately using x/y attributes
    if (rectMoves.length > 0) {
      const corner = rectMoves[0];
      const startX = parseFloat(corner.element.getAttribute('x'));
      const startY = parseFloat(corner.element.getAttribute('y'));
      const startTime = performance.now();
      
      function animateCorner(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / MOVE_DURATION, 1);
        const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        const currentX = startX + (corner.targetX - startX) * eased;
        const currentY = startY + (corner.targetY - startY) * eased;
        corner.element.setAttribute('x', currentX);
        corner.element.setAttribute('y', currentY);
        
        if (progress < 1) {
          requestAnimationFrame(animateCorner);
        }
      }
      requestAnimationFrame(animateCorner);
    }
    
    // Animate group elements
    await animateCollapse(groupMoves, MOVE_DURATION);
    await sleep(300);

    // Phase 5: Draw final clean table
    drawTable(svg, toStep);
  }

  async function animateBackward(svg, fromStep, toStep) {
    const mainGroup = svg.querySelector('g');
    if (mainGroup) {
      mainGroup.style.transition = `opacity ${FADE_DURATION}ms ease`;
      mainGroup.style.opacity = '0';
    }
    await sleep(FADE_DURATION);
    drawTable(svg, toStep);
  }

  function updateLabel() {
    const label = document.getElementById(labelId);
    if (label) {
      label.textContent = `Step ${state.currentStep + 1} of ${clusteringSteps.length}`;
    }
  }

  function updateButtons() {
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    if (prev) {
      prev.disabled = state.currentStep === 0 || state.animating;
      prev.style.opacity = prev.disabled ? '0.5' : '1';
    }
    if (next) {
      next.disabled = state.currentStep === clusteringSteps.length - 1 || state.animating;
      next.style.opacity = next.disabled ? '0.5' : '1';
    }
  }

  async function goToStep(newStep, animate = true) {
    if (state.animating) return;
    const oldStep = state.currentStep;
    const direction = newStep - oldStep;
    
    if (newStep < 0 || newStep >= clusteringSteps.length) return;
    if (newStep === oldStep) return;
    
    state.animating = true;
    state.currentStep = newStep;
    updateLabel();
    updateButtons();
    
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (!state.svg || !container.contains(state.svg)) {
      state.svg = createSVG(container);
    }
    
    if (animate && direction === 1) {
      await animateForward(state.svg, clusteringSteps[oldStep], clusteringSteps[newStep]);
    } else if (animate && direction === -1) {
      await animateBackward(state.svg, clusteringSteps[oldStep], clusteringSteps[newStep]);
    } else {
      drawTable(state.svg, clusteringSteps[newStep]);
    }
    
    state.animating = false;
    updateButtons();
  }

  function init() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    state.svg = createSVG(container);
    drawTable(state.svg, clusteringSteps[state.currentStep]);
    updateLabel();
    updateButtons();
  }

  function bind() {
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    
    if (prev) {
      prev.onclick = () => goToStep(state.currentStep - 1);
    }
    if (next) {
      next.onclick = () => goToStep(state.currentStep + 1);
    }
    
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    setTimeout(bind, 50);
  }
})();
</script>

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
<svg id="dendrogram-intro-svg" viewBox="0 0 420 380" style="width: 100%; height: auto; max-height: 420px; cursor: pointer;">
  
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

<div id="dendrogram-overlay" style="position: fixed; inset: 0; background: rgba(5, 10, 20, 0.92); display: none; align-items: center; justify-content: center; z-index: 2000;">
  <button id="dendrogram-overlay-close" type="button" style="position: absolute; top: 24px; right: 24px; background: #e63946; color: #fff; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 1em;">✕</button>
  <div style="width: min(92vw, 1100px); height: min(88vh, 780px);">
    <svg id="dendrogram-overlay-svg" viewBox="0 0 420 380" style="width: 100%; height: 100%;">
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
  </div>
</div>

<script>
(function() {
  const svgId = 'dendrogram-intro-svg';
  const overlayId = 'dendrogram-overlay';
  const closeId = 'dendrogram-overlay-close';

  function bind() {
    const svg = document.getElementById(svgId);
    const overlay = document.getElementById(overlayId);
    const close = document.getElementById(closeId);
    if (!svg || !overlay || !close) return;

    const open = () => {
      overlay.style.display = 'flex';
    };
    const hide = () => {
      overlay.style.display = 'none';
    };

    svg.addEventListener('click', open);
    close.addEventListener('click', hide);
    overlay.addEventListener('click', event => {
      if (event.target === overlay) hide();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})();
</script>

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
<svg viewBox="0 0 420 400" style="width: 100%; height: auto; max-height: 920px;">

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
<svg viewBox="0 0 420 400" style="width: 100%; height: auto; max-height: 920px;">
  
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
  <!-- CUT A: High cut at h=3.5 (y=75) → 2 clusters -->
  <line x1="65" y1="75" x2="370" y2="75" stroke="#ff6b6b" stroke-width="2"/>
  <text x="380" y="79" fill="#ff6b6b" font-size="10" text-anchor="start">Cut A</text>
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
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Base R workflow with `dist()` + `hclust()`*

-! Build a distance matrix from a numeric data table
-: Choose a linkage method (e.g., "complete")
-: Plot the dendrogram with `plot()`
-: Cut into k clusters with `rect.hclust()`

```r
d <- dist(scale(x))
hc <- hclust(d, method = "complete")
plot(hc)
```

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="hca-r-container"></div>
  <div id="hca-r-plot" style="border: 0px solid #2d3a66; border-radius: 8px; min-height: 240px; display: flex; align-items: center; justify-content: center; color: #9efcffcc; font-size: 0.9em; text-align: center; padding: 12px;">
    Run the WebR example to see the dendrogram plot.
  </div>
  <button id="hca-r-open-plot" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'hca-r-container';
  const plotContainerId = 'hca-r-plot';
  const openBtnId = 'hca-r-open-plot';
  const slideId = 'hca-r-example';

  const code = `# ===== HIERARCHICAL CLUSTERING (base R) =====
# Small environmental dataset (normalized concentrations)
samples <- data.frame(
  Fe  = c(0.60, 0.55, 0.62, 0.90, 0.88),
  Cu  = c(0.70, 0.65, 0.68, 0.85, 0.82),
  Pb  = c(0.80, 0.70, 3.00, 0.95, 0.90),
  NO3 = c(0.50, 0.60, 0.55, 0.80, 0.78),
  TOC = c(0.60, 0.65, 0.58, 0.90, 0.86),
  Pesticides = c(0.40, 0.50, 0.45, 0.70, 2.30),
  PFAS = c(0.50, 0.55, 0.52, 0.80, 0.82)
)
rownames(samples) <- c("A", "B", "C", "D", "E")

# Distance matrix (scaled) and clustering
d <- dist(scale(samples), method = "euclidean")
hc <- hclust(d, method = "complete")

# Plot dendrogram
plot(hc, main = "Hierarchical Clustering (complete linkage)",
     xlab = "", sub = "", cex = 0.9)
rect.hclust(hc, k = 2, border = "#1a588b")

# Print distance matrix
cat("Distance matrix:\\n")
print(round(as.matrix(d), 3))`;

  const fallbackOutput = `[Simulated in JavaScript]
Distance matrix:
    A     B     C     D     E
A 0.000 0.398 2.203 1.608 1.458
B 0.398 0.000 2.214 1.628 1.480
C 2.203 2.214 0.000 2.367 2.071
D 1.608 1.628 2.367 0.000 0.560
E 1.458 1.480 2.071 0.560 0.000`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run HCA (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 480,
        background: '#ffffff',
        altText: 'Dendrogram plot from hierarchical clustering',
        loadingMessage: 'Rendering dendrogram...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the dendrogram.'
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

<!-- .slide:id="cluster-heatmap-bidir" -->
## Bidirectional Clustering Heatmap
<div id="cluster-heatmap-bidir-figure" style="width: 100%; height: 900px;"></div>

<script>
(function() {
  const containerId = 'cluster-heatmap-bidir-figure';

  function render() {
    if (typeof d3 === 'undefined') {
      setTimeout(render, 100);
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 720;
    const margin = { top: 500, right: 40, bottom: 40, left: 500 };

    const svg = d3.select(container)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%');

    const samples = ['A', 'B', 'C', 'D', 'E'];
    const props = ['Fe', 'Cu', 'Pb', 'NO3', 'TOC', 'Pesticides', 'PFAS'];
    const matrix = [
      [0.60, 0.70, 0.80, 0.50, 0.60, 0.40, 0.50],
      [0.55, 0.65, 0.70, 0.60, 0.65, 0.50, 0.55],
      [0.62, 0.68, 3.00, 0.55, 0.58, 0.45, 0.52],
      [0.90, 0.85, 0.95, 0.80, 0.90, 0.70, 0.80],
      [0.88, 0.82, 0.90, 0.78, 0.86, 2.30, 0.82]
    ];

    function zscore(values) {
      const mean = d3.mean(values);
      const sd = d3.deviation(values) || 1;
      return values.map(v => (v - mean) / sd);
    }

    const colZ = props.map((_, j) => zscore(matrix.map(row => row[j])));
    const zMatrix = matrix.map((_, i) => props.map((_, j) => colZ[j][i]));

    function averageDistance(aIdx, bIdx, data) {
      let sum = 0;
      for (let k = 0; k < data[aIdx].length; k++) {
        const diff = data[aIdx][k] - data[bIdx][k];
        sum += diff * diff;
      }
      return Math.sqrt(sum);
    }

    function cluster(items, data) {
      let clusters = items.map((id, idx) => ({
        ids: [id],
        index: idx,
        node: { id, distance: 0, order: [id] }
      }));

      function avgLink(a, b) {
        let sum = 0;
        let count = 0;
        a.ids.forEach(ai => {
          b.ids.forEach(bi => {
            sum += averageDistance(ai, bi, data);
            count += 1;
          });
        });
        return sum / count;
      }

      while (clusters.length > 1) {
        let bestI = 0;
        let bestJ = 1;
        let best = Infinity;

        for (let i = 0; i < clusters.length; i++) {
          for (let j = i + 1; j < clusters.length; j++) {
            const d = avgLink(clusters[i], clusters[j]);
            if (d < best) {
              best = d;
              bestI = i;
              bestJ = j;
            }
          }
        }

        const left = clusters[bestI];
        const right = clusters[bestJ];
        const merged = {
          ids: left.ids.concat(right.ids),
          node: {
            distance: best,
            children: [left.node, right.node],
            order: left.node.order.concat(right.node.order)
          }
        };
        clusters = clusters.filter((_, idx) => idx !== bestI && idx !== bestJ);
        clusters.push(merged);
      }

      return clusters[0].node;
    }

    const rowNode = cluster(samples.map((_, i) => i), zMatrix);
    const colNode = cluster(props.map((_, j) => j), d3.transpose(zMatrix));

    const rowOrder = rowNode.order.map(i => samples[i]);
    const colOrder = colNode.order.map(j => props[j]);

    const rowMap = new Map(rowOrder.map((d, i) => [d, i]));
    const colMap = new Map(colOrder.map((d, i) => [d, i]));

    const cellW = (width - margin.left - margin.right) / colOrder.length;
    const cellH = (height - margin.top - margin.bottom) / rowOrder.length;

    const values = zMatrix.flat();
    const maxAbs = Math.max(Math.abs(d3.min(values)), Math.abs(d3.max(values)), 1);
    const color = d3.scaleLinear()
      .domain([-maxAbs, 0, maxAbs])
      .range(['#0b4f6c', '#f8fafc', '#b91c1c']);

    const heatmapGroup = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    rowOrder.forEach(rowLabel => {
      colOrder.forEach(colLabel => {
        const i = samples.indexOf(rowLabel);
        const j = props.indexOf(colLabel);
        heatmapGroup.append('rect')
          .attr('x', colMap.get(colLabel) * cellW)
          .attr('y', rowMap.get(rowLabel) * cellH)
          .attr('width', cellW)
          .attr('height', cellH)
          .attr('fill', color(zMatrix[i][j]))
          .attr('stroke', '#111827')
          .attr('stroke-width', 0.6)
          .attr('opacity', 0.95);
      });
    });

    heatmapGroup.selectAll('text.row-label')
      .data(rowOrder)
      .enter()
      .append('text')
      .attr('x', -10)
      .attr('y', d => rowMap.get(d) * cellH + cellH / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '12px')
      .text(d => d);

    heatmapGroup.selectAll('text.col-label')
      .data(colOrder)
      .enter()
      .append('text')
      .attr('x', d => colMap.get(d) * cellW + cellW / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .attr('fill', '#e2e8f0')
      .attr('font-size', '12px')
      .attr('transform', d => `rotate(-35 ${colMap.get(d) * cellW + cellW / 2} -10)`)
      .text(d => d);

    function renderDendrogram(node, xOffset, yOffset, horizontal) {
      const root = d3.hierarchy(node, d => d.children);
      const sizeX = horizontal ? colOrder.length * cellW : rowOrder.length * cellH;
      const sizeY = horizontal ? margin.top - 30 : margin.left - 30;
      const clusterLayout = d3.cluster().size([sizeX, sizeY]);
      clusterLayout(root);

      root.eachAfter(d => {
        if (d.children && d.children.length) {
          d.x = d3.mean(d.children, c => c.x);
        }
      });

      const maxDist = root.data.distance || 1;
      root.each(d => {
        d.data.dPos = (d.data.distance / maxDist) * sizeY;
      });

      const group = svg.append('g')
        .attr('transform', `translate(${xOffset}, ${yOffset})`);

      group.selectAll('path')
        .data(root.links())
        .enter()
        .append('path')
        .attr('d', d => {
          if (horizontal) {
            const parentY = sizeY - d.source.data.dPos;
            const childY = sizeY - d.target.data.dPos;
            return `M${d.target.x},${childY}V${parentY}H${d.source.x}`;
          }
          const parentX = sizeY - d.source.data.dPos;
          const childX = sizeY - d.target.data.dPos;
          return `M${childX},${d.target.x}H${parentX}V${d.source.x}`;
        })
        .attr('fill', 'none')
        .attr('stroke', '#ff20b9ff')
        .attr('stroke-width', 2.6)
        .attr('opacity', 0.9);

        // Add some Text in the top-left corner
      group.append('text')
        .attr('x', horizontal ? 150 : 10)
        .attr('y', horizontal ? 70 : -50)
        .attr('fill', '#ff20b9ff')
        .attr('font-size', '1.em')
        .attr('font-weight', '600')
        .text(horizontal ? 'Properties Dendrogram' : 'Samples Dendrogram');
      
      group.append('text')
        .attr('x', horizontal ? 150 : 10)
        .attr('y', horizontal ? 120 : 0)
        .attr('fill', '#ff20b9aa')
        .attr('font-size', '0.85em')
        .text(horizontal ? '(clustered by similarity)' : '(clustered by similarity)');

      // Add description for the heatmap in the top right corner of the svg
      if (horizontal) {
        svg.append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', margin.top - 460)
          .attr('fill', '#9efcff')
          .attr('font-size', '.7em')
          .attr('font-weight', '600')
          .attr('text-anchor', 'end')
          .text('Heatmap: Z-score normalized values');
        
        svg.append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', margin.top - 430)
          .attr('fill', '#9efcffaa')
          .attr('font-size', '0.65em')
          .attr('text-anchor', 'end')
          .text('(blue = low, white = medium, red = high)');
      }

      // add bullet point like: "Analytical Question: Which samples and which properties show similar patterns?"      
      if (horizontal) {
        const textGroup = svg.append('text')
          .attr('x', width - margin.right - 1800)
          .attr('y', margin.top-400)
          .attr('fill', '#ff9f43')
          .attr('font-size', '0.75em')
          .attr('font-weight', '600')
          .attr('text-anchor', 'start');
        
        textGroup.append('tspan')
          .attr('x', width- margin.right - 1800)
          .attr('dy', '0em')
          .text('Analytical Question:');
        
        textGroup.append('tspan')
          .attr('x', width - margin.right - 1800)
          .attr('dy', '1.2em')
          .text('Which samples and properties');

        textGroup.append('tspan')
          .attr('x', width - margin.right - 1800)
          .attr('dy', '1.2em')
          .text('show similar patterns?');
      }
    }

    renderDendrogram(colNode, margin.left, margin.top - (margin.top - 30), true);
    renderDendrogram(rowNode, margin.left - (margin.left - 30), margin.top, false);
  }

  render();

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        render();
      }
    });
    Reveal.on('ready', event => {
      if (event.currentSlide.querySelector(`#${containerId}`)) {
        render();
      }
    });
  }

  window.addEventListener('resize', () => {
    if (document.getElementById(containerId)) {
      render();
    }
  });
})();
</script>

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
<svg viewBox="0 0 400 340" style="width: 100%; height: auto; max-height: 680px;">
  
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
<div id="kmeans-interactive-container" style="width: 100%; height: 760px; position: relative;">
  <div id="kmeans-svg-container" style="width: 100%; height: 480px;"></div>
  <div id="kmeans-controls" style="display: flex; gap: 12px; justify-content: center; margin-top: 10px; flex-wrap: wrap;">
    <button id="kmeans-assign-btn" style="padding: 10px 20px; background: #1e3a5f; color: #9efcff; border: 2px solid #00d4ff; border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: 600; opacity: 0.5;" disabled>Re-assign Clusters</button>
    <button id="kmeans-update-btn" style="padding: 10px 20px; background: #1e3a5f; color: #9efcff; border: 2px solid #00ff88; border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: 600; opacity: 0.5;" disabled>Re-estimate Centers</button>
    <button id="kmeans-reset-btn" style="padding: 10px 20px; background: #3a1e1e; color: #ff6b6b; border: 2px solid #ff6b6b; border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: 600;">Reset</button>
  </div>
  <div id="kmeans-status" style="text-align: center; margin-top: 8px; color: #9efcff; font-size: 0.9em;">Click on points to select starting centroids</div>
</div>

<script>
(function() {
  const containerId = 'kmeans-svg-container';
  const stateKey = 'kmeansInteractiveState_' + containerId;
  
  // Check if already initialized
  if (window[stateKey] && window[stateKey].initialized) {
    return;
  }
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Configuration
  const WIDTH = 680;
  const HEIGHT = 480;
  const POINT_RADIUS = 8;
  const CENTROID_RADIUS = 14;
  const NUM_POINTS = 200;
  const COLORS = {
    unassigned: '#6b7280',
    centroidStroke: '#ffffff',
    clusters: ['#ff6b6b', '#00d4ff', '#00ff88', '#fbbf24', '#a78bfa', '#f472b6'],
    bg: '#0f172a'
  };
  
  // State
  const state = {
    initialized: true,
    points: [],
    centroids: [],
    assignments: [],
    phase: 'select', // 'select', 'assigned', 'updated'
    iteration: 0,
    converged: false
  };
  window[stateKey] = state;
  
  // Generate clustered random data (3 underlying clusters)
  function generateData() {
    const points = [];
    const clusterCenters = [
      { x: 150, y: 120 },
      { x: 420, y: 100 },
      { x: 280, y: 320 }
    ];
    const spread = 70;
    
    for (let i = 0; i < NUM_POINTS; i++) {
      const cluster = clusterCenters[i % 3];
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * spread;
      points.push({
        x: Math.max(30, Math.min(WIDTH - 30, cluster.x + r * Math.cos(angle) + (Math.random() - 0.5) * 40)),
        y: Math.max(30, Math.min(HEIGHT - 30, cluster.y + r * Math.sin(angle) + (Math.random() - 0.5) * 40)),
        cluster: -1,
        isCentroid: false
      });
    }
    return points;
  }
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', WIDTH);
  svg.setAttribute('height', HEIGHT);
  svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
  svg.style.display = 'block';
  svg.style.margin = '0 auto';
  svg.style.background = COLORS.bg;
  svg.style.borderRadius = '8px';
  svg.style.cursor = 'crosshair';
  container.appendChild(svg);
  
  // Initialize data
  state.points = generateData();
  
  // Get UI elements
  const assignBtn = document.getElementById('kmeans-assign-btn');
  const updateBtn = document.getElementById('kmeans-update-btn');
  const resetBtn = document.getElementById('kmeans-reset-btn');
  const statusDiv = document.getElementById('kmeans-status');
  
  function updateStatus(text) {
    if (statusDiv) statusDiv.textContent = text;
  }
  
  function setButtonState(btn, enabled) {
    if (!btn) return;
    btn.disabled = !enabled;
    btn.style.opacity = enabled ? '1' : '0.5';
    btn.style.cursor = enabled ? 'pointer' : 'not-allowed';
  }
  
  function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
  
  function drawCentroid(g, x, y, color, size = CENTROID_RADIUS) {
    // Circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', size);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '4');
    g.appendChild(circle);
    
    // Cross
    const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', x - size * 0.7);
    line1.setAttribute('y1', y - size * 0.7);
    line1.setAttribute('x2', x + size * 0.7);
    line1.setAttribute('y2', y + size * 0.7);
    line1.setAttribute('stroke', color);
    line1.setAttribute('stroke-width', '3');
    g.appendChild(line1);
    
    const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', x + size * 0.7);
    line2.setAttribute('y1', y - size * 0.7);
    line2.setAttribute('x2', x - size * 0.7);
    line2.setAttribute('y2', y + size * 0.7);
    line2.setAttribute('stroke', color);
    line2.setAttribute('stroke-width', '3');
    g.appendChild(line2);
  }
  
  function render() {
    svg.innerHTML = '';
    
    // Draw points
    const pointsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pointsGroup.setAttribute('class', 'points');
    
    state.points.forEach((point, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', point.x);
      circle.setAttribute('cy', point.y);
      circle.setAttribute('r', point.isCentroid ? POINT_RADIUS + 2 : POINT_RADIUS);
      
      let color = COLORS.unassigned;
      if (point.cluster >= 0) {
        color = COLORS.clusters[point.cluster % COLORS.clusters.length];
      }
      
      circle.setAttribute('fill', color);
      circle.setAttribute('data-idx', idx);
      circle.style.cursor = state.phase === 'select' ? 'pointer' : 'default';
      circle.style.transition = 'fill 0.3s ease, r 0.2s ease';
      
      if (point.isCentroid) {
        circle.setAttribute('stroke', '#ffffff');
        circle.setAttribute('stroke-width', '3');
      }
      
      // Click handler for selecting centroids
      if (state.phase === 'select') {
        circle.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleCentroid(idx);
        });
        circle.addEventListener('mouseenter', () => {
          if (!point.isCentroid) {
            circle.setAttribute('r', POINT_RADIUS + 3);
            circle.setAttribute('fill', '#9efcff');
          }
        });
        circle.addEventListener('mouseleave', () => {
          circle.setAttribute('r', point.isCentroid ? POINT_RADIUS + 2 : POINT_RADIUS);
          circle.setAttribute('fill', point.isCentroid ? COLORS.clusters[state.centroids.indexOf(idx) % COLORS.clusters.length] : COLORS.unassigned);
        });
      }
      
      pointsGroup.appendChild(circle);
    });
    
    svg.appendChild(pointsGroup);
    
    // Draw centroid markers
    const centroidsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    centroidsGroup.setAttribute('class', 'centroids');
    
    if (state.phase === 'select') {
      // Draw selected points as centroids
      state.centroids.forEach((idx, i) => {
        const point = state.points[idx];
        const color = COLORS.clusters[i % COLORS.clusters.length];
        drawCentroid(centroidsGroup, point.x, point.y, color);
      });
    } else {
      // Draw calculated centroid positions
      state.centroidPositions.forEach((pos, i) => {
        const color = COLORS.clusters[i % COLORS.clusters.length];
        drawCentroid(centroidsGroup, pos.x, pos.y, color);
      });
    }
    
    svg.appendChild(centroidsGroup);
    
    // Update button states
    const hasCentroids = state.centroids.length > 0;
    setButtonState(assignBtn, hasCentroids && (state.phase === 'select' || state.phase === 'updated') && !state.converged);
    setButtonState(updateBtn, state.phase === 'assigned' && !state.converged);
  }
  
  function toggleCentroid(idx) {
    const centroidIdx = state.centroids.indexOf(idx);
    if (centroidIdx >= 0) {
      // Remove centroid
      state.centroids.splice(centroidIdx, 1);
      state.points[idx].isCentroid = false;
      state.points[idx].cluster = -1;
    } else {
      // Add centroid
      state.centroids.push(idx);
      state.points[idx].isCentroid = true;
      state.points[idx].cluster = state.centroids.length - 1;
    }
    
    updateStatus(`Selected ${state.centroids.length} centroid${state.centroids.length !== 1 ? 's' : ''}. ${state.centroids.length > 0 ? 'Click "Re-assign Clusters" to start.' : 'Click on points to select.'}`);
    render();
  }
  
  function assignClusters() {
    if (state.centroids.length === 0) return;
    
    // Initialize centroid positions from selected points (or use existing)
    if (state.phase === 'select') {
      state.centroidPositions = state.centroids.map(idx => ({
        x: state.points[idx].x,
        y: state.points[idx].y
      }));
    }
    
    let changed = false;
    
    // Assign each point to nearest centroid
    state.points.forEach((point, idx) => {
      let minDist = Infinity;
      let minCluster = 0;
      
      state.centroidPositions.forEach((centroid, i) => {
        const d = distance(point, centroid);
        if (d < minDist) {
          minDist = d;
          minCluster = i;
        }
      });
      
      if (point.cluster !== minCluster) {
        changed = true;
      }
      point.cluster = minCluster;
    });
    
    state.phase = 'assigned';
    state.iteration++;
    
    if (!changed && state.iteration > 1) {
      state.converged = true;
      updateStatus(`Converged after ${state.iteration} iterations! Clusters are stable.`);
    } else {
      updateStatus(`Iteration ${state.iteration}: Clusters assigned. Click "Re-estimate Centers" to update centroids.`);
    }
    
    render();
  }
  
  function updateCentroids() {
    if (state.phase !== 'assigned') return;
    
    const oldPositions = state.centroidPositions.map(p => ({ x: p.x, y: p.y }));
    
    // Calculate new centroid positions as mean of assigned points
    state.centroidPositions = state.centroidPositions.map((_, i) => {
      const clusterPoints = state.points.filter(p => p.cluster === i);
      if (clusterPoints.length === 0) {
        // Keep old position if no points assigned
        return oldPositions[i];
      }
      return {
        x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
        y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length
      };
    });
    
    // Check if centroids moved significantly
    let totalMove = 0;
    state.centroidPositions.forEach((pos, i) => {
      totalMove += distance(pos, oldPositions[i]);
    });
    
    state.phase = 'updated';
    
    if (totalMove < 1) {
      state.converged = true;
      updateStatus(`Converged after ${state.iteration} iterations! Centroids stable.`);
    } else {
      updateStatus(`Iteration ${state.iteration}: Centers updated. Click "Re-assign Clusters" for next iteration.`);
    }
    
    render();
  }
  
  function reset() {
    // Regenerate data
    state.points = generateData();
    state.centroids = [];
    state.centroidPositions = [];
    state.assignments = [];
    state.phase = 'select';
    state.iteration = 0;
    state.converged = false;
    
    updateStatus('Click on points to select starting centroids');
    render();
  }
  
  // Event listeners
  if (assignBtn) {
    assignBtn.addEventListener('click', assignClusters);
  }
  if (updateBtn) {
    updateBtn.addEventListener('click', updateCentroids);
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', reset);
  }
  
  // Initial render
  render();
})();
</script>

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
<svg viewBox="0 0 400 340" style="width: 100%; height: auto; max-height: 880px;">
  
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

<!-- .slide:id="kmeans-bruteforce" -->
## Finding the Optimal k by Brute Force

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Brute Force Optimization**

-! Run k-Means *many times* with random settings:
-: Vary the number of clusters k
-: Use random initial centroid positions

-! For each run, calculate the *ANOVA F-statistic*:
-: F = MSB / MSW (between vs. within variance)
-: Higher F → better cluster separation

-! Track the *average F* for each k value

-! The k with highest average F is often the best choice

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="bruteforce-container" style="width: 100%; height: 720px; position: relative;">
  <div id="bruteforce-chart" style="width: 100%; height: 620px;"></div>
  <div id="bruteforce-controls" style="display: flex; gap: 12px; justify-content: center; margin-top: 10px; align-items: center;">
    <button id="bruteforce-run-btn" style="padding: 12px 28px; background: #1e5a3a; color: #00ff88; border: 2px solid #00ff88; border-radius: 8px; cursor: pointer; font-size: 1.1em; font-weight: 700;">▶ Run 1000 Trials</button>
  </div>
  <div id="bruteforce-status" style="text-align: center; margin-top: 8px; color: #9efcff; font-size: 0.9em;">Click Run to start brute force optimization</div>
</div>

<script>
(function() {
  const containerId = 'bruteforce-chart';
  const stateKey = 'bruteforceState_' + containerId;
  
  if (window[stateKey] && window[stateKey].initialized) {
    return;
  }
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Configuration
  const WIDTH = 600;
  const HEIGHT = 620;
  const MARGIN = { top: 40, right: 30, bottom: 60, left: 70 };
  const CHART_WIDTH = WIDTH - MARGIN.left - MARGIN.right;
  const CHART_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
  const NUM_TRIALS = 1000;
  const MIN_DELAY = 20; // ms between updates
  const K_VALUES = [2, 3, 4, 5, 6, 7, 8];
  const NUM_POINTS = 150;
  
  const COLORS = {
    bg: '#0f172a',
    bar: '#00d4ff',
    barHighlight: '#00ff88',
    axis: '#64748b',
    text: '#e2e8f0',
    grid: '#1e293b'
  };
  
  // State
  const state = {
    initialized: true,
    running: false,
    fSums: {},
    fCounts: {},
    fAverages: {},
    trialCount: 0,
    bestK: null
  };
  window[stateKey] = state;
  
  // Initialize F tracking for each k
  K_VALUES.forEach(k => {
    state.fSums[k] = 0;
    state.fCounts[k] = 0;
    state.fAverages[k] = 0;
  });
  
  // Generate synthetic clustered data
  function generateData() {
    const points = [];
    const numClusters = 3; // 3 true clusters
    const centers = [];
    
    for (let i = 0; i < numClusters; i++) {
      centers.push({
        x: 50 + Math.random() * 4000,
        y: 50 + Math.random() * 3000
      });
    }
    
    for (let i = 0; i < NUM_POINTS; i++) {
      const center = centers[i % numClusters];
      const spread = 30 + Math.random() * 40;
      points.push({
        x: center.x + (Math.random() - 0.5) * spread * 2,
        y: center.y + (Math.random() - 0.5) * spread * 2
      });
    }
    return points;
  }
  
  // K-means clustering
  function kMeans(points, k, maxIter = 20) {
    // Random centroid initialization
    const centroids = [];
    const indices = [...Array(points.length).keys()];
    for (let i = 0; i < k; i++) {
      const idx = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];
      centroids.push({ x: points[idx].x, y: points[idx].y });
    }
    
    let assignments = new Array(points.length).fill(0);
    
    for (let iter = 0; iter < maxIter; iter++) {
      // Assign points to nearest centroid
      const newAssignments = points.map(p => {
        let minDist = Infinity;
        let minIdx = 0;
        centroids.forEach((c, i) => {
          const d = Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2);
          if (d < minDist) {
            minDist = d;
            minIdx = i;
          }
        });
        return minIdx;
      });
      
      // Check convergence
      if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) break;
      assignments = newAssignments;
      
      // Update centroids
      for (let i = 0; i < k; i++) {
        const clusterPoints = points.filter((_, idx) => assignments[idx] === i);
        if (clusterPoints.length > 0) {
          centroids[i] = {
            x: clusterPoints.reduce((s, p) => s + p.x, 0) / clusterPoints.length,
            y: clusterPoints.reduce((s, p) => s + p.y, 0) / clusterPoints.length
          };
        }
      }
    }
    
    return { centroids, assignments };
  }
  
  // Calculate ANOVA F-statistic (between-cluster / within-cluster variance)
  function calculateF(points, centroids, assignments) {
    const k = centroids.length;
    const n = points.length;
    
    // Global mean
    const globalMean = {
      x: points.reduce((s, p) => s + p.x, 0) / n,
      y: points.reduce((s, p) => s + p.y, 0) / n
    };
    
    // Between-cluster sum of squares
    let ssb = 0;
    for (let i = 0; i < k; i++) {
      const ni = assignments.filter(a => a === i).length;
      if (ni > 0) {
        ssb += ni * ((centroids[i].x - globalMean.x) ** 2 + (centroids[i].y - globalMean.y) ** 2);
      }
    }
    
    // Within-cluster sum of squares
    let ssw = 0;
    points.forEach((p, idx) => {
      const c = centroids[assignments[idx]];
      ssw += (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
    });
    
    // F-ratio
    const dfBetween = k - 1;
    const dfWithin = n - k;
    
    if (dfWithin <= 0 || ssw === 0) return 0;
    
    const msb = ssb / dfBetween;
    const msw = ssw / dfWithin;
    
    return msw > 0 ? msb / msw : 0;
  }
  
  // Create SVG
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', WIDTH);
  svg.setAttribute('height', HEIGHT);
  svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
  svg.style.display = 'block';
  svg.style.margin = '0 auto';
  container.appendChild(svg);
  
  // Background
  const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bgRect.setAttribute('width', WIDTH);
  bgRect.setAttribute('height', HEIGHT);
  bgRect.setAttribute('fill', COLORS.bg);
  bgRect.setAttribute('rx', '8');
  svg.appendChild(bgRect);
  
  // Chart group
  const chartGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  chartGroup.setAttribute('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
  svg.appendChild(chartGroup);
  
  // Y-axis scale (will be dynamic)
  let yMax = 100;
  
  function yScale(val) {
    return CHART_HEIGHT - (val / yMax) * CHART_HEIGHT;
  }
  
  function xScale(k) {
    const idx = K_VALUES.indexOf(k);
    const barWidth = CHART_WIDTH / K_VALUES.length;
    return idx * barWidth + barWidth / 2;
  }
  
  // Grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('class', 'grid');
  chartGroup.appendChild(gridGroup);
  
  // Bars group
  const barsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  barsGroup.setAttribute('class', 'bars');
  chartGroup.appendChild(barsGroup);
  
  // Create bars
  const bars = {};
  const barLabels = {};
  const barWidth = CHART_WIDTH / K_VALUES.length * 0.7;
  
  K_VALUES.forEach(k => {
    const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bar.setAttribute('x', xScale(k) - barWidth / 2);
    bar.setAttribute('y', CHART_HEIGHT);
    bar.setAttribute('width', barWidth);
    bar.setAttribute('height', 0);
    bar.setAttribute('fill', COLORS.bar);
    bar.setAttribute('rx', '4');
    bar.style.transition = 'y 0.15s ease-out, height 0.15s ease-out, fill 0.3s ease';
    barsGroup.appendChild(bar);
    bars[k] = bar;
    
    // Value label
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', xScale(k));
    label.setAttribute('y', CHART_HEIGHT - 5);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', COLORS.text);
    label.setAttribute('font-size', '12');
    label.setAttribute('font-weight', '600');
    label.textContent = '';
    label.style.transition = 'y 0.15s ease-out';
    barsGroup.appendChild(label);
    barLabels[k] = label;
  });
  
  // X-axis
  const xAxisGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  xAxisGroup.setAttribute('transform', `translate(0, ${CHART_HEIGHT})`);
  chartGroup.appendChild(xAxisGroup);
  
  // X-axis line
  const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  xAxisLine.setAttribute('x1', 0);
  xAxisLine.setAttribute('y1', 0);
  xAxisLine.setAttribute('x2', CHART_WIDTH);
  xAxisLine.setAttribute('y2', 0);
  xAxisLine.setAttribute('stroke', COLORS.axis);
  xAxisLine.setAttribute('stroke-width', '2');
  xAxisGroup.appendChild(xAxisLine);
  
  // X-axis labels
  K_VALUES.forEach(k => {
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', xScale(k));
    label.setAttribute('y', 25);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', COLORS.text);
    label.setAttribute('font-size', '14');
    label.textContent = k;
    xAxisGroup.appendChild(label);
  });
  
  // X-axis title
  const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xTitle.setAttribute('x', CHART_WIDTH / 2);
  xTitle.setAttribute('y', 50);
  xTitle.setAttribute('text-anchor', 'middle');
  xTitle.setAttribute('fill', COLORS.text);
  xTitle.setAttribute('font-size', '14');
  xTitle.setAttribute('font-weight', '600');
  xTitle.textContent = 'Number of Clusters (k)';
  xAxisGroup.appendChild(xTitle);
  
  // Y-axis
  const yAxisGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  chartGroup.appendChild(yAxisGroup);
  
  // Y-axis line
  const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  yAxisLine.setAttribute('x1', 0);
  yAxisLine.setAttribute('y1', 0);
  yAxisLine.setAttribute('x2', 0);
  yAxisLine.setAttribute('y2', CHART_HEIGHT);
  yAxisLine.setAttribute('stroke', COLORS.axis);
  yAxisLine.setAttribute('stroke-width', '2');
  yAxisGroup.appendChild(yAxisLine);
  
  // Y-axis title
  const yTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  yTitle.setAttribute('transform', `translate(-50, ${CHART_HEIGHT / 2}) rotate(-90)`);
  yTitle.setAttribute('text-anchor', 'middle');
  yTitle.setAttribute('fill', COLORS.text);
  yTitle.setAttribute('font-size', '14');
  yTitle.setAttribute('font-weight', '600');
  yTitle.textContent = 'Average F (ANOVA)';
  yAxisGroup.appendChild(yTitle);
  
  // Y-axis ticks (will be updated dynamically)
  const yTicksGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  yTicksGroup.setAttribute('class', 'y-ticks');
  yAxisGroup.appendChild(yTicksGroup);
  
  function updateYAxis() {
    yTicksGroup.innerHTML = '';
    gridGroup.innerHTML = '';
    
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
      const val = (yMax / numTicks) * i;
      const y = yScale(val);
      
      // Tick
      const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      tick.setAttribute('x1', -5);
      tick.setAttribute('y1', y);
      tick.setAttribute('x2', 0);
      tick.setAttribute('y2', y);
      tick.setAttribute('stroke', COLORS.axis);
      tick.setAttribute('stroke-width', '2');
      yTicksGroup.appendChild(tick);
      
      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', -10);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.setAttribute('fill', COLORS.text);
      label.setAttribute('font-size', '12');
      label.textContent = Math.round(val);
      yTicksGroup.appendChild(label);
      
      // Grid line
      if (i > 0) {
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', CHART_WIDTH);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', COLORS.grid);
        gridLine.setAttribute('stroke-width', '1');
        gridLine.setAttribute('stroke-dasharray', '4,4');
        gridGroup.appendChild(gridLine);
      }
    }
  }
  
  // Title
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  title.setAttribute('x', WIDTH / 2);
  title.setAttribute('y', 25);
  title.setAttribute('text-anchor', 'middle');
  title.setAttribute('fill', '#9efcff');
  title.setAttribute('font-size', '16');
  title.setAttribute('font-weight', '700');
  title.textContent = 'Brute Force k-Means Optimization';
  svg.appendChild(title);
  
  function updateBars() {
    // Find max for scale
    const maxF = Math.max(...Object.values(state.fAverages), 10);
    yMax = Math.ceil(maxF * 1.2 / 10) * 10;
    if (yMax < 50) yMax = 50;
    
    updateYAxis();
    
    // Find best k
    let bestK = K_VALUES[0];
    let bestF = 0;
    K_VALUES.forEach(k => {
      if (state.fAverages[k] > bestF) {
        bestF = state.fAverages[k];
        bestK = k;
      }
    });
    state.bestK = bestK;
    
    // Update bars
    K_VALUES.forEach(k => {
      const f = state.fAverages[k];
      const barHeight = (f / yMax) * CHART_HEIGHT;
      const y = CHART_HEIGHT - barHeight;
      
      bars[k].setAttribute('y', y);
      bars[k].setAttribute('height', barHeight);
      bars[k].setAttribute('fill', k === bestK && f > 0 ? COLORS.barHighlight : COLORS.bar);
      
      if (f > 0) {
        barLabels[k].setAttribute('y', y - 8);
        barLabels[k].textContent = f.toFixed(1);
      } else {
        barLabels[k].textContent = '';
      }
    });
  }
  
  // Initial render
  updateYAxis();
  
  // UI elements
  const runBtn = document.getElementById('bruteforce-run-btn');
  const statusDiv = document.getElementById('bruteforce-status');
  
  function updateStatus(text) {
    if (statusDiv) statusDiv.textContent = text;
  }
  
  async function runBruteForce() {
    if (state.running) return;
    state.running = true;
    
    // Reset state
    K_VALUES.forEach(k => {
      state.fSums[k] = 0;
      state.fCounts[k] = 0;
      state.fAverages[k] = 0;
    });
    state.trialCount = 0;
    updateBars();
    
    runBtn.disabled = true;
    runBtn.style.opacity = '0.5';
    runBtn.textContent = 'Running...';
    
    // Generate base data once
    const baseData = generateData();
    
    for (let trial = 0; trial < NUM_TRIALS; trial++) {
      const startTime = performance.now();
      
      // Random k
      const k = K_VALUES[Math.floor(Math.random() * K_VALUES.length)];
      
      // Run k-means
      const { centroids, assignments } = kMeans(baseData, k);
      
      // Calculate F
      const f = calculateF(baseData, centroids, assignments);
      
      // Update state
      state.fSums[k] += f;
      state.fCounts[k]++;
      state.fAverages[k] = state.fSums[k] / state.fCounts[k];
      state.trialCount++;
      
      // Update visualization
      updateBars();
      updateStatus(`Trial ${state.trialCount}/${NUM_TRIALS} — Best k = ${state.bestK} (F = ${state.fAverages[state.bestK].toFixed(1)})`);
      
      // Ensure minimum delay
      const elapsed = performance.now() - startTime;
      if (elapsed < MIN_DELAY) {
        await new Promise(r => setTimeout(r, MIN_DELAY - elapsed));
      }
    }
    
    state.running = false;
    runBtn.disabled = false;
    runBtn.style.opacity = '1';
    runBtn.textContent = '▶ Run Again';
    updateStatus(`Complete! Best k = ${state.bestK} with F = ${state.fAverages[state.bestK].toFixed(1)}`);
  }
  
  if (runBtn) {
    runBtn.addEventListener('click', runBruteForce);
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="kmeans-strengths-limitations" -->
## Strengths and Limitations

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Strengths**

-! Fast and computationally efficient

-! Scales well to large datasets

-! Results are easy to interpret

-! Works well when clusters are roughly spherical and similar in size

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Limitations**

-! Must specify *k* in advance

-! Assumes clusters are convex and equally sized

-! Sensitive to outliers (they pull centroids)

-! Cannot detect elongated or irregular cluster shapes

***

-? When clusters have very different sizes or shapes, k-Means may fail

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="kmeans-limitations-demo" -->
## When k-Means Fails

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Non-Spherical Cluster Shapes**

-! k-Means assumes *spherical* clusters

-! It fails with:
-: Nested or concentric structures
-: Elongated "sausage" shapes
-: Interleaving patterns (moons)

-! Even with correct k and many restarts, the algorithm cannot find the true structure

-? k-Means minimizes variance, not shape detection

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="kmeans-fail-container" style="width: 100%; position: relative;">
  <div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
    <div id="kmeans-fail-moons" style="width: 280px; height: 200px;"></div>
    <div id="kmeans-fail-donut" style="width: 280px; height: 200px;"></div>
    <div id="kmeans-fail-sausages" style="width: 280px; height: 200px;"></div>
  </div>
  <div style="display: flex; justify-content: center; margin-top: 15px;">
    <button id="kmeans-fail-run-btn" style="padding: 12px 28px; background: #3a1e1e; color: #ff6b6b; border: 2px solid #ff6b6b; border-radius: 8px; cursor: pointer; font-size: 1em; font-weight: 700;">▶ Run k-Means (Watch it Fail!)</button>
  </div>
  <div id="kmeans-fail-status" style="text-align: center; margin-top: 8px; color: #9efcff; font-size: 0.85em;">Click to see k-Means struggle with non-spherical clusters</div>
</div>

<script>
(function() {
  const stateKey = 'kmeansFailState';
  if (window[stateKey] && window[stateKey].initialized) return;
  
  const COLORS = {
    bg: '#0f172a',
    unassigned: '#6b7280',
    clusters: ['#ff6b6b', '#00d4ff', '#00ff88', '#fbbf24', '#a78bfa'],
    centroid: '#ffffff'
  };
  
  const state = { initialized: true };
  window[stateKey] = state;
  
  // Generate two moons pattern - interlocking like ( )
  function generateMoons(n = 200) {
    const points = [];
    const radius = 50;
    const noise = 8;
    // Upper moon - like (
    for (let i = 0; i < n / 2; i++) {
      const angle = Math.PI * (i / (n / 2)) - Math.PI / 2; // from -90° to +90°
      const r = radius + (Math.random() - 0.5) * noise;
      points.push({ 
        x: 100 + r * Math.cos(angle), 
        y: 80 + r * Math.sin(angle), 
        trueCluster: 0 
      });
    }
    // Lower moon - like ) but shifted down and right to interlock
    for (let i = 0; i < n / 2; i++) {
      const angle = Math.PI * (i / (n / 2)) + Math.PI / 2; // from +90° to +270°
      const r = radius + (Math.random() - 0.5) * noise;
      points.push({ 
        x: 130 + r * Math.cos(angle), 
        y: 120 + r * Math.sin(angle), 
        trueCluster: 1 
      });
    }
    return points;
  }
  
  // Generate donut with center cluster
  function generateDonut(n = 200) {
    const points = [];
    // Outer ring
    for (let i = 0; i < n * 0.7; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = 70 + (Math.random() - 0.5) * 25;
      points.push({ x: 140 + r * Math.cos(angle), y: 100 + r * Math.sin(angle), trueCluster: 0 });
    }
    // Inner cluster
    for (let i = 0; i < n * 0.3; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = Math.random() * 25;
      points.push({ x: 140 + r * Math.cos(angle), y: 100 + r * Math.sin(angle), trueCluster: 1 });
    }
    return points;
  }
  
  // Generate sausage clusters
  function generateSausages(n = 200) {
    const points = [];
    const numSausages = 5;
    const sausageWidth = 50;
    const sausageHeight = 15;
    for (let s = 0; s < numSausages; s++) {
      const centerY = 30 + s * 35;
      const numPoints = Math.floor(n / numSausages);
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: 30 + Math.random() * 220,
          y: centerY + (Math.random() - 0.5) * sausageHeight,
          trueCluster: s
        });
      }
    }
    return points;
  }
  
  function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }
  
  function kMeans(points, k, maxIter = 30) {
    // Random initialization
    const centroids = [];
    const indices = [...Array(points.length).keys()];
    for (let i = 0; i < k; i++) {
      const idx = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];
      centroids.push({ x: points[idx].x, y: points[idx].y });
    }
    
    let assignments = new Array(points.length).fill(0);
    
    for (let iter = 0; iter < maxIter; iter++) {
      // Assign
      const newAssignments = points.map(p => {
        let minDist = Infinity, minIdx = 0;
        centroids.forEach((c, i) => {
          const d = distance(p, c);
          if (d < minDist) { minDist = d; minIdx = i; }
        });
        return minIdx;
      });
      
      if (JSON.stringify(newAssignments) === JSON.stringify(assignments)) break;
      assignments = newAssignments;
      
      // Update
      for (let i = 0; i < k; i++) {
        const cp = points.filter((_, idx) => assignments[idx] === i);
        if (cp.length > 0) {
          centroids[i] = {
            x: cp.reduce((s, p) => s + p.x, 0) / cp.length,
            y: cp.reduce((s, p) => s + p.y, 0) / cp.length
          };
        }
      }
    }
    return { centroids, assignments };
  }
  
  function createPlot(containerId, title, points, k) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    const width = 280, height = 200;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(svg);
    
    // Background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', width);
    bg.setAttribute('height', height);
    bg.setAttribute('fill', COLORS.bg);
    bg.setAttribute('rx', '6');
    svg.appendChild(bg);
    
    // Title
    const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleEl.setAttribute('x', width / 2);
    titleEl.setAttribute('y', 16);
    titleEl.setAttribute('text-anchor', 'middle');
    titleEl.setAttribute('fill', '#9efcff');
    titleEl.setAttribute('font-size', '12');
    titleEl.setAttribute('font-weight', '600');
    titleEl.textContent = title;
    svg.appendChild(titleEl);
    
    return { svg, points, k, width, height };
  }
  
  function renderPlot(plot, assignments = null, centroids = null) {
    if (!plot) return;
    const { svg, points, k, width, height } = plot;
    
    // Remove old points and centroids
    svg.querySelectorAll('.point, .centroid').forEach(el => el.remove());
    
    // Draw points
    points.forEach((p, idx) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', p.x);
      circle.setAttribute('cy', p.y);
      circle.setAttribute('r', 3);
      circle.setAttribute('class', 'point');
      
      if (assignments) {
        circle.setAttribute('fill', COLORS.clusters[assignments[idx] % COLORS.clusters.length]);
      } else {
        circle.setAttribute('fill', COLORS.unassigned);
      }
      circle.style.transition = 'fill 0.3s ease';
      svg.appendChild(circle);
    });
    
    // Draw centroids
    if (centroids) {
      centroids.forEach((c, i) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('class', 'centroid');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', c.x);
        circle.setAttribute('cy', c.y);
        circle.setAttribute('r', 8);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', COLORS.clusters[i % COLORS.clusters.length]);
        circle.setAttribute('stroke-width', '3');
        g.appendChild(circle);
        
        const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line1.setAttribute('x1', c.x - 5);
        line1.setAttribute('y1', c.y - 5);
        line1.setAttribute('x2', c.x + 5);
        line1.setAttribute('y2', c.y + 5);
        line1.setAttribute('stroke', COLORS.clusters[i % COLORS.clusters.length]);
        line1.setAttribute('stroke-width', '2');
        g.appendChild(line1);
        
        const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line2.setAttribute('x1', c.x + 5);
        line2.setAttribute('y1', c.y - 5);
        line2.setAttribute('x2', c.x - 5);
        line2.setAttribute('y2', c.y + 5);
        line2.setAttribute('stroke', COLORS.clusters[i % COLORS.clusters.length]);
        line2.setAttribute('stroke-width', '2');
        g.appendChild(line2);
        
        svg.appendChild(g);
      });
    }
  }
  
  // Initialize plots
  const moonPoints = generateMoons();
  const donutPoints = generateDonut();
  const sausagePoints = generateSausages();
  
  const plotMoons = createPlot('kmeans-fail-moons', 'Two Moons (k=2)', moonPoints, 2);
  const plotDonut = createPlot('kmeans-fail-donut', 'Donut + Center (k=2)', donutPoints, 2);
  const plotSausages = createPlot('kmeans-fail-sausages', '5 Sausages (k=5)', sausagePoints, 5);
  
  // Initial render (unassigned)
  renderPlot(plotMoons);
  renderPlot(plotDonut);
  renderPlot(plotSausages);
  
  // Run button
  const runBtn = document.getElementById('kmeans-fail-run-btn');
  const statusDiv = document.getElementById('kmeans-fail-status');
  
  async function runKMeans() {
    if (!runBtn) return;
    runBtn.disabled = true;
    runBtn.style.opacity = '0.5';
    
    statusDiv.textContent = 'Running k-Means with random starts...';
    
    // Reset to unassigned
    renderPlot(plotMoons);
    renderPlot(plotDonut);
    renderPlot(plotSausages);
    
    await new Promise(r => setTimeout(r, 500));
    
    // Run k-means on each
    const resultMoons = kMeans(moonPoints, 2);
    renderPlot(plotMoons, resultMoons.assignments, resultMoons.centroids);
    
    await new Promise(r => setTimeout(r, 300));
    
    const resultDonut = kMeans(donutPoints, 2);
    renderPlot(plotDonut, resultDonut.assignments, resultDonut.centroids);
    
    await new Promise(r => setTimeout(r, 300));
    
    const resultSausages = kMeans(sausagePoints, 5);
    renderPlot(plotSausages, resultSausages.assignments, resultSausages.centroids);
    
    statusDiv.textContent = 'k-Means converged — but the clusters are wrong! Click again to retry.';
    
    runBtn.disabled = false;
    runBtn.style.opacity = '1';
  }
  
  if (runBtn) {
    runBtn.addEventListener('click', runKMeans);
  }
})();
</script>

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
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="kmeans-r-container"></div>
  <div id="kmeans-r-plot" style="border: 0px solid #2d3a66; border-radius: 8px; min-height: 240px; display: flex; align-items: center; justify-content: center; color: #9efcffcc; font-size: 0.9em; text-align: center; padding: 12px;">
    Run the WebR example to see the k-means clusters.
  </div>
  <button id="kmeans-r-open-plot" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'kmeans-r-container';
  const plotContainerId = 'kmeans-r-plot';
  const openBtnId = 'kmeans-r-open-plot';
  const slideId = 'kmeans-r-example';

  const code = `# ===== K-MEANS CLUSTERING (base R) =====
set.seed(42)

# 100 points, 3 clusters
n1 <- 34; n2 <- 33; n3 <- 33
cluster1 <- cbind(rnorm(n1, -1.2, 0.35), rnorm(n1, -1.0, 0.35))
cluster2 <- cbind(rnorm(n2, 1.1, 0.35), rnorm(n2, 0.7, 0.35))
cluster3 <- cbind(rnorm(n3, -0.2, 0.35), rnorm(n3, 1.2, 0.35))

data <- rbind(cluster1, cluster2, cluster3)
colnames(data) <- c("x", "y")

# Run k-means
km <- kmeans(data, centers = 3, nstart = 10)

# Print summary
cat("Cluster sizes:\\n")
print(km$size)
cat("\\nCenters:\\n")
print(round(km$centers, 3))

# Plot clusters
colors <- c("#ff6b6b", "#4dd2ff", "#00ff88")
plot(data[,1], data[,2], pch = 19, cex = 1.2, col = colors[km$cluster],
     xlab = "x", ylab = "y", main = "k-Means (k=3)")
points(km$centers[,1], km$centers[,2], pch = 4, cex = 2.2, lwd = 2, col = "#111827")`;

  const fallbackOutput = `[Simulated in JavaScript]
Cluster sizes:
[1] 34 33 33

Centers:
      x      y
1 -1.204 -0.983
2  1.093  0.705
3 -0.211  1.205`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run k-Means (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 480,
        background: '#ffffff',
        altText: 'k-Means clusters plotted in 2D',
        loadingMessage: 'Rendering k-means plot...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the clusters.'
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

<!-- .slide:id="hca-vs-kmeans" -->
## Hierarchical vs. k-Means

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**When to Use Which?**

-! *Hierarchical clustering*:
-: Exploratory, no fixed k
-: Small to medium datasets
-: Want to see the full hierarchy

***

-! *k-Means*:
-: k is known or can be estimated
-: Large datasets
-: Need fast, scalable results

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Comparison**

<div style="font-size: 0.8em;">

| Aspect | Hierarchical | k-Means |
|:-------|:-------------|:--------|
| Specify k? | No | Yes |
| Output | Dendrogram | Partition |
| Scalability | Limited | High |
| Cluster shape | Flexible | Spherical |

</div>

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

<div id="validation-why-viz" style="width: 100%; max-width: 660px; height: 456px; margin-top: 10px;"></div>

<script>
(function() {
  const containerId = 'validation-why-viz';
  const stateKey = 'validationWhyState';
  if (window[stateKey] && window[stateKey].initialized) return;
  
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const WIDTH = 660, HEIGHT = 456;
  const COLORS = {
    bg: 'none',
    clusters: ['#ff6b6b', '#00d4ff', '#00ff88'],
    unassigned: '#6b7280',
    text: '#e2e8f0',
    accent: '#9efcff'
  };
  
  window[stateKey] = { initialized: true };
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', WIDTH);
  svg.setAttribute('height', HEIGHT);
  svg.setAttribute('viewBox', `0 0 ${WIDTH} ${HEIGHT}`);
  svg.style.display = 'block';
  container.appendChild(svg);
  
  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', WIDTH);
  bg.setAttribute('height', HEIGHT);
  bg.setAttribute('fill', COLORS.bg);
  bg.setAttribute('rx', '8');
  svg.appendChild(bg);
  
  // Generate structured data (3 clear clusters)
  function genStructured() {
    const pts = [];
    const centers = [{x:110,y:90},{x:110,y:190},{x:110,y:290}];
    centers.forEach((c,i) => {
      for(let j=0;j<35;j++) {
        pts.push({x: c.x + (Math.random()-0.5)*90, y: c.y + (Math.random()-0.5)*60, cluster: i});
      }
    });
    return pts;
  }
  
  // Generate random noise and cluster with k-means
  function genNoiseWithKMeans() {
    // Generate uniform random points
    const pts = [];
    for(let i=0;i<105;i++) {
      pts.push({x: 40 + Math.random()*150, y: 50 + Math.random()*280, cluster: 0});
    }
    
    // Run k-means on noise
    const k = 3;
    let centroids = [
      {x: 60 + Math.random()*80, y: 70 + Math.random()*60},
      {x: 60 + Math.random()*80, y: 160 + Math.random()*60},
      {x: 60 + Math.random()*80, y: 250 + Math.random()*60}
    ];
    
    for(let iter = 0; iter < 15; iter++) {
      // Assign to nearest centroid
      pts.forEach(p => {
        let minD = Infinity, minC = 0;
        centroids.forEach((c, i) => {
          const d = Math.sqrt((p.x-c.x)**2 + (p.y-c.y)**2);
          if(d < minD) { minD = d; minC = i; }
        });
        p.cluster = minC;
      });
      
      // Update centroids
      for(let i = 0; i < k; i++) {
        const cp = pts.filter(p => p.cluster === i);
        if(cp.length > 0) {
          centroids[i] = {
            x: cp.reduce((s,p) => s + p.x, 0) / cp.length,
            y: cp.reduce((s,p) => s + p.y, 0) / cp.length
          };
        }
      }
    }
    return pts;
  }
  
  const structuredPts = genStructured();
  const noisePts = genNoiseWithKMeans();
  
  // Left panel - Structured
  const leftG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  leftG.setAttribute('transform', 'translate(15, 0)');
  svg.appendChild(leftG);
  
  // Panel background
  const leftBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  leftBg.setAttribute('x', 0);
  leftBg.setAttribute('y', 35);
  leftBg.setAttribute('width', 220);
  leftBg.setAttribute('height', 340);
  leftBg.setAttribute('fill', '#1e293b');
  leftBg.setAttribute('rx', '8');
  leftG.appendChild(leftBg);
  
  // Title
  const leftTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  leftTitle.setAttribute('x', 110);
  leftTitle.setAttribute('y', 22);
  leftTitle.setAttribute('text-anchor', 'middle');
  leftTitle.setAttribute('fill', COLORS.accent);
  leftTitle.setAttribute('font-size', '20');
  leftTitle.setAttribute('font-weight', '700');
  leftTitle.textContent = 'Real Structure';
  leftG.appendChild(leftTitle);
  
  // Points
  structuredPts.forEach(p => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p.x);
    c.setAttribute('cy', p.y + 35);
    c.setAttribute('r', 6);
    c.setAttribute('fill', COLORS.clusters[p.cluster]);
    leftG.appendChild(c);
  });
  
  // Checkmark
  const check = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  check.setAttribute('x', 110);
  check.setAttribute('y', 410);
  check.setAttribute('text-anchor', 'middle');
  check.setAttribute('fill', '#00ff88');
  check.setAttribute('font-size', '24');
  check.setAttribute('font-weight', '700');
  check.textContent = '? Meaningful';
  leftG.appendChild(check);
  
  // Right panel - Noise
  const rightG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  rightG.setAttribute('transform', 'translate(255, 0)');
  svg.appendChild(rightG);
  
  // Panel background
  const rightBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rightBg.setAttribute('x', 0);
  rightBg.setAttribute('y', 35);
  rightBg.setAttribute('width', 220);
  rightBg.setAttribute('height', 340);
  rightBg.setAttribute('fill', '#1e293b');
  rightBg.setAttribute('rx', '8');
  rightG.appendChild(rightBg);
  
  // Title
  const rightTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  rightTitle.setAttribute('x', 110);
  rightTitle.setAttribute('y', 22);
  rightTitle.setAttribute('text-anchor', 'middle');
  rightTitle.setAttribute('fill', COLORS.accent);
  rightTitle.setAttribute('font-size', '20');
  rightTitle.setAttribute('font-weight', '700');
  rightTitle.textContent = 'Just Noise';
  rightG.appendChild(rightTitle);
  
  // Points
  noisePts.forEach(p => {
    const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('cx', p.x);
    c.setAttribute('cy', p.y + 35);
    c.setAttribute('r', 6);
    c.setAttribute('fill', COLORS.clusters[p.cluster]);
    rightG.appendChild(c);
  });
  
  // X mark
  const xMark = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  xMark.setAttribute('x', 110);
  xMark.setAttribute('y', 410);
  xMark.setAttribute('text-anchor', 'middle');
  xMark.setAttribute('fill', '#ff6b6b');
  xMark.setAttribute('font-size', '24');
  xMark.setAttribute('font-weight', '700');
  xMark.textContent = '✗ Artifact';
  rightG.appendChild(xMark);
  
  // Middle section - question
  const midG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  midG.setAttribute('transform', 'translate(495, 40)');
  svg.appendChild(midG);
  
  // Big question mark
  const qMark = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  qMark.setAttribute('x', 80);
  qMark.setAttribute('y', 120);
  qMark.setAttribute('text-anchor', 'middle');
  qMark.setAttribute('fill', '#fbbf24');
  qMark.setAttribute('font-size', '100');
  qMark.setAttribute('font-weight', '700');
  qMark.textContent = '?';
  midG.appendChild(qMark);
  
  // Question text
  const qText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  qText1.setAttribute('x', 80);
  qText1.setAttribute('y', 180);
  qText1.setAttribute('text-anchor', 'middle');
  qText1.setAttribute('fill', COLORS.text);
  qText1.setAttribute('font-size', '18');
  qText1.setAttribute('font-weight', '600');
  qText1.textContent = 'Both have';
  midG.appendChild(qText1);
  
  const qText1b = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  qText1b.setAttribute('x', 80);
  qText1b.setAttribute('y', 205);
  qText1b.setAttribute('text-anchor', 'middle');
  qText1b.setAttribute('fill', COLORS.text);
  qText1b.setAttribute('font-size', '18');
  qText1b.setAttribute('font-weight', '600');
  qText1b.textContent = '3 clusters';
  midG.appendChild(qText1b);
  
  const qText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  qText2.setAttribute('x', 80);
  qText2.setAttribute('y', 250);
  qText2.setAttribute('text-anchor', 'middle');
  qText2.setAttribute('fill', COLORS.accent);
  qText2.setAttribute('font-size', '22');
  qText2.setAttribute('font-weight', '700');
  qText2.textContent = 'Which is real?';
  midG.appendChild(qText2);
  
  // Arrow pointing to validation
  const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow.setAttribute('d', 'M80,275 L80,315 L95,300 M80,315 L65,300');
  arrow.setAttribute('stroke', '#fbbf24');
  arrow.setAttribute('stroke-width', '4');
  arrow.setAttribute('fill', 'none');
  midG.appendChild(arrow);
  
  const valText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  valText.setAttribute('x', 80);
  valText.setAttribute('y', 350);
  valText.setAttribute('text-anchor', 'middle');
  valText.setAttribute('fill', '#fbbf24');
  valText.setAttribute('font-size', '20');
  valText.setAttribute('font-weight', '700');
  valText.textContent = '→ Validate!';
  midG.appendChild(valText);
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-concepts" -->
## Cluster Validation Concepts

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Internal Validation**

-! Evaluates clustering based on the data itself

-: Are objects within a cluster close to each other?

-: Are objects in different clusters far apart?

***

-! Key idea: *compact and well-separated* clusters are better

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**External Validation**

-! Compares clustering to external information

-: Known group labels (if available)

-: Independent measurements or classifications

***

<div style="font-size: 0.65em;">

| Validation type | Based on |
|:----------------|:---------|
| Internal | Data structure only |
| External | Independent reference |

</div>

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

-! After clustering, treat cluster labels as a grouping factor

-: Use **ANOVA** to test if clusters differ on each variable

-: Significant differences suggest clusters capture real structure

***

-! This connects clustering back to hypothesis testing

<!-- /position -->

<!-- position={row: 1, column: 2} -->
**Interpretation Caution**

-! ANOVA after clustering is descriptive, not confirmatory

-: The clusters were defined to maximize separation

-: p-values should not be interpreted as independent tests

***

-? Use ANOVA to characterize clusters, not to prove they exist

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="interpretation-emphasis" -->
## Interpretation Over Automation

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
**Clustering Requires Judgment**

-! Algorithms provide *candidates*, not answers

-: The analyst must decide if clusters are meaningful

-: Domain knowledge is essential

***

-! Ask yourself:
-: Do these clusters make scientific sense?
-: Can I explain why these samples group together?
-: Would a colleague reach the same interpretation?

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
