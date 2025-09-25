// Define um nome e versão para o cache. Mudar a versão (v2, v3, etc.) força a atualização.
const CACHE_NAME = 'amigo-da-balanca-cache-v2';

// Lista de todos os arquivos necessários para o app funcionar 100% offline.
const urlsToCache = [
  '/appfinal/',
  '/appfinal/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js',
  '/appfinal/icon-192x192.png', // Supondo que o ícone está na raiz
  '/appfinal/icon-512x512.png'  // Supondo que o ícone está na raiz
];

// Evento 'install': Disparado quando o navegador instala o service worker.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e salvando arquivos do app para modo offline.');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Força o novo service worker a se tornar ativo imediatamente.
        return self.skipWaiting();
      })
  );
});

// Evento 'activate': Disparado quando o service worker é ativado.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se o nome do cache não for o atual, ele será deletado.
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Garante que o service worker ativado tome controle da página imediatamente.
      return self.clients.claim();
    })
  );
});

// Evento 'fetch': Disparado para cada requisição de rede (imagens, scripts, etc.).
self.addEventListener('fetch', event => {
  event.respondWith(
    // Tenta encontrar a requisição no cache primeiro.
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna o arquivo do cache.
        if (response) {
          return response;
        }
        // Se não encontrar, busca na internet (e falha se estiver offline).
        return fetch(event.request);
      })
  );
});
