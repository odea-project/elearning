Reveal.on('ready', () => {
  console.log('[DEBUG] Reveal ist ready');

  const markdownPlugin = Reveal.getPlugin('markdown');
  console.log('[DEBUG] Markdown-Plugin:', markdownPlugin);

  document.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', async e => {
      e.preventDefault();
      const mdUrl = a.getAttribute('data-md');
      console.log('[DEBUG] Link geklickt, data-md =', mdUrl);

      const slide = document.querySelector('#dynamic-tutorial');
      if (!slide) {
        console.error('[ERROR] Slide #dynamic-tutorial nicht gefunden!');
        return;
      }

      // 1) Alten Inhalt löschen
      slide.removeAttribute('data-markdown');
      slide.innerHTML = '';
      console.log('[DEBUG] Alten Inhalt gelöscht, innerHTML geleert');

      // 2) fetch() aufrufen, um das Markdown zu laden
      try {
        console.log('[DEBUG] Vor fetch(', mdUrl, ')');
        const response = await fetch(mdUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        const markdownText = await response.text();
        console.log('[DEBUG] Markdown-Text empfangen:', markdownText.slice(0, 100).replace(/\n/g, '⏎'));

        // 3) Mit dem internen marked()-Parser in HTML umwandeln
        const html = markdownPlugin.marked(markdownText);
        console.log('[DEBUG] gerenderter HTML-String (erste 200 Zeichen):', html.slice(0, 200).replace(/</g, '«').replace(/>/g, '»'));

        // 4) Das Ergebnis in die Section schreiben
        slide.innerHTML = html;
        console.log('[DEBUG] slide.innerHTML gesetzt');

        // 5) Reveal neu layouten, damit alles korrekt dargestellt wird
        Reveal.layout();
        console.log('[DEBUG] Reveal.layout() ausgeführt');

      } catch (err) {
        console.error('[ERROR] Lade- oder Render-Fehler für', mdUrl, ':', err);
        slide.innerHTML = `<p style="color:red;">Fehler beim Laden: ${err.message}</p>`;
      }

      // 6) Auf diese Folie wechseln (Index anpassen!)
      //    Beispiel: wenn dynamic-tutorial die dritte Folie ist, dann Reveal.slide(2).
      Reveal.slide(2);
      console.log('[DEBUG] Zu Slide 2 gesprungen');
    });
  });
});
