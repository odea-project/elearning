/**
 * Performance Mode Toggle System
 * Switches between normal visual mode and high-contrast performance mode
 */

class PerformanceModeManager {
  constructor() {
    this.storageKey = 'performance-mode-enabled';
    this.isEnabled = this.loadState();
    this.init();
  }

  /**
   * Initialize the performance mode system
   */
  init() {
    this.createToggleButton();
    
    // Apply saved state on load
    if (this.isEnabled) {
      this.enable();
    }
    
    // Keyboard shortcut: P key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'p' && !e.ctrlKey && !e.metaKey && !this.isTyping()) {
        this.toggle();
      }
    });
  }

  /**
   * Create the toggle button
   */
  createToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'performance-mode-toggle-btn';
    toggleBtn.className = 'performance-mode-toggle-btn';
    toggleBtn.innerHTML = '<i class="fas fa-bolt"></i>';
    toggleBtn.title = 'Performance Mode (P)';
    toggleBtn.addEventListener('click', () => this.toggle());
    
    document.body.appendChild(toggleBtn);
    this.updateButtonState();
  }

  /**
   * Toggle performance mode on/off
   */
  toggle() {
    if (this.isEnabled) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Enable performance mode
   */
  enable() {
    this.isEnabled = true;
    document.body.classList.add('performance-mode');
    this.saveState();
    this.updateButtonState();
    this.showNotification('⚡ Performance mode enabled', 'success');
    console.log('Performance mode enabled');
  }

  /**
   * Disable performance mode
   */
  disable() {
    this.isEnabled = false;
    document.body.classList.remove('performance-mode');
    this.saveState();
    this.updateButtonState();
    this.showNotification('🎨 Visual effects restored', 'info');
    console.log('Performance mode disabled');
  }

  /**
   * Update button visual state
   */
  updateButtonState() {
    const btn = document.getElementById('performance-mode-toggle-btn');
    if (!btn) return;
    
    if (this.isEnabled) {
      btn.classList.add('active');
      btn.innerHTML = '<i class="fas fa-bolt"></i>';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<i class="fas fa-bolt"></i>';
    }
  }

  /**
   * Save state to localStorage
   */
  saveState() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.isEnabled));
    } catch (e) {
      console.error('Failed to save performance mode state:', e);
    }
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      console.error('Failed to load performance mode state:', e);
      return false;
    }
  }

  /**
   * Check if user is typing in an input field
   */
  isTyping() {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    // Check if notes system notification exists and use it
    if (window.notesManager && typeof window.notesManager.showNotification === 'function') {
      window.notesManager.showNotification(message, type);
      return;
    }

    // Otherwise create simple notification
    const notification = document.createElement('div');
    notification.className = `performance-notification performance-notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
      color: white;
      padding: 12px 24px;
      border-radius: 4px;
      z-index: 10000;
      font-size: 16px;
      font-family: 'Montserrat', sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceModeManager = new PerformanceModeManager();
  });
} else {
  window.performanceModeManager = new PerformanceModeManager();
}
