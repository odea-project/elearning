/**
 * Small search UI for the tutorial landing page. Reads the manifest once and
 * then filters client-side to keep navigation snappy.
 */
let mdData = [];
let currentPage = 1;
let filteredData = [];
const ITEMS_PER_PAGE = 12; // 2 pages × 2 columns × 3 rows = 12 items per double page

const grid = document.getElementById('tutorialGrid');
const searchInput = document.getElementById('search');

fetch('resources/misc/md-manifest.json')
  .then(res => res.json())
  .then(data => {
    mdData = data;
    filteredData = data;
    renderGrid(filteredData);
  });

function renderGrid(items) {
  filteredData = items;
  grid.innerHTML = '';
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  if (currentPage > totalPages) currentPage = totalPages;
  
  // Get items for current page
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, items.length);
  const pageItems = items.slice(startIdx, endIdx);
  
  // Create main container with book and bookmarks
  const bookContainer = document.createElement('div');
  bookContainer.style.position = 'relative';
  bookContainer.style.width = '100%';
  
  // Create outer grid container with 2 columns (double page spread)
  const pageContent = document.createElement('div');
  pageContent.style.display = 'grid';
  pageContent.style.gridTemplateColumns = 'repeat(2, 1fr)';
  pageContent.style.gap = '20px';
  pageContent.style.width = '70%';
  pageContent.style.paddingLeft = '13%';
  pageContent.style.paddingTop = '20px';
  pageContent.style.paddingRight = '40px'; // Space for bookmarks
  
  // Split items into groups of 6 (2 columns × 3 rows per page)
  const itemsPerPage = 6;
  let entryCounter = startIdx + 1;

  for (let pageIdx = 0; pageIdx < 2; pageIdx++) {
    const innerGrid = document.createElement('div');
    innerGrid.style.display = 'grid';
    innerGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    innerGrid.style.gridTemplateRows = 'repeat(3, 1fr)';
    innerGrid.style.gap = '15px';
    
    // Get items for this page (6 items max)
    const pageStartIdx = pageIdx * itemsPerPage;
    const pageEndIdx = Math.min(pageStartIdx + itemsPerPage, pageItems.length);
    const columnItems = pageItems.slice(pageStartIdx, pageEndIdx);
    
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

      // Add a tape strip label with the entry number
      const tapeStrip = createTapeStrip(entryCounter++);
      tile.appendChild(tapeStrip);

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
    
    pageContent.appendChild(innerGrid);
  }
  
  bookContainer.appendChild(pageContent);
  
  // Create bookmark tabs container (only if more than one page)
  if (totalPages > 0) {
    const bookmarksContainer = createBookmarkTabs(totalPages, currentPage);
    bookContainer.appendChild(bookmarksContainer);
  }
  
  grid.appendChild(bookContainer);
}

// Create post-it bookmark tabs
function createBookmarkTabs(totalPages, activePage) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '160px';
  container.style.top = '80px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '8px';
  container.style.zIndex = '100';
  
  // Post-it colors for variety
  const postItColors = [
    { bg: 'linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%)', shadow: '#c9a600' },  // Yellow
    { bg: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', shadow: '#b35600' },  // Orange
    { bg: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', shadow: '#1b5e20' },  // Green
    { bg: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', shadow: '#0d47a1' },  // Blue
    { bg: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', shadow: '#880e4f' },  // Pink
    { bg: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', shadow: '#4a148c' },  // Purple
  ];
  
  for (let page = 1; page <= totalPages; page++) {
    const isActive = page === activePage;
    const colorIdx = (page - 1) % postItColors.length;
    const color = postItColors[colorIdx];
    
    const bookmark = document.createElement('div');
    bookmark.className = 'bookmark-tab';
    bookmark.setAttribute('data-page', page);
    
    // Base styles
    bookmark.style.width = isActive ? '55px' : '45px';
    bookmark.style.height = '50px';
    bookmark.style.background = color.bg;
    bookmark.style.borderRadius = '3px 0 0 3px';
    bookmark.style.boxShadow = isActive 
      ? `0 4px 12px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.1)` 
      : `0 2px 6px rgba(0,0,0,0.25), inset -2px 0 4px rgba(0,0,0,0.1)`;
    bookmark.style.display = 'flex';
    bookmark.style.alignItems = 'center';
    bookmark.style.justifyContent = 'center';
    bookmark.style.cursor = 'pointer';
    bookmark.style.transition = 'all 0.25s ease';
    bookmark.style.marginLeft = isActive ? '0' : '10px';
    bookmark.style.position = 'relative';
    bookmark.style.transform = isActive ? 'scale(1.05)' : 'scale(1)';
    
    // Folded corner effect
    const foldedCorner = document.createElement('div');
    foldedCorner.style.position = 'absolute';
    foldedCorner.style.bottom = '0';
    foldedCorner.style.left = '0';
    foldedCorner.style.width = '0';
    foldedCorner.style.height = '0';
    foldedCorner.style.borderStyle = 'solid';
    foldedCorner.style.borderWidth = '8px 8px 0 0';
    foldedCorner.style.borderColor = `${color.shadow} transparent transparent transparent`;
    foldedCorner.style.transform = 'rotate(180deg)';
    bookmark.appendChild(foldedCorner);
    
    // Page number
    const pageNum = document.createElement('span');
    pageNum.textContent = page;
    pageNum.style.fontWeight = 'bold';
    pageNum.style.fontSize = isActive ? '20px' : '16px';
    pageNum.style.color = '#333';
    pageNum.style.textShadow = '0 1px 1px rgba(255,255,255,0.5)';
    pageNum.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    bookmark.appendChild(pageNum);
    
    // Hover effects
    bookmark.addEventListener('mouseenter', () => {
      if (!isActive) {
        bookmark.style.width = '60px';
        bookmark.style.marginLeft = '-5px';
        bookmark.style.transformOrigin = 'right center';
        bookmark.style.transform = 'scaleX(1.08)';
        bookmark.style.boxShadow = `0 6px 16px rgba(0,0,0,0.35), inset -2px 0 4px rgba(0,0,0,0.1)`;
      }
    });
    
    bookmark.addEventListener('mouseleave', () => {
      if (!isActive) {
        bookmark.style.width = '45px';
        bookmark.style.marginLeft = '10px';
        bookmark.style.transform = 'scale(1)';
        bookmark.style.boxShadow = `0 2px 6px rgba(0,0,0,0.25), inset -2px 0 4px rgba(0,0,0,0.1)`;
      }
    });
    
    // Click to change page
    bookmark.addEventListener('click', () => {
      if (page !== currentPage) {
        currentPage = page;
        renderGrid(filteredData);
      }
    });
    
    container.appendChild(bookmark);
  }
  
  return container;
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

// Create a tape strip element with random placement and rotation
function createTapeStrip(number) {
  const tape = document.createElement('div');
  const side = Math.random() < 0.5 ? 'left' : 'right';
  const angle = Math.random() * (55 - 35) + 35;

  tape.textContent = number;
  tape.style.position = 'absolute';
  tape.style.top = '15px';
  tape.style[side] = '5px';
  tape.style.padding = '6px 24px';
  tape.style.background = 'linear-gradient(120deg, rgba(255, 248, 189, 0.92) 0%, rgba(235, 223, 150, 0.88) 100%)';
  tape.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.25)';
  tape.style.transform = `rotate(${side === 'left' ? -angle : angle}deg)`;
  tape.style.transformOrigin = 'center';
  tape.style.fontWeight = '600';
  tape.style.fontSize = '16px';
  tape.style.color = '#4a3f2b';
  tape.style.borderRadius = '3px';
  tape.style.letterSpacing = '1px';
  tape.style.textAlign = 'center';
  tape.style.pointerEvents = 'none';
  tape.style.zIndex = '5';

  return tape;
}


searchInput.addEventListener('input', () => {
  const val = searchInput.value.toLowerCase().trim();
  currentPage = 1; // Reset to first page on search
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
  loadMarkdownAsSlides(mdUrl, { resetToFirstSlide: true });
});
