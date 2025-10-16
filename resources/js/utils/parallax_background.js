/**
 * Lightweight parallax effect that offsets layered backgrounds based on the
 * horizontal slide index. Works because Reveal exposes the index via
 * slidechange events.
 */
Reveal.on('slidechanged', event => {
  const index = event.indexh;
  const offset = index * 200;

  const back = document.querySelector('.layer-back');
  const front = document.querySelector('.layer-front');
  // const veryFront = document.querySelector('.layer-very-front');

  back.style.backgroundPositionX = `-${offset * 1}px`;   // z.B. langsamer (weiter entfernt)
  front.style.backgroundPositionX = `-${offset * 2}px`;  // z.B. schneller (näher dran)
  // veryFront.style.backgroundPositionX = `-${offset * 3}px`; // z.B. noch schneller (am nächsten dran)
});