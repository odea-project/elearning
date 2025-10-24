/**
 * iPad Text Selection Fix
 * Prevents slide swiping during text selection on iPad/iOS devices
 * 
 * Reveal.js has a built-in mechanism (data-prevent-swipe) but it doesn't
 * automatically detect text selection. This script adds that functionality.
 */

(function() {
  'use strict';
  
  // Only run on touch-enabled devices (iPad, tablets)
  if (!('ontouchstart' in window)) {
    return;
  }
  
  let isSelecting = false;
  let selectionTimeout = null;
  
  /**
   * Add data-prevent-swipe attribute when text selection is active
   */
  function preventSwipe() {
    const slides = document.querySelector('.reveal .slides');
    if (slides && !slides.hasAttribute('data-prevent-swipe')) {
      slides.setAttribute('data-prevent-swipe', 'true');
      isSelecting = true;
    }
  }
  
  /**
   * Remove data-prevent-swipe attribute when selection is done
   */
  function allowSwipe() {
    const slides = document.querySelector('.reveal .slides');
    if (slides && slides.hasAttribute('data-prevent-swipe')) {
      slides.removeAttribute('data-prevent-swipe');
      isSelecting = false;
    }
  }
  
  /**
   * Check if there's active text selection
   */
  function checkSelection() {
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().length > 0;
    
    if (hasSelection) {
      preventSwipe();
      
      // Keep checking as long as selection exists
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      selectionTimeout = setTimeout(checkSelection, 100);
    } else {
      allowSwipe();
    }
  }
  
  /**
   * Handle touch start - might be beginning of text selection
   */
  function handleTouchStart(e) {
    // If touch starts on text content, prepare to prevent swipes
    const target = e.target;
    const isTextElement = target.tagName === 'P' || 
                         target.tagName === 'SPAN' || 
                         target.tagName === 'LI' ||
                         target.tagName === 'TD' ||
                         target.tagName === 'TH' ||
                         target.tagName === 'DIV' ||
                         target.tagName === 'H1' ||
                         target.tagName === 'H2' ||
                         target.tagName === 'H3' ||
                         target.tagName === 'H4' ||
                         target.tagName === 'H5' ||
                         target.tagName === 'H6' ||
                         target.tagName === 'CODE' ||
                         target.tagName === 'PRE';
    
    if (isTextElement) {
      // Start monitoring for selection
      setTimeout(checkSelection, 50);
    }
  }
  
  /**
   * Handle touch move - might be selecting text
   */
  function handleTouchMove(e) {
    // Check for selection during touch move
    checkSelection();
  }
  
  /**
   * Handle touch end - selection might be complete
   */
  function handleTouchEnd(e) {
    // Delay check to allow selection to finalize
    setTimeout(() => {
      checkSelection();
      
      // If no selection after 500ms, definitely allow swipes again
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      selectionTimeout = setTimeout(() => {
        if (!window.getSelection().toString().length) {
          allowSwipe();
        }
      }, 500);
    }, 100);
  }
  
  /**
   * Handle selection change event
   */
  function handleSelectionChange() {
    checkSelection();
  }
  
  /**
   * Initialize when DOM is ready
   */
  function init() {
    const slides = document.querySelector('.reveal .slides');
    if (!slides) {
      // Reveal not ready yet, try again
      setTimeout(init, 100);
      return;
    }
    
    // Add touch event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    // Also monitor selection changes
    document.addEventListener('selectionchange', handleSelectionChange);
    
    console.log('iPad text selection fix initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
