const cachePrefix = "busan-trip-offline-";
const cacheName = cachePrefix + "1";
const files = [
  "index.html", "app.js?v=offline-1", "styles.css?v=offline-1", "styles.css",
  "guide.html", "guide.js?v=offline-1", "guide.css?v=schedule-guide",
  "guide-data.js", "guide-stations.js", "guide-planning.js?v=schedule-guide",
  "photos/day-1.jpg", "photos/day-2.jpg", "photos/day-3.jpg", "photos/day-4.jpg",
  "photos/day-5.jpg", "photos/gimhae-ses-office.jpg", "photos/busan-rail-network.png",
];
const root = new URL(self.registration.scope);
const destinations = new Map(files.map(file => {
  const url = new URL(file, root);
  return [url.pathname, url.href];
}));
const indexUrl = destinations.get(new URL("index.html", root).pathname);

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll(files.map(file => new Request(new URL(file, root), { cache: "reload" })));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(cachePrefix) && key !== cacheName).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== root.origin) return;
  const fallback = url.pathname === root.pathname ? indexUrl : destinations.get(url.pathname);
  if (!fallback) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    if (request.mode !== "navigate" && url.href === fallback) {
      const saved = await cache.match(fallback);
      if (saved) return saved;
    }
    try {
      const response = await fetch(request);
      if (response.ok || response.status < 500) return response;
      return (await cache.match(fallback)) ?? response;
    } catch {
      return (await cache.match(fallback)) ?? Response.error();
    }
  })());
});
