const CACHE='training-log-v0.10.10';
const ASSETS=['./','./index.html','./manifest.json'];
self.addEventListener('install', event => { self.skipWaiting(); event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); });
self.addEventListener('activate', event => { event.waitUntil((async () => { const keys=await caches.keys(); await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))); await self.clients.claim(); })()); });
self.addEventListener('fetch', event => { const req=event.request; if(req.mode==='navigate'||req.destination==='document'){ event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>caches.match('./index.html'))); return;} event.respondWith(fetch(req).catch(()=>caches.match(req))); });
