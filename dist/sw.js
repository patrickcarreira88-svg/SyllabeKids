/**
 * Service Worker pour SyllaboKids - Version Simplifiée
 */

const CACHE_NAME = 'syllabokids-v2.0'

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation')
  self.skipWaiting()
})

// Activation
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch - Network first, puis cache
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') {
    return
  }

  // Strategy: Network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les réponses réussies
        if (response && response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }
        return response
      })
      .catch(() => {
        // Si offline, utiliser le cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // Fallback page pour les routes
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html')
          }
          return null
        })
      })
  )
})
