/**
 * Custom Markdown loader for Reveal.js that supports dynamic slides,
 * YAML headers, special bullet styles, grid layouts, and more.
 * Style: Modern ES6+, following Airbnb/Google JS best practices.
 */

const initialHashFromNavigation = (() => {
  try {
    if (typeof performance !== 'undefined' && typeof performance.getEntriesByType === 'function') {
      const [entry] = performance.getEntriesByType('navigation');
      if (entry && entry.name) {
        const hashIndex = entry.name.indexOf('#');
        if (hashIndex !== -1) return entry.name.slice(hashIndex);
      }
    }
  } catch (err) {
    // ignore
  }
  return window.location.hash || '';
})();
let pendingInitialHash = initialHashFromNavigation;

(() => {
  const mdPlugin = Reveal.getPlugin('markdown');
  const marked = mdPlugin.marked;

  // --- 1. Custom Markdown block extension
  const customBlock = {
    name: 'customBlock',
    level: 'block',

    start(src) {
      return src.match(/^::\w+\([^)]*\)\{/)?.index;
    },

    tokenizer(src) {
      const match = /^::(\w+)\(([^)]*)\)\{/.exec(src);
      if (!match) return;

      const [rawStart, tag, className] = match;
      let idx = rawStart.length;
      let depth = 1;

      while (idx < src.length && depth > 0) {
        if (src[idx] === '{') depth += 1;
        else if (src[idx] === '}') depth -= 1;
        idx += 1;
      }

      return {
        type: 'customBlock',
        raw: src.slice(0, idx),
        tag,
        class: className,
        text: src.slice(rawStart.length, idx - 1).trim(),
      };
    },

    renderer(token) {
      const innerHtml = token.tag === 'p'
        ? marked.parseInline(token.text)
        : marked.parse(token.text);

      return `<${token.tag} class="${token.class}">${innerHtml}</${token.tag}>`;
    },
  };

  marked.use({ extensions: [customBlock] });
})();

/**
 * Loads a Markdown file and injects its content as Reveal.js slides.
 * @param {string} mdUrl - URL to the markdown file
 */
window.loadMarkdownAsSlides = async function loadMarkdownAsSlides(mdUrl, options = {}) {
  const {
    targetHash = '',
    resetToFirstSlide = false,
  } = options;
  const slidesContainer = document.querySelector('.reveal .slides');
  slidesContainer.querySelectorAll('section.dynamic').forEach(sec => sec.remove());

  let markdownText = '';
  try {
    const response = await fetch(mdUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    markdownText = await response.text();
  } catch (err) {
    insertErrorSlide(slidesContainer, mdUrl, err);
    Reveal.layout();
    Reveal.slide(2);
    return;
  }

  const headerData = extractYamlHeader(markdownText);
  const markdownBody = stripYamlFrontmatter(markdownText);
  const slideParts = splitMarkdownSlidesSafely(markdownBody);

  // --- Build slides
  const newSections = [];

  // (A) Optional: Intro slide based on YAML
  if (headerData.title || headerData.author) {
    newSections.push(createIntroSection(headerData));
  }

  // (B) Main slides
  for (let part of slideParts.map(p => p.trim()).filter(Boolean)) {
    let attrText = '';
    let mdPart = part;

    // Slide attribute comment (optional)
    const attrMatch = mdPart.match(/^<!--\s*\.slide:\s*([^>]*)-->\s*\n?/);
    if (attrMatch) {
      attrText = attrMatch[1].trim();
      mdPart = mdPart.replace(/^<!--\s*\.slide:\s*([^>]*)-->\s*\n?/, '');
    }

    // Preprocessors: bullets, grids
    mdPart = preprocessListMarkers(mdPart);
    mdPart = transformLayoutBlocks(mdPart);

    // Markdown to HTML
    const html = Reveal.getPlugin('markdown').marked(mdPart);

    // Section creation
    const section = document.createElement('section');
    section.classList.add('dynamic');
    section.innerHTML = html;
    section.appendChild(createTaskbar(headerData));

    // Add slide attributes
    if (attrText) {
      for (const [k, v] of parseHtmlAttributes(attrText)) {
        section.setAttribute(k, v);
      }
    }

    newSections.push(section);
  }

  // (C) Insert slides
  newSections.forEach((sec, idx) => {
    const before = slidesContainer.children[2 + idx];
    before ? slidesContainer.insertBefore(sec, before) : slidesContainer.appendChild(sec);
  });

  if (typeof Reveal.sync === 'function') {
    Reveal.sync();
  }
  Reveal.layout();

  // Syntax highlighting
  highlightSlides(newSections);

  // Reload scripts in new slides
  reloadScriptsInSlides(newSections);

  // Math rendering
  renderMathInDynamicSlides(newSections);

  const nav = () => {
    let navigated = false;
    const hashToUse = targetHash || window.location.hash;
    if (!resetToFirstSlide && hashToUse) {
      navigated = navigateToHash(hashToUse);
    }
    if (!navigated) {
      Reveal.slide(2);
    }
  };

  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(nav);
  } else {
    setTimeout(nav, 0);
  }
};

/**
 * Helper to parse YAML from Markdown frontmatter.
 * @param {string} mdText
 * @returns {Object} header key-value pairs
 */
function extractYamlHeader(mdText) {
  const match = mdText.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return {};
  const yaml = Object.create(null);
  for (const line of match[1].split(/\r?\n/)) {
    const [key, ...rest] = line.split(/:\s+/);
    if (key && rest.length) yaml[key.trim()] = rest.join(': ').replace(/^"|"$/g, '').trim();
  }
  return yaml;
}

/**
 * Removes YAML frontmatter from a Markdown string.
 * @param {string} md
 * @returns {string}
 */
function stripYamlFrontmatter(md) {
  return md.replace(/^---\s*[\r\n]+[\s\S]*?[\r\n]+---[\r\n]+/, '');
}

/**
 * Splits Markdown into slides using --- as delimiter,
 * ignoring those inside code blocks.
 * @param {string} mdText
 * @returns {string[]}
 */
function splitMarkdownSlidesSafely(mdText) {
  const lines = mdText.split(/\r?\n/);
  const parts = [];
  let buffer = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^```/.test(trimmed)) inCodeBlock = !inCodeBlock;

    if (!inCodeBlock && /^---\s*$/.test(trimmed)) {
      parts.push(buffer.join('\n'));
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  if (buffer.length > 0) parts.push(buffer.join('\n'));
  return parts;
}

/**
 * Transforms custom bullet list markers into styled <ul> lists.
 * Supported: -?, ->, -!, -:, -@, -home, -<, -=
 * @param {string} mdText
 * @returns {string}
 */
function preprocessListMarkers(mdText) {
  const lines = mdText.split('\n');
  const result = [];
  let buffer = [];
  let currentType = null;
  const { marked } = Reveal.getPlugin('markdown');

  const classMap = {
    '?': 'q-list',
    '>': 'arrow-list',
    '!': 'exclam-list',
    ':': 'tag-list',
    '@': 'at-list',
    home: 'home-list', // no quotes needed for 'home'
    '<': 'idea-list',
    '=': 'bullseye-list',
  };

  function flushBuffer() {
    if (buffer.length === 0) return;
    const cls = classMap[currentType] || '';
    const ulHtml = `<ul class="${cls}">\n${buffer.map(item => {
      const html = marked.parseInline(item.trim());
      return `<li>${html}</li>`;
    }).join('\n')}\n</ul>`;
    result.push(ulHtml);
    buffer = [];
  }

  for (const line of lines) {
    // Match either a single character or the word 'home' after the dash
    const match = line.match(/^-([?!>:@<=]|home)\s+(.*)/);
    if (match) {
      const [, type, content] = match;
      if (type !== currentType) flushBuffer();
      currentType = type;
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

/**
 * Transforms custom HTML grid layout blocks in Markdown.
 * @param {string} mdText
 * @returns {string}
 */
function transformLayoutBlocks(mdText) {
  return mdText.replace(
    /<!--\s*layout\s*=\s*{([^}]*)}\s*-->([\s\S]*?)<!--\s*\/layout\s*-->/g,
    (match, layoutRaw, innerContent) => {
      const layout = Object.fromEntries(
        layoutRaw.split(',').map(kv => kv.split(':').map(s => s.trim()))
      );
      const rows = layout.rows || 1;
      const columns = layout.columns || 1;
      const blocks = [];
      const positionRegex = /<!--\s*position\s*=\s*{([^}]*)}\s*-->([\s\S]*?)<!--\s*\/position\s*-->/g;
      let m;
      while ((m = positionRegex.exec(innerContent)) !== null) {
        const pos = Object.fromEntries(
          m[1].split(',').map(kv => kv.split(':').map(s => s.trim()))
        );
        const row = pos.row || 1;
        const column = pos.column || 1;
        const rawContent = m[2].trim();
        const content = Reveal.getPlugin('markdown').marked(rawContent);
        blocks.push(`<div style="grid-row: ${row}; grid-column: ${column};">\n${content}\n</div>`);
      }
      return `<div class="custom-grid" style="display: grid; grid-template-columns: repeat(${columns}, 1fr); grid-template-rows: repeat(${rows}, auto); gap: 2em;">\n${blocks.join('\n')}\n</div>`;
    }
  );
}

/**
 * Parses attribute string in .slide comments into key/value pairs.
 * @param {string} attrText
 * @returns {Array<[string, string]>}
 */
function parseHtmlAttributes(attrText) {
  const attrRegex = /([\w-]+)(?:="([^"]*)")?/g;
  const attrs = [];
  let match;
  while ((match = attrRegex.exec(attrText))) {
    attrs.push([match[1], match[2] !== undefined ? match[2] : '']);
  }
  return attrs;
}

/**
 * Creates an introductory section based on header data.
 * @param {{title?: string, author?: string}} headerData
 * @returns {HTMLElement}
 */
function createIntroSection(headerData) {
  const section = document.createElement('section');
  section.classList.add('dynamic');
  section.innerHTML = `
    <div class="intro-slide" style="text-align: center;">
      ${headerData.title ? `<h1 style="margin-bottom: 0.3em;">${headerData.title}</h1>` : ''}
      ${headerData.author ? `<p style="font-size: 0.8em; opacity: 0.7;">by ${headerData.author}</p>` : ''}
    </div>
  `;
  return section;
}

/**
 * Creates the bottom taskbar (info strip) for each slide.
 * @param {{title?: string, author?: string}} headerData
 * @returns {HTMLElement}
 */
function createTaskbar(headerData) {
  const taskbar = document.createElement('div');
  taskbar.classList.add('taskbar');
  const left = document.createElement('div');
  left.classList.add('taskbar__left');
  left.style.flex = '0';
  left.style.paddingLeft = '12px';
  left.style.fontSize = '0.5em';
  const title = headerData.title || '';
  const author = headerData.author || '';
  left.textContent = author ? `${title} by ${author}` : title;
  taskbar.appendChild(left);

  const center = document.createElement('div');
  center.classList.add('taskbar__center');
  center.style.position = 'absolute';
  center.style.left = '50%';
  center.style.top = '50%';
  center.style.transform = 'translate(-50%, -50%)';
  center.style.display = 'flex';
  center.style.justifyContent = 'center';
  center.style.alignItems = 'center';
  center.style.fontSize = '0.5em';
  center.style.pointerEvents = 'none';

  const slideNumber = document.createElement('div');
  slideNumber.classList.add('taskbar__slide-number');
  slideNumber.style.pointerEvents = 'auto';
  center.appendChild(slideNumber);
  taskbar.appendChild(center);

  const right = document.createElement('div');
  right.classList.add('taskbar__right');
  right.style.display = 'flex';
  right.style.alignItems = 'center';
  right.style.marginLeft = 'auto';
  right.style.gap = '12px';
  right.style.paddingRight = '12px';
  taskbar.appendChild(right);
  return taskbar;
}

/**
 * Adds an error slide if Markdown fails to load.
 * @param {Element} container
 * @param {string} mdUrl
 * @param {Error} err
 */
function insertErrorSlide(container, mdUrl, err) {
  const errSec = document.createElement('section');
  errSec.classList.add('dynamic');
  errSec.innerHTML = `<p style="color:red;">
    Error loading <code>${mdUrl}</code>: ${err.message}
  </p>`;
  container.insertBefore(errSec, container.children[2] || null);
}

/**
 * Renders math in all provided slide sections using KaTeX (or fallback).
 * @param {HTMLElement[]} sections
 */
function renderMathInDynamicSlides(sections) {
  const katexPlugin = Reveal.getPlugin('katex');
  if (katexPlugin && typeof katexPlugin.renderSlides === 'function') {
    katexPlugin.renderSlides();
    return;
  }
  if (katexPlugin && typeof katexPlugin.renderSlide === 'function') {
    sections.forEach(slide => katexPlugin.renderSlide(slide));
    return;
  }
  if (window.renderMathInElement) {
    sections.forEach(slide => {
      window.renderMathInElement(slide, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn('[WARN] No function found for math rendering');
  }
}

/**
 * Runs syntax highlighting on all <pre><code> blocks in slides.
 * @param {HTMLElement[]} sections
 */
function highlightSlides(sections) {
  const highlightPlugin = Reveal.getPlugin('highlight');
  if (highlightPlugin && typeof highlightPlugin.highlightBlock === 'function') {
    sections.forEach(section =>
      section.querySelectorAll('pre code').forEach(block => {
        highlightPlugin.highlightBlock(block);
      })
    );
  }
}

/**
 * Reloads scripts in dynamically created slides.
 * @param {HTMLElement[]} sections
 */
function reloadScriptsInSlides(sections) {
  sections.forEach(section =>
    section.querySelectorAll('script').forEach(oldScript => {
      const script = document.createElement('script');
      if (oldScript.src) script.src = oldScript.src;
      else script.textContent = oldScript.innerHTML;
      document.body.appendChild(script);
    })
  );
}

/**
 * Attempts to navigate the deck to the position encoded in the hash.
 * Supports Reveal's numeric indexes as well as element id anchors.
 * @param {string} hashValue
 * @returns {boolean} true if navigation was performed
 */
function navigateToHash(hashValue) {
  if (!hashValue) return false;

  let normalized = hashValue.startsWith('#') ? hashValue.slice(1) : hashValue;
  if (normalized.startsWith('/')) normalized = normalized.slice(1);
  if (!normalized) return false;

  const segments = normalized.split('/').filter(Boolean);
  if (segments.length === 0) return false;

  const numeric = segments.every(part => /^\d+$/.test(part));
  if (numeric) {
    const numbers = segments.map(part => Number(part));
    if (numbers.length === 1) {
      Reveal.slide(numbers[0]);
    } else if (numbers.length === 2) {
      Reveal.slide(numbers[0], numbers[1]);
    } else {
      Reveal.slide(numbers[0], numbers[1], numbers[2]);
    }
    return true;
  }

  const [idSegment, ...rest] = segments;
  let anchorTarget = document.getElementById(idSegment);
  if (!anchorTarget) {
    anchorTarget = document.querySelector(`.reveal .slides section[data-id="${idSegment}"]`);
  }
  if (!anchorTarget) {
    anchorTarget = document.querySelector(`.reveal .slides section[id="${idSegment}"]`);
  }
  if (!anchorTarget) return false;

  const slide = anchorTarget.closest('section');
  const indices = getSlideIndices(slide);
  if (!indices) return false;

  const fragment = anchorTarget.closest('.fragment');
  if (fragment && fragment.hasAttribute('data-fragment-index')) {
    const fragmentIndex = Number(fragment.getAttribute('data-fragment-index'));
    Reveal.slide(
      indices.h,
      typeof indices.v === 'number' ? indices.v : undefined,
      Number.isNaN(fragmentIndex) ? undefined : fragmentIndex
    );
    return true;
  }

  if (rest.length && rest[rest.length - 1] && /^\d+$/.test(rest[rest.length - 1])) {
    const fragmentIndex = Number(rest[rest.length - 1]);
    Reveal.slide(
      indices.h,
      typeof indices.v === 'number' ? indices.v : undefined,
      fragmentIndex
    );
    return true;
  }

  if (typeof indices.v === 'number') {
    Reveal.slide(indices.h, indices.v);
  } else {
    Reveal.slide(indices.h);
  }
  return true;
}

/**
 * Derive slide indices for a given section, even if Reveal.getIndices is unavailable.
 * @param {HTMLElement|null} slide
 * @returns {{h:number,v?:number}|null}
 */
function getSlideIndices(slide) {
  if (!slide) return null;
  if (typeof Reveal.getIndices === 'function') {
    return Reveal.getIndices(slide);
  }

  const horizontalSlides = Array.from(document.querySelectorAll('.reveal .slides > section'));
  const root = slide.closest('.reveal .slides > section');
  if (!root) return null;
  const h = horizontalSlides.indexOf(root);
  if (h === -1) return null;

  if (root === slide) return { h, v: 0 };

  const verticalSlides = Array.from(root.querySelectorAll('section'));
  const v = verticalSlides.indexOf(slide);
  return { h, v: v === -1 ? 0 : v };
}

/**
 * Reads the ?file=... parameter from the current location.
 * @param {string} search
 * @returns {string}
 */
function getMarkdownFileFromUrl(search = window.location.search) {
  try {
    const params = new URLSearchParams(search);
    const fileParam = params.get('file');
    return fileParam ? fileParam.trim() : '';
  } catch (err) {
    return '';
  }
}

let initialUrlHandled = false;

function maybeLoadMarkdownFromUrl() {
  if (initialUrlHandled) return;
  const mdUrl = getMarkdownFileFromUrl();
  if (!mdUrl) return;
  initialUrlHandled = true;
  const hashToRestore = pendingInitialHash || window.location.hash;
  loadMarkdownAsSlides(mdUrl, { targetHash: hashToRestore });
  pendingInitialHash = '';
}

if (typeof Reveal !== 'undefined' && Reveal) {
  const triggerInitialLoad = () => {
    maybeLoadMarkdownFromUrl();
  };

  if (typeof Reveal.isReady === 'function' && Reveal.isReady()) {
    triggerInitialLoad();
  } else if (typeof Reveal.on === 'function') {
    Reveal.on('ready', triggerInitialLoad);
  } else {
    window.addEventListener('load', triggerInitialLoad, { once: true });
  }
} else {
  window.addEventListener('load', maybeLoadMarkdownFromUrl, { once: true });
}

window.addEventListener('popstate', () => {
  const mdUrl = getMarkdownFileFromUrl();
  if (mdUrl) {
    loadMarkdownAsSlides(mdUrl, { targetHash: window.location.hash });
    return;
  }
  const slidesContainer = document.querySelector('.reveal .slides');
  if (!slidesContainer) return;
  slidesContainer.querySelectorAll('section.dynamic').forEach(sec => sec.remove());
  if (typeof Reveal.sync === 'function') {
    Reveal.sync();
  }
  if (typeof Reveal.layout === 'function') {
    Reveal.layout();
  }
  if (typeof Reveal.slide === 'function') {
    Reveal.slide(1);
  }
});
