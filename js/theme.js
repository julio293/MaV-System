/* MaV Design System — Theme + Global Nav */
(function () {
  var STORAGE_KEY = 'mav-theme';

  /* ── Icon set (Lucide-style line glyphs, inner markup only) ──────────── */
  var ICONS = {
    home:      '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>',
    sparkles:  '<path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z"/><path d="M18 14l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    layers:    '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    code:      '<path d="M9 8l-4 4 4 4"/><path d="M15 8l4 4-4 4"/>',
    login:     '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/>',
    shield:    '<path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    users:     '<circle cx="9" cy="9" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M16 6.5a3 3 0 0 1 0 6"/><path d="M18.5 19a5 5 0 0 0-2.5-4.3"/>',
    dollar:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M14.5 9.3C14 8.5 13 8 12 8c-1.4 0-2.5.8-2.5 1.9 0 2.4 5 1.2 5 3.7 0 1.1-1.1 1.9-2.5 1.9-1 0-2-.5-2.5-1.3"/>',
    square:    '<rect x="4" y="7" width="16" height="10" rx="2"/>',
    input:     '<rect x="3" y="8" width="18" height="8" rx="2"/><path d="M7 11v2"/>',
    otp:       '<rect x="3" y="9" width="4" height="6" rx="1"/><rect x="10" y="9" width="4" height="6" rx="1"/><rect x="17" y="9" width="4" height="6" rx="1"/>',
    check:     '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 12l3 3 5-6"/>',
    bell:      '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M10.5 21a2 2 0 0 0 3 0"/>',
    message:   '<path d="M4 5h16v11H8l-4 3z"/>',
    tag:       '<path d="M3 12V4h8l9 9-8 8z"/><circle cx="8" cy="8" r="1.2"/>',
    avatar:    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3"/><path d="M6.3 18.5a6 6 0 0 1 11.4 0"/>',
    card:      '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
    list:      '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    compass:   '<circle cx="12" cy="12" r="9"/><path d="M15 9l-2 5-4 1 2-5z"/>',
    paneltop:  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>',
    panelbot:  '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 15h18"/>',
    tabs:      '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/><path d="M9 6v4M15 6v4"/>',
    chat:      '<path d="M21 11.5a8 8 0 0 1-11.8 7L3 21l2.5-6.2A8 8 0 1 1 21 11.5z"/>',
    messages:  '<path d="M4 6h11v7H8l-4 3z"/><path d="M9 6V4h11v8h-3"/>',
    chart:     '<path d="M5 20V12M10 20V6M15 20v-8M20 20V9"/><path d="M3 20h18"/>',
    linechart: '<path d="M4 15l4-5 4 3 5-7"/><circle cx="4" cy="15" r="1.3"/><circle cx="8" cy="10" r="1.3"/><circle cx="12" cy="13" r="1.3"/><circle cx="17" cy="6" r="1.3"/><path d="M3 20h18" opacity=".4"/>',
    wallet:    '<path d="M3 7a2 2 0 0 1 2-2h11v3"/><rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="17" cy="13" r="1.3"/>',
    minus:     '<path d="M4 12h16"/>',
    progress:  '<rect x="3" y="10" width="18" height="4" rx="2"/><path d="M3 12h9"/>',
    loader:    '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
    help:      '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.6 1.4c0 1.6-2.2 2-2.2 3.1"/><path d="M12 17h.01"/>',
    grid:      '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    palette:   '<path d="M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z"/>',
    type:      '<path d="M5 6h14"/><path d="M12 6v13"/>',
    ruler:     '<rect x="3" y="8" width="18" height="8" rx="1"/><path d="M7 8v3M11 8v3M15 8v3"/>',
    sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M19 5l-1.4 1.4M6.4 17.6 5 19"/>',
    moon:      '<path d="M20 14a8 8 0 0 1-10-10 8 8 0 1 0 10 10z"/>',
    phone:     '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M11 18h2"/>',
    monitor:   '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    book:      '<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 16h13"/>',
    dot:       '<circle cx="12" cy="12" r="3"/>'
  };
  function icon(key) {
    return '<svg class="sidebar-link-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (ICONS[key] || ICONS.dot) + '</svg>';
  }

  /* ── Full nav tree (all hrefs relative to project root) ──────────────── */
  var NAV = [
    { group: 'Getting Started' },
    { href: 'index.html',                    label: 'Overview',          ic: 'home' },
    { href: 'customiser.html',               label: '✦ Live Customiser', ic: 'sparkles' },

    { group: 'Organisms' },
    { href: 'components/auth.html',          label: 'Sign In / Sign Up', ic: 'login' },
    { href: 'components/auth-otp.html',      label: 'OTP Verification',  ic: 'shield' },
    { href: 'components/select-account.html', label: 'Select Account',   ic: 'users' },
    { href: 'components/input-amount.html',  label: 'Input Amount',      ic: 'dollar' },

    { group: 'Components' },
    { href: 'components/buttons.html',       label: 'Buttons',           ic: 'square' },
    { href: 'components/inputs.html',        label: 'Input Fields',      ic: 'input' },
    { href: 'components/otp.html',           label: 'OTP Input',         ic: 'otp' },
    { href: 'components/forms.html',         label: 'Forms & Controls',  ic: 'check' },
    { href: 'components/feedback.html',      label: 'Alerts & Toasts',   ic: 'bell' },
    { href: 'components/toast.html',         label: 'Toast',             ic: 'message' },
    { href: 'components/badges.html',        label: 'Badges & Chips',    ic: 'tag' },
    { href: 'components/avatars.html',       label: 'Avatars',           ic: 'avatar' },
    { href: 'components/cards.html',         label: 'Payment Cards',     ic: 'card' },
    { href: 'components/list.html',          label: 'List',              ic: 'list' },
    { href: 'components/navigation.html',    label: 'Navigation',        ic: 'compass' },
    { href: 'components/app-bar.html',       label: 'Header / App Bar',  ic: 'paneltop' },
    { href: 'components/button-dock.html',   label: 'Button Dock',       ic: 'panelbot' },
    { href: 'components/tabs.html',          label: 'Tabs',              ic: 'tabs' },
    { href: 'components/chat.html',          label: 'Chat Bubbles',      ic: 'chat' },
    { href: 'components/message-chat.html',  label: 'Message Chat',      ic: 'messages' },
    { href: 'components/finance.html',       label: 'Finance Modules',   ic: 'chart' },
    { href: 'components/chart.html',         label: 'Chart',             ic: 'linechart' },
    { href: 'components/balance.html',       label: 'Balance & Number',  ic: 'wallet' },
    { href: 'components/divider.html',       label: 'Divider',           ic: 'minus' },
    { href: 'components/progress.html',      label: 'Progress Bar',      ic: 'progress' },
    { href: 'components/loader.html',        label: 'Loader',            ic: 'loader' },
    { href: 'components/coachmark.html',     label: 'Coachmark',         ic: 'help' },
    { href: 'components/all.html',           label: 'Kitchen Sink',      ic: 'grid' },

    { group: 'Foundations' },
    { href: 'foundations/colors.html',       label: 'Color System',      ic: 'palette' },
    { href: 'foundations/typography.html',   label: 'Typography',        ic: 'type' },
    { href: 'foundations/spacing.html',      label: 'Spacing & Layout',  ic: 'ruler' },
    { href: 'foundations/effects.html',      label: 'Shadows & Effects', ic: 'sun' },
    { href: 'foundations/dark-mode.html',    label: 'Dark Mode',         ic: 'moon' },

    { group: 'iOS Screens' },
    { href: 'ios/01-onboarding.html',        label: 'Onboarding',        ic: 'phone' },
    { href: 'ios/02-login.html',             label: 'Login',             ic: 'phone' },
    { href: 'ios/03-otp.html',              label: 'OTP Verify',         ic: 'phone' },
    { href: 'ios/04-home.html',              label: 'Home',              ic: 'phone' },
    { href: 'ios/05-profile.html',           label: 'Profile',           ic: 'phone' },
    { href: 'ios/06-settings.html',          label: 'Settings',          ic: 'phone' },
    { href: 'ios/07-notifications.html',     label: 'Notifications',     ic: 'phone' },
    { href: 'ios/08-dark-mode.html',         label: 'Dark Mode',         ic: 'phone' },
    { href: 'ios/09-explore.html',           label: 'Explore',           ic: 'phone' },
    { href: 'ios/10-payment.html',           label: 'Payment',           ic: 'phone' },

    { group: 'Android Screens' },
    { href: 'android/01-onboarding.html',    label: 'Onboarding',        ic: 'phone' },
    { href: 'android/02-login.html',         label: 'Login',             ic: 'phone' },
    { href: 'android/03-otp.html',          label: 'OTP Verify',         ic: 'phone' },
    { href: 'android/04-home.html',          label: 'Home',              ic: 'phone' },
    { href: 'android/05-profile.html',       label: 'Profile',           ic: 'phone' },
    { href: 'android/06-settings.html',      label: 'Settings',          ic: 'phone' },
    { href: 'android/07-notifications.html', label: 'Notifications',     ic: 'phone' },
    { href: 'android/08-dark-mode.html',     label: 'Dark Mode',         ic: 'phone' },
    { href: 'android/09-explore.html',       label: 'Explore',           ic: 'phone' },
    { href: 'android/10-payment.html',       label: 'Payment',           ic: 'phone' },

    { group: 'Web App' },
    { href: 'web/01-landing.html',           label: 'Landing',           ic: 'monitor' },
    { href: 'web/02-login.html',             label: 'Login',             ic: 'monitor' },
    { href: 'web/03-dashboard.html',         label: 'Dashboard',         ic: 'monitor' },
    { href: 'web/04-explore.html',           label: 'Explore',           ic: 'monitor' },
    { href: 'web/05-profile.html',           label: 'Profile',           ic: 'monitor' },
    { href: 'web/06-settings.html',          label: 'Settings',          ic: 'monitor' },
    { href: 'web/07-notifications.html',     label: 'Notifications',     ic: 'monitor' },
    { href: 'web/08-dark-mode.html',         label: 'Dark Mode',         ic: 'monitor' },
    { href: 'web/09-checkout.html',          label: 'Checkout',          ic: 'monitor' },
    { href: 'web/10-playground.html',        label: 'Component Playground', ic: 'grid' },

    { group: 'Developer Reference' },
    { href: 'foundations/tokens.html',       label: 'Token Architecture', ic: 'layers' },
    { href: 'dev/css-variables.html',        label: 'CSS Variables',     ic: 'code' },
    { href: 'dev/token-architecture.html',   label: 'Token Deep-Dive',   ic: 'layers' },
    { href: 'dev/otp-spec.html',            label: 'OTP Spec',           ic: 'otp' },
    { href: 'dev/accessibility.html',        label: 'Accessibility',     ic: 'book' },
    { href: 'dev/grid-breakpoints.html',     label: 'Grid & Breakpoints', ic: 'ruler' },
  ];

  /* ── Helpers ──────────────────────────────────────────────────────────── */
  function getPrefix() {
    var path = window.location.pathname;
    var dirs = ['components', 'foundations', 'ios', 'android', 'web', 'dev'];
    for (var i = 0; i < dirs.length; i++) {
      if (path.indexOf('/' + dirs[i] + '/') !== -1) return '../';
    }
    return '';
  }

  function isActive(href) {
    var path = window.location.pathname;
    if (href === 'index.html') {
      return path.endsWith('/') || path.endsWith('/index.html');
    }
    return path.indexOf('/' + href) !== -1;
  }

  function buildLinks(prefix, groupCls, linkCls) {
    var html = '';
    for (var i = 0; i < NAV.length; i++) {
      var item = NAV[i];
      if (item.group) {
        html += '<div class="' + groupCls + '">' + item.group + '</div>';
      } else {
        var cls = linkCls + (isActive(item.href) ? ' active' : '');
        html += '<a href="' + prefix + item.href + '" class="' + cls + '">' +
                icon(item.ic) + '<span class="sidebar-link-text">' + item.label + '</span></a>';
      }
    }
    return html;
  }

  /* ── Nav injection (only runs on sub-pages with .doc-sidebar) ─────────── */
  function injectNav() {
    var prefix = getPrefix();
    if (!prefix) return; /* root index.html already has full nav */

    var sidebar = document.querySelector('.doc-sidebar');
    if (!sidebar) return;

    sidebar.innerHTML =
      '<div class="sidebar-logo">' +
        '<a href="' + prefix + 'index.html" class="sidebar-logo-mark">' +
          '<div class="sidebar-logo-icon">' +
            '<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">' +
              '<rect x="1" y="1" width="5" height="5" rx="1"/>' +
              '<rect x="8" y="1" width="5" height="5" rx="1"/>' +
              '<rect x="1" y="8" width="5" height="5" rx="1"/>' +
              '<rect x="8" y="8" width="5" height="5" rx="1" opacity=".4"/>' +
            '</svg>' +
          '</div>' +
          '<span class="sidebar-logo-name">MaV Design System</span>' +
        '</a>' +
      '</div>' +
      buildLinks(prefix, 'sidebar-section-label', 'sidebar-link');
  }

  /* ── Theme ────────────────────────────────────────────────────────────── */
  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    document.querySelectorAll('[data-theme-icon]').forEach(function (el) {
      el.textContent = theme === 'dark' ? '☀' : '☾';
    });
    document.querySelectorAll('[data-theme-label]').forEach(function (el) {
      el.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    });
  }

  function toggleTheme() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectNav();          /* inject full nav first so new buttons exist */
    applyTheme(getTheme()); /* then apply theme (updates any injected icons) */
    document.querySelectorAll('[data-theme-toggle]').forEach(function (el) {
      el.addEventListener('click', toggleTheme);
    });
  });

  window.mavTheme = { toggle: toggleTheme, apply: applyTheme, get: getTheme };

  /* ── Customiser bridge ─────────────────────────────────────────────────── */
  function applySync(data) {
    if (!data) return;
    var root = document.documentElement;
    if (data.theme) root.setAttribute('data-theme', data.theme);
    if (data.clearAll) { root.removeAttribute('style'); return; }
    if (data.overrides) {
      Object.entries(data.overrides).forEach(function (entry) {
        if (entry[1] === null || entry[1] === undefined) root.style.removeProperty(entry[0]);
        else root.style.setProperty(entry[0], entry[1]);
      });
    }
  }

  /* Primary channel: localStorage storage event (works across same-origin iframes) */
  var stored = localStorage.getItem('mav-overrides');
  if (stored) { try { applySync(JSON.parse(stored)); } catch(e) {} }

  window.addEventListener('storage', function (e) {
    if (e.key !== 'mav-overrides') return;
    try { applySync(JSON.parse(e.newValue)); } catch(e2) {}
  });

  /* Fallback channel: postMessage */
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'mav-sync') return;
    applySync(e.data);
  });
})();
