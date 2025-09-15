const CACHE_NAME = 'apple-check-v2';
const toCache = [
  './',
  './index.html',
  './manifest.json',
  './index.html',
  './shortcut-instructions.html',
  './open-checklist.shortcut.txt'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      if(resp) return resp;
      return fetch(event.request).then(fetchResp => {
        // optionally cache fetched resources
        return fetchResp;
      }).catch(()=>{
        // fallback to cached index.html for navigation
        if(event.request.mode === 'navigate'){
          return caches.match('./index.html');
        }
      });
    })
  );
});
