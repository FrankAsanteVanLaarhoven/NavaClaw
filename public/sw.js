// NAVACLAW-AI Service Worker
// Provides offline caching and PWA support.
// Author: Frank Van Laarhoven

const CACHE_NAME = 'navaclaw-v2';
const STATIC_ASSETS = [
  '/',
  '/ephemeral',
  '/manifest.json',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — Offline-first approach for PWA capabilities
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  // Do not cache API or WebRTC routes
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/ws/')) return;
  
  // Cache First strategy for static assets (images, JS, CSS)
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|gif|css|js|webp|avif)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Stale-While-Revalidate for HTML/Navigation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return cachedResponse || new Response('<html><body><h1>NAVACLAW-AI</h1><p>Running in offline mode.</p></body></html>', {
          headers: { 'Content-Type': 'text/html' }
        });
      });
      return cachedResponse || networkFetch;
    })
  );
});
