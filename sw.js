const CACHE_NAME = 'apple-check-v3';
const toCache = [
  './',
  './index.html',
  './manifest.json',
  './shortcut-instructions.html',
  './open-checklist.shortcut.txt',
  './optimize.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // cleanup old caches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )).then(()=>clients.claim())
  );
});

// Fetch strategy: network-first for navigation, cache-first for assets
self.addEventListener('fetch', event => {
  const req = event.request;
  // navigation requests -> try network first, fallback to cache
  if(req.mode === 'navigate'){
    event.respondWith(
      fetch(req).then(resp => {
        // update cache with fresh index
        caches.open(CACHE_NAME).then(c=>c.put('./index.html', resp.clone()));
        return resp;
      }).catch(()=>{
        return caches.match('./index.html');
      })
    );
    return;
  }

  // for other requests, try cache first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(networkResp => {
      // optionally cache fetched assets (only same-origin simple requests)
      if(networkResp && networkResp.ok && req.url.startsWith(self.location.origin)){
        caches.open(CACHE_NAME).then(c=>c.put(req, networkResp.clone()));
      }
      return networkResp;
    })).catch(()=>{
      return null;
    })
  );
});
