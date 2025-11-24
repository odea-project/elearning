/**
 * Timer-Locked Spoiler Component for Reveal.js
 * Creates collapsible spoiler boxes that unlock at a specified date/time
 */

class TimerLockedSpoiler {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error(`Timer-Locked Spoiler: Container with id "${containerId}" not found`);
      return;
    }

    // Configuration
    this.unlockDate = new Date(options.unlockDate);
    this.title = options.title || 'Hidden Content';
    this.content = options.content || '<p>This content is now unlocked!</p>';
    this.lockedIcon = options.lockedIcon || '🔒';
    this.unlockedIcon = options.unlockedIcon || '🔓';
    this.dateFormat = options.dateFormat || this.formatDate(this.unlockDate);
    
    // State
    this.isUnlocked = false;
    this.isOpen = false;
    this.intervalId = null;
    
    // Initialize
    this.render();
    this.attachEventListeners();
    this.startCountdown();
  }

  formatDate(date) {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleString('en-US', options);
  }

  render() {
    this.container.className = 'timer-locked-spoiler';
    this.container.innerHTML = `
      <div class="spoiler-header" data-spoiler-id="${this.containerId}">
        <span class="spoiler-title">
          <span class="spoiler-icon">${this.lockedIcon}</span>
          <span class="spoiler-title-text">Click to reveal (Unlocks: ${this.dateFormat})</span>
        </span>
        <span class="countdown-timer"></span>
      </div>
    `;

    // Create overlay modal (separate from container)
    this.overlay = document.createElement('div');
    this.overlay.className = 'spoiler-overlay';
    this.overlay.innerHTML = `
      <div class="spoiler-modal">
        <button class="spoiler-close" aria-label="Close">&times;</button>
        <div class="spoiler-modal-content">${this.content}</div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    this.elements = {
      header: this.container.querySelector('.spoiler-header'),
      titleText: this.container.querySelector('.spoiler-title-text'),
      icon: this.container.querySelector('.spoiler-icon'),
      timer: this.container.querySelector('.countdown-timer'),
      overlay: this.overlay,
      modal: this.overlay.querySelector('.spoiler-modal'),
      closeBtn: this.overlay.querySelector('.spoiler-close'),
      content: this.overlay.querySelector('.spoiler-modal-content')
    };
  }

  attachEventListeners() {
    this.elements.header.addEventListener('click', () => this.toggle());
    this.elements.closeBtn.addEventListener('click', () => this.close());
    
    // Close on overlay click (outside modal)
    this.elements.overlay.addEventListener('click', (e) => {
      if (e.target === this.elements.overlay) {
        this.close();
      }
    });
    
    // Close on Escape key
    this.escapeHandler = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', this.escapeHandler);
    
    // Cleanup on slide change for Reveal.js
    if (typeof Reveal !== 'undefined') {
      Reveal.on('slidechanged', () => this.reset());
    }
  }

  startCountdown() {
    this.updateCountdown();
    this.intervalId = setInterval(() => this.updateCountdown(), 1000);
  }

  updateCountdown() {
    const now = new Date();
    const timeLeft = this.unlockDate - now;
    
    if (timeLeft <= 0) {
      this.unlock();
      return;
    }
    
    // Calculate time components
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    this.elements.timer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    this.elements.header.classList.add('locked');
  }

  unlock() {
    if (this.isUnlocked) return;
    
    this.isUnlocked = true;
    this.elements.header.classList.remove('locked');
    this.elements.icon.textContent = this.unlockedIcon;
    this.elements.titleText.textContent = `Click to reveal ${this.title}`;
    this.elements.timer.textContent = 'UNLOCKED';
    this.elements.timer.style.background = 'rgba(46, 204, 113, 0.8)';
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  toggle() {
    if (!this.isUnlocked) {
      this.shake();
      return;
    }
    
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.elements.overlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  close() {
    this.isOpen = false;
    this.elements.overlay.classList.remove('visible');
    document.body.style.overflow = ''; // Restore scrolling
  }

  shake() {
    this.elements.header.classList.add('shake');
    setTimeout(() => this.elements.header.classList.remove('shake'), 500);
  }

  reset() {
    if (this.isOpen) {
      this.close();
    }
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.escapeHandler) {
      document.removeEventListener('keydown', this.escapeHandler);
    }
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}

// Global function for easy initialization
window.createTimerLockedSpoiler = function(containerId, options) {
  return new TimerLockedSpoiler(containerId, options);
};

// Auto-initialize spoilers with data attributes
document.addEventListener('DOMContentLoaded', function() {
  const autoInitElements = document.querySelectorAll('[data-timer-spoiler]');
  
  autoInitElements.forEach(element => {
    const options = {
      unlockDate: element.dataset.unlockDate,
      title: element.dataset.title || 'Hidden Content',
      content: element.innerHTML,
      lockedIcon: element.dataset.lockedIcon,
      unlockedIcon: element.dataset.unlockedIcon,
      dateFormat: element.dataset.dateFormat
    };
    
    // Clear existing content
    element.innerHTML = '';
    
    new TimerLockedSpoiler(element.id, options);
  });
});
