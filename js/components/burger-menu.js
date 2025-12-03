/**
 * Burger Menu System
 * Consolidates overlay buttons (Notes, Performance Mode, PDF Export) into a single menu
 */

class BurgerMenu {
  constructor() {
    this.isOpen = false;
    this.timerInterval = null;
    this.remainingSeconds = 0;
    this.timerElements = {};
    this.bookmarks = [];
    this.BOOKMARKS_KEY = 'revealjs-bookmarks';
    this.init();
  }

  init() {
    this.loadBookmarks();
    this.createBurgerButton();
    this.createNavigationButtons();
    this.createMenu();
    this.createTimerConfigModal();
    this.createBookmarksOverlay();
    this.attachEventListeners();
    this.hideOriginalButtons();
    
    // Wait for other systems to initialize
    setTimeout(() => this.updateMenuItems(), 500);
  }

  createBurgerButton() {
    const button = document.createElement('button');
    button.id = 'burger-menu-button';
    button.className = 'burger-menu-button';
    button.setAttribute('aria-label', 'Open menu');
    button.innerHTML = `
      <span class="burger-line"></span>
      <span class="burger-line"></span>
      <span class="burger-line"></span>
    `;
    document.body.appendChild(button);
  }

  createNavigationButtons() {
    const container = document.createElement('div');
    container.id = 'nav-buttons-container';
    container.className = 'nav-buttons-container';
    container.innerHTML = `
      <button id="nav-home-btn" class="nav-button" aria-label="Home - Save bookmark and go to chapter selection" title="Home">
        <i class="fas fa-home"></i>
      </button>
      <button id="nav-bookmark-btn" class="nav-button" aria-label="Save current slide as bookmark" title="Save Bookmark">
        <i class="fas fa-bookmark"></i>
      </button>
      <button id="nav-goto-btn" class="nav-button" aria-label="Go to saved bookmarks" title="View Bookmarks">
        <i class="fas fa-th-large"></i>
      </button>
    `;
    document.body.appendChild(container);
    
    // Attach navigation button events
    document.getElementById('nav-home-btn').addEventListener('click', () => this.handleHomeClick());
    document.getElementById('nav-bookmark-btn').addEventListener('click', () => this.handleBookmarkClick());
    document.getElementById('nav-goto-btn').addEventListener('click', () => this.handleGotoBookmarksClick());
  }

  createMenu() {
    const menu = document.createElement('div');
    menu.id = 'burger-menu';
    menu.className = 'burger-menu';
    menu.innerHTML = `
      <div class="burger-menu-header">
        <h3>Options</h3>
      </div>
      <div class="burger-menu-content">
        <div class="burger-menu-item" data-action="notes">
          <i class="fas fa-sticky-note"></i>
          <span>Notes</span>
          <span class="menu-item-badge" id="notes-badge"></span>
        </div>
        <div class="burger-menu-item" data-action="performance">
          <i class="fas fa-bolt"></i>
          <span>Performance Mode</span>
          <span class="menu-item-toggle" id="performance-toggle"></span>
        </div>
        <div class="burger-menu-item" data-action="timer">
          <i class="fas fa-hourglass-half"></i>
          <span>Add Timer</span>
        </div>
        <div class="burger-menu-item" data-action="pdf">
          <i class="fas fa-file-pdf"></i>
          <span>Export PDF</span>
        </div>
      </div>
    `;
    document.body.appendChild(menu);
  }

  attachEventListeners() {
    const button = document.getElementById('burger-menu-button');
    const menu = document.getElementById('burger-menu');
    const menuItems = menu.querySelectorAll('.burger-menu-item');

    // Toggle menu on burger button click
    button.addEventListener('click', () => this.toggle());

    // Close on overlay click
    menu.addEventListener('click', (e) => {
      if (e.target === menu) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Menu item actions
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const action = item.dataset.action;
        this.handleAction(action);
      });
    });

    // Update menu state periodically
    setInterval(() => this.updateMenuItems(), 1000);
  }

  hideOriginalButtons() {
    // Hide the original buttons via CSS
    const style = document.createElement('style');
    style.textContent = `
      #notes-toggle-btn,
      #performance-mode-toggle-btn,
      #pdf-export-button {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  handleAction(action) {
    switch(action) {
      case 'notes':
        // Trigger notes toggle
        const notesBtn = document.getElementById('notes-toggle-btn');
        if (notesBtn) {
          notesBtn.click();
          this.close();
        }
        break;
      
      case 'performance':
        // Trigger performance mode toggle
        const perfBtn = document.getElementById('performance-mode-toggle-btn');
        if (perfBtn) {
          perfBtn.click();
        }
        // Don't close menu for toggle actions
        break;

      case 'timer':
        // Open timer configuration dialog
        this.showTimerConfigModal();
        this.close();
        break;
      
      case 'pdf':
        // Trigger PDF export
        if (typeof PDFExport !== 'undefined' && PDFExport.export16x9) {
          PDFExport.export16x9();
          this.close();
        }
        break;
    }
  }

  createTimerConfigModal() {
    const overlay = document.createElement('div');
    overlay.id = 'timer-config-overlay';
    overlay.className = 'timer-config-overlay';
    overlay.innerHTML = `
      <div class="timer-config-dialog">
        <div class="timer-config-header">
          <h4>Add Timer</h4>
          <button class="timer-config-close" aria-label="Close timer setup">&times;</button>
        </div>
        <div class="timer-config-body">
          <label class="timer-config-label">
            <span>Time (minutes)</span>
            <input type="number" id="timer-minutes-input" min="1" step="1" value="5" />
          </label>
          <label class="timer-config-checkbox">
            <input type="checkbox" id="timer-blur-input" checked />
            <span>Blur background while timer runs</span>
          </label>
          <div class="timer-config-error" id="timer-config-error"></div>
        </div>
        <div class="timer-config-actions">
          <button class="timer-config-cancel">Cancel</button>
          <button class="timer-config-start">Start timer</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    this.timerElements = {
      configOverlay: overlay,
      minutesInput: overlay.querySelector('#timer-minutes-input'),
      blurInput: overlay.querySelector('#timer-blur-input'),
      error: overlay.querySelector('#timer-config-error'),
      startBtn: overlay.querySelector('.timer-config-start'),
      cancelBtn: overlay.querySelector('.timer-config-cancel'),
      closeBtn: overlay.querySelector('.timer-config-close'),
      timerContainer: null,
      timerBackdrop: null,
      timerDisplay: null
    };

    const hideHandler = () => this.hideTimerConfigModal();

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        hideHandler();
      }
    });
    this.timerElements.cancelBtn.addEventListener('click', hideHandler);
    this.timerElements.closeBtn.addEventListener('click', hideHandler);
    this.timerElements.startBtn.addEventListener('click', () => this.startTimerFromConfig());
  }

  showTimerConfigModal() {
    if (!this.timerElements?.configOverlay) return;
    this.timerElements.error.textContent = '';
    this.timerElements.configOverlay.classList.add('visible');
    setTimeout(() => {
      this.timerElements.minutesInput.focus();
      this.timerElements.minutesInput.select();
    }, 10);
  }

  hideTimerConfigModal() {
    if (this.timerElements?.configOverlay) {
      this.timerElements.configOverlay.classList.remove('visible');
    }
  }

  startTimerFromConfig() {
    if (!this.timerElements) return;
    const minutesValue = parseFloat(this.timerElements.minutesInput.value);
    const blur = this.timerElements.blurInput.checked;

    if (!minutesValue || minutesValue <= 0) {
      this.timerElements.error.textContent = 'Please enter a number of minutes greater than 0.';
      return;
    }

    this.timerElements.error.textContent = '';
    this.hideTimerConfigModal();
    this.startTimer(Math.round(minutesValue * 60), blur);
  }

  startTimer(totalSeconds, blurBackground) {
    this.clearTimer();
    if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return;

    this.remainingSeconds = totalSeconds;

    const timerDisplay = document.createElement('div');
    timerDisplay.className = 'timer-display';
    timerDisplay.textContent = this.formatTime(this.remainingSeconds);

    const closeButton = document.createElement('button');
    closeButton.className = 'timer-close-button';
    closeButton.setAttribute('aria-label', 'Close timer');
    closeButton.textContent = '×';
    closeButton.addEventListener('click', () => this.clearTimer());

    const timerContainer = document.createElement('div');
    timerContainer.className = `timer-container ${blurBackground ? 'timer-center' : 'timer-top'}`;
    timerContainer.appendChild(closeButton);
    timerContainer.appendChild(timerDisplay);

    if (blurBackground) {
      const backdrop = document.createElement('div');
      backdrop.className = 'timer-backdrop';
      backdrop.appendChild(timerContainer);
      document.body.appendChild(backdrop);
      this.timerElements.timerBackdrop = backdrop;
    } else {
      document.body.appendChild(timerContainer);
    }

    this.timerElements.timerContainer = timerContainer;
    this.timerElements.timerDisplay = timerDisplay;
    this.timerInterval = setInterval(() => this.tickTimer(), 1000);
  }

  tickTimer() {
    if (this.remainingSeconds <= 0) {
      this.clearTimer();
      return;
    }

    this.remainingSeconds -= 1;
    if (this.timerElements?.timerDisplay) {
      this.timerElements.timerDisplay.textContent = this.formatTime(this.remainingSeconds);
    }
  }

  formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  clearTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    if (this.timerElements?.timerContainer && this.timerElements.timerContainer.parentNode) {
      this.timerElements.timerContainer.parentNode.removeChild(this.timerElements.timerContainer);
    }

    if (this.timerElements?.timerBackdrop && this.timerElements.timerBackdrop.parentNode) {
      this.timerElements.timerBackdrop.parentNode.removeChild(this.timerElements.timerBackdrop);
    }

    this.timerElements.timerContainer = null;
    this.timerElements.timerBackdrop = null;
    this.timerElements.timerDisplay = null;
    this.remainingSeconds = 0;
  }

  // ==================== BOOKMARK SYSTEM ====================
  
  loadBookmarks() {
    try {
      const stored = localStorage.getItem(this.BOOKMARKS_KEY);
      this.bookmarks = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading bookmarks:', e);
      this.bookmarks = [];
    }
  }

  saveBookmarks() {
    try {
      localStorage.setItem(this.BOOKMARKS_KEY, JSON.stringify(this.bookmarks));
    } catch (e) {
      console.error('Error saving bookmarks:', e);
    }
  }

  getCurrentSlideInfo() {
    const url = window.location.href;
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file') || '';
    const hash = window.location.hash || '';
    
    // Extract chapter from file parameter
    let chapter = '';
    const fileMatch = file.match(/topics%2F([^.]+)\.md|topics\/([^.]+)\.md/);
    if (fileMatch) {
      chapter = fileMatch[1] || fileMatch[2];
    }
    
    // Get slide title from current slide
    let title = 'Untitled Slide';
    const currentSlide = document.querySelector('.reveal .slides section.present');
    if (currentSlide) {
      const h2 = currentSlide.querySelector('h2');
      const h3 = currentSlide.querySelector('h3');
      const h1 = currentSlide.querySelector('h1');
      if (h2) title = h2.textContent.trim();
      else if (h3) title = h3.textContent.trim();
      else if (h1) title = h1.textContent.trim();
    }
    
    // Get slide ID for unique identification
    const slideId = currentSlide?.id || hash.replace('#/', '');
    
    return {
      url: url,
      file: file,
      chapter: chapter,
      hash: hash,
      title: title,
      slideId: slideId,
      timestamp: Date.now()
    };
  }

  async captureSlideThumb() {
    // Capture actual slide screenshot using html2canvas
    try {
      const currentSlide = document.querySelector('.reveal .slides section.present');
      if (!currentSlide) return null;
      
      // Check if html2canvas is available
      if (typeof html2canvas === 'undefined') {
        console.log('html2canvas not available');
        return null;
      }
      
      // Get the slide's background color
      const bgColor = getComputedStyle(document.documentElement).getPropertyValue('--r-background-color')?.trim() || '#1a1a2e';
      
      // Capture the slide with lower scale for speed
      // Performance mode is only applied to the CLONE, not the real DOM
      const canvas = await html2canvas(currentSlide, {
        scale: 0.25,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: bgColor,
        imageTimeout: 0,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Apply performance mode ONLY to clone (no animations, simpler rendering)
          clonedDoc.body.classList.add('performance-mode');
          
          // Style the cloned slide for clean capture
          const clonedSlide = clonedDoc.querySelector('.reveal .slides section.present');
          if (clonedSlide) {
            clonedSlide.style.cssText = 'transform:none;opacity:1;position:relative;top:0;left:0;margin:0;padding:20px;display:block;visibility:visible;';
          }
          
          // Hide UI elements in clone
          const hideSelectors = ['.burger-menu-button', '.nav-buttons-container', '.reveal .controls', '.reveal .progress'];
          hideSelectors.forEach(sel => {
            clonedDoc.querySelectorAll(sel).forEach(el => el.style.display = 'none');
          });
        }
      });
      
      // Resize to thumbnail dimensions
      const thumbCanvas = document.createElement('canvas');
      const ctx = thumbCanvas.getContext('2d');
      thumbCanvas.width = 200;
      thumbCanvas.height = 120;
      
      // Fill with background color first
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, thumbCanvas.width, thumbCanvas.height);
      
      // Calculate scaling to fit the entire slide into thumbnail
      const scale = Math.min(thumbCanvas.width / canvas.width, thumbCanvas.height / canvas.height);
      const destWidth = canvas.width * scale;
      const destHeight = canvas.height * scale;
      const destX = (thumbCanvas.width - destWidth) / 2;
      const destY = (thumbCanvas.height - destHeight) / 2;
      
      // Draw the entire canvas scaled to fit
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, destX, destY, destWidth, destHeight);
      
      return thumbCanvas.toDataURL('image/jpeg', 0.6);
    } catch (e) {
      console.log('Thumbnail capture error:', e);
      return null;
    }
  }

  async addBookmark(goHome = false) {
    const slideInfo = this.getCurrentSlideInfo();
    
    // Show immediate feedback
    const btn = document.getElementById('nav-bookmark-btn');
    btn.classList.add('bookmark-saved');
    
    // Check if bookmark already exists
    const existingIndex = this.bookmarks.findIndex(b => 
      b.file === slideInfo.file && b.hash === slideInfo.hash
    );
    
    if (existingIndex >= 0) {
      // Update existing bookmark - don't re-capture thumbnail
      this.bookmarks[existingIndex] = {
        ...this.bookmarks[existingIndex],
        ...slideInfo,
        timestamp: Date.now()
      };
      this.showNotification('Bookmark updated: ' + slideInfo.title);
      this.saveBookmarks();
    } else {
      // Show notification immediately, capture thumbnail in background
      this.showNotification('Bookmark saved: ' + slideInfo.title);
      
      // Add bookmark immediately with placeholder
      const bookmarkId = 'bm-' + Date.now();
      const newBookmark = {
        ...slideInfo,
        thumbnail: null,
        id: bookmarkId
      };
      this.bookmarks.push(newBookmark);
      this.saveBookmarks();
      
      // Capture thumbnail asynchronously (non-blocking)
      this.captureSlideThumb().then(thumbnail => {
        const idx = this.bookmarks.findIndex(b => b.id === bookmarkId);
        if (idx >= 0 && thumbnail) {
          this.bookmarks[idx].thumbnail = thumbnail;
          this.saveBookmarks();
          // Update overlay if visible
          if (document.getElementById('bookmarks-overlay')?.classList.contains('visible')) {
            this.updateBookmarksOverlay();
          }
        }
      });
    }
    
    setTimeout(() => btn.classList.remove('bookmark-saved'), 600);
    
    if (goHome) {
      setTimeout(() => {
        window.location.href = './#/load-tutorial';
      }, 300);
    }
  }

  deleteBookmark(bookmarkId) {
    this.bookmarks = this.bookmarks.filter(b => b.id !== bookmarkId);
    this.saveBookmarks();
    this.updateBookmarksOverlay();
    this.showNotification('Bookmark deleted');
  }

  handleHomeClick() {
    // Save current slide as bookmark, then go home
    this.addBookmark(true);
  }

  handleBookmarkClick() {
    // Save current slide as bookmark
    this.addBookmark(false);
  }

  handleGotoBookmarksClick() {
    this.openBookmarksOverlay();
  }

  showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.bookmark-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'bookmark-notification';
    notification.innerHTML = `<i class="fas fa-bookmark"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 2500);
  }

  createBookmarksOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'bookmarks-overlay';
    overlay.className = 'bookmarks-overlay';
    overlay.innerHTML = `
      <div class="bookmarks-dialog">
        <div class="bookmarks-header">
          <h3><i class="fas fa-bookmark"></i> Bookmarks</h3>
          <button class="bookmarks-close" aria-label="Close">&times;</button>
        </div>
        <div class="bookmarks-content" id="bookmarks-content">
          <!-- Bookmarks will be rendered here -->
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    // Close handlers
    overlay.querySelector('.bookmarks-close').addEventListener('click', () => this.closeBookmarksOverlay());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) this.closeBookmarksOverlay();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('visible')) {
        this.closeBookmarksOverlay();
      }
    });
  }

  async getChapterInfo(chapter) {
    try {
      const response = await fetch('./resources/misc/md-manifest.json');
      const manifest = await response.json();
      const entry = manifest.find(m => m.filename.replace('.md', '') === chapter);
      return entry || { title: chapter, thumbnail: null };
    } catch (e) {
      return { title: chapter, thumbnail: null };
    }
  }

  async updateBookmarksOverlay() {
    const content = document.getElementById('bookmarks-content');
    if (!content) return;
    
    if (this.bookmarks.length === 0) {
      content.innerHTML = `
        <div class="bookmarks-empty">
          <i class="fas fa-bookmark"></i>
          <p>No bookmarks yet</p>
          <small>Click the bookmark icon to save slides</small>
        </div>
      `;
      return;
    }
    
    // Group bookmarks by chapter
    const grouped = {};
    for (const bookmark of this.bookmarks) {
      const chapter = bookmark.chapter || 'Other';
      if (!grouped[chapter]) {
        grouped[chapter] = {
          bookmarks: [],
          info: await this.getChapterInfo(chapter)
        };
      }
      grouped[chapter].bookmarks.push(bookmark);
    }
    
    let html = '';
    for (const [chapter, data] of Object.entries(grouped)) {
      html += `
        <div class="bookmarks-chapter">
          <div class="chapter-header">
            <span class="chapter-title">${data.info.title || chapter}</span>
            <span class="chapter-count">${data.bookmarks.length}</span>
          </div>
          <div class="bookmarks-grid">
      `;
      
      for (const bookmark of data.bookmarks) {
        const thumbStyle = bookmark.thumbnail 
          ? `background-image: url('${bookmark.thumbnail}')` 
          : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        html += `
          <div class="bookmark-card" data-url="${bookmark.url}" data-id="${bookmark.id}">
            <div class="bookmark-thumb" style="${thumbStyle}">
              <button class="bookmark-delete" data-id="${bookmark.id}" aria-label="Delete bookmark">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="bookmark-info">
              <span class="bookmark-title">${bookmark.title}</span>
            </div>
          </div>
        `;
      }
      
      html += `
          </div>
        </div>
      `;
    }
    
    content.innerHTML = html;
    
    // Attach click handlers
    content.querySelectorAll('.bookmark-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.closest('.bookmark-delete')) {
          window.location.href = card.dataset.url;
          this.closeBookmarksOverlay();
        }
      });
    });
    
    content.querySelectorAll('.bookmark-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteBookmark(btn.dataset.id);
      });
    });
  }

  openBookmarksOverlay() {
    const overlay = document.getElementById('bookmarks-overlay');
    if (overlay) {
      this.updateBookmarksOverlay();
      overlay.classList.add('visible');
    }
  }

  closeBookmarksOverlay() {
    const overlay = document.getElementById('bookmarks-overlay');
    if (overlay) {
      overlay.classList.remove('visible');
    }
  }

  updateMenuItems() {
    // Update notes badge
    const notesBadge = document.getElementById('notes-badge');
    const notesBtn = document.getElementById('notes-toggle-btn');
    if (notesBadge && notesBtn) {
      const hasNotes = notesBtn.classList.contains('has-notes');
      notesBadge.style.display = hasNotes ? 'inline-block' : 'none';
    }

    // Update performance mode toggle
    const perfToggle = document.getElementById('performance-toggle');
    const perfActive = document.body.classList.contains('performance-mode');
    if (perfToggle) {
      perfToggle.textContent = perfActive ? 'ON' : 'OFF';
      perfToggle.className = 'menu-item-toggle ' + (perfActive ? 'active' : '');
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    const button = document.getElementById('burger-menu-button');
    const menu = document.getElementById('burger-menu');
    
    button.classList.add('active');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    this.updateMenuItems();
  }

  close() {
    this.isOpen = false;
    const button = document.getElementById('burger-menu-button');
    const menu = document.getElementById('burger-menu');
    
    button.classList.remove('active');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Initialize burger menu when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.burgerMenu = new BurgerMenu();
  });
} else {
  window.burgerMenu = new BurgerMenu();
}
