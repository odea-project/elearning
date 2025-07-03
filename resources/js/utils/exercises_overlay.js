function ensureExerciseOverlay() {
  if (document.getElementById('exercise-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'exercise-overlay';
  overlay.style.cssText = `
    display: none; position: fixed; z-index: 9999; top: 0; left: 0;
    width: 100vw; height: 100vh; background: rgba(20,20,40,0.95); color: #eee;
  `;
  overlay.innerHTML = `
    <div id="exercise-content"
         style="position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
                background: #232347; border-radius: 2em; padding: 2em; min-width: 40vw;
                max-width: 80vw; min-height: 20vh; box-shadow: 0 0 24px #19f1ff;">
      <button id="close-exercise"
              style="position: absolute; top: 1.2em; right: 1.2em;">Close ✖</button>
      <div id="exercise-tasks"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('close-exercise').onclick = () => {
    overlay.style.display = 'none';
    document.getElementById('exercise-tasks').innerHTML = '';
  };
}
ensureExerciseOverlay();

function showExerciseOverlay() {
  document.getElementById('exercise-overlay').style.display = '';
}

function hideExerciseOverlay() {
  document.getElementById('exercise-overlay').style.display = 'none';
  document.getElementById('exercise-tasks').innerHTML = '';
}


let EXERCISE_MAP = {};
fetch('topics/exercises/exercises_map.json')
  .then((res) => res.json())
  .then((json) => { EXERCISE_MAP = json; });