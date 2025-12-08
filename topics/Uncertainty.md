---
title: "Uncertainty & Error Analysis"
author: "Gerrit Renner"
keywords: ["uncertainty", "error propagation", "bootstrap", "Monte Carlo", "confidence intervals", "prediction intervals", "random error", "systematic error"]
requirements: ["Mean Values", "Variance", "Linear Regression"]
description: "Understanding and quantifying uncertainty in water science measurements and chemometric analyses"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Variance
- Linear Regression

---

<!-- .slide:id="motivation-intro" -->
## Why Uncertainty Matters
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*A Measurement Without Uncertainty is Meaningless*

-! Consider this result from a water quality analysis:

<div style="background: #702914ff; color: #ffffff; padding: 12px 16px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
Nitrate concentration: 10.5 mg/L
</div>

***

-? What is the **problem** with this result?

-: We don't know how **reliable** this value is!

***

-! It makes a huge difference whether:
-: $10.5 \pm 0.1$ mg/L (very precise)
-: $10.5 \pm 5.0$ mg/L (highly uncertain)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Real-World Consequences*

-! **Regulatory decisions** depend on uncertainty:

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.8em;">
EU Nitrate Directive: Limit = 50 mg/L<br>
If measured = 48 ± 5 mg/L → compliant?
</div>

***

-! **Scientific conclusions** require uncertainty:
-: Is the difference between two samples significant?
-: Can we trust the calibration curve?

***

-= Uncertainty quantification is essential for credible science!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="uncertainty-vs-error" -->
## Uncertainty vs. Error
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! **Error**:
-: The difference between a measured and true value
-: Can be positive or negative
-: Unknown in practice (true value is unknown)

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
Error quantifies how wrong a measurement is. It is based on the true value.
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! **Uncertainty**:
-: The range within the true value is estimated to lie
-: Always positive or zero
-: Quantifiable through statistical methods

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
Uncertainty quantifies wrong a measurement could be. It is based on measurement data.
</div>

-< In statistics, we mostly deal with *uncertainty*, since the true value is unknown.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="types-of-uncertainty" -->
## Types of Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Classification of Uncertainties*

-! **Random** uncertainty
-: Unpredictable variations in measurements
-: Follows statistical distributions
-: Reduces with more measurements (averaging)

***
-! **Systematic** uncertainty
-: Consistent bias in one direction
-: Hard to detect without reference
-: Does NOT reduce with averaging

***

-! **Model** uncertainty
-: Assumptions in mathematical models
-: Simplifications of complex systems
-: Often underestimated!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="uncertainty-types-chart" style="width: 100%; min-height: 550px;"></div>

<script src="resources/js/charts/uncertainty_types_demo.js"></script>

*Key Distinctions*

-: Random → reducible by replication
-: Systematic → requires calibration/correction
-: Model → requires validation/refinement

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="random-uncertainty" -->
## Random Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Sources in Water Analysis*

-! e.g., **Instrument noise**
-: Detector fluctuations
-: Electronic interference

***

-! e.g., **Sampling variability**
-: Heterogeneous samples
-: Temporal variations

***

-! e.g., **Environmental fluctuations**
-: Temperature changes
-: Pressure variations

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Characteristics*

-! Random errors:
-: Follow normal distribution (often)
-: Cancel out on average
-: Quantified by standard deviation

$$\sigma = \sqrt{\frac{\sum_{i=1}^{n}(x_{i} - \bar{x})^2}{n-1}}$$

***

-! Reducing random uncertainty:
-: Increase number of replicates
-: Standard error decreases as $\frac{\sigma}{\sqrt{n}}$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="systematic-uncertainty" -->
## Systematic Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Sources in Water Analysis*

-! e.g., **Calibration bias**
-: Incorrect standard concentrations
-: Matrix mismatch

***

-! e.g., **Method bias**
-: Incomplete extraction/digestion
-: Interferences

***

-! e.g., **Instrument drift**
-: Baseline shifts over time
-: Degradation of components

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Detection and Correction*

-! Systematic errors are tricky:
-: Consistent → don't average out
-: Hidden → need external reference

***

-! Detection methods:
-: Standard Reference Materials (SRM)
-: Inter-laboratory comparisons
-: Spike recovery experiments

***

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Warning:</b> Averaging more replicates does NOT reduce systematic error!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="standard-sample-standard-approach" -->
## Standard Sample Standard Approach (Example)

<div id="sss-demo-chart" style="width: 100%; min-height: 700px;"></div>

<script src="resources/js/charts/standard_sample_standard_demo.js"></script>

---

<!-- .slide:id="model-uncertainty" -->
## Model Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Sources*

-! **Simplified assumptions**
-: Linear relationships (often non-linear)
-: Steady-state conditions

***

-! **Parameter estimation**
-: Calibration curve extrapolation
-: Regression coefficients

***

-! **Missing variables**
-: Unaccounted influences
-: Hidden confounders

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Beer-Lambert Law*

$$A = \varepsilon \cdot c \cdot l$$

-! Assumptions that may fail:
-: Monochromatic light
-: Dilute solutions
-: No scattering/fluorescence

***

-< When the model is wrong, even perfect measurements give wrong results!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="variance-sd-se" -->
## Uncertainty of Measurement Quantities
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Variance, SD, and SE: Recap*

-! **Variance** ($s^2$):

$$s^2 = \frac{\sum_{i=1}^{n}(x_{i} - \bar{x})^2}{n-1}$$

***

-! **Standard Deviation** ($s$): 

$$s = \sqrt{s^2}$$

***

-! **Standard Error** ($SE$): 

$$SE = \frac{s}{\sqrt{n}}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Which to Use When?*

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>SD</b> → Describes data spread<br>
"How variable are individual measurements?"
</div>

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>SE</b> → Describes mean precision<br>
"How precise is our estimate of the mean?"
</div>

***

-! Rule of thumb:
-: Report **SD** when describing variability
-: Report **SE** when reporting mean ± uncertainty

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="measurement-uncertainty-example" -->
## Example: Dissolved Oxygen Measurements
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

-! 10 replicate DO measurements (mg/L):

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
[8.21, 8.15, 8.32, 8.18, 8.25, 8.19, 8.28, 8.22, 8.17, 8.24]
</div>

***

-? Calculate: Mean, SD, SE
-? How would you report this result?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="do-uncertainty-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Dissolved oxygen measurements (mg/L)
do_data <- c(8.21, 8.15, 8.32, 8.18, 8.25, 
             8.19, 8.28, 8.22, 8.17, 8.24)

# Calculate statistics
n <- length(do_data)
mean_do <- mean(do_data)
sd_do <- sd(do_data)
se_do <- sd_do / sqrt(n)

cat("Mean:", round(mean_do, 3), "mg/L\\n")
cat("SD:", round(sd_do, 4), "mg/L\\n")
cat("SE:", round(se_do, 4), "mg/L\\n")
cat("=== Report as ===\\n")
cat("DO =", round(mean_do, 2), "±", round(se_do, 3), "mg/L (SE, n=10)")`;

    const fallback = () => {
      const data = [8.21, 8.15, 8.32, 8.18, 8.25, 8.19, 8.28, 8.22, 8.17, 8.24];
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
      const sd = Math.sqrt(variance);
      const se = sd / Math.sqrt(data.length);
      return `[Simulated]\nn = ${data.length}\nMean: ${mean.toFixed(3)} mg/L\nSD: ${sd.toFixed(4)} mg/L\nSE: ${se.toFixed(4)} mg/L`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'do-uncertainty-container',
      code: code,
      slideId: 'measurement-uncertainty-example',
      fallback: fallback,
      runLabel: 'Calculate Statistics'
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

<!-- .slide:id="propagation-intro" -->
## Uncertainty of Measurement Results
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Central Problem*

-! Measured quantities are often combined:
-: Concentration from absorbance
-: Flow rate from velocity × area
-: Mass flux from concentration × flow

***

-! Each input has its own uncertainty

-? How does uncertainty **propagate** to the result?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The General Question*

-! If we have a function:

$$z = f(x_1, x_2, \ldots, x_n)$$

-: And each $x_i$ has uncertainty $\sigma_{x_i}$

-? What is the uncertainty $\sigma_z$ of the result?

***

-! Three main approaches:
-: Analytical (partial derivatives)
-: Bootstrap (resampling)
-: Monte Carlo (simulation)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="error-propagation-example" -->
## Introducing Problem
-! Given a function for calculating the peak area from absorbance (Gaussian peak):
$$A = h \cdot \sigma \cdot \sqrt{2\pi}$$

-? What is the uncertainty in $A$ (called $\sigma_A$)? 
-? What do we need to know?

---

<!-- .slide:id="error-propagation-theory" -->
## Error Propagation: Analytical Approach
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The General Formula*

-! For independent uncertainties:

$$\sigma_z = \sqrt{\sum_{i=1}^{n} \left( \frac{\partial f}{\partial x_i} \cdot \sigma_{x_i} \right)^2}$$

***

-! Each term represents:
-: **Sensitivity** ($\frac{\partial f}{\partial x_i}$): How much does $z$ change when $x_i$ changes?
-: **Uncertainty** ($\sigma_{x_i}$): How much does $x_i$ vary?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Key Insight*

-! The contribution of each variable depends on:
-: Its uncertainty
-: Its influence on the result

***

-! A variable with large uncertainty but small influence may contribute less than one with small uncertainty but large influence!

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Rule:</b> Identify and reduce the dominant uncertainty source!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="propagation-simple-rules" -->
## Simple Propagation Rules, A Helpful Shortcut
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Addition and Subtraction*

-! For $z = x + y$ or $z = x - y$:

$$\sigma_z = \sqrt{\sigma_x^2 + \sigma_y^2}$$

***

-! Example: Total mass
-: $m_1 = 10.0 \pm 0.2$ g
-: $m_2 = 15.0 \pm 0.3$ g
-: $m_{total} = 25.0 \pm \sqrt{0.04 + 0.09}$
-: $m_{total} = 25.0 \pm 0.36$ g

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Multiplication and Division*

-! For $z = x \cdot y$ or $z = x / y$:

$$\frac{\sigma_z}{|z|} = \sqrt{\left(\frac{\sigma_x}{x}\right)^2 + \left(\frac{\sigma_y}{y}\right)^2}$$

***

-! Example: Concentration
-: $n = 0.50 \pm 0.02$ mol
-: $V = 2.0 \pm 0.1$ L
-: $c = n/V = 0.25$ M
-: $\frac{\sigma_c}{0.25} = \sqrt{(0.04)^2 + (0.05)^2} = 0.064$
-: $c = 0.25 \pm 0.016$ M

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="spectroscopy-example" -->
## Example 1: UV-Vis Spectroscopy
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Beer-Lambert Law*

$$c = \frac{A}{\varepsilon \cdot l}$$

-! Where:
-: $A$ = absorbance (measured)
-: $\varepsilon$ = molar absorptivity (from literature)
-: $l$ = path length (cuvette)

***

*Given uncertainties:*
-: $A = 0.542 \pm 0.008$
-: $\varepsilon = 15000 \pm 300$ L/(mol·cm)
-: $l = 1.00 \pm 0.01$ cm

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Propagation Calculation*

-! Partial derivatives:

<div style="font-size: 0.85em;">

| **$\frac{\partial c}{\partial A}$** | **$\frac{\partial c}{\partial \varepsilon}$** | **$\frac{\partial c}{\partial l}$** |
|:-------------------------------:|:-----------------------------------------:|:-------------------------------:|
| $\frac{1}{\varepsilon \cdot l}$ | $-\frac{A}{\varepsilon^2 \cdot l}$       | $-\frac{A}{\varepsilon \cdot l^2}$ |

</div>

***

<div id="spectroscopy-error-container"></div>

<script src="resources/js/charts/spectroscopy_error_propagation.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="spectroscopy-calculation" -->
## UV-Vis Example: Full Calculation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Interpretation*

-! The **molar absorptivity** ($\varepsilon$) dominates!

***

-! To reduce total uncertainty:
-: Better characterize $\varepsilon$ (more careful calibration)
-: Or accept literature values and focus elsewhere

***

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Result:</b><br>
$c = 36.1 \pm 0.97$ µmol/L<br>
(Relative uncertainty: ~2.7%)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="spectroscopy-calc-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Beer-Lambert Law: c = A / (epsilon * l)
A <- 0.542        # Absorbance
eps <- 15000      # Molar absorptivity (L/mol/cm)
l <- 1.00         # Path length (cm)

# Uncertainties
sigma_A <- 0.008
sigma_eps <- 300
sigma_l <- 0.01

# Calculate concentration
c <- A / (eps * l)

# Partial derivatives
dc_dA <- 1 / (eps * l)
dc_deps <- -A / (eps^2 * l)
dc_dl <- -A / (eps * l^2)

# Error propagation
sigma_c <- sqrt((dc_dA * sigma_A)^2 + 
                (dc_deps * sigma_eps)^2 + 
                (dc_dl * sigma_l)^2)

cat("=== UV-Vis Concentration Uncertainty ===\\n")
cat("Concentration:", format(c * 1e6, digits=4), "µmol/L\\n")
cat("Uncertainty:", format(sigma_c * 1e6, digits=3), "µmol/L\\n")
cat("Relative contributions:\\n")
cat("  From A:", round((dc_dA * sigma_A)^2 / sigma_c^2 * 100, 1), "%\\n")
cat("  From ε:", round((dc_deps * sigma_eps)^2 / sigma_c^2 * 100, 1), "%\\n")
cat("  From l:", round((dc_dl * sigma_l)^2 / sigma_c^2 * 100, 1), "%\\n")`;

    const fallback = () => {
      return `[Simulated]\nConcentration: 36.13 µmol/L\nUncertainty: 1.15 µmol/L\n\nRelative contributions:\n  From A: 28.5%\n  From ε: 48.3%\n  From l: 23.2%`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'spectroscopy-calc-container',
      code: code,
      slideId: 'spectroscopy-calculation',
      fallback: fallback,
      runLabel: 'Calculate Uncertainty'
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

<!-- .slide:id="simple-propagation-uvvis" -->
## UV-Vis: Simple Propagation Rule
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Alternative: Using Relative Uncertainties*

-! Since $c = \frac{A}{\varepsilon \cdot l}$ involves only **×** and **/**:

$$\frac{\sigma_c}{c} = \sqrt{\left(\frac{\sigma_A}{A}\right)^2 + \left(\frac{\sigma_\varepsilon}{\varepsilon}\right)^2 + \left(\frac{\sigma_l}{l}\right)^2}$$

***

-! Plugging in values:

<div style="font-size: 0.85em;">

| Variable | Value | sigma | Rel. sigma |
|:--------:|:-----:|:--------:|:-------------:|
| A | 0.542 | 0.008 | 1.48% |
| ε | 15000 | 300 | 2.00% |
| l | 1.00 | 0.01 | 1.00% |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Quick Calculation*

$$\frac{\sigma_c}{c} = \sqrt{0.0148^2 + 0.0200^2 + 0.0100^2}$$

$$= \sqrt{0.000219 + 0.000400 + 0.000100}$$

$$= \sqrt{0.000719} = 0.0268 = 2.68\%$$

***

-! With $c = 36.13$ µmol/L:
-: $\sigma_c = 0.0268 \times 36.13 = 0.97$ µmol/L

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Same result!</b> But we don't need to compute partial derivatives.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="chromatography-example" -->
## Example 2: Internal Standard Method in HPLC
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Concentration from Peak Area*

$$c_{sample} = c_{std} \cdot \frac{A_{sample}}{A_{std}}$$

***

-! Uncertainties in:
-: Standard concentration ($c_{std}$)
-: Peak areas ($A_{sample}$, $A_{std}$)

***

*Typical values:*
-: $c_{std} = 100.0 \pm 1.0$ µg/L
-: $A_{sample} = 45280 \pm 450$
-: $A_{std} = 52100 \pm 520$


<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="hplc-calc-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# HPLC quantification
c_std <- 100.0      # Standard concentration (µg/L)
A_sample <- 45280   # Sample peak area
A_std <- 52100      # Standard peak area

# Uncertainties (assuming same injection volume)
sigma_c_std <- 1.0
sigma_A_sample <- 450
sigma_A_std <- 520

# Calculate sample concentration
c_sample <- c_std * (A_sample / A_std)

# Simple propagation for multiplication/division
rel_sigma_c_std <- sigma_c_std / c_std
rel_sigma_A_sample <- sigma_A_sample / A_sample
rel_sigma_A_std <- sigma_A_std / A_std

rel_sigma_c <- sqrt(rel_sigma_c_std^2 + rel_sigma_A_sample^2 + rel_sigma_A_std^2)
sigma_c <- rel_sigma_c * c_sample

cat("=== HPLC Quantification Uncertainty ===\\n")
cat("Sample concentration:", round(c_sample, 2), "µg/L\\n")
cat("Uncertainty:", round(sigma_c, 2), "µg/L\\n")
cat("Relative uncertainty:", round(sigma_c/c_sample*100, 2), "%\\n")`;

    const fallback = () => {
      return `[Simulated]\nSample concentration: 86.91 µg/L\nUncertainty: 1.42 µg/L\nRelative uncertainty: 1.64%`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'hplc-calc-container',
      code: code,
      slideId: 'chromatography-example',
      fallback: fallback,
      runLabel: 'Calculate'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

-? Which uncertainty source dominates?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="confidence-bands-intro" -->
## Confidence & Prediction Bands
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Two Types of Uncertainty Bands*

-! **Confidence Band** (CI)
-: Uncertainty in the *regression line itself*
-: "Where might the true line be?"
-: Narrows with more data

***

-! **Prediction Band** (PI)
-: Uncertainty for a *new observation*
-: "Where might a future measurement fall?"
-: Always wider than CI

***

-= PI includes both regression uncertainty AND residual scatter!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="confidence-prediction-bands-chart" style="width: 100%; min-height: 500px;"></div>

<script src="resources/js/charts/confidence_prediction_bands.js"></script>

***

-: Blue band: Confidence interval
-: Gray band: Prediction interval

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="confidence-band-formula" -->
## Confidence Interval for Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Confidence Interval for $y\_{hat}$*

-! For a given predictor vector $\mathbf{x}$:

<div style="font-size: 0.85em;">

$$\text{CI}(y\_{hat}) = y\_{hat} \pm t_{\text{crit}} \cdot \sqrt{\mathbf{x}^\top \text{Var}(\boldsymbol{\beta}\_{hat}) \mathbf{x}}$$

</div>

-: $\mathbf{x}$ = predictor vector (incl. intercept)
-: $\text{Var}(\boldsymbol{\beta}\_{hat}) = \sigma\_{hat}^2 (\mathbf{X}^\top \mathbf{X})^{-1}$
-: $t_{\text{crit}}$ = critical t-value for confidence level

***

-! CI is narrowest at $\bar{x}$ (the mean of x)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Prediction Interval for New $y$*

<div style="font-size: 0.85em;">

$$\text{PI}(y_{\text{new}}) = y\_{hat} \pm t_{\text{crit}} \cdot \sqrt{\mathbf{x}^\top \text{Var}(\boldsymbol{\beta}\_{hat}) \mathbf{x} + \sigma\_{hat}^2}$$

</div>

***

-! Note the extra "$+ \sigma\_{hat}^2$" term!

***

-! This accounts for:
-: Uncertainty in the line (same as CI)
-: PLUS residual variance ($\sigma\_{hat}^2$)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="from-uncertainty-to-bands" -->
## From Uncertainty to Bands: Understanding the Matrix Formula
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Breaking Down the Formula*
$$\sqrt{\mathbf{x}^\top \text{Var}(\boldsymbol{\beta}\_{hat}) \mathbf{x}}$$
-: This is the matrix equivalent of the general error propagation formula
-: Captures how uncertainty in coefficients propagates to predictions

***

$$\sigma_y = \sqrt{\mathbf{x}^\top \text{Var}(\boldsymbol{\beta}\_{hat}) \mathbf{x}} = \sqrt{\sum_{i=0}^{p} \left( \frac{\partial y}{\partial \beta_i} \cdot \sigma_{\beta_i} \right)^2}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Final Confidence Interval Expression*
$$ CI(y\_{hat}) = y\_{hat} \pm t_{\text{crit}} \cdot \sigma_y $$
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="when-analytical-fails" -->
## When Analytical Propagation Fails
-! Given a function:

$$ z = median(x_1, x_2, \ldots, x_n) $$
-: The median function is non-linear and non-differentiable at certain points
-: Analytical propagation using partial derivatives is not feasible

--- OR ---

-! Given a complex model (e.g., machine learning model)

$$ z = isContaminated(features) $$
-: The model may not have a closed-form expression
-: Analytical propagation is impractical

---

<!-- .slide:id="bootstrap-intro-animation" -->
## Bootstrapping: Idea

<div id="bootstrap-idea-chart" style="width:100%; display:flex; justify-content:center; margin-top:-20px;"></div>
<script src="resources/js/charts/bootstrap_idea_animation.js"></script>

---

<!-- .slide:id="bootstrap-intro" -->
## Bootstrapping: Concept
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Bootstrap?*

-! A **resampling** method to estimate uncertainty

***

-! Key idea:
-: Sample from your data *with replacement*
-: Create many "pseudo-datasets"
-: Calculate statistic for each
-: Distribution of statistics = uncertainty estimate

***

-! No assumptions about data distribution needed!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Bootstrap Algorithm*

1. Original data: $[x_1, x_2, \ldots, x_n]$

2. Repeat B times (e.g., B = 10000):
   - Draw n samples *with replacement*
   - Calculate statistic (mean, slope, etc.)

3. Result: B estimates of the statistic

4. Uncertainty = SD of the B estimates

5. Confidence intervals from percentiles (e.g., 2.5th and 97.5th percentiles)

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Example:</b> Original [3, 5, 7, 9]<br>
Resample might be [5, 5, 3, 9] or [7, 3, 3, 7]
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bootstrap-visual" -->
## Bootstrap: Visual Demonstration

<div id="bootstrap-demo-chart" style="width: 100%; min-height: 600px;"></div>

<script src="resources/js/charts/bootstrap_demonstration.js"></script>

---

<!-- .slide:id="bootstrap-harmonic-visual" -->
## Bootstrap: Harmonic Mean for Flow Velocities

<div id="bootstrap-harmonic-chart" style="width: 100%; min-height: 620px;"></div>

<script src="resources/js/charts/bootstrap_harmonic_mean.js"></script>

---

<!-- .slide:id="bootstrap-mean-example" -->
## Bootstrap Example: Mean Concentration
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

-! 8 water samples analyzed for nitrate (mg/L):

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
[12.3, 15.1, 11.8, 14.2, 13.5, 16.8, 12.9, 14.7]
</div>

***

-! Small sample size → bootstrap is ideal!

-? What is the uncertainty of the mean?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="bootstrap-mean-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Nitrate data (mg/L)
nitrate <- c(12.3, 15.1, 11.8, 14.2, 13.5, 16.8, 12.9, 14.7)

# Bootstrap the mean
set.seed(42)
B <- 10000
boot_means <- replicate(B, mean(sample(nitrate, replace = TRUE)))

# Results
cat("=== Bootstrap Mean Uncertainty ===\\n")
cat("Original mean:", round(mean(nitrate), 2), "mg/L\\n")
cat("Bootstrap SE:", round(sd(boot_means), 3), "mg/L\\n")
cat("\\n95% CI (percentile method):\\n")
cat("  [", round(quantile(boot_means, 0.025), 2), ",", 
    round(quantile(boot_means, 0.975), 2), "] mg/L\\n")

# Compare with classical SE
cat("\\nClassical SE:", round(sd(nitrate)/sqrt(length(nitrate)), 3), "mg/L")`;

    const fallback = () => {
      return `[Simulated]\nOriginal mean: 13.91 mg/L\nBootstrap SE: 0.548 mg/L\n\n95% CI (percentile method):\n  [12.85, 14.97] mg/L\n\nClassical SE: 0.569 mg/L`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'bootstrap-mean-container',
      code: code,
      slideId: 'bootstrap-mean-example',
      fallback: fallback,
      runLabel: 'Run Bootstrap'
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

<!-- .slide:id="bootstrap-regression-example" -->
## Bootstrap Example: Calibration Curve
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Bootstrapping Regression Coefficients*

-! For each bootstrap sample:
-: Resample (x, y) pairs
-: Fit regression line
-: Store slope and intercept

***

-! Result: Distributions of $\beta_0$ and $\beta_1$

***

-! Advantages:
-: No normality assumption
-: Works with non-linear models
-: Captures correlation between parameters

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="bootstrap-regression-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Calibration data
conc <- c(0, 1, 2, 3, 4, 5)
signal <- c(0.02, 0.98, 2.15, 2.89, 4.12, 4.95)
n <- length(conc)

# Bootstrap regression coefficients
set.seed(42)
B <- 5000
boot_coefs <- matrix(NA, B, 2)

for(i in 1:B) {
  idx <- sample(1:n, n, replace = TRUE)
  boot_model <- lm(signal[idx] ~ conc[idx])
  boot_coefs[i,] <- coef(boot_model)
}

# Original fit
orig_model <- lm(signal ~ conc)

cat("=== Bootstrap Regression Uncertainty ===\\n")
cat("Intercept:", round(coef(orig_model)[1], 3), 
    "± SE:", round(sd(boot_coefs[,1]), 4), "\\n")
cat("Slope:", round(coef(orig_model)[2], 3), 
    "± SE:", round(sd(boot_coefs[,2]), 4), "\\n")
cat("\\n95% CI for slope: [", 
    round(quantile(boot_coefs[,2], 0.025), 3), ",",
    round(quantile(boot_coefs[,2], 0.975), 3), "]")`;

    const fallback = () => {
      return `[Simulated]\nIntercept: 0.023 ± SE: 0.145\nSlope: 0.993 ± SE: 0.042\n\n95% CI for slope: [0.912, 1.078]`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'bootstrap-regression-container',
      code: code,
      slideId: 'bootstrap-regression-example',
      fallback: fallback,
      runLabel: 'Bootstrap Regression'
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

<!-- .slide:id="monte-carlo-intro-problem" -->
## When bootstrap is not applicable
-! Bootstrap resamples existing data

-? But what if we don't have data yet?

***

-! Example scenarios:
-: Testing a new peak detection algorithm
-: Evaluating sensor performance under varying conditions
-: Studying system behavior with controlled input variations

---

<!-- .slide:id="monte-carlo-idea-animation" -->
## Monte Carlo: Idea
-? How can we find the limits for our peak detection algorithm?
-? More concretely, at what S/N ratio will it detect peaks 95% of the time?

<div id="monte-carlo-idea-chart" style="width:100%; display:flex; justify-content:center; margin-top:-20px;"></div>
<script src="resources/js/charts/monte_carlo_idea_animation.js"></script>

---

<!-- .slide:id="monte-carlo-intro" -->
## Monte Carlo Simulation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Monte Carlo?*

-! Simulate experiments by generating **synthetic** data

***

-! The MC approach:
-: Define probability distributions for all inputs
-: Randomly sample from each distribution
-: Run your analysis on synthetic data
-: Repeat thousands of times → get distribution of results

<div style="font-size: 0.75em;">

| Bootstrap | Monte Carlo |
|-----------|-------------|
| Resamples **existing** data | Generates **new** data |
| "How variable is my estimate?" | "What happens under different conditions?" |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why Monte Carlo?*

-! Answer questions that can't be measured directly:
-: "At what S/N will my peak detector work 95% of the time?"
-: "How does baseline drift affect my quantification?"
-: "What's the probability of a false positive?"

***

-! Control individual factors:
-: Isolate effect of noise vs. peak width vs. baseline
-: Test edge cases systematically
-: Understand system behavior before real experiments

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Power of MC:</b> Test thousands of scenarios in seconds!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="monte-carlo-algorithm" -->
## Monte Carlo Algorithm
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*General Framework*

1. Define input distributions
-: What parameters vary?
-: What are their distributions?

2. Generate synthetic data
-: Sample from distributions
-: Create realistic data (signal + noise)

3. Apply your method
-: Run detection/quantification/analysis

4. Collect results
-: Did it work? What was the result?

5. Analyze statistics
-: Success rate, bias, variance

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Peak Detection Example* (Pseudocode)

```python
for i in 1 to N:
  # 1. Sample parameters
  signal ~ Normal(100, 10)
  noise_sd ~ Normal(20, 5)
  width ~ Normal(0.5, 0.05)
  # 2. Generate synthetic peak
  peak = gaussian(signal, width)
  data = peak + noise(noise_sd)
  # 3. Apply detection algorithm
  detected = detect_peak(data)
  # 4. Store result
  results[i] = detected
# 5. Calculate detection rate
detection_rate = mean(results)
```

-! This tells us: probability of detection for given parameter distributions!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="mc-peak-detection-problem" -->
## MC Case Study: Peak Detection Reliability
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Real-World Problem*

-! You develop a peak detection algorithm

-! **Critical question:**
> "At what Signal-to-Noise ratio will peaks be detected in **95% of cases**?"

***

-! This cannot be answered by:
-: Single measurement (too variable)
-: Analytical calculation (too complex)
-: Bootstrap (need synthetic data with known truth)

***

-! **Monte Carlo is the solution!**

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*What Affects Peak Detection?*

-! **Primary factors:**
-: Signal-to-Noise ratio (S/N)
-: Peak width (narrow peaks harder)
-: Noise characteristics (white vs. colored)

***

-! **Secondary factors:**
-: Baseline drift
-: Peak shape (tailing, fronting)
-: Sampling rate (points per peak)
-: Detection algorithm parameters

***

-! MC lets us **isolate and study each factor**!

<div style="background: #2d5016; color: #ffffff; padding: 10px; border-radius: 8px; margin: 10px 0;">
<b>Strategy:</b> Vary one factor, hold others constant → understand its impact
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="mc-ftest-detection" -->
## Peak Detection: The F-Test Approach
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Statistical Peak Detection*

-! Simple threshold (Signal > 3σ) is **naive**!

-! Better approach: **Global F-test**

***

*Concept:*
1. **Null model:** Data = Baseline only
   - $y = a + bt$ (linear baseline)
   
2. **Full model:** Data = Baseline + Peak
   - $y = a + bt + h \cdot e^{-\frac{(t-\mu)^2}{2\sigma^2}}$

3. **F-test:** Is the peak model significantly better?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The F-Statistic*

$$F = \frac{(RSS_{null} - RSS_{full}) / \Delta df}{RSS_{full} / df_{full}}$$

-: $RSS$ = Residual Sum of Squares
-: $\Delta df$ = extra parameters in peak model (≈2)
-: $df_{full}$ = degrees of freedom of full model

***

-! **Decision:**
-: If $F > F_{crit}(\alpha=0.05)$ → Peak detected!
-: Otherwise → No significant peak

***

<div style="background: #1a588bff; color: #ffffff; padding: 10px; border-radius: 8px;">
<b>Advantage:</b> Accounts for noise level, peak shape, and baseline automatically!
</div>

<!-- /position -->
<!-- /layout -->

---

## MC Simulation: Peak Detection

<div id="mc-peak-detection-chart" style="width:100%; display:flex; justify-content:center;"></div>
<script src="resources/js/charts/mc_peak_detection_simulation.js"></script>

---

<!-- .slide:id="mc-sensitivity-analysis" -->
## MC: Sensitivity Analysis
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Which Factor Matters Most?*

-! MC lets us isolate individual factors:

***

**Experiment 1:** Vary S/N only
- Hold width, baseline constant
- → Direct impact of noise

**Experiment 2:** Vary peak width only  
- Hold S/N, baseline constant
- → Impact of chromatographic resolution

**Experiment 3:** Vary baseline drift only
- Hold S/N, width constant
- → Impact of detector stability

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Typical Findings*

-! **S/N dominates** for detection probability

-! But secondary factors matter for:
-: **Peak width**: Narrow peaks need higher S/N
-: **Baseline drift**: Shifts effective threshold
-: **Sampling rate**: Too few points miss narrow peaks

***

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>MC Insight:</b> Understanding factor importance guides method optimization!
</div>

***

-! This is why MC is powerful:
-: One simulation → answer ONE question
-: Systematic MC → understand the SYSTEM

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="mc-vs-analytical" -->
## When to Use Monte Carlo?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*MC is Preferred When:*

-! **System is complex**
-: Many interacting factors
-: Non-linear relationships
-: No closed-form solution

***

-! **You need probabilities**
-: "What's the chance of detection?"
-: "How often will we get false positives?"
-: "What's the 95th percentile?"

***

-! **Testing edge cases**
-: What if noise doubles?
-: What if baseline drifts?
-: Systematic exploration

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*MC vs. Other Methods*

| Scenario | Best Method |
|----------|-------------|
| Simple formula | Analytical propagation |
| Have real data | Bootstrap |
| Complex system | **Monte Carlo** |
| Need probabilities | **Monte Carlo** |
| Sensitivity analysis | **Monte Carlo** |

***

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Remember:</b> MC requires knowing the underlying distributions!
</div>

-! If distributions unknown → Bootstrap
-! If distributions known → Monte Carlo

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="sampling-uncertainty" -->
## Sampling Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Overlooked Giant*

-! Often **larger** than measurement uncertainty!

***

-! Sources:
-: Spatial heterogeneity
-: Temporal variability
-: Sample handling/preservation

***

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Reality check:</b> A perfect measurement of a bad sample is still wrong!
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: River Monitoring*

-! Nitrate concentration varies:
-: Across the channel (±10%)
-: Over the day (±20%)
-: Between sampling events (±50%)

***

-! Measurement precision: ±2%

***

-? Where should we focus to reduce total uncertainty?

***

-= More samples often beats better instruments!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="composite-samples" -->
## Composite Samples
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Strategy to Reduce Sampling Uncertainty*

-! Combine multiple grab samples into one

***

-! Advantages:
-: Averages spatial/temporal variability
-: Reduces number of analyses
-: Cost-effective

***

-! Disadvantages:
-: Lose information about variability
-: Can't detect hotspots
-: Dilution effects

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Uncertainty Considerations*

-! Composite of n subsamples:

$$\sigma_{composite} = \frac{\sigma_{grab}}{\sqrt{n}}$$

***

-! BUT: Total uncertainty now dominated by:
-: Analytical uncertainty
-: Subsampling representativeness

***

-? When is composite sampling appropriate?
-: Regulatory compliance (mean concentrations)
-: NOT for peak detection or variability assessment

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="detection-limit-uncertainty" -->
## Uncertainty Near Detection Limits
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Low-Concentration Problem*

-! Near LoD:
-: Relative uncertainty is VERY high
-: Distribution may be truncated
-: "Non-detects" are common

***

<div style="font-size: 0.8em;">

| True Conc | Measured | Rel. Uncertainty |
|:---------:|:--------:|:----------------:|
| 10 × LoD | 10.2 | 10% |
| 2 × LoD | 1.8 | 50% |
| 1 × LoD | 0.9 | 100% |
| 0.5 × LoD | <LoD | — |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Handling Non-Detects*

-! Common approaches:
-: Report as <LoD
-: Substitute with LoD/2 (biased!)
-: Use statistical methods (MLE)

***

-! Best practice:
-: Report detection frequency
-: Use appropriate statistical methods
-: Don't over-interpret low values

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Rule:</b> Measurements within 2× LoD should be interpreted with caution!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="calibration-transfer" -->
## Calibration Transfer Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Between-Instrument Comparability*

-! Same method, different instruments:
-: Response factors differ
-: Matrix effects vary
-: Calibration drift

***

-! Between-laboratory comparisons:
-: Different standards
-: Environmental conditions
-: Operator effects

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Quantifying Transfer Uncertainty*

-! Round-robin tests reveal:
-: Reproducibility SD (between labs)
-: Repeatability SD (within lab)

***

$$\sigma_{total}^2 = \sigma_{repeatability}^2 + \sigma_{reproducibility}^2$$

***

-! Typical ratios:
-: $\sigma_R / \sigma_r \approx 2-5$ for routine methods
-: Higher for complex matrices

***

-? Inter-laboratory comparisons are essential for method validation!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="method-comparison" -->
## When to Use Which Method?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Analytical Error Propagation*

✓ Simple functions (+ - × ÷)
✓ Few variables
✓ Independent uncertainties
✓ Linear relationships
✓ Quick calculations

✗ Complex equations
✗ Correlated variables
✗ Non-linear effects

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Bootstrap*

✓ Non-parametric (no distribution assumptions)
✓ Small samples
✓ Complex statistics (median, percentiles)
✓ Correlation preserved in data

✗ Requires representative original sample
✗ Computationally intensive

***

*Monte Carlo*

✓ ANY function complexity
✓ Full output distributions
✓ Correlated inputs (with care)
✓ Non-linear propagation

✗ Need to specify input distributions
✗ Computationally intensive

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="decision-flowchart" -->
## Decision Guide for Uncertainty Methods

<div id="uncertainty-method-flowchart" style="width: 100%; min-height: 500px;"></div>

<script src="resources/js/charts/uncertainty_method_flowchart.js"></script>

---

<!-- .slide:id="reporting-uncertainty" -->
## Reporting Uncertainties
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Formats*

-! Standard format:

$$x \pm u$$

-: Example: $12.34 \pm 0.15$ mg/L

***

-! Parentheses notation:

$$x(u)$$

-: Example: $12.34(15)$ = $12.34 \pm 0.15$

***

-! Asymmetric uncertainties:

$$x_{-u_1}^{+u_2}$$

-: Example: $12.34_{-0.12}^{+0.18}$ mg/L

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Rules*

-! Uncertainty: 1-2 significant figures

-! Value: Match decimal places to uncertainty

***

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Good:</b> 12.34 ± 0.15 mg/L<br>
<b>Bad:</b> 12.3421 ± 0.1534 mg/L
</div>

***

-! Always specify:
-: Type of uncertainty (SD, SE, expanded)
-: Coverage factor (k=2 for 95%)
-: Sample size if relevant

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="summary" -->
## Summary: Key Insights
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Types of Uncertainty*

-! **Random**: Reduces with replication
-! **Systematic**: Requires correction
-! **Model**: Needs validation

***

*Key Metrics*

-! SD → Data spread
-! SE → Mean precision
-! CI → Regression line uncertainty
-! PI → New observation uncertainty

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Methods*

| Method | When to Use |
|:-------|:------------|
| Analytical | Simple functions |
| Bootstrap | Small samples, non-parametric |
| Monte Carlo | Complex, any situation |

***

*Water Science Considerations*

-! Sampling often dominates measurement uncertainty
-! Near LoD → high relative uncertainty
-! Report uncertainties with results!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="summary-visual" -->
## Visual Summary

<div id="summary-uncertainty-chart" style="width: 100%; min-height: 600px;"></div>

<script src="resources/js/charts/uncertainty_summary_chart.js"></script>

---

<!-- .slide:id="reflection-questions" -->
## Reflection Questions

-? What are the three main types of uncertainty, and how do they differ in their behavior when measurements are repeated?

***

-? Why is the prediction interval always wider than the confidence interval in regression?

***

-? When would you choose Monte Carlo simulation over analytical error propagation?

***

-? In water quality monitoring, why might sampling uncertainty often exceed measurement uncertainty?

***

-? How would you determine the dominant source of uncertainty in a complex measurement procedure?

---

<!-- .slide:id="further-reading" -->
## Further Reading & Resources

-! **GUM**: Guide to the Expression of Uncertainty in Measurement (ISO/IEC Guide 98-3)

-! **Eurachem/CITAC Guide**: Quantifying Uncertainty in Analytical Measurement

-! **EPA Methods**: Quality Assurance/Quality Control guidance documents

***

*Interactive Practice:*

<div id="practice-uncertainty-container"></div>

<script src="resources/js/charts/uncertainty_practice_quiz.js"></script>
