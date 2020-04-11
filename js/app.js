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
import {giftrRequests} from './requests.js';
import {nav} from './nav.js';

let giftr = {
    init: ev => {
        giftr.testAPI();

        //render all the initial containers
        nav.render(document.querySelector('nav'));
    },
    testAPI: (method, url, body) =>{
        //test the log in method see if we get back a token to put in session storage
        document.getElementById('submit_login').addEventListener('click', ev =>{
            ev.preventDefault();
            let form = document.getElementById('login');

            let email = form.querySelector('#email').value;
            let password = form.querySelector('#password').value;
            let req = giftrRequests.send('POST', '/auth/tokens/', {email, password}, true, false);

            if(req){    
                fetch(req)
                    .then(res => res.json())
                    .then(res => {
                        console.log(res);
                        if (res.errors){
                            console.log("This is the error", res.errors[0]);
                        }
                        const data = res; 
                        if(data.data.token){
                            console.log(data.data.token);
                            sessionStorage.setItem('GIFTR-UserToken', 'Bearer ' +  data.data.token);
                        }
                    })
                    .catch(err => {
                        // console.error(err)
                        console.log("This is the error", err.errors);
                });
            }
            //reset the form
            form.reset();

        });

        //test Person API

        //test GIFT API

        //test Auth API

        //now use the Bearer token in session storage to get the user info
        document.getElementById('get_login').addEventListener('click', ev =>{
            ev.preventDefault();
            let req = giftrRequests.send('GET', '/auth/users/me/', null, false, true);
            if(req){ //if we have request and not null do the fetch
                console.log(req);
                fetch(req)
                    .then(res => {
                        if(res.ok){
                            return res.json()
                        }
                    })
                    .then(resp => {
                        let data = resp.data;
                        console.log(data.email, data._id, data.firstName, data.lastName, data);
                    })
                    .catch(err =>{
                        console.error(err);
                });
            }
            
        });
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);