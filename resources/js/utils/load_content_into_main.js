Reveal.on('ready', () => {
  console.log('[DEBUG] Reveal ist ready');

  // Nur zur Sicherheit, um zu sehen, wie das Plugin-Objekt aussieht:
  console.log('[DEBUG] Reveal.getPlugins():', Reveal.getPlugins());
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

      // 1) Alten Content löschen (falls dort vorher schon etwas stand)
      slide.removeAttribute('data-markdown');
      slide.innerHTML = '';
      console.log('[DEBUG] Alten Inhalt gelöscht, innerHTML geleert');

      // 2) Optional: neues data-markdown setzen (damit Reveal intern den Pfad kennt)
      slide.setAttribute('data-markdown', mdUrl);
      console.log('[DEBUG] data-markdown gesetzt auf:', slide.getAttribute('data-markdown'));

      // 3) Markdown‐Datei per fetch() laden
      try {
        console.log('[DEBUG] Vor fetch(', mdUrl, ')');
        const response = await fetch(mdUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} beim Laden von ${mdUrl}`);
        }
        const markdownText = await response.text();
        console.log('[DEBUG] Markdown-Text empfangen (erste 100 Zeichen):\n', 
                    markdownText.slice(0,100).replace(/\n/g,'⏎'));

        // 4) Mit dem Reveal-Markdown-Parser in HTML umwandeln
        //    plugin.marked() ist die interne Funktion, die Reveal.js nutzt
        const html = markdownPlugin.marked(markdownText);
        console.log('[DEBUG] gerenderter HTML-String (erste 200 Zeichen):\n',
                    html.slice(0,200).replace(/</g,'«').replace(/>/g,'»'));

        // 5) HTML in die Section schreiben
        slide.innerHTML = html;
        console.log('[DEBUG] slide.innerHTML gesetzt; jetzt Slidify aufrufen');

        // 6) Falls Ihr in Eurer Markdown-Datei "---" als Folientrenner habt, 
        //    erzeugt Ihr Unter-Slides mit slidify():
        markdownPlugin.slidify(slide);
        console.log('[DEBUG] markdownPlugin.slidify() aufgerufen; jetzt Reveal.layout()');

        // 7) Reveal neu layouten, damit alle Größen passen
        Reveal.layout();
        console.log('[DEBUG] Reveal.layout() ausgeführt');

      } catch (err) {
        console.error('[ERROR] Lade- oder Render-Fehler für', mdUrl, ':', err);
        // Wer mag, kann hier eine Fehlermeldung in die Slide schreiben:
        slide.innerHTML = `<p style="color:red;">Fehler beim Laden: ${err.message}</p>`;
      }

      // 8) Zur dynamischen Slide springen (Index anpassen, hier z.B. 2)
      //    Prüft per Reveal.getIndices(), an welcher Position #dynamic-tutorial wirklich steht!
      Reveal.slide(2);
      console.log('[DEBUG] Zu Slide 2 gesprungen');
    });
  });
});
