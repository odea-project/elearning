Reveal.initialize({
  // The "normal" size of the presentation, aspect ratio will
  // be preserved when the presentation is scaled to fit different
  // resolutions. Can be specified using percentage units.
  width: 960,
  height: 500,

  // Factor of the display size that should remain empty around
  // the content
  margin: 0.2,

  // Bounds for smallest/largest possible scale to apply to content
  minScale: 0.2,
  maxScale: 2.0,
  parallaxBackgroundImage: 'resources/misc/bg2.jpg',
  parallaxBackgroundSize: '6932px 1080px',
  parallaxBackgroundHorizontal: 200,
  hash: true,
  touch: true,
  plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.KaTeX],
});