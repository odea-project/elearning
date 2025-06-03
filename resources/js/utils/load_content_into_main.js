Reveal.on('ready', () => {
  document.querySelectorAll('.topic-link').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const mdUrl = a.getAttribute('data-md');
      const slide = document.querySelector('#dynamic-tutorial');
      if (!slide) {
        console.error('Slide #dynamic-tutorial nicht gefunden');
        return;
      }

      // 1) Alten Markdown-Content komplett entfernen
      slide.removeAttribute('data-markdown');
      slide.innerHTML = "";

      // 2) Neues data-markdown setzen
      slide.setAttribute('data-markdown', mdUrl);

      // 3) Definiere, welche Plugins neu geladen werden sollen
      //    (Reveal.sync() sorgt dafür, dass Markdown-Plugin den neuen Pfad rendert)
      Reveal.sync();

      // 4) Zur dynamischen Slide springen (Index anpassen, hier 2)
      Reveal.slide(2);
    });
  });
});
