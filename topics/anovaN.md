---
title: "N-way ANOVA (Factorial ANOVA)"
author: "Gerrit Renner"
keywords: ["ANOVA", "factorial ANOVA", "two-way ANOVA", "interaction", "main effect", "F-test", "water science"]
requirements: ["Hypothesis Testing", "Mean Values", "Variance", "t-Tests", "One-Way ANOVA"]
description: "Understanding and applying N-way (factorial) ANOVA for comparing means in water science with multiple factors"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- Hypothesis Testing
- Mean Values
- Variance
- t-Tests
- One-Way ANOVA
---

<!-- .slide:id="factorial-intro" -->
## Multi-Factor Experiments in Water Science
<!-- layout={rows: 1, columns: 2} --> 
<!-- position={row: 1, column: 1} --> 
-! In water science, outcomes often depend on multiple factors simultaneously (e.g., site and time of sampling). 
-! Example: We measure nutrient concentrations at several sites across different seasons.

-: We want to know if there are differences by site, by season, and whether seasonal changes are consistent across sites. 
<!-- /position --> 
<!-- position={row: 1, column: 2} --> 
-? Could we analyze each factor separately (e.g., run one-way ANOVA for site differences and another for seasonal differences)? 
-: That approach would ignore any interaction between site and season, and it’s less efficient. 
-? Question: How can we test the effects of multiple factors together, including their potential interaction? 
-< Answer: Use a factorial ANOVA (N-way ANOVA) to analyze all factors in one model. 
<!-- /position --> 
<!-- /layout -->

---

<!-- .slide:id="factorial-overview" -->
## What is Factorial (N-Way) ANOVA?
-! Factorial ANOVA extends one-way ANOVA to two or more factors.
-: Two-way ANOVA (for two factors) is the most common case, but designs can include 3, 4, ... factors (“N-way” ANOVA).

***

-! All factors are tested simultaneously in one analysis.
-: The method provides separate F-tests for each main effect (each factor individually) and for each interaction between factors.

***

-! Why factorial designs? They are more informative and economical:
-: We can detect whether factors act independently or interact (one factor’s effect changes across levels of another), and we avoid running multiple separate analyses.

---

<!-- .slide:id="main-vs-interaction" -->
## Main Effects vs. Interaction Effects
-? What is a "main effect"?
-: A main effect is the independent influence of one factor on the response, averaging over levels of other factors.
-: (E.g., a site main effect means some sites have higher/lower overall means than others, regardless of season.)

***

-? What is an "interaction effect"?
-: An interaction effect occurs if the effect of one factor depends on the level of another factor.
-: (E.g., the seasonal change in nutrient concentration might be large at one site but small at another – indicating a site × season interaction.)

---

<!-- .slide:id="interaction-illustration" -->
## Additive vs. Interactive Effects (Example)
<!-- layout={rows: 1, columns: 2} --> 
<!-- position={row: 1, column: 1} --> 
-! Additive Effects (No Interaction): In this scenario, the difference between Site 1 and Site 2 is the same in both Dry and Wet seasons.
-: The lines are parallel, indicating that the effect of season is uniform across sites.
-: Both factors influence the outcome, but their effects are additive and there is no interaction. 
<!-- /position --> 
<!-- position={row: 1, column: 2} --> 
-! Interaction Effects: Here, the difference between sites changes between the Dry and Wet seasons (the lines cross). 
-: Site 1 sees a larger seasonal increase than Site 2. 
-: This indicates a significant interaction, the effect of season depends on the site. 
-: In such cases, we say the factors have a non-additive (interactive) effect on the response. 
<!-- /position --> 
<!-- /layout -->

---

<!-- .slide:id="variance-partition" -->
## Partitioning Variation in Two-Way ANOVA
-! Just like one-way ANOVA, total variability is partitioned into explained and unexplained parts, but now with multiple factors:

***

-! Total Sum of Squares ($SS_{\text{Total}}$), overall variability of all observations around the grand mean.

***

-! $SS_A$ (Factor A): Variation due to differences between levels of factor A (averaged across factor B).

***

-! $SS_B$ (Factor B): Variation due to differences between levels of factor B (averaged across factor A).

***

-! $SS_{A\times B}$ (Interaction): Additional variation from the specific combination of A and B levels (beyond the additive effects of each factor alone).

***

-! $SS_{\text{Error}}$ (Residual): Remaining variation within each group (unexplained noise, variability within each combination of A and B levels).
***

-! These components add up:
$$SS_{\text{Total}} = SS_A + SS_B + SS_{A\times B} + SS_{\text{Error}}\,.$$

---

<!-- .slide:id="f-tests-factorial" -->
## F-Tests in Factorial ANOVA
-! ANOVA computes an F-statistic for each effect by comparing variance explained by that effect to residual variance. Each F follows an $F$-distribution under $H_0$.

***

-! Factor A: $F_A = \dfrac{MS_A}{MS_{\text{error}}}$ (with $df_1 = a − 1$, $df_2 = N − ab$).

***

-! Factor B: $F_B = \dfrac{MS_B}{MS_{\text{error}}}$ (with $df_1 = b − 1$, same $df_2$).

***

-! Interaction: $F_{A\times B} = \dfrac{MS_{A\times B}}{MS_{\text{error}}}$ (with $df_1 = (a − 1)(b − 1)$, same $df_2$). 
-: Each F-test yields a p-value for the null hypothesis of no effect for that term.

---

<!-- .slide:id="hypotheses-factorial" -->
## Hypotheses for Two-Way ANOVA
-! Factor A Main Effect: $H_{0}:$ All group means are equal across levels of factor A (no overall difference due to A).
-: (Example: All sites have the same true mean nutrient level.)

***

-! Factor B Main Effect: $H_{0}:$ All group means are equal across levels of factor B (no overall difference due to B).
-: (Example: Mean nutrient is the same in Dry vs. Wet season.)

***

-! Interaction A×B: $H_{0}:$ There is no interaction between A and B.
-: The effect of factor A is consistent for all levels of B (and vice versa). In other words, any differences among A levels are the same under each level of B (additivity holds).

---

<!-- .slide:id="factorial-assumptions" -->
## Assumptions of Factorial ANOVA
<!-- layout={rows: 1, columns: 2} --> 
<!-- position={row: 1, column: 1} --> 
-! 1. Independence:
-: Observations are independent of each other (both within and between factor level combinations).

***

-! 2. Normality:
-: The response is approximately normally distributed within each combination of factors (each group of observations corresponding to a specific set of factor levels follows a normal distribution).
-: We can check this via residual diagnostics (e.g., QQ-plots) for the ANOVA model.

***

-! 3. Homogeneity of Variances:
-: The variance of the response is equal across all groups (each factor-level combination has similar variance). This is also called homoscedasticity.
-: Can be tested with a Levene’s or Brown–Forsythe test extended to multiple groups. 
<!-- /position --> 
<!-- position={row: 1, column: 2} --> 
-! Robustness: ANOVA is fairly robust to moderate normality/variance violations if sample sizes are balanced and sufficiently large.
-: A balanced design (equal sample sizes in each cell) is ideal, as it helps robustness and simplifies interpretation (especially with interactions). 
-: If assumptions are seriously violated, consider data transformation or a non-parametric alternative. 
<!-- /position --> 
<!-- /layout -->

---

<!-- .slide:id="interpretation-followup" -->
## Interpreting Factorial ANOVA Results
-! Significant interaction (A×B):
-: If the interaction term is p < 0.05, the two factors do not act independently. Interpretation focuses on the interaction: examine how the effect of one factor differs across levels of the other.
-: Follow-up: Use interaction plots (mean response for each combination) to visualize the pattern. Consider conducting simple effects analyses (e.g., perform one-way ANOVA for factor A within each level of factor B, or vice versa) to explore the interaction in detail.

***

-! No significant interaction:
-: If the interaction is not significant (p ≥ 0.05), we generally interpret the main effects. Each significant main effect indicates a factor has an overall influence on the response.
-: Follow-up: For a significant main effect with multiple levels, use post-hoc tests (e.g., Tukey HSD) to determine which specific level means differ. These tests are similar to one-way ANOVA post-hocs, but applied to the factor within the factorial model.

***

-! Example interpretations:
-: If only A is significant: Different levels of A have different means (averaging over B), while B has no overall effect.
-: If both A and B are significant (no interaction): Each factor contributes an additive effect. We report both main effects (e.g., site differences and an overall seasonal difference).
-: If nothing is significant: No evidence that either factor (or their combination) affects the response in the population.

---

<!-- .slide:id="factorial-anova-r" -->
## Factorial ANOVA in R: Example
-! We can use base R functions aov() or lm() to perform a factorial ANOVA, specifying the formula with all factors and their interaction.
-: Use the * operator between factors to include both main effects and the interaction (e.g., FactorA * FactorB expands to FactorA + FactorB + FactorA:FactorB).
---
-! Example: Suppose we have a dataset of nutrient concentrations (nitrate) measured at 3 sites across 2 seasons (Dry/Wet). We fit a two-way ANOVA model and examine results:

# Sample data frame with factors Site and Season
site   <- factor(rep(c("Site1", "Site2", "Site3"), each = 4))
season <- factor(rep(c("Dry", "Wet"), times = 6))
nitrate <- c(5.1, 4.9, 5.3, 5.0,   # Site1 Dry (replicates)
             7.8, 7.5, 8.0, 7.6,   # Site1 Wet
             6.2, 5.9, 6.1, 6.0,   # Site2 Dry
             6.7, 7.0, 6.8, 7.1,   # Site2 Wet
             4.8, 5.2, 4.9, 5.1,   # Site3 Dry
             6.3, 6.5, 6.1, 6.4)   # Site3 Wet
data <- data.frame(site, season, nitrate)

# Two-way ANOVA model
model <- aov(nitrate ~ site * season, data = data)
summary(model)

***

-! The ANOVA summary output will include separate lines for site, season, and site:season interaction, each with an F-value and p-value.
-: For instance, we might find a significant site effect and season effect, but no significant interaction, meaning sites differ overall and seasons differ overall, but seasonal trends were similar across sites. In R, we could follow up with TukeyHSD(model, "site") to compare sites, or use interaction.plot(site, season, nitrate) to visualize the interaction.