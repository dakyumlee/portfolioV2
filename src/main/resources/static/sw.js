const CACHE_NAME = 'portfolio-v1';
const urlsToCache = ['/', '/css/styles.css', '/js/console.js', '/favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
