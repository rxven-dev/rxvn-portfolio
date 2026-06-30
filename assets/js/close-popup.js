// assets/js/close-popup.js - Global Custom Modal Popup Engine

window.showCustomPopup = function(message, type = 'success', callback = null) {
    const modal = document.getElementById('globalNotificationModal');
    const textEl = document.getElementById('modalMessageText');
    const iconContainer = document.getElementById('modalIconContainer');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (!modal || !textEl) return;

    // Set the dynamic notification message string
    textEl.textContent = message;

    // Configure matching brand layout colors based on event context types
    if (type === 'danger') {
        if (iconContainer) {
            iconContainer.innerHTML = `<i class="ri-error-warning-line"></i>`;
            iconContainer.style.color = '#ef4444'; // Red danger token
        }
        if (closeBtn) closeBtn.style.background = '#ef4444';
    } else {
        if (iconContainer) {
            iconContainer.innerHTML = `<i class="ri-checkbox-circle-line"></i>`;
            iconContainer.style.color = '#10b981'; // Green success token
        }
        if (closeBtn) closeBtn.style.background = '#4f46e5'; // Deep Indigo primary theme
    }

    // Toggle pop-up window visibility instantly
    modal.style.display = 'flex';

    // Handle close actions cleanly
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
            if (typeof callback === 'function') {
                callback();
            }
        };
    }
};