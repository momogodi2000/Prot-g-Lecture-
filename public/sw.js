const CACHE_NAME = 'protege-lecture-v1.0.0';
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static files');
      return cache.addAll(STATIC_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Strategy: Network First, then Cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone();
        
        // Cache the fetched response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request).then((response) => {
          return response || caches.match('/offline.html');
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Protégé Lecture+';
  const options = {
    body: data.body || 'Nouvelle notification',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      { action: 'view', title: 'Voir', icon: '/icon-96x96.png' },
      { action: 'close', title: 'Fermer' }
    ],
    tag: 'protege-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();

  if (event.action === 'view') {
    const urlToOpen = event.notification.data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Handle sync events (for offline functionality)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Sync event:', event.tag);
  
  if (event.tag === 'sync-reservations') {
    event.waitUntil(syncReservations());
  }
});

async function syncReservations() {
  console.log('[Service Worker] Syncing offline reservations...');
  // This would sync any offline reservations when back online
  // Implementation depends on IndexedDB queue
}

console.log('[Service Worker] Loaded');

