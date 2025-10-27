/**
 * WebR Helper Utility
 * Shared functions for WebR-based interactive R code editors
 */

class WebRHelper {
  constructor() {
    this.webRInstance = null;
    this.sectionCounter = 0;
  }

  /**
   * Ensure a WebR instance is available and initialized.
   * @returns {Promise<object>} Initialized WebR instance
   */
  async ensureWebR() {
    if (!this.webRInstance) {
      const mod = await import('https://webr.r-wasm.org/latest/webr.mjs');
      this.webRInstance = new mod.WebR();
      await this.webRInstance.init();
    }
    return this.webRInstance;
  }

  /**
   * Generate unique ID for a section
   * @returns {string} Unique section ID
   */
  generateSectionId() {
    return `webr-section-${++this.sectionCounter}`;
  }

  /**
   * Create complete interactive section HTML
   * @param {string} containerId - ID of container to inject HTML into
   * @param {Object} options - Configuration options
   * @param {string} options.runLabel - Label for run button (default: "Run Example")
   * @param {string} options.minHeight - Minimum height for output (default: "60px")
   * @returns {Object} Object with generated IDs
   */
  createInteractiveHTML(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return null;
    }

    const sectionId = this.generateSectionId();
    const editorId = `${sectionId}-editor`;
    const outputId = `${sectionId}-output`;
    const toggleBtnId = `${sectionId}-toggle`;
    const runBtnId = `${sectionId}-run`;

    const runLabel = options.runLabel || 'Run Example';
    const minHeight = options.minHeight || '60px';

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
        <div id="${editorId}" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
        <div style="display: flex; gap: 10px;">
          <button id="${toggleBtnId}" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
            <i class="fas fa-code"></i> Show Code
          </button>
          <button id="${runBtnId}" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
            <i class="fas fa-play"></i> ${runLabel}
          </button>
        </div>
        <div id="${outputId}" style="border: 1px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: ${minHeight};"></div>
      </div>
    `;

    return {
      editorId,
      outputId,
      toggleBtnId,
      runBtnId
    };
  }

  /**
   * Create a CodeMirror editor with R syntax highlighting
   * @param {string} parentId - ID of the parent element
   * @param {string} initialCode - Initial code to display
   * @param {boolean} editable - Whether the editor is editable (default: true)
   * @param {string} fontSize - Font size (default: "1.5em")
   * @returns {EditorView} CodeMirror editor instance
   */
  createEditor(parentId, initialCode, editable = true, fontSize = "1.5em") {
    const editorParent = document.getElementById(parentId);
    if (!editorParent || editorParent.querySelector('.cm-editor')) return null;

    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }

    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: fontSize },
      ".cm-content": { fontSize: fontSize },
      ".cm-gutters": { fontSize: fontSize }
    });

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);
    
    if (!editable) {
      editorExtensions.push(window.EditorView.editable.of(false));
    }

    return new window.EditorView({
      state: window.EditorState.create({
        doc: initialCode,
        extensions: editorExtensions
      }),
      parent: editorParent
    });
  }

  /**
   * Execute R code using WebR
   * @param {string} code - R code to execute
   * @returns {Promise<string>} Output from R execution
   */
  async executeR(code) {
    try {
      const webR = await this.ensureWebR();

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
      return output.trim() || "[No output]";
    } catch (err) {
      throw new Error(`WebR execution failed: ${err.message}`);
    }
  }

  /**
   * Setup a toggle button for showing/hiding code editor
   * @param {string} toggleBtnId - ID of toggle button
   * @param {string} editorParentId - ID of editor container
   * @param {string} slideId - ID of slide (optional, for hiding columns)
   */
  setupToggleButton(toggleBtnId, editorParentId, slideId = null) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const editorParent = document.getElementById(editorParentId);
    
    if (!toggleBtn || !editorParent) return;

    const findColumns = () => {
      if (slideId) {
        const slide = document.getElementById(slideId);
        if (slide) {
          return Array.from(slide.querySelectorAll('div')).filter(el => {
            const style = el.getAttribute('style') || '';
            return style.includes('grid-column: 1') || 
                   style.includes('grid-area: 1 / 1') || 
                   style.includes('grid-area: 1/1');
          });
        }
      }
      return [];
    };

    toggleBtn.onclick = () => {
      const isHidden = editorParent.style.display === 'none';
      editorParent.style.display = isHidden ? 'block' : 'none';
      toggleBtn.innerHTML = isHidden 
        ? '<i class="fas fa-code"></i> Hide Code' 
        : '<i class="fas fa-code"></i> Show Code';
      
      const columnElements = findColumns();
      columnElements.forEach(col => {
        col.style.display = isHidden ? 'none' : 'block';
      });
      
      if (window.Reveal) {
        setTimeout(() => window.Reveal.layout(), 50);
      }
    };
  }

  /**
   * Setup a run button that executes code and displays output
   * @param {string} runBtnId - ID of run button
   * @param {EditorView} codeEditor - Code editor instance
   * @param {EditorView} outputEditor - Output editor instance
   * @param {function} fallbackFn - Fallback function if WebR fails (optional)
   */
  setupRunButton(runBtnId, codeEditor, outputEditor, fallbackFn = null) {
    const runBtn = document.getElementById(runBtnId);
    if (!runBtn) return;

    runBtn.onclick = async () => {
      const code = codeEditor.state.doc.toString();
      outputEditor.dispatch({
        changes: { 
          from: 0, 
          to: outputEditor.state.doc.length, 
          insert: "Computing..." 
        }
      });

      try {
        const output = await this.executeR(code);
        outputEditor.dispatch({
          changes: { 
            from: 0, 
            to: outputEditor.state.doc.length, 
            insert: output 
          }
        });
      } catch (err) {
        if (fallbackFn) {
          const fallbackOutput = fallbackFn(code);
          outputEditor.dispatch({
            changes: { 
              from: 0, 
              to: outputEditor.state.doc.length, 
              insert: fallbackOutput 
            }
          });
        } else {
          outputEditor.dispatch({
            changes: { 
              from: 0, 
              to: outputEditor.state.doc.length, 
              insert: `Error: ${err.message}` 
            }
          });
        }
      }
    };
  }

  /**
   * Initialize a complete interactive R code section
   * @param {Object} config - Configuration object
   * @param {string} config.code - Initial R code
   * @param {string} config.containerId - ID of container element (will create HTML inside)
   * @param {string} config.slideId - ID of slide (optional, for column hiding)
   * @param {function} config.fallback - Fallback function (optional)
   * @param {string} config.runLabel - Label for run button (optional)
   * @param {string} config.minHeight - Min height for output (optional)
   * @returns {Object} Object with editor instances
   */
  async initInteractiveSection(config) {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(this.initInteractiveSection(config)), 100);
      });
    }

    // Create HTML structure
    const ids = this.createInteractiveHTML(config.containerId, {
      runLabel: config.runLabel,
      minHeight: config.minHeight
    });

    if (!ids) return null;

    // Create editors
    const codeEditor = this.createEditor(ids.editorId, config.code, true);
    const outputEditor = this.createEditor(ids.outputId, '', false);

    if (!codeEditor || !outputEditor) return null;

    // Setup buttons
    this.setupToggleButton(ids.toggleBtnId, ids.editorId, config.slideId);
    this.setupRunButton(ids.runBtnId, codeEditor, outputEditor, config.fallback);

    return { codeEditor, outputEditor };
  }

  /**
   * Quick setup - creates everything from a simple config
   * @param {string} containerId - ID of container
   * @param {string} code - R code
   * @param {string} slideId - Slide ID (optional)
   * @param {function} fallback - Fallback function (optional)
   * @returns {Promise<Object>} Editor instances
   */
  async quickSetup(containerId, code, slideId = null, fallback = null) {
    return this.initInteractiveSection({
      containerId,
      code,
      slideId,
      fallback
    });
  }

  /**
   * Render an R plot into a target container by capturing it as a PNG.
   * @param {Object} config - Plot configuration
   * @param {string} config.containerId - Target container ID for the plot
   * @param {string} config.code - R code that produces a plot
   * @param {number} [config.width=640] - Plot width in pixels
   * @param {number} [config.height=480] - Plot height in pixels
   * @param {number} [config.res=96] - Plot resolution (dpi)
   * @param {string} [config.background='transparent'] - Plot background color
   * @param {string} [config.altText='R plot generated via WebR'] - Alt text for the rendered image
   * @param {string} [config.loadingMessage='Generating plot...'] - Loading message while plot is rendered
   * @param {string} [config.errorMessage='Failed to generate plot.'] - Error message shown on failure
   * @returns {Promise<string|null>} Object URL of the generated plot image or null on failure
   */
  async renderPlot(config = {}) {
    const {
      containerId,
      code,
      width = 640,
      height = 480,
      res = 96,
      background = 'transparent',
      altText = 'R plot generated via WebR',
      loadingMessage = 'Generating plot...',
      errorMessage = 'Failed to generate plot.'
    } = config;

    if (!containerId || !code) {
      console.error('[WebRHelper] renderPlot requires containerId and code.');
      return null;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`[WebRHelper] Container "${containerId}" not found.`);
      return null;
    }

    // Clean up previous plot URL if present
    const previousUrl = container.dataset.webrPlotUrl;
    if (previousUrl) {
      URL.revokeObjectURL(previousUrl);
      delete container.dataset.webrPlotUrl;
    }

    container.innerHTML = `<div class="webr-loading" style="padding: 1.2em; color: #9efcff; font-weight: 600;">${loadingMessage}</div>`;

    try {
      const webR = await this.ensureWebR();

      const plotScript = `
        webr_capture_plot <- function() {
          plot_file <- tempfile(fileext = ".png")
          on.exit(unlink(plot_file), add = TRUE)

          png(
            filename = plot_file,
            width = ${width},
            height = ${height},
            res = ${res},
            bg = "${background}"
          )

          on.exit({
            try(dev.off(), silent = TRUE)
          }, add = TRUE)

          ${code}

          if (!identical(dev.cur(), 1L)) {
            dev.off()
          }

          size <- file.info(plot_file)$size
          if (is.na(size) || size <= 0) {
            stop("Plot file is empty.")
          }

          readBin(plot_file, "raw", size)
        }

        tryCatch(
          webr_capture_plot(),
          error = function(e) {
            if (!identical(dev.cur(), 1L)) {
              try(dev.off(), silent = TRUE)
            }
            stop(e)
          }
        )
      `;

      const rawResult = await webR.evalRRaw(plotScript);
      const plotBytes = rawResult instanceof Uint8Array ? rawResult : new Uint8Array(rawResult || []);
      const byteLength = plotBytes.length;
      if (!byteLength) {
        throw new Error('Plot generation returned empty data.');
      }

      const blob = new Blob([plotBytes], { type: 'image/png' });
      const objectUrl = URL.createObjectURL(blob);

      container.innerHTML = '';
      const img = document.createElement('img');
      img.src = objectUrl;
      img.alt = altText;
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.display = 'block';
      img.style.margin = '0 auto';
      img.style.borderRadius = '8px';
      container.appendChild(img);

      container.dataset.webrPlotUrl = objectUrl;

      return objectUrl;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[WebRHelper] renderPlot failed:', err);
      container.innerHTML = `<div style="color:#ef476f;font-weight:bold;">${errorMessage}</div>`;
      return null;
    }
  }
}

// Create global instance
window.webRHelper = new WebRHelper();
