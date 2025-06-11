// // ====== 0) Markdown-Extension für ::tag(klasse){…} mit Inline-Handling für <p> ======
// ;(function() {
//   const mdPlugin = Reveal.getPlugin('markdown');
//   const marked   = mdPlugin.marked;

//   const customBlock = {
//     name:  'customBlock',
//     level: 'block',

//     // findet jeden ::tag(klass){-Block
//     start(src) {
//       return src.match(/^::\w+\([^)]*\)\{/)?.index;
//     },

//     // tokenisiert bis zur korrespondierenden schließenden }
//     tokenizer(src) {
//       const cap = /^::(\w+)\(([^)]*)\)\{/.exec(src);
//       if (!cap) return;

//       const tag       = cap[1];                // "div" oder "p"
//       const className = cap[2];                // "leftBox" oder "mainBullet"
//       let   idx       = cap[0].length;         // Position direkt nach "{"
//       let   depth     = 1;

//       // bis zum passenden schließenden "}"
//       while (idx < src.length && depth > 0) {
//         if      (src[idx] === '{') depth++;
//         else if (src[idx] === '}') depth--;
//         idx++;
//       }

//       const raw  = src.slice(0, idx);
//       const body = src.slice(cap[0].length, idx - 1).trim();

//       return {
//         type:  'customBlock',
//         raw,
//         tag,
//         class: className,
//         text:  body
//       };
//     },

//     // rendert: für <p>_INLINE_, sonst _BLOCK_-Parsing
//     renderer(token) {
//       let innerHtml;
//       if (token.tag === 'p') {
//         // kein zusätzliches <p> drumherum
//         innerHtml = marked.parseInline(token.text);
//       } else {
//         // erlaubt Mehr-Zeilen-Markdown im Inneren
//         innerHtml = marked.parse(token.text);
//       }
//       return `<${token.tag} class="${token.class}">${innerHtml}</${token.tag}>`;
//     }
//   };

//   // Extension registrieren
//   marked.use({ extensions: [ customBlock ] });
// })();



// // ====== 1) Click-Handler wie gehabt, nur ohne expandShorthand() ======
// document.querySelectorAll('.topic-link').forEach(a => {
//   a.addEventListener('click', async e => {
//     e.preventDefault();
//     const mdUrl = a.dataset.md;

//     // (1) alte Slides weg
//     const allSlides = document.querySelector('.reveal .slides');
//     allSlides.querySelectorAll('section.dynamic').forEach(s => s.remove());

//     // (2) Markdown holen
//     let markdownText;
//     try {
//       const res = await fetch(mdUrl);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       markdownText = await res.text();
//     } catch (err) {
//       const errSec = document.createElement('section');
//       errSec.classList.add('dynamic');
//       errSec.innerHTML = `<p style="color:red;">
//         Fehler beim Laden von <code>${mdUrl}</code>: ${err.message}
//       </p>`;
//       allSlides.insertBefore(errSec, allSlides.children[2] || null);
//       Reveal.layout();
//       return Reveal.slide(2);
//     }

//     // (3) split auf --- mit optionaler id
//     const parts = markdownText.split(
//       /^[ \t]*---(?:[ \t]*\(\s*id="([^"]+)"\s*\))?[ \t]*$/m
//     );

//     // (4) Blöcke parsen — hier greift Deine customBlock-Extension
//     const newSecs = [];
//     for (let i = 0; i < parts.length; i += 2) {
//       const mdPart   = parts[i].trim();
//       const forcedId = parts[i+1];
//       if (!mdPart) continue;

//       const html = Reveal
//         .getPlugin('markdown')
//         .marked(mdPart);

//       const section = document.createElement('section');
//       section.classList.add('dynamic');
//       if (forcedId) section.id = forcedId;
//       section.innerHTML = html;
//       newSecs.push(section);
//     }

//     // (5) einfügen, (6) layout, (7) mermaid, (8) math, (9) jump
//     newSecs.forEach((sec, idx) => {
//       const before = allSlides.children[2 + idx];
//       before ? allSlides.insertBefore(sec, before)
//              : allSlides.appendChild(sec);
//     });
//     Reveal.layout();

//     // (7) mermaid, (8) math …
//     const mer = Reveal.getPlugin('mermaid');
//     if (mer?.init) mer.init(Reveal);
//     newSecs.forEach(sec =>
//       sec.querySelectorAll('script').forEach(old => {
//         const ns = document.createElement('script');
//         old.src ? ns.src = old.src : ns.textContent = old.innerHTML;
//         document.body.appendChild(ns);
//       })
//     );
//     // KaTeX…
//     renderMathInDynamicSlides(newSecs);
    
//     Reveal.slide(2);
//   });
// });

// // ---------------
// // 8) Math nachrendern
// // ---------------
// // Wenn in Euren MD-Blöcken Tex-Syntax ($…$ oder $$…$$) stand,
// // muss KaTeX das nach dem Injecten re-rendern. Wir rufen
// // hier die Reveal-KaTeX-Plugin-Funktion direkt auf.
// // Je nach Reveal-Version kann das etwas variieren; meistens
// // funktioniert so etwas wie `renderSlides()` oder `renderSlide(section)`.
// // Wir probieren zuerst getPlugin('katex').renderSlides(),
// // falls das nicht existiert, greifen wir auf die globale auto-render-Funktion zurück.

// function renderMathInDynamicSlides(sections) {
//   const katexPlugin = Reveal.getPlugin('katex');
//   if (katexPlugin && typeof katexPlugin.renderSlides === 'function') {
//     console.log('[DEBUG] KaTeX-Plugin.renderSlides() aufrufen');
//     katexPlugin.renderSlides(); // rendert Math in allen aktuellen Slides
//     return;
//   }
//   if (katexPlugin && typeof katexPlugin.renderSlide === 'function') {
//     // Falls es nur renderSlide gibt, rufen wir es für jede neue Section auf
//     console.log('[DEBUG] KaTeX-Plugin.renderSlide() aufrufen');
//     sections.forEach(slide => katexPlugin.renderSlide(slide));
//     return;
//   }
//   // Fallback: Wenn das KaTeX-Plugin kein renderSlides/renderSlide bereitstellt,
//   // verwenden wir die KaTeX auto-render-Funktion, falls sie geladen ist:
//   if (window.renderMathInElement) {
//     console.log('[DEBUG] Fallback: renderMathInElement() aufrufen');
//     sections.forEach(slide => {
//       renderMathInElement(slide, {
//         delimiters: [
//           { left: '$$', right: '$$', display: true },
//           { left: '$', right: '$', display: false }
//         ]
//       });
//     });
//   } else {
//     console.warn('[WARN] Keine Funktion gefunden, um Math zu rendern');
//   }
// }


// main.js

// ==== 0) Scale-Funktion ====
function adjustSlideScale(slide) {
  if (!slide) return;
  // zuerst versuchen, .slide-content zu skalieren, sonst die Section selbst
  const content = slide.querySelector('.slide-content') || slide;

  // zurücksetzen
  content.style.transform = '';

  // Maßstäbe berechnen
  const scaleX = window.innerWidth  / content.scrollWidth;
  const scaleY = window.innerHeight / content.scrollHeight;
  const scale  = Math.min(scaleX, scaleY, 1);

  // Anwenden
  content.style.transformOrigin = 'top left';
  content.style.transform       = `scale(${scale})`;
  console.log(window.innerWidth, window.innerHeight, content.scrollWidth, content.scrollHeight);
  console.log(scaleX, scaleY, scale);
  console.log(`[DEBUG] Slide ${slide.id || 'unknown'} skaliert auf ${scale.toFixed(2)}`);
}

// auf Ready, Slide-Change & Resize reagieren
Reveal.on('ready',        e => adjustSlideScale(e.currentSlide));
Reveal.on('slidechanged', e => adjustSlideScale(e.currentSlide));
window.addEventListener('resize', () => {
  const curr = document.querySelector('.reveal .slides section.present');
  adjustSlideScale(curr);
});

// ==== 2) MutationObserver für dynamische Slides ====
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.reveal .slides');
  if (!container) return;

  const obs = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1 && node.tagName === 'SECTION') {
          // nach Layout-Tick skalieren
          setTimeout(() => adjustSlideScale(node), 0);
        }
      }
    }
  });
  obs.observe(container, { childList: true });
});

// ==== 3) Markdown-Extension (dein customBlock) ====
;(function() {
  const mdPlugin = Reveal.getPlugin('markdown');
  const marked   = mdPlugin.marked;

  const customBlock = {
    name:  'customBlock',
    level: 'block',
    start(src) {
      return src.match(/^::\w+\([^)]*\)\{/)?.index;
    },
    tokenizer(src) {
      const cap = /^::(\w+)\(([^)]*)\)\{/.exec(src);
      if (!cap) return;
      const [full, tag, cls] = cap;
      let idx = full.length, depth = 1;
      while (idx < src.length && depth > 0) {
        if (src[idx] === '{') depth++;
        else if (src[idx] === '}') depth--;
        idx++;
      }
      return {
        type:  'customBlock',
        raw:   src.slice(0, idx),
        tag,
        class: cls,
        text:  src.slice(full.length, idx - 1).trim()
      };
    },
    renderer(token) {
      const md = token.tag === 'p'
               ? marked.parseInline(token.text)
               : marked.parse(token.text);
      return `<${token.tag} class="${token.class}">${md}</${token.tag}>`;
    }
  };

  marked.use({ extensions: [ customBlock ] });
})();

// ==== 4) Dein Loader (Click-Handler) ====
document.querySelectorAll('.topic-link').forEach(a => {
  a.addEventListener('click', async e => {
    e.preventDefault();
    const mdUrl = a.dataset.md;
    const allSlides = document.querySelector('.reveal .slides');
    // alte dynamische Slides entfernen
    allSlides.querySelectorAll('section.dynamic').forEach(s => s.remove());

    // Markdown holen
    let markdownText;
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      markdownText = await res.text();
    } catch (err) {
      const errSec = document.createElement('section');
      errSec.classList.add('dynamic');
      errSec.innerHTML = `<p style="color:red;">
        Fehler beim Laden von <code>${mdUrl}</code>: ${err.message}
      </p>`;
      allSlides.insertBefore(errSec, allSlides.children[2] || null);
      Reveal.layout();
      return Reveal.slide(2);
    }

    // Splitten auf --- (mit optionaler id)
    const parts = markdownText.split(
      /^[ \t]*---(?:[ \t]*\(\s*id="([^"]+)"\s*\))?[ \t]*$/m
    );

    // Sections bauen mit Wrapper
    const newSecs = [];
    for (let i = 0; i < parts.length; i += 2) {
      const mdPart = parts[i].trim();
      const forcedId = parts[i+1];
      if (!mdPart) continue;

      const html = Reveal.getPlugin('markdown').marked(mdPart);
      const section = document.createElement('section');
      section.classList.add('dynamic');
      if (forcedId) section.id = forcedId;

      // ! WICHTIG: Slide-Content-Wrapper
      const wrapper = document.createElement('div');
      wrapper.classList.add('slide-content');
      wrapper.innerHTML = html;
      section.appendChild(wrapper);

      newSecs.push(section);
    }

    // einfügen + layout
    newSecs.forEach((sec, idx) => {
      const before = allSlides.children[2 + idx];
      before ? allSlides.insertBefore(sec, before)
             : allSlides.appendChild(sec);
    });
    Reveal.layout();

    // Mermaid & Math nachladen
    const mer = Reveal.getPlugin('mermaid');
    if (mer?.init) mer.init(Reveal);
    newSecs.forEach(sec => {
      sec.querySelectorAll('script').forEach(old => {
        const ns = document.createElement('script');
        old.src ? ns.src = old.src : ns.textContent = old.innerHTML;
        document.body.appendChild(ns);
      });
    });
    renderMathInDynamicSlides(newSecs);

    // sofort skalieren – MutationObserver deckt Nachzügler ab
    newSecs.forEach(sec => adjustSlideScale(sec));

    // zu Folie 2 springen
    Reveal.slide(2);
  });
});

// ==== 5) KaTeX-Render-Fallback ====
function renderMathInDynamicSlides(sections) {
  const katex = Reveal.getPlugin('katex');
  if (katex?.renderSlides) {
    katex.renderSlides();
  } else if (katex?.renderSlide) {
    sections.forEach(s => katex.renderSlide(s));
  } else if (window.renderMathInElement) {
    sections.forEach(s => renderMathInElement(s, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false }
      ]
    }));
  }
}
