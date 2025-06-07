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
      // …Fehler-Folie einfügen (wie gehabt)…
      const errorSection = document.createElement('section');
      errorSection.classList.add('dynamic');
      errorSection.innerHTML = `<p style="color:red;">Fehler beim Laden von <code>${mdUrl}</code>: ${err.message}</p>`;
      allSlidesContainer.insertBefore(errorSection, allSlidesContainer.children[2] || null);
      Reveal.layout();
      Reveal.slide(2);
      return;
    }

    // 3) Markdown in Blöcke splitten **mit** optionaler ID-Angabe
    //    Regex: erkennt Zeilen der Form:
    //      ---           oder
    //      --- (id="irgendwas")
    //    und fängt die ID (falls da ist) in Gruppe 1 ab
    const parts = markdownText.split(
      /^[ \t]*---(?:[ \t]*\(\s*id="([^"]+)"\s*\))?[ \t]*$/m
    );
    // parts = [ block0, id1_or_undefined, block1, id2_or_undefined, block2, id3, … ]

    // 4) Für jeden Block (parts[i]) eine neue <section class="dynamic"> bauen,
    //    und falls parts[i+1] definiert, diese ID setzen.
    const newSections = [];
    for (let i = 0; i < parts.length; i += 2) {
      const mdPart = parts[i].trim();
      if (!mdPart) continue;

      // Die (optionale) ID, die unmittelbar hinter dem Trenner stand:
      const forcedId = parts[i + 1]; // z.B. "pixel-chart-slide" oder undefined

      // Markdown-Teil in HTML umwandeln
      const html = Reveal.getPlugin('markdown').marked(mdPart);

      // Neue Section anlegen, ID setzen, Inhalt einfügen
      const section = document.createElement('section');
      section.classList.add('dynamic');
      if (forcedId) {
        section.id = forcedId;
      }
      section.innerHTML = html;
      newSections.push(section);
      console.log(
        `[DEBUG] Block ${i / 2} gerendert` +
        (forcedId ? ` (id="${forcedId}")` : "")
      );
    }

    // 5) Die neuen Sections ab Index 2 in .reveal .slides einfügen
    for (let j = 0; j < newSections.length; j++) {
      const insertBeforeNode = allSlidesContainer.children[2 + j];
      if (insertBeforeNode) {
        allSlidesContainer.insertBefore(newSections[j], insertBeforeNode);
      } else {
        allSlidesContainer.appendChild(newSections[j]);
      }
    }
    console.log('[DEBUG] Neue dynamische Slides eingefügt:', newSections.length);

    // 6) Reveal neu layouten
    Reveal.layout();

    const mermaidPlugin = Reveal.getPlugin("mermaid");
    console.log("Mermaid-Plugin-Objekt:", mermaidPlugin);
    console.log("Plugin-Methoden:", Object.keys(mermaidPlugin));

    // Da nur “init” existiert, rufe es mit dem Reveal-Objekt auf:
    if (mermaidPlugin && typeof mermaidPlugin.init === "function") {
      console.log(">>> Aufruf: mermaidPlugin.init(Reveal)");
      mermaidPlugin.init(Reveal);
    } else {
      console.warn(
        "Mermaid-Plugin hat keine init()-Methode oder getPlugin('mermaid') war undefined"
      );
    }

    // 7) Alle <script>-Tags innerhalb der neuen Sections „manuell“ ausführen
    newSections.forEach(section => {
      section.querySelectorAll('script').forEach(oldScript => {
        const newScript = document.createElement('script');
        if (oldScript.src) {
          newScript.src = oldScript.src;
        } else {
          newScript.textContent = oldScript.innerHTML;
        }
        document.body.appendChild(newScript);
      });
    });

    // 8) KaTeX-Math nachrendern
    renderMathInDynamicSlides(newSections);

    // 9) direkt zur ersten dynamischen Folie (Index 2)
    Reveal.slide(2);
  });
});

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
