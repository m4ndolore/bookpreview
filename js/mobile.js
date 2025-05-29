// Complete Dark Theme Mobile-Friendly JavaScript Enhancements
document.addEventListener('DOMContentLoaded', function() {
    
    // Enhanced touch support for buttons with dark theme feedback
    const buttons = document.querySelectorAll('.bookshelf .buttons a');
    
    buttons.forEach(button => {
        // Add visual feedback for touch with dark theme colors
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
            this.style.background = 'linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
            this.style.background = 'linear-gradient(135deg, #242952 0%, #3d2177 100%)';
            
            // Reset after animation
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #1a1f3a 0%, #2d1b69 100%)';
            }, 200);
        });
        
        // Prevent double-tap zoom on buttons
        button.addEventListener('touchend', function(e) {
            e.preventDefault();
        });
    });
    
    // Enhanced PDF viewer mobile support with dark theme
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
                        // Add haptic feedback
                        if ('vibrate' in navigator) {
                            navigator.vibrate(30);
                        }
                    }
                } else {
                    // Swipe left - next page
                    const nextBtn = document.querySelector('.bb-nav-next');
                    if (nextBtn && !nextBtn.classList.contains('bb-nav-disabled')) {
                        nextBtn.click();
                        // Add haptic feedback
                        if ('vibrate' in navigator) {
                            navigator.vibrate(30);
                        }
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
    
    // Mobile-specific PDF loading improvements with dark theme
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
        
        // Add dark theme loading indicator
        showDarkThemeLoader();
    }
    
    // Dark theme loading indicator
    function showDarkThemeLoader() {
        const existingLoader = document.querySelector('.dark-theme-loader');
        if (existingLoader) return;
        
        const loader = document.createElement('div');
        loader.className = 'dark-theme-loader';
        loader.innerHTML = `
            <div class="pdf-loading">
                <div class="pdf-loading-spinner"></div>
                <div>Loading PDF...</div>
            </div>
        `;
        
        // Hide loader when PDF loads
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 3000);
    }
    
    // Enhanced navigation buttons with dark theme
    function enhanceNavigationButtons() {
        // Handle close button with dark theme animation
        const closeBtn = document.querySelector('.bb-nav-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const viewer = document.getElementById('book-viewer');
                if (viewer) {
                    // Add a smooth fade-out animation with dark theme
                    viewer.style.transition = 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    viewer.style.opacity = '0';
                    
                    setTimeout(() => {
                        viewer.style.display = 'none';
                        viewer.style.opacity = '1';
                        viewer.style.transition = '';
                        
                        // Remove any residual dark theme elements
                        const darkLoaders = document.querySelectorAll('.dark-theme-loader');
                        darkLoaders.forEach(loader => loader.remove());
                    }, 400);
                }
                
                // Haptic feedback for close
                if ('vibrate' in navigator) {
                    navigator.vibrate([50, 50, 50]);
                }
            });
        }
        
        // Enhance prev/next buttons with dark theme feedback
        const navButtons = document.querySelectorAll('.bb-nav-prev, .bb-nav-next');
        navButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                // Add ripple effect for dark theme
                createDarkRippleEffect(this);
                
                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(30);
                }
            });
        });
        
        // Reposition prev/next buttons when PDF viewer opens
        const lookInsideBtn = document.querySelector('.bookshelf .buttons a');
        if (lookInsideBtn) {
            lookInsideBtn.addEventListener('click', function() {
                // Wait for the viewer to open, then reposition buttons
                setTimeout(() => {
                    repositionNavigationButtons();
                    addDarkThemeToViewer();
                }, 100);
            });
        }
    }
    
    // Create dark theme ripple effect
    function createDarkRippleEffect(button) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            width: 20px;
            height: 20px;
            animation: darkRipple 0.6s ease-out;
            pointer-events: none;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        `;
        
        button.style.position = 'relative';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add dark theme styles to viewer
    function addDarkThemeToViewer() {
        const viewer = document.getElementById('book-viewer');
        if (viewer) {
            viewer.style.background = '#04070D';
            
            // Ensure all child elements maintain dark theme
            const bookBlock = viewer.querySelector('.bb-bookblock');
            if (bookBlock) {
                bookBlock.style.background = '#04070D';
            }
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
                
                // Ensure buttons are visible and properly styled with dark theme
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                
                // Apply dark theme to buttons
                [prevBtn, nextBtn].forEach(btn => {
                    btn.style.background = 'rgba(4, 7, 13, 0.9)';
                    btn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                });
            }
        }
    }
    
    // Handle viewport changes with dark theme considerations
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
                    const isMobile = window.innerWidth <= 768;
                    bookBlock.style.height = isMobile ? 'calc(100vh - 70px)' : 'calc(100vh - 60px)';
                    
                    // Maintain dark theme
                    bookBlock.style.background = '#04070D';
                    viewer.style.background = '#04070D';
                    
                    // Trigger a re-render if PDF is loaded
                    const event = new Event('resize');
                    bookBlock.dispatchEvent(event);
                }
            }, 250);
        });
        
        // Handle orientation changes
        window.addEventListener('orientationchange', function() {
            setTimeout(() => {
                addDarkThemeToViewer();
                repositionNavigationButtons();
            }, 500);
        });
    }
    
    // Add dark theme loading styles
    function addDarkThemeLoadingStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes darkRipple {
                0% {
                    width: 20px;
                    height: 20px;
                    opacity: 1;
                }
                100% {
                    width: 60px;
                    height: 60px;
                    opacity: 0;
                }
            }
            
            .dark-theme-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #04070D;
                z-index: 10002;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize all mobile enhancements with dark theme
    enhancePDFViewer();
    optimizePDFForMobile();
    enhanceNavigationButtons();
    handleViewportChanges();
    addDarkThemeLoadingStyles();
    
    // Add haptic feedback for all interactive elements
    if ('vibrate' in navigator) {
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                navigator.vibrate(50); // Medium vibration for button press
            });
        });
    }
    
    // Ensure dark theme is applied when page loads
    document.body.classList.add('dark-theme-loaded');
    
    // Monitor for dynamic content and apply dark theme
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.classList.contains('bb-custom-wrapper')) {
                        addDarkThemeToViewer();
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Add final dark theme interaction styles
const darkThemeInteractionCSS = `
    .dark-theme-loaded .bookshelf .buttons a,
    .bb-custom-wrapper nav a,
    .bb-nav-prev,
    .bb-nav-next {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .dark-theme-loaded body {
        transition: background-color 0.5s ease;
    }
`;

// Inject the dark theme interaction CSS
const darkThemeStyleElement = document.createElement('style');
darkThemeStyleElement.textContent = darkThemeInteractionCSS;
document.head.appendChild(darkThemeStyleElement);