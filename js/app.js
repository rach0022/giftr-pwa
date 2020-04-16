/*************************
*
*  @description This is the Main part of this JS module that will build/ display the interface
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 14, 2020
*
***********************/
'use strict';
import {pubsub} from './pubsub.js';
import {ui} from './ui.js';
import {giftrRequests} from './requests.js';
import {nav} from './nav.js';
import {signInForm} from './forms/signIn.js';
import {signUpForm} from './forms/signUp.js';
import {personList} from './personList.js';
import {addPersonForm} from './forms/addPerson.js';
import {giftList} from './giftList.js';
import {addGiftForm} from './forms/addGift.js';

let giftr = {
    sw: null,
    defferedPrompt: null,
    isOnline: true,
    baseURL: null,

    init: ev => {
        //get rid of js disabled message
        document.querySelector('main').innerHTML = ""; 
        //register the service worker
        if('serviceWorker' in navigator){
            giftr.initServiceWorker().then(() =>{
                //tell the modules if user is logged in or not
                if(token) {
                    pubsub.publish('loginStatus', true); //tell the other modules if the user is logged in
                    giftr.sendMessage({"statusUpdate": true, "isLoggedIn": true});
                } else {
                    pubsub.publish('loginStatus', false); //tell the other modules if the user is not logged in
                    giftr.sendMessage({"statusUpdate": true, "isLoggedIn": false});
                }
            }).catch(console.error);
        }
        
        //check if the user is logged in:
        let token = sessionStorage.getItem('GIFTR-UserToken') || null;
        let url = window.location.href;

        //render all the initial containers (navigation bar and signup/in modals)
        nav.render(document.querySelector('nav'));
        signInForm.render(document.body);
        signUpForm.render(document.body);

        //now conditionally check which file we are connected too and launch the right modules
        if(url.indexOf('gifts.html') > -1){
            giftList.render(document.querySelector('main'));
            addGiftForm.render(document.body);
        } else if (url.indexOf('404.html') > -1){
            console.log('We are on the Error Page');
        } else {
            //fallback on index.html because the url wont show that part sometimes
            personList.render(document.querySelector('main'));
            addPersonForm.render(document.body);
        }
        ui.initModal('errorModal'); //init the error modal

        //add any listeners that we need
        window.addEventListener('online', giftr.networkStatusChange);
        window.addEventListener('offline', giftr.networkStatusChange);

        
    },

    initServiceWorker: async () => {
        
        let swRegistration = await navigator.serviceWorker.register('/sw.js', {
            updateViaCache: 'none',
            scope: '/'
        });

        //set the service worker after registering, it could be in any of those states
        giftr.sw = swRegistration.installing || swRegistration.waiting || swRegistration.active;

        //tell the service worker the base url
        giftr.sendMessage({baseURL: giftr.baseURL});
        //init any service worker events that need to be listened for 
        navigator.serviceWorker.addEventListener('controllerchange', async () => {
            giftr.SW = navigator.serviceWorker.controller;
        });
        navigator.serviceWorker.addEventListener('message', giftr.onMessage, false);
        giftr.networkStatusChange(null); //check if we are online on open
    },

    // call back function when we get a function from the service worker
    onMessage: (ev) => {
        //message from SW received
        let { data } = ev;
        console.log(ev.ports);
        console.log(data);
    },
    sendMessage: (msg) => {
        //msg is a JS Object
        //tell SW that we are online or offline
        giftr.sw.postMessage(msg);
    },

    //following: https://stackoverflow.com/questions/44756154/progressive-web-app-how-to-detect-and-handle-when-connection-is-up-again
    //this is a callback function to tell the service worker if we are online or offline that way when we
    //make request to our api we will go network first to fetch those otherwise we will fallback to our cache if we are offline
    networkStatusChange: ev =>{
        //check the navigator object if we are online
        //warning this will say online even if connected to router
        //so we need to fetch so url and see if we are online lets go for the 
        //healthStatusCheck of the giftr.mad9124.rocks api
        if (navigator.onLine){
            //we might be online
            let req = giftrRequests.send('GET', '/', null, false, false);
            //send a message to the service worker to temporarily open up fetch requests
            //and we will shut them off the moment we realize we are offline
            giftr.sendMessage({"statusUpdate": true, "isOnline": true});
            if(req){
                fetch(req)
                    .then(res =>{
                        //check if the response has an error or data
                        if(res.errors){
                            giftr.sendMessage({"statusUpdate": true, "isOnline": false});
                            document.getElementById('offlineBadge').classList.remove('hide');
                            document.querySelector('.fixed-action-btn').classList.add('hide');
                        } else if(res.ok) {
                            giftr.sendMessage({"statusUpdate": true, "isOnline": true}); //we are online
                            document.getElementById('offlineBadge').classList.add('hide');
                            document.querySelector('.fixed-action-btn').classList.remove('hide');
                        }
                        console.log("HEALTH STATUS RESPONSE", res);
                    }).catch(console.warn);
            }
        } else {
            //we definitely arent online
            giftr.sendMessage({"statusUpdate": true, "isOnline": false});
            document.getElementById('offlineBadge').classList.remove('hide');
            document.querySelector('.fixed-action-btn').classList.add('hide');
        }
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);