# Timer-Locked Spoiler Component

A reusable component for Reveal.js presentations that creates collapsible spoiler boxes unlocked by a timer at a specific date and time.

## Setup

### 1. Include CSS and JavaScript

Add these files to your HTML presentation:

```html
<link rel="stylesheet" href="css/timer-locked-spoiler.css">
<script src="js/components/timer-locked-spoiler.js"></script>
```

## Usage

### Method 1: JavaScript Initialization (Recommended)

Create a container div and initialize with JavaScript:

```html
<!-- In your markdown or HTML -->
<div id="mySpoiler1"></div>

<script>
createTimerLockedSpoiler('mySpoiler1', {
  unlockDate: '2025-11-25T13:00:00Z',  // ISO 8601 format (UTC)
  title: 'content',
  content: `
    <h3>Secret Information</h3>
    <p>This was hidden until the unlock date!</p>
    <ul>
      <li>You can include any HTML</li>
      <li>Lists, images, code blocks</li>
      <li>Whatever you need!</li>
    </ul>
  `
});
</script>
```

### Method 2: Data Attributes (Auto-initialization)

Use data attributes for simpler setup:

```html
<div 
  id="autoSpoiler1" 
  data-timer-spoiler 
  data-unlock-date="2025-11-25T13:00:00Z"
  data-title="content"
  data-locked-icon="🔒"
  data-unlocked-icon="🔓">
  <h3>Your Hidden Content</h3>
  <p>This content will be shown when unlocked.</p>
</div>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `unlockDate` | String (ISO 8601) | Required | The date/time when content unlocks (in UTC) |
| `title` | String | 'Hidden Content' | Description shown in the header |
| `content` | String (HTML) | Required | The HTML content to reveal |
| `lockedIcon` | String | '🔒' | Icon shown when locked |
| `unlockedIcon` | String | '🔓' | Icon shown when unlocked |
| `dateFormat` | String | Auto-formatted | Custom date display format |

## Date Format Guide

Use ISO 8601 format in UTC timezone:

```javascript
// November 25, 2025 at 2:00 PM CET (1:00 PM UTC)
unlockDate: '2025-11-25T13:00:00Z'

// December 1, 2025 at 10:30 AM EST (3:30 PM UTC)
unlockDate: '2025-12-01T15:30:00Z'

// Convert CET to UTC: CET = UTC+1, CEST = UTC+2
// 2:00 PM CET = 1:00 PM UTC = 13:00
```

### Timezone Conversion Helper

| Your Time | UTC Offset | Example: 2:00 PM |
|-----------|------------|------------------|
| CET (Winter) | UTC+1 | 13:00 UTC |
| CEST (Summer) | UTC+2 | 12:00 UTC |
| EST (Winter) | UTC-5 | 19:00 UTC |
| EDT (Summer) | UTC-4 | 18:00 UTC |
| PST (Winter) | UTC-8 | 22:00 UTC |

## Complete Example

```html
<!-- .slide:id="my-locked-slide" -->
## Special Announcement

<div id="announcement1"></div>

<script>
createTimerLockedSpoiler('announcement1', {
  unlockDate: '2025-11-25T13:00:00Z',
  title: 'Exam Questions',
  content: `
    <h3>📝 Practice Questions</h3>
    <ol>
      <li>What is the null hypothesis in ANOVA?</li>
      <li>How do you calculate the F-statistic?</li>
      <li>When would you use post-hoc tests?</li>
    </ol>
    <p><strong>Answer key will be provided after class.</strong></p>
  `
});
</script>

---

<!-- Another slide with different unlock date -->
## Bonus Material

<div id="bonus1"></div>

<script>
createTimerLockedSpoiler('bonus1', {
  unlockDate: '2025-12-01T10:00:00Z',
  title: 'Advanced Topics',
  content: `
    <h3>🚀 Advanced ANOVA Techniques</h3>
    <p>Two-way ANOVA, ANCOVA, and more!</p>
  `
});
</script>
```

## Features

- ⏱️ Live countdown timer
- 🔒 Automatic locking/unlocking based on date
- 🎨 Smooth animations
- 📱 Responsive design
- 🔄 Auto-reset when changing slides
- 🚫 Shake effect when trying to open while locked
- ✨ Clean, modern UI with gradient backgrounds

## API Methods

If you need programmatic control:

```javascript
// Create instance
const spoiler = new TimerLockedSpoiler('containerId', options);

// Methods
spoiler.unlock();      // Manually unlock
spoiler.toggle();      // Toggle open/closed (if unlocked)
spoiler.shake();       // Trigger shake animation
spoiler.reset();       // Reset to closed state
spoiler.destroy();     // Clean up timers
```

## Styling Customization

Override CSS variables or classes in your custom stylesheet:

```css
/* Custom colors */
.timer-locked-spoiler .spoiler-header {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}

/* Custom size */
.timer-locked-spoiler {
  max-width: 1000px;
  border-radius: 12px;
}
```

## Browser Support

Works in all modern browsers that support:
- ES6 Classes
- Date object
- CSS Animations
- Flexbox

## Troubleshooting

**Spoiler doesn't appear:**
- Check that the container ID exists
- Verify CSS and JS files are loaded
- Check browser console for errors

**Wrong unlock time:**
- Ensure date is in ISO 8601 UTC format
- Convert your local time to UTC correctly
- Remember: 'Z' suffix means UTC

**Content not showing after unlock:**
- Check that content HTML is valid
- Verify no conflicting CSS on the slide
