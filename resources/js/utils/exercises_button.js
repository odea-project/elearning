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
    // Align button right in taskbar if needed
    btn.style.marginLeft = 'auto';
    btn.style.marginRight = '16px';
    taskbar.appendChild(btn);
  }
}
