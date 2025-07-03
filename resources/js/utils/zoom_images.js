document.body.addEventListener("click", e => {
  // Prüfe, ob das geklickte Element ein Vorschaubild ist
  const img = e.target;
  if (!img.matches("img[data-preview-image]")) return;

  // Overlay erstellen
  const overlay = document.createElement("div");
  overlay.classList.add("preview-overlay");

  // Großes Bild reinladen
  const bigImg = document.createElement("img");
  bigImg.src = img.src;
  overlay.appendChild(bigImg);

  // Klick auf Overlay schließt es wieder
  overlay.addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  document.body.appendChild(overlay);
});