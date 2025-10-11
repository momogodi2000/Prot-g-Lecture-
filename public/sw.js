const CACHE_NAME = 'protege-lecture-v1.1.0';
const RUNTIME_CACHE = 'protege-runtime-v1.1.0';
const IMAGE_CACHE = 'protege-images-v1.1.0';

const STATIC_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/icon-192x192.png',
  '/icon-512x512.png'
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
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!currentCaches.includes(cache)) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Advanced Fetch Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip cross-origin requests (except for fonts and images)
  if (url.origin !== location.origin && 
      !request.url.includes('fonts') && 
      !request.url.includes('images')) {
    return;
  }
  
  // Handle different types of requests with appropriate strategies
  
  // 1. Static assets (CSS, JS) - Cache First
  if (request.url.includes('/assets/')) {
    event.respondWith(cacheFirst(request, CACHE_NAME));
    return;
  }
  
  // 2. Images - Cache First with fallback
  if (request.destination === 'image' || 
      /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }
  
  // 3. API calls and dynamic content - Network First
  if (url.pathname.includes('/api/') || 
      url.pathname.includes('/firebase') ||
      url.pathname.includes('.json')) {
    event.respondWith(networkFirst(request, RUNTIME_CACHE));
    return;
  }
  
  // 4. HTML pages - Network First with offline fallback
  if (request.destination === 'document' || 
      request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstWithOffline(request, RUNTIME_CACHE));
    return;
  }
  
  // 5. Default - Network First
  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

// Cache First Strategy - for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[Service Worker] Fetch failed for:', request.url);
    // Return a fallback if available
    return new Response('Offline', { status: 503 });
  }
}

// Network First Strategy - for dynamic content
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clone and cache successful responses
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // If network fails, try cache
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Network First with Offline Page - for HTML
async function networkFirstWithOffline(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Try cache first
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Return offline page as last resort
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Fallback response
    return new Response('Offline - No cached content available', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({ 'Content-Type': 'text/plain' })
    });
  }
}

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
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if there's already a window open
          for (const client of clientList) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          // Open new window
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
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

