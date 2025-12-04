const CACHE_NAME = 'gatekeeper-riddle-v2';
// Cache all local assets for offline support
// Note: External resources (badge images, etc.) are intentionally excluded
// to avoid caching third-party content and to keep cache size minimal
const urlsToCache = [
  '/The_GateKeepers_Riddle.Interactive/',
  '/The_GateKeepers_Riddle.Interactive/index.html',
  '/The_GateKeepers_Riddle.Interactive/manifest.json',
  '/The_GateKeepers_Riddle.Interactive/system/game.css',
  '/The_GateKeepers_Riddle.Interactive/system/game.js',
  '/The_GateKeepers_Riddle.Interactive/system/icon.logo.png',
  '/The_GateKeepers_Riddle.Interactive/system/riddles/riddles.js',
  '/The_GateKeepers_Riddle.Interactive/system/riddles/gatekeeper.riddle.js',
  '/The_GateKeepers_Riddle.Interactive/system/riddles/mirror.riddle.js'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Activate worker immediately
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all pages immediately
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response (exclude opaque responses from cross-origin requests)
          if (!response || !response.ok || response.type === 'opaque') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch((error) => {
          console.log('Fetch failed; returning offline page or error:', error);
          // Optionally return a cached fallback or custom offline response
          return new Response('Offline - content unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        }).catch((error) => {
          console.log('Fetch failed; returning offline page or error:', error);
          // Return a custom offline response
          return new Response('Offline - content unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({ 'Content-Type': 'text/plain' })
          });
        });
      })
  );
});
