// Emerald Chat Showcase Script

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        animationThreshold: 0.1,
        animationRootMargin: '0px 0px -50px 0px'
    };

    // Initialize the application
    function init() {
        // Add entrance animations
        addEntranceAnimations();

        // Setup smooth scroll
        setupSmoothScroll();

        // Add parallax effect to orbs
        setupParallaxEffect();

        // Add scroll progress indicator
        addScrollProgress();
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
