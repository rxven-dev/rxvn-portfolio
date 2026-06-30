/**
 * GameVantage Preference System Telemetry Matrix
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Storage Registry Initialization
    const getPreference = (key, defaultValue) => {
        const stored = localStorage.getItem(`pref_${key}`);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    };

    const savePreference = (key, value) => {
        localStorage.setItem(`pref_${key}`, JSON.stringify(value));
    };

    // 2. Control Handles Locators
    const toggleStatus = document.getElementById('toggle-status');
    const toggleTheme = document.getElementById('toggle-theme');
    const toggleEmails = document.getElementById('toggle-emails');
    const saveButton = document.getElementById('saveProfileSettingsBtn');

    // Indicator Dot element inside user footer frame
    const statusDot = document.getElementById('sidebarStatusDot');

    // 3. Load & Apply Initial Saved State Maps
    const initialStatus = getPreference('active_status', true);
    const initialTheme = getPreference('dark_mode', true); // Defaults to dark mode
    const initialEmails = getPreference('email_logs', false);

    if (toggleStatus) toggleStatus.checked = initialStatus;
    if (toggleTheme) toggleTheme.checked = initialTheme;
    if (toggleEmails) toggleEmails.checked = initialEmails;

    // Apply styles instantly on boot
    applyStatusIndicator(initialStatus);
    applyThemeMatrix(initialTheme);

    // 4. State Rendering Functions
    function applyStatusIndicator(isActive) {
        if (!statusDot) return;
        if (isActive) {
            statusDot.style.background = '#10b981'; // Vibrant Green
            statusDot.style.boxShadow = '0 0 8px #10b981';
        } else {
            statusDot.style.background = '#9ca3af'; // Ghostly Gray
            statusDot.style.boxShadow = 'none';
        }
    }

    function applyThemeMatrix(isDark) {
        if (isDark) {
            document.documentElement.classList.remove('light-theme');
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
            document.documentElement.classList.add('light-theme');
        }
    }

    // 5. Dynamic Live Event Binding
    if (toggleStatus) {
        toggleStatus.addEventListener('change', (e) => {
            applyStatusIndicator(e.target.checked);
        });
    }

    if (toggleTheme) {
        toggleTheme.addEventListener('change', (e) => {
            applyThemeMatrix(e.target.checked);
        });
    }

    // 6. Committer Registry Deck Override
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const statusState = toggleStatus ? toggleStatus.checked : true;
            const themeState = toggleTheme ? toggleTheme.checked : true;
            const emailState = toggleEmails ? toggleEmails.checked : false;

            savePreference('active_status', statusState);
            savePreference('dark_mode', themeState);
            savePreference('email_logs', emailState);

            console.log('Telemetry updated successfully:', { statusState, themeState, emailState });
        });
    }
});