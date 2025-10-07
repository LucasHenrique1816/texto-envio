const CACHE_NAME = 'texto-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/logotranscompras.png',
  '/logotranscompras192.png',
  '/logotranscompras512.png',
  // Arquivos do build React (ajuste os nomes conforme o build gerado)
  '/static/js/main.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/static/css/main.chunk.css',
  // Fontes e outros assets se existirem
];

// Instala e faz cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Atende as requisições com cache primeiro
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});