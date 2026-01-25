---
title: "Machine Learning"
author: "Gerrit Renner"
keywords: ["Machine Learning", "support vector machines", "random forests" ]
requirements: ["regression", "classification", "cluster analysis", "distance metrics"]
description: "Understanding and applying machine learning techniques in water science"
---
<!-- End of metadata -->

## Requirements
- regression
- classification
- cluster analysis
- distance metrics

---

<!-- .slide:id="cold-opener-1" -->
## What is shown here?

<svg width="320" height="346" viewBox="0 0 155.756 168.2977" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Abstract apple">
  <g transform="translate(-7.6185,-25.28158)">
    <path fill="#7bb128" d="m 81.173285,76.676189 c 0,-0.363802 0.06005,-0.51263 0.133452,-0.330729 0.0734,0.181901 0.0734,0.479557 0,0.661458 -0.0734,0.181901 -0.133452,0.03307 -0.133452,-0.330729 z M 43.511068,74.378782 c 0.190996,-0.07643 0.419199,-0.06703 0.507118,0.02089 0.08792,0.08792 -0.06835,0.150453 -0.347266,0.138964 -0.308225,-0.0127 -0.370919,-0.07539 -0.159852,-0.159852 z m 25.91573,-2.329168 C 53.15257,69.751524 40.342342,63.805748 32.935953,55.112649 27.420752,48.639293 24.160147,40.221596 23.143461,29.831994 l -0.309718,-3.165039 0.64003,-0.692691 0.64003,-0.692691 3.704166,0.169148 c 14.299653,0.65298 25.300301,4.736702 33.778518,12.53945 6.265387,5.766216 10.094045,11.608488 12.641736,19.29043 1.18865,3.584083 2.301981,8.774653 2.542784,11.854963 0.227966,2.916103 0.03045,3.151605 -2.703558,3.223415 -1.140736,0.02996 -3.233529,-0.109253 -4.650651,-0.309365 z m 28.373459,-8.173319 c 0,-0.05494 0.20836,-0.263302 0.463021,-0.463021 0.419644,-0.329107 0.429002,-0.319749 0.0999,0.09989 -0.345644,0.440729 -0.562916,0.580887 -0.562916,0.363126 z M 134.90865,42.412649 c 0.003,-0.582083 0.0571,-0.789054 0.1204,-0.459936 0.0633,0.329119 0.0609,0.805369 -0.005,1.058333 -0.0662,0.252965 -0.118,-0.01631 -0.11506,-0.598397 z"/>
    <path fill="#e90822" d="M 59.336581,193.21089 C 51.307557,191.61555 43.332093,186.83822 35.334151,178.83336 24.078415,167.56789 15.599023,153.35381 10.931653,137.92723 8.7560938,130.73658 7.8659802,125.34105 7.6570001,118.07755 7.3596488,107.74255 8.7708946,100.33548 12.377532,93.301352 17.110258,84.070985 26.030457,77.431903 36.681511,75.212506 c 4.366957,-0.909958 10.24776,-0.996022 15.21354,-0.222646 6.511013,1.014032 10.574374,2.260677 20.680768,6.344893 8.467511,3.421908 10.185919,3.913931 13.053606,3.737575 2.308225,-0.141951 4.392652,-0.828711 11.262922,-3.710818 8.466313,-3.551654 14.965653,-5.492012 21.465253,-6.408393 4.41579,-0.622583 12.84032,-0.437027 16.40344,0.361298 10.97308,2.45854 19.25021,8.789644 24.09154,18.427398 2.19416,4.367975 3.69573,9.918347 4.32396,15.982937 0.39703,3.83274 0.16603,13.18356 -0.41892,16.95769 -2.72456,17.57895 -10.17453,34.34068 -21.04146,47.34131 -6.88874,8.24133 -14.69207,14.31301 -22.13546,17.22335 -4.54668,1.77773 -6.78264,2.21808 -11.3294,2.23118 -4.73644,0.0137 -6.53625,-0.38053 -12.743303,-2.79097 -5.098314,-1.97987 -6.578371,-2.35804 -9.206557,-2.35237 -3.160107,0.007 -5.869413,0.69389 -12.907362,3.27323 -5.103399,1.87034 -9.937054,2.42143 -14.057497,1.60272 z m 91.219479,-75.65658 c 0.50262,-1.16416 1.17046,-3.06916 1.48408,-4.23333 0.73036,-2.71118 0.99435,-8.17045 0.54402,-11.2503 -0.94034,-6.431056 -4.89406,-12.480451 -10.25081,-15.684294 -2.76126,-1.651494 -5.23781,-2.493286 -8.8929,-3.022732 -2.52297,-0.365458 -3.4564,-0.38327 -6.27144,-0.119671 -3.89973,0.365168 -7.12835,1.049407 -6.58264,1.395052 0.20071,0.127124 0.74505,0.232957 1.20965,0.235185 1.06488,0.0051 5.89824,1.577299 7.78372,2.531883 2.78501,1.41 5.43148,3.406678 8.18525,6.175507 6.5388,6.57456 10.07774,14.65077 10.72299,24.47091 0.18766,2.856 0.19314,2.87432 0.6717,2.24896 0.26538,-0.34678 0.89375,-1.583 1.39638,-2.74717 z"/>
    <path fill="#b5835a" d="m 82.537867,78.791009 c -1.396605,-0.562705 -1.469501,-2.080018 -0.251441,-5.233648 3.997876,-10.35074 12.267183,-21.35596 20.931494,-27.856708 6.6535,-4.992063 13.52341,-8.298904 19.79328,-9.527531 3.13327,-0.613988 4.86214,-0.638676 6.94649,-0.09919 2.00668,0.519381 3.2384,1.494469 4.15663,3.290578 1.26996,2.484133 0.95835,5.636985 -0.75498,7.638622 -1.33107,1.555054 -2.4197,2.027878 -6.20513,2.695056 -6.2333,1.098616 -11.35904,2.824736 -16.81077,5.66112 -9.50201,4.943626 -16.1054,10.886892 -23.195071,20.876312 -1.75659,2.475052 -3.041853,3.187416 -4.610502,2.555393 z"/>
  </g>
</svg>

---

<!-- .slide:id="cold-opener-2" -->
## Why do we know this?

---

<!-- .slide:id="definition-ml" -->
## Definition of Machine Learning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="important-terms-ml" -->
## Important Terms in Machine Learning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="types-of-ml" -->
## Types of Machine Learning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-00-cold-opener" -->
## Cold Opener: Exceedance Alert?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Scenario (coastal bathing water)
-: after heavy rain, contamination risk increases
-: lab results arrive tomorrow, but actions are needed now

***

-? Task: decide which sites to close / re-sample today
-: estimate p(class 1) = "exceeds E. coli threshold"
-: choose a decision threshold based on risk tolerance

***

-! What data could help?
-: rainfall (24h), turbidity, upstream discharge, season
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="border: 1px solid #2d3a66; border-radius: 10px; padding: 14px; background: rgba(0,0,0,0.15);">
  <div style="font-size: 0.8em; color: #9efcff; font-weight: 700; margin-bottom: 10px;">
    Today's quick measurements (no lab yet)
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.72em; color: #ffffff;">
    <thead>
      <tr style="background: #2d3a5a;">
        <th style="padding: 8px; text-align: left;">Site</th>
        <th style="padding: 8px; text-align: right;">Rain (mm)</th>
        <th style="padding: 8px; text-align: right;">Turb (NTU)</th>
        <th style="padding: 8px; text-align: right;">Q (m^3/s)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background: rgba(0,255,255,0.06);">
        <td style="padding: 8px;">A</td><td style="padding: 8px; text-align: right;">6</td><td style="padding: 8px; text-align: right;">3</td><td style="padding: 8px; text-align: right;">12</td>
      </tr>
      <tr style="background: rgba(0,255,255,0.03);">
        <td style="padding: 8px;">B</td><td style="padding: 8px; text-align: right;">28</td><td style="padding: 8px; text-align: right;">18</td><td style="padding: 8px; text-align: right;">45</td>
      </tr>
      <tr style="background: rgba(0,255,255,0.06);">
        <td style="padding: 8px;">C</td><td style="padding: 8px; text-align: right;">14</td><td style="padding: 8px; text-align: right;">8</td><td style="padding: 8px; text-align: right;">22</td>
      </tr>
      <tr style="background: rgba(0,255,255,0.03);">
        <td style="padding: 8px;">D</td><td style="padding: 8px; text-align: right;">2</td><td style="padding: 8px; text-align: right;">1</td><td style="padding: 8px; text-align: right;">9</td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top: 12px; font-size: 0.78em; color: #9efcffcc;">
    Goal: a model that outputs a probability for class 1 (exceedance) from these predictors.
  </div>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-01-motivation" -->
## Logistic Regression - Motivation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Typical task: binary outcome (class 1 / class 0)
-: exceeds limit vs compliant; detected vs not detected
-: e.g., "E. coli above bathing-water threshold?"

***

-! We want a probability, not a number
-: p(class 1) supports risk communication and prioritization
-: decision threshold tuned to false alarms vs missed events

***

-! Why not linear regression?
-: it predicts an unbounded value (<0 or >1 possible)
-: but probabilities must stay in [0,1]
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-motivation-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= linear regression not suitable in this case

<script>
(function() {
  const containerId = 'logreg-motivation-plot';
  const slideId = 'logistic-regression-01-motivation';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 30, right: 30, bottom: 90, left: 90 };

    const fig = plotUtils.createFigure(containerId, width, height, margin);
    plotUtils.addAxes(fig, [0, 10], [-0.5, 1.5], 6, 5);

    // Make the root SVG match the slide's dark panel styling.
    d3.select(`#${containerId} svg`)
      .style('background-color', 'rgba(15,23,42,0.85)')
      .style('border-radius', '12px');

    // Probability band [0,1].
    fig.svg.append('rect')
      .attr('x', fig.xScale(0))
      .attr('y', fig.yScale(1))
      .attr('width', fig.xScale(10) - fig.xScale(0))
      .attr('height', fig.yScale(0) - fig.yScale(1))
      .attr('fill', 'rgba(0,255,255,0.18)')
      .attr('stroke', '#00ffff')
      .attr('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', fig.xScale(0) + 10)
      .attr('y', fig.yScale(1) - 12)
      .style('fill', '#ffffff')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('valid probability range [0,1]');

    // Generate deterministic points (binary targets 0/1 with small noise).
    const rng = seededRandom(17);
    const jitter = (s) => (rng() * 2 - 1) * s;
    const points = [];

    const n0 = 18;
    const n1 = 18;
    for (let i = 0; i < n0; i++) {
      // class 0 mostly at low x, but with a small overlap region
      const xRaw = 0 + (i / (n0 - 1)) * 6 + jitter(0.18);
      const x = Math.max(0, Math.min(6, xRaw));
      const y = 0;
      points.push({ x, y, cls: 0 });
    }
    for (let i = 0; i < n1; i++) {
      // class 1 mostly at high x, but with a small overlap region
      const xRaw = 5 + (i / (n1 - 1)) * 5 + jitter(0.18);
      const x = Math.max(5, Math.min(10, xRaw));
      const y = 1;
      points.push({ x, y, cls: 1 });
    }

    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.x))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => d.cls === 1 ? '#00ff94' : '#ff6b35')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.98);

    // "Linear regression" fit (unbounded).
    const lineData = d3.range(0, 10.001, 0.05).map(x => ({
      x,
      y: -0.2 + 0.15 * x
    }));

    const line = d3.line()
      .x(d => fig.xScale(d.x))
      .y(d => fig.yScale(d.y));

    fig.svg.append('path')
      .datum(lineData)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#ff05ff')
      .attr('stroke-width', 5)
      .attr('opacity', 0.95);

    // Axis labels.
    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 60)
      .attr('text-anchor', 'middle')
      .style('fill', '#0ff')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('predictor x (e.g., turbidity)');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -60)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', '#0ff')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('model output');

    // Legend.
    const legend = fig.svg.append('g')
      .attr('transform', `translate(${fig.width - 300}, 10)`);

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 290)
      .attr('height', 92)
      .attr('rx', 10)
      .attr('fill', 'rgba(0,0,0,0.55)')
      .attr('stroke', 'rgba(0,255,255,0.35)')
      .attr('stroke-width', 2);

    legend.append('circle').attr('cx', 18).attr('cy', 25).attr('r', 6).attr('fill', '#ff6b35').attr('stroke', '#ffffff').attr('stroke-width', 2);
    legend.append('text').attr('x', 34).attr('y', 30).style('fill', '#ffffff').style('font-size', '12px').text('class 0 (no exceedance)');

    legend.append('circle').attr('cx', 18).attr('cy', 50).attr('r', 6).attr('fill', '#00ff94').attr('stroke', '#ffffff').attr('stroke-width', 2);
    legend.append('text').attr('x', 34).attr('y', 55).style('fill', '#ffffff').style('font-size', '12px').text('class 1 (exceedance)');

    legend.append('line').attr('x1', 8).attr('y1', 74).attr('x2', 30).attr('y2', 74).attr('stroke', '#ff05ff').attr('stroke-width', 5);
    legend.append('text').attr('x', 34).attr('y', 79).style('fill', '#ffffff').style('font-size', '12px').text('linear regression output');

    // Annotation hint.
    fig.svg.append('rect')
      .attr('x', fig.xScale(5.2))
      .attr('y', fig.yScale(-0.35))
      .attr('width', 310)
      .attr('height', 28)
      .attr('rx', 8)
      .attr('fill', 'rgba(0,0,0,0.55)')
      .attr('stroke', 'rgba(255,5,255,0.5)');

    fig.svg.append('text')
      .attr('x', fig.xScale(5.2) + 10)
      .attr('y', fig.yScale(-0.35) + 19)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text('extrapolation can leave [0,1]');
  }

  function onSlide(event) {
    if (!event || !event.currentSlide) return;
    if (event.currentSlide.getAttribute('id') !== slideId) return;
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', draw);
  } else {
    draw();
  }

  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', onSlide);
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-01a-labeled-data" -->
## How Do We Get the Weights?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Step 0: collect labeled training data (x, y)
-: x = predictors today; y = lab-confirmed class 1 / class 0 (historical)

***

-! Start with a model guess (beta)
-: compute z and p(class 1) for each labeled sample
-: mismatch in the overlap region shows "we need a better beta"

***

-! Fit beta by optimization
-: update beta to reduce cross-entropy on the labeled data
-: result: probabilities match labels better and calibrate decisions
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-labeled-fit-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>

<script>
(function() {
  const containerId = 'logreg-labeled-fit-plot';
  const slideId = 'logistic-regression-01a-labeled-data';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
  }

  function fmt(x) {
    return (Math.round(x * 1000) / 1000).toString();
  }

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 40, right: 30, bottom: 90, left: 90 };

    const fig = plotUtils.createFigure(containerId, width, height, margin);
    plotUtils.addAxes(fig, [0, 10], [-0.1, 1.1], 6, 6);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'rgba(15,23,42,0.85)')
      .style('border-radius', '12px');

    // Same underlying data distribution as slide 01 (x ranges + overlap).
    const rng = seededRandom(17);
    const jitter = (s) => (rng() * 2 - 1) * s;
    const points = [];
    const n0 = 14;
    const n1 = 14;

    for (let i = 0; i < n0; i++) {
      const xRaw = 0 + (i / (n0 - 1)) * 6 + jitter(0.18);
      const x = Math.max(0, Math.min(6, xRaw));
      points.push({ x, y: 0, cls: 0 });
    }
    for (let i = 0; i < n1; i++) {
      const xRaw = 5 + (i / (n1 - 1)) * 5 + jitter(0.18);
      const x = Math.max(5, Math.min(10, xRaw));
      points.push({ x, y: 1, cls: 1 });
    }

    // Visual guides at y=0 and y=1 (labels are binary).
    fig.svg.append('line')
      .attr('x1', fig.xScale(0)).attr('x2', fig.xScale(10))
      .attr('y1', fig.yScale(0)).attr('y2', fig.yScale(0))
      .attr('stroke', 'rgba(255,255,255,0.25)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');
    fig.svg.append('line')
      .attr('x1', fig.xScale(0)).attr('x2', fig.xScale(10))
      .attr('y1', fig.yScale(1)).attr('y2', fig.yScale(1))
      .attr('stroke', 'rgba(255,255,255,0.25)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');

    // Scatter of labeled data (y is exact 0/1).
    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.x))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => d.cls === 1 ? '#00ff94' : '#ff6b35')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.98);

    // Two parameter settings: "start" vs "after fitting".
    const betaStart = { b0: -5.0, b1: 1.0 };   // z = x - 5
    const betaFit = { b0: -4.4, b1: 1.25 };    // slightly shifted/steeper

    function zFromX(x, beta) {
      return beta.b0 + beta.b1 * x;
    }

    const curveX = d3.range(0, 10.001, 0.05);
    const curveStart = curveX.map(x => ({ x, p: sigmoid(zFromX(x, betaStart)) }));
    const curveFit = curveX.map(x => ({ x, p: sigmoid(zFromX(x, betaFit)) }));

    const line = d3.line()
      .x(d => fig.xScale(d.x))
      .y(d => fig.yScale(d.p));

    fig.svg.append('path')
      .datum(curveStart)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#ff05ff')
      .attr('stroke-width', 5)
      .attr('stroke-dasharray', '10 8')
      .attr('opacity', 0.9);

    fig.svg.append('path')
      .datum(curveFit)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', '#00ffff')
      .attr('stroke-width', 5)
      .attr('opacity', 0.95);

    // Labels.
    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 60)
      .attr('text-anchor', 'middle')
      .style('fill', '#0ff')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('predictor x (e.g., turbidity)');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -60)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', '#0ff')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('label y (0/1) and model p(class 1)');

    // Mini numeric "worked example" for 3 x values in/near overlap.
    const examples = [
      { x: 4.5, y: 0 },
      { x: 5.2, y: 1 },
      { x: 6.2, y: 1 },
    ].map(d => ({
      ...d,
      p0: sigmoid(zFromX(d.x, betaStart)),
      p1: sigmoid(zFromX(d.x, betaFit)),
    }));

    const box = fig.svg.append('g')
      .attr('transform', `translate(${fig.width - 320}, 10)`);

    box.append('rect')
      .attr('width', 312)
      .attr('height', 150)
      .attr('rx', 12)
      .attr('fill', 'rgba(0,0,0,0.55)')
      .attr('stroke', 'rgba(0,255,255,0.35)')
      .attr('stroke-width', 2);

    box.append('text')
      .attr('x', 14)
      .attr('y', 24)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace")
      .text('Worked example');

    box.append('text')
      .attr('x', 14)
      .attr('y', 48)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text(`start: b0=${fmt(betaStart.b0)}, b1=${fmt(betaStart.b1)}`);

    box.append('text')
      .attr('x', 14)
      .attr('y', 68)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text(`fit:   b0=${fmt(betaFit.b0)}, b1=${fmt(betaFit.b1)}`);

    examples.forEach((d, i) => {
      box.append('text')
        .attr('x', 14)
        .attr('y', 96 + i * 18)
        .style('fill', '#ffffff')
        .style('font-size', '12px')
        .text(`x=${fmt(d.x)}, y=${d.y}: p_start=${fmt(d.p0)}, p_fit=${fmt(d.p1)}`);
    });

    // Legend.
    const legend = fig.svg.append('g')
      .attr('transform', `translate(10, 10)`);

    legend.append('rect')
      .attr('width', 250)
      .attr('height', 96)
      .attr('rx', 12)
      .attr('fill', 'rgba(0,0,0,0.55)')
      .attr('stroke', 'rgba(0,255,255,0.35)')
      .attr('stroke-width', 2);

    legend.append('circle').attr('cx', 18).attr('cy', 26).attr('r', 6).attr('fill', '#ff6b35').attr('stroke', '#ffffff').attr('stroke-width', 2);
    legend.append('text').attr('x', 34).attr('y', 30).style('fill', '#ffffff').style('font-size', '12px').text('label y=0');
    legend.append('circle').attr('cx', 18).attr('cy', 50).attr('r', 6).attr('fill', '#00ff94').attr('stroke', '#ffffff').attr('stroke-width', 2);
    legend.append('text').attr('x', 34).attr('y', 54).style('fill', '#ffffff').style('font-size', '12px').text('label y=1');
    legend.append('line').attr('x1', 10).attr('y1', 74).attr('x2', 34).attr('y2', 74).attr('stroke', '#ff05ff').attr('stroke-width', 5).attr('stroke-dasharray', '10 8');
    legend.append('text').attr('x', 40).attr('y', 78).style('fill', '#ffffff').style('font-size', '12px').text('start model');
    legend.append('line').attr('x1', 140).attr('y1', 74).attr('x2', 164).attr('y2', 74).attr('stroke', '#00ffff').attr('stroke-width', 5);
    legend.append('text').attr('x', 170).attr('y', 78).style('fill', '#ffffff').style('font-size', '12px').text('after fit');
  }

  function onSlide(event) {
    if (!event || !event.currentSlide) return;
    if (event.currentSlide.getAttribute('id') !== slideId) return;
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', draw);
  } else {
    draw();
  }

  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', onSlide);
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-02-linear-to-logistic" -->
## From Linear Score to Logistic Model
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Step 1: compute a linear score z
-: combine many predictors into one "evidence" scale (weighted sum + intercept)
-: weights and intercept are learned from labeled training data (not chosen by hand)
-: intercept = baseline log-odds when all predictors are 0 (reference level)
$$z = \beta_0 + \beta_1 x_1 + \dots + \beta_p x_p$$

***

-! Step 2: turn z into a probability with sigmoid
-: p(class 1 | x) becomes bounded in [0,1] and interpretable
-: without sigmoid, z (or a linear output) is unbounded and not a probability
$$p = \frac{1}{1 + e^{-z}}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-score-sigmoid-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>

<script>
(function() {
  const containerId = 'logreg-score-sigmoid-plot';
  const slideId = 'logistic-regression-02-linear-to-logistic';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function styleAxis(g) {
    g.selectAll('path, line')
      .style('stroke', '#0ff')
      .style('stroke-width', '2px')
      .style('shape-rendering', 'crispEdges');
    g.selectAll('text')
      .style('fill', '#0ff')
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");
  }

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 40, right: 26, bottom: 70, left: 70 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    // Use the helper for container creation, but draw custom axes for 2 panels.
    fig.xAxisGroup.remove();
    fig.yAxisGroup.remove();

    d3.select(`#${containerId} svg`)
      .style('background-color', 'rgba(15,23,42,0.85)')
      .style('border-radius', '12px');

    const gap = 56;
    const panelH = (fig.height - gap) / 2;
    const xScale = d3.scaleLinear().domain([-6, 6]).range([0, fig.width]);

    const top = fig.svg.append('g').attr('transform', 'translate(0,0)');
    const bottom = fig.svg.append('g').attr('transform', `translate(0,${panelH + gap})`);

    const yTop = d3.scaleLinear().domain([-0.5, 1.5]).range([panelH, 0]);
    const yBot = d3.scaleLinear().domain([0, 1]).range([panelH, 0]);

    function drawPanelBackground(g) {
      g.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', fig.width)
        .attr('height', panelH)
        .attr('rx', 12)
        .attr('fill', 'rgba(0,0,0,0.06)')
        .attr('stroke', 'rgba(0,255,255,0.18)')
        .attr('stroke-width', 2);
    }

    function drawProbBand(g, yScale) {
      g.append('rect')
        .attr('x', xScale(-6))
        .attr('y', yScale(1))
        .attr('width', xScale(6) - xScale(-6))
        .attr('height', yScale(0) - yScale(1))
        .attr('fill', 'rgba(0,255,255,0.14)')
        .attr('stroke', '#00ffff')
        .attr('stroke-width', 1.5);
      g.append('line')
        .attr('x1', 0).attr('x2', fig.width)
        .attr('y1', yScale(0)).attr('y2', yScale(0))
        .attr('stroke', 'rgba(255,255,255,0.25)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6 6');
      g.append('line')
        .attr('x1', 0).attr('x2', fig.width)
        .attr('y1', yScale(1)).attr('y2', yScale(1))
        .attr('stroke', 'rgba(255,255,255,0.25)')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '6 6');
    }

    drawPanelBackground(top);
    drawPanelBackground(bottom);
    drawProbBand(top, yTop);
    drawProbBand(bottom, yBot);

    top.append('text')
      .attr('x', 10)
      .attr('y', -12)
      .style('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-family', "'Press Start 2P', monospace")
      .text('If output is linear (not a probability)');

    bottom.append('text')
      .attr('x', 10)
      .attr('y', -12)
      .style('fill', '#ffffff')
      .style('font-size', '13px')
      .style('font-family', "'Press Start 2P', monospace")
      .text('After sigmoid: probability p(class 1)');

    top.append('text')
      .attr('x', 10)
      .attr('y', 16)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text('y-hat (unbounded)');

    bottom.append('text')
      .attr('x', 10)
      .attr('y', 16)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text('p in [0,1]');

    // Axes (top: y + unlabeled x ticks; bottom: y + full x axis).
    const yAxisTop = top.append('g').call(d3.axisLeft(yTop).ticks(5));
    styleAxis(yAxisTop);
    const xAxisTop = top.append('g')
      .attr('transform', `translate(0,${panelH})`)
      .call(d3.axisBottom(xScale).ticks(7).tickFormat(() => ''));
    styleAxis(xAxisTop);

    const yAxisBot = bottom.append('g').call(d3.axisLeft(yBot).ticks(5));
    styleAxis(yAxisBot);
    const xAxisBot = bottom.append('g')
      .attr('transform', `translate(0,${panelH})`)
      .call(d3.axisBottom(xScale).ticks(7));
    styleAxis(xAxisBot);

    // Axis labels (bottom panel).
    bottom.append('text')
      .attr('x', fig.width / 2)
      .attr('y', panelH + 56)
      .attr('text-anchor', 'middle')
      .style('fill', '#0ff')
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace")
      .text('linear score z (example: z = x - 5)');

    // Use the same underlying x distribution as the previous slide:
    // class 0: x in [0,6], class 1: x in [5,10] (overlap 5..6).
    // Convert to a score with a simple 1-predictor example: z = x - 5 (i.e., beta0=-5, beta1=1).
    // In a real model, beta0 and beta1..betap are learned from labeled data by maximizing log-likelihood.
    const rng = seededRandom(17);
    const jitter = (s) => (rng() * 2 - 1) * s;
    const n0 = 18;
    const n1 = 18;
    const z0 = [];
    const z1 = [];

    for (let i = 0; i < n0; i++) {
      const xRaw = 0 + (i / (n0 - 1)) * 6 + jitter(0.18);
      const x = Math.max(0, Math.min(6, xRaw));
      z0.push(x - 5);
    }
    for (let i = 0; i < n1; i++) {
      const xRaw = 5 + (i / (n1 - 1)) * 5 + jitter(0.18);
      const x = Math.max(5, Math.min(10, xRaw));
      z1.push(x - 5);
    }
    const ptsTop = [
      ...z0.map(z => ({ z, y: 0, cls: 0 })),
      ...z1.map(z => ({ z, y: 1, cls: 1 })),
    ];

    top.append('g')
      .selectAll('circle')
      .data(ptsTop)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.z))
      .attr('cy', d => yTop(d.y))
      .attr('r', 6)
      .attr('fill', d => d.cls === 1 ? '#00ff94' : '#ff6b35')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.98);

    // Linear mapping (naive "probability") -> can exceed [0,1].
    const linData = d3.range(-6, 6.001, 0.05).map(z => ({ z, y: 0.5 + 0.2 * z }));
    top.append('path')
      .datum(linData)
      .attr('fill', 'none')
      .attr('stroke', '#ff05ff')
      .attr('stroke-width', 5)
      .attr('opacity', 0.95)
      .attr('d', d3.line().x(d => xScale(d.z)).y(d => yTop(d.y)));

    // Sigmoid curve + mapped points.
    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const sigData = d3.range(-6, 6.001, 0.05).map(z => ({ z, p: sigmoid(z) }));
    bottom.append('path')
      .datum(sigData)
      .attr('fill', 'none')
      .attr('stroke', '#00ffff')
      .attr('stroke-width', 5)
      .attr('opacity', 0.95)
      .attr('d', d3.line().x(d => xScale(d.z)).y(d => yBot(d.p)));

    const ptsBot = [
      ...z0.map(z => ({ z, p: sigmoid(z), cls: 0 })),
      ...z1.map(z => ({ z, p: sigmoid(z), cls: 1 })),
    ];
    bottom.append('g')
      .selectAll('circle')
      .data(ptsBot)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.z))
      .attr('cy', d => yBot(d.p))
      .attr('r', 6)
      .attr('fill', d => d.cls === 1 ? '#00ff94' : '#ff6b35')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('opacity', 0.98);

    // Visual cue: z=0 -> p=0.5.
    bottom.append('line')
      .attr('x1', xScale(0)).attr('x2', xScale(0))
      .attr('y1', 0).attr('y2', panelH)
      .attr('stroke', 'rgba(255,255,255,0.25)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');
    bottom.append('circle')
      .attr('cx', xScale(0))
      .attr('cy', yBot(0.5))
      .attr('r', 7)
      .attr('fill', '#ff6b35')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);
    bottom.append('text')
      .attr('x', xScale(0) + 10)
      .attr('y', yBot(0.5) - 10)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text('z=0 -> p=0.5');

    // Legend (top-right inside bottom panel).
    const legend = bottom.append('g').attr('transform', `translate(${fig.width - 260}, 8)`);
    legend.append('rect')
      .attr('width', 252)
      .attr('height', 88)
      .attr('rx', 10)
      .attr('fill', 'rgba(0,0,0,0.55)')
      .attr('stroke', 'rgba(0,255,255,0.35)')
      .attr('stroke-width', 2);
    legend.append('circle').attr('cx', 16).attr('cy', 24).attr('r', 6).attr('fill', '#ff6b35').attr('stroke', '#ffffff').attr('stroke-width', 2);
    legend.append('text').attr('x', 32).attr('y', 28).style('fill', '#ffffff').style('font-size', '12px').text('class 0');
    legend.append('circle').attr('cx', 16).attr('cy', 48).attr('r', 6).attr('fill', '#00ff94').attr('stroke', '#ffffff').attr('stroke-width', 2);
    legend.append('text').attr('x', 32).attr('y', 52).style('fill', '#ffffff').style('font-size', '12px').text('class 1');
    legend.append('line').attr('x1', 10).attr('y1', 72).attr('x2', 30).attr('y2', 72).attr('stroke', '#ff05ff').attr('stroke-width', 5);
    legend.append('text').attr('x', 32).attr('y', 76).style('fill', '#ffffff').style('font-size', '12px').text('linear');
    legend.append('line').attr('x1', 110).attr('y1', 72).attr('x2', 130).attr('y2', 72).attr('stroke', '#00ffff').attr('stroke-width', 5);
    legend.append('text').attr('x', 134).attr('y', 76).style('fill', '#ffffff').style('font-size', '12px').text('sigmoid');
  }

  function onSlide(event) {
    if (!event || !event.currentSlide) return;
    if (event.currentSlide.getAttribute('id') !== slideId) return;
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', draw);
  } else {
    draw();
  }

  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', onSlide);
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-03-sigmoid" -->
## The Sigmoid Function - Intuition
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Sigmoid turns evidence into confidence
-: large positive z -> p close to 1 (confident class 1)
-: large negative z -> p close to 0 (confident class 0)

***

-! Probabilities are explicit
-: p(class 1) and p(class 0)=1-p sum to 1
-: useful for ranking sites/samples by risk

***

-! Decision threshold is a policy choice
-: default 0.5, but shift for monitoring goals
-: lower threshold -> fewer missed exceedances (more alarms)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg width="640" height="520" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sigmoid with 0.5 threshold">
  <rect x="60" y="60" width="520" height="360" fill="none" stroke="#2d3a66" stroke-width="3" rx="12"/>
  <path d="M90 360 C 190 360, 240 340, 300 250 C 360 160, 410 140, 550 140" fill="none" stroke="#00ffff" stroke-width="4"/>
  <line x1="60" y1="250" x2="580" y2="250" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-dasharray="6 6"/>
  <circle cx="320" cy="250" r="6" fill="#ff6b35"/>
  <text x="330" y="242" fill="#ffb48a" font-size="16">p=0.5</text>
  <text x="70" y="430" fill="#9efcff" font-size="16">decision threshold</text>
</svg>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-04-interpretation" -->
## Model Interpretation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Each coefficient explains "what pushes risk up/down"
-: sign = direction; magnitude = strength (holding others fixed)
-: positive beta -> higher p(class 1) as that feature increases

***

-! Units matter for interpretation
-: 1 mg/L nitrate vs 1 NTU turbidity are not comparable
-: standardize/scale when comparing effect sizes

***

-! Often preferred in regulatory settings
-: transparent model, auditable reasoning
-: easy to report drivers behind class 1 predictions
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg width="640" height="520" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Coefficient effects">
  <rect x="70" y="80" width="500" height="320" rx="12" fill="none" stroke="#2d3a66" stroke-width="3"/>
  <line x1="320" y1="90" x2="320" y2="390" stroke="#9efcff" stroke-width="2" stroke-dasharray="6 6"/>

  <rect x="320" y="130" width="120" height="30" fill="#00ff94"/>
  <rect x="200" y="190" width="120" height="30" fill="#ff6b35"/>
  <rect x="320" y="250" width="180" height="30" fill="#00ff94"/>
  <rect x="240" y="310" width="80" height="30" fill="#ff6b35"/>

  <text x="120" y="150" fill="#9efcff" font-size="16">nitrate</text>
  <text x="120" y="210" fill="#9efcff" font-size="16">turbidity</text>
  <text x="120" y="270" fill="#9efcff" font-size="16">conductivity</text>
  <text x="120" y="330" fill="#9efcff" font-size="16">temperature</text>

  <text x="450" y="420" fill="#9efcff" font-size="16">right = positive effect</text>
  <text x="130" y="420" fill="#9efcff" font-size="16">left = negative effect</text>
</svg>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-05-decision-boundary" -->
## Decision Boundary
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Geometry: where the model is undecided
-: boundary is where probability hits the threshold
-: in 2D: a line; in higher D: a hyperplane

***

-! It's not just a hard split
-: probabilities vary smoothly across feature space
-: near boundary = uncertain; far away = confident

***

-! Link back to decisions
-: move the threshold -> move the boundary
-: choose based on consequences of missed exceedance vs false alarm
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg width="640" height="520" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="2D scatter with boundary">
  <defs>
    <linearGradient id="probShade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(255,107,53,0.08)"/>
      <stop offset="100%" stop-color="rgba(0,255,148,0.08)"/>
    </linearGradient>
  </defs>
  <rect x="60" y="60" width="520" height="360" fill="url(#probShade)" stroke="#2d3a66" stroke-width="3" rx="12"/>
  <line x1="90" y1="360" x2="550" y2="120" stroke="#9efcff" stroke-width="3"/>
  <circle cx="140" cy="320" r="7" fill="#ff6b35"/>
  <circle cx="190" cy="300" r="7" fill="#ff6b35"/>
  <circle cx="240" cy="330" r="7" fill="#ff6b35"/>
  <circle cx="210" cy="250" r="7" fill="#ff6b35"/>
  <circle cx="420" cy="160" r="7" fill="#00ff94"/>
  <circle cx="470" cy="190" r="7" fill="#00ff94"/>
  <circle cx="520" cy="140" r="7" fill="#00ff94"/>
  <circle cx="430" cy="240" r="7" fill="#00ff94"/>
  <text x="80" y="440" fill="#9efcff" font-size="16">probability shading</text>
  <text x="420" y="440" fill="#9efcff" font-size="16">boundary at decision threshold</text>
</svg>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-06-training" -->
## Training the Model
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Training fits probabilities to observed labels
-: maximize log-likelihood (same as minimizing cross-entropy)
-: objective matches the Bernoulli nature of class 1 / class 0

***

-! Why cross-entropy works well
-: confident-wrong predictions get a large penalty
-: encourages calibrated probabilities (not just correct classes)

***

-! Objective (binary)
$$\mathcal{L} = -\sum [y\log(p) + (1-y)\log(1-p)]$$
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg width="640" height="520" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cross-entropy loss intuition">
  <rect x="60" y="60" width="520" height="360" fill="none" stroke="#2d3a66" stroke-width="3" rx="12"/>
  <path d="M90 120 C 220 120, 260 200, 320 260 C 380 320, 440 360, 550 370" fill="none" stroke="#00ff94" stroke-width="4"/>
  <path d="M90 370 C 220 360, 260 320, 320 260 C 380 200, 440 140, 550 120" fill="none" stroke="#ff6b35" stroke-width="4"/>
  <text x="95" y="100" fill="#00ff94" font-size="16">loss for y=1</text>
  <text x="95" y="395" fill="#ff6b35" font-size="16">loss for y=0</text>
  <text x="330" y="440" fill="#9efcff" font-size="16">confident wrong -> high loss</text>
</svg>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-07-strengths-limitations" -->
## When to Use Logistic Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Use it as the default baseline
-: strong when relationships are roughly monotonic/linear in features
-: works well for early-warning and screening classifiers

***

-! Where it can fail
-: non-linear boundaries and strong interactions
-: missing key predictors -> misleading probabilities

***

-! Practical workflow
-: scale features; handle class imbalance
-: validate calibration + pick threshold with domain costs
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg width="640" height="520" viewBox="0 0 640 520" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Logistic regression vs random forest comparison">
  <rect x="60" y="80" width="520" height="320" rx="12" fill="none" stroke="#2d3a66" stroke-width="3"/>
  <text x="170" y="120" fill="#9efcff" font-size="18" text-anchor="middle">Logistic</text>
  <text x="470" y="120" fill="#9efcff" font-size="18" text-anchor="middle">Random Forest</text>
  <line x1="320" y1="90" x2="320" y2="380" stroke="#2d3a66" stroke-width="2"/>

  <text x="90" y="170" fill="#00ff94" font-size="16">interpretable</text>
  <text x="90" y="210" fill="#00ff94" font-size="16">fast, small data</text>
  <text x="90" y="250" fill="#ff6b35" font-size="16">linear boundary</text>

  <text x="350" y="170" fill="#00ff94" font-size="16">flexible boundary</text>
  <text x="350" y="210" fill="#00ff94" font-size="16">handles interactions</text>
  <text x="350" y="250" fill="#ff6b35" font-size="16">less transparent</text>
</svg>
<!-- /position -->
<!-- /layout -->
