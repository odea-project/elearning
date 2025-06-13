## Data Processing Techniques
<div>
<div class="leftBox">
<p class="mainBullet">Objectives</p>
<p class="subBullet">O 1</p>
</div>
<div class="spacer"></div>
<div class="rightBox">
<img src="resources/misc/objectives.jpg" alt="Objectives and Pre-requisites" style="width: auto; height: 350px; float: right;">
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
        <p class="subBullet fragment" data-fragment-index="0">
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
        <div class="fragment fade-left" data-fragment-index="0" id="chart-data-processing-002"></div>
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
<div class="code-button-container">
    <div class="py-code-button" id="py-code-normalization"></div>
</div>  
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

## In Addition, Data Preprocessing means making data <span class="post-it-strip">comparable</span>
<div>
  <div class="leftBox">
      <div id="chart-data-processing-004"></div>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="mainBullet">
        <strong>Scaling:</strong> bring data to the same level
    </p>
    <p class="subBullet" style="font-size: large;">
        <strong>Standardization:</strong> z-score scaling
        $$
        x_{\text{norm}} = \frac{x - \mu}{\sigma}
        $$
    </p>
    <p class="subSubBullet" style="font-size: large;">
        Sets the mean to 0 and the standard deviation to 1
    </p>
    <p class="subSubBullet" style="font-size: large;">
        Robust to outliers, but sensitive to the scale of the data.
    </p>
  </div>
</div>
<div>
<label class="switch">
  <input type="checkbox" id="toggle-original" checked>
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">original</span>
<label class="switch">
  <input type="checkbox" id="toggle-normalize-2" checked>
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">normalize</span>
<label class="switch">
  <input type="checkbox" id="toggle-standardize" checked>
  <span class="slider round"></span>
</label>
<span style="margin-left: 8px; vertical-align: middle;">standardize</span>
</div>
<script src="../resources/js/charts/signal_processing_004.js"></script>
--- (id="data-standardization")

## In Addition, Data Preprocessing means making data <span class="post-it-strip">comparable</span>
<div>
  <div class="leftBox">
    <div class="tab-content active signal3-tab" data-tab="signal3a">
      <pre style="font-size: large;">
    Table A:
    Sample ID | Fe [µg/L] | Cu [mg/L]
    ---------------------------------
    1         | 0.1       | 0.2
    2         | 0.2       | 0.3
    3         | 0.3       | 0.4
    ---------------------------------</pre>
      <pre style="font-size: large;">
    Table B:
    #ID | Cu (mg/L) | Fe (mg/L)
    ---------------------------------
    1   | 0.15    | 0.0003
    2   | 0.25    | 0.0007
    3   | 0.335   | 0.0011
    ---------------------------------</pre>
    </div>
    <div class="tab-content signal3 signal3-tab" data-tab="signal3b">
      <pre style="font-size: large;">
    Table A: Harmonized
    Sample ID | Fe [µg/L] | Cu [µg/L]
    ---------------------------------
    1         | 100.0     | 200
    2         | 200.0     | 300
    3         | 300.0     | 400
    ---------------------------------</pre>

  <pre style="font-size: large;">
    Table B: Harmonized
    Sample ID | Fe [µg/L] | Cu [µg/L]
    ---------------------------------
    1         | 0.3       | 150
    2         | 0.7       | 250
    3         | 1.1       | 335
    ---------------------------------</pre>
  </div>
  <p class="question" style="font-size: large;">
      Why is harmonization important in data preprocessing?
  </p>
</div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="mainBullet">
      <strong>Harmonization:</strong> unify data from different sources
    </p>
    <p class="subBullet" style="font-size: large;">
      <strong>Unit Harmonization:</strong> convert units
    </p>
    <p class="subSubBullet" style="font-size: large;">
      e.g., convert concentration from mg/L to µg/L
    </p>
    <p class="subSubBullet" style="font-size: large;">
      Requires knowledge about the data and the units.
    </p>
    <p class="subBullet" style="font-size: large;">
      <strong>Label Harmonization:</strong> unify labels
    </p>
    <p class="subSubBullet" style="font-size: large;">
      e.g., rename columns or rows
    </p>
    <p class="subSubBullet" style="font-size: large;">
      Requires knowledge about the data and the labels.
    </p>
    <div class="tabs">
      <div class="tab active signal3-tab" data-tab="signal3a">Original Data</div>
      <div class="tab signal signal3-tab" data-tab="signal3b">Harmonize</div>
    </div>
  </div>
</div>
--- (id="data-harmonization")

## Simple Denoising Techniques <span class="post-it-strip">Convolution</span>
<div>
    <div class="leftBox">
        <p class="question">
            What is <strong>Convolution</strong>?
        </p>
        <p class="mainBullet">
            Convolution is a moving process that uses a <strong>kernel</strong> (analysis function) to
            transform a signal.
        </p>
            $$
            (f * g)(t) = \int_{-\infty}^{\infty} f(\tau) g(t - \tau) d\tau
            $$
            <span class="small-text">with $f$ as the signal and $g$ as the kernel</span>
        <p class="subBullet">
            We can use convolution to <strong>smooth</strong> a signal.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div class="tabs">
            <div class="tab active signal4-tab" data-tab="signal4a">step 1</div>
            <div class="tab signal" data-tab="signal4b">step 2</div>
            <div class="tab signal" data-tab="signal4c">step 3</div>
            <div class="tab signal" data-tab="signal4d">step 4</div>
            <div class="tab signal" data-tab="signal4e">step 5</div>
        </div>
        <div class="tab-content active signal4-tab" data-tab="signal4a">
            <pre style="font-size: large; overflow: hidden; white-space: pre-wrap; word-break: break-word;" data-trim data-noescape>
                <code data-trim data-noescape>Signal: 1    2    3    4    5    6    7    8    9   
        ×    ×    ×    ×    
Kernel: 0.25 0.25 0.25 0.25
Result: 2.5  0    0    0    0    0    0    0    0</code>
            </pre>
        </div>
        <div class="tab-content signal4-tab" data-tab="signal4b">
            <pre style="font-size: large; overflow: hidden; white-space: pre-wrap; word-break: break-word;" data-trim data-noescape>
                <code data-trim data-noescape>Signal: 1    2    3    4    5    6    7    8    9
              ×    ×    ×    ×    
Kernel:      0.25 0.25 0.25 0.25
Result: 2.5  3.5  0    0    0    0    0    0    0</code>
            </pre>
        </div>
        <div class="tab-content signal4-tab" data-tab="signal4c">
            <pre style="font-size: large; overflow: hidden; white-space: pre-wrap; word-break: break-word;" data-trim data-noescape>
                <code data-trim data-noescape>Signal: 1    2    3    4    5    6    7    8    9
                   ×    ×    ×    ×
Kernel:           0.25 0.25 0.25 0.25
Result: 2.5  3.5  4.5  0    0    0    0    0    0</code>
            </pre>
        </div>
        <div class="tab-content signal4-tab" data-tab="signal4d">
            <pre style="font-size: large; overflow: hidden; white-space: pre-wrap; word-break: break-word;" data-trim data-noescape>
                <code data-trim data-noescape>Signal: 1    2    3    4    5    6    7    8    9
                        ×    ×    ×    ×    
Kernel:                0.25 0.25 0.25 0.25
Result: 2.5  3.5  4.5  5.5  0    0    0    0    0</code>
            </pre>
        </div>
        <div class="tab-content signal4-tab" data-tab="signal4e">
            <pre style="font-size: large; overflow: hidden; white-space: pre-wrap; word-break: break-word;" data-trim data-noescape>
                <code data-trim data-noescape>Signal: 1    2    3    4    5    6    7    8    9
                             ×    ×    ×    ×    
Kernel:                     0.25 0.25 0.25 0.25
Result: 2.5  3.5  4.5  5.5  6.5  0    0    0    0</code>
            </pre>
        </div>
        <p class="mainBullet" style="margin-top: -20px;">
            <strong>Properties</strong> of a kernel for smoothing:
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Sum:</strong> the sum of the kernel should be 1
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Width:</strong> the width of the kernel determines the smoothing effect
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Values:</strong> the values (weights) of the kernel determine the smoothing effect
        </p>
    </div>
--- (id="convolution-smoothing")

## Kernels for <span class="post-it-strip">Smoothing</span>
<div>
    <div class="leftBox">
        <p class="question">
            What are <strong>Common Kernels</strong> for Smoothing?
        </p>
        <p class="subBullet">
            <strong>Boxcar:</strong> all weights are equal
        </p>
        <p class="small-text">
                e.g. [0.25, 0.25, 0.25, 0.25] <br>
                or [0.33 0.33 0.33]
                $$ k(t) = \frac{1}{n} $$
        </p>
        <p class="subSubBullet">
            This is used for simple moving averages.
        </p>
        <!-- add slider here for changing span width of kernel -->
        <p style="font-size: large;">
            <input id="spanSlider" type="range" min="1" max="20" step="1" value="1"> Span:
            <span id="spanValue">1</span>
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_smoothing1"></div>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_005.js"></script>
--- (id="kernels-for-smoothing")

## Kernels for <span class="post-it-strip">Smoothing</span>
<div>
    <div class="leftBox">
        <p class="subBullet">
            <strong>Gaussian:</strong> weights follow a Gaussian distribution<br>
            <span class="small-text
                ">e.g. [0.05, 0.25, 0.4, 0.25, 0.05]
                $$ k(t) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\left(-\frac{t^2}{2\sigma^2}\right) $$
            </span>
        </p>
        <p class="subSubBullet">
            This is used for weighted moving averages.
        </p>
        <p style="font-size: large;">
            <input id="spanSlider2" type="range" min="1" max="20" step="1" value="1"> Span:
            <span id="spanValue2">1</span>
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_smoothing2"></div>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_006.js"></script>
--- (id="kernels-for-smoothing-gaussian")

## Kernels for <span class="post-it-strip">Smoothing</span>
<div>
    <div class="leftBox">
        <p class="subBullet">
            <strong>Savitzky-Golay:</strong> weights are polynomial coefficients
        </p>
        <p class="small-text">
            e.g. [-3, 12, 17, 12, -3] for a quadratic polynomial<br>
            $$
            y(t) = \sum_{i=-n}^{n} c_i \cdot f(t + i)
            $$
            Coefficients $ c_i $ are derived to fit a polynomial of order $ p $ in a moving
            window.
        </p>
        <p class="subSubBullet" style="font-size: large;">
            This method is ideal for smoothing while preserving peak shapes in signals.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_smoothing3"></div>
        <p style="font-size: large; margin-top: -20px;">
            <input id="spanSlider3" type="range" min="1" max="25" step="1" value="1"> Half Window Size:
            <span id="spanValue3">1</span><br>
            <select id="polyOrder">
                <option value="2" selected>Quadratic (2)</option>
                <option value="3">Cubic (3)</option>
                <option value="4">Quartic (4)</option>
            </select> Polynomial Order
        </p>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_007.js"></script>
--- (id="kernels-for-smoothing-savitzky-golay")

## The <span class="post-it-strip">Trade-off</span> in Smoothing
<div>
    <div class="leftBox">
        <p class="question">
            What is the problem with <strong>Smoothing?</strong>
        </p>
        <p class="mainBullet" style="font-size: large;">
            Smoothing reduces <strong>noise</strong>, but it also alters the <strong>signal</strong>.
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Stronger smoothing:</strong>
        </p>
        <p class="subSubBullet" style="font-size: large;">
            Removes more noise
        </p>
        <p class="subSubBullet" style="font-size: large;">
            But reduces peak intensity
        </p>
        <p class="subSubBullet" style="font-size: large;">
            And widens the signal
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Weaker smoothing:</strong>
        </p>
        <p class="subSubBullet" style="font-size: large;">
            Preserves signal intensity and shape
        </p>
        <p class="subSubBullet" style="font-size: large;">
            But leaves more noise in the data
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_smoothing_tradeoff"></div>
        <p class="subSubBullet" style="font-size: large; margin-top: -20px;">
            The choice of smoothing parameters (kernel size, type, etc.) is a trade-off between noise
            reduction and signal preservation.
        </p>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_008.js"></script>
--- (id="trade-off-in-smoothing")

## Savitzky-Golay: <span class="post-it-strip">1st Derivative</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            The <strong>1st derivative</strong> provides both <strong>smoothing</strong> &
            <strong>baseline correction</strong>.
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>How it works:</strong>
            <span class="small-text">
                Savitzky-Golay computes derivatives directly from a polynomial fit within a moving
                window.
                $$
                y'(t) = \frac{d}{dt} \sum_{i=-n}^{n} c_i \cdot f(t + i)
                $$
            </span>
        </p>
        <p class="mainBullet" style="font-size: large;">
            <strong>Applications:</strong>
        </p>
        <p class="subBullet" style="font-size: large;">
            Removing baseline drifts by zeroing the derivative of constant or linear trends.
        </p>
        <p class="subBullet" style="font-size: large;">
            Smoothing noisy data while retaining peak features and enhancing changes.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_sg_derivative"></div>
        <p class="subSubBullet" style="font-size: medium; margin-top: -20px;">
            Figure: solid white line is the original signal, solid red line is the smoothed signal (SG1), and
            solid blue line is the 1st derivative without SG.
    </div>
</div>
<script src="../resources/js/charts/signal_processing_009.js"></script>
--- (id="savitzky-golay-1st-derivative")

## Savitzky-Golay: <span class="post-it-strip">Generating Coefficients</span>
<div class="slide-content">
    <div class="leftBox">
        <p class="question">
            How are <strong>Savitzky-Golay Coefficients</strong> generated?
        </p>
        <p class="mainBullet" style="font-size: large;">
            We need a polynomial's <strong>Vandermonde matrix</strong> & <strong>pseudo-inverse</strong>.
        </p>
        <p class="subBullet" style="font-size: medium;">
            <strong>Vandermonde Matrix:</strong><br>(e.g., for 5 points & 2 orders)
            $$
            \mathbf{V} =
            \begin{bmatrix}
            1 & t_{-2} & t_{-2}^2 \\
            1 & t_{-1} & t_{-1}^2 \\
            1 & t_{0} & t_{0}^2 \\
            1 & t_{1} & t_{1}^2 \\
            1 & t_{2} & t_{2}^2
            \end{bmatrix}
            =
            \begin{bmatrix}
            1 & -2 & 4 \\
            1 & -1 & 1 \\
            1 & 0 & 0 \\
            1 & 1 & 1 \\
            1 & 2 & 4
            \end{bmatrix}
            $$
            where $ t_i $ are the time points relative to the center of the window.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: medium;">
            <strong>Pseudo-Inverse:</strong>
            $$
            \mathbf{V}^+ = (\mathbf{V}^T \mathbf{V})^{-1} \mathbf{V}^T
            $$
            The rows of $ \mathbf{V}^+ $ are the coefficients for smoothing and derivatives.
        </p>
        <p class="subBullet" style="font-size: medium;">
            <strong>Extract Coefficients</strong>:
            $$
            \mathbf{V}^+ =
            \begin{bmatrix}
            -3 & 12 & 17 & 12 & -3 \\
            -2 & -1 & 0 & 1 & 2 \\
            1 & -2 & 0 & 2 & -1
            \end{bmatrix}
            \begin{array}{l}
            \small\leftarrow\text{ for Smoothing} \\
            \small\leftarrow\text{ for 1st Derivative} \\
            \small\leftarrow\text{ for 2nd Derivative}
            \end{array}
            $$
        </p>
    </div>
</div>
--- (id="savitzky-golay-coefficients")

## Savitzky-Golay: <span class="post-it-strip">Generating Coefficients</span>
<div class="slide-content">
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            <strong>Normalization:</strong>
            The 1st row (for smoothing) must be normalized:
            $$
            c_i^{\text{norm}} = \frac{c_i}{\sum_j c_j}
            $$
            Resulting in:
            $$
            c^{\text{norm}} = \left[ -0.086, 0.343, 0.486, 0.343, -0.086 \right]
            $$
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: medium;">
            Relevance of Other Rows:
        </p>
        <p class="subSubBullet" style="font-size: medium;">
            1st Row: Weighted mean for smoothing.
        </p>
        <p class="subSubBullet" style="font-size: medium;">
            2nd Row: Approximates the 1st derivative (scaled by $ 1/\Delta t $).
        </p>
        <p class="subSubBullet" style="font-size: medium;">
            3rd Row: Approximates the 2nd derivative (scaled by $ 1/\Delta t^2 $).
        </p>
    </div>
</div>
--- (id="savitzky-golay-coefficients-2")

## Denoising using <span class="post-it-strip">Fourier Transformation</span>
<div>
    <div class="leftBox">
        <p class="question">
            What is <strong>Fourier Transformation</strong> and how does it work?
        </p>
        <p class="mainBullet" style="font-size: large;">
            Fourier Transformation convolves <strong>axial frequencies</strong> with <strong>radial
                frequencies</strong> and analyzes <strong>interferences</strong>.
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Axial Frequency:</strong><br>
            Periodic signal along an axis.
            $$
            \cos(x \cdot f)
            $$
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
        Frequency: <input id="slider_axial" type="range" min="1" max="15" value="7" step="1">
            <span id="value_axial">10</span>
            </p>
        <div id="chart_axial"></div>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_010.js"></script>
--- (id="denoising-fourier-transformation")

## Denoising using <span class="post-it-strip">Fourier Transformation</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            <strong>Interference:</strong> <br>
            Multiple frequencies can be combined to create interferences.
            $$
            \cos(x \cdot f_1) + \cos(x \cdot f_2)
            $$
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
            Frequency 1: <input id="slider_interference_1" type="range" min="1" max="15" value="5"
                step="1">
            <span id="value_interference_1">5</span><br>
            Frequency 2: <input id="slider_interference_2" type="range" min="1" max="15" value="10"
                step="1">
            <span id="value_interference_2">10</span>
        <div id="chart_interference"></div>
        </p>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_010.js"></script>
--- (id="denoising-fourier-transformation-2")

## Denoising using <span class="post-it-strip">Fourier Transformation</span>
<div>
    <div class="leftBox">
        <p class="subBullet" style="font-size: large;">
            <strong>Radial:</strong><br>
            Number of loops around a circle.
            $$
            \exp(i \cdot x \cdot f)
            $$
        <div id="chart_radial" style="margin-top: -40px;"></div>
        </p>
        <p class="subSubBullet" style="font-size: medium;">
            The radial frequency is the number of loops around the circle per unit of time.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
            <strong>Interference:</strong><br>
            Combining <strong>axial</strong> and <strong>radial</strong> frequencies.
            $$
            \exp(i \cdot x \cdot f) \cdot \cos(x \cdot f)
            $$
        <div id="chart_interference2" style="margin-top: -40px;"></div>
        </p>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_011.js"></script>
--- (id="denoising-fourier-transformation-3")

## Denoising using <span class="post-it-strip">Fourier Transformation</span>
<div>
    <div class="leftBox">
        <p class="mainBullet">
            Fourier Transformation combines <strong>axial</strong> and <strong>radial</strong>
            frequencies to identify patterns:
            $$
            y_k = \sum_{j=0}^{N-1} \left(e^{-2\pi i \cdot \frac{jk}{N}} \cdot y_j\right)
            $$
            Where $ y $ is the dataset with $ N $ points.
        </p>
        <p class="subBullet" style="font-size: large;">
            When frequencies differ, the integral approaches zero. For matching frequencies, the sum
            increases.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
            Circle Frequency:
            <input id="frequencySlider" type="range" min="1" max="10" step="0.1" value="1">
            <span id="frequencyValue">1</span>
        </p>
        <label>Centroid Distance: <span id="distanceValue"></span></label>
        <div id="chart_matching"></div>
        <p class="subSubBullet" style="font-size: large;">
            The integral can be interpreted as the distance between geometric mean of the dataset to the
            origin of the cooordinate system, which is shown in blue.
        </p>
        <p class="subSubBullet" style="font-size: large;">
            The dinstance maximizes when the frequencies match.
        </p>
    </div>
</div>
--- (id="denoising-fourier-transformation-4")

## Systematic Frequency <span class="post-it-strip">Analysis</span>
<div>
    <div class="leftBox">
        <p class="mainBullet">
            Fourier Transformation systematically varies radial frequencies to identify all frequencies
            in the dataset.
        </p>
        <p class="subBullet">
            This process works in both directions and is reversible:
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_fft1" style="margin-top: -40px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            Original signal.
        </p>
        <div id="chart_fft2" style="margin-top: -40px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            Fourier Transformation of the signal.
        </p>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_012.js"></script>
--- (id="systematic-frequency-analysis")

## Frequency <span class="post-it-strip">Filtering</span>
<div>
    <div class="leftBox">
        <p class="mainBullet">
            High-frequency noise can be filtered by removing frequencies above a threshold:
        </p>
        <p class="subBullet">
            $$
            I(f) =
            \begin{cases}
            I(f), & \text{if } f < \text{threshold} \\ 0, & \text{otherwise.} \end{cases}
            $$
        </p>
        <p class="mainBullet">
            The result is a denoised dataset.
        </p>
        <p class="subBullet" style="font-size: large;">
            Frequency Filter:
            <input id="frequencyFilterSlider" type="range" min="1" max="128" step="0.1" value="128">
            <span id="frequencyFilterValue">128</span>
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_fft3" style="margin-top: -40px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            Original & denoised signal.
        </p>
        <div id="chart_fft4" style="margin-top: -40px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            Fourier Transformation of the signal including frequency filtering.
        </p>
    </div>
</div>
--- (id="frequency-filtering-1")

## Frequency <span class="post-it-strip">Filtering</span>
<div>
    <p class="mainBullet" style="font-size: large; margin-left: 40px;">
        Noisy signal & denoised signal after frequency filtering:
    </p>
    <div id="chart_fft5"></div>
</div>
--- (id="frequency-filtering-2")

## Frequency <span class="post-it-strip">Filtering</span>
<div>
    <div id="chart_fft6"></div>
    <div class="leftBox">
    <p class="subSubBullet" style="font-size: large;">
        When the signal contains sharp peaks, the Fourier Transformation may not be suitable for denoising.
    </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subSubBullet" style="font-size: large;">
            Sharp peaks contain high-frequency components that are essential for the signal.
        </p>
    </div>
</div>
--- (id="frequency-filtering-3")

## Frequency <span class="post-it-strip">Filtering</span>
<div>  
    <div class="leftBox">
    <div id="chart_fft7"></div>
    <p class="subSubBullet" style="font-size: large;">
        Peaks contain not a single frequency but a range of frequencies.
    </p>
    <p class="subBullet" style="font-size: large;">
            Peak width:
            <input id="peakWidthSlider" type="range" min="0.01" max="1" step="0.01" value="0.5">
            <span id="peakWidthValue">0.5</span>
    </p>
    <p class="subSubBullet" style="font-size: large;">
        The sharper the peak, the broader the frequency range.
    </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
    <div id="chart_fft8"></div>
        <p class="subSubBullet" style="font-size: large;">
            This band from the peak limits the effectiveness of frequency filtering.
        </p>
        <p class="subBullet" style="font-size: large;">
            Frequency Filtering:
            <input id="frequencyFilterSlider3" type="range" min="1" max="128" step="0.1" value="128">
            <span id="frequencyFilterValue3">128</span>
    </p>
    </div>
</div>
--- (id="frequency-filtering-4")

## Frequency <span class="post-it-strip">Filtering</span>
<div>
    <div id="chart_fft9"></div>
    <div class="leftBox">
    <p class="subSubBullet" style="font-size: large;">
        When the signal contains broad peaks, the Fourier Transformation may be suitable for denoising.
    </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subSubBullet" style="font-size: large;">
            Broad peaks contain leave more room for frequency filtering.
        </p>
    </div>
</div>
--- (id="frequency-filtering-5")

## Fourier Transformation <span class="post-it-strip">Summary</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            Fourier Transformation extracts <strong>frequencies</strong> from a signal:
            $$
            \hat{y}_k = \sum_{j=0}^{N-1} \left(e^{-2\pi i \cdot \frac{jk}{N}} \cdot y_j\right)
            $$
            Where $y$ is the dataset with $N$ points.
            <strong>Output:</strong> Frequency spectrum showing which frequencies are present in the signal.
        </p>
        <p class="subBullet" style="font-size: large;">
            Frequencies can be <strong>filtered</strong> (e.g., high-frequency noise removal).
        </p>
        <p class="subBullet" style="font-size: large;">
            The signal can be transformed <strong>back</strong> to the time domain after filtering.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
            <strong>Key Limitation:</strong><br>
            Fourier Transformation does not provide information about where a frequency occurs in the dataset.
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Advantage:</strong><br>
            Fourier Transformation uses that noise is often high-frequency and can be filtered out.
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Alternative:</strong><br>
            Discrete Wavelet Transformation provides information about the location of frequencies.
        </p>
    </div>
</div>
--- (id="fourier-transformation-summary")

## Discrete Wavelet Transformation <span class="post-it-strip">Introduction</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            <strong>Discrete Wavelet Transformation (DWT):</strong><br>
            A method that decomposes a signal into components using wavelets.
        </p>
        <p class="subBullet" style="font-size: large;">
            Unlike FFT, DWT provides both <strong>frequency</strong> and <strong>location</strong> information of the signal's features.
        </p>
        <p class="subBullet" style="font-size: large;">
            $$
            DWT(x) = \sum_{j,k} x(t) \cdot \psi_{j,k}(t)
            $$
            Where $\psi_{j,k}(t)$ are scaled and shifted versions of a mother wavelet.
        </p>
        <p class="subBullet" style="font-size: large;">
            Wavelets are localized in both <strong>time</strong> and <strong>frequency</strong>.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
            <strong>Comparison:</strong>
        </p>
        <ul style="font-size: large;">
            <li><strong>FFT:</strong> Great for extracting global frequencies, but no location info.</li>
            <li><strong>DWT:</strong> Ideal for detecting transient features and changes over time.</li>
        </ul>
        <p class="subBullet" style="font-size: large;">
            What is a <strong>Wavelet?</strong>
        </p>
        <p class="subSubBullet" style="font-size: large;">
            A wavelet is a kernel function with a specific shape and properties, e.g., sum of all values is zero.
        </p>
        <p class="subSubBullet" style="font-size: large;">
            Wavelets are used to analyze signals at different scales, i.e. resolutions.
        </p>
        <p class="subSubBullet" style="font-size: large;">
            The most simple wavelet is the Haar wavelet.<br>
            $$
            \psi(t) = \begin{cases} 1, & 0 \leq t < 0.5 \\ -1, & 0.5 \leq t < 1 \end{cases}
            $$
        </p>
    </div>
</div>
--- (id="dwt-introduction")

## Approximation & Details <span class="post-it-strip">Decomposition</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            In DWT, we use two kernels to decompose a signal into details and approximations:
        </p>
        <p class="mainBullet" style="font-size: large;">
            The Haar wavelet operates with the following kernels:
        </p>
        <p class="subBullet" style="font-size: medium;">
            <strong>1. Approximation kernel ($h$):</strong><br>
            Used to calculate <strong>averages</strong> (low-frequency components).<br>
            $$
            h = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & 1 \end{bmatrix}
            $$
        </p>
        <p class="subBullet" style="font-size: medium;">
            <strong>2. Details kernel ($g$):</strong><br>
            Used to calculate <strong>differences</strong> (high-frequency components).<br>
            $$
            g = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 & -1 \end{bmatrix}
            $$
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="mainBullet" style="font-size: large;">
            Example a): haar Wavelet:
        </p>
        <div id="chart_haar_wavelet" style="margin-top: -20px;"></div>
        <p class="mainBullet" style="font-size: large;">
            Example b) rbio3.9 Wavelet:
        </p>
        <div id="chart_rbio3_9_wavelet" style="margin-top: -20px;"></div>
    </div>
</div>
<script src="../resources/js/charts/signal_processing_013.js"></script>
--- (id="haar-wavelet")

## Wavelet Transformation <span class="post-it-strip">Step-by-Step</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            The Wavelet Transformation processes data by:
        </p>
        <p class="subBullet" style="font-size: large;">
            1. Convolution with two discrete kernels (filters):
            $$
            y_{\mathrm{h}}[k] = \sum_{n=0}^{L-1} h[n]\cdot x[k - n]
            $$
            $$
            y_{\mathrm{g}}[k] = \sum_{n=0}^{L-1} g[n]\cdot x[k - n]
            $$
            where $h[n]$ is the approximation and $g[n]$ is the details of length $L$.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="subBullet" style="font-size: large;">
            2. Down-Sampling by 2 (keep every second sample):
            $$
            A[k] = y_{\mathrm{h}}[2k], \quad
            D[k] = y_{\mathrm{g}}[2k]
            $$
            yielding the approximation coefficients $A$ and detail coefficients $D$ of half the original length.
        </p>
        <p class="subBullet" style="font-size: large;">
            3. Recursive Process: with a constant scale of 2, the process is repeated until the desired
            <pre>
y -> A1 & D1
      ↳ A2 & D2
         ↳ A3 & D3
            ↳ A4 & D4</pre>
                        </p>
    </div>
</div>
--- (id="haar-wavelet-transformation-step-by-step")

## Example of <span class="post-it-strip">DWT</span>
<div id="chart_dwt_example1" style="margin-top: -10px;"></div>
<div>
    <div class="leftBox">
        <div id="chart_dwt_example2" style="margin-top: -20px;"></div>
        <p class="subBullet" style="font-size: large;">
            The DWT decomposes a signal into <span style="color: red;"><strong>approximations</strong></span> and <span style="color: cyan;"><strong>details</strong></span>.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_dwt_example3" style="margin-top: -20px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            <span style="color: red;">Approximations</span> represent the signal's low-frequency components (father wavelet).
        </p>
        <p class="subSubBullet" style="font-size: large;">
            <span style="color: cyan;">Details</span> represent the signal's high-frequency components (mother wavelet).
        </p>
    </div>
</div>
--- (id="dwt-example")
            
## DWT and the <span class="post-it-strip">Multi Resolution Analysis</span>
<div>
    <div class="leftBox">
        <div id="chart_dwt_multi_resolution_analysis" style="margin-top: -20px;"></div>
        <p class="subBullet" style="font-size: large;">
            On the left side, we see the original signal.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_dwt_multi_resolution_analysis_details1" style="margin-top: -20px;"></div>
        <div id="chart_dwt_multi_resolution_analysis_details2" style="margin-top: -80px;"></div>
        <div id="chart_dwt_multi_resolution_analysis_details3" style="margin-top: -80px;"></div>
        <div id="chart_dwt_multi_resolution_analysis_details4" style="margin-top: -80px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            On the right side, we see the <span style="color: cyan;">Details</span> of multiple scales (steps)
        </p>
        <p class="subSubBullet" style="font-size: large;">
            The indivudal <span style="color: cyan;">Details</span> describe the signal's frequencies at different scales (high scale = low frequency).
        </p>
    </div>
</div>
--- (id="dwt-multi-resolution-analysis")

## DWT and the <span class="post-it-strip">Multi Resolution Analysis</span>
<div>
    <div class="leftBox">
        <div id="chart_dwt_multi_resolution_analysis-2" style="margin-top: -20px;"></div>
        <p class="subBullet" style="font-size: large;">
            On the left side, we see the original and reconstructed signal.
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <div id="chart_dwt_multi_resolution_analysis_details5" style="margin-top: -20px;"></div>
        <div id="chart_dwt_multi_resolution_analysis_details6" style="margin-top: -80px;"></div>
        <div id="chart_dwt_multi_resolution_analysis_details7" style="margin-top: -80px;"></div>
        <div id="chart_dwt_multi_resolution_analysis_details8" style="margin-top: -80px;"></div>
        <p class="subSubBullet" style="font-size: large;">
            To denoise, we use filters on the different scales (Details).
        </p>
        <p class="subSubBullet" style="font-size: large;">
            The reconstructed signal is the sum of the approximations and the filtered details.
        </p>
    </div>
</div>
--- (id="dwt-multi-resolution-analysis-2")

## Discrete Wavelet Transformation <span class="post-it-strip">Summary</span>
<div>
    <div class="leftBox">
        <p class="mainBullet" style="font-size: large;">
            The <strong>Discrete Wavelet Transformation (DWT)</strong> provides a way to analyze signals in both:
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Frequency domain</strong> (like FFT).
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Time domain</strong> (unlike FFT).
        </p>
        <p class="mainBullet" style="font-size: large;">
            By using <strong>Wavelets</strong>:
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Approximations:</strong> Low-frequency components for trends (smooth signal).
        </p>
        <p class="subBullet" style="font-size: large;">
            <strong>Details:</strong> High-frequency components for transient features (sharp changes).
        </p>
    </div>
    <div class="spacer"></div>
    <div class="rightBox">
        <p class="mainBullet" style="font-size: large;">
            <strong>Advantages of DWT:</strong>
        </p>
        <p class="subBullet" style="font-size: large;">
            Detects <strong>location</strong> of features in the signal.
        </p>
        <p class="subBullet" style="font-size: large;">
            Supports <strong>multi-resolution analysis</strong> (analyzing signals at different scales).
        </p>
        <p class="mainBullet" style="font-size: large;">
            <strong>Key Applications:</strong>
        </p>
        <ul style="font-size: large;">
            <li>Noise reduction (denoising).</li>
            <li>Image compression (e.g., JPEG 2000).</li>
            <li>Transient detection (e.g., ECG or fault detection).</li>
        </ul>
    </div>
</div>
--- (id="dwt-summary")
