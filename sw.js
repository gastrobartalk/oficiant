// Служебный скрипт приложения «Официант».
// Держит оболочку приложения в кэше, чтобы оно открывалось быстро
// и переживало плохой вайфай в зале. Обновления забирает с сервера.
const CACHE = "oficiant-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // Переходы по страницам: сначала сеть, при обрыве — кэш
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("index-shell", copy));
          return res;
        })
        .catch(() => caches.match("index-shell"))
    );
    return;
  }

  // Статика своего сайта: из кэша мгновенно, обновление — фоном
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fresh = fetch(req)
          .then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || fresh;
      })
    );
  }
});
