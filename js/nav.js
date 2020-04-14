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
import {giftrRequests} from './requests.js';
import {ui} from './ui.js';

export const nav = {
    //loginStatus will have true or false if logged in and will be defaulted to false when app loads
    isUserAuth: false,

    //will render the naviagtion in the main html documents
    render: container => {
        let template = document.getElementById('mainNavigation');
        let mainNav = template.content.cloneNode(true); //get a copy of the main navigation

        //clone the side template
        let sideTemplate = document.getElementById('profileTemplate');
        let sidenav = sideTemplate.content.cloneNode(true);

        //add all the events I want to for profile buttons
        mainNav.getElementById('profileNav').addEventListener('click', nav.getProfile);
        sidenav.getElementById('signout').addEventListener('click', nav.signout);

        //now append the mainNav to the container
        container.appendChild(mainNav);
        container.appendChild(sidenav);

        //init the materialize side nav for the profile
        ui.initSidenav('profileSlideout', 'right')

        

        //subscribe to any events we want to listen to like the log in events:
        pubsub.subscribe('loginStatus', nav.loginStatus);
    },

    //loginStatus will change the isUserAuth to true or false, whatever the data given
    loginStatus: isAuth =>{
        nav.isUserAuth = isAuth;
        if(isAuth){ //user is logged in
            document.getElementById('profileNav').classList.remove('hide');
            document.getElementById('loginNav').classList.add('hide');
            document.getElementById('signupNav').classList.add('hide');
        } else {
            document.getElementById('profileNav').classList.add('hide');
            document.getElementById('loginNav').classList.remove('hide');
            document.getElementById('signupNav').classList.remove('hide');
        }
    },

    //callback function to get the profile data of the user
    getProfile: ev =>{
        let req = giftrRequests.send('GET', '/auth/users/me/', null, false, true);

        fetch(req)
            .then(res => res.json())
            .then(data => {
                if(data.errors){
                    console.error('error fetching profile info', data.error);
                    M.toast({html: 'error fetching profile info'});
                }
                if(data.data){
                    return data.data
                }
            })
            .then(profile =>{
                nav.buildProfileNav(profile);
                console.log(profile);
            })
            .catch(err =>{
                console.error(err);
                M.toast({html:'fatal error fetching profile info'});
            })
    },

    //helper function to render the navigation
    buildProfileNav: profile =>{

        let sidenav = document.querySelector('#profileSlideout');
        console.log(sidenav);
        //set the appropriate text content
        sidenav.querySelector('.fname').textContent = 'First Name: ' +  profile.firstName;
        sidenav.querySelector('.lname').textContent = 'Last Name: ' + profile.lastName;
        sidenav.querySelector('.email').textContent = 'email: ' + profile.email;

        //init materialize js fucntionality
    },

    signout: ev =>{
        ev.preventDefault();

        //clear out the item in session storage
        sessionStorage.removeItem('GIFTR-UserToken');

        //tell the other modules we signed out
        pubsub.publish('loginStatus', false);

        //close the form
        ui.closeSidenav(document.getElementById('profileSlideout'));

        //tell the user
        window.location.href = '/index.html';
        M.toast({html: 'logged out'})
    }
};