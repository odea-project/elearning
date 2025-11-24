# Timer-Locked Spoiler - Quick Examples

## Example 1: Simple Usage (Current in anova1.md)

```markdown
<!-- .slide:id="my-slide" -->
## My Slide Title

<div id="spoiler1"></div>

<script>
createTimerLockedSpoiler('spoiler1', {
  unlockDate: '2025-11-25T13:00:00Z',  // Nov 25, 2025 at 2:00 PM CET
  title: 'content',
  content: `
    <h3>Hidden Information</h3>
    <p>This is revealed after the unlock date.</p>
  `
});
</script>
```

## Example 2: Multiple Spoilers on Same Slide

```markdown
<!-- .slide:id="quiz-slide" -->
## Practice Quiz

### Question 1
<div id="answer1"></div>

### Question 2
<div id="answer2"></div>

<script>
createTimerLockedSpoiler('answer1', {
  unlockDate: '2025-11-25T13:00:00Z',
  title: 'Answer 1',
  content: '<p><strong>Answer:</strong> The null hypothesis states that all group means are equal.</p>'
});

createTimerLockedSpoiler('answer2', {
  unlockDate: '2025-11-25T14:00:00Z',  // Different unlock time
  title: 'Answer 2',
  content: '<p><strong>Answer:</strong> Use post-hoc tests when ANOVA shows significant differences.</p>'
});
</script>
```

## Example 3: Exam Questions (Unlocks After Exam)

```markdown
<!-- .slide:id="exam-answers" -->
## Exam Answer Key

<div id="examKey"></div>

<script>
createTimerLockedSpoiler('examKey', {
  unlockDate: '2025-12-15T16:00:00Z',  // Dec 15, 2025 at 5:00 PM CET (16:00 UTC)
  title: 'Answer Key',
  content: `
    <h3>📝 Exam Solutions</h3>
    <ol>
      <li><strong>Question 1:</strong> Answer explanation...</li>
      <li><strong>Question 2:</strong> Answer explanation...</li>
      <li><strong>Question 3:</strong> Answer explanation...</li>
    </ol>
    <p>Average score: 78%</p>
  `
});
</script>
```

## Example 4: Lab Results (Weekly Unlock)

```markdown
<!-- .slide:id="lab-results" -->
## Lab Exercise Results

<div id="week1"></div>

<div id="week2"></div>

<div id="week3"></div>

<script>
createTimerLockedSpoiler('week1', {
  unlockDate: '2025-11-20T09:00:00Z',
  title: 'Week 1 Results',
  content: '<p>✅ Expected pH: 7.2 ± 0.1</p>'
});

createTimerLockedSpoiler('week2', {
  unlockDate: '2025-11-27T09:00:00Z',
  title: 'Week 2 Results',
  content: '<p>✅ Expected conductivity: 450 μS/cm ± 20</p>'
});

createTimerLockedSpoiler('week3', {
  unlockDate: '2025-12-04T09:00:00Z',
  title: 'Week 3 Results',
  content: '<p>✅ Expected turbidity: 5 NTU ± 1</p>'
});
</script>
```

## Example 5: Bonus Content (Unlocks Next Semester)

```markdown
<!-- .slide:id="advanced-topics" -->
## Looking Ahead

<div id="nextSemester"></div>

<script>
createTimerLockedSpoiler('nextSemester', {
  unlockDate: '2026-02-01T00:00:00Z',  // Feb 1, 2026
  title: 'Next Semester Preview',
  content: `
    <h3>🚀 Advanced Topics Coming Soon</h3>
    <ul>
      <li>Multivariate ANOVA (MANOVA)</li>
      <li>Mixed-Effects Models</li>
      <li>Bayesian Statistics</li>
    </ul>
    <p>Enroll now for Spring 2026!</p>
  `
});
</script>
```

## Example 6: Conference Announcement

```markdown
<!-- .slide:id="conference" -->
## Special Announcement

<div id="announcement"></div>

<script>
createTimerLockedSpoiler('announcement', {
  unlockDate: '2025-11-30T15:00:00Z',
  title: 'Special Announcement',
  content: `
    <h3>🎉 International Water Conference 2026</h3>
    <p><strong>Date:</strong> June 15-18, 2026</p>
    <p><strong>Location:</strong> Vienna, Austria</p>
    <p><strong>Early bird discount:</strong> Register by Dec 31, 2025</p>
    <a href="https://example.com">More information →</a>
  `
});
</script>
```

## Example 7: Custom Icons & Styling

```markdown
<div id="customSpoiler"></div>

<script>
createTimerLockedSpoiler('customSpoiler', {
  unlockDate: '2025-11-25T13:00:00Z',
  title: 'Secret Formula',
  lockedIcon: '🔐',
  unlockedIcon: '✅',
  content: `
    <h3>💡 The Secret Formula</h3>
    <p>Success = Hard Work + Smart Study + Good Sleep</p>
  `
});
</script>
```

## Timezone Quick Reference

```javascript
// Convert your local time to UTC for the unlockDate parameter

// CET/CEST (Central European Time)
// Winter (CET): UTC+1  → Subtract 1 hour
// Summer (CEST): UTC+2 → Subtract 2 hours
// Example: 2:00 PM CET = 13:00 UTC
unlockDate: '2025-11-25T13:00:00Z'

// EST/EDT (Eastern US Time)
// Winter (EST): UTC-5 → Add 5 hours
// Summer (EDT): UTC-4 → Add 4 hours
// Example: 9:00 AM EST = 14:00 UTC
unlockDate: '2025-12-01T14:00:00Z'

// PST/PDT (Pacific US Time)
// Winter (PST): UTC-8 → Add 8 hours
// Summer (PDT): UTC-7 → Add 7 hours
// Example: 10:00 AM PST = 18:00 UTC
unlockDate: '2025-12-01T18:00:00Z'
```

## Common Date Formats

```javascript
// Specific date and time
unlockDate: '2025-11-25T13:00:00Z'  // Nov 25, 2025 at 1:00 PM UTC

// Midnight UTC
unlockDate: '2025-12-01T00:00:00Z'  // Dec 1, 2025 at midnight UTC

// End of day
unlockDate: '2025-11-25T23:59:59Z'  // Nov 25, 2025 at 11:59:59 PM UTC

// 30 minutes increments
unlockDate: '2025-11-25T13:30:00Z'  // 1:30 PM UTC
unlockDate: '2025-11-25T14:45:00Z'  // 2:45 PM UTC
```

## Tips

1. **Always use unique IDs** - Each spoiler needs a unique container ID
2. **Test your dates** - Use a date calculator to verify UTC conversion
3. **Keep content concise** - Spoilers work best with focused content
4. **Consider timing** - Set unlock times that make sense for your audience
5. **Use descriptive titles** - Help users understand what they're unlocking
