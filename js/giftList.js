/*************************
*
*  @description This will build and render the gift list
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 12, 2020
*
***********************/

import {giftrRequests} from './requests.js';
import { pubsub } from './pubsub.js';
import {ui} from './ui.js';

export const giftList = {
    personId: null, //container for the person id stored in session storage
    render: container =>{
        let template = document.getElementById('giftListTemplate');
        let ul = template.content.cloneNode(true);

        //render in the container
        container.appendChild(ul);

        //start any materialize components needed

        //subscribe to any events needed
        pubsub.subscribe('loadGifts', giftList.loadPage);
        pubsub.publish('loginStatus', true); //CHANGE THIS
        pubsub.publish('loadGifts', true); //CHANGE THIS
    },

    loadPage: needGifts =>{
        let list = document.getElementById('giftList');
        if(needGifts){

            //get the person id and or send them back
            giftList.personId = sessionStorage.getItem('GIFTR-PersonID') || null;

            if(!giftList.personId){
                console.log('How did you get here hacker, run away while you can')
            }

            //clear out the gift list and show the add button
            list.innerHTML = "";
            document.getElementById('addGift').classList.remove('hide');

            //create the request and fetch the gifts
            let req = giftrRequests.send('GET', `/api/people/${giftList.personId}/`, null, false, true);

            if(req){
                giftList.fetchGifts(req);
            }

        }
    },

    //make the actual fetch in this helper function
    fetchGifts: req =>{
        fetch(req)
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(data =>{
                if(data.errors){
                    console.log('error fetching data');
                    M.toast({html: 'error fetching gift list'});
                }
                if(data.data){
                    // M.toast({html: 'retrieved gift list'});
                    return data.data.gifts
                }
            })
            .then(gifts =>{
                console.log(gifts);
                giftList.buildGiftCards(gifts);
            })
            .catch(err => {
                console.error('error fetching gifts', err);
                M.toast({html: 'fatal error fetching gift list'});
            })
    },

    buildGiftCards: gifts =>{
        let template = document.getElementById('cardTemplate');
        let frag = document.createDocumentFragment();
        if(gifts.length == 0) console.log('you did it!');
        gifts.forEach(gift =>{
            console.log(gift);
            let card = template.content.cloneNode(true); //get the card

            //set the content and attributes for the card
            card.querySelector('.card').setAttribute('data-giftid', gift._id);
            if(gift.imageUrl){
                card.querySelector('img').src = gift.imageUrl; 
            }
            card.querySelector('.card-title').textContent = gift.name;
            card.querySelector('.card-content').textContent = 
                `Price: ${ui.formatCurrency(gift.price)}
                 StoreName: ${gift.store.name}
                 StoreURL: ${gift.store.productUrl}
                 imageURL: ${gift.imageUrl}`;
            card.querySelector('.deleteGift').setAttribute('data-giftid', gift._id);


            //set the event listeners for the buttons (show person/ delete)
            card.querySelector('.deleteGift').addEventListener('click', giftList.deleteGift);

            //append the card to the ul
            frag.appendChild(card);
        })
        document.getElementById('giftList').appendChild(frag);
    },

    deleteGift: ev =>{
        ev.preventDefault();
        let id = ev.currentTarget.getAttribute('data-giftid'); //get the id from the button
        console.log(id);
        let req = giftrRequests.send('DELETE', `/api/people/${giftList.personId}/gifts/${id}`, null, false, true);

        fetch(req)
            .then(res => res.json())
            .then(data => {
                if(data.errors){
                    console.log('errors', data);
                }
                if(data.data){
                    console.log(data);
                    M.toast({html:'gift deleted'});
                    pubsub.publish('loadGifts', true);
                }
            })
            .catch(err => console.error(err));
    }
}