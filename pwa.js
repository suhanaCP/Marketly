// Marketly PWA bootstrap: registers the service worker and shows a lightweight
// install banner when the browser signals the app can be installed.
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      // Relative path + explicit relative scope so this resolves correctly whether the
      // site is served from a domain root or a GitHub Pages project subpath like
      // https://<user>.github.io/Marketly/ — never register with a leading "/".
      navigator.serviceWorker.register('sw.js', { scope: './' })
        .then(function (registration) {
          console.log('[pwa] service worker registered, scope:', registration.scope);
        })
        .catch(function (err) {
          console.error('[pwa] service worker registration FAILED:', err);
        });
    });
  } else {
    console.warn('[pwa] service workers are not supported in this browser.');
  }

  var deferredPrompt = null;
  var DISMISS_KEY = 'marketlyInstallDismissed';

  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function buildBanner() {
    if (document.getElementById('pwaInstallBanner')) return;
    var bar = document.createElement('div');
    bar.id = 'pwaInstallBanner';
    bar.setAttribute('role', 'complementary');
    bar.setAttribute('aria-label', 'Install Marketly app');
    bar.style.cssText = [
      'position:fixed', 'left:16px', 'right:16px', 'bottom:16px', 'z-index:9999',
      'max-width:420px', 'margin:0 auto',
      'display:flex', 'align-items:center', 'gap:12px',
      'background:#0a3160', 'color:#fff', 'padding:14px 16px', 'border-radius:12px',
      'box-shadow:0 16px 40px rgba(6,20,40,0.35)',
      'font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'font-size:13px', 'transform:translateY(120%)', 'transition:transform 0.3s ease',
      'opacity:0'
    ].join(';');

    bar.innerHTML =
      '<span style="width:36px;height:36px;flex:0 0 auto;border-radius:9px;background:#ffb300;color:#062142;display:grid;place-items:center;">' +
      '<svg viewBox="0 0 24 24" fill="none" width="19" height="19"><path d="M4 20V7.4C4 6.1 5.1 5 6.4 5h11.2C18.9 5 20 6.1 20 7.4V20" stroke="currentColor" stroke-width="1.8"/><path d="M8 20v-6h8v6M8.5 9h2m3 0h2m-7 3h2m3 0h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
      '</span>' +
      '<span style="flex:1;line-height:1.4;font-weight:600;">Install Marketly for quick, offline-ready access.</span>' +
      '<button type="button" id="pwaInstallBtn" style="min-height:36px;padding:0 14px;border:none;border-radius:6px;background:#1669c9;color:#fff;font-weight:800;font-size:13px;cursor:pointer;font-family:inherit;white-space:nowrap;">Install</button>' +
      '<button type="button" id="pwaDismissBtn" aria-label="Dismiss" style="width:28px;height:28px;flex:0 0 auto;border:none;border-radius:6px;background:transparent;color:rgba(255,255,255,0.7);cursor:pointer;font-size:16px;line-height:1;">✕</button>';

    document.body.appendChild(bar);

    requestAnimationFrame(function () {
      bar.style.transform = 'translateY(0)';
      bar.style.opacity = '1';
    });

    document.getElementById('pwaInstallBtn').addEventListener('click', function () {
      hideBanner();
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function () { deferredPrompt = null; });
    });
    document.getElementById('pwaDismissBtn').addEventListener('click', function () {
      localStorage.setItem(DISMISS_KEY, '1');
      hideBanner();
    });
  }

  function hideBanner() {
    var bar = document.getElementById('pwaInstallBanner');
    if (!bar) return;
    bar.style.transform = 'translateY(120%)';
    bar.style.opacity = '0';
    setTimeout(function () { bar.remove(); }, 300);
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === '1') return;
    if (document.body) buildBanner();
    else document.addEventListener('DOMContentLoaded', buildBanner);
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    hideBanner();
  });
})();
