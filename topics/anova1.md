---
title: "one-way ANOVA"
author: "Gerrit Renner"
keywords: ["ANOVA", "analysis of variance", "one-way ANOVA", "F-distribution", "between-group variance", "within-group variance", "degrees of freedom"]
requirements: ["Hypothesis Testing", "Mean Values", "Variance"]
description: "Understanding and applying one-way ANOVA for comparing means in water science"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Hypothesis Testing
- Mean Values
- Variance
- t-Tests    

---

<!-- .slide:id="anova1-intro" -->
## The Concept of Comparing Groups
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! In water science, we often need to compare the means of multiple groups (e.g., pollutant levels across different sites).

***

-= For two groups, a t-test is sufficient

|Site A|Site B|
|:----:|:----:|
| 5.1  | 6.3  |
| 4.8  | 7.2  |
| 5.5  | 6.8  |

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-? Do you still remember how a t-test works?

-: What is the null hypothesis?
-: How do we calculate the test statistic?
-: How do we interpret the result?

<div id="tTest-spoiler"></div>

<script>
createTimerLockedSpoiler('tTest-spoiler', {
  unlockDate: '2025-11-25T13:00:00Z',  // Nov 25, 2025 at 2:00 PM CET
  title: 'content',
  content: `
    <p><strong>Answer:</strong></p>
    <ul>
      <li>The null hypothesis states that the means of the two groups are equal.</li>
      <li>The test statistic is calculated as the difference between the group means divided by the standard error of the difference.</li>
      <li>If the p-value is less than the significance level (e.g., 0.05), we reject the null hypothesis and conclude that there is a significant difference between the group means.</li>
    </ul>
  `
});
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-intro-2" -->
## Limitations of t-Tests for Multiple Groups
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! What if we have more than two groups to compare?

***

-! Imagine we have five different sites:

|Site A|Site B|Site C|Site D|Site E|
|:----:|:----:|:----:|:----:|:----:|
| 5.1  | 6.3  | 7.0  | 5.8  | 6.5  |
| 4.8  | 7.2  | 6.9  | 5.5  | 7.1  |
| 5.5  | 6.8  | 7.3  | 6.0  | 6.9  |

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-? Can we still use multiple t-tests to compare all groups?
-: A vs. B, A vs. C, A vs. D, A vs. E, B vs. C, B vs. D, B vs. E, C vs. D, C vs. E, D vs. E

*** 

-? What issues might arise from this approach?
-: Increased risk of Type I errors (false positives)
-: False positive: Concluding that there is a difference when there isn't one, i.e. rejecting a true null hypothesis with p<0.05
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-multiple-ttests-problem" -->
## The Problem with Multiple t-Tests
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-? What's the probability of making at least one Type I error when performing a single t-test at α = 0.05?
-: 5% chance of Type I error for one test

***
-? Now, what if we perform 10 t-tests (as in the previous example with 5 groups)?
-: The probability of making at least one Type I error increases significantly

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! The more tests we perform, the higher the chance of false positives!

$$
P(\text{Type I error > 0}) = 1 - (1 - \alpha)^n
$$

-: P = Probability of at least one Type I error
-: alpha = significance level (e.g., 0.05)
-: n = number of tests

***

-! For 10 tests at α = 0.05:

$$
P(\text{Type I error > 0}) = 1 - (1 - 0.05)^{10} \approx 0.40
$$

-< There's a 40% chance of getting at least one false positive!
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-inflated-error-rate" -->
## Inflated Error Rate with Multiple Tests

<div id="inflated-error-chart" style="width: 1528px; height: 702px; margin: 20px auto;"></div>

<script src="resources/js/charts/inflated_error_rates_multiple_tests.js"></script>

-! When conducting multiple independent tests, the probability of making at least one Type I error increases dramatically.

---

<!-- .slide:id="anova1-bonferroni-correction" -->
## Bonferroni Correction to Control Error Rate
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! One way to control the overall Type I error rate is to adjust the significance level for each individual test.
-: This method is called the Bonferroni correction.

***

-! The adjusted significance level for each test is given by:
$$
\alpha_{adjusted} = \frac{\alpha}{n}
$$
-: alpha = overall significance level (e.g., 0.05)
-: n = number of tests

-? For 10 tests at an overall α = 0.05, what would be the adjusted α?
-: 0.005
-: Overall Type I error rate: $1 - (1 - 0.005)^{10} \approx 0.049$
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<img src="resources/figures/hydra.svg" alt="Hydra with multiple heads" style="width:100%"/>

-< The Bonferroni correction helps keep the overall error rate in check, but it can be overly conservative, increasing the risk of Type II errors (false negatives).
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-intro-anova" -->
## Transition: From Multiple t-Tests to ANOVA
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Multiple t-tests lead to α-error inflation

***

-! Bonferroni reduces α, but increases β (Type II error)

***

-? We need **one test** for *all groups at once*

***

-? Question: Is there variation *between groups* beyond chance?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<img src="resources/figures/hydra.svg" alt="Hydra with multiple heads" style="width:80%; margin: auto; display: block;"/>

<div style="text-align: center; margin-top: 30px;">
  <div style="font-size: 48px; color: #00ff88;">↓</div>
  <div style="font-size: 24px; color: #00d4ff; font-weight: bold;">One Global Test</div>
</div>

-= **Solution:** Analysis of Variance (ANOVA)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-basic-idea" -->
## The Basic Idea of ANOVA
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! ANOVA compares *variance between groups* vs. *variance within groups*

***

-= If groups differ → between-group variance is **increased**

***

-= ANOVA tests whether this ratio is larger than expected by chance

$$
F = \frac{s^2_{\text{between}}}{s^2_{\text{within}}}
$$

-: s² = Variance estimate
-: F = F-statistic (test statistic)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="anova-variance-controls" style="margin-bottom: 20px;"></div>

<div id="anova-variance-chart" style="width: 600px; height: 450px;"></div>

<script src="resources/js/charts/anova_variance_comparison.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-variance-components" -->
## Splitting Total Variance
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Total variation = differences around overall mean

***

-= Split into two components:

*Between-group variation (SS_between):*
- Differences of group means from overall mean
- Large if groups differ

***

*Within-group variation (SS_within):*
- Variation inside each group
- Random scatter around group means

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! Formula:
$$
SS_{\text{total}} = SS_{\text{between}} + SS_{\text{within}}
$$

***

$$
SS_{\text{total}} = \sum_{i=1}^{k} \sum_{j=1}^{n_i} (x_{ij} - \bar{x})^2
$$

-: $k$ = number of groups
-: $n_i$ = sample size of group i
-: $x_{ij}$ = j-th observation in group i
-: $\bar{x}$ = overall mean
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-sums-of-squares" -->
## Calculating Sums of Squares
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-= **SS_between:** How far are group means from the overall mean?

$$
SS_{\text{between}} = \sum_{i=1}^{k} n_i(\bar{x}_i - \bar{x})^2
$$

-: $k$ = number of groups
-: $n_i$ = sample size of group i
-: $\bar{x}_i$ = mean of group i
-: $\bar{x}$ = overall mean

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-= **SS_within:** How much do observations vary within each group?

$$
SS_{\text{within}} = \sum_{i=1}^{k} \sum_{j=1}^{n_i} (x_{ij} - \bar{x}_i)^2
$$

-: $x_{ij}$ = j-th observation in group i
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-mean-squares" -->
## From Sums of Squares to F-Statistic
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->

-! Having *SS_between* and *SS_within* is not enough, as the `F-statistic` requires `variance` estimates.

-> We calculate `variance estimates` called Mean Squares by dividing sums of squares by their respective degrees of freedom.

***

*Between-group variance:*
$$
MS_{\text{between}} = \frac{SS_{\text{between}}}{k - 1}
$$

-: df_between = $k - 1$ (number of groups minus 1)

<!-- /position -->
<!-- position={row: 1, column: 2} -->

*Within-group variance:*
$$
MS_{\text{within}} = \frac{SS_{\text{within}}}{N - k}
$$

-: df_within = $N - k$ (total observations minus number of groups)

***

**F-statistic:**
$$
F = \frac{MS_{\text{between}}}{MS_{\text{within}}}
$$
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-f-statistic-interpretation" -->  
## Interpreting the F-Statistic
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! F-value stems from so-called `F-distribution`.

-> The F-distribution can be used for hypothesis testing in ANOVA like the t-distribution for t-tests.

***

<div id="f-distribution-chart" style="width: 600px; height: 520px;"></div>

<script src="resources/js/charts/f_distribution_interactive.js"></script>

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-< F ≈ 1 → Groups are similar
-: Between-group variance same as within-group variance
-: No evidence for group differences

***

-< F >> 1 → Groups differ
-: Between-group variance much larger
-: Strong evidence for group differences

***

-! Example degrees of freedom:

<div style="font-size: 0.8em; margin: 20px auto;">

| Groups (k) | N | df₁ (between) | df₂ (within) |
|:----------:|:-:|:-------------:|:------------:|
| 3          | 30| 2             | 27           |
| 5          | 50| 4             | 45           |

</div>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-hypotheses" -->
## What Are We Testing?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Null Hypothesis **(H₀):**
$$
\mu_1 = \mu_2 = \ldots = \mu_k
$$
-: All group means are equal

***

-! Alternative Hypothesis **(H₁):**
-> At least one group mean differs from the others
-: Not all means are equal

***

-! *Key advantage:*
-> Global test → avoids α-error inflation
-> Single test for all groups


<!-- /position -->
<!-- position={row: 1, column: 2} -->
<img src="resources/figures/anova_flowchart.svg" alt="ANOVA decision flowchart" style="width: 100%; margin: auto; display: block;"/>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-assumptions" -->
## Assumptions of One-Way ANOVA
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! *1. Independence*
-: Observations within and between groups are independent

***

-! *2. Normality*
-: Data within each group follow a normal distribution
-: Check with QQ-plots or Kolmogorov-Smirnov test
-: Robust to moderate violations if sample sizes are similar

***

-! *3. Homogeneity of Variances*
-: Equal variances across all groups (homoscedasticity)
-: Test with `Brown–Forsythe Levene-Test`
-: Robust if group sizes are equal

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-= **Note:** ANOVA is relatively robust if:
-: Sample sizes are similar across groups
-: Sample sizes are large (n > 30 per group)
  
***

`Brown–Forsythe Levene-Test`

-! Anova based on $z$ values

$$
z_{ij} = |x_{ij} - \tilde{x}_i|
$$

-: $\tilde{x}_i$ = median of group i
-: Tests if variances of $z_{ij}$ are equal across groups

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-example-setup" -->
## Worked Example: Water Quality Across Sites
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! *Scenario:* Measure dissolved oxygen (mg/L) at 4 different sites

| Site A | Site B | Site C | Site D |
|:------:|:------:|:------:|:------:|
| 7.2    | 8.1    | 6.5    | 7.8    |
| 7.5    | 8.3    | 6.8    | 7.6    |
| 7.1    | 8.0    | 6.4    | 7.9    |
| 7.4    | 8.2    | 6.7    | 7.7    |

<!-- /position -->

<!-- position={row: 1, column: 2} -->
-? Question: Do these sites have *similar variability* (variance) in dissolved oxygen?

-> First, we check the *homogeneity of variances* (Brown–Forsythe test), 

-> then we perform the *actual one-way ANOVA* on the original values.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-brown-forsythe-step1" -->
## Brown–Forsythe Test: Step 1 (Transform Data)

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! *Idea:* Test homogeneity of variances using a robust Levene-type test.

-: For each site $i$, compute the *group median* $\tilde{x}_i$

-: Then transform all observations to *absolute deviations* from the median:

$$
z_{ij} = |x_{ij} - \tilde{x}_i|
$$

-: If the variability of $z_{ij}$ differs between groups, the variances of the original data are not homogeneous.

*** 

-= **Group medians:**
-: Site A: $\tilde{x}_A = 7.30$
-: Site B: $\tilde{x}_B = 8.15$
-: Site C: $\tilde{x}_C = 6.60$
-: Site D: $\tilde{x}_D = 7.75$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
-! *Absolute deviations* $z_{ij} = |x_{ij} - \tilde{x}_i|$

<div style="font-size: 0.7em; margin: 20px auto;">

| Site | Values          | Median | z-values              |
|:----:|:---------------:|:------:|:---------------------:|
| A    | 7.2, 7.5, 7.1, 7.4 |  7.30  | 0.10, 0.20, 0.20, 0.10   |
| B    | 8.1, 8.3, 8.0, 8.2 |  8.15  | 0.05, 0.15, 0.15, 0.05   |
| C    | 6.5, 6.8, 6.4, 6.7 |  6.60  | 0.10, 0.20, 0.20, 0.10   |
| D    | 7.8, 7.6, 7.9, 7.7 |  7.75  | 0.05, 0.15, 0.15, 0.05   |

</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-brown-forsythe-step2" -->
## Brown–Forsythe Test: Step 2 (ANOVA on z-values)

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! Now perform a *one-way ANOVA* on the transformed values $z_{ij}$:

$$
F_{\text{BF}} = \frac{MS_{\text{between}}(z)}{MS_{\text{within}}(z)}
$$

-: Null hypothesis $H_0$: All group variances are equal (homogeneous).

-: Alternative $H_1$: At least one group has a different variance.

*** 

-= For this example:

- Group means of $z$:  
  - A: 0.15, B: 0.10, C: 0.15, D: 0.10  
- Overall mean of $z$: $\bar{z} = 0.125$

<!-- /position -->

<!-- position={row: 1, column: 2} -->
-! *ANOVA on z-values (Brown–Forsythe)*

$$
SS_{\text{between}}(z) = 0.01,\quad SS_{\text{within}}(z) = 0.04
$$

$$
MS_{\text{between}}(z) = \frac{0.01}{3},\quad
MS_{\text{within}}(z) = \frac{0.04}{12}
$$

$$
F_{\text{BF}} \approx 1.0,\quad df_1 = 3,\ df_2 = 12
$$

-> $p \approx 0.43 > 0.05$

***

-< **Conclusion:** No evidence against homogeneity of variances → we can safely use the standard one-way ANOVA.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-example-means" -->
## One-Way ANOVA: Group and Overall Means

<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! *Group means:*

-: Site A: $\bar{x}_A = 7.30$  
-: Site B: $\bar{x}_B = 8.15$  
-: Site C: $\bar{x}_C = 6.60$  
-: Site D: $\bar{x}_D = 7.75$

-= *Overall mean:*

$$
\bar{x} = 7.45
$$

***

-? Toggle between:
-: **Original Data** - Shows dissolved oxygen measurements
-: **Z-Transformed** - Shows absolute deviations from median (Brown-Forsythe test)

<!-- /position -->

<!-- position={row: 1, column: 2} -->
<div id="anova-group-means-chart" style="width: 1000px; height: 700px;"></div>

<script src="resources/js/charts/anova_group_means_violin.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-example-anova" -->
## One-Way ANOVA: Calculating F

<!-- layout={rows: 1, columns: 1} -->

<!-- position={row: 1, column: 1} -->
-! *Step 1: Between-group sum of squares*

$$
SS_{\text{between}} = n \sum_{i=1}^k (\bar{x}_i - \bar{x})^2
$$

$$
SS_{\text{between}} = 4[(7.30-7.45)^2 + (8.15-7.45)^2 + (6.60-7.45)^2 + (7.75-7.45)^2]
$$

$$
SS_{\text{between}} = 5.30
$$

*** 

-! *Step 2: Within-group sum of squares*

$$
SS_{\text{within}} = \sum \text{(deviations within each group)}^2
$$

$$
SS_{\text{within}} = 0.30
$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-example-anova-2" -->
## One-Way ANOVA: Calculating F (Continued)
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
-! *Step 3: Mean squares*

$$
MS_{\text{between}} = \frac{SS_{\text{between}}}{k-1}
  = \frac{5.30}{3} \approx 1.77
$$

$$
MS_{\text{within}} = \frac{SS_{\text{within}}}{N-k}
  = \frac{0.30}{12} = 0.025
$$

*** 

-! *Step 4: F-statistic*

$$
F = \frac{MS_{\text{between}}}{MS_{\text{within}}}
  = \frac{1.77}{0.025} \approx 70.8
$$

-: $df_1 = 3,\ df_2 = 12$  
-: $p \ll 0.001$ → highly significant

-< Conclusion: At least one site has a different mean dissolved oxygen level.

<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="anova1-example-anova-table" -->
## Example ANOVA Table

| Source         | SS     | df  | MS      | F      | p-value  |
|:--------------:|:------:|:---:|:-------:|:------:|:--------:|
| Between Groups | 5.30   | 3   | 1.77   | 70.8   | < 0.001  |
| Within Groups  | 0.30   | 12  | 0.025 |        |          |
| **Total**      | 5.60   | 15  |         |       |          |

***

-! *Interpretation:*
-< F(3, 12) = 70.8, p < 0.001 → Reject H₀: Not all site means are equal

---

<!-- .slide:id="anova1-interpretation" -->
## What Does a Significant ANOVA Tell Us?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! *Significant ANOVA (p < α):*
-: Reject H₀: Not all group means are equal
-: At least one group differs from the others
-: **But:** Doesn't tell us *which* groups differ!

***

-= **Next step:** Post-hoc comparisons
-> Only if ANOVA is significant
-: Compare specific pairs of groups
-: Multiple comparison corrections applied
-: Common methods: Tukey HSD (all pairwise), Dunnett (all vs. control), Bonferroni (selected pairs)

***

-! *Key advantage of ANOVA:*
-: Protects against α-inflation **without Bonferroni**
-: Global test controls family-wise error rate
-: Only one test, one α-level

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<img src="resources/figures/anova_flowchart2.svg" alt="ANOVA decision flowchart with post-hoc" style="width: 100%; margin: auto; display: block;"/>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova1-group-tricky-scenarios" -->
## Tricky ANOVA Scenarios (Think Before You Test!)

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; padding: 10px;">

  <!-- Card 1 -->
  <div style="background: rgba(20, 60, 90, 0.18); padding: 20px; border-radius: 12px; border-left: 5px solid #06d6a0;">
    <div style="background: #06d6a0; color: #fff; padding: 8px; border-radius: 6px; text-align: center;
                font-weight: bold; margin-bottom: 10px;">
      Scenario 1: Means Very Different — but Can We Use ANOVA?
    </div>
    <div style="font-size: 0.82em; line-height: 1.50;">
      <p>You measured COD (mg/L) at 3 sites:</p>
      <ul>
        <li>A: 15, 14, 13, 16, 17 (n=5)</li>
        <li>B: 50, 52, 51, 49, 53 (n=5)</li>
        <li>C: 30, 28 (n=2)</li>
      </ul>
      <p>Means are very different (A=15, C=29, B=51).</p>
    </div>
  </div>

  <!-- Card 2 -->
  <div style="background: rgba(20, 60, 90, 0.18); padding: 20px; border-radius: 12px; border-left: 5px solid #f77f00;">
    <div style="background: #f77f00; color: #fff; padding: 8px; border-radius: 6px; text-align: center;
                font-weight: bold; margin-bottom: 10px;">
      Scenario 2: Same Means — But highly different Sample Sizes
    </div>
    <div style="font-size: 0.82em; line-height: 1.50;">
      <p>You rebalanced your dataset:</p>
      <ul>
        <li>A: n=5</li>
        <li>B: n=20</li>
        <li>C: n=200</li>
      </ul>
      <p>All means are identical: 5.0</p>
    </div>
  </div>

---

<!-- .slide:id="anova1-group-tricky-scenarios" -->
## Tricky ANOVA Scenarios (Think Before You Test!) - 2

<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; padding: 10px;">

  <!-- Card 3 -->
  <div style="background: rgba(20, 60, 90, 0.18); padding: 20px; border-radius: 12px; border-left: 5px solid #118ab2;">
    <div style="background: #118ab2; color: #fff; padding: 8px; border-radius: 6px; text-align: center;
                font-weight: bold; margin-bottom: 10px;">
      Scenario 3: Tiny Differences — Extremely Significant ANOVA
    </div>
    <div style="font-size: 0.82em; line-height: 1.50;">
      <p>DO (mg/L):</p>
      <ul>
        <li>A: n=400, mean=7.00</li>
        <li>B: n=400, mean=7.05</li>
        <li>C: n=400, mean=7.10</li>
      </ul>
      <p>ANOVA: p < 1e-10</p>
    </div>
  </div>

  <!-- Card 4 -->
  <div style="background: rgba(20, 60, 90, 0.18); padding: 20px; border-radius: 12px; border-left: 5px solid #9b5de5;">
    <div style="background: #9b5de5; color: #fff; padding: 8px; border-radius: 6px; text-align: center;
                font-weight: bold; margin-bottom: 10px;">
      Scenario 4: One Outlier Breaks Homogeneity
    </div>
    <div style="font-size: 0.82em; line-height: 1.50;">
      <p>Microplastics (particles/L):</p>
      <ul>
        <li>A: 120, 130, 125, <b>4000</b></li>
        <li>B: 115, 118, 116, 117</li>
      </ul>
    </div>
  </div>

</div>


---

<!-- .slide:id="anova-posthoc-overview" -->
## Overview of Common Post-Hoc Tests
<!-- layout={rows: 1, columns: 3} -->
<!-- position={row: 1, column: 1} -->
-! *Tukey HSD (Honest Significant Difference)*  
-: Compares *all possible pairs*.  
-: Controls Family-Wise Error Rate (FWER).  
-: Assumes *homogeneous variances* and *balanced sample sizes*.  

***

-! *Dunnett Test*
-: Compares each group *vs. one control group*.  
-: More powerful than Tukey for this design.  
-: Used when a *reference site* or *control condition* exists.


<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! *Bonferroni / Holm / Šidák*
-: Adjust p-values for selected comparisons.  
-: Very conservative (risk of Type-II error ↑).  
-: Useful when *only a few* comparisons are planned.

***

-! *Games–Howell*  
-: Robust post-hoc for *unequal variances* and *unequal sample sizes*.  
-: Does not assume homoscedasticity.  
-: Particularly suited for typical *environmental / water* data.  

<!-- /position -->
<!-- position={row: 1, column: 3} -->

-! *Tamhane T2*  
-: Conservative alternative to Games–Howell.  
-: Good for heteroscedasticity + small samples.  

***

-! *Conover–Iman (after Kruskal–Wallis)*  
-: Nonparametric pairwise comparisons.  
-: Great when data are *non-normal* or *skewed*.  

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-base-r" -->
##  ANOVA in Base R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Base R provides built-in functions for performing one-way ANOVA.

*** 

-! However, the Brown-Forsythe test is not directly available in base R and requires custom implementation or additional packages.

***

-= **Example 1:** Brown-Forsythe Test (Manual Implementation)
-: Transform data: $z_{ij} = |x_{ij} - \tilde{x}_i|$
-: Perform ANOVA on transformed values
-: Tests homogeneity of variances

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="anova-base-r-container"></div>

<script>
(function() {
  const containerId = 'anova-base-r-container';
  const code = `# Water quality data (dissolved oxygen mg/L)
site_a <- c(7.2, 7.5, 7.1, 7.4)
site_b <- c(8.1, 8.3, 8.0, 8.2)
site_c <- c(6.5, 6.8, 6.4, 6.7)
site_d <- c(7.8, 7.6, 7.9, 7.7)

# Combine data
values <- c(site_a, site_b, site_c, site_d)
sites <- factor(rep(c("A", "B", "C", "D"), each = 4))

# ===== BROWN-FORSYTHE TEST =====
# Transform to z-values (absolute deviations from median)
medians <- tapply(values, sites, median)
z_values <- abs(values - medians[as.character(sites)])

# ANOVA on z-values
bf_result <- aov(z_values ~ sites)
bf_result |> summary() |> print()`;
  const fallback = () => {
    return `[Simulated in JavaScript]
Brown-Forsythe Test (Levene):
             Df Sum Sq Mean Sq F value Pr(>F)
sites         3  0.010  0.0033    1.0  0.430
Residuals    12  0.040  0.0033`;
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'anova-base-r',
      fallback,
      runLabel: 'Run ANOVA Tests'
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-base-r" -->
##  ANOVA in Base R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Base R provides built-in functions for performing one-way ANOVA.

*** 

-! However, the Brown-Forsythe test is not directly available in base R and requires custom implementation or additional packages.

***

-= **Example 2:** ANOVA 
-: Perform ANOVA on values
-: Tests for differences in means across groups
-: Post-hoc tests can be applied if ANOVA is significant

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="anova-base-r-container-2"></div>

<script>
(function() {
  const containerId = 'anova-base-r-container-2';
  const code = `# Water quality data (dissolved oxygen mg/L)
site_a <- c(7.2, 7.5, 7.1, 7.4)
site_b <- c(8.1, 8.3, 8.0, 8.2)
site_c <- c(6.5, 6.8, 6.4, 6.7)
site_d <- c(7.8, 7.6, 7.9, 7.7)

# Combine data
values <- c(site_a, site_b, site_c, site_d)
sites <- factor(rep(c("A", "B", "C", "D"), each = 4))

# ANOVA on values
bf_result <- aov(values ~ sites)
bf_result |> summary() |> print()

# (Optional) Post-hoc test (Tukey HSD)
tukey_result <- TukeyHSD(bf_result)
tukey_result |> print()`;
  const fallback = () => {
    return `[Simulated in JavaScript]
ANOVA:
Df Sum Sq Mean Sq F value Pr(>F)
sites         3  5.30   1.77    70.8  <0.001`;
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'anova-base-r',
      fallback,
      runLabel: 'Run ANOVA Tests'
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="tukey-hsd" -->
## Tukey HSD Post-Hoc Test
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
-! *Tukey HSD* compares all possible pairs of group means.
-: Controls Family-Wise Error Rate (FWER).
-: Assumes homogeneous variances and balanced sample sizes.

***

-! Mathematical definition

For two group means $ \bar{x}_i $ and $ \bar{x}_j $:

$$
q_{ij} = 
\frac{|\bar{x}\_i - \bar{x}\_j|}
{\sqrt{MS\_{\text{within}}/n}}
$$

The critical value is taken from the *studentized range distribution*:

$$
q_{\text{crit}} = q_{\alpha}(k,\; df)
$$
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Significance criterion:

$$
q\_{ij} > q\_{\text{crit}}
$$

Equivalent “Honest Significant Difference” (HSD):

$$
|\bar{x}\_i - \bar{x}\_j| > q\_{\text{crit}} \cdot \sqrt{\frac{MS\_{\text{within}}}{n}}
$$

where:

-: $ k $ = number of groups  
-: $ df = N - k $ = residual degrees of freedom  
-:  $ MS\_{\text{within}} $ = pooled within-group variance  
-: $ n $ = sample size per group (balanced design)
<!-- /position -->

<!-- /layout -->

---

<!-- .slide:id="anova-base-r" -->
##  ANOVA in Base R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Base R provides built-in functions for performing one-way ANOVA.

*** 

-! However, the Brown-Forsythe test is not directly available in base R and requires custom implementation or additional packages.

***

-= **Example 3:** ANOVA 
-: Plot Tukey HSD results


<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="anova-base-r-container-3"></div>
  <div id="anova-tukey-plot" style="border: 0px solid #2d3a66; border-radius: 8px; min-height: 220px; display: flex; align-items: center; justify-content: center; color: #9efcffcc; font-size: 0.9em; text-align: center; padding: 12px;">
    Run the WebR example to preview the Tukey HSD plot.
  </div>
  <button id="anova-tukey-open-plot" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'anova-base-r-container-3';
  const plotContainerId = 'anova-tukey-plot';
  const openBtnId = 'anova-tukey-open-plot';
  const slideId = 'anova-tukey-plot';

  const code = `# Water quality data (dissolved oxygen mg/L)
site_a <- c(7.2, 7.5, 7.1, 7.4)
site_b <- c(8.1, 8.3, 8.0, 8.2)
site_c <- c(6.5, 6.8, 6.4, 6.7)
site_d <- c(7.8, 7.6, 7.9, 7.7)

# Combine data
values <- c(site_a, site_b, site_c, site_d)
sites <- factor(rep(c("A", "B", "C", "D"), each = 4))

# ANOVA on values
bf_result <- aov(values ~ sites)

# Post-hoc test (Tukey HSD)
tukey_result <- TukeyHSD(bf_result)
plot(tukey_result)`;

  const fallbackOutput = `[Simulated]
Tukey HSD plot showing pairwise comparisons:
All site comparisons show significant differences`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Generate Tukey HSD Plot (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 480,
        background: '#ffffff',
        altText: 'Tukey HSD plot generated in WebR',
        loadingMessage: 'Rendering plot...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the Tukey HSD plot.'
      },
      popupButtonId: openBtnId
    });
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

<!-- .slide:id="significance-vs-effect-size" -->
## Significance vs. Effect Size
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! *Statistical significance* (p-value) indicates whether an effect exists, but not its magnitude.
-: Large samples can yield significant p-values for trivial effects.
-: Small samples may miss important effects (non-significant p-values).

***

<div style="font-size: 0.8em; margin: 20px auto;">

| Source         | SS     | df  | MS      | F      | p-value  |
|:--------------:|:------:|:---:|:-------:|:------:|:--------:|
| Between Groups | 5.30   | 3   | 1.77   | 70.8   | < 0.001  |
| Within Groups  | 0.30   | 500  | 0.0006 |        |          |
| **Total**      | 5.60   | 503  |        |        |          |

</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! *Effect size* quantifies the magnitude of differences, providing practical significance.
-: Common measures: Eta-squared (η²), Omega-squared (ω²), Cohen's f.
-: Helps interpret the real-world importance of findings.

***
-! *Example: Eta-squared (η²)*
$$
\eta^2 = \frac{SS_{\text{between}}}{SS_{\text{total}}}
$$
-: In our example: $\eta^2 = \frac{5.30}{5.60} \approx 0.946$ (very large effect)
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="significance-vs-effect-size-2" -->
## Omega-Squared (ω²) and Cohen's f
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! *Omega-squared (ω²)* provides a less biased estimate of effect size:
$$
\omega^2 = \frac{SS_{\text{between}} - (df_{\text{between}} \cdot MS_{\text{within}})}{SS_{\text{total}} + MS_{\text{within}}}
$$
-: In our example: $\omega^2 \approx 0.92$ (still a large effect)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! *Cohen's f* is another effect size measure:
$$
f = \sqrt{\frac{\eta^2}{1 - \eta^2}}
$$  
-: In our example: $f \approx 3.59$ (very large effect)
-: Cohen's f benchmarks:
-> Small: 0.10
-> Medium: 0.25
-> Large: 0.40
-> Very Large: > 0.40
<!-- /position -->
<!-- /layout -->