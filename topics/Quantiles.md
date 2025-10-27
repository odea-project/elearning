---
title: "Quantiles"
author: "Gerrit Renner"
keywords: ["range", "quantile", "interquartile range", "boxplot", "spread"]
requirements: ["Mean Values", "Variance"]
description: "Understanding range, quantiles, and robust spread measures for water science data."
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Variance

---

<!-- .slide:id="quantiles-intro" -->
## Introduction to Quantiles

<div style="text-align: center; margin-bottom: 10px;">
  <button id="btn-raw-data" class="view-btn active" style="padding: 8px 16px; margin: 0 6px; background: #1a2340; color: #9efcff; border: 2px solid #9efcff; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Raw Data</button>
  <button id="btn-mean-sd" class="view-btn" style="padding: 8px 16px; margin: 0 6px; background: #1a2340; color: #9efcff; border: 2px solid #555; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Mean ± SD</button>
  <button id="btn-quantiles" class="view-btn" style="padding: 8px 16px; margin: 0 6px; background: #1a2340; color: #9efcff; border: 2px solid #555; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Quantiles</button>
</div>
<div id="quantiles-intro-container" style="width: 100%; height: 820px;"></div>

<script src="../resources/figures/quantiles-intro-plot.js"></script>
<script>
(function() {
  const initPlot = () => {
    if (typeof d3 !== 'undefined' && window.initQuantilesIntro) {
      window.initQuantilesIntro();
    } else {
      // Retry after a short delay if D3 or plot function not ready
      setTimeout(initPlot, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlot);
  } else {
    initPlot();
  }
})();
</script>

---

<!-- .slide:id="quantiles-definition" -->
## Definition of Quantiles
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

What are **Quantiles?**

-! Quantiles divide a sorted dataset into equal-sized groups
-: Median (Q2): the value separating the lower 50% from the upper 50%
-: Quartiles: Q1 (25%), Q2 (50%), Q3 (75%)
-: Percentiles: divide data into 100 parts (e.g., 90th percentile)

***

-! *Key idea*: Instead of "What's the average?" ask "What value is exceeded by only X% of samples?"

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Base for quantile estimation is the `sorted` data list
-: e.g., `[3, 7, 8, 12, 13, 14, 18, 21, 23, 27]`

***

-! The positions in the sorted lists are indicated as brackets indexes
-: e.g., $x_{(1)}$ is the smallest value, $x_{(n)}$ the largest

***

-! Important:
$$ x_{(k)} : \text{value at position } k \text{ in sorted list} $$
$$ x_{k} : \text{value at position } k \text{ in original list} $$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="quantiles-definition-2" -->
## Definition of Quantiles II
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The general approach for percentile estimation requires two steps:

1. Estimation of the index $k$
$$ k = p \cdot (n + 1) $$
-: $k$ : index in the sorted data list
-: $p$ : probability of choice, e.g., 0.25 for 25% quantile
-: $n$ : number of data points

***

*Example*
-: $p = 0.4$, $n = 46$
$$k = 0.4 \cdot (46+1) = 18.8$$
<!-- /position -->
<!-- position={row: 1, column: 2} -->
2. Extract `or` Interpolate the value at $x_{(k)}$
*If* $k$ is an `Integer`, e.g., `k=7`, **direct** extraction is possible:
$$P\_{p} = x\_{(k)}$$

***

*Example*: 
$$P\_{0.4} = x\_{(7)} = 42.42$$
-= Interpretation: 40 % of data points are smaller than 42.42.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="quantiles-definition-3" -->
## Definition of Quantiles III
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Else*, the values requires **interpolation** as follows:
$$P\_{p} = x_{(\lfloor k \rfloor)} + (k - \lfloor k \rfloor) \cdot (x_{(\lceil k \rceil)} - x_{(\lfloor k \rfloor)}) $$
-: $\lfloor x \rfloor$ : round to next lower integer, e.g., $\lfloor 4.7 \rfloor = 4$
-: $\lceil x \rceil$ : round to next upper integer, e.g., $\lceil 4.7 \rceil = 5$
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example*
-: $k=18.8$
$$ P_{0.4} =  x_{(18)} + (18.8 - 18) \cdot (x_{(19)} - x_{(18)}) $$
$$ P_{0.4} = 76 + 0.8 \cdot (84 - 76) = 82.4 $$
-= Interpretation: 40 % of data points are smaller than 82.4.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="quantiles-in-r" -->
## Quantiles in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! R provides `quantile()` to calculate any percentile
-: Default method: `type = 7` (linear interpolation)
-: Other software (Excel, Python) may use different methods

***

**Syntax:**
```r
quantile(x, probs = c(0.25, 0.5, 0.75))
```

-: `x`: numeric vector
-: `probs`: probabilities (0 to 1)

***

-! Always document which method you use for reproducibility

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="quantiles-in-r-container"></div>

<script>
(function() {
  const initQuantilesR = async () => {
    const code = `# Phosphate measurements (PO4 in mg/L)
PO4 <- c(0.12, 0.08, 0.10, 0.09, 0.35, 0.11, 0.13, 0.07, 0.10, 0.09)

# Calculate quartiles
quantile(PO4, probs = c(0.25, 0.5, 0.75)) |> print()
cat("--------------------","\\n")

# 90th percentile
quantile(PO4, 0.90) |> print()
cat("--------------------","\\n")

# 90th percentile as pipe
PO4 |> quantile(0.90) |> print()`;

    const fallback = () => `[Simulated]
Data: 0.12, 0.08, 0.10, 0.09, 0.35, 0.11, 0.13, 0.07, 0.10, 0.09

  25%   50%   75% 
0.090 0.105 0.120`;

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'quantiles-in-r-container',
      code: code,
      slideId: 'quantiles-in-r',
      fallback: fallback,
      runLabel: 'Run quantile()',
      minHeight: '240px'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuantilesR);
  } else {
    initQuantilesR();
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="iqr-robustness" -->
## Interquartile Range (IQR) - Robust Spread
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The IQR measures the spread of the middle 50% of data
$$ IQR = Q3 - Q1 $$
-: Q3 : 75th percentile || Q1 : 25th percentile

***

-! Robust to outliers: extreme values don't affect it
-: Standard Deviation is sensitive to every value, especially outliers

***

-! IQR is preferred when data contain anomalies or extreme events
-: Common in environmental monitoring with large sensor noise or storm events

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="iqr-robustness-container"></div>

<script>
(function() {
  const initIQRRobust = async () => {
    const code = `# Dataset without outliers
clean <- c(20, 22, 24, 25, 26, 28, 30, 32, 34, 36)

# Dataset with outliers
with_outliers <- c(20, 22, 24, 25, 26, 28, 30, 32, 34, 120)

clean |> sd() |> cat("<- sd (without outlier)\\n")
with_outliers |> sd() |> cat("<- sd (with outlier)\\n\\n")
clean |> IQR() |> cat("<- IQR (without outlier)\\n")
with_outliers |> IQR() |> cat("<- IQR (with outlier)")
`;

    const fallback = () => `[Simulated]
     Dataset    SD  IQR
1      Clean  5.68 10.0
2 With Outlier 29.41 10.0

Notice: SD increases drastically with the outlier,
but IQR remains stable!`;

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'iqr-robustness-container',
      code: code,
      slideId: 'iqr-robustness',
      fallback: fallback,
      runLabel: 'Compare IQR vs SD',
      minHeight: '200px'
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIQRRobust);
  } else {
    initIQRRobust();
  }
})();
</script>

***

-! HINT: for normal distributions:
-: IQR ≈ 1.35 × SD

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="quantiles-application" -->
## Application: Pesticide Concentrations in Surface Waters
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<div style="text-align: center; margin-bottom: 10px;">
  <button id="btn-raw-pesticide" class="pesticide-view-btn active" style="padding: 8px 16px; margin: 0 6px; background: #1a2340; color: #9efcff; border: 2px solid #9efcff; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Raw Data</button>
  <button id="btn-mean-pesticide" class="pesticide-view-btn" style="padding: 8px 16px; margin: 0 6px; background: #1a2340; color: #9efcff; border: 2px solid #555; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Show Mean</button>
  <button id="btn-quantiles-pesticide" class="pesticide-view-btn" style="padding: 8px 16px; margin: 0 6px; background: #1a2340; color: #9efcff; border: 2px solid #555; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">Show Quantiles</button>
</div>
<div id="pesticide-quantiles-container" style="width: 100%; height: 820px;"></div>

<script src="../resources/figures/pesticide-quantiles-plot.js"></script>
<script>
(function() {
  const initPlot = () => {
    if (typeof d3 !== 'undefined' && window.initPesticideQuantiles) {
      window.initPesticideQuantiles();
    } else {
      // Retry after a short delay if D3 or plot function not ready
      setTimeout(initPlot, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlot);
  } else {
    initPlot();
  }
})();
</script>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Key Insights:**

-! Pesticide monitoring in agricultural catchment over 30 days
-: Terbuthylazine concentrations measured daily
-: Mean concentration appears low (~0.05 µg/L) - misleading!
-: Rainfall events cause acute pollution peaks (1-2 µg/L)

***

-? Why quantiles matter:
-: Mean values mask short-term pollution peaks
-: 95th/99th percentiles reveal acute exposure events
-: Even brief peaks can harm aquatic organisms
-: Critical for environmental quality assessment
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="boxplots-intro" -->
## Boxplots for Water Quality Data
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<div id="boxplot-water-quality-container" style="width: 100%; height: 600px; display: flex; justify-content: center; align-items: center;"></div>

<script src="../resources/figures/boxplot-water-quality.js"></script>
<script>
(function() {
  const initPlot = () => {
    if (typeof d3 !== 'undefined' && window.initBoxplotWaterQuality) {
      window.initBoxplotWaterQuality();
    } else {
      // Retry after a short delay if D3 or plot function not ready
      setTimeout(initPlot, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlot);
  } else {
    initPlot();
  }
})();
</script>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

**Reading Boxplots:**

-> Box: spans from Q1 to Q3 (IQR), contains middle 50% of data
-> Median line: horizontal line inside box (Q2), middle value
-> Mean: diamond marker, average value (can differ from median)
-> Whiskers: extend to min/max within 1.5×IQR
-> Outliers: individual points beyond whiskers, unusual values


<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="boxplot-cases" -->
## What Boxplots tell us about the Data

<div id="boxplot-distributions-container" style="width: 100%; height: 900px; display: flex; justify-content: center; align-items: center;"></div>

<script src="../resources/figures/boxplot-distributions.js"></script>
<script>
(function() {
  const initPlot = () => {
    if (typeof d3 !== 'undefined' && window.initBoxplotDistributions) {
      window.initBoxplotDistributions();
    } else {
      // Retry after a short delay if D3 or plot function not ready
      setTimeout(initPlot, 100);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlot);
  } else {
    initPlot();
  }
})();
</script>

---

<!-- .slide:id="boxplot-in-r" -->
## Boxplot in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Using the `boxplot()` Function**

-! R provides `boxplot()` to visualize distributions
-! Can compare multiple groups with formula notation

***

**Syntax:**
```r
boxplot(value ~ group, data = df)
```

-: Horizontal boxplot: `horizontal = TRUE`
-: Customize colors: `col`, `border`

***

-! Use the "Generate Boxplot (WebR)" button to run the example on demand

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<a href="https://webr.sh/#code=eJxdUD1PwzAQFWt%2BxcldbCmk%2BShRBzrRtQvQGTnxhViK7chxVbqw8Av4DxULCzMjEv8LxxRaGE7ye7737t09P%2B01V%2Fi61k66DkWWXO977tr3aWsUTrdY3W0GtNPTf8Ed%2Fzx7mcAtqh4tdxuLMJLQWKPAtRYRlNHSGSv1PQyOO2n0EA3okgFR0FnOIufFA1yeB2XSWJ%2BCRhA8YQE1tdpYRYs0hmweQ85iODK5r%2BIPk5W%2BkgvGYu9x8z3Q21jsaU3Juh%2BcRa5IDGQlxREszVYfkLdDXrdeVKQsYlFUmYe%2BM%2B431OOP7zgirLuAsMSIa9OF1GSSlqLk6Wg%2BaRqRlWV4ZtmcVzkJ8SpjBVrf7mmeFzPf7FnF5ZiYnB51KX04WW3CNtUOVsejHrIE6a7j1X8p%2FXi7YiRiXzinljY%3D" target="_blank">Open in WebR</a>



<!-- /position -->
<!-- /layout -->

