---
title: "Exam Recap: t-Tests and F-Tests"
author: "Gerrit Renner"
keywords: ["t-test", "F-test", "degrees of freedom", "standard error", "ANOVA", "regression", "exam preparation"]
requirements: ["Hypothesis Testing", "Mean Values", "Variance", "t-Tests", "Linear Regression", "one-way ANOVA", "Full Factorial Design"]
description: "Consolidating t-tests and F-tests across all course contexts for exam preparation"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Hypothesis Testing
- Mean Values
- Variance
- t-Tests
- Linear Regression
- one-way ANOVA
- Full Factorial Design

---

<!-- .slide:id="recap-intro" -->
## Exam Recap: t-Tests and F-Tests
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Why This Session?*

-! Throughout the course, you encountered **t-tests** and **F-tests** in multiple contexts:
-: Mean value statistics
-: Linear regression
-: ANOVA / Design of Experiments

***

-< This lecture consolidates everything into one coherent picture

***

*Common Confusions We Will Address:*

-? When do I use a t-test vs. an F-test?
-? What are the degrees of freedom in each case?
-? What exactly is the standard error?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Today's Goals*

-= **Consolidate** your understanding

-= **Reduce** confusion between contexts

-= **Provide** a compact but rigorous overview

-= **Prepare** you for the exam

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px 0; font-size: 0.85em;">
<b>Key Message:</b><br>
t-tests and F-tests are fundamentally the same idea applied in different contexts. Once you see the pattern, everything clicks!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="why-everywhere" -->
## 1. Why t-Tests and F-Tests Appear Everywhere
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Common Thread*

-! Both tests answer the same fundamental question:

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.9em;">
<b>Is the observed effect larger than expected from random variation alone?</b>
</div>

***

-! Both tests compare **signal** to **noise**:

$$\text{Test Statistic} = \frac{\text{Signal (effect)}}{\text{Noise (uncertainty)}}$$

-: **Signal**: difference from null hypothesis
-: **Noise**: standard error of the estimate

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The t² = F Connection*

-! For testing a **single parameter**:

$$t^2 = F$$

-: t-test with df gives F-test with df₁ = 1 and df₂ = df

***

-! This is not a coincidence!

-: t-distribution: ratio of normal to χ²
-: F-distribution: ratio of two χ² distributions
-: Squaring a t-distributed variable gives an F(1, df)

***

-= **Same ideas, different contexts!**

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="variance-ratio-concept" -->
## The Variance Ratio Concept
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*t-Test: Single Parameter*

$$t = \frac{\hat{\theta} - \theta_0}{SE(\hat{\theta})}$$

-: $\hat{\theta}$ = estimated parameter (e.g., $\bar{x}$, $\hat{\beta}$)
-: $\theta_0$ = hypothesized value
-: $SE$ = standard error

***

-! The t-statistic measures:

<div style="background: #436b8bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
"How many standard errors is our estimate away from the null hypothesis?"
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*F-Test: Multiple Parameters or Variance Comparison*

$$F = \frac{MS_{\text{effect}}}{MS_{\text{error}}} = \frac{\text{Explained variance}}{\text{Unexplained variance}}$$

-: MS = Mean Square (variance estimate)
-: Large F → effect is larger than random noise

***

-! The F-statistic measures:

<div style="background: #436b8bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
"Is the variance explained by our model larger than the residual variance?"
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="big-picture-table" -->
## 2. Big Picture Overview

<div style="font-size: 0.62em; margin: 10px auto;">

| **Test** | **What is Tested?** | **Test Statistic** | **Typical Use Case** | **H₀** | **Interpretation** |
|:---------|:--------------------|:-------------------|:---------------------|:-------|:-------------------|
| One-sample t | Mean vs. reference | $t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$ | Does pH = 7.0? | $\mu = \mu_0$ | Large \|t\| → reject H₀ |
| Two-sample t | Means of two groups | $t = \frac{\bar{x}_1 - \bar{x}_2}{SE_{\text{diff}}}$ | Site A vs. Site B? | $\mu_1 = \mu_2$ | Large \|t\| → groups differ |
| Regression t | Single coefficient | $t = \frac{\hat{\beta}_j}{SE(\hat{\beta}_j)}$ | Is slope ≠ 0? | $\beta_j = 0$ | Large \|t\| → predictor matters |
| Regression F | Overall model | $F = \frac{MS_{\text{reg}}}{MS_{\text{res}}}$ | Does model explain y? | All $\beta_j = 0$ | Large F → model is useful |
| ANOVA F | Group differences | $F = \frac{MS_{\text{between}}}{MS_{\text{within}}}$ | Do seasons differ? | All $\mu_i$ equal | Large F → groups differ |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 12px; border-radius: 8px; margin: 15px auto; font-size: 0.8em; max-width: 90%;">
<b>Key Pattern:</b> t-tests compare <b>one parameter</b> to a reference. F-tests compare <b>variances</b> or test <b>multiple parameters</b> simultaneously.
</div>

---

<!-- .slide:id="df-intro" -->
## 3. Degrees of Freedom – The Most Important Exam Topic
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Why Degrees of Freedom Matter*

-! df determine the shape of the t- and F-distributions

-! Wrong df → wrong p-value → wrong conclusion!

***

-! On the exam, df questions are:
-: Frequently asked
-: Easy points if you understand the concept
-: Often missed due to formula confusion

***

-< Let's clarify once and for all!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Core Idea*

-! **df = Independent pieces of information available for estimation**

***

-! Every time you estimate a parameter, you **"use up"** one degree of freedom

***

-! General principle:

$$df = n - p$$

-: $n$ = number of observations
-: $p$ = number of estimated parameters

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="df-intuition" -->
## 3.1 What Degrees of Freedom Mean (Intuitive)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Constraint Interpretation*

-! Imagine you have 4 numbers that must sum to 40

-: You can freely choose: 8, 12, 15
-: The 4th number is forced: 40 - 8 - 12 - 15 = **5**

***

-! Only 3 values are "free" → **df = 3**

***

-! In statistics:

<div style="background: #619accff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
Once you know the sample mean and n-1 values, the last value is determined by the constraint $\sum x_i = n \cdot \bar{x}$
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why This Matters for Variance*

-! Sample variance uses $\bar{x}$ as an estimate of $\mu$

-! This estimation creates a constraint

***

$$s^2 = \frac{\sum(x_i - \bar{x})^2}{n-1}$$

-! We divide by $n-1$ (not $n$) because:
-: We estimated 1 parameter ($\bar{x}$)
-: df = $n - 1$ independent deviations

***

-! Dividing by $n$ would **underestimate** the true variance!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="df-table" -->
## 3.2 Degrees of Freedom in Different Contexts

<div style="font-size: 0.58em; margin: 10px auto;">

| **Context** | **df Formula** | **Why?** | **Example (n=20)** |
|:------------|:---------------|:---------|:-------------------|
| **One-sample t-test** | $df = n - 1$ | Estimate 1 parameter: $\bar{x}$ | df = 19 |
| **Two-sample t-test** (pooled) | $df = n_1 + n_2 - 2$ | Estimate 2 means: $\bar{x}_1$, $\bar{x}_2$ | n₁=10, n₂=10 → df = 18 |
| **Paired t-test** | $df = n_{pairs} - 1$ | Estimate 1 mean of differences | 10 pairs → df = 9 |
| **Regression t-test** (coefficient) | $df = n - p$ | Estimate p parameters (intercept + slopes) | 2 predictors → df = 17 |
| **Regression F-test** (overall) | $df_1 = p-1$, $df_2 = n-p$ | Numerator: # predictors; Denom: residual df | df₁ = 2, df₂ = 17 |
| **One-way ANOVA** | $df_{between} = k-1$, $df_{within} = n-k$ | k groups; total n observations | 4 groups → df₁ = 3, df₂ = 16 |
| **Full factorial DOE** | $df_{effect}$ = levels - 1 per factor | Main effects and interactions | 2×2 design: df_A = 1, df_B = 1, df_AB = 1 |

</div>

<div style="background: #702914ff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 12px auto; font-size: 0.75em; max-width: 90%;">
<b>Exam Tip:</b> Always count parameters! df = observations - parameters estimated.
</div>

---

<!-- .slide:id="df-regression-detail" -->
## df in Regression: A Closer Look
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Simple Linear Regression*

$$y = \beta_0 + \beta_1 x + \varepsilon$$

-! Parameters estimated: 2 ($\beta_0$, $\beta_1$)

-! Residual df = $n - 2$

***

*Multiple Regression*

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + ... + \beta_k x_k + \varepsilon$$

-! Parameters estimated: $k + 1$ (intercept + k slopes)

-! Residual df = $n - (k + 1) = n - p$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*F-Test for Overall Model*

$$F = \frac{MS_{reg}}{MS_{res}} = \frac{SS_{reg}/(p-1)}{SS_{res}/(n-p)}$$

-! Numerator df = $p - 1$ (number of predictors, excluding intercept)

-! Denominator df = $n - p$ (residual df)

***

<div style="background: #1a4d7a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 10px 0; font-size: 0.8em;">
<b>Remember:</b><br>
• t-test for each coefficient: df = n - p<br>
• F-test for whole model: df₁ = p-1, df₂ = n-p
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="df-anova-detail" -->
## df in ANOVA: Partitioning Correctly
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*One-Way ANOVA*

-! Total observations: $N = \sum_{i=1}^{k} n_i$

-! k groups with means $\bar{x}_1, ..., \bar{x}_k$

***

$$df_{total} = N - 1$$

$$df_{between} = k - 1$$

$$df_{within} = N - k$$

***

-! Check: $df_{total} = df_{between} + df_{within}$

$(N-1) = (k-1) + (N-k)$ ✓

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Two-Way ANOVA / Factorial DOE*

-! Factor A with $a$ levels: $df_A = a - 1$

-! Factor B with $b$ levels: $df_B = b - 1$

-! Interaction A×B: $df_{AB} = (a-1)(b-1)$

-! Error: $df_E = N - ab$ (if no replicates: need to pool)

***

<div style="background: #436b8bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
<b>Example: 2² factorial</b><br>
• df_A = 1, df_B = 1, df_AB = 1<br>
• With 2 replicates: N = 8, df_E = 8 - 4 = 4
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="se-intro" -->
## 4. Standard Error – Same Name, Different Meaning
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Common Thread*

-! **Standard Error (SE)** always means:

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.9em;">
The standard deviation of an <b>estimator</b>
</div>

***

-! It quantifies: "How much would my estimate vary if I repeated the sampling?"

***

-! But the **formula differs** depending on:
-: What you are estimating
-: What variance is available

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why Students Get Confused*

-! Same concept, different sources of variance:

| Context | Variance Source |
|:--------|:----------------|
| Mean | Sample variance $s^2$ |
| Regression | Residual variance $\hat{\sigma}^2$ |
| ANOVA | Mean Square Error (MSE) |

***

-! The **form** of SE also depends on:
-: Sample size
-: Design matrix structure
-: Number of groups

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="se-mean" -->
## 4.1 Standard Error of the Mean
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Formula*

$$SE(\bar{x}) = \frac{s}{\sqrt{n}}$$

-: $s$ = sample standard deviation
-: $n$ = sample size

***

*Where It Comes From*

-! Variance of sample mean: $Var(\bar{x}) = \frac{\sigma^2}{n}$

-! We estimate $\sigma^2$ with $s^2$

-! Take square root → standard error

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Connection to t-Test*

$$t = \frac{\bar{x} - \mu_0}{SE(\bar{x})} = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$$

***

*Key Points*

-! SE decreases with larger n (more precision)

-! SE increases with larger s (more variability)

-! **Not the same as** standard deviation!
-: SD describes spread of individual observations
-: SE describes uncertainty in the mean estimate

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="se-regression" -->
## 4.2 Standard Error in Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Residual Variance*

$$\hat{\sigma}^2 = \frac{SS_{res}}{n-p} = \frac{\sum(y_i - \hat{y}_i)^2}{n-p}$$

-: $SS_{res}$ = sum of squared residuals
-: $n-p$ = residual degrees of freedom

***

*SE for Regression Coefficients*

$$SE(\hat{\beta}_j) = \hat{\sigma} \sqrt{(X'X)^{-1}_{jj}}$$

-: Depends on residual variance $\hat{\sigma}^2$
-: Depends on design matrix $X$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why SE Differs Per Coefficient*

-! The term $(X'X)^{-1}_{jj}$ captures:
-: Spread of predictor $x_j$
-: Correlation with other predictors

***

-! More spread in $x_j$ → smaller SE → more precise estimate

-! High correlation with other predictors → larger SE → multicollinearity

***

<div style="background: #702914ff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
<b>Key insight:</b> Same residual variance, but different SE for each coefficient!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="se-anova" -->
## 4.3 Standard Error in ANOVA / DOE
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Mean Square Error (MSE)*

$$MSE = MS_{within} = \frac{SS_{within}}{df_{within}}$$

-! MSE is the **pooled variance** estimate

-! Combines variance from all groups

-! Assumes equal variance in all groups (homoscedasticity)

***

*Why Pooling?*

-! More df → more reliable variance estimate

-! df = $N - k$ (all observations minus number of groups)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*SE for Group Means*

$$SE(\bar{x}_i) = \sqrt{\frac{MSE}{n_i}}$$

-: All groups share the **same** MSE
-: SE differs only by group size $n_i$

***

*SE for Difference Between Means*

$$SE(\bar{x}_i - \bar{x}_j) = \sqrt{MSE \cdot \left(\frac{1}{n_i} + \frac{1}{n_j}\right)}$$

***

-! This is used in post-hoc tests (Tukey, etc.)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="se-summary" -->
## Standard Error Summary

<div style="background: #1a4d7a; color: #ffffff; padding: 15px; border-radius: 8px; margin: 20px auto; max-width: 90%;">

<div style="font-size: 1.1em; font-weight: bold; margin-bottom: 12px; text-align: center;">
Same Idea: Uncertainty of an Estimate – Different Source of Variance
</div>

<div style="font-size: 0.75em;">

| **Context** | **What is Estimated** | **Variance Used** | **SE Formula** |
|:------------|:----------------------|:------------------|:---------------|
| One-sample | Sample mean $\bar{x}$ | Sample variance $s^2$ | $s/\sqrt{n}$ |
| Two-sample | Difference $\bar{x}_1 - \bar{x}_2$ | Pooled $s_p^2$ | $s_p\sqrt{1/n_1 + 1/n_2}$ |
| Regression | Coefficient $\hat{\beta}_j$ | Residual $\hat{\sigma}^2$ | $\hat{\sigma}\sqrt{(X'X)^{-1}_{jj}}$ |
| ANOVA | Group mean $\bar{x}_i$ | MSE (pooled) | $\sqrt{MSE/n_i}$ |

</div>

</div>

---

<!-- .slide:id="decision-guide" -->
## 5. Decision Guide: When Do I Use What?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Start From the Scientific Question*

-? **Comparing a single mean to a reference?**
-> One-sample t-test

***

-? **Comparing means of exactly 2 groups?**
-> Two-sample t-test (or paired if matched)

***

-? **Comparing means of 3+ groups?**
-> ANOVA (not multiple t-tests!)

***

-? **Testing a relationship between variables?**
-> Regression

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*t-Test or F-Test?*

-? **Testing ONE parameter?**
-> t-test
-: Is this coefficient ≠ 0?
-: Is this mean different?

***

-? **Testing MULTIPLE parameters or overall model?**
-> F-test
-: Is at least one coefficient ≠ 0?
-: Do group means differ overall?
-: Is factor effect significant?

***

<div style="background: #2d5016; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>Simple rule:</b> t for <b>one</b>, F for <b>many</b>
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="decision-flowchart" -->
## Decision Flowchart

<div style="font-size: 0.7em; margin: 10px auto;">

```
                    START: What is your research question?
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
    Compare means?          Model relationship?      Multiple factors?
            │                       │                       │
     ┌──────┴──────┐               │                       │
     ▼             ▼               ▼                       ▼
 1 group?     2 groups?       Regression               ANOVA/DOE
     │             │               │                       │
     ▼             ▼               │                       │
 1-sample     2-sample         ┌───┴───┐              ┌────┴────┐
  t-test       t-test          ▼       ▼              ▼         ▼
     │             │        Single    Overall      Overall    Post-hoc
     ▼             ▼        coef?     model?       test?      tests?
   df=n-1      df=n₁+n₂-2     │         │            │          │
                              ▼         ▼            ▼          ▼
                           t-test    F-test       F-test     t-tests
                           df=n-p   df₁=p-1     df₁=k-1    (with MSE)
                                    df₂=n-p     df₂=N-k
```

</div>

---

<!-- .slide:id="example1-intro" -->
## 6. Interactive Examples (Exam-Style)

### Example 1: Mean Comparison

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Scenario:</b><br>
You measure nitrate concentrations (mg/L) at a drinking water source over 8 days:<br>
<code>[9.8, 10.2, 11.1, 10.5, 9.9, 10.8, 10.3, 10.6]</code><br><br>
The regulatory limit is 10.0 mg/L. Does the mean concentration exceed the limit?
</div>

***

-? **Questions:**
1. Which test should you use?
2. What are the degrees of freedom?
3. What is the standard error formula?

---

<!-- .slide:id="example1-think" -->
## Example 1: Think First!

<div style="background: #436b8bff; color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 0.9em;">
<b>Hints:</b>
<ul style="margin-top: 10px;">
<li>Are we comparing to a fixed reference value?</li>
<li>How many groups do we have?</li>
<li>What parameter are we estimating?</li>
</ul>
</div>

***

-! Take 30 seconds to think before looking at the solution!

---

<!-- .slide:id="example1-solution" -->
## Example 1: Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Answers*

1. **Which test?**
-= One-sample t-test (one-tailed, $H_1: \mu > 10$)
-: Comparing a sample mean to a known reference

2. **Degrees of freedom?**
-= df = n - 1 = 8 - 1 = **7**
-: We estimate 1 parameter (the mean)

3. **Standard error?**
-= $SE = \frac{s}{\sqrt{n}}$
-: Uses sample standard deviation

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Calculation*

-! Sample mean: $\bar{x} = 10.4$ mg/L
-! Sample SD: $s \approx 0.42$ mg/L

$$SE = \frac{0.42}{\sqrt{8}} \approx 0.15$$

$$t = \frac{10.4 - 10.0}{0.15} \approx 2.67$$

-! With df = 7 and α = 0.05 (one-tailed):
-: Critical t = 1.895
-: 2.67 > 1.895 → **Reject H₀**

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example2-intro" -->
## Example 2: Linear Regression

<div style="background: #619accff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Scenario:</b><br>
You model phosphorus concentration (y) as a function of river discharge (x) and season indicator (z):<br><br>
$y = \beta_0 + \beta_1 x + \beta_2 z + \varepsilon$<br><br>
Data: n = 25 observations. Software output shows t = 3.2 for $\hat{\beta}_1$ (discharge effect).
</div>

***

-? **Questions:**
1. What does the t-test for $\hat{\beta}_1$ test?
2. What are the degrees of freedom?
3. What variance is used in the standard error?
4. How would you test if the overall model is significant?

---

<!-- .slide:id="example2-think" -->
## Example 2: Think First!

<div style="background: #436b8bff; color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 0.9em;">
<b>Hints:</b>
<ul style="margin-top: 10px;">
<li>Count the parameters: intercept + how many slopes?</li>
<li>For a single coefficient vs. whole model: which test?</li>
<li>Residual variance comes from what?</li>
</ul>
</div>

***

-! Take 30 seconds to think before looking at the solution!

---

<!-- .slide:id="example2-solution" -->
## Example 2: Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Answers*

1. **What does t-test for $\hat{\beta}_1$ test?**
-= $H_0: \beta_1 = 0$ (no effect of discharge)
-: Tests if the coefficient is significantly different from zero

2. **Degrees of freedom?**
-= df = n - p = 25 - 3 = **22**
-: p = 3 parameters ($\beta_0$, $\beta_1$, $\beta_2$)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
3. **What variance is used?**
-= Residual variance: $\hat{\sigma}^2 = \frac{SS_{res}}{n-p}$
-: Not sample variance of y!

4. **Overall model test?**
-= F-test with df₁ = p-1 = 2, df₂ = n-p = 22
-: Tests $H_0:$ all slopes = 0

$$F = \frac{MS_{reg}}{MS_{res}} = \frac{SS_{reg}/2}{SS_{res}/22}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example3-intro" -->
## Example 3: ANOVA / DOE

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Scenario:</b><br>
You compare chlorophyll-a concentrations across 4 seasons at a lake. Each season has 6 measurements (N = 24 total).<br><br>
ANOVA output shows: SS_between = 120, SS_within = 80
</div>

***

-? **Questions:**
1. What test statistic should you compute?
2. What are the numerator and denominator df?
3. What is the F-value?
4. Why do we use pooled variance (MSE)?

---

<!-- .slide:id="example3-think" -->
## Example 3: Think First!

<div style="background: #436b8bff; color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 0.9em;">
<b>Hints:</b>
<ul style="margin-top: 10px;">
<li>How many groups? → df_between</li>
<li>Total observations minus groups? → df_within</li>
<li>MS = SS / df</li>
<li>F = MS_between / MS_within</li>
</ul>
</div>

***

-! Take 30 seconds to think before looking at the solution!

---

<!-- .slide:id="example3-solution" -->
## Example 3: Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Answers*

1. **Test statistic?**
-= F-statistic (comparing variance components)

2. **Degrees of freedom?**
-= Numerator: $df_1 = k - 1 = 4 - 1 = $ **3**
-= Denominator: $df_2 = N - k = 24 - 4 = $ **20**

<!-- /position -->
<!-- position={row: 1, column: 2} -->
3. **F-value?**

$$MS_{between} = \frac{120}{3} = 40$$

$$MS_{within} = \frac{80}{20} = 4$$

$$F = \frac{40}{4} = 10$$

4. **Why pooled variance?**
-= More df → more reliable estimate
-= Assumes equal variance across seasons
-= All groups contribute to error estimate

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="common-mistakes" -->
## 7. Typical Mistakes to Avoid (Exam Warnings)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*df Mistakes*

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Forgetting parameter count</b><br>
Regression df = n - p, not n - 1 or n - 2
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Confusing F-test df</b><br>
Numerator df ≠ denominator df! Always specify both.
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Using n instead of n-1</b><br>
Sample variance divides by n-1, not n.
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Variance/SE Mistakes*

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Mixing up SD and SE</b><br>
SD: spread of data. SE: uncertainty of estimate.
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Using wrong variance source</b><br>
Regression uses residual variance, not sample variance of y!
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Applying t-test logic in ANOVA</b><br>
ANOVA compares variances, not means directly.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="more-mistakes" -->
## More Common Mistakes
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Conceptual Mistakes*

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Multiple t-tests instead of ANOVA</b><br>
3+ groups → always use ANOVA first (α-inflation!)
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Confusing t² = F relationship</b><br>
Only true when testing ONE parameter!
</div>

<div style="background: #8B0000; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>❌ Forgetting assumptions</b><br>
Normality, independence, equal variances (where required)
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Exam Strategy*

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>✓ Always state which test</b><br>
Don't just calculate – name the test!
</div>

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>✓ Show df calculation</b><br>
Write: "df = n - p = 25 - 3 = 22"
</div>

<div style="background: #2d5016; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>✓ Identify variance source</b><br>
"Using residual variance" or "Using MSE"
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="final-summary" -->
## Final Summary
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Big Picture*

-= t-tests and F-tests both compare **signal to noise**

-= t² = F when testing **one** parameter

-= df = observations - parameters estimated

-= SE = uncertainty of an estimate (source depends on context)

***

*Quick Reference*

| Situation | Test | df |
|:----------|:-----|:---|
| 1 mean vs. ref | t | n-1 |
| 2 means | t | n₁+n₂-2 |
| 1 coefficient | t | n-p |
| Overall model | F | (p-1, n-p) |
| k groups | F | (k-1, N-k) |

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Good Luck on the Exam!*

<div style="background: #1a4d7a; color: #ffffff; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 0.9em;">
<b>Remember:</b>
<ul style="margin-top: 10px;">
<li>Start from the research question</li>
<li>Identify what you're comparing</li>
<li>Count parameters for df</li>
<li>Know your variance source</li>
<li>Check your assumptions</li>
</ul>
</div>

***

-< **Same ideas, different contexts!**

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="cheat-sheet" -->
## Exam Cheat Sheet

<div style="font-size: 0.55em; margin: 5px auto;">

| **Test** | **Formula** | **df** | **SE Uses** | **H₀** |
|:---------|:------------|:-------|:------------|:-------|
| 1-sample t | $t = \frac{\bar{x} - \mu_0}{s/\sqrt{n}}$ | $n-1$ | Sample variance $s^2$ | $\mu = \mu_0$ |
| 2-sample t | $t = \frac{\bar{x}_1 - \bar{x}_2}{s_p\sqrt{1/n_1 + 1/n_2}}$ | $n_1+n_2-2$ | Pooled variance $s_p^2$ | $\mu_1 = \mu_2$ |
| Paired t | $t = \frac{\bar{d}}{s_d/\sqrt{n}}$ | $n-1$ | Variance of differences | $\mu_d = 0$ |
| Reg. coef. t | $t = \frac{\hat{\beta}_j}{SE(\hat{\beta}_j)}$ | $n-p$ | Residual variance $\hat{\sigma}^2$ | $\beta_j = 0$ |
| Reg. F | $F = \frac{MS_{reg}}{MS_{res}}$ | $(p-1, n-p)$ | — | All $\beta_j = 0$ |
| ANOVA F | $F = \frac{MS_{between}}{MS_{within}}$ | $(k-1, N-k)$ | — | All $\mu_i$ equal |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 10px; border-radius: 8px; margin: 10px auto; font-size: 0.75em; max-width: 95%;">
<b>Key formulas:</b> $s^2 = \frac{\sum(x_i-\bar{x})^2}{n-1}$ &nbsp;|&nbsp; $SE(\bar{x}) = \frac{s}{\sqrt{n}}$ &nbsp;|&nbsp; $MS = \frac{SS}{df}$ &nbsp;|&nbsp; $F = \frac{MS_{effect}}{MS_{error}}$
</div>

---

<!-- .slide:id="linreg-recap-intro" -->
## 8. Linear Regression Recap – One Model, Many Faces
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Unifying Perspective*

-! Throughout this course, you encountered linear models in different disguises:
-: Simple and multiple regression
-: ANOVA for group comparisons
-: DOE for factorial experiments

***

-< They are ALL the same model!

***

-! The only difference is the **structure of X** (the design matrix)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why This Matters for the Exam*

-= If you understand the design matrix, you understand:
-: What parameters are estimated
-: How many degrees of freedom you have
-: Where standard errors come from
-: Why F-tests work the same way everywhere

***

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Key insight:</b><br>
OLS, ANOVA, and DOE are not three different methods – they are one method with three different X matrices.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="design-matrix-intro" -->
## 8.1 The Unifying Idea: The Design Matrix
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The General Linear Model*

-! Every linear model has the same form:

$$\mathbf{y} = \mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon}$$

-: $\mathbf{y}$ = vector of observations (n × 1)
-: $\mathbf{X}$ = design matrix (n × p)
-: $\boldsymbol{\beta}$ = parameter vector (p × 1)
-: $\boldsymbol{\varepsilon}$ = error vector (n × 1)

***

-! The **design matrix X** encodes:
-: What model terms exist
-: How observations relate to parameters

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Reading the Design Matrix*

-= **Rows** = observations (one per measurement)

-= **Columns** = model terms (one per parameter)

***

-! The entry $X_{ij}$ tells us:

<div style="background: #436b8bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
"How much does observation i depend on parameter j?"
</div>

***

-! Once X is defined, **everything else follows**:
-: Parameter estimates $\hat{\beta}$
-: Residuals and residual variance
-: Standard errors and test statistics

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="design-matrix-example" -->
## Design Matrix: A Simple Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Simple Linear Regression*

$$y_i = \beta_0 + \beta_1 x_i + \varepsilon_i$$

-! With 4 observations at x = 1, 2, 3, 4:

$$\mathbf{X} = \begin{pmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \\ 1 & 4 \end{pmatrix}$$

-: Column 1: all 1s (intercept)
-: Column 2: x-values (slope)

***

-! Number of parameters: p = 2
-! Residual df = n - p = 4 - 2 = 2

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*One-Way ANOVA (3 groups)*

$$y_{ij} = \mu + \alpha_i + \varepsilon_{ij}$$

-! With 2 observations per group (reference coding):

$$\mathbf{X} = \begin{pmatrix} 1 & 0 & 0 \\ 1 & 0 & 0 \\ 1 & 1 & 0 \\ 1 & 1 & 0 \\ 1 & 0 & 1 \\ 1 & 0 & 1 \end{pmatrix}$$

-: Column 1: intercept (= Group 1 mean)
-: Columns 2-3: dummy variables for Groups 2, 3

***

-! Parameters: p = 3
-! Residual df = 6 - 3 = 3

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="everything-is-regression" -->
## Why Everything is Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Same Estimation*

-! Regardless of context, OLS always solves:

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}'\mathbf{X})^{-1}\mathbf{X}'\mathbf{y}$$

***

-! The **same formula** gives you:
-: Regression slopes (continuous X)
-: Group mean differences (dummy-coded X)
-: Factor effects (contrast-coded X)

***

-= Different X → different interpretation of β

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Same Testing*

-! Residual variance is always:

$$\hat{\sigma}^2 = \frac{\mathbf{e}'\mathbf{e}}{n - p} = \frac{SS_{res}}{df_{res}}$$

***

-! Standard errors always come from:

$$SE(\hat{\beta}_j) = \hat{\sigma} \sqrt{(\mathbf{X}'\mathbf{X})^{-1}_{jj}}$$

***

-! F-tests always compare:

$$F = \frac{MS_{model}}{MS_{residual}}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ols-section" -->
## 8.2 Ordinary Least Squares (OLS)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What OLS Estimates*

-! OLS finds $\hat{\beta}$ that minimizes:

$$SS_{res} = \sum_{i=1}^{n}(y_i - \hat{y}_i)^2 = (\mathbf{y} - \mathbf{X}\hat{\boldsymbol{\beta}})'(\mathbf{y} - \mathbf{X}\hat{\boldsymbol{\beta}})$$

***

-! The solution (normal equations):

$$\hat{\boldsymbol{\beta}} = (\mathbf{X}'\mathbf{X})^{-1}\mathbf{X}'\mathbf{y}$$

***

-! Key insight: $\hat{\beta}$ depends entirely on:
-: The design matrix X
-: The response vector y

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Role of the Design Matrix*

-! $(\mathbf{X}'\mathbf{X})$ captures the "information" in X:
-: Diagonal: spread of each predictor
-: Off-diagonal: correlations between predictors

***

-! $(\mathbf{X}'\mathbf{X})^{-1}$ determines:
-: How precisely we can estimate each β
-: Standard errors of coefficients

***

<div style="background: #702914ff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
<b>If X has problems</b> (multicollinearity, poor spread), your estimates will be unstable!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ols-variance" -->
## OLS: Residuals and Variance
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Residuals*

-! Fitted values: $\hat{\mathbf{y}} = \mathbf{X}\hat{\boldsymbol{\beta}}$

-! Residuals: $\mathbf{e} = \mathbf{y} - \hat{\mathbf{y}}$

***

-! Residuals represent:
-: What the model cannot explain
-: The "noise" in the data

***

-! Sum of squared residuals:

$$SS_{res} = \mathbf{e}'\mathbf{e} = \sum e_i^2$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Residual Variance*

-! Unbiased estimate of error variance:

$$\hat{\sigma}^2 = \frac{SS_{res}}{n - p}$$

-: n = number of observations
-: p = number of parameters

***

-! **Degrees of freedom**: df = n - p

-! We "use up" p degrees of freedom estimating β

***

-! This is the **same variance** used for:
-: t-tests on coefficients
-: F-tests on the model
-: Confidence intervals

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="ols-se" -->
## OLS: Where Standard Errors Come From
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Variance of Coefficient Estimates*

-! The covariance matrix of $\hat{\beta}$:

$$Var(\hat{\boldsymbol{\beta}}) = \hat{\sigma}^2 (\mathbf{X}'\mathbf{X})^{-1}$$

***

-! Standard error for coefficient j:

$$SE(\hat{\beta}_j) = \hat{\sigma} \sqrt{(\mathbf{X}'\mathbf{X})^{-1}_{jj}}$$

***

-! Two ingredients:
-: Residual SD: $\hat{\sigma}$
-: Design matrix structure: $(\mathbf{X}'\mathbf{X})^{-1}_{jj}$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*What Affects SE?*

-! **Larger residual variance** → larger SE
-: More noise → less precise estimates

***

-! **Better spread in X** → smaller SE
-: More information → more precision

***

-! **Correlations in X** → larger SE
-: Multicollinearity inflates uncertainty

***

<div style="background: #1a4d7a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>Exam tip:</b> SE depends on both the noise level AND the experimental design!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-as-regression" -->
## 8.3 Regression ↔ ANOVA: Same Model, Different Questions
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*ANOVA is Linear Regression*

-! ANOVA with k groups is just regression with:
-: Categorical predictor
-: Dummy-coded X matrix

***

-! Group membership → indicator columns in X

| Obs | Group | X₁ | X₂ | X₃ |
|:----|:------|:--:|:--:|:--:|
| 1 | A | 1 | 0 | 0 |
| 2 | B | 1 | 1 | 0 |
| 3 | C | 1 | 0 | 1 |

-: X₁ = intercept (reference group A)
-: X₂ = effect of B vs. A
-: X₃ = effect of C vs. A

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Different Parameterization, Same Model*

-! ANOVA notation: $y_{ij} = \mu + \alpha_i + \varepsilon_{ij}$

-! Regression notation: $y = \beta_0 + \beta_1 D_1 + \beta_2 D_2 + \varepsilon$

***

-! The parameters have direct correspondence:
-: $\beta_0 = \mu_A$ (reference group mean)
-: $\beta_1 = \mu_B - \mu_A$ (difference from reference)
-: $\beta_2 = \mu_C - \mu_A$ (difference from reference)

***

-= Same estimates, same residuals, same F-test!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-variance" -->
## ANOVA: Variance Decomposition
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The F-Test Logic*

-! ANOVA F-test compares:

$$F = \frac{MS_{between}}{MS_{within}} = \frac{SS_{between}/(k-1)}{SS_{within}/(N-k)}$$

***

-! In regression terms:

$$F = \frac{MS_{model}}{MS_{residual}} = \frac{SS_{reg}/(p-1)}{SS_{res}/(n-p)}$$

***

-! Same calculation, different names:
-: $MS_{between}$ = $MS_{model}$
-: $MS_{within}$ = $MS_{residual}$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Degrees of Freedom*

-! Model df = number of group comparisons

$$df_{model} = k - 1 = p - 1$$

-: k groups → k-1 dummy variables

***

-! Residual df = observations minus parameters

$$df_{residual} = N - k = n - p$$

***

-! Total df:

$$df_{total} = N - 1 = df_{model} + df_{residual}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="doe-perspective" -->
## 8.4 DOE Perspective: Design Matrix as Experimental Plan
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The DOE Mindset*

-! In observational studies:
-: Data comes first
-: X is discovered from the data
-: Hope for good properties

***

-! In designed experiments:
-: X is planned **before** data collection
-: Experimenter **chooses** the rows of X
-: Good properties are **guaranteed**

***

-< DOE starts from X, not from y!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Columns of X in DOE*

-! Each column represents:
-: A **main effect** (factor)
-: An **interaction** (factor × factor)

***

-! For a 2² factorial design:

| Run | A | B | A×B |
|:----|:-:|:-:|:---:|
| 1 | -1 | -1 | +1 |
| 2 | +1 | -1 | -1 |
| 3 | -1 | +1 | -1 |
| 4 | +1 | +1 | +1 |

-: Columns are factors and interactions
-: Rows are experimental runs (your recipe!)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="doe-orthogonality" -->
## DOE: Orthogonality and Balance
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Orthogonality?*

-! Columns of X are **orthogonal** if:

$$\mathbf{X}_i' \mathbf{X}_j = 0 \quad \text{for } i \neq j$$

***

-! In a full factorial design:
-: Every column is orthogonal to every other
-: Effects are **independent**
-: No multicollinearity!

***

-! Consequence: $(\mathbf{X}'\mathbf{X})$ is diagonal
-: Simple inversion
-: Each effect estimated independently

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Why This Matters*

-! **Simple interpretation**
-: Effect of A doesn't depend on B
-: No confounding between effects

***

-! **Transparent df accounting**
-: Each effect uses exactly 1 df (for 2-level factors)
-: No ambiguity about what is tested

***

-! **Maximum precision**
-: Balanced design = minimum SE
-: All observations contribute equally

***

<div style="background: #2d5016; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>DOE advantage:</b> You <i>design</i> a good X instead of hoping for one!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="doe-df" -->
## DOE: Degrees of Freedom Made Transparent
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*df per Effect*

-! Main effect with L levels: df = L - 1

-! For 2-level factors: df = 1 per main effect

***

-! Interaction A×B: df = $(L_A - 1)(L_B - 1)$

-! For 2-level factors: df = 1 per interaction

***

-! **Full 2² factorial:**
-: df_A = 1
-: df_B = 1
-: df_AB = 1
-: Total model df = 3

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Error df in DOE*

-! If each run is replicated r times:

$$df_{error} = N - \text{(number of unique runs)}$$

***

-! **2² with 2 replicates:**
-: N = 4 × 2 = 8 observations
-: Unique runs = 4
-: df_error = 8 - 4 = 4

***

<div style="background: #1a4d7a; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>Key:</b> Replicates give you error df for testing!
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="comparison-table" -->
## 8.5 Comparison Table: OLS vs. ANOVA vs. DOE

<div style="font-size: 0.55em; margin: 10px auto;">

| **Aspect** | **OLS Regression** | **ANOVA** | **DOE** |
|:-----------|:-------------------|:----------|:--------|
| **Scientific question** | How does y change with x? | Do group means differ? | Which factors affect y? |
| **Structure of X** | Continuous predictors (+ intercept) | Dummy-coded categories | Coded factors & interactions |
| **Meaning of β** | Slopes (rate of change) | Group differences from reference | Factor effects (half-effects) |
| **Source of variance** | Residual variance $\hat{\sigma}^2$ | MSE (pooled within-group) | MSE from replicates |
| **Typical test** | t (per coefficient), F (overall) | F (overall), post-hoc t | F (per effect) |
| **df logic** | df = n - p (observations - parameters) | df_between = k-1, df_within = N-k | df per effect = (levels - 1) |
| **X is...** | Observed from data | Observed (group membership) | **Designed** by experimenter |

</div>

<div style="background: #1a4d7a67; color: #ffffff; padding: 10px; border-radius: 8px; margin: 12px auto; font-size: 0.75em; max-width: 95%;">
<b>Unifying principle:</b> All three are $\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\varepsilon}$ — they differ only in how X is constructed!
</div>

---

<!-- .slide:id="example-slr" -->
## 8.6 Interactive Examples

### Example 1: Simple Linear Regression

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Scenario:</b><br>
You model chloride concentration (y) as a function of distance from the coast (x) using 10 sampling sites.
</div>

***

-? **Questions (think in terms of X):**
1. What does X look like? How many columns?
2. What do the columns represent?
3. How many parameters are estimated?
4. What are the degrees of freedom for the residuals?

---

<!-- .slide:id="example-slr-solution" -->
## Example 1: Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Think in Terms of X*

-! Model: $y = \beta_0 + \beta_1 x + \varepsilon$

-! X has **2 columns**:

$$\mathbf{X} = \begin{pmatrix} 1 & x_1 \\ 1 & x_2 \\ \vdots & \vdots \\ 1 & x_{10} \end{pmatrix}$$

-: Column 1: all 1s (intercept $\beta_0$)
-: Column 2: distance values (slope $\beta_1$)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Parameters and df*

-! **Parameters estimated:** p = 2
-: $\beta_0$ = intercept (concentration at coast)
-: $\beta_1$ = slope (change per km)

***

-! **Residual df:** n - p = 10 - 2 = **8**

***

-! **Standard errors** come from:
-: Residual variance $\hat{\sigma}^2 = SS_{res}/8$
-: The spread and pattern in x-values

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-anova" -->
## Example 2: One-Way ANOVA

<div style="background: #619accff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Scenario:</b><br>
You compare turbidity levels across 4 different water treatment plants. Each plant has 5 measurements (N = 20 total).
</div>

***

-? **Questions (think in terms of X):**
1. How is X encoded? What do the columns represent?
2. How many parameters are estimated?
3. What variance is shared across all plants?
4. What are the df for the F-test?

---

<!-- .slide:id="example-anova-solution" -->
## Example 2: Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Think in Terms of X*

-! X has **4 columns** (reference coding):

| Obs | Plant | X₀ | X₁ | X₂ | X₃ |
|:----|:------|:--:|:--:|:--:|:--:|
| 1 | A | 1 | 0 | 0 | 0 |
| 6 | B | 1 | 1 | 0 | 0 |
| 11 | C | 1 | 0 | 1 | 0 |
| 16 | D | 1 | 0 | 0 | 1 |

-: X₀ = intercept (Plant A mean)
-: X₁, X₂, X₃ = differences from Plant A

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Parameters, Variance, and df*

-! **Parameters:** p = 4 (intercept + 3 dummies)

***

-! **Shared variance:** MSE (pooled within-group variance)
-: All plants contribute to one error estimate
-: Assumes equal variance across plants

***

-! **F-test df:**
-: Numerator: k - 1 = 4 - 1 = **3**
-: Denominator: N - k = 20 - 4 = **16**

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-doe" -->
## Example 3: Full Factorial DOE

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Scenario:</b><br>
You design a 2² experiment to optimize coagulant efficiency. Factors: pH (low/high) and dose (low/high). Each combination is replicated twice (N = 8).
</div>

***

-? **Questions (think in terms of X):**
1. Which columns appear in X?
2. How many df per effect?
3. What are the error df?
4. Why does orthogonality matter here?

---

<!-- .slide:id="example-doe-solution" -->
## Example 3: Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Think in Terms of X*

-! X has **4 columns** (intercept + 3 effects):

| Run | Intercept | pH | Dose | pH×Dose |
|:----|:---------:|:--:|:----:|:-------:|
| 1,2 | 1 | -1 | -1 | +1 |
| 3,4 | 1 | +1 | -1 | -1 |
| 5,6 | 1 | -1 | +1 | -1 |
| 7,8 | 1 | +1 | +1 | +1 |

-: Columns: mean, main effects, interaction

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*df and Orthogonality*

-! **df per effect:**
-: pH: 2 - 1 = **1**
-: Dose: 2 - 1 = **1**
-: pH×Dose: (2-1)(2-1) = **1**

***

-! **Error df:** N - (unique runs) = 8 - 4 = **4**

***

-! **Why orthogonality matters:**
-: Each effect is estimated independently
-: No confounding between pH and Dose
-: Interaction is cleanly separated

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="linreg-survival" -->
## 8.7 Exam Survival Summary

<div style="background: #1a4d7a; color: #ffffff; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 90%;">

<div style="font-size: 1.1em; font-weight: bold; margin-bottom: 15px; text-align: center;">
If You Understand X, You Understand the Model
</div>

<div style="font-size: 0.85em;">

-= **Linear regression is the general model** – OLS, ANOVA, and DOE are all special cases

-= **ANOVA and DOE differ only in X** – categorical predictors vs. designed factors

-= **df = observations – parameters** – always count the columns of X

-= **Standard errors come from residual variance AND X** – both matter!

-= **Orthogonal X simplifies everything** – effects are independent, df are clear

</div>

</div>

---

<!-- .slide:id="linreg-final" -->
## The Design Matrix Perspective
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*When You See a Problem...*

1. **Identify what X looks like**
-: Continuous columns? → Regression
-: Dummy columns? → ANOVA
-: Coded columns? → DOE

2. **Count columns of X**
-: This gives you p (number of parameters)

3. **Calculate df**
-: Residual df = n - p

4. **Identify variance source**
-: Always residual variance (MSE)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Quick Reference*

| Context | Columns of X | Parameters |
|:--------|:-------------|:-----------|
| Simple regression | 1, x | 2 |
| Multiple regression | 1, x₁, x₂, ... | k+1 |
| One-way ANOVA (k groups) | 1, D₁, ..., D_{k-1} | k |
| 2² factorial | 1, A, B, AB | 4 |
| 2³ factorial | 1, A, B, C, AB, AC, BC, ABC | 8 |

***

<div style="background: #2d5016; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.85em;">
<b>Final tip:</b> Draw X for any problem – it makes everything concrete!
</div>

<!-- /position -->
<!-- /layout -->
