/**
 * sw.js - Service Worker for Cha0smagick Labs
 * Cache-first strategy for static assets, network-first for HTML pages.
 * v1.0.0
 */

const CACHE_NAME = 'cha0smagick-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/js/apps-data.js',
  '/js/app-render.js'
];

// Install: precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for assets, network-first for HTML
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET and non-http(s)
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) return;
  
  // Skip analytics requests
  if (url.hostname.includes('google') || url.hostname.includes('googletagmanager')) return;
  
  // For static assets (js, css, images, fonts, icons), cache-first
  if (url.pathname.match(/\.(js|css|png|webp|jpg|ico|json|woff2?)$/) || 
      url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetchAndCache(event.request);
      })
    );
    return;
  }
  
  // For HTML pages, network-first (fallback to cache for offline)
  if (url.pathname.match(/\.html$/) || url.pathname === '/' || 
      url.pathname.startsWith('/apps/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return cacheResponse(event.request, response);
        })
        .catch(() => {
          return caches.match(event.request).then(cached => {
            if (cached) return cached;
            // If offline and no cache, show 404
            return caches.match('/404.html');
          });
        })
    );
    return;
  }
  
  // Default: network-first for everything else (tiles, fonts, etc.)
  event.respondWith(
    fetch(event.request)
      .then(response => cacheResponse(event.request, response))
      .catch(() => caches.match(event.request))
  );
});

function fetchAndCache(request) {
  return fetch(request).then(response => {
    if (response.ok) {
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
    }
    return response;
  });
}

function cacheResponse(request, response) {
  if (response.ok) {
    const clone = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
  }
  return response;
}
