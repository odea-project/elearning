---
title: "Moments of a Distribution"
author: "Gerrit Renner"
keywords: ["moments", "mean", "variance", "skewness", "kurtosis"]
requirements: ["Mean Values", "Variance", "Distributions"]
description: "Using the first four statistical moments to describe distribution shape."
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Variance
- Distributions

---

<!-- .slide:id="moments_overview" -->
## Moments Summarize Shape
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! *Moments* capture different aspects of a distribution relative to its mean.
-! First four moments:

1. Mean (location)
2. Variance (spread)
3. Skewness (asymmetry)
4. Kurtosis (tail weight)
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="background: rgba(15, 23, 42, 0.35); padding: 16px; border-radius: 10px;">
  <div style="font-weight: 700; color: #9efcff; margin-bottom: 8px;">General definition</div>
  <div style="font-size: 0.85em; line-height: 1.5;">
$$m_k = E[(X - \mu)^k]$$
-: $\mu$ : population mean
-: $k$ : 1, 2, 3, 4 for the first four centered moments
  </div>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="first_moment" -->
## First Moment: Mean (Recap)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Arithmetic mean anchors the location of the distribution.
-! Same definition as in *Mean Values*: $\bar{x} = \frac{1}{n} \sum x_i$.
-: Sensitive to outliers and skew-pair with higher moments for context.

***

-< Use geometric/harmonic means only when measurement process demands it.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**From Mean Value**  
Rolls of five dice illustrated how $\bar{x}$ emerges as the long-run average. Revisit the deck for interactive simulations and comparisons across arithmetic, geometric, and harmonic means.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="first_moment_r" -->
## Mean in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Useful functions
-! `mean(x, na.rm = TRUE)` returns the first moment.
-: Pair with `median(x)` to check sensitivity to skew/outliers.
-< Use `c(...)` to define numeric vectors or pull columns inside `dplyr` pipelines.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="mean-moment-container"></div>

<script>
(function() {
  const initMeanMoment = async () => {
    const code = `# Dissolved oxygen measurements (mg/L)
do_mgL <- c(7.8, 8.1, 7.9, 8.3, 7.6)

mean_do <- mean(do_mgL)
median_do <- median(do_mgL)

cat("Measurements (mg/L):", paste(do_mgL, collapse = ", "), "\\n")
cat("Arithmetic mean:", round(mean_do, 2), "mg/L\\n")
cat("Median:", round(median_do, 2), "mg/L\\n")`;

    const fallback = () => {
      const values = [7.8, 8.1, 7.9, 8.3, 7.6];
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      const sorted = values.slice().sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      return `[Simulated in JavaScript]\nMeasurements (mg/L): ${values.join(", ")}\nArithmetic mean: ${mean.toFixed(2)} mg/L\nMedian: ${median.toFixed(2)} mg/L`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'mean-moment-container',
      code: code,
      slideId: 'first_moment_r',
      fallback: fallback,
      runLabel: 'Run R Code'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeanMoment);
  } else {
    initMeanMoment();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="second_moment" -->
## Second Moment: Variance (Recap)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Sample variance: $s^2 = \frac{\sum (x_i - \bar{x})^2}{n-1}$ (Bessel correction).
-! Captures the average squared deviation--larger deviations count more.
-: Standard deviation $s = \sqrt{s^2}$ restores original measurement units.

***

-< Compare *Variance* deck examples: two rivers with equal means but different spread.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**From Variance**  
Same-mean river oxygen records showed why variance matters. The deck also covers standard error and coefficient of variation-helpful when the second moment must be communicated as an uncertainty band.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="second_moment_r" -->
## Variance in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Useful functions
-! `var(x, na.rm = TRUE)` computes the second moment about the mean.
-: `sd(x)` is the square root of variance for original units.
-< Apply within groups: `summarise(var = var(value, na.rm = TRUE))`.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="variance-moment-container"></div>

<script>
(function() {
  const initVarianceMoment = async () => {
    const code = `# Daily nitrate concentrations (mg/L)
no3 <- c(1.8, 2.1, 1.9, 2.5, 2.2)

var_no3 <- var(no3)
sd_no3 <- sd(no3)

cat("Nitrate (mg/L):", paste(no3, collapse = ", "), "\\n")
cat("Variance:", round(var_no3, 4), "\\n")
cat("Standard deviation:", round(sd_no3, 3), "mg/L\\n")`;

    const fallback = () => {
      const no3 = [1.8, 2.1, 1.9, 2.5, 2.2];
      const mean = no3.reduce((sum, value) => sum + value, 0) / no3.length;
      const variance = no3.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (no3.length - 1);
      const sd = Math.sqrt(variance);
      return `[Simulated in JavaScript]\nNitrate (mg/L): ${no3.join(", ")}\nVariance: ${variance.toFixed(4)}\nStandard deviation: ${sd.toFixed(3)} mg/L`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'variance-moment-container',
      code: code,
      slideId: 'second_moment_r',
      fallback: fallback,
      runLabel: 'Run R Code'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVarianceMoment);
  } else {
    initVarianceMoment();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="third_moment" -->
## Third Moment: Skewness
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Measures asymmetry: 
$$\gamma_1 = \frac{E[(X - \mu)^3]}{\sigma^3}$$
-: $\gamma_1 > 0$: long right tail (e.g., storm-driven turbidity spikes).
-: $\gamma_1 < 0$: long left tail (e.g., dissolved oxygen capped at high values).
-: Sensitive to rare extremes--validate with domain knowledge before reporting.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
  <div style="background: rgba(112, 41, 20, 0.35); padding: 12px; border-radius: 8px; font-size: 0.8em;">
    <strong>Environmental signal</strong><br>
    Rainfall intensities, pollutant loads, and trace concentrations often show strong positive skew-median beats mean for typical behaviour.
  </div>
  <div style="background: rgba(26, 77, 122, 0.35); padding: 12px; border-radius: 8px; font-size: 0.8em;">
    <strong>Practical check</strong><br>
    Plot log-transformed histograms; if skew persists after transformation, consider robust statistics or percentile reporting.
  </div>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="third_moment_r" -->
## Skewness in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Useful functions
-! Define `skew_sample <- function(x) {...}` to avoid extra packages.
-: Center on `mean(x)` and scale by `sd(x)^3` to make it dimensionless.
-< Evaluate skewness alongside histograms or `summary(x)` before reporting.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="skewness-moment-container"></div>

<script>
(function() {
  const initSkewnessMoment = async () => {
    const code = `# Storm event loads (kg)
loads <- c(0.8, 1.1, 1.4, 2.2, 5.6)

skew_sample <- function(x) {
  n <- length(x)
  m <- mean(x)
  s <- sd(x)
  if (n < 3) return(NA_real_)
  sum(((x - m) / s)^3) * n / ((n - 1) * (n - 2))
}

skew_value <- skew_sample(loads)

cat("Loads (kg):", paste(loads, collapse = ", "), "\\n")
cat("Sample skewness:", round(skew_value, 3), "\\n")`;

    const fallback = () => {
      const loads = [0.8, 1.1, 1.4, 2.2, 5.6];
      const n = loads.length;
      if (n < 3) {
        return '[Simulated in JavaScript]\nNeed at least 3 values for skewness.';
      }
      const mean = loads.reduce((sum, value) => sum + value, 0) / n;
      const variance = loads.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
      const sd = Math.sqrt(variance);
      const skew = loads.reduce((sum, value) => sum + Math.pow((value - mean) / sd, 3), 0) * n / ((n - 1) * (n - 2));
      return `[Simulated in JavaScript]\nLoads (kg): ${loads.join(", ")}\nSample skewness: ${skew.toFixed(3)}`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'skewness-moment-container',
      code: code,
      slideId: 'third_moment_r',
      fallback: fallback,
      runLabel: 'Run R Code'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSkewnessMoment);
  } else {
    initSkewnessMoment();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fourth_moment" -->
## Fourth Moment: Kurtosis
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Standardized fourth moment: 
$$\gamma_2 = \frac{E[(X - \mu)^4]}{\sigma^4}$$
-! *Excess kurtosis*: $K = \gamma_2 - 3$ (normal distribution baseline = 0).
-: High kurtosis (leptokurtic) = heavy tails / more extreme events.
-: Low kurtosis (platykurtic) = flatter peak / lighter tails.

***

-< Use with caution-estimates need large samples to stabilize.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="background: rgba(153, 69, 255, 0.25); padding: 14px; border-radius: 9px; font-size: 0.85em;">
  <strong>Risk framing</strong><br>
  High kurtosis in nutrient runoff implies rare but massive pulses. Communicate mitigation plans (buffer strips, retention basins) alongside the statistic.
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="fourth_moment_r" -->
## Kurtosis in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Useful functions
-! `kurtosis_sample <- function(x) {...}` returns excess kurtosis.
-: Multiply-tail events drive `> 0` values; normal baseline sits near 0.
-< Report with quantiles or max/min so stakeholders grasp tail behaviour.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="kurtosis-moment-container"></div>

<script>
(function() {
  const initKurtosisMoment = async () => {
    const code = `# Nutrient runoff pulses (kg)
runoff <- c(0.4, 0.6, 0.7, 0.8, 0.9, 4.1, 5.3)

kurtosis_sample <- function(x) {
  n <- length(x)
  m <- mean(x)
  s <- sd(x)
  if (n < 4) return(NA_real_)
  term1 <- n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))
  term2 <- sum(((x - m) / s)^4)
  term3 <- 3 * (n - 1)^2 / ((n - 2) * (n - 3))
  term1 * term2 - term3
}

kurt_value <- kurtosis_sample(runoff)

cat("Runoff (kg):", paste(runoff, collapse = ", "), "\\n")
cat("Excess kurtosis:", round(kurt_value, 3), "\\n")`;

    const fallback = () => {
      const runoff = [0.4, 0.6, 0.7, 0.8, 0.9, 4.1, 5.3];
      const n = runoff.length;
      if (n < 4) {
        return '[Simulated in JavaScript]\nNeed at least 4 values for kurtosis.';
      }
      const mean = runoff.reduce((sum, value) => sum + value, 0) / n;
      const variance = runoff.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
      const sd = Math.sqrt(variance);
      const term2 = runoff.reduce((sum, value) => sum + Math.pow((value - mean) / sd, 4), 0);
      const term1 = n * (n + 1) / ((n - 1) * (n - 2) * (n - 3));
      const term3 = 3 * Math.pow(n - 1, 2) / ((n - 2) * (n - 3));
      const kurtosis = term1 * term2 - term3;
      return `[Simulated in JavaScript]\nRunoff (kg): ${runoff.join(", ")}\nExcess kurtosis: ${kurtosis.toFixed(3)}`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'kurtosis-moment-container',
      code: code,
      slideId: 'fourth_moment_r',
      fallback: fallback,
      runLabel: 'Run R Code'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initKurtosisMoment);
  } else {
    initKurtosisMoment();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->
