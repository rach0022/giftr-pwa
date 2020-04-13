/*************************
*
*  @description This will build and render the add person form
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 12, 2020
*
***********************/

import {giftrRequests} from '../requests.js';
import {pubsub} from '../pubsub.js';
import { ui } from '../ui.js';

export const addPersonForm = {
    render: container =>{
        //get the template
        let template = document.getElementById('addPersonTemplate');
        let form = template.content.cloneNode(true);

        //attach all the event listeners needed (add person button, cancel)
        form.querySelector('#submit_person').addEventListener('click', addPersonForm.add);
        form.querySelector('#cancel_person').addEventListener('click', addPersonForm.cancel);

        //render in the container
        container.appendChild(form);

        //init any materialize js functionality needed (taken from materialize docs)
        ui.initModal('addPersonForm', {opacity: '0.5'});

        //subscribe to any pubsub events needed:
    },

    add: ev =>{
        ev.preventDefault();
        let form = document.getElementById('addPersonForm');

        let name = form.querySelector('#fullname-person').value;
        let birthDate = form.querySelector('#birthdate-person').value;
        let imageUrl = form.querySelector('#imageUrl-person').value;
        let req = giftrRequests.send('POST', '/api/people/', {name, birthDate, imageUrl}, true, true);
        // console.log(req, {name, birthDate, imageUrl});

        if(req){
            //fetch the request (send the data to the server)
            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if(data.errors){
                        M.toast({html: 'error adding person'});
                        console.log('error sending person', data.errors)
                    } else if (data.data){
                        return data.data
                    }
                })
                .then(data =>{
                    console.log(data);
                    //tell the program there is a change and close the sidenav
                    pubsub.publish('loginStatus', true); //change later to a different event 
                    ui.closeModal(form);

                })
                .catch(err => console.error(err));
        }
    },
    cancel: ev =>{
        ev.preventDefault();
        let form = document.getElementById('addPersonForm');
        form.querySelector('form').reset();
        ui.closeModal(form);
    }
}