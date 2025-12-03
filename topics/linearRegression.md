---
title: "Linear Regression"
author: "Gerrit Renner"
keywords: ["linear regression", "OLS", "least squares", "coefficients", "SSE", "design matrix", "normal equation", "confidence interval", "prediction interval"]
requirements: ["Hypothesis Testing", "Mean Values", "Variance", "t-Tests"]
description: "Understanding and applying linear regression in water science"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Warning:
-! This topic contains many mathematical concepts and may be challenging for beginners.

## Requirements
- Hypothesis Testing
- Mean Values
- Variance
- t-Tests

---

<!-- .slide:id="linear-regression-intro" -->
## Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is Linear Regression?*

-! A statistical method to model relationships between variables

-: Models the relationship between a *dependent variable* (response) and one or more *independent variables* (predictors)
-: Fits a *linear equation* to observed data

***

-! The general model:

$$y = f(x) + \varepsilon$$

-: $y$ = observed response
-: $f(x)$ = systematic component (linear function)
-: $\varepsilon$ = random error term

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Water Quality and Nutrient Levels*

-! Monitoring nitrate levels and algal growth in a lake

<div style="background: #1a588bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>Nitrate (x):</b> [1, 2, 3, 4, 5] mg/L
</div>

<div style="background: #436b8bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.8em;">
<b>Algal growth (y):</b> [10, 20, 35, 50, 70] µg/L
</div>

***

-? Is there a trend between nutrient levels and algal growth?

-? Can we predict algal growth if nitrate levels increase further?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-plot" -->

<div id="nitrate-algal-scatter" style="width: 100%; height: 100%; min-height: 800px;"></div>

<script src="resources/js/charts/nitrate_algal_scatter.js"></script>

---

<!-- .slide:id="applications" -->
## Where is Linear Regression Used?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Applications in Water Science*

-! **Trend Analysis**
-: Detecting changes in pollutant levels over time

***

-! **Calibration**
-: Relating instrument response to known concentrations

***

-! **Predictive Modeling**
-: Estimating future values (e.g., water quality metrics)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Practical Examples*

<div style="background: #702914ff; color: #ffffff; padding: 10px 14px; border-radius: 8px; margin: 8px 0; font-size: 0.75em;">
<b>Example 1:</b><br>
Monitoring nitrate levels in a river over 10 years to detect trends.
</div>

<div style="background: #702914ff; color: #ffffff; padding: 10px 14px; border-radius: 8px; margin: 8px 0; font-size: 0.75em;">
<b>Example 2:</b><br>
Calibrating a spectrophotometer for phosphate detection.
</div>

<div style="background: #702914ff; color: #ffffff; padding: 10px 14px; border-radius: 8px; margin: 8px 0; font-size: 0.75em;">
<b>Example 3:</b><br>
Predicting algal bloom occurrence based on nutrient inputs.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="terminology" -->
## Important Terminology
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Variables and Errors*

-! *Dependent variable ($y$)*
-: The value we want to explain or predict

***

-! *Independent variable ($x$)*
-: The input or predictor variable(s)

***

-! *Error term ($\varepsilon$)*
-: The difference between observed $y$ and predicted ${y\_{hat}}$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Model Parameters*

-! *Coefficients ($\beta_0, \beta_1, \dots, \beta_n$)*
-: Intercept, slope, and higher-order terms
-: Describe the layout of the regression line

***

-! *Estimates: $y \leftrightarrow {y\_{hat}}$, $\beta \leftrightarrow {\beta\_{hat}}$*
-: Predicted values based on the regression model
-: The hat symbol (^) denotes estimates

***

-! *Uncertainties: $\sigma^2$, $s^2$*
-: How confident are we in the model?
-: How precise are the coefficients?

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="our-goal" -->
## Our Goal in Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
We want to find the *best-fitting* linear model that describes the relationship between $x$ and $y$.
$$ y = f(b0, b1, ..., bn, x) + \varepsilon  = {y\_{hat}} + \varepsilon $$
-: $y$ = observed response
-: $f(b0, b1, ..., bn, x)$ = linear function with coefficients
-: $x$ = predictor variable(s)
-: $\varepsilon$ = random error term
-: ${y\_{hat}}$ = predicted response from the model
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Best-Fitting Model*
-! The model that minimizes the difference between observed and predicted values



<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="sse-concept" -->
## Sum of Squared Errors (SSE)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Key Concept*

-! SSE measures the total squared difference between observed and predicted values

$$\text{SSE} = \sum_{i=1}^n (y_i - {y\_{hat}}_i)^2$$

***

-! Our goal: Find coefficients $\beta$ that *minimize SSE*

***

-! Smaller SSE → Better model fit

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Visual Understanding*

-! Each data point has a residual (error):

$$e_i = y_i - {y\_{hat}}_i$$

***

-! We square and sum all residuals

-: Squaring prevents cancellation of positive and negative errors
-: Larger errors get more weight

***

-= The "least squares" method finds the line that minimizes this sum

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="basic-principle" -->
## Basic Principle of Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Linear Model*

-! Model definition:

$$y = \sum_{i=0}^p \beta_i x_i + \varepsilon = {y\_{hat}} + \varepsilon$$

***

-! For simple linear regression (one predictor):

$$y = \beta_0 + \beta_1 x + \varepsilon$$

-: $\beta_0$ = intercept (value when $x = 0$)
-: $\beta_1$ = slope (change in $y$ per unit change in $x$)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Strategy*

-! **Objective:** Minimize SSE

$$\text{SSE} = \sum_{i=1}^n (y_i - (\beta_0 + \beta_1 x_i))^2$$

***

-! **How?**
-: Take the derivative of SSE with respect to $\beta_0$ and $\beta_1$
-: Set derivatives to zero
-: Solve the resulting equations

***

-= Matrix algebra provides an elegant solution!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="matrix-intro" -->
## Matrix Operations: Introduction
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is a Matrix?*

-! A rectangular array of numbers in rows and columns:

$$
\mathbf{A} = \begin{bmatrix} 
a_{11} & a_{12} & \cdots & a_{1n} \\\\
a_{21} & a_{22} & \cdots & a_{2n} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
$$

-: $m$ = Number of rows
-: $n$ = Number of columns
-: Matrices are denoted by bold uppercase letters

***

-: in R, matrices can be created using the `matrix()` function.

```R
A <- matrix(c(1, 2, 3, 4, 5, 6), nrow=2, byrow=TRUE)
```

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Transpose*

-! Flips rows and columns:

$$\mathbf{A}^\top = \begin{bmatrix} 
a_{11} & a_{21} & \cdots & a_{m1} \\\\
a_{12} & a_{22} & \cdots & a_{m2} \\\\
\vdots & \vdots & \ddots & \vdots \\\\
 a_{1n} & a_{2n} & \cdots & a_{mn} 
 \end{bmatrix}$$

-: An $(n \times m)$ matrix becomes an $(m \times n)$ matrix
-: Denoted by superscript $T$ or $\top$

***
-: in R, the transpose can be computed using the `t()` function.

```R
At <- t(A)
```

<!-- /position -->
<!-- /layout -->

---

<!-- . slide:id="matrix-addition" -->
## Matrix Operations: Addition & Subtraction
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Matrix Addition*
$$\mathbf{A} = \begin{bmatrix} 
1 & 2 \\\\
3 & 4 \end{bmatrix}, \quad \mathbf{B} = \begin{bmatrix} 5 & 6 \\\\ 7 & 8 \end{bmatrix}$$

$$\mathbf{C} = \mathbf{A} + \mathbf{B} = \\\\ \begin{bmatrix} 1 + 5 & 2 + 6 \\\\ 3 + 7 & 4 + 8 \end{bmatrix} = \begin{bmatrix} 6 & 8 \\\\ 10 & 12 \end{bmatrix}$$
-! Requirement: same dimensions
-: $(m \times n) + (m \times n) = (m \times n)$

***
-: in R, matrices can be summed using the `+` operator.

```R
C <- A + B
```

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Matrix Subtraction*
$$\mathbf{A} = \begin{bmatrix}
1 & 2 \\\\
3 & 4 \end{bmatrix}, \quad \mathbf{B} = \begin{bmatrix} 5 & 6 \\\\ 7 & 8 \end{bmatrix}$$

$$\mathbf{C} = \mathbf{A} - \mathbf{B} = \\\\ \begin{bmatrix} 1 - 5 & 2 - 6 \\\\ 3 - 7 & 4 - 8 \end{bmatrix} = \begin{bmatrix} -4 & -4 \\\\ -4 & -4 \end{bmatrix}$$
-! Requirement: same dimensions
-: $(m \times n) - (m \times n) = (m \times n)$

***
-: in R, matrices can be subtracted using the `-` operator.

```R
C <- A - B
```

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="scalar-matrix-multiplication" -->
## Matrix Operations: Scalar Multiplication
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
*Scalar Multiplication*
$$\mathbf{A} = \begin{bmatrix} 
1 & 2 \\\\
3 & 4 \end{bmatrix}, \quad k = 3$$
$$\mathbf{B} = k \cdot \mathbf{A} = 3 \cdot \begin{bmatrix} 1 & 2 \\\\ 3 & 4 \end{bmatrix} = \begin{bmatrix} 3 \cdot 1 & 3 \cdot 2 \\\\ 3 \cdot 3 & 3 \cdot 4 \end{bmatrix} = \begin{bmatrix} 3 & 6 \\\\ 9 & 12 \end{bmatrix}$$
-! Each element of the matrix is multiplied by the scalar

***
-: in R, scalar multiplication is done using the `*` operator.

```R
B <- 3 * A
```

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="matrix-operations" -->
## Matrix Operations: Multiplication & Inverse
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
*Matrix Multiplication*

$$\mathbf{A} = \begin{bmatrix} 
1 & 2 \\\\
3 & 4 \end{bmatrix}, \quad \mathbf{B} = \begin{bmatrix} 5 & 6 \\\\ 7 & 8 \end{bmatrix}$$

$$\mathbf{C} = \mathbf{A} \cdot \mathbf{B} =\\\\ \begin{bmatrix} 1 \cdot 5 + 2 \cdot 7 & 1 \cdot 6 + 2 \cdot 8 \\\\ 3 \cdot 5 + 4 \cdot 7 & 3 \cdot 6 + 4 \cdot 8 \end{bmatrix} = \begin{bmatrix} 19 & 22 \\\\ 43 & 50 \end{bmatrix}$$

-! Requirement: columns of first = rows of second
-: $(m \times p) \cdot (p \times n) = (m \times n)$

***
-: in R, matrix multiplication is done using the `%*%` operator.

```R
C <- A %*% B
```

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Matrix Inverse* (for 2x2 matrices)

$$\mathbf{A}^{-1} = \frac{1}{ad - bc} \begin{bmatrix} d & -b \\\\ -c & a \end{bmatrix}$$

***

-! Properties:
-: $\mathbf{A} \cdot \mathbf{A}^{-1} = \mathbf{I}$ (identity matrix)
-: Analogous to division in scalar arithmetic

***

-! The identity matrix has ones on the diagonal, zeros elsewhere

***
-: in R, the inverse can be computed using the `solve()` function.

```R
invA <- solve(A)
```

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="matrix-operations-in-r" -->
## Matrix Operations in R
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
<div id="matrix-operations-in-r-container"></div>

<script>
(function() {
  const containerId = 'matrix-operations-in-r-container';
  const code = `# Create matrices
A <- matrix(c(1, 2, 3, 4), nrow=2, byrow=TRUE)
B <- matrix(c(5, 6, 7, 8), nrow=2, byrow=TRUE)
  
C <- A + B
D <- A - B
E <- 3 * A
F <- A %*% B
invA <- solve(A)
Bt <- t(B)
  
# Display results
cat("Matrix A:\\n")
print(A)
cat("Matrix B:\\n")
print(B)
cat("Matrix C (A + B):\\n")
print(C)
cat("Matrix D (A - B):\\n")
print(D)
cat("Matrix E (3 * A):\\n")
print(E)
cat("Matrix F (A %*% B):\\n")
print(F)
cat("Inverse of Matrix A:\\n")
print(invA)
cat("Transpose of Matrix B:\\n")
print(Bt)
  `;
  const fallback = () => {
    return `no fallback available for this example`;
  };
  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'matrix-operations-in-r',
      fallback,
      runLabel: 'Run Matrix Operations in R',
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>

---

<!-- .slide:id="matrix-form" -->
## Regression in Matrix Form
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Regression Equation*

-! Scalar form:

$$y_i = \beta_0 + \beta_1 x_{i1} + \ldots + \beta_p x_{ip} + \varepsilon_i$$

***

-! Matrix form:

$$\mathbf{y} = \mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon}$$

-: $\mathbf{y}$ = vector of observed values
-: $\mathbf{X}$ = design matrix of predictors
-: $\boldsymbol{\beta}$ = vector of coefficients

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Minimizing SSE*

-! Objective function:

$$\text{SSE} = \sum(y_i - (b_0 + b_1 x_i + \ldots + b_p x_i^p))^2 \\\\ = \|\|\mathbf{y} - \mathbf{X} \boldsymbol{\beta}\|\|^2$$
-: The squared Euclidean norm of the residuals

***

-! Equivalent to:

$$\text{SSE} = (\mathbf{y} - \mathbf{X} \boldsymbol{\beta})^\top (\mathbf{y} - \mathbf{X} \boldsymbol{\beta})$$

-: A compact way to express the sum of squared errors

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="normal-equation-intro" -->
## Minimizing SSE: Our Goal

minimize the Sum of Squared Errors (SSE):
$$\text{SSE} = (\mathbf{y} - \mathbf{X} \boldsymbol{\beta})^\top (\mathbf{y} - \mathbf{X} \boldsymbol{\beta})$$

***
by checking where the derivative with respect to $\boldsymbol{\beta}$ is zero:
$$\frac{\partial \text{SSE}}{\partial \boldsymbol{\beta}} = 0$$

---

<!-- .slide:id="normal-equation" -->
## Deriving the Normal Equation
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Derivation*

-! **Step 1:** Expand SSE
$$\text{SSE} = (\mathbf{y} - \mathbf{X} \boldsymbol{\beta})^\top (\mathbf{y} - \mathbf{X} \boldsymbol{\beta})$$

$$\text{SSE} = \mathbf{y}^\top \mathbf{y} - 2 \boldsymbol{\beta}^\top \mathbf{X}^\top \mathbf{y} + \boldsymbol{\beta}^\top \mathbf{X}^\top \mathbf{X} \boldsymbol{\beta}$$
-: with $(\mathbf{A} \mathbf{B})^\top = \mathbf{B}^\top \mathbf{A}^\top$

***

-! **Step 2:** Take derivative w.r.t. $\boldsymbol{\beta}$

$$\frac{\partial \text{SSE}}{\partial \boldsymbol{\beta}} = -2 \mathbf{X}^\top \mathbf{y} + 2 \mathbf{X}^\top \mathbf{X} \boldsymbol{\beta}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Solution*

-! **Step 3:** Set derivative to zero

$$-2 \mathbf{X}^\top \mathbf{y} + 2 \mathbf{X}^\top \mathbf{X} \boldsymbol{\beta} = 0$$

***

-! **Step 4:** Solve for $\boldsymbol{\beta}$

$$\mathbf{X}^\top \mathbf{X} \boldsymbol{\beta} = \mathbf{X}^\top \mathbf{y}$$

$${\boldsymbol{\beta}\_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{y}$$

***

-= This is the **Normal Equation**, i.e. the OLS solution!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-setup" -->
## Example: Setting Up the Problem
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Data Setup*

-! Observations ($n = 4$)

-: Predictors: $x = [1, 2, 3, 4]$
-: Response: $y = [3, 6, 8, 11]$

***

-! Model with intercept, slope, and quadratic term:
-: Coefficients: $b_0, b_1, b_2$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Design Matrix*

-! Based on the model layout:

$$\mathbf{X} = \begin{bmatrix} x_1^0 & x_1^1 & x_1^2 \\\\ x_2^0 & x_2^1 & x_2^2 \\\\ \vdots & \vdots & \vdots \\\\ x_n^0 & x_n^1 & x_n^2 \end{bmatrix} = \begin{bmatrix} 1 & 1 & 1 \\\\ 1 & 2 & 4 \\\\ 1 & 3 & 9 \\\\ 1 & 4 & 16 \end{bmatrix}$$

-: Column 1: intercept ($x^0 = 1$)
-: Column 2: linear term ($x^1$)
-: Column 3: quadratic term ($x^2$)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-calculation" -->
## Example: Computing the Solution
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Step 1: Compute $\mathbf{X}^\top \mathbf{X}$*

$$\mathbf{X}^\top = \begin{bmatrix} 1 & 1 & 1 & 1 \\\\ 1 & 2 & 3 & 4 \\\\ 1 & 4 & 9 & 16 \end{bmatrix}$$

$$\mathbf{X}^\top \mathbf{X} = \begin{bmatrix} 4 & 10 & 30 \\\\ 10 & 30 & 100 \\\\ 30 & 100 & 354 \end{bmatrix}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Step 2: Compute the Inverse*

$$(\mathbf{X}^\top \mathbf{X})^{-1} = \begin{bmatrix} 7.75 & -6.75 & 1.25 \\\\ -6.75 & 6.45 & -1.25 \\\\ 1.25 & -1.25 & 0.25 \end{bmatrix}$$

***

-! This matrix is crucial for:
-: Calculating the coefficients ${\boldsymbol{\beta}\_{hat}}$
-: Understanding the variance-covariance structure

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="example-result" -->
## Example: The Coefficients
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Computing ${\boldsymbol{\beta}\_{hat}}$*

-! Using the normal equation:

$${\boldsymbol{\beta}\_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{y}$$

***

-! Result:

$${\boldsymbol{\beta}\_{hat}} = \begin{bmatrix} 0.5 \\\\ 2.6 \\\\ 0.0 \end{bmatrix}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Interpretation*

-! The estimated coefficients are:

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>$b_0 = 0.5$:</b> Intercept (baseline at $x = 0$)<br>
<b>$b_1 = 2.6$:</b> Linear slope of $x$<br>
<b>$b_2 = 0.0$:</b> Quadratic effect (none)
</div>

***

-! The fitted model:

$${y\_{hat}} = 0.5 + 2.6x + 0.0x^2$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="r-implementation" -->
## Linear Regression with Matrix Operations in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Using Matrix Algebra to Calculate $\boldsymbol{\beta}$*

-! We implement the Normal Equation directly:

$${\boldsymbol{\beta}_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{y}$$

***

-! Steps in R:
-: Create the design matrix $\mathbf{X}$
-: Compute $\mathbf{X}^\top \mathbf{X}$ using `t()` and `%*%`
-: Invert using `solve()`
-: Multiply to get ${\boldsymbol{\beta}_{hat}}$

***

-! The plot shows:
-: Data points (observed values)
-: Fitted regression line

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="linreg-matrix-container"></div>
  <div id="linreg-matrix-plot" style="border: 0px solid #2d3a66; border-radius: 8px; min-height: 220px; display: flex; align-items: center; justify-content: center; color: #9efcffcc; font-size: 0.9em; text-align: center; padding: 12px;">
    Run the WebR example to see the regression plot.
  </div>
  <button id="linreg-matrix-open-plot" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'linreg-matrix-container';
  const plotContainerId = 'linreg-matrix-plot';
  const openBtnId = 'linreg-matrix-open-plot';
  const slideId = 'r-implementation';

  const code = `# ===== LINEAR REGRESSION USING MATRIX OPERATIONS =====
# Water quality example: Nitrate (mg/L) vs Algal growth (µg/L)

# Data
x <- c(1, 2, 3, 4, 5)       # Nitrate concentration
y <- c(10, 20, 35, 50, 70)  # Algal growth

# Step 1: Create design matrix X (with intercept column)
n <- length(x)
X <- cbind(rep(1, n), x)    # Column of 1s for intercept
cat("Design Matrix X:\\n")
print(X)

# Step 2: Compute X'X (X transpose times X)
XtX <- t(X) %*% X
cat("\\nX'X:\\n")
print(XtX)

# Step 3: Compute inverse of X'X
XtX_inv <- solve(XtX)
cat("\\n(X'X)^-1:\\n")
print(XtX_inv)

# Step 4: Compute X'y
Xty <- t(X) %*% y
cat("\\nX'y:\\n")
print(Xty)

# Step 5: Calculate beta = (X'X)^-1 * X'y
beta <- XtX_inv %*% Xty
cat("\\n===== COEFFICIENTS =====\\n")
cat("beta_0 (intercept):", round(beta[1], 3), "\\n")
cat("beta_1 (slope):    ", round(beta[2], 3), "\\n")

# Calculate predicted values
y_hat <- X %*% beta
cat("\\nPredicted values:\\n")
print(round(as.vector(y_hat), 2))

# Plot data points and regression line
plot(x, y, 
     pch = 19, cex = 1.5, col = "#1a588b",
     xlab = "Nitrate (mg/L)", 
     ylab = "Algal growth (µg/L)",
     main = "Linear Regression: Matrix Solution",
     xlim = c(0, 6), ylim = c(0, 80))
     
# Add regression line
x_line <- seq(0, 6, by = 0.1)
y_line <- beta[1] + beta[2] * x_line
lines(x_line, y_line, col = "#702914", lwd = 2)

# Add legend
legend("topleft", 
       legend = c("Data points", 
                  paste0("y = ", round(beta[1], 1), " + ", 
                         round(beta[2], 1), "x")),
       col = c("#1a588b", "#702914"), 
       pch = c(19, NA), lty = c(NA, 1), lwd = c(NA, 2),
       bty = "n")

# Add grid
grid(col = "gray80", lty = 2)`;

  const fallbackOutput = `[Simulated Output]
Design Matrix X:
     [,1] [,2]
[1,]    1    1
[2,]    1    2
[3,]    1    3
[4,]    1    4
[5,]    1    5

X'X:
     [,1] [,2]
[1,]    5   15
[2,]   15   55

(X'X)^-1:
      [,1]  [,2]
[1,]  1.1 -0.3
[2,] -0.3  0.1

X'y:
     [,1]
[1,]  185
[2,]  670

===== COEFFICIENTS =====
beta_0 (intercept): -7 
beta_1 (slope):     15`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run Linear Regression (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 480,
        background: '#ffffff',
        altText: 'Linear regression plot showing data points and fitted line',
        loadingMessage: 'Rendering plot...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the regression plot.'
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

<!-- .slide:id="r-lm-function" -->
## Linear Regression Using lm() in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Easy Way: Using `lm()`*

-! R's built-in `lm()` function handles everything:

```r
model <- lm(y ~ x)
```

***

-! Advantages:
-: Automatic design matrix creation
-: Computes coefficients, SE, t-values, p-values
-: Provides $R^2$, F-statistic, and more
-: Easy plotting with `abline()`

***

-! The `summary()` function gives a complete regression table

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 12px;">
  <div id="linreg-lm-container"></div>
  <div id="linreg-lm-plot" style="border: 0px solid #2d3a66; border-radius: 8px; min-height: 220px; display: flex; align-items: center; justify-content: center; color: #9efcffcc; font-size: 0.9em; text-align: center; padding: 12px;">
    Run the WebR example to see the regression plot.
  </div>
  <button id="linreg-lm-open-plot" style="padding: 8px 16px; background: #0f172a; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.85em; font-weight: 600; display: none; align-self: flex-start;">
    <i class="fas fa-external-link-alt"></i> Popout Plot
  </button>
</div>

<script>
(function() {
  const containerId = 'linreg-lm-container';
  const plotContainerId = 'linreg-lm-plot';
  const openBtnId = 'linreg-lm-open-plot';
  const slideId = 'r-lm-function';

  const code = `# ===== LINEAR REGRESSION USING lm() =====
# Water quality example: Nitrate (mg/L) vs Algal growth (µg/L)

# Data
x <- c(1, 2, 3, 4, 5)       # Nitrate concentration
y <- c(10, 20, 35, 50, 70)  # Algal growth

# Fit linear model - it's this simple!
model <- lm(y ~ x)

# Show model summary with all statistics
cat("===== MODEL SUMMARY =====\\n")
print(summary(model))

# Extract coefficients
coefs <- coef(model)
cat("\\n===== COEFFICIENTS =====\\n")
cat("Intercept:", round(coefs[1], 3), "\\n")
cat("Slope:    ", round(coefs[2], 3), "\\n")

# R-squared
cat("\\nR-squared:", round(summary(model)$r.squared, 4), "\\n")

# Plot data and regression line
plot(x, y, 
     pch = 19, cex = 1.5, col = "#1a588b",
     xlab = "Nitrate (mg/L)", 
     ylab = "Algal growth (µg/L)",
     main = "Linear Regression: lm() Solution",
     xlim = c(0, 6), ylim = c(0, 80))

# Add regression line using abline() - very simple!
abline(model, col = "#702914", lwd = 2)

# Add legend
legend("topleft", 
       legend = c("Data points", 
                  paste0("y = ", round(coefs[1], 1), " + ", 
                         round(coefs[2], 1), "x")),
       col = c("#1a588b", "#702914"), 
       pch = c(19, NA), lty = c(NA, 1), lwd = c(NA, 2),
       bty = "n")

# Add grid
grid(col = "gray80", lty = 2)`;

  const fallbackOutput = `[Simulated Output]
===== MODEL SUMMARY =====

Call:
lm(formula = y ~ x)

Residuals:
     1      2      3      4      5 
  3.0   -2.0   -2.0    3.0   -2.0 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept)   -7.000      3.742  -1.870   0.1581    
x             15.000      1.155  12.990 0.000978 ***

Residual standard error: 3.162 on 3 degrees of freedom
Multiple R-squared:  0.9826
Adjusted R-squared:  0.9768 
F-statistic: 168.8 on 1 and 3 DF,  p-value: 0.0009780

===== COEFFICIENTS =====
Intercept: -7 
Slope:     15

R-squared: 0.9826`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initCodeAndPlotSection({
      containerId,
      plotContainerId,
      code,
      slideId,
      fallback: () => fallbackOutput,
      runLabel: 'Run Linear Regression (WebR)',
      minHeight: '30px',
      renderOptions: {
        width: 640,
        height: 480,
        background: '#ffffff',
        altText: 'Linear regression plot using lm() function',
        loadingMessage: 'Rendering plot...',
        errorMessage: 'Plot rendering unavailable in offline mode.',
        initialPlotMessage: 'Run the example to render the regression plot.'
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

<!-- .slide:id="uncertainties-intro-0" -->
## Uncertainties in Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Why Do Coefficients Have Uncertainty?*

-! Each sample gives us different estimates of $\beta_0$ and $\beta_1$

***

-! Even with the same true relationship, random noise causes variability

***

-! The animation shows:
-: White dashed line: True regression (unknown in practice)
-: Colored lines: Estimated regression from each sample
-: Opacity fades for older samples (FIFO)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="regression-uncertainty-chart" style="width: 100%; min-height: 550px;"></div>

<script src="resources/js/charts/regression_uncertainty_animation.js"></script>

***

-= Different samples → Different coefficient estimates!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="uncertainties-intro-1" -->
## Uncertainties in Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Residual Variance ($\sigma^2$)*

-! The residual variance measures spread of $y$ around ${y\_{hat}}$:

$$\sigma^2 = \frac{\sum (y_i - {y\_{hat}}_i)^2}{n - p}$$

-: $n$ = number of observations
-: $p$ = number of all predictors 

***

-! Also called *Mean Squared Error (MSE)*

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Key Insights*

-! Higher $\sigma^2$ → higher uncertainty in predictions

***

-! Poorly fitted model → larger residuals → higher $\sigma^2$

***

-! The coefficients $\boldsymbol{\beta}$ are also estimated with uncertainty, depending on:
-: Residual variance ($\sigma^2$)
-: Structure of the design matrix ($\mathbf{X}$)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="variance-beta" -->
## Variance of Coefficients
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Derivation*

-! Starting from:
<div style="font-size: 0.8em;">

1. $\mathbf{y} = \mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon}$

2. ${\boldsymbol{\beta}\_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{y}$

3. ${\boldsymbol{\beta}\_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top (\mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon})$

4. ${\boldsymbol{\beta}\_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{X} \boldsymbol{\beta} + (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \boldsymbol{\varepsilon}$

</div>

$${\boldsymbol{\beta}\_{hat}} = \boldsymbol{\beta} + (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \boldsymbol{\varepsilon}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! Taking the variance:

$$\text{Var}({\boldsymbol{\beta}\_{hat}}) = \text{Var}(\boldsymbol{\beta} + (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \boldsymbol{\varepsilon})$$

-! Considering *3* rules of variance:
-: $\text{Var}(\mathbf{A} \mathbf{X}) = \mathbf{A} \text{Var}(\mathbf{X}) \mathbf{A}^\top$ (for matrix $\mathbf{A}$, constant)
-: $\text{Var}(\mathbf{X} + \mathbf{Y}) = \text{Var}(\mathbf{X}) + \text{Var}(\mathbf{Y})$ (if independent)
-: $\text{Var}(\text{constant}) = 0$

-! We get:
<div style="font-size: 0.8em;">

1. $ \text{Var}({\boldsymbol{\beta}\_{hat}}) = \text{Var}((\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \boldsymbol{\varepsilon})$ (rule 2 and 3)

2. $ \text{Var}({\boldsymbol{\beta}\_{hat}}) = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \text{Var}(\boldsymbol{\varepsilon}) ((\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top)^\top$ (r. 1)

</div>
$$\text{Var}({\boldsymbol{\beta}\_{hat}}) = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \text{Var}(\boldsymbol{\varepsilon}) \mathbf{X} (\mathbf{X}^\top \mathbf{X})^{-1}$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="variance-beta-simplification" -->
## Variance of Coefficients (cont.)
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Gauss-Markov Simplification*

-! Under homoscedasticity: 
$$\text{Var}(\boldsymbol{\varepsilon}) = \sigma^2 \mathbf{I}$$

<div style="font-size: 0.8em;">

$\mathbf{I}$ = identity matrix, e.g. $\begin{bmatrix} 1 & 0 & \ldots & 0 \\\\ 0 & 1 & \ldots & 0 \\\\ \vdots & \vdots & \ddots & \vdots \\\\ 0 & 0 & \ldots & 1 \end{bmatrix}$

</div>

***

-< This implies errors have constant variance $\sigma^2$ and are uncorrelated

-< All residuals come from the same normal distribution with variance $\sigma^2$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! This assumption simplifies the variance of coefficients fundamentally:
$$\text{Var}({\boldsymbol{\beta}\_{hat}}) = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \text{Var}(\boldsymbol{\varepsilon}) \mathbf{X} (\mathbf{X}^\top \mathbf{X})^{-1}$$
-: considering $A \mathbf{I} A^\top = A A^\top$

<div id="var_beta_spoiler"></div>

<script>
createTimerLockedSpoiler('var_beta_spoiler', {
  unlockDate: '2025-12-02T13:00:00Z',  // Dec 02, 2025 at 2:00 PM CET
  title: 'Derivation Steps',
  content: `<img src="resources/figures/variance_beta_derivation.svg" alt="Variance of beta derivation" style="width: 100%; max-width: 850px;">`
});
</script>

***

-= This is the *variance-covariance matrix* of the coefficients!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="significance-testing" -->
## Significance of Coefficients
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Using the Variance-Covariance Matrix*

-! *Standard Error* of each coefficient:

$$\text{SE}(b_i) = \sqrt{\text{diag}(\text{Var}({\boldsymbol{\beta}\_{hat}}))}$$

-: where $\text{diag}(\cdot)$ extracts diagonal elements

***

-! *t-statistic* for each coefficient:

$$t_i = \frac{b_i}{\text{SE}(b_i)}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Hypothesis Testing*

-! Null hypothesis: $H_0: b_i = 0$ (no effect)
-! Alternative: $H_1: b_i \text{ !=} 0$ (significant effect)

***

-! Compare $t_i$ to the critical value from the t-distribution:
-: Degrees of freedom: $n - p$
-: If $|t_i| > t_{\text{critical}}$ → coefficient is significant

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="significance-testing-example" -->
## Coefficient Significance: Water Quality Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Predicting Turbidity from Sediment Load*

-! Data from 25 river monitoring stations

<div style="font-size: 0.7em">

| Parameter | Estimate | SE | t-value | p-value |
|:----------|:--------:|:--:|:-------:|:-------:|
| Intercept ($\beta_0$) | 2.34 | 0.89 | 2.63 | 0.015 |
| Sediment (mg/L) ($\beta_1$) | 0.85 | 0.12 | **7.08** | <0.001 |

</div>

***

-! Calculation for $\beta_1$:
$$t = \frac{0.85}{0.12} = 7.08$$

-: df = 25 - 2 = 23
-: Critical value $t_{0.025, 23} = 2.07$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Interpretation*

<div style="background: #1a588bff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Question:</b> Is sediment load a significant predictor of turbidity?
</div>

***

-! Since $|7.08| > 2.07$ → **Reject $H_0$**

***

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Conclusion:</b> Sediment load is a highly significant predictor of turbidity (p < 0.001). Each mg/L increase in sediment is associated with 0.85 NTU increase in turbidity.
</div>

-= The small p-value gives us confidence this relationship is real, not due to chance.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="f-test" -->
## Global F-Test
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Purpose*

-! Test whether the *entire regression model* is significant

***

-! Hypotheses:
-: $H_0$: All coefficients (except intercept) are zero
-: $H_1$: At least one coefficient is not zero

***

-! F-statistic:

$$F = \frac{\text{SSR} / p}{\text{SSE} / (n - p)}$$

-: $p$ = number of all predictors
-: $n$ = number of observations

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Components*

-! Sum of Squares Regression:

$$\text{SSR} = \sum ({y\_{hat}}_i - \bar{y})^2$$

***

-! Sum of Squares Error:

$$\text{SSE} = \sum (y_i - {y\_{hat}}_i)^2$$

***

-! If $F > F_{\text{critical}}$ → reject $H_0$, model is significant

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="f-test-example" -->
## Global F-Test: Nutrient Loading Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Predicting Algal Biomass from Multiple Nutrients*

-! Model with 3 predictors (n = 30):

$$\text{Chlorophyll-a} = \beta_0 + \beta_1 \cdot \text{NO}_3 \\\\ + \beta_2 \cdot \text{PO}_4 + \beta_3 \cdot \text{NH}_4$$

***

<div style="font-size: 0.7em">

| Source | SS | df | MS |
|:-------|:--:|:--:|:--:|
| Regression (SSR) | 4250 | 3 | 1417 |
| Error (SSE) | 1820 | 26 | 70 |
| Total (SST) | 6070 | 29 | |

</div>

***

$$F = \frac{1417}{70} = 20.24$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Testing the Model*

-! Hypotheses:
-: $H_0$: $\beta_1 = \beta_2 = \beta_3 = 0$ (no nutrients matter)
-: $H_1$: At least one $\beta_i \text{ !=} 0$

***

-: Critical value: $F_{0.05, 3, 26} = 2.98$

-: Since $20.24 > 2.98$ → **Reject $H_0$**

***

<div style="background: #0d6b47; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Conclusion:</b> The nutrient model explains significantly more variance than a mean-only model (F = 20.24, p < 0.001). At least one nutrient affects algal growth.
</div>

-? But which nutrient(s)? → Need individual t-tests!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="quality-metrics" -->
## Quality Metrics for Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Coefficient of Determination ($R^2$)*

$$R^2 = 1 - \frac{\text{SSE}}{\text{SST}}$$

-: Measures proportion of variance explained
-: Ranges from 0 to 1
-: $\text{SST}$ = Total Sum of Squares

***

*Adjusted $R^2$*

$$R^2_{\text{adj}} = 1 - \frac{\text{SSE}/(n - p)}{\text{SST}/(n - 1)}$$

-: Adjusts for number of predictors
-: Better for model comparison

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Error Metrics*

-! *RMSE* (Root Mean Squared Error):

$$\text{RMSE} = \sqrt{\frac{\text{SSE}}{n - p}}$$

-: Average prediction error in original units

***

-! *MAE* (Mean Absolute Error):

$$\text{MAE} = \frac{\sum_{i=1}^n |y_i - {y\_{hat}}_i|}{n}$$

-: Less sensitive to outliers than RMSE

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="confidence-intervals" -->
## Confidence Intervals
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is a Confidence Interval?*

-! Estimates the range where the *true parameter* is likely to lie with a specified confidence level (e.g., 95%)

***

-! For coefficients:

$$\text{CI}(b_i) = b_i \pm t_{\text{critical}} \cdot \text{SE}(b_i)$$

***

e.g.,

-! Sensitivity for Nitrate: $b_1 = 2.5 \pm 0.8$ (95% CI) 

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*CI for Fitted Values*

-! For a given predictor vector $\mathbf{x}$:

$$\text{CI}({y\_{hat}}) = {y\_{hat}} \pm t_{\text{critical}} \cdot \sqrt{\mathbf{x}^\top \text{Var}({\boldsymbol{\beta}\_{hat}}) \mathbf{x}}$$
-: $\mathbf{x}$ = row vector of predictor values (including intercept), *NOT* the full design matrix $\mathbf{X}$

***

e.g.,

-! Predicted Algal growth at Nitrate = 3 mg/L: ${y\_{hat}} = 25 \pm 5$ (95% CI)

***

-! This gives the uncertainty about the *mean response*

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="prediction-intervals" -->
## Prediction Intervals
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is a Prediction Interval?*

-! Estimates the range where a *new observation* is likely to fall

***

-! Formula:

$$\text{PI}(y_{\text{new}}) = {y\_{hat}} \pm t_{\text{critical}} \cdot \sqrt{\mathbf{x}^\top \text{Var}({\boldsymbol{\beta}\_{hat}}) \mathbf{x} + \sigma^2}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*CI vs PI: Key Differences*

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Confidence Interval:</b><br>
Uncertainty about the <em>mean response</em> (${y\_{hat}}$)
</div>

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<b>Prediction Interval:</b><br>
Uncertainty about a <em>new observation</em> ($y_{\text{new}}$)
</div>

***

-! PI includes both:
-: Variability in ${y\_{hat}}$
-: Residual variance ($\sigma^2$)

-= PI is always wider than CI!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="calibration-curve-ci-pi" -->
## Calibration Curve with CI & PI

<div id="calibration-curve-intervals" style="width: 100%; height: 750px;"></div>

<script>
(function() {
  const containerId = 'calibration-curve-intervals';
  
  function createCalibrationCurvePlot() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    d3.select(container).selectAll('*').remove();
    
    const width = 1200;
    const height = 700;
    const margin = { top: 60, right: 180, bottom: 80, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Calibration data: concentration (mg/L) vs absorbance (AU)
    // True model: Absorbance = 0.02 + 0.045 * Concentration + noise
    // Increased spread to visualize CI and PI clearly
    const calibrationData = [
      { conc: 0, abs: 0.005 },
      { conc: 0, abs: 0.055 },
      { conc: 2, abs: 0.075 },
      { conc: 2, abs: 0.155 },
      { conc: 5, abs: 0.195 },
      { conc: 5, abs: 0.305 },
      { conc: 10, abs: 0.410 },
      { conc: 10, abs: 0.540 },
      { conc: 15, abs: 0.620 },
      { conc: 15, abs: 0.780 },
      { conc: 20, abs: 0.850 },
      { conc: 20, abs: 1.010 },
      { conc: 25, abs: 1.060 },
      { conc: 25, abs: 1.240 },
      { conc: 30, abs: 1.280 },
      { conc: 30, abs: 1.480 }
    ];
    
    const n = calibrationData.length;
    const xData = calibrationData.map(d => d.conc);
    const yData = calibrationData.map(d => d.abs);
    
    // Simple linear regression
    const xMean = d3.mean(xData);
    const yMean = d3.mean(yData);
    const ssXX = d3.sum(xData.map(x => (x - xMean) * (x - xMean)));
    const ssXY = d3.sum(xData.map((x, i) => (x - xMean) * (yData[i] - yMean)));
    
    const b1 = ssXY / ssXX; // slope
    const b0 = yMean - b1 * xMean; // intercept
    
    // Residuals and MSE
    const yPred = xData.map(x => b0 + b1 * x);
    const residuals = yData.map((y, i) => y - yPred[i]);
    const SSE = d3.sum(residuals.map(r => r * r));
    const MSE = SSE / (n - 2);
    const sigma = Math.sqrt(MSE);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 35])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 1.6])
      .range([innerHeight, 0]);
    
    // Generate curve data for regression line and intervals
    const curvePoints = [];
    const tCrit = 2.145; // t_0.025 for df = 14
    
    for (let x = 0; x <= 35; x += 0.5) {
      const yHat = b0 + b1 * x;
      
      // Standard error for confidence interval (mean response)
      const seCI = sigma * Math.sqrt(1/n + Math.pow(x - xMean, 2) / ssXX);
      
      // Standard error for prediction interval (new observation)
      const sePI = sigma * Math.sqrt(1 + 1/n + Math.pow(x - xMean, 2) / ssXX);
      
      curvePoints.push({
        x: x,
        yHat: yHat,
        ciLower: yHat - tCrit * seCI,
        ciUpper: yHat + tCrit * seCI,
        piLower: yHat - tCrit * sePI,
        piUpper: yHat + tCrit * sePI
      });
    }
    
    // Draw PI band (wider, draw first)
    const piArea = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(Math.max(0, d.piLower)))
      .y1(d => yScale(d.piUpper))
      .curve(d3.curveLinear);
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', '#ff6b35')
      .attr('fill-opacity', 0.15)
      .attr('stroke', 'none')
      .attr('d', piArea);
    
    // PI boundary lines
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.piUpper)));
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(Math.max(0, d.piLower))));
    
    // Draw CI band (narrower, on top)
    const ciArea = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.ciLower))
      .y1(d => yScale(d.ciUpper))
      .curve(d3.curveLinear);
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', '#00d4ff')
      .attr('fill-opacity', 0.25)
      .attr('stroke', 'none')
      .attr('d', ciArea);
    
    // CI boundary lines
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.ciUpper)));
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.ciLower)));
    
    // Regression line
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.yHat)));
    
    // Calibration standards (data points)
    svg.selectAll('.cal-point')
      .data(calibrationData)
      .enter()
      .append('circle')
      .attr('class', 'cal-point')
      .attr('cx', d => xScale(d.conc))
      .attr('cy', d => yScale(d.abs))
      .attr('r', 7)
      .attr('fill', '#ffffff')
      .attr('stroke', '#ff0095')
      .attr('stroke-width', 2);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(8))
      .classed('d3-axis', true);
    
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(8))
      .classed('d3-axis', true);
    
    // Axis labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 55)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Nitrate Concentration (mg/L)');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Absorbance (AU)');
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -25)
      .style('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .text('Nitrate Calibration Curve: Linear Regression with 95% CI and PI');
    
    // Legend
    const legendX = innerWidth + 20;
    const legendY = 50;
    
    // Regression line
    svg.append('line')
      .attr('x1', legendX)
      .attr('x2', legendX + 40)
      .attr('y1', legendY)
      .attr('y2', legendY)
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3);
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 5)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Calibration');
    
    // CI band
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY + 25)
      .attr('width', 40)
      .attr('height', 15)
      .attr('fill', '#00d4ff')
      .attr('fill-opacity', 0.25)
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2);
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 37)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('95% CI');
    
    // PI band
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY + 55)
      .attr('width', 40)
      .attr('height', 15)
      .attr('fill', '#ff6b35')
      .attr('fill-opacity', 0.15)
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3');
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 67)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('95% PI');
    
    // Standards legend
    svg.append('circle')
      .attr('cx', legendX + 20)
      .attr('cy', legendY + 95)
      .attr('r', 7)
      .attr('fill', '#ffffff')
      .attr('stroke', '#ff0095')
      .attr('stroke-width', 2);
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 100)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Standards');
    
    // Model info
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + 145)
      .style('fill', '#9efcff')
      .style('font-size', '13px')
      .style('font-weight', 'bold')
      .text('Model:');
    
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + 168)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text(`y = ${b0.toFixed(4)} + ${b1.toFixed(4)}x`);
    
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + 188)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text(`R² = ${(1 - SSE / d3.sum(yData.map(y => Math.pow(y - yMean, 2)))).toFixed(4)}`);
    
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + 208)
      .style('fill', '#ffffff')
      .style('font-size', '12px')
      .text(`σ = ${sigma.toFixed(4)} AU`);
    
    // Annotation: show widening at edges
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + 250)
      .style('fill', '#ff6b35')
      .style('font-size', '11px')
      .text('Note: Intervals widen');
    svg.append('text')
      .attr('x', legendX)
      .attr('y', legendY + 268)
      .style('fill', '#ff6b35')
      .style('font-size', '11px')
      .text('away from x̄!');
  }
  
  const slideId = 'calibration-curve-ci-pi';
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createCalibrationCurvePlot);
  } else {
    createCalibrationCurvePlot();
  }
  
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', event => {
      if (event.currentSlide && event.currentSlide.getAttribute('id') === slideId) {
        createCalibrationCurvePlot();
      }
    });
  }
})();
</script>

---

<!-- .slide:id="ci-pi-visualization" -->
## Confidence & Prediction Intervals Visualized

<div id="quadratic-regression-intervals" style="width: 100%; height: 750px;"></div>

<script>
(function() {
  const containerId = 'quadratic-regression-intervals';
  
  function createQuadraticRegressionPlot() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    d3.select(container).selectAll('*').remove();
    
    const width = 1200;
    const height = 700;
    const margin = { top: 60, right: 180, bottom: 80, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Generate quadratic data with noise
    // True model: y = 5 + 2x - 0.15x² + noise
    const n = 30;
    const xData = [];
    const yData = [];
    const seed = 42;
    
    // Simple seeded random
    let randState = seed;
    const seededRandom = () => {
      randState = (randState * 9301 + 49297) % 233280;
      return randState / 233280;
    };
    
    // Box-Muller for normal distribution
    const normalRandom = (mean, sd) => {
      const u1 = seededRandom();
      const u2 = seededRandom();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      return mean + sd * z;
    };
    
    for (let i = 0; i < n; i++) {
      const x = 2 + (i / (n - 1)) * 16; // x from 2 to 18
      const yTrue = 5 + 2 * x - 0.08 * x * x;
      const y = yTrue + normalRandom(0, 2.5);
      xData.push(x);
      yData.push(y);
    }
    
    // Fit quadratic regression: y = b0 + b1*x + b2*x²
    const xMean = d3.mean(xData);
    const x2Data = xData.map(x => x * x);
    const x2Mean = d3.mean(x2Data);
    
    // Design matrix approach (simplified for quadratic)
    // Using normal equations manually
    const sumX = d3.sum(xData);
    const sumX2 = d3.sum(x2Data);
    const sumX3 = d3.sum(xData.map(x => x * x * x));
    const sumX4 = d3.sum(xData.map(x => x * x * x * x));
    const sumY = d3.sum(yData);
    const sumXY = d3.sum(xData.map((x, i) => x * yData[i]));
    const sumX2Y = d3.sum(x2Data.map((x2, i) => x2 * yData[i]));
    
    // Solve 3x3 system using Cramer's rule
    const A = [
      [n, sumX, sumX2],
      [sumX, sumX2, sumX3],
      [sumX2, sumX3, sumX4]
    ];
    const B = [sumY, sumXY, sumX2Y];
    
    // Determinant helper
    const det3 = (m) => 
      m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
      m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
      m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
    
    const detA = det3(A);
    const A0 = [[B[0], A[0][1], A[0][2]], [B[1], A[1][1], A[1][2]], [B[2], A[2][1], A[2][2]]];
    const A1 = [[A[0][0], B[0], A[0][2]], [A[1][0], B[1], A[1][2]], [A[2][0], B[2], A[2][2]]];
    const A2 = [[A[0][0], A[0][1], B[0]], [A[1][0], A[1][1], B[1]], [A[2][0], A[2][1], B[2]]];
    
    const b0 = det3(A0) / detA;
    const b1 = det3(A1) / detA;
    const b2 = det3(A2) / detA;
    
    // Predicted values and residuals
    const yPred = xData.map((x, i) => b0 + b1 * x + b2 * x * x);
    const residuals = yData.map((y, i) => y - yPred[i]);
    const SSE = d3.sum(residuals.map(r => r * r));
    const sigma2 = SSE / (n - 3); // MSE
    const sigma = Math.sqrt(sigma2);
    
    // Scales
    const xScale = d3.scaleLinear()
      .domain([0, 20])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, 25])
      .range([innerHeight, 0]);
    
    // Generate smooth curve data for regression line and intervals
    const curvePoints = [];
    for (let x = 0; x <= 20; x += 0.2) {
      const yHat = b0 + b1 * x + b2 * x * x;
      
      // Simplified SE calculation for confidence interval
      // SE(yhat) depends on leverage h_ii = x'(X'X)^-1 x
      // Approximation: higher at extremes
      const xDev = x - xMean;
      const leverage = 1/n + (xDev * xDev) / d3.sum(xData.map(xi => (xi - xMean) * (xi - xMean)));
      const seCI = sigma * Math.sqrt(leverage + 0.02); // Smoothed approximation
      const sePI = sigma * Math.sqrt(1 + leverage + 0.02);
      
      const tCrit = 2.05; // approx t_0.025 for df=27
      
      curvePoints.push({
        x: x,
        yHat: yHat,
        ciLower: yHat - tCrit * seCI,
        ciUpper: yHat + tCrit * seCI,
        piLower: yHat - tCrit * sePI,
        piUpper: yHat + tCrit * sePI
      });
    }
    
    // Draw PI band (wider, draw first)
    const piArea = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(Math.max(0, d.piLower)))
      .y1(d => yScale(d.piUpper))
      .curve(d3.curveBasis);
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', '#ff6b35')
      .attr('fill-opacity', 0.2)
      .attr('stroke', 'none')
      .attr('d', piArea);
    
    // PI boundary lines
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.piUpper)).curve(d3.curveBasis));
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '6,4')
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(Math.max(0, d.piLower))).curve(d3.curveBasis));
    
    // Draw CI band (narrower, on top)
    const ciArea = d3.area()
      .x(d => xScale(d.x))
      .y0(d => yScale(d.ciLower))
      .y1(d => yScale(d.ciUpper))
      .curve(d3.curveBasis);
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', '#00d4ff')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'none')
      .attr('d', ciArea);
    
    // CI boundary lines
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.ciUpper)).curve(d3.curveBasis));
    
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.ciLower)).curve(d3.curveBasis));
    
    // Regression line
    svg.append('path')
      .datum(curvePoints)
      .attr('fill', 'none')
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3)
      .attr('d', d3.line().x(d => xScale(d.x)).y(d => yScale(d.yHat)).curve(d3.curveBasis));
    
    // Data points
    svg.selectAll('.data-point')
      .data(xData.map((x, i) => ({ x: x, y: yData[i] })))
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 6)
      .attr('fill', '#ffffff')
      .attr('stroke', '#ff0095')
      .attr('stroke-width', 2);
    
    // Axes
    svg.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(10))
      .classed('d3-axis', true);
    
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(10))
      .classed('d3-axis', true);
    
    // Axis labels
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 55)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Water Temperature (°C)');
    
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .style('text-anchor', 'middle')
      .classed('d3-axis-label', true)
      .text('Algal Growth Rate (mg/L/day)');
    
    // Title
    svg.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -25)
      .style('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .text('Quadratic Regression: y = β₀ + β₁x + β₂x² with CI and PI Bands');
    
    // Legend
    const legendX = innerWidth + 20;
    const legendY = 50;
    
    // Regression line
    svg.append('line')
      .attr('x1', legendX)
      .attr('x2', legendX + 40)
      .attr('y1', legendY)
      .attr('y2', legendY)
      .attr('stroke', '#00ff88')
      .attr('stroke-width', 3);
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 5)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Regression');
    
    // CI band
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY + 25)
      .attr('width', 40)
      .attr('height', 15)
      .attr('fill', '#00d4ff')
      .attr('fill-opacity', 0.3)
      .attr('stroke', '#00d4ff')
      .attr('stroke-width', 2);
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 37)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('95% CI');
    
    // PI band
    svg.append('rect')
      .attr('x', legendX)
      .attr('y', legendY + 55)
      .attr('width', 40)
      .attr('height', 15)
      .attr('fill', '#ff6b35')
      .attr('fill-opacity', 0.2)
      .attr('stroke', '#ff6b35')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3');
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 67)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('95% PI');
    
    // Data points legend
    svg.append('circle')
      .attr('cx', legendX + 20)
      .attr('cy', legendY + 95)
      .attr('r', 6)
      .attr('fill', '#ffffff')
      .attr('stroke', '#ff0095')
      .attr('stroke-width', 2);
    svg.append('text')
      .attr('x', legendX + 50)
      .attr('y', legendY + 100)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('Data');
    
    // Annotation
    svg.append('text')
      .attr('x', innerWidth + 20)
      .attr('y', legendY + 150)
      .style('fill', '#9efcff')
      .style('font-size', '12px')
      .text('n = 30 observations');
    
    svg.append('text')
      .attr('x', innerWidth + 20)
      .attr('y', legendY + 175)
      .style('fill', '#9efcff')
      .style('font-size', '12px')
      .text('PI > CI always!');
  }
  
  const slideId = 'ci-pi-visualization';
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createQuadraticRegressionPlot);
  } else {
    createQuadraticRegressionPlot();
  }
  
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', event => {
      if (event.currentSlide && event.currentSlide.getAttribute('id') === slideId) {
        createQuadraticRegressionPlot();
      }
    });
  }
})();
</script>

---

<!-- .slide:id="multiple-regression-intro" -->
## Multiple Linear Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Extending to Multiple Predictors*

-! So far: Simple linear regression with **one predictor**

$$y = \beta_0 + \beta_1 x + \varepsilon$$

***

-! Now: **Multiple predictors** $x_1, x_2, \ldots, x_p$

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \ldots + \beta_p x_p + \varepsilon$$

***

-! In matrix form (same as before!):

$$\mathbf{y} = \mathbf{X} \boldsymbol{\beta} + \boldsymbol{\varepsilon}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Water Science Example*

-! Predicting algal growth from multiple factors:

<div style="background: #1a588bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
<b>Response (y):</b> Chlorophyll-a concentration (µg/L)
</div>

<div style="background: #436b8bff; color: #ffffff; padding: 10px; border-radius: 8px; margin: 8px 0; font-size: 0.8em;">
<b>Predictors:</b><br>
• x₁ = Nitrate (mg/L)<br>
• x₂ = Phosphate (mg/L)<br>
• x₃ = Water temperature (°C)<br>
• x₄ = Light intensity (lux)
</div>

***

-= All continuous variables → standard multiple regression

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="multiple-regression-design-matrix" -->
## Design Matrix for Multiple Regression
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Continuous Predictors*

-! Each column represents one predictor:

$$\mathbf{X} = \begin{bmatrix} 1 & x_{11} & x_{12} & \cdots & x_{1p} \\\\ 1 & x_{21} & x_{22} & \cdots & x_{2p} \\\\ \vdots & \vdots & \vdots & \ddots & \vdots \\\\ 1 & x_{n1} & x_{n2} & \cdots & x_{np} \end{bmatrix}$$

-: First column: all 1s (intercept)
-: Columns 2 to p+1: predictor values

-! Same normal equation applies:
$${\boldsymbol{\beta}_{hat}} = (\mathbf{X}^\top \mathbf{X})^{-1} \mathbf{X}^\top \mathbf{y}$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: 5 Observations, 2 Predictors*

<div style="font-size: 0.7em;">

| Obs | Nitrate | Phosphate | Algae |
|:---:|:-------:|:---------:|:-----:|
| 1   | 2.1     | 0.5       | 15    |
| 2   | 3.5     | 0.8       | 28    |
| 3   | 1.8     | 0.3       | 12    |
| 4   | 4.2     | 0.9       | 32    |
| 5   | 2.8     | 0.6       | 21    |

</div>

$$\mathbf{X} = \begin{bmatrix} 1 & 2.1 & 0.5 \\\\ 1 & 3.5 & 0.8 \\\\ 1 & 1.8 & 0.3 \\\\ 1 & 4.2 & 0.9 \\\\ 1 & 2.8 & 0.6 \end{bmatrix}, \quad \mathbf{y} = \begin{bmatrix} 15 \\\\ 28 \\\\ 12 \\\\ 32 \\\\ 21 \end{bmatrix}$$

-: df = n - p = 5 - 3 = **2**

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="categorical-predictors" -->
## What About Categorical Predictors?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*The Challenge*

-! Not all predictors are continuous numbers

***

-! *Categorical variables* in water science:
-: Sampling site (A, B, C, D)
-: Season (Spring, Summer, Fall, Winter)
-: Treatment type (Control, Chemical, Biological)
-: Land use (Urban, Agricultural, Forest)

***

-? How do we encode "Site A" or "Summer" in a design matrix?

-= We can't multiply β by "Site A"!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Solution: Dummy Coding*

-! Convert categories to *binary (0/1) variables*

<div style="font-size: 0.7em;">

| Site | $d_B$ | $d_C$ | $d_D$ |
|:----:|:-----:|:-----:|:-----:|
| A    | 0     | 0     | 0     |
| B    | 1     | 0     | 0     |
| C    | 0     | 1     | 0     |
| D    | 0     | 0     | 1     |

</div>

-! *Reference category* (Site A): all dummies = 0
-! Each dummy represents "difference from reference"

-: $d_B = 1$ means "this is Site B"
-: Coefficient $\beta_B$ = difference between Site B and Site A

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-as-regression" -->
## ANOVA is Linear Regression!
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Remember one-way ANOVA?*

-! From your previous lecture: comparing means across groups

-: ANOVA tests: Are group means different?

$$F = \frac{MS_{between}}{MS_{within}}$$

***

-! *Key insight*: ANOVA is just regression with categorical predictors!

$$y_{ij} = \mu + \alpha_i + \varepsilon_{ij}$$

-: $\mu$ = overall mean (intercept)
-: $\alpha_i$ = effect of group $i$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Water Quality Example*

-! Dissolved oxygen (mg/L) at 4 sampling sites:

<div style="font-size: 0.7em;">

| Site A | Site B | Site C | Site D |
|:------:|:------:|:------:|:------:|
| 7.2    | 8.1    | 6.5    | 7.8    |
| 7.5    | 8.3    | 6.8    | 7.6    |
| 7.1    | 8.0    | 6.4    | 7.9    |
| 7.4    | 8.2    | 6.7    | 7.7    |

</div>

***

-? In ANOVA: Is there a site effect?
-? In regression: Do the site dummy coefficients differ from zero?

-= *Same question, same answer!*

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-design-matrix" -->
## The ANOVA Design Matrix
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Encoding Groups as Dummies*

-! 4 sites, 4 observations each → n = 16

-! Reference: Site A (all zeros)

<div style="font-size: 0.7em;">

$$\mathbf{X} = \begin{bmatrix} 1 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ 1 & 1 & 0 & 0 \\\\ \vdots & \vdots & \vdots & \vdots \end{bmatrix} \quad \mathbf{y} = \begin{bmatrix} 7.2 \\\\ 7.5 \\\\ 7.1 \\\\ 7.4 \\\\ 8.1 \\\\ 8.3 \\\\ 8.0 \\\\ 8.2 \\\\ \vdots \end{bmatrix}$$

</div>

-: Column 1: Intercept (always 1)
-: Columns 2-4: Dummies for B, C, D

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Coefficient Interpretation*

$$\boldsymbol{\beta} = \begin{bmatrix} \beta_0 \\\\ \beta_B \\\\ \beta_C \\\\ \beta_D \end{bmatrix}$$

***

-: **$\beta_0$** = Mean of Site A (reference)
-: **$\beta_B$** = $\bar{y}_B - \bar{y}_A$ (Site B effect)
-: **$\beta_C$** = $\bar{y}_C - \bar{y}_A$ (Site C effect)
-: **$\beta_D$** = $\bar{y}_D - \bar{y}_A$ (Site D effect)

***

-= The **F-test** in ANOVA tests if $\beta_B = \beta_C = \beta_D = 0$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-design-matrix-visual" -->
## Visualizing the Design Matrix

<div id="anova-design-matrix-chart" style="width: 100%; min-height: 700px;"></div>

<script>
(function() {
  const containerId = 'anova-design-matrix-chart';
  
  function createDesignMatrixVisualization() {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    d3.select(container).selectAll('*').remove();
    
    const width = 1400;
    const height = 700;
    
    const svg = d3.select(container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Design matrix data (4 sites, 4 obs each)
    const sites = ['A', 'A', 'A', 'A', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'C', 'D', 'D', 'D', 'D'];
    const y = [7.2, 7.5, 7.1, 7.4, 8.1, 8.3, 8.0, 8.2, 6.5, 6.8, 6.4, 6.7, 7.8, 7.6, 7.9, 7.7];
    
    const X = sites.map(s => [
      1,
      s === 'B' ? 1 : 0,
      s === 'C' ? 1 : 0,
      s === 'D' ? 1 : 0
    ]);
    
    const cellSize = 35;
    const matrixX = 100;
    const matrixY = 80;
    
    // Colors
    const colors = {
      one: '#00d4ff',
      zero: '#2d3a66',
      highlight: '#ff6b35',
      text: '#ffffff'
    };
    
    // Title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 40)
      .style('text-anchor', 'middle')
      .classed('d3-chart-title', true)
      .text('One-Way ANOVA Design Matrix: 4 Sites × 4 Observations');
    
    // Column headers
    const headers = ['1', 'd_B', 'd_C', 'd_D'];
    headers.forEach((h, i) => {
      svg.append('text')
        .attr('x', matrixX + i * cellSize + cellSize / 2)
        .attr('y', matrixY - 10)
        .style('text-anchor', 'middle')
        .style('fill', '#ff0095')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .text(h);
    });
    
    // Draw matrix cells
    X.forEach((row, i) => {
      // Site label
      svg.append('text')
        .attr('x', matrixX - 40)
        .attr('y', matrixY + i * cellSize + cellSize / 2 + 5)
        .style('text-anchor', 'middle')
        .style('fill', sites[i] === 'A' ? '#00ff88' : sites[i] === 'B' ? '#00d4ff' : sites[i] === 'C' ? '#ff6b35' : '#ffff00')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text(sites[i]);
      
      row.forEach((val, j) => {
        svg.append('rect')
          .attr('x', matrixX + j * cellSize)
          .attr('y', matrixY + i * cellSize)
          .attr('width', cellSize - 2)
          .attr('height', cellSize - 2)
          .attr('fill', val === 1 ? colors.one : colors.zero)
          .attr('rx', 4);
        
        svg.append('text')
          .attr('x', matrixX + j * cellSize + cellSize / 2)
          .attr('y', matrixY + i * cellSize + cellSize / 2 + 5)
          .style('text-anchor', 'middle')
          .style('fill', val === 1 ? '#000000' : '#666666')
          .style('font-size', '14px')
          .style('font-weight', 'bold')
          .text(val);
      });
      
      // Y values
      svg.append('text')
        .attr('x', matrixX + 4 * cellSize + 40)
        .attr('y', matrixY + i * cellSize + cellSize / 2 + 5)
        .style('text-anchor', 'middle')
        .style('fill', '#9efcff')
        .style('font-size', '14px')
        .text(y[i].toFixed(1));
    });
    
    // Y vector label
    svg.append('text')
      .attr('x', matrixX + 4 * cellSize + 40)
      .attr('y', matrixY - 10)
      .style('text-anchor', 'middle')
      .style('fill', '#ff0095')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('y');
    
    // Matrix brackets
    svg.append('text')
      .attr('x', matrixX - 60)
      .attr('y', matrixY + 8 * cellSize)
      .style('fill', '#ffffff')
      .style('font-size', '24px')
      .text('X =');
    
    // Explanation section
    const explainX = 380;
    const explainY = 100;
    
    svg.append('text')
      .attr('x', explainX)
      .attr('y', explainY)
      .style('fill', '#ff0095')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text('Coefficient Interpretation:');
    
    const explanations = [
      { color: '#00ff88', text: 'β₀ = Mean of Site A (reference) = 7.30' },
      { color: '#00d4ff', text: 'β_B = Mean(B) - Mean(A) = 8.15 - 7.30 = +0.85' },
      { color: '#ff6b35', text: 'β_C = Mean(C) - Mean(A) = 6.60 - 7.30 = -0.70' },
      { color: '#ffff00', text: 'β_D = Mean(D) - Mean(A) = 7.75 - 7.30 = +0.45' }
    ];
    
    explanations.forEach((exp, i) => {
      svg.append('rect')
        .attr('x', explainX - 10)
        .attr('y', explainY + 30 + i * 45)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', exp.color)
        .attr('rx', 4);
      
      svg.append('text')
        .attr('x', explainX + 20)
        .attr('y', explainY + 45 + i * 45)
        .style('fill', '#ffffff')
        .style('font-size', '18px')
        .text(exp.text);
    });
    
    // ANOVA connection
    svg.append('text')
      .attr('x', explainX)
      .attr('y', explainY + 250)
      .style('fill', '#00ff88')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text('ANOVA F-test:');
    
    svg.append('text')
      .attr('x', explainX)
      .attr('y', explainY + 285)
      .style('fill', '#ffffff')
      .style('font-size', '18px')
      .text('H₀: β_B = β_C = β_D = 0  (no site effect)');
    
    svg.append('text')
      .attr('x', explainX)
      .attr('y', explainY + 315)
      .style('fill', '#ffffff')
      .style('font-size', '18px')
      .text('H₁: At least one βᵢ ≠ 0  (site effect exists)');
    
    // Legend for matrix colors
    svg.append('text')
      .attr('x', explainX)
      .attr('y', explainY + 380)
      .style('fill', '#9efcff')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Matrix Legend:');
    
    svg.append('rect')
      .attr('x', explainX)
      .attr('y', explainY + 400)
      .attr('width', 25)
      .attr('height', 25)
      .attr('fill', colors.one)
      .attr('rx', 4);
    svg.append('text')
      .attr('x', explainX + 35)
      .attr('y', explainY + 418)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('= 1 (belongs to this group)');
    
    svg.append('rect')
      .attr('x', explainX + 280)
      .attr('y', explainY + 400)
      .attr('width', 25)
      .attr('height', 25)
      .attr('fill', colors.zero)
      .attr('rx', 4);
    svg.append('text')
      .attr('x', explainX + 315)
      .attr('y', explainY + 418)
      .style('fill', '#ffffff')
      .style('font-size', '14px')
      .text('= 0 (not in this group)');
  }
  
  const slideId = 'anova-design-matrix-visual';
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createDesignMatrixVisualization);
  } else {
    createDesignMatrixVisualization();
  }
  
  if (window.Reveal && typeof window.Reveal.on === 'function') {
    window.Reveal.on('slidechanged', event => {
      if (event.currentSlide && event.currentSlide.getAttribute('id') === slideId) {
        createDesignMatrixVisualization();
      }
    });
  }
})();
</script>

---

<!-- .slide:id="two-way-anova" -->
## Two-Way ANOVA: Two Categorical Factors
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Adding a Second Factor*

-! What if we measure at *4 sites* across *4 seasons*?

-! Two factors:
-: Factor A: Site (A, B, C, D)
-: Factor B: Season (Spring, Summer, Fall, Winter)

***

-! Questions we can ask:
-: Is there a *site effect*?
-: Is there a *season effect*?
-: Is there an *interaction* (site × season)?

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Water Quality Example*

<div style="font-size: 0.7em;">

| | Spring | Summer | Fall | Winter |
|:---:|:------:|:------:|:----:|:------:|
| **A** | 7.8 | 6.5 | 7.2 | 8.1 |
| **B** | 8.5 | 7.2 | 7.9 | 8.8 |
| **C** | 7.0 | 5.8 | 6.5 | 7.4 |
| **D** | 8.2 | 6.9 | 7.6 | 8.5 |

</div>

***

-! Model (without interaction):
$$y_{ijk} = \mu + \alpha_i + \gamma_j + \varepsilon_{ijk}$$

-: $\alpha_i$ = site effect
-: $\gamma_j$ = season effect

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="two-way-design-matrix" -->
## Two-Way ANOVA Design Matrix
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Combining Both Factors*

-! Need dummies for both:
-: 3 dummies for Site (B, C, D vs. A)
-: 3 dummies for Season (Sum, Fall, Win vs. Spring)

<div style="font-size: 0.7em;">

$$\mathbf{X} = \begin{bmatrix} 1 & d_B & d_C & d_D & d_{Sum} & d_{Fall} & d_{Win} \\\\ \vdots & \vdots & \vdots & \vdots & \vdots & \vdots & \vdots \end{bmatrix}$$

</div>

***

-! For observation at Site B, Summer:
$$\mathbf{x} = [1, 1, 0, 0, 1, 0, 0]$$

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Full Design Matrix Structure*

<div style="font-size: 0.7em;">

| Obs | 1 | $d_B$ | $d_C$ | $d_D$ | $d_{Sum}$ | $d_{Fal}$ | $d_{Win}$ |
|:---:|:-:|:-----:|:-----:|:-----:|:---------:|:---------:|:---------:|
| A,Spr | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| A,Sum | 1 | 0 | 0 | 0 | 1 | 0 | 0 |
| A,Fal | 1 | 0 | 0 | 0 | 0 | 1 | 0 |
| A,Win | 1 | 0 | 0 | 0 | 0 | 0 | 1 |
| B,Spr | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| B,Sum | 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| ... | ... | ... | ... | ... | ... | ... | ... |

</div>

-= Same regression framework, more columns!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="interaction-terms" -->
## Interaction Effects
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*When Effects Are Not Additive*

-! *Main effects only*: Site and Season act independently

$$y = \mu + \alpha_{site} + \gamma_{season} + \varepsilon$$

***

-! *With interaction*: Effect of site depends on season

$$y = \mu + \alpha_{site} + \gamma_{season} + (\alpha\gamma)_{site,season} + \varepsilon$$

***

-! In design matrix: *multiply dummy columns*!

-: $d_B \times d_{Sum}$ = interaction for Site B in Summer

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example: Why Interactions Matter*

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>Without interaction:</b><br>
Site B always +0.8 higher than Site A<br>
Summer always -1.2 lower than Spring
</div>

<div style="background: #702914ff; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0; font-size: 0.85em;">
<b>With interaction:</b><br>
Site B in Summer shows <em>extra</em> drop of -0.5<br>
(maybe algae bloom affects Site B more in summer)
</div>

***

-! Interaction columns in design matrix:
-: $d_B \cdot d_{Sum}$, $d_B \cdot d_{Fal}$, $d_B \cdot d_{Win}$
-: $d_C \cdot d_{Sum}$, $d_C \cdot d_{Fal}$, ... etc.

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="anova-regression-webr" -->
## ANOVA as Regression in R
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Demonstrating the Equivalence*

-! Let's see that ANOVA and regression give **identical results**

-! Using `lm()` with a factor variable automatically creates dummy coding

-! The F-statistic from `anova()` matches the regression F-test

-! Coefficients are group differences from reference

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="anova-regression-webr-container"></div>

<script>
(function() {
  const containerId = 'anova-regression-webr-container';
  const code = `# Water quality data: DO at 4 sites
Site <- factor(rep(c("A", "B", "C", "D"), each = 4))
DO <- c(7.2, 7.5, 7.1, 7.4,   # Site A
        8.1, 8.3, 8.0, 8.2,   # Site B
        6.5, 6.8, 6.4, 6.7,   # Site C
        7.8, 7.6, 7.9, 7.7)   # Site D

# Method 1: Traditional ANOVA
cat("===== TRADITIONAL ANOVA =====\\n")
aov_result <- aov(DO ~ Site)
print(summary(aov_result))

# Method 2: Linear regression with factor
cat("\\n===== REGRESSION APPROACH =====\\n")
lm_result <- lm(DO ~ Site)
print(summary(lm_result))

# Show the design matrix
cat("\\n===== DESIGN MATRIX (first 8 rows) =====\\n")
X <- model.matrix(lm_result)
print(head(X, 8))

# Group means for comparison
cat("\\n===== GROUP MEANS =====\\n")
print(tapply(DO, Site, mean))`;

  const fallback = () => `[Simulated Output]
===== TRADITIONAL ANOVA =====
            Df Sum Sq Mean Sq F value   Pr(>F)    
Site         3  5.300  1.7667   70.67 1.63e-08 ***
Residuals   12  0.300  0.0250                     

===== REGRESSION APPROACH =====
Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept)  7.3000     0.0791   92.29  < 2e-16 ***
SiteB        0.8500     0.1118    7.60  6.4e-06 ***
SiteC       -0.7000     0.1118   -6.26  4.4e-05 ***
SiteD        0.4500     0.1118    4.02   0.0017 ** 

F-statistic: 70.67 on 3 and 12 DF,  p-value: 1.63e-08`;

  const init = async () => {
    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId,
      code,
      slideId: 'anova-regression-webr',
      fallback,
      runLabel: 'Run ANOVA vs Regression (WebR)'
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




