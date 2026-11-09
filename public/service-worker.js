const CACHE_NAME = "rancho-slime-v4";
const FILES = [
  "./", "./index.html", "./styles.css", "./app.js", "./data.js", "./manifest.json", "./icon.png", "./icon.svg",
  "./slimes/pink.svg", "./slimes/cotton.svg", "./slimes/tabby.svg", "./slimes/phosphor.svg", "./slimes/angler.svg",
  "./slimes/batty.svg", "./slimes/crystal.svg", "./slimes/rock.svg", "./slimes/honey.svg", "./slimes/hunter.svg",
  "./slimes/flutter.svg", "./slimes/boom.svg", "./slimes/puddle.svg", "./slimes/ringtail.svg",
  "./slimes/saber.svg", "./slimes/yolky.svg", "./slimes/tangle.svg", "./slimes/dervish.svg", "./slimes/fire.svg",
  "./slimes/sloomber.svg", "./slimes/hyper.svg", "./slimes/twin.svg", "./slimes/shadow.svg", "./slimes/gold.svg",
  "./slimes/lucky.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key)))))
      .then(() => self.clients.claim())
  );
});

// Primero la red, con la copia guardada como respaldo para seguir sin conexión.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(event.request, copy))
          .catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
