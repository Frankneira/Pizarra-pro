// ══════════════════════════════════════════════════
// Service Worker — Pizarra Digital PRO+ v2026
// Cachea todas las dependencias para uso offline
// ══════════════════════════════════════════════════
const CACHE_NAME = 'pizarra-pro-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/screenfull@5.2.0/dist/screenfull.min.js',
    'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&display=swap'
];

// Instalar: cachear todos los recursos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(err => {
                console.warn('SW: Algunos recursos no se pudieron cachear:', err);
            });
        })
    );
    self.skipWaiting();
});

// Activar: limpiar caches antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

// Fetch: primero red, si falla usar cache (Network-First)
self.addEventListener('fetch', (event) => {
    // Ignorar peticiones que no son GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Guardar copia en cache
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => {
                // Sin red: servir desde cache
                return caches.match(event.request).then(cached => {
                    return cached || new Response('Sin conexión', { status: 503 });
                });
            })
    );
});
