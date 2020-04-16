'use strict';
const staticCacheName = 'static-cache-v82';
const dynamicCacheName = 'dynamic-cache-v11';
const dynamicCacheSize = 50;
const staticAssets = [
    '/',
    '/index.html',
    '/pages/404.html',
    '/css/style.css',
    '/css/materialize.min.css',
    '/js/app.js',
    '/js/pubsub.js',
    '/js/requests.js',
    '/js/ui.js',
    '/js/nav.js',
    '/js/personList.js',
    '/js/giftList.js',
    '/js/materialize.min.js',
    '/js/forms/signIn.js',
    '/js/forms/signUp.js',
    '/js/forms/addPerson.js',
    '/js/forms/addGift.js',
    '/img/noIdeaPic.png',
    '/img/noProfilePic.png',
    '/img/favicon.ico',
    '/img/icon/icon-72x72.png',
    '/img/icon/icon-96x96.png',
    '/img/icon/icon-128x128.png',
    '/img/icon/icon-144x144.png',
    '/img/icon/icon-152x152.png',
    '/img/icon/icon-192x192.png',
    '/img/icon/icon-384x384.png',
    '/img/icon/icon-512x512.png',
    '/css/google-fonts/bree-serif-v9-latin-regular.eot',
    '/css/google-fonts/bree-serif-v9-latin-regular.svg',
    '/css/google-fonts/bree-serif-v9-latin-regular.ttf',
    '/css/google-fonts/bree-serif-v9-latin-regular.woff',
    '/css/google-fonts/bree-serif-v9-latin-regular.woff2',
    '/css/google-fonts/lexend-giga-v1-latin-regular.eot',
    '/css/google-fonts/lexend-giga-v1-latin-regular.svg',
    '/css/google-fonts/lexend-giga-v1-latin-regular.ttf',
    '/css/google-fonts/lexend-giga-v1-latin-regular.woff',
    '/css/google-fonts/lexend-giga-v1-latin-regular.woff2',
    '/manifest.json'
];
let baseURL = null;
let isOnline = true;

//listen for service worker events
self.addEventListener('install', onInstall); //install event for service worker
self.addEventListener('activate', onActivate); //activating the service worker fires after install event
self.addEventListener('message', onMessage); //will have events isOnline, isLoggedIn etc
self.addEventListener('fetch', onFetch); //to cache or not (requests from webpage)

//helper functions to assist the service worker

//function to limit the dynamic cache size
const limitCacheSize = (name, size) =>{
    //open the cache specified and then open all the key entries
    //if the size of them is greater then the size specified recursively delete the
    //first entry in the cache until it has reach the desired size
    caches.open(name).then(cache =>{
        cache.keys().then(keys =>{
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

//helper function to serve back a file from the cache
//if we have network issues and also to avoid wastign time with a fetch if we
//are offline
function serveFromCacheFallback(err){
    console.log('offline')
    //the offiline handler
    let url = new URL(ev.request.url)
    console.warn(err, url);

    // then lets go into indexed db and serve that page
    //whenever i implement that for now lets just just serve up something else
    //for now lets just serve up some dummy data for gifts or people saying offline
    if (url.hostname == 'giftr.mad9124.rocks'){
        // let data = null; 
        // if(url.pathname.indexOf('/gifts') > -1){
        //     data = {"data": {"name": "OFFLINE"}}
        // } else if(url.pathname.indexOf('token') > -1){
        //     data = {"data": {"token": "offline"}};
        // } else if(url.pathname.indexOf('people') > -1){
        //     data = {"data": {"name": "OFFLINE", "birthDate": "01-01-0001"}}
        // }
        // return data;
    } 

    //check if we were trying to open an html page if so send them to index
    if(url.pathname.indexOf('.html') > -1){
        return caches.match('/pages/404.html');
    }
    return caches.match('/index.html'); //fallback if we cant load something else
}

//async function to send the message to all clients (tabs) using this service worker
// async function sendMessage(msg) {};

//service worker events
//install event
function onInstall(ev){
    ev.waitUntil(
        //open a cache with our static cache name and add all our static assets
        caches.open(staticCacheName).then(cache =>{
            console.log('caching static assets');
            cache.addAll(staticAssets); 
        })
    );
    //to stop waiting for old SW to stop working before installing:
    //self.skipWaiting
    console.log('service worker installed');
}

//activate event
function onActivate(ev){
    //wait until the activate event finishes and then open all caches by each key
    //and go through each key if it isnt in our dyanmic or static cache then delete it
    ev.waitUntil(
        caches.keys().then(keys =>{
            // console.log(keys);
            return Promise.all(
                keys
                    .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                    .map(key => caches.delete(key))
            );
        })
    );
    console.log('service worker activated');

    //this would be a good place to init indexedDB database
}

//fetch events
function onFetch(ev){
    console.log('service worker observed a fetch at:', ev.request.url);
    if(isOnline){
        ev.respondWith(
            fetch(ev.request)
                .then(fetchRes =>{
                    if(fetchRes.status != 404){
                        return caches.open(dynamicCacheName).then(cache =>{
                            //cache the request if it does not come from our api
                            //or it comes from our API and uses get
                            if(ev.request.url.indexOf('giftr.mad9124.rocks/') == -1 ||(
                                ev.request.url.indexOf('giftr.mad9124.rocks/api/people') > -1 && ev.request.method == 'GET')){
                                //currently only cahcing if it doesnt come from our api add the following to the if statement to allow cached GETS
                                // ||(ev.request.url.indexOf('giftr.mad9124.rocks/api/people') > -1 && ev.request.method == 'GET')
                                console.log('adding to dynamic cache', ev.request.url, fetchRes.clone());
                                cache.put(ev.request.url, fetchRes.clone()); //cloning the response to still send it back to browser
                                limitCacheSize(dynamicCacheName, dynamicCacheSize);
                            }
                            return fetchRes; //return the original response
                        });
                    } else {
                        //failed to fetch for another reason
                        console.log('failed to fetch', fetchRes, fetchRes.status);
                        throw new Error('failed to fetch');
                    }
                })
                .catch(err =>{
                    return caches.match(ev.request.url).then(cacheRes =>{
                        return cacheRes; 
                    }).catch(serveFromCacheFallback); 
                })
        );
    } else { //we are offline check the cache or hit the fallback
        // console.log('we are offline and checking on the cache');
        ev.respondWith(caches.match(ev.request.url).then(cacheRes =>{
            return cacheRes
        }).catch(serveFromCacheFallback));
    }
    
}

async function sendMessage(msg) {
    //send the message to all clients (tabs) using this service worker
    var allClients = await clients.matchAll({ includeUncontrolled: true });
    return Promise.all(
        allClients.map(function sendTo(client) {
        var chan = new MessageChannel();
        chan.port1.onmessage = onMessage;
        return client.postMessage(msg, [chan.port2]);
        })
    );
}

//recieved a message from the webpage (maybe online/login status)  
function onMessage({ data }) {
    //received a message from the webpage
    //probably just updating our online status
    if ('statusUpdate' in data) {
        if(data.hasOwnProperty("isLoggedIn")){ //message about logged in status
            console.log(`Service Worker receiving message about login status: ${data.isLoggedIn}`);
            //if we arent logged in then delete the dynamic cache
            if(!data.isLoggedIn) limitCacheSize(dynamicCacheName, 0);
        } else if(data.hasOwnProperty('isOnline')){ //message about online or offline
            isOnline = data.isOnline;
            console.log('Network status', data.isOnline);
        }
        
    }
    if ('baseURL' in data) {
        baseURL = data.baseURL;
    }
}