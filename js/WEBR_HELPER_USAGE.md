# WebR Helper Usage Guide

The `webr-helper.js` utility dramatically reduces code duplication for WebR interactive sections.

## Quick Start

### Before (130+ lines of repetitive code):
```html
<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
  <div style="display: flex; gap: 10px;">
    <button id="toggle-code" style="...">Show Code</button>
    <button id="run-btn" style="...">Run Example</button>
  </div>
  <div id="output" style="..."></div>
</div>

<script>
(function() {
  const init = async () => {
    if (!window.EditorView || !window.EditorState || !window.basicSetup) {
      setTimeout(init, 100);
      return;
    }
    
    const code = `# Your R code here`;
    
    let rLang = [];
    if (window.rLanguageSupport) {
      rLang = window.rLanguageSupport;
    }
    
    const fontSizeTheme = window.EditorView.theme({
      "&": { fontSize: "1.5em" },
      ".cm-content": { fontSize: "1.5em" },
      ".cm-gutters": { fontSize: "1.5em" }
    });
    
    // ... 100 more lines of boilerplate ...
  };
})();
</script>
```

### After (20 lines):
```html
<div id="my-container"></div>

<script>
(function() {
  const init = async () => {
    const code = `# Your R code here`;
    
    const fallback = () => {
      return `[Simulated Output]\nYour fallback output`;
    };
    
    await window.webRHelper.quickSetup('my-container', code, 'slide-id', fallback);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
```

## Usage Examples

### 1. Simplest Usage (quickSetup)
```javascript
await window.webRHelper.quickSetup('container-id', code, 'slide-id', fallback);
```

### 2. With Custom Options
```javascript
await window.webRHelper.initInteractiveSection({
  containerId: 'my-container',
  code: `# R code`,
  slideId: 'my-slide',
  fallback: () => `[Fallback output]`,
  runLabel: 'Calculate Now',  // Custom button label
  minHeight: '100px'           // Custom output height
});
```

### 3. Without Fallback (shows error)
```javascript
await window.webRHelper.quickSetup('container-id', code, 'slide-id');
```

### 4. Without Slide ID (no column hiding)
```javascript
await window.webRHelper.quickSetup('container-id', code, null, fallback);
```

## Complete Example

```html
<!-- .slide:id="example-slide" -->
## My Interactive R Example
<div id="r-example-editor" class="code-editor-container" style="border: 1px solid #2d3a66; border-radius: 8px; margin: 20px; display: none; text-align: left;"></div>

<!-- layout={rows: 1, columns: 2} -->
<!-- position={row: 1, column: 1} -->
-! **Explanation of the concept**

Some text explaining what we're doing.
<!-- /position -->

<!-- position={row: 1, column: 2} -->
Try it yourself:
<div id="r-example-container"></div>

<script>
(function() {
  const initExample = async () => {
    const code = `# Calculate mean
data <- c(1, 2, 3, 4, 5)
mean(data) |> print()`;

    const fallback = () => {
      return `[Simulated Output]\n3`;
    };

    await window.webRHelper.quickSetup(
      'r-example-container', 
      code, 
      'example-slide', 
      fallback
    );
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExample);
  } else {
    initExample();
  }
})();
</script>
<!-- /position -->
<!-- /layout -->
```

## Features Included

The helper automatically creates:
- ✅ Code editor with R syntax highlighting
- ✅ Output display (read-only)
- ✅ "Show Code" / "Hide Code" toggle button
- ✅ "Run Example" button (customizable label)
- ✅ WebR execution with error handling
- ✅ Fallback support for offline/error cases
- ✅ Column hiding for reveal.js grid layouts
- ✅ Proper styling and layout
- ✅ Shared WebR instance (better performance)

## Benefits

1. **95% less code** per interactive section
2. **Single WebR instance** shared across all sections (faster)
3. **Consistent behavior** across all files
4. **Easy maintenance** - update once, affects all
5. **Cleaner markdown** - focus on content

## Migration Guide

To migrate existing WebR sections:

1. Replace all the HTML (buttons, divs) with a single container div:
   ```html
   <div id="unique-container-id"></div>
   ```

2. Replace the entire `<script>` block with:
   ```javascript
   <script>
   (function() {
     const init = async () => {
       const code = `YOUR_R_CODE_HERE`;
       const fallback = () => `YOUR_FALLBACK_OUTPUT`;
       await window.webRHelper.quickSetup('unique-container-id', code, 'slide-id', fallback);
     };
     if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', init);
     } else {
       init();
     }
   })();
   </script>
   ```

3. Test the section works correctly

## API Reference

### `quickSetup(containerId, code, slideId, fallback)`
- **containerId**: ID of the div to inject the interactive section into
- **code**: R code string to execute
- **slideId**: (optional) ID of the slide for column hiding
- **fallback**: (optional) Function that returns fallback output string

### `initInteractiveSection(config)`
- **config.containerId**: ID of container div
- **config.code**: R code string
- **config.slideId**: (optional) Slide ID
- **config.fallback**: (optional) Fallback function
- **config.runLabel**: (optional) Custom button label
- **config.minHeight**: (optional) Min height for output div

## Files Already Migrated

- ✅ `topics/dataHandling.md` (all 3 sections)

## Files to Migrate

- ⏳ `topics/MeanValue.md` (~6 sections)
- ⏳ `topics/Variance.md` (~2 sections)
- ⏳ `topics/RandomVariable.md` (~1 section)
