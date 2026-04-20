(function () {
  'use strict';

  const INBOX = 'https://www.instagram.com/direct/inbox/';

  function redirectIfNeeded() {
    if (!window.location.pathname.startsWith('/direct/')) {
      window.location.replace(INBOX);
    }
  }

  // Intercetta navigazione SPA (React Router usa history API)
  const _push = history.pushState.bind(history);
  const _replace = history.replaceState.bind(history);

  history.pushState = function (s, t, url) {
    _push(s, t, url);
    redirectIfNeeded();
  };

  history.replaceState = function (s, t, url) {
    _replace(s, t, url);
    redirectIfNeeded();
  };

  window.addEventListener('popstate', redirectIfNeeded);

  // Controllo immediato al caricamento
  redirectIfNeeded();
  document.addEventListener('DOMContentLoaded', redirectIfNeeded);

  // Disabilita visivamente i link di navigazione non-chat
  function injectStyles() {
    const s = document.createElement('style');
    s.textContent = `
      a[href="/"],
      a[href="/explore/"],
      a[href="/reels/"],
      [aria-label="Home"],
      [aria-label="Search"],
      [aria-label="Cerca"],
      [aria-label="Explore"],
      [aria-label="Esplora"],
      [aria-label="Reels"],
      [aria-label="New post"],
      [aria-label="Nuova pubblicazione"],
      [aria-label="Create"],
      [aria-label="Notifications"],
      [aria-label="Notifiche"] {
        opacity: 0.15 !important;
        pointer-events: none !important;
        cursor: not-allowed !important;
      }
    `;
    (document.head || document.documentElement).appendChild(s);
  }

  if (document.head) {
    injectStyles();
  } else {
    document.addEventListener('DOMContentLoaded', injectStyles);
  }
})();
