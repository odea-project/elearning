const EXERCISE_CONTAINER_ID = 'exercise-tasks';

/**
 * Injects the configured content into the exercise overlay container.
 * @param {string} html - HTML string to render inside the overlay.
 */
const renderExerciseContent = (html) => {
  const container = document.getElementById(EXERCISE_CONTAINER_ID);
  if (!container) {
    console.warn('Exercise container missing – cannot render exercise.');
    return;
  }
  container.innerHTML = html;
};

/**
 * Ensures the floating status banner exists and updates its text.
 * @param {string} message - Text to show to the learner.
 */
const showExerciseBanner = (message) => {
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
 * Loads a single Python exercise from a YAML file and renders a CodeMirror +
 * Skulpt playground.
 *
 * Expected YAML snippet:
 * ```yaml
 * - id: unique-id
 *   title: Optional title
 *   task: Rich HTML task description
 *   starter_code: |-
 *     print('hello')
 *   solution: |-
 *     print('hello world')
 *   expected_output: hello
 * ```
 *
 * @param {string} file - Path to the YAML file.
 * @param {string} exerciseId - Identifier of the exercise to display.
 */
window.loadExercise = async function loadExercise(file, exerciseId) {
  const container = document.getElementById(EXERCISE_CONTAINER_ID);
  if (!container) {
    console.warn('Exercise container not available.');
    return;
  }

  try {
    const response = await fetch(file);
    const yamlText = await response.text();
    const exercises = window.jsyaml.load(yamlText) || [];
    const exercise = exercises.find((entry) => entry.id === exerciseId);

    if (!exercise) {
      renderExerciseContent('<p style="color:red;">Exercise not found.</p>');
      return;
    }

    renderExerciseContent(`
      <div class="reveal">
        <h2>${exercise.title || ''}</h2>
        <div style="margin-bottom:.5em;">${exercise.task || ''}</div>
        <div class="custom-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(1, 1fr); gap: 2em;">
          <div style="grid-row: 1; grid-column: 1; padding:0em;">
            <div id="editor-container" style="margin-bottom:0em;"></div>
          </div>
          <div style="grid-row: 1; grid-column: 2; padding:0em;">
            <button class="run-python-btn" id="run-python-btn" style="margin-right:.5em; font-size:0.4em">Run Code</button>
            <button class="show-solution-btn" id="show-solution-btn" style="font-size:0.4em">Show Solution</button>
            <div id="output-editor-container" style="height: 120px;"></div>
          </div>
        </div>
      </div>
    `);

    const editorParent = document.getElementById('editor-container');
    const outputContainer = document.getElementById('output-editor-container');
    if (!editorParent || !outputContainer) {
      console.error('Editor containers missing inside overlay.');
      return;
    }

    const codeMirrorExtensions = [window.basicSetup, window.python(), window.monokai];
    const cmEditor = new window.EditorView({
      state: window.EditorState.create({
        doc: exercise.starter_code || '',
        extensions: codeMirrorExtensions,
      }),
      parent: editorParent,
    });

    const cmOutput = new window.EditorView({
      state: window.EditorState.create({
        doc: '',
        extensions: [
          window.basicSetup,
          window.python(),
          window.monokai,
          window.EditorView.editable.of(false),
        ],
      }),
      parent: outputContainer,
    });

    document.getElementById('run-python-btn').onclick = async () => {
      const code = cmEditor.state.doc.toString();
      let output = '';
      const outf = (text) => {
        output += text;
      };

      Sk.configure({
        output: outf,
        read: (x) => {
          if (!Sk.builtinFiles || !Sk.builtinFiles["files"] || !Sk.builtinFiles["files"][x]) {
            throw `File not found: '${x}'`;
          }
          return Sk.builtinFiles["files"][x];
        },
      });

      try {
        output = '';
        await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, code, true));
        cmOutput.dispatch({
          changes: {
            from: 0,
            to: cmOutput.state.doc.length,
            insert: output || '[No output]',
          },
        });

        if (exercise.expected_output !== undefined) {
          const userOutput = output.trim();
          const expected = String(exercise.expected_output || '').trim();
          showExerciseBanner(
            userOutput === expected
              ? 'Success! Your output is correct.'
              : 'Sorry, your output does not match the solution.'
          );
        }
      } catch (err) {
        cmOutput.dispatch({
          changes: {
            from: 0,
            to: cmOutput.state.doc.length,
            insert: `[Error]\n${err}`,
          },
        });
      }
    };

    document.getElementById('show-solution-btn').onclick = () => {
      cmEditor.dispatch({
        changes: {
          from: 0,
          to: cmEditor.state.doc.length,
          insert: exercise.solution || '',
        },
      });
      cmOutput.dispatch({
        changes: {
          from: 0,
          to: cmOutput.state.doc.length,
          insert: '',
        },
      });
    };
  } catch (error) {
    renderExerciseContent(`<p style="color:red;">Error loading exercise: ${error.message}</p>`);
  }
};
