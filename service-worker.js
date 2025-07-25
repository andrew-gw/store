// Enables push notifications, offline storage, and background
// operations like sync.
//
// Runs in separate thread, allowing the app to remain responsive to
// user input while resources are being fetched and cached.

const cacheResources = async (resources) => {
  const cache = await caches.open('logo')
  await cache.addAll(resources)
}

// Cache critical resources immediately upon app install
self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheResources([
      'index.html',
      'category.html',
      'product.html',
      'cart.html',

      'css/base.css',
      'css/typography.css',
      'css/navigation.css',
      'css/product-base.css',
      'css/product-list.css',
      'css/scrolling-list.css',
      'css/filter-list.css',
      'css/footer.css',
      'css/breadcrumb.css',
      'css/product-detail.css',

      'svg/favicon.svg',
      'svg/search.svg',
      'svg/search-light.svg',
      'svg/heart.svg',
      'svg/cart.svg',
      'svg/ratings.svg',
      'svg/add.svg',
      'svg/chevron-right.svg',
      'svg/arrow-right.svg',
      'svg/chevron-down.svg',
      'svg/chevron-up.svg',

      'product/kitchen-table.html',
      'product/lounge-chair.html',
      'product/sectional-sofa.html',
      'product/modern-desk.html',
      'product/accent-chair.html',
      'product/leather-chair.html',
      'product/kitchen-chair.html',
      'product/modern-love-seat.html'
    ]),
  )
})

const cacheRequest = async (request, response) => {
  const cache = await caches.open('logo')
  await cache.put(request, response)
}

// Cache-first strategy
// Attempt network only if not cached
// Add to cache if found, else fallback provided
const cacheFirst = async ({ request, fallbackUrl }) => {
  // Cache-first
  const cacheResponse = await caches.match(request)
  if (cacheResponse) {
    return cacheResponse
  }
  // Try network
  try {
    const networkResponse = await fetch(request)
    // Cache on success
    cacheRequest(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    // Fallback from cache
    const fallbackResponse = await caches.match(fallbackUrl)
    if (fallbackResponse) {
      return fallbackResponse
    }
    // Fallback failed
    return new Response('Network error', {
      status: 408,
      headers: {
        'Content-Type': 'text/plain'
      },
    })
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      fallbackUrl: 'product.html',
    }),
  )
})
