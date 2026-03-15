// 서비스 워커 - 아무것도 캐시하지 않고 모든 요청을 네트워크로 통과
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});
// fetch 이벤트 핸들러 없음 = 브라우저가 직접 네트워크 요청 처리
