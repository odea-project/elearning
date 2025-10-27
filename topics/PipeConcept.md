---
title: "R Pipes: Chaining Operations"
author: "Gerrit Renner"
keywords: ["pipe", "base R", "workflow", "readability"]
requirements: ["Mean Values", "Data Handling"]
description: "Mini tutorial on the native R pipe operator (|>) for readable data workflows."
---
<!-- End of metadata -->

<!-- .slide:id="why-pipes" -->
## Why Use Pipes?
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Step-by-Step Approach*

-! Four lines to compute geometric SD on a log scale

<div id="pipe-why-step-container"></div>

-: Reads clearly but introduces many temporary objects

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Nested Functions*

-! Same idea collapsed into one expression

<div id="pipe-why-nested-container"></div>
-: Shorter code yet harder to scan and debug
-? Need to track the flow from the innermost call outwards

<!-- /position -->
<!-- /layout -->

<script>
(function() {
  const init = async () => {
    const stepCode = `data <- c(3, 5, 9, 15)
log_data <- log(data)
sd_log <- sd(log_data)
sd_geom <- exp(sd_log)
print(sd_geom)`;

    const nestedCode = `sd_geom_nested <- exp(sd(log(c(3, 5, 9, 15))))
print(sd_geom_nested)`;

    const stepFallback = () => {
      const data = [3, 5, 9, 15];
      const logData = data.map(v => Math.log(v));
      const meanLog = logData.reduce((a, b) => a + b, 0) / logData.length;
      const varianceLog = logData.reduce((sum, val) => sum + Math.pow(val - meanLog, 2), 0) / (logData.length - 1);
      const sdLog = Math.sqrt(varianceLog);
      const sdGeom = Math.exp(sdLog);
      return `[Simulated]\nlog_data: ${logData.map(v => v.toFixed(3)).join(", ")}\nsd_log: ${sdLog.toFixed(3)}\nsd_geom: ${sdGeom.toFixed(3)}`;
    };

    const nestedFallback = () => {
      const data = [3, 5, 9, 15];
      const logData = data.map(v => Math.log(v));
      const meanLog = logData.reduce((a, b) => a + b, 0) / logData.length;
      const varianceLog = logData.reduce((sum, val) => sum + Math.pow(val - meanLog, 2), 0) / (logData.length - 1);
      const sdLog = Math.sqrt(varianceLog);
      const sdGeom = Math.exp(sdLog);
      return `[Simulated]\nsd_geom_nested: ${sdGeom.toFixed(3)}`;
    };

    const helper = await window.ensureWebRHelper();

    await helper.initInteractiveSection({
      containerId: 'pipe-why-step-container',
      code: stepCode,
      slideId: 'why-pipes',
      fallback: stepFallback,
      runLabel: 'Run Step Workflow',
      minHeight: '120px'
    });

    await helper.initInteractiveSection({
      containerId: 'pipe-why-nested-container',
      code: nestedCode,
      slideId: 'why-pipes',
      fallback: nestedFallback,
      runLabel: 'Run Nested Call',
      minHeight: '120px'
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

<!-- .slide:id="pipe-highlight" -->
## Pipe Expression
<!-- layout={rows: 1, columns: 1} -->
<!-- position={row: 1, column: 1} -->
*All steps as a single pipeline*

<div id="pipe-why-pipe-container" style="text-align: left;"></div>

-! Read left to right, reuse as one expression

<script>
(function() {
  const init = async () => {
    const pipeCode = `sd_geom_pipe <- c(3, 5, 9, 15) |> log() |> sd() |> exp() |> print()`;

    const pipeFallback = () => {
      const data = [3, 5, 9, 15];
      const logData = data.map(v => Math.log(v));
      const meanLog = logData.reduce((a, b) => a + b, 0) / logData.length;
      const varianceLog = logData.reduce((sum, val) => sum + Math.pow(val - meanLog, 2), 0) / (logData.length - 1);
      const sdLog = Math.sqrt(varianceLog);
      const sdGeom = Math.exp(sdLog);
      return `[Simulated]\nsd_geom_pipe: ${sdGeom.toFixed(3)}`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'pipe-why-pipe-container',
      code: pipeCode,
      slideId: 'pipe-highlight',
      fallback: pipeFallback,
      runLabel: 'Run Pipe Expression',
      minHeight: '120px'
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

<!-- .slide:id="base-pipe-syntax" -->
## Base R Pipe `|>`
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Syntax*

```
object |> f()
object |> f(arg = 1)
object |> (\(x) g(x, more = 2))()
```

***

-! `|>` passes the left side as the **first unnamed argument**
-! When you need another position, wrap the step in an anonymous function `\(x) ...`

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Examples*

```r
1:10 |> mean()
"time" |> toupper()
c(3, 5, 9, 15) |> log() |> sd() |> exp()
```

***

<div style="background: #1a2340; color: #9efcff; padding: 12px; border-radius: 8px; font-size: 0.8em;">
<b>Tip:</b> `|>` is built into base R (>= 4.1). No extra packages needed.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="pipe-mechanics" -->
## Pipe Mechanics
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*How it Works*

-! `x |> f()` passes `x` as the first unnamed argument of `f`
-! Keep chaining: `values |> log() |> sd() |> exp()`
-! Wrap steps in anonymous functions `\(x) { ... }` for full control

***

*Evaluation*

-! Pipes are **left-associative**: `a |> b() |> c()`
-! Each step waits for the previous result (no lazy evaluation)
-! Parentheses still group as usual: `(a |> b()) |> c()`

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Best Practices*

-! Keep side effects outside of pipelines when possible
-! Return consistent types to avoid surprises downstream
-! Assign important results: `result <- data |> transform(...)`

***

<div style="font-size: 0.75em; opacity: 0.8;">
Base R pipes are available from R 4.1 onward—no external packages required.
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="base-pipe-example" -->
## Base Pipe in Action
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Goal*

-! Clean a numeric vector
-! Remove missing values
-! Compute summary statistics

***

-? Chain basic verbs without nested parentheses

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pipe-basic-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `values <- c(3, 5, 9, 15)

exp_sd <- values |>
  log() |>
  sd() |>
  exp()

scaled <- values |>
  (\(x) x / max(x))()

result <- list(
  exp_sd_log = round(exp_sd, 3),
  scaled = round(scaled, 3)
)

print(result)`;

    const fallback = () => {
      const values = [3, 5, 9, 15];
      const logVals = values.map(v => Math.log(v));
      const meanLog = logVals.reduce((a, b) => a + b, 0) / logVals.length;
      const varianceLog = logVals.reduce((sum, val) => sum + Math.pow(val - meanLog, 2), 0) / (logVals.length - 1);
      const sdLog = Math.sqrt(varianceLog);
      const expSd = Math.exp(sdLog);
      const maxVal = Math.max(...values);
      const scaled = values.map(v => v / maxVal);
      return `[Simulated]\nexp_sd_log: ${expSd.toFixed(3)}\nscaled: ${scaled.map(v => v.toFixed(3)).join(", ")}`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.quickSetup('pipe-basic-container', code, 'base-pipe-example', fallback);
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

<!-- .slide:id="dataset-pipe" -->
## Data Frame Pipeline
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Scenario*

-! Work with `mtcars`
-! Filter to 4-cylinder cars
-! Create km per liter column
-! Summarise by transmission

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div id="pipe-df-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `stations <- data.frame(
  station = c("River A", "River B", "River C", "River D"),
  turbidity = c(2.8, 5.1, 3.4, 1.9),
  source = c("automatic", "manual", "manual", "automatic"),
  flow_cms = c(1.1, 1.6, 1.3, 0.9)
)

summary_tbl <- stations |>
  subset(source == "manual") |>
  transform(turbidity_class = ifelse(turbidity >= 4, "high", "ok")) |>
  (\(df) data.frame(
    samples = nrow(df),
    mean_turbidity = round(mean(df$turbidity), 2),
    mean_flow = round(mean(df$flow_cms), 2)
  ))

print(summary_tbl)`;

    const fallback = () => {
      return `[Simulated]\n  samples mean_turbidity mean_flow\n1       2            4.25      1.45`;
    };

    const helper = await window.ensureWebRHelper();
    await helper.initInteractiveSection({
      containerId: 'pipe-df-container',
      code: code,
      slideId: 'dataset-pipe',
      fallback: fallback,
      runLabel: 'Run Pipeline'
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

<!-- .slide:id="pipe-tips" -->
## Pipe Tips & Pitfalls
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Do*

-! Keep steps focused on one action
-! Extract complex logic into helper functions
-! Comment long pipelines at key milestones

***

*Don't*

-! Stuff control flow (if/for) inside a pipe
-! Mix return values of different types mid-pipeline
-! Forget to assign the final result!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Debugging*

-! Use `|> {
  print(head(.));
  .
}` to inspect midstream
-! Break long chains and run step by step
-! Name intermediate objects when encountering errors

***

<div style="background: #09414d; color: #00dee6; padding: 12px; border-radius: 8px; font-size: 0.85em;">
<b>Key takeaway:</b> Pipes highlight data flow. Use them when each step tells a clear story.
</div>

<!-- /position -->
<!-- /layout -->
