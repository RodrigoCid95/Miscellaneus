const CACHE_NAME = 'miscellaneous-v1'
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/css/app.css',
  '/css/login.css',
  '/images/icons/icon-72x72.png',
  '/images/icons/icon-96x96.png',
  '/images/icons/icon-128x128.png',
  '/images/icons/icon-144x144.png',
  '/images/icons/icon-152x152.png',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-384x384.png',
  '/images/icons/icon-512x512.png',
  '/js/login.js',
  '/js/admin.js',
  '/js/checkout.js',
  '/js/services.js',
]

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of urlsToCache) {
        try {
          const response = await fetch(url)
          if (response.ok) {
            await cache.put(url, response)
          } else {
            console.warn(`No se pudo cargar ${url}: ${response.statusText}`)
          }
        } catch (error) {
          console.warn(`Error al intentar cachear ${url}:`, error)
        }
      }
    })
  )
})

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url)
  if (requestUrl.origin !== self.location.origin) {
    event.respondWith(fetch(event.request))
    return
  }
  if (event.request.url.includes('/api')) {
    event.respondWith(fetch(event.request))
    return
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone())
            return networkResponse
          })
        } else {
          console.warn("La respuesta de red no es válida para cachear:", networkResponse)
          return networkResponse
        }
      }).catch((error) => {
        console.error("Error en el fetch de red:", error)
        throw error
      })
    })
  )
})