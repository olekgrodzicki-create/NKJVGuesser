const CACHE = 'nkjvguesser-v1';

const ASSETS = [
  '/NKJVGuesser/',
  '/NKJVGuesser/index.html',
  '/NKJVGuesser/manifest.json',
  '/NKJVGuesser/icons/icon-48.png',
  '/NKJVGuesser/icons/icon-72.png',
  '/NKJVGuesser/icons/icon-96.png',
  '/NKJVGuesser/icons/icon-128.png',
  '/NKJVGuesser/icons/icon-144.png',
  '/NKJVGuesser/icons/icon-152.png',
  '/NKJVGuesser/icons/icon-180.png',
  '/NKJVGuesser/icons/icon-192.png',
  '/NKJVGuesser/icons/icon-512.png'
];

// Install — cache everything
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clear old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, network fallback
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, clone));
        return resp;
      });
    })
  );
});
