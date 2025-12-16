---
title: "Full Factorial Design"
author: "Gerrit Renner"
keywords: ["experimental design", "factorial design", "DoE", "factors", "levels", "interactions", "main effects", "optimization"]
requirements: ["Variance", "Linear Regression"]
description: "Systematic optimization of experiments using full factorial design with water science applications"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Variance
- Linear Regression

---

<!-- .slide:id="anchor-problem" -->
## Initial Problem: Optimizing Microplastic Removal
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*A Real Water Treatment Problem*

-! **Microplastics** are an emerging pollutant in water bodies worldwide.

-: Particles < 5 mm from degraded plastic waste
-: Found in drinking water sources
-: Potential health risks still being studied

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Treatment Method: Coagulation/Flocculation</b><br>
Adding chemicals (coagulants) that cause microplastics to aggregate and settle out.
</div>

***

-! Your task: *Maximize removal efficiency!*

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*The Complexity*

-! Multiple factors influence removal efficiency:

<div style="font-size: 0.7em;">

| Factor | Possible Range |
|:-------|:---------------|
| Coagulant dose | 10 – 50 mg/L |
| pH value | 5 – 9 |
| Stirring speed | 50 – 200 rpm |
| Contact time | 5 – 30 min |

</div>

***

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>The Question:</b><br>
<i>"How can we efficiently find the best conditions when several factors influence the outcome?"</i>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ofat-approach" -->
## The Conventional Approach: One-Factor-At-a-Time (OFAT)
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*How OFAT Works*

-! The intuitive approach most researchers start with:

1. **Fix** all factors at some starting value
2. **Vary** one factor to find its optimum
3. **Lock** that factor at its best value
4. **Move** to the next factor
5. **Repeat** until all factors are "optimized"

***

-! Applied to our microplastic problem:

-: Start: pH=7, Dose=30 mg/L, Speed=100 rpm
-: Vary pH (5→9), find best pH=6
-: Keep pH=6, vary Dose (10→50), find best=40 mg/L
-: Keep both, vary Speed... etc.

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*OFAT Seems Efficient...*

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Apparent Advantage:</b><br>
• 3 factors × 5 levels each<br>
• Only 3 × 5 = <b>15 experiments</b><br>
• Seems manageable!
</div>

***

-! But OFAT makes a *dangerous assumption*:

<div style="background: #8B0000; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>⚠️ Hidden Assumption:</b><br>
Factors act <b>independently</b>! 
The optimal pH is the same regardless of coagulant dose.
</div>

***

-? What if optimal pH depends on dose?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ofat-weaknesses" -->
## Why OFAT Fails: Two Critical Weaknesses
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Weakness 1: Misses Interactions*

-! *Interaction*: The effect of one factor depends on the level of another.

***

-! In our microplastic example:

-: At pH 6: Higher dose → better removal
-: At pH 8: Higher dose → *worse* removal

***

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Result:</b><br>
OFAT finds a <b>local optimum</b>, not the true best conditions!
</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Weakness 2: Wastes Resources*

-! OFAT explores only *one path* through the factor space.

***

-< We need a smarter approach that can *detect interactions* and *use experiments efficiently*.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ofat-3d-visualization" -->
## OFAT in the Design Space: A Visual Demonstration

<div id="chart-ofat-vs-global-3d" style="width: 100%; height: 620px; margin: 0 auto;"></div>

<script src="resources/js/charts/ofat_vs_global_3d.js"></script>

***

-! The surface shows a response with **interaction** and **curvature** — OFAT finds a **local**, not the **global maximum**!

---

<!-- .slide:id="design-space" -->
## The Experimental Design Space
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*What is the Design Space?*

-! The *experimental design space* is the multidimensional region defined by all factors and their ranges.
-: Each axis = one factor (e.g., pH, Dose, Speed)
-: Each dimension adds complexity
-: Response surface lives "above" the factor space

***

-! Use the selector to see how dimensions build up:
-: **1 Factor**: Line (2D plot)
-: **2 Factors**: Surface (3D)  
-: **3 Factors**: Volume (4D with color)
-: **4+ Factors**: Beyond visualization!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Interactive Design Space Visualization*

<div id="chart-design-space-interactive" style="width: 650px; height: 550px; margin: 0 auto;"></div>

<script src="resources/js/charts/design_space_interactive.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="doe-solution" -->
## Design of Experiments (DoE): A Systematic Solution
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*What is DoE?*

-! *Design of Experiments* is a systematic approach to planning experiments that:

-: Explores the design space efficiently
-: Detects *interactions* between factors
-: Provides statistical validity for conclusions
-: Minimizes the number of experiments needed

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key Insight:</b><br>
Strategic placement of experiments gives <b>maximum information</b> with <b>minimum effort</b>.
</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->

<div id="chart-factorial-cube-3d" style="width: 100%; height: 680px; margin: 0 auto;"></div>

<script src="resources/js/charts/factorial_cube_3d.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="factorial-transition" -->
## From Design Space to Full Factorial Design
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*The Factorial Idea*

-! Instead of exploring along single axes (OFAT), *sample the corners* of the design space!

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Full Factorial Design:</b><br>
Test <b>all combinations</b> of factor levels systematically.
</div>

***

-! For 2 factors at 2 levels each:
-: 4 corner experiments
-: Captures main effects AND interaction
-: No wasted experiments!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Why Corners?*

-! Corner points maximize contrast:
-: Low vs. High gives biggest signal
-: Every factor varies simultaneously
-: Interactions become visible

***

-= Now let's formalize the terminology and mathematics!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="doe-terminology" -->
## Terminology: The Language of DoE
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Key Terms*

-! **Factor** (Independent Variable)
-: What we *control* in the experiment
-: Our example: pH, Coagulant dose, Stirring speed

***

-! **Level**
-: Specific values a factor takes
-: 2-level designs: "low" (−1) and "high" (+1)

***

-! **Response** (Dependent Variable)
-: What we *measure* as outcome
-: Our example: Microplastic removal efficiency (%)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*More Terms*

-! **Treatment / Run**
-: A single experimental condition
-: One combination of factor levels

***

-! **Effect**
-: Change in response when factor level changes
-: **Main effect**: Effect of one factor alone
-: **Interaction**: Combined effect of multiple factors

***

-! **Design Matrix**
-: Table showing all factor combinations
-: Each row = one experiment

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="full-factorial-intro" -->
## Full Factorial Design: The Concept
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*What is a Full Factorial Design?*

-! Test *all combinations* of factor levels!

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Notation:</b> $k^n$ design<br><br>
$k$ = number of levels per factor<br>
$n$ = number of factors<br><br>
<b>Number of runs</b> = $k^n$
</div>

***

-! *2-level factorial* ($2^n$): Most common
-: 2 factors → 4 runs
-: 3 factors → 8 runs
-: 4 factors → 16 runs

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Visualizing 2² Design*

<div id="chart-factorial-grid" style="width: 100%; height: 580px; margin: 10px auto;"></div>

<!-- PLACEHOLDER: D3.js visualization showing 2x2 factorial grid -->
<!-- Shows the 4 corner points of a 2-factor design -->
<script src="resources/js/charts/factorial_grid_chart.js"></script>

***

-! Each corner = one experiment
-: All combinations covered systematically

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="coded-values" -->
## Coded Values: Why −1 and +1?
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*The Coding System*

-! Transform real values to *coded values*

<div style="font-size: 0.7em;">

| Level | Code | Meaning |
|:------|:----:|:--------|
| Low   | −1   | Lower bound |
| Center| 0    | Midpoint |
| High  | +1   | Upper bound |

</div>

***

-! **Conversion formula:**

$$X_{coded} = \frac{X_{real} - X_{center}}{(X_{high} - X_{low})/2}$$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Example: Temperature*

-! Real values: 20°C to 40°C

<div style="font-size: 0.7em;">

| Temperature | Coded Value |
|:-----------:|:-----------:|
| 20°C        | −1          |
| 30°C        | 0           |
| 40°C        | +1          |

</div>

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Benefits of Coding:</b><br>
• Coefficients directly comparable<br>
• Orthogonal design matrix<br>
• Easier calculations
</div>

<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="example-introduction" -->
## Worked Example: Nitrate Degradation Optimization
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*The Problem*

-! Optimize nitrate removal in wastewater treatment

-: **Goal**: Maximize degradation rate
-: **Method**: Biological denitrification
-: **Response**: Degradation rate (mg/L·h)

***

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Factors to Investigate:</b><br>
• Temperature (°C)<br>
• Carbon source concentration (mg/L)
</div>

-? *Similar optimization challenge to microplastics: find best conditions!*

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Setting Up the Design*

-! **Factor Levels:**

| Factor | Symbol | Low (−1) | High (+1) |
|:-------|:------:|:--------:|:---------:|
| Temperature | $X_1$ | 15°C | 25°C |
| Carbon source | $X_2$ | 50 mg/L | 150 mg/L |

***

-! **2² Full Factorial Design**
-: 4 experiments total
-: All combinations of temp × carbon

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="design-matrix" -->
## The Design Matrix
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Constructing the Matrix*

-! List all factor combinations systematically

<div style="font-size: 0.7em;">

| Run | X1 | X2 | Real X1 | Real X2 |
|:---:|:-----:|:-----:|:----------:|:----------:|
| 1   | −1    | −1    | 15°C       | 50 mg/L    |
| 2   | +1    | −1    | 25°C       | 50 mg/L    |
| 3   | −1    | +1    | 15°C       | 150 mg/L   |
| 4   | +1    | +1    | 25°C       | 150 mg/L   |

</div>

***

-! Each row represents one experiment to perform.

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Understanding the Structure*

-! The **$X_1$ column** captures the temperature setting:
-: −1 = low (15°C), +1 = high (25°C)

***

-! The **$X_2$ column** captures carbon source:
-: −1 = low (50 mg/L), +1 = high (150 mg/L)

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key Property:</b><br>
The balanced (−1, +1) coding ensures that effects can be cleanly separated. Each factor's influence is estimated independently.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="extended-design-matrix" -->
## Extending the Design Matrix: Interactions
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Why Add an Interaction Column?*

-! What if the effect of temperature depends on carbon level?

-: At low carbon: temperature effect might be small
-: At high carbon: temperature effect might be large

***

-! To capture this, we add a column $X_1 \cdot X_2$:

<div style="font-size: 0.7em;">

| Run | X1 | X2 | X1X2 |
|:---:|:-----:|:-----:|:---------:|
| 1   | −1    | −1    | +1        |
| 2   | +1    | −1    | −1        |
| 3   | −1    | +1    | −1        |
| 4   | +1    | +1    | +1        |

</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*The Complete Design Matrix $\mathbf{X}$*

-! Adding an intercept column (all 1s), we get:

$$\mathbf{X} = \begin{bmatrix} 1 & -1 & -1 & +1 \\\\ 1 & +1 & -1 & -1 \\\\ 1 & -1 & +1 & -1 \\\\ 1 & +1 & +1 & +1 \end{bmatrix}$$

***

-! Columns represent: $[1, X_1, X_2, X_1 X_2]$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="experimental-results" -->
## Experimental Results: The Y Vector
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Collected Data*

-! Nitrate degradation rate (mg/L·h):

<div style="font-size: 0.7em;">

| Run | Response Y |
|:---:|:------------:|
| 1   | 12.3         |
| 2   | 18.7         |
| 3   | 15.1         |
| 4   | 28.9         |

</div>

***

-! As a vector:

$$\mathbf{Y} = \begin{bmatrix} 12.3 \\ 18.7 \\ 15.1 \\ 28.9 \end{bmatrix}$$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Visualizing the Results*

<div id="chart-results-visualization" style="width: 100%; height: 480px; margin: 10px auto;"></div>

<!-- PLACEHOLDER: D3.js visualization showing 2x2 grid with response values at corners -->
<script src="resources/js/charts/factorial_results_chart.js"></script>

***

-! Higher values at high temperature and high carbon!
-: But how do we estimate the effects?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="regression-aha" -->
## This is Regression!
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*We Have Seen This Before!*

-! We have:
-: A **design matrix** $\mathbf{X}$ (4 × 4)
-: A **response vector** $\mathbf{Y}$ (4 × 1)
-: Unknown **coefficients** $\boldsymbol{\beta}$ to estimate

***

$$\mathbf{X} = \begin{bmatrix} 1 & -1 & -1 & +1 \\\\ 1 & +1 & -1 & -1 \\\\ 1 & -1 & +1 & -1 \\\\ 1 & +1 & +1 & +1 \end{bmatrix}, \quad \mathbf{Y} = \begin{bmatrix} 12.3 \\\\ 18.7 \\\\ 15.1 \\\\ 28.9 \end{bmatrix}$$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*This is Linear Regression!*

<div style="background: #2d5016; color: #ffffff; padding: 14px; border-radius: 8px; margin: 10px 0; font-size: 0.9em;">
<b>💡 Key Insight:</b><br>
Factorial design analysis is just <b>linear regression</b>!<br>
$$\mathbf{Y} = \mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon}$$
The "effects" we want are simply the <b>regression coefficients β</b>!
</div>

***

-! We already know how to solve this:

$$\boldsymbol{\beta}\_{hat} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{Y}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="calculating-effects" -->
## Estimating Effects via Regression
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*The Regression Solution*

-! Apply the standard OLS estimator:

<div style="font-size: 0.8em;">

$$\boldsymbol{\beta}\_{hat} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{Y}$$

</div>

***

-! For our coded design matrix, this simplifies beautifully:

<div style="font-size: 0.8em;">

$$\mathbf{X}^\top \mathbf{X} = n \cdot \mathbf{I}_n \longrightarrow (\mathbf{X}^\top \mathbf{X})^{-1} = n^{-1}$$

</div>

-: $n$ = number of runs = 4
-: Because columns are balanced (−1, +1), the cross-products vanish!

***

-! Therefore:

<div style="font-size: 0.8em;">

$$\boldsymbol{\beta}\_{hat} = \frac{1}{4} \mathbf{X}^\top \mathbf{Y}$$

</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Computing the Coefficients*

-! Multiply $\mathbf{X}^\top$ by $\mathbf{Y}$:

<div style="font-size: 0.8em;">

$$\boldsymbol{\beta}\_{hat} = \frac{1}{4} \begin{bmatrix} 1 & 1 & 1 & 1 \\\\ -1 & +1 & -1 & +1 \\\\ -1 & -1 & +1 & +1 \\\\ +1 & -1 & -1 & +1 \end{bmatrix} \begin{bmatrix} 12.3 \\\\ 18.7 \\\\ 15.1 \\\\ 28.9 \end{bmatrix}$$

</div>

***

<div style="font-size: 0.8em;">

$$\boldsymbol{\beta}\_{hat} = \begin{bmatrix} b_0 \\\\ b_1 \\\\ b_2 \\\\ b_{12} \end{bmatrix} = \begin{bmatrix} 18.75 \\\\ 5.05 \\\\ 3.25 \\\\ 1.85 \end{bmatrix}$$

</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="response-surface-visualization" -->
## The Fitted Response Surface

<div id="chart-response-surface-3d" style="width: 100%; height: 680px; margin: 0 auto;"></div>

<script src="resources/js/charts/response_surface_3d.js"></script>

***

-! The 4 design points define a **tilted plane** through the response space.

---

<!-- .slide:id="interpreting-coefficients" -->
## Interpreting the Regression Coefficients
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*What Do the Coefficients Mean?*

<div style="font-size: 0.7em;">

| Coefficient | Value | Interpretation |
|:------------|:-----:|:---------------|
| $b_0$ | 18.75 | Mean response at center of design |
| $b_1$ | 5.05 | Effect of $X_1$ per coded unit |
| $b_2$ | 3.25 | Effect of $X_2$ per coded unit |
| $b_{12}$ | 1.85 | Interaction effect |

</div>

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key Point:</b><br>
With (−1, +1) coding, each coefficient equals <b>half</b> the total effect.
Full effect of temperature: $2 \times 5.05 = 10.1$ mg/L·h
</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Practical Interpretation*

-! $b_0 = 18.75$: 
-: Baseline degradation rate at coded center (20°C, 100 mg/L)

***

-! $b_1 = 5.05$:
-: Increasing temperature from center to high (+1 step) adds 5.05 mg/L·h
-: In real units: each 5°C increase → +5.05 mg/L·h

***

-! $b_2 = 3.25$:
-: Each +50 mg/L carbon source → +3.25 mg/L·h

***

-! $b_{12} = 1.85$:
-: Positive interaction, i.e.,  factors enhance each other!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="understanding-interaction" -->
## Understanding the Interaction
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*What Does $b_{12} = 1.85$ Mean?*

-! The effect of temperature depends on carbon level:

-! Effect of $X_1$ at low $X_2$ (−1):
$$b_1 + b_{12} \cdot (-1) = 5.05 - 1.85 = 3.2$$

-! Effect of $X_1$ at high $X_2$ (+1):
$$b_1 + b_{12} \cdot (+1) = 5.05 + 1.85 = 6.9$$

***

-= Temperature effect is twice as large when carbon is high!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Verifying with Raw Data*

-! Effect of temperature at low carbon:
$$18.7 - 12.3 = 6.4 \approx 2 \times 3.2$$

-! Effect of temperature at high carbon:
$$28.9 - 15.1 = 13.8 \approx 2 \times 6.9$$

***

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Synergistic Interaction:</b><br>
High temperature + high carbon gives a <b>boost beyond</b> the sum of individual effects!<br><br>
This interaction would be <b>missed by OFAT</b>!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fitted-model" -->
## The Complete Fitted Model
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Summary: Our Regression Model*

-! The fitted model (coded units):

$$Y\_{hat} = 18.75 + 5.05 X_1 + 3.25 X_2 + 1.85 X_1 X_2$$

***

-! Coefficient summary:

<div style="font-size: 0.7em;">

| Coefficient | Value | Full Effect | Interpretation |
|:------------|:-----:|:-----------:|:---------------|
| $b_0$ | 18.75 | — | Baseline at center |
| $b_1$ | 5.05 | 10.1 | Temperature effect |
| $b_2$ | 3.25 | 6.5 | Carbon effect |
| $b_{12}$ | 1.85 | 3.7 | Synergistic interaction |

</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Model Predictions*

-! Verify: Predictions match observations exactly!

<div style="font-size: 0.7em;">

| X1 | X2 | Predicted Yhat | Observed Y |
|:-----:|:-----:|:-------------------:|:------------:|
| −1    | −1    | 12.3                | 12.3         |
| +1    | −1    | 18.7                | 18.7         |
| −1    | +1    | 15.1                | 15.1         |
| +1    | +1    | 28.9                | 28.9         |

</div>

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Perfect Fit — But a Problem:</b><br>
4 data points, 4 coefficients → 0 residual df
We cannot estimate error or test significance!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="significance-problem" -->
## The Problem: Are Effects Significant?
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Why We Have Zero Degrees of Freedom*

-! Our model has 4 coefficients: $b_0, b_1, b_2, b_{12}$

-! We ran 4 experiments.

***

-! Why include the interaction $b_{12}$?
-: Interactions are often scientifically meaningful
-: In our example: temperature × carbon synergy is real!
-: Dropping it would give a wrong model

***

<div style="background: #8B0000; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>⚠️ The Dilemma:</b><br>
We <i>must</i> include interaction → model is <b>saturated</b>.
4 runs − 4 coefficients = <b>0 df</b> for error!
No error estimate → no significance tests!
</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Solutions: Extend the Design*

-! Option 1: Replicates
-: Repeat some or all experiments
-: Each replicate adds 1 df for error

***

-! Option 2: Center Points
-: Add experiments at $(0, 0)$
-: Provides error estimate AND detects curvature

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key Insight:</b><br>
Including interactions forces us to extend the design.<br>
This is <b>good practice</b> — never run a saturated design without replication!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="replicates-center-points" -->
## Adding Replicates: The Matrix Perspective
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*What is a Replicate Mathematically?*

-! A replicate means duplicating a row in X and adding a new Y value.

-! Example: Replicating run 1 twice:

$$\mathbf{X} = \begin{bmatrix} 1 & -1 & -1 & +1 \\\\ 1 & -1 & -1 & +1 \end{bmatrix}, \quad \mathbf{Y} = \begin{bmatrix} 12.3 \\\\ 11.9 \end{bmatrix}$$

***

-! The same X row with different Y values captures experimental variability!

***

-! Now: 8 observations, 4 coefficients → *4 df for error*!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Full Design with Replicates*

-! With 2 replicates per corner:

<div style="font-size: 0.7em;">

| X1 | X2 | X1X2 | Y |
|:-----:|:-----:|:---------:|:---:|
| −1 | −1 | +1 | 12.3 |
| −1 | −1 | +1 | 11.9 |
| +1 | −1 | −1 | 18.7 |
| +1 | −1 | −1 | 19.3 |
| −1 | +1 | −1 | 15.1 |
| −1 | +1 | −1 | 14.7 |
| +1 | +1 | +1 | 28.9 |
| +1 | +1 | +1 | 29.5 |

</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="center-points" -->
## Adding Center Points
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Center Points in the Matrix*

-! Add runs at $(X_1, X_2) = (0, 0)$:

$$\mathbf{X}_{center} = \begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \end{bmatrix}$$

***

-! Note: Center points contribute only to $b_0$!
-: They don't affect main effect or interaction estimates
-: But they provide error estimate AND curvature test

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Center Point Data*

<div style="font-size: 0.7em;">

| Run | X1 | X2 | Real Values | Y |
|:---:|:-----:|:-----:|:-----------:|:---:|
| 5   | 0     | 0     | 20°C, 100 mg/L | 19.2 |
| 6   | 0     | 0     | 20°C, 100 mg/L | 19.8 |
| 7   | 0     | 0     | 20°C, 100 mg/L | 19.5 |

</div>

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Benefits of Center Points:</b><br>
• Estimate pure error (among replicates)<br>
• Detect curvature (is linear model adequate?)<br>
• Check for time drift (run throughout DoE)
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="degrees-of-freedom" -->
## Degrees of Freedom Analysis
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*2² Design with Center Points*

-: Original design: 4 corner points
-: Added: 3 center points
-: *Total: 7 observations*

<div style="font-size: 0.7em;">

| Source | df |
|:-------|:--:|
| Mean ($b_0$) | 1 |
| $X_1$ main effect | 1 |
| $X_2$ main effect | 1 |
| $X_1 X_2$ interaction | 1 |
| **Model total** | **4** |
| Pure error (center pts) | 2 |
| Lack of fit (curvature) | 1 |
| **Total** | **7** |

</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Interpreting the Analysis*

-! Pure Error
-: Variability among replicates at same conditions
-: Irreducible experimental noise

***

-! Lack of Fit
-: Difference between model and center point mean
-: Indicates curvature if significant

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Rule of thumb:</b><br>
Add 3-5 center points to a 2² design
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="t-test-coefficients" -->
## Testing Coefficient Significance
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*The t-Test for Coefficients*

-! Each coefficient is tested against zero:

$$t_i = \frac{b_i}{SE(b_i)}$$

***

-! Standard error from covariance matrix:

$$SE(b_i) = \sqrt{C_{ii}}$$

-: where $\mathbf{C} = (\mathbf{X}^T\mathbf{X})^{-1} \cdot MSE$

***

-! Compare $|t_i|$ to $t_{crit}$ at significance level $\alpha$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Example: 2² Design (4 corner points)*

-! For orthogonal design: $(\mathbf{X}^T\mathbf{X})^{-1} = \frac{1}{4}\mathbf{I}$

-: With $MSE = 0.20$:

$$SE(b_i) = \sqrt{\frac{0.20}{4}} = 0.224$$

<div style="font-size: 0.7em;">

| Coef. | Value | $t_i$ | Significant? |
|:------|:-----:|:---:|:------------:|
| $b_1$ | 5.05 | 22.5 | ✓ Yes |
| $b_2$ | 3.25 | 14.5 | ✓ Yes |
| $b_{12}$ | 1.85 | 8.3 | ✓ Yes |

</div>

***

-! All effects significant at $\alpha = 0.05$
-: ($t_{crit} \approx 4.30$ for df = 2 with replicates)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="curvature-detection" -->
## Detecting Curvature (Quadratic Effects)
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Why Curvature Matters*

-! Linear model assumes straight-line relationships!

-: But real processes often have optima
-: Too much of a good thing can be bad

***

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Example:</b><br>
Temperature may have an optimum:<br>
• Too low → slow reaction<br>
• Too high → enzyme denaturation
</div>

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Testing for Curvature*

-! Compare center point mean to corner point mean:

$$\bar{Y}\_{center} = 19.5$$
$$\bar{Y}\_{corners} = 18.75$$

***

$$t\_{curvature} = \frac{\bar{Y}\_{center} - \bar{Y}\_{corners}}{SE\_{diff}}$$

***

-! If curvature detected:
-: Add quadratic terms ($X_1^2$, $X_2^2$)
-: Consider response surface methodology (RSM)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="quadratic-model" -->
## Adding Quadratic Terms
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*The Quadratic Model*

-! Full second-order model:

$$Y = b_0 + b_1 X_1 + b_2 X_2 + b_{12} X_1 X_2 + b_{11} X_1^2 + b_{22} X_2^2$$

***

-! **Problem:** Cannot estimate $b_{11}$ and $b_{22}$ from 2² design!
-: At corners: $X_1^2 = X_2^2 = 1$ always

***

-! Need additional design points:
-: **3-level factorial** (3²)
-: **Central Composite Design** (CCD)
-: **Box-Behnken Design** (to be covered later)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*When to Use Quadratic Models*

-! Use a quadratic model when:

-: Center points show significant curvature
-: Optimization is the goal (finding a maximum)
-: Process physics suggests non-linear behavior

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Strategy:</b><br>
1. Start with 2² + center points<br>
2. Check for curvature<br>
3. If found → augment design<br>
4. Fit quadratic model
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="scaling-up" -->
## Scaling to More Factors: 2³ Design
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Three Factors: The 2³ Design*

-! Example: Add reaction time as third factor

<div style="font-size: 0.7em;">

| Factor | Symbol | Low (−1) | High (+1) |
|:-------|:------:|:--------:|:---------:|
| Temperature | $X_1$ | 15°C | 25°C |
| Carbon | $X_2$ | 50 mg/L | 150 mg/L |
| Time | $X_3$ | 2 h | 6 h |

</div>

***

-! Number of runs: $2^3 = 8$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*2³ Design Matrix*

<div style="font-size: 0.7em;">

| Run | $X_1$ | $X_2$ | $X_3$ |
|:---:|:-----:|:-----:|:-----:|
| 1 | −1 | −1 | −1 |
| 2 | +1 | −1 | −1 |
| 3 | −1 | +1 | −1 |
| 4 | +1 | +1 | −1 |
| 5 | −1 | −1 | +1 |
| 6 | +1 | −1 | +1 |
| 7 | −1 | +1 | +1 |
| 8 | +1 | +1 | +1 |

</div>

***

-! This is a **cube** in 3D factor space!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="three-factor-effects" -->
## Effects in a 2³ Design
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Model for 3 Factors*

-! Full model:

$$Y = b_0 + b_1 X_1 + b_2 X_2 + b_3 X_3$$
$$+ b_{12} X_1 X_2 + b_{13} X_1 X_3 + b_{23} X_2 X_3$$
$$+ b_{123} X_1 X_2 X_3$$

***

-! 8 coefficients** from 8 runs → Saturated!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Types of Effects*

<div style="font-size: 0.7em;">

| Effect Type | Number | Terms |
|:------------|:------:|:------|
| Mean | 1 | $b_0$ |
| Main effects | 3 | $b_1, b_2, b_3$ |
| 2-way interactions | 3 | $b_{12}, b_{13}, b_{23}$ |
| 3-way interaction | 1 | $b_{123}$ |
| **Total** | **8** | |

</div>

***

-? 3-way interactions are often negligible
-: Can pool to estimate error

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hierarchy-principle" -->
## The Hierarchy Principle
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Effect Sparsity*

-! In most real systems:

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Pareto Principle for Effects:</b><br>
• Main effects dominate<br>
• 2-way interactions may be important<br>
• Higher-order interactions rarely significant
</div>

***

-! This is the **hierarchy** or **sparsity** principle!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Practical Implications*

-! When analyzing factorial designs:

1. **Check main effects first**
2. **Then 2-way interactions**
3. **Pool higher-order terms** for error estimate

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Rule of thumb:</b><br>
If $b_{123}$ is small, use its sum of squares to estimate error variance.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="converting-to-real-units" -->
## Converting to Real Units
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*From Coded to Real Coefficients*

-! Our model in coded units:

$$Y\_{hat} = 18.75 + 5.05 X_1 + 3.25 X_2 + 1.85 X_1 X_2$$

***

-! To convert, substitute:

$$X_1 = \frac{T - 20}{5}$$
$$X_2 = \frac{C - 100}{50}$$

where $T$ = temperature (°C), $C$ = carbon (mg/L)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Real-Unit Model*

-! After substitution and simplification:

$$Y\_{hat} = \beta_0 + \beta_T \cdot T + \beta_C \cdot C + \beta_{TC} \cdot T \cdot C$$

***

-! The coefficients change but predictions are identical!

***

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Note:</b><br>
In coded units, coefficients are directly comparable.
In real units, they depend on the scale chosen.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="practical-guidelines" -->
## Practical Guidelines
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Planning Your Design*

-! Step 1: Define objectives
-: Screening or optimization?
-: What response(s) to measure?

***

-! Step 2: Select factors
-: 2–4 factors: Full factorial feasible
-: 5+ factors: Consider fractional designs (later lecture)

***

-! Step 3: Choose levels
-: Wide enough to see effects
-: Within safe operating range

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Running the Experiments*

-! Step 4: Randomize run order!

<div style="background: #8B0000; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>⚠️ Critical:</b><br>
Never run experiments in systematic order!<br>
Time trends would bias your results.
</div>

***

-! Step 5: Add center points
-: At least 3–5 replicates

***

-! Step 6: Analyze and validate
-: Check residuals
-: Confirm at predicted optimum

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="back-to-microplastic" -->
## Back to Our Anchor Problem
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Solving the Microplastic Challenge*

-! Recall: We wanted to optimize microplastic removal with **4 factors**.

<div style="font-size: 0.7em;">

| Factor | Low | High |
|:-------|:---:|:----:|
| Coagulant dose | 10 mg/L | 50 mg/L |
| pH | 5 | 9 |
| Stirring speed | 50 rpm | 200 rpm |
| Contact time | 5 min | 30 min |

</div>

***

-! Full factorial approach:
-: 2⁴ = 16 experiments + center points
-: All main effects and interactions detected
-: Systematic coverage of design space

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*What We Gained vs. OFAT*

<div style="font-size: 0.7em;">

| Aspect | OFAT | Full Factorial |
|:-------|:----:|:--------------:|
| Experiments | ~20 | 16-20 |
| Interactions | ✗ Missed | ✓ Detected |
| True optimum | Unlikely | Systematic |
| Statistical validity | Low | High |

</div>

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key Insight:</b><br>
Factorial design doesn't just find a good condition. It maps the entire response surface, revealing which factors matter most and how they interact!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="exercise" -->
## Exercise: Adsorption Optimization
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Problem Statement*

-! Optimize heavy metal adsorption using activated carbon

-: Response: Removal efficiency (%)
-! Factors:
-: $X_1$: Adsorbent dose (1–5 g/L)
-: $X_2$: Contact time (30–90 min)

***

-! Design a $2^2$ factorial experiment with 3 center points.

***

[>> go to web R](https://webr.sh/#code=eJydkr9OwzAQxiXGPsVJLVKrNkmT%2FiULQ6UiNhQJia06kmtjKXGQfS4M3VhY4Rm68QbsvAhPgpNGIlCmerjP%2Fu5nD9%2F59XkvMaf3W8mCM0p8N9o%2FIKcfXlrk5D3S%2FcpoUl6znyDj59myfeJqtcF3YaEImYBTgoS02EjIkZV4gm5cJJTAFjNDumfhwIUrsSVZsYq0yViH1t9BZKStnbuV3zloUGpEeWFvQ%2Fe8B7uSCx3HCat6rE59qt4DH8oKXy9vRzu7xpNKajY4%2BP3%2FyFnQJEd%2Fif4POZk3yfHvfoO78Jvc4ubgD6Gp0%2FkAptMBzIYVN7IhYxabrMw5RyGB1muKWQPKBIRkUhizKKRlxy4sBdcJb2zI2vqQ20lktjtx4VqXTUVQjkqsRYySITZqi2wUXbZO%2FgzfAVqi0A%3D%3D)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Tasks*

1. Create the design matrix (coded)

2. Given the results:

<div style="font-size: 0.7em;">

| Run | $X_1$ | $X_2$ | Removal (%) |
|:---:|:-----:|:-----:|:-----------:|
| 1 | −1 | −1 | 45 |
| 2 | +1 | −1 | 72 |
| 3 | −1 | +1 | 58 |
| 4 | +1 | +1 | 91 |
| CP | 0 | 0 | 68, 66, 70 |

</div>

3. Calculate main effects and interaction
4. Fit the regression model
5. Is there significant curvature?

<!-- /position -->
<!-- /layout -->