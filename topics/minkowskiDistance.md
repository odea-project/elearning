---
title: "Minkowski Distance"
author: "Gerrit Renner"
keywords: ["Minkowski", "Distance", "Metric", "Similarity", "Dissimilarity"]
requirements: ["none"]
description: "Minkowski distance is a generalized metric used to measure the distance between two points in a normed vector space. It is a generalization of both Euclidean and Manhattan distances."

---

# Minkowski Distance

---

## Initial thoughts on **data similarity** analysis

Let's assume we have a data set that contains the following information:
- For each sample A-E (`object`) the `variable` [Fe] was measured

| Sample | [Fe] |
|:---:|:---:|
| A | 2.3 |
| B | 2.7 |
| C | 8.9 |
| D | 8.1 |
| E | 2.5 |

**?** How can we compare these samples (`objects`)?

--- 

## Initial thoughts on **data similarity** analysis

A quite intuitive way to compare the `objects` is considering the absolute differences of the `variable`.

$$ d_{i,j} = |x_i - x_j| $$

- Where $x_i$ and $x_j$ are the values of the `variable` [x] of the samples $i$ and $j$, respectively.
- The result is a `dissimilarity matrix` that contains the absolute differences between all samples.

| Sample | A | B | C | D | E |
|:---:|:---:|:---:|:---:|:---:|:---:|
| A | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |
| B | 0.4 | 0.0 | 6.2 | 5.4 | 0.2 |
| C | 6.6 | 6.2 | 0.0 | 0.8 | 6.4 |
| D | 5.8 | 5.4 | 0.8 | 0.0 | 5.6 |
| E | 0.2 | 0.2 | 6.4 | 5.6 | 0.0 |
| F | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |
| G | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |
| A | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |
| B | 0.4 | 0.0 | 6.2 | 5.4 | 0.2 |
| C | 6.6 | 6.2 | 0.0 | 0.8 | 6.4 |
| D | 5.8 | 5.4 | 0.8 | 0.0 | 5.6 |
| E | 0.2 | 0.2 | 6.4 | 5.6 | 0.0 |
| F | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |
| G | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |

---

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
<div class="code-button-container">
    <div class="py-code-button" data-code="minkowski"></div>
</div>
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