/* ServiCell Belize — shared site behaviour */

/* ============================================
   SITE SETTINGS — fill these in
   ============================================ */
var SERVICELL_CONFIG = {
    // GoatCounter site code, e.g. 'servicell' for https://servicell.goatcounter.com
    // Leave empty to keep analytics off.
    goatcounterCode: '',

    // Your Google Business Profile reviews link (from Google Maps → Share, or the
    // "Ask for reviews" link in your Business Profile). Leave empty to fall back to
    // a Google Maps search for the shop.
    googleReviewsUrl: '',

    whatsappNumber: '5016153388',
    whatsappMessage: 'Hi ServiCell! I need help with my phone.'
};

/* ============================================
   ANALYTICS (GoatCounter) — page views + click events
   ============================================ */
(function () {
    var code = SERVICELL_CONFIG.goatcounterCode;
    if (code && !/^(localhost|127\.)/.test(location.hostname)) {
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://gc.zgo.at/count.js';
        s.setAttribute('data-goatcounter', 'https://' + code + '.goatcounter.com/count');
        document.head.appendChild(s);
    }

    function pageName() {
        var p = location.pathname.split('/').pop() || 'index.html';
        return p.replace('.html', '');
    }

    // Usage: scTrack('whatsapp-click') — safe to call when analytics is off.
    window.scTrack = function (name) {
        try {
            if (window.goatcounter && window.goatcounter.count) {
                window.goatcounter.count({ path: name, title: name + ' (' + pageName() + ')', event: true });
            }
        } catch (e) { /* never break the page for analytics */ }
    };

    document.addEventListener('click', function (e) {
        var el = e.target.closest && e.target.closest('a, [data-track]');
        if (!el) return;
        if (el.dataset.track) return window.scTrack(el.dataset.track);
        var href = el.getAttribute('href') || '';
        if (href.indexOf('https://wa.me/') === 0) window.scTrack('whatsapp-click');
        else if (href.indexOf('tel:') === 0) window.scTrack('call-click');
        else if (href.indexOf('mailto:') === 0) window.scTrack('email-click');
        else if (href.indexOf('google.com/maps/dir') !== -1) window.scTrack('directions-click');
    });
})();

/* ============================================
   PAGE FEATURES
   ============================================ */
(function () {
    var WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.94.95-3.48-.22-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.89.98 6.67 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.44 9.44zm8.04-17.48A11.3 11.3 0 0 0 12.04.7C5.77.7.67 5.8.67 12.06c0 2 .52 3.96 1.52 5.68L.57 23.3l5.7-1.5a11.33 11.33 0 0 0 5.77 1.47h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.04z"/></svg>';

    function waLink(message) {
        return 'https://wa.me/' + SERVICELL_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(message || SERVICELL_CONFIG.whatsappMessage);
    }
    window.scWhatsAppLink = waLink;

    /* ---------- Mobile menu ---------- */
    function initMenu() {
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

        document.addEventListener('click', function (e) {
            if (!menu.classList.contains('active')) return;
            if (e.target.closest('.nav-btn') || !menu.contains(e.target)) setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                setOpen(false);
                burger.focus();
            }
        });
    }

    /* ---------- Open now / closed (Belize time) ---------- */
    // [day 0=Sun..6=Sat]: [openMinutes, closeMinutes] or null when closed
    var HOURS = [null, [480, 1200], [480, 1200], [480, 1200], [480, 1200], [480, 1200], [540, 1140]];
    var DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    function fmt(mins) {
        var h = Math.floor(mins / 60), m = mins % 60, ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + (m ? ':' + (m < 10 ? '0' : '') + m : '') + ' ' + ap;
    }

    function belizeNow() {
        var parts = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Belize', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23'
        }).formatToParts(new Date());
        var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
        return { day: DAY_NAMES.indexOf(get('weekday')), mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    }

    function openStatus() {
        var now = belizeNow(), today = HOURS[now.day];
        if (today && now.mins >= today[0] && now.mins < today[1]) {
            return { open: true, text: 'Open now · until ' + fmt(today[1]) };
        }
        if (today && now.mins < today[0]) {
            return { open: false, text: 'Closed · opens ' + fmt(today[0]) };
        }
        for (var i = 1; i <= 7; i++) {
            var d = (now.day + i) % 7;
            if (HOURS[d]) {
                return { open: false, text: 'Closed · opens ' + (i === 1 ? 'tomorrow' : DAY_NAMES[d]) + ' ' + fmt(HOURS[d][0]) };
            }
        }
        return { open: false, text: 'Closed' };
    }

    function initOpenStatus() {
        var els = document.querySelectorAll('[data-open-status]');
        if (!els.length) return;
        var st;
        try { st = openStatus(); } catch (e) { return; }
        els.forEach(function (el) {
            el.textContent = st.text;
            el.classList.add('open-status', st.open ? 'is-open' : 'is-closed');
            el.hidden = false;
        });
    }

    /* ---------- Google reviews links ---------- */
    function initReviewLinks() {
        if (!SERVICELL_CONFIG.googleReviewsUrl) return;
        document.querySelectorAll('[data-reviews-link]').forEach(function (a) {
            a.href = SERVICELL_CONFIG.googleReviewsUrl;
        });
    }

    /* ---------- Floating WhatsApp button (shown on phones via CSS) ---------- */
    function initStickyWhatsApp() {
        if (document.querySelector('.sticky-wa')) return;
        var a = document.createElement('a');
        a.className = 'sticky-wa';
        a.href = waLink();
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', 'Chat with ServiCell on WhatsApp');
        a.innerHTML = WA_ICON + '<span>WhatsApp</span>';
        document.body.appendChild(a);
        document.body.classList.add('has-sticky-wa');

        // Hide it while the page's own main WhatsApp call-to-action is on screen
        var heroCta = document.querySelector('[data-hide-sticky-wa]');
        if (heroCta && 'IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                var visible = entries[0].isIntersecting;
                a.classList.toggle('is-hidden', visible);
                a.setAttribute('aria-hidden', visible ? 'true' : 'false');
                a.tabIndex = visible ? -1 : 0;
            }).observe(heroCta);
        }
    }

    function init() {
        initMenu();
        initOpenStatus();
        initReviewLinks();
        initStickyWhatsApp();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
