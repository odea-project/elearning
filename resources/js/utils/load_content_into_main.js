document.querySelectorAll('.topic-link').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const mdUrl = a.getAttribute('data-md');

    // 1) Split mit ID-Erkennung:
const parts = markdownText.split(
  /^[ \t]*---(?:[ \t]*\(\s*id="([^"]+)"\s*\))?[ \t]*$/m
);

// 2) Array zum Sammeln der neuen Sections:
const newSections = [];

// 3) Wir iterieren stets in Schritten von 2:
//    - parts[i] ist der Markdown-Block,
//    - parts[i+1] ist (falls vorhanden) die ID für die folgende Section.
for (let i = 0; i < parts.length; i += 2) {
  const mdPart = parts[i].trim();
  // Falls leer: überspringen:
  if (!mdPart) {
    continue;
  }

  // Die „nächste“ ID (falls der Trenner eine ID hatte):
  // parts[i+1] ist entweder ein String wie "pixel-chart-slide"
  // oder undefined, wenn kein (id="…") hinter diesem Trenner stand.
  const forcedId = parts[i + 1];

  // 4) Markdown → HTML wandeln
  const html = markdownPlugin.marked(mdPart);

  // 5) Wrapper‐Section anlegen – mit oder ohne ID
  const section = document.createElement("section");
  section.classList.add("dynamic");
  if (forcedId) {
    section.id = forcedId;
  }
  section.innerHTML = html;
  newSections.push(section);

  console.log(
    `[DEBUG] Block Index ${(i/2)} gerendert` +
    (forcedId ? ` (id="${forcedId}")` : "")
  );
}

// 6) Die neuen Sections ab Index 2 einfügen (wie zuvor)
const slidesContainer = document.querySelector(".reveal .slides");
for (let j = 0; j < newSections.length; j++) {
  const insertBeforeNode = slidesContainer.children[2 + j];
  if (insertBeforeNode) {
    slidesContainer.insertBefore(newSections[j], insertBeforeNode);
  } else {
    slidesContainer.appendChild(newSections[j]);
  }
}
console.log("[DEBUG] Neue dynamische Slides eingefügt:", newSections.length);

// 7) Layout und Math-Rendering wie gehabt
Reveal.layout();
renderMathInDynamicSlides(newSections);
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
