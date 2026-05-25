const CACHE = 'nkjvguesser-v1';

const ASSETS = [
  '/NKJVGuesser/',
  '/NKJVGuesser/index.html',
  '/NKJVGuesser/manifest.json',
  '/NKJVGuesser/icon-48.png',
  '/NKJVGuesser/icon-72.png',
  '/NKJVGuesser/icon-96.png',
  '/NKJVGuesser/icon-128.png',
  '/NKJVGuesser/icon-144.png',
  '/NKJVGuesser/icon-152.png',
  '/NKJVGuesser/icon-180.png',
  '/NKJVGuesser/icon-192.png',
  '/NKJVGuesser/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

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
