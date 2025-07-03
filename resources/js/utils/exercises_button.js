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

  // Remove any previous exercise button
  const prevBtn = taskbar.querySelector('.exercise-btn');
  if (prevBtn) prevBtn.remove();

  // Add exercise button if exercises exist
  if (Array.isArray(exercisesMeta) && exercisesMeta.length > 0) {
    const btn = document.createElement('button');
    btn.className = 'exercise-btn';
    btn.textContent = 'Show Exercises';
    btn.onclick = () => {
      showExerciseOverlay();
      document.getElementById('exercise-tasks').innerHTML = `
        <div style="font-size: 1.1em; margin-bottom: 1em;">
          (${exercisesMeta.length}) exercise(s) available for this slide:
          <ul>
            ${exercisesMeta.map((ex) => `
              <li>
                <strong>${ex.level}</strong>
                <button onclick="window.loadExercise('${ex.file}', '${ex.exercise_id}')">Open</button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    };
    // Align button right in taskbar if needed
    btn.style.marginLeft = 'auto';
    btn.style.marginRight = '16px';
    taskbar.appendChild(btn);
  }
}
