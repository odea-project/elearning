Reveal.on('ready', () => {
  console.log('[DEBUG] Reveal ist ready');

  // Liste aller Plugins anzeigen
  console.log('[DEBUG] Reveal.getPlugins():', Reveal.getPlugins());
  console.log('[DEBUG] Reveal.getPlugin("markdown") direkt:', Reveal.getPlugin('markdown'));

  document.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', async e => {
      e.preventDefault();
      const mdUrl = a.getAttribute('data-md');
      console.log('[DEBUG] Link geklickt, data-md =', mdUrl);

      const slide = document.querySelector('#dynamic-tutorial');
      if (!slide) {
        console.error('[ERROR] Slide #dynamic-tutorial nicht gefunden!');
        return;
      }

      // 1) Alten Content und Attribut entfernen
      slide.removeAttribute('data-markdown');
      slide.innerHTML = '';
      console.log('[DEBUG] data-markdown entfernt, innerHTML geleert');

      // 2) Neues data-markdown setzen
      slide.setAttribute('data-markdown', mdUrl);
      console.log('[DEBUG] data-markdown gesetzt auf', slide.getAttribute('data-markdown'));
      console.log('[DEBUG] slide.dataset.markdown =', slide.dataset.markdown);

      // 3) Markdown-Plugin direkt zum Nachladen aufrufen
      const markdownPlugin = Reveal.getPlugin('markdown');
      if (!markdownPlugin) {
        console.error('[ERROR] Markdown-Plugin nicht gefunden. Abbruch.');
        return;
      }
      console.log('[DEBUG] markdownPlugin.loadSlide ist:', markdownPlugin.loadSlide);

      try {
        console.log('[DEBUG] Vor markdownPlugin.loadSlide()');
        await markdownPlugin.loadSlide(slide);
        console.log('[DEBUG] Nach markdownPlugin.loadSlide(): Inhalt gerendert');
        console.log('[DEBUG] slide.innerHTML jetzt =\n', slide.innerHTML);
      } catch (err) {
        console.error('[ERROR] markdownPlugin.loadSlide() schlug fehl:', err);
      }

      // 4) Zur dynamischen Slide springen (Index ggf. anpassen)
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
