// 서비스 워커 - 캐시 없이 항상 네트워크에서 가져오기
self.addEventListener("install", e => {
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  // 기존 캐시 전부 삭제
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // 노션/API 요청은 그냥 통과
  const url = e.request.url;
  if (url.includes("notion.com") || url.includes("corsproxy.io") || url.includes("data.go.kr")) {
    return;
  }
  // 나머지는 항상 네트워크에서 가져오기 (캐시 사용 안 함)
  e.respondWith(fetch(e.request));
});
