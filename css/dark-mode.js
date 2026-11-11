/* ============================================
   SERVICELL UNIVERSAL DARK MODE SCRIPT
   Load in <head> (not deferred) so the theme is applied before first paint.
   ============================================ */

function getPreferredTheme() {
    try {
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) { /* storage blocked */ }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme immediately (before the page renders)
document.documentElement.setAttribute('data-theme', getPreferredTheme());

function toggleTheme() {
    var html = document.documentElement;
    var newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    try { localStorage.setItem('theme', newTheme); } catch (e) { /* storage blocked */ }
    updateToggleButton(newTheme);
}

function updateToggleButton(theme) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        var icon = btn.querySelector('.theme-toggle-icon');
        if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', toggleTheme);
    });
    updateToggleButton(theme);
});
