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
        <p class="subBullet">
            <strong>Matrix</strong>: e.g., interference, suppression, or enhancement
        </p>
        <p class="subBullet">
            <strong>System</strong>: e.g., noise, drift, or baseline
        </p>
        <p class="mainBullet">
            Goal: <strong>Extract</strong> the analyte signal.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div class="tab-content active signal-tab" data-tab="signal1">
            <div id="chart-data-processing-001"></div>
        </div>
        <div class="tab-content signal" data-tab="signal2">
            <div id="chart-data-processing-002"></div>
        </div>
        <div class="tab-content signal" data-tab="signal3">
            <div id="chart-data-processing-003"></div>
        </div>
        <div class="tab-content signal" data-tab="signal4">
            <div id="chart-data-processing-004"></div>
        </div>
        <div class="tab-content signal" data-tab="signal5">
            <div id="chart-data-processing-005"></div>
        </div>
        <div class="tab-content signal" data-tab="signal6">
            <div id="chart-data-processing-006"></div>
        </div>
    </div>
    <div class="tabs">
        <div class="tab active signal-tab" data-tab="signal1">Analyte Signal</div>
        <div class="tab signal" data-tab="signal2">Add interference</div>
        <div class="tab signal" data-tab="signal3">Add suppression</div>
        <div class="tab signal" data-tab="signal4">Add noise</div>
        <div class="tab signal" data-tab="signal5">Add drift</div>
        <div class="tab signal" data-tab="signal6">Full Signal</div>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_001.js"></script>
--- (id="what-is-data-signal-processing")

# test floor
<div id="chart-data-processing-007"></div>
<div id="signal-buttons">
  <button class="btn-toggle" data-key="componentA">Linie A</button>
  <button class="btn-toggle" data-key="componentB">Linie B</button>
  <button class="btn-toggle" data-key="componentC">Linie C</button>
</div>
<script src="../resources/js/charts/signal_processing_002.js"></script>
--- (id="test-floor")
