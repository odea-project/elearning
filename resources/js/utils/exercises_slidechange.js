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
