const CACHE_NAME = 'rozana-shayari-v1.0.0';
const STATIC_CACHE = 'rozana-shayari-static-v1.0.0';
const DYNAMIC_CACHE = 'rozana-shayari-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/App.tsx',
  '/styles/globals.css',
  '/manifest.json',
  // Add any other critical assets here
];

// Routes to cache dynamically
const CACHE_ROUTES = [
  '/',
  '/offline.html'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache shell
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(CACHE_ROUTES);
      })
    ])
  );
  
  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== CACHE_NAME &&
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE
          ) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(request)
            .then((response) => {
              // Check if we received a valid response
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clone the response
              const responseToCache = response.clone();
              
              // Add to dynamic cache
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Return offline page if available
              return caches.match('/offline.html') || 
                     caches.match('/') ||
                     new Response('Offline - Please check your internet connection', {
                       status: 200,
                       headers: { 'Content-Type': 'text/plain' }
                     });
            });
        })
    );
    return;
  }
  
  // Handle API requests and other resources
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // Fetch fresh version in background (stale-while-revalidate)
          fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
          }).catch(() => {
            // Ignore fetch errors for background updates
          });
          
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Determine cache strategy based on request type
            let targetCache = DYNAMIC_CACHE;
            
            // Cache static assets in static cache
            if (
              request.destination === 'style' ||
              request.destination === 'script' ||
              request.destination === 'font' ||
              request.url.includes('fonts.googleapis.com') ||
              request.url.includes('fonts.gstatic.com')
            ) {
              targetCache = STATIC_CACHE;
            }
            
            // Add to appropriate cache
            caches.open(targetCache)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Return a fallback for critical resources
            if (request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#999">Image Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
            
            // For other resources, just let it fail gracefully
            throw error;
          });
      })
  );
});

// Background sync for notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'daily-poem-notification') {
    event.waitUntil(sendDailyPoemNotification());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New daily poem available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'read',
        title: 'Read Now',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ],
    requireInteraction: true,
    tag: 'daily-poem'
  };
  
  event.waitUntil(
    self.registration.showNotification('🌅 Rozana Shayari', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'read') {
    // Open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Helper function for daily poem notifications
async function sendDailyPoemNotification() {
  try {
    const registration = await self.registration;
    
    await registration.showNotification('🌅 New Daily Poem', {
      body: 'Your daily verse is ready. Discover today\'s beautiful poetry.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: 'daily-poem',
      requireInteraction: true,
      data: {
        url: '/'
      }
    });
  } catch (error) {
    console.error('Error sending daily poem notification:', error);
  }
}

// Handle message from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});