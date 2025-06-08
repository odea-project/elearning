# Data Processing Techniques
<div>
<div class="leftBox">
<p class="mainBullet">Objectives</p>
<p class="subBullet">O 1</p>
</div>
<div class="spacer"></div>
<div class="rightBox">
<img src="../resources/misc/objectives.jpg" alt="Objectives and Pre-requisites" style="width: auto; height: 350px; float: right;">
</div>
</div>
--- (id="objectives-and-pre-requisites")

## What is a <span class="post-it-strip">Signal?</span>
<div>
    <div class="leftBox">
        <p class="mainBullet">
            From an analytical perspective, a signal consists
            of multiple components.
        </p>
        <p class="subBullet">
            <strong>Analyte</strong>: the signal of interest
        </p>
        <p class="subBullet fragment" data-fragment-index="1">
            <strong>Matrix</strong>: e.g., interference, suppression, or enhancement
        </p>
        <p class="subBullet fragment" data-fragment-index="2">
            <strong>System</strong>: e.g., noise, drift, or baseline
        </p>
        <p class="mainBullet fragment" data-fragment-index="3">
            Goal: <strong>Extract</strong> the analyte signal.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart-data-processing-002"></div>
    </div>
</div>
<!-- SWITCHES -->
<div>
<div class="fragment fade-up rightBox" data-fragment-index="1">
<label class="switch">
  <input type="checkbox" id="toggle-interference">
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">Interference</span>
<label class="switch">
  <input type="checkbox" id="toggle-suppression">
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">Suppression</span>
</div>
<div class="fragment fade-up leftBox" data-fragment-index="2">
<label class="switch">
  <input type="checkbox" id="toggle-drift">
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">Drift</span>
<label class="switch">
  <input type="checkbox" id="toggle-noise">
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">Noise</span>
</div>
</div>
<script src="../resources/js/charts/signal_processing_002.js"></script>
--- (id="what-is-a-signal")

## In Addition, Data Preprocessing means making data <span class="post-it-strip">comparable</span>
<div>
  <div class="leftBox">
      <div id="chart-data-processing-003"></div>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
      <p class="mainBullet">
        <strong>Scaling:</strong> bring data to the same level
      </p>
      <p class="subBullet">
        <strong>Normalization:</strong> min-max scaling
      </p>
        $$
          x_{\text{norm}} = \frac{x - \min(x)}{\max(x) - \min(x)}
        $$
      <p class="subSubBullet">
        Sets the minimum to 0 and the maximum to 1
      </p>
      <p class="subSubBullet">
        Easy to implement, but sensitive to outliers or noise.
      </p>
  </div>
</div>
<label class="switch">
  <input type="checkbox" id="toggle-normalization-1" checked>
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">normalize</span>
<script src="../resources/js/charts/signal_processing_003.js"></script>
--- (id="data-normalization")
