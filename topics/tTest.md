---
title: "t-Tests: Comparing Means"
author: "Gerrit Renner"
keywords: ["t-test", "t-distribution", "one-sample t-test", "two-sample t-test", "paired t-test", "dependent samples", "degrees of freedom"]
requirements: ["Hypothesis Testing", "Mean Values", "Variance"]
description: "Understanding and applying t-tests for comparing means in water science"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Hypothesis Testing
- Mean Values
- Variance

---

<!-- .slide:id="initial-motivation" -->
## Why t-Tests?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Common Questions in Water Science*

<div style="background: #1a588bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Does the mean pH differ from the regulatory standard of 7.0?
</div>

<div style="background: #436b8bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Is mean turbidity at Site A different from Site B?
</div>

<div style="background: #619accff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Did the treatment change nitrate concentrations (before vs after)?
</div>

***

-! All these questions compare **means**

-! t-tests are the most common tool for this!

<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-vial" style="font-size: 4em; opacity: 0.9;"></i>
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Challenge with Small Samples*

-! In practice, we often have *small sample sizes*:
-: Limited sampling budget
-: Time constraints
-: Difficult-to-access sites

***

-! With small samples:
-: Sample standard deviation (s) is *uncertain*
-: Cannot use normal (z) distribution
-: Need to account for extra uncertainty

***

-= Solution: Use the t-distribution!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="t-distribution-intro" -->
## The t-Distribution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is the t-Distribution?*

-! Discovered by W. Gosset (1908) working at Guinness Brewery

-: Published under pseudonym "Student" → **Student's t-distribution**

***

-! Similar to normal distribution but:
-: Heavier tails → more probability in extremes
-: Accounts for uncertainty in estimating σ from s
-: Shape depends on degrees of freedom (df)

***

-! As df increases:
-: t-distribution → normal distribution
-: For df > 30, very similar to normal

<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div id="t-distribution-chart" style="width: 100%; min-height: 650px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px;"></div>

<script src="resources/figures/t-distribution.js"></script>
<script>
(function() {
  const containerId = 't-distribution-chart';
  const slideId = 't-distribution-intro';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initTDistribution) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initTDistribution(containerId);
  };
  const maybeRender = (slide) => {
    if (!slide) return;
    if (slide.getAttribute('id') === slideId) {
      renderPlot();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => maybeRender(document.getElementById(slideId)));
  } else {
    maybeRender(document.getElementById(slideId));
  }
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('ready', event => maybeRender(event && event.currentSlide));
    window.Reveal.on('slidechanged', event => maybeRender(event && event.currentSlide));
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="degrees-of-freedom" -->
## Degrees of Freedom (df)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What are Degrees of Freedom?*

-! The number of independent pieces of information available to estimate a parameter

***

-! Why n - 1 for one sample?
-: We estimate 1 parameter: the mean ($\bar{x}$)
-: Once we know n-1 values and the mean, the last value is determined
-: df = n - 1

***

-! *Example*: If $\bar{x} = 10$ and we have values `[8, 9, 11]`, the 4th value *must be* 12

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Degrees of Freedom in Different Tests*

<div style="font-size: 0.75em; margin: 20px auto;">

| **Test Type** | **df Formula** |
|:--------------|:---------------|
| One-sample t-test | df = n - 1 |
| Two-sample t-test (equal var) | df = $n_1 + n_2 - 2$ |
| Two-sample t-test (unequal var) | Welch approximation |
| Paired t-test | df = n - 1 |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>Key insight:</b> With small samples, we need stronger evidence (larger t-values) to reject $H_0$
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="one-sample-t-test-theory" -->
## One-Sample t-Test: Theory
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**When to Use**

-! Compare a sample mean to a known value ($\mu_0$)

***

*Research Questions:*
-: Is the mean pH = 7.0?
-: Does mean nitrate exceed 10 mg/L?
-: Is average temperature different from 15°C?

***

*Hypotheses:*

<div style="padding: 10px; border: 2px solid #1a4d7a; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>H₀:</b> μ = $\mu_0$<br>
<b>H₁:</b> μ ≠ $\mu_0$ (two-tailed)<br>
or μ > $\mu_0$ or μ < $\mu_0$ (one-tailed)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Test Statistic*

$$t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$

-: $\bar{x}$ = sample mean
-: $\mu_0$ = hypothesized population mean
-: $s$ = sample standard deviation
-: $n$ = sample size

***

*Formula Interpretation:*

$$t = \frac{\text{Observed difference from } H_0}{\text{Standard error of the mean}}$$

-! Large |t| → strong evidence against $H_0$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="one-sample-assumptions" -->
## One-Sample t-Test: Assumptions
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Required Assumptions*

1. Independence

-: Observations are independent of each other
-: Random sampling

2. Normality

-: Data come from a normal distribution
-: OR sample size is large enough (n ≥ 30)

***

*What if assumptions are violated?*
-: Small n + strong skewness → use non-parametric test (Wilcoxon)
-: Outliers → investigate or use robust methods
-: Dependence → use appropriate method (time series, spatial)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Checking Assumptions*

-! Visual checks:
-: Histogram or density plot
-: Q-Q plot (quantile-quantile plot)
-: Boxplot for outliers

***

-! Formal tests:
-: Kolmogorov-Smirnov test for normality
-: But: tests are sensitive with large n

***

<div style="background: #dab500fb; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>Note:</b> t-test is <b>robust</b> to moderate violations of normality, especially with larger samples
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="one-sample-example" -->
## One-Sample t-Test: Water Quality Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Scenario**

-! A water treatment plant must maintain pH between 6.5 and 8.5

-! Regulatory standard: pH = 7.0

-! Question: Does the mean pH differ from 7.0?

***

*Data*: 15 pH measurements

*Hypotheses:*
-: $H_0$: μ = 7.0
-: $H_1$: μ ≠ 7.0 (two-tailed)

*Significance level:* α = 0.05

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="one-sample-example-container"></div>

<script>
(function() {
  const containerId = 'one-sample-example-container';
  const code = `# pH measurements from water treatment plant
ph_data <- c(7.1, 6.9, 7.2, 7.0, 6.8, 
             7.3, 7.1, 6.9, 7.0, 7.2,
             7.1, 6.8, 7.0, 7.2, 7.1)

# One-sample t-test (two-tailed)
# H0: mu = 7.0 vs H1: mu != 7.0
result <- t.test(ph_data, mu = 7.0)

# Print results
print(result)

# Calculate effect size (Cohen's d)
mean_diff <- mean(ph_data) - 7.0
cohens_d <- mean_diff / sd(ph_data)
cat(paste("\\nEffect size (Cohen's d):", round(cohens_d, 3)))`;

  const fallback = () => {
    const data = [7.1, 6.9, 7.2, 7.0, 6.8, 7.3, 7.1, 6.9, 7.0, 7.2, 7.1, 6.8, 7.0, 7.2, 7.1];
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
    const sd = Math.sqrt(variance);
    const se = sd / Math.sqrt(data.length);
    const t = (mean - 7.0) / se;
    const df = data.length - 1;
    return `[Simulated in JavaScript]
    
One Sample t-test

data:  ph_data
t = ${t.toFixed(3)}, df = ${df}, p-value ≈ 0.15
alternative hypothesis: true mean is not equal to 7
95% CI: [${(mean - 2.145 * se).toFixed(3)}, ${(mean + 2.145 * se).toFixed(3)}]
sample mean: ${mean.toFixed(3)}

Effect size (Cohen's d): ${((mean - 7.0) / sd).toFixed(3)}`;
  };

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'one-sample-example',
      fallback,
      runLabel: 'Run t-test'
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

<!-- .slide:id="one-sample-interpretation" -->
## Interpreting One-Sample t-Test Results
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Key Output Elements*

1. t-statistic: How many SE the sample mean is from $\mu_0$

2. degrees of freedom (df): n - 1

3. p-value: Probability of observing this (or more extreme) data if $H_0$ is true

4. Confidence interval: Range of plausible values for μ

***

Decision Rule:
-: If p < α → Reject $H_0$
-: If p ≥ α → Fail to reject $H_0$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Reporting Results**

<div style="background: #1a4d7a; color: #ffffff; padding: 15px; border-radius: 8px; margin: 10px 0; font-size: 0.8em; line-height: 1.6;">
"A one-sample t-test was conducted to determine if mean pH differed from the standard value of 7.0 (α = 0.05).<br><br>

Mean pH: 7.05 (SD = 0.14, n = 15)<br>
t(14) = 1.38, p = 0.15<br><br>

We fail to reject $H_0$. There is insufficient evidence that mean pH differs from 7.0 at the 5% significance level. The 95% CI [6.97, 7.13] includes the target value."
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="two-sample-t-test-intro" -->
## Two-Sample t-Test: Introduction
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*When to Use*

-! Compare means from two independent groups

***

Research Questions:
-: Does mean turbidity differ between two rivers?
-: Is nitrate higher upstream vs downstream?
-: Do treated and control sites have different E. coli levels?

***

Hypotheses:

<div style="padding: 10px; border: 2px solid #1a4d7a; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>H₀:</b> $\mu_1 = \mu_2$ (no difference)<br>
<b>H₁:</b> $\mu_1 {\text{ != }} \mu_2$ (two-tailed)<br>
or $\mu_1 > \mu_2$ or $\mu_1 < \mu_2$ (one-tailed)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Two Approaches*

1. Equal Variances (Pooled t-test)

-: Assumes $\sigma_1^2 = \sigma_2^2$
-: More powerful if assumption holds
-: df = $n_1 + n_2 - 2$

2. Unequal Variances (Welch's t-test)

-: Does NOT assume equal variances
-: More robust, safer choice
-: Adjusted df (usually non-integer)

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>Recommendation:</b> Use Welch's t-test by default (it's the default in R)
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="two-sample-formulas" -->
## Two-Sample t-Test: Formulas
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Pooled t-Test (Equal Variances)*

$$t = \frac{\bar{x}_1 - \bar{x}_2}{s_p \sqrt{\frac{1}{n_1} + \frac{1}{n_2}}}$$

*Pooled standard deviation:*

$$s_p = \sqrt{\frac{(n_1-1)s_1^2 + (n_2-1)s_2^2}{n_1 + n_2 - 2}}$$

***

-: df = $n_1 + n_2 - 2$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Welch's t-Test (Unequal Variances)*

$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$

*Welch-Satterthwaite df:*

$$df = \frac{\left(\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}\right)^2}{\frac{(s_1^2/n_1)^2}{n_1-1} + \frac{(s_2^2/n_2)^2}{n_2-1}}$$

***

-! More complex df calculation
-! Usually gives non-integer df

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="two-sample-assumptions" -->
## Two-Sample t-Test: Assumptions
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Required Assumptions*

1. Independence

-: Observations within each group are independent
-: The two groups are independent of each other

2. Normality

-: Each group comes from a normal distribution
-: OR both sample sizes are large ($n_1, n_2 \geq 30$)

3. Equal variances (for pooled test only)

-: $\sigma_1^2 = \sigma_2^2$
-: Not required for Welch's test

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Checking Equal Variance Assumption*

-! Rule of thumb: If larger SD < 2 × smaller SD, assumption reasonable

-! F-test: Ratio of variances (sensitive to non-normality)

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>Practical advice:</b> Use Welch's t-test by default. It performs well even when variances are equal, and protects against violations.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="two-sample-example" -->
## Two-Sample t-Test: Comparing Two Sites
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

-! Compare nitrate concentrations (mg/L) between:
-: Site A: Upstream agricultural area
-: Site B: Downstream urban area

***

-! Question: Do the sites have different mean nitrate levels?

Hypotheses:
-: H₀: $\mu_A = \mu_B$
-: H₁: $\mu_A \text{ != } \mu_B$ (two-tailed)

Significance level: α = 0.05

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="two-sample-example-container"></div>

<script>
(function() {
  const containerId = 'two-sample-example-container';
  const code = `# Nitrate concentrations (mg/L)
site_A <- c(12.3, 11.8, 13.1, 12.5, 11.9, 
            12.7, 13.0, 12.2, 11.6, 12.4)
site_B <- c(8.5, 9.2, 8.8, 9.5, 8.3, 
            9.0, 8.7, 9.3, 8.6, 9.1)

# Two-sample t-test (Welch's by default)
result <- t.test(site_A, site_B)

# Print results
print(result)

# Descriptive statistics
cat("\\nSite A: mean =", round(mean(site_A), 2), 
    ", SD =", round(sd(site_A), 2))
cat("\\nSite B: mean =", round(mean(site_B), 2), 
    ", SD =", round(sd(site_B), 2))

# Effect size
cohens_d <- (mean(site_A) - mean(site_B)) / 
            sqrt((var(site_A) + var(site_B)) / 2)
cat(paste("\\nEffect size (Cohen's d):", round(cohens_d, 3)))`;

  const fallback = () => {
    return `[Simulated in JavaScript]

Welch Two Sample t-test

data:  site_A and site_B
t ≈ 18.5, df ≈ 17.5, p-value < 0.001
alternative hypothesis: true difference in means is not equal to 0
95% CI: [3.24, 4.03]
sample means: 12.35 vs 8.70

Site A: mean = 12.35, SD = 0.51
Site B: mean = 8.70, SD = 0.38
Effect size (Cohen's d): 8.13`;
  };

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'two-sample-example',
      fallback,
      runLabel: 'Run Two-Sample t-test'
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

<!-- .slide:id="paired-t-test-intro" -->
## Paired t-Test: Introduction
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*When to Use*

-! Compare two measurements on the same subjects or matched pairs

***

*Common Scenarios:*

<div style="background: #1a588bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Before vs After treatment at the same site
</div>

<div style="background: #436b8bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Left bank vs Right bank of same river (paired locations)
</div>

<div style="background: #619accff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Two measurement methods on same water samples
</div>

***

-! *Key*: Observations are `not independent`
-! Each pair is related/matched

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why Not Use Two-Sample t-Test?*

-! Two-sample test assumes independence

-! Paired data violates this assumption

-! Paired test is more powerful because:
-: Controls for individual variation
-: Reduces noise
-: Focuses on the difference within pairs

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="paired-t-test-theory" -->
## Paired t-Test: Theory
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Hypotheses*

<div style="padding: 10px; border: 2px solid #1a4d7a; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>H₀:</b> $\mu_d = 0$ (no difference)<br>
<b>H₁:</b> $\mu_d$ ≠ $0$ (two-tailed)<br>
or $\mu_d > 0$ or $\mu_d < 0$ (one-tailed)
</div>

where $\mu_d$ = mean of the differences

***

*Test Statistic*

$$t = \frac{\bar{d}}{s_d / \sqrt{n}}$$

-: $\bar{d}$ = mean of differences
-: $s_d$ = standard deviation of differences
-: $n$ = number of pairs

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Assumptions*

1. Paired observations

-: Each observation in group 1 is matched with exactly one in group 2

2. Independence of pairs

-: Different pairs are independent
-: (Within-pair dependence is expected!)

3. Normality of differences

-: The differences (d_i) come from normal distribution
-: OR sample size is large (n ≥ 30 pairs)

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>Key insight:</b> We analyze the <b>differences</b>, not the original values
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="paired-example" -->
## Paired t-Test: Before-After Treatment Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

-! Test effectiveness of water treatment on phosphate reduction

-! 10 water samples measured:
-: Before treatment
-: After treatment

***

-! Question: Does treatment reduce phosphate levels?

*Hypotheses:*
-: H₀: $\mu_d = 0$ (no change)
-: H₁: $\mu_d > 0$ (reduction; before > after)

Significance level: α = 0.05

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="paired-example-container"></div>

<script>
(function() {
  const containerId = 'paired-example-container';
  const code = `# Phosphate concentrations (mg/L)
before <- c(3.2, 4.1, 3.8, 4.5, 3.5, 
            4.0, 3.9, 4.3, 3.7, 4.2)
after  <- c(2.8, 3.5, 3.2, 3.9, 3.0, 
            3.4, 3.3, 3.7, 3.1, 3.6)

# Paired t-test (one-tailed: before > after)
result <- t.test(before, after, 
                 paired = TRUE, 
                 alternative = "greater")

print(result)

# Show the differences
differences <- before - after
cat("\\nDifferences:", round(differences, 2))
cat("\\nMean difference:", round(mean(differences), 3))
cat("\\nSD of differences:", round(sd(differences), 3))

# Effect size
cohens_d <- mean(differences) / sd(differences)
cat(paste("\\nEffect size (Cohen's d):", round(cohens_d, 3)))`;

  const fallback = () => {
    return `[Simulated in JavaScript]

Paired t-test

data:  before and after
t ≈ 8.5, df = 9, p-value < 0.001
alternative hypothesis: true difference in means is greater than 0
95% CI: [0.52, Inf]
sample mean of differences: 0.67

Differences: 0.4 0.6 0.6 0.6 0.5 0.6 0.6 0.6 0.6 0.6
Mean difference: 0.570
SD of differences: 0.067
Effect size (Cohen's d): 8.5`;
  };

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'paired-example',
      fallback,
      runLabel: 'Run Paired t-test'
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

<!-- .slide:id="choosing-test" -->
## Choosing the Right t-Test
<!-- layout={rows: 1, columns: 3} -->
<!-- position={row: 1, column: 1} -->

<div style="background: linear-gradient(135deg, #1a588bff 0%, #436b8bff 100%); color: #ffffff; padding: 20px; border-radius: 12px; border-left: 6px solid #06d6a0; height: 100%;">
  <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">One-Sample t-Test</div>
  <div style="margin-bottom: 8px;"><strong>Use when:</strong> Comparing one sample mean to a known value</div>
  <div style="margin-bottom: 8px;"><strong>Example:</strong> Is mean pH = 7.0?</div>
  <div style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-size: 0.85em;">t.test(x, mu = 7.0)</div>
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div style="background: linear-gradient(135deg, #619accff 0%, #1a588bff 100%); color: #ffffff; padding: 20px; border-radius: 12px; border-left: 6px solid #f77f00; height: 100%;">
  <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">Two-Sample t-Test (Independent)</div>
  <div style="margin-bottom: 8px;"><strong>Use when:</strong> Comparing means from two independent groups</div>
  <div style="margin-bottom: 8px;"><strong>Example:</strong> Does Site A differ from Site B?</div>
  <div style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-size: 0.85em;">t.test(group1, group2)</div>
  <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.9;">→ Use Welch's test (default) for safety</div>
</div>

<!-- /position -->
<!-- position={row: 1, column: 3} -->

<div style="background: linear-gradient(135deg, #436b8bff 0%, #619accff 100%); color: #ffffff; padding: 20px; border-radius: 12px; border-left: 6px solid #e63946; height: 100%;">
  <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 10px;">Paired t-Test (Dependent Samples)</div>
  <div style="margin-bottom: 8px;"><strong>Use when:</strong> Two measurements on same subjects or matched pairs</div>
  <div style="margin-bottom: 8px;"><strong>Example:</strong> Before vs After treatment</div>
  <div style="font-family: monospace; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; font-size: 0.85em;">t.test(before, after, paired = TRUE)</div>
  <div style="margin-top: 8px; font-size: 0.9em; opacity: 0.9;">→ More powerful when data are truly paired</div>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="effect-size" -->
## Effect Size: Cohen's d
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Why Effect Size Matters*

-: p-value tells us if an effect is statistically significant

-: Effect size tells us if an effect is practically meaningful

***

-< With large samples, tiny differences can be "significant"

-< Effect size quantifies *magnitude* of the difference

***

**Cohen's d** for t-tests:

$$d = \frac{\text{Mean difference}}{\text{Pooled SD}}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Interpreting Cohen's d*

<div style="font-size: 0.85em; margin: 20px auto;">

| **Cohen's d** | **Interpretation** |
|:--------------|:-------------------|
| < 0.2 | Negligible effect |
| 0.2 - 0.5 | Small effect |
| 0.5 - 0.8 | Medium effect |
| > 0.8 | Large effect |

</div>

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.75em;">
<b>Example:</b><br>
Nitrate difference: 3.65 mg/L<br>
Pooled SD: 0.45 mg/L<br>
Cohen's d = 3.65 / 0.45 = 8.1<br><br>
<b>→ Very large effect!</b>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="power-sample-size" -->
## Power and Sample Size
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Statistical Power**

-! Power = Probability of detecting a true effect

-! Power = 1 - β (Type II error rate)

***

-! Factors affecting power:
-: Sample size (n) ↑ → Power ↑
-: Effect size ↑ → Power ↑
-: Significance level (α) ↑ → Power ↑
-: Variability (SD) ↓ → Power ↑

***

-! Standard target: *Power ≥ 0.80*
-: 80% chance of detecting effect if it exists
-: 20% chance of Type II error

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Sample Size Planning*

-> Before collecting data, determine required n

-> Use power analysis to calculate needed sample size

***

<div id="power-example-container"></div>

<script>
(function() {
  const containerId = 'power-example-container';
  const code = `# Sample size for detecting medium effect (d = 0.5)
# Power = 0.80, alpha = 0.05, two-tailed

# Two-sample t-test
result <- power.t.test(d = 0.5,        # effect size
                     power = 0.80,   # desired power
                     sig.level = 0.05,
                     type = "two.sample",
                     alternative = "two.sided")

print(result)

cat("\\nRequired n per group:", ceiling(result$n))`;

  const fallback = () => {
    return `[Simulated]

Two-sample t test power calculation

d = 0.5
sig.level = 0.05
power = 0.8
alternative = two.sided

Required n per group: 64

To detect a medium effect with 80% power,
you need approximately 64 samples per group.`;
  };

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'power-sample-size',
      fallback,
      runLabel: 'Calculate Sample Size',
      minHeight: '120px'
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

<!-- .slide:id="sample-size-calculator" -->
## Interactive Sample Size Calculator
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

**Approximation Formula**

For two-sample t-test with α = 0.05 and Power = 0.80:

$$n \approx 2 \times \left(\frac{Z_{\alpha/2} + Z_{\beta}}{d}\right)^2$$

where:
-: $Z_{\alpha/2} \approx 1.96$ (for α = 0.05, two-tailed) <button id="show-z-alpha-btn" style="background: #1a4d7a; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75em; margin-left: 8px;">📊 Show CDF</button>
-: $Z_{\beta} \approx 0.84$ (for power = 0.80) <button id="show-z-beta-btn" style="background: #1a4d7a; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.75em; margin-left: 8px;">📊 Show CDF</button>
-: $d = \frac{\Delta}{\sigma}$ (Cohen's d, effect size)

<div style="background: rgba(26, 77, 122, 0.15); padding: 12px; border-radius: 8px; border-left: 4px solid #1a4d7a; font-size: 0.85em;">
<strong>Note:</strong> This approximation works well for large samples. For small samples, exact methods or software should be used.
</div>

<!-- Popup for Z_alpha/2 -->
<div id="z-alpha-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; border: 4px solid #1a4d7a; border-radius: 16px; padding: 40px; z-index: 10000; width: 90vw; max-width: 1400px; height: 85vh; max-height: 900px; box-shadow: 0 12px 48px rgba(0,0,0,0.4); overflow-y: auto;">
  <button id="close-z-alpha" style="position: absolute; top: 20px; right: 20px; background: #e63946; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1.2em;">✕</button>
  <h3 style="color: #1a4d7a; margin-top: 0; margin-bottom: 30px; font-size: 0.8em;">Critical Value Z<sub>α/2</sub> = 1.96</h3>
  <div id="z-alpha-chart" style="width: 100%; height: 60vh; min-height: 400px; margin-bottom: 30px;"></div>
  <div style="color: #333; font-size: 1.2em; line-height: 1.8; padding: 20px; background: rgba(26, 77, 122, 0.08); border-radius: 12px;">
    <p><strong>Two-tailed test with α = 0.05:</strong></p>
    <p>• We split α equally: 0.025 in each tail</p>
    <p>• Right tail: P(Z > Z<sub>α/2</sub>) = 0.025</p>
    <p>• Cumulative: P(Z ≤ Z<sub>α/2</sub>) = 0.975</p>
    <p>• Therefore: Z<sub>α/2</sub> = Φ<sup>-1</sup>(0.975) = <strong>1.96</strong></p>
  </div>
</div>

<!-- Popup for Z_beta -->
<div id="z-beta-popup" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #ffffff; border: 4px solid #1a4d7a; border-radius: 16px; padding: 40px; z-index: 10000; width: 90vw; max-width: 1400px; height: 85vh; max-height: 900px; box-shadow: 0 12px 48px rgba(0,0,0,0.4); overflow-y: auto;">
  <button id="close-z-beta" style="position: absolute; top: 20px; right: 20px; background: #e63946; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 1.2em;">✕</button>
  <h3 style="color: #1a4d7a; margin-top: 0; margin-bottom: 30px; font-size: 0.8em;">Power Z<sub>β</sub> = 0.84</h3>
  <div id="z-beta-chart" style="width: 100%; height: 60vh; min-height: 400px; margin-bottom: 30px;"></div>
  <div style="color: #333; font-size: 1.2em; line-height: 1.8; padding: 20px; background: rgba(26, 77, 122, 0.08); border-radius: 12px;">
    <p><strong>Statistical Power = 0.80:</strong></p>
    <p>• Power = 1 - β = 0.80, so β = 0.20</p>
    <p>• We want: P(detect effect | effect exists) = 0.80</p>
    <p>• Cumulative: P(Z ≤ Z<sub>β</sub>) = 0.80</p>
    <p>• Therefore: Z<sub>β</sub> = Φ<sup>-1</sup>(0.80) = <strong>0.84</strong></p>
  </div>
</div>

<!-- Overlay background -->
<div id="popup-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999;"></div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

**Adjust Parameters**

<div style="margin-bottom: 25px;">
  <label for="delta-slider" style="display: block; color: #ff9100ff; font-weight: 600; margin-bottom: 10px; font-size: 0.95em;">
    Expected Difference (Δ): <span id="delta-value" style="color: #06d6a0;">1.0</span>
  </label>
  <input type="range" id="delta-slider" min="0.1" max="5" step="0.1" value="1.0" 
         style="width: 100%; cursor: pointer; height: 8px;">
  <div style="display: flex; justify-content: space-between; font-size: 0.75em; color: #ff9100ff; margin-top: 5px;">
    <span>0.1</span>
    <span>5.0</span>
  </div>
</div>

<div style="margin-bottom: 25px;">
  <label for="sd-slider" style="display: block; color: #ff9100ff; font-weight: 600; margin-bottom: 10px; font-size: 0.95em;">
    Standard Deviation (σ): <span id="sd-value" style="color: #06d6a0;">2.0</span>
  </label>
  <input type="range" id="sd-slider" min="0.5" max="10" step="0.1" value="2.0" 
         style="width: 100%; cursor: pointer; height: 8px;">
  <div style="display: flex; justify-content: space-between; font-size: 0.75em; color: #ff9100ff; margin-top: 5px;">
    <span>0.5</span>
    <span>10.0</span>
  </div>
</div>

**Results**

<div style="display: flex; flex-direction: row; gap: 12px;">
  
  <div style="flex: 1; background: linear-gradient(135deg, #1a588bff 0%, #436b8bff 100%); padding: 15px; border-radius: 10px; text-align: center;">
    <div style="font-size: 0.75em; color: #ffffff; opacity: 0.9; margin-bottom: 6px;">Effect Size (Cohen's d)</div>
    <div id="effect-size-display" style="font-size: 1.8em; font-weight: bold; color: #06d6a0;">0.50</div>
    <div id="effect-size-label" style="font-size: 0.7em; color: #ffffff; opacity: 0.8; margin-top: 4px;">Medium Effect</div>
  </div>

  <div style="flex: 1; background: linear-gradient(135deg, #619accff 0%, #1a588bff 100%); padding: 15px; border-radius: 10px; text-align: center;">
    <div style="font-size: 0.75em; color: #ffffff; opacity: 0.9; margin-bottom: 6px;">Required Sample Size</div>
    <div id="sample-size-display" style="font-size: 1.8em; font-weight: bold; color: #f77f00;">64</div>
    <div style="font-size: 0.7em; color: #ffffff; opacity: 0.8; margin-top: 4px;">per group (two-sample t-test)</div>
  </div>

</div>

<!-- /position -->
<!-- /layout -->

<script>
(function() {
  const slideId = 'sample-size-calculator';
  
  const deltaSlider = document.getElementById('delta-slider');
  const sdSlider = document.getElementById('sd-slider');
  const deltaValueSpan = document.getElementById('delta-value');
  const sdValueSpan = document.getElementById('sd-value');
  const effectSizeDisplay = document.getElementById('effect-size-display');
  const effectSizeLabel = document.getElementById('effect-size-label');
  const sampleSizeDisplay = document.getElementById('sample-size-display');

  function getEffectSizeLabel(d) {
    if (d < 0.2) return 'Negligible';
    if (d < 0.5) return 'Small Effect';
    if (d < 0.8) return 'Medium Effect';
    return 'Large Effect';
  }

  // Calculate sample size using formula for two-sample t-test
  // n ≈ 2 * ((Z_α/2 + Z_β) / d)^2
  // For α=0.05 (two-tailed), Z_α/2 ≈ 1.96
  // For power=0.80, Z_β ≈ 0.84
  function calculateSampleSize(delta, sd) {
    const d = delta / sd; // Cohen's d (effect size)
    const z_alpha = 1.96; // for α = 0.05 (two-tailed)
    const z_beta = 0.84;  // for power = 0.80
    
    // Approximate formula
    const n = 2 * Math.pow((z_alpha + z_beta) / d, 2);
    
    return Math.ceil(n);
  }

  function updateCalculations() {
    const delta = parseFloat(deltaSlider.value);
    const sd = parseFloat(sdSlider.value);
    
    // Update value displays
    deltaValueSpan.textContent = delta.toFixed(1);
    sdValueSpan.textContent = sd.toFixed(1);
    
    // Calculate effect size (Cohen's d)
    const effectSize = delta / sd;
    effectSizeDisplay.textContent = effectSize.toFixed(2);
    effectSizeLabel.textContent = getEffectSizeLabel(effectSize);
    
    // Calculate required sample size
    const sampleSize = calculateSampleSize(delta, sd);
    sampleSizeDisplay.textContent = sampleSize;
  }

  // Add event listeners
  if (deltaSlider && sdSlider) {
    deltaSlider.addEventListener('input', updateCalculations);
    sdSlider.addEventListener('input', updateCalculations);
    
    // Initial calculation
    updateCalculations();
  }

  // Reinitialize when slide becomes visible
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', (event) => {
      if (event && event.currentSlide && event.currentSlide.getAttribute('id') === slideId) {
        updateCalculations();
      }
    });
  }

  // Normal distribution CDF approximation
  function normalCDF(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  // Normal distribution PDF
  function normalPDF(x) {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
  }

  // Draw normal curve with shaded area using D3
  function drawNormalCurve(containerId, zValue, probability, isRightTail = false) {
    const container = document.getElementById(containerId);
    if (!container || typeof d3 === 'undefined') {
      setTimeout(() => drawNormalCurve(containerId, zValue, probability, isRightTail), 100);
      return;
    }

    // Clear previous content
    container.innerHTML = '';

    const margin = { top: 40, right: 60, bottom: 80, left: 80 };
    const containerWidth = container.clientWidth || 1200;
    const containerHeight = container.clientHeight || 500;
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    const svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Generate data for normal curve
    const xRange = d3.range(-4, 4.01, 0.05);
    const data = xRange.map(x => ({ x, y: normalPDF(x) }));

    // Scales
    const xScale = d3.scaleLinear()
      .domain([-4, 4])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 0.45])
      .range([height, 0]);

    // Area generator for shaded region
    const area = d3.area()
      .x(d => xScale(d.x))
      .y0(height)
      .y1(d => yScale(d.y));

    // Shaded area data
    const shadedData = isRightTail
      ? data.filter(d => d.x >= zValue)
      : data.filter(d => d.x <= zValue);

    // Draw shaded area
    svg.append('path')
      .datum(shadedData)
      .attr('fill', '#06d6a0')
      .attr('opacity', 0.4)
      .attr('d', area);

    // Line generator
    const line = d3.line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Draw curve
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#1a4d7a')
      .attr('stroke-width', 2.5)
      .attr('d', line);

    // X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).ticks(9))
      .style('font-size', '18px');

    // Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .style('font-size', '18px');

    // X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 60)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('fill', '#333')
      .style('font-weight', 'bold')
      .text('Z-value');

    // Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -55)
      .attr('text-anchor', 'middle')
      .style('font-size', '24px')
      .style('fill', '#333')
      .style('font-weight', 'bold')
      .text('Density');

    // Vertical line at z-value
    svg.append('line')
      .attr('x1', xScale(zValue))
      .attr('x2', xScale(zValue))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#e63946')
      .attr('stroke-width', 4)
      .attr('stroke-dasharray', '8,8');

    // Label for z-value
    svg.append('text')
      .attr('x', xScale(zValue))
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '26px')
      .style('fill', '#e63946')
      .style('font-weight', 'bold')
      .text(`Z = ${zValue.toFixed(2)}`);

    // Label for probability
    const probX = isRightTail ? (xScale(zValue) + xScale(4)) / 2 : (xScale(-4) + xScale(zValue)) / 2;
    svg.append('text')
      .attr('x', probX)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '32px')
      .style('fill', '#1a4d7a')
      .style('font-weight', 'bold')
      .text(`P = ${probability.toFixed(3)}`);
  }

  // Popup controls
  const showZAlphaBtn = document.getElementById('show-z-alpha-btn');
  const showZBetaBtn = document.getElementById('show-z-beta-btn');
  const zAlphaPopup = document.getElementById('z-alpha-popup');
  const zBetaPopup = document.getElementById('z-beta-popup');
  const overlay = document.getElementById('popup-overlay');
  const closeZAlpha = document.getElementById('close-z-alpha');
  const closeZBeta = document.getElementById('close-z-beta');

  function showPopup(popup, chartId, zValue, probability, isRightTail = false) {
    overlay.style.display = 'block';
    popup.style.display = 'block';
    drawNormalCurve(chartId, zValue, probability, isRightTail);
  }

  function hidePopups() {
    overlay.style.display = 'none';
    if (zAlphaPopup) zAlphaPopup.style.display = 'none';
    if (zBetaPopup) zBetaPopup.style.display = 'none';
  }

  if (showZAlphaBtn) {
    showZAlphaBtn.addEventListener('click', () => {
      showPopup(zAlphaPopup, 'z-alpha-chart', 1.96, 0.975, false);
    });
  }

  if (showZBetaBtn) {
    showZBetaBtn.addEventListener('click', () => {
      showPopup(zBetaPopup, 'z-beta-chart', 0.84, 0.80, false);
    });
  }

  if (closeZAlpha) {
    closeZAlpha.addEventListener('click', hidePopups);
  }

  if (closeZBeta) {
    closeZBeta.addEventListener('click', hidePopups);
  }

  if (overlay) {
    overlay.addEventListener('click', hidePopups);
  }

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hidePopups();
    }
  });
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="practical-workflow" -->
## Practical Workflow for t-Tests
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<div style="display: flex; flex-direction: column; gap: 15px; padding: 10px;">

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">1</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Define Research Question</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">What are you comparing?</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">2</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>State Hypotheses</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">$H_0$ and $H_1$ (two-tailed or one-tailed?)</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">3</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Choose Significance Level (α)</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Usually 0.05, set before analysis</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">4</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Identify Test Type</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">One-sample, two-sample, or paired?</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">5</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Check Assumptions</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Normality, independence, equal variances (if needed)</span>
  </div>
</div>

</div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 15px; padding: 10px;">

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">6</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Run the Test</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Calculate test statistic and p-value</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">7</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Calculate Effect Size</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Cohen's d or confidence interval</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">8</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Make Decision</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Compare p-value to α</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">9</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Interpret in Context</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">What does this mean scientifically?</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">10</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Report Results Completely</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Descriptive stats, test results, effect size, and visualizations</span>
  </div>
</div>

</div>
<!-- /position -->
<!-- /layout -->