// sw.js
const CACHE_NAME = 'mytasks-v1';
const ASSETS = [
    './',
    './mytasks.html',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});
