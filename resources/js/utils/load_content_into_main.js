Reveal.on('ready', () => {
  console.log('[DEBUG] Reveal ist ready');

  const markdownPlugin = Reveal.getPlugin('markdown');
  console.log('[DEBUG] Markdown-Plugin:', markdownPlugin);

  document.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', async e => {
      e.preventDefault();
      const mdUrl = a.getAttribute('data-md');
      console.log('[DEBUG] Link geklickt, data-md =', mdUrl);

      // 1) Hole das Platzhalter-Element heraus
      const placeholder = document.querySelector('#dynamic-tutorial');
      if (!placeholder) {
        console.error('[ERROR] #dynamic-tutorial nicht gefunden!');
        return;
      }

      // 2) Fetch + Markdown laden
      let markdownText;
      try {
        const response = await fetch(mdUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} beim Laden von ${mdUrl}`);
        }
        markdownText = await response.text();
        console.log('[DEBUG] Markdown-Text empfangen (größerer Ausschnitt):\n', markdownText.slice(0, 200).replace(/\n/g,'⏎'));
      } catch (err) {
        console.error('[ERROR] Kann Markdown nicht laden:', err);
        placeholder.innerHTML = `<p style="color:red;">Fehler beim Laden von ${mdUrl}: ${err.message}</p>`;
        Reveal.slide(/* Index von placeholder? */);
        return;
      }

      // 3) Markdown in Blöcke splitten (Trennlinie: alleinige ‚---‘-Zeile)
      const chunks = markdownText.split(/^[ \t]*---[ \t]*$/m);
      console.log('[DEBUG] Markdown in', chunks.length, 'Blöcke gesplittet');

      // 4) Parent-Container (.reveal .slides) ermitteln
      const slidesContainer = placeholder.parentNode;  // sollte <div class="slides"> sein
      if (!slidesContainer || !slidesContainer.classList.contains('slides')) {
        console.error('[ERROR] Konnte .slides-Container nicht finden');
        return;
      }

      // 5) Für jeden Markdown-Block ein neues <section> erzeugen
      const newSections = [];
      for (let i = 0; i < chunks.length; i++) {
        const mdPart = chunks[i].trim();
        if (mdPart === '') {
          // Leere Blöcke überspringen
          continue;
        }
        // Mit dem internen Parser in HTML umwandeln
        const html = markdownPlugin.marked(mdPart);

        // Neue Section bauen und den HTML-String setzen
        const section = document.createElement('section');
        section.innerHTML = html;
        newSections.push(section);
        console.log(`[DEBUG] Neuer Block ${i} gerendert (erste 100 Zeichen):`, html.slice(0, 100).replace(/</g, '«').replace(/>/g, '»'));
      }

      // 6) Placeholder-Section durch die neuen Sections ersetzen
      //    6a) Den Index der placeholder-Section innerhalb von slidesContainer ermitteln
      const allSlides = Array.from(slidesContainer.children);
      const idx = allSlides.indexOf(placeholder);
      if (idx < 0) {
        console.error('[ERROR] placeholder-Index konnte nicht ermittelt werden');
        return;
      }

      // 6b) placeholder aus dem DOM entfernen
      slidesContainer.removeChild(placeholder);

      // 6c) Neue Sections an genau dieser Stelle einfügen (in derselben Reihenfolge)
      for (let j = 0; j < newSections.length; j++) {
        // slidesContainer.childNodes[idx + j] ist der Node, vor dem man einfügt
        // wenn idx+j größer ist als Anzahl, hängt appendChild hinten an
        const beforeNode = slidesContainer.childNodes[idx + j];
        if (beforeNode) {
          slidesContainer.insertBefore(newSections[j], beforeNode);
        } else {
          slidesContainer.appendChild(newSections[j]);
        }
      }
      console.log('[DEBUG] placeholder durch', newSections.length, 'Sections ersetzt');

      // 7) Reveal neu layouten, damit alles sichtbar und navigierbar wird
      Reveal.layout();
      console.log('[DEBUG] Reveal.layout() aufgerufen');

      // 8) Auf die erste jener neu erzeugten Slides springen
      //    Wenn placeholder vorher an Index 2 war, ist die erste neue Slide nun ebenfalls Index 2
      Reveal.slide(idx);
      console.log('[DEBUG] Zu Slide', idx, 'gesprungen');
    });
  });
});
