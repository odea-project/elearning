---
title: "Advanced Experimental Design"
author: "Gerrit Renner"
keywords: ["DOE", "fractional factorial", "Plackett-Burman", "response surface", "CCD", "Box-Behnken", "screening", "optimization"]
requirements: ["Full Factorial Design"]
description: "From full factorial design to efficient screening and optimization strategies"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Full Factorial Design (2-level factorials)
- Basic understanding of main effects and interactions

---

<!-- .slide:id="initial-problem" -->
## The Scaling Problem
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Imagine you're optimizing a *water treatment process* with 7 factors:
-: pH, temperature, coagulant dose, mixing speed, settling time, polymer type, aeration rate
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 400 300" style="max-width: 100%; height: auto;">
  <!-- Water Treatment Tank -->
  <rect x="100" y="80" width="200" height="150" rx="10" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <ellipse cx="200" cy="80" rx="100" ry="15" fill="#bbdefb" stroke="#1976d2" stroke-width="3"/>
  <!-- Water waves -->
  <path d="M110 130 Q130 120 150 130 Q170 140 190 130 Q210 120 230 130 Q250 140 270 130 Q290 120 290 130" fill="none" stroke="#42a5f5" stroke-width="2" opacity="0.7"/>
  <path d="M110 150 Q130 140 150 150 Q170 160 190 150 Q210 140 230 150 Q250 160 270 150 Q290 140 290 150" fill="none" stroke="#42a5f5" stroke-width="2" opacity="0.5"/>
  <!-- Mixer -->
  <rect x="190" y="40" width="20" height="50" fill="#78909c" rx="3"/>
  <line x1="200" y1="90" x2="200" y2="180" stroke="#546e7a" stroke-width="4"/>
  <path d="M170 170 L200 180 L230 170" fill="none" stroke="#546e7a" stroke-width="4"/>
  <!-- Input pipe -->
  <rect x="30" y="100" width="70" height="20" fill="#90a4ae" rx="5"/>
  <circle cx="40" cy="110" r="12" fill="#4caf50" stroke="#2e7d32" stroke-width="2"/>
  <text x="40" y="114" text-anchor="middle" fill="white" font-size="10" font-weight="bold">pH</text>
  <!-- Output pipe -->
  <rect x="300" y="180" width="70" height="20" fill="#90a4ae" rx="5"/>
  <!-- Temperature indicator -->
  <rect x="310" y="90" width="15" height="50" rx="7" fill="#fff" stroke="#f44336" stroke-width="2"/>
  <rect x="313" y="110" width="9" height="27" rx="4" fill="#f44336"/>
  <circle cx="317" cy="133" r="8" fill="#f44336"/>
  <text x="340" y="120" fill="#f44336" font-size="10" font-weight="bold">T°</text>
  <!-- Bubbles (aeration) -->
  <circle cx="130" cy="200" r="5" fill="#81d4fa" opacity="0.7"/>
  <circle cx="150" cy="190" r="4" fill="#81d4fa" opacity="0.6"/>
  <circle cx="145" cy="210" r="6" fill="#81d4fa" opacity="0.8"/>
  <circle cx="250" cy="195" r="5" fill="#81d4fa" opacity="0.7"/>
  <circle cx="265" cy="205" r="4" fill="#81d4fa" opacity="0.6"/>
  <!-- Labels -->
  <text x="200" y="270" text-anchor="middle" fill="#1565c0" font-size="14" font-weight="bold">Water Treatment System</text>
  <!-- Factor labels with connectors -->
  <circle cx="65" cy="60" r="25" fill="#fff3e0" stroke="#ff9800" stroke-width="2"/>
  <text x="65" y="58" text-anchor="middle" fill="#e65100" font-size="8" font-weight="bold">Coag.</text>
  <text x="65" y="68" text-anchor="middle" fill="#e65100" font-size="8" font-weight="bold">Dose</text>
  <line x1="85" y1="75" x2="100" y2="90" stroke="#ff9800" stroke-width="2" stroke-dasharray="4"/>
  <circle cx="335" cy="60" r="25" fill="#e8f5e9" stroke="#4caf50" stroke-width="2"/>
  <text x="335" y="58" text-anchor="middle" fill="#2e7d32" font-size="8" font-weight="bold">Mix</text>
  <text x="335" y="68" text-anchor="middle" fill="#2e7d32" font-size="8" font-weight="bold">Speed</text>
  <line x1="315" y1="75" x2="210" y2="50" stroke="#4caf50" stroke-width="2" stroke-dasharray="4"/>
  <circle cx="65" cy="260" r="25" fill="#fce4ec" stroke="#e91e63" stroke-width="2"/>
  <text x="65" y="258" text-anchor="middle" fill="#c2185b" font-size="8" font-weight="bold">Settle</text>
  <text x="65" y="268" text-anchor="middle" fill="#c2185b" font-size="8" font-weight="bold">Time</text>
  <line x1="90" y1="250" x2="110" y2="220" stroke="#e91e63" stroke-width="2" stroke-dasharray="4"/>
  <circle cx="335" cy="260" r="25" fill="#e1f5fe" stroke="#03a9f4" stroke-width="2"/>
  <text x="335" y="258" text-anchor="middle" fill="#0277bd" font-size="8" font-weight="bold">Aer.</text>
  <text x="335" y="268" text-anchor="middle" fill="#0277bd" font-size="8" font-weight="bold">Rate</text>
  <line x1="310" y1="255" x2="270" y2="210" stroke="#03a9f4" stroke-width="2" stroke-dasharray="4"/>
</svg>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="initial-problem-2" -->
## The Scaling Problem (cont.)

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<svg viewBox="0 0 300 200" style="max-width: 100%; height: auto;">
  <!-- Question Mark -->
  <g class="wiggle" style="animation-delay: 0s;">
    <circle cx="70" cy="100" r="45" fill="#fff9c4" stroke="#fbc02d" stroke-width="3"/>
    <text x="70" y="115" text-anchor="middle" fill="#f57f17" font-size="50" font-weight="bold">?</text>
  </g>
  <!-- Money/Dollar -->
  <g class="wiggle" style="animation-delay: 0.15s;">
    <circle cx="150" cy="100" r="45" fill="#c8e6c9" stroke="#43a047" stroke-width="3"/>
    <text x="150" y="118" text-anchor="middle" fill="#2e7d32" font-size="50" font-weight="bold">$</text>
  </g>
  <!-- Clock -->
  <g class="wiggle" style="animation-delay: 0.15s;">
    <circle cx="230" cy="100" r="45" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
    <circle cx="230" cy="100" r="35" fill="white" stroke="#1976d2" stroke-width="2"/>
    <line x1="230" y1="100" x2="230" y2="75" stroke="#1976d2" stroke-width="3" stroke-linecap="round"/>
    <line x1="230" y1="100" x2="250" y2="100" stroke="#1976d2" stroke-width="3" stroke-linecap="round"/>
    <circle cx="230" cy="100" r="4" fill="#1976d2"/>
  </g>
  <!-- Labels -->
  <text x="70" y="165" text-anchor="middle" fill="#f57f17" font-size="12" font-weight="bold">How many?</text>
  <text x="150" y="165" text-anchor="middle" fill="#2e7d32" font-size="12" font-weight="bold">Cost?</text>
  <text x="230" y="165" text-anchor="middle" fill="#1976d2" font-size="12" font-weight="bold">Time?</text>
</svg>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-? How many experiments would a **full factorial design** require?
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="initial-problem-4" -->
## The Scaling Problem (cont.)

<div style="font-size: 0.7em;">

| Factors | Runs ($2^k$) |
|:-------:|:------------:|
| 2 | 4 |
| 4 | 16 |
| 5 | 32 |
| 7 | **128** |
| 10 | **1,024** |

</div>

-= This exponential growth quickly becomes **impractical** in real laboratories.

<div id="run-calculator" style="background: #1a2340; padding: 15px; border-radius: 8px; margin-top: 20px;">
  <div style="display: flex; align-items: center; gap: 15px;">
    <label style="color: #9efcff; font-weight: bold;">Factors (k):</label>
    <input type="range" id="factor-slider" min="2" max="20" value="4" style="flex: 1;">
    <span id="factor-display" style="color: #9efcff; font-weight: bold; min-width: 30px;">4</span>
  </div>
  <div style="margin-top: 10px; text-align: center;">
    <span style="color: #abb2bf;">Full factorial runs: </span>
    <span id="run-display" style="color: #e5c07b; font-size: 1.5em; font-weight: bold;">16</span>
  </div>
</div>

<script>
(function() {
  const initRunCalculator = () => {
    const slider = document.getElementById('factor-slider');
    const factorDisplay = document.getElementById('factor-display');
    const runDisplay = document.getElementById('run-display');
    if (!slider || !factorDisplay || !runDisplay) return;
    
    const updateDisplay = () => {
      const k = parseInt(slider.value);
      const runs = Math.pow(2, k);
      factorDisplay.textContent = k;
      runDisplay.textContent = runs.toLocaleString();
      runDisplay.style.color = runs > 64 ? '#e06c75' : runs > 16 ? '#e5c07b' : '#98c379';
    };
    
    slider.addEventListener('input', updateDisplay);
    updateDisplay();
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRunCalculator);
  } else {
    initRunCalculator();
  }
})();
</script>

---

<!-- .slide:id="full-factorial-limits" -->
## Full Factorial: Where It Breaks Down
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Run Count Explosion*

-! Experiments grow exponentially: 5 factors → 32, 6 → 64, 10 → **1024**
-? Most labs can’t afford this (time, budget, materials)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Three Critical Weaknesses*

-! *High Cost* : each factor doubles workload
-! *Scalability* : equipment, reagents become limiting
-! **Redundancy** : most interactions are negligible

***

-= We need designs that give most information with less effort.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="why-alternatives" -->
## Why We Need Smarter Designs

-! In most real systems, only a few factors truly matter.
-: Testing every combination wastes resources on unimportant effects.

| Run | A | B | C | D | E | F | G | H | Response |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:--------|
| 1 | -1 | -1 | -1 | -1 | -1 | -1 | -1 | -1 | 10 |
| 2 | +1 | -1 | -1 | -1 | -1 | -1 | -1 | +1 | 12 |
| 3 | -1 | +1 | -1 | -1 | -1 | -1 | +1 | -1 | 11 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 256 | +1 | +1 | +1 | +1 | +1 | +1 | +1 | +1 | 13 |

-= Running all 256 combinations is not to describe factors but to describe factors and interactions.

-? But what if most interactions and/or factors are negligible?

---

<!-- .slide:id="why-alternatives-2" -->
## Why We Need Smarter Designs (cont.)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! **The solution:** Sacrifice completeness for efficiency.
-: Intentionally omit or add certain runs
-: Balance information gained versus effort spent
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! *Three design families* address these weaknesses:
-: *Fractional Factorials* : run only a fraction of combinations.
-: *Plackett–Burman* : highly efficient screening for many factors.
-: *Response Surface Designs* : model curvature for optimization.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fractional-factorial-intro" -->
## Fractional Factorial Designs

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<svg viewBox="0 0 280 260" style="max-width: 100%; height: auto;">
  <!-- Cube edges - back face -->
  <line x1="80" y1="60" x2="220" y2="60" stroke="#90a4ae" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="80" y1="60" x2="80" y2="180" stroke="#90a4ae" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="80" y1="60" x2="40" y2="100" stroke="#90a4ae" stroke-width="2" stroke-dasharray="5,3"/>
  <!-- Cube edges - front face -->
  <line x1="40" y1="100" x2="180" y2="100" stroke="#1976d2" stroke-width="2"/>
  <line x1="40" y1="100" x2="40" y2="220" stroke="#1976d2" stroke-width="2"/>
  <line x1="180" y1="100" x2="180" y2="220" stroke="#1976d2" stroke-width="2"/>
  <line x1="40" y1="220" x2="180" y2="220" stroke="#1976d2" stroke-width="2"/>
  <!-- Cube edges - connecting -->
  <line x1="180" y1="100" x2="220" y2="60" stroke="#1976d2" stroke-width="2"/>
  <line x1="180" y1="220" x2="220" y2="180" stroke="#1976d2" stroke-width="2"/>
  <line x1="220" y1="60" x2="220" y2="180" stroke="#1976d2" stroke-width="2"/>
  <line x1="80" y1="180" x2="220" y2="180" stroke="#90a4ae" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="80" y1="180" x2="40" y2="220" stroke="#1976d2" stroke-width="2"/>
  <!-- All 8 vertices (runs) -->
  <circle cx="40" cy="220" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="180" cy="220" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="40" cy="100" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="180" cy="100" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="80" cy="180" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="220" cy="180" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="80" cy="60" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <circle cx="220" cy="60" r="12" fill="#e3f2fd" stroke="#1976d2" stroke-width="3"/>
  <!-- Axis labels -->
  <text x="110" y="245" text-anchor="middle" fill="#1565c0" font-size="14" font-weight="bold">Factor A</text>
  <text x="15" y="160" text-anchor="middle" fill="#1565c0" font-size="14" font-weight="bold" transform="rotate(-90, 15, 160)">Factor B</text>
  <text x="250" y="130" text-anchor="middle" fill="#1565c0" font-size="14" font-weight="bold" transform="rotate(-45, 250, 130)">Factor C</text>
  <!-- Run count -->
  <rect x="90" y="5" width="100" height="30" rx="5" fill="#e8f5e9" stroke="#4caf50" stroke-width="2"/>
  <text x="140" y="25" text-anchor="middle" fill="#2e7d32" font-size="14" font-weight="bold">Full</text>
</svg>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 280 260" style="max-width: 100%; height: auto;">
  <!-- Cube edges - back face -->
  <line x1="80" y1="60" x2="220" y2="60" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="80" y1="60" x2="80" y2="180" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="80" y1="60" x2="40" y2="100" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="5,3"/>
  <!-- Cube edges - front face (faded) -->
  <line x1="40" y1="100" x2="180" y2="100" stroke="#bdbdbd" stroke-width="2"/>
  <line x1="40" y1="100" x2="40" y2="220" stroke="#bdbdbd" stroke-width="2"/>
  <line x1="180" y1="100" x2="180" y2="220" stroke="#bdbdbd" stroke-width="2"/>
  <line x1="40" y1="220" x2="180" y2="220" stroke="#bdbdbd" stroke-width="2"/>
  <!-- Cube edges - connecting -->
  <line x1="180" y1="100" x2="220" y2="60" stroke="#bdbdbd" stroke-width="2"/>
  <line x1="180" y1="220" x2="220" y2="180" stroke="#bdbdbd" stroke-width="2"/>
  <line x1="220" y1="60" x2="220" y2="180" stroke="#bdbdbd" stroke-width="2"/>
  <line x1="80" y1="180" x2="220" y2="180" stroke="#e0e0e0" stroke-width="2" stroke-dasharray="5,3"/>
  <line x1="80" y1="180" x2="40" y2="220" stroke="#bdbdbd" stroke-width="2"/>
  <!-- Diagonal lines connecting selected points -->
  <line x1="40" y1="220" x2="180" y2="100" stroke="#e53935" stroke-width="3" stroke-dasharray="8,4"/>
  <line x1="180" y1="100" x2="220" y2="180" stroke="#e53935" stroke-width="3" stroke-dasharray="8,4"/>
  <line x1="220" y1="180" x2="80" y2="60" stroke="#e53935" stroke-width="3" stroke-dasharray="8,4"/>
  <line x1="80" y1="60" x2="40" y2="220" stroke="#e53935" stroke-width="3" stroke-dasharray="8,4"/>
  <!-- Non-selected vertices (faded) -->
  <circle cx="180" cy="220" r="10" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="2"/>
  <circle cx="40" cy="100" r="10" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="2"/>
  <circle cx="80" cy="180" r="10" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="2"/>
  <circle cx="220" cy="60" r="10" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="2"/>
  <!-- Selected 4 vertices (half-fraction) - highlighted -->
  <circle cx="40" cy="220" r="14" fill="#ffcdd2" stroke="#e53935" stroke-width="4"/>
  <text x="40" y="225" text-anchor="middle" fill="#b71c1c" font-size="12" font-weight="bold">1</text>
  <circle cx="180" cy="100" r="14" fill="#ffcdd2" stroke="#e53935" stroke-width="4"/>
  <text x="180" y="105" text-anchor="middle" fill="#b71c1c" font-size="12" font-weight="bold">2</text>
  <circle cx="80" cy="60" r="14" fill="#ffcdd2" stroke="#e53935" stroke-width="4"/>
  <text x="80" y="65" text-anchor="middle" fill="#b71c1c" font-size="12" font-weight="bold">3</text>
  <circle cx="220" cy="180" r="14" fill="#ffcdd2" stroke="#e53935" stroke-width="4"/>
  <text x="220" y="185" text-anchor="middle" fill="#b71c1c" font-size="12" font-weight="bold">4</text>
  <!-- Axis labels -->
  <text x="110" y="245" text-anchor="middle" fill="#757575" font-size="14" font-weight="bold">Factor A</text>
  <text x="15" y="160" text-anchor="middle" fill="#757575" font-size="14" font-weight="bold" transform="rotate(-90, 15, 160)">Factor B</text>
  <text x="250" y="130" text-anchor="middle" fill="#757575" font-size="14" font-weight="bold" transform="rotate(-45, 250, 130)">Factor C</text>
  <!-- Run count -->
  <rect x="90" y="5" width="100" height="30" rx="5" fill="#ffebee" stroke="#e53935" stroke-width="2"/>
  <text x="140" y="25" text-anchor="middle" fill="#c62828" font-size="14" font-weight="bold">Fractional</text>
</svg>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fractional-intro-problem" -->
## Fractional Factorial: The Core Idea
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Scenario**

-! *4 factors* in water treatment
-: full factorial = 16 runs

***

-! Resources allow only **8 runs**

-? Can you still learn about all four factors?
-: **Yes**, accept a trade-off: run half, lose some info

***

-! **Notation:** $2^{k-p}$ uses $\frac{1}{2^p}$ fraction
-: $2^{4-1}$ = half of $2^4$ = 8 runs
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**The Idea: Strategic Selection**

-! Fractional factorial carefully selects combinations preserving key info

***

-! Choose the most informative subset:
-: Main effects still estimable
-: Some interactions become entangled

***

-= 8 runs instead of 16, but something must be sacrificed.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="interactive-aliasing-explorer" -->
## Interactive: Explore Aliasing

<div id="aliasing-explorer" style="font-size: 0.55em;">
  <div style="display: flex; gap: 20px; align-items: flex-start;">
    <!-- LEFT: MATRIX -->
    <div style="flex: 1;">
      <div style="margin-bottom: 10px; display: flex; gap: 10px; align-items: center;">
        <button id="analyze-btn"
                onclick="analyzeSelection()"
                style="background: #e53935; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">
          Analyze Selection
        </button>
        <button id="reset-btn"
                onclick="resetDesign()"
                style="background: #1976d2; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-weight: bold;">
          Reset
        </button>
        <span id="selected-count" style="color: #9efcff; font-weight: bold;">Selected: 0 / 16</span>
      </div>
      <table id="design-matrix" style="border-collapse: collapse; width: 100%; background: #1a2340;">
        <thead>
          <tr style="background: #2d3a5a;">
            <th style="padding: 6px; border: 1px solid #4a5568; color: #9efcff;">Run</th>
            <th class="col-A"  style="padding: 6px; border: 1px solid #4a5568; color: #61afef;">A</th>
            <th class="col-B"  style="padding: 6px; border: 1px solid #4a5568; color: #c678dd;">B</th>
            <th class="col-C"  style="padding: 6px; border: 1px solid #4a5568; color: #98c379;">C</th>
            <th class="col-D"  style="padding: 6px; border: 1px solid #4a5568; color: #e5c07b;">D</th>
            <th class="col-AB" style="padding: 6px; border: 1px solid #4a5568; color: #abb2bf;">AB</th>
            <th class="col-AC" style="padding: 6px; border: 1px solid #4a5568; color: #abb2bf;">AC</th>
            <th class="col-AD" style="padding: 6px; border: 1px solid #4a5568; color: #abb2bf;">AD</th>
            <th class="col-BC" style="padding: 6px; border: 1px solid #4a5568; color: #abb2bf;">BC</th>
            <th class="col-BD" style="padding: 6px; border: 1px solid #4a5568; color: #abb2bf;">BD</th>
            <th class="col-CD" style="padding: 6px; border: 1px solid #4a5568; color: #abb2bf;">CD</th>
          </tr>
        </thead>
        <tbody id="matrix-body"></tbody>
      </table>
    </div>
    <!-- RIGHT: PANEL -->
    <div id="design-check"
         style="flex: 0 0 720px; background: #1a2340; padding: 15px; border-radius: 8px; border: 2px solid #4a5568;">
      <h4 style="color: #9efcff; margin: 0 0 10px 0;">Design Check</h4>
      <div id="alias-content" style="color: #abb2bf; font-size: 0.95em;">
        <p style="color: #98c379;">✓ Ready</p>
        <p style="color: #6a7280; font-style: italic;">Select rows, then click “Analyze Selection”.</p>
      </div>
    </div>
  </div>
</div>

<script>
(function() {
  // Full 2^4 factorial design
  const fullDesign = [
    {run: 1,  A: -1, B: -1, C: -1, D: -1},
    {run: 2,  A:  1, B: -1, C: -1, D: -1},
    {run: 3,  A: -1, B:  1, C: -1, D: -1},
    {run: 4,  A:  1, B:  1, C: -1, D: -1},
    {run: 5,  A: -1, B: -1, C:  1, D: -1},
    {run: 6,  A:  1, B: -1, C:  1, D: -1},
    {run: 7,  A: -1, B:  1, C:  1, D: -1},
    {run: 8,  A:  1, B:  1, C:  1, D: -1},
    {run: 9,  A: -1, B: -1, C: -1, D:  1},
    {run: 10, A:  1, B: -1, C: -1, D:  1},
    {run: 11, A: -1, B:  1, C: -1, D:  1},
    {run: 12, A:  1, B:  1, C: -1, D:  1},
    {run: 13, A: -1, B: -1, C:  1, D:  1},
    {run: 14, A:  1, B: -1, C:  1, D:  1},
    {run: 15, A: -1, B:  1, C:  1, D:  1},
    {run: 16, A:  1, B:  1, C:  1, D:  1}
  ];

  const cols = ['A','B','C','D','AB','AC','AD','BC','BD','CD'];
  const mainCols = ['A','B','C','D'];

  let selectedRows = new Set();
  let isAnalyzed = false;

  const aliasColors = [
    '#61afef', '#c678dd', '#98c379', '#e5c07b', '#e06c75',
    '#56b6c2', '#d19a66', '#ff6b9d', '#a9dc76', '#78dce8'
  ];

  function computeInteractions(row) {
    return {
      ...row,
      AB: row.A * row.B,
      AC: row.A * row.C,
      AD: row.A * row.D,
      BC: row.B * row.C,
      BD: row.B * row.D,
      CD: row.C * row.D
    };
  }

  function getSelectedData() {
    return fullDesign.filter(r => selectedRows.has(r.run));
  }

  function toggleRow(runNum) {
    if (isAnalyzed) return;
    if (selectedRows.has(runNum)) selectedRows.delete(runNum);
    else selectedRows.add(runNum);
    updateSelectedCount();
    renderMatrix(fullDesign, null, null, false);
  }

  function updateSelectedCount() {
    const el = document.getElementById('selected-count');
    if (el) el.textContent = `Selected: ${selectedRows.size} / 16`;
  }

  // ---------- helpers ----------
  function sum(u) {
    let s = 0;
    for (let i = 0; i < u.length; i++) s += u[i];
    return s;
  }

  function columnVector(data, col) {
    return data.map(r => computeInteractions(r)[col]);
  }

  function corr(u, v) {
    const n = u.length;
    const mu = sum(u) / n;
    const mv = sum(v) / n;
    let num = 0, du = 0, dv = 0;
    for (let i = 0; i < n; i++) {
      const a = u[i] - mu;
      const b = v[i] - mv;
      num += a * b;
      du += a * a;
      dv += b * b;
    }
    if (du === 0 || dv === 0) return NaN;
    return num / Math.sqrt(du * dv);
  }

  function patternString(data, col, negate = false) {
    return data.map(r => {
      const v = computeInteractions(r)[col];
      return negate ? -v : v;
    }).join(',');
  }

  function canonicalPattern(data, col) {
    const p = patternString(data, col, false);
    const n = patternString(data, col, true);
    return (p < n) ? p : n;
  }

  /**
   * Detailed pattern groups:
   *  - groups[key].cols = [col1,col2,...]
   *  - groups[key].pat[col] = actual pattern string (not canonical)
   */
  function findPatternGroupsDetailed(data) {
    const groups = {};
    cols.forEach(col => {
      const key = canonicalPattern(data, col);
      if (!groups[key]) groups[key] = { cols: [], pat: {} };
      groups[key].cols.push(col);
      groups[key].pat[col] = patternString(data, col, false);
    });
    return groups;
  }

  function buildColorGroupsFromAliases(groups) {
    const colorGroups = {};
    let colorIdx = 0;
    Object.values(groups).forEach(g => {
      if (g.cols.length > 1) {
        const c = aliasColors[colorIdx % aliasColors.length];
        g.cols.forEach(col => colorGroups[col] = c);
        colorIdx++;
      }
    });
    return colorGroups;
  }

  // ---------- RANK (identifiability) ----------
  function buildXMatrix(data, modelCols) {
    const X = [];
    data.forEach(r => {
      const fr = computeInteractions(r);
      const row = [1];
      modelCols.forEach(c => row.push(fr[c]));
      X.push(row);
    });
    return X;
  }

  function matrixRank(A, eps = 1e-10) {
    const m = A.length;
    if (m === 0) return 0;
    const n = A[0].length;
    const M = A.map(r => r.slice());

    let rank = 0;
    let row = 0;
    for (let col = 0; col < n && row < m; col++) {
      let pivot = row;
      for (let i = row; i < m; i++) {
        if (Math.abs(M[i][col]) > Math.abs(M[pivot][col])) pivot = i;
      }
      if (Math.abs(M[pivot][col]) < eps) continue;

      [M[row], M[pivot]] = [M[pivot], M[row]];
      const piv = M[row][col];

      for (let j = col; j < n; j++) M[row][j] /= piv;

      for (let i = 0; i < m; i++) {
        if (i === row) continue;
        const f = M[i][col];
        if (Math.abs(f) < eps) continue;
        for (let j = col; j < n; j++) M[i][j] -= f * M[row][j];
      }

      rank++;
      row++;
    }
    return rank;
  }

  // ---------- Diagnostics ----------
  function analyzeDesign(data) {
    const n = data.length;
    const issues = {
      n,
      balanceProblems: [],  // {col, msg}
      orthProblems: [],     // {a,b,corr,msg}
      rank: null
    };
    if (n === 0) return issues;

    // (1) Balance: sum must be 0 for main effects in balanced 2-level DOE
    mainCols.forEach(col => {
      const v = columnVector(data, col);
      const plus = v.filter(x => x === 1).length;
      const minus = v.filter(x => x === -1).length;

      if (plus === 0 || minus === 0) {
        issues.balanceProblems.push({
          col,
          msg: `Factor ${col} is constant (${plus === 0 ? 'always −' : 'always +'}) → main effect not estimable.`
        });
      } else if (plus !== minus) {
        issues.balanceProblems.push({
          col,
          msg: `Factor ${col} is unbalanced (${plus}×‘+’, ${minus}×‘−’) → estimates become biased/less stable.`
        });
      }
    });

    // (2) Orthogonality main vs main
    for (let i = 0; i < mainCols.length; i++) {
      for (let j = i + 1; j < mainCols.length; j++) {
        const a = mainCols[i], b = mainCols[j];
        const va = columnVector(data, a);
        const vb = columnVector(data, b);
        const c = corr(va, vb);
        if (!Number.isFinite(c)) continue;
        if (Math.abs(c) > 1e-9) {
          issues.orthProblems.push({
            a, b, corr: c,
            msg: `${a} and ${b} are not orthogonal (corr=${c.toFixed(2)}) → effects are confounded.`
          });
        }
      }
    }

    // (3) Rank check for intercept + A..D
    const X = buildXMatrix(data, mainCols);
    const r = matrixRank(X);
    const p = 1 + mainCols.length;

    issues.rank = {
      rank: r,
      p,
      msg: (r < p)
        ? `Design matrix rank=${r} < ${p} (Intercept + A..D) → not all main effects identifiable.`
        : `Design matrix full rank for (Intercept + A..D): rank=${r}/${p} → main effects identifiable.`
    };

    return issues;
  }

  // ---------- Rendering (with optional Σ row) ----------
  function renderMatrix(data, colorGroups = null, highlightIssues = null, appendSumRow = false) {
    const tbody = document.getElementById('matrix-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Data rows
    data.forEach(row => {
      const fullRow = computeInteractions(row);
      const tr = document.createElement('tr');

      tr.style.cursor = isAnalyzed ? 'default' : 'pointer';
      tr.style.background = selectedRows.has(row.run) ? '#3d4f6f' : 'transparent';
      if (!isAnalyzed) tr.onclick = () => toggleRow(row.run);

      const runTd = document.createElement('td');
      runTd.style.cssText = 'padding: 5px 8px; border: 1px solid #4a5568; text-align: center; color: #9efcff; font-weight: bold;';
      runTd.textContent = row.run;
      tr.appendChild(runTd);

      cols.forEach(col => {
        const td = document.createElement('td');
        td.style.cssText = 'padding: 5px 8px; border: 1px solid #4a5568; text-align: center; font-weight: bold;';
        td.textContent = fullRow[col] === 1 ? '+' : '−';
        td.style.color = fullRow[col] === 1 ? '#98c379' : '#e06c75';

        if (colorGroups && colorGroups[col]) {
          td.style.background = colorGroups[col];
          td.style.color = '#1a2340';
        }

        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    // Σ row (column sums)
    if (appendSumRow) {
      const sumTr = document.createElement('tr');
      sumTr.style.background = '#2d3a5a';

      const labelTd = document.createElement('td');
      labelTd.style.cssText = 'padding: 5px 8px; border: 1px solid #4a5568; text-align: center; color: #9efcff; font-weight: bold;';
      labelTd.textContent = 'Σ';
      sumTr.appendChild(labelTd);

      cols.forEach(col => {
        const v = columnVector(data, col);
        const s = sum(v);

        const td = document.createElement('td');
        td.style.cssText = 'padding: 5px 8px; border: 1px solid #4a5568; text-align: center; font-weight: bold;';
        td.textContent = String(s);

        // For main effects, Σ must be 0 (balanced). For interactions: informative.
        const mustBeZero = mainCols.includes(col);
        if (mustBeZero) {
          td.style.color = (s === 0) ? '#98c379' : '#e06c75';
        } else {
          td.style.color = (s === 0) ? '#abb2bf' : '#e5c07b';
        }

        sumTr.appendChild(td);
      });

      tbody.appendChild(sumTr);
    }

    // Header highlighting for problematic columns
    if (highlightIssues && highlightIssues.col) {
      cols.forEach(col => {
        const th = document.querySelector(`.col-${col}`);
        if (!th) return;
        th.style.background = highlightIssues.col.has(col) ? '#4b2a2a' : '';
        th.style.borderColor = highlightIssues.col.has(col) ? '#e06c75' : '#4a5568';
      });
    } else {
      cols.forEach(col => {
        const th = document.querySelector(`.col-${col}`);
        if (!th) return;
        th.style.background = '';
        th.style.borderColor = '#4a5568';
      });
    }
  }

  // ---------- Signed alias text ----------
  function formatSignedAliasGroup(group) {
    // group: { cols:[...], pat:{col:patternString} }
    const rep = group.cols[0];
    const repPat = group.pat[rep];
    const repNeg = repPat.split(',').map(x => String(-parseInt(x,10))).join(',');

    // Build expression like: A ≡ −AD ≡ +BC ...
    // First term is just rep (implicitly +)
    const parts = [rep];

    for (let i = 1; i < group.cols.length; i++) {
      const c = group.cols[i];
      const p = group.pat[c];
      const sign = (p === repPat) ? '+' : (p === repNeg ? '−' : '?'); // '?' should not occur
      parts.push(`${sign}${c}`);
    }

    // Use ≡ for aliasing up to sign, but show sign explicitly
    return parts.join(' ≡ ');
  }

  function updateDesignCheckUI(diag, groupsDetailed) {
    const content = document.getElementById('alias-content');
    if (!content) return;

    const okBalance = diag.balanceProblems.length === 0;
    const okOrth = diag.orthProblems.length === 0;
    const okRank = diag.rank && diag.rank.rank >= diag.rank.p;

    const statusColor = (okBalance && okOrth && okRank) ? '#98c379' : '#e06c75';
    const statusText  = (okBalance && okOrth && okRank)
      ? '✓ Selection is structurally valid (for main effects).'
      : '⚠ Selection has structural problems.';

    let html = '';
    html += `<p style="color:${statusColor}; margin:0 0 8px 0;"><strong>${statusText}</strong></p>`;
    html += `<p style="color:#abb2bf; margin:0 0 10px 0;">Runs selected: <strong>${diag.n}</strong></p>`;

    html += `<p style="margin:10px 0 6px 0; color:#9efcff;"><strong>1) Level balance (A–D)</strong></p>`;
    html += `<p style="margin:0 0 6px 0; color:#6a7280; font-size:0.9em;">Tip: Check the Σ row in the table — for A–D it should be 0.</p>`;
    if (diag.balanceProblems.length === 0) {
      html += `<p style="margin:0; color:#98c379;">✓ Balanced (no constants, equal +/−).</p>`;
    } else {
      html += `<ul style="margin:0; padding-left:18px;">`;
      diag.balanceProblems.forEach(p => html += `<li style="margin:4px 0; color:#e06c75;">${p.msg}</li>`);
      html += `</ul>`;
    }

    html += `<p style="margin:12px 0 6px 0; color:#9efcff;"><strong>2) Orthogonality (main vs main)</strong></p>`;
    if (diag.orthProblems.length === 0) {
      html += `<p style="margin:0; color:#98c379;">✓ Orthogonal main effects.</p>`;
    } else {
      html += `<ul style="margin:0; padding-left:18px;">`;
      diag.orthProblems.forEach(p => html += `<li style="margin:4px 0; color:#e06c75;">${p.msg}</li>`);
      html += `</ul>`;
    }

    html += `<p style="margin:12px 0 6px 0; color:#9efcff;"><strong>3) Identifiability (rank)</strong></p>`;
    if (diag.rank) {
      const c = (diag.rank.rank >= diag.rank.p) ? '#98c379' : '#e06c75';
      html += `<p style="margin:0; color:${c};">${diag.rank.msg}</p>`;
    }

    html += `<p style="margin:12px 0 6px 0; color:#9efcff;"><strong>4) Aliasing (showing the sign)</strong></p>`;
    const aliasGroups = Object.values(groupsDetailed).filter(g => g.cols.length > 1);
    if (aliasGroups.length === 0) {
      html += `<p style="margin:0; color:#98c379;">✓ No identical/negated patterns detected among shown columns.</p>`;
    } else {
      html += `<p style="margin:0 0 6px 0; color:#e5c07b;">Same color = aliased. The “−” sign matters: e.g., if D is constant −1 then AD = −A (not A).</p>`;
      html += `<ul style="margin:0; padding-left:18px;">`;
      let colorIdx = 0;
      aliasGroups.forEach(g => {
        const color = aliasColors[colorIdx % aliasColors.length];
        html += `<li style="margin:4px 0; color:${color};"><strong>${formatSignedAliasGroup(g)}</strong></li>`;
        colorIdx++;
      });
      html += `</ul>`;
    }

    content.innerHTML = html;
  }

  // ---------- Public handlers ----------
  window.analyzeSelection = function() {
    if (selectedRows.size === 0) {
      alert('Please select at least one row first!');
      return;
    }

    isAnalyzed = true;
    const data = getSelectedData();

    const diag = analyzeDesign(data);
    const groupsDetailed = findPatternGroupsDetailed(data);
    const colorGroups = buildColorGroupsFromAliases(groupsDetailed);

    const highlightIssues = { col: new Set() };
    diag.balanceProblems.forEach(p => highlightIssues.col.add(p.col));

    // NOTE: appendSumRow = true
    renderMatrix(data, colorGroups, highlightIssues, true);
    updateDesignCheckUI(diag, groupsDetailed);

    const el = document.getElementById('selected-count');
    if (el) el.textContent = `Runs: ${data.length}`;
  };

  window.resetDesign = function() {
    selectedRows.clear();
    isAnalyzed = false;
    updateSelectedCount();
    renderMatrix(fullDesign, null, null, false);

    const content = document.getElementById('alias-content');
    if (content) {
      content.innerHTML = `
        <p style="color: #98c379;">✓ Ready</p>
        <p style="color: #6a7280; font-style: italic;">Select rows, then click “Analyze Selection”.</p>
      `;
    }
  };

  // Reveal hook
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
      if (event.currentSlide.querySelector('#aliasing-explorer')) {
        resetDesign();
      }
    });
  }

  // Initial render
  setTimeout(() => {
    renderMatrix(fullDesign, null, null, false);
    updateSelectedCount();
  }, 100);
})();
</script>


---

<!-- .slide:id="aliasing-intro" -->
## What Do We Sacrifice? — Aliasing
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! When we use fewer runs, some effects become inseparable.
-: We cannot distinguish them from our data.
-: This phenomenon is called **aliasing**.

***

-! Two effects are **aliased** if they share the same pattern across runs
-: i.e., identical or negated columns in design matrix

***

-< What gets aliased depends on which fraction we choose.
-: The choice of runs determines which effects we can distinguish.
-: Smart designs minimize aliasing of the effects we care about most.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! **Metaphor:** Effects "travel together" like passengers sharing a car.
-: If you only see the car arrive, you cannot tell who was driving.
-: The effects are **confounded**, i.e., combined in a single estimate.

<svg viewBox="0 0 320 200" style="max-width: 100%; height: auto;">
  <!-- Road -->
  <rect x="0" y="140" width="320" height="60" fill="#455a64"/>
  <line x1="0" y1="170" x2="320" y2="170" stroke="#ffd54f" stroke-width="3" stroke-dasharray="20,15"/>
  
  <!-- Car body -->
  <rect x="80" y="95" width="160" height="50" rx="8" fill="#42a5f5" stroke="#1976d2" stroke-width="3"/>
  <!-- Car roof/cabin -->
  <path d="M105 95 L125 60 L215 60 L235 95" fill="#90caf9" stroke="#1976d2" stroke-width="3"/>
  <!-- Windows -->
  <rect x="130" y="65" width="35" height="25" rx="3" fill="#e3f2fd" stroke="#1976d2" stroke-width="2"/>
  <rect x="175" y="65" width="35" height="25" rx="3" fill="#e3f2fd" stroke="#1976d2" stroke-width="2"/>
  
  <!-- Wheels -->
  <circle cx="115" cy="145" r="18" fill="#37474f" stroke="#263238" stroke-width="3"/>
  <circle cx="115" cy="145" r="8" fill="#78909c"/>
  <circle cx="205" cy="145" r="18" fill="#37474f" stroke="#263238" stroke-width="3"/>
  <circle cx="205" cy="145" r="8" fill="#78909c"/>
  
  <!-- Headlights -->
  <rect x="235" y="108" width="12" height="10" rx="2" fill="#fff59d" stroke="#fbc02d" stroke-width="2"/>
  
  <!-- Passenger 1 (Effect A) - in back window -->
  <circle cx="147" cy="72" r="10" fill="#ffcdd2" stroke="#e53935" stroke-width="2"/>
  <circle cx="145" cy="70" r="2" fill="#37474f"/>
  <circle cx="150" cy="70" r="2" fill="#37474f"/>
  <path d="M143 75 Q147 78 151 75" fill="none" stroke="#37474f" stroke-width="1.5"/>
  
  <!-- Passenger 2 (Effect B) - in front window -->
  <circle cx="192" cy="72" r="10" fill="#c8e6c9" stroke="#43a047" stroke-width="2"/>
  <circle cx="190" cy="70" r="2" fill="#37474f"/>
  <circle cx="195" cy="70" r="2" fill="#37474f"/>
  <path d="M188 75 Q192 78 196 75" fill="none" stroke="#37474f" stroke-width="1.5"/>
  
  <!-- Labels for passengers -->
  <rect x="125" y="30" width="30" height="20" rx="4" fill="#ffcdd2" stroke="#e53935" stroke-width="2"/>
  <text x="140" y="44" text-anchor="middle" fill="#c62828" font-size="11" font-weight="bold">A</text>
  <line x1="140" y1="50" x2="145" y2="62" stroke="#e53935" stroke-width="2"/>
  
  <rect x="180" y="30" width="30" height="20" rx="4" fill="#c8e6c9" stroke="#43a047" stroke-width="2"/>
  <text x="195" y="44" text-anchor="middle" fill="#2e7d32" font-size="11" font-weight="bold">B</text>
  <line x1="195" y1="50" x2="192" y2="62" stroke="#43a047" stroke-width="2"/>
</svg>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="aliasing-example" -->
## Aliasing in Action
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Half-Fraction Core Idea**

-! 3 factors → full = 8 runs, **half = 4 runs**
-! Generator $C = AB$ aliases C with A×B interaction
-! Defining relation: $I = ABC$

| Effect | Aliased With |
|:------:|:------------:|
| A | B×C |
| B | A×C |
| C | A×B |
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 340 70" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:transparent;">
  <defs><marker id="arrA" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="#e5c07b"/></marker></defs>
  <rect x="10" y="20" width="60" height="28" rx="4" fill="#61AFEF" opacity="0.3" stroke="#61AFEF" stroke-width="2"/>
  <text x="40" y="38" font-size="13" fill="#61AFEF" text-anchor="middle" font-weight="bold">C</text>
  <line x1="80" y1="34" x2="130" y2="34" stroke="#e5c07b" stroke-width="2" marker-end="url(#arrA)"/>
  <text x="105" y="25" font-size="9" fill="#e5c07b" text-anchor="middle">aliased</text>
  <rect x="140" y="20" width="60" height="28" rx="4" fill="#C678DD" opacity="0.3" stroke="#C678DD" stroke-width="2"/>
  <text x="170" y="38" font-size="13" fill="#C678DD" text-anchor="middle" font-weight="bold">A×B</text>
  <text x="215" y="36" font-size="15" fill="#abb2bf">=</text>
  <rect x="230" y="20" width="100" height="28" rx="4" fill="#98C379" opacity="0.3" stroke="#98C379" stroke-width="2"/>
  <text x="280" y="38" font-size="11" fill="#98C379" text-anchor="middle" font-weight="bold">C + A×B</text>
  <text x="170" y="62" font-size="8" fill="#75715e" text-anchor="middle">We measure the sum — cannot separate</text>
</svg>

-! If interactions ≈ 0 → main effects OK
-= Fewer runs, but some effects inseparable

-? See next slide for full matrix & geometry
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="aliasing-example-details" -->
## Aliasing: How half-fractions work

-! Full $2^3$ needs 8 runs; half-fraction uses only 4
-! Define generator $C = A \times B$; only run combinations where C equals A×B product
-! **Consequence:** C's main effect aliased with A×B, i.e., cannot separate from data alone
-! **Practical rule:** If 2-factor interactions negligible, main effect estimates remain valid

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

*$2^{3-1}$ Design Matrix*

<div style="font-size: 0.7em;">

| Run | A | B | C=AB |
|:---:|:--:|:--:|:----:|
| 1 | − | − | + |
| 2 | + | − | − |
| 3 | − | + | − |
| 4 | + | + | + |

</div>

-: Only 4 of 8 possible combinations
-: C level determined by A×B product
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Geometric View*

<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="max-width:450px;background:transparent;">
<polygon points="40,105 100,125 160,105 100,85" fill="none" stroke="#555" stroke-width="1"/>
<polygon points="40,55 100,75 160,55 100,35" fill="none" stroke="#555" stroke-width="1"/>
<line x1="40" y1="55" x2="40" y2="105" stroke="#555" stroke-width="1"/>
<line x1="100" y1="35" x2="100" y2="85" stroke="#555" stroke-width="1"/>
<line x1="160" y1="55" x2="160" y2="105" stroke="#555" stroke-width="1"/>
<line x1="100" y1="75" x2="100" y2="125" stroke="#555" stroke-width="1"/>
<circle cx="40" cy="55" r="10" fill="#98c379"/>
<circle cx="160" cy="55" r="10" fill="#98c379"/>
<circle cx="100" cy="125" r="10" fill="#98c379"/>
<circle cx="100" cy="85" r="10" fill="#98c379"/>
<circle cx="40" cy="105" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<circle cx="160" cy="105" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<circle cx="100" cy="75" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<circle cx="100" cy="35" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<text x="40" y="60" text-anchor="middle" fill="#1a2340" font-size="12" font-weight="bold">1</text>
<text x="160" y="60" text-anchor="middle" fill="#1a2340" font-size="12" font-weight="bold">4</text>
<text x="100" y="130" text-anchor="middle" fill="#1a2340" font-size="12" font-weight="bold">2</text>
<text x="100" y="90" text-anchor="middle" fill="#1a2340" font-size="12" font-weight="bold">3</text>
</svg>

<span style="color:#98c379;">●</span> Selected (4) &nbsp; <span style="color:#e06c75;">◌</span> Omitted (4)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="resolution-intro" -->
## Design Resolution: How Much Confounding?

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

-! Design quality varies: Not all fractional designs have the same aliasing severity.
-: Some keep main effects clean; others mix them with interactions.
-: **Resolution** quantifies this confounding severity.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! Formal definition: Resolution = length of the shortest word in the alias defining relation.
-: Higher resolution → less severe confounding

***

-< Word: A product of factor letters in the alias defining relation.
-: Example: $D = ABC$ has word "DABC" of length 4 → Resolution IV
-: However, if there was also $C = AB$, shortest word would be "CAB" of length 3 → Resolution III
<!-- /position -->
<!-- /layout -->

---


<!-- .slide:id="resolution-table" -->
## Resolution Levels & Use Cases

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

<div style="font-size: 0.7em;">

| Resolution | Main Effects Aliased With | 2FI Aliased With | Use Case |
|:----------:|:------------------------:|:----------------:|:---------|
| **III** | 2-factor interactions | Each other | Rough screening |
| **IV** | 3-factor interactions | Each other | Standard screening |
| **V** | 4-factor interactions | 3-factor interactions | Interaction study |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! **Notation:** Resolution is written as Roman numerals.
-: Example: $2^{5-2}_{III}$ = 5 factors, quarter-fraction, Resolution III

***

-! **Design decision:** For screening, Resolution IV is usually the minimum acceptable.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fractional-example" -->
## Example: Water Treatment Screening
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Scenario**

-! 4 factors: pH, dose, mixing, settling
-! Full = 16 runs → Half = **8 runs**
-! **Resolution IV:** $2^{4-1}_{IV}$, $A = BCD$

| Effect | Aliased With |
|:------:|:------------:|
| A | BCD |
| AB | CD |
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Why It Works**

-! 3-factor interactions negligible → main effects OK
-! 50% savings; can augment later

***

-? Can you create the design matrix?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fractional-when" -->
## When to Use Fractional Factorials

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! **Design decision:**
-: 2–4 factors: Full factorial is usually feasible.
-: 5+ factors: Consider a fractional design.

***

-! **Benefits:**
-: Dramatic reduction in runs.
-: Quick identification of important factors.
-: Can augment with more detailed experiments later.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! **Costs:**
-: Cannot estimate all interactions.
-: Must assume some effects are negligible.
-: Risk of aliased effects misleading conclusions.

***

-= Fractional factorials are ideal for *screening*, i.e., finding which factors matter before investing in detailed study.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fractional-example-1" -->
## Example: $2^{4-1}_{IV}$ Fractional Factorial Design

<div style="font-size: 0.7em;">

| Run | A | B | C | D=ABC | AB = CD | AC = BD | AD = BC |
|:---:|:--:|:--:|:--:|:-----:|:--:|:--:|:--:|
| 1 | *-* | *-* | *-* | *-* | **+** | **+** | **+** |
| 2 | **+** | *-* | *-* | **+** | *-* | *-* | **+** |
| 3 | *-* | **+** | *-* | **+** | *-* | **+** | *-* |
| 4 | **+** | **+** | *-* | *-* | **+** | *-* | *-* |
| 5 | *-* | *-* | **+** | **+** | **+** | *-* | *-* |
| 6 | **+** | *-* | **+** | *-* | *-* | **+** | *-* |
| 7 | *-* | **+** | **+** | *-* | *-* | *-* | **+** |
| 8 | **+** | **+** | **+** | **+** | **+** | **+** | **+** |

</div>

---

<!-- .slide:id="fractional-example-1" -->
## Example: $2^{5-2}_{III}$ Fractional Factorial Design  ($D=AB$, $E=AC$)

<div style="font-size: 0.7em;">

| Run | A = BD = CE | B = AD | C = AE | D = AB | E = AC | BC = DE | BE = CD |
|:---:|:-----------:|:------:|:------:|:------:|:------:|:-------:|:-------:|
| 1 | *-* | *-* | *-* | **+** | **+** | **+** | **+** |
| 2 | **+** | *-* | *-* | *-* | *-* | **+** | *-* |
| 3 | *-* | **+** | *-* | *-* | **+** | *-* | **+** |
| 4 | **+** | **+** | *-* | **+** | *-* | *-* | *-* |
| 5 | *-* | *-* | **+** | **+** | *-* | *-* | *-* |
| 6 | **+** | *-* | **+** | *-* | **+** | *-* | **+** |
| 7 | *-* | **+** | **+** | *-* | *-* | **+** | *-* |
| 8 | **+** | **+** | **+** | **+** | **+** | **+** | **+** |

</div>

---

<!-- .slide:id="pb-intro-problem" -->
## Beyond Powers of Two: The Gap Problem

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

-! Fractional factorials have run counts in powers of two: 4, 8, 16, 32...
-: What if these sizes don't fit your situation?

***

-! **Example problem:**
-: You have **11 factors** to screen.
-: 8 runs is too few, you can only fit 7 factors.
-: 16 runs seems wasteful, you only need to screen, not characterize.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-? Is there a design with **12 runs** for 11 factors?

***

-! **Yes**, this is exactly what **Plackett–Burman** designs provide.
-: Run counts in multiples of 4: 12, 20, 24, 28...
-: They fill the gaps between powers of two.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-intro-12-run-design" -->
## 12-Run Plackett–Burman Design Example

<div style="font-size: 0.65em;">

| Run | A | B | C | D | E | F | G | H | I | J | K |
|:---:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | **+** | **+** | **+** | **+** | **+** | **+** | **+** | **+** | **+** | **+** | **+** |
| 2 | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* | **+** | *-* |
| 3 | *-* | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* | **+** |
| 4 | **+** | *-* | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* |
| 5 | *-* | **+** | *-* | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* |
| 6 | *-* | *-* | **+** | *-* | *-* | **+** | *-* | **+** | **+** | **+** | *-* |
| 7 | *-* | *-* | *-* | **+** | *-* | *-* | **+** | *-* | **+** | **+** | **+** |
| 8 | **+** | *-* | *-* | *-* | **+** | *-* | *-* | **+** | *-* | **+** | **+** |
| 9 | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* | **+** | *-* | **+** |
| 10 | **+** | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* | **+** | *-* |
| 11 | *-* | **+** | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* | **+** |
| 12 | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* |

</div>

---

<!-- .slide:id="pb-design" -->
## Plackett–Burman Designs
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Flexible Run Counts**

-! Runs in *multiples of 4:* 12, 20, 24, 28...
-! Match design size to resources (not locked to powers of 2)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Extreme Efficiency**

-! $N$ runs → up to $N-1$ factors

| Runs | Factors | Full Factorial |
|:----:|:-------:|:--------------:|
| 12 | 11 | 2,048 |
| 20 | 19 | 524,288 |
| 24 | 23 | 8,388,608 |

-= Most efficient way to screen many factors.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-properties" -->
## PB Design Properties
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Orthogonality**

-! PB designs are orthogonal:
-: Each factor is at high and low levels equally often.
-: Any two columns are uncorrelated.

***

-! This guarantees:
-: Main effects can be estimated independently of each other.
-: No main effect "masks" another main effect.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Resolution III** Main Effects Only

-! PB designs are Resolution III:
-: Main effects are confounded with 2-factor interactions.
-: Interactions are completely intertwined, cannot be separated.

***

-! **Core assumption:**
-: Interactions are negligible.
-: We only care about identifying which factors have any effect.

***

-= PB designs answer: "Which factors matter?", not "How do they interact?"
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-example" -->
## Example: Screening 8 Water Quality Variables
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Scenario**

-! Studying *pollutant removal* with 8 potential variables:
-: pH, temperature, coagulant type, coagulant dose
-: Settling time, catalyst, mixing rate, polymer

***

-! Resources allow only *12 experiments*
-: Full factorial = 256 runs; fractional = 16+ runs
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**The PB Solution**

-! Use a *12-run Plackett–Burman* design
-: Assign 8 factors to 8 columns
-: Use 3 columns as dummies for error estimation

***

-! *Examplary outcome:* pH, dose, and mixing show large effects; others negligible

***

-= PB narrowed 8 candidates to 3 key factors in just 12 runs
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-12-run-design" -->
## Wasn't PB-12 used for 11 factors? Now only 8?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Design Flexibility**
-! PB designs can screen *up to* N−1 factors in N runs.
-: You can use fewer factors if desired.
-: Extra columns can be left unused or assigned as dummies.

***

**Dummy Variables**
-! Multiple dummy columns allow better error estimation.
-: SE of effects ≈ SD of dummy effects.
-: With 3 dummies: df = 2 for t-test.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div style="font-size: 0.45em;">

| Run | A | B | C | D | E | F | G | H | d₁ | d₂ | d₃ |
|:---:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | **+** | **+** | **+** | **+** | **+** | **+** | **+** | **+** | *+* | *+* | *+* |
| 2 | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* | *+* | *-* |
| 3 | *-* | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* | *+* |
| 4 | **+** | *-* | *-* | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* |
| 5 | *-* | **+** | *-* | *-* | **+** | *-* | **+** | **+** | *+* | *-* | *-* |
| 6 | *-* | *-* | **+** | *-* | *-* | **+** | *-* | **+** | *+* | *+* | *-* |
| 7 | *-* | *-* | *-* | **+** | *-* | *-* | **+** | *-* | *+* | *+* | *+* |
| 8 | **+** | *-* | *-* | *-* | **+** | *-* | *-* | **+** | *-* | *+* | *+* |
| 9 | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* | *+* | *-* | *+* |
| 10 | **+** | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* | *+* | *-* |
| 11 | *-* | **+** | **+** | **+** | *-* | *-* | *-* | **+** | *-* | *-* | *+* |
| 12 | **+** | *-* | **+** | **+** | **+** | *-* | *-* | *-* | *+* | *-* | *-* |

</div>

<div style="text-align: right; font-size: 0.8em; color: #00a6e7ff; margin-right: 20px; margin-left: auto;">
3 dummy columns for error estimation: <strong> d₁, d₂, d₃ ⬆</strong>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-analysis-example" -->
## Plackett–Burman Example: Analysis Output

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

<div style="font-size: 0.42em; margin-top: 5px;">
<table id="pb-design-table">
<thead>
<tr style="background: #2d3748;"><th>Run</th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th style="color:#888;">d₁</th><th style="color:#888;">d₂</th><th style="color:#888;">d₃</th><th style="color:#61afef;">Y</th></tr>
</thead>
<tbody id="pb-design-body"></tbody>
</table>
</div>

<div style="font-size: 0.6em; color: #888; margin-top: 8px;">
d₁, d₂, d₃ = Dummy variables &nbsp;|&nbsp; Y = Response (Pollutant Removal %)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div style="font-size: 0.48em;">
<table id="pb-effects-table">
<thead>
<tr style="background: #2d3748;"><th>Factor</th><th>Effect</th><th>SE</th><th>t-value</th><th>p-value</th><th>Sig.</th></tr>
</thead>
<tbody id="pb-effects-body"></tbody>
</table>
</div>

<div style="font-size: 0.6em; color: #abb2bf; margin-top: 10px;">
<strong>Interpretation:</strong> Factors A (pH), D (Dose), and G (Mixing) are significant (p &lt; 0.05).<br>
SE estimated from SD of 3 dummy effects (df = 2).
</div>

<!-- /position -->
<!-- /layout -->

<script>
(function() {
  // PB-12 design matrix (standard Plackett-Burman)
  // Columns: A-H = 8 factors, d1, d2, d3 = 3 dummies
  const pbDesign = [
    { run: 1,  A: 1,  B: 1,  C: 1,  D: 1,  E: 1,  F: 1,  G: 1,  H: 1,  d1: 1,  d2: 1,  d3: 1  },
    { run: 2,  A:-1,  B: 1,  C:-1,  D: 1,  E: 1,  F: 1,  G:-1,  H:-1,  d1:-1,  d2: 1,  d3:-1 },
    { run: 3,  A:-1,  B:-1,  C: 1,  D:-1,  E: 1,  F: 1,  G: 1,  H:-1,  d1:-1,  d2:-1,  d3: 1  },
    { run: 4,  A: 1,  B:-1,  C:-1,  D: 1,  E:-1,  F: 1,  G: 1,  H: 1,  d1:-1,  d2:-1,  d3:-1 },
    { run: 5,  A:-1,  B: 1,  C:-1,  D:-1,  E: 1,  F:-1,  G: 1,  H: 1,  d1: 1,  d2:-1,  d3:-1 },
    { run: 6,  A:-1,  B:-1,  C: 1,  D:-1,  E:-1,  F: 1,  G:-1,  H: 1,  d1: 1,  d2: 1,  d3:-1 },
    { run: 7,  A:-1,  B:-1,  C:-1,  D: 1,  E:-1,  F:-1,  G: 1,  H:-1,  d1: 1,  d2: 1,  d3: 1  },
    { run: 8,  A: 1,  B:-1,  C:-1,  D:-1,  E: 1,  F:-1,  G:-1,  H: 1,  d1:-1,  d2: 1,  d3: 1  },
    { run: 9,  A: 1,  B: 1,  C:-1,  D:-1,  E:-1,  F: 1,  G:-1,  H:-1,  d1: 1,  d2:-1,  d3: 1  },
    { run: 10, A: 1,  B: 1,  C: 1,  D:-1,  E:-1,  F:-1,  G: 1,  H:-1,  d1:-1,  d2: 1,  d3:-1 },
    { run: 11, A:-1,  B: 1,  C: 1,  D: 1,  E:-1,  F:-1,  G:-1,  H: 1,  d1:-1,  d2:-1,  d3: 1  },
    { run: 12, A: 1,  B:-1,  C: 1,  D: 1,  E: 1,  F:-1,  G:-1,  H:-1,  d1: 1,  d2:-1,  d3:-1 }
  ];

  // True effects: A=8, D=6, G=-5 are significant; others ~0
  // Model: Y = 75 + 4*A + 3*D - 2.5*G + noise
  const trueIntercept = 75;
  const trueEffects = { A: 8, B: 0.4, C: -0.3, D: 6, E: 0.5, F: -0.4, G: -5, H: 0.2, d1: 0, d2: 0, d3: 0 };
  
  // Generate response values with small random error (seeded for reproducibility)
  function seededRandom(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  const rand = seededRandom(40);
  
  // Calculate response for each run
  const realFactors = ['A','B','C','D','E','F','G','H'];
  const dummies = ['d1','d2','d3'];
  const allColumns = [...realFactors, ...dummies];
  
  pbDesign.forEach(row => {
    let y = trueIntercept;
    realFactors.forEach(f => {
      y += (trueEffects[f] / 2) * row[f];  // Effect = 2 * coefficient
    });
    // Add small random error (±0.8)
    y += (rand() - 0.5) * 1.6;
    row.Y = Math.round(y * 10) / 10;
  });

  // Calculate effects using contrast method: Effect = (mean at +) - (mean at -)
  function calcEffect(data, col) {
    let sumPlus = 0, sumMinus = 0, nPlus = 0, nMinus = 0;
    data.forEach(row => {
      if (row[col] === 1) { sumPlus += row.Y; nPlus++; }
      else { sumMinus += row.Y; nMinus++; }
    });
    return (sumPlus / nPlus) - (sumMinus / nMinus);
  }

  // Calculate all effects
  const effects = {};
  allColumns.forEach(f => {
    effects[f] = calcEffect(pbDesign, f);
  });

  // Standard error from SD of dummy effects (df = 2)
  const dummyEffects = dummies.map(d => effects[d]);
  const meanDummy = dummyEffects.reduce((a,b) => a+b, 0) / dummyEffects.length;
  const varDummy = dummyEffects.reduce((s,e) => s + (e - meanDummy)**2, 0) / (dummyEffects.length - 1);
  const SE = Math.sqrt(varDummy);
  const df = dummies.length - 1; // df = 2

  // t-distribution p-value using Beta function approximation
  function pValueFromT(t, df) {
    const x = df / (df + t * t);
    // Incomplete beta function approximation for df=2
    // For df=2: p = (1 + |t|/sqrt(2+t^2))^(-1) * 2 ... simplified
    // Using more accurate approximation:
    const absT = Math.abs(t);
    if (df === 2) {
      // Exact formula for df=2: p = 1 / sqrt(1 + t^2/2)
      return 1 / Math.sqrt(1 + (t * t) / df);
    }
    // Fallback: normal approximation
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const xAbs = absT / Math.sqrt(2);
    const t1 = 1 / (1 + p * xAbs);
    const erf = 1 - (((((a5 * t1 + a4) * t1) + a3) * t1 + a2) * t1 + a1) * t1 * Math.exp(-xAbs * xAbs);
    return 2 * (1 - 0.5 * (1 + erf));
  }

  // Render design table
  function renderDesignTable() {
    const tbody = document.getElementById('pb-design-body');
    if (!tbody) return;
    
    let html = '';
    pbDesign.forEach(row => {
      html += '<tr>';
      html += `<td style="font-weight:bold;">${row.run}</td>`;
      allColumns.forEach(f => {
        const val = row[f];
        const color = val === 1 ? '#98c379' : '#e06c75';
        const symbol = val === 1 ? '+' : '−';
        const isDummy = dummies.includes(f);
        const style = isDummy ? `color:${color}; opacity:0.6;` : `color:${color};`;
        html += `<td style="${style}">${symbol}</td>`;
      });
      html += `<td style="color:#61afef; font-weight:bold;">${row.Y.toFixed(1)}</td>`;
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // Render effects table
  function renderEffectsTable() {
    const tbody = document.getElementById('pb-effects-body');
    if (!tbody) return;
    
    // Factor labels for display
    const labels = {
      A: 'A (pH)', B: 'B (Temp)', C: 'C (Coag.)', D: 'D (Dose)',
      E: 'E (Settling)', F: 'F (Catalyst)', G: 'G (Mixing)', H: 'H (Polymer)',
      d1: 'd₁ (Dummy)', d2: 'd₂ (Dummy)', d3: 'd₃ (Dummy)'
    };
    
    let html = '';
    allColumns.forEach(f => {
      const eff = effects[f];
      const tVal = eff / SE;
      const pVal = pValueFromT(tVal, df);
      const isDummy = dummies.includes(f);
      const sig = !isDummy && pVal < 0.05;
      
      const rowStyle = sig ? 'background: rgba(152, 195, 121, 0.15);' : '';
      const effColor = sig ? '#98c379' : '#abb2bf';
      const sigSymbol = sig ? '✓' : '';
      const sigColor = sig ? '#98c379' : '#6a7280';
      const labelStyle = isDummy ? 'color:#888; font-style:italic;' : '';
      
      html += `<tr style="${rowStyle}">`;
      html += `<td style="${labelStyle}">${labels[f]}</td>`;
      html += `<td style="color:${effColor}; font-weight:${sig ? 'bold' : 'normal'};">${eff.toFixed(2)}</td>`;
      html += `<td>${SE.toFixed(2)}</td>`;
      html += `<td>${tVal.toFixed(2)}</td>`;
      html += `<td style="color:${isDummy ? '#888' : (pVal < 0.05 ? '#98c379' : '#abb2bf')};">${pVal.toFixed(3)}</td>`;
      html += `<td style="color:${sigColor}; font-weight:bold;">${sigSymbol}</td>`;
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // Initialize on slide load
  function init() {
    renderDesignTable();
    renderEffectsTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-render when Reveal shows the slide
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', (event) => {
      if (event.currentSlide && event.currentSlide.id === 'pb-analysis-example') {
        setTimeout(init, 50);
      }
    });
  }
})();
</script>

---

<!-- .slide:id="pb-significant-effects" -->
## Lenth's Method: Finding Effects Without Dummies

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

**The Problem**
-! No replicates → no direct error estimate
-: But most effects are likely small (inactive)
-: Use the small effects themselves to estimate noise

***

*Lenth's Pseudo Standard Error (PSE)*

<div style="font-size: 0.8em;">

1. Compute initial estimate $s_0$:
$$s_0 = 1.5 \cdot \text{median}(|E_j|)$$

2. Trim large effects (keep only $|E_j| < 2.5 \cdot s_0$)

3. Compute PSE from trimmed set:
$$\text{PSE} = 1.5 \cdot \text{median}(|E_j|_{\text{trimmed}})$$

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

**Critical Values**

-! Margin of Error (ME): $t_{\alpha/2, df} \cdot \text{PSE}$
-! Simultaneous ME (SME): $t_{\gamma, df} \cdot \text{PSE}$
-: where $df \approx m/3$ pseudo degrees of freedom
-: $m$ = number of effects, $\gamma$ accounts for multiple testing
-: e.g., $\gamma = 1 - (1 - \alpha)^{1/m}$

***

**Decision Rule**
-! $|E_j| > \text{ME}$: possibly significant
-! $|E_j| > \text{SME}$: likely significant (conservative)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-limitations" -->
## PB Limitations and Strategy

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

-! What PB designs cannot do:
-: Detect or estimate interactions.
-: Detect curvature in the response.
-: Provide internal replication for error estimation.

***

-! **Strategic role:** Use PB as Phase 1 only.
-: Screen many factors to find the vital few.
-: Then switch to a more detailed design for those factors.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! **Example workflow:**
-: PB screening identifies pH, dose, and mixing speed as important.
-: Follow up with a factorial or response surface design on those 3 factors.

***

-= PB designs are the *wide net*, i.e., other designs provide the *fine detail*.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="curvature-problem" -->
## The Curvature Problem

<svg viewBox="0 0 500 180" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; margin-top: 15px; background: transparent;">
  <!-- Axes -->
  <line x1="50" y1="150" x2="450" y2="150" stroke="#abb2bf" stroke-width="2"/>
  <line x1="50" y1="150" x2="50" y2="20" stroke="#abb2bf" stroke-width="2"/>
  <!-- X-axis labels -->
  <text x="50" y="170" font-size="12" fill="#abb2bf" text-anchor="middle">Low pH</text>
  <text x="250" y="170" font-size="12" fill="#98c379" text-anchor="middle" font-weight="bold">Optimal pH</text>
  <text x="450" y="170" font-size="12" fill="#abb2bf" text-anchor="middle">High pH</text>
  <!-- Y-axis label -->
  <text x="25" y="85" font-size="12" fill="#abb2bf" text-anchor="middle" transform="rotate(-90, 25, 85)">Efficiency</text>
  <!-- Curved response (quadratic) -->
  <path d="M 50 120 Q 250 10 450 120" stroke="#61AFEF" stroke-width="3" fill="none"/>
  <!-- Linear approximation (2-level design sees this) -->
  <line x1="50" y1="120" x2="450" y2="120" stroke="#e06c75" stroke-width="2" stroke-dasharray="8,4"/>
  <!-- Points -->
  <circle cx="50" cy="120" r="8" fill="#e06c75"/>
  <circle cx="450" cy="120" r="8" fill="#e06c75"/>
  <circle cx="250" cy="65" r="8" fill="#98c379"/>
  <!-- Legend -->
  <line x1="320" y1="25" x2="350" y2="25" stroke="#61AFEF" stroke-width="3"/>
  <text x="355" y="29" font-size="11" fill="#61AFEF">True response</text>
  <line x1="320" y1="45" x2="350" y2="45" stroke="#e06c75" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="355" y="49" font-size="11" fill="#e06c75">2-level view</text>
  <!-- Annotation -->
  <text x="250" y="55" font-size="11" fill="#98c379" text-anchor="middle">Optimum missed!</text>
</svg>

---

<!-- .slide:id="curvature-problem-2" -->
## The Curvature Problem (cont.)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Two-level designs only reveal direction, not shape.
-: "Higher pH is better" or "Lower pH is better."
-: But what if the optimum is *in between*?

***

**Water science example:**
-: Many treatment processes have an optimal pH.
-: Too low or too high pH both reduce efficiency.
-: The response is curved, i.e., it doesn't just go up or down.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-? A 2-level factorial would only test extreme pH values.
-: It might say "high pH is better than low pH."
-: But miss the fact that **medium pH is best**.

***

-= To find optima inside the factor range, we need more than two levels.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="curvature-detection" -->
## Detecting Curvature: Center Points
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Simple Test**

-! Add runs at the **center** (all factors at midpoint)

***

-! Typically 3–5 replicate center runs

***

-! *Compare:* corner average vs. center average
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Interpreting the Result**

-! *Center = corners:* linear response, 2-level OK
-! *Center ≠ corners:* curvature exists → use Response Surface Methodology
-: i.e., a design with quadratic terms
-! *Test:* $(\bar{y}\_{center} - \bar{y}\_{factorial})$ significant?

***

-= Center points are your early warning for curvature.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="curvature-test-statistic" -->
## Curvature Test Statistic
$$t = \frac{|\bar{y}\_{center} - \bar{y}\_{factorial}|}{s\_{center} \sqrt{\frac{1}{n\_{center}} + \frac{1}{n\_{factorial}}}}$$

-: $s\_{center}$ : standard deviation of center runs
-: $n\_{center}$ : number of center runs
-: $n\_{factorial}$ : number of factorial runs
-: $df = n\_{center} - 1$ for t-test

---

<!-- .slide:id="rsm-intro" -->
## Response Surface Methodology

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

-! **Goal:** Model the response as a curved surface, then find the optimum.
-: Fit a quadratic model with squared terms.
-: Capture peaks, valleys, and ridges in the response.

***

-! **The quadratic model:**

$$y = \beta_0 + \sum \beta_i x_i + \sum \beta_{ii} x_i^2 + \sum \beta_{ij} x_i x_j$$

-: Linear terms ($\beta_i$): main effects
-: Squared terms ($\beta_{ii}$): curvature
-: Cross terms ($\beta_{ij}$): interactions

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! **Two main RSM designs:**
-: *Central Composite Design (CCD)*, builds on a factorial base. (not part of this lecture)
-: *Box–Behnken Design (BBD)*, avoids extreme combinations.

***

-? Why not using Full Factorials with 3 levels?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bbd-structure" -->
## Box–Behnken Design Structure
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Edge Midpoints, Not Corners**

-! Points at *edge midpoints* (2 factors at extremes, 1 at center)
-! Rotate through all factor pairs + *center points*

<div id="bbd-table-trigger"
     style="font-size: 0.35em; cursor: pointer; border: 2px solid transparent; border-radius: 8px; padding: 5px; transition: all 0.3s;"
     onclick="BBDOverlay.open()"
     onmouseover="this.style.borderColor='#61afef'; this.style.background='rgba(97,175,239,0.1)'"
     onmouseout="this.style.borderColor='transparent'; this.style.background='transparent'">

| Run | A | B | C |
|:---:|:--:|:--:|:--:|
| 1 | − | − | 0 |
| 2 | + | − | 0 |
| 3 | − | + | 0 |
| 4 | + | + | 0 |
| 5 | − | 0 | − |
| 6 | + | 0 | − |
| 7 | − | 0 | + |
| 8 | + | 0 | + |
| 9 | 0 | − | − |
| 10 | 0 | + | − |
| 11 | 0 | − | + |
| 12 | 0 | + | + |
| 13-15 | 0 | 0 | 0 |

<div style="text-align: center; color: #61afef; font-size: 1.8em; margin-top: 5px;">🔍 Click to enlarge</div>
</div>

<!-- Overlay markup: can live inside the slide; JS will move it to <body> on open() -->
<div id="bbd-overlay"
     aria-hidden="true"
     style="
       display:none;
       position:fixed;
       inset:0;
       width:100vw;
       height:100dvh;                 /* 'dvh' is more robust than 'vh' on some browsers */
       background:rgba(10, 15, 30, 0.95);
       z-index:2147483647;            /* go above Reveal UI layers */
       box-sizing:border-box;
       padding:18px;
       pointer-events:auto;
     ">
  <!-- Shell: fixed viewport height, grid rows for deterministic layout -->
  <div id="bbd-shell"
       style="
         height:100%;
         width:100%;
         display:grid;
         grid-template-rows:auto 1fr auto; /* header / table / footer */
         gap:12px;
         min-height:0;                    /* IMPORTANT: allow the middle row to shrink */
       ">
    <!-- Header row -->
    <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
      <h2 style="color:#9efcff; margin:0; font-size:1.4em; line-height:1.2;">
        Box–Behnken Design Matrix (3 Factors)
      </h2>
      <button type="button"
              onclick="BBDOverlay.close()"
              aria-label="Close"
              style="
                background:#e53935;
                color:white;
                border:none;
                width:40px;
                height:40px;
                border-radius:50%;
                font-size:20px;
                cursor:pointer;
                font-weight:bold;
                box-shadow:0 4px 15px rgba(229, 57, 53, 0.4);
              ">✕</button>
    </div>
    <!-- Middle row: table container (no scrollbars; content is scaled to fit) -->
    <div id="bbd-fitbox"
         style="
           min-height:0;                 /* IMPORTANT: allow proper shrinking in grid */
           border-radius:12px;
           border:2px solid #4a5568;
           background:#1a2340;
           box-shadow:0 10px 40px rgba(0,0,0,0.5);
           overflow:hidden;              /* hard requirement: no overflow/scrollbars */
           display:grid;
           grid-template-rows:auto 1fr;  /* header table + body area */
         ">
      <!-- Fixed header (separate table to keep header always visible) -->
      <table style="border-collapse:collapse; width:100%; table-layout:fixed; font-size:1em;">
        <colgroup>
          <col style="width:10%;">  <!-- Run -->
          <col style="width:9%;">   <!-- I -->
          <col style="width:9%;">   <!-- A -->
          <col style="width:9%;">   <!-- B -->
          <col style="width:9%;">   <!-- C -->
          <col style="width:9%;">   <!-- AB -->
          <col style="width:9%;">   <!-- AC -->
          <col style="width:9%;">   <!-- BC -->
          <col style="width:9%;">   <!-- AA -->
          <col style="width:9%;">   <!-- BB -->
          <col style="width:9%;">   <!-- CC -->
        </colgroup>
        <thead>
          <tr style="background:#2d3a5a;">
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">Run</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">I</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#61afef; text-align:center;">A</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#c678dd; text-align:center;">B</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#98c379; text-align:center;">C</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">AB</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">AC</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">BC</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center;">AA</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center;">BB</th>
            <th style="padding:10px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center;">CC</th>
          </tr>
        </thead>
      </table>
      <!-- Body area: the content inside is scaled down to fit this box -->
      <div id="bbd-body-area"
           style="
             min-height:0;                 /* IMPORTANT */
             padding:10px;
             box-sizing:border-box;
             display:grid;
             place-items:center;           /* center the scaled table block */
             overflow:hidden;              /* IMPORTANT: no scrollbars */
           ">
        <!-- Scaler wrapper: JS adjusts transform:scale(...) so it never overflows -->
        <div id="bbd-scale"
             style="transform-origin:top center; width:100%;">
          <!-- Body table (only rows; keep col widths identical to header) -->
          <!-- BBD (3 factors) table body adapted to your full model matrix:
     Columns: I, A, B, C, AB, AC, BC, AA, BB, CC
     Notes:
     - Use table-layout: fixed and explicit col widths to keep everything aligned.
     - Colors follow your existing scheme: +1 green, -1 red, 0 grey, I/AA/BB/CC neutral.
-->

<table style="border-collapse:collapse; width:100%; table-layout:fixed; font-size:1.2em; background:#1a2340;">
  <colgroup>
    <col style="width:10%;">  <!-- Run -->
    <col style="width:9%;">   <!-- I -->
    <col style="width:9%;">   <!-- A -->
    <col style="width:9%;">   <!-- B -->
    <col style="width:9%;">   <!-- C -->
    <col style="width:9%;">   <!-- AB -->
    <col style="width:9%;">   <!-- AC -->
    <col style="width:9%;">   <!-- BC -->
    <col style="width:9%;">   <!-- AA -->
    <col style="width:9%;">   <!-- BB -->
    <col style="width:9%;">   <!-- CC -->
  </colgroup>
  <tbody>
    <!-- Helper styles (applied inline): 
         +1 => green (#98c379), -1 => red (#e06c75), 0 => grey (#abb2bf), constants/quadratics => light (#9efcff/#ffd166)
    -->
    <!-- 1:  I=1, A=-1, B=-1, C=0,  AB=+1, AC=0,  BC=0,  AA=1, BB=1, CC=0 -->
    <tr style="background:#1a2340;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
    </tr>
    <!-- 2 -->
    <tr style="background:#212b45;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">2</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
    </tr>
    <!-- 3 -->
    <tr style="background:#1a2340;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">3</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
    </tr>
    <!-- 4 -->
    <tr style="background:#212b45;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">4</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
    </tr>
    <!-- 5 -->
    <tr style="background:#1a2340;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">5</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 6 -->
    <tr style="background:#212b45;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">6</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 7 -->
    <tr style="background:#1a2340;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">7</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 8 -->
    <tr style="background:#212b45;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">8</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 9 -->
    <tr style="background:#1a2340;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">9</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 10 -->
    <tr style="background:#212b45;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">10</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 11 -->
    <tr style="background:#1a2340;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">11</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#e06c75; text-align:center; font-weight:bold;">−1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- 12 -->
    <tr style="background:#212b45;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">12</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#98c379; text-align:center; font-weight:bold;">+1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#ffd166; text-align:center; font-weight:bold;">1</td>
    </tr>
    <!-- Center point: all zeros except intercept -->
    <tr style="background:#2d3a5a;">
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center;">13-15</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#9efcff; text-align:center; font-weight:bold;">1</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
      <td style="padding:8px 8px; border:1px solid #4a5568; color:#abb2bf; text-align:center;">0</td>
    </tr>
    <!-- If you have multiple center replicates, duplicate the row above (14,15,...) -->
  </tbody>
</table>
        </div>
      </div>
    </div>
    <!-- Footer row -->
    <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; color:#abb2bf; font-size:0.95em;">
      <div style="display:flex; gap:18px; flex-wrap:wrap;">
        <span><span style="color:#98c379; font-weight:bold;">+1</span> = High</span>
        <span><span style="color:#e06c75; font-weight:bold;">−1</span> = Low</span>
        <span><span style="color:#abb2bf;">0</span> = Center</span>
      </div>
      <div style="color:#6a7280; font-size:0.9em;">
        Press <kbd style="background:#4a5568; padding:2px 6px; border-radius:4px;">Esc</kbd> or click ✕ to close
      </div>
    </div>
  </div>
</div>

<script>
/**
 * BBDOverlay
 * ==========
 * A Reveal.js-safe fullscreen overlay.
 *
 * Why this is needed:
 * - Reveal.js often applies CSS transforms (scale/translate) to slide containers.
 * - If an element with position:fixed is inside a transformed ancestor, the "fixed"
 *   positioning becomes relative to that ancestor (NOT the browser viewport).
 * - Result: overlays no longer cover the visible window reliably.
 *
 * Fix:
 * - On open(): move the overlay element to document.body, so it is no longer inside
 *   the transformed slide tree. Then position:fixed truly uses the viewport.
 *
 * Fit-to-box:
 * - The table body is scaled down using transform:scale(...) so it fits into the
 *   available space between header and footer without any overflow.
 */
window.BBDOverlay = (function() {
  const overlayId = 'bbd-overlay';
  const bodyAreaId = 'bbd-body-area';
  const scaleId = 'bbd-scale';

  // Remember original DOM position so we can restore the overlay on close
  let originalParent = null;
  let originalNextSibling = null;

  function $(id) { return document.getElementById(id); }

  /**
   * Move overlay into <body> to avoid being inside Reveal's transformed containers.
   */
  function moveOverlayToBody() {
    const overlay = $(overlayId);
    if (!overlay) return;

    // Store original location exactly once
    if (!originalParent) {
      originalParent = overlay.parentNode;
      originalNextSibling = overlay.nextSibling;
    }

    // Append to body if not already there
    if (overlay.parentNode !== document.body) {
      document.body.appendChild(overlay);
    }
  }

  /**
   * Restore overlay back to where it was in the slide DOM (optional cleanup).
   */
  function restoreOverlayPosition() {
    const overlay = $(overlayId);
    if (!overlay || !originalParent) return;

    if (originalNextSibling && originalNextSibling.parentNode === originalParent) {
      originalParent.insertBefore(overlay, originalNextSibling);
    } else {
      originalParent.appendChild(overlay);
    }
  }

  /**
   * Scale the table body so it fits into the available body area without overflow.
   * This intentionally NEVER scales up; it only scales down when required.
   */
  function fitTableNoOverflow() {
    const bodyArea = $(bodyAreaId);
    const scaler = $(scaleId);
    if (!bodyArea || !scaler) return;

    // Reset scaling to measure natural size
    scaler.style.transform = 'scale(1)';

    // Available pixels inside the body area
    const availW = bodyArea.clientWidth;
    const availH = bodyArea.clientHeight;

    // Natural (unscaled) content size
    const naturalW = scaler.scrollWidth;
    const naturalH = scaler.scrollHeight;

    if (!naturalW || !naturalH) return;

    const sx = availW / naturalW;
    const sy = availH / naturalH;

    // Choose the smallest scale that fits, but never upscale above 1
    const s = Math.min(1, sx, sy);

    scaler.style.transform = `scale(${s})`;
  }

  /**
   * Open the overlay fullscreen.
   */
  function open() {
    const overlay = $(overlayId);
    if (!overlay) return;

    moveOverlayToBody();

    overlay.style.display = 'block';
    overlay.setAttribute('aria-hidden', 'false');

    // Prevent background scrolling while overlay is open
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Fit after render; two frames is often more stable inside Reveal
    requestAnimationFrame(() => {
      requestAnimationFrame(() => fitTableNoOverflow());
    });
  }

  /**
   * Close the overlay and restore page scroll state.
   */
  function close() {
    const overlay = $(overlayId);
    if (!overlay) return;

    overlay.style.display = 'none';
    overlay.setAttribute('aria-hidden', 'true');

    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    restoreOverlayPosition();
  }

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Close when clicking the dark background (but not when clicking inside content)
  document.addEventListener('click', (e) => {
    const overlay = $(overlayId);
    if (!overlay || overlay.style.display === 'none') return;
    if (e.target === overlay) close();
  });

  // Re-fit on resize (window size, device rotation, Reveal scaling changes)
  window.addEventListener('resize', () => {
    const overlay = $(overlayId);
    if (overlay && overlay.style.display !== 'none') fitTableNoOverflow();
  });

  return { open, close, fit: fitTableNoOverflow };
})();
</script>


<!-- /position -->
<!-- position={row: 1, column: 2} -->
<svg viewBox="0 0 180 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:transparent;">
<polygon points="35,95 85,110 135,95 85,80" fill="none" stroke="#555" stroke-width="1"/>
<polygon points="35,50 85,65 135,50 85,35" fill="none" stroke="#555" stroke-width="1"/>
<line x1="35" y1="50" x2="35" y2="95" stroke="#555" stroke-width="1"/>
<line x1="85" y1="35" x2="85" y2="80" stroke="#555" stroke-width="1"/>
<line x1="135" y1="50" x2="135" y2="95" stroke="#555" stroke-width="1"/>
<line x1="85" y1="65" x2="85" y2="110" stroke="#555" stroke-width="1"/>
<text x="35" y="53" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="135" y="53" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="35" y="98" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="135" y="98" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="85" y="38" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="85" y="68" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="85" y="83" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<text x="85" y="113" font-size="10" fill="#e06c75" text-anchor="middle">×</text>
<circle cx="60" cy="43" r="4" fill="#C678DD"/><circle cx="110" cy="43" r="4" fill="#C678DD"/>
<circle cx="60" cy="102" r="4" fill="#C678DD"/><circle cx="110" cy="102" r="4" fill="#C678DD"/>
<circle cx="35" cy="72" r="4" fill="#C678DD"/><circle cx="135" cy="72" r="4" fill="#C678DD"/>
<circle cx="60" cy="57" r="4" fill="#C678DD"/><circle cx="110" cy="57" r="4" fill="#C678DD"/>
<circle cx="60" cy="87" r="4" fill="#C678DD"/><circle cx="110" cy="87" r="4" fill="#C678DD"/>
<circle cx="85" cy="50" r="4" fill="#C678DD"/><circle cx="85" cy="95" r="4" fill="#C678DD"/>
<circle cx="85" cy="72" r="5" fill="#98c379"/>
<text x="10" y="12" font-size="8" fill="#e06c75">× No corners</text>
<circle cx="85" cy="9" r="3" fill="#C678DD"/><text x="91" y="12" font-size="7" fill="#C678DD">Edge</text>
<circle cx="130" cy="9" r="3" fill="#98c379"/><text x="136" y="12" font-size="7" fill="#98c379">Center</text>
</svg>

-= No extreme corners → safe; still models curvature
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bbd-properties" -->
## BBD Properties
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Design Characteristics**

-! *Three levels* per factor (−1, 0, +1)
-! *No corners*, i.e., safer for sensitive processes
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Efficiency** (number of runs including 3x center points)

<div style="font-size:0.8em;">

| k | BBD |
|:-:|:---:|
| 3 | 15 |
| 4 | 27 |
| 5 | 46 |

</div>

-! *Not augmentable*, i.e.,  plan as standalone
-: i.e., cannot build up from factorial designs

-! *Requires k ≥ 3*, i.e., no 2-factor BBD
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bbd-example" -->
## Example: Coagulation–Flocculation Optimization
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Scenario**

-! Wastewater treatment with 3 factors:
-: Coagulant dose, Mixing speed, Settling time

***

-! **Safety issue:** Max dose + max speed + max time = risky
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**BBD Solution (k=3)**

-! 12 edge runs + 3 center = **15 runs** (no corners!)

***

-! **Results:** Intermediate mixing optimal; >90% removal

***

-= Optimum found safely without testing risky combinations

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bbd-example-analysis" -->
## Box–Behnken Example: Analysis Output

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

<div style="font-size: 0.38em; margin-top: 5px;">
<table id="bbd-design-table">
<thead>
<tr style="background: #2d3748;"><th>Run</th><th>A</th><th>B</th><th>C</th><th style="color:#61afef;">Y</th></tr>
</thead>
<tbody id="bbd-design-body"></tbody>
</table>
</div>

<div style="font-size: 0.55em; color: #888; margin-top: 8px;">
A = Dose (mg/L) &nbsp;|&nbsp; B = Mixing (rpm) &nbsp;|&nbsp; C = Time (min)<br>
Y = Turbidity Removal (%)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div style="font-size: 0.42em;">
<table id="bbd-coef-table">
<thead>
<tr style="background: #2d3748;"><th>Term</th><th>Coef.</th><th>SE</th><th>t-value</th><th>p-value</th><th>Sig.</th></tr>
</thead>
<tbody id="bbd-coef-body"></tbody>
</table>
</div>

<div style="font-size: 0.55em; color: #abb2bf; margin-top: 8px;">
<strong>Model:</strong> $y = \beta_0 + \beta_A A + \beta_B B + \beta_C C + \beta_{AA} A^2 + \beta_{BB} B^2 + \beta_{CC} C^2 + \beta_{AB} AB + ...$<br>
<span style="color:#98c379;">Quadratic terms</span> indicate curvature → optimum exists within range.
</div>

<!-- /position -->
<!-- /layout -->

<script>
(function() {
  // Box-Behnken Design for 3 factors (15 runs: 12 edge + 3 center)
  const bbdDesign = [
    { run: 1,  A:-1, B:-1, C: 0 },
    { run: 2,  A: 1, B:-1, C: 0 },
    { run: 3,  A:-1, B: 1, C: 0 },
    { run: 4,  A: 1, B: 1, C: 0 },
    { run: 5,  A:-1, B: 0, C:-1 },
    { run: 6,  A: 1, B: 0, C:-1 },
    { run: 7,  A:-1, B: 0, C: 1 },
    { run: 8,  A: 1, B: 0, C: 1 },
    { run: 9,  A: 0, B:-1, C:-1 },
    { run: 10, A: 0, B: 1, C:-1 },
    { run: 11, A: 0, B:-1, C: 1 },
    { run: 12, A: 0, B: 1, C: 1 },
    { run: 13, A: 0, B: 0, C: 0 },
    { run: 14, A: 0, B: 0, C: 0 },
    { run: 15, A: 0, B: 0, C: 0 }
  ];

  // True model: Y = 92 + 3A + 2B + 1C - 4A² - 3B² - 2C² + 1.5AB + 0.5AC - 0.3BC + noise
  // This creates a maximum around the center with significant curvature
  const trueCoefs = {
    intercept: 92,
    A: 3, B: 2, C: 1,
    AA: -4, BB: -3, CC: -2,
    AB: 1.5, AC: 0.5, BC: -0.3
  };

  // Seeded random for reproducibility
  function seededRandom(seed) {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }
  const rand = seededRandom(123);

  // Generate response values
  bbdDesign.forEach(row => {
    let y = trueCoefs.intercept
          + trueCoefs.A * row.A
          + trueCoefs.B * row.B
          + trueCoefs.C * row.C
          + trueCoefs.AA * row.A * row.A
          + trueCoefs.BB * row.B * row.B
          + trueCoefs.CC * row.C * row.C
          + trueCoefs.AB * row.A * row.B
          + trueCoefs.AC * row.A * row.C
          + trueCoefs.BC * row.B * row.C;
    // Add small noise (±1)
    y += (rand() - 0.5) * 2;
    row.Y = Math.round(y * 10) / 10;
  });

  // Build design matrix X for regression (intercept, A, B, C, A², B², C², AB, AC, BC)
  function buildDesignMatrix(data) {
    return data.map(row => [
      1, row.A, row.B, row.C,
      row.A * row.A, row.B * row.B, row.C * row.C,
      row.A * row.B, row.A * row.C, row.B * row.C
    ]);
  }

  // Matrix operations for least squares: β = (X'X)^(-1) X'y
  function transpose(M) {
    const rows = M.length, cols = M[0].length;
    const T = [];
    for (let j = 0; j < cols; j++) {
      T[j] = [];
      for (let i = 0; i < rows; i++) T[j][i] = M[i][j];
    }
    return T;
  }

  function matMul(A, B) {
    const rowsA = A.length, colsA = A[0].length, colsB = B[0].length;
    const C = [];
    for (let i = 0; i < rowsA; i++) {
      C[i] = [];
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) sum += A[i][k] * B[k][j];
        C[i][j] = sum;
      }
    }
    return C;
  }

  function matVecMul(M, v) {
    return M.map(row => row.reduce((s, val, i) => s + val * v[i], 0));
  }

  // Invert matrix using Gaussian elimination (for small matrices)
  function invert(M) {
    const n = M.length;
    const aug = M.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) if (Math.abs(aug[k][i]) > Math.abs(aug[maxRow][i])) maxRow = k;
      [aug[i], aug[maxRow]] = [aug[maxRow], aug[i]];
      const pivot = aug[i][i];
      for (let j = 0; j < 2 * n; j++) aug[i][j] /= pivot;
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = aug[k][i];
          for (let j = 0; j < 2 * n; j++) aug[k][j] -= factor * aug[i][j];
        }
      }
    }
    return aug.map(row => row.slice(n));
  }

  // Fit model
  const X = buildDesignMatrix(bbdDesign);
  const y = bbdDesign.map(r => r.Y);
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const XtXinv = invert(XtX);
  const Xty = matVecMul(Xt, y);
  const beta = matVecMul(XtXinv, Xty);

  // Calculate residuals and MSE
  const yHat = matVecMul(X, beta);
  const residuals = y.map((yi, i) => yi - yHat[i]);
  const SSE = residuals.reduce((s, r) => s + r * r, 0);
  const dfResid = bbdDesign.length - beta.length; // 15 - 10 = 5
  const MSE = SSE / dfResid;
  const SE_coefs = XtXinv.map((row, i) => Math.sqrt(MSE * row[i]));

  // t-values and p-values
  function pValueFromT(t, df) {
    const absT = Math.abs(t);
    // Approximation for small df
    if (df <= 5) {
      // Use simple approximation
      const x = df / (df + t * t);
      return Math.pow(x, df / 2);
    }
    // Normal approximation for larger df
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const xAbs = absT / Math.sqrt(2);
    const t1 = 1 / (1 + p * xAbs);
    const erf = 1 - (((((a5 * t1 + a4) * t1) + a3) * t1 + a2) * t1 + a1) * t1 * Math.exp(-xAbs * xAbs);
    return 2 * (1 - 0.5 * (1 + erf));
  }

  const tValues = beta.map((b, i) => b / SE_coefs[i]);
  const pValues = tValues.map(t => pValueFromT(t, dfResid));

  // Term labels
  const termLabels = ['Intercept', 'A (Dose)', 'B (Mixing)', 'C (Time)', 
                      'A²', 'B²', 'C²', 'A×B', 'A×C', 'B×C'];

  // Render design table
  function renderDesignTable() {
    const tbody = document.getElementById('bbd-design-body');
    if (!tbody) return;
    
    let html = '';
    bbdDesign.forEach(row => {
      html += '<tr>';
      html += `<td style="font-weight:bold;">${row.run}</td>`;
      ['A', 'B', 'C'].forEach(f => {
        const val = row[f];
        let color = '#abb2bf';
        let symbol = '0';
        if (val === 1) { color = '#98c379'; symbol = '+1'; }
        else if (val === -1) { color = '#e06c75'; symbol = '−1'; }
        html += `<td style="color:${color};">${symbol}</td>`;
      });
      html += `<td style="color:#61afef; font-weight:bold;">${row.Y.toFixed(1)}</td>`;
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // Render coefficients table
  function renderCoefTable() {
    const tbody = document.getElementById('bbd-coef-body');
    if (!tbody) return;
    
    let html = '';
    termLabels.forEach((label, i) => {
      const coef = beta[i];
      const se = SE_coefs[i];
      const tVal = tValues[i];
      const pVal = pValues[i];
      const isIntercept = i === 0;
      const isQuadratic = i >= 4 && i <= 6;
      const sig = !isIntercept && pVal < 0.05;
      
      const rowStyle = sig ? 'background: rgba(152, 195, 121, 0.15);' : '';
      const labelStyle = isQuadratic ? 'color:#c678dd;' : (isIntercept ? 'color:#888;' : '');
      const coefColor = sig ? '#98c379' : '#abb2bf';
      const sigSymbol = sig ? '✓' : '';
      const sigColor = sig ? '#98c379' : '#6a7280';
      
      html += `<tr style="${rowStyle}">`;
      html += `<td style="${labelStyle}">${label}</td>`;
      html += `<td style="color:${coefColor}; font-weight:${sig ? 'bold' : 'normal'};">${coef.toFixed(2)}</td>`;
      html += `<td>${se.toFixed(2)}</td>`;
      html += `<td>${tVal.toFixed(2)}</td>`;
      html += `<td style="color:${isIntercept ? '#888' : (pVal < 0.05 ? '#98c379' : '#abb2bf')};">${pVal.toFixed(3)}</td>`;
      html += `<td style="color:${sigColor}; font-weight:bold;">${sigSymbol}</td>`;
      html += '</tr>';
    });
    tbody.innerHTML = html;
  }

  // Initialize
  function init() {
    renderDesignTable();
    renderCoefTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', (event) => {
      if (event.currentSlide && event.currentSlide.id === 'bbd-example-analysis') {
        setTimeout(init, 50);
      }
    });
  }
})();
</script>

---

<!-- .slide:id="center-points-importance" -->
## Don't Skimp on Center Points
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Why Center Points Matter**

-! **Error estimation:** Replicate runs estimate pure error; without them, you can't separate noise from signal
-! **Model checking:** Compare center average to prediction; large discrepancy signals inadequacy
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Practical Recommendations**

-! **BBDs:** 3–4 center points (built into standard tables)
-! **Cost is small:** A few extra runs provide huge validation benefit

-= Center points are cheap insurance against model failure
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="design-strategy" -->
## The Experimental Strategy: A 4-Phase Approach

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

-! Phase 1: **Screening**
-: Many factors, limited resources.
-: Use fractional factorial or Plackett–Burman.
-: Goal: identify which factors matter.

***

-! Phase 2: **Factor Reduction**
-: Confirm important factors with higher resolution design.
-: Add center points to check for curvature.
-: Narrow down to 2–4 key factors.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! Phase 3: **Optimization**
-: Use CCD or BBD on the key factors.
-: Fit quadratic model, locate the optimum.
-: Understand the shape of the response surface.

***

-! Phase 4: **Verification**
-: Run confirmation experiments at predicted optimum.
-: Validate that the model predictions are accurate.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="summary-designs" -->
## Summary: Design Selection Guide
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Screening Designs**

-! **Fractional Factorial:**
-: Best for 5–8 factors.
-: Choose resolution based on interaction assumptions.
-: Can be augmented later.

***

-! **Plackett–Burman:**
-: Best for 8+ factors.
-: Maximum efficiency for main effects.
-: Use only for initial screening.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Optimization Designs**

-! **Box–Behnken Design:**
-: Best when extremes are risky.
-: More efficient for 3–4 factors.
-: Cannot augment from factorial.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="case-scenarios" -->
## Group Discussion: Case Scenario

**Scenario:**  
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
You are conducting contract research on membrane fouling. A preliminary assessment suggests that 15 potential factors may influence fouling behaviour. Your task is to identify and quantify the most important 3–5 key factors, including possible interaction and quadratic effects, in order to optimize the process.
<!-- /position -->
<!-- /layout -->

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

**Objective:**  
- Develop an experimental strategy  
- Provide a transparent and justifiable cost estimate for the client

<!-- /position -->
<!-- position={row: 1, column: 2} -->

**Experimental Constraints**
- One experiment (including buffer time): *1 hour*
- Personnel cost: *40 € per hour*
- Consumables: *10 € per experiment*
- Overhead: *50% surcharge*
- All costs must be stated *net*

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
