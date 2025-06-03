Reveal.on('ready', () => {
  console.log('[DEBUG] Reveal ist ready');

  document.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const mdUrl = a.getAttribute('data-md');
      console.log('[DEBUG] Link geklickt, data-md =', mdUrl);

      const slide = document.querySelector('#dynamic-tutorial');
      if (!slide) {
        console.error('[ERROR] Slide #dynamic-tutorial nicht gefunden!');
        return;
      }

      // 1) Alten Content entfernen
      slide.removeAttribute('data-markdown');
      slide.innerHTML = "";
      console.log('[DEBUG] data-markdown entfernt, innerHTML geleert');

      // 2) Neues data-markdown setzen
      slide.setAttribute('data-markdown', mdUrl);
      console.log('[DEBUG] data-markdown gesetzt auf', slide.getAttribute('data-markdown'));

      // 3) Reveal.sync() aufrufen
      console.log('[DEBUG] Vor Reveal.sync()');
      Reveal.sync();
      console.log('[DEBUG] Nach Reveal.sync()');

      // 4) Zur dynamischen Slide springen (hier Index anpassen)
      Reveal.slide(2);
      console.log('[DEBUG] Zu Slide 2 gesprungen');
    });
  });
});

// Reveal.on('ready', () => {
//   document.querySelectorAll('.topic-link').forEach(a => {
//     a.addEventListener('click', e => {
//       e.preventDefault();
//       const mdUrl = a.getAttribute('data-md');
//       const slide = document.querySelector('#dynamic-tutorial');
//       if (!slide) {
//         console.error('Slide #dynamic-tutorial nicht gefunden');
//         return;
//       }

//       // 1) Alten Markdown-Content komplett entfernen
//       slide.removeAttribute('data-markdown');
//       slide.innerHTML = "";

//       // 2) Neues data-markdown setzen
//       slide.setAttribute('data-markdown', mdUrl);

//       // 3) Definiere, welche Plugins neu geladen werden sollen
//       //    (Reveal.sync() sorgt dafür, dass Markdown-Plugin den neuen Pfad rendert)
//       Reveal.sync();

//       // 4) Zur dynamischen Slide springen (Index anpassen, hier 2)
//       Reveal.slide(2);
//     });
//   });
// });
