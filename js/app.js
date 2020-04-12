/*************************
*
*  @description This is the Main part of this JS module that will build/ display the interface
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/

import {pubsub} from './pubsub.js';
import {nav} from './nav.js';
import {signInForm} from './forms/signIn.js';
import {signUpForm} from './forms/signUp.js';
import {personList} from './personList.js';

let giftr = {
    init: ev => {
        
        //check if the user is logged in:
        let token = sessionStorage.getItem('GIFTR-UserToken') || null;


        //render all the initial containers
        nav.render(document.querySelector('nav'));
        signInForm.render(document.body);
        signUpForm.render(document.body);
        personList.render(document.querySelector('main'));

        //tell the modules if user is logged in or not
        if(token) {
            pubsub.publish('loginStatus', true); //tell the other modules if the user is logged in
        } else {
            pubsub.publish('loginStatus', false); //tell the other modules if the user is not logged in
        }
    },
    testAPI: (method, url, body) =>{
        //test the log in method see if we get back a token to put in session storage

        //test Person API

        //test GIFT API

        //test Auth API

        //now use the Bearer token in session storage to get the user info
        // document.getElementById('get_login').addEventListener('click', ev =>{
        //     ev.preventDefault();
        //     let req = giftrRequests.send('GET', '/auth/users/me/', null, false, true);
        //     if(req){ //if we have request and not null do the fetch
        //         console.log(req);
        //         fetch(req)
        //             .then(res => {
        //                 if(res.ok){
        //                     return res.json()
        //                 }
        //             })
        //             .then(resp => {
        //                 let data = resp.data;
        //                 console.log(data.email, data._id, data.firstName, data.lastName, data);
        //             })
        //             .catch(err =>{
        //                 console.error(err);
        //         });
        //     }
            
        // });
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);