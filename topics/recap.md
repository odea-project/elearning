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