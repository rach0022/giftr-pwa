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
    init: ev => {
        
        //check if the user is logged in:
        let token = sessionStorage.getItem('GIFTR-UserToken') || null;
        let url = window.location.href;

        //now conditionally check which file we are connected too and launch the right modules
        if(url.indexOf('gifts.html') > -1){
            //render all the initial containers
            nav.render(document.querySelector('nav'));
            signInForm.render(document.body);
            signUpForm.render(document.body);
            giftList.render(document.querySelector('main'));
            addGiftForm.render(document.body);
        } else if (url.indexOf('404.html') > -1){
            nav.render(document.querySelector('nav'));
            signInForm.render(document.body);
            signUpForm.render(document.body);
        } else { //fallback on index.html because the url wont show that part sometimes
            nav.render(document.querySelector('nav'));
            signInForm.render(document.body);
            signUpForm.render(document.body);
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

        
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);