var CACHE_NAME="oc_cache";
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll([
                
            ]);
        })
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'get_messages') {
        // event.waitUntil(persistLocalChanges()
        // .then(() => {
            self.registration.showNotification("Markdowns synced to server");
        // })
        // .catch(() => {
        //     console.log("Error syncing markdowns to server");
        // })
      //);
    }
});