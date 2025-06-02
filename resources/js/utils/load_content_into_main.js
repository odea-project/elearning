document.querySelectorAll('.topic-link').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const mdUrl = a.getAttribute('data-md');
    const slide = document.querySelector('#dynamic-tutorial');

    // a) Attribut setzen
    slide.setAttribute('data-markdown', mdUrl);

    // b) Reveal.sync() ausführen, sodass das Markdown-Plugin lädt
    Reveal.sync();

    // c) Auf die dynamische Slide navigieren (hier Index 2)
    //    Passe 2 ggf. an, wenn sich die Position verschiebt
    Reveal.slide(3);
  });
});