/*************************
*
*  @description This is the Main part of this JS module that will build/ display the interface
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 14, 2020
*
***********************/

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
    isOnline: true, 
    init: ev => {

        //register the service worker
        if('serviceWorker' in navigator){
            giftr.initServiceWorker().catch(console.error);
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

        //tell the modules if user is logged in or not
        if(token) {
            pubsub.publish('loginStatus', true); //tell the other modules if the user is logged in
        } else {
            pubsub.publish('loginStatus', false); //tell the other modules if the user is not logged in
        }
        ui.initModal('errorModal'); //init the error modal

        
    },

    initServiceWorker: async () => {
        
        let swRegistration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });

        //set the service worker after registering, it could be in any of those states
        giftr.sw = swRegistration.installing || swRegistration.waiting || swRegistration.active;

        //init any service worker events that need to be listened for 
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);