/*************************
*
*  @description This is the main navigation for the app
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/

//will have a signup and login form links when logged out
//will have logout or myProfile links when logged in
//will render based on templates in the main app.js part of the module

import {pubsub} from './pubsub.js';

export const nav = {
    //loginStatus will have true or false if logged in and will be defaulted to false when app loads
    isUserAuth: false,

    //will render the naviagtion in the main html documents
    render: container => {
        let template = document.getElementById('navNotAuthenticated');
        let mainNav = template.content.cloneNode(true); //get a copy of the main navigation

        //add all the events I want to for login and signup buttons

        //now append the mainNav to the container
        container.appendChild(mainNav);
        //subscribe to any events we want to listen to like the log in events:
        pubsub.subscribe('loginStatus', nav.loginStatus);
    },

    //loginStatus will change the isUserAuth to true or false, whatever the data given
    loginStatus: isAuth =>{
        nav.isUserAuth = isAuth; 
    }
};