/*************************
*
*  @description This will build and render the signup form
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/
import {giftrRequests} from '../requests.js';
import { signInForm } from './signIn.js';

export const signUpForm = {
    render: container =>{
        //get the template
        let template = document.getElementById('signupFormTemplate');
        let form = template.content.cloneNode(true);

        //attach all the event listeners necessary
        form.querySelector('#submit_signup').addEventListener('click', signUpForm.submitForm);
        form.querySelector('#cancel_signup').addEventListener('click', signUpForm.cancelForm);

        //render in the container
        container.appendChild(form);

        //instantiate in the container
        let instances = document.querySelectorAll('#signupForm');
        M.Sidenav.init(instances, {edge: 'left'});

        //subscribe to any pubsub events needed
    },

    //callback function to submit the form
    submitForm: ev =>{
        ev.preventDefault();
        // ev.stopPropagation();

        let form = document.getElementById('signupForm');

        let firstName = form.querySelector('#firstname-signup').value;
        let lastName = form.querySelector('#lastname-signup').value;
        let email = form.querySelector('#email-signup').value;
        let password = form.querySelector('#password-signup').value;

        let req = giftrRequests.send(
            'POST', 
            '/auth/users/', 
            {
                firstName, lastName, email, password
            },
            true,
            false
        );

        if(req){
            fetch(req)
                .then(res =>res.json())
                .then(data => console.log(data))
                .catch(err => console.error(err));
        }
        signUpForm.closeInstance(form);

    },

    //callback function to cancel the form
    cancelForm: ev =>{
        ev.preventDefault();
        // ev.stopPropagation();
        
        let form = document.querySelector('#signupForm');
        form.querySelector('form').reset();
        signInForm.closeInstance(form);
        
    },

    //helper function to hide form
    closeInstance: inst =>{
        let instance = M.Sidenav.getInstance(inst);
        instance.close();
    }
};