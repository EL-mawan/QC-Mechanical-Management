self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Minimal fetch listener to satisfy PWA requirements
  // In a real production app, consider implementing caching strategies here
  event.respondWith(fetch(event.request));
});
