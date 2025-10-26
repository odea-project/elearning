---
title: "Data Handling"
author: "Gerrit Renner"
keywords: ["CSV", "data frame", "mean", "standard deviation", "read.csv", "data import"]
requirements: ["Mean Values", "Variance"]
description: "Working with CSV data format in R"
---
<!-- End of metadata -->

<!--
Red Thread:
- Introduction to CSV data format
- Reading CSV data into R using read.csv()
- Calculating mean and standard deviation on CSV data
- Working with data frames
- Practical exercises with real data
-->

<!-- .slide:id="requirements" -->
## Requirements
- Mean Values
- Variance

---

<!-- .slide:id="data-intro" -->
## Data Handling in Science

<img src="resources/figures/data_formats_overview.svg" alt="CSV Data Format" style="max-width: 80%; margin: 20px auto; display: block;">

-? How do we store and read tabular data for analysis?

---

<!-- .slide:id="csv-intro" -->
## CSV Format — Comma-Separated Values
<div id="csv-intro-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! CSV is the **most common** format for tabular data

***

-! Structure:
-: First row = column names (header)
-: Each line = one data row
-: Values separated by commas

***

*Example:*
```csv
name,age,salary
Alice,28,55000
Bob,35,62000
Charlie,42,58000
```

<!-- /position -->
<!-- position={row: 1, column: 2} -->
Read CSV data in R:
<div id="csv-intro-container"></div>

<script>
(function() {
  const initCSVIntro = async () => {
    const code = `# Read CSV data
csv_data <- "name,age,salary
             Alice,28,55000
             Bob,35,62000
             Charlie,42,58000
             Diana,31,51000
             Eve,29,59000"
df <- read.csv(text = csv_data) |> print()`;

    const fallback = () => {
      return `[Simulated Output]\n  name age salary\n1 Alice  28  55000\n2   Bob  35  62000\n3 Charlie  42  58000\n\n'data.frame': 3 obs. of 3 variables:\n $ name  : chr  "Alice" "Bob" "Charlie"\n $ age   : int  28 35 42\n $ salary: int  55000 62000 58000`;
    };

    await window.webRHelper.quickSetup('csv-intro-container', code, 'csv-intro', fallback);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCSVIntro);
  } else {
    initCSVIntro();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="csv-statistics" -->
## Calculating Mean and Standard Deviation
<div id="csv-stats-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Statistical Functions in R**

-! The **mean** ( $\bar{x}$ ): Average value

$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_{i}$$

***

-! The **standard deviation** ( $s$ ): Measure of spread

$$s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}$$
<!-- /position -->
<!-- position={row: 1, column: 2} -->
-? Let's calculate statistics from our CSV data!
<div id="csv-stats-container"></div>

<script>
(function() {
  const initCSVStats = async () => {
    const code = `# Read CSV data
csv_data <- "name,age,salary
             Alice,28,55000
             Bob,35,62000
             Charlie,42,58000
             Diana,31,51000
             Eve,29,59000"
df <- read.csv(text = csv_data)
# Calculate statistics example:
df$age |> mean() |> paste("<- is mean age") |> print()
df$age |> sd() |> round(2) |> paste("<- is age standard deviation") |> print()`;

    const fallback = () => {
      return `[Simulated Output]\nAge: Mean = 35 SD = 7\nSalary: Mean = 57000 SD = 3605.55`;
    };

    await window.webRHelper.initInteractiveSection({
      containerId: 'csv-stats-container',
      code: code,
      slideId: 'csv-statistics',
      fallback: fallback,
      runLabel: 'Calculate Stats',
      minHeight: '80px'
    })
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCSVStats);
  } else {
    initCSVStats();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="data-frame-operations" -->
## Data Frame Operations in R
<div id="df-ops-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! **Common operations** on data frames

***

-! Accessing data:
-: `df$column` - access column by name
-: `df[row, col]` - access by position
-: `df[condition, ]` - filter rows

***

-! Summary functions:
-: `head()`, `tail()` - view first/last rows
-: `dim()`, `nrow()`, `ncol()` - dimensions
-: `summary()` - statistical summary

<!-- /position -->
<!-- position={row: 1, column: 2} -->
Explore data frame:
<div id="df-ops-container"></div>

<script>
(function() {
  const initDFOps = async () => {
    const code = `# Read CSV data
csv_data <- "name,age,salary
             Alice,28,55000
             Bob,35,62000
             Charlie,42,58000
             Diana,31,51000
             Eve,29,59000"
df <- read.csv(text = csv_data)
# Access column
df$age |> print()
# Filter data
df[df$age > 30, ] |> print()
# Summary
summary(df) |> print()`;

    const fallback = () => {
      return `[Simulated Output]\\nAges:\\n28 35 42 31 29\\n\\nPeople over 30:\\n    name age salary\\n2    Bob  35  62000\\n3 Charlie  42  58000\\n4  Diana  31  51000\\n\\nSummary:\\n     name       age         salary    \\nAlice  :1   Min.   :28   Min.   :51000  \\nBob    :1   Mean   :33   Mean   :57000  \\nCharlie:1   Max.   :42   Max.   :62000`;
    };

    await window.webRHelper.quickSetup('df-ops-container', code, 'data-frame-operations', fallback);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDFOps);
  } else {
    initDFOps();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->