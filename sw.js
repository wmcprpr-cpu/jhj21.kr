const CACHE_NAME = "jhj21-cache-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./assets/style.css",
  "./script.js",
  "./assets/header.html",
  "./assets/footer.html",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(request).catch(() => caches.match("./index.html"))
      );
    })
  );
});
