const C='pizarra-v5';
const A=['./','./index.html','./manifest.json','https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js','https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css','https://cdn.jsdelivr.net/npm/screenfull@5.2.0/dist/screenfull.min.js','https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js','https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,600;0,700;1,400&display=swap'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==C).map(n=>caches.delete(n)))));self.clients.claim()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{caches.open(C).then(c=>c.put(e.request,r.clone()));return r}).catch(()=>caches.match(e.request)))});
