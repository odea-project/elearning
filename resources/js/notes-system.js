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
    
    // Text notes
    this.textNotes = [];
    
    // Pinned previews tracking
    this.pinnedPreviews = new Map(); // Maps noteId to preview element
    
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
    
    // Opacity slider state
    this.isSliderDragging = false;
    
    // Context menu for creating notes from selected text
    this.contextMenu = null;
    this.selectedText = '';
    this.contextMenuPosition = { x: 0, y: 0 };
    
    // Highlighted text markers
    this.textHighlights = []; // Store references to highlighted text elements
    
    // Position markers for notes created by right-click
    this.positionMarkers = []; // Store references to position marker elements
    
    this.init();
  }

  /**
   * Initialize the notes system
   */
  init() {
    this.createUI();
    this.createContextMenu();
    this.attachEventListeners();
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
      // Clear highlights from previous slide (if not in notes mode)
      if (!this.isActive) {
        this.clearTextHighlights();
      }
      
      // Save current notes before switching
      if (this.currentSlideId && this.isActive) {
        this.saveCurrentSlideNotes();
      }
      
      this.currentSlideId = slideId;
      
      // Load notes for new slide
      if (this.isActive) {
        this.loadCurrentSlideNotes();
      } else {
        // Even if notes mode is not active, show highlights for notes with source text
        this.showHighlightsForCurrentSlide();
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
      id: note.id,
      sourceText: note.sourceText || null,
      highlightId: note.highlightId || null,
      markerId: note.markerId || null,
      markerPosition: note.markerPosition || null
    }));

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
      this.createTextNote(note.content, note.x, note.y, note.id, note.sourceText, note.highlightId, note.markerId, note.markerPosition);
    });
    
    // Restore text highlights
    this.restoreTextHighlights();
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
    
    // Clear text highlights
    this.clearTextHighlights();
    
    // Clear position markers
    this.clearPositionMarkers();
  }

  /**
   * Restore text highlights for current slide
   */
  restoreTextHighlights() {
    if (!this.currentSlideId) return;
    
    const slideNotes = this.getSlideNotes(this.currentSlideId);
    
    // For each note with source text, try to find and highlight it
    slideNotes.text.forEach(note => {
      if (note.sourceText && note.highlightId) {
        const noteObj = this.textNotes.find(n => n.id === note.id);
        if (noteObj) {
          this.highlightTextInSlide(note.sourceText, note.highlightId, noteObj);
        }
      }
    });
  }

  /**
   * Show highlights for current slide (even when notes mode is not active)
   * This creates lightweight highlights with preview functionality
   */
  showHighlightsForCurrentSlide() {
    if (!this.currentSlideId) return;
    
    const slideNotes = this.getSlideNotes(this.currentSlideId);
    
    // For each note with source text, create a highlight
    slideNotes.text.forEach(note => {
      if (note.sourceText && note.highlightId) {
        // Create a temporary note object for the preview functionality
        const tempNoteObj = {
          id: note.id,
          highlightId: note.highlightId,
          element: {
            querySelector: () => ({
              textContent: note.content
            })
          }
        };
        
        this.highlightTextInSlide(note.sourceText, note.highlightId, tempNoteObj);
      }
      
      // For each note with position marker, create a marker
      if (note.markerId && note.markerPosition) {
        const tempNoteObj = {
          id: note.id,
          markerId: note.markerId,
          markerPosition: note.markerPosition,
          element: {
            querySelector: () => ({
              textContent: note.content
            })
          }
        };
        
        this.createPositionMarker(note.markerPosition.x, note.markerPosition.y, note.markerId, tempNoteObj);
      }
    });
  }

  /**
   * Highlight text in the current slide
   */
  highlightTextInSlide(text, highlightId, noteObj) {
    const currentSlide = window.Reveal ? Reveal.getCurrentSlide() : null;
    if (!currentSlide) return null;
    
    // Check if already highlighted with this ID
    const existingHighlight = document.querySelector(`[data-highlight-id="${highlightId}"]`);
    if (existingHighlight) return existingHighlight;
    
    // Try to find the text using a more flexible approach
    // First, try using window.find() to highlight text across elements
    const selection = window.getSelection();
    selection.removeAllRanges();
    
    // Search for the text in the slide
    let found = false;
    const textToFind = text.trim();
    
    // Get all text content from the slide
    const slideText = currentSlide.textContent;
    if (!slideText.includes(textToFind)) return null;
    
    // Create a temporary range to search
    const searchRange = document.createRange();
    searchRange.selectNodeContents(currentSlide);
    
    // Try to find and select the text
    try {
      // Use TreeWalker to find all text nodes
      const walker = document.createTreeWalker(
        currentSlide,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            // Skip if in notes elements
            if (node.parentElement.closest('.notes-overlay') ||
                node.parentElement.closest('.notes-toggle-btn') ||
                node.parentElement.closest('.notes-highlight')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      
      // Collect all text nodes and their combined text
      const textNodes = [];
      let combinedText = '';
      let node;
      
      while (node = walker.nextNode()) {
        textNodes.push({
          node: node,
          start: combinedText.length,
          end: combinedText.length + node.textContent.length
        });
        combinedText += node.textContent;
      }
      
      // Find the text in the combined string
      const startIndex = combinedText.indexOf(textToFind);
      if (startIndex === -1) return null;
      
      const endIndex = startIndex + textToFind.length;
      
      // Find which text nodes contain our target text
      const affectedNodes = textNodes.filter(tn => 
        (tn.start < endIndex && tn.end > startIndex)
      );
      
      if (affectedNodes.length === 0) return null;
      
      // Create wrapper span
      const highlightSpan = document.createElement('span');
      highlightSpan.className = 'notes-highlight';
      highlightSpan.setAttribute('data-highlight-id', highlightId);
      highlightSpan.setAttribute('data-note-id', noteObj.id);
      
      if (affectedNodes.length === 1) {
        // Simple case: text is in one node
        const tn = affectedNodes[0];
        const nodeStartOffset = Math.max(0, startIndex - tn.start);
        const nodeEndOffset = Math.min(tn.node.textContent.length, endIndex - tn.start);
        
        const range = document.createRange();
        range.setStart(tn.node, nodeStartOffset);
        range.setEnd(tn.node, nodeEndOffset);
        
        try {
          range.surroundContents(highlightSpan);
          found = true;
        } catch (e) {
          // If surroundContents fails, try wrapping the parent element
          const parent = tn.node.parentElement;
          if (parent && !parent.classList.contains('notes-highlight')) {
            parent.style.setProperty('background', 'rgba(0, 255, 255, 0.2)', 'important');
            parent.style.setProperty('border-bottom', '2px solid #00ffff', 'important');
            parent.style.setProperty('padding', '2px 0', 'important');
            parent.style.setProperty('cursor', 'help', 'important');
            parent.style.setProperty('transition', 'all 0.2s ease', 'important');
            parent.style.setProperty('position', 'relative', 'important');
            parent.style.setProperty('box-shadow', '0 0 5px rgba(0, 255, 255, 0.3)', 'important');
            parent.style.setProperty('display', 'inline', 'important');
            parent.setAttribute('data-highlight-id', highlightId);
            parent.setAttribute('data-note-id', noteObj.id);
            parent.classList.add('notes-highlight');
            
            this.textHighlights.push({
              element: parent,
              noteId: noteObj.id,
              highlightId: highlightId
            });
            
            this.attachHighlightHoverEvent(parent, noteObj);
            return parent;
          }
        }
      } else {
        // Complex case: text spans multiple nodes
        // Wrap the common ancestor with highlighting styles
        const firstNode = affectedNodes[0].node;
        const lastNode = affectedNodes[affectedNodes.length - 1].node;
        
        // Find common ancestor
        let ancestor = firstNode.parentElement;
        while (ancestor && !ancestor.contains(lastNode)) {
          ancestor = ancestor.parentElement;
        }
        
        if (ancestor && ancestor !== currentSlide) {
          ancestor.style.setProperty('background', 'rgba(0, 255, 255, 0.2)', 'important');
          ancestor.style.setProperty('border-bottom', '2px solid #00ffff', 'important');
          ancestor.style.setProperty('padding', '2px 0', 'important');
          ancestor.style.setProperty('cursor', 'help', 'important');
          ancestor.style.setProperty('transition', 'all 0.2s ease', 'important');
          ancestor.style.setProperty('position', 'relative', 'important');
          ancestor.style.setProperty('box-shadow', '0 0 5px rgba(0, 255, 255, 0.3)', 'important');
          ancestor.style.setProperty('display', 'inline', 'important');
          ancestor.setAttribute('data-highlight-id', highlightId);
          ancestor.setAttribute('data-note-id', noteObj.id);
          ancestor.classList.add('notes-highlight');
          
          this.textHighlights.push({
            element: ancestor,
            noteId: noteObj.id,
            highlightId: highlightId
          });
          
          this.attachHighlightHoverEvent(ancestor, noteObj);
          return ancestor;
        }
      }
      
      if (found && highlightSpan.parentNode) {
        // Store reference
        this.textHighlights.push({
          element: highlightSpan,
          noteId: noteObj.id,
          highlightId: highlightId
        });
        
        // Add hover event to show note preview
        this.attachHighlightHoverEvent(highlightSpan, noteObj);
        
        return highlightSpan;
      }
      
      return null;
    } catch (e) {
      console.warn('Could not highlight text:', e);
      return null;
    }
  }

  /**
   * Attach hover event to highlight to show note preview
   */
  attachHighlightHoverEvent(highlightElement, noteObj) {
    let previewTimeout = null;
    let hoverPreviewElement = null;
    const noteId = noteObj.id;
    
    const showPreview = (e) => {
      // Don't show hover preview if already pinned
      if (this.pinnedPreviews.has(noteId)) return;
      
      previewTimeout = setTimeout(() => {
        const noteContent = noteObj.element.querySelector('.note-content').textContent;
        
        hoverPreviewElement = document.createElement('div');
        hoverPreviewElement.className = 'notes-highlight-preview';
        hoverPreviewElement.textContent = noteContent;
        document.body.appendChild(hoverPreviewElement);
        
        // Position near the highlight
        const rect = highlightElement.getBoundingClientRect();
        hoverPreviewElement.style.left = `${rect.left}px`;
        hoverPreviewElement.style.top = `${rect.bottom + 10}px`;
        
        // Adjust if goes off screen
        setTimeout(() => {
          const previewRect = hoverPreviewElement.getBoundingClientRect();
          if (previewRect.right > window.innerWidth) {
            hoverPreviewElement.style.left = `${window.innerWidth - previewRect.width - 20}px`;
          }
          if (previewRect.bottom > window.innerHeight) {
            hoverPreviewElement.style.top = `${rect.top - previewRect.height - 10}px`;
          }
          hoverPreviewElement.classList.add('show');
        }, 10);
      }, 300);
    };
    
    const hidePreview = () => {
      if (previewTimeout) {
        clearTimeout(previewTimeout);
        previewTimeout = null;
      }
      if (hoverPreviewElement) {
        hoverPreviewElement.classList.remove('show');
        setTimeout(() => {
          if (hoverPreviewElement && hoverPreviewElement.parentNode) {
            hoverPreviewElement.parentNode.removeChild(hoverPreviewElement);
          }
          hoverPreviewElement = null;
        }, 200);
      }
    };
    
    const togglePin = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (this.pinnedPreviews.has(noteId)) {
        // Unpin: remove existing pinned preview
        const pinnedElement = this.pinnedPreviews.get(noteId);
        pinnedElement.classList.remove('show');
        setTimeout(() => {
          if (pinnedElement && pinnedElement.parentNode) {
            pinnedElement.parentNode.removeChild(pinnedElement);
          }
        }, 200);
        this.pinnedPreviews.delete(noteId);
      } else {
        // Pin: create new pinned preview
        const noteContent = noteObj.element.querySelector('.note-content').textContent;
        
        const pinnedElement = document.createElement('div');
        pinnedElement.className = 'notes-highlight-preview pinned';
        pinnedElement.textContent = noteContent;
        document.body.appendChild(pinnedElement);
        
        // Position near the highlight
        const rect = highlightElement.getBoundingClientRect();
        pinnedElement.style.left = `${rect.left}px`;
        pinnedElement.style.top = `${rect.bottom + 10}px`;
        
        // Adjust if goes off screen
        setTimeout(() => {
          const previewRect = pinnedElement.getBoundingClientRect();
          if (previewRect.right > window.innerWidth) {
            pinnedElement.style.left = `${window.innerWidth - previewRect.width - 20}px`;
          }
          if (previewRect.bottom > window.innerHeight) {
            pinnedElement.style.top = `${rect.top - previewRect.height - 10}px`;
          }
          pinnedElement.classList.add('show');
        }, 10);
        
        this.pinnedPreviews.set(noteId, pinnedElement);
        
        // Remove hover preview if showing
        hidePreview();
      }
    };
    
    highlightElement.addEventListener('mouseenter', showPreview);
    highlightElement.addEventListener('mouseleave', hidePreview);
    highlightElement.addEventListener('click', togglePin);
    
    // Add double-click to open notes and edit
    highlightElement.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Open notes if not already open
      if (!this.isActive) {
        this.open();
      }
      
      // Find and focus the note
      const noteId = noteObj.id;
      const note = this.textNotes.find(n => n.id === noteId);
      if (note && note.element) {
        const contentDiv = note.element.querySelector('.note-content');
        if (contentDiv) {
          contentDiv.focus();
          // Place cursor at end
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(contentDiv);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    });
  }

  /**
   * Clear all text highlights
   */
  clearTextHighlights() {
    this.textHighlights.forEach(highlight => {
      if (highlight.element) {
        // Check if it's a span we created or an element we styled
        if (highlight.element.tagName === 'SPAN' && highlight.element.classList.contains('notes-highlight')) {
          // It's a span we created - replace with text content
          if (highlight.element.parentNode) {
            const parent = highlight.element.parentNode;
            const textContent = highlight.element.textContent;
            parent.replaceChild(document.createTextNode(textContent), highlight.element);
            parent.normalize();
          }
        } else {
          // It's an element we styled - remove the styles
          highlight.element.style.background = '';
          highlight.element.style.borderBottom = '';
          highlight.element.style.padding = '';
          highlight.element.style.cursor = '';
          highlight.element.style.transition = '';
          highlight.element.style.position = '';
          highlight.element.style.boxShadow = '';
          highlight.element.removeAttribute('data-highlight-id');
          highlight.element.removeAttribute('data-note-id');
          highlight.element.classList.remove('notes-highlight');
        }
      }
    });
    this.textHighlights = [];
    
    // Clear all pinned previews
    this.pinnedPreviews.forEach((previewElement) => {
      if (previewElement && previewElement.parentNode) {
        previewElement.parentNode.removeChild(previewElement);
      }
    });
    this.pinnedPreviews.clear();
    
    // Also remove any orphaned highlight previews
    document.querySelectorAll('.notes-highlight-preview').forEach(el => el.remove());
  }

  /**
   * Create position marker on the slide
   */
  createPositionMarker(x, y, markerId, noteObj) {
    const currentSlide = window.Reveal ? Reveal.getCurrentSlide() : null;
    if (!currentSlide) return null;
    
    // Check if marker already exists
    const existingMarker = document.querySelector(`[data-marker-id="${markerId}"]`);
    if (existingMarker) return existingMarker;
    
    const marker = document.createElement('div');
    marker.className = 'notes-position-marker';
    marker.setAttribute('data-marker-id', markerId);
    marker.setAttribute('data-note-id', noteObj.id);
    marker.innerHTML = '<i class="fas fa-map-pin"></i>';
    
    // Position relative to the slide
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    
    currentSlide.appendChild(marker);
    
    // Store reference
    this.positionMarkers.push({
      element: marker,
      noteId: noteObj.id,
      markerId: markerId,
      position: { x, y }
    });
    
    // Add hover event to show note preview
    this.attachMarkerHoverEvent(marker, noteObj);
    
    return marker;
  }

  /**
   * Attach hover event to marker to show note preview
   */
  attachMarkerHoverEvent(markerElement, noteObj) {
    let previewTimeout = null;
    let hoverPreviewElement = null;
    const noteId = noteObj.id;
    
    const showPreview = (e) => {
      // Don't show hover preview if already pinned
      if (this.pinnedPreviews.has(noteId)) return;
      
      previewTimeout = setTimeout(() => {
        const noteContent = noteObj.element.querySelector('.note-content').textContent;
        
        hoverPreviewElement = document.createElement('div');
        hoverPreviewElement.className = 'notes-marker-preview';
        hoverPreviewElement.textContent = noteContent;
        document.body.appendChild(hoverPreviewElement);
        
        // Position near the marker
        const rect = markerElement.getBoundingClientRect();
        hoverPreviewElement.style.left = `${rect.right + 10}px`;
        hoverPreviewElement.style.top = `${rect.top}px`;
        
        // Adjust if goes off screen
        setTimeout(() => {
          const previewRect = hoverPreviewElement.getBoundingClientRect();
          if (previewRect.right > window.innerWidth) {
            hoverPreviewElement.style.left = `${rect.left - previewRect.width - 10}px`;
          }
          if (previewRect.bottom > window.innerHeight) {
            hoverPreviewElement.style.top = `${window.innerHeight - previewRect.height - 20}px`;
          }
          hoverPreviewElement.classList.add('show');
        }, 10);
      }, 300);
    };
    
    const hidePreview = () => {
      if (previewTimeout) {
        clearTimeout(previewTimeout);
        previewTimeout = null;
      }
      if (hoverPreviewElement) {
        hoverPreviewElement.classList.remove('show');
        setTimeout(() => {
          if (hoverPreviewElement && hoverPreviewElement.parentNode) {
            hoverPreviewElement.parentNode.removeChild(hoverPreviewElement);
          }
          hoverPreviewElement = null;
        }, 200);
      }
    };
    
    const togglePin = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (this.pinnedPreviews.has(noteId)) {
        // Unpin: remove existing pinned preview
        const pinnedElement = this.pinnedPreviews.get(noteId);
        pinnedElement.classList.remove('show');
        setTimeout(() => {
          if (pinnedElement && pinnedElement.parentNode) {
            pinnedElement.parentNode.removeChild(pinnedElement);
          }
        }, 200);
        this.pinnedPreviews.delete(noteId);
      } else {
        // Pin: create new pinned preview
        const noteContent = noteObj.element.querySelector('.note-content').textContent;
        
        const pinnedElement = document.createElement('div');
        pinnedElement.className = 'notes-marker-preview pinned';
        pinnedElement.textContent = noteContent;
        document.body.appendChild(pinnedElement);
        
        // Position near the marker
        const rect = markerElement.getBoundingClientRect();
        pinnedElement.style.left = `${rect.right + 10}px`;
        pinnedElement.style.top = `${rect.top}px`;
        
        // Adjust if goes off screen
        setTimeout(() => {
          const previewRect = pinnedElement.getBoundingClientRect();
          if (previewRect.right > window.innerWidth) {
            pinnedElement.style.left = `${rect.left - previewRect.width - 10}px`;
          }
          if (previewRect.bottom > window.innerHeight) {
            pinnedElement.style.top = `${window.innerHeight - previewRect.height - 20}px`;
          }
          pinnedElement.classList.add('show');
        }, 10);
        
        this.pinnedPreviews.set(noteId, pinnedElement);
        
        // Remove hover preview if showing
        hidePreview();
      }
    };
    
    markerElement.addEventListener('mouseenter', showPreview);
    markerElement.addEventListener('mouseleave', hidePreview);
    markerElement.addEventListener('click', togglePin);
    
    // Add double-click to open notes and edit
    markerElement.addEventListener('dblclick', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Open notes if not already open
      if (!this.isActive) {
        this.open();
      }
      
      // Find and focus the note
      const noteId = noteObj.id;
      const note = this.textNotes.find(n => n.id === noteId);
      if (note && note.element) {
        const contentDiv = note.element.querySelector('.note-content');
        if (contentDiv) {
          contentDiv.focus();
          // Place cursor at end
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(contentDiv);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    });
  }

  /**
   * Clear all position markers
   */
  clearPositionMarkers() {
    this.positionMarkers.forEach(marker => {
      if (marker.element && marker.element.parentNode) {
        marker.element.parentNode.removeChild(marker.element);
      }
    });
    this.positionMarkers = [];
    
    // Clear all pinned previews
    this.pinnedPreviews.forEach((previewElement) => {
      if (previewElement && previewElement.parentNode) {
        previewElement.parentNode.removeChild(previewElement);
      }
    });
    this.pinnedPreviews.clear();
    
    // Also remove any orphaned marker previews
    document.querySelectorAll('.notes-marker-preview').forEach(el => el.remove());
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

    // Create opacity slider (vertical, left side)
    this.createOpacitySlider();

    // Create toolbar
    this.toolbar = document.createElement('div');
    this.toolbar.className = 'notes-toolbar';
    this.toolbar.innerHTML = `
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
        <button class="notes-btn notes-close-btn" id="notes-close-btn" title="Close (Esc)">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    `;
    
    this.overlay.appendChild(this.toolbar);
    document.body.appendChild(this.overlay);

    // Create toggle button for reveal controls
    this.createToggleButton();
  }

  /**
   * Create vertical opacity slider on the left side
   */
  createOpacitySlider() {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'notes-opacity-slider-container';
    sliderContainer.innerHTML = `
      <div class="notes-opacity-slider-label">
        <i class="fas fa-eye"></i>
        <span id="notes-slider-opacity-value">95%</span>
      </div>
      <div class="notes-opacity-slider-track">
        <div class="notes-opacity-slider-fill" id="notes-opacity-slider-fill"></div>
        <div class="notes-opacity-slider-thumb" id="notes-opacity-slider-thumb"></div>
      </div>
      <div class="notes-opacity-slider-label-bottom">
        <i class="fas fa-eye-slash"></i>
      </div>
    `;
    
    this.overlay.appendChild(sliderContainer);
    
    // Get elements after appending to DOM
    const thumb = sliderContainer.querySelector('.notes-opacity-slider-thumb');
    const track = sliderContainer.querySelector('.notes-opacity-slider-track');
    
    const startDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.isSliderDragging = true;
      updateOpacityFromPosition(e);
    };
    
    const updateOpacityFromPosition = (e) => {
      if (!this.isSliderDragging && e.type !== 'pointerdown') return;
      
      const rect = track.getBoundingClientRect();
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      let relativeY = clientY - rect.top;
      
      // Clamp to track bounds
      relativeY = Math.max(0, Math.min(rect.height, relativeY));
      
      // Convert Y position to opacity (top = max opacity, bottom = min opacity)
      const opacityPercent = 1 - (relativeY / rect.height);
      this.overlayOpacity = this.minOpacity + (opacityPercent * (this.maxOpacity - this.minOpacity));
      
      // Clamp to bounds
      this.overlayOpacity = Math.max(this.minOpacity, Math.min(this.maxOpacity, this.overlayOpacity));
      
      this.updateOverlayOpacity();
      this.updateSliderPosition();
    };
    
    const stopDrag = (e) => {
      if (this.isSliderDragging) {
        e.preventDefault();
        e.stopPropagation();
        this.isSliderDragging = false;
      }
    };
    
    // Mouse/pointer events
    thumb.addEventListener('pointerdown', startDrag);
    track.addEventListener('pointerdown', startDrag);
    document.addEventListener('pointermove', (e) => {
      if (this.isSliderDragging) {
        e.preventDefault();
        e.stopPropagation();
        updateOpacityFromPosition(e);
      }
    });
    document.addEventListener('pointerup', stopDrag);
    
    // Touch events
    thumb.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrag(e);
    }, { passive: false });
    
    track.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startDrag(e);
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (this.isSliderDragging) {
        e.preventDefault();
        updateOpacityFromPosition(e);
      }
    }, { passive: false });
    
    document.addEventListener('touchend', stopDrag);
    
    // Initialize slider position
    this.updateSliderPosition();
  }

  /**
   * Update slider thumb and fill position based on current opacity
   */
  updateSliderPosition() {
    const thumb = document.getElementById('notes-opacity-slider-thumb');
    const fill = document.getElementById('notes-opacity-slider-fill');
    
    if (!thumb || !fill) return;
    
    // Calculate position (0% at top = max opacity, 100% at bottom = min opacity)
    const opacityPercent = (this.overlayOpacity - this.minOpacity) / (this.maxOpacity - this.minOpacity);
    const positionPercent = (1 - opacityPercent) * 100;
    
    thumb.style.top = `${positionPercent}%`;
    fill.style.height = `${100 - positionPercent}%`;
  }

  /**
   * Create context menu for selected text
   */
  createContextMenu() {
    this.contextMenu = document.createElement('div');
    this.contextMenu.id = 'notes-context-menu';
    this.contextMenu.className = 'notes-context-menu';
    this.contextMenu.style.display = 'none';
    this.contextMenu.innerHTML = `
      <button class="notes-context-menu-btn" id="notes-create-from-selection">
        <i class="fas fa-sticky-note"></i>
        <span>Create Note</span>
      </button>
    `;
    
    document.body.appendChild(this.contextMenu);
    
    // Add click handler for the menu button
    const createBtn = document.getElementById('notes-create-from-selection');
    createBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.createNoteFromSelection();
      this.hideContextMenu();
    });
    
    // Hide menu when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!this.contextMenu.contains(e.target)) {
        this.hideContextMenu();
      }
    });
  }

  /**
   * Show context menu at position
   */
  showContextMenu(x, y) {
    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.style.display = 'block';
    
    // Adjust position if menu goes off screen
    setTimeout(() => {
      const rect = this.contextMenu.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        this.contextMenu.style.left = `${x - rect.width}px`;
      }
      if (rect.bottom > window.innerHeight) {
        this.contextMenu.style.top = `${y - rect.height}px`;
      }
    }, 0);
  }

  /**
   * Hide context menu
   */
  hideContextMenu() {
    this.contextMenu.style.display = 'none';
  }

  /**
   * Create note from selected text or position marker
   */
  createNoteFromSelection() {
    // Open notes mode if not already open
    if (!this.isActive) {
      this.open();
    }
    
    // Create note at the context menu position
    const noteX = this.contextMenuPosition.x;
    const noteY = this.contextMenuPosition.y;
    
    let noteElement;
    let noteObj;
    
    if (this.selectedText) {
      // Create note with selected text and highlight
      const highlightId = `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the note with empty content but track the source text for highlighting
      noteElement = this.createTextNote('', noteX, noteY, null, this.selectedText, highlightId);
      
      // Find the note object we just created
      noteObj = this.textNotes[this.textNotes.length - 1];
      
      // Highlight the source text in the slide
      this.highlightTextInSlide(this.selectedText, highlightId, noteObj);
      
      // Show feedback
      this.showNotification('📝 Note created from selection!', 'success');
      
      // Ensure focus is on the note content after all operations
      setTimeout(() => {
        if (noteElement) {
          const contentDiv = noteElement.querySelector('.note-content');
          if (contentDiv) {
            contentDiv.focus();
            this.setActiveNote(noteElement);
          }
        }
      }, 100);
    } else {
      // Create note with position marker
      const markerId = `marker-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Get position relative to the current slide
      const currentSlide = window.Reveal ? Reveal.getCurrentSlide() : null;
      if (!currentSlide) return;
      
      // Calculate position as percentage of slide dimensions for better scaling
      const slideRect = currentSlide.getBoundingClientRect();
      const slideWidth = currentSlide.offsetWidth;
      const slideHeight = currentSlide.offsetHeight;
      
      // Get click position relative to slide's actual content (not transformed)
      const markerX = ((this.contextMenuPosition.x - slideRect.left) / slideRect.width) * slideWidth;
      const markerY = ((this.contextMenuPosition.y - slideRect.top) / slideRect.height) * slideHeight;
      
      // Create the note with marker position information
      noteElement = this.createTextNote('', noteX, noteY, null, null, null, markerId, { x: markerX, y: markerY });
      
      // Find the note object we just created
      noteObj = this.textNotes[this.textNotes.length - 1];
      
      // Create position marker on the slide
      this.createPositionMarker(markerX, markerY, markerId, noteObj);
      
      // Show feedback
      this.showNotification('� Note created at position!', 'success');
    }
    
    // Save immediately to persist the highlight/marker
    this.saveCurrentSlideNotes();
    
    // Clear selection
    this.selectedText = '';
    
    // Ensure focus is on the note content after all operations complete
    // Use requestAnimationFrame for more reliable timing
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (noteElement) {
          const contentDiv = noteElement.querySelector('.note-content');
          if (contentDiv) {
            this.setActiveNote(noteElement);
            contentDiv.focus();
            // Force cursor to be visible
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(contentDiv, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      });
    });
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
  /**
   * Attach event listeners
   */
  attachEventListeners() {
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

    // Close button
    document.getElementById('notes-close-btn')?.addEventListener('click', () => {
      this.close();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !this.isTyping()) {
        this.toggle();
      } else if (e.key === 'Escape' && this.isActive) {
        this.close();
      } else if (this.isActive) {
        if ((e.key === '+' || e.key === '=') && !this.isTyping()) {
          e.preventDefault();
          this.increaseOpacity();
        } else if ((e.key === '-' || e.key === '_') && !this.isTyping()) {
          e.preventDefault();
          this.decreaseOpacity();
        }
      }
    });

    // Reveal.js slide change event
    if (window.Reveal) {
      Reveal.addEventListener('slidechanged', (event) => {
        const slideId = event.currentSlide.id || `slide-${event.indexh}-${event.indexv}`;
        this.setCurrentSlide(slideId);
        this.updateToggleButtonBadge();
      });

      // Get initial slide and show highlights
      const currentSlide = Reveal.getCurrentSlide();
      if (currentSlide) {
        const slideId = currentSlide.id || `slide-${Reveal.getIndices().h}-${Reveal.getIndices().v}`;
        this.setCurrentSlide(slideId);
        this.updateToggleButtonBadge();
        // Show highlights immediately on page load
        this.showHighlightsForCurrentSlide();
      }
    }

    // Context menu for creating notes from selected text (only when notes mode is NOT active)
    document.addEventListener('contextmenu', (e) => {
      // Don't show context menu if notes mode is active or if right-clicking on notes elements
      if (this.isActive || e.target.closest('.notes-overlay') || e.target.closest('.notes-context-menu')) {
        return;
      }

      // Get selected text
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      // Prevent default context menu and show our custom menu
      e.preventDefault();
      this.selectedText = selectedText;
      this.contextMenuPosition = { x: e.clientX, y: e.clientY };
      this.showContextMenu(e.clientX, e.clientY);
    });
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
   * Create text note
   */
  createTextNote(content = '', x = 100, y = 100, id = null, sourceText = null, highlightId = null, markerId = null, markerPosition = null) {
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
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
      <div class="note-content" contenteditable="true">${content}</div>
    `;

    // Delete button - prevent dragging when clicking
    const deleteBtn = noteElement.querySelector('.note-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent drag from starting
      const index = this.textNotes.findIndex(n => n.id === noteId);
      if (index > -1) {
        const noteData = this.textNotes[index];
        
        // Remove associated highlight
        if (noteData.highlightId) {
          const highlightIndex = this.textHighlights.findIndex(h => h.highlightId === noteData.highlightId);
          if (highlightIndex > -1) {
            const highlight = this.textHighlights[highlightIndex];
            if (highlight.element && highlight.element.parentNode) {
              const parent = highlight.element.parentNode;
              parent.replaceChild(document.createTextNode(highlight.element.textContent), highlight.element);
              parent.normalize();
            }
            this.textHighlights.splice(highlightIndex, 1);
          }
        }
        
        // Remove associated position marker
        if (noteData.markerId) {
          const markerIndex = this.positionMarkers.findIndex(m => m.markerId === noteData.markerId);
          if (markerIndex > -1) {
            const marker = this.positionMarkers[markerIndex];
            if (marker.element && marker.element.parentNode) {
              marker.element.parentNode.removeChild(marker.element);
            }
            this.positionMarkers.splice(markerIndex, 1);
          }
        }
        
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
    
    contentDiv.addEventListener('focus', () => {
      if (contentDiv.textContent === 'Enter Note...') {
        contentDiv.textContent = '';
      }
      // Mark note as active when focused
      this.setActiveNote(noteElement);
    });
    
    // Mark note as active when clicked (use passive listener for better performance)
    noteElement.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setActiveNote(noteElement);
    }, { passive: false });
    
    // Prevent all pointer events from bubbling to canvas (use passive for better scrolling)
    noteElement.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
    }, { passive: false });

    // Make draggable
    this.makeDraggable(noteElement);

    this.overlay.appendChild(noteElement);
    this.textNotes.push({ 
      id: noteId, 
      element: noteElement,
      sourceText: sourceText,
      highlightId: highlightId,
      markerId: markerId,
      markerPosition: markerPosition
    });

    return noteElement;
  }

  /**
   * Set active note (highlight with purple/pink)
   */
  setActiveNote(noteElement) {
    // Skip if already active (performance optimization)
    if (noteElement && noteElement.classList.contains('active')) {
      return;
    }
    
    // Remove active class from all notes
    this.textNotes.forEach(note => {
      if (note.element && note.element !== noteElement) {
        note.element.classList.remove('active');
      }
    });
    
    // Add active class to the clicked note
    if (noteElement) {
      noteElement.classList.add('active');
    }
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

    const getEventCoordinates = (e) => {
      // Handle both mouse and touch events
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    };

    const pointerDownHandler = (e) => {
      // Don't start drag if clicking on delete button
      if (e.target.closest('.note-delete-btn')) {
        return;
      }
      
      e.stopPropagation(); // Prevent creating new note when clicking handle
      
      const coords = getEventCoordinates(e);
      isDragging = true;
      hasMoved = false;
      startX = coords.x;
      startY = coords.y;
      initialX = coords.x - element.offsetLeft;
      initialY = coords.y - element.offsetTop;
      element.style.zIndex = '1002';
      handle.style.cursor = 'grabbing';
      
      // Prevent text selection during drag
      e.preventDefault();
    };

    const pointerMoveHandler = (e) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
        
        const coords = getEventCoordinates(e);
        
        // Check if actually moved (more than 5px to avoid accidental drags)
        const dx = Math.abs(coords.x - startX);
        const dy = Math.abs(coords.y - startY);
        if (dx > 5 || dy > 5) {
          hasMoved = true;
        }
        
        currentX = coords.x - initialX;
        currentY = coords.y - initialY;
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
        
        hasMoved = false;
      }
    };

    // Mouse events
    handle.addEventListener('mousedown', pointerDownHandler);
    document.addEventListener('mousemove', pointerMoveHandler);
    document.addEventListener('mouseup', pointerUpHandler);
    
    // Touch events for tablets
    handle.addEventListener('touchstart', pointerDownHandler, { passive: false });
    document.addEventListener('touchmove', pointerMoveHandler, { passive: false });
    document.addEventListener('touchend', pointerUpHandler);
    document.addEventListener('touchcancel', pointerUpHandler);
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
    this.updateSliderPosition(); // Update slider position
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
    
    // Keep highlights visible after closing notes mode
    // Clear the overlay-based highlights and recreate lightweight ones
    this.clearTextHighlights();
    this.showHighlightsForCurrentSlide();
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
      
      // If notes mode is active, load notes; otherwise just show highlights
      if (this.isActive) {
        this.loadCurrentSlideNotes();
      } else {
        this.showHighlightsForCurrentSlide();
      }
      
      return true;
    } catch (error) {
      console.error('Error importing notes:', error);
      return false;
    }
  }

  /**
   * Update overlay background opacity
   */
  updateOverlayOpacity() {
    if (this.overlay) {
      this.overlay.style.background = `rgba(26, 35, 64, ${this.overlayOpacity})`;
      
      // Update displays
      const opacityDisplay = document.getElementById('notes-slider-opacity-value');
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
