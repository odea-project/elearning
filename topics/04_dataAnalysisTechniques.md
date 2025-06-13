## First Slide
--- (id="first-slide")

## Initial thoughts on data analysis
<div>
  <div class="leftBox">
    <p class="styled-point">
      Let's assume we have a data set that contains the following information:
    </p>
    <p class="styled-point2" style="font-size: large;">
      Each sample was measured with 10 replicates and the mean values are given in the table below.
    </p>
    <table style="font-size: medium;">
      <thead>
        <tr>
          <th>Sample</th><th>[Fe]</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>2.3</td></tr>
        <tr><td>2</td><td>2.7</td></tr>
        <tr><td>3</td><td>1.9</td></tr>
        <tr><td>4</td><td>2.1</td></tr>
        <tr><td>5</td><td>2.5</td></tr>
      </tbody>
    </table>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
      <div id="chart_bar01"></div>
    <p class="styled-point4" style="font-size: large;">
      We can easily compare these samples, e.g., using <code>ANOVA</code> or <code>t-test</code>.
    </p>
  </div>
</div>
<script src="../resources/js/charts/data_analysis_tools_001.js"></script>
<script src="../resources/js/charts/data_analysis_tools_002.js"></script>
<script src="../resources/js/charts/data_analysis_tools_003.js"></script>
--- (id="initial-thoughts")


## Initial thoughts on data analysis
<div>
  <div class="leftBox">
    <p class="styled-point">
      Now, let's assume we have a data set that contains the following information:
    </p>
    <p class="styled-point2" style="font-size: large;">
      Each sample was measured with 10 replicates and the mean values are given in the table below.
    </p>
    <table style="font-size: medium;">
      <thead>
        <tr>
          <th>Sample</th><th>[Fe]</th><th>[Cu]</th><th>[Zn]</th><th>[Mn]</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>1</td><td>2.3</td><td>1.2</td><td>0.5</td><td>0.2</td></tr>
        <tr><td>2</td><td>2.7</td><td>1.1</td><td>0.4</td><td>0.3</td></tr>
        <tr><td>3</td><td>1.9</td><td>1.3</td><td>0.6</td><td>0.1</td></tr>
        <tr><td>4</td><td>2.1</td><td>1.0</td><td>0.3</td><td>0.4</td></tr>
        <tr><td>5</td><td>2.5</td><td>1.4</td><td>0.7</td><td>0.5</td></tr>
      </tbody>
    </table>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
      <div id="chart_bar02"></div>
    <p class="styled-point4" style="font-size: large;">
      How can we compare these samples?
    </p>
  </div>
--- (id="initial-thoughts-2")


## Similarity Measures - Metrics
<div>
  <div class="leftBox">
    <p class="styled-point" style="font-size: large;">
      There are several metrics available to calculate the similarity between samples with multiple variables
      (multivariate data).
    </p>
    <div class="tab-content active" data-tab="dist0">
      <p class="styled-point" style="font-size: large;">
        <code>Minkowski distance</code> is a generalization of distances and is defined as:
        $$ d = \left( \sum_{i=1}^{n} |x_i - y_i|^p \right)^{1/p} $$
        Where $x_i$ and $y_i$ are the values of the $i$ -th variable of the samples $x$ and $y$, 
        respectively.
      </p>
    </div>
    <div class="tab-content" data-tab="dist1">
      <p class="styled-point" style="font-size: large;">
        <code>Manhattan distance</code> (L1 norm) is defined as:
        $$ d = \sum_{i=1}^{n} |x_i - y_i| $$
        Where $x_i$ and $y_i$ are the values of the $i$ -th variable of the samples $x$ and $y$, 
        respectively.
      </p>
    </div>
    <div class="tab-content" data-tab="dist2">
      <p class="styled-point" style="font-size: large;">
        <code>Euclidean distance</code> (L2 norm) is defined as:
        $$ d = \sqrt{\sum_{i=1}^{n} (x_i - y_i)^2} $$
        Where $x_i$ and $y_i$ are the values of the $i$ -th variable of the samples $x$ and $y$, 
        respectively.
      </p>
    </div>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
      <div class="tabs">
        <div class="tab active" data-tab="dist0">off</div>
        <div class="tab" data-tab="dist1">Manhattan</div>
        <div class="tab" data-tab="dist2">Euclidean</div>
      </div>
      <div class="tab-content active" data-tab="dist0" style="height: 470px;">
        <div id="chart_distance0"></div>
      </div>
      <div class="tab-content" data-tab="dist1" style="height: 470px;">
        <div id="chart_distance1"></div>
      </div>
      <div class="tab-content" data-tab="dist2" style="height: 470px;">
        <div id="chart_distance2"></div>
      </div>
  </div>
</div>
--- (id="similarity-measures-metrics")


## Minkowski Distance
<div>
  <div class="leftBox">
    <p class="styled-point">
      The Minkowski distance is a generalized difference-based metric:
      $$
      d = \left( \sum_{i=1}^{n} |x_i - y_i|^p \right)^{1/p}
      $$
      where $ p $ is the order of the distance.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">
      Example: given the following data points:
    <pre><code data-trim data-noescape>A = [5.2, 3.9, 2.1, 1.8, 0.7]
B = [4.8, 3.7, 2.0, 1.7, 0.6]</code></pre>
    <pre>
        <code data-trim data-noescape>d = |5.2 - 4.8|^1 + |3.9 - 3.7|^1 
  + |2.1 - 2.0|^1 + |1.8 - 1.7|^1 
  + |0.7 - 0.6|^1</code></pre>
<pre>
        <code data-trim data-noescape>d = 0.40 + 0.20 + 0.10 + 0.10 + 0.10
d = 0.90</code></pre>
    </p>
  </div>
</div>
--- (id="minkowski-distance")

## Correlation-based Similarity Measures
<div>
  <div class="leftBox">
    <p class="styled-point">Correlation coefficients quantify the similarity between variables by measuring
      linear relationships.</p>
    <p class="styled-point2" style="font-size: large;">
      <code>Pearson Correlation:</code> Measures linear relationships between two variables, ranging from -1 to
      +1.
      $$
      r = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum (x_i - \bar{x})^2 \sum (y_i - \bar{y})^2}}
      $$
      where $\bar{x}$ and $\bar{y}$ are the means of the variables.
    </p>
    <p class="styled-noPoint" style="font-size: medium;">
      $$d = 1 - r$$
      where $r$ is the Pearson correlation coefficient and $d$ is the distance.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point2" style="font-size: large;">
      Example: given the following data points:
    <pre><code data-trim data-noescape>A = [5.2, 3.9, 2.1, 1.8, 0.7]
B = [4.8, 3.7, 1.8, 1.9, 0.6]</code></pre>
    <pre>
        <code data-trim data-noescape>A_mean = 2.94
B_mean = 2.56
Cov(A, B) = 1 / (N-1) * 
  [  
      (5.2 - 2.94) * (4.8 - 2.56) 
    + (3.9 - 2.94) * (3.7 - 2.56) 
    + (2.1 - 2.94) * (1.8 - 2.56) 
    + (1.8 - 2.94) * (1.9 - 2.56) 
    + (0.7 - 2.94) * (0.6 - 2.56)
  ]
Cov(A, B) / (std(A) * std(B)) = 0.99
>> d = 1 - 0.99 = 0.01</code></pre>
    </p>
  </div>
</div>
--- (id="correlation-based-similarity-measures")


## Correlation-based Similarity Measures
<div>
  <div class="leftBox">
    <p class="styled-point">Correlation coefficients quantify the similarity between variables by measuring
      linear relationships.</p>
    <p class="styled-point2" style="font-size: large;">
      <code>Spearman Correlation:</code> Ranks* data to assess monotonic relationships, useful for non-linear
      data.
      $$
      r_s = 1 - \frac{6 \sum d_i^2}{n(n^2 - 1)}
      $$
      where $d_i$ is the difference between ranks*.
    </p>
    <p class="styled-noPoint" style="font-size: large;">
      $$d = 1 - r_s$$
      where $r_s$ is the Spearman correlation coefficient and $d$ is the distance.
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point2">
      Example: given the following data points:
    <pre><code data-trim data-noescape>A = [5.2, 3.9, 2.1, 1.8, 0.7]
B = [4.8, 3.7, 1.8, 1.9, 0.6]</code></pre>
    <pre>
        <code data-trim data-noescape>A_rank = [5, 4, 3, 2, 1]
B_rank = [5, 4, 1, 2, 3]
d = [0, 0, 2, 0, 2]
r_s = 1 - 6 * 
  (0^2 + 0^2 + 2^2 + 0^2 + 2^2) / 
  (5 * (5^2 - 1))
r_s = 0.6
>> d = 1 - 0.6 = 0.4</code>
      </pre>
    </p>
  </div>
  <p class="small-text" style="font-size: medium;">*Ranks are the position of the data in a sorted list.</p>
</div>
--- (id="correlation-based-similarity-measures-2")

## Cosine Similarity as a Similarity Measure
<div>
  <div class="leftBox">
    <p class="styled-point">Cosine similarity measures the similarity between two vectors by comparing their
      direction, normalized by their magnitudes.</p>
    <p class="styled-point2" style="font-size: large;">
      <code>Cosine Similarity:</code> Defined as the dot product of two vectors divided by the product of their
      norms.
      $$
      \text{similarity} = \frac{\sum_{i=1}^{n} x_i \cdot y_i}{||X|| \cdot ||Y||}
      $$
      where $ ||X|| = \sqrt{\sum_{i=1}^{n} x_i^2} $ and $ ||Y|| = \sqrt{\sum_{i=1}^{n} y_i^2} $.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point2">
      Example: given the following vectors:
    <pre><code data-trim data-noescape>X = [2, 3, 4]
Y = [1, 0, 5]</code></pre>
    <pre id="distanceCalculation">
        <code data-trim data-noescape>dot_product = 2*1 + 3*0 + 4*5 = 22
||X|| = sqrt(2^2 + 3^2 + 4^2) = 5.39
||Y|| = sqrt(1^2 + 0^2 + 5^2) = 5.10
similarity = 22 / (5.39 * 5.10)
similarity ≈ 0.80</code></pre>
    </p>
  </div>
  <p class="small-text" style="font-size: medium;">The cosine similarity ranges from -1 to 1, with higher values
    indicating greater similarity in direction.</p>
</div>
--- (id="cosine-similarity-as-a-similarity-measure")


## Overview: Choosing the Right Similarity Measure
<div>
  <div class="leftBox">
    <p class="styled-point"><code>Minkowski Distance</code></p>
    <p class="styled-point2" style="font-size: medium">General distance metric for multivariate data.</p>
    <p class="styled-point2" style="font-size: medium">Adjustable: Manhattan (p=1), Euclidean (p=2).</p>
    <p class="styled-point2" style="font-size: medium">Works best with continuous numeric data.</p>
    <p class="styled-point"><code>Pearson Correlation</code></p>
    <p class="styled-point2" style="font-size: medium">Measures linear relationships.</p>
    <p class="styled-point2" style="font-size: medium">Good for continuous, normally distributed data.</p>
    <p class="styled-point2" style="font-size: medium">Sensitive to outliers.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point"><code>Spearman Correlation</code></p>
    <p class="styled-point2" style="font-size: medium">For monotonic (ranked) relationships.</p>
    <p class="styled-point2" style="font-size: medium">Works with ordinal or non-linear data.</p>
    <p class="styled-point2" style="font-size: medium">Less sensitive to outliers than Pearson.</p>
    <p class="styled-point"><code>Cosine Similarity</code></p>
    <p class="styled-point2" style="font-size: medium">Measures similarity in vector direction.</p>
    <p class="styled-point2" style="font-size: medium">Useful in high-dimensional data (e.g., text).</p>
    <p class="styled-point2" style="font-size: medium">Focuses on orientation, not magnitude.</p>
    <p class="styled-point4" style="font-size: medium">
      There is no one-size-fits-all similarity measure. Choose the one that best fits your data and research
      question.
    </p>
  </div>
</div>
--- (id="overview-choosing-the-right-similarity-measure")


## Hierarchical Cluster Analysis (HCA)
<div>
  <div class="leftBox">
    <p class="styled-point">HCA groups similar items into clusters based on their similarity or distance.</p>
    <p class="styled-point">The result is a dendrogram, a tree-like structure showing the nested clusters.</p>
    <p class="styled-point">Types of HCA:</p>
    <p class="styled-point2"><strong>Agglomerative (bottom-up):</strong> Starts with individual items and merges
      them into clusters.</p>
    <p class="styled-point2"><strong>Divisive (top-down):</strong> Starts with one cluster of all items and
      splits them into smaller clusters.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div class="tabs">
      <div class="tab active" data-tab="dendrogram_data0">Data</div>
      <div class="tab" data-tab="dendrogram_dendrogram0">Dendrogram</div>
    </div>
    <div class="tab-content active" data-tab="dendrogram_data0">
      <div id="dendrogram_intro">
        <pre style="font-size: large;">
          <code data-trim data-noescape>┌────────┬───────┬───────┬───────┬───────┬───────┐
│ Sample │ [Fe]  │ [Cu]  │ [Zn]  │ [Mn]  │ [Pb]  │
├────────┼───────┼───────┼───────┼───────┼───────┤
│    1   │  2.3  │  1.2  │  0.5  │  0.2  │  0.1  │
│    2   │  2.7  │  1.1  │  0.4  │  0.3  │  0.2  │
│    3   │  1.9  │  1.3  │  0.6  │  0.1  │  0.2  │
│    4   │  2.1  │  1.0  │  0.3  │  0.4  │  0.7  │
│    5   │  2.5  │  1.4  │  0.7  │  0.5  │  0.6  │
│    6   │  2.2  │  1.5  │  0.8  │  0.6  │  0.5  │
│    7   │  2.4  │  1.6  │  0.9  │  0.7  │  0.1  │
│    8   │  2.6  │  1.7  │  1.0  │  0.8  │  0.3  │
└────────┴───────┴───────┴───────┴───────┴───────┘</code></pre>
      </div>
    </div>
    <div class="tab-content" data-tab="dendrogram_dendrogram0">
      <div id="dendrogram_step0"></div>
    </div>
  </div>
</div>
--- (id="hierarchical-cluster-analysis-hca")


## Step 1: Calculating Pairwise Distances
<div>
  <div class="leftBox">
    <p class="styled-point">HCA starts by calculating distances or similarities between all pairs of items.</p>
    <p class="styled-point">The result is a distance matrix, showing how similar or different each pair of items
      is.</p>
    <p class="styled-point">Common distance measures include:</p>
    <p class="styled-point2"><strong>Euclidean distance</strong>: Measures straight-line distance.</p>
    <p class="styled-point2"><strong>Manhattan distance</strong>: Measures distance by summing absolute
      differences.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <!-- Distance Matrix -->
    <pre style="font-size: large">
      <code data-trim data-noescape style="overflow: hidden;">┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ #5  │ #6  │ #7  │ #8  │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ .68 │ .71 │ .76 │ .99 │
│ #2 │ .45 │ .   │ .87 │ .80 │ .65 │ .87 │ .87 │ .99 │
│ #3 │ .45 │ .87 │ .   │ .75 │ .84 │ .71 │ .89 │ 1.1 │
│ #4 │ .72 │ .80 │ .75 │ .   │ .71 │ .77 │ 1.1 │ 1.2 │
│ #5 │ .68 │ .65 │ .84 │ .71 │ .   │ .36 │ .62 │ .61 │
│ #6 │ .71 │ .87 │ .71 │ .77 │ .36 │ .   │ .48 │ .57 │
│ #7 │ .76 │ .87 │ .89 │ 1.1 │ .62 │ .48 │ .   │ .33 │
│ #8 │ .99 │ .99 │ 1.1 │ 1.2 │ .61 │ .57 │ .33 │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘</code></pre>
  </div>
</div>
--- (id="step-1-calculating-pairwise-distances")


## Step 2: Merging the Closest Items
<div>
  <div class="leftBox">
    <p class="styled-point">The two items with the smallest distance are merged to form a cluster.</p>
    <p class="styled-point">This cluster is represented as a node in the dendrogram, showing the first grouping
      of similar items.</p>
    <p class="styled-point">Each node’s height represents the distance at which items or clusters are joined.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div class="tabs">
      <div class="tab active" data-tab="dendrogram_data1">Data</div>
      <div class="tab" data-tab="dendrogram_dendrogram1">Dendrogram</div>
    </div>
    <div class="tab-content active" data-tab="dendrogram_data1">
      <pre style="font-size: large;">
┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ #5  │ #6  │ #7  │ #8  │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ .68 │ .71 │ .76 │ .99 │
│ #2 │ .45 │ .   │ .87 │ .80 │ .65 │ .87 │ .87 │ .99 │
│ #3 │ .45 │ .87 │ .   │ .75 │ .84 │ .71 │ .89 │ 1.1 │
│ #4 │ .72 │ .80 │ .75 │ .   │ .71 │ .77 │ 1.1 │ 1.2 │
│ #5 │ .68 │ .65 │ .84 │ .71 │ .   │ .36 │ .62 │ .61 │
│ #6 │ .71 │ .87 │ .71 │ .77 │ .36 │ .   │ .48 │ .57 │
│ #7 │ .76 │ .87 │ .89 │ 1.1 │ .62 │ .48 │ .   │ <span style="color: red; font-weight: bold;">.33</span> │
│ #8 │ .99 │ .99 │ 1.1 │ 1.2 │ .61 │ .57 │ <span style="color: red; font-weight: bold;">.33</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
      </pre>
    </div>
    <div class="tab-content" data-tab="dendrogram_dendrogram1">
      <div id="dendrogram_step1"></div>
    </div>
  </div>
</div>
--- (id="step-2-merging-the-closest-items")


## Step 3: Recomputing Distances and Continuing Merging
<div>
  <div class="leftBox">
    <p class="styled-point">After each merge, recalculate distances between the new cluster and other items or
      clusters.</p>
    <p class="styled-point">Different linkage methods can be used to update distances:</p>
    <p class="styled-point2"><strong>Single linkage:</strong> Uses the smallest distance between items in two
      clusters.</p>
    <p class="styled-point2"><strong>Complete linkage:</strong> Uses the largest distance between items in two
      clusters.</p>
    <p class="styled-point2"><strong>Average linkage:</strong> Uses the average distance between all items in
      two clusters.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <pre style="font-size: large; margin-top: -20px;">
┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ #5  │ #6  │ <span style="color: blue; font-weight: bold;">#7</span>  │ <span style="color: blue; font-weight: bold;">#8</span>  │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ .68 │ .71 │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.99</span> │
│ #2 │ .45 │ .   │ .87 │ .80 │ .65 │ .87 │ <span style="color: blue; font-weight: bold;">.87</span> │ <span style="color: blue; font-weight: bold;">.99</span> │
│ #3 │ .45 │ .87 │ .   │ .75 │ .84 │ .71 │ <span style="color: blue; font-weight: bold;">.89</span> │ <span style="color: blue; font-weight: bold;">1.1</span> │
│ #4 │ .72 │ .80 │ .75 │ .   │ .71 │ .77 │ <span style="color: blue; font-weight: bold;">1.1</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │
│ #5 │ .68 │ .65 │ .84 │ .71 │ .   │ .36 │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.61</span> │
│ #6 │ .71 │ .87 │ .71 │ .77 │ .36 │ .   │ <span style="color: blue; font-weight: bold;">.48</span> │ <span style="color: blue; font-weight: bold;">.57</span> │
│ <span style="color: blue; font-weight: bold;">#7</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.87</span> │ <span style="color: blue; font-weight: bold;">.89</span> │ <span style="color: blue; font-weight: bold;">1.1</span> │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.48</span> │ .   │ <span style="color: red; font-weight: bold;">.33</span> │
│ <span style="color: blue; font-weight: bold;">#8</span> │ <span style="color: blue; font-weight: bold;">.99</span> │ <span style="color: blue; font-weight: bold;">.99</span> │ <span style="color: blue; font-weight: bold;">1.1</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │ <span style="color: blue; font-weight: bold;">.61</span> │ <span style="color: blue; font-weight: bold;">.57</span> │ <span style="color: red; font-weight: bold;">.33</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
      </pre>
    <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ #5  │ #6  │ <span style="color: blue; font-weight: bold;">#78</span> │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ .68 │ .71 │ <span style="color: blue; font-weight: bold;">.88</span> │
│ #2 │ .45 │ .   │ .87 │ .80 │ .65 │ .87 │ <span style="color: blue; font-weight: bold;">.93</span> │
│ #3 │ .45 │ .87 │ .   │ .75 │ .84 │ .71 │ <span style="color: blue; font-weight: bold;">1.0</span> │
│ #4 │ .72 │ .80 │ .75 │ .   │ .71 │ .77 │ <span style="color: blue; font-weight: bold;">1.2</span> │
│ #5 │ .68 │ .65 │ .84 │ .71 │ .   │ .36 │ <span style="color: blue; font-weight: bold;">.62</span> │
│ #6 │ .71 │ .87 │ .71 │ .77 │ .36 │ .   │ <span style="color: blue; font-weight: bold;">.53</span> │
│<span style="color: blue; font-weight: bold;">#78</span> │ <span style="color: blue; font-weight: bold;">.88</span> │ <span style="color: blue; font-weight: bold;">.93</span> │ <span style="color: blue; font-weight: bold;">1.0</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.53</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
  </div>
</div>
--- (id="step-3-recomputing-distances-and-continuing-merging")

## Step 4: Building the Dendrogram
<div>
  <div class="leftBox">
    <p class="styled-point">The process continues until all items are merged into a single cluster.</p>
    <p class="styled-point">The dendrogram visually represents this nested grouping structure.</p>
    <p class="styled-point">The height of each node indicates the distance at which clusters are merged.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div class="tabs">
      <div class="tab active" data-tab="dendrogram_data2">1</div>
      <div class="tab" data-tab="dendrogram_data3">2</div>
      <div class="tab" data-tab="dendrogram_data4">3</div>
      <div class="tab" data-tab="dendrogram_data5">4</div>
      <div class="tab" data-tab="dendrogram_data6">5</div>
      <div class="tab" data-tab="dendrogram_data7">6</div>
    </div>
    <!-- Placeholder for full dendrogram -->
    <div class="tab-content active" data-tab="dendrogram_data2">
      <pre style="font-size: large; margin-top: -20px;">
┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ #5  │ #6  │ <span style="color: blue; font-weight: bold;">#7</span>  │ <span style="color: blue; font-weight: bold;">#8</span>  │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ .68 │ .71 │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.99</span> │
│ #2 │ .45 │ .   │ .87 │ .80 │ .65 │ .87 │ <span style="color: blue; font-weight: bold;">.87</span> │ <span style="color: blue; font-weight: bold;">.99</span> │
│ #3 │ .45 │ .87 │ .   │ .75 │ .84 │ .71 │ <span style="color: blue; font-weight: bold;">.89</span> │ <span style="color: blue; font-weight: bold;">1.1</span> │
│ #4 │ .72 │ .80 │ .75 │ .   │ .71 │ .77 │ <span style="color: blue; font-weight: bold;">1.1</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │
│ #5 │ .68 │ .65 │ .84 │ .71 │ .   │ .36 │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.61</span> │
│ #6 │ .71 │ .87 │ .71 │ .77 │ .36 │ .   │ <span style="color: blue; font-weight: bold;">.48</span> │ <span style="color: blue; font-weight: bold;">.57</span> │
│ <span style="color: blue; font-weight: bold;">#7</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.87</span> │ <span style="color: blue; font-weight: bold;">.89</span> │ <span style="color: blue; font-weight: bold;">1.1</span> │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.48</span> │ .   │ <span style="color: red; font-weight: bold;">.33</span> │
│ <span style="color: blue; font-weight: bold;">#8</span> │ <span style="color: blue; font-weight: bold;">.99</span> │ <span style="color: blue; font-weight: bold;">.99</span> │ <span style="color: blue; font-weight: bold;">1.1</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │ <span style="color: blue; font-weight: bold;">.61</span> │ <span style="color: blue; font-weight: bold;">.57</span> │ <span style="color: red; font-weight: bold;">.33</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
      <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ #5  │ #6  │ <span style="color: blue; font-weight: bold;">#78</span> │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ .68 │ .71 │ <span style="color: blue; font-weight: bold;">.88</span> │
│ #2 │ .45 │ .   │ .87 │ .80 │ .65 │ .87 │ <span style="color: blue; font-weight: bold;">.93</span> │
│ #3 │ .45 │ .87 │ .   │ .75 │ .84 │ .71 │ <span style="color: blue; font-weight: bold;">1.0</span> │
│ #4 │ .72 │ .80 │ .75 │ .   │ .71 │ .77 │ <span style="color: blue; font-weight: bold;">1.2</span> │
│ #5 │ .68 │ .65 │ .84 │ .71 │ .   │ .36 │ <span style="color: blue; font-weight: bold;">.62</span> │
│ #6 │ .71 │ .87 │ .71 │ .77 │ .36 │ .   │ <span style="color: blue; font-weight: bold;">.53</span> │
│<span style="color: blue; font-weight: bold;">#78</span> │ <span style="color: blue; font-weight: bold;">.88</span> │ <span style="color: blue; font-weight: bold;">.93</span> │ <span style="color: blue; font-weight: bold;">1.0</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.53</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
    </div>
    <div class="tab-content" data-tab="dendrogram_data3">
      <pre style="font-size: large; margin-top: -20px;">
┌────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ <span style="color: blue; font-weight: bold;">#5</span>  │ <span style="color: blue; font-weight: bold;">#6</span>  │ #78 │
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ <span style="color: blue; font-weight: bold;">.68</span> │ <span style="color: blue; font-weight: bold;">.71</span> │ .88 │
│ #2 │ .45 │ .   │ .87 │ .80 │ <span style="color: blue; font-weight: bold;">.65</span> │ <span style="color: blue; font-weight: bold;">.87</span> │ .93 │
│ #3 │ .45 │ .87 │ .   │ .75 │ <span style="color: blue; font-weight: bold;">.84</span> │ <span style="color: blue; font-weight: bold;">.71</span> │ 1.0 │
│ #4 │ .72 │ .80 │ .75 │ .   │ <span style="color: blue; font-weight: bold;">.71</span> │ <span style="color: blue; font-weight: bold;">.77</span> │ 1.2 │
│ <span style="color: blue; font-weight: bold;">#5</span> │ <span style="color: blue; font-weight: bold;">.68</span> │ <span style="color: blue; font-weight: bold;">.65</span> │ <span style="color: blue; font-weight: bold;">.84</span> │ <span style="color: blue; font-weight: bold;">.71</span> │ .   │ <span style="color: red; font-weight: bold;">.36</span> │ <span style="color: blue; font-weight: bold;">.62</span> │
│ <span style="color: blue; font-weight: bold;">#6</span> │ <span style="color: blue; font-weight: bold;">.71</span> │ <span style="color: blue; font-weight: bold;">.87</span> │ <span style="color: blue; font-weight: bold;">.71</span> │ <span style="color: blue; font-weight: bold;">.77</span> │ <span style="color: red; font-weight: bold;">.36</span> │ .   │ <span style="color: blue; font-weight: bold;">.53</span> │
│#78 │ .88 │ .93 │ 1.0 │ 1.2 │ <span style="color: blue; font-weight: bold;">.62</span> │ <span style="color: blue; font-weight: bold;">.53</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
      <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl│ #1  │ #2  │ #3  │ #4  │ <span style="color: blue; font-weight: bold;">#56</span> │ #78 │
├────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ #1 │ .   │ .45 │ .45 │ .72 │ <span style="color: blue; font-weight: bold;">.70</span> │ .88 │
│ #2 │ .45 │ .   │ .87 │ .80 │ <span style="color: blue; font-weight: bold;">.76</span> │ .93 │
│ #3 │ .45 │ .87 │ .   │ .75 │ <span style="color: blue; font-weight: bold;">.78</span> │ 1.0 │
│ #4 │ .72 │ .80 │ .75 │ .   │ <span style="color: blue; font-weight: bold;">.74</span> │ 1.2 │
│<span style="color: blue; font-weight: bold;">#56</span> │ <span style="color: blue; font-weight: bold;">.70</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.78</span> │ <span style="color: blue; font-weight: bold;">.74</span> │ .   │ <span style="color: blue; font-weight: bold;">.58</span> │
│#78 │ .88 │ .93 │ 1.0 │ 1.2 │ <span style="color: blue; font-weight: bold;">.58</span> │ .   │
└────┴─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
    </div>
    <div class="tab-content" data-tab="dendrogram_data4">
      <pre style="font-size: large; margin-top: -20px;">
┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl │ <span style="color: blue; font-weight: bold;">#1</span>  │ <span style="color: blue; font-weight: bold;">#2</span>  │ #3  │ #4  │ #56 │ #78 │
├─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ <span style="color: blue; font-weight: bold;">#1</span>  │ .   │ <span style="color: red; font-weight: bold;">.45</span> │ <span style="color: blue; font-weight: bold;">.45</span> │ <span style="color: blue; font-weight: bold;">.72</span> │ <span style="color: blue; font-weight: bold;">.70</span> │ <span style="color: blue; font-weight: bold;">.88</span> │
│ <span style="color: blue; font-weight: bold;">#2</span>  │ <span style="color: red; font-weight: bold;">.45</span> │ .   │ <span style="color: blue; font-weight: bold;">.87</span> │ <span style="color: blue; font-weight: bold;">.80</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.93</span> │
│ #3  │ <span style="color: blue; font-weight: bold;">.45</span> │ <span style="color: blue; font-weight: bold;">.87</span> │ .   │ .75 │ .78 │ 1.0 │
│ #4  │ <span style="color: blue; font-weight: bold;">.72</span> │ <span style="color: blue; font-weight: bold;">.80</span> │ .75 │ .   │ .74 │ 1.2 │
│ #56 │ <span style="color: blue; font-weight: bold;">.70</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ .78 │ .74 │ .   │ .58 │
│ #78 │ <span style="color: blue; font-weight: bold;">.88</span> │ <span style="color: blue; font-weight: bold;">.93</span> │ 1.0 │ 1.2 │ .58 │ .   │
└─────┴─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
      <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl │ <span style="color: blue; font-weight: bold;">#12</span> │ #3  │ #4  │ #56 │ #78 │
├─────┼─────┼─────┼─────┼─────┼─────┤
│ <span style="color: blue; font-weight: bold;">#12</span> │ .   │ <span style="color: blue; font-weight: bold;">.66</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.73</span> │ <span style="color: blue; font-weight: bold;">.91</span> │
│ #3  │ <span style="color: blue; font-weight: bold;">.66</span> │ .   │ .75 │ .78 │ 1.0 │
│ #4  │ <span style="color: blue; font-weight: bold;">.76</span> │ .75 │ .   │ .74 │ 1.2 │
│ #56 │ <span style="color: blue; font-weight: bold;">.73</span> │ .78 │ .74 │ .   │ .58 │
│ #78 │ <span style="color: blue; font-weight: bold;">.91</span> │ 1.0 │ 1.2 │ .58 │ .   │
└─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
    </div>
    <div class="tab-content" data-tab="dendrogram_data5">
      <pre style="font-size: large; margin-top: -20px;">
┌─────┬─────┬─────┬─────┬─────┬─────┐
│Smpl │ #12 │ #3  │ #4  │ <span style="color: blue; font-weight: bold;">#56</span> │ <span style="color: blue; font-weight: bold;">#78</span> │
├─────┼─────┼─────┼─────┼─────┼─────┤
│ #12 │ .   │ .66 │ .76 │ <span style="color: blue; font-weight: bold;">.73</span> │ <span style="color: blue; font-weight: bold;">.91</span> │
│ #3  │ .66 │ .   │ .75 │ <span style="color: blue; font-weight: bold;">.78</span> │ <span style="color: blue; font-weight: bold;">1.0</span> │
│ #4  │ .76 │ .75 │ .   │ <span style="color: blue; font-weight: bold;">.74</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │
│ <span style="color: blue; font-weight: bold;">#56</span> │ <span style="color: blue; font-weight: bold;">.73</span> │ <span style="color: blue; font-weight: bold;">.78</span> │ <span style="color: blue; font-weight: bold;">.74</span> │ .   │ <span style="color: red; font-weight: bold;">.58</span> │
│ <span style="color: blue; font-weight: bold;">#78</span> │ <span style="color: blue; font-weight: bold;">.91</span> │ <span style="color: blue; font-weight: bold;">1.0</span> │ <span style="color: blue; font-weight: bold;">1.2</span> │ <span style="color: red; font-weight: bold;">.58</span> │ .   │
└─────┴─────┴─────┴─────┴─────┴─────┘
</pre>
      <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌───────┬─────┬─────┬─────┬───────┐
│ Smpl  │ #12 │ #3  │ #4  │ <span style="color: blue; font-weight: bold;">#5678</span> │
├───────┼─────┼─────┼─────┼───────┤
│ #12   │ .   │ .66 │ .76 │ <span style="color: blue; font-weight: bold;">.82</span>   │
│ #3    │ .66 │ .   │ .75 │ <span style="color: blue; font-weight: bold;">.89</span>   │
│ #4    │ .76 │ .75 │ .   │ <span style="color: blue; font-weight: bold;">.97</span>   │
│ <span style="color: blue; font-weight: bold;">#5678</span> │ <span style="color: blue; font-weight: bold;">.82</span> │ <span style="color: blue; font-weight: bold;">.89</span> │ <span style="color: blue; font-weight: bold;">.97</span> │ .     │
└───────┴─────┴─────┴─────┴───────┘
</pre>
    </div>
    <div class="tab-content" data-tab="dendrogram_data6">
      <pre style="font-size: large; margin-top: -20px;">
┌───────┬─────┬─────┬─────┬───────┐
│ Smpl  │ <span style="color: blue; font-weight: bold;">#12</span> │ <span style="color: blue; font-weight: bold;">#3</span>  │ #4  │ #5678 │
├───────┼─────┼─────┼─────┼───────┤
│ <span style="color: blue; font-weight: bold;">#12</span>   │ .   │ <span style="color: red; font-weight: bold;">.66</span> │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.82</span>   │
│ <span style="color: blue; font-weight: bold;">#3</span>    │ <span style="color: red; font-weight: bold;">.66</span> │ .   │ <span style="color: blue; font-weight: bold;">.75</span> │ <span style="color: blue; font-weight: bold;">.89</span>   │
│ #4    │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.75</span> │ .   │ .97   │
│ #5678 │ <span style="color: blue; font-weight: bold;">.82</span> │ <span style="color: blue; font-weight: bold;">.89</span> │ .97 │ .     │
└───────┴─────┴─────┴─────┴───────┘
</pre>
      <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌───────┬─────┬─────┬──────┐
│ Smpl  │ <span style="color: blue; font-weight: bold;">#123</span>│ #4  │ #5678│
├───────┼─────┼─────┼──────┤
│ <span style="color: blue; font-weight: bold;">#123</span>  │ .   │ <span style="color: blue; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.86</span>  │
│ #4    │ <span style="color: blue; font-weight: bold;">.76</span> │ .   │ .97  │
│ #5678 │ <span style="color: blue; font-weight: bold;">.86</span> │ .97 │ .    │
└───────┴─────┴─────┴──────┘
</pre>
    </div>
    <div class="tab-content" data-tab="dendrogram_data7">
      <pre style="font-size: large; margin-top: -20px;">
┌───────┬─────┬─────┬──────┐
│ Smpl  │ <span style="color: blue; font-weight: bold;">#123</span>│ <span style="color: blue; font-weight: bold;">#4</span>  │ #5678│
├───────┼─────┼─────┼──────┤
│ <span style="color: blue; font-weight: bold;">#123</span>  │ .   │ <span style="color: red; font-weight: bold;">.76</span> │ <span style="color: blue; font-weight: bold;">.86</span>  │
│ <span style="color: blue; font-weight: bold;">#4</span>    │ <span style="color: red; font-weight: bold;">.76</span> │ .   │ <span style="color: blue; font-weight: bold;">.97</span>  │
│ #5678 │ <span style="color: blue; font-weight: bold;">.86</span> │ <span style="color: blue; font-weight: bold;">.97</span> │ .    │
└───────┴─────┴─────┴──────┘
</pre>
      <pre style="font-size: large; margin-top: -20px;">
average linkage:
┌───────┬───────┬───────┐
│ Smpl  │ <span style="color: blue; font-weight: bold;">#1234</span> │ #5678 │
├───────┼───────┼───────┤
│ <span style="color: blue; font-weight: bold;">#1234</span> │ .     │ <span style="color: blue; font-weight: bold;">.92</span>   │
│ #5678 │ <span style="color: blue; font-weight: bold;">.92</span>   │ .     │
└───────┴───────┴───────┘
</pre>
    </div>
  </div>
</div>
--- (id="step-3-recomputing-distances-and-continuing-merging")


## Step 4: Building the Dendrogram
<div>
  <div class="leftBox">
    <p class="styled-point">The process continues until all items are merged into a single cluster.</p>
    <p class="styled-point">The dendrogram visually represents this nested grouping structure.</p>
    <p class="styled-point">The height of each node indicates the distance at which clusters are merged.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div class="tabs">
      <div class="tab active" data-tab="dendrogram_data8">1</div>
      <div class="tab" data-tab="dendrogram_data9">2</div>
      <div class="tab" data-tab="dendrogram_data10">3</div>
      <div class="tab" data-tab="dendrogram_data11">4</div>
      <div class="tab" data-tab="dendrogram_data12">5</div>
    </div>
    <div class="tab-content active" data-tab="dendrogram_data8">
      <div id="dendrogram_data8"></div>
    </div>
    <div class="tab-content" data-tab="dendrogram_data9">
      <div id="dendrogram_data9"></div>
    </div>
    <div class="tab-content" data-tab="dendrogram_data10">
      <div id="dendrogram_data10"></div>
    </div>
    <div class="tab-content" data-tab="dendrogram_data11">
      <div id="dendrogram_data11"></div>
    </div>
    <div class="tab-content" data-tab="dendrogram_data12">
      <div id="dendrogram_data12"></div>
    </div>
  </div>
</div>
--- (id="step-4-building-the-dendrogram")


## Reading a Dendrogram
<div>
  <div class="leftBox">
    <p class="styled-point">A dendrogram helps identify clusters and understand the relationship between items:
    </p>
    <p class="styled-point2">Each leaf represents an individual item in the dataset.</p>
    <p class="styled-point2">Clusters are formed by cutting the dendrogram at a certain height.</p>
    <p class="styled-point2">The height of each node indicates the distance or similarity level at which
      clusters are joined.</p>
    <p class="styled-point">To identify clusters, look for branches that join at lower heights for more similar
      items.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div id="dendrogram_interpreted"></div>
  </div>
</div>
--- (id="reading-a-dendrogram")


## Advantages and Limitations of HCA
<div>
  <div class="leftBox">
    <p class="styled-point"><code>Advantages</code></p>
    <p class="styled-point2">
      Does not require a predefined number of clusters; HCA provides a complete hierarchy.
    </p>
    <p class="styled-point2">
      Generates a <code>dendrogram</code> that visually represents cluster relationships at multiple levels.
    </p>
    <p class="styled-point2">
      Effective for small to medium datasets, especially when clusters are well-separated.
    </p>
    <p class="styled-point2">
      Ideal for discovering nested or hierarchical data structures, useful in fields like taxonomy and genomics.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point"><code>Limitations</code></p>
    <p class="styled-point2">
      Computationally demanding, especially for large datasets (complexity of $O(n^2)$).
    </p>
    <p class="styled-point2">
      Sensitive to noise and outliers; even small variations can affect cluster results.
    </p>
    <p class="styled-point2">
      Does not allow reassignment of points after merging, which can lead to misclassification.
    </p>
    <p class="styled-point2">
      Challenging with high-dimensional data, as distance-based calculations may become less reliable.
    </p>
  </div>
</div>
--- (id="advantages-and-limitations-of-hca")



## Introduction to k-means Clustering
<div>
  <div class="leftBox">
    <p class="styled-point">k-means is a popular clustering algorithm for partitioning data into $ k $
      clusters.</p>
    <p class="styled-point">The algorithm aims to minimize within-cluster variance, making clusters as compact
      as possible.</p>
    <p class="styled-point">Each cluster is defined by its centroid, which is the mean of all points within that
      cluster.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <!-- Placeholder for initial dataset plot with no clusters -->
    <div id="kmeans_intro"></div>
  </div>
</div>
--- (id="introduction-to-k-means-clustering")


## Step 1: Choosing the Number of Clusters (k)
<div>
  <div class="leftBox">
    <p class="styled-point">
      The number of clusters $ k $ must be chosen before running k-means.
    </p>
    <p class="styled-point">
      Selecting $ k $ can be challenging, as it affects the algorithm’s results
      significantly.
    </p>
    <p class="styled-point">
      A common approach is to start with <code>k=2</code> and increase until the clustering quality stabilizes.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <!-- Placeholder for elbow method plot or silhouette score example -->
    <div id="choose_k"></div>
  </div>
</div>
--- (id="step-1-choosing-the-number-of-clusters-k")


## Step 2: Initializing Cluster Centroids
<div>
  <div class="leftBox">
    <p class="styled-point">k-means starts by randomly selecting $ k $ initial centroids in the data space.
    </p>
    <p class="styled-point">These centroids act as the starting points for forming clusters.</p>
    <p class="styled-point">The choice of initial centroids can affect the final clustering results, so multiple
      initializations may be tested.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <!-- Placeholder for plot showing initial centroids on data -->
    <div id="initial_centroids"></div>
  </div>
</div>
--- (id="step-2-initializing-cluster-centroids")


## Step 3: Assigning Points to Nearest Centroids
<div>
  <div class="leftBox">
    <p class="styled-point">Each data point is assigned to the nearest centroid, forming initial clusters.</p>
    <p class="styled-point">This assignment is based on minimizing the distance between points and centroids
      (usually Euclidean distance).</p>
    <p class="styled-point">Points closest to a centroid belong to that centroid’s cluster.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <!-- Placeholder for plot showing points assigned to initial centroids -->
    <div id="initial_assignment"></div>
  </div>
</div>
--- (id="step-3-assigning-points-to-nearest-centroids")


## Step 4: Updating Centroids
<div>
  <div class="leftBox">
    <p class="styled-point">Once points are assigned, the centroids are recalculated as the mean of all points
      in each cluster.</p>
    <p class="styled-point">This step shifts each centroid to a new position, centered within its assigned
      points.</p>
    <p class="styled-point">After updating, points are reassigned to the nearest centroid, and the process
      repeats.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div tabs>
      <div class="tab active " data-tab="centroid_data1">current assignment</div>
      <div class="tab" data-tab="centroid_data2">updated assignment</div>
    </div>
    <!-- Placeholder for plot showing updated centroids -->
    <div class="tab-content active" data-tab="centroid_data1">
      <div id="centroid_current"></div>
    </div>
    <div class="tab-content" data-tab="centroid_data2">
      <div id="centroid_update"></div>
    </div>
  </div>
</div>
--- (id="step-4-updating-centroids")


## Step 5: Iterating Until Convergence
<div>
  <div class="leftBox">
    <p class="styled-point">k-means alternates between assigning points and updating centroids until
      convergence.</p>
    <p class="styled-point">Convergence is reached when centroid positions stop changing significantly.</p>
    <p class="styled-point">The final clusters minimize within-cluster variance.</p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <label for="kSlider" style="font-size: large;">no. clusters $ k $: <span id="kValue">1</span></label>
    <input type="range" id="kSlider" min="1" max="6" step="1" value="1">
    <!-- Placeholder for plot showing final clusters -->
    <div id="final_clusters"></div>
  </div>
</div>
--- (id="step-5-iterating-until-convergence")


## Evaluating the Clustering Results
<div>
  <div class="leftBox">
    <p class="styled-point">To assess clustering quality, metrics such as the following are commonly used:</p>
    <p class="styled-point2"><strong>Inertia (within-cluster variance):</strong> Measures compactness within
      clusters; lower is better.</p>
    <p class="styled-point2"><strong>Silhouette Score:</strong> Measures cohesion and separation; ranges from -1
      to 1.</p>
    <p class="styled-point2"><strong>ANOVA:</strong> Evaluates the separation between clusters by comparing
      between-cluster and within-cluster variance.</p>
    <img src="../resources/figures/04_dataAnalysisTools/kmeans.png" alt="k-means evaluation metrics"        style="width: 30%; box-shadow: 5px 5px 15px rgba(0, 255, 38, 0.3); background-color: #f0f0f0; padding: 10px; border-radius: 5px;" data-preview-image>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div tabs>
      <div class="tab active" data-tab="evaluation_data1">inertia</div>
      <div class="tab" data-tab="evaluation_data2">silhouette score</div>
      <div class="tab" data-tab="evaluation_data3">ANOVA</div>
    </div>
    <div class="tab-content active" data-tab="evaluation_data1">
      <p class="styled-noPoint">
      $$
        \text{Inertia} = \sum_{i=1}^{k} \sum_{x \in C_i} \| x - \mu_i \|^2
        $$</p>
      <p class="styled-noPoint">where $ x $ represents a data point in cluster $ C_i $,  and $ \mu_i $ is
        the centroid of cluster $ C_i $.</p>
    </div>
    <div class="tab-content" data-tab="evaluation_data2">
      <p class="styled-noPoint">
      $$
        \text{Silhouette Score} = \frac{b - a}{\max(a, b)}
        $$</p>
      <p class="styled-noPoint">where $ a $ is the mean intra-cluster distance for each sample, and $ b $ is
        the mean nearest-cluster distance for each sample.</p>
    </div>
    <div class="tab-content" data-tab="evaluation_data3">
      <p class="styled-noPoint">
      $$
        F = \frac{\text{Between-Cluster Variance}}{\text{Within-Cluster Variance}}
        $$</p>
      <p class="styled-noPoint">Used in ANOVA to assess the ratio of variance between clusters to the variance
        within clusters.</p>
    </div>
  </div>
</div>
--- (id="evaluating-the-clustering-results")


## Advantages and Limitations of K-Means
<div>
  <div class="leftBox">
    <p class="styled-point"><code>Advantages</code></p>
    <p class="styled-point2">
      Simple and efficient for large datasets with low computational complexity, especially when clusters are
      well-separated.
    </p>
    <p class="styled-point2">
      Can be easily adapted for different use cases, such as image compression and document clustering.
    </p>
    <p class="styled-point2">
      Works well with spherical-shaped clusters where data points are evenly distributed around a centroid.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point"><code>Limitations</code></p>
    <p class="styled-point2">
      Requires the number of clusters, <code>k</code>, to be specified in advance, which can be challenging to
      determine.
    </p>
    <p class="styled-point2">
      Sensitive to initial centroid placement, potentially leading to different clustering results in each run.
    </p>
    <p class="styled-point2">
      Not suitable for non-spherical clusters or clusters with varying sizes and densities.
    </p>
    <p class="styled-point2">
      Struggles with outliers, which can significantly impact the cluster centroids and overall result.
    </p>
  </div>
</div>
--- (id="advantages-and-limitations-of-k-means")


## What is Principal Component Analysis (PCA)?
<div>
  <div class="leftBox">
    <p class="styled-point">
      <code>Principal Component Analysis (PCA)</code> is a <code>dimensionality reduction</code> technique often
      used in data science
      and machine learning to simplify datasets by reducing the number of variables while preserving essential
      information.
    </p>
    <p class="styled-point2">
      PCA works by identifying directions (<code>principal components</code>) along which the data varies the
      most.
    </p>
    <p class="styled-point2">
      Applications include <code>data visualization</code>, <code>noise reduction</code>, and
      <code>feature extraction</code> for machine learning.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <img src="../resources/figures/04_dataAnalysisTools/pca-3.png" alt="PCA example"
      style="width: 100%; box-shadow: 5px 5px 15px rgba(0, 255, 38, 0.3); background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
    <p class="small-text" style="font-size: large;">src: <a
        href="https://abego.cn/autopca/reference/pca.html">https://abego.cn/autopca/reference/pca.html</a></p>
  </div>
</div>
--- (id="what-is-principal-component-analysis-pca")

## Dimensionality Reduction through Axis Transformation
<img src="../resources/figures/04_dataAnalysisTools/pca_princ.png" alt="PCA axis transformation"
  style="width: 100%; box-shadow: 5px 5px 15px rgba(0, 255, 38, 0.3);; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
--- (id="dimensionality-reduction-through-axis-transformation")

## Coordinate Axes as a Matrix
<div>
  <div class="leftBox">
    <p class="styled-point">
      The <code>coordinate axes</code> of a space can be represented as a matrix. In its simplest form, this is
      the <code>identity matrix</code>, where all axes are perpendicular.
    </p>
    <p class="styled-point2">
      The <code>identity matrix</code> (or unity matrix) has values of 1 along its diagonal and 0 elsewhere,
      representing standard perpendicular axes.
    </p>
    <p class="styled-point2">
      By modifying the <code>angles</code> between the axes, we can adjust this matrix to define
      <code>new coordinate systems</code>.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <pre style="font-size: large;">
            <code data-trim data-noescape>Identity Matrix:
┌     ┐
│ 1 0 │
│ 0 1 │
└     ┘</code></pre>
    <p class="styled-point2">
      Example: Adjusting the identity matrix by changing angles between axes allows transformations to define
      new directions or rotations in data.
    </p>
    <pre style="font-size: large;">
          <code data-trim data-noescape>Identity Matrix:
┌     ┐          ┌     ┐  
│ 1 0 │  Strech  │ 2 0 │  
│ 0 1 │  along   │ 0 1 │  
└     ┘  x-axis  └     ┘  
coordinates:  (5, 3)    ->  s (10, 3)</code></pre>
    <p class="styled-point4" style="font-size: medium;">
      Remember: Matrix x Vector means row-wise multiplication of the matrix with the vector. E.g.
      <code>2 * 5 + 0 * 3</code> and <code>0 * 5 + 1 * 3</code> in the example above.
    </p>
  </div>
</div>
--- (id="coordinate-axes-as-a-matrix")


## Dimensionality Reduction through Axis Transformation
<div>
  <div class="leftBox">
    <p class="styled-point">
      PCA reduces dimensions by transforming <code>coordinate axes</code>. It finds new axes,
      <code>principal components</code>, where data varies most.
    </p>
    <p class="styled-point2">
      This is a mathematical <code>axis transformation</code>, projecting original data onto principal component
      axes.
    </p>
    <p class="styled-point2">
      <code>Example</code>: With two features, <code>x1</code> and <code>x2</code>, PCA rotates the axes to find
      <code>PC1</code> (highest variance), possibly discarding <code>PC2</code> for dimensional reduction.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <div class="tabs">
      <div class="tab active" data-tab="pca_data1">Raw Data</div>
      <div class="tab" data-tab="pca_data2">Axis Transformation</div>
      <div class="tab" data-tab="pca_data3">Bar Plots</div>
    </div>
    <div class="tab-content active" data-tab="pca_data1">
      <div id="pca_intro1"></div>
    </div>
    <div class="tab-content" data-tab="pca_data2">
      <input type="range" id="phiSlider" min="0" max="360" step="1" value="1">
      <label for="phiSlider" style="font-size: large;">angle of coordinate system: <span
          id="phiValue">0</span></label><br>
      <input type="range" id="rhoSlider" min="0" max="180" step="1" value="1">
      <label for="rhoSlider" style="font-size: large;">angle between axes: <span id="rhoValue">90</span></label>
      <div id="pca_intro2"></div>
    </div>
    <div class="tab-content" data-tab="pca_data3">
      <input type="range" id="phiSlider2" min="0" max="360" step="1" value="1">
      <label for="phiSlider2" style="font-size: large;">angle of coordinate system: <span
          id="phiValue2">0</span></label><br>
      <input type="range" id="rhoSlider2" min="0" max="180" step="1" value="1">
      <label for="rhoSlider2" style="font-size: large;">angle between axes: <span
          id="rhoValue2">90</span></label>
      <div id="pca_intro3"></div>
      <div id="pca_intro4"></div>
    </div>
  </div>
</div>
--- (id="dimensionality-reduction-through-axis-transformation-2")


## Covariance Matrix and Data Variance
<div>
  <div class="leftBox">
    <p class="styled-point">
      The <code>covariance matrix</code> reveals directions in the data with maximum variation, guiding PCA to
      choose the best transformation.
    </p>
    <p class="styled-point2">
      Each matrix element represents <code>covariance</code> between two features. Diagonal elements show
      variance within each feature, while off-diagonal elements show relationships between features.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point2">
      <code>Formula</code> for covariance between features $ x $ and $ y $:
      $$
      \text{cov}(x, y) = \frac{1}{n - 1} \sum_{i=1}^{n} (x_i - \bar{x})(y_i - \bar{y})
      $$
    </p>
    <p class="styled-point2" style="font-size: large;">
      Example of a 4x4 covariance matrix $ \Sigma $:
      $$
      \begin{bmatrix}
      \text{var}(x_1) & \text{cov}(x_1, x_2) & \text{cov}(x_1, x_3) & \text{cov}(x_1, x_4) \\
      \text{cov}(x_2, x_1) & \text{var}(x_2) & \text{cov}(x_2, x_3) & \text{cov}(x_2, x_4) \\
      \text{cov}(x_3, x_1) & \text{cov}(x_3, x_2) & \text{var}(x_3) & \text{cov}(x_3, x_4) \\
      \text{cov}(x_4, x_1) & \text{cov}(x_4, x_2) & \text{cov}(x_4, x_3) & \text{var}(x_4)
      \end{bmatrix}
      $$
    </p>
  </div>
</div>
--- (id="covariance-matrix-and-data-variance")


## Foundation of PCA Transformation: Eigenvectors and Eigenvalues
<div>
  <div class="leftBox">
    <p class="styled-point">
      The <code>covariance matrix</code> shows how dimensions of the data correlate and spread. Each value
      describes the joint variance between two dimensions.
    </p>
    <p class="styled-point2">
      The <code>eigenvectors</code> of the covariance matrix represent directions of the greatest variance in
      the data. These define the new axes, known as <code>principal components</code>.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">
      By projecting data onto the <code>eigenvectors</code>, we highlight the
      <code>primary directions of variation</code>, reducing correlation between dimensions.
    </p>
    <p class="styled-point2">
      Retaining the largest <code>eigenvalues</code> reduces dimensionality, focusing on the primary sources of
      information in the data.
    </p>
    <img src="../resources/pca_spread.png" alt="PCA eigenvectors"
      style="width: 70%; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3); display: block; margin: 0 auto;">
  </div>
</div>
--- (id="foundation-of-pca-transformation-eigenvectors-and-eigenvalues")


## Example: Covariance Matrix of a 4-Dimensional Dataset
<div>
  <div class="leftBox">
    <p class="styled-point">
      Suppose we have a dataset with four features: <code>x1</code>, <code>x2</code>, <code>x3</code>, and
      <code>x4</code>.
      The <code>covariance matrix</code> reveals relationships between these features:
    </p>
    <pre style="font-size: large;">
      <code data-trim data-noescape>      ┌                    ┐
      │ 2.5  0.8  0.6  1.2 │
Cov = │ 0.8  1.9  0.4  0.9 │
      │ 0.6  0.4  2.3  1.1 │
      │ 1.2  0.9  1.1  3.2 │
      └                    ┘</code></pre>
    <p class="styled-point2">
      Diagonal elements (e.g., <code>2.5</code> for <code>x1</code>) show variance for each feature.
      Off-diagonal values indicate <code>covariance</code> between features (e.g., <code>0.8</code> between
      <code>x1</code> and <code>x2</code>).
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">
      Features with high covariance are more similar. For example, <code>x3</code> and <code>x4</code> have
      covariance <code>1.1</code>, suggesting they vary similarly.
    </p>
    <p class="styled-point2">
      Low covariance between features like <code>x1</code> and <code>x3</code> means PCA will place less weight
      on
      this direction, focusing on features with higher covariance to capture more variance.
    </p>
    <p class="styled-point2">
      The eigenvectors of this matrix, aligned with principal components, will orient along directions with the
      highest variance, maximizing data spread along these axes.
    </p>
  </div>
</div>
--- (id="example-covariance-matrix-of-a-4-dimensional-dataset")


## Understanding Eigenvectors
<div>
  <div class="leftBox">
    <p class="styled-point">
      An <code>eigenvector</code> of a matrix is a special vector that, when multiplied by the matrix,
      changes only in scale, not direction.
    </p>
    <p class="styled-point2">
      For a matrix <code>A</code> and an eigenvector <code>v</code>, we have:
      $$ A \cdot v = \lambda \cdot v $$
      where <code>λ</code> is the <code>eigenvalue</code> that scales <code>v</code>.
    </p>
    <p class="styled-point2">
      In PCA, eigenvectors of the <code>covariance matrix</code> give directions for the principal components,
      with the eigenvalues showing their importance (variance captured).
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">
      <code>Example:</code> For a 4D dataset, the eigenvectors might show directions of maximum spread,
      while eigenvalues indicate the strength of each direction.
    </p>
    <p class="styled-point">Example 2: <span style="color: blue;">original vec</span> & <span
        style="color: red;">transformed vec</span></p>
    <div style="display: inline-block;">
      <div style="display: inline-block;">
        <pre style="font-size: large;">
        <code data-trim data-noescape>    ┌      ┐
    │ 3  2 │
A = │ 1  5 │
    └      ┘</code></pre>
      </div>
      <div style="display: inline-block;">
        <label for="v1" style="font-size: large;">v<sub>1</sub>:</label>
        <input type="range" id="v1" min="-6" max="6" step="0.1" value="0">
        <span id="v1Label" style="font-size: large;">1</span><br>
        <label for="v2" style="font-size: large;">v<sub>2</sub>:</label>
        <input type="range" id="v2" min="-6" max="6" step="0.1" value="2">
        <span id="v2Label" style="font-size: large;">1</span>
      </div>
    </div>
    <div id="eigenvector_plot"></div>
  </div>
</div>
--- (id="understanding-eigenvectors")


## Covariance Matrix and Its Eigenvectors & Eigenvalues
<div>
  <div class="leftBox">
    <p class="styled-point">The covariance matrix of the data:</p>
    <pre style="font-size: large;">
            <code data-trim data-noescape>      ┌                    ┐
      │ 2.5  0.8  0.6  1.2 │
Cov = │ 0.8  1.9  0.4  0.9 │
      │ 0.6  0.4  2.3  1.1 │
      │ 1.2  0.9  1.1  3.2 │
      └                    ┘</code></pre>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">Eigenvector matrix and corresponding eigenvalues:</p>
    <pre style="font-size: large;">
            <code data-trim data-noescape>    ┌                               ┐
    │  1.617  -0.777  -3.007  0.731 │
V = │ -3.288   0.115  -2.068  0.522 │
    │ -0.776  -0.819   3.786  0.601 │
    │    1       1       1      1   │
    └                               ┘
λ_1 ≈ 1.3, λ_2 ≈ 1.5, λ_3 ≈ 1.9, λ_4 ≈ 5.2</code></pre>
    <p class="styled-point2">
      Each <code>eigenvalue</code> λ indicates the variance captured along the direction of its
      <code>eigenvector</code>.
    </p>
    <p class="styled-point2">
      The <code>eigenvectors</code> v_4 and v_3 with the highest <code>eigenvalues</code> capture the most
      variance and are the first and second principal components.
    </p>
  </div>
</div>
--- (id="covariance-matrix-and-its-eigenvectors-eigenvalues")


## Interpreting the Role of Eigenvectors and Eigenvalues in PCA
<div>
  <div class="leftBox">
    <p class="styled-point">
      <code>Eigenvectors</code> represent the <code>new axes</code> in PCA, also known as
      <code>principal components</code>.
    </p>
    <p class="styled-point2">
      The individual values within an eigenvector describe how much each <code>original feature</code>
      contributes to the principal component.
    </p>
    <p class="styled-point2">
      A larger value indicates that a specific feature plays a more significant role in this component.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">
      <code>Eigenvalues</code> reflect the amount of <code>variance</code> captured by each principal component.
    </p>
    <p class="styled-point2">
      The sum of all eigenvalues represents the <code>total variance</code> in the data.
    </p>
    <p class="styled-point2">
      Higher eigenvalues mean a component captures more variance, ideally with the first few components covering
      a substantial portion.
    </p>
    <p class="styled-point2">
      If eigenvalues are distributed evenly, PCA might not significantly reduce dimensions, suggesting it may be
      less effective for the data.
    </p>
  </div>
</div>
--- (id="interpreting-the-role-of-eigenvectors-and-eigenvalues-in-pca")


## Transforming Data: Loadings and Scores
<div>
  <div class="leftBox">
    <p class="styled-point">
      To transform the data, we use the <code>eigenvectors</code> of the covariance matrix. These eigenvectors
      form a new basis for the data.
    </p>
    <p class="styled-point2">
      Each data point is projected onto this new basis, creating two key components:
    </p>
    <p class="styled-point2">
      <code>Scores</code>: Represent the data points in the new coordinate system defined by the principal
      components.
    </p>
    <p class="styled-point2">
      <code>Loadings</code>: Show how the original variables contribute to each principal component.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">Transformation process:</p>
    <pre style="font-size: large;">
          <code data-trim data-noescape>Data × Eigenvectors = Scores
┌       ┐   ┌                  ┐   ┌        ┐
│ x1 x2 │ × │ v_1   v_2  ...   │ = │  PC1   │
│ ...   │   │ ...   ...  ...   │   │  PC2   │
│ xN xN │   │ v_m   v_n  ...   │   │  ...   │
└       ┘   └                  ┘   └        ┘</code></pre>
    <p class="styled-point2">
      Each row of <code>Scores</code> represents a transformed data point, and each column of
      <code>Loadings</code> shows the contribution of each variable to a principal component.
    </p>
    <p class="styled-point2">
      PCA is data decomposition, breaking down the data into loadings $l$ & scores $s$.
      $$ Data = s \cdot l^T $$
      Where $l^T$ is the transpose of the loadings matrix (loadings are the eigenvectors).
  </div>
</div>
--- (id="transforming-data-loadings-and-scores")


## Working Example: PCA on Fruits Dataset
<div>
  <div class="leftBox">
    <p class="styled-point">
      Different Fruits as Samples.
    </p>
    <p class="styled-point2">
      Apple, Banana, Lime, Grape, Pineapple
    </p>
    <p class="styled-point">
      Different measurements methods as Features.
    </p>
    <p class="styled-point2">
      Sweetness, Weight, Price
    </p>
    <p class="styled-point2">
      Sourness, Color(Red), Color(Blue), Color(Green)
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <pre style="font-size: medium;">
Sweetness Weight Price Sourness Color(R) Color(G) Color(B)
9.0     995.6  5.0    1.0      246      255      38
7.3     156.1  2.9    3.9      249       16      12
5.3     143.6  2.1    3.4      250        9      28
5.8     122.5  0.6    2.3      248      250       7
6.9      99.8  1.3    1.9      251      255       9
3.0      39.3  2.2    8.5        5      253       4
5.4     158.4  3.2    3.3      255        7      11
4.3     126.2  1.4    3.0      255      255       3
3.4      58.6  1.7    7.0       15      254      15
6.6     124.6  1.3    1.1      255      243      11
7.8       7.7  4.6    3.8      115       12      99
9.8     995.7  5.6    3.1      255      255      37
8.5      18.1  4.5    2.2      137        9     127
2.2      55.2  3.0    7.7        7      255       1
7.8      13.3  4.7    2.7      140       13     123
3.7      41.3  2.8    8.8        9      239       1
2.2      44.4  1.9    8.0        8      255      18
8.0    1000.8  5.0    1.5      255      255      48
6.2     151.1  3.7    4.8      255       12       2
7.3     129.2  1.2    0.0      248      233       5
8.7     141.5  2.9    3.6      253        9       3
7.2     122.8  1.4    2.9      255      249       7
8.8    1005.9  6.4    0.4      253      255      58
4.0      38.3  2.9    7.7       11      255       7
7.7    1009.1  4.9    1.6      255      255      36
8.1     984.8  5.3    1.1      253      255      33
7.7      13.1  3.8    2.8      124        8     115
</pre>
  </div>
</div>
--- (id="working-example-pca-on-fruits-dataset")


## Working Example: PCA on Fruits Dataset <span class="magenta-text">
    < Scores Plot>
  </span>
<img src="../resources/pca_fruits_scores.png" alt="PCA on Fruits Dataset"
  style="width: 70%; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);">
--- (id="working-example-pca-on-fruits-dataset-scores-plot")


## Working Example: PCA on Fruits Dataset <span class="magenta-text">
    < Bi-Plot>
  </span>
<img src="../resources/pca_fruits_biplot.png" alt="PCA on Fruits Dataset"
  style="width: 70%; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);">
--- (id="working-example-pca-on-fruits-dataset-bi-plot")


## Working Example: PCA on Fruits Dataset <span class="magenta-text">
    < Interpretation>
  </span>
<div>
  <div class="leftBox">
    <p class="styled-point">
      The PCA bi-plot shows the relationship between samples and features in the transformed space.
    </p>
    <p class="styled-point2">
      Samples are represented by points, while features are shown as vectors.
    </p>
    <p class="styled-point2">
      The length and direction of feature vectors indicate their importance and relationship to samples.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <img src="../resources/pca_fruits_biplot.png" alt="PCA on Fruits Dataset"
      style="width: 100%; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);">
    <p class="styled-point2">
      In this example, the first principal component (PC1) is strongly influenced weight, while the second
      principal component (PC2) is driven by color features.
    </p>
  </div>
</div>
--- (id="working-example-pca-on-fruits-dataset-interpretation")


## Advantages and Limitations of PCA
<div>
  <div class="leftBox">
    <p class="styled-point">Advantages of PCA</p>
    <p class="styled-point2">
      <code>Dimensionality Reduction</code>: Simplifies datasets by reducing variables, preserving core
      information.
    </p>
    <p class="styled-point2">
      <code>Noise Reduction</code>: Filters noise by focusing on components with the highest variance.
    </p>
    <p class="styled-point2">
      <code>Improved Visualization</code>: Enables visualization of high-dimensional data in 2D or 3D.
    </p>
    <p class="styled-point2">
      <code>Feature Extraction</code>: Highlights uncorrelated variables, making dominant features clear.
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point">Limitations of PCA</p>
    <p class="styled-point2">
      <code>Linear Assumptions</code>: Captures linear relationships but may miss non-linear structures.
    </p>
    <p class="styled-point2">
      <code>Loss of Interpretability</code>: Principal components lack intuitive meaning compared to original
      features.
    </p>
    <p class="styled-point2">
      <code>Variance-Based Selection</code>: Ignores low-variance components that may still hold relevant
      information.
    </p>
    <p class="styled-point2">
      <code>Scaling Sensitivity</code>: Results can vary with inconsistent feature scaling.
    </p>
  </div>
</div>
--- (id="advantages-and-limitations-of-pca")


## Excursion to Linear Discriminant Analysis (LDA)
<div>
  <div class="leftBox">
    <p class="styled-point">
      <code>Linear Discriminant Analysis (LDA)</code> is similar to PCA, but with a focus on distinguishing
      between predefined groups.
    </p>
    <p class="styled-point2">
      Instead of maximizing overall <code>variance</code>, LDA aims to maximize <code>separation</code> between
      groups.
    </p>
    <p class="styled-point2">
      LDA uses the <code>within-group covariance matrix</code> inverse, multiplied by the
      <code>between-group covariance matrix</code>, to find new axes.
      $$ C = \Sigma_w^{-1} \cdot \Sigma_b $$
    </p>
  </div>
  <div class="spacer"></div>
  <div class="rightBox">
    <p class="styled-point2">
      The new axes (or <code>discriminant components</code>) in LDA are chosen to best separate the groups, not
      just capture variance.
    </p>
    <p class="styled-point2">
      <code>Applications</code>: Often used in classification tasks, as it enhances differences between
      categories, improving separability.
    </p>
    <p class="styled-point2">
      <code>Limitations</code>: LDA assumes normally distributed data within each group and may struggle with
      non-linear boundaries.
    </p>
  </div>
</div>
--- (id="excursion-to-linear-discriminant-analysis-lda")


## LDA vs. PCA
<div style="display: inline-block;">
  <img src="../resources/lda1.png" alt="LDA vs. PCA"
    style="width: 45%; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);">
  <img src="../resources/lda2.png" alt="LDA vs. PCA"
    style="width: 45%; box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);">
</div>
--- (id="lda-vs-pca")
