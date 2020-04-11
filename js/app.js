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

let giftr = {
    // baseURL: 'http://localhost:3030',
    // baseURL: 'EC2Co-EcsEl-1AH0Z1LDB9VES-797724042.us-east-1.elb.amazonaws.com',
    baseURL: 'https://giftr.mad9124.rocks',
    init: ev => {
        giftr.testAPI();
    },
    testAPI: (method, url, body) =>{
        //test the log in method see if we get back a token to put in session storage
        document.getElementById('submit_login').addEventListener('click', ev =>{
            ev.preventDefault();
            let form = document.getElementById('login');

            let email = form.querySelector('#email').value;
            let password = form.querySelector('#password').value;

            //create the header for the request
            let loginHeader = new Headers();
            loginHeader.append('Accept', 'application/json');
            loginHeader.append('Access-Control-Allow-Origin', '*');
            loginHeader.append('Content-type', 'application/json');
            
            //create the body of the request
            // let data = {
            //     "email": "jaaa@algonquinlive.com",
            //     "password": "articforce42",
            //     "firstName": "Jim",
            //     "lastName": "Jim"
            // }
            let data = {
                email, 
                password
            }
            // let url = `${giftr.baseURL}/auth/users/`
            let url = `${giftr.baseURL}/auth/tokens/`
            
            let loginReq = new Request(url, {
                headers: loginHeader,
                body: JSON.stringify(data),
                mode: 'cors',
                method: 'POST'
            });
            console.log(loginReq);

            fetch(loginReq)
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
            
            console.log(email, password, data);



            //reset the form
            // form.reset();

        });

        //test Person API

        //test GIFT API

        //test Auth API

        //now use the Bearer token in session storage to get the user info
        document.getElementById('get_login').addEventListener('click', ev =>{
            ev.preventDefault();
            let token = sessionStorage.getItem('GIFTR-UserToken') || ''; //set the token or empty

            if(token == ''){
                alert('the user is not logged in')
            } else {
                //do the actual fetch to /auth/users/me
                let h = new Headers();
                h.append('Accept', 'application/json');
                h.append('Access-Control-Allow-Origin', '*');
                h.append('Authorization', token);
                let uri = giftr.baseURL + '/auth/users/me/';

                let req = new Request(uri, {
                    mode: 'cors',
                    headers: h,
                    method: 'GET'
                });

                fetch(req)
                    .then(res => res.json())
                    .then(resp => {
                        let data = resp.data;
                        console.log(data.email, data._id, data.firstName, data.lastName, data);
                    })
                    .catch(err =>{
                        console.error(err);
                    });
            }

        })
    }
};

document.addEventListener('DOMContentLoaded', giftr.init);