document.querySelectorAll('.topic-link').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const mdUrl = a.getAttribute('data-md');

    // 1) alte dynamische Slides entfernen
    const allSlidesContainer = document.querySelector('.reveal .slides');
    const oldDynamics = allSlidesContainer.querySelectorAll('section.dynamic');
    oldDynamics.forEach(s => s.remove());

    // 2) Markdown laden
    let markdownText;
    try {
      const response = await fetch(mdUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      markdownText = await response.text();
    } catch (err) {
      // …Fehler-Folie einfügen…
      return;
    }

    // 3) Markdown in Blöcke splitten
    const chunks = markdownText.split(/^[ \t]*---[ \t]*$/m);

    // 4) Für jeden Block eine neue <section class="dynamic"> aus HTML machen
    const newSections = [];
    for (let chunk of chunks) {
      const mdPart = chunk.trim();
      if (!mdPart) continue;
      const html = Reveal.getPlugin('markdown').marked(mdPart);
      const section = document.createElement('section');
      section.classList.add('dynamic');
      section.innerHTML = html;
      newSections.push(section);
    }

    // 5) Die neuen Sections ab Index 2 einfügen
    for (let i = 0; i < newSections.length; i++) {
      const insertBeforeNode = allSlidesContainer.children[2 + i];
      if (insertBeforeNode) {
        allSlidesContainer.insertBefore(newSections[i], insertBeforeNode);
      } else {
        allSlidesContainer.appendChild(newSections[i]);
      }
    }

    // 6) Reveal aktualisieren
    Reveal.layout();

    // **7) ganz wichtig**: Alle <script> innerhalb der neuen Sections „manuell“ ausführen
    newSections.forEach(section => {
      section.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        // Falls src-Attribute vorhanden sind, übernehmen wir sie, 
        // ansonsten den Inhalt aus innerHTML:
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.innerHTML;
        }
        // damit das Script tatsächlich ausgeführt wird, hängen wir
        // das neue <script> an den <body> oder in die Sektion:
        document.body.appendChild(newScript);
        // (oder: section.appendChild(newScript); klappt in der Regel auch)
        // Anschließend kann der Browser das Inline-Skript ausführen.
        // Danach kann man das temporäre newScript wieder entfernen, 
        // aber es schadet kaum, es drin zu lassen.
      });
    });

    // 8) Math-Rendering
    renderMathInDynamicSlides(newSections);

    // 9) direkt zur ersten dynamischen Folie (Index 2)
    Reveal.slide(2);
  });
});

// Reveal.on('ready', () => {
//   console.log('[DEBUG] Reveal ist ready');

//   // Direkt das Markdown-Plugin holen
//   const markdownPlugin = Reveal.getPlugin('markdown');
//   console.log('[DEBUG] Markdown-Plugin:', markdownPlugin);

//   document.querySelectorAll('.topic-link').forEach(a => {
//     a.addEventListener('click', async e => {
//       e.preventDefault();
//       const mdUrl = a.getAttribute('data-md');
//       console.log('[DEBUG] Link geklickt, data-md =', mdUrl);

//       // 1) ALTE „.dynamic“-Slides finden und löschen
//       const allSlidesContainer = document.querySelector('.reveal .slides');
//       const oldDynamics = allSlidesContainer.querySelectorAll('section.dynamic');
//       oldDynamics.forEach(s => {
//         s.parentNode.removeChild(s);
//       });
//       console.log('[DEBUG] Alte dynamischen Slides (Klasse "dynamic") gelöscht:', oldDynamics.length);

//       // 2) Markdown-Datei via fetch() laden
//       let markdownText;
//       try {
//         console.log('[DEBUG] Vor fetch(', mdUrl, ')');
//         const response = await fetch(mdUrl);
//         if (!response.ok) {
//           throw new Error(`HTTP ${response.status} – ${response.statusText}`);
//         }
//         markdownText = await response.text();
//         console.log('[DEBUG] Markdown-Text empfangen:', markdownText.slice(0, 100).replace(/\n/g, '⏎'));
//       } catch (err) {
//         console.error('[ERROR] Kann Markdown nicht laden:', err);
//         // Falls Lade-Fehler, fügen wir eine rote Fehlermeldung in einer Folie ein
//         const errorSection = document.createElement('section');
//         errorSection.classList.add('dynamic');
//         errorSection.innerHTML = `<p style="color:red;">Fehler beim Laden von <code>${mdUrl}</code>: ${err.message}</p>`;
//         // Direkt nach Menü-Folie einfügen (Index 2)
//         allSlidesContainer.insertBefore(errorSection, allSlidesContainer.children[2] || null);
//         Reveal.layout();
//         Reveal.slide(2);
//         return;
//       }

//       // 3) Markdown in Blöcke splitten („---“ allein auf einer Zeile)
//       const chunks = markdownText.split(/^[ \t]*---[ \t]*$/m);
//       console.log('[DEBUG] Markdown in', chunks.length, 'Blöcke gesplittet');

//       // 4) Für jeden Markdown-Block ein neues <section class="dynamic"> erzeugen
//       const newSections = [];
//       for (let i = 0; i < chunks.length; i++) {
//         const mdPart = chunks[i].trim();
//         if (!mdPart) continue; // leere Blöcke überspringen

//         // Mit dem internen Parser in HTML umwandeln
//         const html = markdownPlugin.marked(mdPart);

//         // Neue Section bauen und Content setzen
//         const section = document.createElement('section');
//         section.classList.add('dynamic');
//         section.innerHTML = html;
//         newSections.push(section);
//         console.log(`[DEBUG] Block ${i} gerendert (erste 80 Zeichen):`, html.slice(0, 80).replace(/</g,'«').replace(/>/g,'»'));
//       }

//       // 5) Die neuen dynamischen Sections ab Index 2 einfügen
//       //    (falls slidesContainer weniger Elemente hat, hängt appendChild hinten an)
//       const slidesContainer = allSlidesContainer;
//       for (let j = 0; j < newSections.length; j++) {
//         const insertBeforeNode = slidesContainer.children[2 + j];
//         if (insertBeforeNode) {
//           slidesContainer.insertBefore(newSections[j], insertBeforeNode);
//         } else {
//           slidesContainer.appendChild(newSections[j]);
//         }
//       }
//       console.log('[DEBUG] Neue dynamische Slides eingefügt:', newSections.length);

//       // 6) Reveal neu layouten
//       Reveal.layout();
//       console.log('[DEBUG] Reveal.layout() ausgeführt');

//       // 7) Zur ersten der neuen Slides springen (Index 2)
//       Reveal.slide(2);
//       console.log('[DEBUG] Zu dynamischer Slide Index 2 gesprungen');
      
//       // 8) KaTeX-Math nachrendern (s.u.)
//       renderMathInDynamicSlides(newSections);
//     });
//   });
// });

// ---------------
// 8) Math nachrendern
// ---------------
// Wenn in Euren MD-Blöcken Tex-Syntax ($…$ oder $$…$$) stand,
// muss KaTeX das nach dem Injecten re-rendern. Wir rufen
// hier die Reveal-KaTeX-Plugin-Funktion direkt auf.
// Je nach Reveal-Version kann das etwas variieren; meistens
// funktioniert so etwas wie `renderSlides()` oder `renderSlide(section)`.
// Wir probieren zuerst getPlugin('katex').renderSlides(),
// falls das nicht existiert, greifen wir auf die globale auto-render-Funktion zurück.

function renderMathInDynamicSlides(sections) {
  const katexPlugin = Reveal.getPlugin('katex');
  if (katexPlugin && typeof katexPlugin.renderSlides === 'function') {
    console.log('[DEBUG] KaTeX-Plugin.renderSlides() aufrufen');
    katexPlugin.renderSlides(); // rendert Math in allen aktuellen Slides
    return;
  }
  if (katexPlugin && typeof katexPlugin.renderSlide === 'function') {
    // Falls es nur renderSlide gibt, rufen wir es für jede neue Section auf
    console.log('[DEBUG] KaTeX-Plugin.renderSlide() aufrufen');
    sections.forEach(slide => katexPlugin.renderSlide(slide));
    return;
  }
  // Fallback: Wenn das KaTeX-Plugin kein renderSlides/renderSlide bereitstellt,
  // verwenden wir die KaTeX auto-render-Funktion, falls sie geladen ist:
  if (window.renderMathInElement) {
    console.log('[DEBUG] Fallback: renderMathInElement() aufrufen');
    sections.forEach(slide => {
      renderMathInElement(slide, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    });
  } else {
    console.warn('[WARN] Keine Funktion gefunden, um Math zu rendern');
  }
}
