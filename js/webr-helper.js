/**
 * WebR Helper Utility
 * Shared functions for WebR-based interactive R code editors
 */

class WebRHelper {
  constructor() {
    this.webRInstance = null;
    this.sectionCounter = 0;
    this.plotSupportReady = false;
    this.plotSupportPromise = null;
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
   * Lazily ensure plotting support packages are installed and loaded.
   * For the slim WebR build we only fetch grDevices/graphics when needed.
   */
  async ensurePlotSupport() {
    if (this.plotSupportReady) {
      return true;
    }

    if (!this.plotSupportPromise) {
      this.plotSupportPromise = (async () => {
        const webR = await this.ensureWebR();

        try {
          await webR.evalRVoid(`
            for (pkg in c("grDevices", "graphics")) {
              if (!pkg %in% loadedNamespaces()) {
                base::loadNamespace(pkg)
              }
            }
          `);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.warn('[WebRHelper] Loading plotting namespaces failed:', err);
          throw err;
        }

        this.plotSupportReady = true;
        return true;
      })();

      this.plotSupportPromise.catch(() => {
        this.plotSupportReady = false;
        this.plotSupportPromise = null;
      });
    }

    await this.plotSupportPromise;
    this.plotSupportPromise = null;
    return this.plotSupportReady;
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
        <div id="${editorId}" class="code-editor-container" style="border: 0px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>
        <div style="display: flex; gap: 10px;">
          <button id="${toggleBtnId}" style="padding: 8px 16px; background: #2d3a66; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
            <i class="fas fa-code"></i> Show Code
          </button>
          <button id="${runBtnId}" style="padding: 8px 16px; background: #1a2340; color: #9efcff; border: 1px solid #2d3a66; border-radius: 6px; cursor: pointer; font-size: 0.9em;">
            <i class="fas fa-play"></i> ${runLabel}
          </button>
        </div>
        <div id="${outputId}" style="border: 0px solid #2d3a66; border-radius: 8px; overflow: hidden; min-height: ${minHeight};"></div>
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

    const scrollTheme = window.EditorView.theme({
      "&": {
        maxHeight: "16.5em"
      },
      "& .cm-scroller": {
        overflowY: "auto",
        scrollbarWidth: "none",
        overscrollBehavior: "contain"
      },
      "& .cm-scroller::-webkit-scrollbar": {
        display: "none"
      }
    });

    const editorExtensions = [window.basicSetup];
    if (rLang.length) editorExtensions.push(rLang);
    editorExtensions.push(window.monokai, fontSizeTheme);
    
    if (!editable) {
      editorExtensions.push(window.EditorView.editable.of(false));
    } else {
      editorExtensions.push(scrollTheme);
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
   * Create and show an overlay for large output
   * @param {string} content - Output content to display
   * @param {string} overlayId - Unique ID for the overlay
   */
  showOutputOverlay(content, overlayId = 'webr-output-overlay') {
    // Remove existing overlay if present
    const existing = document.getElementById(overlayId);
    if (existing) {
      existing.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.2s ease-in;
    `;

    // Create content container
    const container = document.createElement('div');
    container.style.cssText = `
      background: #1a2340;
      border: 2px solid #2d3a66;
      border-radius: 12px;
      padding: 20px;
      max-width: 80%;
      max-height: 80%;
      overflow: auto;
      position: relative;
      box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
    `;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ef476f;
      color: #ffffff;
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
      transition: background 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#d93d5a';
    closeBtn.onmouseout = () => closeBtn.style.background = '#ef476f';
    closeBtn.onclick = () => overlay.remove();

    // Create output display
    const outputDiv = document.createElement('div');
    outputDiv.style.cssText = `
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 1em;
      color: #9efcff;
      background: #0d1329;
      padding: 15px;
      border-radius: 8px;
      white-space: pre-wrap;
      word-break: break-word;
      margin-top: 20px;
      line-height: 1.5;
    `;
    outputDiv.textContent = content;

    // Create title
    const title = document.createElement('h3');
    title.textContent = 'Output';
    title.style.cssText = `
      color: #9efcff;
      margin: 0 40px 10px 0;
      font-size: 1.3em;
    `;

    // Assemble overlay
    container.appendChild(closeBtn);
    container.appendChild(title);
    container.appendChild(outputDiv);
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    // Close on background click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    };

    // Close on ESC key
    const escHandler = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);

    // Add fade-in animation if not already defined
    if (!document.getElementById('webr-overlay-style')) {
      const style = document.createElement('style');
      style.id = 'webr-overlay-style';
      style.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Count lines in text content
   * @param {string} text - Text to count lines in
   * @returns {number} Number of lines
   */
  countLines(text) {
    if (!text) return 0;
    return text.split('\n').length;
  }

  /**
   * Check if output should be shown in overlay (more than 5 lines)
   * @param {string} output - Output text to check
   * @returns {boolean} True if should show in overlay
   */
  shouldShowOverlay(output) {
    return this.countLines(output) > 5;
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
        
        // Check if output is too large
        if (this.shouldShowOverlay(output)) {
          // Show preview in editor
          const lines = output.split('\n');
          const preview = lines.slice(0, 3).join('\n') + 
                         `\n... (${lines.length} lines total - click to view full output)`;
          outputEditor.dispatch({
            changes: { 
              from: 0, 
              to: outputEditor.state.doc.length, 
              insert: preview
            }
          });
          
          // Show full output in overlay
          this.showOutputOverlay(output, `webr-output-overlay-${runBtnId}`);
        } else {
          // Show normally for small outputs
          outputEditor.dispatch({
            changes: { 
              from: 0, 
              to: outputEditor.state.doc.length, 
              insert: output 
            }
          });
        }
      } catch (err) {
        if (fallbackFn) {
          const fallbackOutput = fallbackFn(code);
          
          // Check if fallback output is too large
          if (this.shouldShowOverlay(fallbackOutput)) {
            const lines = fallbackOutput.split('\n');
            const preview = lines.slice(0, 3).join('\n') + 
                           `\n... (${lines.length} lines total - click to view full output)`;
            outputEditor.dispatch({
              changes: { 
                from: 0, 
                to: outputEditor.state.doc.length, 
                insert: preview 
              }
            });
            this.showOutputOverlay(fallbackOutput, `webr-output-overlay-${runBtnId}`);
          } else {
            outputEditor.dispatch({
              changes: { 
                from: 0, 
                to: outputEditor.state.doc.length, 
                insert: fallbackOutput 
              }
            });
          }
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
    const runBtn = document.getElementById(ids.runBtnId);
    const toggleBtn = document.getElementById(ids.toggleBtnId);

    if (!codeEditor || !outputEditor) return null;

    // Setup buttons
    this.setupToggleButton(ids.toggleBtnId, ids.editorId, config.slideId);
    if (config.autoRun !== false) {
      this.setupRunButton(ids.runBtnId, codeEditor, outputEditor, config.fallback);
    }

    return {
      codeEditor,
      outputEditor,
      runButton: runBtn,
      runBtnId: ids.runBtnId,
      toggleButton: toggleBtn,
      toggleBtnId: ids.toggleBtnId
    };
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
   * Initialise an interactive section that executes R code and renders a plot.
   * @param {Object} config - Configuration for the interactive section.
   * @param {string} config.containerId - ID of the container for the interactive section.
   * @param {string} config.plotContainerId - ID of the container that should display the plot.
   * @param {string} config.code - R code to preload into the editor.
   * @param {string} [config.slideId] - Reveal.js slide ID.
   * @param {function} [config.fallback] - Fallback output generator on error.
   * @param {string} [config.runLabel] - Custom label for the run button.
   * @param {string} [config.minHeight] - Minimum height for the output editor.
   * @param {Object} [config.renderOptions] - Options for renderPlot and UI behaviour.
   * @param {string} [config.popupButtonId] - ID of a button that opens the plot in a popup.
   * @returns {Promise<Object|null>} Interactive section handles or null on failure.
   */
  async initCodeAndPlotSection(config = {}) {
    const {
      containerId,
      plotContainerId,
      code,
      slideId = null,
      fallback = null,
      runLabel,
      minHeight,
      renderOptions = {},
      popupButtonId = null
    } = config;

    if (!containerId || !plotContainerId) {
      console.error('[WebRHelper] initCodeAndPlotSection requires containerId and plotContainerId.');
      return null;
    }

    const plotContainer = document.getElementById(plotContainerId);
    if (!plotContainer) {
      console.error(`[WebRHelper] Plot container "${plotContainerId}" not found.`);
      return null;
    }

    const {
      width,
      height,
      res,
      background,
      altText,
      loadingMessage: plotLoadingMessage,
      errorMessage: plotErrorMessage,
      initialPlotMessage = 'Run the example to render the plot.',
      fallbackPlotMessage = 'Plot rendering unavailable in offline mode.',
      popupWindowFeatures = 'width=760,height=560',
      popupTemplate = null
    } = renderOptions || {};

    plotContainer.innerHTML = `<div style="color:#ff8f00fc;">${initialPlotMessage}</div>`;

    const interactive = await this.initInteractiveSection({
      containerId,
      code,
      slideId,
      fallback,
      runLabel,
      minHeight,
      autoRun: false
    });

    if (!interactive) return null;

    const { codeEditor, outputEditor, runButton, runBtnId } = interactive;
    const runBtn = runButton || (runBtnId ? document.getElementById(runBtnId) : null);

    if (!runBtn) {
      console.warn('[WebRHelper] Run button not found for interactive section', containerId);
      return interactive;
    }

    const popupBtn = popupButtonId ? document.getElementById(popupButtonId) : null;
    if (popupBtn) {
      popupBtn.style.display = 'none';
    }

    let latestPlotUrl = null;
    const defaultLabel = runBtn.innerHTML;

    const setOutput = (text) => {
      const docLength = outputEditor.state.doc.length;
      outputEditor.dispatch({
        changes: { from: 0, to: docLength, insert: text }
      });
    };

    runBtn.onclick = async () => {
      const userCode = codeEditor.state.doc.toString();
      runBtn.disabled = true;
      runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';

      if (popupBtn) {
        popupBtn.style.display = 'none';
      }

      try {
        const output = await this.executeR(userCode);
        const finalOutput = output && output.trim().length ? output : '[No output]';
        
        // Check if output is too large
        if (this.shouldShowOverlay(finalOutput)) {
          const lines = finalOutput.split('\n');
          const preview = lines.slice(0, 3).join('\n') + 
                         `\n... (${lines.length} lines total - click to view full output)`;
          setOutput(preview);
          this.showOutputOverlay(finalOutput, `webr-output-overlay-${runBtnId}`);
        } else {
          setOutput(finalOutput);
        }

        let plotUrl = null;
        try {
          plotUrl = await this.renderPlot({
            containerId: plotContainerId,
            code: userCode,
            width,
            height,
            res,
            background,
            altText,
            loadingMessage: plotLoadingMessage,
            errorMessage: plotErrorMessage
          });
        } catch (plotErr) {
          latestPlotUrl = null;
          if (popupBtn) popupBtn.style.display = 'none';
          // eslint-disable-next-line no-console
          console.error('[WebRHelper] Plot rendering failed:', plotErr);
        }

        if (plotUrl) {
          latestPlotUrl = plotUrl;
          if (popupBtn) {
            popupBtn.style.display = 'inline-flex';
          }
        } else if (!plotContainer.dataset.webrPlotUrl) {
          plotContainer.innerHTML = `<div style="color:#ef476f;font-weight:600;">${plotErrorMessage || fallbackPlotMessage}</div>`;
        }
      } catch (err) {
        let errorOutput;
        if (typeof fallback === 'function') {
          errorOutput = fallback();
        } else {
          errorOutput = `Error: ${err.message}`;
        }
        
        // Check if error/fallback output is too large
        if (this.shouldShowOverlay(errorOutput)) {
          const lines = errorOutput.split('\n');
          const preview = lines.slice(0, 3).join('\n') + 
                         `\n... (${lines.length} lines total - click to view full output)`;
          setOutput(preview);
          this.showOutputOverlay(errorOutput, `webr-output-overlay-${runBtnId}`);
        } else {
          setOutput(errorOutput);
        }
        
        plotContainer.innerHTML = `<div style="color:#ef476f;font-weight:600;">${plotErrorMessage || fallbackPlotMessage}</div>`;
        latestPlotUrl = null;
      } finally {
        runBtn.disabled = false;
        runBtn.innerHTML = defaultLabel;
      }
    };

    if (popupBtn) {
      popupBtn.addEventListener('click', () => {
        if (!latestPlotUrl) return;
        const popup = window.open('', '_blank', popupWindowFeatures);
        if (!popup) return;
        popup.document.open();
        const template = popupTemplate
          ? popupTemplate(latestPlotUrl)
          : '<!doctype html><html><head><title>WebR Plot</title></head>' +
            '<body style="margin:0;background:#0d1329;display:flex;align-items:center;justify-content:center;height:100vh;">' +
            `<img src="${latestPlotUrl}" alt="WebR plot" style="max-width:95%;height:auto;border-radius:12px;box-shadow:0 0 24px rgba(30,200,255,0.35);" />` +
            '</body></html>';
        popup.document.write(template);
        popup.document.close();
        popup.opener = null;
        popup.focus();
      });
    }

    return { codeEditor, outputEditor, runButton: runBtn };
  }

  /**
   * Render an R plot into a target container by capturing it as an SVG.
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
    const svgWidthInches = (width / res).toFixed(2);
    const svgHeightInches = (height / res).toFixed(2);

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

    container.innerHTML = `<div class="webr-loading" style="padding: 1.2em; color: #ff8f00fc; font-weight: 600;">${loadingMessage}</div>`;

    try {
      await this.ensurePlotSupport();
      const webR = await this.ensureWebR();

      const plotScript = `
        webr_capture_plot <- function() {
          plot_file <- tempfile(fileext = ".svg")
          on.exit(unlink(plot_file), add = TRUE)

          svg(
            filename = plot_file,
            width = ${svgWidthInches},
            height = ${svgHeightInches},
            bg = "${background}"
          )

          on.exit({
            try(dev.off(), silent = TRUE)
          }, add = TRUE)

          ${code}

          if (!identical(dev.cur(), 1L)) {
            dev.off()
          }

          svg_text <- paste(readLines(plot_file, warn = FALSE), collapse = "\n")
          if (!nzchar(svg_text)) {
            stop("Plot file is empty.")
          }

          svg_text
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

      const svgString = (await webR.evalRString(plotScript) || '').trim();
      if (!svgString) {
        throw new Error('Plot generation returned empty data.');
      }

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
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

/**
 * Convenience function to ensure WebR helper is available
 * @returns {Promise<WebRHelper>} WebR helper instance
 */
window.ensureWebRHelper = async function() {
  return window.webRHelper;
};
