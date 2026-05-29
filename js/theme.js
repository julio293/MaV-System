/* MaV Design System — Theme + Global Nav */
(function () {
  var STORAGE_KEY = 'mav-theme';

  /* ── Full nav tree (all hrefs relative to project root) ──────────────── */
  var NAV = [
    { group: 'Getting Started' },
    { href: 'index.html',                    label: 'Overview' },
    { href: 'customiser.html',               label: '✦ Live Customiser' },
    { href: 'foundations/tokens.html',       label: 'Token Architecture' },
    { href: 'dev/css-variables.html',        label: 'CSS Variables' },

    { group: 'Foundations' },
    { href: 'foundations/colors.html',       label: 'Color System' },
    { href: 'foundations/typography.html',   label: 'Typography' },
    { href: 'foundations/spacing.html',      label: 'Spacing & Layout' },
    { href: 'foundations/effects.html',      label: 'Shadows & Effects' },
    { href: 'foundations/dark-mode.html',    label: 'Dark Mode' },

    { group: 'Components' },
    { href: 'components/buttons.html',       label: 'Buttons' },
    { href: 'components/inputs.html',        label: 'Input Fields' },
    { href: 'components/otp.html',           label: 'OTP Input' },
    { href: 'components/forms.html',         label: 'Forms & Controls' },
    { href: 'components/feedback.html',      label: 'Alerts & Toasts' },
    { href: 'components/badges.html',        label: 'Badges & Chips' },
    { href: 'components/navigation.html',    label: 'Navigation' },
    { href: 'components/chat.html',          label: 'Chat Bubbles' },
    { href: 'components/finance.html',       label: 'Finance Modules' },
    { href: 'components/all.html',           label: 'Kitchen Sink' },

    { group: 'iOS Screens' },
    { href: 'ios/01-onboarding.html',        label: 'Onboarding' },
    { href: 'ios/02-login.html',             label: 'Login' },
    { href: 'ios/03-otp.html',              label: 'OTP Verify' },
    { href: 'ios/04-home.html',              label: 'Home' },
    { href: 'ios/05-profile.html',           label: 'Profile' },
    { href: 'ios/06-settings.html',          label: 'Settings' },
    { href: 'ios/07-notifications.html',     label: 'Notifications' },
    { href: 'ios/08-dark-mode.html',         label: 'Dark Mode' },
    { href: 'ios/09-explore.html',           label: 'Explore' },
    { href: 'ios/10-payment.html',           label: 'Payment' },

    { group: 'Android Screens' },
    { href: 'android/01-onboarding.html',    label: 'Onboarding' },
    { href: 'android/02-login.html',         label: 'Login' },
    { href: 'android/03-otp.html',          label: 'OTP Verify' },
    { href: 'android/04-home.html',          label: 'Home' },
    { href: 'android/05-profile.html',       label: 'Profile' },
    { href: 'android/06-settings.html',      label: 'Settings' },
    { href: 'android/07-notifications.html', label: 'Notifications' },
    { href: 'android/08-dark-mode.html',     label: 'Dark Mode' },
    { href: 'android/09-explore.html',       label: 'Explore' },
    { href: 'android/10-payment.html',       label: 'Payment' },

    { group: 'Web App' },
    { href: 'web/01-landing.html',           label: 'Landing' },
    { href: 'web/02-login.html',             label: 'Login' },
    { href: 'web/03-dashboard.html',         label: 'Dashboard' },
    { href: 'web/04-explore.html',           label: 'Explore' },
    { href: 'web/05-profile.html',           label: 'Profile' },
    { href: 'web/06-settings.html',          label: 'Settings' },
    { href: 'web/07-notifications.html',     label: 'Notifications' },
    { href: 'web/08-dark-mode.html',         label: 'Dark Mode' },
    { href: 'web/09-checkout.html',          label: 'Checkout' },
    { href: 'web/10-playground.html',        label: 'Component Playground' },

    { group: 'Developer Reference' },
    { href: 'dev/css-variables.html',        label: 'CSS Variables' },
    { href: 'dev/token-architecture.html',   label: 'Token Architecture' },
    { href: 'dev/otp-spec.html',            label: 'OTP Spec' },
    { href: 'dev/accessibility.html',        label: 'Accessibility' },
    { href: 'dev/grid-breakpoints.html',     label: 'Grid & Breakpoints' },
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
        html += '<a href="' + prefix + item.href + '" class="' + cls + '">' + item.label + '</a>';
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
