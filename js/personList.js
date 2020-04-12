/*************************
*
*  @description This will build and render the person list
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/

import {giftrRequests} from './requests.js';
import { pubsub } from './pubsub.js';

export const personList = {

    //render the person list in whatever contaienr sepecified
    render: container =>{
        //get/clone the template
        let template = document.getElementById('personListTemplate');
        let ul = template.content.cloneNode(true);

        //attach all the events needed

        //render in the container
        container.appendChild(ul);

        //instantiate whatever materialize events needed


        //subscribe to any pubsub events needed
        pubsub.subscribe('loginStatus', personList.loginStatus);
    },

    //view for the user not logged in
    loginStatus: isAuth =>{
        let list = document.getElementById('personList');
        if(isAuth){
            //user is logged in, fetch from GET /api/people to get their list of people
            let template = document.getElementById('personCardTemplate');
            list.innerHTML = ""; //clear out the list before we add all the people
        } else {
            let userMessage = document.createElement('p');
            userMessage.classList.add('flow-text', 'center');
            userMessage.textContent = 'User is not logged in, please log in to access our full app';
            list.innerHTML = "";
            list.appendChild(userMessage);
        }
    },

    //make a fetch to GET /api/people
    fetchPeople: function(){

    }
}