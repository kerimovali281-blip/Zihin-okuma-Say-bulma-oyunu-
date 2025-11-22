const CACHE_NAME = 'mind-reader-v1'; 
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // İkon dosyalarınızın yolunu buraya ekleyin:
  // 'icon-192.png',
  // 'icon-512.png',
];

// Yükleme (Install) olayı: Tüm dosyaları önbelleğe al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Etkinleştirme (Activate) olayı: Eski önbellekleri temizle
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Getirme (Fetch) olayı: Önce önbelleği kontrol et, sonra ağı dene
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
