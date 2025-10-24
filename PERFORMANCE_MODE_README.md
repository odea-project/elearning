# Performance Mode

A high-contrast, accessibility-focused mode that disables all visual effects for better performance and readability.

## Features

### Visual Changes
- **High Contrast Theme**: Black text on white background for maximum readability
- **Disabled Effects**: All animations, transitions, shadows, and gradients removed
- **Simple Borders**: Clear, solid borders replace glowing effects
- **No Parallax**: Background parallax layers hidden
- **No Rain Effects**: Matrix rain canvas disabled
- **Grayscale Images**: Background images converted to grayscale with reduced opacity

### Performance Benefits
- **Faster Rendering**: Eliminates GPU-intensive effects
- **Reduced CPU Usage**: No animations or transitions to calculate
- **Better Battery Life**: Especially on laptops and mobile devices
- **Lower Memory Usage**: Simplified rendering pipeline

### Accessibility Improvements
- **Enhanced Focus Indicators**: Clear 3px black outlines on focused elements
- **Better Contrast Ratios**: Meets WCAG AAA standards
- **Reduced Motion**: Complies with `prefers-reduced-motion` preferences
- **Clearer UI**: No visual distractions from glowing effects

## Usage

### Toggle Performance Mode

**Keyboard Shortcut**: Press `P` key

**Click**: Click the lightning bolt (⚡) button in the top-left corner (next to Notes button)

### Visual Indicators

- **Normal Mode**: Yellow/orange lightning bolt with glow
- **Performance Mode Active**: Black lightning bolt on white background

### State Persistence

Performance mode preference is saved to localStorage and will persist across page reloads.

## Technical Details

### CSS Implementation

The system uses a body class `.performance-mode` to override all visual styles:

```css
body.performance-mode {
  /* Disable all animations and transitions */
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

### JavaScript API

```javascript
// Access the performance mode manager
window.performanceModeManager

// Enable performance mode
window.performanceModeManager.enable();

// Disable performance mode
window.performanceModeManager.disable();

// Toggle performance mode
window.performanceModeManager.toggle();

// Check current state
window.performanceModeManager.isEnabled
```

## Files

- `css/performance-mode.css` - High contrast theme overrides
- `resources/js/performance-mode.js` - Performance mode toggle logic
- Integrated into `index.html`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `P` | Toggle performance mode on/off |
| `N` | Toggle notes (still works in performance mode) |

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## Notes

- Performance mode works seamlessly with the Notes System
- All interactive features remain functional
- Print styles automatically hide toggle buttons
- Mobile responsive with adjusted button sizes
- Notification system shows confirmation when toggling

## Future Enhancements

Potential improvements:
- Customizable contrast levels
- Font size adjustment options
- Additional accessibility features
- Keyboard navigation improvements
