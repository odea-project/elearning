/**
 * Basic tab switching logic for slides that use `.tab` headers and `.tab-content`
 * panels. The handler relies on event delegation so new tabs added at runtime
 * continue to work without extra wiring.
 */
document.querySelector('.reveal .slides').addEventListener('click', function (event) {
  // 1. Finde heraus, ob das geklickte Element eine Tab-Überschrift ist:
  //    a) Entweder event.target ist .tab
  //    b) Oder ein Kindelement von .tab (z.B. wenn du Icons/Text in .tab hast)
  const tab = event.target.closest('.tab');
  if (!tab) return; // war kein Klick auf ein <div class="tab">, also ignorieren

  // 2. Tab-ID (data-tab) auslesen
  const tabId = tab.getAttribute('data-tab');
  if (!tabId) return;

  // 3. Parent-Slide (Section) finden
  const slide = tab.closest('section');
  if (!slide) return;

  // 4. Alle Tabs in dieser Section auf "inaktiv" setzen
  slide.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  // 5. Diesen Tab (den wir angeklickt haben) aktivieren
  tab.classList.add('active');

  // 6. Alle tab-content in dieser Section deaktivieren
  slide.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  // 7. Das/die entsprechende(n) .tab-content aktivieren
  slide.querySelectorAll(`.tab-content[data-tab="${tabId}"]`).forEach(c => c.classList.add('active'));
});