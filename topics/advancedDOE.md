---
title: "Advanced Experimental Design"
author: "Chemometrics – Master of Water Science"
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

***

-? How many experiments would a **full factorial design** require?

***

-! Each added factor **doubles** the number of runs.

<!-- /position -->
<!-- position={row: 1, column: 2} -->
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
<!-- /position -->
<!-- /layout -->
<div id="run-calculator" style="background: #1a2340; padding: 15px; border-radius: 8px; margin-top: 20px;">
  <div style="display: flex; align-items: center; gap: 15px;">
    <label style="color: #9efcff; font-weight: bold;">Factors (k):</label>
    <input type="range" id="factor-slider" min="2" max="12" value="4" style="flex: 1;">
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
-! *Redundancy* : most interactions are negligible

-= We need designs that give **most information** with **less effort**.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="why-alternatives" -->
## Why We Need Smarter Designs

-! **Key insight:** In most real systems, only a few factors truly matter.
-: Many interactions are negligible.
-: Testing every combination wastes resources on unimportant effects.

***

-! **The solution:** Sacrifice completeness for efficiency.
-: Intentionally omit or add certain runs
-: Balance information gained versus effort spent

***

-! *Three design families* address these weaknesses:
-: *Fractional Factorials* : run only a fraction of combinations.
-: *Plackett–Burman* : highly efficient screening for many factors.
-: *Response Surface Designs* : model curvature for optimization.

---

<!-- .slide:id="fractional-intro-problem" -->
## Fractional Factorial: The Core Idea
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Problem**

-! **4 factors** in water treatment: full factorial = 16 runs
-! Resources allow only **8 runs**

-? Can you still learn about all four factors?

-! **Yes** — accept a trade-off: run half, lose some info
-! **Notation:** $2^{k-p}$ uses $\frac{1}{2^p}$ fraction
-: $2^{4-1}$ = half of $2^4$ = **8 runs**
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**The Idea: Strategic Selection**

-! Fractional factorial **carefully selects** combinations preserving key info
-! Choose the **most informative subset**:
-: Main effects still estimable
-: Some interactions become entangled

-= 8 runs instead of 16 — but something must be sacrificed.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="aliasing-concept" -->
## What Do We Sacrifice? — Aliasing

-! **Key concept:** When we use fewer runs, some effects become **inseparable**.
-: We cannot distinguish them from our data.
-: This phenomenon is called **aliasing**.

***

-! **Metaphor:** Effects "travel together" like passengers sharing a car.
-: If you only see the car arrive, you cannot tell who was driving.
-: The effects are **confounded** — combined in a single estimate.

***

-? What gets aliased depends on **which fraction** we choose.
-: The choice of runs determines which effects we can distinguish.
-: Smart designs minimize aliasing of the effects we care about most.

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
**Key Insight**

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
## Aliasing – Detailed Structure

**How half-fractions work:**

-! Full $2^3$ needs 8 runs; half-fraction uses only 4
-! Define generator $C = A \times B$; only run combinations where C equals A×B product
-! **Consequence:** C's main effect aliased with A×B — cannot separate from data alone
-! **Practical rule:** If 2-factor interactions negligible, main effect estimates remain valid

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

**$2^{3-1}$ Design Matrix**

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
**Geometric View**

<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" style="max-width:450px;background:transparent;">
<polygon points="40,105 100,125 160,105 100,85" fill="none" stroke="#555" stroke-width="1"/>
<polygon points="40,55 100,75 160,55 100,35" fill="none" stroke="#555" stroke-width="1"/>
<line x1="40" y1="55" x2="40" y2="105" stroke="#555" stroke-width="1"/>
<line x1="100" y1="35" x2="100" y2="85" stroke="#555" stroke-width="1"/>
<line x1="160" y1="55" x2="160" y2="105" stroke="#555" stroke-width="1"/>
<line x1="100" y1="75" x2="100" y2="125" stroke="#555" stroke-width="1"/>
<circle cx="40" cy="55" r="7" fill="#98c379"/>
<circle cx="160" cy="55" r="7" fill="#98c379"/>
<circle cx="100" cy="125" r="7" fill="#98c379"/>
<circle cx="100" cy="35" r="7" fill="#98c379"/>
<circle cx="40" cy="105" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<circle cx="160" cy="105" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<circle cx="100" cy="75" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<circle cx="100" cy="85" r="5" fill="none" stroke="#e06c75" stroke-width="2" stroke-dasharray="3,2"/>
<text x="25" y="60" font-size="10" fill="#abb2bf">A</text>
<text x="168" y="60" font-size="10" fill="#abb2bf">B</text>
<text x="100" y="143" font-size="10" fill="#abb2bf" text-anchor="middle">C</text>
</svg>

<span style="color:#98c379;">●</span> Selected (4) &nbsp; <span style="color:#e06c75;">◌</span> Omitted (4)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="resolution-intro" -->
## Design Resolution: How Much Confounding?

-! **Design quality varies:** Not all fractional designs have the same aliasing severity.
-: Some keep main effects clean; others mix them with interactions.
-: **Resolution** quantifies this confounding severity.

***

-! **Formal definition:** Resolution = length of the shortest word in the defining relation.
-: Higher resolution → less severe confounding

***

-! **Resolution III:** Main effects aliased with 2-factor interactions.
-: Risky if 2-factor interactions exist.
-: Suitable only for rough initial screening.

-! **Resolution IV:** Main effects aliased with 3-factor interactions.
-: Safer — main effects unbiased by 2-factor interactions.

-! **Resolution V:** Main effects and 2-factor interactions estimable cleanly.
-: Requires more runs, but provides reliable estimates of both.

***

-= Higher resolution means less confounding — but costs more runs.

---

<!-- .slide:id="resolution-table" -->
## Resolution Summary

| Resolution | Main Effects Aliased With | 2FI Aliased With | Use Case |
|:----------:|:------------------------:|:----------------:|:---------|
| **III** | 2-factor interactions | Each other | Rough screening |
| **IV** | 3-factor interactions | Each other | Standard screening |
| **V** | 4-factor interactions | 3-factor interactions | Interaction study |

***

-! **Notation convention:** Resolution is written as Roman numerals.
-: Example: $2^{5-2}_{III}$ = 5 factors, quarter-fraction, Resolution III

***

-! **Design decision:** For screening, Resolution IV is usually the minimum acceptable.

---

<!-- .slide:id="fractional-example" -->
## Example: Water Treatment Screening
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Scenario**

-! 4 factors: pH, dose, mixing, settling
-! Full = 16 runs → Half = **8 runs**
-! **Resolution IV:** $2^{4-1}_{IV}$, $I = ABCD$

| Effect | Aliased With |
|:------:|:------------:|
| A | BCD |
| AB | CD |
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Why It Works**

-! 3-factor interactions negligible → main effects OK
-! 50% savings; can augment later
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fractional-when" -->
## When to Use Fractional Factorials

-! **Design decision:**
-: 2–4 factors: Full factorial is usually feasible.
-: 5+ factors: Consider a fractional design.

***

-! **Benefits:**
-: Dramatic reduction in runs.
-: Quick identification of important factors.
-: Can augment with more detailed experiments later.

***

-! **Costs:**
-: Cannot estimate all interactions.
-: Must assume some effects are negligible.
-: Risk of aliased effects misleading conclusions.

-= Fractional factorials are ideal for **screening** — finding which factors matter before investing in detailed study.

---

<!-- .slide:id="pb-intro-problem" -->
## Beyond Powers of Two: The Gap Problem

-! Fractional factorials have run counts in powers of two: 4, 8, 16, 32...
-: What if these sizes don't fit your situation?

***

-! **Example problem:**
-: You have **11 factors** to screen.
-: 8 runs is too few — you can only fit 7 factors.
-: 16 runs seems wasteful — you only need to screen, not characterize.

***

-? Is there a design with **12 runs** for 11 factors?

-! **Yes** — this is exactly what **Plackett–Burman designs** provide.
-: Run counts in multiples of 4: 12, 20, 24, 28...
-: They fill the gaps between powers of two.

---

<!-- .slide:id="pb-design" -->
## Plackett–Burman Designs
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Flexible Run Counts**

-! Runs in **multiples of 4:** 12, 20, 24, 28...
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

-! PB designs are **orthogonal**:
-: Each factor is at high and low levels equally often.
-: Any two columns are uncorrelated.

***

-! This guarantees:
-: Main effects can be estimated independently of each other.
-: No main effect "masks" another main effect.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Resolution III — Main Effects Only**

-! PB designs are **Resolution III**:
-: Main effects are confounded with 2-factor interactions.
-: Interactions are completely intertwined — cannot be separated.

***

-! **Core assumption:**
-: Interactions are negligible.
-: We only care about identifying which factors have any effect.

-= PB designs answer: "Which factors matter?" — not "How do they interact?"
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-example" -->
## Example: Screening 10 Water Quality Variables
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Scenario**

-! Studying **pollutant removal** with 10 potential variables:
-: pH, temperature, coagulant type/dose, mixing rate
-: Settling time, turbidity, catalyst, aeration, polymer
-! Resources allow only **12 experiments**
-: Full factorial = 1024 runs; fractional = 16+ runs
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**The PB Solution**

-! Use a **12-run Plackett–Burman** design
-: Assign 10 factors to 10 columns
-: Leave one column as dummy for error
-! **Typical outcome:** pH and dose show large effects; others negligible

-= Narrowed 10 candidates to 2–3 key factors in just 12 runs
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pb-limitations" -->
## PB Limitations and Strategy

-! **What PB designs cannot do:**
-: Detect or estimate interactions.
-: Detect curvature in the response.
-: Provide internal replication for error estimation.

***

-! **Strategic role:** Use PB as **Phase 1 only**.
-: Screen many factors to find the vital few.
-: Then switch to a more detailed design for those factors.

***

-! **Example workflow:**
-: PB screening identifies pH, dose, and mixing speed as important.
-: Follow up with a factorial or response surface design on those 3 factors.

-= PB designs are the **wide net** — other designs provide the **fine detail**.

---

<!-- .slide:id="screening-vs-optimization" -->
## Screening vs. Optimization: Two Different Goals
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Screening**

-! **Question:** Which factors have any effect?

***

-! **Characteristics:**
-: Many factors, few runs
-: Focus on main effects
-: Accept aliasing and confounding
-: Goal is to **eliminate** unimportant factors

***

-! **Designs:** Fractional factorials, Plackett–Burman
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Optimization**

-! **Question:** What are the best settings?

***

-! **Characteristics:**
-: Few factors (already screened)
-: Need to find the optimum, not just direction
-: Must detect curvature in the response
-: Goal is to **locate** the best operating conditions

***

-! **Designs:** Response Surface Methods (CCD, BBD)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="curvature-problem" -->
## The Curvature Problem

-! **Key limitation:** Two-level designs only reveal direction, not shape.
-: "Higher pH is better" or "Lower pH is better."
-: But what if the optimum is **in between**?

***

-! **Water science example:**
-: Many treatment processes have an optimal pH.
-: Too low or too high pH both reduce efficiency.
-: The response is curved — it doesn't just go up or down.

***

-? A 2-level factorial would only test extreme pH values.
-: It might say "high pH is better than low pH."
-: But miss the fact that **medium pH is best**.

-= To find optima inside the factor range, we need more than two levels.

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
  <circle cx="250" cy="30" r="8" fill="#98c379"/>
  <!-- Legend -->
  <line x1="320" y1="25" x2="350" y2="25" stroke="#61AFEF" stroke-width="3"/>
  <text x="355" y="29" font-size="11" fill="#61AFEF">True response</text>
  <line x1="320" y1="45" x2="350" y2="45" stroke="#e06c75" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="355" y="49" font-size="11" fill="#e06c75">2-level view</text>
  <!-- Annotation -->
  <text x="250" y="55" font-size="11" fill="#98c379" text-anchor="middle">← Optimum missed!</text>
</svg>

---

<!-- .slide:id="curvature-detection" -->
## Detecting Curvature: Center Points
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Simple Test**

-! Add runs at the **center** (all factors at midpoint)
-! Typically 3–5 replicate center runs
-! **Compare:** corner average vs. center average
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Interpreting the Result**

-! **Center = corners:** linear response, 2-level OK
-! **Center ≠ corners:** curvature exists → use RSM
-! **Test:** $(\bar{y}_{center} - \bar{y}_{factorial})$ significant?

-= Center points are your early warning for curvature.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="rsm-intro" -->
## Response Surface Methodology

-! **Goal:** Model the response as a curved surface, then find the optimum.
-: Fit a quadratic model with squared terms.
-: Capture peaks, valleys, and ridges in the response.

***

-! **Why "response surface"?**
-: With 2 factors, the response can be visualized as a 3D surface.
-: The optimum is the highest (or lowest) point on that surface.

***

-! **The quadratic model:**

$$y = \beta_0 + \sum \beta_i x_i + \sum \beta_{ii} x_i^2 + \sum \beta_{ij} x_i x_j$$

-: Linear terms ($\beta_i$): main effects
-: Squared terms ($\beta_{ii}$): curvature
-: Cross terms ($\beta_{ij}$): interactions

***

-! **Two main RSM designs:**
-: **Central Composite Design (CCD)** — builds on a factorial base.
-: **Box–Behnken Design (BBD)** — avoids extreme combinations.

---

<!-- .slide:id="ccd-structure" -->
## Central Composite Design (CCD)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Three Components**

-! **Factorial:** $2^k$ corner runs (main effects + interactions)
-! **Axial:** $2k$ star points along axes (curvature)
-! **Center:** $n_c$ replicates at midpoint (error + lack-of-fit)

-! **Total:** $2^k + 2k + n_c$ runs
-: k=3 → 8+6+6 = 20 runs

<button onclick="document.getElementById('modal-ccd-detail').style.display='flex'" style="margin-top:6px;padding:4px 10px;font-size:0.8em;cursor:pointer;background:#61AFEF;color:#1a2340;border:none;border-radius:4px;">Why this structure?</button>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Geometry**

<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style="width:100%;background:transparent;">
<polygon points="40,100 90,115 140,100 90,85" fill="none" stroke="#555" stroke-width="1"/>
<polygon points="40,55 90,70 140,55 90,40" fill="none" stroke="#555" stroke-width="1"/>
<line x1="40" y1="55" x2="40" y2="100" stroke="#555" stroke-width="1"/>
<line x1="90" y1="40" x2="90" y2="85" stroke="#555" stroke-width="1"/>
<line x1="140" y1="55" x2="140" y2="100" stroke="#555" stroke-width="1"/>
<line x1="90" y1="70" x2="90" y2="115" stroke="#555" stroke-width="1"/>
<circle cx="40" cy="55" r="5" fill="#61AFEF"/><circle cx="140" cy="55" r="5" fill="#61AFEF"/>
<circle cx="40" cy="100" r="5" fill="#61AFEF"/><circle cx="140" cy="100" r="5" fill="#61AFEF"/>
<circle cx="90" cy="40" r="5" fill="#61AFEF"/><circle cx="90" cy="85" r="5" fill="#61AFEF"/>
<circle cx="90" cy="70" r="5" fill="#61AFEF"/><circle cx="90" cy="115" r="5" fill="#61AFEF"/>
<circle cx="15" cy="77" r="5" fill="#C678DD"/><circle cx="165" cy="77" r="5" fill="#C678DD"/>
<circle cx="90" cy="20" r="5" fill="#C678DD"/><circle cx="90" cy="135" r="5" fill="#C678DD"/>
<circle cx="90" cy="77" r="6" fill="#98c379"/>
<line x1="15" y1="77" x2="165" y2="77" stroke="#C678DD" stroke-width="1" stroke-dasharray="3,2"/>
<line x1="90" y1="20" x2="90" y2="135" stroke="#C678DD" stroke-width="1" stroke-dasharray="3,2"/>
<circle cx="12" cy="8" r="3" fill="#61AFEF"/><text x="18" y="11" font-size="7" fill="#61AFEF">Factorial</text>
<circle cx="70" cy="8" r="3" fill="#C678DD"/><text x="76" y="11" font-size="7" fill="#C678DD">Axial</text>
<circle cx="115" cy="8" r="3" fill="#98c379"/><text x="121" y="11" font-size="7" fill="#98c379">Center</text>
</svg>

-= Cube corners + axis spikes + center → full quadratic model
<!-- /position -->
<!-- /layout -->

<div id="modal-ccd-detail" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);justify-content:center;align-items:center;z-index:9999;" onclick="this.style.display='none'">
<div style="background:#1e2a4a;padding:20px;border-radius:10px;max-width:500px;" onclick="event.stopPropagation()">
<div style="color:#9efcff;font-weight:bold;font-size:1.1em;margin-bottom:10px;">Why This CCD Structure?</div>
<div style="color:#abb2bf;font-size:0.95em;line-height:1.5;">
<p><strong>Factorial points (corners):</strong> Capture main effects and all two-factor interactions, just like a standard 2-level factorial.</p>
<p><strong>Axial points (star):</strong> Extend along each axis beyond the cube. These provide the additional information needed to estimate squared (quadratic) terms for curvature.</p>
<p><strong>Center points:</strong> Replicated runs at the design center allow estimation of pure experimental error and testing whether the quadratic model fits adequately (lack-of-fit test).</p>
<p><strong>Together:</strong> The combination of all three point types provides enough data to fit a complete second-order polynomial model.</p>
</div>
<button onclick="document.getElementById('modal-ccd-detail').style.display='none'" style="margin-top:12px;padding:6px 18px;cursor:pointer;background:#e06c75;color:white;border:none;border-radius:4px;">Close</button>
</div>
</div>

---

<!-- .slide:id="ccd-axial" -->
## Axial Points and Rotatability
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Axial Distance**

-! Axial points at distance $\alpha$ from center
-! **Rotatability:** $\alpha = (2^k)^{1/4}$

| k | α |
|:-:|:---:|
| 2 | 1.414 |
| 3 | 1.682 |
| 4 | 2.000 |

-! Larger α → wider region but may exceed limits
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Rotatability**

-! Equal prediction quality in all directions
-! Variance depends only on distance from center
-! **Why it matters:** optimum could be anywhere

-= Ensures no directional bias in predictions.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ccd-variants" -->
## CCD Variants

| Variant | $\alpha$ | Levels | Rotatability | Factor Range |
|:--------|:--------:|:------:|:------------:|:-------------|
| **Circumscribed** | $> 1$ | 5 | Yes | Exceeds original |
| **Face-Centered** | $= 1$ | 3 | No | Within original |
| **Inscribed** | $< 1$ | 5 | Yes | Smaller than original |

***

-! **Circumscribed:** Best prediction quality, but axial points may be impractical.

-! **Face-Centered:** All runs within bounds, but loses rotatability.

-! **Inscribed:** Stays safe, but explores smaller region.

-= **Key takeaway:** Choose the variant based on practical constraints, not just statistical elegance.

---

<!-- .slide:id="ccd-advantages" -->
## CCD: Advantages

-! **Sequential augmentation**
-: Already completed a factorial? Just add axial and center points.
-: Your existing data becomes part of the CCD.
-: No experiments wasted.

***

-! **High-quality predictions**
-: Rotatable CCDs give uniform prediction variance.
-: Good for mapping the entire response surface.

***

-! **Lack-of-fit testing**
-: Center point replicates allow testing model adequacy.
-: Verify whether the quadratic model is sufficient.

-= CCD is flexible, efficient, and builds naturally on prior factorial work.

---

<!-- .slide:id="ccd-example" -->
## Example: Optimizing Pollutant Degradation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Scenario**

-! Two factors remain: **pH**, **catalyst dose**
-! Curvature detected → need quadratic model
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**CCD Solution**

-! 4 factorial + 4 axial + 5 center = **13 runs**
-! **Result:** Optimal pH ≈ 6.5 (missed by 2-level)

-? See next slide for full matrix
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ccd-example-details" -->
## CCD Example – Design Matrix (k=2)

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Factorial + Axial**

| Run | x₁ | x₂ |
|:---:|:---:|:---:|
| 1–4 | ±1 | ±1 |
| 5–6 | ±1.414 | 0 |
| 7–8 | 0 | ±1.414 |
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Center Points**

| Run | x₁ | x₂ |
|:---:|:---:|:---:|
| 9–13 | 0 | 0 |

-! 4 factorial + 4 axial + 5 center = **13 runs**
-! α = 1.414 (rotatable)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bbd-intro-problem" -->
## Box–Behnken: Avoiding Extreme Combinations

-! **CCD has a potential problem:**
-: Factorial points test all factors at extremes simultaneously.
-: The combination of highest temperature, highest dose, and highest pH might be unsafe.
-: Equipment failure, side reactions, or wasted materials.

***

-? What if we could model curvature **without testing extreme corners**?

***

-! **Box–Behnken designs** solve this problem:
-: Never test all factors at their extremes together.
-: Every run has at least one factor at its center level.

-= BBD lets you optimize while staying within safe operating bounds.

---

<!-- .slide:id="bbd-structure" -->
## Box–Behnken Design Structure
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Edge Midpoints, Not Corners**

-! Points at **edge midpoints** (2 factors at extremes, 1 at center)
-! Rotate through all factor pairs + **center points**
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

-! **Three levels** per factor (−1, 0, +1)
-! **No corners** — safer for sensitive processes
-! **Nearly rotatable** — uniform prediction variance
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Efficiency**

| k | BBD | CCD |
|:-:|:---:|:---:|
| 3 | 15 | 20 |
| 4 | 27 | 30 |
| 5 | 46 | 52 |

-! **Not augmentable** — plan as standalone
-! **Requires k ≥ 3** — no 2-factor BBD
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
-! **Safety:** Max dose + max speed + max time = risky
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**BBD Solution (k=3)**

-! 12 edge runs + 3 center = **15 runs** (no corners!)
-! **Results:** Intermediate mixing optimal; >90% removal
-= Optimum found safely — no risky combinations tested

-? See next slide for full design matrix
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bbd-example-details" -->
## BBD Example – Design Matrix (k=3)

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
| Run | x₁ | x₂ | x₃ |
|:---:|:--:|:--:|:--:|
| 1–2 | ±1 | −1 | 0 |
| 3–4 | ±1 | +1 | 0 |
| 5–6 | ±1 | 0 | −1 |
| 7–8 | ±1 | 0 | +1 |
<!-- /position -->
<!-- position={row: 1, column: 2} -->
| Run | x₁ | x₂ | x₃ |
|:---:|:--:|:--:|:--:|
| 9–10 | 0 | ±1 | −1 |
| 11–12 | 0 | ±1 | +1 |
| 13–15 | 0 | 0 | 0 |

-= 12 edge + 3 center = **15 runs**
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ccd-vs-bbd" -->
## CCD vs. Box–Behnken: Choosing the Right Design

| Criterion | CCD | BBD |
|:----------|:---:|:---:|
| Augments factorial | ✓ | ✗ |
| Avoids corners | ✗ | ✓ |
| Rotatable | ✓ | Nearly |
| Levels per factor | 5 (or 3) | 3 |
| Fewer runs (3–4 factors) | ✗ | ✓ |
| Min. factors | 2 | 3 |

***

-! **Choose CCD:** Prior factorial exists, extremes are safe, need wide exploration.

-! **Choose BBD:** Starting fresh, extremes risky, 3–4 factors, efficiency matters.

-= **Key takeaway:** The design choice depends on practical constraints, not just statistical properties.

<div id="design-selector" style="background: #1a2340; padding: 15px; border-radius: 8px; margin-top: 15px;">
  <div style="font-weight: bold; color: #9efcff; margin-bottom: 10px;">Quick Design Selector</div>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
      <input type="checkbox" id="chk-prior-factorial" style="cursor: pointer;">
      <span style="color: #abb2bf; font-size: 0.9em;">Have prior factorial data?</span>
    </label>
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
      <input type="checkbox" id="chk-extremes-safe" style="cursor: pointer;">
      <span style="color: #abb2bf; font-size: 0.9em;">Extreme combinations safe?</span>
    </label>
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
      <input type="checkbox" id="chk-two-factors" style="cursor: pointer;">
      <span style="color: #abb2bf; font-size: 0.9em;">Only 2 factors?</span>
    </label>
  </div>
  <div id="design-recommendation" style="margin-top: 12px; padding: 10px; border-radius: 6px; background: #2d3a66; text-align: center;">
    <span style="color: #e5c07b; font-weight: bold;">Answer the questions above</span>
  </div>
</div>

<script>
(function() {
  const initDesignSelector = () => {
    const chkPrior = document.getElementById('chk-prior-factorial');
    const chkSafe = document.getElementById('chk-extremes-safe');
    const chkTwo = document.getElementById('chk-two-factors');
    const result = document.getElementById('design-recommendation');
    if (!chkPrior || !chkSafe || !chkTwo || !result) return;
    
    const updateRecommendation = () => {
      const hasPrior = chkPrior.checked;
      const isSafe = chkSafe.checked;
      const onlyTwo = chkTwo.checked;
      
      let design = '';
      let color = '#e5c07b';
      
      if (onlyTwo) {
        design = '→ CCD (BBD requires ≥3 factors)';
        color = '#61AFEF';
      } else if (hasPrior && isSafe) {
        design = '→ CCD (augment your factorial)';
        color = '#61AFEF';
      } else if (!isSafe) {
        design = '→ Box–Behnken (avoids corners)';
        color = '#C678DD';
      } else if (!hasPrior) {
        design = '→ Either works; BBD if efficiency matters';
        color = '#98c379';
      } else {
        design = '→ CCD recommended';
        color = '#61AFEF';
      }
      
      result.innerHTML = '<span style="color: ' + color + '; font-weight: bold;">' + design + '</span>';
    };
    
    chkPrior.addEventListener('change', updateRecommendation);
    chkSafe.addEventListener('change', updateRecommendation);
    chkTwo.addEventListener('change', updateRecommendation);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDesignSelector);
  } else {
    initDesignSelector();
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

-! **CCDs:** 5–6 center points (statistical power, stable variance)
-! **BBDs:** 3–4 center points (built into standard tables)
-! **Cost is small:** A few extra runs provide huge validation benefit

-= Center points are cheap insurance against model failure
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="design-strategy" -->
## The Experimental Strategy: A 4-Phase Approach

-! **Phase 1: Screening**
-: Many factors, limited resources.
-: Use fractional factorial or Plackett–Burman.
-: Goal: identify which factors matter.

***

-! **Phase 2: Factor Reduction**
-: Confirm important factors with higher resolution design.
-: Add center points to check for curvature.
-: Narrow down to 2–4 key factors.

***

-! **Phase 3: Optimization**
-: Use CCD or BBD on the key factors.
-: Fit quadratic model, locate the optimum.
-: Understand the shape of the response surface.

***

-! **Phase 4: Verification**
-: Run confirmation experiments at predicted optimum.
-: Validate that the model predictions are accurate.

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

-! **Central Composite Design:**
-: Best when augmenting prior factorials.
-: Good when extremes are safe.
-: Achieves true rotatability.

***

-! **Box–Behnken Design:**
-: Best when extremes are risky.
-: More efficient for 3–4 factors.
-: Cannot augment from factorial.

-= Match the design to your experimental phase and practical constraints.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="summary-concepts" -->
## Key Concepts to Remember

| Concept | Definition | Why It Matters |
|:--------|:-----------|:---------------|
| **Aliasing** | Effects sharing the same estimate | Limits what we can learn |
| **Resolution** | Severity of confounding (III, IV, V) | Determines reliability |
| **Curvature** | Non-linear response ($x^2$ terms) | Needed to find optima |
| **Center Points** | Runs at midpoint of all factors | Error and model checking |
| **Rotatability** | Uniform prediction variance | Unbiased optimization |

***

-! **Key formulas:**
-: Fractional factorial: $2^{k-p}$ runs for $k$ factors.
-: CCD: $2^k + 2k + n_c$ runs.
-: PB efficiency: $N$ runs for $N-1$ factors.

---

<!-- .slide:id="case-scenarios" -->
## Group Discussion: Which Design Would You Choose?

-! **Scenario A:** You have 12 potential factors affecting membrane fouling. Budget allows 16 experiments.

***

-! **Scenario B:** Screening identified 3 key factors. The combination of maximum temperature, pressure, and flow rate could damage the equipment.

***

-! **Scenario C:** You completed a 2-level factorial on 4 factors. Results suggest curvature, and you want to find the optimum.

***

-! **Scenario D:** You need to optimize a process with 2 factors. All factor combinations are safe to test.

***

-? For each scenario, identify the most appropriate design type and explain your reasoning.

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
