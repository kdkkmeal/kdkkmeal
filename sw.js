const CACHE = "meal-v3";
const ASSETS = ["/kdkkmeal/", "/kdkkmeal/index.html", "/kdkkmeal/manifest.json", "/kdkkmeal/icon-192.png", "/kdkkmeal/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  // 이전 버전 캐시 전부 삭제
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // 노션 API, CORS 프록시는 캐시 안 함 (항상 네트워크)
  const url = e.request.url;
  if (url.includes("notion.com") || url.includes("corsproxy.io") || url.includes("data.go.kr")) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      // 네트워크 우선, 실패 시 캐시
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
