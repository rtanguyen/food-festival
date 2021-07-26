const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
  ];
const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//self refers to service worker object - service workers run before window object created
self.addEventListener('install', function(e) {
    //waitUntil enclosed function is done executing
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('installing cache : ' + CACHE_NAME)
                return cache.addAll(FILES_TO_CACHE)
            })
    )
});


//activation: clear old data from cache, tell service worker how to manage caches
self.addEventListener('activate', function(e) {
    e.waitUntil(
        //keys() returns array of all cache names
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function(key) {
                return key.indexOf(APP_PREFIX)
            });
            cacheKeepList.push(CACHE_NAME)
            //returns a Promise that resolves once all old versions of the cache have been deleted
            return Promise.all(keyList.map(function (key, i) {
                //if key isn't found in KeepList, delete from cache
                if(cacheKeepList.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i]);
                    return caches.delete(keyList[i]);
                }
            })
            );
        })
    );
});

//retrieve information from cache
self.addEventListener('activate', function(e) {
    e.waitUntil(
      caches.keys().then(function(keyList) {
        // `keyList` contains all cache names under your username.github.io
        // filter out ones that has this app prefix to create keeplist
        let cacheKeeplist = keyList.filter(function(key) {
          return key.indexOf(APP_PREFIX);
        });
        // add current cache name to keeplist
        cacheKeeplist.push(CACHE_NAME);
  
        return Promise.all(
          keyList.map(function(key, i) {
            if (cacheKeeplist.indexOf(key) === -1) {
              console.log('deleting cache : ' + keyList[i]);
              return caches.delete(keyList[i]);
            }
          })
        );
      })
    );
  });