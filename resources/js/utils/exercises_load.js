window.loadExercise = function(file, exerciseId) {
  fetch(file)
    .then((res) => res.text())
    .then((yamlText) => {
      const exercises = window.jsyaml.load(yamlText);
      const exercise = exercises.find((e) => e.id === exerciseId);
      if (!exercise) {
        document.getElementById('exercise-tasks').innerHTML =
          `<p style="color:red;">Exercise not found.</p>`;
        return;
      }

      // Render overlay HTML with a div for the editor
      document.getElementById('exercise-tasks').innerHTML = `
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
      `;

      // Initialize CodeMirror 6
      const editorParent = document.getElementById('editor-container');
      let cmEditor = new window.EditorView({
        state: window.EditorState.create({
          doc: exercise.starter_code || "",
          extensions: [window.basicSetup, window.python(), window.monokai]
        }),
        parent: editorParent
      });

      // Initialize Output Editor
      let outputEditor = new window.EditorView({
        state: window.EditorState.create({
          doc: '',
          extensions: [
            window.basicSetup,
            window.python(),     // Optional, oder besser window.StreamLanguage.define(window.python()) für weniger Färbung
            window.monokai,
            window.EditorView.editable.of(false), // Output is readonly!
          ]
        }),
        parent: document.getElementById('output-editor-container')
      });

      // Feedback-Banner anzeigen
      function showCheckmark(msg) {
        let banner = document.getElementById('exercise-banner');
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'exercise-banner';
          banner.style.cssText = 'position:absolute; top:1em; right:2em; z-index:10000; font-size:1.2em; background:#232347; color:#19f1ff; padding: .5em 1em; border-radius:.7em; box-shadow:0 0 1em #19f1ff80;';
          document.body.appendChild(banner);
        }
        banner.textContent = msg;
        banner.style.display = '';
        setTimeout(() => { banner.style.display = 'none'; }, 2000);
      }



      document.getElementById('run-python-btn').onclick = () => {
        const code = cmEditor.state.doc.toString();
        // Skulpt config: output collection
        let output = '';
        function outf(text) { output += text; }

        Sk.configure({
          output: outf,
          read: (x) => {
            if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
              throw `File not found: '${x}'`;
            return Sk.builtinFiles["files"][x];
          }
        });

        (async () => {
          try {
            output = '';
            await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody("<stdin>", false, code, true));
            outputEditor.dispatch({
              changes: { from: 0, to: outputEditor.state.doc.length, insert: output || '[No output]' }
            });

          // ==== RESULT COMPARISON ====
          if (exercise.expected_output !== undefined) {
            // Trim whitespace for more robust check
            const userOutput = output.trim();
            const solutionOutput = (exercise.expected_output || "").trim();
            if (userOutput === solutionOutput) {
              // Optional: Success-Message
              showCheckmark("Success! Your output is correct.");
            } else {
              // Optional: Failure-Message
              showCheckmark("Sorry, your output does not match the solution.");
            }
          }
        } catch (err) {
          outputEditor.dispatch({
            changes: { from: 0, to: outputEditor.state.doc.length, insert: '[Error]\n' + err.toString() }
          });
        }
      })();
    };

      document.getElementById('show-solution-btn').onclick = () => {
        cmEditor.dispatch({
          changes: { from: 0, to: cmEditor.state.doc.length, insert: exercise.solution || '' }
        });

        outputEditor.dispatch({
          changes: { from: 0, to: outputEditor.state.doc.length, insert: "" }
        });
      };

    });
};
