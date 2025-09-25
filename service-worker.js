// Define um nome e versão para o cache do seu app
const CACHE_NAME = 'amigo-da-balanca-cache-v1';

// Lista de todos os arquivos e recursos que seu app precisa para funcionar offline.
// O caminho '/appfinal/' é importante porque é a pasta do seu projeto no GitHub Pages.
const urlsToCache = [
  '/appfinal/',
  '/appfinal/index.html',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

// Etapa de Instalação: Salva todos os arquivos da lista no cache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto e salvando arquivos do app.');
        return cache.addAll(urlsToCache);
      })
  );
});

// Etapa de Fetch: Intercepta todas as requisições de rede.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Procura a requisição no cache primeiro.
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna o arquivo do cache.
        if (response) {
          return response;
        }
        // Se não encontrar, busca na internet.
        return fetch(event.request);
      })
  );
});
