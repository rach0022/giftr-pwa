'use strict';
const staticCacheName = 'static-cache-v1';
const dynamicCacheName = 'dynamic-cache-v1';
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
    '/js//forms/signIn.js',
    '/js//forms/signUp.js',
    '/js//forms/addPerson.js',
    '/js//forms/addGift.js',
    '/img/noIdeaPic.png',
    '/img/noIdeaPic.png',
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
self.addEventListener('message', onMessage); //will have events isOnline, isLoggedIn etc
self.addEventListener('fetch', onFetch); //to cache or not (requests from webpage)

//helper functions to assist the service worker

//function to limit the dynamic cache size

//async function to send the message to all clients (tabs) using this service worker
// async function sendMessage(msg) {};

//service worker events
//install event
function onInstall(ev){
    console.log('service worker installed');
    //to stop waiting for old SW to stop working before installing:
    //self.skipWaiting
}

//activate event
function onActivate(ev){
    console.log('service worker activated');
}

//fetch events
function onFetch(ev){
    console.log('service worker observed a fetch');
}

//recieved a message from the webpage (maybe online/login status)
function onMessage({data}){
    console.log('recieved a message from webpage', data);
}