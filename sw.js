const CACHE_NAME = "perbandingan-harga-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    function(cache) {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(

            caches.keys()
                .then(
                    function(cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function(cacheName) {

                                    if (
                                        cacheName !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            cacheName
                                        );

                                    }

                                }
                            )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


/* =========================================================
   FETCH
========================================================= */

/*
   INTERNET FIRST

   1. Coba ambil dari internet.
   2. Jika berhasil, simpan versi terbaru
      ke cache.
   3. Jika internet gagal, gunakan cache.
*/

self.addEventListener(
    "fetch",
    function(event) {

        event.respondWith(

            fetch(event.request)
                .then(
                    function(response) {

                        /*
                           Simpan response terbaru
                           ke cache.
                        */

                        const responseClone =
                            response.clone();


                        caches.open(
                            CACHE_NAME
                        )
                        .then(
                            function(cache) {

                                cache.put(
                                    event.request,
                                    responseClone
                                );

                            }
                        );


                        return response;

                    }
                )
                .catch(
                    function() {

                        /*
                           Internet gagal.
                           Gunakan cache.
                        */

                        return caches.match(
                            event.request
                        );

                    }
                )

        );

    }
);