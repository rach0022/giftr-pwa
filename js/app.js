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

        //register the service worker
        if('serviceWorker' in navigator){
            giftr.initServiceWorker().then(() =>{
                //tell the modules if user is logged in or not
                if(token) {
                    pubsub.publish('loginStatus', true); //tell the other modules if the user is logged in
                    giftr.sendMessage({"statusUpdate":'isLoggedIn'});
                } else {
                    pubsub.publish('loginStatus', false); //tell the other modules if the user is not logged in
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
    },
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
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);