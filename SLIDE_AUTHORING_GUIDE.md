# Slide Authoring Guide

This guide explains how to author new Reveal.js slide decks for the eLearning site. It draws on `topics/MeanValue.md`, `topics/Quantiles.md`, and `resources/js/utils/load_content_into_main.js`.

## 1. Start With the Standard Template

Create a new Markdown file in `topics/` and begin with YAML front matter followed by the first slide. The loader uses the metadata to build the intro slide and the slide footer automatically.

```markdown
---
title: "Deck Title"
author: "Your Name"
keywords: ["tag1", "tag2"]
requirements: ["prerequisite topic"]
description: "One sentence overview"
---

<!-- .slide:id="my-first-slide" -->
## Slide Title
-! Key point
-? Prompt for discussion

---
```

Front matter keys are optional, but `title` and `author` populate both the intro slide and the footer strip. Additional keys such as `keywords`, `requirements`, and `description` help with cataloguing.

## 2. Separate Slides With `---`

The loader splits the Markdown on lines that contain only `---`, unless the delimiter appears inside a fenced code block. Each part becomes one `<section>` in Reveal.js.

Place optional slide attributes in an HTML comment immediately above the slide content:

```markdown
<!-- .slide:id="median-water-science" data-auto-animate -->
## Median in Water Science
```

Any attributes you provide (`id`, `data-background`, `data-transition`, and so on) are copied onto the generated section element.

## 3. Use Enhanced Bullet Markers

`load_content_into_main.js` turns special list markers into styled `<ul>` elements. Use the exact prefixes listed below; each one renders with a dedicated CSS class.

- `-!` renders as `.exclam-list` for callouts
- `-?` renders as `.q-list` for questions or prompts
- `->` renders as `.arrow-list` for process steps
- `-:` renders as `.tag-list` for labelled details
- `-@` renders as `.at-list`
- `-home` renders as `.home-list`
- `-<` renders as `.idea-list`
- `-=` renders as `.bullseye-list`

Mixing marker types closes the current list and starts a new one. Standard `-` bullets remain unstyled.

## 4. Build Responsive Grids With Layout Blocks

Wrap multi-column layouts in paired `<!-- layout -->` and `<!-- /layout -->` comments. Inside, place one or more `position` blocks. The loader transforms the structure into a CSS grid.

```markdown
<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
Left column content.
<!-- /position -->

<!-- position={row: 1, column: 2} -->
Right column content.
<!-- /position -->
<!-- /layout -->
```

The Markdown inside each position block is rendered normally, so headings, lists, images, and custom HTML all work.

## 5. Leverage Custom Block Tags

The loader registers a `::tag(class){ ... }` extension. It creates a real HTML element with the chosen tag and class list. Example:

```markdown
::aside(note){
Remember to cite the data source.
}
```

The inner content is parsed as Markdown, allowing bold text, lists, or inline math.

## 5a. Add Reusable Footnotes

For literature references or short source notes, use the shared ODEA footnote class instead of inline styles. Raw HTML blocks are preserved by the loader, so this works directly inside a slide.

```markdown
<div class="odea-footnote">
<strong>Reference:</strong>
<p>Author, A. (2024). <em>Journal Name</em> 12(3), 45-67.</p>
</div>
```

For multiple entries, use the list variant:

```markdown
<div class="odea-footnote">
<strong>References:</strong>
<ul class="odea-footnote-list">
  <li>a) First source.</li>
  <li>b) Second source.</li>
</ul>
</div>
```

## 6. Wire Up Custom Scripts Safely

Dynamic slides often need supporting JavaScript. Attach the script directly after the relevant content and guard the initializer so it runs once per load.

```html
<div id="my-widget"></div>
<script>
(function() {
  const init = () => {
    // widget bootstrap logic
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
</script>
```

`load_content_into_main.js` re-injects the `<script>` tag whenever the deck reloads (`reloadScriptsInSlides`). Keep logic self-contained and expose only the minimal API you need on `window`.

## 7. Use WebR Interactions

WebR support comes from `resources/js/utils/webr-loader.js`, which exposes `window.ensureWebRHelper()`. Always await this helper before calling WebR utilities.

- `helper.initInteractiveSection` powers interactive code cells. Provide `containerId`, the R code string, optional `fallback` logic for offline mode, and optionally a `slideId` for progress tracking (see `topics/MeanValue.md`).
- `helper.quickSetup` offers a lightweight wrapper when you only need a run button and output area.
- `helper.renderPlot` captures graphics output as PNG and injects it into the slide (see `topics/Quantiles.md`, `boxplot-in-r`).
- Pair long-running actions with status messages and disable buttons while WebR is busy.
- Supply a JavaScript fallback so the slide still works if WebAssembly is unavailable.

Wrap the entry point in a `DOMContentLoaded` guard just as you would for any other script, and keep all WebR-related UI wiring inside that initializer.

## 8. Add Static SVG Figures

Store reusable artwork in `resources/figures/` as standalone SVG files (`case01_replicates.svg`, `data_formats_overview.svg`, and similar). Reference them from the Markdown deck with a relative URL:

```markdown
<img src="../resources/figures/data_formats_overview.svg"
     alt="Overview of structured, semi-structured, and unstructured data"
     style="width: 70%; max-width: 520px;">
```

Guidelines:

- Prefer SVG for crisp rendering at any scale.
- Name files in lowercase with hyphens.
- Provide meaningful `alt` text for accessibility.
- Wrap figures in `<div>` containers when you need additional layout control or responsive sizing.

## 9. Build D3 Visuals With Shared Utilities

Interactive charts live under `resources/figures/` as JavaScript modules (for example, `boxplot-distributions.js`, `pesticide-quantiles-plot.js`). Each module usually exports one initializer on `window` so the slide can trigger rendering.

1. **Author the plot script**
   - Use `resources/js/utils/d3_utils.js` for the xkcd-style toolkit: `createSVG`, `createXYScales`, `createXYLineChart`, `addPlotSeries`, plus helpers for axes and grids.
   - Use `resources/js/utils/plot_utils.js` for neon arcade styling: `plotUtils.createFigure`, `plotUtils.addAxes`, `plotUtils.addLine`, `plotUtils.updateLineSeries`, `plotUtils.drawPixelBarChart`.
   - Clear the target container before drawing (`d3.select('#id').selectAll('*').remove()`), then build the SVG.
   - Expose an initializer such as `window.initBoxplotDistributions = () => { ... };` so the slide can call it.

2. **Reference the script from the slide**
   ```markdown
   <div id="boxplot-distributions-container" style="min-height: 680px;"></div>
   <script src="../resources/figures/boxplot-distributions.js"></script>
   <script>
   (function() {
     const initPlot = () => {
       if (window.d3 && window.initBoxplotDistributions) {
         window.initBoxplotDistributions();
       } else {
         setTimeout(initPlot, 100);
       }
     };
     if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', initPlot);
     } else {
       initPlot();
     }
   })();
   </script>
   ```

3. **Handle repeated loads**
   The loader removes and reinserts dynamic slides. Keep state local to your initializer so re-running it rebuilds the chart from scratch. If you register buttons or other controls (see `pesticide-quantiles-plot.js`), wire them up inside the initializer so they are ready after every reload.

## 10. Preview the Deck

1. Update `resources/misc/md-manifest.json` if the new deck should appear in navigation menus.
2. Serve the project (for example, `npm start`) or open `index.html` through a local web server.
3. Use the UI control that calls `loadMarkdownAsSlides` to load your topic. The loader fetches the Markdown, constructs the slide sections, and applies syntax highlighting, math rendering, and script reloading.

If the fetch fails (bad path, network error, or malformed front matter), an error slide is inserted near the top. Fix the issue and reload the deck.

## 11. Final Checklist

- Metadata present and spelled correctly (`title`, `author`, and optional keys).
- Every slide separated by `---` outside of code fences.
- Layout blocks well-formed (`layout` -> `position` -> `/position` -> `/layout`).
- Custom scripts wrapped in `DOMContentLoaded` guards and exported APIs kept minimal.
- WebR interactions provide loading states and fallbacks.
- SVG figures stored under `resources/figures/` with descriptive alt text.
- D3 charts expose a deterministic initializer and rely on shared helper utilities.
- Optional: add `<!-- .slide:id="..." -->` markers so CSS or JavaScript can target specific slides later.

Following this pattern keeps your decks consistent with the existing content and ensures the loader's post-processing features (intro slide, taskbar, custom bullets, grids, math, syntax highlighting, and script rehydration) continue to work automatically.
