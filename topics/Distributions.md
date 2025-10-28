---
title: "Distributions in Environmental Data"
author: "Gerrit Renner"
keywords: ["distribution", "histogram", "pdf", "cdf", "kolmogorov-smirnov"]
requirements: ["Mean Values", "Quantiles"]
description: "How to characterize, model, and test water quality distributions."
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Variance
- Quantiles

---

<!-- .slide:id="histogram_concept" -->
## From Raw Measurements to a Distribution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Histograms approximate the underlying distribution from empirical samples.
-> Divide the measurement range into bins.
-> Count how many observations fall into each bin.
-> Normalize by sample size to compare densities across sites.
-< Compare shapes by overlaying histograms from multiple datasets (log-normal vs. normal).
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="distribution-histogram-container" style="width: 100%; min-height: 360px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/distribution-histogram.js"></script>
<script>
(function() {
  const containerId = 'distribution-histogram-container';
  const targetSlideId = 'histogram_concept';
  const renderHistogram = () => {
    if (typeof d3 === 'undefined' || !window.initDistributionHistogram) {
      setTimeout(renderHistogram, 120);
      return;
    }
    window.initDistributionHistogram(containerId);
  };
  const maybeRenderForSlide = (slide) => {
    if (!slide) return;
    const id = slide.getAttribute('id');
    if (id === targetSlideId) {
      renderHistogram();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => maybeRenderForSlide(document.getElementById(targetSlideId)));
  } else {
    maybeRenderForSlide(document.getElementById(targetSlideId));
  }
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('ready', (event) => {
      maybeRenderForSlide(event && event.currentSlide);
    });
    window.Reveal.on('slidechanged', (event) => {
      maybeRenderForSlide(event && event.currentSlide);
    });
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="bin_rules_practice" -->
## Choosing Histogram Bin Rules
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Freedman-Diaconis: bin width <br> $= \frac{2\cdot IQR}{n^{1/3}}$ balances resolution and noise.
-! Scott&rsquo;s rule: $\frac{3.5\cdot\sigma}{n^{1/3}}$ works well if the data are roughly normal.
-: Square-root rule ($\sqrt{n}$ bins) is quick for dashboards but can miss structure.

***

-< Always sanity-check the histogram: adjust bins if important features disappear or look noisy.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="bin-rules-visual" style="width: 100%; min-height: 300px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; background: rgba(17, 25, 46, 0.0);"></div>
<button id="bin-rules-expand" style="margin-top: 12px; padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">
  <i class="fas fa-expand"></i> View Fullscreen
</button>
<script src="resources/figures/bin-rules.js"></script>
<script src="resources/figures/bin-rules-modal.js"></script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="histogram_r" -->
## Histograms in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
```r
set.seed(1)
x <- rlnorm(1000)

x |>
  (\(z) hist(z,
             breaks = "FD",   # sensible automatic binning
             col = "blue",
             border = "white",
             main = "Histogram of x",
             xlab = "x"))()
```
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; align-items: center; justify-content: center; height: 100%;">
  <a href="https://webr.sh/#code=eJxljj0KwkAQhfucYojNLqhJerUSsRbsBJk1o1ncH9mdYBA7T%2BAd7LyBtbfxEiadP6%2Bb9733mOvl5tDSfelYs6GyGC5uB%2BTqkVXeUnYkta4jheyTl8j4fEXiYSQqRSGTBkYDCMb5YEWR57lMWus8SQDESpwkVDqyOPXb%2B0MqEO4jjCGdTdN%2Ba%2FQgkotaGQKs2VtkvQGlndNu913deNP1lKkp%2FV31oaTQ0WOl%2BQ9b1K6D8%2FYjvwtowW%2Bh%2BU01BlWXalIphUzeG4JSeg%3D%3D"
     style="padding: 12px 18px; background: #1a2340; border: 1px solid #2d3a66; border-radius: 6px; color: #9efcff; font-weight: 600; text-decoration: none;"
     target="_blank" rel="noopener">
    Try it in webR ↗
  </a>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pdf_cdf_concept" -->
## Probability Density Function (PDF) and Cumulative Distribution Function (CDF)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! *PDF:* `f(x)` measures the relative likelihood per unit of the variable.
-! *CDF:* `F(x)` accumulates probability from $-\infty$ up to $x$.
-: Relationship: $F(x) = \int_{-\infty}^{x} f(t)\mathrm{d}t$.
-: Interval probability: <br>$P(a < X < b) = \int_a^b f(x)\mathrm{d}x = F(b) - F(a)$.

***

-< CDFs are monotonic and easier to compare between datasets.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
For a normal distribution with mean $\mu$ and standard deviation $\sigma$:
$$
f_{\text{norm}}(x) = \frac{1}{\sigma\sqrt{2\pi}}
\exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)
$$

$$
F_{\text{norm}}(x) = \frac{1}{2}\left[1 + \operatorname{erf}\left(\frac{x - \mu}{\sigma\sqrt{2}}\right)\right]
$$
-: $erf$ = error function (common in statistics).
-: Other distributions (log-normal, gamma) have distinct PDF/CDF forms.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ecdf_concept" -->
## Empirical CDF (ECDF)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Sort the sample and compute cumulative proportions at each observed value.
-! ECDF is the step function:
$$ F(x)\_{\text{ECDF}} = \frac{1}{n} \sum_{i=1}^{n} \mathbf{1}\{x_i \le x\}$$
-: $\mathbf{1}(\cdot)$ = indicator function (1 if true, 0 if false).
-: Always starts at 0, ends at 1, and never decreases.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

*Example* (sorted sample: `[2, 3, 5, 8]`)
```text
x < 2 : 0/4 = 0.00
x <= 2 : 1/4 = 0.25
x <= 3 : 2/4 = 0.50
x <= 5 : 3/4 = 0.75
x <= 8 : 4/4 = 1.00
```

<div id="ecdf-sample-visual" style="width: 100%; min-height: 320px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/ecdf-sample.js"></script>
<script>
(function() {
  const containerId = 'ecdf-sample-visual';
  const slideId = 'ecdf_concept';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initEcdfSample) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initEcdfSample(containerId);
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

<!-- .slide:id="ecdf_comparison" -->
## ECDF Example: Log-normal Data
<div id="ecdf-visual" style="width: 100%; min-height: 320px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/ecdf-lognormal.js"></script>
<script>
(function() {
  const containerId = 'ecdf-visual';
  const slideId = 'ecdf_comparison';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initEcdfComparison) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initEcdfComparison(containerId);
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

---

<!-- .slide:id="theoretical_models" -->
## Theoretical Models for Environmental Data
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Environmental data often deviate from normality due to natural processes.

***

-! Many statistical methods assume a specific distribution (e.g., normality).
-: Choosing an appropriate model improves inference and prediction accuracy.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Common choices:**
-! Normal distribution
-: symmetric, often assumed, but sensitive to outliers and negative values.
$$
X \sim N(\mu, \sigma^2)
$$
-: $\mu$ = mean, $\sigma$ = standard deviation.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="normal_model" -->
## Normal Distribution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Symmetric, bell-shaped curve.
-! Characterized by mean $\mu$ and standard deviation $\sigma$.
-: Suitable for data with natural fluctuations around a central value.

***

-! Not ideal for skewed or bounded data (e.g., concentrations of trace pollutants).

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! PDF:
$$f_{\text{norm}}(x) = \frac{1}{\sigma\sqrt{2\pi}}
\exp\left(-\frac{(x - \mu)^2}{2\sigma^2}\right)$$

***

-! CDF:
$$F_{\text{norm}}(x) = \frac{1}{2}\left[1 + \operatorname{erf}\left(\frac{x - \mu}{\sigma\sqrt{2}}\right)\right]$$
-: $erf$ = error function.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="normal_model_plots" -->
## Normal Distribution Plots
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Probability Density Function (PDF)
<div id="normal-pdf-container" style="min-height: 260px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Cumulative Distribution Function (CDF)
<div id="normal-cdf-container" style="min-height: 260px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/normal-distribution.js"></script>
<script>
(function() {
  const slideId = 'normal_model_plots';
  const initPlots = () => {
    if (typeof d3 === 'undefined' || !window.initNormalDistributionPlots) {
      setTimeout(initPlots, 120);
      return;
    }
    window.initNormalDistributionPlots('normal-pdf-container', 'normal-cdf-container', 0, 1);
  };
  const maybeInit = (slide) => {
    if (!slide) return;
    if (slide.getAttribute('id') === slideId) {
      initPlots();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => maybeInit(document.getElementById(slideId)));
  } else {
    maybeInit(document.getElementById(slideId));
  }
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('ready', event => maybeInit(event && event.currentSlide));
    window.Reveal.on('slidechanged', event => maybeInit(event && event.currentSlide));
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---



<!-- .slide:id="lognormal_model" -->
## Log-normal Distribution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Positive-only support; arises when multiplicative effects dominate.

***

-! Parameters $\mu_{\log}$ and $\sigma_{\log}$ describe the log-values.
-: Captures right-skewed concentration data with episodic spikes.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
For $X \sim \text{LogNormal}(\mu_{\log}, \sigma_{\log})$:
-! PDF:
$$
 f_{\text{lnorm}}(x) =
  \frac{1}{x\,\sigma_{\log}\sqrt{2\pi}}
  \exp\left(-\frac{(\ln x - \mu_{\log})^2}{2\sigma_{\log}^2}\right), \quad x > 0
$$

***

-! CDF:
$$
 F_{\text{lnorm}}(x) =
  \frac{1}{2}\left[1 + \operatorname{erf}\left(\frac{\ln x - \mu_{\log}}{\sigma_{\log}\sqrt{2}}\right)\right], \quad x > 0
$$
-: $Median = \exp(\mu_{\log})$; $mean = \exp(\mu_{\log} + 0.5\sigma_{\log}^2)$.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="lognormal_model_plots" -->
## Log-normal Distribution Plots
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Probability Density Function (PDF)
<div id="lognormal-pdf-container" style="min-height: 260px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Cumulative Distribution Function (CDF)
<div id="lognormal-cdf-container" style="min-height: 260px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/lognormal-distribution.js"></script>
<script>
(function() {
  const slideId = 'lognormal_model_plots';
  const initPlots = () => {
    if (typeof d3 === 'undefined' || !window.initLogNormalDistributionPlots) {
      setTimeout(initPlots, 120);
      return;
    }
    window.initLogNormalDistributionPlots('lognormal-pdf-container', 'lognormal-cdf-container', Math.log(2), 0.5);
  };
  const maybeInit = (slide) => {
    if (!slide) return;
    if (slide.getAttribute('id') === slideId) {
      initPlots();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => maybeInit(document.getElementById(slideId)));
  } else {
    maybeInit(document.getElementById(slideId));
  }
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('ready', event => maybeInit(event && event.currentSlide));
    window.Reveal.on('slidechanged', event => maybeInit(event && event.currentSlide));
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---


<!-- .slide:id="fit_to_distribution" -->
## Fitting a Distribution to Data
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Estimate parameters from data: $\mu = \text{mean}(\ln x)$, $\sigma = \text{sd}(\ln x)$ for a log-normal.

***

-! Compare empirical curves with the fitted theoretical distribution.
-: Visual diagnostics (histogram + CDF) help confirm whether the model is plausible.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="fit-distribution-plot" style="width: 100%; min-height: 320px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; background: rgba(17, 25, 46, 0.0);"></div>
<button id="fit-distribution-expand" style="margin-top: 12px; padding: 8px 16px; background: #0f172a; color: #9efcff; border: 0px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">
  <i class="fas fa-expand"></i> View Fullscreen
</button>
<script src="resources/figures/fit-distribution.js"></script>
<script src="resources/figures/fit-distribution-modal.js"></script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ks_intro" -->
## Kolmogorov-Smirnov Test Overview
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Compares an empirical CDF with a reference CDF.

***

-! Test statistic \(D\) is the maximum vertical distance between the curves.
-: Large \(D\) highlights where the model under- or overestimates probability.

***

-< Works for any continuous reference distribution (no binning required).
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ks-illustration" style="min-height: 260px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/ks-illustration.js"></script>
<script>
(function() {
  const slideId = 'ks_intro';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initKsIllustration) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initKsIllustration('ks-illustration');
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

<!-- .slide:id="ks_distribution_shapes" -->
## Distribution of the KS Statistic
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! $D_n$ follows a distribution that tightens with larger sample size $n$.
-: Critical values come from the CDF ($D_n \leq d$).

***

-< Higher $n$ makes large deviations increasingly unlikely.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ks-distribution-chart" style="min-height: 260px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/ks-distribution.js"></script>
<script>
(function() {
  const slideId = 'ks_distribution_shapes';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initKsDistribution) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initKsDistribution('ks-distribution-chart');
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

<!-- .slide:id="ks_lookup_tables" -->
## K-S Critical Values Tables
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Before calculators, analysts used lookup tables for $D\_{\alpha}$.
-: Tables list the maximum allowable $D$ for each sample size ($n$) and significance level.
-> Compare the observed $D$ with the tabulated $D\_{\alpha}$ for your $n$.
-> If $D < D\_{\alpha}$ keep $H\_0$; if $D \ge D\_{\alpha}$ reject $H\_0$.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<table style="font-size: 0.6em; width: 100%; border-collapse: collapse;">
  <thead>
    <tr style="background: #1a2340; color: #9efcff;">
      <th style="padding: 6px; text-align: left;">Sample size (n)</th>
      <th style="padding: 6px; text-align: left;">&alpha; = 0.10</th>
      <th style="padding: 6px; text-align: left;">&alpha; = 0.05</th>
      <th style="padding: 6px; text-align: left;">&alpha; = 0.01</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px;">10</td>
      <td style="padding: 6px;">0.387</td>
      <td style="padding: 6px;">0.430</td>
      <td style="padding: 6px;">0.516</td>
    </tr>
    <tr style="background: rgba(154, 207, 255, 0.08);">
      <td style="padding: 6px;">25</td>
      <td style="padding: 6px;">0.244</td>
      <td style="padding: 6px;">0.272</td>
      <td style="padding: 6px;">0.326</td>
    </tr>
    <tr>
      <td style="padding: 6px;">50</td>
      <td style="padding: 6px;">0.173</td>
      <td style="padding: 6px;">0.192</td>
      <td style="padding: 6px;">0.231</td>
    </tr>
    <tr style="background: rgba(154, 207, 255, 0.08);">
      <td style="padding: 6px;">100</td>
      <td style="padding: 6px;">0.122</td>
      <td style="padding: 6px;">0.136</td>
      <td style="padding: 6px;">0.163</td>
    </tr>
  </tbody>
</table>
<div style="margin-top: 10px; font-size: 0.55em; color: #5b6a8a;">
  Compare your observed $D$ with the row matching $n$ (or nearest) and column for chosen $\alpha$.
</div>

-! Exact tables cover small $n$ where discrete CDF steps matter.
-: For large $n$, use the asymptotic rule $D\_{\alpha} \approx K\_{\alpha}/\sqrt{n}$.
-: Example constants: $K\_{0.10}=1.22$, $K\_{0.05}=1.36$, $K\_{0.01}=1.63$.
-: Reading the table mirrors looking up quantiles of the test statistic.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ks_test_one_sample" -->
## Kolmogorov-Smirnov Test (1-Sample)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Null hypothesis: sample follows reference CDF $F_0(x)$.

***

-! Statistic: 
$$D = sup_x \lvert F_{emp}(x) - F_0(x) \rvert$$
-: $sup$ = supremum (maximum over all $x$)
-: Small $D$ => accept model; large $D$ => reject

***

-< Sensitive to both shifts and shape differences
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="margin-bottom: 12px; font-weight: 600; color: #5b6a8a;">Log-normal reference</div>
<div id="ks-one-sample-lognormal" style="margin-bottom: 16px;"></div>
<div style="margin-bottom: 12px; font-weight: 600; color: #5b6a8a;">Normal reference</div>
<div id="ks-one-sample-normal"></div>
<script>
(function() {
  const lognormalContainer = 'ks-one-sample-lognormal';
  const normalContainer = 'ks-one-sample-normal';
  const lognormalCode = `
set.seed(2025)
NO3 <- rlnorm(200, meanlog = log(2), sdlog = 0.5)
fit_meanlog <- mean(log(NO3))
fit_sdlog <- sd(log(NO3))
ks.test(NO3, "plnorm", meanlog = fit_meanlog, sdlog = fit_sdlog)
`;
  const normalCode = `
set.seed(2025)
NO3_norm <- rnorm(200, mean = 0, sd = 1)
ks.test(NO3_norm, "pnorm", mean = 0, sd = 1)
`;
  const lognormalFallback = () => {
    return [
      '[Simulated in JavaScript]',
      'Kolmogorov-Smirnov test compares empirical and log-normal CDFs.',
      'If p-value is high, the log-normal model is plausible.',
      'Large D or small p-value indicates poor fit.'
    ].join('\n');
  };
  const normalFallback = () => {
    return [
      '[Simulated in JavaScript]',
      'Kolmogorov-Smirnov test compares empirical data to the normal CDF.',
      'If p-value is high, the normal model is plausible.',
      'Large D or small p-value indicates departure from normality.'
    ].join('\n');
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.quickSetup(lognormalContainer, lognormalCode, 'ks_test_one_sample', lognormalFallback);
    await helper.quickSetup(normalContainer, normalCode, 'ks_test_one_sample_normal', normalFallback);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="hypothesis_intro" -->
## Statistical Hypothesis Tests
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Start with a *null hypothesis* $H_0$: baseline claim (e.g., no difference between rivers).
-! Define the *alternative hypothesis* $H_1$: what we would conclude if data strongly contradict $H_0$.
-: Choose a test statistic whose distribution under $H_0$ is known or can be approximated.
-< Decision rule: reject $H_0$ when the statistic falls in the critical region (equivalently, when p-value < $\alpha$).
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px; border: 0px solid #2d3a66; border-radius: 10px; padding: 18px; background: rgba(17, 25, 46, 0.28);">
  <div style="display: flex; flex-direction: column; gap: 6px;">
    <div style="font-size: 0.9em; color: #9efcff; letter-spacing: 0.04em;">Null hypothesis $H_0$</div>
    <div style="font-weight: 700; color: #e0e6ff;">Model fits / rivers share same distribution.</div>
    <div style="font-size: 0.75em; color: #98a2c3;">Assumed true for computing sampling distribution.</div>
  </div>
  <hr style="border: none; border-top: 1px dashed #2d3a66; margin: 4px 0;">
  <div style="display: flex; flex-direction: column; gap: 6px;">
    <div style="font-size: 0.9em; color: #ffb703; letter-spacing: 0.04em;">Alternative hypothesis $H_1$</div>
    <div style="font-weight: 700; color: #ffd166;">Distributions differ (location/shape/tails).</div>
    <div style="font-size: 0.75em; color: #f1dca7;">Evidence accumulates when the test statistic is extreme.</div>
  </div>
  <div style="margin-top: 8px; font-size: 0.75em; color: #9aa6d3;">
    Threshold $\alpha = 0.05$ → reject $H_0$ if p-value < 0.05.
  </div>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pvalue_concept" -->
## Interpreting the p-value
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! p-value = probability of observing a test statistic at least as extreme as the sample, assuming the null hypothesis is true.
-! Small p-values imply the observed difference is unlikely under the null → evidence against $H_0$.
-: Two-sided tests double the tail area (extreme in either direction).
-< p-values are not definitive; "significant" does not equal "important".
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pvalue-visual" style="min-height: 280px; border: 0px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="resources/figures/pvalue-visual.js"></script>
<script>
(function() {
  const slideId = 'pvalue_concept';
  const renderPlot = () => {
    if (typeof d3 === 'undefined' || !window.initPValueVisual) {
      setTimeout(renderPlot, 120);
      return;
    }
    window.initPValueVisual('pvalue-visual');
  };
  const maybeRender = (slide) => {
    if (!slide) return;
    if (slide.getAttribute('id') === slideId) {
      renderPlot();
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => maybeRender(document.getElementById(slideId)), { once: true });
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

<!-- .slide:id="ks_test_two_sample" -->
## Comparing Two Empirical Distributions
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Two-sample KS test: does River A share the same distribution as River B?
-! $D = \sup_{x} \lvert F_{\text{A}}(x) - F_{\text{B}}(x)\rvert$ using both empirical CDFs.
-: Sensitive to shifts in median, spread, or tail behaviour simultaneously.

***

-< Ideal for water quality comparisons when no parametric model is trusted.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ks-two-sample" style="margin-top: 16px;"></div>
<script>
(function() {
  const containerId = 'ks-two-sample';
  const code = `
set.seed(2401)
NO3_riverA <- rlnorm(180, meanlog = log(2.1), sdlog = 0.42)
NO3_riverB <- rlnorm(180, meanlog = log(1.4), sdlog = 0.58)
ks.test(NO3_riverA, NO3_riverB)
`;
  const fallback = () => {
    return [
      '[Simulated in JavaScript]',
      'Two-sample KS test compares the empirical CDFs of both rivers.',
      'If the maximum vertical distance D is large, the rivers behave differently.',
      'A small p-value flags meaningful distributional differences.'
    ].join('\\n');
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.quickSetup(containerId, code, 'ks_test_two_sample', fallback);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->







