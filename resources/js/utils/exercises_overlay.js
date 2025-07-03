function ensureExerciseOverlay() {
  if (document.getElementById('exercise-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'exercise-overlay';
  overlay.id = 'exercise-overlay';
  overlay.style.cssText = `
    display: none; position: fixed; z-index: 9999; top: 0; left: 0;
    width: 100vw; height: 100vh; background: rgba(20,20,40,0.0); color: #eee;
  `;
  overlay.innerHTML = `
    <div class="exercise-content" id="exercise-content">
      <button id="close-exercise">✖</button>
      <div id="exercise-tasks"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById('close-exercise').onclick = () => {
    overlay.style.display = 'none';
    document.getElementById('exercise-tasks').innerHTML = '';
    // Show the current slide again
    const slideId = getSlideIdFromHash();
    const currentSlide = document.getElementById(slideId);
    if (currentSlide) {
      currentSlide.style.display = '';
    }
  };
}
ensureExerciseOverlay();

function showExerciseOverlay() {
  document.getElementById('exercise-overlay').style.display = '';
  // get the current slide ID
  const slideId = getSlideIdFromHash();
  document.getElementById(slideId).style.display = 'none';
}

function hideExerciseOverlay() {
  document.getElementById('exercise-overlay').style.display = 'none';
  document.getElementById('exercise-tasks').innerHTML = '';
  // Show the current slide again
  const slideId = getSlideIdFromHash();
  const currentSlide = document.getElementById(slideId);
  if (currentSlide) {
    currentSlide.style.display = '';
  }
}


let EXERCISE_MAP = {};
fetch('topics/exercises/exercises_map.json')
  .then((res) => res.json())
  .then((json) => { EXERCISE_MAP = json; });