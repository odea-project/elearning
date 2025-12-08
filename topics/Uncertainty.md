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

-! Critical question:
-? "At what Signal-to-Noise ratio will peaks be detected in **95%** of cases?"

***

-! This cannot be answered by:
-: Single measurement (too variable)
-: Analytical calculation (too complex)
-: Bootstrap (need synthetic data with known truth)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*What Affects Peak Detection?*

-! Primary factors:
-: Signal-to-Noise ratio (S/N)
-: Peak width (narrow peaks harder)

***

-! Secondary factors:
-: Baseline drift
-: Peak shape (tailing, fronting)
-: Sampling rate (points per peak)

***

-! MC lets us isolate and study each factor!

<div style="background: #2d5016; color: #ffffff; padding: 10px; border-radius: 8px; margin: 10px 0;">
<b>Strategy:</b> Vary one factor, hold others constant → understand its impact
</div>

<!-- /position -->
<!-- /layout -->

---

## MC Simulation: Peak Detection

<div id="mc-peak-detection-chart" style="width:100%; display:flex; justify-content:center;"></div>
<script src="resources/js/charts/mc_peak_detection_simulation.js"></script>

---

<!-- .slide:id="reporting-uncertainty" -->
## Reporting Uncertainties
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Formats*

-! Standard uncertainty ($u$):

$$x \pm u$$

-: Example: $12.34 \pm 0.15$ mg/L ($u$, $k=1$, 68%)

***

-! Expanded uncertainty ($U = k \cdot u$):

$$x \pm U \quad (k=2)$$

-: Example: $12.34 \pm 0.30$ mg/L ($U$, $k=2$, 95%)

<!-- /position -->
<!-- position={row: 1, column: 2} -->

*Formats (cont.)*

-! Parentheses notation (standard uncertainty only):

$$x(u)$$

-: Example: $12.34(15)$ means $12.34 \pm 0.15$

***

-! Asymmetric uncertainties:

$$x_{-u_1}^{+u_2}$$

-: For non-symmetric distributions or non-linear propagation

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="reporting-rules" -->
## Reporting Uncertainty: Best Practices
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Rules (GUM-compliant)*
-: GUM: Guide to the Expression of Uncertainty in Measurement

-! Uncertainty: typically 1–2 significant figures

-! Value: round to match decimal places of uncertainty

***

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Good:</b> 12.34 ± 0.15 mg/L (U, k=2)<br>
</div>

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Bad:</b> 12.34567 ± 0.15324 mg/L
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! Always specify:
-: Type: **standard** ($u$) or **expanded** ($U$)
-: Coverage factor ($k$) and coverage probability
-: Method used (GUM / Monte Carlo / Bootstrap)
-: Number of repetitions

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-uncertainty" -->
## Method Validation & Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Direct Uncertainty Parameters*

<div style="font-size: 0.85em;">

| Parameter | Contributes to |
|:----------|:---------------|
| Precision | Random uncertainty |
| Trueness/Bias | Systematic uncertainty |
| Calibration | Model uncertainty |
| Matrix effects | Method uncertainty |
| Stability | Time-dependent uncertainty |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Indirect Uncertainty Parameters*

<div style="font-size: 0.85em;">

| Parameter | Relevance |
|:----------|:----------|
| LOD/LOQ | Defines reliable measurement range |
| Robustness | Sensitivity to small changes |

</div>

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key insight:</b> Each validation parameter feeds into the total uncertainty budget!
</div>

***

-= A validated method is the foundation for realistic uncertainty estimation!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-precision" -->
## Validation: Precision
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Precision?*

-! Closeness of agreement between repeated measurements

-! Two levels:
-: Repeatability ($\sigma_r$): same conditions, short time
-: Reproducibility ($\sigma_R$): different conditions/labs

***

*How to Determine*

-! Repeatability: $n \geq 6$ replicates at 2–3 concentration levels

-! Reproducibility: Inter-laboratory studies or different days/analysts

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Nitrate in Water*

<div style="font-size: 0.85em;">

| Level | Mean (mg/L) | SD | RSD |
|:------|:-----------:|:--:|:---:|
| Low (5) | 5.12 | 0.18 | 3.5% |
| Mid (25) | 24.8 | 0.52 | 2.1% |
| High (50) | 49.5 | 0.89 | 1.8% |

</div>

***

*Contribution to Uncertainty*

$$u_{\text{precision}} = \frac{\sigma_r}{\sqrt{n}}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-trueness" -->
## Validation: Trueness & Bias
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Trueness?*

-! Closeness of mean to true value

-! Bias = systematic deviation

$$\text{Bias} = \bar{x}\_{\text{measured}} - x\_{\text{true}}$$

***

*How to Determine*

-! Certified Reference Materials (CRM)
-: Compare measured vs. certified value

-! Spike Recovery
-: Add known amount, measure recovery %

-! Method Comparison
-: Compare with reference method

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: CRM Analysis*

<div style="font-size: 0.75em;">

| CRM | Certified | Measured | Bias |
|:----|:---------:|:--------:|:----:|
| Cd | 5.00 ± 0.15 | 4.85 ± 0.12 | −3.0% |
| Pb | 12.5 ± 0.4 | 12.8 ± 0.3 | +2.4% |

</div>

***

*Contribution to Uncertainty*

-: If bias is **corrected**: include correction uncertainty

-: If bias is **not corrected**: include as uncertainty component

$$u_{\text{bias}} = \sqrt{u_{\text{CRM}}^2 + \left(\frac{\text{bias}}{\sqrt{3}}\right)^2}$$

-: Division by $\sqrt{3}$: rectangular distribution assumption

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-calibration" -->
## Validation: Calibration Uncertainty
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Sources of Calibration Uncertainty*

-! Standard preparation
-: Weighing, dilution, purity

-! Regression uncertainty
-: Slope and intercept uncertainty

***

*How to Determine*

-! Regression: calculate $u(\beta\_{0,hat})$, $u(\beta\_{1,hat})$

-! Back-calculation: predict concentration, assess scatter

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Calibration Curve*

<div style="font-size: 0.75em;">

| Parameter | Value | Uncertainty |
|:----------|:-----:|:-----------:|
| Slope | 0.0523 | 0.0012 |
| Intercept | 0.015 | 0.008 |
| $R^2$ | 0.9987 | — |

</div>

***

*Contribution to Uncertainty*

$$u_{\text{cal}}(x_0) = MSE \cdot \sqrt{\mathbf{x}_0^\top (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{x}_0 + 1}$$

-: $\mathbf{x}_0$ = predictor vector for unknown sample
-: Same formula as **PI** (includes $+1$ for new observation!)
-: Larger uncertainty far from $\bar{x}$!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-matrix" -->
## Validation: Matrix Effects
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Matrix Effects*

-! Sample matrix ≠ calibration matrix

-! Effects: signal enhancement/suppression

***

*How to Determine*

-! Recovery experiments in different matrices

$$\text{Recovery} = \frac{c_{\text{measured}}}{c_{\text{spiked}}} \times 100\%$$

-! Or compare slopes:

$$\text{Matrix Factor} = \frac{\text{Slope}\_{\text{matrix}}}{\text{Slope}\_{\text{solvent}}}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->

*Contribution to Uncertainty*

$$u_{\text{matrix}} = \frac{s_{\text{Recovery}}}{\sqrt{n}}$$

-: $s_{\text{Recovery}}$ = SD of recovery experiments
-: If bias not corrected: add 
$$\frac{\|100\% - \bar{R}\|}{\sqrt{3}}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-stability" -->
## Validation: Stability
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Stability*

-! Analyte degradation over time

-! Types:
-: Short-term (autosampler)
-: Long-term (storage)
-: Freeze-thaw cycles

***

*How to Determine*

-! Measure same sample at $t_0$, $t_1$, $t_2$, ...

<!-- /position -->
<!-- position={row: 1, column: 2} -->

*Contribution to Uncertainty*

-! If drift is **random** (no trend):

$$u_{\text{stab}} = s_{\text{measurements}}$$

-! If drift is **systematic** (trend):

$$u_{\text{stab}} = \frac{|x_{t_{\text{max}}} - x_{t_0}|}{\sqrt{3}}$$

-: Rectangular distribution over storage time
-: Only include if drift > measurement precision!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="validation-lod-robustness" -->
## Validation: LOD/LOQ
<!-- layout={rows: 1, columns: 2, widths: [35, 65]} -->
<!-- position={row: 1, column: 1} -->
*Detection Theory*

-! **LOD**: Limit of Detection
-: Lowest detectable signal (qualitative)
-: $x_{\text{LOD}} = \mu_{\text{blank}} + 3.29 \cdot \sigma_{\text{blank}}$

-! **LOQ**: Limit of Quantification
-: Lowest quantifiable amount
-: $x_{\text{LOQ}} = \mu_{\text{blank}} + 10 \cdot \sigma_{\text{blank}}$

***

*Error Types*

-! **α-Error** (false positive): Blank misclassified as detection
-! **β-Error** (false negative): Signal missed as blank
<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div id="lod-loq-chart" style="width: 100%; display: flex; justify-content: center;"></div>
<script src="resources/js/charts/lod_loq_visualization.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="uncertainty-budget" -->
## Uncertainty Budget: Putting It Together
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Combining Validation Parameters*

-! Each validation parameter → uncertainty component

$$u_c = \sqrt{u_{\text{precision}}^2 + u_{\text{bias}}^2 + u_{\text{cal}}^2 + u_{\text{matrix}}^2 + ...}$$

***

*Example: Heavy Metal Analysis*

<div style="font-size: 0.8em;">

| Source | $u_i$ (rel.) | $u_i^2$ |
|:-------|:------------:|:-------:|
| Precision | 2.1% | 4.41 |
| Bias (CRM) | 1.5% | 2.25 |
| Calibration | 1.8% | 3.24 |
| Matrix | 2.5% | 6.25 |
| **Combined** | **4.0%** | 16.15 |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Expanded Uncertainty*

$$U = k \cdot u_c$$

-: $k = 2$ for 95% coverage (normal distribution)

***

*For our example:*

$$U = 2 \times 4.0\% = 8.0\%$$

***

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Result:</b> Cd = 5.12 ± 0.41 mg/kg<br>
(U, k=2, 95% coverage)
</div>

***

-= The uncertainty budget shows which component dominates → optimize there!

<!-- /position -->
<!-- /layout -->
