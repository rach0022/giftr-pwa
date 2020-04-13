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
import {ui} from './ui.js';

export const personList = {
    emptyMessage: 'You Have no Friends Added, please press the green button to add a friend',
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
            // let template = document.getElementById('personCardTemplate');
            list.innerHTML = ""; //clear out the list before we add all the people
            document.getElementById('addPerson').classList.remove('hide'); //show the add button

            //now create the request and fetch GET /api/people
            let req = giftrRequests.send('GET', '/api/people/', null, false, true);

            if(req){
                personList.fetchPeople(req);
            }
        } else {
            let userMessage = document.createElement('p');
            userMessage.classList.add('flow-text', 'center');
            userMessage.textContent = 'User is not logged in, please log in to access our full app';
            list.innerHTML = "";
            document.getElementById('addPerson').classList.add('hide'); //hide the add button
            list.appendChild(userMessage);
        }
    },

    //make a fetch to GET /api/people
    fetchPeople:  req => {
        fetch(req)
            .then(res => res.json())
            .then(data =>{
                console.log(data);
                if(data.errors){
                    console.log('error fetching data');
                    M.toast({html: 'error fetching person list'});
                }
                if(data.data){
                    // M.toast({html: 'retrieved person list'});
                    return data.data
                }
            })
            .then(people =>{
                console.log(people);
                people.sort(ui.sortBirthdate);
                personList.buildPersonCards(people);
            })
            .catch(err =>{
                console.error('error fetching people', err);
                M.toast({html: 'fatal error fetching person list'});
        });
    },

    //helper function to build card list, given the data from teh fetch resp as parameter
    buildPersonCards: people =>{
        let template = document.getElementById('collectionTemplate');
        // let template = document.getElementById('cardTemplate');
        let frag = document.createDocumentFragment();

        if(people.length > 0){
            //go through everyone in the array and create the cards cloning the template
            // people.forEach(person =>{
            //     console.log(person);
            //     let card = template.content.cloneNode(true); //get the card

            //     //set any classes necessary like past
            //     let birthCheck = ui.isBirthdayPast(person.birthDate);
            //     if(birthCheck) card.querySelector('.card').classList.add(birthCheck); 

            //     //set the content and attributes for the card
            //     if(person.imageUrl){
            //         card.querySelector('img').src = person.imageUrl; 
            //     }
            //     card.querySelector('.card-title').textContent = person.name;

            //     card.querySelector('.card').setAttribute('data-personid', person._id);
            //     card.querySelector('.card-content').textContent = ui.formatDate(person.birthDate);
            //     card.querySelector('.deletePerson').setAttribute('data-personid', person._id);
            //     card.querySelector('.showGifts').setAttribute('data-personid', person._id);

            //     //set the event listeners for the buttons (show person/ delete)
            //     card.querySelector('.showGifts').addEventListener('click', personList.showGifts);
            //     card.querySelector('.deletePerson').addEventListener('click', personList.deletePerson);

            //     //append the card to the ul
            //     frag.appendChild(card);
            // });
            people.forEach(person =>{
                let item = template.content.cloneNode(true);
                let del_btn = item.querySelector('.deletePerson');
                let gift_btn = item.querySelector('.showGifts');
                let p = item.querySelector('p');

                //set any classes and attributes needed
                let birthCheck = ui.isBirthdayPast(person.birthDate);
                if(birthCheck){
                    item.querySelector('.collection-item').classList.add(birthCheck);
                    let badge = document.createElement('span');
                    badge.classList.add('red', 'badge');
                    badge.textContent = 'birthday past';
                    item.querySelector('.collection-item').appendChild(badge);
                }
                
                item.querySelector('.collection-item').setAttribute('data-personid', person._id);
                del_btn.setAttribute('data-personid', person._id);
                gift_btn.setAttribute('data-personid', person._id);

                //set the content
                item.querySelector('.title').textContent = person.name;
                if(person.imageUrl){
                    item.querySelector('img').src = person.imageUrl;
                } else {
                    item.querySelector('img').src = '../res/img/star.png';
                }
                p.textContent = ui.formatDate(person.birthDate);

                //set the listeners
                gift_btn.addEventListener('click', personList.showGifts);
                del_btn.addEventListener('click', personList.deletePerson);

                frag.appendChild(item); //append to the frag
            })
        } else {
            let heading = document.createElement('h5');
            heading.textContent = personList.emptyMessage;
            heading.classList.add('center-align');
            frag.appendChild(heading);
        }
        document.getElementById('personList').appendChild(frag);

    },

    //callback function to bind to show gifts button on person card
    showGifts: ev =>{
        ev.preventDefault();
        sessionStorage.setItem('GIFTR-PersonID', ev.currentTarget.getAttribute('data-personid'));
        pubsub.publish('loadGifts', true);
        window.location.href = '../pages/gifts.html';
    },

    //callback function to delete the selected person
    deletePerson: ev =>{
        ev.preventDefault();
        let id = ev.currentTarget.getAttribute('data-personid'); //get the id from the button
        // console.log();
        let req = giftrRequests.send('DELETE', `/api/people/${id}`, null, false, true);

        fetch(req)
            .then(res => res.json())
            .then(data => {
                if(data.errors){
                    console.log('errors', data);
                }
                if(data.data){
                    console.log(data);
                    M.toast({html:'person deleted'});
                    pubsub.publish('loginStatus', true);
                }
            })
            .catch(err => console.error(err));
    }
}