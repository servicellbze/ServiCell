/* ServiCell Belize — shared site behaviour (mobile menu) */
(function () {
    function init() {
        var burger = document.querySelector('.hamburger');
        var menu = document.getElementById('navLinks');
        if (!burger || !menu) return;

        function setOpen(open) {
            menu.classList.toggle('active', open);
            burger.classList.toggle('active', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            setOpen(!menu.classList.contains('active'));
        });

        // Close on link click or on any click outside the menu
        document.addEventListener('click', function (e) {
            if (!menu.classList.contains('active')) return;
            if (e.target.closest('.nav-btn') || !menu.contains(e.target)) setOpen(false);
        });

        // Close on Escape and return focus to the menu button
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                setOpen(false);
                burger.focus();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
