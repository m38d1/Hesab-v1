/* Precache service worker so the app really works offline.
   Bump CACHE whenever you ship a new build — a cached shell only refreshes when its cache name changes. */
var CACHE = 'hesab-v1';
var ASSETS = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './fonts/Vazirmatn-var.woff2',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        /* cache:'reload' bypasses the HTTP cache so an upgrade never precaches a stale file. */
        return c.addAll(
          ASSETS.map(function (u) {
            return new Request(u, { cache: 'reload' });
          }),
        );
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (ks) {
        return Promise.all(
          ks
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var u;
  try {
    u = new URL(r.url);
  } catch (err) {
    return;
  }
  if (u.origin !== self.location.origin) return;
  /* Cloud-sync traffic is never cached. */
  if (u.pathname.indexOf('/api') === 0) return;

  /* Navigations: try the network so a deploy is picked up, fall back to the cached shell offline. */
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r)
        .then(function (res) {
          var cp = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put('./index.html', cp);
          });
          return res;
        })
        .catch(function () {
          return caches.match('./index.html');
        }),
    );
    return;
  }

  /* Everything else: cache first, and fill the cache on first use. */
  e.respondWith(
    caches.match(r).then(function (hit) {
      if (hit) return hit;
      return fetch(r).then(function (res) {
        if (res && res.ok && res.type === 'basic') {
          var cp = res.clone();
          caches.open(CACHE).then(function (c) {
            c.put(r, cp);
          });
        }
        return res;
      });
    }),
  );
});