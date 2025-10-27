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
<script src="../resources/figures/distribution-histogram.js"></script>
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
<script src="../resources/figures/ecdf-sample.js"></script>
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
<script src="../resources/figures/ecdf-lognormal.js"></script>
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
<script src="../resources/figures/normal-distribution.js"></script>
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
-! Parameters $\mu_{\log}$ and $\sigma_{\log}$ describe the log-values.
-: Captures right-skewed concentration data with episodic spikes.
<!-- /position -->
<!-- .slide:id="lognormal_model" -->
## Log-normal Distribution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Positive-only support; arises when multiplicative effects dominate.
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
<script src="../resources/figures/lognormal-distribution.js"></script>
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
-! Compare empirical curves with the fitted theoretical distribution.
-: Visual diagnostics (histogram + CDF) help confirm whether the model is plausible.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="fit-distribution-plot" style="width: 100%; min-height: 320px; border: 1px solid #2d3a66; border-radius: 8px; padding: 8px; background: rgba(17, 25, 46, 0.32);"></div>
<button id="fit-distribution-expand" style="margin-top: 12px; padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em; font-weight: 600;">
  <i class="fas fa-expand"></i> View Fullscreen
</button>
<script src="../resources/figures/fit-distribution.js"></script>
<script>
(function() {
  const containerId = 'fit-distribution-plot';
  const slideId = 'fit_to_distribution';
  const expandButtonId = 'fit-distribution-expand';
  const overlayId = 'fit-distribution-overlay';
  const overlayPlotId = 'fit-distribution-overlay-plot';
  let previousBodyOverflow = null;

  const renderVisualization = () => {
    if (typeof d3 === 'undefined' || !window.initFitDistributionDemo) {
      setTimeout(renderVisualization, 120);
      return;
    }
    window.initFitDistributionDemo(containerId);
  };
  const maybeRender = (slide) => {
    if (!slide) return;
    const id = slide.getAttribute('id');
    if (id === slideId) {
      renderVisualization();
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

  const teardownOverlay = () => {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.remove();
    }
    if (previousBodyOverflow !== null) {
      document.body.style.overflow = previousBodyOverflow;
      previousBodyOverflow = null;
    } else {
      document.body.style.overflow = '';
    }
    document.removeEventListener('keydown', handleKeydown, true);
  };

  const ensureRenderOverlay = () => {
    if (typeof d3 === 'undefined' || !window.initFitDistributionDemo) {
      setTimeout(ensureRenderOverlay, 120);
      return;
    }
    requestAnimationFrame(() => window.initFitDistributionDemo(overlayPlotId));
  };

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      teardownOverlay();
    }
  };

  const createOverlay = () => {
    if (document.getElementById(overlayId)) {
      ensureRenderOverlay();
      return;
    }
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.cssText = [
      'position: fixed',
      'inset: 0',
      'z-index: 1200',
      'background: rgba(9, 12, 24, 0.88)',
      'display: flex',
      'align-items: center',
      'justify-content: center',
      'padding: 32px 24px'
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background: #0b152c',
      'border: 1px solid #26406d',
      'border-radius: 12px',
      'box-shadow: 0 18px 46px rgba(8, 10, 24, 0.65)',
      'width: min(1100px, 92vw)',
      'height: min(90vh, 760px)',
      'padding: 24px 24px 20px',
      'display: flex',
      'flex-direction: column',
      'gap: 16px'
    ].join(';');

    const actionBar = document.createElement('div');
    actionBar.style.cssText = [
      'display: flex',
      'justify-content: flex-end'
    ].join(';');

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', 'Close diagram');
    closeButton.style.cssText = [
      'background: transparent',
      'color: #9efcff',
      'border: 1px solid #2d3a66',
      'border-radius: 999px',
      'padding: 6px 14px',
      'cursor: pointer',
      'font-size: 0.9em',
      'font-weight: 600'
    ].join(';');
    closeButton.innerHTML = '<i class="fas fa-times"></i> Close';
    closeButton.addEventListener('click', teardownOverlay);

    const overlayPlot = document.createElement('div');
    overlayPlot.id = overlayPlotId;
    overlayPlot.style.cssText = [
      'flex: 1 1 auto',
      'width: 100%',
      'min-height: 60vh',
      'border: 1px solid #2d3a66',
      'border-radius: 8px',
      'padding: 12px',
      'background: rgba(17, 25, 46, 0.45)',
      'overflow: hidden'
    ].join(';');

    actionBar.appendChild(closeButton);
    panel.appendChild(actionBar);
    panel.appendChild(overlayPlot);
    overlay.appendChild(panel);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        teardownOverlay();
      }
    });

    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.appendChild(overlay);
    document.addEventListener('keydown', handleKeydown, true);
    ensureRenderOverlay();
  };

  const expandButton = document.getElementById(expandButtonId);
  if (expandButton) {
    expandButton.addEventListener('click', createOverlay);
  }
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', teardownOverlay);
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ks_intro" -->
## Kolmogorov-Smirnov Test Overview
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Compares an empirical CDF with a reference CDF.
-! Test statistic \(D\) is the maximum vertical distance between the curves.
-: Large \(D\) highlights where the model under- or overestimates probability.
-< Works for any continuous reference distribution (no binning required).
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ks-illustration" style="min-height: 260px; border: 1px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="../resources/figures/ks-illustration.js"></script>
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
-< Higher $n$ makes large deviations increasingly unlikely.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="ks-distribution-chart" style="min-height: 260px; border: 1px solid #2d3a66; border-radius: 8px; padding: 8px; display: flex; align-items: center; justify-content: center;"></div>
<script src="../resources/figures/ks-distribution.js"></script>
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


<!-- .slide:id="ks_test_one_sample" -->
## Kolmogorov-Smirnov Test (1-Sample)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Null hypothesis: sample follows reference CDF $F_0(x)$.
-! Statistic: $D = \\sup_x \\lvert F_{emp}(x) - F_0(x) \\rvert$.
-: Small $D$ => accept model; large $D$ => reject.
-< Sensitive to both shifts and shape differences.
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

<!-- .slide:id="ks_test_two_sample" -->
## Comparing Two Empirical Distributions
-! Two-sample KS test: does River A share the same distribution as River B?
-! \(D = \sup_{x} \lvert F_{\text{A}}(x) - F_{\text{B}}(x)\rvert\) using both empirical CDFs.
-: Sensitive to shifts in median, spread, or tail behaviour simultaneously.
-< Ideal for water quality comparisons when no parametric model is trusted.

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

---

<!-- .slide:id="distribution_summary" -->
## Summary: Understanding and Testing Distributions
| Concept | Purpose | Typical Tool in R | Water Science Example |
|---------|---------|-------------------|-----------------------|
| Histogram | Visualize empirical distribution | `hist()` | Nitrate variability after rainfall |
| PDF/CDF | Theoretical description | `dnorm()`, `pnorm()` | Model pollutant exceedance probabilities |
| Empirical PDF/CDF | Non-parametric estimate | `density()`, `ecdf()` | Sensor data with unknown shape |
| Normal vs. Log-normal | Shape models | `rnorm()`, `rlnorm()` | Decide on transformations |
| KS test (1-sample) | Goodness-of-fit | `ks.test()` | Check log-normal assumption |
| KS test (2-sample) | Compare datasets | `ks.test(x, y)` | Urban vs. rural nitrate profiles |

---

<!-- .slide:id="distribution_wrapup" -->
## Key Takeaways
-! Distributions summarise how water quality data spread and accumulate probability.
-! PDFs and CDFs underpin hypothesis testing and risk estimates.
-! Environmental concentrations often follow log-normal patterns-inspect before assuming normality.
-! KS tests offer a distribution-free way to validate models or compare sites.
-? Next session: quantify shape numerically using skewness and kurtosis.






