Reveal.on('ready', () => {
  console.log('[DEBUG] Reveal ist ready');

  console.log('[DEBUG] Reveal.getPlugins():', Reveal.getPlugins());
  console.log('[DEBUG] Reveal.getPlugin("markdown") direkt:', Reveal.getPlugin('markdown'));

  document.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const mdUrl = a.getAttribute('data-md');
      console.log('[DEBUG] Link geklickt, data-md =', mdUrl);

      const slide = document.querySelector('#dynamic-tutorial');
      if (!slide) {
        console.error('[ERROR] Slide #dynamic-tutorial nicht gefunden!');
        return;
      }

      // 1) Alten Inhalt entfernen
      slide.removeAttribute('data-markdown');
      slide.innerHTML = '';
      console.log('[DEBUG] data-markdown entfernt, innerHTML geleert');

      // 2) Neues data-markdown setzen
      slide.setAttribute('data-markdown', mdUrl);
      console.log('[DEBUG] data-markdown gesetzt auf', slide.getAttribute('data-markdown'));
      console.log('[DEBUG] slide.dataset.markdown =', slide.dataset.markdown);

      // 3) Plugin processSlides() aufrufen
      const markdownPlugin = Reveal.getPlugin('markdown');
      if (!markdownPlugin) {
        console.error('[ERROR] Markdown-Plugin nicht gefunden!');
        return;
      }
      console.log('[DEBUG] Vor markdownPlugin.processSlides()');
      markdownPlugin.processSlides();
      console.log('[DEBUG] Nach markdownPlugin.processSlides(): slide.innerHTML =\n', slide.innerHTML);

      // 4) Zur dynamischen Slide wechseln (Index anpassen, hier 2)
      Reveal.slide(2);
      console.log('[DEBUG] Zu Slide 2 gesprungen');
    });
  });
});
