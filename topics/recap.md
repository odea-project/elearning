---
title: "Exam Recap: t-Tests, F-Tests & Linear Models"
author: "Gerrit Renner"
keywords: ["t-test", "F-test", "degrees of freedom", "standard error", "ANOVA", "regression", "DOE", "design matrix", "exam preparation"]
description: "Compact 20-slide exam recap consolidating t-tests, F-tests, and the design matrix perspective"
---
<!-- End of metadata -->

<!-- .slide:id="signal-noise" -->
## Signal-to-Noise Principle
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Common Thread*

-! Both t-tests and F-tests answer:

<div style="background: rgba(255, 255, 255, 0); color: #efefef; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.9em;">
<b>Is the observed effect larger than expected from random variation alone?</b>
</div>

***

-! Both compare **signal** to **noise** (randomness):

$$\text{Test Statistic} = \frac{\text{Signal (effect)}}{\text{Noise (uncertainty)}}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*t-Test vs. F-Test*

$$t = \frac{\hat{\theta} - \theta_0}{SE(\hat{\theta})} \quad \text{(single parameter)}$$

with $\hat{\theta}$ = estimate, $\theta_0$ = null value (mostly 0), $SE$ = standard error

$$F = \frac{MS_{\text{effect}}}{MS_{\text{error}}} \quad \text{(variance ratio)}$$

with $MS$ = mean square (variance estimate), effect = signal, error = noise


<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="big-picture-table" -->
## Big Picture: Test Overview

<div style="font-size: 0.62em; margin: 10px auto;">

| **Test** | **What is Tested?** | **Test Statistic** | **Typical Use Case** | **H₀** |
|:---------|:--------------------|:-------------------|:---------------------|:-------|
| One-sample t | Mean vs. reference | $t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$ | Does pH = 7.0? | $\mu = \mu_0$ |
| Two-sample t | Means of two groups | $t = \frac{\bar{x}_1 - \bar{x}_2}{SE\_{\text{diff}}}$ | Site A vs. Site B? | $\mu_1 = \mu_2$ |
| Regression t | Single coefficient | $t = \frac{\hat{\beta}_j}{SE(\hat{\beta}_j)}$ | Is slope ≠ 0? | $\beta_j = 0$ |
| Regression F | Overall model | $F = \frac{MS_{\text{reg}}}{MS_{\text{res}}}$ | Does model explain y? | All $\beta_j = 0$ |
| ANOVA F | Group differences | $F = \frac{MS_{\text{between}}}{MS_{\text{within}}}$ | Do seasons differ? | All $\mu_i$ equal |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px auto; font-size: 0.8em; max-width: 90%;">
<b>Key Pattern:</b> t-tests compare <b>one parameter</b> to a reference. F-tests compare <b>variances</b> or test <b>multiple parameters</b> simultaneously.
</div>

---

<!-- .slide:id="df-core" -->
## Degrees of Freedom: Core Rule
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Core Idea*

-! **df = Independent pieces of information for estimation**

-! Every parameter estimated **"uses up"** one df

***

$$\boxed{df = n - p}$$

-: $n$ = number of observations
-: $p$ = number of estimated parameters

***

-! Wrong df → wrong p-value → wrong conclusion!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Constraint Intuition*

-! 4 numbers that must sum to 40:
-: Freely choose: 8, 12, 15
-: 4th is forced: 40 − 8 − 12 − 15 = **5**
-: Only 3 values are "free" → **df = 3**

***

-! Sample variance divides by $n-1$:

$$s^2 = \frac{\sum(x_i - \bar{x})^2}{n-1}$$

-: We estimated 1 parameter ($\bar{x}$)
-: df = $n - 1$ independent deviations

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="df-table" -->
## Degrees of Freedom Reference

<div style="font-size: 0.58em; margin: 10px auto;">

| **Context** | **df Formula** | **Why?** | **Example (n=20)** |
|:------------|:---------------|:---------|:-------------------|
| **One-sample t-test** | $df = n - 1$ | Estimate 1 parameter: $\bar{x}$ | df = 19 |
| **Two-sample t-test** (pooled) | $df = n_1 + n_2 - 2$ | Estimate 2 means | n₁=10, n₂=10 → df = 18 |
| **Paired t-test** | $df = n_{pairs} - 1$ | Estimate 1 mean of differences | 10 pairs → df = 9 |
| **Regression t-test** (coefficient) | $df = n - p$ | Estimate p parameters (intercept + slopes) | 20 observations, 2 predictors → df = 18 |
| **Regression F-test** (overall) | $df_1 = p-1$, $df_2 = n-p$ | Numerator: # predictors; Denom: residual df | 20 observations, 2 parameters → df₁ = 1, df₂ = 18 |
| **One-way ANOVA** | $df_{between} = k-1$, $df_{within} = N-k$ | k groups; total N observations | 20 observations, 4 groups → df₁ = 3, df₂ = 16 |
| **2² factorial DOE** | $df_{error} = N - m - 1$ | m = unique columns in X | 8 runs, 4 unique → df = 3 |
</div>

<div style="background: #702914ff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 12px auto; font-size: 0.75em; max-width: 90%;">
<b>Exam Tip:</b> Always count parameters! df = observations − parameters estimated.
</div>

---

<!-- .slide:id="se-concept" -->
## Standard Error: Definition & Variance Sources
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What SE Means*

-! **Standard Error (SE)** always means:

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.9em;">
The standard deviation of an estimator
</div>

***

-! It quantifies: "How much would my estimate vary if I repeated the sampling?"

***

-! **Not the same as SD!**
-: SD: spread of individual observations
-: SE: uncertainty of the estimate

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Variance Source Depends on Context*

<div style="font-size: 0.8em;">

| Context | Variance Source | Standard Error |
|:--------|:----------------|:---------------|
| Mean | Sample variance $s^2$ | $s/\sqrt{n}$ |
| Regression | Residual variance $\hat{\sigma}^2$ | $\hat{\sigma}\sqrt{(X^TX)^{-1}_{jj}}$ |
| ANOVA | Mean Square Error (MSE) | $\sqrt{MSE/n_i}$ (used for post-hoc tests) |

</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-block-a" -->
## Worked Example: Mean & Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Example A: One-Sample t-Test*

<div style="background: #1a588bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
Nitrate (mg/L) over 8 days: mean = 10.4, s = 0.42<br>
Regulatory limit: 10.0 mg/L
</div>

-! **Test:** One-sample t (one-tailed)
-! **df:** n − 1 = 8 − 1 = **7**
-! **SE:** $s/\sqrt{n} = 0.42/\sqrt{8} \approx 0.15$
-! **t:** $(10.4 - 10.0)/0.15 \approx 2.67$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example B: Regression Coefficient*

Model: $y = \beta_0 + \beta_1 x + \beta_2 z + \varepsilon$<br>
n = 25, software reports t = 3.2 for $\hat{\beta}_1$

-! **Test:** t-test for single coefficient
-! **H₀:** $\beta_1 = 0$ (no effect)
-! **df:** n − p = 25 − 3 = **22**

***

-! **Overall model?** F-test: df₁ = 1, df₂ = 22
-! **F**: $F = \frac{MS_{reg}}{MS_{res}} = \frac{df_2}{df_1}\times \frac{\sum(\hat{y}_i - \bar{\hat{y}})^2}{\sum(y_i - \hat{y}_i)^2}$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="common-mistakes" -->
## Common Mistakes
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
*Mistakes to Avoid*

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 16px 0; font-size: 1em;">
❌ Regression df = n - p, not n - 1 or n - 2
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 16px 0; font-size: 1em;">
❌ F-test has TWO df, always specify both
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 16px 0; font-size: 1em;">
❌ SD ≠ SE, SD is spread, SE is uncertainty
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 16px 0; font-size: 1em;">
❌ Regression uses residual variance, not Var(y)
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 16px 0; font-size: 1em;">
❌ 3+ groups → ANOVA, not multiple t-tests
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="design-matrix-intro" -->
## The Unifying Model: y = Xβ + ε
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The General Linear Model*

-! Every linear model has the same form:

$$\mathbf{y} = \mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon}$$

-: $\mathbf{y}$ = observations (n × 1)
-: $\mathbf{X}$ = design matrix (n × p)
-: $\boldsymbol{\beta}$ = parameters (p × 1)
-: $\boldsymbol{\varepsilon}$ = errors (n × 1)

***

-! OLS, ANOVA, and DOE are **one method** with different X matrices

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why This Matters for the Exam*

-= If you understand X, you understand:
-: What parameters are estimated
-: How many degrees of freedom (= n − columns of X)
-: Where standard errors come from
-: Why F-tests work the same way everywhere

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key insight:</b><br>
Different X → different interpretation of β<br>
Same estimation, same testing logic!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="reading-design-matrix" -->
## The Design Matrix
<!-- layout={rows: 1, columns: 3} -->
<!-- position={row: 1, column: 1} -->
*Simple Linear Regression*

$$y_i = \beta_0 + \beta_1 x_i + \varepsilon_i$$

$$\mathbf{X} = \begin{pmatrix} 1 & x_1 \\\ 1 & x_2 \\\ 1 & x_3 \\\ 1 & x_4 \end{pmatrix}$$

-: Column 1: all 1s (intercept)
-: Column 2: x-values (slope)
-: **p = 2**, residual df = n − 2

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*One-Way ANOVA (3 groups, reference coding)*

$$\mathbf{X} = \begin{pmatrix} 1 & 0 & 0 \\\ 1 & 0 & 0 \\\ 1 & 1 & 0 \\\ 1 & 1 & 0 \\\ 1 & 0 & 1 \\\ 1 & 0 & 1 \end{pmatrix}$$

-: Column 1: intercept (= Group 1 mean)
-: Columns 2-3: dummy variables for Groups 2, 3
-: **p = 3**, residual df = n − 3

<!-- /position -->
<!-- position={row: 1, column: 3} -->
*2² Factorial DOE*
$$\mathbf{X} = \begin{pmatrix} 1 & -1 & -1 & +1 \\\ 1 & +1 & -1 & -1 \\\ 1 & -1 & +1 & -1 \\\ 1 & +1 & +1 & +1 \end{pmatrix}$$
-: Column 1: intercept (overall mean, *mostly hidden*)
-: Columns 2-4: factors A, B, and interaction A×B
-: **p = 4**, residual df = n − 4
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ols-estimation" -->
## OLS Estimation & Residual Variance
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*OLS Solution*

-! OLS finds $\hat{\beta}$ that minimizes $SS_{res}$:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}$$

***

-! Residuals: $\mathbf{e} = \mathbf{y} - \mathbf{X}\hat{\boldsymbol{\beta}}$

***

-! Residual variance (unbiased):

$$\hat{\sigma}^2 = \frac{SS_{res}}{n - p} = \frac{\mathbf{e}^T\mathbf{e}}{n - p}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Role of the Design Matrix*

-! $(\mathbf{X}^T\mathbf{X})^{-1}$ determines:
-: How precisely we can estimate each β
-: Standard errors of coefficients

***

-! Standard errors
$$SE(\hat{\beta}_j) = \hat{\sigma} \sqrt{(\mathbf{X}^T\mathbf{X})^{-1}_{jj}}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-as-regression" -->
## ANOVA as Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*ANOVA is Linear Regression*

-! ANOVA with k groups = regression with dummy-coded X

| Obs | Group | X₀ | X₁ | X₂ |
|:----|:------|:--:|:--:|:--:|
| 1 | A | 1 | 0 | 0 |
| 2 | B | 1 | 1 | 0 |
| 3 | C | 1 | 0 | 1 |

-: $\beta_0 = \mu_A$ (reference group mean)
-: $\beta_1 = \mu_B - \mu_A$
-: $\beta_2 = \mu_C - \mu_A$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Same F-Test*

$$F = \frac{MS_{between}}{MS_{within}} = \frac{MS_{model}}{MS_{residual}}$$

***

-! **df correspondence:**
-: $df_{between} = k - 1 = p - 1$
-: $df_{within} = N - k = n - p$

***

-= Same estimates, same residuals, same test!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="doe-as-regression" -->
## DOE as Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*DOE: Designed X Matrix*

-! In DOE, X is **planned before** data collection

-! For a 2² factorial:

| Run | Intercept | A | B | A×B |
|:----|:---------:|:-:|:-:|:---:|
| 1 | 1 | -1 | -1 | +1 |
| 2 | 1 | +1 | -1 | -1 |
| 3 | 1 | -1 | +1 | -1 |
| 4 | 1 | +1 | +1 | +1 |

-: Columns: mean, main effects, interaction

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Orthogonality & df*

-! Columns are **orthogonal**: $\mathbf{X}_i^T \mathbf{X}_j = 0$
-: Effects estimated independently
-: No confounding

***

-! **df per effect** (2-level factors):
$$df = N − \underbrace{\text{unique columns of X}}_{\text{e.g., }4}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="comparison-table" -->
## Comparison: OLS vs. ANOVA vs. DOE

<div style="font-size: 0.55em; margin: 10px auto;">

| **Aspect** | **OLS Regression** | **ANOVA** | **DOE** |
|:-----------|:-------------------|:----------|:--------|
| **Scientific question** | How does y change with x? | Do group means differ? | Which factors affect y? |
| **Structure of X** | Continuous predictors | Dummy-coded categories | Coded factors & interactions |
| **Meaning of β** | Slopes (rate of change) | Group differences | Factor effects |
| **Source of variance** | Residual variance $\hat{\sigma}^2$ | MSE (pooled) | MSE from replicates |
| **Typical test** | t (coefficient), F (overall) | F (overall), post-hoc t | t (per effect), F (overall) |
| **df logic** | df = n - p | df_between = k-1, df_within = N-k | df in total = n - p (p= unique columns of X) |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 10px; border-radius: 8px; margin: 12px auto; font-size: 0.75em; max-width: 95%;">
<b>Unifying principle:</b> All three are $\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}$, they differ only in how X is constructed!
</div>

---

<!-- .slide:id="example-doe" -->
## Worked Example: Factorial DOE
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

<div style="background: #702914ff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
2² experiment: pH (low/high) × Dose (low/high)<br>
Each combination replicated twice (N = 8)
</div>

***

*Design Matrix X:*

| Run | Intercept | pH | Dose | pH×Dose |
|:----|:---------:|:--:|:----:|:-------:|
| 1,2 | 1 | -1 | -1 | +1 |
| 3,4 | 1 | +1 | -1 | -1 |
| 5,6 | 1 | -1 | +1 | -1 |
| 7,8 | 1 | +1 | +1 | +1 |

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Analysis*

-! **Columns of X:** 4 (intercept + 3 effects)

-! **Error df:** N − unique runs = 8 − 4 = **4**

***

-! **Why orthogonality matters:**
-: Each effect estimated independently
-: No confounding between pH and Dose
-: Clean F-test for each effect

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="cheat-sheet" -->
## Formula Cheat Sheet

<div style="font-size: 0.55em; margin: 5px auto;">

| **Test** | **Formula** | **df** | **SE Uses** | **H₀** |
|:---------|:------------|:-------|:------------|:-------|
| 1-sample t | $t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$ | $n-1$ | Sample variance $s^2$ | $\mu = \mu_0$ |
| 2-sample t | $t = \frac{\bar{x}_1 - \bar{x}_2}{s_p\sqrt{1/n_1 + 1/n_2}}$ | $n_1+n_2-2$ | Pooled variance $s_p^2$ | $\mu_1 = \mu_2$ |
| Reg. coef. t | $t = \frac{\hat{\beta}_j}{SE(\hat{\beta}_j)}$ | $n-p$ | Residual variance $\hat{\sigma}^2$ | $\beta_j = 0$ |
| Reg. F | $F = \frac{MS_{reg}}{MS_{res}}$ | $(p-1, n-p)$ | — | All $\beta_j = 0$ |
| ANOVA F | $F = \frac{MS_{between}}{MS_{within}}$ | $(k-1, N-k)$ | — | All $\mu_i$ equal |

</div>

<div style="font-size: 0.6em; margin: 10px auto;">

| Context | Columns of X | Parameters |
|:--------|:-------------|:-----------|
| Simple regression | 1, x | 2 |
| Multiple regression | 1, x₁, x₂, ... | k+1 |
| One-way ANOVA (k groups) | 1, D₁, ..., D_{k-1} | k |
| 2² factorial | 1, A, B, AB | 4 |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 8px; border-radius: 8px; margin: 8px auto; font-size: 0.7em; max-width: 95%;">
<b>Key:</b> $\hat{\beta} = (X^TX)^{-1}X^Ty$ &nbsp;|&nbsp; $\hat{\sigma}^2 = SS_{res}/(n-p)$ &nbsp;|&nbsp; $SE(\hat{\beta}_j) = \hat{\sigma}\sqrt{(X^TX)^{-1}_{jj}}$ &nbsp;|&nbsp; $F = MS_{effect}/MS_{error}$
</div>

---

<!-- .slide:id="plsda-pca-recall" -->
## Recall: PCA and Eigenvectors
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*PCA: Finding directions of maximum scatter*

-! The core idea of *PCA* is eigendecomposition of:

$$\mathbf{X}^T\mathbf{X}$$

-: with $X$ = data matrix (mean-centered)

***

-! *Eigenvectors* of $X^TX$ point in directions of maximum variance in $X$

-! The *eigenvalues* tell us how much variance is captured

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*What does PCA optimize?*

-! PCA uses eigenvectors to project data onto new axes that capture most variance

$$ p = Xw $$
-: where $w$ = eigenvector, $p$ = principal component scores


***

-! PCA is *unsupervised*: It only looks at $X$, ignoring any class information

<div style="background: #1a3d5c; color: #fff; padding: 10px; border-radius: 8px; margin-top: 12px; font-size: 0.85em;">
Problem: Maximum variance ≠ best class separation!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="plsda-y-supervision" -->
## PLS-DA: Supervision through Y
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The key difference: Cross-covariance!*

-! Instead of $X^TX$, PLS-DA uses:

$$\mathbf{X}^T\mathbf{y}$$

-: where $\mathbf{y}$ is the class label vector (e.g., 0/1 coded)

***

-! What does $X^Ty$ represent?

-: *Cross-covariance* between X variables & class labels
-: Shows how each variable correlates with classes
-: Variables that differ between classes get high weights *(important for separation)*

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Comparison: PCA vs. PLS-DA*

<div style="font-size: 0.8em;">

| | **PCA** | **PLS-DA** |
|:--|:--------|:-----------|
| Uses | $X^TX$ | $X^Ty$ |
| Meaning | Covariance of X | Cross-cov. X↔Y |
| Supervised? | ✗ No | ✓ Yes |
| Direction | Max. variance | Max. class correlation |

</div>

***

-< $X^Ty$ tells us which variables are most related to class membership!


<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="plsda-biplot-comparison" -->
## PCA vs. PLS-DA: Bi-Plot Comparison

<div id="biplot-container" style="display: flex; width: 100%; height: 720px; align-items: stretch;">
  <div id="pca-biplot" style="flex: 1; height: 100%;"></div>
  <div id="variance-slider-container" style="width: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px;">
    <div style="font-size: 0.6em; text-align: center; margin-bottom: 8px; color: #ffd43b;"><b>Na & K<br>Variance</b></div>
    <input type="range" id="nak-variance-slider" min="0" max="100" value="50" 
           style="writing-mode: vertical-lr; direction: rtl; height: 400px; width: 24px; cursor: pointer;">
    <div id="variance-value" style="font-size: 0.7em; margin-top: 8px; color: #94a3b8;">σ = 15</div>
  </div>
  <div id="plsda-biplot" style="flex: 1; height: 100%;"></div>
</div>

<script>
(function() {
  // Base data: 15 water samples - Na and K will be overwritten with shared population
  // Groups differ in Ca, Mg, Fe, Mn (class-relevant features)
  const baseData = [
    // River samples (high Ca, Mg, low Fe/Mn)
    { name: 'R1', group: 'River', Ca: 15, Mg: 32, Fe: 0.08, Mn: 0.015 },
    { name: 'R2', group: 'River', Ca: 142, Mg: 38, Fe: 0.10, Mn: 0.020 },
    { name: 'R3', group: 'River', Ca: 38, Mg: 28, Fe: 0.07, Mn: 0.012 },
    { name: 'R4', group: 'River', Ca: 138, Mg: 35, Fe: 0.09, Mn: 0.018 },
    { name: 'R5', group: 'River', Ca: 52, Mg: 30, Fe: 0.08, Mn: 0.014 },
    // Lake samples (low Ca, low Mg, high Fe/Mn)
    { name: 'L1', group: 'Lake', Ca: 125, Mg: 22, Fe: 0.15, Mn: 0.018 },
    { name: 'L2', group: 'Lake', Ca: 72, Mg: 25, Fe: 0.12, Mn: 0.015 },
    { name: 'L3', group: 'Lake', Ca: 118, Mg: 23, Fe: 0.10, Mn: 0.020 },
    { name: 'L4', group: 'Lake', Ca: 90, Mg: 24, Fe: 0.18, Mn: 0.016 },
    { name: 'L5', group: 'Lake', Ca: 106, Mg: 21, Fe: 0.12, Mn: 0.017 },
    // Groundwater samples (medium Ca/Mg, very low Fe/Mn)
    { name: 'G1', group: 'Groundwater', Ca: 55, Mg: 22, Fe: 0.02, Mn: 0.008 },
    { name: 'G2', group: 'Groundwater', Ca: 122, Mg: 25, Fe: 0.03, Mn: 0.010 },
    { name: 'G3', group: 'Groundwater', Ca: 188, Mg: 20, Fe: 0.02, Mn: 0.007 },
    { name: 'G4', group: 'Groundwater', Ca: 42, Mg: 18, Fe: 0.04, Mn: 0.012 },
    { name: 'G5', group: 'Groundwater', Ca: 150, Mg: 24, Fe: 0.03, Mn: 0.009 }
  ];
  
  // Fixed random offsets for Na and K (seeded for reproducibility)
  const naOffsets = [0.2, -0.8, 1.1, -0.3, 0.6, -1.2, 0.9, -0.1, 0.4, -0.7, 1.0, -0.5, 0.3, -0.9, 0.7];
  const kOffsets = [-0.4, 0.9, -0.6, 1.2, 0.2, -0.5, -1.0, 0.8, -0.3, -1.1, -0.7, 0.2, 0.8, 0.6, -0.1];
  
  const elements = ['Ca', 'Mg', 'Na', 'K', 'Fe', 'Mn'];
  const groupColors = { 'River': '#3498db', 'Lake': '#e74c3c', 'Groundwater': '#2ecc71' };
  
  // Na and K population parameters
  const naMean = 40;  // mg/L mean for all samples
  const kMean = 8;    // mg/L mean for all samples
  
  function generateData(naKVariance) {
    // naKVariance: 0-100 slider value, maps to standard deviation
    const naStd = naKVariance * 0.4;  // 0-40 mg/L std
    const kStd = naKVariance * 0.15;   // 0-15 mg/L std
    
    return baseData.map((s, i) => ({
      ...s,
      Na: Math.max(5, naMean + naOffsets[i] * naStd),
      K: Math.max(1, kMean + kOffsets[i] * kStd)
    }));
  }
  
  let currentVariance = 50;
  
  function init() {
    if (typeof d3 === 'undefined') { setTimeout(init, 100); return; }
    
    const slider = document.getElementById('nak-variance-slider');
    const valueDisplay = document.getElementById('variance-value');
    
    if (slider) {
      slider.value = currentVariance;
      slider.oninput = function() {
        currentVariance = parseInt(this.value);
        const stdVal = (currentVariance * 0.4).toFixed(0);
        if (valueDisplay) valueDisplay.textContent = `σ = ${stdVal}`;
        updatePlots();
      };
    }
    
    updatePlots();
  }
  
  function updatePlots() {
    const isPerf = document.body.classList.contains('performance-mode');
    const theme = isPerf ? {
      bg: '#ffffff', plotBg: '#fafafa', axis: '#333', grid: '#ddd', text: '#222',
      arrow: '#666', arrowText: '#444', sliderBg: '#e0e0e0'
    } : {
      bg: '#152238', plotBg: '#1a2d4a', axis: '#94a3b8', grid: '#334155', text: '#e2e8f0',
      arrow: '#fbbf24', arrowText: '#fcd34d', sliderBg: '#334155'
    };
    
    const sampleData = generateData(currentVariance);
    
    // Prepare data matrix
    const X = sampleData.map(s => elements.map(e => s[e]));
    const groups = sampleData.map(s => s.group);
    const names = sampleData.map(s => s.name);
    
    // Standardize data
    const Xs = standardize(X);
    
    // Compute PCA
    const pca = computePCA(Xs);
    
    // Compute PLS-DA
    const plsda = computePLSDA_multiclass(Xs, groups);
    
    // Render both plots
    renderBiplot('pca-biplot', pca, Xs, groups, names, elements, theme, 'PC1', 'PC2', 'PCA (unsupervised)');
    renderBiplot('plsda-biplot', plsda, Xs, groups, names, elements, theme, 'LV1', 'LV2', 'PLS-DA (supervised)');
  }
  
  function standardize(data) {
    const n = data.length, p = data[0].length;
    const means = [], stds = [];
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) sum += data[i][j];
      means[j] = sum / n;
    }
    for (let j = 0; j < p; j++) {
      let ss = 0;
      for (let i = 0; i < n; i++) ss += Math.pow(data[i][j] - means[j], 2);
      stds[j] = Math.sqrt(ss / (n - 1)) || 1;
    }
    return data.map(row => row.map((v, j) => (v - means[j]) / stds[j]));
  }
  
  function computePCA(Xs) {
    const n = Xs.length, p = Xs[0].length;
    const cov = [];
    for (let i = 0; i < p; i++) {
      cov[i] = [];
      for (let j = 0; j < p; j++) {
        let sum = 0;
        for (let k = 0; k < n; k++) sum += Xs[k][i] * Xs[k][j];
        cov[i][j] = sum / (n - 1);
      }
    }
    const { vectors } = powerIteration2(cov, p);
    const scores = Xs.map(row => [
      row.reduce((s, v, j) => s + v * vectors[0][j], 0),
      row.reduce((s, v, j) => s + v * vectors[1][j], 0)
    ]);
    return { scores, loadings: vectors };
  }
  
  function computePLSDA_multiclass(Xs, groups) {
    const n = Xs.length, p = Xs[0].length;
    const uniqueGroups = [...new Set(groups)];
    
    const Y = groups.map(g => uniqueGroups.map(ug => g === ug ? 1 : 0));
    const yMeans = uniqueGroups.map((_, j) => Y.reduce((s, row) => s + row[j], 0) / n);
    const Yc = Y.map(row => row.map((v, j) => v - yMeans[j]));
    
    const XtY = [];
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < uniqueGroups.length; k++) {
          sum += Xs[i][j] * Yc[i][k];
        }
      }
      XtY[j] = sum;
    }
    
    const norm1 = Math.sqrt(XtY.reduce((s, v) => s + v * v, 0)) || 1;
    const w1 = XtY.map(v => v / norm1);
    const t1 = Xs.map(row => row.reduce((s, v, j) => s + v * w1[j], 0));
    
    const Xdefl = Xs.map((row, i) => row.map((v, j) => v - t1[i] * w1[j] * 0.8));
    
    const XtY2 = [];
    for (let j = 0; j < p; j++) {
      let sum = 0;
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < uniqueGroups.length; k++) {
          sum += Xdefl[i][j] * Yc[i][k];
        }
      }
      XtY2[j] = sum;
    }
    
    const dot = XtY2.reduce((s, v, j) => s + v * w1[j], 0);
    const w2orth = XtY2.map((v, j) => v - dot * w1[j]);
    const norm2 = Math.sqrt(w2orth.reduce((s, v) => s + v * v, 0)) || 1;
    const w2 = w2orth.map(v => v / norm2);
    const t2 = Xs.map(row => row.reduce((s, v, j) => s + v * w2[j], 0));
    
    const scores = t1.map((v, i) => [v, t2[i]]);
    return { scores, loadings: [w1, w2] };
  }
  
  function powerIteration2(matrix, p, maxIter = 100) {
    let v1 = Array(p).fill(1).map(() => Math.random());
    for (let iter = 0; iter < maxIter; iter++) {
      const v1new = Array(p).fill(0);
      for (let i = 0; i < p; i++) {
        for (let j = 0; j < p; j++) v1new[i] += matrix[i][j] * v1[j];
      }
      const norm = Math.sqrt(v1new.reduce((s, v) => s + v * v, 0)) || 1;
      v1 = v1new.map(v => v / norm);
    }
    
    const matrix2 = matrix.map((row, i) => row.map((v, j) => v - v1[i] * v1[j] * (v1.reduce((s, x, k) => s + matrix[k][k] * x * x, 0))));
    
    let v2 = Array(p).fill(1).map(() => Math.random());
    for (let iter = 0; iter < maxIter; iter++) {
      const v2new = Array(p).fill(0);
      for (let i = 0; i < p; i++) {
        for (let j = 0; j < p; j++) v2new[i] += matrix2[i][j] * v2[j];
      }
      const dot = v2new.reduce((s, v, i) => s + v * v1[i], 0);
      const v2orth = v2new.map((v, i) => v - dot * v1[i]);
      const norm = Math.sqrt(v2orth.reduce((s, v) => s + v * v, 0)) || 1;
      v2 = v2orth.map(v => v / norm);
    }
    
    return { vectors: [v1, v2] };
  }
  
  function renderBiplot(containerId, result, Xs, groups, names, elements, theme, xLabel, yLabel, title) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 680;
    const margin = { top: 45, right: 25, bottom: 50, left: 50 };
    
    const svg = d3.select(`#${containerId}`).append('svg')
      .attr('width', width).attr('height', height);
    
    svg.append('rect').attr('width', width).attr('height', height)
      .attr('fill', theme.plotBg).attr('rx', 8);
    
    // Title
    svg.append('text')
      .attr('x', width / 2).attr('y', 22)
      .attr('text-anchor', 'middle').attr('fill', theme.text)
      .attr('font-size', '14px').attr('font-weight', 'bold')
      .text(title);
    
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;
    
    const scores = result.scores;
    const xExt = d3.extent(scores.map(s => s[0]));
    const yExt = d3.extent(scores.map(s => s[1]));
    const pad = 0.25;
    const xRange = (xExt[1] - xExt[0]) || 2;
    const yRange = (yExt[1] - yExt[0]) || 2;
    
    const xScale = d3.scaleLinear()
      .domain([xExt[0] - xRange * pad, xExt[1] + xRange * pad])
      .range([0, w]);
    const yScale = d3.scaleLinear()
      .domain([yExt[0] - yRange * pad, yExt[1] + yRange * pad])
      .range([h, 0]);
    
    // Grid
    g.selectAll('line.gridX').data(xScale.ticks(5)).enter()
      .append('line').attr('class', 'gridX')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', 0).attr('y2', h)
      .attr('stroke', theme.grid).attr('opacity', 0.4);
    g.selectAll('line.gridY').data(yScale.ticks(5)).enter()
      .append('line').attr('class', 'gridY')
      .attr('x1', 0).attr('x2', w)
      .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', theme.grid).attr('opacity', 0.4);
    
    // Zero lines
    g.append('line').attr('x1', xScale(0)).attr('x2', xScale(0))
      .attr('y1', 0).attr('y2', h).attr('stroke', theme.axis).attr('stroke-dasharray', '3,3').attr('opacity', 0.6);
    g.append('line').attr('x1', 0).attr('x2', w)
      .attr('y1', yScale(0)).attr('y2', yScale(0)).attr('stroke', theme.axis).attr('stroke-dasharray', '3,3').attr('opacity', 0.6);
    
    // Loading arrows
    const loadings = result.loadings;
    const loadScale = Math.min(w, h) * 0.32;
    
    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow-' + containerId)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8).attr('refY', 0)
      .attr('markerWidth', 5).attr('markerHeight', 5)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', theme.arrow);
    
    elements.forEach((el, j) => {
      const lx = loadings[0][j] * loadScale;
      const ly = -loadings[1][j] * loadScale;
      
      // Highlight Na and K arrows differently
      const isNaK = (el === 'Na' || el === 'K');
      const arrowColor = isNaK ? '#ff6b6b' : theme.arrow;
      const textColor = isNaK ? '#ff6b6b' : theme.arrowText;
      const strokeWidth = isNaK ? 3 : 2;
      
      g.append('line')
        .attr('x1', w/2).attr('y1', h/2)
        .attr('x2', w/2 + lx).attr('y2', h/2 + ly)
        .attr('stroke', arrowColor).attr('stroke-width', strokeWidth)
        .attr('marker-end', 'url(#arrow-' + containerId + ')');
      
      g.append('text')
        .attr('x', w/2 + lx * 1.15)
        .attr('y', h/2 + ly * 1.15)
        .attr('text-anchor', 'middle')
        .attr('fill', textColor)
        .attr('font-size', '11px')
        .attr('font-weight', 'bold')
        .text(el);
    });
    
    // Sample points
    scores.forEach((s, i) => {
      g.append('circle')
        .attr('cx', xScale(s[0]))
        .attr('cy', yScale(s[1]))
        .attr('r', 8)
        .attr('fill', groupColors[groups[i]])
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.9);
      
      g.append('text')
        .attr('x', xScale(s[0]) + 10)
        .attr('y', yScale(s[1]) + 3)
        .attr('fill', theme.text)
        .attr('font-size', '9px')
        .text(names[i]);
    });
    
    // Axes
    g.append('g').attr('transform', `translate(0,${h})`).call(d3.axisBottom(xScale).ticks(4))
      .selectAll('text').attr('fill', theme.text).attr('font-size', '10px');
    g.append('g').call(d3.axisLeft(yScale).ticks(4))
      .selectAll('text').attr('fill', theme.text).attr('font-size', '10px');
    g.selectAll('.domain, .tick line').attr('stroke', theme.axis);
    
    // Axis labels
    svg.append('text')
      .attr('x', margin.left + w/2).attr('y', height - 8)
      .attr('text-anchor', 'middle').attr('fill', theme.text)
      .attr('font-size', '12px').text(xLabel);
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(margin.top + h/2)).attr('y', 14)
      .attr('text-anchor', 'middle').attr('fill', theme.text)
      .attr('font-size', '12px').text(yLabel);
    
    // Legend
    const legend = svg.append('g').attr('transform', `translate(${margin.left + 5}, ${margin.top + 5})`);
    const legendGroups = Object.keys(groupColors);
    legendGroups.forEach((grp, i) => {
      legend.append('circle').attr('cx', 0).attr('cy', i * 18).attr('r', 6).attr('fill', groupColors[grp]);
      legend.append('text').attr('x', 12).attr('y', i * 18 + 4).attr('fill', theme.text).attr('font-size', '10px').text(grp);
    });
  }
  
  init();
  if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', e => { if (e.currentSlide.querySelector('#pca-biplot')) init(); });
    Reveal.on('ready', e => { if (e.currentSlide.querySelector('#pca-biplot')) init(); });
  }
  window.addEventListener('resize', () => { if (document.getElementById('pca-biplot')) updatePlots(); });
})();
</script>
