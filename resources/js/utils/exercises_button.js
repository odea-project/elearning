/**
 * Adds an exercise button to the given taskbar if exercises exist for the slide.
 * @param {HTMLElement} section - The current slide section element.
 * @param {Array} exercisesMeta - Array of exercise meta objects for the slide.
 */
function addExerciseButtonToTaskbar(section, exercisesMeta) {
  let taskbar = section.querySelector('.taskbar');
  if (!taskbar) {
    taskbar = document.createElement('div');
    taskbar.className = 'taskbar';
    section.appendChild(taskbar);
  }

  const rightSlot = ensureTaskbarRightSlot(taskbar);

  // Remove any previous exercise button
  const prevBtn = rightSlot.querySelector('.exercise-btn');
  if (prevBtn) prevBtn.remove();

  // Add exercise button if exercises exist
  if (Array.isArray(exercisesMeta) && exercisesMeta.length > 0) {
    const btn = document.createElement('button');
    btn.className = 'exercise-btn';
    btn.textContent = 'Show Exercises';
    btn.onclick = () => {
      showExerciseOverlay();
      document.getElementById('exercise-tasks').innerHTML = `
        <div class="reveal" style="font-size: 1.1em; margin-bottom: 1em;">
          <h2 style="margin-top: 0;">(<span style="color:rgb(236, 228, 2);">${exercisesMeta.length}</span>) exercise(s) available for this slide:</h2>
          <ul style="list-style: none; padding: 0; margin: 0;">
            ${exercisesMeta.map((ex) => `
              <li>
                <button class="exercise-level-btn" onclick="window.openExercise('${ex.file}', '${ex.exercise_id}', '${ex.lang}')"><strong>${ex.level}</strong></button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    };

    btn.style.marginRight = '4px';
    rightSlot.appendChild(btn);
  }
}

/**
 * Ensures the taskbar has a right-hand container with a slide number slot.
 * @param {HTMLElement} taskbar
 * @returns {HTMLElement} Right-hand flex container.
 */
function ensureTaskbarRightSlot(taskbar) {
  ensureTaskbarCenterSlot(taskbar);

  let right = taskbar.querySelector('.taskbar__right');
  if (!right) {
    right = document.createElement('div');
    right.className = 'taskbar__right';
    right.style.display = 'flex';
    right.style.alignItems = 'center';
    right.style.marginLeft = 'auto';
    right.style.gap = '12px';
    right.style.paddingRight = '12px';
    taskbar.appendChild(right);
  }
  return right;
}

/**
 * Ensures the taskbar has a centered slide number slot.
 * @param {HTMLElement} taskbar
 * @returns {HTMLElement} Center flex container.
 */
function ensureTaskbarCenterSlot(taskbar) {
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

  if (!center.querySelector('.taskbar__slide-number')) {
    const slideNumber = document.createElement('div');
    slideNumber.className = 'taskbar__slide-number';
    slideNumber.style.pointerEvents = 'auto';
    center.appendChild(slideNumber);
  }

  return center;
}
