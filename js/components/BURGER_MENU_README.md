# Burger Menu System

A unified menu system that consolidates overlay control buttons into a single, accessible burger menu.

## Overview

The burger menu replaces individual floating buttons with a clean, organized slide-out menu panel. All overlay controls (Notes, Performance Mode, PDF Export) are now accessible from one location.

## Features

✅ **Slide-out panel** - Smooth animation from the left side  
✅ **Top-left burger button** - Standard position with animated icon  
✅ **Consolidated controls** - All overlay buttons in one place  
✅ **Real-time status** - Live updates for active states  
✅ **Multiple close methods**:
  - Click the X button
  - Click outside the menu
  - Press Escape key
✅ **Responsive design** - Adapts to mobile screens  
✅ **Auto-hides original buttons** - Keeps UI clean  

## Menu Items

### 1. Notes
- **Icon:** 📝 Sticky note
- **Action:** Opens/closes the notes panel
- **Indicator:** Red dot badge when notes exist on current slide
- **Closes menu:** Yes (after opening notes)

### 2. Performance Mode
- **Icon:** ⚡ Bolt
- **Action:** Toggles performance mode on/off
- **Indicator:** Toggle shows "ON" (green) or "OFF" (gray)
- **Closes menu:** No (stays open for quick toggles)

### 3. Export PDF
- **Icon:** 📄 PDF file
- **Action:** Exports presentation as PDF
- **Closes menu:** Yes (after triggering export)

## Usage

### For Users

1. **Open menu:** Click the burger button (☰) in the top-left corner
2. **Select option:** Click any menu item to perform the action
3. **Close menu:** 
   - Click the X button in the menu header
   - Click outside the menu panel
   - Press the Escape key

### For Developers

The burger menu automatically initializes when the page loads and hides the original overlay buttons.

**Original buttons hidden:**
- `#notes-toggle-btn`
- `#performance-mode-toggle-btn`
- `#pdf-export-button`

**API Access:**

```javascript
// Access burger menu instance
window.burgerMenu

// Programmatic control
window.burgerMenu.open()
window.burgerMenu.close()
window.burgerMenu.toggle()
```

## Styling

### Button Position

Default: Top-left corner (20px from top, 20px from left)

To change position, edit `burger-menu.css`:

```css
.burger-menu-button {
  top: 20px;    /* Adjust vertical position */
  left: 20px;   /* Adjust horizontal position */
}
```

### Menu Width

Default: 350px (280px on mobile)

To change width, edit all instances in `burger-menu.css`:

```css
.burger-menu::before,
.burger-menu-header,
.burger-menu-content {
  width: 350px;  /* Adjust menu width */
}
```

### Color Scheme

**Button gradient:**
- Default: Purple gradient (#667eea → #764ba2)
- Active: Red gradient (#e74c3c → #c0392b)

**Menu panel:**
- Background: Dark gradient (#2c3e50 → #34495e)
- Items: Semi-transparent white overlays

To customize, edit the gradient colors in `burger-menu.css`.

## Adding New Menu Items

To add additional menu items, edit `burger-menu.js`:

1. **Add HTML in `createMenu()` method:**

```javascript
<div class="burger-menu-item" data-action="mynewitem">
  <i class="fas fa-star"></i>
  <span>My New Item</span>
</div>
```

2. **Add action handler in `handleAction()` method:**

```javascript
case 'mynewitem':
  // Your action code here
  this.close();
  break;
```

3. **Optional: Add status indicator:**

```html
<span class="menu-item-toggle" id="myitem-status"></span>
```

And update it in `updateMenuItems()` method.

## Keyboard Shortcuts

The burger menu doesn't have a direct keyboard shortcut, but the original shortcuts still work:

- **P** - Toggle Performance Mode
- Other shortcuts as defined by individual systems

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- Backdrop blur supported (graceful degradation)

## Responsive Behavior

### Desktop (> 768px)
- Menu width: 350px
- Full feature set

### Mobile (≤ 768px)
- Menu width: 280px
- Compact spacing
- Touch-optimized tap targets

## Print/PDF Export

The burger menu is automatically hidden when:
- Printing (`@media print`)
- Exporting to PDF (`html.reveal-print`)

## Integration Notes

### Initialization Order

The burger menu initializes after other systems:
1. Notes system creates its button
2. Performance mode creates its button
3. PDF export creates its button
4. **Burger menu** initializes and hides the original buttons

A 500ms delay ensures all systems are ready before the menu updates.

### State Synchronization

The menu polls for state updates every second to ensure:
- Notes badge reflects current slide
- Performance mode toggle shows correct state
- Menu items remain synchronized with system state

## Troubleshooting

**Menu doesn't appear:**
- Check that CSS and JS files are loaded
- Verify no conflicting z-index values
- Check browser console for errors

**Original buttons still visible:**
- Ensure burger menu JS loaded after other systems
- Check for CSS specificity issues
- Verify JS executed successfully

**Menu items don't work:**
- Verify original systems are initialized
- Check console for action handler errors
- Ensure button IDs match expected values

## Files

- `js/components/burger-menu.js` - Main functionality
- `css/burger-menu.css` - All styles
- `index.html` - Includes both files

## Future Enhancements

Potential additions:
- User preferences panel
- Keyboard shortcuts list
- Slide navigation controls
- Theme switcher
- Help/documentation link
