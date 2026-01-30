// FEAR METER Service Worker v1.0
// Enables offline functionality and PWA features

const CACHE_NAME = 'fear-meter-v1.0';
const ASSETS_TO_CACHE = [
    '/fear-meter/',
    '/fear-meter/index.html',
    '/fear-meter/styles.css',
    '/fear-meter/app.js',
    '/fear-meter/manifest.json',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing FEAR METER Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] Assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Cache failed:', error);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating FEAR METER Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip chrome-extension and other non-http requests
    if (!event.request.url.startsWith('http')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }
                
                // Fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        // Cache the fetched response
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // If both cache and network fail, return offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/fear-meter/index.html');
                        }
                    });
            })
    );
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for session data (future feature)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-sessions') {
        console.log('[SW] Syncing session data...');
        // Future: sync localStorage data to cloud
    }
});

// Push notifications (future feature)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'FEAR METER notification',
            icon: '/fear-meter/icons/icon-192.png',
            badge: '/fear-meter/icons/icon-72.png',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/fear-meter/'
            },
            actions: [
                { action: 'open', title: 'Open FEAR METER' },
                { action: 'dismiss', title: 'Dismiss' }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification('FEAR METER', options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/fear-meter/')
        );
    }
});

console.log('[SW] FEAR METER Service Worker loaded');
