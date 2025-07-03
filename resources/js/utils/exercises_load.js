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
      // Render the exercise
      document.getElementById('exercise-tasks').innerHTML = `
        <h3>${exercise.title || ''}</h3>
        <div style="margin-bottom:1em;">${exercise.task || ''}</div>
        <div class="reveal">
          <pre>
            <code id="exercise-editor" contenteditable="true" spellcheck="false" class="language-python">${exercise.starter_code || ''}</code>
          </pre>
        </div>
        <button id="run-python-btn" style="margin-right:1em;">Run Code</button>
        <button id="show-solution-btn">Show Solution</button>
        <pre id="python-output" style="background: #22223b; color: #60ffe7; margin-top: 1em; border-radius: 1em; min-height: 2em; padding: 1em;"></pre>
      `;

      const codeElement = document.getElementById('exercise-editor');
      if (window.hljs) {
        window.hljs.highlightElement(codeElement);
      } else if (Reveal.getPlugin('highlight') && Reveal.getPlugin('highlight').highlightBlock) {
        Reveal.getPlugin('highlight').highlightBlock(codeElement);
      }

      document.getElementById('run-python-btn').onclick = () => {
        const code = document.getElementById('exercise-editor').textContent;
        const outputElement = document.getElementById('python-output');
        outputElement.textContent = 'Running...';

        // Skulpt config: output collection
        let output = '';
        function outf(text) {
          output += text;
        }

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
            outputElement.textContent = output || '[No output]';
          } catch (err) {
            outputElement.textContent = '[Error]\n' + err.toString();
          }
        })();
      };
      document.getElementById('show-solution-btn').onclick = () => {
        document.getElementById('exercise-editor').textContent = exercise.solution || '';
        document.getElementById('python-output').textContent = '';
      };

    });

  
};
