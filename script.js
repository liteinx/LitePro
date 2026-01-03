// LitePro Application Script

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        APK_URL: 'https://liteinx.github.io/LitePro/LitePro.apk',
        APK_NAME: 'LitePro.apk',
        DOWNLOAD_TIMEOUT: 30000 // 30 seconds
    };

    // DOM Elements
    const elements = {
        downloadBtn: null,
        screenshotBtn: null,
        modal: null,
        modalOverlay: null,
        closeModalBtn: null,
        downloadStatus: null
    };

    // Initialize the application
    function init() {
        // Cache DOM elements
        elements.downloadBtn = document.getElementById('downloadBtn');
        elements.screenshotBtn = document.getElementById('screenshotBtn');
        elements.modal = document.getElementById('screenshotModal');
        elements.modalOverlay = elements.modal?.querySelector('.modal-overlay');
        elements.closeModalBtn = document.getElementById('closeModal');
        elements.downloadStatus = document.getElementById('downloadStatus');

        // Attach event listeners
        attachEventListeners();
    }

    // Attach all event listeners
    function attachEventListeners() {
        if (elements.downloadBtn) {
            elements.downloadBtn.addEventListener('click', handleDownload);
        }

        if (elements.screenshotBtn) {
            elements.screenshotBtn.addEventListener('click', openModal);
        }

        if (elements.closeModalBtn) {
            elements.closeModalBtn.addEventListener('click', closeModal);
        }

        if (elements.modalOverlay) {
            elements.modalOverlay.addEventListener('click', closeModal);
        }

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && elements.modal?.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Handle APK download
    async function handleDownload() {
        if (!elements.downloadBtn || !elements.downloadStatus) return;

        // Show loading state
        const originalText = elements.downloadBtn.innerHTML;
        elements.downloadBtn.disabled = true;
        elements.downloadBtn.innerHTML = '<span class="btn-text">Starting download...</span>';
        elements.downloadStatus.className = 'status-message';
        elements.downloadStatus.textContent = '';

        try {
            // Check if URL is reachable
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.DOWNLOAD_TIMEOUT);

            const response = await fetch(CONFIG.APK_URL, {
                method: 'HEAD',
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}`);
            }

            // Create download link and trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = CONFIG.APK_URL;
            downloadLink.download = CONFIG.APK_NAME;
            downloadLink.rel = 'noopener noreferrer';

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Show success message
            showStatus('Download started! Check your downloads folder.', 'success');

        } catch (error) {
            console.error('Download failed:', error);

            // Fallback: Try direct download anyway
            try {
                const downloadLink = document.createElement('a');
                downloadLink.href = CONFIG.APK_URL;
                downloadLink.download = CONFIG.APK_NAME;
                downloadLink.target = '_blank';
                downloadLink.rel = 'noopener noreferrer';

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                showStatus('Opening download link...', 'success');
            } catch (fallbackError) {
                showStatus('Download failed. Please try again later.', 'error');
            }
        } finally {
            // Reset button state
            setTimeout(() => {
                if (elements.downloadBtn) {
                    elements.downloadBtn.disabled = false;
                    elements.downloadBtn.innerHTML = originalText;
                }
            }, 1000);
        }
    }

    // Show status message
    function showStatus(message, type) {
        if (!elements.downloadStatus) return;

        elements.downloadStatus.textContent = message;
        elements.downloadStatus.className = `status-message ${type}`;

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                elements.downloadStatus.className = 'status-message';
                elements.downloadStatus.textContent = '';
            }, 5000);
        }
    }

    // Open screenshot modal
    function openModal() {
        if (!elements.modal) return;

        elements.modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus on close button for accessibility
        elements.closeModalBtn?.focus();
    }

    // Close screenshot modal
    function closeModal() {
        if (!elements.modal) return;

        elements.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Return focus to screenshot button
        elements.screenshotBtn?.focus();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
