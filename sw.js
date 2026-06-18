// Service Worker v1.0 - 검수판독 오프라인 캐시
const CACHE_NAME = "inspection-v1";
const ASSETS = [
  "./",
  "./index.html",
  "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js",
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // GAS API는 캐시 안 함
  if (e.request.url.includes("script.google.com")) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
