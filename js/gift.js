/*************************
*
*  @description This is the Gift part of this JS module that will build/ display the interface
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 12, 2020
*
***********************/

import {pubsub} from './pubsub.js';
import {ui} from './ui.js';
import {nav} from './nav.js';
import {signInForm} from './forms/signIn.js';
import {signUpForm} from './forms/signUp.js';
import {giftList} from './giftList.js';
import {addGiftForm} from './forms/addGift.js'

let giftPage = {
    init: ev =>{
        //render all the initial containers
        nav.render(document.querySelector('nav'));
        signInForm.render(document.body);
        signUpForm.render(document.body);
        giftList.render(document.querySelector('main'));
        addGiftForm.render(document.body);

        //init err modal
        ui.initModal('errorModal');
    }
}

document.addEventListener('DOMContentLoaded', giftPage.init);