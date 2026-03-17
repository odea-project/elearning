---
title: "Advancing Non-Target Screening Data Processing"
author: "Gerrit Renner"
keywords: ["NTS", "qAlgorithms", "uncertainty"]
requirements: ["regression", "distance metrics"]
description: "This topic focuses on the development and application of advanced algorithms for processing non-target screening (NTS) data. It covers techniques for improving the accuracy and efficiency of data analysis, including regression methods and distance metrics to handle uncertainty in NTS data."
category: "research-talks"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Regression
- Distance metrics
- Uncertainty quantification

---

<!-- .slide:id="nts-intro-slide" -->
## What is Non-Target Screening (NTS)?
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
<img src="resources/figures/NTS_intro.svg" alt="NTS Introduction" style="max-width: 100%; margin: 20px auto; display: block;">
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ta-vs-nts-slide" -->
## Target Analysis vs. Non-Target Screening
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Target** Analysis:
-! Predefined hypotheses
-! Clear testing framework, e.g., positive/negative controls
-: Clear results

***

-< Sharp but narrow perspective

***

Role of data processing: *of medium/high importance*
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Non-Target** Screening:
-! No predefined hypotheses
-! No comprehensive standards available
-: Unknown uncertainty and ambiguous results 

***

-< Blurred but broad perspective

***

Role of data processing: *of very high importance*
<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="nts-key-aspects-slide" -->
<img src="resources/figures/workflowwithoutTable.webp" alt="NTS Workflow" style="max-width: 200%; margin: 20px auto; display: block;">

<div class="vertical-space" style="height: 75px;"></div>

<div class="odea-footnote" style="max-width: 60%; margin: 0; display: block;">
<p>Renner, Gerrit, and Max Reuschenbach. "Critical review on data processing algorithms in non-target screening: challenges and opportunities to improve result comparability." <em>Analytical and Bioanalytical Chemistry</em> 415.18 (2023): 4111-4123.</p>
</div>

---

<!-- .slide:id="nts-challenges-slide" -->
## Key Challenges in NTS Data Processing
<img src="resources/figures/nts_different_workflows.svg" alt="NTS Challenges" style="max-width: 60%; margin: 20px auto; display: block;">

<div class="vertical-space" style="height: 100px;"></div>

<div class="odea-footnote" style="max-width: 60%; margin: 0 auto; display: block;">
<p>Renner, Gerrit, and Max Reuschenbach. "Critical review on data processing algorithms in non-target screening: challenges and opportunities to improve result comparability." <em>Analytical and Bioanalytical Chemistry</em> 415.18 (2023): 4111-4123.</p>
<p>Hohrenk, Lotta L., et al. "Comparison of software tools for liquid chromatography–high-resolution mass spectrometry data processing in nontarget screening of environmental samples." <em>Analytical Chemistry</em> 92.2 (2019): 1898-1907.</p>
</div>


---

<!-- .slide:id="scope-and-motivation-slide" -->
## Scope and Motivation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! NTS Results are often not comparable across studies

***

-! Hard to assess where differences come from 
-: Data processing, Instrumental setup, or Sample

***

-! Data processing is a key factor, but often not well described
-: Reproducibility and uncertainty are not assessed
<!-- /position -->
<!-- position={row: 1, column: 2} -->
**What's needed?**
-> Better understanding of how data processing affects results
-> FAIR data processing workflows
-> Uncertainty quantification in NTS data processing
<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="nts-in-a-nutshell-slide" -->
## NTS Data Processing in a Nutshell

<img src="resources/figures/nts_nutshell.webp" alt="NTS in a Nutshell" style="max-width: 100%; margin: 20px auto; display: block;">

---

<!-- .slide:id="why-curve-fitting-slide" -->
## Why Curve Fitting?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Curve fitting is a model-based approach

***

-! We can measure how well the model fits the data
-: Feedback on data quality and model assumptions
-: Uncertainty quantification is possible

***

-! With linear regression, we
-: obtain analytical solutions for parameters and their uncertainties
-: can calculate in a very efficient way
-: can apply significance tests and other well established statistical methods

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="nts-curve-fitting-plot" style="width: 800px; height: 800px; margin: 0 auto;"></div>
<script src="resources/figures/nts-curve-fit-peak.js"></script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="log-transform-bridge-slide" -->
## Wait A Sec...
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<div id="nts-log-transform-bridge-plot" style="width: 800px; height: 600px; margin: 0 auto;"></div>
<script src="resources/figures/nts-log-transform-bridge.js"></script>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="max-width: 760px; min-height: 640px; margin: 0 auto; padding: 22px 28px; border-radius: 16px; border: 2px solid rgba(0, 255, 255, 0.18); background: linear-gradient(180deg, rgba(4, 17, 26, 0.40), rgba(4, 17, 26, 0.16)); box-shadow: 0 0 26px rgba(0, 255, 255, 0.06); position: relative; overflow: hidden;">
	<div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
		<span style="font-size: 0.52em; color: #ffd166; letter-spacing: 0.08em; text-transform: uppercase;">Magic button</span>
		<span id="nts-log-transform-label-gaussian" style="font-size: 0.48em; color: #00ffd5; transition: opacity 0.35s ease, color 0.35s ease;">Off</span>
		<label for="nts-log-transform-toggle" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
			<input id="nts-log-transform-toggle" type="checkbox" style="opacity: 0; width: 0; height: 0;">
			<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(0, 255, 255, 0.28); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
			<span id="nts-log-transform-toggle-knob" style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #00ffd5; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
		</label>
		<span id="nts-log-transform-label-log" style="font-size: 0.48em; color: #8aa3ad; opacity: 0.45; transition: opacity 0.35s ease, color 0.35s ease;">On</span>
	</div>
	<div style="position: relative; min-height: 520px;">
		<div id="nts-log-transform-panel-gaussian" style="position: absolute; inset: 0; transition: opacity 0.45s ease, transform 0.45s ease;">
			<p style="font-size: 0.68em; line-height: 1.45; margin: 0 0 20px 0; color: #efefef;">
				The Gaussian peak model is
			</p>
			<div style="font-size: 0.78em; margin: 20px 0 28px 0; color: #efefef;">
$$
g(x) = A \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$
			</div>
			<p style="font-size: 0.64em; line-height: 1.55; margin: 0 0 18px 0; color: #00ffd5; font-weight: 700;">
				This is still a non-linear regression problem.
			</p>
            <ul>
            <li>It requires initial parameter guesses</li>
            <li>It can be computationally expensive</li>
            <li>Uncertainty quantification is not straightforward</li>
            </ul>
		</div>
		<div id="nts-log-transform-panel-log" style="position: absolute; inset: 0; opacity: 0; transform: translateY(14px); pointer-events: none; transition: opacity 0.45s ease, transform 0.45s ease;">
			<p style="font-size: 0.66em; line-height: 1.45; margin: 0 0 14px 0; color: #efefef;">
				Apply the logarithm and expand the exponent:
			</p>
			<div style="font-size: 0.62em; margin: 16px 0 18px 0; color: #efefef;">
$$
\log g(x) =
\underbrace{\left(\log A - \frac{\mu^2}{2\sigma^2}\right)}_{\beta_0}
+
\underbrace{\left(\frac{\mu}{\sigma^2}\right)}_{\beta_1}x
+
\underbrace{\left(-\frac{1}{2\sigma^2}\right)}_{\beta_2}x^2
$$
			</div>
            <p style="font-size: 0.64em; line-height: 1.55; margin: 0 0 18px 0; color: #00ffd5; font-weight: 700;">
                Now we have a linear regression problem!
            </p>
            <ul>
            <li>We can use ordinary least squares</li>
            <li>It's computationally efficient</li>
            <li>We can easily quantify uncertainty</li>
            </ul>
		</div>
	</div>
</div>
<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="qCentroids" -->
## qCentroids Reference

<div style="max-width: 1020px; margin: 40px auto; padding: 34px 38px; border-radius: 20px; border: 2px solid rgba(0, 255, 255, 0.18); background: linear-gradient(180deg, rgba(4, 17, 26, 0.42), rgba(4, 17, 26, 0.18)); box-shadow: 0 0 30px rgba(0, 255, 255, 0.08); text-align: left;">
	<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 28px; flex-wrap: wrap;">
		<div style="flex: 1 1 720px; min-width: 320px;">
			<div style="display: inline-block; padding: 8px 14px; margin-bottom: 18px; border-radius: 999px; background: rgba(255, 209, 102, 0.14); color: #ffd166; font-size: 0.42em; letter-spacing: 0.08em; text-transform: uppercase;">
				External article preview
			</div>
			<h3 style="margin: 0 0 18px 0; font-size: 0.74em; line-height: 1.35; color: #efefef; text-transform: none; font-family: 'Montserrat', Helvetica, sans-serif;">
				Development of a scoring parameter to characterize data quality of centroids in high-resolution mass spectra
			</h3>
			<p style="margin: 0 0 16px 0; font-size: 0.48em; line-height: 1.6; color: rgba(239, 239, 239, 0.84);">
				Max Reuschenbach, Lotta L. Hohrenk-Danzouma, Torsten C. Schmidt, Gerrit Renner
			</p>
			<p style="margin: 0 0 22px 0; font-size: 0.46em; line-height: 1.6; color: #00ffd5;">
				<strong>Analytical and Bioanalytical Chemistry</strong>, 414(22), 6635-6645, 2022
			</p>
			<p style="margin: 0 0 22px 0; font-size: 0.44em; line-height: 1.7; color: rgba(239, 239, 239, 0.82); max-width: 900px;">
				High-resolution profile spectra are often reduced to centroided data, which discards information about peak profile quality. This paper introduces the data quality score (DQS), based on a fast and robust regression analysis of individual high-resolution peak profiles with uncertainty propagation, to better characterize centroid reliability.
			</p>
			<div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-top: 24px;">
				<a href="https://link.springer.com/article/10.1007/s00216-022-04224-y" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 20px; border-radius: 12px; background: #00ffd5; color: #08222a; font-size: 0.44em; font-weight: 700; text-decoration: none;">
					Open article on Springer
				</a>
				<a href="https://doi.org/10.1007/s00216-022-04224-y" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 20px; border-radius: 12px; border: 2px solid rgba(255, 95, 210, 0.45); color: #ff8ae0; font-size: 0.44em; font-weight: 700; text-decoration: none; background: rgba(255, 95, 210, 0.08);">
					DOI: 10.1007/s00216-022-04224-y
				</a>
			</div>
		</div>
		<div style="flex: 0 1 1020px; min-width: 260px; padding: 20px 22px; border-radius: 16px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);">
			<p style="margin: 0 0 14px 0; font-size: 0.42em; color: #ffd166; text-transform: uppercase; letter-spacing: 0.08em;">Article figure preview</p>
			<img id="qcentroids-preview-image" src="https://media.springernature.com/full/springer-static/image/art%3A10.1007%2Fs00216-022-04224-y/MediaObjects/216_2022_4224_Fig1_HTML.png?as=webp" alt="Figure 1 from the qCentroids article showing centroid data quality scoring concept" style="display: block; width: 100%; height: auto; margin: 0 0 14px 0; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.02); cursor: zoom-in; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='scale(1.01)';this.style.boxShadow='0 0 18px rgba(0,255,213,0.14)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'">
			<p style="margin: 0 0 14px 0; font-size: 0.38em; line-height: 1.6; color: rgba(239, 239, 239, 0.72);">
				Click the image to open a large preview.
			</p>
			<p style="margin: 0; font-size: 0.38em; line-height: 1.65; color: rgba(239, 239, 239, 0.60);">
				A full iframe preview is still blocked by Springer response headers such as <strong>X-Frame-Options</strong>.
			</p>
		</div>
	</div>
</div>

<div id="qcentroids-image-overlay" style="position: fixed; inset: 0; background: rgba(5, 10, 20, 0.94); display: none; align-items: center; justify-content: center; z-index: 10000; padding: 28px; box-sizing: border-box;">
	<button id="qcentroids-image-overlay-close" type="button" style="position: absolute; top: 24px; right: 24px; width: 42px; height: 42px; border: none; border-radius: 999px; background: #e63946; color: #fff; font-size: 1.1em; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.35);">✕</button>
	<img src="https://media.springernature.com/full/springer-static/image/art%3A10.1007%2Fs00216-022-04224-y/MediaObjects/216_2022_4224_Fig1_HTML.png?as=webp" alt="Large preview of Figure 1 from the qCentroids article" style="display: block; max-width: min(96vw, 1800px); max-height: 90vh; width: auto; height: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 14px 40px rgba(0,0,0,0.45); background: #08161c;">
</div>

<script>
(function() {
	const previewId = 'qcentroids-preview-image';
	const overlayId = 'qcentroids-image-overlay';
	const closeId = 'qcentroids-image-overlay-close';
	const slideId = 'qCentroids';

	function init() {
		const slide = document.getElementById(slideId);
		const preview = document.getElementById(previewId);
		const overlay = document.getElementById(overlayId);
		const closeBtn = document.getElementById(closeId);
		if (!slide || !preview || !overlay || !closeBtn) return;
		if (slide.dataset.qcentroidsOverlayBound === '1') return;
		slide.dataset.qcentroidsOverlayBound = '1';

		function openOverlay() {
			overlay.style.display = 'flex';
		}

		function closeOverlay() {
			overlay.style.display = 'none';
		}

		preview.addEventListener('click', openOverlay);
		closeBtn.addEventListener('click', closeOverlay);
		overlay.addEventListener('click', function(event) {
			if (event.target === overlay) closeOverlay();
		});
		document.addEventListener('keydown', function(event) {
			if (event.key === 'Escape') closeOverlay();
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		init();
	}
})();
</script>

---

<!-- .slide:id="qPeaks" -->
## qPeaks Reference

<div style="max-width: 1420px; margin: 40px auto; padding: 34px 38px; border-radius: 20px; border: 2px solid rgba(0, 255, 255, 0.18); background: linear-gradient(180deg, rgba(4, 17, 26, 0.42), rgba(4, 17, 26, 0.18)); box-shadow: 0 0 30px rgba(0, 255, 255, 0.08); text-align: left;">
	<div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 28px; flex-wrap: wrap;">
		<div style="flex: 1 1 720px; min-width: 320px;">
			<div style="display: inline-block; padding: 8px 14px; margin-bottom: 18px; border-radius: 999px; background: rgba(255, 209, 102, 0.14); color: #ffd166; font-size: 0.42em; letter-spacing: 0.08em; text-transform: uppercase;">
				External article preview
			</div>
			<h3 style="margin: 0 0 18px 0; font-size: 0.74em; line-height: 1.35; color: #efefef; text-transform: none; font-family: 'Montserrat', Helvetica, sans-serif;">
				qPeaks: A Linear Regression-Based Asymmetric Peak Model for Parameter-Free Automatized Detection and Characterization of Chromatographic Peaks in Non-Target Screening Data
			</h3>
			<p style="margin: 0 0 16px 0; font-size: 0.48em; line-height: 1.6; color: rgba(239, 239, 239, 0.84);">
				Max Reuschenbach, Felix Drees, Michael S. Leupold, Lucie K. Tintrop, Torsten C. Schmidt, Gerrit Renner
			</p>
			<p style="margin: 0 0 22px 0; font-size: 0.46em; line-height: 1.6; color: #00ffd5;">
				<strong>Analytical Chemistry</strong>, 96(18), 7120-7129, 2024
			</p>
			<p style="margin: 0 0 22px 0; font-size: 0.44em; line-height: 1.7; color: rgba(239, 239, 239, 0.82); max-width: 900px;">
				This article introduces qPeaks, a linear regression-based asymmetric peak model for automated chromatographic peak detection and characterization in non-target screening. It is directly relevant here because it connects transformed peak models with efficient parameter estimation and uncertainty-aware peak analysis.
			</p>
			<div style="display: flex; gap: 14px; flex-wrap: wrap; align-items: center; margin-top: 24px;">
				<a href="https://pubs.acs.org/doi/10.1021/acs.analchem.4c00494" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 20px; border-radius: 12px; background: #00ffd5; color: #08222a; font-size: 0.44em; font-weight: 700; text-decoration: none;">
					Open article on ACS
				</a>
				<a href="https://doi.org/10.1021/acs.analchem.4c00494" target="_blank" rel="noopener" style="display: inline-block; padding: 14px 20px; border-radius: 12px; border: 2px solid rgba(255, 95, 210, 0.45); color: #ff8ae0; font-size: 0.44em; font-weight: 700; text-decoration: none; background: rgba(255, 95, 210, 0.08);">
					DOI: 10.1021/acs.analchem.4c00494
				</a>
			</div>
		</div>
		<div style="flex: 0 1 420px; min-width: 260px; padding: 20px 22px; border-radius: 16px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);">
			<p style="margin: 0 0 14px 0; font-size: 0.42em; color: #ffd166; text-transform: uppercase; letter-spacing: 0.08em;">Article figure preview</p>
			<img id="qpeaks-preview-image" src="https://pubs.acs.org/cms/10.1021/acs.analchem.4c00494/asset/images/large/ac4c00494_0001.jpeg" alt="Figure 1 from the qPeaks article" style="display: block; width: 100%; height: auto; margin: 0 0 14px 0; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.02); cursor: zoom-in; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='scale(1.01)';this.style.boxShadow='0 0 18px rgba(0,255,213,0.14)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='none'">
			<p style="margin: 0 0 14px 0; font-size: 0.38em; line-height: 1.6; color: rgba(239, 239, 239, 0.72);">
				Click the image to open a large preview.
			</p>
			<p style="margin: 0; font-size: 0.38em; line-height: 1.65; color: rgba(239, 239, 239, 0.60);">
				This slide uses a local preview card style with direct links instead of embedding the publisher page.
			</p>
		</div>
	</div>
</div>

<div id="qpeaks-image-overlay" style="position: fixed; inset: 0; background: rgba(5, 10, 20, 0.94); display: none; align-items: center; justify-content: center; z-index: 10000; padding: 28px; box-sizing: border-box;">
	<button id="qpeaks-image-overlay-close" type="button" style="position: absolute; top: 24px; right: 24px; width: 42px; height: 42px; border: none; border-radius: 999px; background: #e63946; color: #fff; font-size: 1.1em; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.35);">✕</button>
	<img src="https://pubs.acs.org/cms/10.1021/acs.analchem.4c00494/asset/images/large/ac4c00494_0001.jpeg" alt="Large preview of Figure 1 from the qPeaks article" style="display: block; max-width: min(96vw, 1800px); max-height: 90vh; width: auto; height: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.14); box-shadow: 0 14px 40px rgba(0,0,0,0.45); background: #08161c;">
</div>

<script>
(function() {
	const previewId = 'qpeaks-preview-image';
	const overlayId = 'qpeaks-image-overlay';
	const closeId = 'qpeaks-image-overlay-close';
	const slideId = 'qPeaks';

	function init() {
		const slide = document.getElementById(slideId);
		const preview = document.getElementById(previewId);
		const overlay = document.getElementById(overlayId);
		const closeBtn = document.getElementById(closeId);
		if (!slide || !preview || !overlay || !closeBtn) return;
		if (slide.dataset.qpeaksOverlayBound === '1') return;
		slide.dataset.qpeaksOverlayBound = '1';

		function openOverlay() {
			overlay.style.display = 'flex';
		}

		function closeOverlay() {
			overlay.style.display = 'none';
		}

		preview.addEventListener('click', openOverlay);
		closeBtn.addEventListener('click', closeOverlay);
		overlay.addEventListener('click', function(event) {
			if (event.target === overlay) closeOverlay();
		});
		document.addEventListener('keydown', function(event) {
			if (event.key === 'Escape') closeOverlay();
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init, { once: true });
	} else {
		init();
	}
})();
</script>

---

<!-- .slide:id="piecewise-parabola-slide" -->
## Piecewise Parabola Function
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<div id="piecewise-parabola-plot" style="width: 800px; height: 600px; margin: 0 auto 18px auto;"></div>
<div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 8px;">
	<span id="piecewise-parabola-label-linear" style="font-size: 0.46em; color: #00ffd5; transition: opacity 0.35s ease, color 0.35s ease;">Peak view</span>
	<label for="piecewise-parabola-scale-toggle" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
		<input id="piecewise-parabola-scale-toggle" type="checkbox" style="opacity: 0; width: 0; height: 0;">
		<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(0, 255, 255, 0.28); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
		<span id="piecewise-parabola-scale-toggle-knob" style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #00ffd5; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
	</label>
	<span id="piecewise-parabola-label-log" style="font-size: 0.46em; color: #8aa3ad; opacity: 0.45; transition: opacity 0.35s ease, color 0.35s ease;">Log y-axis</span>
</div>
<div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 12px;">
	<span id="piecewise-parabola-label-merged" style="font-size: 0.46em; color: #00ffd5; transition: opacity 0.35s ease, color 0.35s ease;">Merged peak</span>
	<label for="piecewise-parabola-mode-toggle" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
		<input id="piecewise-parabola-mode-toggle" type="checkbox" style="opacity: 0; width: 0; height: 0;">
		<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(0, 255, 255, 0.28); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
		<span id="piecewise-parabola-mode-toggle-knob" style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #00ffd5; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
	</label>
	<span id="piecewise-parabola-label-separate" style="font-size: 0.46em; color: #8aa3ad; opacity: 0.45; transition: opacity 0.35s ease, color 0.35s ease;">Separate parabolas</span>
</div>
<script src="resources/figures/nts-piecewise-parabola.js"></script>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="max-width: 760px; min-height: 640px; margin: 0 auto; padding: 24px 30px; border-radius: 16px; border: 2px solid rgba(0, 255, 255, 0.18); background: linear-gradient(180deg, rgba(4, 17, 26, 0.40), rgba(4, 17, 26, 0.16)); box-shadow: 0 0 26px rgba(0, 255, 255, 0.06); text-align: left;">
	<p style="font-size: 0.66em; line-height: 1.45; margin: 0 0 16px 0; color: #efefef;">
		We model the peak in the log-domain with two quadratic halves that meet at <span style="color: #ffd166;">x = 0</span>:
	</p>
	<div style="font-size: 0.64em; margin: 18px 0 24px 0; color: #efefef;">
$$
\beta_0 + \beta_1 x +
\begin{cases}
\beta_2 x^2, & x < 0 \\
\beta_3 x^2, & x \ge 0
\end{cases}
$$
	</div>
	<p style="font-size: 0.62em; line-height: 1.55; margin: 0 0 18px 0; color: #00ffd5; font-weight: 700;">
		The asymmetry comes from using different quadratic terms on the left and right side.
	</p>
</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="running-window-regression-slide" -->
## Running-Window Regression On A Chromatogram using the Piecewise Parabola Model
<div style="max-width: 1650px; margin: 24px auto 0 auto; text-align: center;">
	<div id="nts-running-window-regression-plot" style="width: 1600px; height: 800px; margin: 0 auto;"></div>
</div>
<script src="resources/figures/nts-running-window-regression.js"></script>

---

<!-- .slide:id="running-window-fit-grid-slide" -->
## Running-Window Fits As Tiles
<div style="max-width: 1650px; margin: 24px auto 0 auto; text-align: center;">
	<div style="display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; margin: 0 auto 18px auto; padding: 14px 18px; max-width: 1120px; border-radius: 16px; border: 2px solid rgba(0, 255, 255, 0.16); background: linear-gradient(180deg, rgba(4, 17, 26, 0.34), rgba(4, 17, 26, 0.16)); box-shadow: 0 0 24px rgba(0, 255, 255, 0.06); text-align: left;">
		<div style="display: inline-flex; align-items: center; gap: 12px; font-size: 0.42em; color: #efefef;">
			<span style="color: #efefef;">Invalid peak form</span>
			<span style="color: #8aa3ad; opacity: 0.72;">Off</span>
			<label for="running-window-fit-grid-toggle-non-peak" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
				<input id="running-window-fit-grid-toggle-non-peak" type="checkbox" style="opacity: 0; width: 0; height: 0;" onchange="this.nextElementSibling.style.background=this.checked?'#103a30':'#10303a';this.nextElementSibling.style.borderColor=this.checked?'rgba(0,255,213,0.62)':'rgba(0,255,255,0.28)';this.nextElementSibling.nextElementSibling.style.transform=this.checked?'translateX(28px)':'translateX(0px)';this.nextElementSibling.nextElementSibling.style.background=this.checked?'#00ffd5':'#00ffd5';">
				<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(0, 255, 255, 0.28); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
				<span style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #00ffd5; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
			</label>
			<span style="color: #00ffd5;">On</span>
		</div>
		<div style="display: inline-flex; align-items: center; gap: 12px; font-size: 0.42em; color: #efefef;">
			<span style="color: #efefef;">Invalid apex position</span>
			<span style="color: #8aa3ad; opacity: 0.72;">Off</span>
			<label for="running-window-fit-grid-toggle-edge-apex" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
				<input id="running-window-fit-grid-toggle-edge-apex" type="checkbox" style="opacity: 0; width: 0; height: 0;" onchange="this.nextElementSibling.style.background=this.checked?'#3a2d10':'#10303a';this.nextElementSibling.style.borderColor=this.checked?'rgba(255,209,102,0.72)':'rgba(255,209,102,0.35)';this.nextElementSibling.nextElementSibling.style.transform=this.checked?'translateX(28px)':'translateX(0px)';this.nextElementSibling.nextElementSibling.style.background=this.checked?'#ffd166':'#ffd166';">
				<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(255, 209, 102, 0.35); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
				<span style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #ffd166; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
			</label>
			<span style="color: #ffd166;">On</span>
		</div>
		<div style="display: inline-flex; align-items: center; gap: 12px; font-size: 0.42em; color: #efefef;">
			<span style="color: #efefef;">Insignificant peak area</span>
			<span style="color: #8aa3ad; opacity: 0.72;">Off</span>
			<label for="running-window-fit-grid-toggle-insignificant-area" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
				<input id="running-window-fit-grid-toggle-insignificant-area" type="checkbox" style="opacity: 0; width: 0; height: 0;" onchange="this.nextElementSibling.style.background=this.checked?'#35103a':'#10303a';this.nextElementSibling.style.borderColor=this.checked?'rgba(255,138,224,0.72)':'rgba(255,138,224,0.35)';this.nextElementSibling.nextElementSibling.style.transform=this.checked?'translateX(28px)':'translateX(0px)';this.nextElementSibling.nextElementSibling.style.background=this.checked?'#ff8ae0':'#ff8ae0';">
				<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(255, 138, 224, 0.35); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
				<span style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #ff8ae0; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
			</label>
			<span style="color: #ff8ae0;">On</span>
		</div>
		<div style="display: inline-flex; align-items: center; gap: 12px; font-size: 0.42em; color: #efefef;">
			<span style="color: #efefef;">Nested F-test vs linear</span>
			<span style="color: #8aa3ad; opacity: 0.72;">Off</span>
			<label for="running-window-fit-grid-toggle-nested-f-test" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
				<input id="running-window-fit-grid-toggle-nested-f-test" type="checkbox" style="opacity: 0; width: 0; height: 0;" onchange="this.nextElementSibling.style.background=this.checked?'#10233a':'#10303a';this.nextElementSibling.style.borderColor=this.checked?'rgba(114,184,255,0.72)':'rgba(114,184,255,0.35)';this.nextElementSibling.nextElementSibling.style.transform=this.checked?'translateX(28px)':'translateX(0px)';this.nextElementSibling.nextElementSibling.style.background=this.checked?'#72b8ff':'#72b8ff';">
				<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(114, 184, 255, 0.35); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
				<span style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #72b8ff; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
			</label>
			<span style="color: #72b8ff;">On</span>
		</div>
		<div style="display: inline-flex; align-items: center; gap: 12px; font-size: 0.42em; color: #efefef;">
			<span style="color: #efefef;">Apex is highest point</span>
			<span style="color: #8aa3ad; opacity: 0.72;">Off</span>
			<label for="running-window-fit-grid-toggle-apex-highest" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
				<input id="running-window-fit-grid-toggle-apex-highest" type="checkbox" style="opacity: 0; width: 0; height: 0;" onchange="this.nextElementSibling.style.background=this.checked?'#3a1018':'#10303a';this.nextElementSibling.style.borderColor=this.checked?'rgba(255,120,120,0.72)':'rgba(255,120,120,0.35)';this.nextElementSibling.nextElementSibling.style.transform=this.checked?'translateX(28px)':'translateX(0px)';this.nextElementSibling.nextElementSibling.style.background=this.checked?'#ff7878':'#ff7878';">
				<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(255, 120, 120, 0.35); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
				<span style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #ff7878; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
			</label>
			<span style="color: #ff7878;">On</span>
		</div>
		<div style="display: inline-flex; align-items: center; gap: 12px; font-size: 0.42em; color: #efefef;">
			<span style="color: #efefef;">Extrapolated MSE heatmap</span>
			<span style="color: #8aa3ad; opacity: 0.72;">Off</span>
			<label for="running-window-fit-grid-toggle-mse-heatmap" style="position: relative; display: inline-flex; align-items: center; width: 58px; height: 30px; cursor: pointer;">
				<input id="running-window-fit-grid-toggle-mse-heatmap" type="checkbox" style="opacity: 0; width: 0; height: 0;" onchange="this.nextElementSibling.style.background=this.checked?'#10283a':'#10303a';this.nextElementSibling.style.borderColor=this.checked?'rgba(0,255,213,0.72)':'rgba(0,255,255,0.28)';this.nextElementSibling.nextElementSibling.style.transform=this.checked?'translateX(28px)':'translateX(0px)';this.nextElementSibling.nextElementSibling.style.background=this.checked?'#00ffd5':'#00ffd5';">
				<span style="position: absolute; inset: 0; background: #10303a; border: 2px solid rgba(0, 255, 255, 0.28); border-radius: 999px; transition: background 0.35s ease, border-color 0.35s ease;"></span>
				<span style="position: absolute; left: 4px; top: 4px; width: 20px; height: 20px; background: #00ffd5; border-radius: 50%; transition: transform 0.35s ease, background 0.35s ease;"></span>
			</label>
			<span style="color: #00ffd5;">On</span>
		</div>
	</div>
	<div id="nts-running-window-fit-grid-plot" style="width: 1600px; height: 800px; margin: 0 auto;"></div>
</div>
<script src="resources/figures/nts-running-window-fit-grid.js"></script>
