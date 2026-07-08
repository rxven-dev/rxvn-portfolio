document.addEventListener("DOMContentLoaded", () => {
    // Create and inject the loading overlay structure dynamically
    const overlay = document.createElement("div");
    overlay.id = "themeLoaderOverlay";
    overlay.className = "theme-loading-overlay";
    
    // Cyberpunk-style sharp-angled geometric "R" path
    overlay.innerHTML = `
        <div class="loader-svg-wrapper">
            <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path class="loader-path" 
                      d="M 25 85 
                         L 25 15 
                         L 65 15 
                         L 75 25 
                         L 75 45 
                         L 65 55 
                         L 25 55 
                         M 55 55 
                         L 75 85" />
            </svg>
        </div>
        <div class="loader-text">RECONFIGURING_MATRIX...</div>
    `;
    
    document.body.appendChild(overlay);
});

/**
 * Shows the loading overlay, updates the theme, and hides it smoothly.
 * @param {Function} updateThemeCallback - The function that applies the theme change.
 */
function triggerThemeLoading(updateThemeCallback) {
    const overlay = document.getElementById("themeLoaderOverlay");
    if (!overlay) {
        updateThemeCallback();
        return;
    }

    // 1. Show overlay
    overlay.classList.add("active");

    // 2. Wait slightly for visual immersion, swap theme, then fade out
    setTimeout(() => {
        updateThemeCallback();
        
        // Let the animation loop complete beautifully before vanishing
        setTimeout(() => {
            overlay.classList.remove("active");
        }, 1200); 
    }, 400); 
}