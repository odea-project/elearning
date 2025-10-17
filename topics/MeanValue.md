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
  <div id="five-dice-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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

    const diceCode = `dice <- sample(1:6, 5, replace = TRUE)
sum_result <- sum(dice)

print(dice)
print(paste("Sum:", sum_result))`;

    let rLang = [];
    if (window.rLanguageSupport) {
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
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! The **arithmetic mean** (or average) is the sum of all values divided by the count.

***

Formula: 

$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$

***

-! For our five dice, the **expected value** (theoretical mean) is:

$$E[X] = 5 \times 3.5 = 17.5$$

***

-? Let's verify this by rolling multiple times!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
Calculate mean of 5 rolls:
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div id="mean-5-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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
print(paste("Arithmetic Mean:", round(mean_value, 2)))
print(paste("Expected Value: 17.5"))`;

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
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="law-of-large-numbers" -->
## Law of Large Numbers
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! As we increase the number of experiments, the arithmetic mean converges to the **expected value**.

***

-! This is known as the **Law of Large Numbers**.

***

-? Try with 50 and 50,000,000 experiments!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 15px;">
  <div>
    <strong>50 experiments:</strong>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <div id="mean-50-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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
  
  <div>
    <strong>50,000,000 experiments:</strong>
    <div style="display: flex; flex-direction: column; gap: 5px;">
      <div id="mean-50m-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
      <div style="display: flex; gap: 10px;">
        <button id="toggle-mean-50m-code" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
          <i class="fas fa-code"></i> Show Code
        </button>
        <button id="run-mean-50m-btn" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
          <i class="fas fa-play"></i> Run (50M times)
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
      createMeanExperiment('50m', 50000000)();
    });
  } else {
    createMeanExperiment('50', 50)();
    createMeanExperiment('50m', 50000000)();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="arithmetic-mean-water-science" -->
## Arithmetic Mean in Water Science
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### When to Use Arithmetic Mean

-! **Best for**: Data without extreme outliers or skewness

***

**Examples:**

-! **pH measurements** of a water source
  - Multiple samples: 7.1, 7.3, 7.2, 7.0, 7.4
  - Mean: 7.2

***

-! **Temperature monitoring**
  - Daily measurements for quality control

***

-! **Turbidity readings** under normal conditions

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### R Exercise

Calculate the arithmetic mean of Fe concentrations:

<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div id="water-mean-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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

<!-- .slide:id="geometric-mean-intro" -->
## When Arithmetic Mean Fails
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Problem with Rates and Ratios

-! Consider **bacterial growth** over 3 days:
  - Day 1→2: Growth factor = 2 (doubles)
  - Day 2→3: Growth factor = 8 (8x increase)

***

-! Arithmetic mean: $(2 + 8) / 2 = 5$

***

-! But: $100 \times 2 \times 8 = 1600$ bacteria
  - Using mean of 5: $100 \times 5 \times 5 = 2500$ ❌ Wrong!

***

-! **Geometric mean** is appropriate: $\sqrt{2 \times 8} = 4$
  - Check: $100 \times 4 \times 4 = 1600$ ✓ Correct!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Geometric Mean Formula

$$\bar{x}_{geom} = \sqrt[n]{x_1 \times x_2 \times ... \times x_n}$$

Or equivalently:

$$\bar{x}_{geom} = \exp\left(\frac{1}{n}\sum_{i=1}^{n}\ln(x_i)\right)$$

***

-! **Use when**: Data involves multiplication, rates, or ratios

***

-! Common in: Growth rates, concentration ratios, fold changes

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="geometric-mean-exercise" -->
## Geometric Mean - R Exercise
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Calculate Geometric Mean

-! Calculate the geometric mean of bacterial growth factors

***

-? Compare arithmetic vs geometric mean!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div id="geom-mean-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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

<!-- .slide:id="geometric-mean-water-science" -->
## Geometric Mean in Water Science

-! **Bacterial concentration monitoring** (E. coli, fecal coliforms)
  - Highly variable, skewed data with occasional spikes
  - EPA water quality standards use geometric mean

***

-! **Dilution factors** in serial dilutions

***

-! **Concentration ratios** across sampling points

***

-! **pH changes** (since pH is logarithmic scale)

---

<!-- .slide:id="harmonic-mean-intro" -->
## Harmonic Mean
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### When Rates Have Different Denominators

-! Consider **water flow rates**:
  - Section 1: 10 L/min for 5 minutes
  - Section 2: 2 L/min for 5 minutes

***

-! Total time: 10 min
  - Total volume: $(10 \times 5) + (2 \times 5) = 60$ L
  - Average rate: $60 / 10 = 6$ L/min

***

-! Arithmetic mean: $(10 + 2) / 2 = 6$ L/min ✓ (by luck!)

***

-! **Harmonic mean**: $\frac{2}{\frac{1}{10} + \frac{1}{2}} = 3.33$ L/min
  - This is the correct mean when rates apply over equal times

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Harmonic Mean Formula

$$\bar{x}_{harm} = \frac{n}{\sum_{i=1}^{n}\frac{1}{x_i}}$$

***

-! **Use when**: Averaging rates or velocities with equal time intervals

***

-! Common in: Flow rates, velocities, concentration gradients

***

-? The harmonic mean is always ≤ geometric mean ≤ arithmetic mean

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="harmonic-mean-exercise" -->
## Harmonic Mean - R Exercise
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Calculate Harmonic Mean

-! Calculate average flow rate using harmonic mean

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div id="harm-mean-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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

-! **Average velocity in pipes** with varying flow rates

***

-! **Groundwater flow** through layers with different hydraulic conductivities

***

-! **Dilution rates** in continuous flow systems

***

-! **Residence time** calculations in treatment plants

---

<!-- .slide:id="median-intro" -->
## Median - When Data Has Outliers
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Problem with Extreme Values

-! Consider turbidity measurements (NTU):
  - Day 1-4: 2.1, 2.3, 2.0, 2.2
  - Day 5: 45.0 (storm runoff!)

***

-! Arithmetic mean: $(2.1 + 2.3 + 2.0 + 2.2 + 45.0) / 5 = 10.72$ NTU
  - Not representative of typical conditions!

***

-! **Median**: Middle value when sorted: 2.0, 2.1, 2.2, 2.3, 45.0
  - Median = 2.2 NTU ✓ More representative!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Median Definition

-! The **median** is the middle value in a sorted dataset

***

-! For **odd** n: Median = middle value

-! For **even** n: Median = average of two middle values

***

-! **Use when**: Data has outliers or is highly skewed

***

-! **Robust** to extreme values (unlike mean)

<!-- /position -->
<!-- /layout -->

---

<!-- .slide:id="median-exercise" -->
## Median - R Exercise
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Calculate Median

-! Calculate median of turbidity data with outlier

***

-? Compare with arithmetic mean!

<!-- /position -->
<!-- position={row: 1, column: 2} -->
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div id="median-editor" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; display: none;"></div>
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

    // Store reference to first column elements
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

    // Toggle code visibility
    const toggleBtn = document.getElementById('toggle-median-code');
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

-! **Heavy metal concentrations** with occasional contamination spikes

***

-! **Rainfall data** (often highly skewed)

***

-! **Particle size distributions** in sediment analysis

***

-! **Water quality indices** with extreme outliers from accidents

***

-! **Regulatory compliance** - Some standards use median instead of mean

---

<!-- .slide:id="summary-means" -->
## Summary: Choosing the Right Mean
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
### Arithmetic Mean
$$\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i$$

-! Use for: Normal data without extreme outliers
-! Examples: pH, temperature, Fe concentration

***

### Geometric Mean
$$\bar{x}_{geom} = \sqrt[n]{\prod_{i=1}^{n} x_i}$$

-! Use for: Rates, ratios, fold changes
-! Examples: Bacterial growth, dilution factors

<!-- /position -->
<!-- position={row: 1, column: 2} -->
### Harmonic Mean
$$\bar{x}_{harm} = \frac{n}{\sum_{i=1}^{n}\frac{1}{x_i}}$$

-! Use for: Averaging rates over equal times
-! Examples: Flow rates, velocities

***

### Median
-! Middle value of sorted data

-! Use for: Data with outliers or skewed distributions
-! Examples: Turbidity with storms, contamination events

***

-? **Always consider your data characteristics before choosing!**

<!-- /position -->
<!-- /layout -->

