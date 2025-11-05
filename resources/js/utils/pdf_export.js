/**
 * PDF Export Utility for Reveal.js Presentations
 * Provides two export modes:
 * 1. A4 Landscape - for printing on standard paper
 * 2. 16:9 Presentation - for digital presentation format
 */

(function() {
    'use strict';

    const PDFExport = {
        /**
         * Export presentation as 16:9 PDF
         * Opens in new window with print-pdf query parameter and 16:9 settings
         * Excludes first two slides and last slide (system slides)
         */
        export16x9: function() {
            // Build URL with print parameters for 16:9
            const url = new URL(window.location.href);
            // Remove any existing print-pdf or pdfFormat parameters
            url.searchParams.delete('print-pdf');
            url.searchParams.delete('pdfFormat');
            url.searchParams.delete('excludeSlides');
            // Add new parameters
            url.searchParams.set('print-pdf', '');
            url.searchParams.set('pdfFormat', '16x9');
            url.searchParams.set('excludeSlides', 'system');
            
            // Show instructions notification
            this.showExportNotification('16:9 Presentation', 'Exporting content slides only (system slides excluded). Print dialog will open automatically.');
            
            // Open in new window
            const printWindow = window.open(url.toString(), '_blank');
            
            if (printWindow) {
                // Instructions for the user
                console.log('Opening 16:9 PDF export...');
                console.log('Excluding first 2 slides and last slide (system slides)');
                console.log('The print dialog will open automatically.');
                console.log('In the print dialog:');
                console.log('  ✓ Destination: Save as PDF');
                console.log('  ✓ Paper size: Custom (1920 × 1080 pixels)');
                console.log('  ✓ Margins: None');
                console.log('  ✓ Background graphics: ON');
                console.log('Then click "Save" to download your PDF.');
            } else {
                alert('Please allow pop-ups for PDF export to work.');
            }
        },
        
        /**
         * Show export notification
         */
        showExportNotification: function(format, message) {
            const notification = document.createElement('div');
            notification.className = 'pdf-export-notification';
            notification.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">
                    <i class="fas fa-file-pdf"></i> Exporting: ${format}
                </div>
                <div style="font-size: 14px;">${message}</div>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                color: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.3);
                z-index: 10001;
                max-width: 400px;
                font-family: 'Lato', sans-serif;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        },

        /**
         * Initialize export menu
         */
        init: function() {
            this.createExportMenu();
            console.log('PDF Export initialized');
        },

        /**
         * Create the export menu UI
         */
        createExportMenu: function() {
            // Create button (no dropdown needed with single option)
            const button = document.createElement('button');
            button.id = 'pdf-export-button';
            button.className = 'pdf-export-button';
            button.innerHTML = '<i class="fas fa-file-pdf"></i> Export to PDF';
            button.setAttribute('aria-label', 'Export to PDF');
            button.setAttribute('title', 'Export presentation to PDF (16:9 format, content slides only)');
            
            // Initially hidden until tutorial is loaded
            button.style.display = 'none';
            
            // Button click handler - directly trigger export
            button.onclick = () => {
                this.export16x9();
            };
            
            // Add to page
            document.body.appendChild(button);
            
            // Check if tutorial is already loaded
            this.updateButtonVisibility();
            
            // Watch for dynamic slides being added
            this.observeTutorialLoading();
        },
        
        /**
         * Check if tutorial is loaded and show/hide button accordingly
         */
        updateButtonVisibility: function() {
            const button = document.getElementById('pdf-export-button');
            if (!button) return;
            
            const hasDynamicSlides = document.querySelectorAll('.reveal .slides section.dynamic').length > 0;
            button.style.display = hasDynamicSlides ? 'flex' : 'none';
        },
        
        /**
         * Observe DOM changes to detect when tutorial is loaded
         */
        observeTutorialLoading: function() {
            const slidesContainer = document.querySelector('.reveal .slides');
            if (!slidesContainer) return;
            
            // Use MutationObserver to watch for added slides
            const observer = new MutationObserver(() => {
                this.updateButtonVisibility();
            });
            
            observer.observe(slidesContainer, {
                childList: true,
                subtree: true
            });
            
            // Also check periodically in case observer misses something
            setInterval(() => {
                this.updateButtonVisibility();
            }, 1000);
        },
    };

    /**
     * Apply PDF format based on URL parameter
     * Also enables performance mode for cleaner output
     */
    function applyPDFFormat() {
        const urlParams = new URLSearchParams(window.location.search);
        const pdfFormat = urlParams.get('pdfFormat');
        const excludeSlides = urlParams.get('excludeSlides');
        
        if (pdfFormat && document.documentElement) {
            document.documentElement.setAttribute('data-pdf-format', pdfFormat);
            console.log(`PDF format set to: ${pdfFormat}`);
            
            // Enable performance mode for print
            enablePerformanceModeForPrint();
            
            // Exclude system slides if requested
            if (excludeSlides === 'system') {
                excludeSystemSlides();
            }
            
            // If this is a print-pdf view, wait a bit then auto-trigger print
            if (urlParams.has('print-pdf')) {
                // Wait for Reveal.js to finish rendering PDF pages
                waitForPDFReady().then(() => {
                    console.log('PDF pages ready, triggering print dialog...');
                    setTimeout(() => {
                        window.print();
                    }, 500);
                });
            }
        }
    }
    
    /**
     * Exclude system slides from PDF export
     * Hides slides with specific IDs: intro-slide, load-tutorial, dynamic-tutorial
     */
    function excludeSystemSlides() {
        // System slide IDs to exclude
        const systemSlideIds = ['intro-slide', 'load-tutorial', 'dynamic-tutorial'];
        
        // Function to hide slides
        const hideSystemSlides = () => {
            let excludedCount = 0;
            
            systemSlideIds.forEach(slideId => {
                const slide = document.getElementById(slideId);
                if (slide) {
                    // Multiple methods to ensure they're hidden
                    slide.style.display = 'none !important';
                    slide.style.visibility = 'hidden';
                    slide.style.height = '0';
                    slide.style.width = '0';
                    slide.style.overflow = 'hidden';
                    slide.setAttribute('data-excluded-from-pdf', 'true');
                    slide.setAttribute('aria-hidden', 'true');
                    slide.classList.add('pdf-excluded');
                    
                    // Remove from parent to prevent PDF page generation
                    if (slide.parentNode) {
                        slide.remove();
                    }
                    
                    excludedCount++;
                    console.log(`  ✓ Excluded slide: #${slideId}`);
                }
            });
            
            if (excludedCount > 0) {
                console.log(`Successfully excluded ${excludedCount} system slides from PDF`);
            }
        };
        
        // Try immediately
        hideSystemSlides();
        
        // Also try after a short delay to catch any late-loading slides
        setTimeout(hideSystemSlides, 100);
        setTimeout(hideSystemSlides, 500);
    }
    
    /**
     * Enable performance mode for clean PDF output
     */
    function enablePerformanceModeForPrint() {
        // Force performance mode for print
        document.body.classList.add('performance-mode');
        console.log('Performance mode enabled for PDF export');
        
        // Try to use the performance mode manager if available
        if (window.performanceModeManager) {
            window.performanceModeManager.enable();
        }
    }
    
    /**
     * Wait for Reveal.js PDF-ready event
     */
    function waitForPDFReady() {
        return new Promise((resolve) => {
            // Check if Reveal is available
            if (typeof Reveal !== 'undefined') {
                // Listen for pdf-ready event
                Reveal.on('pdf-ready', () => {
                    console.log('PDF ready event fired');
                    resolve();
                });
                
                // Fallback timeout in case event doesn't fire
                setTimeout(() => {
                    console.log('PDF ready timeout');
                    resolve();
                }, 3000);
            } else {
                // If Reveal not available, just wait a bit
                setTimeout(resolve, 2000);
            }
        });
    }

    // Apply PDF format immediately if in print mode
    applyPDFFormat();

    // Initialize when DOM is ready (only for regular view, not print view)
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('print-pdf')) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => PDFExport.init());
        } else {
            PDFExport.init();
        }
    }

    // Expose to global scope
    window.PDFExport = PDFExport;
})();
