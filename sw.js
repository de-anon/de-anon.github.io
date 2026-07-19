// sw.js — Service Worker для De-Anon
// Версия кеша — увеличивай при обновлении статики
const CACHE_NAME = 'deanon-cache-v2'; // увеличиваем версию, чтобы обновить кэш
const STATIC_ASSETS = [
  '/',
  '/style.css',
  '/script.js',
  '/assets/logo.webp',
  '/favicon.ico',
  '/manifest.json',
  '/browserconfig.xml',
  '/404.html',
  '/500.html'
  // Добавь сюда все основные HTML-страницы, если хочешь их кешировать
  // но лучше оставить только статику
  // ===== ДОБАВЛЯЕМ СКРИНШОТЫ ДЛЯ PWA =====
  '/assets/manifest/Android/1.png',
  '/assets/manifest/Android/2.png',
  '/assets/manifest/Android/3.png',
  '/assets/manifest/Android/4.png',
  '/assets/manifest/iOS/1.png',
  '/assets/manifest/iOS/2.png',
  '/assets/manifest/iOS/3.png',
  '/assets/manifest/iOS/4.png'
  // =======================================
];

// Установка — кешируем статику
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Кешируем статику');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Активация — чистим старые кеши
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Удаляем старый кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // ===== ДЛЯ КАРТОЧЕК И ЯЗЫКОВ — ВСЕГДА В СЕТЬ =====
  // Чтобы новые карточки появлялись сразу, без перезагрузки
  if (pathname.startsWith('/cards/') || pathname.startsWith('/lang/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Если сеть упала — пробуем отдать из кеша (но лучше показать ошибку)
          return caches.match(event.request);
        })
    );
    return;
  }

  // ===== ДЛЯ СТАТИКИ — STALE-WHILE-REVALIDATE =====
  // Сначала из кеша, а в фоне обновляем
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        const fetchPromise = fetch(event.request)
          .then(networkResponse => {
            // Если ответ успешный — обновляем кеш
            if (networkResponse && networkResponse.status === 200) {
              const cloned = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, cloned));
            }
            return networkResponse;
          })
          .catch(() => {
            // Если сеть недоступна — возвращаем кеш (даже устаревший)
            return cachedResponse;
          });
        // Если кеш есть — отдаём его, а сеть обновляет в фоне
        return cachedResponse || fetchPromise;
      })
  );
});