/**
 * Notes System for Reveal.js Presentations
 * Manages slide-specific notes with text and drawing capabilities
 * Data is persisted in localStorage
 */

class NotesManager {
  constructor() {
    this.storageKey = 'presentation-notes';
    this.currentSlideId = null;
    this.notes = this.loadNotes();
    this.isActive = false;
    this.overlay = null;
    this.toolbar = null;
    this.mode = 'text'; // 'text' or 'draw'
    
    // Drawing state
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.currentColor = '#E5C07B'; // Monokai yellow
    this.currentWidth = 3;
    
    // Text notes
    this.textNotes = [];
    
    // Press-and-hold for text note creation
    this.pressTimer = null;
    this.pressStartX = 0;
    this.pressStartY = 0;
    this.pressThreshold = 750; // 0.75 seconds
    this.moveThreshold = 10; // pixels - if moved more, cancel
    
    // Overlay transparency
    this.overlayOpacity = 0.95; // Default 95%
    this.minOpacity = 0.1;
    this.maxOpacity = 1.0;
    this.opacityStep = 0.05;
    
    // Pinch gesture state
    this.lastPinchDistance = null;
    
    this.init();
  }

  /**
   * Initialize the notes system
   */
  init() {
    this.createUI();
    this.attachEventListeners();
    console.log('NotesManager initialized');
  }

  /**
   * Load notes from localStorage
   */
  loadNotes() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
    
    return {
      presentation: window.location.pathname,
      version: '1.0',
      notes: {}
    };
  }

  /**
   * Save notes to localStorage
   */
  saveNotes() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
      console.log('Notes saved:', this.currentSlideId);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  }

  /**
   * Get notes for a specific slide
   */
  getSlideNotes(slideId) {
    if (!this.notes.notes[slideId]) {
      this.notes.notes[slideId] = {
        text: [],
        drawings: [],
        timestamp: new Date().toISOString()
      };
    }
    return this.notes.notes[slideId];
  }

  /**
   * Update current slide ID
   */
  setCurrentSlide(slideId) {
    if (this.currentSlideId !== slideId) {
      // Save current notes before switching
      if (this.currentSlideId && this.isActive) {
        this.saveCurrentSlideNotes();
      }
      
      this.currentSlideId = slideId;
      
      // Load notes for new slide
      if (this.isActive) {
        this.loadCurrentSlideNotes();
      }
    }
  }

  /**
   * Save current slide notes
   */
  saveCurrentSlideNotes() {
    if (!this.currentSlideId) return;

    const slideNotes = this.getSlideNotes(this.currentSlideId);
    
    // Save text notes
    slideNotes.text = this.textNotes.map(note => ({
      content: note.element.querySelector('.note-content').textContent,
      x: parseFloat(note.element.style.left),
      y: parseFloat(note.element.style.top),
      id: note.id
    }));

    // Save drawing as data URL
    if (this.canvas) {
      slideNotes.drawings = [this.canvas.toDataURL()];
    }

    slideNotes.timestamp = new Date().toISOString();
    
    this.saveNotes();
  }

  /**
   * Load notes for current slide
   */
  loadCurrentSlideNotes() {
    if (!this.currentSlideId) return;

    // Clear current notes
    this.clearCurrentNotes();

    const slideNotes = this.getSlideNotes(this.currentSlideId);

    // Load text notes
    slideNotes.text.forEach(note => {
      this.createTextNote(note.content, note.x, note.y, note.id);
    });

    // Load drawings
    if (slideNotes.drawings.length > 0 && this.canvas) {
      const img = new Image();
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0);
      };
      img.src = slideNotes.drawings[0];
    }
  }

  /**
   * Clear current notes from UI
   */
  clearCurrentNotes() {
    // Clear text notes
    this.textNotes.forEach(note => {
      if (note.element && note.element.parentNode) {
        note.element.parentNode.removeChild(note.element);
      }
    });
    this.textNotes = [];

    // Clear canvas
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Create UI elements
   */
  createUI() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.id = 'notes-overlay';
    this.overlay.className = 'notes-overlay';
    this.overlay.style.display = 'none';
    
    // Create canvas for drawing
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'notes-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.overlay.appendChild(this.canvas);

    // Create toolbar
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'notes-toolbar';
    this.toolbar.innerHTML = `
      <div class="notes-toolbar-group">
        <button class="notes-btn notes-mode-btn" data-mode="text" title="Text Note (T)">
          <i class="fas fa-font"></i>
        </button>
        <button class="notes-btn notes-mode-btn active" data-mode="draw" title="Draw (D)">
          <i class="fas fa-pen"></i>
        </button>
      </div>
      
      <div class="notes-toolbar-group" id="draw-tools">
        <button class="notes-btn notes-color-btn" data-color="#E5C07B" style="background: #E5C07B;" title="Yellow"></button>
        <button class="notes-btn notes-color-btn" data-color="#61AFEF" style="background: #61AFEF;" title="Blue"></button>
        <button class="notes-btn notes-color-btn" data-color="#98C379" style="background: #98C379;" title="Green"></button>
        <button class="notes-btn notes-color-btn" data-color="#E06C75" style="background: #E06C75;" title="Red"></button>
        <button class="notes-btn notes-color-btn" data-color="#C678DD" style="background: #C678DD;" title="Purple"></button>
        <button class="notes-btn notes-color-btn" data-color="#FFFFFF" style="background: #FFFFFF; border: 1px solid #666;" title="White"></button>
        
        <div class="notes-divider"></div>
        
        <button class="notes-btn notes-width-btn" data-width="2" title="Thin">
          <i class="fas fa-circle" style="font-size: 8px;"></i>
        </button>
        <button class="notes-btn notes-width-btn active" data-width="3" title="Medium">
          <i class="fas fa-circle" style="font-size: 12px;"></i>
        </button>
        <button class="notes-btn notes-width-btn" data-width="5" title="Thick">
          <i class="fas fa-circle" style="font-size: 16px;"></i>
        </button>
        
        <div class="notes-divider"></div>
        
        <button class="notes-btn" id="notes-eraser-btn" title="Eraser (E)">
          <i class="fas fa-eraser"></i>
        </button>
      </div>
      
      <div class="notes-toolbar-group">
        <button class="notes-btn" id="notes-clear-btn" title="Clear All">
          <i class="fas fa-trash"></i>
        </button>
        <button class="notes-btn" id="notes-import-btn" title="Import">
          <i class="fas fa-upload"></i>
        </button>
        <button class="notes-btn" id="notes-export-btn" title="Export">
          <i class="fas fa-download"></i>
        </button>
      </div>
      
      <div class="notes-toolbar-group">
        <button class="notes-btn" id="notes-opacity-down-btn" title="More Transparent (-)">
          <i class="fas fa-eye-slash"></i>
        </button>
        <span id="notes-opacity-value" class="notes-opacity-display" title="Background Transparency">95%</span>
        <button class="notes-btn" id="notes-opacity-up-btn" title="Less Transparent (+)">
          <i class="fas fa-eye"></i>
        </button>
      </div>
      
      <div class="notes-toolbar-group">
        <button class="notes-btn notes-close-btn" id="notes-close-btn" title="Close (Esc)">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;
    
    this.overlay.appendChild(this.toolbar);
    document.body.appendChild(this.overlay);

    // Create toggle button for reveal controls
    this.createToggleButton();
    
    // Resize canvas to match window
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  /**
   * Create toggle button in Reveal.js controls
   */
  createToggleButton() {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'notes-toggle-btn';
    toggleBtn.className = 'notes-toggle-btn';
    toggleBtn.innerHTML = '<i class="fas fa-sticky-note"></i>';
    toggleBtn.title = 'Notes (N)';
    toggleBtn.addEventListener('click', () => this.toggle());
    
    // Add to body (positioned via CSS)
    document.body.appendChild(toggleBtn);
    
    // Add indicator badge if current slide has notes
    this.updateToggleButtonBadge();
  }

  /**
   * Update toggle button badge to show if notes exist
   */
  updateToggleButtonBadge() {
    const toggleBtn = document.getElementById('notes-toggle-btn');
    if (!toggleBtn) return;

    const hasNotes = this.currentSlideId && 
                     this.notes.notes[this.currentSlideId] &&
                     (this.notes.notes[this.currentSlideId].text.length > 0 ||
                      this.notes.notes[this.currentSlideId].drawings.length > 0);

    if (hasNotes) {
      toggleBtn.classList.add('has-notes');
    } else {
      toggleBtn.classList.remove('has-notes');
    }
  }

  /**
   * Resize canvas to match window
   */
  resizeCanvas() {
    if (!this.canvas) return;
    
    // Save current drawing
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Resize
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Restore drawing
    this.ctx.putImageData(imageData, 0, 0);
    
    // Reset drawing style
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.currentWidth;
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Mode buttons
    document.querySelectorAll('.notes-mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.dataset.mode;
        this.setMode(mode);
      });
    });

    // Color buttons
    document.querySelectorAll('.notes-color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentColor = e.currentTarget.dataset.color;
        this.ctx.strokeStyle = this.currentColor;
        document.querySelectorAll('.notes-color-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Width buttons
    document.querySelectorAll('.notes-width-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentWidth = parseInt(e.currentTarget.dataset.width);
        this.ctx.lineWidth = this.currentWidth;
        document.querySelectorAll('.notes-width-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
      });
    });

    // Eraser button
    document.getElementById('notes-eraser-btn')?.addEventListener('click', () => {
      this.currentColor = '#1a2340'; // Background color
      this.ctx.strokeStyle = this.currentColor;
      this.currentWidth = 20;
      this.ctx.lineWidth = this.currentWidth;
    });

    // Clear button
    document.getElementById('notes-clear-btn')?.addEventListener('click', () => {
      if (confirm('Delete all notes on this slide?')) {
        this.clearCurrentNotes();
        if (this.currentSlideId) {
          delete this.notes.notes[this.currentSlideId];
          this.saveNotes();
          this.updateToggleButtonBadge();
        }
      }
    });

    // Import button
    document.getElementById('notes-import-btn')?.addEventListener('click', () => {
      this.showImportDialog();
    });

    // Export button
    document.getElementById('notes-export-btn')?.addEventListener('click', () => {
      this.exportNotes();
    });

    // Opacity buttons
    document.getElementById('notes-opacity-up-btn')?.addEventListener('click', () => {
      this.increaseOpacity();
    });

    document.getElementById('notes-opacity-down-btn')?.addEventListener('click', () => {
      this.decreaseOpacity();
    });

    // Close button
    document.getElementById('notes-close-btn')?.addEventListener('click', () => {
      this.close();
    });

    // Canvas events - handle both drawing and text placement
    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.mode === 'draw') {
        this.startDrawing(e);
      } else if (this.mode === 'text') {
        // Start press-and-hold timer for text note creation
        this.startPressAndHold(e);
      }
    });
    
    this.canvas.addEventListener('pointermove', (e) => {
      if (this.mode === 'draw') {
        this.draw(e);
      } else if (this.mode === 'text' && this.pressTimer) {
        // Check if user moved too much - cancel text note creation
        const dx = Math.abs(e.clientX - this.pressStartX);
        const dy = Math.abs(e.clientY - this.pressStartY);
        if (dx > this.moveThreshold || dy > this.moveThreshold) {
          this.cancelPressAndHold();
        }
      }
    });
    
    this.canvas.addEventListener('pointerup', () => {
      if (this.mode === 'draw') {
        this.stopDrawing();
      } else if (this.mode === 'text') {
        // Cancel press-and-hold if user releases before threshold
        this.cancelPressAndHold();
      }
    });
    
    this.canvas.addEventListener('pointerout', () => {
      if (this.mode === 'draw') {
        this.stopDrawing();
      } else if (this.mode === 'text') {
        this.cancelPressAndHold();
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !this.isTyping()) {
        this.toggle();
      } else if (e.key === 'Escape' && this.isActive) {
        this.close();
      } else if (this.isActive) {
        if (e.key === 't' && !this.isTyping()) {
          this.setMode('text');
        } else if (e.key === 'd' && !this.isTyping()) {
          this.setMode('draw');
        } else if (e.key === 'e' && !this.isTyping()) {
          document.getElementById('notes-eraser-btn')?.click();
        } else if ((e.key === '+' || e.key === '=') && !this.isTyping()) {
          e.preventDefault();
          this.increaseOpacity();
        } else if ((e.key === '-' || e.key === '_') && !this.isTyping()) {
          e.preventDefault();
          this.decreaseOpacity();
        }
      }
    });

    // Mouse wheel for opacity
    this.overlay.addEventListener('wheel', (e) => {
      if (this.isActive && e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          this.increaseOpacity();
        } else {
          this.decreaseOpacity();
        }
      }
    }, { passive: false });

    // Touch gestures for opacity (pinch)
    this.overlay.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        this.lastPinchDistance = this.getPinchDistance(e.touches);
      }
    });

    this.overlay.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2 && this.lastPinchDistance !== null) {
        e.preventDefault();
        const currentDistance = this.getPinchDistance(e.touches);
        const delta = currentDistance - this.lastPinchDistance;
        
        if (Math.abs(delta) > 10) { // Threshold to avoid jitter
          if (delta > 0) {
            this.increaseOpacity();
          } else {
            this.decreaseOpacity();
          }
          this.lastPinchDistance = currentDistance;
        }
      }
    }, { passive: false });

    this.overlay.addEventListener('touchend', (e) => {
      if (e.touches.length < 2) {
        this.lastPinchDistance = null;
      }
    });

    // Reveal.js slide change event
    if (window.Reveal) {
      Reveal.addEventListener('slidechanged', (event) => {
        const slideId = event.currentSlide.id || `slide-${event.indexh}-${event.indexv}`;
        this.setCurrentSlide(slideId);
        this.updateToggleButtonBadge();
      });

      // Get initial slide
      const currentSlide = Reveal.getCurrentSlide();
      if (currentSlide) {
        const slideId = currentSlide.id || `slide-${Reveal.getIndices().h}-${Reveal.getIndices().v}`;
        this.setCurrentSlide(slideId);
        this.updateToggleButtonBadge();
      }
    }
  }

  /**
   * Check if user is currently typing in an input
   */
  isTyping() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || 
                     active.tagName === 'TEXTAREA' || 
                     active.isContentEditable);
  }

  /**
   * Set mode (text or draw)
   */
  setMode(mode) {
    this.mode = mode;
    
    // Update button states
    document.querySelectorAll('.notes-mode-btn').forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Toggle draw tools visibility
    const drawTools = document.getElementById('draw-tools');
    if (drawTools) {
      drawTools.style.display = mode === 'draw' ? 'flex' : 'none';
    }

    // Change cursor based on mode
    if (mode === 'draw') {
      this.canvas.style.cursor = 'crosshair';
      this.overlay.classList.remove('text-mode');
    } else {
      this.canvas.style.cursor = 'copy'; // Indicates "place text here"
      this.overlay.classList.add('text-mode');
    }
  }

  /**
   * Start drawing
   */
  startDrawing(e) {
    if (this.mode !== 'draw') return;
    
    this.isDrawing = true;
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.beginPath();
    this.ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }

  /**
   * Draw
   */
  draw(e) {
    if (!this.isDrawing || this.mode !== 'draw') return;
    
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    this.ctx.stroke();
  }

  /**
   * Stop drawing
   */
  stopDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.saveCurrentSlideNotes();
    }
  }

  /**
   * Start press-and-hold timer for text note creation
   */
  startPressAndHold(e) {
    // Check if click was on a text note element
    const clickedElement = document.elementFromPoint(e.clientX, e.clientY);
    const isTextNote = clickedElement && clickedElement.closest('.text-note');
    
    if (isTextNote) {
      console.log('Clicked on existing text note, not starting timer');
      return;
    }
    
    this.pressStartX = e.clientX;
    this.pressStartY = e.clientY;
    
    console.log('Press-and-hold started at:', e.clientX, e.clientY);
    
    this.pressTimer = setTimeout(() => {
      console.log('Press-and-hold threshold reached, creating text note');
      // Place text note at press position, slightly offset so it's not under cursor
      this.createTextNote('', e.clientX - 100, e.clientY - 30);
      this.pressTimer = null;
    }, this.pressThreshold);
  }

  /**
   * Cancel press-and-hold timer
   */
  cancelPressAndHold() {
    if (this.pressTimer) {
      console.log('Press-and-hold cancelled');
      clearTimeout(this.pressTimer);
      this.pressTimer = null;
    }
  }

  /**
   * Create text note
   */
  createTextNote(content = '', x = 100, y = 100, id = null) {
    const noteId = id || `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const noteElement = document.createElement('div');
    noteElement.className = 'text-note';
    noteElement.style.left = `${x}px`;
    noteElement.style.top = `${y}px`;
    noteElement.innerHTML = `
      <div class="note-header note-handle">
        <span class="note-drag-indicator">
          <i class="fas fa-grip-horizontal"></i> Move
        </span>
        <button class="note-delete-btn" title="Delete">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="note-content" contenteditable="true">${content || 'Enter note...'}</div>
    `;

    // Delete button - prevent dragging when clicking
    const deleteBtn = noteElement.querySelector('.note-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag from starting
      const index = this.textNotes.findIndex(n => n.id === noteId);
      if (index > -1) {
        this.textNotes.splice(index, 1);
        noteElement.remove();
        this.saveCurrentSlideNotes();
      }
    });
    
    // Prevent delete button from triggering drag
    deleteBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });

    // Content editing
    const contentDiv = noteElement.querySelector('.note-content');
    contentDiv.addEventListener('blur', () => {
      this.saveCurrentSlideNotes();
    });
    contentDiv.addEventListener('focus', () => {
      if (contentDiv.textContent === 'Notiz eingeben...') {
        contentDiv.textContent = '';
      }
    });
    
    // Prevent all pointer events from bubbling to canvas
    noteElement.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    });
    
    noteElement.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Make draggable
    this.makeDraggable(noteElement);

    this.overlay.appendChild(noteElement);
    this.textNotes.push({ id: noteId, element: noteElement });

    // Focus on new notes
    if (!content) {
      contentDiv.focus();
    }

    return noteElement;
  }

  /**
   * Make element draggable
   */
  makeDraggable(element) {
    let isDragging = false;
    let hasMoved = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let startX;
    let startY;

    const handle = element.querySelector('.note-handle');

    const pointerDownHandler = (e) => {
      e.stopPropagation(); // Prevent creating new note when clicking handle
      isDragging = true;
      hasMoved = false;
      startX = e.clientX;
      startY = e.clientY;
      initialX = e.clientX - element.offsetLeft;
      initialY = e.clientY - element.offsetTop;
      element.style.zIndex = '1002';
      handle.style.cursor = 'grabbing';
    };

    const pointerMoveHandler = (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if actually moved (more than 5px to avoid accidental drags)
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > 5 || dy > 5) {
          hasMoved = true;
        }
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;
      }
    };

    const pointerUpHandler = (e) => {
      if (isDragging) {
        e.stopPropagation();
        isDragging = false;
        element.style.zIndex = '1001';
        handle.style.cursor = 'grab';
        
        if (hasMoved) {
          this.saveCurrentSlideNotes();
        }
        
        hasMoved = false;
      }
    };

    handle.addEventListener('pointerdown', pointerDownHandler);
    document.addEventListener('pointermove', pointerMoveHandler);
    document.addEventListener('pointerup', pointerUpHandler);
    document.addEventListener('pointercancel', pointerUpHandler);
  }

  /**
   * Toggle notes overlay
   */
  toggle() {
    if (this.isActive) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open notes overlay
   */
  open() {
    this.isActive = true;
    this.overlay.style.display = 'block';
    this.updateOverlayOpacity(); // Apply saved opacity
    this.loadCurrentSlideNotes();
    
    // Pause Reveal.js keyboard
    if (window.Reveal) {
      Reveal.configure({ keyboard: false });
    }
    
    document.getElementById('notes-toggle-btn')?.classList.add('active');
  }

  /**
   * Close notes overlay
   */
  close() {
    this.saveCurrentSlideNotes();
    this.isActive = false;
    this.overlay.style.display = 'none';
    
    // Resume Reveal.js keyboard
    if (window.Reveal) {
      Reveal.configure({ keyboard: true });
    }
    
    document.getElementById('notes-toggle-btn')?.classList.remove('active');
    this.updateToggleButtonBadge();
  }

  /**
   * Show import dialog
   */
  showImportDialog() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const success = this.importNotes(event.target.result);
          if (success) {
            this.showNotification('✅ Notes imported successfully!', 'success');
            this.updateToggleButtonBadge();
          } else {
            this.showNotification('❌ Error importing. Please check the file.', 'error');
          }
        };
        reader.onerror = () => {
          this.showNotification('❌ Error reading file.', 'error');
        };
        reader.readAsText(file);
      }
      // Clean up
      document.body.removeChild(input);
    });
    
    document.body.appendChild(input);
    input.click();
  }

  /**
   * Export all notes as JSON
   */
  exportNotes() {
    const dataStr = JSON.stringify(this.notes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `presentation-notes-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
    
    this.showNotification('💾 Notes exported!', 'success');
  }

  /**
   * Import notes from JSON string
   */
  importNotes(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      
      // Validate structure
      if (!imported.notes || typeof imported.notes !== 'object') {
        console.error('Invalid notes structure');
        return false;
      }
      
      // Ask user for merge strategy
      const hasExistingNotes = Object.keys(this.notes.notes).length > 0;
      
      if (hasExistingNotes) {
        const choice = confirm(
          '⚠️ You already have saved notes.\n\n' +
          '✅ OK = ADD imported notes (keep existing)\n' +
          '❌ Cancel = Abort import'
        );
        
        if (!choice) {
          return false;
        }
        
        // Merge notes (imported notes override existing ones for same slide)
        this.notes.notes = {
          ...this.notes.notes,
          ...imported.notes
        };
      } else {
        // No existing notes, just replace
        this.notes = imported;
      }
      
      this.notes.version = this.notes.version || '1.0';
      this.notes.presentation = this.notes.presentation || window.location.pathname;
      
      this.saveNotes();
      this.loadCurrentSlideNotes();
      
      console.log('Notes imported successfully');
      console.log('Total slides with notes:', Object.keys(this.notes.notes).length);
      
      return true;
    } catch (error) {
      console.error('Error importing notes:', error);
      return false;
    }
  }

  /**
   * Get distance between two touch points (for pinch gesture)
   */
  getPinchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Increase overlay opacity (less transparent)
   */
  increaseOpacity() {
    this.overlayOpacity = Math.min(this.maxOpacity, this.overlayOpacity + this.opacityStep);
    this.updateOverlayOpacity();
  }

  /**
   * Decrease overlay opacity (more transparent)
   */
  decreaseOpacity() {
    this.overlayOpacity = Math.max(this.minOpacity, this.overlayOpacity - this.opacityStep);
    this.updateOverlayOpacity();
  }

  /**
   * Update overlay background opacity
   */
  updateOverlayOpacity() {
    if (this.overlay) {
      this.overlay.style.background = `rgba(26, 35, 64, ${this.overlayOpacity})`;
      
      // Update display
      const opacityDisplay = document.getElementById('notes-opacity-value');
      if (opacityDisplay) {
        opacityDisplay.textContent = `${Math.round(this.overlayOpacity * 100)}%`;
      }
      
      // Visual feedback: slight animation
      this.overlay.style.transition = 'background 0.2s ease';
      setTimeout(() => {
        this.overlay.style.transition = '';
      }, 200);
    }
  }

  /**
   * Show notification message
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notes-notification notes-notification-${type}`;
    notification.textContent = message;
    
    // Add to overlay or body
    const container = this.overlay || document.body;
    container.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.notesManager = new NotesManager();
  });
} else {
  window.notesManager = new NotesManager();
}
