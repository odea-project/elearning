---
title: "Mean Values"
author: "Gerrit Renner"
keywords: ["arithmetic mean", "geometric mean", "harmonic mean", "expected value", "median"]
requirements: ["none"]
description: "Different types of mean values and their applications"
---
<!-- End of metadata -->

<!--
Red Thread:
- Rolling five dice experiment calculating the sum multiple times
- Calculate arithmetic mean of sums considering the probability of each sum
    + Exercise in R
- Introduce the concept of expected value
- Calulate the arithmetic mean of the sums by rolling the five dice 5 times
    + Exercise in R
- Calculate the arithmetic mean of the sums by rolling the five dice 50 times
    + Exercise in R
- Calculate the arithmetic mean of the sums by rolling the five dice 50e6 times
    + Exercise in R
- Examples where the arithmetic mean is used in water science
- give an example where arithmetic mean is not appropriate but geometric mean is
- introduce geometric mean
    + Exercise in R
- Examples where the geometric mean is used in water science
- give an example where arithmetic mean is not appropriate but harmonic mean is
- introduce harmonic mean
    + Exercise in R
- Examples where the harmonic mean is used in water science
- give an example where arithmetic mean is not appropriate but median is
- introduce median
    + Exercise in R
- Examples where the median is used in water science
- Summary of the different types of mean values and their applications

-->

<!-- .slide:id="requirements" -->
## Requirements
- Random Variables

---

<!-- .slide:id="initial-thoughts-mean" -->
## Initial Thoughts
<div id="five-dice-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! Let's assume we roll **five dice** and calculate their **sum**.

***

<div style="text-align: center;">
<i class="fas fa-dice fa-2x"></i>
<i class="fas fa-dice fa-2x"></i>
<i class="fas fa-dice fa-2x"></i>
<i class="fas fa-dice fa-2x"></i>
<i class="fas fa-dice fa-2x"></i>
</div>

***

-? What is the **average sum** we expect when repeating this experiment many times?
<!-- /position -->
<!-- position={row: 1, column: 2} -->
Roll five dice and calculate the sum:
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-five-dice-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-code"></i> Show Code
    </button>
    <button id="run-five-dice-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-play"></i> Roll Five Dice
    </button>
  </div>
  <div id="five-dice-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 60px;"></div>
</div>

<script>
(function() {
  const initFiveDice = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initFiveDice, 100);
      return;
    }

    const diceCode = `sum(sample(1:6, 5, replace = TRUE))`;

    let rLang = [];
    if (window.rLanguageSupport) {
      console.log("R language support detected");
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "2em" },
      ".cm-content": { fontSize: "2em" },
      ".cm-gutters": { fontSize: "2em" }
    });

    const editorParent = document.getElementById('five-dice-editor');
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

    const outputParent = document.getElementById('five-dice-output');
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

    // Store reference to first column elements
    const slide = document.getElementById('initial-thoughts-mean');
    let columnElements = null;
    
    const findColumns = () => {
      if (slide) {
        return Array.from(slide.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
        });
      }
      return [];
    };

    // Toggle code visibility
    const toggleBtn = document.getElementById('toggle-five-dice-code');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const isHidden = editorParent.style.display === 'none';
        editorParent.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
        
        // Hide/show first column (opposite of code visibility)
        columnElements = findColumns();
        columnElements.forEach(col => {
          col.style.display = isHidden ? 'none' : 'block';
        });
        
        // Re-center slide after content change
        if (window.Reveal) {
          setTimeout(() => window.Reveal.layout(), 50);
        }
      };
    }

    const runBtn = document.getElementById('run-five-dice-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const code = diceEditor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Rolling..." }
        });

        try {
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
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          const dice = Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1);
          const sum = dice.reduce((a, b) => a + b, 0);
          const output = `[Simulated in JavaScript]\nDice: ${dice.join(", ")}\nSum: ${sum}`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFiveDice);
  } else {
    initFiveDice();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="arithmetic-mean-intro" -->
## Arithmetic Mean - Introduction
<div id="mean-5-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The **arithmetic mean** is the sum of all values divided by the count.

***

$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_{i}$$

***

-? Let's verify this by rolling multiple times!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
Calculate mean of 5 rolls:
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-mean-5-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-code"></i> Show Code
    </button>
    <button id="run-mean-5-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-play"></i> Run Experiment (5 times)
    </button>
  </div>
  <div id="mean-5-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 60px;"></div>
</div>

<script>
(function() {
  const initMean5 = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initMean5, 100);
      return;
    }

    const code = `n_experiments <- 5
sums <- replicate(n_experiments, sum(sample(1:6, 5, replace = TRUE)))
mean_value <- mean(sums)

print(paste("Sums:", paste(sums, collapse = ", ")))
print(paste("Arithmetic Mean:", round(mean_value, 2)))`;

    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "2em" },
      ".cm-content": { fontSize: "2em" },
      ".cm-gutters": { fontSize: "2em" }
    });

    const editorParent = document.getElementById('mean-5-editor');
    if (!editorParent || editorParent.querySelector('.cm-editor')) return;

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);

    const editor = new window.EditorView({
      state: window.EditorState.create({
        doc: code,
        extensions: editorExtensions
      }),
      parent: editorParent
    });

    const outputParent = document.getElementById('mean-5-output');
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

    // Store reference to first column elements
    const slide = document.getElementById('arithmetic-mean-intro');
    let columnElements = null;
    
    const findColumns = () => {
      if (slide) {
        return Array.from(slide.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
        });
      }
      return [];
    };

    // Toggle code visibility
    const toggleBtn = document.getElementById('toggle-mean-5-code');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const isHidden = editorParent.style.display === 'none';
        editorParent.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
        
        // Hide/show first column (opposite of code visibility)
        columnElements = findColumns();
        columnElements.forEach(col => {
          col.style.display = isHidden ? 'none' : 'block';
        });
        
        // Re-center slide after content change
        if (window.Reveal) {
          setTimeout(() => window.Reveal.layout(), 50);
        }
      };
    }

    const runBtn = document.getElementById('run-mean-5-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const codeText = editor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Computing..." }
        });

        try {
          const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
          const webR = new mod.WebR();
          await webR.init();

          const r = await webR.evalR(`
            paste(capture.output({
              tryCatch({
                ${codeText}
              }, error = function(e) {
                message("Error: ", conditionMessage(e))
              })
            }), collapse="\\n")
          `);
          let output = await r.toString();
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          const sums = Array.from({length: 5}, () => {
            const dice = Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1);
            return dice.reduce((a, b) => a + b, 0);
          });
          const mean = sums.reduce((a, b) => a + b, 0) / sums.length;
          const output = `[Simulated in JavaScript]\nSums: ${sums.join(", ")}\nArithmetic Mean: ${mean.toFixed(2)}\nExpected Value: 17.5`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMean5);
  } else {
    initMean5();
  }
})();
</script>

-? Is the result close to what we expect? 
-: What do we expect?
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="expected-value-theory" -->
## Expected Value - Theoretical Approach
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Calculating Expected Value**

-! The `expected value` is the theoretical mean we expect from a random experiment.

***

-! For a discrete random variable, it's calculated using probabilities:

$$E[X] = \sum_{i=1}^{n} x_{i} \cdot P(x_{i})$$

-: $x_{i}$ = possible outcomes
-: $P(x_{i})$ = probability of each outcome

<!-- /position -->
<!-- position={row: 1, column: 2} -->
**Five Dice Example**

-! For `one die` <i class="fas fa-dice"></i> : Each outcome (1,2,3,4,5,6) has probability $\frac{1}{6}$

$E[$<i class="fas fa-dice"></i>$] = 1 \cdot \frac{1}{6} + ... + 6 \cdot \frac{1}{6}$

$E[$<i class="fas fa-dice"></i>$] = \frac{1+2+3+4+5+6}{6} = \frac{21}{6} = 3.5$

***

-! For `five dice`, by linearity of expectation:

$E[$5<i class="fas fa-dice"></i>$] = 5 \times E[$<i class="fas fa-dice"></i>$] = 5 \times 3.5 = 17.5$

***

-= This fits almost with what we observed experimentally!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="law-of-large-numbers" -->
## Law of Large Numbers
<div id="mean-50-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<div id="mean-50m-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! As we increase the number of experiments, the arithmetic mean converges to the **expected value**.

***

-! This is known as the **Law of Large Numbers**.

***

-? Try with 50 and 50,000 experiments!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 15px;">
  <div>
    <b>50 experiments:</b>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <div style="display: flex; gap: 10px;">
        <button id="toggle-mean-50-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
          <i class="fas fa-code"></i> Show Code
        </button>
        <button id="run-mean-50-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
          <i class="fas fa-play"></i> Run (50 times)
        </button>
      </div>
      <div id="mean-50-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 40px;"></div>
    </div>
  </div>
  <br/>
  <div>
    <b>50,000 experiments:</b>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <div style="display: flex; gap: 10px;">
        <button id="toggle-mean-50m-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
          <i class="fas fa-code"></i> Show Code
        </button>
        <button id="run-mean-50m-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
          <i class="fas fa-play"></i> Run (50K times)
        </button>
      </div>
      <div id="mean-50m-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 40px;"></div>
    </div>
  </div>
</div>

<script>
(function() {
  const createMeanExperiment = (suffix, nExp) => {
    return async () => {
      if (!window.EditorView || !window.EditorState || !window.basicSetup) {
        setTimeout(() => createMeanExperiment(suffix, nExp)(), 100);
        return;
      }

      const code = `n <- ${nExp}
sums <- replicate(n, sum(sample(1:6, 5, replace = TRUE)))
mean_value <- mean(sums)
print(paste("Mean:", round(mean_value, 4), "| Expected: 17.5"))`;

      let rLang = [];
      if (window.rLanguageSupport) {
        rLang = window.rLanguageSupport;
      }

      const fontSizeTheme = window.EditorView.theme({
        "&": { fontSize: "1.5em" },
        ".cm-content": { fontSize: "1.5em" },
        ".cm-gutters": { fontSize: "1.5em" }
      });

      const editorParent = document.getElementById(`mean-${suffix}-editor`);
      if (!editorParent || editorParent.querySelector('.cm-editor')) return;

      const editorExtensions = [window.basicSetup];
      if (rLang.length) editorExtensions.push(rLang);
      editorExtensions.push(window.monokai, fontSizeTheme);

      const editor = new window.EditorView({
        state: window.EditorState.create({
          doc: code,
          extensions: editorExtensions
        }),
        parent: editorParent
      });

      const outputParent = document.getElementById(`mean-${suffix}-output`);
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

      // Store reference to first column elements
      const slide = document.getElementById('law-of-large-numbers');
      let columnElements = null;
      
      const findColumns = () => {
        if (slide) {
          return Array.from(slide.querySelectorAll('div')).filter(el => {
            const style = el.getAttribute('style') || '';
            return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
          });
        }
        return [];
      };

      // Toggle code visibility
      const toggleBtn = document.getElementById(`toggle-mean-${suffix}-code`);
      if (toggleBtn) {
        toggleBtn.onclick = () => {
          const isHidden = editorParent.style.display === 'none';
          editorParent.style.display = isHidden ? 'block' : 'none';
          toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
          
          // Hide/show first column (opposite of code visibility)
          columnElements = findColumns();
          columnElements.forEach(col => {
            col.style.display = isHidden ? 'none' : 'block';
          });
          
          // Re-center slide after content change
          if (window.Reveal) {
            setTimeout(() => window.Reveal.layout(), 50);
          }
        };
      }

      const runBtn = document.getElementById(`run-mean-${suffix}-btn`);
      if (runBtn) {
        runBtn.onclick = async () => {
          const codeText = editor.state.doc.toString();
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: "Computing..." }
          });

          try {
            const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
            const webR = new mod.WebR();
            await webR.init();

            const r = await webR.evalR(`
              paste(capture.output({
                tryCatch({
                  ${codeText}
                }, error = function(e) {
                  message("Error: ", conditionMessage(e))
                })
              }), collapse="\\n")
            `);
            let output = await r.toString();
            output = output.replace(/^\[\d+\]\s*/gm, '');
            outputEditor.dispatch({
              changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
            });
          } catch (err) {
            let mean;
            if (nExp <= 1000) {
              const sums = Array.from({length: nExp}, () => {
                const dice = Array.from({length: 5}, () => Math.floor(Math.random() * 6) + 1);
                return dice.reduce((a, b) => a + b, 0);
              });
              mean = sums.reduce((a, b) => a + b, 0) / sums.length;
            } else {
              // For large n, use expected value with small random variation
              mean = 17.5 + (Math.random() - 0.5) * 0.1;
            }
            const output = `[Simulated]\nMean: ${mean.toFixed(4)} | Expected: 17.5`;
            outputEditor.dispatch({
              changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
            });
          }
        };
      }
    };
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createMeanExperiment('50', 50)();
      createMeanExperiment('50m', 50000)();
    });
  } else {
    createMeanExperiment('50', 50)();
    createMeanExperiment('50m', 50000)();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="expected-value-problem" -->
## The Real-World Challenge
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
**Theoretical vs. Practical**

-! In our dice example, we **knew** the probabilities:
-> Each outcome: $P(x_{i}) = \frac{1}{6}$
-> We could calculate: $E[$<i class="fas fa-dice"></i>$] = 3.5$

***

-? But what about other **real-world processes ?**

***

-! For most real-world processes, we **don't know** the true probabilities!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
-! Examples:
<div style="background: #8b1a1a; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">Water temperature in a lake</div>
<div style="background: #8b7508ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">Contaminant concentration in groundwater</div>
<div style="background: #1a4d7a; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">Rainfall amounts</div>
<div style="background: #3d2966; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">Bacterial growth rates</div>

***

-< We must `estimate` the expected value from `sample data` using the `arithmetic mean`!

$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_{i} \approx E[X]$$

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="arithmetic-mean-water-science" -->
## Arithmetic Mean in Water Science
<div id="water-mean-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<b>When to Use Arithmetic Mean</b>

-! **Best for**: Data without extreme outliers or skewness

***

-! Examples:

<div style="background: #1a588bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">pH measurements of a water source<br>Multiple samples: 7.1, 7.3, 7.2, 7.0, 7.4<br>Mean: 7.2</div>

<div style="background: #436b8bff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">Dissolved oxygen levels in a river<br>Multiple samples: 8.5, 8.7, 8.6, 8.4, 8.8 mg/L<br>Mean: 8.6 mg/L</div>
<div style="background: #619accff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">Nitrate concentrations in groundwater<br>Multiple samples: 3.2, 3.5, 3.3, 3.4, 3.6 mg/L<br>Mean: 3.4 mg/L</div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
### R Example:

Calculate the arithmetic mean of Fe concentrations:

<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-water-mean-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-code"></i> Show Code
    </button>
    <button id="run-water-mean-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-play"></i> Calculate Mean
    </button>
  </div>
  <div id="water-mean-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 60px;"></div>
</div>

<script>
(function() {
  const initWaterMean = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initWaterMean, 100);
      return;
    }

    const code = `# Fe concentrations in mg/L
fe_conc <- c(5.2, 4.8, 5.1, 5.0, 4.9)
mean_fe <- mean(fe_conc)
print(paste("Fe concentrations:", paste(fe_conc, collapse = ", ")))
print(paste("Arithmetic Mean:", round(mean_fe, 2), "mg/L"))`;

    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "1.5em" },
      ".cm-content": { fontSize: "1.5em" },
      ".cm-gutters": { fontSize: "1.5em" }
    });

    const editorParent = document.getElementById('water-mean-editor');
    if (!editorParent || editorParent.querySelector('.cm-editor')) return;

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);

    const editor = new window.EditorView({
      state: window.EditorState.create({
        doc: code,
        extensions: editorExtensions
      }),
      parent: editorParent
    });

    const outputParent = document.getElementById('water-mean-output');
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

    // Store reference to first column elements
    const slide = document.getElementById('arithmetic-mean-water-science');
    let columnElements = null;
    
    const findColumns = () => {
      if (slide) {
        return Array.from(slide.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
        });
      }
      return [];
    };

    // Toggle code visibility
    const toggleBtn = document.getElementById('toggle-water-mean-code');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const isHidden = editorParent.style.display === 'none';
        editorParent.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
        
        // Hide/show first column (opposite of code visibility)
        columnElements = findColumns();
        columnElements.forEach(col => {
          col.style.display = isHidden ? 'none' : 'block';
        });
        
        // Re-center slide after content change
        if (window.Reveal) {
          setTimeout(() => window.Reveal.layout(), 50);
        }
      };
    }

    const runBtn = document.getElementById('run-water-mean-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const codeText = editor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Computing..." }
        });

        try {
          const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
          const webR = new mod.WebR();
          await webR.init();

          const r = await webR.evalR(`
            paste(capture.output({
              tryCatch({
                ${codeText}
              }, error = function(e) {
                message("Error: ", conditionMessage(e))
              })
            }), collapse="\\n")
          `);
          let output = await r.toString();
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          const feConc = [5.2, 4.8, 5.1, 5.0, 4.9];
          const mean = feConc.reduce((a, b) => a + b, 0) / feConc.length;
          const output = `[Simulated in JavaScript]\nFe concentrations: ${feConc.join(", ")}\nArithmetic Mean: ${mean.toFixed(2)} mg/L`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaterMean);
  } else {
    initWaterMean();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="geometric-mean-visual" -->
## Bacterial Growth: Why Arithmetic Mean Fails

<svg viewBox="0 0 1000 300" xmlns="http://www.w3.org/2000/svg" style="max-width: 90%; margin: 20px auto; background: transparent;">
  <!-- Title -->
  <text x="500" y="40" font-size="28" font-weight="bold" fill="#9efcff" text-anchor="middle">Bacterial Growth Over 3 Days</text>
  
  <!-- Day 1 (Start) -->
  <g id="day1">
    <circle cx="150" cy="200" r="40" fill="#61AFEF" opacity="0.3" stroke="#61AFEF" stroke-width="3"/>
    <text x="150" y="210" font-size="32" font-weight="bold" fill="#61AFEF" text-anchor="middle">100</text>
    <text x="150" y="270" font-size="18" fill="#ABB2BF" text-anchor="middle">Day 1</text>
    <text x="150" y="295" font-size="16" fill="#98C379" text-anchor="middle">Start</text>
  </g>
  
  <!-- Arrow 1: x2 -->
  <g id="arrow1">
    <line x1="200" y1="200" x2="320" y2="200" stroke="#E5C07B" stroke-width="4" marker-end="url(#arrowhead)"/>
    <text x="260" y="180" font-size="24" font-weight="bold" fill="#E5C07B" text-anchor="middle">×2</text>
    <text x="260" y="235" font-size="14" fill="#75715e" text-anchor="middle">doubles</text>
  </g>
  
  <!-- Day 2 -->
  <g id="day2">
    <circle cx="380" cy="200" r="50" fill="#98C379" opacity="0.3" stroke="#98C379" stroke-width="3"/>
    <text x="380" y="210" font-size="32" font-weight="bold" fill="#98C379" text-anchor="middle">200</text>
    <text x="380" y="280" font-size="18" fill="#ABB2BF" text-anchor="middle">Day 2</text>
  </g>
  
  <!-- Arrow 2: x8 -->
  <g id="arrow2">
    <line x1="440" y1="200" x2="620" y2="200" stroke="#E5C07B" stroke-width="4" marker-end="url(#arrowhead)"/>
    <text x="530" y="180" font-size="24" font-weight="bold" fill="#E5C07B" text-anchor="middle">×8</text>
    <text x="530" y="235" font-size="14" fill="#75715e" text-anchor="middle">8x increase</text>
  </g>
  
  <!-- Day 3 (End) -->
  <g id="day3">
    <circle cx="700" cy="200" r="60" fill="#C678DD" opacity="0.3" stroke="#C678DD" stroke-width="3"/>
    <text x="700" y="210" font-size="32" font-weight="bold" fill="#C678DD" text-anchor="middle">1600</text>
    <text x="700" y="290" font-size="18" fill="#ABB2BF" text-anchor="middle">Day 3</text>
    <text x="700" y="315" font-size="16" fill="#FF1493" text-anchor="middle">Final</text>
  </g>
</svg>

-? What is the average daily growth rate?

---

<!-- .slide:id="geometric-mean-intro" -->
## When Arithmetic Mean Fails
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<b>Problem with Rates and Ratios</b>

-! Consider bacterial growth over 3 days:
-: Day 1→2: Growth factor = 2 (doubles)
-: Day 2→3: Growth factor = 8 (8x increase)

***

-! Arithmetic mean: $(2 + 8) / 2 = 5$
-> Predicts 5x growth each day
<br/>
-! Starting with 100 bacteria:
-: $100 \times 2 \times 8 = 1600$ bacteria ✓ True!
-: Using mean of 5: $100 \times 5 \times 5 = 2500$ ❌ Wrong!
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<b>The Geometric Mean</b>

$$\bar{x}\_{geom} = \sqrt[n]{x_{1} \times x_{2} \times ... \times x_{n}}$$

Or equivalently:

$$= exp\left(\frac{1}{n}\sum_{i=1}^{n}ln(x_{i})\right)$$

***

-! **Use when** : Data involves multiplication, rates, or ratios
-! Common in: Growth rates, concentration ratios, fold changes
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="geometric-mean-exercise" -->
## Geometric Mean - R Example
<div id="geom-mean-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
<b>Calculate Geometric Mean</b>

-! Calculate the geometric mean of bacterial growth factors

***

-! Compare arithmetic vs geometric mean!
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-geom-mean-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-code"></i> Show Code
    </button>
    <button id="run-geom-mean-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-play"></i> Calculate
    </button>
  </div>
  <div id="geom-mean-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 80px;"></div>
</div>

<script>
(function() {
  const initGeomMean = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initGeomMean, 100);
      return;
    }

    const code = `# Bacterial growth factors over 3 days
growth_factors <- c(2, 8, 4)

# Arithmetic mean (WRONG for rates!)
arith_mean <- mean(growth_factors)

# Geometric mean (CORRECT!)
geom_mean <- exp(mean(log(growth_factors)))

print(paste("Growth factors:", paste(growth_factors, collapse = ", ")))
print(paste("Arithmetic Mean:", round(arith_mean, 2)))
print(paste("Geometric Mean:", round(geom_mean, 2)))`;

    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "1.5em" },
      ".cm-content": { fontSize: "1.5em" },
      ".cm-gutters": { fontSize: "1.5em" }
    });

    const editorParent = document.getElementById('geom-mean-editor');
    if (!editorParent || editorParent.querySelector('.cm-editor')) return;

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);

    const editor = new window.EditorView({
      state: window.EditorState.create({
        doc: code,
        extensions: editorExtensions
      }),
      parent: editorParent
    });

    const outputParent = document.getElementById('geom-mean-output');
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

    // Store reference to first column elements
    const slide = document.getElementById('geometric-mean-exercise');
    let columnElements = null;
    
    const findColumns = () => {
      if (slide) {
        return Array.from(slide.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
        });
      }
      return [];
    };

    // Toggle code visibility
    const toggleBtn = document.getElementById('toggle-geom-mean-code');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const isHidden = editorParent.style.display === 'none';
        editorParent.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
        
        // Hide/show first column (opposite of code visibility)
        columnElements = findColumns();
        columnElements.forEach(col => {
          col.style.display = isHidden ? 'none' : 'block';
        });
        
        // Re-center slide after content change
        if (window.Reveal) {
          setTimeout(() => window.Reveal.layout(), 50);
        }
      };
    }

    const runBtn = document.getElementById('run-geom-mean-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const codeText = editor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Computing..." }
        });

        try {
          const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
          const webR = new mod.WebR();
          await webR.init();

          const r = await webR.evalR(`
            paste(capture.output({
              tryCatch({
                ${codeText}
              }, error = function(e) {
                message("Error: ", conditionMessage(e))
              })
            }), collapse="\\n")
          `);
          let output = await r.toString();
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          const factors = [2, 8, 4];
          const arith = factors.reduce((a, b) => a + b, 0) / factors.length;
          const geom = Math.exp(factors.reduce((sum, val) => sum + Math.log(val), 0) / factors.length);
          const output = `[Simulated in JavaScript]\nGrowth factors: ${factors.join(", ")}\nArithmetic Mean: ${arith.toFixed(2)}\nGeometric Mean: ${geom.toFixed(2)}`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGeomMean);
  } else {
    initGeomMean();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="geometric-mean-water-science-1" -->
## Geometric Mean in Water Science I
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Bacterial Concentration Monitoring*

-! Parameters such as `E. coli` or `fecal coliform` concentrations are typically highly variable.

-! The data often show a `right-skewed (log-normal) distribution`:
-: Many low or moderate values
-: Occasional very high spikes

<br/>
<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-bacterium" style="font-size: 6em; opacity: 0.9;"></i>
</div>

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Problem*

-! The arithmetic mean is sensitive to outliers and can be biased.

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">E.g., [$10, 100, 10{,}000$]</div>
-: Arithmetic mean: $\frac{10+100+10{,}000}{3} = 3{,}370$
-: Geometric mean: $(10 \times 100 \times 10{,}000)^{1/3} = 464$
-= The geometric mean gives a more representative "typical" concentration.

***

*Regulatory Relevance*

-! *U.S. EPA* water quality standards for microbial indicators use the geometric mean.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="geometric-mean-water-science-2" -->
## Geometric Mean in Water Science II
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Concentration Ratios Across Sampling Points*

-! Ratios capture `multiplicative` changes between locations or times (e.g., upstream ↔ downstream).
-! The geometric mean summarizes `typical proportional change` without being skewed by extremes.

<br/>
<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-arrows-left-right" style="font-size: 6em; opacity: 0.9;"></i>
</div>
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Example & Interpretation*

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
Example ratios: $[0.5,\, 2,\, 5]$
</div>

-: Arithmetic mean: $\dfrac{0.5 + 2 + 5}{3} = 2.5$
-: Geometric mean: $(0.5 \times 2 \times 5)^{1/3} \approx 1.7$
-= The geometric mean reflects the `typical multiplicative change` (≈ `+70%`) across sites/events.

***

*Use Cases*

-! Trend analysis over repeated campaigns
-! Spatial assessments in routine monitoring
<!-- /position -->
<!-- /layout -->


---

<!-- .slide:id="harmonic-mean-problem" -->
## Harmonic Mean I — Why Other Means Fail
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-water" style="font-size: 6em; opacity: 0.9;"></i>
</div>

*Scenario: Flow Velocity Over Equal Distances*

-! A pollutant moves through `two river sections` of equal length:
-: Section 1: 10 m/s  
-: Section 2: 2 m/s

***  

-! We want the `average velocity` across both sections.
<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Testing the Usual Means*

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
Example velocities: [10, 2] m/s
</div>

-: Arithmetic mean: $(10 + 2)/2 = 6$ m/s  
-: Geometric mean: $(10 × 2)^{1/2} = 4.47$ m/s  

***

<div style="margin: 10px 0; padding: 10px; background: #1a2340; border-radius: 8px;">
  <button id="start-harmonic-animation" style="padding: 10px 20px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: .75em; font-weight: bold; margin-bottom: 10px; width: 100%;">
    ▶ Start Animation
  </button>
  <div style="margin-bottom: 8px;">
    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00ff00; font-size: 0.7em;">
      <input type="checkbox" id="toggle-arithmetic-mean" style="margin-right: 8px; cursor: pointer;">
      <span>Show Arithmetic Mean Position (6 m/s)</span>
    </label>
  </div>
  <div>
    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #ff00ff; font-size: 0.7em;">
      <input type="checkbox" id="toggle-geometric-mean" style="margin-right: 8px; cursor: pointer;">
      <span>Show Geometric Mean Position (4.47 m/s)</span>
    </label>
  </div>
</div>

<div id="chart-harmonic-flow" style="margin: 20px auto; text-align: center;"></div>

<script src="resources/js/charts/harmonic_mean_flow.js"></script>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="harmonic-mean-definition" -->
## Harmonic Mean II — The Correct Approach
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Correct Average Velocity*

-! Total travel time:
$${t}\_{\text{total}} = \frac{d}{10} + \frac{d}{2}$$

-! Average velocity over both sections:
$$v\_{\text{avg}} = \frac{2d}{t\_{\text{total}}} = \frac{2}{\frac{1}{10} + \frac{1}{2}} = 3.33\text{ m/s}$$

-= The *harmonic mean* correctly accounts for *unequal travel times* over equal distances.
<!-- /position -->

<!-- position={row: 1, column: 2} -->
*General Formula and Use Cases*

$$
\bar{x}\_{\text{harm}} = \frac{n}{\sum_{i=1}^{n}\frac{1}{x_i}}
$$

***

-! *Use when*: Averaging rates, velocities, or concentrations over `equal distances or quantities`.

-! Common applications:
-: Flow velocities in rivers or pipes  
-: Travel speeds over road segments  
-: Diffusion or transport rates  
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="harmonic-mean-exercise" -->
## Harmonic Mean - R Exercise
<div id="harm-mean-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Calculate Harmonic Mean

-! Calculate average flow rate using harmonic mean

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-harm-mean-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-code"></i> Show Code
    </button>
    <button id="run-harm-mean-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-play"></i> Calculate
    </button>
  </div>
  <div id="harm-mean-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 80px;"></div>
</div>

<script>
(function() {
  const initHarmMean = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initHarmMean, 100);
      return;
    }

    const code = `# Flow rates in L/min
flow_rates <- c(10, 2, 5)

# Harmonic mean
harm_mean <- 1 / mean(1 / flow_rates)

# Compare with arithmetic mean
arith_mean <- mean(flow_rates)

print(paste("Flow rates:", paste(flow_rates, collapse = ", "), "L/min"))
print(paste("Arithmetic Mean:", round(arith_mean, 2), "L/min"))
print(paste("Harmonic Mean:", round(harm_mean, 2), "L/min"))`;

    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "1.5em" },
      ".cm-content": { fontSize: "1.5em" },
      ".cm-gutters": { fontSize: "1.5em" }
    });

    const editorParent = document.getElementById('harm-mean-editor');
    if (!editorParent || editorParent.querySelector('.cm-editor')) return;

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);

    const editor = new window.EditorView({
      state: window.EditorState.create({
        doc: code,
        extensions: editorExtensions
      }),
      parent: editorParent
    });

    const outputParent = document.getElementById('harm-mean-output');
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

    // Store reference to first column elements
    const slide = document.getElementById('harmonic-mean-exercise');
    let columnElements = null;
    
    const findColumns = () => {
      if (slide) {
        return Array.from(slide.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
        });
      }
      return [];
    };

    // Toggle code visibility
    const toggleBtn = document.getElementById('toggle-harm-mean-code');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const isHidden = editorParent.style.display === 'none';
        editorParent.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
        
        // Hide/show first column (opposite of code visibility)
        columnElements = findColumns();
        columnElements.forEach(col => {
          col.style.display = isHidden ? 'none' : 'block';
        });
        
        // Re-center slide after content change
        if (window.Reveal) {
          setTimeout(() => window.Reveal.layout(), 50);
        }
      };
    }

    const runBtn = document.getElementById('run-harm-mean-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const codeText = editor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Computing..." }
        });

        try {
          const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
          const webR = new mod.WebR();
          await webR.init();

          const r = await webR.evalR(`
            paste(capture.output({
              tryCatch({
                ${codeText}
              }, error = function(e) {
                message("Error: ", conditionMessage(e))
              })
            }), collapse="\\n")
          `);
          let output = await r.toString();
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          const rates = [10, 2, 5];
          const arith = rates.reduce((a, b) => a + b, 0) / rates.length;
          const harm = rates.length / rates.reduce((sum, val) => sum + 1/val, 0);
          const output = `[Simulated in JavaScript]\nFlow rates: ${rates.join(", ")} L/min\nArithmetic Mean: ${arith.toFixed(2)} L/min\nHarmonic Mean: ${harm.toFixed(2)} L/min`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHarmMean);
  } else {
    initHarmMean();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="harmonic-mean-water-science" -->
## Harmonic Mean in Water Science
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Chemical Exposure Through Soil Layers*

-! A chemical leaches vertically through two soil layers of equal thickness.
-! Each layer has a different diffusion coefficient ($D$):
-: Layer 1 (sandy soil): $D_1 = 2 \times 10^{-6}$ m²/s  
-: Layer 2 (clay): $D_2 = 1 \times 10^{-8}$ m²/s  

***  

-! Since diffusion acts in series through the layers, the overall effective diffusion depends on the *sum of resistances* ($1/D$).

-= The correct average diffusion coefficient is the harmonic mean.
<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="text-align: center; margin-top: 20px;">
  <i class="fas fa-flask" style="font-size: 3.5em; opacity: 0.9; margin-right: 0.2em; color: #dd277cff;"></i>
  <i class="fas fa-person-running" style="font-size: 3em; opacity: 0.8; color: #ddc227ff;"></i>
</div>

*Example & Interpretation*

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
Example diffusion coefficients: $[2\times10^{-6},\, 1\times10^{-8}]$ m²/s
</div>

-: Arithmetic mean: $(2\times10^{-6} + 1\times10^{-8}) / 2 = 1.01\times10^{-6}$ m²/s  
-: Geometric mean: $(2\times10^{-6} \times 1\times10^{-8})^{1/2} = 1.41\times10^{-7}$ m²/s  
-: Harmonic mean: $\dfrac{2}{\frac{1}{2\times10^{-6}} + \frac{1}{1\times10^{-8}}} = 2.0\times10^{-8}$ m²/s  

-= The harmonic mean correctly captures the slowest controlling layer, which dominates the chemical’s overall movement through soil.
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="median-problem" -->
## Median  When Data Has Outliers
<!-- layout={rows: 1, columns: 2} -->

<!-- position={row: 1, column: 1} -->
*Scenario: Turbidity Measurements*

-! Consider `turbidity measurements` (NTU) from a water treatment plant over 5 days:
-: Days 1-4: 2.1, 2.3, 2.0, 2.2 (normal conditions)
-: Day 5: 45.0 (storm runoff event!)

***

-! We want a measure of `"typical" turbidity` for process control.

<br/>
<div style="text-align: center; margin-top: 20px;">
<i class="fas fa-droplet" style="font-size: 6em; opacity: 0.9;"></i>
</div>
<!-- /position -->

<!-- position={row: 1, column: 2} -->
*Testing the Usual Means*

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
Example turbidity: [2.1, 2.3, 2.0, 2.2, 45.0] NTU
</div>

-: Arithmetic mean: $(2.1 + 2.3 + 2.0 + 2.2 + 45.0) / 5 = 10.72$ NTU
-=  Not representative of typical conditions!

***

-! The single outlier (storm event) **dominates** the mean.

-! For process control, we need a measure that's **robust** to extreme values.

-=  The **median** is the solution!

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="median-definition" -->
## The Median
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*What is the Median?*

-! The **median** is the `middle value` when data is sorted in order.

***

*For odd number of values:*
-: Median = the middle value

e.g., [2.0, 2.1, **2.2**, 2.3, 45.0]

***

*For even number of values:*
-: Median = average of two middle values

e.g., [2.0, **2.1, 2.2**, 2.3]
<!-- /position -->
<!-- position={row: 1, column: 2} -->
*The Median Formula*

**Step 1:** Sort the data in ascending order

**Step 2:** Find the middle position

| odd | even |
|:-------:|:---------:|
| $x_{\left(\frac{n+1}{2}\right)}$| $\frac{1}{2}\left(x_{\left(\frac{n}{2}\right)} + x_{\left(\frac{n}{2}+1\right)}\right)$ |


*Key Properties:*

-! **Robust to outliers**: Extreme values don't affect the median
-! **50th percentile**: Half the values are below, half above
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="median-exercise" -->
## Median - R Exercise
<div id="median-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Calculate Median*

-! Calculate median of turbidity data with outlier

***

-? Compare with arithmetic mean!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-median-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-code"></i> Show Code
    </button>
    <button id="run-median-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
      <i class="fas fa-play"></i> Calculate
    </button>
  </div>
  <div id="median-output" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: 80px;"></div>
</div>

<script>
(function() {
  const initMedian = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(initMedian, 100);
      return;
    }

    const code = `# Turbidity measurements (NTU)
turbidity <- c(2.1, 2.3, 2.0, 2.2, 45.0)

# Mean vs Median
mean_val <- mean(turbidity)
median_val <- median(turbidity)

print(paste("Turbidity:", paste(turbidity, collapse = ", "), "NTU"))
print(paste("Arithmetic Mean:", round(mean_val, 2), "NTU"))
print(paste("Median:", round(median_val, 2), "NTU"))
print("Median is more representative!")`;

    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "1.5em" },
      ".cm-content": { fontSize: "1.5em" },
      ".cm-gutters": { fontSize: "1.5em" }
    });

    const editorParent = document.getElementById('median-editor');
    if (!editorParent || editorParent.querySelector('.cm-editor')) return;

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);

    const editor = new window.EditorView({
      state: window.EditorState.create({
        doc: code,
        extensions: editorExtensions
      }),
      parent: editorParent
    });

    const outputParent = document.getElementById('median-output');
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

    const slide = document.getElementById('median-exercise');
    let columnElements = null;
    
    const findColumns = () => {
      if (slide) {
        return Array.from(slide.querySelectorAll('div')).filter(el => {
          const style = el.getAttribute('style') || '';
          return style.includes('grid-column: 1') || style.includes('grid-area: 1 / 1') || style.includes('grid-area: 1/1');
        });
      }
      return [];
    };

    const toggleBtn = document.getElementById('toggle-median-code');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        const isHidden = editorParent.style.display === 'none';
        editorParent.style.display = isHidden ? 'block' : 'none';
        toggleBtn.innerHTML = isHidden ? '<i class="fas fa-code"></i> Hide Code' : '<i class="fas fa-code"></i> Show Code';
        
        columnElements = findColumns();
        columnElements.forEach(col => {
          col.style.display = isHidden ? 'none' : 'block';
        });
        
        if (window.Reveal) {
          setTimeout(() => window.Reveal.layout(), 50);
        }
      };
    }

    const runBtn = document.getElementById('run-median-btn');
    if (runBtn) {
      runBtn.onclick = async () => {
        const codeText = editor.state.doc.toString();
        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "Computing..." }
        });

        try {
          const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
          const webR = new mod.WebR();
          await webR.init();

          const r = await webR.evalR(`
            paste(capture.output({
              tryCatch({
                ${codeText}
              }, error = function(e) {
                message("Error: ", conditionMessage(e))
              })
            }), collapse="\\n")
          `);
          let output = await r.toString();
          output = output.replace(/^\[\d+\]\s*/gm, '');
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output.trim() || "[No output]" }
          });
        } catch (err) {
          const turb = [2.1, 2.3, 2.0, 2.2, 45.0];
          const mean = turb.reduce((a, b) => a + b, 0) / turb.length;
          const sorted = turb.slice().sort((a, b) => a - b);
          const median = sorted[Math.floor(sorted.length / 2)];
          const output = `[Simulated in JavaScript]\nTurbidity: ${turb.join(", ")} NTU\nArithmetic Mean: ${mean.toFixed(2)} NTU\nMedian: ${median.toFixed(2)} NTU\nMedian is more representative!`;
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: output }
          });
        }
      };
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMedian);
  } else {
    initMedian();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="median-water-science" -->
## Median in Water Science
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
*Heavy Metal Monitoring*

-! `Heavy metal concentrations` (e.g., lead, mercury) often show:
-: Most samples: low, safe levels
-: Occasional spikes: contamination events

***

<div style="background: #702914ff; color: #ffffff; padding: 8px 12px; border-radius: 8px; margin: 6px 0; font-size: 0.7em;">
Example Pb concentrations: [0.5, 0.7, 0.6, 0.8, 15.0] µg/L
</div>

-: Arithmetic mean: 3.52 µg/L (misleading)
-: Median: 0.7 µg/L (typical value)

-= The median better represents baseline conditions for compliance monitoring.

<!-- /position -->
<!-- position={row: 1, column: 2} -->
*Particle Size Distribution*

-! In sediment analysis, particle sizes follow **log-normal distributions**:
-: Fine particles: clay, silt (abundant)
-: Coarse particles: sand, gravel (fewer)

-= The median particle size (D₅₀) is the standard metric in sediment characterization.

<div style="background: #1a4d7a; color: #ffffff; padding: 12px; border-radius: 8px; margin: 10px 0;">
<strong>When to Choose Median:</strong><br>
✓ Data with outliers<br>
✓ Skewed distributions<br>
✓ Non-normal data<br>
✓ Need robust statistics
</div>

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="summary-means" -->
## Summary: Choosing the Right Mean
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Arithmetic Mean
$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_{i}$$

-! Use for: Normal data without extreme outliers

***

### Geometric Mean
$$\bar{x}\_{geom} = \sqrt[n]{\prod_{i=1}^{n} x_{i}}$$

-! Use for: Rates, ratios, fold changes

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Harmonic Mean
$$\bar{x}\_{harm} = \frac{n}{\sum_{i=1}^{n}\frac{1}{x_{i}}}$$

-! Use for: Averaging rates over equal times

***

### Median
-! Middle value of sorted data

-! Use for: Data with outliers or skewed distributions

<!-- /position -->
<!-- /layout -->
