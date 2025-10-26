# 📝 Notes System for Reveal.js Presentations

## Overview

The Notes System allows you to create interactive notes during a presentation that are automatically linked to their respective slides. Notes are stored locally in the browser and persist across sessions.

## Features

### ✨ Main Functions

- **Text Notes**: Draggable text fields with touch/mouse support
- **Slide-specific**: Notes are automatically assigned to the current slide
- **Persistence**: All notes are saved in localStorage
- **Export/Import**: Save and load notes as JSON files
- **Cross-platform**: Works on desktop, tablet, and smartphone
- **Text Markers & Highlights**: Mark and highlight text directly in notes

### 📄 Text Features

- **Draggable**: Move notes with drag & drop (mouse and touch supported)
- **Editable**: Direct editing of note content
- **Deletable**: Remove individual notes
- **Auto-Save**: Changes are saved automatically when closing notes view
- **Text Selection**: Select and manipulate text with markers and highlights

## Controls & UI

### Keyboard Shortcuts

| Key | Function |
|-----|----------|
| `N` | Open/close notes overlay |
| `+` / `=` | Make background more opaque |
| `-` / `_` | Make background more transparent |
| `Ctrl` + `Mouse Wheel` | Change transparency |
| `Esc` | Close notes overlay |

### UI Elements

#### Toggle Button (bottom right)
- **Click**: Open/close notes overlay
- **Badge**: Green dot indicates notes exist on current slide

#### Toolbar (top)

**Actions:**
- 🗑️ Clear All (delete all notes on current slide)
- 📥 Import (load notes from JSON file)
- 💾 Export (save all notes as JSON)

**Transparency:**
- 🙈 More transparent (increase visibility through notes)
- **95%** Display (10% - 100%)
- 👁️ More opaque (decrease visibility through notes)

**Close:**
- 🚪 Close overlay (exit icon)

### Workflow

1. **Open Notes Mode**: Click button (bottom right) or press `N`
2. **Adjust Transparency** (optional):
   - **Keys**: `+` for more opaque, `-` for more transparent
   - **Mouse Wheel**: `Ctrl` + Scroll
   - **Touch**: Pinch gesture (Zoom-In/Out)
   - **Buttons**: 🙈 / 👁️ in toolbar
3. **Create Notes**:
   - Click on empty area of slide → Note appears → Enter text
4. **Edit Notes**:
   - **Edit text**: Click in note and edit content
   - **Move note**: Drag at header (≡ Move) → Cursor becomes hand (works with mouse and touch)
   - **Delete note**: Click 🗑️ button (trash icon) in note header
   - **Select text**: Use text selection for markers and highlights
5. **Save**: Automatically saved when closing notes view or changing slides
6. **Close**: Press `Esc` or click 🚪 button (exit icon)

## Technical Details

### Data Structure

```json
{
  "presentation": "/path/to/presentation",
  "version": "1.0",
  "notes": {
    "slide-id-1": {
      "text": [
        {
          "content": "My note text",
          "x": 100,
          "y": 200,
          "id": "note-123456"
        }
      ],
      "timestamp": "2025-10-21T10:30:00Z"
    }
  }
}
```

### Storage

- **Method**: `localStorage` (browser-local)
- **Key**: `presentation-notes`
- **Format**: JSON
- **Capacity**: ~5-10 MB (browser-specific)

### Slide ID Assignment

Notes are assigned via the Reveal.js slide ID:

```html
<!-- .slide:id="my-slide-id" -->
```

If no ID is defined, `slide-{h}-{v}` is used automatically (e.g., `slide-2-0`).

## Export & Import

### Export

1. Open notes overlay
2. Click 💾 button (download icon)
3. JSON file is downloaded: `presentation-notes-YYYY-MM-DD.json`
4. Confirmation notification appears

### Import

1. Open notes overlay
2. Click 📥 button (upload icon)
3. Select JSON file
4. Imported notes are added to existing notes
5. In case of conflicts (same slide ID), imported notes take precedence

**Merge Strategy:**
- If notes already exist → Dialog appears
- **OK** = Imported notes are added (merge)
- **Cancel** = Import is canceled
- No existing notes → Direct import

### Programmatic Import

```javascript
// JSON file as string
const jsonData = /* ... JSON string ... */;

// Import
const success = window.notesManager.importNotes(jsonData);
if (success) {
  console.log('Import successful!');
}
```

## Styling & Customization

### CSS Variables

Colors can be customized in `css/notes-system.css`:

```css
/* Main colors */
--notes-primary: #61AFEF;      /* Blue */
--notes-background: #1a2340;   /* Dark blue */
--notes-text: #9efcff;         /* Cyan */
--notes-yellow: #E5C07B;       /* Yellow */
```

### Integration in Custom Themes

If you use a custom Reveal.js theme, ensure:

1. `css/notes-system.css` is included
2. `resources/js/notes-system.js` is included
3. `resources/js/ipad-text-selection-fix.js` is included (for iPad text selection support)
4. Font Awesome Icons are available

## Compatibility

### Browser
- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (Desktop & Mobile - including iPad with text selection fix)
- ✅ Opera

### Input Devices
- ✅ Mouse
- ✅ Touchscreen (with drag support)
- ✅ iPad/iOS (with special text selection handling)

### Cross-Platform Features
- ✅ **Touch Drag**: Notes can be dragged using touch on tablets and phones
- ✅ **iPad Text Selection**: Special handling prevents slide changes when selecting text on iPad
- ✅ **FontAwesome Lists**: Custom list markers work consistently across all platforms

## Known Limitations

- **localStorage Limit**: Very large notes can reach browser storage limits
- **No Cloud Sync**: Notes are stored locally per browser/device
- **Text Selection on iPad**: Requires `ipad-text-selection-fix.js` script to prevent slide changes during text selection

## Troubleshooting

### Notes are not saved

- **Check**: Is localStorage enabled in the browser?
- **Solution**: Browser settings → Allow cookies/localStorage

### Toggle button is not displayed

- **Check**: Is `css/notes-system.css` loaded?
- **Solution**: Check browser console for CSS errors

### Text selection triggers slide changes on iPad

- **Cause**: iOS Safari doesn't prevent swipe during text selection by default
- **Solution**: Ensure `resources/js/ipad-text-selection-fix.js` is loaded in your HTML
- **Verification**: Script adds `data-prevent-swipe` attribute to `.reveal .slides` during text selection

### Notes appear on wrong slide

- **Cause**: Slide has no unique ID
- **Solution**: Define slide ID in Markdown:
  ```markdown
  <!-- .slide:id="unique-id" -->
  ```

### Delete button not clickable

- **Cause**: Drag handler interfering with button click
- **Solution**: Already fixed - drag handler checks for `.note-delete-btn` and skips dragging

### FontAwesome list markers showing double icons

- **Cause**: Default list markers appearing alongside custom FontAwesome icons
- **Solution**: Already fixed - `list-style: none !important` is applied to custom list classes
- **Affected browsers**: Windows, Android (iPad uses different rendering)

## Privacy

- **Local**: All data remains in the browser
- **No Transmission**: No server communication
- **Deletion**: Clearing browser cache removes all notes
- **Export Recommended**: Regularly export notes for backup

## Enhancement Possibilities

Possible future features:

- 📱 **Cloud Sync**: Optional via Firebase/Supabase
- 🔍 **Search**: Search through notes
- 🏷️ **Tags**: Categorize notes
- 📊 **Statistics**: Overview of all notes
- 🖼️ **Image Upload**: Insert images as notes
- 🎙️ **Audio Notes**: Voice recordings
- 📤 **PDF Export**: Export notes as PDF with slides

## Example Workflow: Lecture

1. **Preparation**: Open presentation
2. **During Lecture**:
   - Capture important points as text notes
   - Slide change → Notes are automatically saved
3. **After Lecture**:
   - Export notes as JSON
   - Optional: Screenshots of slides with notes
4. **Next Session**: 
   - Open presentation → Notes are automatically back
   - Badge indicates which slides have notes

## Import Test

The repository contains a test file to try out the import function:

**File**: `test-notes-import.json`

**Test Steps**:
1. Open demo: `notes-demo.html`
2. Open notes overlay (press `N`)
3. Click upload button (📥)
4. Select file `test-notes-import.json`
5. Wait for confirmation
6. Navigate to different slides → Imported notes appear!

**Test notes contain**:
- Slide 1: 2 welcome notes
- Slide 2: 1 note hint
- Slide 5: 1 Pythagoras example with calculation

## Recent Updates (Version 1.1)

### Removed Features
- ❌ **Drawing Mode**: Removed canvas drawing functionality to improve tablet performance
- ❌ **Drawing Tools**: Color selection, stroke width, eraser removed
- ❌ **Mode Switching**: Text/Draw mode toggle removed

### Improved Features
- ✅ **Touch Drag**: Notes now draggable with touch on tablets (touchstart/touchmove/touchend)
- ✅ **iPad Text Selection**: Special script prevents slide changes when selecting text
- ✅ **Auto-Save Simplified**: Only saves on close/delete/slide-change (removed debounced saves)
- ✅ **Icons Updated**: Trash icon (🗑️) for delete, exit icon (🚪) for close
- ✅ **Cross-Platform Lists**: FontAwesome markers work on iPad, Windows, and Android

### Bug Fixes
- 🐛 Delete button now clickable (drag handler excludes button area)
- 🐛 FontAwesome list markers working on iPad (converted from `::marker` to `::before`)
- 🐛 Double list markers removed on Windows/Android (added `list-style: none`)
- 🐛 Text selection on iPad no longer triggers slide navigation

## Technical Implementation Notes

### iPad Text Selection Fix
The system includes `resources/js/ipad-text-selection-fix.js` which:
- Detects text selection using `window.getSelection()`
- Temporarily adds `data-prevent-swipe` attribute to `.reveal .slides`
- Integrates with Reveal.js built-in swipe prevention mechanism
- Automatically re-enables swiping 500ms after selection ends

### FontAwesome List Markers
Custom list classes in `dist/theme/odea.css`:
- `q-list`, `arrow-list`, `exclam-list`, `tag-list`, `at-list`, `home-list`, `idea-list`, `bullseye-list`
- Uses `::before` pseudo-elements with absolute positioning
- Font: "Font Awesome 6 Free" with `font-weight: 900`
- `list-style: none !important` prevents default browser markers

## Support & Development

- **Version**: 1.1 (Text-only, optimized for tablets)
- **Developed for**: ODEA E-Learning Platform
- **License**: Project-specific

---

**Happy note-taking! 🚀**
