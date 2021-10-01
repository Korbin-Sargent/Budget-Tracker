const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/db.js",
  "/index.js",
  "/manifest.webmanifest",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

//Adding files to precache
self.addEventListener("install", function (e) {
  e.waitUntil(
    //start a cache
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("installing cache : " + CACHE_NAME);
      //cache all files
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

//activation of service worker and then old cache managemenet
self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then((keylist) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("emptying old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});
