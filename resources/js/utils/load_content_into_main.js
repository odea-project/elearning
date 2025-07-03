(function() {
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

      const tag       = cap[1];
      const className = cap[2];
      let   idx       = cap[0].length;
      let   depth     = 1;

      while (idx < src.length && depth > 0) {
        if      (src[idx] === '{') depth++;
        else if (src[idx] === '}') depth--;
        idx++;
      }

      const raw  = src.slice(0, idx);
      const body = src.slice(cap[0].length, idx - 1).trim();

      return {
        type:  'customBlock',
        raw,
        tag,
        class: className,
        text:  body
      };
    },

    renderer(token) {
      let innerHtml;
      if (token.tag === 'p') {
        innerHtml = marked.parseInline(token.text);
      } else {
        innerHtml = marked.parse(token.text);
      }
      return `<${token.tag} class="${token.class}">${innerHtml}</${token.tag}>`;
    }
  };

  marked.use({ extensions: [ customBlock ] });
})();


window.loadMarkdownAsSlides = async function(mdUrl) {
  // (1) Remove old dynamic slides
  const allSlides = document.querySelector('.reveal .slides');
  allSlides.querySelectorAll('section.dynamic').forEach(s => s.remove());

  // (2) Load markdown
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

  const headerData = extractYamlHeader(markdownText);

  // (3) Strip YAML frontmatter if present
  function stripYamlFrontmatter(md) {
    return md.replace(/^---\s*[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/, '');
  }

  // (4) Split markdown into slides, ignoring '---' inside code blocks
  function splitMarkdownSlidesSafely(mdText) {
    const lines = mdText.split(/\r?\n/);
    const parts = [];
    let buffer = [];
    let inCodeBlock = false;

    for (let line of lines) {
      const trimmed = line.trim();

      // Toggle code block state on ``` lines
      if (/^```/.test(trimmed)) {
        inCodeBlock = !inCodeBlock;
      }

      // Only split if we're not inside a code block
      if (!inCodeBlock && /^---\s*$/.test(trimmed)) {
        parts.push(buffer.join('\n'));
        buffer = [];
      } else {
        buffer.push(line);
      }
    }

    if (buffer.length > 0) {
      parts.push(buffer.join('\n'));
    }

    return parts;
  }

  // (5) Custom bullet list transformer (-?, ->, -!)
  function preprocessListMarkers(mdText) {
    const lines = mdText.split('\n');
    const result = [];
    let currentType = null;
    let buffer = [];

    const marked = Reveal.getPlugin('markdown').marked;

    function flushBuffer() {
      if (buffer.length > 0) {
        const classMap = {
          '?': 'q-list',
          '>': 'arrow-list',
          '!': 'exclam-list',
          ':': 'tag-list',
        };
        const cls = classMap[currentType] || '';
        const ul = `<ul class="${cls}">\n` +
          buffer.map(item => {
            const html = marked(item.trim());
            const liContent = html.replace(/^<p>(.*?)<\/p>\s*$/s, '$1');
            return `<li>${liContent}</li>`;
          }).join('\n') +
          `\n</ul>`;
        result.push(ul);
        buffer = [];
      }
    }

    for (let line of lines) {
      const match = line.match(/^-([?!>:])\s+(.*)/);
      if (match) {
        const type = match[1];
        const content = match[2];
        if (type !== currentType) {
          flushBuffer();
          currentType = type;
        }
        buffer.push(content);
      } else {
        flushBuffer();
        result.push(line);
        currentType = null;
      }
    }

    flushBuffer();
    return result.join('\n');
  }

  // (6) Grid layout transformer
  function transformLayoutBlocks(mdText) {
    return mdText.replace(
      /<!--\s*layout\s*=\s*{([^}]*)}\s*-->([\s\S]*?)<!--\s*\/layout\s*-->/g,
      (match, layoutRaw, innerContent) => {
        const layout = Object.fromEntries(layoutRaw.split(',')
          .map(kv => kv.split(':').map(s => s.trim())));
        const rows = layout.rows || 1;
        const columns = layout.columns || 1;

        const blocks = [];
        const positionRegex = /<!--\s*position\s*=\s*{([^}]*)}\s*-->([\s\S]*?)<!--\s*\/position\s*-->/g;
        let m;
        while ((m = positionRegex.exec(innerContent)) !== null) {
          const pos = Object.fromEntries(m[1].split(',').map(kv => kv.split(':').map(s => s.trim())));
          const row = pos.row || 1;
          const column = pos.column || 1;
          const rawContent = m[2].trim();
          const content = Reveal.getPlugin('markdown').marked(rawContent);
          blocks.push(`<div style="grid-row: ${row}; grid-column: ${column};">\n${content}\n</div>`);
        }

        return `<div class="custom-grid" style="display: grid; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, auto); gap: 2em;">\n${blocks.join("\n")}\n</div>`;
      }
    );
  }

  const markdownTextNoYaml = stripYamlFrontmatter(markdownText);
  const parts = splitMarkdownSlidesSafely(markdownTextNoYaml);

  // (7) Parse slides and create <section> elements
  const newSecs = [];

  // === Neue Einleitungsfolie auf Basis von YAML-Header ===
  if (headerData.title || headerData.author) {
    const introSection = document.createElement('section');
    introSection.classList.add('dynamic');

    const titleHtml = headerData.title
      ? `<h1 style="margin-bottom: 0.3em;">${headerData.title}</h1>` : '';
    const authorHtml = headerData.author
      ? `<p style="font-size: 0.8em; opacity: 0.7;">by ${headerData.author}</p>` : '';

    introSection.innerHTML = `
      <div class="intro-slide" style="text-align: center;">
        ${titleHtml}
        ${authorHtml}
      </div>
    `;

    newSecs.unshift(introSection);
  }

  for (let part of parts) {
    part = part.trim();
    if (!part) continue;

    // (A) Optional slide attribute comment
    let attrText = "";
    let mdPart = part;

    const attrCommentMatch = part.match(/^<!--\s*\.slide:\s*([^>]*)-->\s*\n?/);
    if (attrCommentMatch) {
      attrText = attrCommentMatch[1].trim();
      mdPart = part.replace(/^<!--\s*\.slide:\s*([^>]*)-->\s*\n?/, '');
    }

    // (B) Apply custom preprocessing
    mdPart = preprocessListMarkers(mdPart);
    mdPart = transformLayoutBlocks(mdPart);

    // (C) Convert to HTML
    const html = Reveal.getPlugin('markdown').marked(mdPart);
    const section = document.createElement('section');
    section.classList.add('dynamic');

    // Add a taskbar div to each slide
    const taskbarDiv = document.createElement('div');
    taskbarDiv.classList.add('taskbar');

    // Left: title by author
    const leftDiv = document.createElement('div');
    leftDiv.style.flex = "0";
    leftDiv.style.paddingLeft = "12px";
    leftDiv.style.fontSize = "0.5em";
    leftDiv.textContent = `${headerData.title || ''} by ${headerData.author || ''}`;

    // Right: dynamic slide number
    // const rightDiv = document.createElement('div');
    // rightDiv.style.flex = "0";
    // rightDiv.style.paddingRight = "12px";
    // rightDiv.style.fontSize = "0.5em";
    // rightDiv.classList.add('slide-number-holder');
    // rightDiv.textContent = `here will be slide number`;

    taskbarDiv.appendChild(leftDiv);
    // taskbarDiv.appendChild(rightDiv);
    

    // (D) Set attributes
    if (attrText) {
      const attrRegex = /([\w-]+)(?:="([^"]*)")?/g;
      let match;
      while ((match = attrRegex.exec(attrText))) {
        const key = match[1];
        const val = match[2] !== undefined ? match[2] : "";
        section.setAttribute(key, val);
      }
    }

    section.innerHTML = html;
    section.appendChild(taskbarDiv);
    newSecs.push(section);
  }

  // (8) Insert new slides
  newSecs.forEach((sec, idx) => {
    const before = allSlides.children[2 + idx];
    before ? allSlides.insertBefore(sec, before)
           : allSlides.appendChild(sec);
  });

  Reveal.layout();
  const highlightPlugin = Reveal.getPlugin('highlight');
  if (highlightPlugin && typeof highlightPlugin.highlightBlock === 'function') {
    newSecs.forEach(sec =>
      sec.querySelectorAll('pre code').forEach(block => {
        highlightPlugin.highlightBlock(block);
      })
    );
  }

  // (9) Reload scripts
  newSecs.forEach(sec =>
    sec.querySelectorAll('script').forEach(old => {
      const ns = document.createElement('script');
      old.src ? ns.src = old.src : ns.textContent = old.innerHTML;
      document.body.appendChild(ns);
    })
  );

  // (10) Render math
  renderMathInDynamicSlides(newSecs);

  // (11) Show the first new slide
  Reveal.slide(2);
};



// ====== 2) Math-Rendering für dynamische Slides ======
function renderMathInDynamicSlides(sections) {
  const katexPlugin = Reveal.getPlugin('katex');
  if (katexPlugin && typeof katexPlugin.renderSlides === 'function') {
    console.log('[DEBUG] KaTeX-Plugin.renderSlides() aufrufen');
    katexPlugin.renderSlides();
    return;
  }
  if (katexPlugin && typeof katexPlugin.renderSlide === 'function') {
    console.log('[DEBUG] KaTeX-Plugin.renderSlide() aufrufen');
    sections.forEach(slide => katexPlugin.renderSlide(slide));
    return;
  }
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

// extract yaml
function extractYamlHeader(mdText) {
  const match = mdText.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return {};
  const yamlText = match[1];
  const lines = yamlText.split(/\r?\n/);
  const data = {};
  for (const line of lines) {
    const [key, value] = line.split(/:\s+/);
    if (key && value) data[key.trim()] = value.replace(/^"|"$/g, '').trim();
  }
  return data;
}