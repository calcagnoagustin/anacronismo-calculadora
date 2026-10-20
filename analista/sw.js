var V='an-v4';
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==V; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch', function(e){
  var u = e.request.url;
  if (e.request.method !== 'GET' || u.indexOf('/api/') >= 0) return;
  e.respondWith(fetch(e.request).then(function(r){ var c=r.clone(); caches.open(V).then(function(k){ k.put(e.request,c); }); return r; })
    .catch(function(){ return caches.match(e.request); }));
});
