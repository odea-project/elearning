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
    this.init();
  }

  init() {
    this.createBurgerButton();
    this.createMenu();
    this.createTimerConfigModal();
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
