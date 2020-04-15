'use strict';
const staticCacheName = 'static-cache-v12';
const dynamicCacheName = 'dynamic-cache-v7';
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
    '/manifest.json'
];
let baseURL = null;

//listen for service worker events
self.addEventListener('install', onInstall); //install event for service worker
self.addEventListener('activate', onActivate); //activating the service worker fires after install event
// self.addEventListener('message', onMessage); //will have events isOnline, isLoggedIn etc
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
}

//fetch events
function onFetch(ev){
    console.log('service worker observed a fetch at:', ev.request.url);

    // //now to actually handle that event with a cache first to online fallback

    //rewriting the below code by formatted better:
    ev.respondWith(
        //check both the static and dynamic cache for the file
        //if we get a cacheRes give that back or do the normal fetch
        //if fetch fails then just go to our offline handler fallback in the catch
        caches.match(ev.request).then(cacheRes =>{
            return cacheRes || fetch(ev.request).then(fetchRes =>{
                //if it wasnt in our cache and we didnt get a 404 status code open up the dynamic cache
                console.log(ev.request, 'was not in cache');
                if(fetchRes.status != 404){
                    return caches.open(dynamicCacheName).then(cache =>{
                        //cache the request if it does not come from our api
                        //or it comes from our API and uses get
                        if(ev.request.url.indexOf('giftr.mad9124.rocks/') == -1 || 
                        (ev.request.url.indexOf('giftr.mad9124.rocks/api/people') > -1 &&
                        ev.request.method == 'GET')){
                            console.log('adding to dynamic cache', ev.request.url);
                            cache.put(ev.request.url, fetchRes.clone()); //cloning the response to still send it back to browser
                            limitCacheSize(dynamicCacheName, dynamicCacheSize);
                        }
                        return fetchRes; //return the original response
                    });
                } else {
                    //failed to fetch for another reason
                    console.log('failed to fetch', fetchRes);
                    throw new Error('failed to fetch');
                }
            })
        }).catch(err =>{
            let url = new URL(ev.request.url)
            console.warn(err, 'failed URL:', url);

            //check if we were trying to open an html page if so send them to index
            if(url.pathname.indexOf('.html') > -1){
                return caches.match('/pages/404.html');
            }
            //return caches.match('/index.html'); fallback if we cant load something else
        })
    );
}

//recieved a message from the webpage (maybe online/login status)
// function onMessage({data}){
//     console.log('recieved a message from webpage', data);
// }