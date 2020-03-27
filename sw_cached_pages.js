const cacheName =  "v1";

// Call install event
self.addEventListener('install', e => {
    console.log("Serivice Worker Installed");
});

// Call Activate event

self.addEventListener('activate', e => {
    console.log("Serivice Worker Activated");
    // Remove Old caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName) {
                        console.log("Service Worker: Cleared old chached");

                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});


self.addEventListener('fetch', e => {
    console.log("Service Worker Fetching");
    e.respondWith(
        fetch(e.request)
        .then(res => {
            //Make copy clone of responce
            const resClone = res.clone();
            // Open Cache
            caches
                .open(cacheName)
                .then(cache => {
                    // Add Responce to the cache
                    cache.put(e.request, resClone);
                });
                return res;
        }).catch(err => caches.match(e.request).then(res => res))
    );
});

