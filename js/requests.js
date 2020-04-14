/*************************
*
*  @description This is module that will build and send requests to the GIFTR API using helper functions
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/

import { pubsub } from "./pubsub.js";
import { ui } from "./ui.js";
export const giftrRequests = {
    //the base url for the app, could be localhost or giftr api
    // baseURL: 'http://localhost:3030',
    // baseURL: 'EC2Co-EcsEl-1AH0Z1LDB9VES-797724042.us-east-1.elb.amazonaws.com',
    baseURL: 'https://giftr.mad9124.rocks',
    //helper function to place CRUD requests to GIFTR API
    //parameters are the method: GET PUT POST PATCH DELETE (use toUpper to ensure it is the right format)
    //path (ex: /api/people/peopleId)
    //the payload of the request (make to send a JSON object)
    //hasBody true or false will be used to check if we need to include the payload
    //needsAuth to check if we need to be authroized for the route we are going to
    //because we need to be able to sign up and log in without authrization but all other routes are protected
    send: (method, path, payload, hasBody, needsAuth) => {
        //first create the header, url and options for the request object
        let uri = giftrRequests.baseURL + path;
        let h = new Headers();
        let opts = {
            mode: 'cors',
            method: method.toUpperCase() //using JSON shorthand for method: method
        }
        //append the default headers needs for all requests
        h.append('Accept', 'application/json'); //we are getting json responses from the server
        h.append('Access-Control-Allow-Origin', '*'); //allow this request to come from anywhere

        //now check if we have a body and append the right content
        if(hasBody){
            //first append the right headers
            h.append('Content-type', 'application/json');
            
            //then add the payload to the request
            opts.body = JSON.stringify(payload); 
        }

        //now check if we need authroization, otherwise send an error to the send error function
        if(needsAuth){
            //get the auth token from session storage
            let token = sessionStorage.getItem('GIFTR-UserToken');
            
            //check if we have the token
            if(!token || token == '') { //if we dont have a token or the token is an empty string
                return giftrRequests.error('Invalid Authorization Error');
            }else if(token){
                //if we have the token append the authroization headers
                h.append('Authorization', token);
            }
        }

        //now that we have the headers all done, make the request object and return that for whatever fetch is needed
        opts.headers = h;

        return new Request(uri, opts);
    },

    //helper function to preform the fetch to the api using the request
    //from send, will display the success or error message as a toast
    //if supplied and will then fire off the callback function given the data.data
    //or fire off the error modal with data.errors
    //if the catch happens usually its a fatal error so lets 
    //navigate back to the main page and log out for now (change later)
    fetch: (req, successMessage, errorMessage, callback) =>{
        fetch(req)
            .then(data =>{
                if(data.errors){
                    M.toast({html: errorMessage});
                    giftrRequests.error(data.errors)
                } else if (data.data) {
                    M.toast({html: successMessage})
                    callback(data.data)
                }
                return data;
            })
            .then(callback)
            .catch(err =>{
                console.error(err);
                M.toast({html: 'Fatal Error Occured'});
                sessionStorage.removeItem('GIFTR-UserToken');
                pubsub.publish('loginStatus', false);
                // window.location.href = '/index.html';
            })
    },

    //send error: when we encouter an error with authroization or creating the request send this error
    error: info =>{
        console.log('Non fatal error occured:', info);

        //get the modal ref
        let errMod = document.getElementById('errorModal');
        M.initModal
        let errModCollection = document.querySelector('#errorModal .collection');
        errModCollection.innerHTML = "";

        info.forEach(err =>{
            let item = document.createElement('li');
            item.classList.add('collection-item', 'red-text', 'center');
            item.textContent = `${err.code} ${err.title} - ${err.detail}`
            errModCollection.appendChild(item);
        })
        M.Modal.getInstance(errMod).open();
    }
}