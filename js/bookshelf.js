/**
 * bookshelf.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
(function() {

	var supportAnimations = 'WebkitAnimation' in document.body.style ||
			'MozAnimation' in document.body.style ||
			'msAnimation' in document.body.style ||
			'OAnimation' in document.body.style ||
			'animation' in document.body.style,
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// animation end event name
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		scrollWrap = document.getElementById( 'scroll-wrap' ),
		docscroll = 0,
		books = document.querySelectorAll( '#bookshelf > figure' );

	function scrollY() {
		return window.pageYOffset || window.document.documentElement.scrollTop;
	}

	function Book( el ) {
		this.el = el;
		this.book = this.el.querySelector( '.book' );
		this.ctrls = this.el.querySelector( '.buttons' );
		this.details = this.el.querySelector( '.details' );
		// create the necessary structure for the books to rotate in 3d
		this._layout();

		this.bbWrapper = document.getElementById( this.book.getAttribute( 'data-book' ) );
		if( this.bbWrapper ) {
			this._initBookBlock();
		}
		this._initEvents();
	}
	let pdfFiles = {
		"book-1": "books/_web.pdf",
		// "book-2": "books/another-book.pdf"
	};

	Book.prototype._open = function() {
		let bookWrapper = document.getElementById("book-viewer");

		if (!bookWrapper) {
			console.error("❌ book-viewer container is missing from the DOM!");
			return;
		} else {
			console.log("✅ book-viewer found in DOM!");
		}

		if (typeof pdfjsLib === "undefined") {
			console.error("❌ PDF.js is not loaded!");
			return;
		}

		console.log("🚀 _open() function is running!");

		let bookId = this.book.getAttribute("data-book");
		console.log("📖 Book ID:", bookId);
	
		let pdfUrl = pdfFiles[bookId] || "books/htsg_lulu_web.pdf";
		if (!pdfUrl) {
			console.error(`❌ No PDF file found for book ID: ${bookId}`);
			return;
		}
		console.log("📖 Loading PDF:", pdfUrl);

		// let bookWrapper = document.getElementById("book-viewer"); // ✅ Single container
		if (!bookWrapper) {
			console.error("❌ Book viewer container not found!");
			return;
		}
	
		let bookPreview = bookWrapper.querySelector(".bb-bookblock");

		if (!bookPreview) {
			console.error("❌ .bb-bookblock is missing inside book-viewer!");
			return;
		} else {
			console.log("✅ .bb-bookblock found inside book-viewer!");
		}
	
		bookPreview.innerHTML = ""; // Clear previous pages
		bookWrapper.style.display = "block";
		bookWrapper.style.visibility = "visible";
		bookWrapper.style.opacity = "1";
		bookWrapper.style.position = "fixed";
		bookWrapper.style.top = "50%";
		bookWrapper.style.left = "50%";
		bookWrapper.style.transform = "translate(-50%, -50%)";
		bookWrapper.style.zIndex = "9999";
		bookWrapper.style.background = "#fff";
		bookWrapper.style.padding = "20px";
		console.log("✅ book-viewer made visible!");


		// ✅ Ensure .bb-bookblock is also visible
		let bookBlock = document.querySelector(".bb-bookblock");
		if (bookBlock) {
			bookBlock.style.display = "block";
			bookBlock.style.visibility = "visible";
			bookBlock.style.opacity = "1";
			console.log("✅ .bb-bookblock is visible!");
		} else {
			console.error("❌ .bb-bookblock is missing!");
		}

		// ✅ Fix Next and Previous button event listeners
		setTimeout(() => {
			let nextButton = bookWrapper.querySelector(".bb-nav-next");
			let prevButton = bookWrapper.querySelector(".bb-nav-prev");
			let closeButton = document.querySelector(".bb-nav-close");

			if (closeButton) {
				closeButton.addEventListener("click", function(ev) {
					ev.preventDefault();
					console.log("❌ Close button clicked! Hiding book viewer.");
					document.getElementById("book-viewer").style.display = "none";
				});
				console.log("✅ Close button event listener added!");
			} else {
				console.error("❌ Close button NOT found!");
			}

			if (nextButton) {
				nextButton.replaceWith(nextButton.cloneNode(true)); // Remove duplicate events
				nextButton = bookWrapper.querySelector(".bb-nav-next");
				nextButton.addEventListener("click", function(ev) {
					ev.preventDefault();
					let step = currentPage === 1 ? 1 : 2;
					if (currentPage + step <= totalPages) {
						currentPage += step;
						console.log(`➡️ Next Page: ${currentPage}`);
						renderPage(currentPage);
					}
				});
				console.log("✅ Fixed Next button event listener!");
			} else {
				console.error("❌ Next button NOT found!");
			}

			if (prevButton) {
				prevButton.replaceWith(prevButton.cloneNode(true)); // Force remove old listeners
            	prevButton = document.querySelector(".bb-nav-prev");
            	prevButton.addEventListener("click", function(ev) {
                ev.preventDefault();
                console.log("⬅️ Back button clicked!");

                if (currentPage <= 2) {
                    currentPage = 1;
                    console.log("⬅️ Returning to cover page (cover1.png)!");
                    renderPage(currentPage);
                } else {
                    let step = 2;
                    if (currentPage - step >= 1) {
                        currentPage -= step;
                        console.log(`⬅️ Previous Pages: ${currentPage} & ${currentPage + 1}`);
                        renderPage(currentPage);
                    }
                }
			});
		}
		}, 500); // Ensure the pop-up is fully visible before adding listeners

		// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
		console.log("📖 Attempting to load PDF:", pdfUrl);

		// Load PDF dynamically
		pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
			console.log("✅ PDF Loaded Successfully:", pdfUrl);
			pdfDoc = pdf;
			totalPages = pdf.numPages;
			currentPage = 1; // Start from the first page
			renderPage(currentPage);
		}).catch(error => {
			console.error("❌ PDF failed to load!", error);
		});
	

		function renderPage(pageNumber) {
			if (!pdfDoc) {
				console.error("❌ PDF document is not loaded!");
				return;
			}
			let bookPreview = document.querySelector(".bb-bookblock"); // ✅ Correct container
			if (!bookPreview) {
				console.error("❌ Book preview container not found!");
				return;
			}

			bookPreview.innerHTML = ""; // Clear previous pages

			// Create a container for the spread
			let spreadContainer = document.createElement("div");
			spreadContainer.style.display = "flex"; // Side-by-side layout
			spreadContainer.style.justifyContent = "center";
			spreadContainer.style.alignItems = "center";
			spreadContainer.style.gap = "10px"; // Space between pages
			spreadContainer.style.width = "100%";
    		bookPreview.appendChild(spreadContainer); // ✅ Ensure it’s added INSIDE `.bb-bookblock`
			
			// ✅ Display cover image if it's the first page
			if (pageNumber === 1) {
				let coverImage = document.createElement("img");
				coverImage.src = "img/cover1.png"; // 🔹 Replace with your actual path
				coverImage.alt = "Book Cover";
				coverImage.style.maxWidth = "60%";
				coverImage.style.maxHeight = "60%";
				coverImage.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.2)";
				spreadContainer.appendChild(coverImage);
				console.log("✅ Cover image displayed instead of Page 1.");
				return; // Exit so it doesn't try to render the PDF
			}

			 // ✅ Ensure pages render side by side
			let pagesToRender = [pageNumber]; // Always render at least one page
			if (pageNumber + 1 <= totalPages) {
				pagesToRender.push(pageNumber + 1); // Add the next page for spreads (except first)
			}
		
			pagesToRender.forEach((pageNum) => {
				pdfDoc.getPage(pageNum).then(page => {
					let scale = 1.3;
					let viewport = page.getViewport({ scale });
		
					let canvas = document.createElement("canvas");
					let context = canvas.getContext("2d", { willReadFrequently: true });
					canvas.width = viewport.width;
					canvas.height = viewport.height;
		
					let renderContext = {
						canvasContext: context,
						viewport: viewport
					};
		
					page.render(renderContext).promise.then(() => {
						console.log(`✅ Page ${pageNum} rendered!`);
						spreadContainer.appendChild(canvas);
					}).catch(error => {
						console.error("❌ Error rendering page:", error);
					});
				}).catch(error => {
					console.error("❌ Error fetching page:", error);
				});
			});
		
		}
	
		window.addEventListener("load", function() {
			let bookWrapper = document.getElementById("book-viewer");
			let nextButton = bookWrapper.querySelector(".bb-nav-next");
			let prevButton = bookWrapper.querySelector(".bb-nav-prev");
		
			nextButton.addEventListener("click", function(ev) {
				ev.preventDefault();
				let step = currentPage === 1 ? 1 : 2; // Move 1 page for first page, then 2 pages at a time
				if (currentPage + step <= totalPages) {
					currentPage += step;
					console.log(`➡️ Next Page: ${currentPage}`);
					renderPage(currentPage);
				}
			});
			prevButton.addEventListener("click", function(ev) {
				ev.preventDefault();
				console.log(`⬅️ Attempting to navigate from Page ${currentPage}`);

				if (currentPage === 2) {
					// ✅ Special case: If on pages 2 & 3, go back to cover (Page 1)
					currentPage = 1;
					console.log("⬅️ Returning to cover page!");
					renderPage(currentPage);
				} else {
					let step = 2; // Move back 2 pages for all other spreads
					if (currentPage - step >= 1) {
						currentPage -= step;
						console.log(`⬅️ Previous Pages: ${currentPage} & ${currentPage + 1}`);
						renderPage(currentPage);
					}
				}
			});
		});

		// ✅ Debug buttons
		setTimeout(() => {
			document.querySelectorAll("#book-viewer button, #book-viewer a").forEach(btn => {
				btn.style.pointerEvents = "auto";
				btn.style.zIndex = "10000"; // Bring above overlays
				console.log("✅ Buttons made clickable!");
			});
		}, 500);
			
	}
	
	Book.prototype._layout = function() {
		if( Modernizr.csstransforms3d ) {
			this.book.innerHTML = '<div class="cover"><div class="front"></div><div class="inner inner-left"></div></div><div class="inner inner-right"></div>';
			var perspective = document.createElement( 'div' );
			perspective.className = 'perspective';
			perspective.appendChild( this.book );
			this.el.insertBefore( perspective, this.ctrls );
		}
		if( this.details ) {
			this.closeDetailsCtrl = document.createElement( 'span' )
			this.closeDetailsCtrl.className = 'close-details';
			this.details.appendChild( this.closeDetailsCtrl );
		}
	}

	Book.prototype._initBookBlock = function() {
		console.log("✅ Initializing bookblock...");

		// Ensure .bb-bookblock exists before initializing
		this.bbWrapper = document.querySelector(".bb-bookblock");
		if (!this.bbWrapper) {
			console.error("❌ .bb-bookblock does not exist! Retrying...");
			setTimeout(() => this._initBookBlock(), 500); // Retry after delay
			return;
		}

		// initialize bookblock instance
		this.bb = new BookBlock( this.bbWrapper.querySelector( '.bb-bookblock' ), {
			speed : 700,
			shadowSides : 0.8,
			shadowFlip : 0.4
		} );
		// boobkblock controls

		console.log("✅ BookBlock initialized successfully!");

		this.ctrlBBClose = this.bbWrapper.querySelector( ' .bb-nav-close' );
		this.ctrlBBNext = this.bbWrapper.querySelector( ' .bb-nav-next' );
		this.ctrlBBPrev = this.bbWrapper.querySelector( ' .bb-nav-prev' );
	}

	Book.prototype._initEvents = function() {
		console.log("🔄 _initEvents() is running...");

		var self = this;
		if( !this.ctrls ) return;

		let lookInsideBtn = this.ctrls.querySelector('a[href="#"]');

		if (lookInsideBtn) {
			console.log("✅ 'Look Inside' button found!");
			lookInsideBtn.addEventListener("click", function(ev) {
				ev.preventDefault();
				console.log("🚀 Click event triggered!");
				self._open();
			});
		} else {
			console.error("❌ 'Look Inside' button NOT found!");
		}

		if( this.bb ) {
			
			this.ctrlBBClose.addEventListener( 'click', function( ev ) { ev.preventDefault(); self._close(); } );
			this.ctrlBBNext.addEventListener( 'click', function( ev ) { ev.preventDefault(); self._nextPage(); } );
			this.ctrlBBPrev.addEventListener( 'click', function( ev ) { ev.preventDefault(); self._prevPage(); } );
		}

		if( this.details ) {
			this.ctrls.querySelector( 'a:nth-child(2)' ).addEventListener( 'click', function( ev ) { ev.preventDefault(); self._showDetails(); } );
			this.closeDetailsCtrl.addEventListener( 'click', function() { self._hideDetails(); } );
		}
	}

	Book.prototype._close = function() {
		classie.remove( scrollWrap, 'hide-overflow' );
		setTimeout( function() { document.body.scrollTop = document.documentElement.scrollTop = docscroll; }, 25 );
		classie.remove( this.el, 'open' );
		classie.add( this.el, 'close' );
		classie.remove( this.bbWrapper, 'show' );
		classie.add( this.bbWrapper, 'hide' );

		var self = this,
			onCloseBookEndFn = function( ev ) {
				this.removeEventListener( animEndEventName, onCloseBookEndFn );
				// reset bookblock starting page
				self.bb.jump(1);
				classie.remove( self.el, 'close' );
				classie.remove( self.bbWrapper, 'hide' );
			};

		if( supportAnimations ) {
			this.bbWrapper.addEventListener( animEndEventName, onCloseBookEndFn );
		}
		else {
			onCloseBookEndFn.call();
		}
	}

	Book.prototype._nextPage = function() {
		this.bb.next();
	}

	Book.prototype._prevPage = function() {
		this.bb.prev();
	}

	Book.prototype._showDetails = function() {
		classie.add( this.el, 'details-open' );
	}

	Book.prototype._hideDetails = function() {
		classie.remove( this.el, 'details-open' );
	}

	// function init() {
	// 	[].slice.call( books ).forEach( function( el ) {
	// 		new Book( el );
	// 	} );
	// }

	function init() {
		window.books = [].slice.call(books).map(function(el) {
			let bookInstance = new Book(el);
			console.log("📚 Created Book instance:", bookInstance);
			return bookInstance;
		});
	}

	init();

})();