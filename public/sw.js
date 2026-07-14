// Rekor Zeka service worker — muhafazakâr önbellekleme:
// yalnızca statik varlıklar (JS/CSS/görsel) cache-first; sayfalar HER ZAMAN ağdan gelir.
const CACHE = "rekorzeka-static-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isStatic =
    url.origin === self.location.origin &&
    (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.startsWith("/screenshots/") ||
      /\.(png|jpg|jpeg|webp|svg|ico|woff2?)$/.test(url.pathname));

  if (!isStatic || e.request.method !== "GET") return; // sayfalar ağdan

  e.respondWith(
    caches.match(e.request).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
    )
  );
});
