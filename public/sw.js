// HarvesTrackr Service Worker
const CACHE_NAME = 'harvestrackr-v1';
const STATIC_CACHE = 'harvestrackr-static-v1';
const DYNAMIC_CACHE = 'harvestrackr-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/offline.html',
  '/manifest.json',
  // Add critical CSS and JS files here when available
];

// Routes that should work offline
const OFFLINE_ROUTES = [
  '/dashboard',
  '/dashboard/expenses',
  '/dashboard/income',
  '/dashboard/inventory',
  '/dashboard/reports'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('SW: Installing Service Worker');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('SW: Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('SW: Error during precaching:', error);
      })
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('SW: Activating Service Worker');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
  );
  
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }
  
  // Handle API requests separately
  if (url.pathname.includes('/api/') || url.hostname.includes('amazonaws.com')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // Handle other requests (assets, etc.)
  event.respondWith(handleAssetRequest(request));
});

// Handle navigation requests (page loads)
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('SW: Navigation request failed, checking cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Check if it's an offline-capable route
    const url = new URL(request.url);
    const isOfflineRoute = OFFLINE_ROUTES.some(route => 
      url.pathname === route || url.pathname.startsWith(route + '/')
    );
    
    if (isOfflineRoute) {
      // Return the cached root page for SPA routing
      const rootResponse = await caches.match('/');
      if (rootResponse) {
        return rootResponse;
      }
    }
    
    // Return offline page
    return caches.match('/offline.html');
  }
}

// Handle asset requests (CSS, JS, images)
async function handleAssetRequest(request) {
  try {
    // Check cache first for assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const response = await fetch(request);
    
    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('SW: Asset request failed:', request.url);
    
    // Return cached version if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // For images, return a placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#9ca3af">🌾 Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Handle API requests with background sync
async function handleApiRequest(request) {
  try {
    // Try network first for API requests
    const response = await fetch(request);
    
    // Cache GET requests that succeed
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('SW: API request failed:', request.url);
    
    // For GET requests, try cache
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }
    
    // For POST/PUT requests, store for background sync
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      await storeFailedRequest(request);
    }
    
    throw error;
  }
}

// Store failed requests for background sync
async function storeFailedRequest(request) {
  try {
    const requestData = {
      url: request.url,
      method: request.method,
      headers: [...request.headers.entries()],
      body: await request.text(),
      timestamp: Date.now()
    };
    
    // Store in IndexedDB (simplified version)
    if ('indexedDB' in self) {
      // This would be expanded with a proper IndexedDB implementation
      console.log('SW: Storing failed request for sync:', requestData);
    }
  } catch (error) {
    console.error('SW: Error storing failed request:', error);
  }
}

// Background sync (when supported)
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncFailedRequests());
  }
});

async function syncFailedRequests() {
  console.log('SW: Syncing failed requests');
  // Implementation would retrieve stored requests from IndexedDB and retry them
}

// Push notifications (when needed)
self.addEventListener('push', (event) => {
  console.log('SW: Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update from HarvesTrackr',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('HarvesTrackr', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  }
});