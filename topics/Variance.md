---
title: "Variance, Standard Deviation & Standard Error"
author: "Gerrit Renner"
keywords: ["variance", "standard deviation", "standard error", "coefficient of variation", "spread"]
requirements: ["Mean Values", "Random Variables"]
description: "Understanding variability: variance, standard deviation, and standard error in water science"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Random Variables

---

<!-- .slide:id="why-more-than-mean" -->
## Why Do We Need More Than a Mean?
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Two Datasets, Same Mean*

-! Two sites measuring dissolved oxygen (mg/L):

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
<b>Site A:</b> [7.8, 8.0, 7.9, 8.1, 8.2]
</div>

-: Mean = 8.0 mg/L
-: Values tightly clustered

***

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
<b>Site B:</b> [5.0, 7.0, 8.0, 9.0, 11.0]
</div>

-: Mean = 8.0 mg/L
-: Values widely spread

***

-=  Same center, very different spread!

<!-- /position -->

<!-- position={row: 1, column: 2} -->
*The Missing Information*

-! The mean shows center, not variability.

<div id="chart-two-datasets" style="width: 100%; margin: 20px auto;"></div>

<script src="resources/js/charts/variance_intro_chart.js"></script>

***

-= We need measures of *spread* to describe data!

-! **Variance** and **standard deviation** quantify scatter around the mean.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="variance-definition" -->
## Variance: Definition & Concept
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Variance?*

-! **Variance** measures average squared deviation from the mean.

***
<div style="font-size: 0.75em;">

| Population Variance | Sample Variance |
|:--------------------:|:-----------------:|
| $\sigma^2$           | $s^2$             |
| $E[(X - \mu)^2]$ | $\frac{\sum_{i=1}^{n}(x_{i} - \bar{x})^2}{n-1}$ |

</div>

***

-! Why square the deviations?
-: Positive and negative deviations don't cancel out
-: Larger deviations get more weight
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Understanding the Units*

-! Variance is in *squared units*!

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Example:</b><br>
If measuring temperature in °C:<br>
 Variance is in (°C)²<br>
 Standard deviation is in °C
</div>

***

-! The **standard deviation** ($s = \sqrt{s^2}$) returns to original units.

***

-? Variance is theoretically important; SD easier to interpret!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="standard-deviation" -->
## Standard Deviation (SD)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*From Variance to Standard Deviation*

$$s = \sqrt{s^2} = \sqrt{\frac{\sum_{i=1}^{n}(x_{i} - \bar{x})^2}{n-1}}$$

***

-! Standard deviation is in same units as data.

-! Rule of thumb (for approximately normal data):
-: ~68% of values within 1 SD
-: ~95% of values within 2 SD
-: ~99.7% of values within 3 SD

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Visual Interpretation*

<div id="chart-sd-bands" style="width: 100%; margin: 20px auto;"></div>

<script src="resources/js/charts/sd_bands_chart.js"></script>

***

-! The shaded band shows 1 SD from the mean.

-= SD quantifies the "typical" scatter around the mean.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="sample-vs-population" -->
## Sample vs Population & Bessel's Correction
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Population vs Sample*

Population parameters (entire dataset):
-: $\mu$ = population mean
-: $\sigma^2$ = population variance
-: $\sigma$ = population SD

***

Sample statistics (subset):
-: $\bar{x}$ = sample mean
-: $s^2$ = sample variance
-: $s$ = sample SD

***

-! In practice, we work with *samples* and estimate population parameters.

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why $(n-1)$ Instead of $n$?*

-! This is **Bessel's correction**.

***

-! Estimating the mean from the sample loses one degree of freedom.

$$s^2 = \frac{\sum_{i=1}^{n}(x_{i} - \bar{x})^2}{n-1}$$

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
<b>Why?</b> Using $\bar{x}$ instead of true $\mu$ makes deviations smaller on average.<br>
Dividing by $(n-1)$ corrects this bias.
</div>

***

-= $s^2$ estimates $\sigma^2$ *unbiasedly*!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bessel-example" -->
## Bessel's Correction: The Bias Demonstrated
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Simulation Results* <button id="rerun-bessel" style="margin-left: 15px; padding: 4px 12px; background: #09414dff; color: #00dee6ff; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8em; font-weight: bold;"><i class="fa-solid fa-rotate-right"></i> Rerun</button>

<div id="bessel-bias-chart" style="width: 100%; height: 800px;"></div>
<script src="resources/js/charts/bessel_bias_chart.js"></script>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*What This Shows*

-! *1000 random samples* 
-: Drawn from a known population
-: Population variance: $\sigma^2 = 225$
-: Sample size: $n = 5$ (typical in analytical chemistry)

***

-? Why does using $\bar{x}$ create bias?
-: Sample mean minimizes deviations *within the sample*
-: This makes $(x_i - \bar{x})^2$ smaller than $(x_i - \mu)^2$
-: Dividing by $n-1$ compensates for this "lost" degree of freedom

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.8em;">
<b>Key insight:</b> The $(n-1)$ correction ensures that on average, our variance estimates equal the true population variance.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="standard-error" -->
## Standard Error (SE) of the Mean
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Standard Error Formula*

$$SE(\bar{x}) = \frac{s}{\sqrt{n}}$$

***

-! **Standard Deviation (SD)**: 
-: Spread of the data
-: Describes variability in individual measurements
-: Does *not* decrease with sample size

***

-! **Standard Error (SE)**: Precision of the mean
-: Describes uncertainty in the sample mean
-: Decreases as $\sqrt{n}$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Key Distinction*

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>SD = Data Spread</b><br>
"How variable are individual measurements?"
</div>

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>SE = Mean Precision</b><br>
"How precise is our estimate of the mean?"
</div>

***

-! Example: Measuring pH 100 times
-: SD ≈ 0.2 units (measurement variability)
-: SE ≈ 0.02 units (mean precision)

***

-= As $n \uparrow$, SE $\downarrow$, but SD stays constant!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="lln-intuition" -->
## Law of Large Numbers
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Sampling Distribution of the Mean*

-! As sample size increases, sample means become narrower.

***

-! **Standard error** quantifies this narrowing:

$$SE = \frac{s}{\sqrt{n}}$$

***

-? Doubling sample size reduces SE by $\sqrt{2} \approx 1.4$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Visualization*

<div id="chart-sampling-distributions" style="width: 100%; margin: 20px auto;"></div>

<script src="resources/js/charts/sampling_distribution_chart.js"></script>

***

-! Distributions show sample means for $n = 5, 30, 100$.

-= Larger samples give more precise mean estimates!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-symmetric" -->
## Example: Dissolved Oxygen (Near-Symmetric Data)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

-! Dissolved oxygen measurements (mg/L) over 10 days:

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
[7.8, 8.2, 7.9, 8.1, 8.0, 7.7, 8.3, 7.9, 8.0, 8.1]
</div>

***

-! Calculate: mean, SD, SE

***

-? SD = day-to-day variability
-? SE = precision of the average

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="do-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Dissolved oxygen (mg/L)
do_data <- c(7.8, 8.2, 7.9, 8.1, 8.0, 7.7, 8.3, 7.9, 8.0, 8.1)

# Calculate statistics
mean_do <- mean(do_data)
sd_do <- sd(do_data)
n <- length(do_data)
se_do <- sd_do / sqrt(n)

print(paste("Mean:", round(mean_do, 2), "mg/L"))
print(paste("SD:", round(sd_do, 3), "mg/L"))
print(paste("SE:", round(se_do, 3), "mg/L"))
print(paste("n =", n))`;

    const fallback = () => {
      const data = [7.8, 8.2, 7.9, 8.1, 8.0, 7.7, 8.3, 7.9, 8.0, 8.1];
      const mean = data.reduce((a, b) => a + b, 0) / data.length;
      const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (data.length - 1);
      const sd = Math.sqrt(variance);
      const se = sd / Math.sqrt(data.length);
      return `[Simulated in JavaScript]\nMean: ${mean.toFixed(2)} mg/L\nSD: ${sd.toFixed(3)} mg/L\nSE: ${se.toFixed(3)} mg/L\nn = ${data.length}`;
    };

    await window.webRHelper.initInteractiveSection({
      containerId: 'do-container',
      code: code,
      slideId: 'example-symmetric',
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
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="skewed-data" -->
## Skewed Data: E. coli Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-bacterium" style="font-size: 6em; opacity: 0.9;"></i>
</div>

*The Problem with Skewed Data*

-! E. coli counts are typically right-skewed:

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
[10, 15, 20, 25, 30, 500] CFU/100mL
</div>

***

-: Arithmetic mean = 100 CFU/100mL
-: SD = 196 CFU/100mL

-= Mean and SD are dominated by the outlier!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Better Approaches*

Use geometric mean
-: $\bar{x}_{geom} = \exp(\overline{\log x})$

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Example:</b><br>
Geometric mean : 32 CFU/100mL
</div>

***

-? What about variability of this skewed data?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="geometric-context" -->
## Variability in Geometric Context
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Geometric Mean Revisited*

$$\bar{x}\_{geom} = \exp\left(\frac{1}{n}\sum_{i=1}^{n}\ln(x_{i})\right)$$

***

-! Let's work on log scale:

-: Calculate: $\bar{y} = \overline{\log x}$
-: Calculate: $s_{y} = SD(\log x)$

***

-! Interpretation: $s_{y}$ represents *multiplicative* spread.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Bacterial Counts*

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
E. coli: [10, 15, 20, 25, 30, 500] CFU/100mL
</div>

-: Geometric mean: $g = 32$ CFU/100mL
-: $SD(\log x) = 1.40$
-: Multiplicative factor: $\exp(1.40) = 4.05$

***

-= Instead $\bar{x} \pm s$, for geometric data use: $\bar{x}\_{geom} \times / \div \exp(s_{y})$
-: 32 CFU/100mL $\times$ / $\div$ 4.05
-: Range: [7.9, 130] CFU/100mL

***

<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-flask" style="font-size: 4em; opacity: 0.9; transform: rotate(45deg);"></i>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="harmonic-context" -->
## Variability in Harmonic Context
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Harmonic Mean Revisited*

$$\bar{x}\_{harm} = \frac{n}{\sum_{i=1}^{n}\frac{1}{x_{i}}}$$

***

-! Used for rates in series (e.g., hydraulic conductivity in soil layers).

***

-! Conceptually: Variability assessed using $SD(1/x)$.
-: No simple formula for SD of harmonic mean. (We learn later)

<div class="note" style="font-size:0.7em; opacity:0.8; margin-top:1em;">
If variability needs to be expressed, it is usually assessed on the reciprocal scale, i.e. using SD(1/x). 
The uncertainty of the harmonic mean itself is rarely reported in practice.
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Hydraulic Conductivity*

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
K values: [0.5, 2.0, 5.0] m/day (three layers)
</div>

***

-: Harmonic mean: $h = 1.03$ m/day
-: (Dominated by slowest layer)

***

-! The harmonic mean correctly represents effective conductivity in series.

***

<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-layer-group" style="font-size: 5em; opacity: 0.9;"></i>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="sd-vs-se-plots" -->
## SD vs SE on Plots
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*A Common Confusion*

-! Error bars on plots can show either SD or SE.

***

-! SD bars: Show data spread
-: "Where most individual values lie"
-: Longer bars

***

-! SE bars: Show mean precision
-: "Uncertainty in the mean estimate"
-: Shorter bars (especially for large $n$)

***

-= Always label which one you're using!
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Visual Comparison*

<div id="chart-sd-vs-se" style="width: 100%; margin: 20px auto;"></div>

<script src="resources/js/charts/sd_vs_se_chart.js"></script>

***

<div style="background: #8b1a1a; color: #ffffff; padding: 8px; border-radius: 8px; margin: 6px 0; font-size: 0.75em;">
<b>Warning:</b> Misusing SE bars to make data look "less variable" is a common mistake in literature!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="units-scaling-cv" -->
## Units, Scaling, and Coefficient of Variation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Units Matter*

-! **SD** & **SE** have same units as data.

-: Temperature in °C -> SD in °C
-: Concentration in mg/L -> SD in mg/L

***

-! *Problem*: Can't compare variability across scales/units.

***

-? Is SD = 2°C "high"? Depends on the mean!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Coefficient of Variation (CV)*

$$CV = \frac{s}{\bar{x}}$$

-! *Unitless* measure of relative variability.

***

-! Useful for comparing datasets with different means/units.

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.75em;">
<b>Example:</b><br>
A: mean = 8 mg/L, SD = 0.2 -> CV = 2.5%<br>
B: mean = 20 mg/L, SD = 1.0 -> CV = 5%<br>
<br>
-> B has higher absolute variability but similar relative variability.
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="choosing-summary" -->
## Choosing the Right Summary
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
*Match Your Measure of Spread to Your Data Structure*

<div style="font-size: 0.85em; margin: 20px auto; max-width: 900px;">

| **Data Structure** | **Typical Mean** | **Appropriate Spread** | **Example** |
|:-------------------|:-----------------|:-----------------------|:------------|
| Additive / Symmetric | Arithmetic ($\bar{x}$) | SD, SE($\bar{x}$) | pH, dissolved oxygen |
| Multiplicative / Log-normal | Geometric ($\bar{x}_{geom}$) | SD of $\log x$ | E. coli, bacterial counts |
| Reciprocal / Rates in series | Harmonic ($\bar{x}_{harm}$) | we learn later | Hydraulic conductivity layers |

</div>

-= *Key:* Assess variability on same scale as the mean!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="r-snippets" -->
## Calculating Variance and SD in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Essential **R** functions for variance and spread:

<div style="display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Arithmetic mean:</div>
<div style="flex: 1;">

```r
mean(x)
```

</div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Standard deviation:</div>
<div style="flex: 1;">

```r
sd(x)
```

</div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Standard error:</div>
<div style="flex: 1;">

```r
sd(x) / sqrt(length(x))
```

</div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Variance:</div>
<div style="flex: 1;">

```r
var(x)
```

</div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Geometric mean:</div>
<div style="flex: 1;">

```r
exp(mean(log(x)))
```

</div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Geometric SD:</div>
<div style="flex: 1;">

```r
exp(sd(log(x)))
```

</div>
</div>

<div style="display: flex; align-items: center; gap: 15px;">
<div style="min-width: 200px; color: #ffffff; font-weight: bold;">Harmonic mean:</div>
<div style="flex: 1;">

```r
1 / mean(1/x)
```

</div>
</div>

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="r-snippets-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Example data
x <- c(10, 20, 50, 100, 200)

# Arithmetic statistics
print(paste("Arithmetic mean:", round(mean(x), 2)))
print(paste("SD:", round(sd(x), 2)))
print(paste("SE:", round(sd(x)/sqrt(length(x)), 2)))

# Geometric statistics
g <- exp(mean(log(x)))
print(paste("Geometric mean:", round(g, 2)))
print(paste("SD(log x):", round(sd(log(x)), 3)))

# Harmonic mean
h <- 1/mean(1/x)
print(paste("Harmonic mean:", round(h, 2)))`;

    const fallback = () => {
      const x = [10, 20, 50, 100, 200];
      const meanArith = x.reduce((a, b) => a + b, 0) / x.length;
      const variance = x.reduce((sum, val) => sum + Math.pow(val - meanArith, 2), 0) / (x.length - 1);
      const sd = Math.sqrt(variance);
      const se = sd / Math.sqrt(x.length);
      const logX = x.map(v => Math.log(v));
      const meanLog = logX.reduce((a, b) => a + b, 0) / logX.length;
      const geom = Math.exp(meanLog);
      const varLog = logX.reduce((sum, val) => sum + Math.pow(val - meanLog, 2), 0) / (logX.length - 1);
      const sdLog = Math.sqrt(varLog);
      const harm = x.length / x.reduce((sum, val) => sum + 1 / val, 0);
      return `[Simulated in JavaScript]\nArithmetic mean: ${meanArith.toFixed(2)}\nSD: ${sd.toFixed(2)}\nSE: ${se.toFixed(2)}\nGeometric mean: ${geom.toFixed(2)}\nSD(log x): ${sdLog.toFixed(3)}\nHarmonic mean: ${harm.toFixed(2)}`;
    };

    await window.webRHelper.initInteractiveSection({
      containerId: 'r-snippets-container',
      code: code,
      slideId: 'r-snippets',
      fallback: fallback,
      runLabel: 'Run Examples',
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

<!-- .slide:id="common-pitfalls" -->
## Common Pitfalls
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
1. Confusing SD and SE
-: SD describes data spread
-: SE describes mean precision
-= They answer different questions!

***

2. Using arithmetic mean on skewed data
-: E. coli, heavy metals often log-normal
-= Use geometric mean instead

***

3. Ignoring units
-: Variance in squared units
-: Remember to take square root for SD

<!-- /position -->
<!-- position={row: 1, column: 2} -->
4. Averaging rates arithmetically
-: Flow through layers in series
-= Use harmonic mean

***

5. Unlabeled error bars
-: Always specify SD or SE
-: Context matters!

***

<div style="background: #8b1a1a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0;">
<b>⚠ Critical:</b><br>
Match your measure of spread to your type of mean!
</div>

<!-- /position -->
<!-- /layout -->