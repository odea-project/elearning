---
title: "Random Variables"
author: "Gerrit Renner"
keywords: ["random variable", "discrete random variable", "continuous random variable"]
requirements: ["none"]
description: "Introduction to random variables, their types, and applications"
---
<!-- End of metadata -->

<!-- .slide:id="requirements" -->
## Requirements
- No prior knowledge required.

---

<!-- .slide:id="initial-thoughts-dice" -->
## Initial Thoughts
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Let's assume we have a common dice.

***

<div style="text-align: center;">
<i class="fas fa-dice fa-3x"></i>
</div>

***

-? Which result will it when rolling?
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Rolling a digital dice:
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div id="dice-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden;"></div>
  <button id="run-dice-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
    <i class="fas fa-play"></i> Roll the Dice
  </button>
  <div id="dice-output-container" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 60px;"></div>
</div>

<script>
(function() {
  const initDiceExample = async () => {
    // Wait for dependencies
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initDiceExample, 100);
      return;
    }

    const diceCode = `result <- sample(1:6, 1)
print(result)`;

    // Get R language support
    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    // Custom theme extension for larger font size
    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "2em" },
      ".cm-content": { fontSize: "2em" },
      ".cm-gutters": { fontSize: "2em" }
    });

    // Create editor
    const editorParent = document.getElementById('dice-editor-container');
    if (!editorParent || editorParent.querySelector('.cm-editor')) return;

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);

    const diceEditor = new window.EditorView({
      state: window.EditorState.create({
        doc: diceCode,
        extensions: editorExtensions
      }),
      parent: editorParent
    });

    // Create output editor
    const outputParent = document.getElementById('dice-output-container');
    if (!outputParent) return;

    const outputExtensions = [
      window.basicSetup,
      window.monokai,
      fontSizeTheme,
      window.EditorView.editable.of(false)
    ];
    if (rLang.length) outputExtensions.splice(1, 0, rLang);

    const outputEditor = new window.EditorView({
      state: window.EditorState.create({
        doc: '',
        extensions: outputExtensions
      }),
      parent: outputParent
    });

    // Run button handler
    const runBtn = document.getElementById('run-dice-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const code = diceEditor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Rolling..." }
        });

        try {
          // Try to use WebR if available
          const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
          const webR = new mod.WebR();
          await webR.init();

          const r = await webR.evalR(`
            paste(capture.output({
              tryCatch({
                ${code}
              }, error = function(e) {
                message("Error: ", conditionMessage(e))
              })
            }), collapse="\\n")
          `);
          let output = await r.toString();
          // Remove R's output prefix like [1], [2], etc.
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          // Fallback: simulate dice roll in JavaScript
          const result = Math.floor(Math.random() * 6) + 1;
          const output = `[Simulated in JavaScript]\nYou rolled: ${result}`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiceExample);
  } else {
    initDiceExample();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---
<!-- .slide:id="initial-thoughts-2" -->
## Initial Thoughts - 2
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The result of rolling a dice is not deterministic.

***

-! The result of rolling a dice is influenced by random processes.

<!-- /position -->
<!-- position={row: 1, column: 2} -->

-! The result of rolling a dice can be described by a **random variable**.

***

-? What's about the results of measuring a sample, e.g., `[Fe]` in drinking water?
<!-- /position -->
<!-- /layout -->

---
<!-- .slide:id="measuring-sample" -->
## Measuring a Sample - Example
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! When measuring a sample (e.g., Fe concentration in water), we expect a constant value.

***

-! In reality, each measurement contains noise and uncertainty.

***

- Try toggling between the ideal and real measurement signals!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 15px; width: 100%;">
  <div id="chart-measurement-signal" style="width: 100%; height: 400px;"></div>
  <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 1.1em;">
      <input type="checkbox" id="toggle-real-measurement" style="width: 20px; height: 20px; cursor: pointer;">
      <span style="color: #ff6b6b;">Real Measurement (with noise)</span>
    </label>
  </div>
  <div style="text-align: center; font-size: 0.9em; color: #888;">
    <span style="color: #00ff00;">━━━</span> Ideal Signal (constant) &nbsp;&nbsp;
    <span style="color: #ff6b6b;">━━━</span> Real Signal (noisy)
  </div>
</div>

<script src="resources/js/charts/random_variable_measurement.js"></script>
<!-- /position -->
<!-- /layout -->

---
<!-- .slide:id="types-of-random-variables" -->
## Types of Random Variables
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Discrete Random Variables

-! **Definition** : Can only take specific, countable values

***
-> `Number of E. coli colonies` in 100 mL water sample
-: Values: 0, 1, 2, 3, ... (whole numbers only)

-> `pH classification` (if categorized)
-: Values: acidic (1), neutral (2), alkaline (3)

-> `Sample contamination status`
-: Values: clean (0), contaminated (1)

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Continuous Random Variables

-! **Definition** : Can take any value within a range

***

-> `Iron concentration [Fe]` in mg/L
-: Values: Any positive real number (e.g., 4.73, 5.02, 5.18 mg/L)

-> `pH value` (when measured continuously)
-: Values: 0 to 14 (e.g., 6.8, 7.2, 7.45)

-> `Turbidity` in NTU (Nephelometric Turbidity Units)
-: Values: Any non-negative real number
<!-- /position -->
<!-- /layout -->



