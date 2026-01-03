// WebHub Application Script

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        searchDebounce: 300,
        minSearchLength: 0
    };

    // DOM Elements
    const elements = {
        searchInput: null,
        categories: [],
        appCards: []
    };

    // Initialize the application
    function init() {
        // Cache DOM elements
        elements.searchInput = document.getElementById('searchInput');
        elements.categories = document.querySelectorAll('.category');
        elements.appCards = document.querySelectorAll('.app-card');

        // Attach event listeners
        attachEventListeners();

        // Add entrance animations
        addEntranceAnimations();
    }

    // Attach all event listeners
    function attachEventListeners() {
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', debounce(handleSearch, CONFIG.searchDebounce));
        }

        // Add touch feedback for mobile
        elements.appCards.forEach(card => {
            card.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
            });

            card.addEventListener('touchend', function() {
                this.style.transform = '';
            });
        });

        // Smooth scroll for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Handle search functionality
    function handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < CONFIG.minSearchLength) {
            // Show all categories if search is empty
            elements.categories.forEach(category => {
                category.classList.remove('hidden');
            });
            return;
        }

        let hasResults = false;

        elements.categories.forEach(category => {
            const appCards = category.querySelectorAll('.app-card');
            let categoryHasMatch = false;

            appCards.forEach(card => {
                const appName = card.querySelector('.app-name').textContent.toLowerCase();
                if (appName.includes(query)) {
                    card.style.display = '';
                    categoryHasMatch = true;
                    hasResults = true;
                } else {
                    card.style.display = 'none';
                }
            });

            if (categoryHasMatch) {
                category.classList.remove('hidden');
            } else {
                category.classList.add('hidden');
            }
        });

        // Show no results message if needed
        showNoResultsMessage(!hasResults && query.length > 0);
    }

    // Show no results message
    function showNoResultsMessage(show) {
        let noResultsEl = document.querySelector('.no-results');

        if (show && !noResultsEl) {
            noResultsEl = document.createElement('div');
            noResultsEl.className = 'no-results';
            noResultsEl.innerHTML = `
                <p style="font-size: 3rem; margin-bottom: 1rem;">🔍</p>
                <p>No apps found matching your search</p>
            `;
            document.querySelector('.main-content').appendChild(noResultsEl);
        } else if (!show && noResultsEl) {
            noResultsEl.remove();
        }
    }

    // Add entrance animations
    function addEntranceAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Animate categories
        elements.categories.forEach((category, index) => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(30px)';
            category.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(category);
        });

        // Animate app cards within categories
        document.querySelectorAll('.apps-grid').forEach(grid => {
            const cards = grid.querySelectorAll('.app-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = `all 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;

                const cardObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            cardObserver.unobserve(entry.target);
                        }
                    });
                }, observerOptions);

                cardObserver.observe(card);
            });
        });
    }

    // Debounce function to limit function calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Add keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Press '/' to focus search
            if (e.key === '/' && !elements.searchInput.matches(':focus')) {
                e.preventDefault();
                elements.searchInput.focus();
            }

            // Press Escape to clear search
            if (e.key === 'Escape' && elements.searchInput.matches(':focus')) {
                elements.searchInput.value = '';
                elements.searchInput.blur();
                handleSearch({ target: { value: '' } });
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupKeyboardShortcuts();
        });
    } else {
        init();
        setupKeyboardShortcuts();
    }

    // Add service worker registration for offline support (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Service worker can be added later for offline functionality
            console.log('WebHub ready - Service worker support detected');
        });
    }

    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`WebHub loaded in ${loadTime}ms`);
    });

})();
