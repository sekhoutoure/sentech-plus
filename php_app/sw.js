// SenTechPLUS Service Worker (High-Speed & Resilient Network First)
const CACHE_NAME = 'sentech-v3.5';
const PRECACHE_URLS = [
    './index.php',
    './shop.php',
    './offline.php',
    './manifest.json',
    './assets/css/tailwind.min.css',
    './assets/js/lucide.min.js',
    './assets/js/app.min.js',
    './assets/images/sentech_logo.webp',
    './assets/images/sentech_icon.webp',
    './assets/images/product_img1.webp',
    './assets/images/product_img2.webp',
    './assets/images/product_img3.webp',
    './assets/images/product_img4.webp'
];

// 1. Install & Immediate Precache
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.allSettled(
                PRECACHE_URLS.map((url) => {
                    return cache.add(url).catch((err) => {
                        console.warn('SW Precache optional item skipped:', url, err.message);
                    });
                })
            );
        })
    );
});

// 2. Activate & Purge All Old Caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch Strategy: Network First with Native Timeout
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;

    if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) return;

    const url = new URL(request.url);

    // Only intercept same-origin requests
    if (url.origin !== self.location.origin) return;

    // A. HTML Navigation requests (pages)
    if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedPage = await caches.match(request);
                    if (cachedPage) return cachedPage;
                    const offlinePage = await caches.match('./offline.php');
                    if (offlinePage) return offlinePage;
                    return new Response(
                        '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Hors ligne — SenTechPLUS</title></head><body style="font-family:sans-serif;text-align:center;padding:40px;"><h2>Vous êtes actuellement hors-ligne</h2><p>Veuillez vérifier votre connexion internet pour continuer vos achats sur SenTechPLUS.</p><button onclick="location.reload()" style="padding:10px 20px;border-radius:12px;background:#1677FF;color:#fff;border:none;font-weight:bold;cursor:pointer;">Réessayer</button></body></html>',
                        {
                            status: 200,
                            headers: { 'Content-Type': 'text/html; charset=utf-8' }
                        }
                    );
                })
        );
        return;
    }

    // B. Static Assets (Images, CSS, JS, Fonts)
    if (url.pathname.match(/\.(css|js|webp|png|jpg|jpeg|svg|woff2|ico)$/)) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Stale-While-Revalidate in background
                    fetch(request).then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
                        }
                    }).catch(() => {});
                    return cachedResponse;
                }

                // If not in cache, fetch from network
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const copy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
                    }
                    return networkResponse;
                }).catch(async () => {
                    if (url.pathname.match(/\.(webp|png|jpg|jpeg|svg)$/)) {
                        const fallbackImg = await caches.match('./assets/images/product_img1.webp');
                        if (fallbackImg) return fallbackImg;
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f1f5f9"/></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                    return new Response('', { status: 404, statusText: 'Not Found' });
                });
            })
        );
        return;
    }
});
