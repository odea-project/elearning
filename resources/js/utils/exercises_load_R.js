(() => {
  /**
   * Shared render helper – when the Python loader is present we reuse its
   * utilities to avoid duplicate DOM manipulation logic.
   */
  const renderContent = typeof renderExerciseContent === 'function'
    ? renderExerciseContent
    : (html) => {
        const host = document.getElementById('exercise-tasks');
        if (host) host.innerHTML = html;
      };

  /**
   * Shared banner helper fall back.
   */
  const showBanner = typeof showExerciseBanner === 'function'
    ? showExerciseBanner
    : (message) => {
        let banner = document.getElementById('exercise-banner');
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'exercise-banner';
          banner.style.cssText = 'position:absolute; top:1em; right:2em; z-index:10000; font-size:1.2em; background:#232347; color:#19f1ff; padding: .5em 1em; border-radius:.7em; box-shadow:0 0 1em #19f1ff80;';
          document.body.appendChild(banner);
        }
        banner.textContent = message;
        banner.style.display = '';
        setTimeout(() => {
          banner.style.display = 'none';
        }, 2000);
      };

  /**
   * Lazily initialises the WebR runtime and returns a singleton instance.
   * @returns {Promise<any>} Initialised WebR instance.
   */
  let webR = null;
  async function ensureWebR() {
    if (webR) return webR;
    const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
    webR = new mod.WebR();
    await webR.init();
    return webR;
  }

  /**
   * Loads the legacy R language mode for CodeMirror 6.
   * @returns {Promise<Array>} Extension array compatible with EditorView.
   */
  async function loadRLanguageSupport() {
    if (window.rLanguageSupport) return window.rLanguageSupport;
    try {
      const [{ StreamLanguage, syntaxHighlighting, defaultHighlightStyle }, legacy] = await Promise.all([
        import('https://cdn.jsdelivr.net/npm/@codemirror/language@latest/dist/index.js'),
        import('https://cdn.jsdelivr.net/npm/@codemirror/legacy-modes@latest/mode/r.js'),
      ]);
      const rExt = StreamLanguage.define(legacy.r);
      window.rLanguageSupport = [rExt, syntaxHighlighting(defaultHighlightStyle)];
    } catch (e) {
      console.warn('Could not load legacy R mode:', e);
      window.rLanguageSupport = [];
    }
    return window.rLanguageSupport;
  }

  // Hilfsfunktionen für Output & Plot
  async function runRAndCapture(code) {
    const webr = await ensureWebR();

    // 1) PNG-Device öffnen (falls geplotet wird)
    const pngPath = "/tmp/webr_plot.png";
    try { webr.FS.unlink(pngPath); } catch(e) {}
    await webr.evalR(`try(grDevices::png("${pngPath}", width=720, height=450, res=96), silent=TRUE)`);

    // 2) R-Code ausführen und stdout als String zurückgeben
    const r = await webr.evalR(`
      paste(capture.output({
        tryCatch({
          ${code}
        }, error = function(e) {
          message("Error: ", conditionMessage(e))
        })
      }), collapse="\\n")
    `);
    const out = (await r.toString()).trim();

    // 3) Device schließen
    await webr.evalR(`try(grDevices::dev.off(), silent=TRUE)`);

    // 4) Plot aus VFS lesen (wenn erzeugt)
    let imgBlob = null;
    try {
      const file = await webr.FS.readFile(pngPath);
      if (file && file.length > 0) {
        imgBlob = new Blob([file], { type: "image/png" });
      }
    } catch(e) { /* kein Plot erzeugt */ }

    return { out, imgBlob };
  }

  // === Öffentliche API: wie deine Python-Funktion, nur für R ===
  window.loadRExercise = async function loadRExercise(file, exerciseId) {
    try {
      const res = await fetch(file);
      const yamlText = await res.text();
      const exercises = window.jsyaml.load(yamlText);
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (!exercise) {
        renderContent('<p style="color:red;">Exercise not found.</p>');
        return;
      }

      // Overlay/HTML
      renderContent(`
        <div class="reveal">
          <h2>${exercise.title || ''}</h2>
          <div style="margin-bottom:.5em;">${exercise.task || ''}</div>
          <div class="custom-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(1, 1fr); gap: 2em;">
            <div style="grid-row: 1; grid-column: 1; padding:0;">
              <div id="editor-container-r" style="margin-bottom:0;"></div>
            </div>
            <div style="grid-row: 1; grid-column: 2; padding:0;">
              <button class="run-r-btn" id="run-r-btn" style="margin-right:.5em; font-size:0.4em">Run Code (R)</button>
              <button class="show-solution-r-btn" id="show-solution-r-btn" style="font-size:0.4em">Show Solution</button>
              <div id="output-editor-r" style="height: 120px;"></div>
              <div id="plot-area-r" style="margin-top:.6em;"></div>
            </div>
          </div>
        </div>
      `);

      // CodeMirror 6 – Editor & Output (readonly)
      const editorParent = document.getElementById('editor-container-r');
      const rLang = await loadRLanguageSupport();
      const editorExtensions = [window.basicSetup];
      if (rLang) editorExtensions.push(rLang);
      editorExtensions.push(window.monokai);

      let cmEditorR = new window.EditorView({
        state: window.EditorState.create({
          doc: exercise.starter_code || "",
          extensions: editorExtensions
        }),
        parent: editorParent
      });

      const outputExtensions = [
        window.basicSetup,
        window.monokai,
        window.EditorView.editable.of(false)
      ];
      if (rLang) outputExtensions.splice(1, 0, rLang);

      let outputEditorR = new window.EditorView({
        state: window.EditorState.create({
          doc: '',
          extensions: outputExtensions
        }),
        parent: document.getElementById('output-editor-r')
      });

        const plotArea = document.getElementById('plot-area-r');

        // Normalisierer für Vergleich (CRLF/LF, Trim)
        function normalize(s) {
          return (s || "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .trim();
        }

        // RUN
        document.getElementById('run-r-btn').onclick = async () => {
          const code = cmEditorR.state.doc.toString();
          outputEditorR.dispatch({ changes: { from: 0, to: outputEditorR.state.doc.length, insert: "Running R…" } });
          plotArea.innerHTML = "";
          try {
            const { out, imgBlob } = await runRAndCapture(code);
            // Output setzen
            const text = out || "[No output]";
            outputEditorR.dispatch({ changes: { from: 0, to: outputEditorR.state.doc.length, insert: text } });

            // Plot (falls vorhanden)
            if (imgBlob) {
              const url = URL.createObjectURL(imgBlob);
              const img = new Image();
              img.onload = () => URL.revokeObjectURL(url);
              img.src = url;
              img.style.maxWidth = "100%";
              img.style.borderRadius = "14px";
              img.style.boxShadow = "0 0 0 1px #2d3a66 inset, 0 0 24px #00e1ff22";
              plotArea.appendChild(img);
            }

            // Vergleich expected_output (optional)
            if (typeof exercise.expected_output !== "undefined") {
              const userOut = normalize(out);
              const expected = normalize(exercise.expected_output);
              if (userOut === expected) showBanner('Success! Your output is correct.');
              else showBanner('Sorry, your output does not match the solution.');
            }
          } catch (err) {
            outputEditorR.dispatch({ changes: { from: 0, to: outputEditorR.state.doc.length, insert: "[Error]\n" + err.toString() } });
          }
        };

        // SHOW SOLUTION
        document.getElementById('show-solution-r-btn').onclick = () => {
          cmEditorR.dispatch({
            changes: { from: 0, to: cmEditorR.state.doc.length, insert: exercise.solution || '' }
          });
          outputEditorR.dispatch({
            changes: { from: 0, to: outputEditorR.state.doc.length, insert: "" }
          });
          plotArea.innerHTML = "";
        };
    } catch (error) {
      console.error('Error loading R exercise:', error);
      renderContent(`<p style="color:red;">Error loading exercise: ${error.message}</p>`);
    }
  };
})();
