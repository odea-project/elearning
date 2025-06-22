let mdData = [];
const grid = document.getElementById('tutorialGrid');
const searchInput = document.getElementById('search');

fetch('resources/misc/md-manifest.json')
  .then(res => res.json())
  .then(data => {
    mdData = data;
    renderGrid(mdData);
  });

function renderGrid(items) {
  grid.innerHTML = '';
  items.forEach(item => {
    const tile = document.createElement('div');
    tile.className = 'tutorialGridTile topic-link';
    tile.setAttribute('data-md', 'topics/' + item.filename);

    if (item.thumbnail) {
      // Use image if thumbnail exists
      const thumb = document.createElement('img');
      thumb.className = 'tutorialGridTileThumb';
      thumb.src = item.thumbnail;
      thumb.alt = item.title;
      tile.appendChild(thumb);
    } else {
      // Create colored div instead of placeholder image
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '192px';
      colorDiv.style.height = '192px';
      colorDiv.style.backgroundColor = getRandomColor();
      colorDiv.style.borderRadius = '4px';  // optional styling
      tile.appendChild(colorDiv);
    }

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = item.title;
    tile.appendChild(title);

    grid.appendChild(tile);
  });
}

// Utility function to generate a random color (hex)
function getRandomColor() {
  // Generate a pastel color or fully random:
  // Example for pastel:
  // let r = Math.floor((Math.random() * 127) + 127);
  // let g = Math.floor((Math.random() * 127) + 127);
  // let b = Math.floor((Math.random() * 127) + 127);
  // return `rgb(${r},${g},${b})`;

  // Fully random:
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}


searchInput.addEventListener('input', () => {
  const val = searchInput.value.toLowerCase().trim();
  if (!val) return renderGrid(mdData);
  const terms = val.split(/\s+/);
  renderGrid(mdData.filter(item =>
    terms.every(t =>
      (item.keywords || []).join(' ').toLowerCase().includes(t)
    )
  ));
});

// Event delegation: catch clicks on any .topic-link inside the grid
grid.addEventListener('click', function(event) {
  const tile = event.target.closest('.topic-link');
  if (!tile) return;
  event.preventDefault();
  const mdUrl = tile.getAttribute('data-md');
  if (!mdUrl) return;
  // Call your dynamic markdown loading function here
  // For now, just alert the file path:
  // alert("Clicked: " + mdUrl);

  // Call the code you already use to load and display markdown as slides:
  loadMarkdownAsSlides(mdUrl);
});