/**
 * Burger Menu System
 * Consolidates overlay buttons (Notes, Performance Mode, PDF Export) into a single menu
 */

class BurgerMenu {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createBurgerButton();
    this.createMenu();
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
      
      case 'pdf':
        // Trigger PDF export
        if (typeof PDFExport !== 'undefined' && PDFExport.export16x9) {
          PDFExport.export16x9();
          this.close();
        }
        break;
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
