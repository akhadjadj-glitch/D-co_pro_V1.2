const CACHE_NAME = 'decor-pro-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    if (!res || res.status !== 200) return res;
    const clone = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
    return res;
  })));
});
