const CACHE_NAME = "jhj21-pwa-v3";

const CORE_ASSETS = [
  "./",
  "./assets/header.html",
  "./assets/footer.html",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
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

          return null;
        })
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  const acceptHeader = request.headers.get("accept") || "";

  const isHTMLRequest =
    request.mode === "navigate" ||
    acceptHeader.includes("text/html");

  const isNewsData =
    requestUrl.pathname.endsWith("/assets/news-data.js");

  /*
   * 뉴스 데이터는 항상 네트워크에서 최신 파일을 먼저 가져옵니다.
   * 네트워크 연결이 안 될 때만 저장된 파일을 사용합니다.
   */
  if (isNewsData) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200
          ) {
            const responseClone = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }

          return networkResponse;
        })
        .catch(() => caches.match(request))
    );

    return;
  }

  // HTML 문서는 네트워크 우선
  if (isHTMLRequest) {
    event.respondWith(
      fetch(request, { cache: "no-store" })
        .then((networkResponse) => networkResponse)
        .catch(async () => {
          const cachedPage = await caches.match(request);

          if (cachedPage) return cachedPage;

          const cachedIndex = await caches.match("./");

          if (cachedIndex) return cachedIndex;

          return new Response("오프라인 상태입니다.", {
            status: 503,
            statusText: "Service Unavailable",
            headers: {
              "Content-Type": "text/plain; charset=utf-8"
            }
          });
        })
    );

    return;
  }

  // 이미지와 기타 정적 파일은 캐시 우선
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== "basic"
        ) {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseClone);
        });

        return networkResponse;
      });
    })
  );
});
