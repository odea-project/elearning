---
title: "Distances"
author: "Gerrit Renner"
keywords: ["Distance", "Metric", "Similarity", "Dissimilarity"]
requirements: ["none"]
description: "Introduction to distance metrics and their applications in data similarity analysis."

---

# Distances

---

## Initial thoughts on **data similarity** analysis

Let's assume we have a data set that contains the following information:
- For each sample A-E (`objects`) the `variable` [Fe] was measured

| Sample | [Fe] |
|:---:|:---:|
| A | 2.3 |
| B | 2.7 |
| C | 8.9 |
| D | 8.1 |
| E | 2.5 |

**?** How can we compare these samples (`objects`)?

--- 

## From **data similarity** to **distance matrix**

A quite intuitive way to compare the `objects` is considering the `variable's` absolute differences.

$$ d_{i,j} = |x_i - x_j| $$

- Where $x_i$ and $x_j$ are the values of the `variable` [x] of the samples $i$ and $j$, respectively.
- The result is a `distance matrix` that contains the absolute differences between all samples.

| Sample | A | B | C | D | E |
|:---:|:---:|:---:|:---:|:---:|:---:|
| *A* | 0.0 | 0.4 | 6.6 | 5.8 | 0.2 |
| *B* | 0.4 | 0.0 | 6.2 | 5.4 | 0.2 |
| *C* | 6.6 | 6.2 | 0.0 | 0.8 | 6.4 |
| *D* | 5.8 | 5.4 | 0.8 | 0.0 | 5.6 |
| *E* | 0.2 | 0.2 | 6.4 | 5.6 | 0.0 |

---

## **data similarity** for multivariate data

Now, let's assume we have more than one `variable` measured.

- I.e., every `object` has a `vector` of `variables` associated with it.

| Sample | [Fe] | [Cu] | [Zn] | [Mn] |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 2.3 | 1.2 | 0.5 | 0.2 |
| 2 | 2.7 | 1.1 | 0.4 | 0.3 |
| 3 | 1.9 | 1.3 | 0.6 | 0.1 |
| 4 | 2.1 | 1.0 | 0.3 | 0.4 |
| 5 | 2.5 | 1.4 | 0.7 | 0.5 |

**?** How can we compare these samples (`objects`)?

---