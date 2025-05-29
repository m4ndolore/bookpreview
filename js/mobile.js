// Mobile-Friendly JavaScript Enhancements
// Add this to your existing bookshelf.js or create a new mobile.js file

document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced touch support for buttons
    const buttons = document.querySelectorAll('.bookshelf .buttons a');
    
    buttons.forEach(button => {
        // Add visual feedback for touch
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Prevent double-tap zoom on buttons
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
    
    // Enhanced PDF viewer mobile support
    function enhancePDFViewer() {
        const pdfViewer = document.getElementById('book-viewer');
        const bookBlock = document.querySelector('.bb-bookblock');
        
        if (!pdfViewer || !bookBlock) return;
        
        // Add touch gesture support
        let startX, startY, currentX, currentY;
        let isScrolling = false;
        
        bookBlock.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
        });
        
        bookBlock.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
            
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            // Determine if this is a horizontal swipe
            if (diffX > diffY && diffX > 50) {
                isScrolling = true;
                e.preventDefault(); // Prevent scrolling
                
                if (currentX > startX) {
                    // Swipe right - previous page
                    const prevBtn = document.querySelector('.bb-nav-prev');
                    if (prevBtn && !prevBtn.classList.contains('bb-nav-disabled')) {
                        prevBtn.click();
                    }
                } else {
                    // Swipe left - next page
                    const nextBtn = document.querySelector('.bb-nav-next');
                    if (nextBtn && !nextBtn.classList.contains('bb-nav-disabled')) {
                        nextBtn.click();
                    }
                }
                
                // Reset values
                startX = null;
                startY = null;
            }
        });
        
        bookBlock.addEventListener('touchend', function() {
            startX = null;
            startY = null;
            isScrolling = false;
        });
    }
    
    // Mobile-specific PDF loading improvements
    function optimizePDFForMobile() {
        // Check if we're on mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Add mobile-specific PDF rendering options
            if (typeof pdfjsLib !== 'undefined') {
                // Configure PDF.js for better mobile performance
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                
                // Set mobile-optimized rendering
                const renderContext = {
                    canvasContext: null,
                    viewport: null,
                    renderInteractiveForms: false, // Disable for better performance
                    enableWebGL: false // Disable WebGL on mobile for stability
                };
            }
        }
    }
    
    // Improve close button behavior on mobile
    function enhanceNavigationButtons() {
        // Handle close button
        const closeBtn = document.querySelector('.bb-nav-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const viewer = document.getElementById('book-viewer');
                if (viewer) {
                    // Add a smooth fade-out animation
                    viewer.style.transition = 'opacity 0.3s ease';
                    viewer.style.opacity = '0';
                    
                    setTimeout(() => {
                        viewer.style.display = 'none';
                        viewer.style.opacity = '1';
                        viewer.style.transition = '';
                    }, 300);
                }
            });
        }
        
        // Reposition prev/next buttons when PDF viewer opens
        const lookInsideBtn = document.querySelector('.bookshelf .buttons a[href="#"]');
        if (lookInsideBtn) {
            lookInsideBtn.addEventListener('click', function() {
                // Wait for the viewer to open, then reposition buttons
                setTimeout(() => {
                    repositionNavigationButtons();
                }, 100);
            });
        }
    }
    
    // Function to properly position the navigation buttons
    function repositionNavigationButtons() {
        const viewer = document.getElementById('book-viewer');
        const prevBtn = document.querySelector('.bb-nav-prev');
        const nextBtn = document.querySelector('.bb-nav-next');
        
        if (viewer && viewer.style.display !== 'none') {
            // Move buttons out of the nav and position them absolutely
            if (prevBtn && nextBtn) {
                // Remove from nav if they're there
                const nav = document.querySelector('.bb-custom-wrapper nav');
                if (nav.contains(prevBtn)) {
                    nav.removeChild(prevBtn);
                }
                if (nav.contains(nextBtn)) {
                    nav.removeChild(nextBtn);
                }
                
                // Append to the viewer wrapper for proper positioning
                const wrapper = document.querySelector('.bb-custom-wrapper');
                if (wrapper) {
                    wrapper.appendChild(prevBtn);
                    wrapper.appendChild(nextBtn);
                }
                
                // Ensure buttons are visible and properly styled
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
        }
    }
    
    // Handle viewport changes (orientation change, keyboard)
    function handleViewportChanges() {
        let resizeTimer;
        
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // Recalculate PDF viewer dimensions
                const bookBlock = document.querySelector('.bb-bookblock');
                const viewer = document.getElementById('book-viewer');
                
                if (bookBlock && viewer && viewer.style.display !== 'none') {
                    // Force recalculation of dimensions
                    bookBlock.style.height = 'calc(100vh - 70px)';
                    
                    // Trigger a re-render if PDF is loaded
                    const event = new Event('resize');
                    bookBlock.dispatchEvent(event);
                }
            }, 250);
        });
    }
    
    // Add loading indicator for PDF
    function addMobileLoadingIndicator() {
        const style = document.createElement('style');
        style.textContent = `
            .pdf-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 20px;
                border-radius: 8px;
                z-index: 10001;
                font-size: 16px;
                text-align: center;
            }
            
            .pdf-loading-spinner {
                width: 30px;
                height: 30px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize all mobile enhancements
    enhancePDFViewer();
    optimizePDFForMobile();
    enhanceNavigationButtons();
    handleViewportChanges();
    addMobileLoadingIndicator();
    
    // Add haptic feedback on supported devices
    if ('vibrate' in navigator) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                navigator.vibrate(50); // Short vibration for button press
            });
        });
    }
});

// Add CSS for better mobile interaction feedback
const mobileInteractionCSS = `
    /* Prevent text selection on buttons */
    .bookshelf .buttons a {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        
        /* Prevent callout on iOS */
        -webkit-touch-callout: none;
        
        /* Prevent highlight on Android */
        -webkit-tap-highlight-color: transparent;
    }
    
    /* Smooth transitions for better feel */
    .bookshelf .buttons a,
    .bb-custom-wrapper nav a {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Active states for better feedback */
    .bookshelf .buttons a:active {
        transform: scale(0.95) !important;
    }
    
    .bb-custom-wrapper nav a:active {
        transform: scale(0.9) !important;
    }
`;

// Inject the additional CSS
const mobileStyleElement = document.createElement('style');
mobileStyleElement.textContent = mobileInteractionCSS;
document.head.appendChild(mobileStyleElement);