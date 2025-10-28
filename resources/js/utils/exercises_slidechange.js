/**
 * Syncs the slide-specific taskbar state whenever Reveal.js changes slides.
 * The metadata lives in EXERCISE_MAP (populated by exercises_overlay.js).
 */
Reveal.on('slidechanged', (event) => {
  syncTaskbarForSlide(event.currentSlide);
});

/**
 * Ensure taskbar state is correct once Reveal is ready.
 */
Reveal.on('ready', (event) => {
  const currentSlide = event.currentSlide || Reveal.getCurrentSlide();
  syncTaskbarForSlide(currentSlide);
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

/**
 * Applies exercise button visibility and slide number text for a slide.
 * @param {HTMLElement|null} section
 */
function syncTaskbarForSlide(section) {
  if (!section) return;

  const slideId = section.getAttribute('id');
  const exercisesMeta = (slideId && EXERCISE_MAP[slideId]) || [];
  addExerciseButtonToTaskbar(section, exercisesMeta);
  updateTaskbarSlideNumber(section);
}

/**
 * Updates or creates the slide number display inside a slide's taskbar.
 * @param {HTMLElement} section
 */
function updateTaskbarSlideNumber(section) {
  const taskbar = section.querySelector('.taskbar');
  if (!taskbar) return;

  let center = taskbar.querySelector('.taskbar__center');
  if (!center) {
    center = document.createElement('div');
    center.className = 'taskbar__center';
    center.style.position = 'absolute';
    center.style.left = '50%';
    center.style.top = '50%';
    center.style.transform = 'translate(-50%, -50%)';
    center.style.display = 'flex';
    center.style.justifyContent = 'center';
    center.style.alignItems = 'center';
    center.style.fontSize = '0.5em';
    center.style.pointerEvents = 'none';

    const right = taskbar.querySelector('.taskbar__right');
    if (right) taskbar.insertBefore(center, right);
    else taskbar.appendChild(center);
  }

  let indicator = center.querySelector('.taskbar__slide-number');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'taskbar__slide-number';
    indicator.style.pointerEvents = 'auto';
    center.appendChild(indicator);
  }

  const totalSlides = Reveal.getTotalSlides();
  if (typeof totalSlides !== 'number' || !Number.isFinite(totalSlides) || totalSlides <= 0) {
    indicator.textContent = '';
    return;
  }

  const index = Reveal.getSlidePastCount(section) + 1;
  indicator.textContent = `${index} / ${totalSlides}`;
}
