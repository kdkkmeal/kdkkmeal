const CACHE = "meal-v4";

self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // 모든 요청 그냥 네트워크에서 가져오기 (캐시 안 씀)
  e.respondWith(fetch(e.request).catch(() => {
    return caches.match(e.request);
  }));
});
