---
title: "Introduction to Hypothesis Testing"
author: "Gerrit Renner"
keywords: ["hypothesis testing", "p-value", "significance level", "null hypothesis", "alternative hypothesis", "type I error", "type II error"]
requirements: ["Mean Values", "Variance", "Distributions"]
description: "General principles of hypothesis testing and understanding p-values"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Variance
- Distributions

---

<!-- .slide:id="initial-question" -->
## The Scientific Question
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Science progresses by asking questions about nature:

***

<div style="background: #1a588bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Is the water quality at Site A different from Site B?
</div>

<div style="background: #436b8bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Does a treatment reduce pollutant concentrations?
</div>

<div style="background: #619accff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
Has the river temperature changed over time?
</div>

***

-? How do we answer these questions **objectively** using data?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**The Challenge**

-! We only have **samples**, not complete populations

-! Natural variability creates **uncertainty**

-! We need a systematic approach to:
-: Quantify evidence
-: Account for randomness
-: Make decisions with known risk

***

-= **Hypothesis testing** provides this framework!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hypothesis-framework" -->
## The Hypothesis Testing Framework
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**The Basic Structure**

-! Every hypothesis test has two competing claims:

***

<b>Null Hypothesis (H₀)</b><br>
<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
The "status quo" or "no effect" claim<br>
What we assume is true initially
</div><br>

<b>Alternative Hypothesis (H₁ or Hₐ)</b><br>
<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
The "research claim" or "effect exists"<br>
What we're trying to find evidence for
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Example: Water Treatment**

-! Question: Does a new filter reduce lead concentrations?

***

<div style="padding: 12px; border: 2px solid #1a4d7a; border-radius: 8px; margin: 10px 0;">
<b>H₀:</b> The filter has <b>no effect</b><br>
(mean before = mean after)
</div>

<div style="padding: 12px; border: 2px solid #8b1a1a; border-radius: 8px; margin: 10px 0;">
<b>H₁:</b> The filter <b>reduces</b> lead<br>
(mean after < mean before)
</div>

***

-! We collect data and ask:
-? "Is the observed difference large enough to reject H₀?"

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hypothesis-logic" -->
## The Logic of Hypothesis Testing
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Proof by Contradiction**

-! Hypothesis testing uses **indirect reasoning**:

***

1. **Assume** H₀ is true
2. **Calculate** what outcomes we'd expect
3. **Observe** actual data
4. **Decide** if observation is too unlikely under H₀

***

-= If the data are very unlikely under H₀, we reject it in favor of H₁

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Analogy: Legal Trial**

<div style="background: #1a4d7a; color: #ffffff; padding: 15px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>H₀: Defendant is innocent</b><br><br>

➜ We assume innocence initially<br>
➜ Prosecutor presents evidence<br>
➜ If evidence is <b>overwhelming</b>, we reject innocence<br>
➜ Otherwise, we maintain innocence (lack of proof ≠ proof of innocence)
</div>

***

-! Similarly in statistics:
-: Rejecting H₀ requires **strong evidence**
-: Failing to reject H₀ doesn't prove it's true

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="test-statistic-intro" -->
## Test Statistics: Measuring Evidence
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**What is a Test Statistic?**

-! A **single number** calculated from sample data that measures evidence against H₀

***

-! Properties of a good test statistic:
-: Has a known distribution under H₀
-: Large values indicate departure from H₀

***

-! Tests use different statistics:
-: t-statistic (comparing means)
-: χ² statistic (categorical data)
-: F-statistic (comparing variances)
-: Many others...

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**General Concept**

$$\text{Test Statistic} = \frac{\text{Observed Effect}}{\text{Expected Variability}}$$

***

-! Example structure:

$$t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$

-: Numerator: How far is sample mean from H₀ value?
-: Denominator: How much sampling variability?

***

-= Large test statistic → strong evidence against H₀

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="null-distribution" -->
## The Null Distribution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Sampling Distribution Under H₀**

-! If H₀ is true, the test statistic follows a *known distribution*

-! This is called the **null distribution**

***

-! Example: Testing if mean pH = 7.0 (H₀: μ = 7.0):
-: Under H₀, the test statistic follows a t-distribution
-: We can calculate probabilities for observed values
-: Extreme values are unlikely if H₀ is true

***

-! For continuous data:
-: Often normal, t, χ², or F distributions
-: Depends on the test and sample size

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Visual Concept**

<div id="null-distribution-chart" style="width: 100%; min-height: 320px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>

<script src="resources/figures/null-distribution.js"></script>
<script>
(function() {
  const containerId = 'null-distribution-chart';
  const slideId = 'null-distribution';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initNullDistribution) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initNullDistribution(containerId);
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

-! Shaded region: values unlikely under H₀
-! Our observed statistic falls somewhere on this curve

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pvalue-definition" -->
## The p-value: Quantifying Evidence
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The **p-value** is the probability of observing a test statistic as extreme as (or more extreme than) the one calculated from your data, *assuming H₀ is true*.

$$p\text{-value} = P(\footnotesize\text{test stat.} \geq \text{obs.} \mid H_0 \text{ true}\normalsize)$$

***

-! **Small p-value** → data are unlikely under H₀
-: Strong evidence against H₀

-! **Large p-value** → data are compatible with H₀
-: Weak evidence against H₀

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Interpretation Scale**

<div style="font-size: 0.85em; margin: 20px auto;">

| **p-value** | **Interpretation** |
|:------------|:-------------------|
| < 0.01 | Very strong evidence against H₀ |
| 0.01 - 0.05 | Strong evidence against H₀ |
| 0.05 - 0.10 | Moderate evidence against H₀ |
| > 0.10 | Little or no evidence against H₀ |

</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pvalue-visual" -->
## Understanding p-values Visually
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**p-value as Tail Area**

-! The p-value corresponds to the **area in the tail(s)** of the null distribution

***

-! **One-tailed test**: 
-: Area in one direction only
-: H₁: parameter > value or < value

***

-! **Two-tailed test**: 
-: Area in both tails
-: H₁: parameter ≠ value

<!-- /position -->
<!-- position={row: 1, column: 2} -->

<div id="pvalue-interactive-chart" style="width: 100%; min-height: 560px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px;"></div>

<script src="resources/figures/pvalue-interactive.js"></script>
<script>
(function() {
  const containerId = 'pvalue-interactive-chart';
  const slideId = 'pvalue-visual';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initPValueInteractive) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initPValueInteractive(containerId);
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

-: Adjust the slider to see how the observed value changes the p-value

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="significance-level" -->
## Significance Level (α): Setting the Threshold
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**What is α?**

-! The *significance level* (α) is a pre-determined threshold for rejecting H₀

***

-! Decision rule:
-: If p-value < α → *reject H₀* (result is "statistically significant")
-: If p-value ≥ α → *fail to reject H₀* (result is "not significant")

***

-! Common choices:
-: α = 0.05 (most common in science)
-: α = 0.01 (more stringent)
-: α = 0.10 (more lenient)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Why Set α in Advance?**

-! Setting α *before* seeing the data prevents:
-: Cherry-picking results
-: P-hacking (trying different tests until significant)

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>⚠ Critical:</b><br>
α represents the <b>acceptable risk</b> of falsely rejecting H₀ when it's actually true (Type I error rate)
</div>

***

-! Example: α = 0.05 means:
-: We accept a 5% risk of false positives
-: In 100 tests (when H₀ is true), ~5 will be wrongly "significant"

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="type-errors" -->
## Type I and Type II Errors
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Two Ways to Be Wrong**

-! In hypothesis testing, two types of errors are possible:

***

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Type I Error (False Positive)</b><br>
Reject H₀ when H₀ is actually true<br>
Probability = α (significance level)
</div>

<div style="background: #8b7508ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Type II Error (False Negative)</b><br>
Fail to reject H₀ when H₁ is actually true<br>
Probability = β
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Decision Matrix**

<table style="font-size: 0.75em; width: 100%; border-collapse: collapse; margin: 20px 0;">
  <thead>
    <tr style="background: #1a2340; color: #9efcff;">
      <th style="padding: 8px; border: 1px solid #2d3a66;"></th>
      <th style="padding: 8px; border: 1px solid #2d3a66;">H₀ True</th>
      <th style="padding: 8px; border: 1px solid #2d3a66;">H₁ True</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #2d3a66; background: rgba(154, 207, 255, 0.08);"><b>Reject H₀</b></td>
      <td style="padding: 8px; border: 1px solid #2d3a66; background: #8b1a1a; color: white;"><b>Type I Error</b><br>False Positive<br>(α)</td>
      <td style="padding: 8px; border: 1px solid #2d3a66; background: #1a4d7a; color: white;"><b>Correct</b><br>True Positive<br>(1-β)</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #2d3a66; background: rgba(154, 207, 255, 0.08);"><b>Fail to Reject H₀</b></td>
      <td style="padding: 8px; border: 1px solid #2d3a66; background: #1a4d7a; color: white;"><b>Correct</b><br>True Negative<br>(1-α)</td>
      <td style="padding: 8px; border: 1px solid #2d3a66; background: #8b7508ff; color: white;"><b>Type II Error</b><br>False Negative<br>(β)</td>
    </tr>
  </tbody>
</table>

***

-! Trade-off: Decreasing α increases β (and vice versa)
-! Increasing sample size reduces both errors

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="error-analogy" -->
## Understanding Errors: A Water Quality Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Water Quality Example**

-! H₀: Water meets safety standards
-! H₁: Water is contaminated

***

<div style="background: #8b1a1a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>Type I Error:</b><br>
Declare water unsafe when it's actually safe<br>
→ Unnecessary plant shutdown<br>
→ Economic cost
</div>

<div style="background: #8b7508ff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>Type II Error:</b><br>
Declare water safe when it's contaminated<br>
→ Public health risk<br>
→ People consume unsafe water
</div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->

-? Which error is worse depends on context!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="one-vs-two-tailed" -->
## One-Tailed vs Two-Tailed Tests
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**One-Tailed Test**

-! Used when we predict the direction of the effect

***

*Example*: Does treatment *reduce* pollution?
-: H₀: μ_after ≥ μ_before
-: H₁: μ_after < μ_before (directional)

***

-! p-value calculated from *one tail* only
-! *Risk*: Miss effect in opposite direction

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Two-Tailed Test**

-! Used when we check for any difference (either direction)

***

*Example*: Does treatment *change* pollution?
-: H₀: μ_after = μ_before
-: H₁: μ_after ≠ μ_before (non-directional)

***

-! p-value calculated from *both tails*
-! More *conservative* (harder to reject H₀)
-! Can detect effects in *either* direction

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="tail-comparison" -->
## Visualizing One- vs Two-Tailed Tests
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
<div id="tails-comparison-chart" style="width: 100%; min-height: 700px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px;"></div>

<script src="resources/figures/tails-comparison.js"></script>
<script>
(function() {
  const containerId = 'tails-comparison-chart';
  const slideId = 'tail-comparison';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initTailsComparison) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initTailsComparison(containerId);
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

-! Notice: For the same observed value, one-tailed p-value is **half** the two-tailed p-value
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="group-activity-hypotheses" -->
## Group Activity: Formulating Hypotheses

<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 10px;">
  
  <div style="background: rgba(26, 77, 122, 0.15); padding: 20px; border-radius: 12px; border-left: 5px solid #06d6a0;">
    <div style="background: #06d6a0; color: #fff; padding: 8px; border-radius: 6px; text-align: center; font-weight: bold; margin-bottom: 15px;">
      Case 1: Flow Limit
    </div>
    <div style="font-size: 0.8em; line-height: 1.6;">
      <p><strong>Scenario:</strong> A river's flow should be at least 100 cubic feet per second (cfs).</p>
      <p style="color: #ff9100ff; font-weight: 600; margin-top: 15px;">💭 What are H₀ and H₁? One- or two-tailed?</p>
    </div>
  </div>

  <div style="background: rgba(26, 77, 122, 0.15); padding: 20px; border-radius: 12px; border-left: 5px solid #f77f00;">
    <div style="background: #f77f00; color: #fff; padding: 8px; border-radius: 6px; text-align: center; font-weight: bold; margin-bottom: 15px;">
      Case 2: pH Neutrality
    </div>
    <div style="font-size: 0.8em; line-height: 1.6;">
      <p><strong>Scenario:</strong> Drinking water pH should be around neutral (pH = 7.0).</p>
      <p style="color: #ff9100ff; font-weight: 600; margin-top: 15px;">💭 What are H₀ and H₁? One- or two-tailed?</p>
    </div>
  </div>

  <div style="background: rgba(26, 77, 122, 0.15); padding: 20px; border-radius: 12px; border-left: 5px solid #1a588bff;">
    <div style="background: #1a588bff; color: #fff; padding: 8px; border-radius: 6px; text-align: center; font-weight: bold; margin-bottom: 15px;">
      Case 3: Oxygen Level
    </div>
    <div style="font-size: 0.8em; line-height: 1.6;">
      <p><strong>Scenario:</strong> Dissolved oxygen (DO) in a stream must be at least 5 mg/L for fish survival.</p>
      <p style="color: #ff9100ff; font-weight: 600; margin-top: 15px;">💭 What are H₀ and H₁? One- or two-tailed?</p>
    </div>
  </div>

  <div style="background: rgba(26, 77, 122, 0.15); padding: 20px; border-radius: 12px; border-left: 5px solid #e63946;">
    <div style="background: #e63946; color: #fff; padding: 8px; border-radius: 6px; text-align: center; font-weight: bold; margin-bottom: 15px;">
      🧩 Case 4: Oxygen Level
    </div>
    <div style="font-size: 0.8em; line-height: 1.6;">
      <p><strong>Scenario:</strong> Dissolved oxygen (DO) in a stream should be at least 5 mg/L.</p>
      <p style="color: #ff9100ff; font-weight: 600; margin-top: 15px;">💭 What are H₀ and H₁? One- or two-tailed?</p>
    </div>
  </div>

  <div style="background: rgba(26, 77, 122, 0.15); padding: 20px; border-radius: 12px; border-left: 5px solid #9d4edd;">
    <div style="background: #9d4edd; color: #fff; padding: 8px; border-radius: 6px; text-align: center; font-weight: bold; margin-bottom: 15px;">
      🧩 Case 5: Method Comparison
    </div>
    <div style="font-size: 0.8em; line-height: 1.6;">
      <p><strong>Scenario:</strong> Two labs measure turbidity on split samples. Lab A reports consistently higher values than Lab B.</p>
      <p style="color: #ff9100ff; font-weight: 600; margin-top: 15px;">💭 What are H₀ and H₁? One- or two-tailed?</p>
    </div>
  </div>
</div>

---

<!-- .slide:id="common-misconceptions" -->
## Common Misconceptions About p-values
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**What p-values ARE NOT:**

***

<div style="background: #8b1a1a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
❌ <b>NOT</b> the probability that H₀ is true<br>
(p-value assumes H₀ is true)
</div>

<div style="background: #8b1a1a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
❌ <b>NOT</b> the probability results are due to chance<br>
(there's always sampling variability)
</div>

<div style="background: #8b1a1a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
❌ <b>NOT</b> a measure of effect size<br>
(small p-value ≠ large effect)
</div>

<div style="background: #8b1a1a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
❌ <b>NOT</b> a measure of importance<br>
(statistical ≠ practical significance)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**What p-values ARE:**

***

<div style="background: #1a4d7a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
✓ Probability of data (or more extreme) <b>assuming H₀</b>
</div>

<div style="background: #1a4d7a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
✓ A measure of <b>compatibility</b> between data and H₀
</div>

<div style="background: #1a4d7a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
✓ One piece of evidence in scientific inference
</div>

***

-= Always report effect sizes and confidence intervals along with p-values!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="significance-vs-importance" -->
## Statistical Significance vs Practical Importance
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Statistical Significance**

-! Determined by p-value and α

-: Answers: "Is this effect real (not due to chance)?"

***

-! Influenced by:
-: Sample size (large n → easier to find significance)
-: Measurement precision
-: Variability in data

***

-! With large enough sample:
-= Even tiny, meaningless differences become "significant"!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Practical Importance**

-! Determined by effect size and context

-: Answers: "Does this effect matter in practice?"

***

*Example: pH Difference*

<div style="background: #1a2340; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
Study with n=10,000 samples:<br>
Site A: pH = 7.02<br>
Site B: pH = 7.01<br>
p < 0.001 (highly significant!)<br><br>
<b>But:</b> Difference of 0.01 pH units is negligible for water quality decisions
</div>

-= Always ask: "Is this difference *large enough to matter*?"

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="sample-size-impact" -->
## The Role of Sample Size
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**How Sample Size Affects Testing**

-! Larger sample size (n) leads to:
-: Smaller standard errors
-: Larger test statistics (for same effect)
-: Smaller p-values

***

-! Small samples:
-: Type II errors more likely
-: Need large effects to detect significance

***

-! Very large samples:
-: Risk of "significant" but trivial findings
-: Emphasize effect sizes!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Visualization**

<div id="sample-size-chart" style="width: 100%; min-height: 490px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px;"></div>

<script src="resources/figures/sample-size-effect.js"></script>
<script>
(function() {
  const containerId = 'sample-size-chart';
  const slideId = 'sample-size-impact';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initSampleSizeEffect) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initSampleSizeEffect(containerId);
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

-! Same effect, different sample sizes → different p-values

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="reporting-results" -->
## Reporting Hypothesis Test Results
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**What to Report**

-! A complete report includes:

1. **Hypotheses** (H₀ and H₁)
2. **Test used** (name and assumptions)
3. **Test statistic value**
4. **p-value** (exact value when possible)
5. **Decision** (reject or fail to reject H₀)
6. **Effect size** and confidence interval
7. **Interpretation** in context

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Example Report**

<div style="background: #1a2340; padding: 15px; border-radius: 8px; margin: 10px 0; font-size: 0.8em; line-height: 1.6;">
"We tested whether mean nitrate concentrations differed between upstream and downstream sites (two-sample t-test, α = 0.05).<br><br>

<b>H₀:</b> μ_up = μ_down<br>
<b>H₁:</b> μ_up ≠ μ_down<br><br>

Mean upstream: 3.2 mg/L (SD=0.5, n=30)<br>
Mean downstream: 4.1 mg/L (SD=0.6, n=30)<br><br>

<b>Results:</b> t = -6.32, df = 58, p < 0.001<br><br>

We reject H₀. Downstream concentrations are significantly higher by 0.9 mg/L (95% CI: [0.6, 1.2])."
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hypothesis-testing-workflow" -->
## Complete Hypothesis Testing Workflow
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<div style="display: flex; flex-direction: column; gap: 15px; padding: 10px;">

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">1</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Define Research Question</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">What are you trying to investigate?</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">2</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>State Hypotheses (H₀ and H₁)</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Clear, testable statements</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">3</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Choose Significance Level (α)</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Typically 0.05, set before data collection</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">4</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Select Appropriate Test</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Based on data type and assumptions</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">5</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Collect Data</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Following proper sampling procedures</span>
  </div>
</div>

</div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 15px; padding: 10px;">

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">6</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Check Assumptions</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Verify test conditions are met</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">7</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Calculate Test Statistic & p-value</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Using appropriate formulas or software</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">8</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Make Decision</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Compare p-value to α, reject or fail to reject H₀</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">9</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Interpret in Context</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">What does this mean for your research question?</span>
  </div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
  <div style="min-width: 40px; height: 40px; background: #1a4d7a; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold; flex-shrink: 0;">10</div>
  <div style="flex: 1; background: rgba(26, 77, 122, 0.2); padding: 12px; border-radius: 8px;">
    <b>Report Results Completely</b><br>
    <span style="font-size: 0.85em; opacity: 0.9;">Include test details, statistics, p-value, effect size, and interpretation</span>
  </div>
</div>

</div>
<!-- /position -->
<!-- /layout -->
