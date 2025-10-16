/**
 * Syncs the slide-specific taskbar state whenever Reveal.js changes slides.
 * The metadata lives in EXERCISE_MAP (populated by exercises_overlay.js).
 */
Reveal.on('slidechanged', (event) => {
  const section = event.currentSlide;
  const slideId = section.getAttribute('id');
  const exercisesMeta = EXERCISE_MAP[slideId] || [];
  
  addExerciseButtonToTaskbar(section, exercisesMeta);
});

/**
 * Extracts the current slide ID from the window hash.
 * @returns {string} Slide ID.
 */
function getSlideIdFromHash() {
  // Example: #/distance-matrix or #/foo/bar
  const hash = window.location.hash;
  const match = hash.match(/\/([^\/]+)$/);
  return match ? match[1] : '';
}
