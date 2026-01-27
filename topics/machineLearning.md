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

<!-- .slide:id="cold-opener-3" -->
## What is learning?

<div style="border: 1px solid var(--ml-panel-border); border-radius: 14px; padding: 18px; background: var(--ml-panel-bg);">

  <svg viewBox="0 0 1000 360" width="100%" height="360" role="img" aria-label="Two flow diagrams: training from labeled data, and prediction from unlabeled data using a trained model">
    <defs>
      <marker id="arrow-cold-opener-3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ml-panel-border)"></path>
      </marker>
      <filter id="shadow-cold-opener-3" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.18" />
      </filter>
    </defs>
    <g font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="24" font-weight="900" fill="var(--ml-text)">
      <text x="70" y="58">Training (learn from labels)</text>
      <text x="70" y="218">Prediction (use learned model)</text>
    </g>
    <g font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="24" font-weight="800" fill="var(--ml-text)" filter="url(#shadow-cold-opener-3)">
      <rect x="70" y="80" width="270" height="82" rx="16" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="3" />
      <text x="205" y="132" text-anchor="middle">Labeled data</text>
      <rect x="395" y="80" width="240" height="82" rx="16" fill="var(--ml-accent-cyan-soft-2)" stroke="var(--ml-accent-cyan)" stroke-width="3" />
      <text x="515" y="132" text-anchor="middle">Training</text>
      <rect x="690" y="80" width="240" height="82" rx="16" fill="var(--ml-accent-green-soft-2)" stroke="var(--ml-accent-green)" stroke-width="3" />
      <text x="810" y="132" text-anchor="middle">Model</text>
      <rect x="70" y="240" width="270" height="82" rx="16" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="3" />
      <text x="205" y="292" text-anchor="middle">Unlabeled data</text>
      <rect x="395" y="240" width="240" height="82" rx="16" fill="var(--ml-accent-green-soft-2)" stroke="var(--ml-accent-green)" stroke-width="3" />
      <text x="515" y="292" text-anchor="middle">Model</text>
      <rect x="690" y="240" width="240" height="82" rx="16" fill="var(--ml-accent-orange-soft-2)" stroke="var(--ml-accent-orange)" stroke-width="3" />
      <text x="810" y="292" text-anchor="middle">Prediction</text>
    </g>
    <g stroke="var(--ml-panel-border)" stroke-width="6" fill="none" marker-end="url(#arrow-cold-opener-3)" opacity="0.95">
      <line x1="350" y1="121" x2="390" y2="121" />
      <line x1="645" y1="121" x2="685" y2="121" />
      <line x1="350" y1="281" x2="390" y2="281" />
      <line x1="645" y1="281" x2="685" y2="281" />
    </g>
    <g font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial" font-size="18" font-weight="700" fill="var(--ml-muted)">
      <text x="810" y="154" text-anchor="middle">knowledge from data</text>
      <text x="810" y="314" text-anchor="middle">assignment / decision</text>
    </g>
  </svg>

</div>

---

<!-- .slide:id="learrning-from-data" -->
## Learning from Data

<img src="resources/figures/1015608--44111-.webp" alt="A person looking at a computer screen with code and data visualizations" width="600" style="border: 1px solid var(--ml-panel-border); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">

This is a Kiwano.

---

<!-- .slide:id="prediction" -->
## Prediction from Learned Model

<img src="resources/figures/rect528.webp" alt="A person pointing at a large screen displaying data visualizations and charts" width="1000" style="border: 1px solid var(--ml-panel-border); border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">

Can we predict which of the objects are Kiwano?

---

<!-- .slide:id="definition-ml" -->
## Definition of Machine Learning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Learn a mapping from examples
-: data-driven rules instead of hand-coded rules

***

-! Goal: generalize
-: work well on new, unseen cases

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Ingredients
-: data + model class + objective (loss)

***

-! Output
-: predictions with uncertainty (e.g., p(exceedance))

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="important-terms-ml" -->
## Important Terms in Machine Learning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Feature (x)
-: measurable input (rainfall 24h, turbidity, discharge)

***

-! Label (y)
-: outcome to learn (exceedance: 0/1, or concentration of an analyte, or a class)

***

-! Model
-: rule that maps x -> prediction
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Training (fitting)
-: choose parameters that best match the labels

***

-! Validation / test
-: estimate how well it generalizes

***

-! Overfitting
-: fits noise -> fails on new data
-: not robust
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="types-of-ml" -->
## Types of Machine Learning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Supervised learning
-: learn from labeled examples (x, y)
-: Classification
-: Regression

***

-! Unsupervised learning
-: find structure in x (patterns without labels)
-: Anomaly detection

***

-! Reinforcement learning
-: learn decisions from feedback over time
-: game playing, robotics
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Classification
-: predict a class (exceedance yes/no, species A/B/C)
-: logistic regression
-: k-means clustering

***

-! Regression
-: predict a number (e.g., concentration, flow rate)
-: linear regression
-: nonlinear regression

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
        <stop offset="0%" stop-color="var(--ml-surface-2, #0b1222)" />
        <stop offset="100%" stop-color="var(--ml-surface, #0f1b33)" />
      </linearGradient>
      <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ml-accent-cyan-soft-2, #1b3b7a)" />
        <stop offset="100%" stop-color="var(--ml-accent-cyan-soft, #0b1e4a)" />
      </linearGradient>
      <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--ml-accent-orange-soft-2, #b9864a)" />
        <stop offset="100%" stop-color="var(--ml-accent-orange-soft, #8b5f2e)" />
      </linearGradient>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.35" />
      </filter>
      <pattern id="rainPattern" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
        <line x1="2" y1="0" x2="2" y2="14" stroke="var(--ml-accent-cyan, #7dd3fc)" stroke-opacity="0.35" stroke-width="3" />
        <line x1="10" y1="4" x2="10" y2="18" stroke="var(--ml-accent-cyan, #7dd3fc)" stroke-opacity="0.25" stroke-width="3" />
      </pattern>
    </defs>
    <!-- sky -->
    <rect x="0" y="0" width="700" height="250" fill="url(#skyGrad)" />
    <!-- distant hills / city -->
    <path d="M0,210 C80,185 140,205 220,190 C290,178 360,205 430,194 C520,180 590,205 700,188 L700,250 L0,250 Z"
          fill="var(--ml-surface-2, #0a1733)" opacity="0.9" />
    <g opacity="0.55">
      <rect x="70" y="165" width="28" height="45" fill="var(--ml-surface-2, #132a57)" />
      <rect x="106" y="150" width="36" height="60" fill="var(--ml-surface, #10244c)" />
      <rect x="150" y="168" width="22" height="42" fill="var(--ml-surface-2, #163161)" />
      <rect x="520" y="158" width="40" height="52" fill="var(--ml-surface, #10244c)" />
      <rect x="566" y="172" width="26" height="38" fill="var(--ml-surface-2, #132a57)" />
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
              fill="var(--ml-gray-soft, rgba(255,255,255,0.15))" stroke="var(--ml-stroke-muted, rgba(255,255,255,0.35))" stroke-width="3" />
      <rect x="230" y="168" width="200" height="150" fill="url(#rainPattern)" opacity="0.9" />
    </g>
    <!-- sand -->
    <path d="M0,250 C130,235 230,285 350,270 C460,256 560,300 700,275 L700,400 L0,400 Z"
          fill="url(#sandGrad)" />
    <!-- water -->
    <path d="M0,260 C120,290 230,260 350,285 C470,310 560,275 700,300 L700,400 L0,400 Z"
          fill="url(#waterGrad)" opacity="0.95" />
    <path d="M0,292 C140,322 260,292 380,315 C520,342 590,315 700,335" fill="none" stroke="var(--ml-accent-cyan, #5ea7ff)" stroke-opacity="0.35" stroke-width="4" />
    <path d="M0,330 C160,355 270,332 420,355 C560,378 610,360 700,380" fill="none" stroke="var(--ml-accent-cyan, #5ea7ff)" stroke-opacity="0.25" stroke-width="4" />
    <!-- runoff arrow -->
    <g opacity="0.95" filter="url(#softShadow)">
      <path d="M430,220 C460,240 490,255 520,270" fill="none" stroke="var(--ml-accent-magenta, #7c3aed)" stroke-width="10" stroke-linecap="round" />
      <path d="M520,270 L498,270 L512,254 Z" fill="var(--ml-accent-magenta, #7c3aed)" />
      <text x="470" y="235" fill="var(--ml-accent-magenta, #d8b4fe)" font-size="18" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        runoff after rain
      </text>
    </g>
    <!-- warning sign -->
    <g filter="url(#softShadow)">
      <rect x="90" y="210" width="18" height="160" rx="6" fill="var(--ml-panel-border, #334155)" />
      <path d="M70,235 L160,235 L160,300 L70,300 Z" fill="var(--ml-panel-bg, #0b1222)" stroke="var(--ml-accent-orange, #fbbf24)" stroke-width="6" />
      <path d="M115,250 L145,285 L85,285 Z" fill="var(--ml-accent-orange, #fbbf24)" />
      <rect x="112" y="262" width="6" height="14" rx="3" fill="var(--ml-panel-border, #0b1222)" />
      <circle cx="115" cy="282" r="4" fill="var(--ml-panel-border, #0b1222)" />
      <text x="130" y="325" fill="var(--ml-text, #e2e8f0)" font-size="16" font-weight="700" font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        possible exceedance
      </text>
    </g>
    <!-- lab + clock -->
    <g opacity="0.95" filter="url(#softShadow)">
      <rect x="520" y="38" width="150" height="70" rx="14" fill="var(--ml-surface, #0b1222)" stroke="var(--ml-panel-border, #2f4a7a)" stroke-width="3" />
      <g transform="translate(540,52)">
        <path d="M18,0 h20 v10 l10,16 a16,16 0 0 1 -14,24 h-12 a16,16 0 0 1 -14,-24 l10,-16 v-10 z"
              fill="var(--ml-accent-cyan, #60a5fa)" fill-opacity="0.25" stroke="var(--ml-accent-cyan, #60a5fa)" stroke-width="2" />
        <path d="M20,34 h28" stroke="var(--ml-accent-cyan, #60a5fa)" stroke-width="3" stroke-linecap="round" />
      </g>
      <g transform="translate(602,52)">
        <circle cx="18" cy="18" r="16" fill="var(--ml-accent-green, #22c55e)" fill-opacity="0.18" stroke="var(--ml-accent-green, #22c55e)" stroke-width="2" />
        <path d="M18,18 L18,9" stroke="var(--ml-accent-green, #22c55e)" stroke-width="3" stroke-linecap="round" />
        <path d="M18,18 L26,22" stroke="var(--ml-accent-green, #22c55e)" stroke-width="3" stroke-linecap="round" />
      </g>
      <text x="610" y="33" fill="var(--ml-text, #e2e8f0)" font-size="16" font-weight="700" text-anchor="middle"
            font-family="system-ui, -apple-system, Segoe UI, Roboto, Arial">
        lab result
      </text>
      <text x="610" y="126" fill="var(--ml-muted, #94a3b8)" font-size="14" text-anchor="middle"
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

-! Key idea (logistic regression)
-: map it to a probability: $p(y=1|x)=\\sigma(z) \\in [0,1]$
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
## The Sigmoid Function (Logistic Function)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Instead using a linear function like

$$ y\_{hat} = \\beta_0 + \\beta_1 x + ... + \\beta_n x_n $$

-: with $y\_{hat} \\in (-\\infty, +\\infty)$

***

-! We use a logistic (sigmoid) function to map to [0,1]:

$$ y\_{hat} = \\frac{1}{1 + e^{-(\\beta_0 + \\beta_1 x + ... + \\beta_n x_n)}} = \\frac{1}{1 + e^{-z}} = \\sigma(z) $$

-: with $y\_{hat} \\in [0, 1]$

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

    const width = 760;
    const height = 720;
    const margin = { top: 40, right: 26, bottom: 70, left: 70 };
    const fig = plotUtils.createFigure(containerId, width, height, margin);

    plotUtils.addAxes(fig, [-4, 4], [-0.5, 1.5], 5, 3);

    d3.select(`#${containerId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const curve = d3.range(-4, 4.001, 0.03).map(z => ({ z, p: sigmoid(z) }));

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

    fig.svg.append('path')
      .datum(curve)
      .attr('fill', 'none')
      .attr('stroke', 'var(--ml-accent-cyan)')
      .attr('stroke-width', 5)
      .attr('opacity', 0.9)
      .attr('d', d3.line()
        .x(d => fig.xScale(d.z))
        .y(d => fig.yScale(d.p)));

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
      .text('p(y=1|x) / label');
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

<!-- .slide:id="logistic-regression-03-nonlinear" -->
## The Sigmoid Function - Nonlinear Mapping
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
We know how to fit linear models:

$$ \beta = (X^TX)^{-1}X^Ty $$

-: with $\beta$ = coefficients, $X$ = features, $y$ = labels

***

But now we have a nonlinear mapping, so we need a different approach.
-: use iterative optimization (gradient ascent):

$$ \beta^{(i+1)} = \beta^{(i)} + \\eta X^T (y - \\sigma(X\\beta^{(i)})) $$
-: with learning rate $\\eta$, typically small (e.g., 0.01)
-: repeat until convergence
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: grid; gap: 12px;">
  <div style="display: flex; gap: 10px; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 10px; align-items: center;">
      <button id="logreg-nonlinear-step" style="padding: 10px 14px; border-radius: 10px; border: 1px solid var(--ml-panel-border); background: rgba(0,255,255,0.12); color: var(--ml-text); font-weight: 800; cursor: pointer;">
        Step
      </button>
      <button id="logreg-nonlinear-reset" style="padding: 10px 14px; border-radius: 10px; border: 1px solid var(--ml-panel-border); background: rgba(255,255,255,0.06); color: var(--ml-text); font-weight: 800; cursor: pointer;">
        Reset
      </button>
      <div id="logreg-nonlinear-status" style="font-size: 0.6em; color: var(--ml-muted); font-weight: 700;">
        iter: 0 | eta: 0.20
      </div>
    </div>
    <div id="logreg-nonlinear-beta" style="font-size: 0.6em; color: var(--ml-text); font-weight: 800; text-align: right;">
      beta = [0.00, 0.00, 0.00, 0.00]
    </div>
  </div>

  <div id="logreg-nonlinear-plot" style="width: 100%; height: 420px;"></div>

  <div>
    <div style="display: flex; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
      <div id="logreg-nonlinear-grad" style="font-size: 0.6em; color: var(--ml-muted); font-weight: 700; text-align: right;">
      </div>
    </div>
    <div style="max-height: 360px; overflow: auto; border-radius: 10px;">
      <table id="logreg-nonlinear-table" style="width: 100%; border-collapse: collapse; font-size: 0.5em; color: var(--ml-text);">
        <!-- filled by script -->
      </table>
    </div>
  </div>
</div>

<script>
(function() {
  const slideId = 'logistic-regression-03-nonlinear';
  const plotId = 'logreg-nonlinear-plot';
  const stepId = 'logreg-nonlinear-step';
  const resetId = 'logreg-nonlinear-reset';
  const statusId = 'logreg-nonlinear-status';
  const betaId = 'logreg-nonlinear-beta';
  const tableId = 'logreg-nonlinear-table';
  const gradId = 'logreg-nonlinear-grad';

  const eta = 0.20;
  const data = [
    // From the bathing-water scenario dataset (last days).
    { rain: 0, turbidity: 2.1, quick: 0.10, y: 0 },
    { rain: 3, turbidity: 3.4, quick: 0.12, y: 0 },
    { rain: 12, turbidity: 7.8, quick: 0.30, y: 1 },
    { rain: 6, turbidity: 4.9, quick: 0.18, y: 0 },
    { rain: 25, turbidity: 11.2, quick: 0.55, y: 1 },
    { rain: 0, turbidity: 2.4, quick: 0.09, y: 0 },
    { rain: 9, turbidity: 6.1, quick: 0.24, y: 1 },
  ];

  const sigmoid = (z) => 1 / (1 + Math.exp(-z));
  const fmt = (v, digits = 2) => (Number.isFinite(v) ? v.toFixed(digits) : '-');

  function mean(xs) {
    return xs.reduce((a, b) => a + b, 0) / xs.length;
  }

  function stdev(xs, mu) {
    const v = xs.reduce((acc, x) => acc + (x - mu) * (x - mu), 0) / xs.length;
    return Math.sqrt(v);
  }

  const scales = (() => {
    const rains = data.map(d => d.rain);
    const turbs = data.map(d => d.turbidity);
    const quicks = data.map(d => d.quick);

    const muRain = mean(rains);
    const muTurb = mean(turbs);
    const muQuick = mean(quicks);

    const sdRain = Math.max(1e-9, stdev(rains, muRain));
    const sdTurb = Math.max(1e-9, stdev(turbs, muTurb));
    const sdQuick = Math.max(1e-9, stdev(quicks, muQuick));

    return {
      rain: { mu: muRain, sd: sdRain },
      turbidity: { mu: muTurb, sd: sdTurb },
      quick: { mu: muQuick, sd: sdQuick },
    };
  })();

  function standardize(value, spec) {
    return (value - spec.mu) / spec.sd;
  }

  function compute(beta) {
    const b = beta[0];
    const wRain = beta[1];
    const wTurb = beta[2];
    const wQuick = beta[3];

    const rows = data.map(d => {
      const rainS = standardize(d.rain, scales.rain);
      const turbS = standardize(d.turbidity, scales.turbidity);
      const quickS = standardize(d.quick, scales.quick);

      const z = b + wRain * rainS + wTurb * turbS + wQuick * quickS;
      const p = sigmoid(z);
      const err = d.y - p;

      return {
        ...d,
        rainS,
        turbS,
        quickS,
        z,
        p,
        err,
        db: err,
        dwRain: rainS * err,
        dwTurb: turbS * err,
        dwQuick: quickS * err,
      };
    });

    const grad0 = rows.reduce((acc, r) => acc + r.db, 0);
    const grad1 = rows.reduce((acc, r) => acc + r.dwRain, 0);
    const grad2 = rows.reduce((acc, r) => acc + r.dwTurb, 0);
    const grad3 = rows.reduce((acc, r) => acc + r.dwQuick, 0);

    return { rows, grad: [grad0, grad1, grad2, grad3] };
  }

  function renderTable(tableEl, beta, nextBeta, rows) {
    const headerStyle = 'text-align: right; padding: 6px 8px; border-bottom: 1px solid var(--ml-panel-border); position: sticky; top: 0;';
    const cellStyleR = 'text-align: right; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.08);';
    const cellStyleC = 'text-align: center; padding: 6px 8px; border-bottom: 1px solid rgba(255,255,255,0.08);';

    const head = `
      <thead>
        <tr>
          <th style="${headerStyle}">rain</th>
          <th style="${headerStyle}">turb.</th>
          <th style="${headerStyle}">quick</th>
          <th style="${headerStyle}; text-align:center;">y</th>
          <th style="${headerStyle}">yhat</th>
          <th style="${headerStyle}">y - yhat</th>
        </tr>
      </thead>
    `;

    const body = rows.map(r => `
      <tr>
        <td style="${cellStyleR}">${fmt(r.rain, 0)}</td>
        <td style="${cellStyleR}">${fmt(r.turbidity, 1)}</td>
        <td style="${cellStyleR}">${fmt(r.quick, 2)}</td>
        <td style="${cellStyleC}">${r.y}</td>
        <td style="${cellStyleR}">${fmt(r.p, 3)}</td>
        <td style="${cellStyleR}">${fmt(r.err, 3)}</td>
      </tr>
    `).join('');

    tableEl.innerHTML = head + `<tbody>${body}</tbody>`;
  }

  function draw() {
    const plotContainer = document.getElementById(plotId);
    const stepBtn = document.getElementById(stepId);
    const resetBtn = document.getElementById(resetId);
    const statusEl = document.getElementById(statusId);
    const betaEl = document.getElementById(betaId);
    const tableEl = document.getElementById(tableId);
    const gradEl = document.getElementById(gradId);

    if (!plotContainer || !stepBtn || !resetBtn || !statusEl || !betaEl || !tableEl || !gradEl) return;

    // Avoid duplicate listeners if something re-renders the markdown.
    if (plotContainer.dataset.bound === '1') return;
    plotContainer.dataset.bound = '1';

    let iter = 0;
    let beta = [0, 0, 0, 0]; // [b, w_rain, w_turbidity, w_quick]

    const turbSValues = data.map(d => standardize(d.turbidity, scales.turbidity));
    const xMin = Math.min(...turbSValues) - 0.6;
    const xMax = Math.max(...turbSValues) + 0.6;

    const width = 780;
    const height = 420;
    const margin = { top: 30, right: 26, bottom: 60, left: 70 };
    const fig = plotUtils.createFigure(plotId, width, height, margin);
    plotUtils.addAxes(fig, [xMin, xMax], [-0.15, 1.15], 5, 5);

    d3.select(`#${plotId} svg`)
      .style('background-color', 'var(--ml-panel-bg)')
      .style('border-radius', '12px');

    // Reference lines at y=0 and y=1.
    fig.svg.append('line')
      .attr('x1', fig.xScale(xMin)).attr('x2', fig.xScale(xMax))
      .attr('y1', fig.yScale(0)).attr('y2', fig.yScale(0))
      .attr('stroke', 'var(--ml-stroke-soft)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');
    fig.svg.append('line')
      .attr('x1', fig.xScale(xMin)).attr('x2', fig.xScale(xMax))
      .attr('y1', fig.yScale(1)).attr('y2', fig.yScale(1))
      .attr('stroke', 'var(--ml-stroke-soft)')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '6 6');

    // Fixed points (x = turbidity (standardized), y = label).
    const pointsSelection = fig.svg.append('g')
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(standardize(d.turbidity, scales.turbidity)))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 7)
      .attr('fill', d => d.y === 1 ? 'var(--ml-accent-green)' : 'var(--ml-accent-orange)')
      .attr('stroke', 'var(--ml-text)')
      .attr('stroke-width', 2)
      .attr('opacity', 0.95);

    // Logistic curve p(y=1|x) while varying turbidity; others held at mean (0 after standardization).
    const curvePath = fig.svg.append('path')
      .attr('fill', 'none')
      .attr('stroke', 'var(--ml-accent-cyan)')
      .attr('stroke-width', 5)
      .attr('opacity', 0.92);

    // Threshold p = 0.5.
    fig.svg.append('line')
      .attr('x1', fig.xScale(xMin)).attr('x2', fig.xScale(xMax))
      .attr('y1', fig.yScale(0.5)).attr('y2', fig.yScale(0.5))
      .attr('stroke', 'rgba(255,255,255,0.18)')
      .attr('stroke-width', 2);

    const betaText = fig.svg.append('text')
      .attr('x', fig.xScale(xMin + 0.1))
      .attr('y', fig.yScale(1.08))
      .style('fill', 'var(--ml-muted)')
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");

    // Axis labels.
    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 48)
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('turbidity (standardized), other features fixed');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -55)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', 'var(--d3-axis-label-text-color)')
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('label (0/1) + curve p(y=1|x)');

    function updatePlot() {
      const { rows } = compute(beta);

      const curve = d3.range(xMin, xMax + 1e-9, 0.03).map(x => ({
        x,
        p: sigmoid(beta[0] + beta[2] * x)
      }));

      curvePath
        .datum(curve)
        .attr('d', d3.line()
          .x(d => fig.xScale(d.x))
          .y(d => fig.yScale(d.p)));

      // Keep label points fixed on x=turbidity.
      pointsSelection
        .data(rows)
        .attr('cx', r => fig.xScale(r.turbS));
    }

    function render() {
      const { rows, grad } = compute(beta);
      const nextBeta = [
        beta[0] + eta * grad[0],
        beta[1] + eta * grad[1],
        beta[2] + eta * grad[2],
        beta[3] + eta * grad[3],
      ];

      statusEl.textContent = `iter: ${iter} | eta: ${eta.toFixed(2)}`;
      betaEl.textContent = `beta = [${fmt(beta[0], 2)}, ${fmt(beta[1], 2)}, ${fmt(beta[2], 2)}, ${fmt(beta[3], 2)}]`;

      renderTable(tableEl, beta, nextBeta, rows);
      updatePlot();
    }

    function step() {
      const { grad } = compute(beta);
      beta = [
        beta[0] + eta * grad[0],
        beta[1] + eta * grad[1],
        beta[2] + eta * grad[2],
        beta[3] + eta * grad[3],
      ];
      iter += 1;
      render();
    }

    function reset() {
      iter = 0;
      beta = [0, 0, 0, 0];
      render();
    }

    stepBtn.addEventListener('click', step);
    resetBtn.addEventListener('click', reset);

    render();
  }

  function register() {
    if (typeof plotUtils === 'undefined') {
      setTimeout(register, 80);
      return;
    }
    plotUtils.renderOnSlideOnce({ slideId, containerId: plotId, draw });
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

<!-- .slide:id="logistic-regression-04a-webr-example" -->
## Practical Example in R (WebR)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Fit the same baseline model in R
-: `glm(..., family = binomial())`

***

-! Standardize features before fitting
-: makes coefficients comparable

***

-! Use the model for decisions
-: predict `p(exceedance)` for "today"
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="logreg-webr-example-container"></div>
  <div id="logreg-webr-example-plot" style="border: 1px solid var(--ml-panel-border); border-radius: 12px; min-height: 240px; display: flex; align-items: center; justify-content: center; color: var(--ml-muted); font-size: 0.9em; text-align: center; padding: 12px; background: var(--ml-panel-bg);">
    Run the WebR example to render the coefficient plot.
  </div>
  <button id="logreg-webr-example-open-plot" style="padding: 8px 16px; background: var(--ml-panel-bg); color: var(--ml-text); border: 1px solid var(--ml-panel-border); border-radius: 8px; cursor: pointer; font-size: 0.85em; font-weight: 700; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'logreg-webr-example-container';
  const plotContainerId = 'logreg-webr-example-plot';
  const openBtnId = 'logreg-webr-example-open-plot';
  const slideId = 'logistic-regression-04a-webr-example';

  const code = `# Logistic regression in R (water-quality example)
# Features: rainfall_24h, turbidity, discharge
# Label: exceedance (0/1)

df <- data.frame(
  rainfall_24h = c(0, 3, 12, 6, 25, 0, 9, 8),
  turbidity    = c(2.1, 3.4, 7.8, 4.9, 11.2, 2.4, 6.1, 6.8),
  discharge    = c(0.8, 1.0, 1.6, 1.1, 1.9, 0.7, 1.4, 1.3),
  exceedance   = c(0, 0, 1, 0, 1, 0, 1, NA)
)

# Train on labeled rows only
train <- subset(df, !is.na(exceedance))

# Standardize features (unit-free)
features <- c("rainfall_24h","turbidity","discharge")
mu <- colMeans(train[, features])
sd <- apply(train[, features], 2, sd)
train_scaled <- as.data.frame(scale(train[, features], center = mu, scale = sd))
train_scaled$exceedance <- train$exceedance

# Fit baseline model (no interactions)
fit <- glm(exceedance ~ rainfall_24h + turbidity + discharge,
  data = train_scaled,
  family = binomial()
) |> print()

# Coefficients (standardized): sign shows direction of risk
b <- coef(fit)[-1]
names(b) <- c("rainfall_24h", "turbidity", "discharge")

par(mar = c(5, 9, 3, 1))
cols <- ifelse(b >= 0, "#10b981", "#f97316")
barplot(rev(b),
  horiz = TRUE, las = 1,
  col = rev(cols),
  xlab = "coefficient (standardized)"
)
abline(v = 0, lwd = 2, col = "gray40")

# Predict probability for "today"
today <- df[nrow(df), features]
today_scaled <- as.data.frame(scale(today, center = mu, scale = sd))
p_today <- predict(fit, newdata = today_scaled, type = "response")

title("Drivers of risk in the baseline model")
mtext(sprintf("p(exceedance | today) = %.2f", p_today), side = 3, line = 0.2, cex = 0.9)`;

  const fallbackOutput = `[Simulated]
Coefficient plot (standardized): which features push risk up or down.`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run Logistic Regression (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 420,
        background: '#ffffff',
        altText: 'Coefficient plot from logistic regression in WebR',
        loadingMessage: 'Fitting model and rendering plot...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the coefficient plot.'
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

<!-- .slide:id="random-forest-01-linear-failure" -->
## Why Linear Fails Here
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Same water-quality decision context
-: risk depends on interactions, not one trend
-! Linear model assumption is violated
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-linear-failure-plot" style="width: 100%; height: 650px;"></div>

<script>
(function() {
  const containerId = 'rf-linear-failure-plot';
  const slideId = 'random-forest-01-linear-failure';

  function draw() {
    if (typeof d3 === 'undefined' || typeof plotUtils === 'undefined') {
      setTimeout(draw, 80);
      return;
    }
    const container = document.getElementById(containerId);
    if (!container) return;

    const width = 680;
    const height = 650;
    const margin = { top: 36, right: 30, bottom: 70, left: 70 };
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

    plotUtils.addAxes(fig, [-6, 6], [0, 1], 7, 5);

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
      .style('stroke', theme.border)
      .style('stroke-width', '2px');
    fig.yAxisGroup.selectAll('path, line')
      .style('stroke', theme.border)
      .style('stroke-width', '2px');
    fig.xAxisGroup.selectAll('text')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");
    fig.yAxisGroup.selectAll('text')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .style('font-family', "'Press Start 2P', monospace");

    fig.svg.append('rect')
      .attr('x', fig.xScale(-1))
      .attr('y', 0)
      .attr('width', fig.xScale(1) - fig.xScale(-1))
      .attr('height', fig.height)
      .attr('fill', 'var(--ml-accent-magenta-soft)')
      .attr('opacity', 0.22);

    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const curve = d3.range(-6, 6.001, 0.05).map(z => ({ z, p: sigmoid(z) }));

    fig.svg.append('path')
      .datum(curve)
      .attr('fill', 'none')
      .attr('stroke', theme.cyan)
      .attr('stroke-width', 5)
      .attr('opacity', 0.92)
      .attr('d', d3.line()
        .x(d => fig.xScale(d.z))
        .y(d => fig.yScale(d.p)));

    const class0 = [-3.8, -3.1, -2.4, -1.7, -1.0, -0.3, 0.4, 1.1, 1.8, 2.5, 3.2];
    const class1 = [-3.5, -2.8, -2.1, -1.4, -0.7, 0.0, 0.7, 1.4, 2.1, 2.8, 3.5];
    const points = [
      ...class0.map(z => ({ z, y: 0, cls: 0 })),
      ...class1.map(z => ({ z, y: 1, cls: 1 }))
    ];

    fig.svg.append('g')
      .selectAll('circle')
      .data(points)
      .enter()
      .append('circle')
      .attr('cx', d => fig.xScale(d.z))
      .attr('cy', d => fig.yScale(d.y))
      .attr('r', 5.2)
      .attr('fill', d => d.cls === 1 ? theme.green : theme.orange)
      .attr('stroke', theme.text)
      .attr('stroke-width', 1.8)
      .attr('opacity', 0.9);

    fig.svg.append('text')
      .attr('x', fig.width / 2)
      .attr('y', fig.height + 55)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('linear score z');

    fig.svg.append('text')
      .attr('x', -fig.height / 2)
      .attr('y', -58)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('p(exceedance)');
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

<!-- .slide:id="random-forest-00-abstract-forest" -->
## Random Forest (Abstract)
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
<div style="width: 100%; height: 650px; display: flex; align-items: center; justify-content: center;">

  <svg viewBox="0 0 640 520" width="100%" height="100%" role="img" aria-label="Abstract decision tree diagram">
    <rect x="12" y="12" width="616" height="496" rx="16" fill="var(--ml-panel-bg)" stroke="var(--ml-panel-border)" stroke-width="3"/>
    <g stroke="var(--ml-panel-border)" stroke-width="3" opacity="0.9">
      <line x1="320" y1="120" x2="210" y2="210"/>
      <line x1="320" y1="120" x2="430" y2="210"/>
      <line x1="210" y1="250" x2="150" y2="340"/>
      <line x1="210" y1="250" x2="270" y2="340"/>
      <line x1="430" y1="250" x2="370" y2="340"/>
      <line x1="430" y1="250" x2="490" y2="340"/>
    </g>
    <g fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="3">
      <circle cx="320" cy="120" r="28"/>
      <circle cx="210" cy="250" r="26"/>
      <circle cx="430" cy="250" r="26"/>
      <rect x="110" y="340" width="80" height="52" rx="12"/>
      <rect x="230" y="340" width="80" height="52" rx="12"/>
      <rect x="350" y="340" width="80" height="52" rx="12"/>
      <rect x="470" y="340" width="80" height="52" rx="12"/>
    </g>
    <g font-family="'Press Start 2P', monospace" fill="var(--ml-text)" opacity="0.95">
      <text x="320" y="92" text-anchor="middle" font-size="10">root</text>
      <text x="210" y="222" text-anchor="middle" font-size="9">split</text>
      <text x="430" y="222" text-anchor="middle" font-size="9">split</text>
      <text x="150" y="372" text-anchor="middle" font-size="9">leaf</text>
      <text x="270" y="372" text-anchor="middle" font-size="9">leaf</text>
      <text x="390" y="372" text-anchor="middle" font-size="9">leaf</text>
      <text x="510" y="372" text-anchor="middle" font-size="9">leaf</text>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="9" fill="var(--ml-muted)">
      <text x="320" y="160" text-anchor="middle">turbidity > t?</text>
      <text x="210" y="290" text-anchor="middle">rainfall > r?</text>
      <text x="430" y="290" text-anchor="middle">discharge > q?</text>
    </g>
    <g opacity="0.95">
      <rect x="122" y="352" width="56" height="12" rx="6" fill="var(--ml-accent-orange-soft-2)"/>
      <rect x="122" y="352" width="18" height="12" rx="6" fill="var(--ml-accent-green-soft)"/>
      <rect x="242" y="352" width="56" height="12" rx="6" fill="var(--ml-accent-orange-soft-2)"/>
      <rect x="242" y="352" width="40" height="12" rx="6" fill="var(--ml-accent-green-soft)"/>
      <rect x="362" y="352" width="56" height="12" rx="6" fill="var(--ml-accent-orange-soft-2)"/>
      <rect x="362" y="352" width="46" height="12" rx="6" fill="var(--ml-accent-green-soft)"/>
      <rect x="482" y="352" width="56" height="12" rx="6" fill="var(--ml-accent-orange-soft-2)"/>
      <rect x="482" y="352" width="10" height="12" rx="6" fill="var(--ml-accent-green-soft)"/>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">
      <text x="320" y="468" text-anchor="middle">one tree = sequence of questions</text>
    </g>
  </svg>

</div>
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div style="width: 100%; height: 650px; display: flex; align-items: center; justify-content: center;">

  <svg viewBox="0 0 640 520" width="100%" height="100%" role="img" aria-label="Abstract random forest diagram">
    <rect x="12" y="12" width="616" height="496" rx="16" fill="var(--ml-panel-bg)" stroke="var(--ml-panel-border)" stroke-width="3"/>
    <g fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="2">
      <rect x="40" y="70" width="150" height="110" rx="14"/>
      <rect x="40" y="205" width="150" height="110" rx="14"/>
      <rect x="40" y="340" width="150" height="110" rx="14"/>
      <rect x="220" y="70" width="150" height="110" rx="14"/>
      <rect x="220" y="205" width="150" height="110" rx="14"/>
      <rect x="220" y="340" width="150" height="110" rx="14"/>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-text)" opacity="0.95">
      <text x="62" y="96">tree</text>
      <text x="62" y="231">tree</text>
      <text x="62" y="366">tree</text>
      <text x="242" y="96">tree</text>
      <text x="242" y="231">tree</text>
      <text x="242" y="366">tree</text>
    </g>
    <g stroke="var(--ml-accent-cyan)" stroke-width="3" opacity="0.8">
      <line x1="190" y1="125" x2="410" y2="155"/>
      <line x1="190" y1="260" x2="410" y2="200"/>
      <line x1="190" y1="395" x2="410" y2="245"/>
      <line x1="370" y1="125" x2="410" y2="155"/>
      <line x1="370" y1="260" x2="410" y2="200"/>
      <line x1="370" y1="395" x2="410" y2="245"/>
    </g>
    <g>
      <rect x="410" y="140" width="190" height="140" rx="16" fill="var(--ml-surface-2)" stroke="var(--ml-accent-magenta)" stroke-width="3" opacity="0.95"/>
      <text x="505" y="175" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="11" fill="var(--ml-text)">aggregate</text>
      <text x="505" y="205" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">vote / avg p</text>
      <rect x="455" y="232" width="100" height="18" rx="9" fill="var(--ml-accent-cyan-soft-2)" stroke="var(--ml-accent-cyan)" stroke-width="2" opacity="0.9"/>
      <rect x="455" y="232" width="64" height="18" rx="9" fill="var(--ml-accent-green-soft)" opacity="0.95"/>
      <text x="505" y="247" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="var(--ml-text)">p=0.64</text>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">
      <text x="60" y="48">many trees</text>
      <text x="445" y="320">one prediction</text>
    </g>
  </svg>

</div>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-00b-tree-anatomy" -->
## Tree Anatomy (Words We Will Use)
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! root, branch, leaf
-: root at the top, leaves store the prediction

***

-! depth
-: number of split steps from root to leaf
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div style="width: 100%; height: 650px; display: flex; align-items: center; justify-content: center;">

  <svg viewBox="0 0 640 520" width="100%" height="100%" role="img" aria-label="Decision tree anatomy diagram">
    <rect x="12" y="12" width="616" height="496" rx="16" fill="var(--ml-panel-bg)" stroke="var(--ml-panel-border)" stroke-width="3"/>
    <g stroke="var(--ml-panel-border)" stroke-width="3" opacity="0.9">
      <line x1="320" y1="120" x2="220" y2="220"/>
      <line x1="320" y1="120" x2="420" y2="220"/>
      <line x1="220" y1="250" x2="160" y2="340"/>
      <line x1="220" y1="250" x2="280" y2="340"/>
      <line x1="420" y1="250" x2="360" y2="340"/>
      <line x1="420" y1="250" x2="480" y2="340"/>
    </g>
    <g fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="3">
      <circle cx="320" cy="120" r="28"/>
      <circle cx="220" cy="250" r="26"/>
      <circle cx="420" cy="250" r="26"/>
      <rect x="122" y="340" width="76" height="52" rx="12"/>
      <rect x="242" y="340" width="76" height="52" rx="12"/>
      <rect x="342" y="340" width="76" height="52" rx="12"/>
      <rect x="462" y="340" width="76" height="52" rx="12"/>
    </g>
    <g font-family="'Press Start 2P', monospace" fill="var(--ml-text)" opacity="0.95">
      <text x="320" y="92" text-anchor="middle" font-size="10">root</text>
      <text x="220" y="222" text-anchor="middle" font-size="9">branch</text>
      <text x="420" y="222" text-anchor="middle" font-size="9">branch</text>
      <text x="160" y="372" text-anchor="middle" font-size="9">leaf</text>
      <text x="280" y="372" text-anchor="middle" font-size="9">leaf</text>
      <text x="380" y="372" text-anchor="middle" font-size="9">leaf</text>
      <text x="500" y="372" text-anchor="middle" font-size="9">leaf</text>
    </g>
    <!-- depth indicator -->
    <g stroke="var(--ml-accent-cyan)" stroke-width="4" opacity="0.9">
      <line x1="88" y1="120" x2="88" y2="372"/>
    </g>
    <g fill="var(--ml-accent-cyan)" opacity="0.9">
      <circle cx="88" cy="120" r="5.5"/>
      <circle cx="88" cy="250" r="5.5"/>
      <circle cx="88" cy="372" r="5.5"/>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">
      <text x="104" y="180">depth</text>
      <text x="104" y="204">= 2</text>
    </g>
  </svg>
  
</div>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-00a-tree-vs-forest" -->
## Decision Tree vs Random Forest
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Decision tree: one sequence of questions
-: each path ends in a prediction (leaf)

***

-! Random forest: many trees + aggregation
-: average probability (classification) -> more stable
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div style="width: 100%; height: 650px; display: flex; align-items: center; justify-content: center;">

  <svg viewBox="0 0 640 520" width="100%" height="100%" role="img" aria-label="One tree versus many trees diagram">
    <rect x="12" y="12" width="616" height="496" rx="16" fill="var(--ml-panel-bg)" stroke="var(--ml-panel-border)" stroke-width="3"/>
    <g>
      <rect x="44" y="70" width="240" height="380" rx="18" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="2.5"/>
      <rect x="356" y="70" width="240" height="380" rx="18" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="2.5"/>
    </g>
    <!-- left: single tree -->
    <g stroke="var(--ml-panel-border)" stroke-width="3" opacity="0.9">
      <line x1="164" y1="150" x2="120" y2="220"/>
      <line x1="164" y1="150" x2="208" y2="220"/>
      <line x1="120" y1="250" x2="92" y2="320"/>
      <line x1="120" y1="250" x2="148" y2="320"/>
    </g>
    <g fill="var(--ml-surface-2)" stroke="var(--ml-panel-border)" stroke-width="3">
      <circle cx="164" cy="150" r="18"/>
      <circle cx="120" cy="250" r="16"/>
      <rect x="72" y="320" width="42" height="30" rx="10"/>
      <rect x="132" y="320" width="42" height="30" rx="10"/>
      <circle cx="208" cy="250" r="16"/>
      <rect x="186" y="320" width="44" height="30" rx="10"/>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">
      <text x="164" y="106" text-anchor="middle">one tree</text>
    </g>
    <!-- right: a small forest -->
    <g fill="var(--ml-surface-2)" stroke="var(--ml-panel-border)" stroke-width="2.5" opacity="0.95">
      <rect x="388" y="124" width="56" height="78" rx="12"/>
      <rect x="460" y="106" width="56" height="96" rx="12"/>
      <rect x="532" y="134" width="56" height="68" rx="12"/>
    </g>
    <g stroke="var(--ml-accent-cyan)" stroke-width="3" opacity="0.85">
      <line x1="416" y1="220" x2="476" y2="280"/>
      <line x1="488" y1="220" x2="476" y2="280"/>
      <line x1="560" y1="220" x2="476" y2="280"/>
    </g>
    <g>
      <rect x="418" y="284" width="164" height="96" rx="16" fill="var(--ml-surface-2)" stroke="var(--ml-accent-magenta)" stroke-width="3" opacity="0.95"/>
      <text x="500" y="318" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-text)">aggregate</text>
      <text x="500" y="344" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="var(--ml-muted)">avg probability</text>
      <rect x="450" y="356" width="100" height="16" rx="8" fill="var(--ml-accent-cyan-soft-2)" stroke="var(--ml-accent-cyan)" stroke-width="2" opacity="0.9"/>
      <rect x="450" y="356" width="62" height="16" rx="8" fill="var(--ml-accent-green-soft)" opacity="0.95"/>
      <text x="500" y="369" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="var(--ml-text)">p=0.62</text>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">
      <text x="476" y="106" text-anchor="middle">many trees</text>
    </g>
  </svg>

</div>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-00c-purity-impurity" -->
## Purity / Impurity After a Split
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! A good split makes child nodes more pure
-: fewer mixed labels in each child

***

-! Measured by impurity (Gini/entropy)
-: we prefer splits that reduce impurity

$$ GINI = 1 - \sum_{i=1}^{C} p_i^2 $$

-: $p_i$ = proportion of class i in node, C = number of classes
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div style="width: 100%; height: 650px; display: flex; align-items: center; justify-content: center;">

  <svg viewBox="0 0 640 520" width="100%" height="100%" role="img" aria-label="Impurity before and after split diagram">
    <rect x="12" y="12" width="616" height="496" rx="16" fill="var(--ml-panel-bg)" stroke="var(--ml-panel-border)" stroke-width="3"/>
    <!-- parent -->
    <g transform="translate(110,70)">
      <rect x="0" y="0" width="420" height="150" rx="16" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="2.5"/>
      <text x="210" y="34" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="11" fill="var(--ml-text)">before split</text>
      <text x="210" y="56" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">mixed node (high impurity)</text>
      <rect x="60" y="84" width="300" height="24" rx="12" fill="var(--ml-accent-orange-soft-2)" opacity="0.95"/>
      <rect x="60" y="84" width="150" height="24" rx="12" fill="var(--ml-accent-green-soft)" opacity="0.95"/>
      <rect x="60" y="84" width="300" height="24" rx="12" fill="none" stroke="var(--ml-panel-border)" stroke-width="2"/>
      <text x="60" y="130" text-anchor="start" font-family="'Press Start 2P', monospace" font-size="9" fill="var(--ml-muted)">class 0</text>
      <text x="360" y="130" text-anchor="end" font-family="'Press Start 2P', monospace" font-size="9" fill="var(--ml-muted)">class 1</text>
    </g>
    <!-- arrows -->
    <g stroke="var(--ml-accent-cyan)" stroke-width="4" opacity="0.85">
      <line x1="300" y1="235" x2="230" y2="280"/>
      <line x1="340" y1="235" x2="410" y2="280"/>
    </g>
    <!-- children -->
    <g transform="translate(70,290)">
      <rect x="0" y="0" width="240" height="170" rx="16" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="2.5"/>
      <text x="120" y="34" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="11" fill="var(--ml-text)">child A</text>
      <text x="120" y="56" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">more pure</text>
      <rect x="28" y="88" width="184" height="22" rx="11" fill="var(--ml-accent-orange-soft-2)" opacity="0.95"/>
      <rect x="28" y="88" width="30" height="22" rx="11" fill="var(--ml-accent-green-soft)" opacity="0.95"/>
      <rect x="28" y="88" width="184" height="22" rx="11" fill="none" stroke="var(--ml-panel-border)" stroke-width="2"/>
    </g>
    <g transform="translate(330,290)">
      <rect x="0" y="0" width="240" height="170" rx="16" fill="var(--ml-surface)" stroke="var(--ml-panel-border)" stroke-width="2.5"/>
      <text x="120" y="34" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="11" fill="var(--ml-text)">child B</text>
      <text x="120" y="56" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">more pure</text>
      <rect x="28" y="88" width="184" height="22" rx="11" fill="var(--ml-accent-orange-soft-2)" opacity="0.95"/>
      <rect x="28" y="88" width="160" height="22" rx="11" fill="var(--ml-accent-green-soft)" opacity="0.95"/>
      <rect x="28" y="88" width="184" height="22" rx="11" fill="none" stroke="var(--ml-panel-border)" stroke-width="2"/>
    </g>
    <g font-family="'Press Start 2P', monospace" font-size="10" fill="var(--ml-muted)">
      <text x="320" y="492" text-anchor="middle">goal: children less mixed than parent</text>
    </g>
  </svg>

</div>
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="random-forest-01-motivation" -->
## Random Forest - Motivation
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Many problems are not linear
-: predictors often interact (for example, turbidity can matter differently across seasons)
-: effects can be non-monotonic (risk increases, saturates, then changes again)

***

-! Random Forest is a strong baseline for classification and regression
-: it works well without heavy feature engineering and handles mixed feature types
-: it is fairly robust to noise and outliers compared to a single decision tree

***

-! The key advantage is flexible decision boundaries
-: tree ensembles can capture interactions that a single straight line cannot
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-motivation-plot" style="width: 100%; height: 820px;"></div>

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

    const width = 780;
    const height = 820;
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

    const gap = 102;
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
      .attr('y', fig.height + 44)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '12px')
      .text('predictor 1 (e.g., turbidity)');

    fig.svg.append('text')
      .attr('x', panelW + gap + (panelW / 2))
      .attr('y', fig.height + 44)
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

-: Example tree structure (as text) 

```
             [x < 0.5?]
          /              \
        yes               no
        /                  \
    [y < 0.4?]           [y < 0.7?]
     /    \               /     \
    yes    no           yes      no
    /       \           /         \
  leaf1   leaf0       leaf0     leaf1
(class 1) (class 0) (class 0) (class 1)
```



<!-- /position -->

<!-- position={row: 1, column: 2} -->
-: Example tree visualization (as diagram)
<div id="rf-single-tree-plot" style="width: 100%; height: 820px;"></div>

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

    const width = 780;
    const height = 820;
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

    const panelW = fig.width;
    const panelH = fig.height;

    const left = fig.svg.append('g');

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
      .style('font-size', '16px')
      .text('Tree');

    const treeNodes = [
      { id: 'root', x: panelW / 2, y: 140, label: 'x < 0.5?' },
      { id: 'l', x: panelW * 0.28, y: 340, label: 'y < 0.4?' },
      { id: 'r', x: panelW * 0.72, y: 340, label: 'y < 0.7?' },
      { id: 'll', x: panelW * 0.16, y: 600, label: 'leaf 1', cls: 1 },
      { id: 'lr', x: panelW * 0.40, y: 600, label: 'leaf 0', cls: 0 },
      { id: 'rl', x: panelW * 0.60, y: 600, label: 'leaf 0', cls: 0 },
      { id: 'rr', x: panelW * 0.84, y: 600, label: 'leaf 1', cls: 1 }
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
      .attr('y1', d => byId.get(d.a).y + 24)
      .attr('x2', d => byId.get(d.b).x)
      .attr('y2', d => byId.get(d.b).y - 24)
      .attr('stroke', theme.muted)
      .attr('stroke-width', 2.6);

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
      .style('font-size', '15px')
      .text(d => d.text);

    const nodeG = left.append('g')
      .selectAll('g.node')
      .data(treeNodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`);

    function nodeWidth(d) {
      if (d.id === 'root') return 220;
      if (d.cls === 0 || d.cls === 1) return 110;
      return 190;
    }

    nodeG.append('rect')
      .attr('x', d => -nodeWidth(d) / 2)
      .attr('y', -22)
      .attr('width', d => nodeWidth(d))
      .attr('height', 44)
      .attr('rx', 12)
      .attr('fill', d => d.cls === 1 ? 'var(--ml-accent-green-soft-2)' : d.cls === 0 ? 'var(--ml-accent-orange-soft-2)' : 'var(--ml-accent-cyan-soft)')
      .attr('stroke', d => d.cls === 1 ? theme.green : d.cls === 0 ? theme.orange : theme.cyan)
      .attr('stroke-width', 2);

    nodeG.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', theme.text)
      .style('font-size', '16px')
      .text(d => d.label);

    // Intentionally no "feature space" panel on this slide.
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
-: each tree is trained on a different view of the data
-: the forest prediction is a vote (classification) or an average (regression)

***

-! Two kinds of randomness create diverse trees
-: bootstrap changes which rows each tree sees
-: random feature selection changes which predictors are considered at each split

***

-! Aggregation reduces variance
-: single trees can overfit and are sensitive to noise
-: average over many different trees is more stable
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-big-picture-plot" style="width: 100%; height: 820px;"></div>

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

    const width = 780;
    const height = 820;
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
        .attr('stroke-width', 5)
        .attr('marker-end', `url(#${markerId})`)
        .attr('opacity', 0.95);
    }

    const padX = 18;
    const padY = 60;
    const gapX = 26;
    const gapY = 44;
    const cellW = (W - padX * 2 - gapX) / 2;
    const cellH = (H - padY * 2 - gapY) / 2;

    const dataset = box(padX, padY, cellW, cellH, 'Dataset', theme.cyan);
    const boots = box(padX + cellW + gapX, padY, cellW, cellH, 'Bootstrap', theme.orange);
    const trees = box(padX, padY + cellH + gapY, cellW, cellH, 'Trees', theme.green);

    const voteH = Math.round(cellH * 0.42);
    const outH = cellH - voteH - 18;
    const agg = box(padX + cellW + gapX, padY + cellH + gapY, cellW, voteH, 'Vote', theme.magenta);
    const pred = box(padX + cellW + gapX, padY + cellH + gapY + voteH + 18, cellW, outH, 'Output', theme.cyan);

    // Decorative points in dataset.
    const dsInner = { x: 20, y: 56, w: cellW - 40, h: cellH - 92 };
    const pointArea = dataset.append('g').attr('transform', `translate(${dsInner.x}, ${dsInner.y})`);
    const px = d3.scaleLinear().domain([0, 1]).range([0, dsInner.w]);
    const py = d3.scaleLinear().domain([0, 1]).range([dsInner.h, 0]);
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
      .attr('r', 4.2)
      .attr('fill', d => d.cls ? theme.green : theme.orange)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.2)
      .attr('opacity', 0.95);

    // Bootstrap mini-samples.
    const b = boots.append('g').attr('transform', 'translate(20, 64)');
    const sampleGap = 16;
    const sampleW = cellW - 40;
    const sampleH = Math.max(54, Math.floor((cellH - 64 - 44 - sampleGap * 2) / 3));
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
        .attr('x', 10).attr('y', y + 20)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-size', '16px')
        .text(lab);
      // tiny duplicates to hint "with replacement"
      const s = b.append('g').attr('transform', `translate(10, ${y + 24})`);
      const cells = d3.range(10).map(j => j);
      s.selectAll('rect')
        .data(cells)
        .enter()
        .append('rect')
        .attr('x', d => (d % 5) * 22)
        .attr('y', d => Math.floor(d / 5) * 14)
        .attr('width', 18)
        .attr('height', 10)
        .attr('rx', 3)
        .attr('fill', d => (d === 1 || d === 6) ? 'rgba(0,255,255,0.20)' : 'rgba(0,0,0,0.12)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 1.4);
    });

    // Trees icons.
    const treeScale = 2.25;
    const tg = trees.append('g').attr('transform', 'translate(46, 82)');
    const icon = (gx, x, y, color) => {
      const g = gx.append('g').attr('transform', `translate(${x}, ${y}) scale(${treeScale})`);
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
    icon(tg, 6, -40, theme.green);
    icon(tg, 120, -20, theme.green);
    icon(tg, 88, 92, theme.green);

    // Aggregation and output glyphs.
    const ax = cellW / 2;

    agg.append('text')
      .attr('x', ax).attr('y', Math.round(voteH / 2) - 6)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '18px')
      .text('average probability');
    agg.append('text')
      .attr('x', ax).attr('y', Math.round(voteH / 2) + 16)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '18px')
      .text('vote (class)');

    const barW = Math.min(240, cellW - 80);
    const barX = ax - barW / 2;
    const barY = Math.round(outH / 2) - 11;
    pred.append('rect')
      .attr('x', barX).attr('y', barY)
      .attr('width', barW).attr('height', 22)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-accent-cyan-soft-2)')
      .attr('stroke', theme.cyan)
      .attr('stroke-width', 2)
      .attr('opacity', 0.9);
    pred.append('rect')
      .attr('x', barX).attr('y', barY)
      .attr('width', barW * 0.62).attr('height', 22)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-accent-green-soft)')
      .attr('opacity', 0.95);
    pred.append('text')
      .attr('x', ax).attr('y', barY + 15)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-family', "'Press Start 2P', monospace")
      .style('font-size', '12px')
      .text('p = 0.62');

    // Arrows.
    arrow(padX + cellW, padY + cellH / 2, padX + cellW + gapX, padY + cellH / 2);
    arrow(padX + cellW + gapX + cellW / 2, padY + cellH, padX + cellW / 2, padY + cellH + gapY);
    arrow(padX + cellW, padY + cellH + gapY + cellH / 2, padX + cellW + gapX, padY + cellH + gapY + voteH / 2, theme.muted);
    arrow(padX + cellW + gapX + cellW / 2, padY + cellH + gapY + voteH, padX + cellW + gapX + cellW / 2, padY + cellH + gapY + voteH + 18, theme.muted);

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
-! Each tree: trained on bootstrap
-: draw N observations with replacement from the training set
-: some rows appear multiple times, and some rows are not drawn at all

***

-! Rows that are not drawn are called out-of-bag (OOB)
-: the probability that a row is never selected is ~ 37 %
-: OOB rows give an internal validation set

***

-! Bootstrap sampling increases diversity across trees
-: different samples: different split choices and errors
-: averaging over many trees reduces variance
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-bootstrap-plot" style="width: 100%; height: 820px;"></div>

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

    const width = 780;
    const height = 820;
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
        .style('font-size', '18px')
        .text(label);

      const cellX = 42;
      const cellY = 58;
      const cols = 7;
      const ids = d3.range(n);

      const grp = g.append('g').attr('transform', `translate(${x0}, ${y0})`);
      const item = grp.selectAll('g.item')
        .data(ids)
        .enter()
        .append('g')
        .attr('class', 'item')
        .attr('transform', d => `translate(${(d % cols) * cellX}, ${Math.floor(d / cols) * cellY})`);

      item.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 34).attr('height', 34)
        .attr('rx', 8)
        .attr('fill', d => s.counts[d] === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(0,255,255,0.10)')
        .attr('stroke', d => s.counts[d] === 0 ? theme.border : theme.cyan)
        .attr('stroke-width', 1.8);

      item.append('text')
        .attr('x', 17).attr('y', 23)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '16px')
        .text(d => d + 1);

      // Usage count label below each cell for duplicates.
      item.append('text')
        .attr('x', 17).attr('y', 52)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '14px')
        .text(d => s.counts[d] > 1 ? `x${s.counts[d]}` : '');
    }

    function drawSampleRow(g, x0, y0, s, accent, label) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '18px')
        .text(label);

      const cellX = 42;
      const cellY = 44;
      const cols = 7;
      const grp = g.append('g').attr('transform', `translate(${x0}, ${y0})`);

      grp.selectAll('rect')
        .data(s.draws)
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i % cols) * cellX)
        .attr('y', (d, i) => Math.floor(i / cols) * cellY)
        .attr('width', 38)
        .attr('height', 32)
        .attr('rx', 8)
        .attr('fill', d => 'rgba(0,0,0,0.10)')
        .attr('stroke', accent)
        .attr('stroke-width', 1.8);

      grp.selectAll('text')
        .data(s.draws)
        .enter()
        .append('text')
        .attr('x', (d, i) => (i % cols) * cellX + 19)
        .attr('y', (d, i) => Math.floor(i / cols) * cellY + 22)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '16px')
        .text(d => d + 1);
    }

    function drawOOB(g, x0, y0, s, label) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '18px')
        .text(label);

      const oobText = s.oob.length ? s.oob.map(i => i + 1).join(', ') : 'none';
      g.append('text')
        .attr('x', x0).attr('y', y0 + 10)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '24px')
        .text(oobText);
    }

    panels.forEach(p => {
      const g = panelRoot(p.x);
      g.append('text')
        .attr('x', panelW / 2).attr('y', 24)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-family', "'Press Start 2P', monospace")
        .style('font-size', '18px')
        .text(p.title);

      drawDatasetGrid(g, 18, 86, p.s, 'training set');
      drawSampleRow(g, 18, 280, p.s, p.accent, 'bootstrap sample');
      drawOOB(g, 18, 506, p.s, 'out-of-bag');
    });

    // Center caption arrows.
    const centerX = panelW + gap / 2;
    fig.svg.append('line')
      .attr('x1', centerX).attr('x2', centerX)
      .attr('y1', 70).attr('y2', 610)
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
-! At each split, a tree considers only $m$ of $p$ features
-: first pick $m$ random features, then find the best split among those candidates
-: typical defaults are $m = \sqrt{p}$ for classification and $m = \frac{p}{3}$ for regression

***

-! Feature subsampling prevents one predictor from dominating
-: different trees are forced to explore different predictors and interactions
-: the resulting trees become less correlated

***

-! Less correlation: averaging more powerful
-: if trees make different mistakes, vote cancels errors
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-feature-subsampling-plot" style="width: 100%; height: 820px;"></div>

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

    const width = 780;
    const height = 820;
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
        .style('font-size', '18px')
        .text(title);
      g.append('rect')
        .attr('x', 18).attr('y', 72)
        .attr('width', panelW - 36).attr('height', 98)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-accent-cyan-soft)')
        .attr('stroke', accent)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', panelW / 2).attr('y', 112)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '16px')
        .text('split node');
      g.append('text')
        .attr('x', panelW / 2).attr('y', 140)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '16px')
        .text('candidate features');
      return g;
    }

    const features = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'];
    const subsetA = new Set(['f1', 'f6', 'f7']);
    const subsetB = new Set(['f2', 'f5', 'f8']);

    function drawFeaturePool(g, x0, y0, subset, accent, caption) {
      g.append('text')
        .attr('x', x0).attr('y', y0 - 12)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-size', '18px')
        .text(caption);

      const cellW = 78;
      const cellH = 36;
      const cols = 3;
      const grp = g.append('g').attr('transform', `translate(${x0}, ${y0})`);

      const item = grp.selectAll('g.f')
        .data(features)
        .enter()
        .append('g')
        .attr('class', 'f')
        .attr('transform', (d, i) => `translate(${(i % cols) * cellW}, ${Math.floor(i / cols) * (cellH + 12)})`);

      item.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', 70).attr('height', cellH)
        .attr('rx', 8)
        .attr('fill', d => subset.has(d) ? 'rgba(0,255,255,0.18)' : 'rgba(0,0,0,0.10)')
        .attr('stroke', d => subset.has(d) ? accent : theme.border)
        .attr('stroke-width', 2);

      item.append('text')
        .attr('x', 35).attr('y', 24)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '16px')
        .text(d => d);

      const rows = Math.ceil(features.length / cols);
      g.append('text')
        .attr('x', x0).attr('y', y0 + rows * (cellH + 12) + 28)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '16px')
        .text(`m = ${Array.from(subset).length} of p = ${features.length} highlighted`);
    }

    function drawChosenSplit(g, x0, y0, accent, label) {
      g.append('rect')
        .attr('x', x0).attr('y', y0)
        .attr('width', panelW - 36).attr('height', 110)
        .attr('rx', 12)
        .attr('fill', 'var(--ml-accent-green-soft)')
        .attr('stroke', accent)
        .attr('stroke-width', 2);
      g.append('text')
        .attr('x', x0 + (panelW - 36) / 2).attr('y', y0 + 44)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '16px')
        .text(label);
      g.append('text')
        .attr('x', x0 + (panelW - 36) / 2).attr('y', y0 + 72)
        .attr('text-anchor', 'middle')
        .style('fill', theme.muted)
        .style('font-size', '16px')
        .text('best split among candidates');
    }

    const A = frame(0, 'Tree A', theme.cyan);
    const B = frame(panelW + gap, 'Tree B', theme.magenta);

    drawFeaturePool(A, 24, 206, subsetA, theme.cyan, 'candidates at this node');
    drawFeaturePool(B, 24, 206, subsetB, theme.magenta, 'candidates at this node');

    drawChosenSplit(A, 18, 500, theme.green, 'uses f1 for the split');
    drawChosenSplit(B, 18, 500, theme.green, 'uses f5 for the split');
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
-: criteria as Gini impurity measure how mixed a node is
-: a good split makes the children more pure

***

-! Regression trees aim for lower spread of target values
-: common criteria reduce mean squared error (MSE)
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-splitting-criterion-plot" style="width: 100%; height: 720px;"></div>

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

    const width = 780;
    const height = 820;
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
        .style('font-size', '18px')
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
        .attr('x', x).attr('y', y + h + 22)
        .attr('text-anchor', 'start')
        .style('fill', theme.muted)
        .style('font-size', '18px')
        .text('class 0');
      g.append('text')
        .attr('x', x + w).attr('y', y + h + 22)
        .attr('text-anchor', 'end')
        .style('fill', theme.muted)
        .style('font-size', '18px')
        .text('class 1');
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

    const parent = nodeBox(60, 40, 500, 220, 'Before split');
    stackedBar(parent, 50, 96, 400, 36, parentP1);
    parent.append('text')
      .attr('x', 250).attr('y', 190)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '18px')
      .text('mixed labels (high impurity)');

    const leftChild = nodeBox(20, 310, 290, 250, 'Child A');
    stackedBar(leftChild, 40, 104, 210, 36, leftP1);
    leftChild.append('text')
      .attr('x', 145).attr('y', 182)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '18px')
      .text('more pure');

    const rightChild = nodeBox(310, 310, 290, 250, 'Child B');
    stackedBar(rightChild, 40, 104, 210, 36, rightP1);
    rightChild.append('text')
      .attr('x', 145).attr('y', 182)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '18px')
      .text('more pure');

    arrow(310, 270, 165, 310);
    arrow(310, 270, 455, 310);
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

<!-- .slide:id="random-forest-07a-gini-example" -->
## Example - Gini Before vs After a Split
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Idea: lower Gini = more pure
-: we only need class proportions

***

-! Parent (50/50) is more mixed than children (90/10)

$$ GINI = 1 - \sum_{k=0}^{K-1} p_k^2 $$

-: where $p_k$ is the proportion of class $k$ in the node

***

*Gini (2 classes):* $GINI = 1 - (p_0^2 + p_1^2)$
<!-- /position -->

<!-- position={row: 1, column: 2} -->

*Before split (parent):*
$$ p_0 = 0.50, \quad p_1 = 0.50 $$
$$ G_{parent} = 1 - (0.50^2 + 0.50^2) = 0.50 $$

***

*After split (two children):*
$$ p_0 = 0.90, \quad p_1 = 0.10 $$
$$ G_A = 1 - (0.90^2 + 0.10^2) = 0.18 $$
$$ p_0 = 0.10, \quad p_1 = 0.90 $$
$$ G_B = 1 - (0.10^2 + 0.90^2) = 0.18 $$
</div>
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

-! Why deep trees still work well
-: reduce bias because they can fit complex patterns
-: randomness makes the trees different, so their errors are less correlated

***

-! The practical effect is a stable model
-: individual trees may be noisy, but the ensemble smooths the noise out
-: increasing the number of trees mainly improves stability (but costs runtime)
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-grow-many-trees-plot" style="width: 100%; height: 650px;"></div>
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
-: each tree produces its own output
-: we do not pick the best tree, we combine all trees

***

-! Classification: vote or average probabilities
-: each tree votes for a class, and the majority vote is the final class
-: if trees output probabilities, we average them to get a calibrated score

***

-! Regression: average predictions
-: each tree returns a number (a mean value in its leaf)
-: the forest output is the average, which reduces variance and smooths noise
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-prediction-plot" style="width: 100%; height: 650px;"></div>
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

    const width = 780;
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
        .style('font-size', '18px')
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
        .attr('stroke-width', 4)
        .attr('marker-end', `url(#${markerId})`)
        .attr('opacity', 0.95);
    }

    // Layout.
    const padX = 10;
    const gap1 = 18;
    const gap2 = 18;
    const inputW = 160;
    const aggW = 220;
    const treesW = W - padX * 2 - inputW - aggW - gap1 - gap2;

    const inputX = padX;
    const treesX = inputX + inputW + gap1;
    const aggX = treesX + treesW + gap2;

    const input = box(inputX, 220, inputW, 160, 'Input x', theme.cyan);
    input.append('text')
      .attr('x', inputW / 2).attr('y', 92)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '16px')
      .text('same x');
    input.append('text')
      .attr('x', inputW / 2).attr('y', 120)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '16px')
      .text('to all trees');

    const trees = box(treesX, 90, treesW, 420, 'Trees', theme.green);
    const agg = box(aggX, 130, aggW, 370, 'Aggregation', theme.magenta);

    arrow(inputX + inputW, 300, treesX, 300);
    arrow(treesX + treesW, 300, aggX, 300);

    // Draw a set of mini trees and their outputs.
    const rng = seededRandom(123);
    const T = 9;
    const treeY = d3.range(T).map(i => 18 + i * 36);

    const treeGroup = trees.append('g').attr('transform', 'translate(18, 44)');

    function miniTree(g, x, y, color) {
      const r = g.append('g').attr('transform', `translate(${x}, ${y})`);
      // tree icon (left)
      r.append('line').attr('x1', 22).attr('y1', 8).attr('x2', 10).attr('y2', 24).attr('stroke', theme.muted).attr('stroke-width', 2.4);
      r.append('line').attr('x1', 22).attr('y1', 8).attr('x2', 34).attr('y2', 24).attr('stroke', theme.muted).attr('stroke-width', 2.4);
      r.append('circle').attr('cx', 22).attr('cy', 8).attr('r', 5.2).attr('fill', 'var(--ml-accent-green-soft)').attr('stroke', theme.green).attr('stroke-width', 2);
      r.append('circle').attr('cx', 10).attr('cy', 24).attr('r', 5.0).attr('fill', 'var(--ml-accent-green-soft)').attr('stroke', theme.green).attr('stroke-width', 2);
      r.append('circle').attr('cx', 34).attr('cy', 24).attr('r', 5.0).attr('fill', 'var(--ml-accent-green-soft)').attr('stroke', theme.green).attr('stroke-width', 2);

      // vote box (right)
      const voteX = 66;
      const voteW = Math.max(120, Math.min(160, treesW - 110));
      r.append('rect')
        .attr('x', voteX).attr('y', -10)
        .attr('width', voteW).attr('height', 30)
        .attr('rx', 10)
        .attr('fill', 'var(--ml-surface)')
        .attr('stroke', theme.border)
        .attr('stroke-width', 2);
      r.append('text')
        .attr('x', voteX + voteW / 2).attr('y', 10)
        .attr('text-anchor', 'middle')
        .style('fill', theme.text)
        .style('font-size', '14px')
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
    const agW = aggW - 32;
    const cx = agW / 2;
    ag.append('text')
      .attr('x', cx).attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '16px')
      .text('vote tally');

    const barW = Math.min(agW - 10, 150);
    const barH = 22;
    ag.append('rect')
      .attr('x', 0).attr('y', 20)
      .attr('width', barW).attr('height', barH)
      .attr('rx', 8)
      .attr('fill', 'var(--ml-surface)')
      .attr('stroke', theme.border)
      .attr('stroke-width', 2);
    ag.append('rect')
      .attr('x', 0).attr('y', 20)
      .attr('width', barW * (v1 / T)).attr('height', barH)
      .attr('rx', 8)
      .attr('fill', theme.green)
      .attr('opacity', 0.85);

    ag.append('text')
      .attr('x', 0).attr('y', 62)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '14px')
      .text(`votes for class 1: ${v1}/${T}`);

    ag.append('text')
      .attr('x', 0).attr('y', 88)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '14px')
      .text(`votes for class 0: ${v0}/${T}`);

    ag.append('text')
      .attr('x', cx).attr('y', 132)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '16px')
      .text('mean probability');

    ag.append('rect')
      .attr('x', 0).attr('y', 150)
      .attr('width', barW+30).attr('height', 52)
      .attr('rx', 12)
      .attr('fill', 'var(--ml-accent-cyan-soft)')
      .attr('stroke', theme.cyan)
      .attr('stroke-width', 2);
    ag.append('text')
      .attr('x', cx).attr('y', 184)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-size', '16px')
      .text(`p(class 1) = ${prob.toFixed(2)}`);

    ag.append('text')
      .attr('x', cx).attr('y', 244)
      .attr('text-anchor', 'middle')
      .style('fill', theme.muted)
      .style('font-size', '16px')
      .text('final output');

    ag.append('rect')
      .attr('x', cx - 52).attr('y', 262)
      .attr('width', 104).attr('height', 26)
      .attr('rx', 10)
      .attr('fill', 'var(--ml-accent-magenta-soft)')
      .attr('stroke', theme.magenta)
      .attr('stroke-width', 2);
    ag.append('text')
      .attr('x', cx).attr('y', 280)
      .attr('text-anchor', 'middle')
      .style('fill', theme.text)
      .style('font-size', '16px')
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

-! OOB behaves like cross-validation
-: every row gets evaluated on a subset of trees that are "honestly" out-of-sample
-: aggregating these row-wise predictions gives an OOB error estimate

***

-! OOB is useful for model selection
-: fast feedback for hyperparameters, like n(trees)
-: NOT replacing final test set for trustworthy report
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-oob-plot" style="width: 100%; height: 650px; "></div>
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

    const width = 780;
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
        .style('font-size', '16px')
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
      .style('font-size', '14px')
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
      .style('font-size', '14px')
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
      .style('font-size', '14px')
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
      .style('font-size', '14px')
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
      .style('font-size', '13px')
      .text(d => `tree ${d.i + 1}`);

    tile.append('text')
      .attr('x', tileW / 2).attr('y', 50)
      .attr('text-anchor', 'middle')
      .style('fill', d => d.isOOB ? theme.text : theme.gray)
      .style('font-size', '13px')
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
      .style('font-size', '16px')
      .text('OOB pred. for example row');

    summary.append('text')
      .attr('x', 12).attr('y', 56)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '14px')
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
      .style('font-size', '14px')
      .text(`p(class 1) = ${p1.toFixed(2)}`);

    summary.append('text')
      .attr('x', 12).attr('y', 122)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '14px')
      .text(`prediction: class ${pred} (vote ${vote1}:${vote0})`);

    summary.append('text')
      .attr('x', 12).attr('y', 146)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '14px')
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
-: it is a tool for understanding, not a proof of causality
-: importance is always relative to the dataset and the chosen metric

***

-! Permutation importance:
-: randomly shuffle a feature column during validation
-: if performance drops, the model relied on that feature for prediction

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-feature-importance-plot" style="width: 100%; height: 650px;"></div>
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

    const width = 780;
    const height = 650;
    const margin = { top: 44, right: 40, bottom: 52, left: 200 };
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
      .style('font-size', '18px');
    fig.svg.selectAll('.domain, .tick line')
      .style('stroke', theme.border)
      .style('stroke-width', 2);

    fig.svg.append('text')
      .attr('x', 0).attr('y', -10)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '18px')
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
      .style('font-size', '18px')
      .text(d => `-${d.drop.toFixed(2)}`);

    fig.svg.append('text')
      .attr('x', fig.width)
      .attr('y', fig.height + 34)
      .attr('text-anchor', 'end')
      .style('fill', theme.muted)
      .style('font-size', '18px')
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

***

-! Number of trees controls stability
-: more trees reduce variance & stabilize predictions
-: beyond a point the improvement is small, but runtime keeps increasing

***

-! Depth, leaf size, and max features control complexity and diversity
-: deeper trees & smaller leaves increase flexibility but can overfit
-: limiting max features makes trees less correlated, which helps averaging
<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="rf-hyperparameters-plot" style="width: 100%; height: 650px;"></div>
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

    const width = 780;
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
        .style('font-size', '16px')
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
    aG.selectAll('.tick text').style('fill', theme.muted).style('font-size', '14px');
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
      .style('font-size', '14px')
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
    bG.selectAll('.tick text').style('fill', theme.muted).style('font-size', '14px');
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
      .style('font-size', '14px')
      .text('too deep can hurt');

    // Panel C: max_features effect (diversity vs strength).
    const pC = panel(0, panelH + gap, W, panelH, 'max_features: diversity');
    const cG = pC.append('g').attr('transform', 'translate(24, 60)');

    cG.append('text')
      .attr('x', 0).attr('y', -14)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '18px')
      .text('smaller m makes trees less correlated (better averaging)');

    const barX = 80;
    const barY = 30;
    const barW = W - 24 * 2 - barX - 30-80;

    const items = [
      { label: 'low m', corr: 0.25, strength: 0.65, color: theme.green },
      { label: 'high m', corr: 0.70, strength: 0.80, color: theme.orange }
    ];

    function drawTradeoff(y, d) {
      cG.append('text')
        .attr('x', 0).attr('y', y + 18)
        .attr('text-anchor', 'start')
        .style('fill', theme.text)
        .style('font-size', '14px')
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
        .style('font-size', '14px')
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
        .style('font-size', '14px')
        .text(`strength: ${d.strength.toFixed(2)}`);
    }

    drawTradeoff(28, items[0]);
    drawTradeoff(110, items[1]);

    cG.append('text')
      .attr('x', 0).attr('y', 200)
      .attr('text-anchor', 'start')
      .style('fill', theme.muted)
      .style('font-size', '18px')
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

<!-- .slide:id="random-forest-13-webr-example" -->
## Practical Example in R (WebR)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Train a random forest (classification)
-: example dataset: `iris`

***

-! Interpretation hook
-: variable importance (which inputs matter most?)

***

-! Decision hook
-: predict class probabilities for a new point
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="rf-webr-example-container"></div>
  <div id="rf-webr-example-plot" style="border: 1px solid var(--ml-panel-border); border-radius: 12px; min-height: 240px; display: flex; align-items: center; justify-content: center; color: var(--ml-muted); font-size: 0.9em; text-align: center; padding: 12px; background: var(--ml-panel-bg);">
    Run the WebR example to render the random forest output.
  </div>
  <button id="rf-webr-example-open-plot" style="padding: 8px 16px; background: var(--ml-panel-bg); color: var(--ml-text); border: 1px solid var(--ml-panel-border); border-radius: 8px; cursor: pointer; font-size: 0.85em; font-weight: 700; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'rf-webr-example-container';
  const plotContainerId = 'rf-webr-example-plot';
  const openBtnId = 'rf-webr-example-open-plot';
  const slideId = 'random-forest-13-webr-example';

  const code = `# Random forest in R (WebR)
# Note: package availability depends on the WebR build.

data(iris)

if (!requireNamespace("randomForest", quietly = TRUE)) {
  plot.new()
  text(0.5, 0.55, "Package 'randomForest' is not available in this WebR environment", cex = 1.0)
  text(0.5, 0.45, "Try a different runtime or pre-bundled packages", cex = 0.9)
} else {
  library(randomForest)
  set.seed(1)

  fit <- randomForest(Species ~ ., data = iris, importance = TRUE)

  # Variable importance plot
  varImpPlot(fit, main = "Random Forest: variable importance")

  # Predict probabilities for a single new point
  x_new <- iris[1, 1:4, drop = FALSE]
  p <- predict(fit, x_new, type = "prob")
  mtext(sprintf("Example: P(setosa) = %.2f, P(versicolor) = %.2f, P(virginica) = %.2f",
    p[1, "setosa"], p[1, "versicolor"], p[1, "virginica"]
  ), side = 3, line = 0.2, cex = 0.85)
}`;

  const fallbackOutput = `[Simulated]
Random forest: variable importance + predicted class probabilities.`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run Random Forest (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 440,
        background: '#ffffff',
        altText: 'Random forest variable importance plot from WebR',
        loadingMessage: 'Training model and rendering plot...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the random forest output.'
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
