/*************************
*
*  @description This will build and render the signin form
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/
import {giftrRequests} from '../requests.js';
import { pubsub } from '../pubsub.js';

export const signInForm = {
    render: container => {
        //get the template
        let template = document.getElementById('loginFormTemplate');
        let form = template.content.cloneNode(true);

        //attach all the event listeners needed for the buttons
        form.querySelector('#submit_login').addEventListener('click', signInForm.submitLogin);
        form.querySelector('#cancel_login').addEventListener('click', signInForm.cancelLogin);

        //render in the container
        container.appendChild(form);

        //instantiate the materialize events for side navs (taken from materialize docs)
        let instances = document.querySelectorAll('#loginForm');
        M.Sidenav.init(instances, {edge: "right"});

        //subscribe to any pubsub events needed
    },

    //callback function to submit the login from the form
    submitLogin: ev =>{
        ev.preventDefault();
        let form = document.getElementById('loginForm');

        let email = form.querySelector('#email-login').value;
        let password = form.querySelector('#password-login').value;
        let req = giftrRequests.send('POST', '/auth/tokens/', {email, password}, true, false);

        if(req){    
            fetch(req)
                .then(res => res.json())
                .then(res => {
                    signInForm.closeInstance(form);
                    console.log(res);
                    if (res.errors){
                        console.log("There was an error signing in");
                        M.toast({html: 'signin failed'});

                    }
                    if(res.data.token){
                        console.log(res.data.token);
                        M.toast({html: 'signin success'});
                        sessionStorage.setItem('GIFTR-UserToken', 'Bearer ' +  res.data.token);

                        //publish the events that we are logged in
                        pubsub.publish('loginStatus', true);
                    }
                })
                .catch(err => {
                    // console.error(err)
                    // M.toast({html : 'fatal error'})
                    console.log("This is the error", err);
            });
        }

        //close the form
        //first check if the user is logged in then close the form
        // signInForm.closeInstance(form);
    },

    //callback function to cancel the login
    cancelLogin: ev =>{
        ev.preventDefault();
        let form = document.getElementById('loginForm');
        form.querySelector('form').reset();
        //get the instace of the form from Materialize:
        signInForm.closeInstance(form);
    },

    closeInstance: inst =>{
        let instance = M.Sidenav.getInstance(inst);
        instance.close();
        // inst.reset();
    }
};