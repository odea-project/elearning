/**
 * Small search UI for the tutorial landing page. Reads the manifest once and
 * then filters client-side to keep navigation snappy.
 */
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
  
  // Create outer grid container with 2 columns
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  grid.style.gap = '20px';
  grid.style.width = '70%';
  grid.style.paddingLeft = '13%';
  grid.style.paddingTop = '20px';
  
  // Split items into groups of 6 (2 columns × 3 rows per outer column)
  const itemsPerOuterColumn = 6;
  const numOuterColumns = Math.ceil(items.length / itemsPerOuterColumn);
  
  for (let outerCol = 0; outerCol < numOuterColumns; outerCol++) {
    const innerGrid = document.createElement('div');
    innerGrid.style.display = 'grid';
    innerGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    innerGrid.style.gridTemplateRows = 'repeat(3, 1fr)';
    innerGrid.style.gap = '15px';
    
    // Get items for this outer column (6 items max)
    const startIdx = outerCol * itemsPerOuterColumn;
    const endIdx = Math.min(startIdx + itemsPerOuterColumn, items.length);
    const columnItems = items.slice(startIdx, endIdx);
    
    columnItems.forEach(item => {
      const tile = document.createElement('div');
      tile.className = 'tutorialGridTile topic-link';
      tile.setAttribute('data-md', 'topics/' + item.filename);
      tile.style.position = 'relative';
      tile.style.zIndex = '1';
      tile.style.width = '256px';
      tile.style.minWidth = '256px';
      tile.style.minHeight = '256px';
      tile.style.display = 'flex';
      tile.style.flexDirection = 'column';
      tile.style.alignItems = 'center';
      tile.style.justifyContent = 'center';

      if (item.thumbnail) {
        // Create polaroid-style colored div with SVG icon overlay
        const colorDiv = document.createElement('div');
        colorDiv.style.width = '200px';
        colorDiv.style.height = '200px';
        colorDiv.style.minWidth = '100px';
        colorDiv.style.minHeight = '100px';
        colorDiv.style.flexShrink = '0';
        colorDiv.style.borderRadius = '2px';
        colorDiv.style.padding = '12px';
        colorDiv.style.paddingBottom = '12px';
        colorDiv.style.backgroundColor = '#fff';
        colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)';
        colorDiv.style.marginBottom = '70px';
        colorDiv.style.position = 'relative';
        
        // Random rotation between -4 and 4 degrees
        const rotation = (1 * (Math.random() * 8 - 4)).toFixed(2);
        colorDiv.style.transform = `rotate(${rotation}deg)`;
        colorDiv.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Inner colored area (the actual photo part) with gradient
        const photoArea = document.createElement('div');
        photoArea.style.width = '100%';
        photoArea.style.height = '100%';
        const baseColor = getRandomColor();
        photoArea.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${adjustColorBrightness(baseColor, -20)} 100%)`;
        photoArea.style.borderRadius = '1px';
        photoArea.style.position = 'relative';
        photoArea.style.display = 'flex';
        photoArea.style.alignItems = 'center';
        photoArea.style.justifyContent = 'center';
        
        // SVG icon overlay
        const icon = document.createElement('img');
        icon.src = item.thumbnail;
        icon.alt = item.title;
        icon.style.width = '100%';
        icon.style.height = '100%';
        icon.style.objectFit = 'contain';
        icon.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
        
        photoArea.appendChild(icon);
        colorDiv.appendChild(photoArea);
        
        // Hover effect
        colorDiv.addEventListener('mouseenter', () => {
          colorDiv.style.transform = `rotate(0deg) scale(1.05)`;
          colorDiv.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)';
        });
        colorDiv.addEventListener('mouseleave', () => {
          colorDiv.style.transform = `rotate(${rotation}deg)`;
          colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)';
        });
        
        tile.appendChild(colorDiv);
      } else {
        // Create polaroid-style colored div
        const colorDiv = document.createElement('div');
        colorDiv.style.width = '200px';
        colorDiv.style.height = '200px';
        colorDiv.style.minWidth = '100px';
        colorDiv.style.minHeight = '100px';
        colorDiv.style.flexShrink = '0';
        colorDiv.style.backgroundColor = getRandomColor();
        colorDiv.style.borderRadius = '2px';
        colorDiv.style.padding = '12px';
        colorDiv.style.paddingBottom = '12px';
        colorDiv.style.backgroundColor = '#fff';
        colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)';
        colorDiv.style.marginBottom = '70px';
        
        // Random rotation between -4 and 4 degrees
        const rotation = (1 * (Math.random() * 8 - 4)).toFixed(2);
        colorDiv.style.transform = `rotate(${rotation}deg)`;
        colorDiv.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        
        // Inner colored area (the actual photo part)
        const photoArea = document.createElement('div');
        photoArea.style.width = '100%';
        photoArea.style.height = '100%';
        const baseColor = getRandomColor();
        // Create gradient from lighter top-left to darker bottom-right for depth
        photoArea.style.background = `linear-gradient(135deg, ${baseColor} 0%, ${adjustColorBrightness(baseColor, -50)} 100%)`;
        photoArea.style.borderRadius = '1px';
        
        colorDiv.appendChild(photoArea);
        
        // Hover effect
        colorDiv.addEventListener('mouseenter', () => {
          colorDiv.style.transform = `rotate(0deg) scale(1.05)`;
          colorDiv.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)';
        });
        colorDiv.addEventListener('mouseleave', () => {
          colorDiv.style.transform = `rotate(${rotation}deg)`;
          colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)';
        });
        
        tile.appendChild(colorDiv);
      }

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = item.title;
      title.style.position = 'relative';
      title.style.zIndex = '2';
      tile.appendChild(title);

      innerGrid.appendChild(tile);
    });
    
    grid.appendChild(innerGrid);
  }
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

// Utility function to adjust color brightness (for gradients)
function adjustColorBrightness(color, percent) {
  // Convert hex to RGB
  const num = parseInt(color.replace('#', ''), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00FF) + percent;
  let b = (num & 0x0000FF) + percent;
  
  // Clamp values between 0 and 255
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
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
  
  // change url without reloading the page
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('file', mdUrl);
  history.pushState({}, '', newUrl);

  // Load the markdown file as slides
  loadMarkdownAsSlides(mdUrl);
});