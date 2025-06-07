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

# What is Data/Signal Processing?
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
        <div id="chart-data-processing-007"></div>
    </div>
</div>
 <!-- Rectangular switch -->
<!-- Rounded switch -->
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
--- (id="test-floor")
