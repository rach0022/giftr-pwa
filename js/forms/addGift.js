/*************************
*
*  @description This will build and render the add gift form
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 12, 2020
*
***********************/

import {giftrRequests} from '../requests.js';
import {pubsub} from '../pubsub.js';
import { ui } from '../ui.js';

export const addGiftForm = {
    personId: null, //person id that will be got from session storage
    render: container => {
        //get the template
        let template = document.getElementById('addGiftFormTemplate');
        let form = template.content.cloneNode(true);

        //attach all event listenrs the buttons need
        form.querySelector('#submit_gift').addEventListener('click', addGiftForm.add);
        form.querySelector('#cancel_gift').addEventListener('click', addGiftForm.cancel);

        //get the person id from sessionStorage otherwise throw an error saying why are you here
        //and then send back to the main page
        addGiftForm.personId = sessionStorage.getItem('GIFTR-PersonID') || null;

        if(!addGiftForm.personId){
            console.log('How did you get here hacker, run away while you can')
        }

        //render in the container
        container.appendChild(form);

        //init any materialzie js events needed
        ui.initModal('addGiftForm', {opacity: '0.5'});

        //subscribe to any pubsub events needed
    },
    add: ev =>{
        ev.preventDefault();
        let form = document.getElementById('addGiftForm');
        let store = {}; //create an empty object to hold the store values

        let name = form.querySelector('#name-gift').value;
        let price = parseInt(form.querySelector('#price-gift').value);
        store.name = form.querySelector('#storename-gift').value;
        store.productURL = form.querySelector('#storeURL-gift').value;
        let imageUrl = form.querySelector('#imageURL-gift').value;

        let req = giftrRequests.send(
            'POST', 
            `/api/people/${addGiftForm.personId}/gifts/`,
            {name, store, price, imageUrl},
            true,
            true
        );
        console.log(req);
        
        if(req){
            fetch(req)
                .then(res => res.json())
                .then(data => {
                    if(data.errors){
                        M.toast({html: 'error adding gift'});
                        console.log('error sending person', data.errors)
                    } else if (data.data){
                        return data.data
                    }
                })
                .then(data =>{
                    console.log(data);
                    pubsub.publish('loadGifts', true); //will change this later
                    ui.closeModal(form);
                })
                .catch(err => console.error(err));
        }
    },
    cancel: ev =>{
        ev.preventDefault();
        let form = document.getElementById('addGiftForm');
        form.querySelector('form').reset();
        ui.closeModal(form);
    }
}