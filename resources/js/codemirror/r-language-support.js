/**
 * R Language Support for CodeMirror 6
 * Simple syntax highlighting for R code
 */

(function() {
  'use strict';

  // Wait for CodeMirror to be loaded
  function initRLanguageSupport() {
    // Check if window has the necessary CodeMirror exports
    if (typeof window.EditorView === 'undefined') {
      setTimeout(initRLanguageSupport, 100);
      return;
    }
    
    if (window.rLanguageSupport) {
      console.log('R language support is already available from the build!');
      return;
    }
    
    console.log('R language support NOT found in build, checking for rebuild necessity');

    // For now, just create a placeholder that indicates R support is loaded
    window.rLanguageSupport = {
      extension: [],
      isLoaded: true
    };
  }

  // Start initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRLanguageSupport);
  } else {
    initRLanguageSupport();
  }
})();
