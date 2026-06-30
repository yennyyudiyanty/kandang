const CACHE = 'jjrolu-v1';
const ASSETS = [
  '/kandang/',
  '/kandang/index.html',
  '/kandang/css/style.css',
  '/kandang/js/config.js',
  '/kandang/js/api.js',
  '/kandang/manifest.json',
  '/kandang/logo.png',
  '/kandang/pages/farm.html'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/')) return;
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
