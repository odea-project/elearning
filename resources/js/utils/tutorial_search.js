/**
 * Small search UI for the tutorial landing page. Reads the manifest once and
 * then filters client-side to keep navigation snappy.
 */
let mdData = [];
let currentPage = 1;
let filteredData = [];
let activeCategory = 'tutorials';
const ITEMS_PER_PAGE = 12; // 2 pages × 2 columns × 3 rows = 12 items per double page

const CATEGORY_CONFIG = {
  tutorials: {
    label: 'Teaching Decks',
    shortLabel: 'Teach',
    accent: '#304ffe',
    tabBackground: 'linear-gradient(135deg, #9fa8ff 0%, #6573ff 100%)',
    tabShadow: '#2433b5',
    emptyTitle: 'No teaching decks found',
    emptyHint: 'Adjust the search terms or switch to Research Talks.'
  },
  'research-talks': {
    label: 'Research Talks',
    shortLabel: 'Research',
    accent: '#d84315',
    tabBackground: 'linear-gradient(135deg, #ffb08f 0%, #ff7043 100%)',
    tabShadow: '#a12d08',
    emptyTitle: 'No research talks found',
    emptyHint: 'Add entries with category "research-talks" to the manifest.'
  }
};

const PAGE_TAB_COLORS = [
  { bg: 'linear-gradient(135deg, #ffeb3b 0%, #fdd835 100%)', shadow: '#c9a600' },
  { bg: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', shadow: '#b35600' },
  { bg: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)', shadow: '#1b5e20' },
  { bg: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', shadow: '#0d47a1' },
  { bg: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', shadow: '#880e4f' },
  { bg: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', shadow: '#4a148c' }
];

const grid = document.getElementById('tutorialGrid');
const searchInput = document.getElementById('search');

fetch('resources/misc/md-manifest.json')
  .then(res => res.json())
  .then(data => {
    mdData = normalizeManifest(data);
    ensureValidCategory();
    renderCurrentView();
  });

function normalizeManifest(items) {
  return items.map(item => ({
    ...item,
    category: normalizeCategory(item.category)
  }));
}

function normalizeCategory(category) {
  const normalized = String(category || '').trim().toLowerCase();
  if (!normalized) return 'tutorials';
  if (['research', 'research-talk', 'research-talks', 'research_talks'].includes(normalized)) {
    return 'research-talks';
  }
  return 'tutorials';
}

function ensureValidCategory() {
  const counts = getCategoryCounts();
  if ((counts[activeCategory] || 0) > 0) return;

  const nextCategory = Object.keys(CATEGORY_CONFIG).find(category => (counts[category] || 0) > 0);
  activeCategory = nextCategory || 'tutorials';
}

function getCategoryCounts() {
  return mdData.reduce((counts, item) => {
    const category = normalizeCategory(item.category);
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, { tutorials: 0, 'research-talks': 0 });
}

function getSearchTerms() {
  const value = searchInput.value.toLowerCase().trim();
  return value ? value.split(/\s+/) : [];
}

function getFilteredItems() {
  const terms = getSearchTerms();

  return mdData.filter(item => {
    if (normalizeCategory(item.category) !== activeCategory) return false;
    if (!terms.length) return true;

    const haystack = [
      item.title || '',
      item.description || '',
      (item.keywords || []).join(' '),
      (item.requirements || []).join(' ')
    ].join(' ').toLowerCase();

    return terms.every(term => haystack.includes(term));
  });
}

function renderCurrentView() {
  filteredData = getFilteredItems();
  renderGrid(filteredData);
  updateSearchPlaceholder();
}

function updateSearchPlaceholder() {
  const category = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG.tutorials;
  searchInput.placeholder = `Filter ${category.label.toLowerCase()} by keyword(s)...`;
}

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

  const categoryBadge = createCategoryBadge(items.length);
  bookContainer.appendChild(categoryBadge);

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

    if (columnItems.length === 0 && items.length === 0 && pageIdx === 0) {
      innerGrid.appendChild(createEmptyState());
      pageContent.appendChild(innerGrid);
      continue;
    }
    
    columnItems.forEach(item => {
      innerGrid.appendChild(createTopicTile(item, entryCounter++));
    });
    
    pageContent.appendChild(innerGrid);
  }
  
  bookContainer.appendChild(pageContent);
  bookContainer.appendChild(createCategoryTabs(getCategoryCounts(), activeCategory));
  
  // Create bookmark tabs container (only if more than one page)
  if (totalPages > 0) {
    const bookmarksContainer = createPageTabs(totalPages, currentPage);
    bookContainer.appendChild(bookmarksContainer);
  }
  
  grid.appendChild(bookContainer);
}

function createCategoryBadge(itemCount) {
  const category = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG.tutorials;
  const badge = document.createElement('div');
  badge.style.position = 'absolute';
  badge.style.top = '6px';
  badge.style.left = '50%';
  badge.style.transform = 'translateX(-50%)';
  badge.style.padding = '10px 18px';
  badge.style.borderRadius = '999px';
  badge.style.background = 'rgba(255, 248, 228, 0.92)';
  badge.style.boxShadow = '0 8px 18px rgba(0, 0, 0, 0.18)';
  badge.style.border = `2px solid ${category.accent}`;
  badge.style.fontFamily = "'Segoe UI', Arial, sans-serif";
  badge.style.fontSize = '14px';
  badge.style.fontWeight = '700';
  badge.style.letterSpacing = '0.08em';
  badge.style.textTransform = 'uppercase';
  badge.style.color = '#31261c';
  badge.textContent = `${category.label} · ${itemCount}`;
  return badge;
}

function createEmptyState() {
  const category = CATEGORY_CONFIG[activeCategory] || CATEGORY_CONFIG.tutorials;
  const emptyState = document.createElement('div');
  emptyState.style.gridColumn = '1 / span 2';
  emptyState.style.display = 'flex';
  emptyState.style.flexDirection = 'column';
  emptyState.style.justifyContent = 'center';
  emptyState.style.alignItems = 'center';
  emptyState.style.minHeight = '540px';
  emptyState.style.marginTop = '20px';
  emptyState.style.padding = '30px';
  emptyState.style.textAlign = 'center';

  const card = document.createElement('div');
  card.style.maxWidth = '340px';
  card.style.padding = '28px 26px';
  card.style.background = 'rgba(255, 252, 242, 0.95)';
  card.style.border = `2px dashed ${category.accent}`;
  card.style.borderRadius = '18px';
  card.style.boxShadow = '0 10px 24px rgba(0, 0, 0, 0.14)';

  const title = document.createElement('div');
  title.textContent = category.emptyTitle;
  title.style.fontSize = '24px';
  title.style.fontWeight = '700';
  title.style.color = '#38291d';
  title.style.marginBottom = '12px';

  const hint = document.createElement('div');
  hint.textContent = category.emptyHint;
  hint.style.fontSize = '15px';
  hint.style.lineHeight = '1.5';
  hint.style.color = '#5a4a3a';

  card.appendChild(title);
  card.appendChild(hint);
  emptyState.appendChild(card);
  return emptyState;
}

function createTopicTile(item, entryNumber) {
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

  tile.appendChild(createTapeStrip(entryNumber));
  tile.appendChild(createPolaroid(item));

  const title = document.createElement('div');
  title.className = 'title';
  title.textContent = item.title;
  title.style.position = 'relative';
  title.style.zIndex = '2';
  tile.appendChild(title);

  return tile;
}

function createPolaroid(item) {
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

  const rotation = getRotation(item.title || item.filename || 'tile');
  colorDiv.style.transform = `rotate(${rotation}deg)`;
  colorDiv.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';

  const photoArea = document.createElement('div');
  photoArea.style.width = '100%';
  photoArea.style.height = '100%';
  photoArea.style.background = getTileGradient(item);
  photoArea.style.borderRadius = '1px';
  photoArea.style.position = 'relative';
  photoArea.style.display = 'flex';
  photoArea.style.alignItems = 'center';
  photoArea.style.justifyContent = 'center';

  if (item.thumbnail) {
    const icon = document.createElement('img');
    icon.src = item.thumbnail;
    icon.alt = item.title;
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.style.objectFit = 'contain';
    icon.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))';
    photoArea.appendChild(icon);
  } else {
    const fallbackLabel = document.createElement('span');
    fallbackLabel.textContent = (CATEGORY_CONFIG[normalizeCategory(item.category)] || CATEGORY_CONFIG.tutorials).shortLabel;
    fallbackLabel.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    fallbackLabel.style.fontWeight = '700';
    fallbackLabel.style.fontSize = '22px';
    fallbackLabel.style.letterSpacing = '0.12em';
    fallbackLabel.style.textTransform = 'uppercase';
    fallbackLabel.style.color = 'rgba(255, 255, 255, 0.86)';
    photoArea.appendChild(fallbackLabel);
  }

  colorDiv.addEventListener('mouseenter', () => {
    colorDiv.style.transform = 'rotate(0deg) scale(1.05)';
    colorDiv.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.3)';
  });
  colorDiv.addEventListener('mouseleave', () => {
    colorDiv.style.transform = `rotate(${rotation}deg)`;
    colorDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)';
  });

  colorDiv.appendChild(photoArea);
  return colorDiv;
}

function getRotation(seed) {
  const hash = hashString(seed);
  const offset = (hash % 9) - 4;
  return offset.toFixed(2);
}

function getTileGradient(item) {
  const category = normalizeCategory(item.category);
  const categoryAccent = (CATEGORY_CONFIG[category] || CATEGORY_CONFIG.tutorials).accent;
  const baseColor = getDeterministicColor(`${categoryAccent}:${item.title || item.filename || ''}`);
  return `linear-gradient(135deg, ${adjustColorBrightness(baseColor, 18)} 0%, ${adjustColorBrightness(baseColor, -36)} 100%)`;
}

function createTabWear(seed, options = {}) {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.inset = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.borderRadius = options.borderRadius || 'inherit';
  overlay.style.opacity = options.opacity || '1';
  overlay.style.background = `
    linear-gradient(${110 + (hashString(seed + '-sheen') % 25)}deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.08) 26%, rgba(83,52,35,0.09) 68%, rgba(42,27,19,0.18) 100%),
    radial-gradient(circle at ${18 + (hashString(seed + '-spot-a') % 58)}% ${14 + (hashString(seed + '-spot-b') % 52)}%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 34%),
    radial-gradient(circle at ${56 + (hashString(seed + '-spot-c') % 26)}% ${48 + (hashString(seed + '-spot-d') % 28)}%, rgba(95,58,34,0.18) 0%, rgba(95,58,34,0) 42%)`;

  const crease = document.createElement('div');
  crease.style.position = 'absolute';
  crease.style.top = '7px';
  crease.style.bottom = '7px';
  crease.style.width = '2px';
  crease.style.left = `${20 + (hashString(seed + '-crease') % 62)}%`;
  crease.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(92,60,40,0.2) 50%, rgba(255,255,255,0.12) 100%)';
  crease.style.opacity = '0.55';
  crease.style.transform = `rotate(${((hashString(seed + '-crease-rot') % 5) - 2)}deg)`;

  const scuff = document.createElement('div');
  scuff.style.position = 'absolute';
  scuff.style.width = options.scuffWidth || '18px';
  scuff.style.height = options.scuffHeight || '62%';
  scuff.style.top = '18%';
  scuff.style.right = options.scuffSide === 'left' ? 'auto' : '-2px';
  scuff.style.left = options.scuffSide === 'left' ? '-2px' : 'auto';
  scuff.style.background = 'linear-gradient(90deg, rgba(70,44,30,0.18) 0%, rgba(255,255,255,0.16) 38%, rgba(255,255,255,0) 100%)';
  scuff.style.opacity = '0.7';
  scuff.style.filter = 'blur(0.3px)';

  const nick = document.createElement('div');
  nick.style.position = 'absolute';
  nick.style.width = options.nickWidth || '14px';
  nick.style.height = options.nickHeight || '8px';
  nick.style.bottom = `${6 + (hashString(seed + '-nick-y') % 10)}px`;
  nick.style.left = `${10 + (hashString(seed + '-nick-x') % 46)}%`;
  nick.style.background = 'rgba(94,58,36,0.22)';
  nick.style.borderRadius = '999px';
  nick.style.filter = 'blur(1px)';
  nick.style.opacity = '0.55';

  overlay.appendChild(crease);
  overlay.appendChild(scuff);
  overlay.appendChild(nick);
  return overlay;
}

function createCategoryTabs(categoryCounts, currentCategory) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.right = '195px';
  container.style.top = '110px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '14px';
  container.style.zIndex = '120';

  Object.entries(CATEGORY_CONFIG).forEach(([categoryKey, config]) => {
    const isActive = categoryKey === currentCategory;
    const wearSeed = `${categoryKey}-${isActive ? 'active' : 'idle'}`;
    const tab = document.createElement('div');
    tab.className = 'category-tab';
    tab.setAttribute('data-category', categoryKey);
    tab.style.width = isActive ? '122px' : '106px';
    tab.style.minHeight = '78px';
    tab.style.padding = '12px 14px';
    tab.style.background = config.tabBackground;
    tab.style.borderRadius = '1px 11px 14px 3px';
    tab.style.boxShadow = isActive
      ? '0 10px 20px rgba(0, 0, 0, 0.28), inset -5px 0 8px rgba(84, 52, 33, 0.12), inset 0 1px 0 rgba(255,255,255,0.35)'
      : '0 5px 10px rgba(0, 0, 0, 0.22), inset -4px 0 7px rgba(84, 52, 33, 0.12), inset 0 1px 0 rgba(255,255,255,0.26)';
    tab.style.marginRight = isActive ? '0' : '12px';
    tab.style.cursor = 'pointer';
    tab.style.transition = 'all 0.25s ease';
    tab.style.display = 'flex';
    tab.style.flexDirection = 'column';
    tab.style.justifyContent = 'space-between';
    tab.style.gap = '8px';
    tab.style.fontFamily = "'Segoe UI', Arial, sans-serif";
    tab.style.position = 'relative';
    tab.style.overflow = 'hidden';
    tab.style.borderTop = '1px solid rgba(255,255,255,0.34)';
    tab.style.borderLeft = '1px solid rgba(255,255,255,0.18)';
    tab.style.borderBottom = '1px solid rgba(88, 52, 31, 0.2)';
    tab.style.transform = `rotate(${((hashString(wearSeed + '-rot') % 5) - 2) * 0.35}deg)`;

    const title = document.createElement('span');
    title.textContent = config.shortLabel;
    title.style.fontSize = isActive ? '18px' : '16px';
    title.style.fontWeight = '800';
    title.style.color = '#2c1d15';
    title.style.lineHeight = '1.1';
    title.style.textShadow = '0 1px 0 rgba(255,255,255,0.22)';
    title.style.transform = `rotate(${((hashString(wearSeed + '-text') % 5) - 2) * 0.18}deg)`;

    const count = document.createElement('span');
    count.textContent = `${categoryCounts[categoryKey] || 0}`;
    count.style.alignSelf = 'flex-end';
    count.style.padding = '4px 9px';
    count.style.borderRadius = '999px';
    count.style.background = 'rgba(255, 250, 236, 0.72)';
    count.style.fontSize = '13px';
    count.style.fontWeight = '700';
    count.style.color = '#47362b';
    count.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.28), 0 1px 3px rgba(74, 46, 29, 0.16)';

    const wearLayer = createTabWear(wearSeed, {
      borderRadius: '1px 11px 14px 3px',
      scuffSide: 'right',
      scuffWidth: '22px',
      nickWidth: '18px'
    });

    tab.addEventListener('mouseenter', () => {
      if (!isActive) {
        tab.style.width = '120px';
        tab.style.marginRight = '0';
        tab.style.transform = 'rotate(0.2deg) translateX(-2px)';
      }
    });

    tab.addEventListener('mouseleave', () => {
      if (!isActive) {
        tab.style.width = '106px';
        tab.style.marginRight = '12px';
        tab.style.transform = `rotate(${((hashString(wearSeed + '-rot') % 5) - 2) * 0.35}deg)`;
      }
    });

    tab.addEventListener('click', () => {
      if (categoryKey !== activeCategory) {
        activeCategory = categoryKey;
        currentPage = 1;
        renderCurrentView();
      }
    });

    tab.appendChild(wearLayer);
    tab.appendChild(title);
    tab.appendChild(count);
    container.appendChild(tab);
  });

  return container;
}

// Create post-it bookmark tabs
function createPageTabs(totalPages, activePage) {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '160px';
  container.style.top = '80px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '8px';
  container.style.zIndex = '100';
  
  for (let page = 1; page <= totalPages; page++) {
    const isActive = page === activePage;
    const colorIdx = (page - 1) % PAGE_TAB_COLORS.length;
    const color = PAGE_TAB_COLORS[colorIdx];
    const wearSeed = `page-tab-${page}-${isActive ? 'active' : 'idle'}`;
    
    const bookmark = document.createElement('div');
    bookmark.className = 'bookmark-tab';
    bookmark.setAttribute('data-page', page);
    
    // Base styles
    bookmark.style.width = isActive ? '55px' : '45px';
    bookmark.style.height = '50px';
    bookmark.style.background = color.bg;
    bookmark.style.borderRadius = '4px 0 0 2px';
    bookmark.style.boxShadow = isActive 
      ? `0 4px 12px rgba(0,0,0,0.4), inset -2px 0 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.28)` 
      : `0 2px 6px rgba(0,0,0,0.25), inset -2px 0 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.24)`;
    bookmark.style.display = 'flex';
    bookmark.style.alignItems = 'center';
    bookmark.style.justifyContent = 'center';
    bookmark.style.cursor = 'pointer';
    bookmark.style.transition = 'all 0.25s ease';
    bookmark.style.marginLeft = isActive ? '0' : '10px';
    bookmark.style.position = 'relative';
    bookmark.style.transform = isActive ? `scale(1.05) rotate(${((hashString(wearSeed) % 5) - 2) * 0.4}deg)` : `scale(1) rotate(${((hashString(wearSeed) % 7) - 3) * 0.45}deg)`;
    bookmark.style.overflow = 'hidden';
    bookmark.style.borderTop = '1px solid rgba(255,255,255,0.3)';
    bookmark.style.borderBottom = '1px solid rgba(91,54,31,0.18)';
    
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
    pageNum.style.transform = `rotate(${((hashString(wearSeed + '-text') % 5) - 2) * 0.25}deg)`;

    const wearLayer = createTabWear(wearSeed, {
      borderRadius: '4px 0 0 2px',
      scuffSide: 'left',
      scuffWidth: '16px',
      scuffHeight: '72%',
      nickWidth: '10px',
      nickHeight: '6px'
    });

    const topFade = document.createElement('div');
    topFade.style.position = 'absolute';
    topFade.style.top = '0';
    topFade.style.left = '0';
    topFade.style.right = '0';
    topFade.style.height = '10px';
    topFade.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 100%)';
    topFade.style.pointerEvents = 'none';
    bookmark.appendChild(pageNum);
    bookmark.appendChild(wearLayer);
    bookmark.appendChild(topFade);
    
    // Hover effects
    bookmark.addEventListener('mouseenter', () => {
      if (!isActive) {
        bookmark.style.width = '60px';
        bookmark.style.marginLeft = '-5px';
        bookmark.style.transformOrigin = 'right center';
        bookmark.style.transform = 'scaleX(1.08) rotate(-0.4deg)';
        bookmark.style.boxShadow = `0 6px 16px rgba(0,0,0,0.35), inset -2px 0 4px rgba(0,0,0,0.1)`;
      }
    });
    
    bookmark.addEventListener('mouseleave', () => {
      if (!isActive) {
        bookmark.style.width = '45px';
        bookmark.style.marginLeft = '10px';
        bookmark.style.transform = `scale(1) rotate(${((hashString(wearSeed) % 7) - 3) * 0.45}deg)`;
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

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getDeterministicColor(seed) {
  return '#' + (hashString(seed) % 0xFFFFFF).toString(16).padStart(6, '0');
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
  currentPage = 1; // Reset to first page on search
  renderCurrentView();
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
