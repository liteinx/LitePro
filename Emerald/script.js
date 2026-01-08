// Emerald Chat Showcase Script with Multi-language Support

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        CONFIG_FILE: 'apks.json',
        DOWNLOAD_TIMEOUT: 30000,
        animationThreshold: 0.1,
        animationRootMargin: '0px 0px -50px 0px'
    };

    // State
    let state = {
        currentAPK: null,
        currentCode: null,
        apkName: null,
        appData: null,
        currentLanguage: 'en'
    };

    // DOM Elements
    const elements = {
        downloadBtn: null,
        downloadBtnLarge: null,
        downloadStatus: null
    };

    // Initialize the application
    function init() {
        // Detect and apply language
        detectAndApplyLanguage();

        // Setup language switcher
        setupLanguageSwitcher();

        // Cache DOM elements
        elements.downloadBtn = document.getElementById('downloadBtn');
        elements.downloadBtnLarge = document.getElementById('downloadBtnLarge');
        elements.downloadStatus = document.getElementById('downloadStatus');

        // Load APK configuration
        loadAPKConfig();

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
    }

    // Detect browser/system language and apply translations
    function detectAndApplyLanguage() {
        // Get browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0]; // Get primary language (e.g., 'ar' from 'ar-SA')

        // Check if this language is supported
        if (translations[langCode]) {
            state.currentLanguage = langCode;
            console.log(`Detected language: ${langCode}`);
        } else {
            state.currentLanguage = 'en'; // Default to English
            console.log(`Language ${langCode} not supported, using English`);
        }

        // Apply translations
        applyLanguage(state.currentLanguage);

        // Update lang attribute on HTML
        document.documentElement.lang = state.currentLanguage;

        // Set RTL for Arabic
        if (state.currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
        }

        // Mark active language button
        setTimeout(() => {
            const activeBtn = document.querySelector(`.lang-btn[data-lang="${state.currentLanguage}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }, 100);
    }

    // Setup language switcher
    function setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');

        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('data-lang');
                if (lang && translations[lang]) {
                    state.currentLanguage = lang;
                    applyLanguage(lang);

                    // Update HTML lang attribute
                    document.documentElement.lang = lang;

                    // Set RTL for Arabic
                    if (lang === 'ar') {
                        document.documentElement.dir = 'rtl';
                    } else {
                        document.documentElement.dir = 'ltr';
                    }

                    // Update active button
                    langButtons.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');

                    console.log(`Language switched to: ${lang}`);
                }
            });
        });
    }

    // Apply translations to the page
    function applyLanguage(lang) {
        const t = translations[lang];

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                // For input placeholders
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    // For regular elements
                    el.textContent = t[key];
                }
            }
        });

        // Update page title
        if (t.title) {
            document.title = `${t.title} - Anonymous Video Chat Platform`;
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && t.tagline) {
            metaDesc.setAttribute('content', `${t.tagline} - Modern, anonymous video chat platform.`);
        }
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
                state.apkName = 'Emerald Chat'; // Always show default name

                console.log(`Loading custom APK: ${app.filename} (code: ${code})`);

            } else {
                // No code or invalid code, use default
                state.currentAPK = config.default;
                state.apkName = 'Emerald Chat';

                if (code) {
                    console.warn(`Invalid code: ${code}. Using default APK.`);
                } else {
                    console.log('Using default APK');
                }
            }

        } catch (error) {
            console.error('Error loading APK config:', error);

            // Fallback to default APK
            state.currentAPK = 'Emerald_1767507934.apk';
            state.apkName = 'Emerald Chat';
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
            const t = translations[state.currentLanguage];
            showStatus(t.loading, 'loading');

            // Wait for config to load
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (!state.currentAPK) {
                showStatus(t.downloadError, 'error');
                console.error('APK config not loaded');
                return;
            }
        }

        // Show loading state
        const btn = e.currentTarget;
        const originalContent = btn.innerHTML;
        btn.disabled = true;

        const t = translations[state.currentLanguage];
        btn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">' + t.loading + '</span>';

        showStatus(t.downloading, 'loading');

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
            showStatus(t.downloadStarted, 'success');

            // Log download details
            console.log(`✓ Download initiated successfully: ${state.currentAPK}`);

        } catch (error) {
            console.error('Download failed:', error);
            showStatus(t.downloadError, 'error');
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

        // Animate safety items
        document.querySelectorAll('.safety-item').forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`;
            observer.observe(item);
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
            background: 'linear-gradient(90deg, #10b981, #8b5cf6, #06b6d4)',
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

    // Add hover effect enhancement for cards
    function enhanceCardHoverEffects() {
        document.querySelectorAll('.feature-card, .step').forEach(card => {
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

    // Add number counter animation for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 200;

        counters.forEach(counter => {
            const target = counter.innerText;
            const hasPlus = target.includes('+');
            const hasSlash = target.includes('/');
            const numericValue = parseInt(target.replace(/[^0-9]/g, ''));

            let count = 0;
            const increment = numericValue / speed;

            const updateCount = () => {
                if (count < numericValue) {
                    count += increment;
                    let displayValue = Math.ceil(count);

                    if (hasPlus) displayValue += '+';
                    if (hasSlash) displayValue = displayValue + '/7';

                    counter.innerText = displayValue;
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            // Start animation when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCount();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            enhanceCardHoverEffects();
            animateCounters();
        });
    } else {
        init();
        enhanceCardHoverEffects();
        animateCounters();
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'D' to trigger download
        if (e.key === 'd' || e.key === 'D') {
            if (elements.downloadBtn) {
                elements.downloadBtn.click();
            }
        }

        // Press 'S' to scroll to features
        if (e.key === 's' || e.key === 'S') {
            const featuresSection = document.querySelector('#features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
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
        console.log(`Emerald showcase loaded in ${loadTime}ms`);
    });

})();
