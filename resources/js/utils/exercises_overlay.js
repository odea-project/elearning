// === exercises_overlay.js (mit Dispatcher für Python/R) ===

/**
 * Creates the shared overlay shell on first use. Subsequent calls are cheap
 * because we simply bail out when the DOM node already exists.
 */

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
  const el = document.getElementById(slideId);
  if (el) el.style.display = 'none';
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

// ------------------------------------------------------------
// Exercise Map laden (mit lang: 'py' | 'r')
// Beispiel (exercises_map.json):
// {
//   "py_datatypes": { "file": "topics/exercises/python_basics.yaml", "id": "ex01", "lang": "py" },
//   "r_types":      { "file": "topics/exercises/r_basics.yaml",      "id": "rex01", "lang": "r"  }
// }
// ------------------------------------------------------------
let EXERCISE_MAP = {};
fetch('topics/exercises/exercises_map.json')
  .then((res) => res.json())
  .then((json) => { EXERCISE_MAP = json; })
  .catch((e) => {
    console.warn('Could not load exercises_map.json', e);
  });

// ------------------------------------------------------------
// Dispatcher-Funktionen
// ------------------------------------------------------------

/**
 * Shows a friendly placeholder message while a loader spins up or when no
 * matching exercise exists.
 * @param {string} msg - Message to display inside the overlay.
 */
function renderPlaceholder(msg) {
  console.log('renderPlaceholder:', msg);
  const container = document.getElementById('exercise-tasks');
  if (!container) return;
  container.innerHTML = `<div style="color:#9efcff;opacity:.85;">${msg}</div>`;
}

// Öffentliche API: per Key aus EXERCISE_MAP öffnen
window.openExerciseByKey = function(key) {
  const cfg = EXERCISE_MAP[key];
  console.log('openExerciseByKey:', key, cfg);
  if (!cfg) {
    showExerciseOverlay();
    renderPlaceholder(`Exercise key not found: <code>${key}</code>`);
    return;
  }
  openExerciseFromConfig(cfg);
};

// Öffentliche API: direkt per (file, id, lang) öffnen
window.openExercise = function(file, id, lang) {
  console.log('openExercise:', file, id, lang);
  openExerciseFromConfig({ file, id, lang });
};

// interner Helfer: config → Loader wählen
/**
 * Delegates a configuration object to the appropriate language loader.
 * @param {{file:string,id:string,lang?:string}} cfg - Exercise descriptor.
 */
function openExerciseFromConfig(cfg) {
  console.log('openExerciseFromConfig:', cfg);
  showExerciseOverlay();
  renderPlaceholder('Lade Übung…');

  const lang = (cfg.lang || '').toLowerCase();
  if (lang === 'r') {
    console.log('R-Exercise:', cfg);
    if (typeof window.loadRExercise !== 'function') {
      renderPlaceholder('R-Loader fehlt (loadRExercise). Stelle sicher, dass die R-Loader-Datei eingebunden ist.');
      console.error('loadRExercise(...) ist nicht geladen.');
      return;
    }
    window.loadRExercise(cfg.file, cfg.id);
  } else if (lang === 'py' || lang === 'python' || !lang) {
    console.log('Python-Exercise:', cfg);
    if (typeof window.loadExercise !== 'function') {
      renderPlaceholder('Python-Loader fehlt (loadExercise). Stelle sicher, dass die Skulpt-Loader-Datei eingebunden ist.');
      console.error('loadExercise(...) ist nicht geladen.');
      return;
    }
    window.loadExercise(cfg.file, cfg.id);
  } else {
    // Unbekannte Sprache → Fallback Python
    console.log('Unbekannte Sprache:', lang, '→ fallback auf Python');
    console.warn('Unbekannte Sprache in cfg.lang:', lang, '→ fallback auf Python');
    if (typeof window.loadExercise === 'function') {
      window.loadExercise(cfg.file, cfg.id);
    } else {
      renderPlaceholder('Kein kompatibler Loader gefunden.');
    }
  }
}

// ------------------------------------------------------------
// Optional: Click-Delegation für Buttons im Slide
// <button class="open-ex" data-exkey="r_types">Übung (R)</button>
// ------------------------------------------------------------
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.open-ex');
  if (!btn) return;
  console.log('Exercise button clicked:', btn);
  const key = btn.getAttribute('data-exkey');
  if (key) {
    e.preventDefault();
    openExerciseByKey(key);
  }
});

// ------------------------------------------------------------
// Reveal-Integration
// ------------------------------------------------------------
Reveal.on('slidechanged', hideExerciseOverlay);
Reveal.on('ready', hideExerciseOverlay);
