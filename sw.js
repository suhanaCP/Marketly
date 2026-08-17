// Marketly service worker
// Strategy: network-first for page navigations (fresh content when online, cached
// fallback + offline page when not), cache-first for same-origin static assets.

const CACHE_VERSION = 'v2';
const CACHE_NAME = `marketly-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './about.html',
  './add-business.html',
  './bus-sign.html',
  './business-analytics.html',
  './business-bookings.html',
  './business-details.html',
  './business-home.html',
  './business-listing.html',
  './business-login.html',
  './business-messages.html',
  './business-register.html',
  './business-reviews.html',
  './business-settings.html',
  './business-subscription.html',
  './categories.html',
  './contact.html',
  './explore.html',
  './login.html',
  './my-account.html',
  './owner-login.html',
  './signup.html',
  './support.html',
  './terms.html',
  './offline.html',
  './business.css',
  './business.js',
  './pwa.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', (event) => {
  console.log('[sw] installing', CACHE_NAME, 'scope:', self.registration.scope);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache what we can; don't let one missing file abort the whole install.
      return Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => console.warn('[sw] precache skip:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('marketly-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
      .then(() => self.clients.claim())
      .then(() => console.log('[sw] activated and claimed clients, scope:', self.registration.scope))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // let cross-origin (e.g. images, fonts CDN) pass through normally

  // Page navigations: network-first, fall back to cache, then to the offline page.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('./offline.html'))
        )
    );
    return;
  }

  // Same-origin static assets: cache-first, then network, updating the cache as we go.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
