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

Because perception becomes data, and data enables model-based inference.

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
-! Scenario: bathing water after heavy rain
-: lab result arrives tomorrow

***

-? Decision 1: close the beach today?
-: act on p(exceedance) now

***

-? Decision 2: send extra samples today?
-: prioritize the highest-risk sites
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="border: 1px solid var(--ml-panel-border); border-radius: 12px; padding: 12px; background: var(--ml-panel-bg); margin-bottom: 14px;">

  <svg viewBox="0 0 700 400" width="700" height="400" style="width: 100%; height: auto; display: block;" role="img" aria-label="Bathing water after heavy rain: beach, rain cloud, runoff into water, and a warning sign">
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0b1222" />
        <stop offset="100%" stop-color="#0f1b33" />
      </linearGradient>
      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1b3b7a" />
        <stop offset="100%" stop-color="#0b1e4a" />
      </linearGradient>
      <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#b9864a" />
        <stop offset="100%" stop-color="#8b5f2e" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.35" />
      </filter>
      <pattern id="rainPattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
        <line x1="2" y1="0" x2="2" y2="14" stroke="#7dd3fc" stroke-opacity="0.35" stroke-width="3" />
        <line x1="10" y1="4" x2="10" y2="18" stroke="#7dd3fc" stroke-opacity="0.25" stroke-width="3" />
      </pattern>
    </defs>
    <!-- sky -->
    <rect x="0" y="0" width="700" height="250" fill="url(#skyGrad)" />
    <!-- distant hills / city -->
    <path d="M0,210 C80,185 140,205 220,190 C290,178 360,205 430,194 C520,180 590,205 700,188 L700,250 L0,250 Z"
          fill="#0a1733" opacity="0.9" />
    <g opacity="0.55">
      <rect x="70" y="165" width="28" height="45" fill="#132a57" />
      <rect x="106" y="150" width="36" height="60" fill="#10244c" />
      <rect x="150" y="168" width="22" height="42" fill="#163161" />
      <rect x="520" y="158" width="40" height="52" fill="#10244c" />
      <rect x="566" y="172" width="26" height="38" fill="#132a57" />
    </g>
    <!-- rain cloud -->
    <g filter="url(#softShadow)">
      <path d="M210,90
               C215,62 240,46 265,52
               C275,34 300,26 320,38
               C340,22 370,28 382,50
               C404,48 420,62 422,84
               C444,90 458,106 452,128
               C448,156 420,172 392,166
               L250,166
               C222,170 198,150 200,122
               C202,106 212,96 210,90 Z"
            fill="#223555" stroke="#2f4a7a" stroke-width="3" />
      <rect x="230" y="168" width="200" height="150" fill="url(#rainPattern)" opacity="0.9" />
    </g>
    <!-- sand -->
    <path d="M0,250 C130,235 230,285 350,270 C460,256 560,300 700,275 L700,400 L0,400 Z"
          fill="url(#sandGrad)" />
    <!-- water -->
    <path d="M0,260 C120,290 230,260 350,285 C470,310 560,275 700,300 L700,400 L0,400 Z"
          fill="url(#waterGrad)" opacity="0.95" />
    <path d="M0,292 C140,322 260,292 380,315 C520,342 590,315 700,335" fill="none" stroke="#5ea7ff" stroke-opacity="0.35" stroke-width="4" />
    <path d="M0,330 C160,355 270,332 420,355 C560,378 610,360 700,380" fill="none" stroke="#5ea7ff" stroke-opacity="0.25" stroke-width="4" />
    <!-- runoff arrow -->
    <g opacity="0.95" filter="url(#softShadow)">
      <path d="M430,220 C460,240 490,255 520,270" fill="none" stroke="#7c3aed" stroke-width="10" stroke-linecap="round" />
      <path d="M520,270 L498,270 L512,254 Z" fill="#7c3aed" />
      <text x="450" y="235" fill="#d8b4fe" font-size="18" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        runoff after rain
      </text>
    </g>
    <!-- warning sign -->
    <g filter="url(#softShadow)">
      <rect x="90" y="210" width="18" height="160" rx="6" fill="#334155" />
      <path d="M70,235 L160,235 L160,300 L70,300 Z" fill="#0b1222" stroke="#fbbf24" stroke-width="6" />
      <path d="M115,250 L145,285 L85,285 Z" fill="#fbbf24" />
      <rect x="112" y="262" width="6" height="14" rx="3" fill="#0b1222" />
      <circle cx="115" cy="282" r="4" fill="#0b1222" />
      <text x="70" y="325" fill="#e2e8f0" font-size="16" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        possible exceedance
      </text>
    </g>
    <!-- lab + clock -->
    <g opacity="0.95" filter="url(#softShadow)">
      <rect x="520" y="38" width="150" height="70" rx="14" fill="#0b1222" stroke="#2f4a7a" stroke-width="3" />
      <g transform="translate(540,52)">
        <path d="M18,0 h20 v10 l10,16 a16,16 0 0 1 -14,24 h-12 a16,16 0 0 1 -14,-24 l10,-16 v-10 z"
              fill="#60a5fa" fill-opacity="0.25" stroke="#60a5fa" stroke-width="2" />
        <path d="M20,34 h28" stroke="#60a5fa" stroke-width="3" stroke-linecap="round" />
      </g>
      <g transform="translate(602,52)">
        <circle cx="18" cy="18" r="16" fill="#22c55e" fill-opacity="0.18" stroke="#22c55e" stroke-width="2" />
        <path d="M18,18 L18,9" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
        <path d="M18,18 L26,22" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
      </g>
      <text x="640" y="63" fill="#e2e8f0" font-size="16" font-weight="700" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        lab result
      </text>
      <text x="640" y="86" fill="#94a3b8" font-size="14" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        arrives tomorrow
      </text>
    </g>
  </svg>

</div>
<div style="border: 1px solid var(--ml-panel-border); border-radius: 12px; padding: 18px; background: var(--ml-panel-bg);">
  <div style="font-size: 0.9em; color: var(--ml-muted); font-weight: 700; margin-bottom: 12px;">
    Probability goal
  </div>
  <div style="font-size: 1.0em; color: var(--ml-text); line-height: 1.35;">
    Estimate <strong>p(exceedance)</strong> for each site <em>today</em>.
  </div>
  <div style="margin-top: 10px; font-size: 0.85em; color: var(--ml-muted); line-height: 1.35;">
    Use the same probability to compare sites and justify decisions.
  </div>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-00a-concrete-case" -->
## Concrete Case: Fast Tests vs. Lab Result
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Problem
-: we must decide <em>today</em>, but the lab label arrives <em>tomorrow</em>

***

-! What we can measure now (x)
-: fast test strip / sensor readings (minutes)
-: rainfall in last 24h, turbidity, conductivity, temperature, ...

***

-! What we learn later (y)
-: lab measurement (1 day) → exceedance yes/no
-: we already have the last days: fast tests + lab labels
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="border: 1px solid var(--ml-panel-border); border-radius: 12px; padding: 16px; background: var(--ml-panel-bg);">
  <div style="font-size: 0.9em; color: var(--ml-muted); font-weight: 700; margin-bottom: 10px;">
    Example dataset (last 7 days)
  </div>
  <table style="width: 100%; border-collapse: collapse; font-size: 0.85em; color: var(--ml-text);">
    <thead>
      <tr>
        <th style="text-align: right; padding: 4px 6px; border-bottom: 1px solid var(--ml-panel-border);">Day</th>
        <th style="text-align: right; padding: 4px 6px; border-bottom: 1px solid var(--ml-panel-border);">Rain 24h (mm)</th>
        <th style="text-align: right; padding: 4px 6px; border-bottom: 1px solid var(--ml-panel-border);">Turbidity (NTU)</th>
        <th style="text-align: right; padding: 4px 6px; border-bottom: 1px solid var(--ml-panel-border);">Quick E. coli (strip)</th>
        <th style="text-align: center; padding: 4px 6px; border-bottom: 1px solid var(--ml-panel-border);">Lab: exceedance (y)</th>
      </tr>
    </thead>
    <tbody>
      <tr><td style="text-align: right; padding: 3px 6px;">-7</td><td style="text-align: right; padding: 3px 6px;">0</td><td style="text-align: right; padding: 3px 6px;">2.1</td><td style="text-align: right; padding: 3px 6px;">0.10</td><td style="text-align: center; padding: 3px 6px;">0</td></tr>
      <tr><td style="text-align: right; padding: 3px 6px;">-6</td><td style="text-align: right; padding: 3px 6px;">3</td><td style="text-align: right; padding: 3px 6px;">3.4</td><td style="text-align: right; padding: 3px 6px;">0.12</td><td style="text-align: center; padding: 3px 6px;">0</td></tr>
      <tr><td style="text-align: right; padding: 3px 6px;">-5</td><td style="text-align: right; padding: 3px 6px;">12</td><td style="text-align: right; padding: 3px 6px;">7.8</td><td style="text-align: right; padding: 3px 6px;">0.30</td><td style="text-align: center; padding: 3px 6px;">1</td></tr>
      <tr><td style="text-align: right; padding: 3px 6px;">-4</td><td style="text-align: right; padding: 3px 6px;">6</td><td style="text-align: right; padding: 3px 6px;">4.9</td><td style="text-align: right; padding: 3px 6px;">0.18</td><td style="text-align: center; padding: 3px 6px;">0</td></tr>
      <tr><td style="text-align: right; padding: 3px 6px;">-3</td><td style="text-align: right; padding: 3px 6px;">25</td><td style="text-align: right; padding: 3px 6px;">11.2</td><td style="text-align: right; padding: 3px 6px;">0.55</td><td style="text-align: center; padding: 3px 6px;">1</td></tr>
      <tr><td style="text-align: right; padding: 3px 6px;">-2</td><td style="text-align: right; padding: 3px 6px;">0</td><td style="text-align: right; padding: 3px 6px;">2.4</td><td style="text-align: right; padding: 3px 6px;">0.09</td><td style="text-align: center; padding: 3px 6px;">0</td></tr>
      <tr><td style="text-align: right; padding: 3px 6px;">-1</td><td style="text-align: right; padding: 3px 6px;">9</td><td style="text-align: right; padding: 3px 6px;">6.1</td><td style="text-align: right; padding: 3px 6px;">0.24</td><td style="text-align: center; padding: 3px 6px;">1</td></tr>
      <tr>
        <td style="text-align: right; padding: 3px 6px;"><strong>today</strong></td>
        <td style="text-align: right; padding: 3px 6px;"><strong>8</strong></td>
        <td style="text-align: right; padding: 3px 6px;"><strong>6.8</strong></td>
        <td style="text-align: right; padding: 3px 6px;"><strong>0.26</strong></td>
        <td style="text-align: center; padding: 3px 6px;"><strong>?</strong></td>
      </tr>
    </tbody>
  </table>
  <div style="margin-top: 10px; font-size: 0.85em; color: var(--ml-muted); line-height: 1.35;">
    Train on past rows (<strong>x</strong> → <strong>y</strong>), then predict <strong>p(y=1 | x today)</strong>.
  </div>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-01-motivation" -->
## Logistic Regression - Motivation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Binary outcome
-: $f(x) = \\{0, 1\\}$
-: compliant or exceedance

***

-! Need a probability
-: $p(y=1 | x)$
-: supports risk-based decisions

***

-! Linear regression is not probability-aware
-: can output < 0 or > 1

-< Instead, we need a model that outputs valid probabilities
-: between 0 and 1
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-motivation-plot"></div>

<script>
(function() {
  const containerId = 'logreg-motivation-plot';
  const slideId = 'logistic-regression-01-motivation';

  function draw() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 780;
    const height = 820;
    const margin = { top: 30, right: 30, bottom: 90, left: 90 };

    const fig = plotUtils.createFigure(containerId, width, height, margin);
    plotUtils.addAxes(fig, [0, 10], [-0.4, 1.4], 6, 5);

    // Make the root SVG match the slide's dark panel styling.
    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    // Probability band [0,1].
    fig.svg.append('rect')
      .attr('x', fig.xScale(0))
      .attr('y', fig.yScale(1))
      .attr('width', fig.xScale(10) - fig.xScale(0))
      .attr('height', fig.yScale(0) - fig.yScale(1))
      .attr('fill', 'var(--ml-accent-cyan-soft-2)')
      .attr('stroke', 'var(--ml-accent-cyan)')
      .attr('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', fig.xScale(0) + 10)
      .attr('y', fig.yScale(1) - 12)
      .style('fill', 'var(--ml-text)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('valid probability range [0,1]');

    // Minimal, deterministic example points.
    const points = [
      { x: 1.2, y: 0, cls: 0 },
      { x: 2.6, y: 0, cls: 0 },
      { x: 4.8, y: 0, cls: 0 },
      { x: 5.2, y: 1, cls: 1 },
      { x: 7.2, y: 1, cls: 1 },
      { x: 8.8, y: 1, cls: 1 },
    ];

    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.x))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 6)
      .attr('fill', d => d.cls === 1 ? 'var(--ml-accent-green)' : 'var(--ml-accent-orange)')
      .attr('stroke', 'var(--ml-text)')
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
      .attr('stroke', 'var(--ml-accent-magenta)')
      .attr('stroke-width', 5)
      .attr('opacity', 0.95);

    // Axis labels.
    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 60)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('predictor x (e.g., turbidity)');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -60)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('model output');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-02-linear-to-logistic" -->
## The Score z (Before Probabilities)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! z is an evidence scale
-: one number per sample (can be any real value)

***

-! z is not a probability
-: it is not constrained to [0,1]

***

-! z must be transformed
-: before decisions are possible

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-score-sigmoid-plot"></div>

<script>
(function() {
  const containerId = 'logreg-score-sigmoid-plot';
  const slideId = 'logistic-regression-02-linear-to-logistic';

  function draw() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 780;
    const height = 820;
    const margin = { top: 40, right: 26, bottom: 70, left: 70 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    plotUtils.addAxes(fig, [-4, 4], [-0.5, 1.5], 5, 3);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    fig.svg.append('line')
      .attr('x1', fig.xScale(-4)).attr('x2', fig.xScale(4))
      .attr('y1', fig.yScale(0)).attr('y2', fig.yScale(0))
      .attr('stroke', 'var(--ml-stroke-soft)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');
    fig.svg.append('line')
      .attr('x1', fig.xScale(-4)).attr('x2', fig.xScale(4))
      .attr('y1', fig.yScale(1)).attr('y2', fig.yScale(1))
      .attr('stroke', 'var(--ml-stroke-soft)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');

    const points = [
      { z: -2.8, y: 0, cls: 0 },
      { z: -1.9, y: 0, cls: 0 },
      { z: -0.9, y: 0, cls: 0 },
      { z: 0.7, y: 1, cls: 1 },
      { z: 1.8, y: 1, cls: 1 },
      { z: 2.9, y: 1, cls: 1 },
    ];

    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.z))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 7)
      .attr('fill', d => d.cls === 1 ? 'var(--ml-accent-green)' : 'var(--ml-accent-orange)')
      .attr('stroke', 'var(--ml-text)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.95);

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 55)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('score z (evidence)');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -55)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('label (0/1)');

    fig.svg.append('text')
      .attr('x', fig.xScale(0.6))
      .attr('y', fig.yScale(1.3))
      .style('fill', 'var(--ml-muted)')
      .style('font-size', '12px')
      .text('higher z -> higher risk');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-03-sigmoid" -->
## The Sigmoid Function - Intuition
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Input: score z
-: negative -> low risk, positive -> high risk

***

-! Output: probability
-: always stays in [0,1]

***

-! Smooth uncertainty
-: near the middle, the model is less sure
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-sigmoid-intuition-plot" style="width: 100%; height: 520px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>

<script>
(function() {
  const containerId = 'logreg-sigmoid-intuition-plot';
  const slideId = 'logistic-regression-03-sigmoid';

  function getTheme() {
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    return isPerformanceMode ? {
      panel: '#f7f7f4',
      border: '#111827',
      axis: '#111827',
      text: '#111827',
      sigmoid: '#0ea5e9',
      threshold: '#1f2937',
      low: '#f97316',
      high: '#10b981',
      mid: '#111827'
    } : {
      panel: 'rgba(15,23,42,0.85)',
      border: '#2d3a66',
      axis: '#0ff',
      text: '#ffffff',
      sigmoid: '#00ffff',
      threshold: 'rgba(255,255,255,0.25)',
      low: '#ff6b35',
      high: '#00ff94',
      mid: '#ffb48a'
    };
  }

    function draw() {
      const container = document.getElementById(containerId);
      if (!container) return;

    const theme = getTheme();
    container.style.backgroundColor = theme.panel;
    container.style.borderColor = theme.border;

    const width = 640;
    const height = 520;
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);
    plotUtils.addAxes(fig, [-6, 6], [0, 1], 7, 5);

    const root = d3.select(`#${containerId} svg`);
    root.style('background-color', theme.panel)
      .style('border-radius', '12px');

    fig.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', fig.width)
      .attr('height', fig.height)
      .attr('rx', 12)
      .attr('fill', 'none')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    fig.xAxisGroup.selectAll('path, line')
      .style('stroke', theme.axis)
      .style('stroke-width', '2px');
    fig.yAxisGroup.selectAll('path, line')
      .style('stroke', theme.axis)
      .style('stroke-width', '2px');
    fig.xAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");
    fig.yAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");

    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const curve = d3.range(-6, 6.001, 0.05).map(z => ({ z, p: sigmoid(z) }));

    fig.svg.append('path')
      .datum(curve)
      .attr('fill', 'none')
      .attr('stroke', theme.sigmoid)
      .attr('stroke-width', 5)
      .attr('opacity', 0.95)
      .attr('d', d3.line()
        .x(d => fig.xScale(d.z))
        .y(d => fig.yScale(d.p)));

    const markers = [
      { z: -4, label: 'strong evidence for class 0', color: theme.low, dx: -10, dy: 28, anchor: 'start' },
      { z: 0, label: 'uncertain', color: theme.mid, dx: 10, dy: -14, anchor: 'start' },
      { z: 4, label: 'strong evidence for class 1', color: theme.high, dx: -210, dy: -18, anchor: 'start' }
    ];

    fig.svg.append('g')
      .selectAll('circle')
      .data(markers)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.z))
      .attr('cy', d => fig.yScale(sigmoid(d.z)))
      .attr('r', 7)
      .attr('fill', d => d.color)
      .attr('stroke', theme.text)
      .attr('stroke-width', 2);

    fig.svg.append('g')
      .selectAll('text')
      .data(markers)
      .enter()
      .append('text')
      .attr('x', d => fig.xScale(d.z) + d.dx)
      .attr('y', d => fig.yScale(sigmoid(d.z)) + d.dy)
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text(d => d.label);

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 55)
      .attr('text-anchor', 'middle')
      .style('fill', theme.axis)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('evidence score z');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -55)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', theme.axis)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('p(class 1)');
  }

    function register() {
      if (typeof plotUtils === 'undefined') {
        setTimeout(register, 80);
        return;
      }
      plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
    }

    register();
  })();
  </script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-04-interpretation" -->
## Model Interpretation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Coefficients show drivers of risk
-: all features standardized (unit-free)

***

-! Show only three features
-: rainfall (24h), turbidity, discharge

***

-! Baseline model
-: simple and transparent (but limited)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-interpretation-plot" style="width: 100%; height: 520px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>

<script>
(function() {
  const containerId = 'logreg-interpretation-plot';
  const slideId = 'logistic-regression-04-interpretation';

  function getTheme() {
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    return isPerformanceMode ? {
      panel: '#f7f7f4',
      border: '#111827',
      axis: '#111827',
      text: '#111827',
      pos: '#10b981',
      neg: '#f97316',
      zero: '#1f2937'
    } : {
      panel: 'rgba(15,23,42,0.85)',
      border: '#2d3a66',
      axis: '#0ff',
      text: '#9efcff',
      pos: '#00ff94',
      neg: '#ff6b35',
      zero: 'rgba(255,255,255,0.25)'
    };
  }

  function draw() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const theme = getTheme();
    container.style.backgroundColor = theme.panel;
    container.style.borderColor = theme.border;

    const width = 640;
    const height = 520;
    const margin = { top: 50, right: 50, bottom: 90, left: 190 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    const data = [
      { name: 'rainfall (24h)', value: 0.7 },
      { name: 'turbidity', value: 0.9 },
      { name: 'discharge', value: -0.5 }
    ];

    const xScale = d3.scaleLinear().domain([-1.2, 1.2]).range([0, fig.width]);
    const yScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, fig.height - 20])
      .padding(0.25);

    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale);

    const yAxisGroup = fig.svg.append('g').call(yAxis);
    const xAxisGroup = fig.svg.append('g')
      .attr('transform', `translate(0, ${fig.height})`)
      .call(xAxis);

    yAxisGroup.selectAll('path, line').style('stroke', theme.axis).style('stroke-width', '2px');
    xAxisGroup.selectAll('path, line').style('stroke', theme.axis).style('stroke-width', '2px');
    yAxisGroup.selectAll('text')
      .style('fill', theme.text)
      .style('font-size', '14px')
      .style('font-family', "'Press Start 2P', monospace");
    xAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");

    fig.svg.append('line')
      .attr('x1', xScale(0))
      .attr('x2', xScale(0))
      .attr('y1', 0)
      .attr('y2', fig.height)
      .attr('stroke', theme.zero)
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');

    fig.svg.append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(Math.min(0, d.value)))
      .attr('y', d => yScale(d.name))
      .attr('width', d => Math.abs(xScale(d.value) - xScale(0)))
      .attr('height', yScale.bandwidth())
      .attr('rx', 6)
      .attr('fill', d => d.value >= 0 ? theme.pos : theme.neg)
      .attr('stroke', theme.border)
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.95);

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 60)
      .attr('text-anchor', 'middle')
      .style('fill', theme.axis)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('pushes risk up/down (standardized)');

    fig.svg.append('text')
      .attr('x', xScale(-1.05))
      .attr('y', fig.height + 30)
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text('left = negative');

    fig.svg.append('text')
      .attr('x', xScale(0.4))
      .attr('y', fig.height + 30)
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text('right = positive');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-05-decision-boundary" -->
## Decision Boundary
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Probability field, not a hard split
-: color shows p(exceedance)

***

-! Boundary is secondary
-: it is where p reaches a policy-chosen threshold

***

-! Policy defines the decision threshold
-: which sets the boundary location
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-decision-boundary-plot" style="width: 100%; height: 520px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>

<script>
(function() {
  const containerId = 'logreg-decision-boundary-plot';
  const slideId = 'logistic-regression-05-decision-boundary';

  function getTheme() {
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    return isPerformanceMode ? {
      panel: '#f7f7f4',
      border: '#111827',
      axis: '#111827',
      text: '#111827',
      boundary: '#111827',
      class0: '#f97316',
      class1: '#10b981',
      shade0: 'rgba(249,115,22,0.16)',
      shade1: 'rgba(16,185,129,0.16)'
    } : {
      panel: 'rgba(15,23,42,0.85)',
      border: '#2d3a66',
      axis: '#0ff',
      text: '#9efcff',
      boundary: '#9efcff',
      class0: '#ff6b35',
      class1: '#00ff94',
      shade0: 'rgba(255,107,53,0.16)',
      shade1: 'rgba(0,255,148,0.16)'
    };
  }

  function draw() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const theme = getTheme();
    container.style.backgroundColor = theme.panel;
    container.style.borderColor = theme.border;

    const width = 640;
    const height = 520;
    const margin = { top: 40, right: 40, bottom: 80, left: 80 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    const xDomain = [0, 10];
    const yDomain = [0, 10];
    const xScale = d3.scaleLinear().domain(xDomain).range([0, fig.width]);
    const yScale = d3.scaleLinear().domain(yDomain).range([fig.height, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(6);
    const yAxis = d3.axisLeft(yScale).ticks(6);
    const xAxisGroup = fig.svg.append('g')
      .attr('transform', `translate(0, ${fig.height})`)
      .call(xAxis);
    const yAxisGroup = fig.svg.append('g').call(yAxis);

    xAxisGroup.selectAll('path, line').style('stroke', theme.axis).style('stroke-width', '2px');
    yAxisGroup.selectAll('path, line').style('stroke', theme.axis).style('stroke-width', '2px');
    xAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");
    yAxisGroup.selectAll('text')
      .style('fill', theme.axis)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");

    const defs = fig.svg.append('defs');
    const grad = defs.append('linearGradient')
      .attr('id', `${containerId}-shade`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', theme.shade0);
    grad.append('stop').attr('offset', '100%').attr('stop-color', theme.shade1);

    fig.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', fig.width)
      .attr('height', fig.height)
      .attr('rx', 12)
      .attr('fill', `url(#${containerId}-shade)`)
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    const boundary = [
      { x: 1, y: 9 },
      { x: 9, y: 2 }
    ];
      fig.svg.append('path')
        .datum(boundary)
        .attr('fill', 'none')
        .attr('stroke', theme.boundary)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '8 6')
        .attr('opacity', 0.55)
        .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)));

    const points = [
      { x: 1.6, y: 2.2, cls: 0 },
      { x: 2.6, y: 2.8, cls: 0 },
      { x: 3.4, y: 2.0, cls: 0 },
      { x: 2.8, y: 4.2, cls: 0 },
      { x: 7.4, y: 6.9, cls: 1 },
      { x: 8.3, y: 6.1, cls: 1 },
      { x: 9.0, y: 7.6, cls: 1 },
      { x: 7.6, y: 4.7, cls: 1 }
    ];

    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 7)
      .attr('fill', d => d.cls === 1 ? theme.class1 : theme.class0)
      .attr('stroke', theme.text)
      .attr('stroke-width', 2)
      .attr('opacity', 0.95);

    fig.svg.append('text')
      .attr('x', 10)
      .attr('y', fig.height + 55)
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text('probability shading');

  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-06-training" -->
## Training the Model
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Training adjusts the weights
-: to match probabilities to observed outcomes

***

-! Two states to remember
-: before training vs after training

***

-! Goal
-: better alignment (especially near overlap)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-training-loss-plot" style="width: 100%; height: 520px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>

<script>
(function() {
  const containerId = 'logreg-training-loss-plot';
  const slideId = 'logistic-regression-06-training';

  function getTheme() {
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    return isPerformanceMode ? {
      panel: '#f7f7f4',
      border: '#111827',
      axis: '#111827',
      text: '#111827',
      y1: '#10b981',
      y0: '#f97316',
      hint: '#111827'
    } : {
      panel: 'rgba(15,23,42,0.85)',
      border: '#2d3a66',
      axis: '#0ff',
      text: '#9efcff',
      y1: '#00ff94',
      y0: '#ff6b35',
      hint: '#9efcff'
    };
  }

  function draw() {
    const container = document.getElementById(containerId);
    if (!container) return;

    const theme = getTheme();
    container.style.backgroundColor = theme.panel;
    container.style.borderColor = theme.border;

    const width = 640;
    const height = 520;
    const margin = { top: 50, right: 40, bottom: 90, left: 90 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    // Curated visual: before vs after training (no loss curves, no formulas).
    plotUtils.addAxes(fig, [0, 10], [-0.1, 1.1], 6, 6);

    const points = [
      { x: 4.8, y: 0, cls: 0 },
      { x: 5.4, y: 1, cls: 1 },
      { x: 7.6, y: 1, cls: 1 },
    ];

    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.x))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 7)
      .attr('fill', d => d.cls === 1 ? theme.y1 : theme.y0)
      .attr('stroke', theme.text)
      .attr('stroke-width', 2)
      .attr('opacity', 0.95);

    const sigmoid = (t) => 1 / (1 + Math.exp(-t));
    const curveX = d3.range(0, 10.001, 0.05);
    const curveBefore = curveX.map(x => ({ x, p: sigmoid((x - 6.2) * 0.9) }));
    const curveAfter = curveX.map(x => ({ x, p: sigmoid((x - 5.4) * 1.4) }));

    const line = d3.line()
      .x(d => fig.xScale(d.x))
      .y(d => fig.yScale(d.p));

    fig.svg.append('path')
      .datum(curveBefore)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.y0)
      .attr('stroke-width', 5)
      .attr('stroke-dasharray', '10 8')
      .attr('opacity', 0.9);

    fig.svg.append('path')
      .datum(curveAfter)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.y1)
      .attr('stroke-width', 5)
      .attr('opacity', 0.95);

    fig.svg.append('text')
      .attr('x', fig.xScale(7.2))
      .attr('y', fig.yScale(0.18))
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text('before');

    fig.svg.append('text')
      .attr('x', fig.xScale(6.1))
      .attr('y', fig.yScale(0.78))
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text('after');

    return;

  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="logistic-regression-07-strengths-limitations" -->
## When to Use Logistic Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Default baseline model
-: simple, transparent, trustworthy

***

-! Works best when effects are roughly monotonic
-: and interactions are not dominant

***

-! Use probabilities responsibly
-: calibrate and pick thresholds with domain costs
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="logreg-strengths-plot" style="width: 100%; height: 520px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.0);"></div>

<script>
(function() {
  const containerId = 'logreg-strengths-plot';
  const slideId = 'logistic-regression-07-strengths-limitations';

  function getTheme() {
    const isPerformanceMode = document.body.classList.contains('performance-mode');
    return isPerformanceMode ? {
      panel: '#f7f7f4',
      border: '#111827',
      text: '#111827',
      header: '#111827',
      good: '#10b981',
      bad: '#f97316',
      divider: '#111827'
    } : {
      panel: 'rgba(15,23,42,0.85)',
      border: '#2d3a66',
      text: '#9efcff',
      header: '#ffffff',
      good: '#00ff94',
      bad: '#ff6b35',
      divider: '#2d3a66'
    };
  }

    function draw() {
      const container = document.getElementById(containerId);
      if (!container) return;

    const theme = getTheme();
    container.style.backgroundColor = theme.panel;
    container.style.borderColor = theme.border;

    const width = 640;
    const height = 520;
    const margin = { top: 50, right: 40, bottom: 60, left: 40 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    fig.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', fig.width)
      .attr('height', fig.height)
      .attr('rx', 12)
      .attr('fill', 'none')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    const mid = fig.width / 2;
    fig.svg.append('line')
      .attr('x1', mid)
      .attr('x2', mid)
      .attr('y1', 0)
      .attr('y2', fig.height)
      .attr('stroke', theme.divider)
      .attr('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', mid / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', theme.header)
      .style('font-size', '18px')
      .style('font-family', "'Press Start 2P', monospace")
      .text('Logistic');

    fig.svg.append('text')
      .attr('x', mid + mid / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', theme.header)
      .style('font-size', '18px')
      .style('font-family', "'Press Start 2P', monospace")
      .text('Random Forest');

    const leftItems = [
      { text: 'interpretable', color: theme.good },
      { text: 'fast, small data', color: theme.good },
      { text: 'linear boundary', color: theme.bad }
    ];
    const rightItems = [
      { text: 'flexible boundary', color: theme.good },
      { text: 'handles interactions', color: theme.good },
      { text: 'less transparent', color: theme.bad }
    ];

    const lineHeight = 42;
    leftItems.forEach((item, i) => {
      fig.svg.append('text')
        .attr('x', 20)
        .attr('y', 90 + i * lineHeight)
        .style('fill', item.color)
        .style('font-size', '16px')
        .text(item.text);
    });

    rightItems.forEach((item, i) => {
      fig.svg.append('text')
        .attr('x', mid + 20)
        .attr('y', 90 + i * lineHeight)
        .style('fill', item.color)
        .style('font-size', '16px')
        .text(item.text);
    });
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="random-forest-01-motivation" -->
## Random Forest - Motivation
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Many water-quality problems are not linear
-: predictors often interact (for example, turbidity can matter differently across seasons)
-: effects can be non-monotonic (risk increases, saturates, then changes again)

***

-! Random Forest is a strong baseline for classification and regression
-: it works well without heavy feature engineering and handles mixed feature types
-: it is fairly robust to noise and outliers compared to a single decision tree

***

-! The key advantage is flexible decision boundaries
-: linear models are great when the boundary is approximately linear
-: tree ensembles can capture interactions that a single straight line cannot
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-motivation-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Same dataset: a linear boundary cannot separate an interaction pattern, while axis-aligned splits can.

<script>
(function() {
  const containerId = 'rf-motivation-plot';
  const slideId = 'random-forest-01-motivation';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function makeData() {
    const rng = seededRandom(41);
    const jitter = (s) => (rng() * 2 - 1) * s;
    const points = [];
    const n = 80;

    for (let i = 0; i < n; i++) {
      const x = Math.max(0, Math.min(1, rng() + jitter(0.03)));
      const y = Math.max(0, Math.min(1, rng() + jitter(0.03)));

      // Interaction pattern (two diagonally opposite "high-risk" corners).
      const cls =
        (x < 0.45 && y < 0.45) || (x > 0.55 && y > 0.55) ? 1 : 0;

      points.push({ x, y, cls });
    }
    return points;
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
    const margin = { top: 36, right: 28, bottom: 70, left: 70 };

    const points = makeData();

    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const gap = 22;
    const panelW = (fig.width - gap) / 2;
    const panelH = fig.height - 30;

    const x = d3.scaleLinear().domain([0, 1]).range([0, panelW]);
    const y = d3.scaleLinear().domain([0, 1]).range([panelH, 0]);

    const left = fig.svg.append('g').attr('transform', `translate(0, 30)`);
    const right = fig.svg.append('g').attr('transform', `translate(${panelW + gap}, 30)`);

    function drawFrame(root, title) {
      root.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', panelW)
        .attr('height', panelH)
        .attr('rx', 10)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);

      root.append('text')
        .attr('x', panelW / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '12px')
        .text(title);

      root.append('g')
        .attr('transform', `translate(0, ${panelH})`)
        .attr('class', 'd3-axis')
        .call(d3.axisBottom(x).ticks(4));
      root.append('g')
        .attr('class', 'd3-axis')
        .call(d3.axisLeft(y).ticks(4));
    }

    drawFrame(left, 'Linear boundary');
    drawFrame(right, 'Tree-like boundary');

    const line = d3.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    const linBoundary = d3.range(0, 1.001, 0.02).map(t => ({ x: t, y: t }));
    left.append('path')
      .datum(linBoundary)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 3)
      .attr('opacity', 0.95);

    const positiveRegions = [
      { x0: 0, y0: 0, x1: 0.45, y1: 0.45 },
      { x0: 0.55, y0: 0.55, x1: 1, y1: 1 }
    ];

    right.append('g')
      .selectAll('rect.region')
      .data(positiveRegions)
      .enter()
      .append('rect')
      .attr('class', 'region')
      .attr('x', d => x(d.x0))
      .attr('y', d => y(d.y1))
      .attr('width', d => x(d.x1) - x(d.x0))
      .attr('height', d => y(d.y0) - y(d.y1))
      .attr('fill', 'var(--ml-accent-green-soft)')
      .attr('stroke', theme.green)
      .attr('stroke-width', 2);

    function drawPoints(root) {
      root.append('g')
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 4.8)
        .attr('fill', d => d.cls === 1 ? theme.green : theme.orange)
        .attr('stroke', theme.text)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.96);
    }
    drawPoints(left);
    drawPoints(right);

    fig.svg.append('text')
      .attr('x', (panelW / 2))
      .attr('y', fig.height + 24)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('predictor 1 (e.g., turbidity)');

    fig.svg.append('text')
      .attr('x', panelW + gap + (panelW / 2))
      .attr('y', fig.height + 24)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('predictor 2 (e.g., DOC)');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-02-single-tree-intuition" -->
## Start with One Decision Tree
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! A decision tree is a sequence of if/else decisions
-: each split checks one feature against a threshold
-: after a few splits we end up in a leaf that stores the prediction

***

-! The same idea can be shown in two ways
-: as a small tree with nodes and leaves
-: as a partition of the feature space into rectangles

***

-! Trees are easy to explain but can be unstable
-: small changes in data can change early splits
-: later predictions then change as well
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-single-tree-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= A tiny tree and its corresponding rectangular partition.

<script>
(function() {
  const containerId = 'rf-single-tree-plot';
  const slideId = 'random-forest-02-single-tree-intuition';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 26, right: 26, bottom: 26, left: 26 };

    const fig = plotUtils.createFigure(containerId, width, height, margin);
    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const gap = 26;
    const panelW = (fig.width - gap) / 2;
    const panelH = fig.height;

    const left = fig.svg.append('g');
    const right = fig.svg.append('g').attr('transform', `translate(${panelW + gap}, 0)`);

    left.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', panelW).attr('height', panelH)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-surface)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    left.append('text')
      .attr('x', panelW / 2).attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Tree');

    const treeNodes = [
      { id: 'root', x: panelW / 2, y: 90, label: 'x < 0.5?' },
      { id: 'l', x: panelW * 0.28, y: 220, label: 'y < 0.4?' },
      { id: 'r', x: panelW * 0.72, y: 220, label: 'y < 0.7?' },
      { id: 'll', x: panelW * 0.16, y: 360, label: 'leaf: class 1', cls: 1 },
      { id: 'lr', x: panelW * 0.40, y: 360, label: 'leaf: class 0', cls: 0 },
      { id: 'rl', x: panelW * 0.60, y: 360, label: 'leaf: class 0', cls: 0 },
      { id: 'rr', x: panelW * 0.84, y: 360, label: 'leaf: class 1', cls: 1 }
    ];

    const treeLinks = [
      { a: 'root', b: 'l', text: 'yes' },
      { a: 'root', b: 'r', text: 'no' },
      { a: 'l', b: 'll', text: 'yes' },
      { a: 'l', b: 'lr', text: 'no' },
      { a: 'r', b: 'rl', text: 'yes' },
      { a: 'r', b: 'rr', text: 'no' }
    ];

    const byId = new Map(treeNodes.map(n => [n.id, n]));

    left.append('g')
      .selectAll('line')
      .data(treeLinks)
      .enter()
      .append('line')
      .attr('x1', d => byId.get(d.a).x)
      .attr('y1', d => byId.get(d.a).y + 18)
      .attr('x2', d => byId.get(d.b).x)
      .attr('y2', d => byId.get(d.b).y - 18)
      .attr('stroke', theme.muted)
      .attr('stroke-width', 2);

    left.append('g')
      .selectAll('text.edge')
      .data(treeLinks)
      .enter()
      .append('text')
      .attr('class', 'edge')
      .attr('x', d => (byId.get(d.a).x + byId.get(d.b).x) / 2)
      .attr('y', d => (byId.get(d.a).y + byId.get(d.b).y) / 2)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text(d => d.text);

    const nodeG = left.append('g')
      .selectAll('g.node')
      .data(treeNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    nodeG.append('rect')
      .attr('x', -86)
      .attr('y', -18)
      .attr('width', 172)
      .attr('height', 36)
      .attr('rx', 10)
      .attr('fill', d => d.cls === 1 ? 'var(--ml-accent-green-soft-2)' : d.cls === 0 ? 'var(--ml-accent-orange-soft-2)' : 'var(--ml-accent-cyan-soft)')
      .attr('stroke', d => d.cls === 1 ? theme.green : d.cls === 0 ? theme.orange : theme.cyan)
      .attr('stroke-width', 2);

    nodeG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', theme.text)
      .style('font-size', '11px')
      .text(d => d.label);

    right.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', panelW).attr('height', panelH)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-surface)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    right.append('text')
      .attr('x', panelW / 2).attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Feature space');

    const inner = { left: 50, top: 50, right: 20, bottom: 50 };
    const w = panelW - inner.left - inner.right;
    const h = panelH - inner.top - inner.bottom;
    const gx = right.append('g').attr('transform', `translate(${inner.left}, ${inner.top})`);

    const x = d3.scaleLinear().domain([0, 1]).range([0, w]);
    const y = d3.scaleLinear().domain([0, 1]).range([h, 0]);

    gx.append('g').attr('class', 'd3-axis').attr('transform', `translate(0, ${h})`).call(d3.axisBottom(x).ticks(4));
    gx.append('g').attr('class', 'd3-axis').call(d3.axisLeft(y).ticks(4));

    const regions = [
      { x0: 0, x1: 0.5, y0: 0, y1: 0.4, cls: 1 },
      { x0: 0, x1: 0.5, y0: 0.4, y1: 1, cls: 0 },
      { x0: 0.5, x1: 1, y0: 0, y1: 0.7, cls: 0 },
      { x0: 0.5, x1: 1, y0: 0.7, y1: 1, cls: 1 }
    ];

    gx.append('g')
      .selectAll('rect.region')
      .data(regions)
      .enter()
      .append('rect')
      .attr('class', 'region')
      .attr('x', d => x(d.x0))
      .attr('y', d => y(d.y1))
      .attr('width', d => x(d.x1) - x(d.x0))
      .attr('height', d => y(d.y0) - y(d.y1))
      .attr('fill', d => d.cls === 1 ? 'var(--ml-accent-green-soft)' : 'var(--ml-accent-orange-soft)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 1.5);

    const splitColor = theme.cyan;
    gx.append('line')
      .attr('x1', x(0.5)).attr('x2', x(0.5))
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', splitColor)
      .attr('stroke-width', 2);
    gx.append('line')
      .attr('x1', x(0)).attr('x2', x(0.5))
      .attr('y1', y(0.4)).attr('y2', y(0.4))
      .attr('stroke', splitColor)
      .attr('stroke-width', 2);
    gx.append('line')
      .attr('x1', x(0.5)).attr('x2', x(1))
      .attr('y1', y(0.7)).attr('y2', y(0.7))
      .attr('stroke', splitColor)
      .attr('stroke-width', 2);

    right.append('text')
      .attr('x', inner.left + w / 2)
      .attr('y', panelH - 16)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('x');

    right.append('text')
      .attr('x', 18)
      .attr('y', inner.top + h / 2)
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90, 18, ${inner.top + h / 2})`)
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('y');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-03-why-forests" -->
## Why Not Just One Tree?
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! A single tree has high variance
-: it can change a lot when the training set changes slightly
-: noise can trigger different early splits and lead to different boundaries

***

-! Two trees trained on nearly the same data can disagree
-: their partitions can look different even when accuracy is similar
-: this makes a single tree an unreliable baseline

***

-! Random Forest reduces variance by averaging
-: build many slightly different trees (different samples, different split candidates)
-: combine them by voting (classification) or averaging (regression)
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-variance-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Small training changes can produce different tree boundaries (variance).

<script>
(function() {
  const containerId = 'rf-variance-plot';
  const slideId = 'random-forest-03-why-forests';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function makeData() {
    const rng = seededRandom(99);
    const jitter = (s) => (rng() * 2 - 1) * s;
    const points = [];
    const n = 90;
    for (let i = 0; i < n; i++) {
      const x = Math.max(0, Math.min(1, rng() + jitter(0.03)));
      const y = Math.max(0, Math.min(1, rng() + jitter(0.03)));
      const cls =
        (x < 0.45 && y < 0.45) || (x > 0.55 && y > 0.55) ? 1 : 0;
      points.push({ x, y, cls });
    }
    return points;
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
    const margin = { top: 36, right: 28, bottom: 70, left: 70 };

    const points = makeData();
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const gap = 22;
    const panelW = (fig.width - gap) / 2;
    const panelH = fig.height - 30;

    const x = d3.scaleLinear().domain([0, 1]).range([0, panelW]);
    const y = d3.scaleLinear().domain([0, 1]).range([panelH, 0]);

    const left = fig.svg.append('g').attr('transform', `translate(0, 30)`);
    const right = fig.svg.append('g').attr('transform', `translate(${panelW + gap}, 30)`);

    function drawFrame(root, title) {
      root.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', panelW)
        .attr('height', panelH)
        .attr('rx', 10)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);

      root.append('text')
        .attr('x', panelW / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '12px')
        .text(title);

      root.append('g')
        .attr('transform', `translate(0, ${panelH})`)
        .attr('class', 'd3-axis')
        .call(d3.axisBottom(x).ticks(4));
      root.append('g')
        .attr('class', 'd3-axis')
        .call(d3.axisLeft(y).ticks(4));
    }

    drawFrame(left, 'Tree A');
    drawFrame(right, 'Tree B');

    function drawPoints(root) {
      root.append('g')
        .selectAll('circle')
        .data(points)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 4.6)
        .attr('fill', d => d.cls === 1 ? theme.green : theme.orange)
        .attr('stroke', theme.text)
        .attr('stroke-width', 1.4)
        .attr('opacity', 0.96);
    }

    function drawBoundary(root, regions, outlineColor) {
      root.append('g')
        .selectAll('rect.region')
        .data(regions)
        .enter()
        .append('rect')
        .attr('class', 'region')
        .attr('x', d => x(d.x0))
        .attr('y', d => y(d.y1))
        .attr('width', d => x(d.x1) - x(d.x0))
        .attr('height', d => y(d.y0) - y(d.y1))
        .attr('fill', 'var(--ml-accent-cyan-soft)')
        .attr('stroke', outlineColor)
        .attr('stroke-width', 2.2);
    }

    const treeA = [
      { x0: 0, x1: 0.47, y0: 0, y1: 0.43 },
      { x0: 0.56, x1: 1, y0: 0.58, y1: 1 }
    ];
    const treeB = [
      { x0: 0, x1: 0.42, y0: 0, y1: 0.48 },
      { x0: 0.60, x1: 1, y0: 0.53, y1: 1 }
    ];

    drawBoundary(left, treeA, theme.cyan);
    drawBoundary(right, treeB, theme.magenta);
    drawPoints(left);
    drawPoints(right);

    fig.svg.append('text')
      .attr('x', (panelW / 2))
      .attr('y', fig.height + 24)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('same problem, different split choices');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-04-rf-big-picture" -->
## Random Forest - Big Picture
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! A Random Forest is many decision trees plus aggregation
-: each tree is trained on a slightly different view of the data
-: the forest prediction is a vote (classification) or an average (regression)

***

-! Two kinds of randomness create diverse trees
-: bootstrap sampling changes which rows each tree sees
-: random feature selection changes which predictors are considered at each split

***

-! Aggregation reduces variance
-: single trees can overfit and are sensitive to noise
-: the average over many different trees is much more stable
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-big-picture-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Training pipeline: dataset -> bootstrap samples -> many trees -> aggregation -> prediction.

<script>
(function() {
  const containerId = 'rf-big-picture-plot';
  const slideId = 'random-forest-04-rf-big-picture';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 26, bottom: 26, left: 26 };

    const fig = plotUtils.createFigure(containerId, width, height, margin);
    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const W = fig.width;
    const H = fig.height;

    function box(x, y, w, h, label, stroke, fill) {
      const g = fig.svg.append('g').attr('transform', `translate(${x}, ${y})`);
      g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', w).attr('height', h)
        .attr('rx', 12)
        .attr('fill', fill || 'rgba(0,0,0,0.12)')
        .attr('stroke', stroke || theme.border)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', w / 2).attr('y', 22)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(label);
      return g;
    }

    function arrow(x1, y1, x2, y2, color) {
      const markerId = `${containerId}-arrow`;
      const defs = d3.select(`#${containerId} svg`).select('defs').empty()
        ? d3.select(`#${containerId} svg`).append('defs')
        : d3.select(`#${containerId} svg`).select('defs');

      if (defs.select(`#${markerId}`).empty()) {
        defs.append('marker')
          .attr('id', markerId)
          .attr('viewBox', '0 0 10 10')
          .attr('refX', 9).attr('refY', 5)
          .attr('markerWidth', 8).attr('markerHeight', 8)
          .attr('orient', 'auto-start-reverse')
          .append('path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .attr('fill', theme.muted);
      }

      fig.svg.append('line')
        .attr('x1', x1).attr('y1', y1)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', color || theme.muted)
        .attr('stroke-width', 3)
        .attr('marker-end', `url(#${markerId})`)
        .attr('opacity', 0.95);
    }

    const y0 = 60;
    const dataset = box(10, y0, 150, 260, 'Dataset', theme.cyan);
    const boots = box(190, y0, 160, 260, 'Bootstrap', theme.orange);
    const trees = box(380, y0, 160, 260, 'Trees', theme.green);
    const agg = box(570, y0, 90, 120, 'Vote', theme.magenta);
    const pred = box(570, y0 + 160, 90, 100, 'Output', theme.cyan);

    // Decorative points in dataset.
    const pointArea = dataset.append('g').attr('transform', 'translate(14, 44)');
    const px = d3.scaleLinear().domain([0, 1]).range([0, 120]);
    const py = d3.scaleLinear().domain([0, 1]).range([200, 0]);
    const pts = d3.range(36).map(i => ({
      x: (i * 37 % 97) / 97,
      y: (i * 19 % 89) / 89,
      cls: (i * 13 % 5) < 2 ? 1 : 0
    }));
    pointArea.selectAll('circle')
      .data(pts)
      .enter()
      .append('circle')
      .attr('cx', d => px(d.x))
      .attr('cy', d => py(d.y))
      .attr('r', 4)
      .attr('fill', d => d.cls ? theme.green : theme.orange)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2)
      .attr('opacity', 0.95);

    // Bootstrap mini-samples.
    const b = boots.append('g').attr('transform', 'translate(18, 48)');
    const sampleW = 124, sampleH = 58, sampleGap = 18;
    const sampleLabels = ['Tree 1', 'Tree 2', 'Tree 3'];
    sampleLabels.forEach((lab, i) => {
      const y = i * (sampleH + sampleGap);
      b.append('rect')
        .attr('x', 0).attr('y', y)
        .attr('width', sampleW).attr('height', sampleH)
        .attr('rx', 10)
        .attr('fill', 'var(--ml-accent-orange-soft)')
        .attr('stroke', theme.orange)
        .attr('stroke-width', 2);
      b.append('text')
        .attr('x', 6).attr('y', y + 18)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-size', '11px')
        .text(lab);
      // tiny duplicates to hint "with replacement"
      const s = b.append('g').attr('transform', `translate(8, ${y + 26})`);
      const cells = d3.range(10).map(j => j);
      s.selectAll('rect')
        .data(cells)
        .enter()
        .append('rect')
        .attr('x', d => (d % 5) * 22)
        .attr('y', d => Math.floor(d / 5) * 16)
        .attr('width', 18)
        .attr('height', 12)
        .attr('rx', 3)
        .attr('fill', d => (d === 1 || d === 6) ? 'rgba(0,255,255,0.20)' : 'rgba(0,0,0,0.12)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 1.4);
    });

    // Trees icons.
    const tg = trees.append('g').attr('transform', 'translate(16, 56)');
    const icon = (gx, x, y, color) => {
      const g = gx.append('g').attr('transform', `translate(${x}, ${y})`);
      g.append('line').attr('x1', 28).attr('y1', 8).attr('x2', 16).attr('y2', 24).attr('stroke', color).attr('stroke-width', 2.2);
      g.append('line').attr('x1', 28).attr('y1', 8).attr('x2', 40).attr('y2', 24).attr('stroke', color).attr('stroke-width', 2.2);
      g.append('line').attr('x1', 16).attr('y1', 24).attr('x2', 10).attr('y2', 40).attr('stroke', color).attr('stroke-width', 2.2);
      g.append('line').attr('x1', 16).attr('y1', 24).attr('x2', 22).attr('y2', 40).attr('stroke', color).attr('stroke-width', 2.2);
      g.append('line').attr('x1', 40).attr('y1', 24).attr('x2', 34).attr('y2', 40).attr('stroke', color).attr('stroke-width', 2.2);
      g.append('line').attr('x1', 40).attr('y1', 24).attr('x2', 46).attr('y2', 40).attr('stroke', color).attr('stroke-width', 2.2);
      g.selectAll('circle')
        .data([{x:28,y:8},{x:16,y:24},{x:40,y:24},{x:10,y:40},{x:22,y:40},{x:34,y:40},{x:46,y:40}])
        .enter()
        .append('circle')
        .attr('cx', d => d.x).attr('cy', d => d.y)
        .attr('r', 4.2)
        .attr('fill', 'var(--ml-accent-green-soft)')
        .attr('stroke', color)
        .attr('stroke-width', 2);
    };
    icon(tg, 6, 10, theme.green);
    icon(tg, 74, 10, theme.green);
    icon(tg, 40, 92, theme.green);
    tg.append('text')
      .attr('x', 64).attr('y', 160)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('many diverse trees');

    // Aggregation and output glyphs.
    agg.append('text')
      .attr('x', 45).attr('y', 56)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('average');
    agg.append('text')
      .attr('x', 45).attr('y', 80)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('or vote');

    pred.append('rect')
      .attr('x', 18).attr('y', 48)
      .attr('width', 54).attr('height', 20)
      .attr('rx', 8)
      .attr('fill', 'var(--ml-accent-cyan-soft-2)')
      .attr('stroke', theme.cyan)
      .attr('stroke-width', 2);
    pred.append('text')
      .attr('x', 45).attr('y', 63)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-size', '11px')
      .text('ŷ');

    // Arrows.
    arrow(160, y0 + 130, 190, y0 + 130);
    arrow(350, y0 + 130, 380, y0 + 130);
    arrow(540, y0 + 80, 570, y0 + 80, theme.muted);
    arrow(540, y0 + 200, 570, y0 + 200, theme.muted);

    // Curly hint that aggregation uses all trees.
    fig.svg.append('path')
      .attr('d', `M ${540} ${y0 + 140} C ${548} ${y0 + 140}, ${554} ${y0 + 140}, ${560} ${y0 + 120}
                 C ${566} ${y0 + 100}, ${566} ${y0 + 160}, ${560} ${y0 + 180}
                 C ${554} ${y0 + 200}, ${548} ${y0 + 200}, ${540} ${y0 + 200}`)
      .attr('fill', 'none')
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 2.2)
      .attr('opacity', 0.9);
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-05-step1-bootstrap" -->
## Step 1 - Bootstrap Sampling
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Each tree is trained on a bootstrap sample
-: draw N observations with replacement from the training set
-: some rows appear multiple times, and some rows are not drawn at all

***

-! Rows that are not drawn are called out-of-bag (OOB)
-: the probability that a row is never selected is about 37 percent
-: OOB rows give an internal validation set without an extra split

***

-! Bootstrap sampling increases diversity across trees
-: different samples lead to different split choices and different errors
-: averaging over many trees reduces variance compared to one tree
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-bootstrap-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Two bootstrap samples from the same dataset: duplicates appear, and OOB rows remain unused.

<script>
(function() {
  const containerId = 'rf-bootstrap-plot';
  const slideId = 'random-forest-05-step1-bootstrap';

  function seededRandom(seed) {
    let value = seed >>> 0;
    return function() {
      value = (1664525 * value + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function bootstrapSample(n, rng) {
    const draws = d3.range(n).map(() => Math.floor(rng() * n));
    const counts = Array.from({ length: n }, () => 0);
    draws.forEach(i => { counts[i] += 1; });
    const oob = d3.range(n).filter(i => counts[i] === 0);
    return { draws, counts, oob };
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
    const margin = { top: 36, right: 26, bottom: 26, left: 26 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const W = fig.width;
    const H = fig.height;
    const gap = 22;
    const panelW = (W - gap) / 2;
    const panelH = H;

    const rng1 = seededRandom(7);
    const rng2 = seededRandom(19);
    const n = 14;
    const s1 = bootstrapSample(n, rng1);
    const s2 = bootstrapSample(n, rng2);

    const panels = [
      { x: 0, title: 'Tree 1', s: s1, accent: theme.cyan },
      { x: panelW + gap, title: 'Tree 2', s: s2, accent: theme.magenta }
    ];

    function panelRoot(px) {
      const g = fig.svg.append('g').attr('transform', `translate(${px}, 0)`);
      g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', panelW).attr('height', panelH)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      return g;
    }

    function drawDatasetGrid(g, x0, y0, s, label) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(label);

      const cell = 26;
      const cols = 7;
      const ids = d3.range(n);

      const grp = g.append('g').attr('transform', `translate(${x0}, ${y0})`);
      const item = grp.selectAll('g.item')
        .data(ids)
        .enter()
        .append('g')
        .attr('class', 'item')
        .attr('transform', d => `translate(${(d % cols) * cell}, ${Math.floor(d / cols) * cell})`);

      item.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 22).attr('height', 22)
        .attr('rx', 6)
        .attr('fill', d => s.counts[d] === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,255,255,0.10)')
        .attr('stroke', d => s.counts[d] === 0 ? theme.border : theme.cyan)
        .attr('stroke-width', 1.8);

      item.append('text')
        .attr('x', 11).attr('y', 15)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '11px')
        .text(d => d + 1);

      // Usage count label below each cell for duplicates.
      item.append('text')
        .attr('x', 11).attr('y', 34)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '11px')
        .text(d => s.counts[d] > 1 ? `x${s.counts[d]}` : '');
    }

    function drawSampleRow(g, x0, y0, s, accent, label) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(label);

      const cellW = 32;
      const cols = 7;
      const grp = g.append('g').attr('transform', `translate(${x0}, ${y0})`);

      grp.selectAll('rect')
        .data(s.draws)
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i % cols) * cellW)
        .attr('y', (d, i) => Math.floor(i / cols) * 26)
        .attr('width', 28)
        .attr('height', 22)
        .attr('rx', 6)
        .attr('fill', d => 'rgba(0,0,0,0.10)')
        .attr('stroke', accent)
        .attr('stroke-width', 1.8);

      grp.selectAll('text')
        .data(s.draws)
        .enter()
        .append('text')
        .attr('x', (d, i) => (i % cols) * cellW + 14)
        .attr('y', (d, i) => Math.floor(i / cols) * 26 + 15)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '11px')
        .text(d => d + 1);
    }

    function drawOOB(g, x0, y0, s, label) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(label);

      const oobText = s.oob.length ? s.oob.map(i => i + 1).join(', ') : 'none';
      g.append('text')
        .attr('x', x0).attr('y', y0 + 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text(oobText);
    }

    panels.forEach(p => {
      const g = panelRoot(p.x);
      g.append('text')
        .attr('x', panelW / 2).attr('y', 24)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '12px')
        .text(p.title);

      drawDatasetGrid(g, 18, 70, p.s, 'training set (N rows)');
      drawSampleRow(g, 18, 220, p.s, p.accent, 'bootstrap sample (draw N times)');
      drawOOB(g, 18, 410, p.s, 'out-of-bag rows (unused)');

      g.append('text')
        .attr('x', 18).attr('y', 520)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text('duplicates show "with replacement"');
    });

    // Center caption arrows.
    const centerX = panelW + gap / 2;
    fig.svg.append('line')
      .attr('x1', centerX).attr('x2', centerX)
      .attr('y1', 70).attr('y2', 520)
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-06-step2-feature-subsampling" -->
## Step 2 - Random Feature Selection
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! At each split, a tree considers only m of p features
-: first pick m random features, then find the best split among those candidates
-: typical defaults are m = sqrt(p) for classification and m = p/3 for regression

***

-! Feature subsampling prevents one predictor from dominating every tree
-: different trees are forced to explore different predictors and interactions
-: the resulting trees become less correlated with each other

***

-! Less correlation makes averaging more powerful
-: if trees make different mistakes, the vote cancels errors out
-: if trees are too similar, the forest behaves like one unstable tree
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-feature-subsampling-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Different trees see different candidate features at the same type of split, which decorrelates their decisions.

<script>
(function() {
  const containerId = 'rf-feature-subsampling-plot';
  const slideId = 'random-forest-06-step2-feature-subsampling';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 26, bottom: 26, left: 26 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const W = fig.width;
    const H = fig.height;
    const gap = 22;
    const panelW = (W - gap) / 2;
    const panelH = H;

    function frame(x, title, accent) {
      const g = fig.svg.append('g').attr('transform', `translate(${x}, 0)`);
      g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', panelW).attr('height', panelH)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', panelW / 2).attr('y', 24)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '12px')
        .text(title);
      g.append('rect')
        .attr('x', 18).attr('y', 58)
        .attr('width', panelW - 36).attr('height', 80)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-accent-cyan-soft)')
        .attr('stroke', accent)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', panelW / 2).attr('y', 88)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text('split node');
      g.append('text')
        .attr('x', panelW / 2).attr('y', 110)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text('candidate features');
      return g;
    }

    const features = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'];
    const subsetA = new Set(['f1', 'f4', 'f7']);
    const subsetB = new Set(['f2', 'f5', 'f8']);

    function drawFeaturePool(g, x0, y0, subset, accent, caption) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 12)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-size', '12px')
        .text(caption);

      const cellW = 60;
      const cellH = 28;
      const cols = 4;
      const grp = g.append('g').attr('transform', `translate(${x0}, ${y0})`);

      const item = grp.selectAll('g.f')
        .data(features)
        .enter()
        .append('g')
        .attr('class', 'f')
        .attr('transform', (d, i) => `translate(${(i % cols) * cellW}, ${Math.floor(i / cols) * (cellH + 12)})`);

      item.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 54).attr('height', cellH)
        .attr('rx', 8)
        .attr('fill', d => subset.has(d) ? 'rgba(0,255,255,0.18)' : 'rgba(0,0,0,0.10)')
        .attr('stroke', d => subset.has(d) ? accent : theme.border)
        .attr('stroke-width', 2);

      item.append('text')
        .attr('x', 27).attr('y', 18)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '12px')
        .text(d => d);

      g.append('text')
        .attr('x', x0).attr('y', y0 + 2 * (cellH + 12) + 26)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text(`m = ${Array.from(subset).length} of p = ${features.length} highlighted`);
    }

    function drawChosenSplit(g, x0, y0, accent, label) {
      g.append('rect')
        .attr('x', x0).attr('y', y0)
        .attr('width', panelW - 36).attr('height', 88)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-accent-green-soft)')
        .attr('stroke', accent)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', x0 + (panelW - 36) / 2).attr('y', y0 + 34)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '12px')
        .text(label);
      g.append('text')
        .attr('x', x0 + (panelW - 36) / 2).attr('y', y0 + 56)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text('best split among candidates');
    }

    const A = frame(0, 'Tree A', theme.cyan);
    const B = frame(panelW + gap, 'Tree B', theme.magenta);

    drawFeaturePool(A, 24, 156, subsetA, theme.cyan, 'candidates at this node');
    drawFeaturePool(B, 24, 156, subsetB, theme.magenta, 'candidates at this node');

    drawChosenSplit(A, 18, 430, theme.green, 'uses f4 for the split');
    drawChosenSplit(B, 18, 430, theme.green, 'uses f5 for the split');

    // Divider.
    fig.svg.append('line')
      .attr('x1', panelW + gap / 2).attr('x2', panelW + gap / 2)
      .attr('y1', 58).attr('y2', 560)
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', panelW + gap / 2).attr('y', 610)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('different candidate sets -> less correlation');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-07-step3-splitting-criterion" -->
## Step 3 - How a Tree Splits
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! A tree chooses splits that improve prediction in the child nodes
-: it tests candidate thresholds on the currently available features
-: it picks the split that gives the biggest improvement according to a criterion

***

-! Classification trees aim for purer class distributions
-: criteria such as Gini impurity or entropy measure how mixed a node is
-: a good split makes the children more pure, so uncertainty decreases

***

-! Regression trees aim for lower spread of target values
-: common criteria reduce mean squared error, which is closely related to variance
-: splitting continues until a stopping rule is met (depth, minimum samples, purity)
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-splitting-criterion-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= A split is good when it reduces impurity: the parent is mixed, the children are more pure.

<script>
(function() {
  const containerId = 'rf-splitting-criterion-plot';
  const slideId = 'random-forest-07-step3-splitting-criterion';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 30, bottom: 30, left: 30 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const W = fig.width;
    const H = fig.height;

    function nodeBox(x, y, w, h, title) {
      const g = fig.svg.append('g').attr('transform', `translate(${x}, ${y})`);
      g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', w).attr('height', h)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', w / 2).attr('y', 22)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(title);
      return g;
    }

    function stackedBar(g, x, y, w, h, p1) {
      const p0 = 1 - p1;
      g.append('rect')
        .attr('x', x).attr('y', y)
        .attr('width', w * p0).attr('height', h)
        .attr('rx', 8)
        .attr('fill', theme.orange)
        .attr('opacity', 0.85);
      g.append('rect')
        .attr('x', x + w * p0).attr('y', y)
        .attr('width', w * p1).attr('height', h)
        .attr('rx', 8)
        .attr('fill', theme.green)
        .attr('opacity', 0.85);
      g.append('rect')
        .attr('x', x).attr('y', y)
        .attr('width', w).attr('height', h)
        .attr('rx', 8)
        .attr('fill', 'none')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 1.8)
        .attr('opacity', 0.9);
      g.append('text')
        .attr('x', x).attr('y', y + h + 18)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text(`class 0: ${(p0 * 100).toFixed(0)}%`);
      g.append('text')
        .attr('x', x + w).attr('y', y + h + 18)
        .attr('text-anchor', 'end')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text(`class 1: ${(p1 * 100).toFixed(0)}%`);
    }

    function gini(p1) {
      const p0 = 1 - p1;
      return 1 - (p0 * p0 + p1 * p1);
    }

    function arrow(x1, y1, x2, y2, color) {
      const markerId = `${containerId}-arrow`;
      const defs = d3.select(`#${containerId} svg`).select('defs').empty()
        ? d3.select(`#${containerId} svg`).append('defs')
        : d3.select(`#${containerId} svg`).select('defs');

      if (defs.select(`#${markerId}`).empty()) {
        defs.append('marker')
          .attr('id', markerId)
          .attr('viewBox', '0 0 10 10')
          .attr('refX', 9).attr('refY', 5)
          .attr('markerWidth', 8).attr('markerHeight', 8)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .attr('fill', theme.muted);
      }

      fig.svg.append('line')
        .attr('x1', x1).attr('y1', y1)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', color || theme.muted)
        .attr('stroke-width', 3)
        .attr('marker-end', `url(#${markerId})`)
        .attr('opacity', 0.95);
    }

    const parentP1 = 0.50;
    const leftP1 = 0.15;
    const rightP1 = 0.85;

    const parent = nodeBox(120, 70, 400, 170, 'Parent node');
    stackedBar(parent, 40, 58, 320, 26, parentP1);
    parent.append('text')
      .attr('x', 200).attr('y', 145)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`Gini = ${gini(parentP1).toFixed(2)} (mixed)`);

    const leftChild = nodeBox(50, 320, 260, 220, 'Child (x < threshold)');
    stackedBar(leftChild, 30, 58, 200, 26, leftP1);
    leftChild.append('text')
      .attr('x', 130).attr('y', 145)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`Gini = ${gini(leftP1).toFixed(2)} (more pure)`);

    const rightChild = nodeBox(370, 320, 260, 220, 'Child (x ≥ threshold)');
    stackedBar(rightChild, 30, 58, 200, 26, rightP1);
    rightChild.append('text')
      .attr('x', 130).attr('y', 145)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`Gini = ${gini(rightP1).toFixed(2)} (more pure)`);

    arrow(320, 240, 180, 320);
    arrow(320, 240, 500, 320);

    fig.svg.append('text')
      .attr('x', W / 2)
      .attr('y', H - 16)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('goal: reduce impurity (classification) or error/variance (regression)');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-08-step4-growing-many-trees" -->
## Step 4 - Grow Many Trees
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Training a forest means training many trees independently
-: for each tree, take a bootstrap sample and build the tree with feature subsampling
-: each tree is allowed to grow fairly deep, because overfitting is handled by averaging

***

-! Why deep trees still work well inside a forest
-: deep trees reduce bias because they can fit complex patterns
-: randomness makes the trees different, so their errors are less correlated

***

-! The practical effect is a strong, stable model
-: individual trees may be noisy, but the ensemble smooths the noise out
-: increasing the number of trees mainly improves stability (but costs runtime)
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-grow-many-trees-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= A forest is a collection of many independently trained trees (T can be 100, 500, or more).

<script>
(function() {
  const containerId = 'rf-grow-many-trees-plot';
  const slideId = 'random-forest-08-step4-growing-many-trees';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 26, bottom: 26, left: 26 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)'
    };

    const W = fig.width;
    const H = fig.height;

    fig.svg.append('text')
      .attr('x', W / 2).attr('y', 18)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('Many trees (independent training)');

    const cols = 4;
    const rows = 3;
    const padX = 18;
    const padY = 42;
    const cellW = (W - padX * 2) / cols;
    const cellH = (H - padY * 2) / rows;

    function drawMiniTree(root, x0, y0, w, h, accent) {
      const g = root.append('g').attr('transform', `translate(${x0}, ${y0})`);
      g.append('rect')
        .attr('x', 10).attr('y', 10)
        .attr('width', w - 20).attr('height', h - 20)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);

      const cx = w / 2;
      const topY = 44;
      const midY = 78;
      const botY = 112;

      const jitter = (t) => (t * 13 % 11) - 5;
      const j1 = jitter(x0 + y0) * 0.7;
      const j2 = jitter(x0 - y0) * 0.7;

      const nodes = [
        { x: cx, y: topY, r: 5.2 },
        { x: cx - 26 + j1, y: midY, r: 5.0 },
        { x: cx + 26 + j2, y: midY, r: 5.0 },
        { x: cx - 42 + j2, y: botY, r: 4.6 },
        { x: cx - 10 + j1, y: botY, r: 4.6 },
        { x: cx + 10 + j2, y: botY, r: 4.6 },
        { x: cx + 42 + j1, y: botY, r: 4.6 }
      ];

      const links = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 5], [2, 6]
      ];

      g.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('x1', d => nodes[d[0]].x)
        .attr('y1', d => nodes[d[0]].y)
        .attr('x2', d => nodes[d[1]].x)
        .attr('y2', d => nodes[d[1]].y)
        .attr('stroke', theme.muted)
        .attr('stroke-width', 2);

      g.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.r)
        .attr('fill', 'var(--ml-accent-cyan-soft)')
        .attr('stroke', accent)
        .attr('stroke-width', 2);
    }

    const accents = [theme.cyan, theme.magenta, theme.green, theme.cyan];
    let k = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x0 = padX + c * cellW;
        const y0 = padY + r * cellH;
        drawMiniTree(fig.svg, x0, y0, cellW, cellH, accents[k % accents.length]);
        k++;
      }
    }

    fig.svg.append('text')
      .attr('x', W / 2).attr('y', H - 16)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('in practice: T is much larger than shown');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-09-prediction-vote-average" -->
## Prediction - Vote or Average
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Prediction means sending the same input to every tree
-: each tree produces its own output, based on its splits and leaves
-: we do not pick the best tree, we combine all trees

***

-! Classification: vote or average probabilities
-: each tree votes for a class, and the majority vote is the final class
-: if trees output probabilities, we average them to get a calibrated score

***

-! Regression: average numeric predictions
-: each tree returns a number (a mean value in its leaf)
-: the forest output is the average, which reduces variance and smooths noise
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-prediction-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= One input produces many tree outputs, which are then combined into one final prediction.

<script>
(function() {
  const containerId = 'rf-prediction-plot';
  const slideId = 'random-forest-09-prediction-vote-average';

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
    const margin = { top: 36, right: 26, bottom: 26, left: 26 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const W = fig.width;
    const H = fig.height;

    function box(x, y, w, h, label, stroke, fill) {
      const g = fig.svg.append('g').attr('transform', `translate(${x}, ${y})`);
      g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', w).attr('height', h)
        .attr('rx', 12)
        .attr('fill', fill || 'rgba(0,0,0,0.10)')
        .attr('stroke', stroke || theme.border)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', w / 2).attr('y', 22)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(label);
      return g;
    }

    function arrow(x1, y1, x2, y2) {
      const markerId = `${containerId}-arrow`;
      const defs = d3.select(`#${containerId} svg`).select('defs').empty()
        ? d3.select(`#${containerId} svg`).append('defs')
        : d3.select(`#${containerId} svg`).select('defs');
      if (defs.select(`#${markerId}`).empty()) {
        defs.append('marker')
          .attr('id', markerId)
          .attr('viewBox', '0 0 10 10')
          .attr('refX', 9).attr('refY', 5)
          .attr('markerWidth', 8).attr('markerHeight', 8)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .attr('fill', theme.muted);
      }
      fig.svg.append('line')
        .attr('x1', x1).attr('y1', y1)
        .attr('x2', x2).attr('y2', y2)
        .attr('stroke', theme.muted)
        .attr('stroke-width', 3)
        .attr('marker-end', `url(#${markerId})`)
        .attr('opacity', 0.95);
    }

    // Layout.
    const input = box(10, 220, 120, 160, 'Input x', theme.cyan);
    input.append('text')
      .attr('x', 60).attr('y', 88)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('same x');
    input.append('text')
      .attr('x', 60).attr('y', 112)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('to all trees');

    const trees = box(160, 90, 320, 420, 'Trees', theme.green);
    const agg = box(510, 150, 150, 300, 'Aggregation', theme.magenta);

    arrow(130, 300, 160, 300);
    arrow(480, 300, 510, 300);

    // Draw a set of mini trees and their outputs.
    const rng = seededRandom(123);
    const T = 9;
    const treeY = d3.range(T).map(i => 70 + i * 36);

    const treeGroup = trees.append('g').attr('transform', 'translate(18, 54)');

    function miniTree(g, x, y, color) {
      const r = g.append('g').attr('transform', `translate(${x}, ${y})`);
      r.append('line').attr('x1', 20).attr('y1', 6).attr('x2', 10).attr('y2', 18).attr('stroke', theme.muted).attr('stroke-width', 2);
      r.append('line').attr('x1', 20).attr('y1', 6).attr('x2', 30).attr('y2', 18).attr('stroke', theme.muted).attr('stroke-width', 2);
      r.append('circle').attr('cx', 20).attr('cy', 6).attr('r', 4).attr('fill', 'var(--ml-accent-green-soft)').attr('stroke', theme.green).attr('stroke-width', 2);
      r.append('circle').attr('cx', 10).attr('cy', 18).attr('r', 4).attr('fill', 'var(--ml-accent-green-soft)').attr('stroke', theme.green).attr('stroke-width', 2);
      r.append('circle').attr('cx', 30).attr('cy', 18).attr('r', 4).attr('fill', 'var(--ml-accent-green-soft)').attr('stroke', theme.green).attr('stroke-width', 2);
      r.append('rect')
        .attr('x', 52).attr('y', -6)
        .attr('width', 90).attr('height', 20)
        .attr('rx', 8)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      r.append('text')
        .attr('x', 97).attr('y', 8)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '11px')
        .text(color === theme.green ? 'vote: 1' : 'vote: 0');
    }

    const votes = [];
    for (let i = 0; i < T; i++) {
      // Make a plausible mix of votes.
      const p = 0.35 + 0.5 * rng();
      const vote = p > 0.5 ? 1 : 0;
      votes.push(vote);
      miniTree(treeGroup, 10, treeY[i], vote === 1 ? theme.green : theme.orange);
    }

    // Draw vote tally as bars in aggregation box.
    const v1 = votes.reduce((a, b) => a + b, 0);
    const v0 = T - v1;
    const prob = v1 / T;

    const ag = agg.append('g').attr('transform', 'translate(16, 54)');
    ag.append('text')
      .attr('x', 60).attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('vote tally');

    const barW = 110;
    const barH = 22;
    ag.append('rect')
      .attr('x', 5).attr('y', 20)
      .attr('width', barW).attr('height', barH)
      .attr('rx', 8)
      .attr('fill', 'var(--ml-surface)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);
    ag.append('rect')
      .attr('x', 5).attr('y', 20)
      .attr('width', barW * (v1 / T)).attr('height', barH)
      .attr('rx', 8)
      .attr('fill', theme.green)
      .attr('opacity', 0.85);

    ag.append('text')
      .attr('x', 5).attr('y', 60)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`votes for class 1: ${v1}/${T}`);

    ag.append('text')
      .attr('x', 5).attr('y', 82)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`votes for class 0: ${v0}/${T}`);

    ag.append('text')
      .attr('x', 60).attr('y', 122)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('mean probability');

    ag.append('rect')
      .attr('x', 5).attr('y', 140)
      .attr('width', barW).attr('height', 52)
      .attr('rx', 12)
      .attr('fill', 'var(--ml-accent-cyan-soft)')
      .attr('stroke', theme.cyan)
      .attr('stroke-width', 2);
    ag.append('text')
      .attr('x', 60).attr('y', 172)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text(`p(class 1) = ${prob.toFixed(2)}`);

    ag.append('text')
      .attr('x', 60).attr('y', 232)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('final output');

    ag.append('rect')
      .attr('x', 28).attr('y', 248)
      .attr('width', 64).attr('height', 26)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-accent-magenta-soft)')
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 2);
    ag.append('text')
      .attr('x', 60).attr('y', 266)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text(prob >= 0.5 ? 'class 1' : 'class 0');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-10-oob-validation" -->
## Built-in Validation - OOB Error
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Out-of-bag (OOB) error is a built-in validation for Random Forest
-: because of bootstrap sampling, each training row is left out for many trees
-: we can predict that row using only the trees that did not see it during training

***

-! OOB predictions behave like internal cross-validation
-: every row gets evaluated on a subset of trees that are "honestly" out-of-sample
-: aggregating these row-wise predictions gives an OOB error estimate

***

-! OOB is useful for quick model selection
-: it gives fast feedback for hyperparameters without an extra validation split
-: it is not a replacement for a final test set when you need a trustworthy report
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-oob-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= One row is predicted only by trees for which it was out-of-bag; their vote becomes the OOB prediction.

<script>
(function() {
  const containerId = 'rf-oob-plot';
  const slideId = 'random-forest-10-oob-validation';

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
    const margin = { top: 36, right: 26, bottom: 26, left: 26 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)',
      gray: 'var(--ml-gray-soft)'
    };

    const W = fig.width;
    const H = fig.height;
    const gap = 18;
    const leftW = 250;
    const rightW = W - leftW - gap;

    // Frames.
    const left = fig.svg.append('g');
    const right = fig.svg.append('g').attr('transform', `translate(${leftW + gap}, 0)`);

    function frame(root, x, y, w, h, title, accent) {
      root.append('rect')
        .attr('x', x).attr('y', y)
        .attr('width', w).attr('height', h)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      root.append('text')
        .attr('x', x + w / 2).attr('y', y + 22)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(title);
      if (accent) {
        root.append('rect')
          .attr('x', x + 10).attr('y', y + 34)
          .attr('width', w - 20).attr('height', 4)
          .attr('rx', 2)
          .attr('fill', accent)
          .attr('opacity', 0.8);
      }
    }

    frame(left, 0, 0, leftW, H, 'Training rows', theme.cyan);
    frame(right, 0, 0, rightW, H, 'Trees and OOB vote', theme.magenta);

    // Mock dataset as rows.
    const nRows = 14;
    const rng = seededRandom(202);
    const labels = d3.range(nRows).map(i => (i * 11 % 7) < 3 ? 1 : 0);
    const targetRow = 6;

    const rowsG = left.append('g').attr('transform', 'translate(18, 60)');
    rowsG.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('each tree bootstraps rows');

    const rowH = 34;
    const rowW = leftW - 36;
    const row = rowsG.selectAll('g.row')
      .data(d3.range(nRows))
      .enter()
      .append('g')
      .attr('class', 'row')
      .attr('transform', d => `translate(0, ${d * rowH})`);

    row.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', rowW).attr('height', 28)
      .attr('rx', 10)
      .attr('fill', d => d === targetRow ? 'rgba(0,255,255,0.12)' : 'rgba(0,0,0,0.10)')
      .attr('stroke', d => d === targetRow ? theme.cyan : theme.border)
      .attr('stroke-width', 2);

    row.append('text')
      .attr('x', 12).attr('y', 19)
      .attr('text-anchor', 'start')
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text(d => `row ${d + 1}`);

    row.append('circle')
      .attr('cx', rowW - 18)
      .attr('cy', 14)
      .attr('r', 7)
      .attr('fill', d => labels[d] ? theme.green : theme.orange)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.4)
      .attr('opacity', 0.95);

    left.append('text')
      .attr('x', leftW / 2)
      .attr('y', H - 18)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('highlighted row is evaluated OOB');

    // Trees: each has OOB status for targetRow + a vote.
    const T = 16;
    const trees = d3.range(T).map(i => {
      const isOOB = rng() < 0.38; // roughly 37% left out
      const vote = (rng() + (labels[targetRow] ? 0.12 : -0.12)) > 0.5 ? 1 : 0;
      return { i, isOOB, vote };
    });

    const oobTrees = trees.filter(t => t.isOOB);
    const vote1 = oobTrees.reduce((s, t) => s + t.vote, 0);
    const vote0 = oobTrees.length - vote1;
    const p1 = oobTrees.length ? vote1 / oobTrees.length : 0.5;
    const pred = p1 >= 0.5 ? 1 : 0;
    const truth = labels[targetRow];
    const correct = pred === truth;

    const treesG = right.append('g').attr('transform', 'translate(18, 60)');
    treesG.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('only OOB trees are allowed to vote');

    const cols = 4;
    const tileW = (rightW - 36) / cols;
    const tileH = 70;

    const tile = treesG.selectAll('g.tile')
      .data(trees)
      .enter()
      .append('g')
      .attr('class', 'tile')
      .attr('transform', d => `translate(${(d.i % cols) * tileW}, ${Math.floor(d.i / cols) * tileH})`);

    tile.append('rect')
      .attr('x', 8).attr('y', 10)
      .attr('width', tileW - 16).attr('height', 50)
      .attr('rx', 12)
      .attr('fill', d => d.isOOB ? 'rgba(255,5,255,0.08)' : 'rgba(255,255,255,0.04)')
      .attr('stroke', d => d.isOOB ? theme.magenta : theme.border)
      .attr('stroke-width', 2);

    tile.append('text')
      .attr('x', tileW / 2).attr('y', 30)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-size', '11px')
      .text(d => `tree ${d.i + 1}`);

    tile.append('text')
      .attr('x', tileW / 2).attr('y', 50)
      .attr('text-anchor', 'middle')
      .style('fill', d => d.isOOB ? theme.text : theme.gray)
      .style('font-size', '11px')
      .text(d => d.isOOB ? `vote: ${d.vote}` : 'in-bag');

    // OOB vote summary.
    const summary = right.append('g').attr('transform', `translate(18, ${H - 200})`);
    summary.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', rightW - 36).attr('height', 170)
      .attr('rx', 12)
      .attr('fill', 'var(--ml-surface)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    summary.append('text')
      .attr('x', 12).attr('y', 26)
      .attr('text-anchor', 'start')
      .style('fill', theme.text)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '11px')
      .text('OOB prediction for highlighted row');

    summary.append('text')
      .attr('x', 12).attr('y', 56)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`eligible trees: ${oobTrees.length}/${T}`);

    // Vote bar.
    const barW = 220;
    summary.append('rect')
      .attr('x', 12).attr('y', 72)
      .attr('width', barW).attr('height', 22)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-grid)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);
    summary.append('rect')
      .attr('x', 12).attr('y', 72)
      .attr('width', barW * p1).attr('height', 22)
      .attr('rx', 10)
      .attr('fill', theme.green)
      .attr('opacity', 0.85);

    summary.append('text')
      .attr('x', 12 + barW + 10).attr('y', 88)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`p(class 1) = ${p1.toFixed(2)}`);

    summary.append('text')
      .attr('x', 12).attr('y', 122)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`prediction: class ${pred} (vote ${vote1}:${vote0})`);

    summary.append('text')
      .attr('x', 12).attr('y', 146)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`true label: class ${truth} -> ${correct ? 'correct' : 'error'}`);
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-11-feature-importance" -->
## Interpretation - Feature Importance
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Feature importance answers: which inputs influence the model most?
-: it is a tool for understanding and sanity-checking, not a proof of causality
-: importance is always relative to the dataset and the chosen metric

***

-! Permutation importance is a robust default
-: randomly shuffle one feature column in the validation data
-: if performance drops, the model relied on that feature for prediction

***

-! There are alternative views with trade-offs
-: impurity-based importance is fast but can be biased toward high-cardinality features
-: partial dependence can show the average effect but can hide interactions
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-feature-importance-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Permutation importance: bar length is the drop in score after shuffling that feature.

<script>
(function() {
  const containerId = 'rf-feature-importance-plot';
  const slideId = 'random-forest-11-feature-importance';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 40, bottom: 40, left: 140 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const baseScore = 0.86;
    const data = [
      { feature: 'turbidity', drop: 0.10, color: theme.cyan },
      { feature: 'DOC', drop: 0.07, color: theme.magenta },
      { feature: 'temperature', drop: 0.04, color: theme.green },
      { feature: 'rain (24h)', drop: 0.03, color: theme.orange },
      { feature: 'season', drop: 0.02, color: theme.cyan }
    ].sort((a, b) => b.drop - a.drop);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.drop) * 1.15])
      .range([0, fig.width]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.feature))
      .range([0, fig.height])
      .padding(0.22);

    fig.svg.append('g')
      .attr('transform', `translate(0, ${fig.height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.2f')));
    fig.svg.append('g')
      .call(d3.axisLeft(y));

    // Axis styling.
    fig.svg.selectAll('.tick text')
      .style('fill', theme.muted)
      .style('font-size', '12px');
    fig.svg.selectAll('.domain, .tick line')
      .style('stroke', theme.border)
      .style('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text(`base score: ${baseScore.toFixed(2)} (before shuffling)`);

    const bars = fig.svg.append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('y', d => y(d.feature))
      .attr('width', d => x(d.drop))
      .attr('height', y.bandwidth())
      .attr('rx', 10)
      .attr('fill', d => d.color)
      .attr('opacity', 0.78)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.4);

    fig.svg.append('g')
      .selectAll('text.val')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'val')
      .attr('x', d => x(d.drop) + 8)
      .attr('y', d => y(d.feature) + y.bandwidth() / 2 + 4)
      .attr('text-anchor', 'start')
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text(d => `-${d.drop.toFixed(2)}`);

    fig.svg.append('text')
      .attr('x', fig.width)
      .attr('y', fig.height + 34)
      .attr('text-anchor', 'end')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('drop in score after shuffling (larger = more important)');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-12-hyperparameters" -->
## Practical Knobs
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! The main knobs trade off stability, runtime, and generalization
-: changing hyperparameters changes how complex the forest can be and how much it averages noise
-: defaults are often good, but tuning matters for small data and imbalanced problems

***

-! Number of trees controls stability
-: more trees reduce variance and make predictions more stable
-: beyond a point the improvement is small, but runtime keeps increasing

***

-! Depth, leaf size, and max features control complexity and diversity
-: deeper trees and smaller leaves increase flexibility but can overfit more
-: limiting max features makes trees less correlated, which helps averaging
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-hyperparameters-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Typical effects: more trees reduce variance, and too much depth can increase overfitting.

<script>
(function() {
  const containerId = 'rf-hyperparameters-plot';
  const slideId = 'random-forest-12-hyperparameters';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 30, bottom: 30, left: 30 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const W = fig.width;
    const H = fig.height;
    const gap = 22;
    const panelH = (H - gap) / 2;
    const panelW = (W - gap) / 2;

    function panel(x, y, w, h, title) {
      const g = fig.svg.append('g').attr('transform', `translate(${x}, ${y})`);
      g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', w).attr('height', h)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', w / 2).attr('y', 22)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '11px')
        .text(title);
      return g;
    }

    // Panel A: error vs number of trees.
    const pA = panel(0, 0, panelW, panelH, 'n_trees: stability');
    const aInner = { l: 46, t: 46, r: 18, b: 36 };
    const aW = panelW - aInner.l - aInner.r;
    const aH = panelH - aInner.t - aInner.b;
    const aG = pA.append('g').attr('transform', `translate(${aInner.l}, ${aInner.t})`);

    const xA = d3.scaleLinear().domain([10, 500]).range([0, aW]);
    const yA = d3.scaleLinear().domain([0.06, 0.20]).range([aH, 0]);
    aG.append('g').attr('transform', `translate(0, ${aH})`).call(d3.axisBottom(xA).ticks(4));
    aG.append('g').call(d3.axisLeft(yA).ticks(4));
    aG.selectAll('.tick text').style('fill', theme.muted).style('font-size', '11px');
    aG.selectAll('.domain, .tick line').style('stroke', theme.border).style('stroke-width', 2);

    const curveA = d3.range(10, 500.1, 5).map(n => {
      const err = 0.07 + 0.13 * Math.exp(-n / 90);
      return { n, err };
    });
    aG.append('path')
      .datum(curveA)
      .attr('d', d3.line().x(d => xA(d.n)).y(d => yA(d.err)))
      .attr('fill', 'none')
      .attr('stroke', theme.cyan)
      .attr('stroke-width', 3);

    aG.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('OOB error flattens out');

    // Panel B: depth vs generalization (U-shape).
    const pB = panel(panelW + gap, 0, panelW, panelH, 'max_depth: overfit');
    const bInner = { l: 46, t: 46, r: 18, b: 36 };
    const bW = panelW - bInner.l - bInner.r;
    const bH = panelH - bInner.t - bInner.b;
    const bG = pB.append('g').attr('transform', `translate(${bInner.l}, ${bInner.t})`);

    const xB = d3.scaleLinear().domain([2, 30]).range([0, bW]);
    const yB = d3.scaleLinear().domain([0.06, 0.22]).range([bH, 0]);
    bG.append('g').attr('transform', `translate(0, ${bH})`).call(d3.axisBottom(xB).ticks(4));
    bG.append('g').call(d3.axisLeft(yB).ticks(4));
    bG.selectAll('.tick text').style('fill', theme.muted).style('font-size', '11px');
    bG.selectAll('.domain, .tick line').style('stroke', theme.border).style('stroke-width', 2);

    const curveB = d3.range(2, 30.01, 0.5).map(d => {
      const err = 0.08 + 0.0025 * Math.pow(d - 10, 2) / 10;
      return { d, err };
    });
    bG.append('path')
      .datum(curveB)
      .attr('d', d3.line().x(d => xB(d.d)).y(d => yB(d.err)))
      .attr('fill', 'none')
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 3);

    bG.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('too deep can hurt');

    // Panel C: max_features effect (diversity vs strength).
    const pC = panel(0, panelH + gap, W, panelH, 'max_features: diversity');
    const cG = pC.append('g').attr('transform', 'translate(24, 60)');

    cG.append('text')
      .attr('x', 0).attr('y', -14)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('smaller m makes trees less correlated (better averaging)');

    const barX = 160;
    const barY = 30;
    const barW = W - 24 * 2 - barX - 30;

    const items = [
      { label: 'low m', corr: 0.25, strength: 0.65, color: theme.green },
      { label: 'high m', corr: 0.70, strength: 0.80, color: theme.orange }
    ];

    function drawTradeoff(y, d) {
      cG.append('text')
        .attr('x', 0).attr('y', y + 18)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-size', '12px')
        .text(d.label);

      // correlation bar
      cG.append('rect')
        .attr('x', barX).attr('y', y)
        .attr('width', barW).attr('height', 18)
        .attr('rx', 9)
        .attr('fill', 'var(--ml-grid)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      cG.append('rect')
        .attr('x', barX).attr('y', y)
        .attr('width', barW * d.corr).attr('height', 18)
        .attr('rx', 9)
        .attr('fill', theme.magenta)
        .attr('opacity', 0.78);
      cG.append('text')
        .attr('x', barX + barW + 10).attr('y', y + 14)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text(`corr: ${d.corr.toFixed(2)}`);

      // strength bar
      const y2 = y + 34;
      cG.append('rect')
        .attr('x', barX).attr('y', y2)
        .attr('width', barW).attr('height', 18)
        .attr('rx', 9)
        .attr('fill', 'var(--ml-grid)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      cG.append('rect')
        .attr('x', barX).attr('y', y2)
        .attr('width', barW * d.strength).attr('height', 18)
        .attr('rx', 9)
        .attr('fill', d.color)
        .attr('opacity', 0.78);
      cG.append('text')
        .attr('x', barX + barW + 10).attr('y', y2 + 14)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '12px')
        .text(`strength: ${d.strength.toFixed(2)}`);
    }

    drawTradeoff(28, items[0]);
    drawTradeoff(110, items[1]);

    cG.append('text')
      .attr('x', 0).attr('y', 220)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('goal: keep strength high and correlation low');
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-13-strengths-limitations" -->
## When to Use Random Forest
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Choose Random Forest when you need a strong baseline quickly
-: it often performs well with little preprocessing and minimal feature engineering
-: it can model nonlinear relationships and interactions between predictors

***

-! Choose Random Forest when prediction accuracy is more important than a simple formula
-: it is robust in many noisy settings because averaging smooths unstable trees
-: it works for classification and regression, and handles mixed feature types

***

-! Be aware of its limitations
-: it is harder to interpret than a small linear model such as logistic regression
-: it can struggle with extrapolation beyond the range covered by training data
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-when-to-use-plot" style="width: 100%; height: 650px; border: 1px solid #2d3a66; border-radius: 12px; background: rgba(15,23,42,0.85);"></div>
-= Trade-off sketch: interpretability versus flexibility (and why extrapolation can be tricky for trees).

<script>
(function() {
  const containerId = 'rf-when-to-use-plot';
  const slideId = 'random-forest-13-strengths-limitations';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 32, bottom: 70, left: 78 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const theme = {
      border: 'var(--ml-panel-border)',
      text: 'var(--ml-text)',
      muted: 'var(--ml-muted)',
      cyan: 'var(--ml-accent-cyan)',
      magenta: 'var(--ml-accent-magenta)',
      green: 'var(--ml-accent-green)',
      orange: 'var(--ml-accent-orange)'
    };

    const x = d3.scaleLinear().domain([0, 10]).range([0, fig.width]);
    const y = d3.scaleLinear().domain([0, 10]).range([fig.height, 0]);

    const xAxis = d3.axisBottom(x).ticks(5);
    const yAxis = d3.axisLeft(y).ticks(5);

    fig.svg.append('g')
      .attr('transform', `translate(0, ${fig.height})`)
      .call(xAxis);
    fig.svg.append('g')
      .call(yAxis);

    fig.svg.selectAll('.tick text')
      .style('fill', theme.muted)
      .style('font-size', '12px');
    fig.svg.selectAll('.domain, .tick line')
      .style('stroke', theme.border)
      .style('stroke-width', 2);

    // Quadrant hints.
    fig.svg.append('rect')
      .attr('x', x(0)).attr('y', y(10))
      .attr('width', x(10) - x(0))
      .attr('height', y(0) - y(10))
      .attr('fill', 'var(--ml-surface)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2)
      .attr('rx', 12);

    fig.svg.append('line')
      .attr('x1', x(5)).attr('x2', x(5))
      .attr('y1', y(0)).attr('y2', y(10))
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);
    fig.svg.append('line')
      .attr('x1', x(0)).attr('x2', x(10))
      .attr('y1', y(5)).attr('y2', y(5))
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', x(2.5)).attr('y', y(9.4))
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('high flexibility');

    fig.svg.append('text')
      .attr('x', x(7.5)).attr('y', y(1.0))
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('high interpretability');

    fig.svg.append('text')
      .attr('x', x(5)).attr('y', fig.height + 46)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('interpretability (easy to explain)  ->');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -54)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('flexibility (captures interactions)  ->');

    const models = [
      { name: 'Logistic regression', x: 8.2, y: 3.0, color: theme.cyan, note: 'simple, interpretable' },
      { name: 'Random forest', x: 4.2, y: 8.2, color: theme.green, note: 'flexible boundary' }
    ];

    const g = fig.svg.append('g');
    g.selectAll('circle.model')
      .data(models)
      .enter()
      .append('circle')
      .attr('class', 'model')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 9)
      .attr('fill', d => d.color)
      .attr('opacity', 0.9)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2);

    g.selectAll('text.label')
      .data(models)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => x(d.x) + 14)
      .attr('y', d => y(d.y) + 4)
      .attr('text-anchor', 'start')
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text(d => d.name);

    g.selectAll('text.note')
      .data(models)
      .enter()
      .append('text')
      .attr('class', 'note')
      .attr('x', d => x(d.x) + 14)
      .attr('y', d => y(d.y) + 22)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text(d => d.note);

    // Extrapolation callout: trees partition space, so outside the observed range the prediction is less reliable.
    const call = fig.svg.append('g').attr('transform', `translate(${x(6.2)}, ${y(7.4)})`);
    call.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', 240).attr('height', 96)
      .attr('rx', 12)
      .attr('fill', 'var(--ml-surface-2)')
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 2);
    call.append('text')
      .attr('x', 12).attr('y', 26)
      .attr('text-anchor', 'start')
      .style('fill', theme.text)
      .style('font-size', '12px')
      .text('extrapolation warning');
    call.append('text')
      .attr('x', 12).attr('y', 50)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('trees predict using seen regions;');
    call.append('text')
      .attr('x', 12).attr('y', 70)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '11px')
      .text('outside-range values can be risky');

    fig.svg.append('line')
      .attr('x1', x(5.0)).attr('y1', y(6.5))
      .attr('x2', x(6.2)).attr('y2', y(7.4) + 30)
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 2.4)
      .attr('opacity', 0.9);
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId, draw });
  }

  register();
})();
</script>
<!-- /position -->

<!-- /layout -->

---
