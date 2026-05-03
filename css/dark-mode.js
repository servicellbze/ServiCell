/* ============================================
   SERVICELL UNIVERSAL DARK MODE SCRIPT
   ============================================ */

// CRITICAL: Apply theme IMMEDIATELY (before page renders)
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
})();

// Dark Mode Toggle Function
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button if it exists
    updateToggleButton(newTheme);
}

// Update toggle button appearance
function updateToggleButton(theme) {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;
    
    const icon = toggleBtn.querySelector('.theme-toggle-icon');
    const text = toggleBtn.querySelector('span:not(.theme-toggle-icon)');
    
    if (theme === 'dark') {
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Light';
    } else {
        if (icon) icon.textContent = '🌙';
        if (text) text.textContent = 'Dark';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Ensure theme is applied
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create toggle button if it doesn't exist
    if (!document.querySelector('.theme-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('onclick', 'toggleTheme()');
        toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
        
        const icon = savedTheme === 'dark' ? '☀️' : '🌙';
        const text = savedTheme === 'dark' ? 'Light' : 'Dark';
        
        toggleBtn.innerHTML = `
            <span class="theme-toggle-icon">${icon}</span>
            <span>${text}</span>
        `;
        
        document.body.appendChild(toggleBtn);
    } else {
        // Update existing button
        updateToggleButton(savedTheme);
    }
});
