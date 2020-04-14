/*************************
*
*  @description use this file to instantiate any materialize js functionality needed
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/
export const ui = {

    //initsidenav is a helper function will take in the element id of the sidenav and the edge it comes from
    //and will init the sidenav
    initSidenav: (elementID, edge) =>{
        let instances = document.querySelector(`#${elementID}`);
        M.Sidenav.init(instances, {edge, draggable: true})
    },

    //close sidenav is a helper function that will take the element from the DOM
    //and close the sidenav of it
    closeSidenav: element =>{
        let instance = M.Sidenav.getInstance(element);
        instance.close();
    },

    initModal: (elementID, opts) =>{
        let instances = document.querySelectorAll(`#${elementID}`);
        M.Modal.init(instances, opts);
    },

    closeModal: (element) =>{
        let instance = M.Modal.getInstance(element);
        instance.close();
    },

    //start of helper/ callback functions to style the ui like checking if the birthday is past
    //starter of these functions were all taken from GIFTR-SPA Assignement 1
    parseDate: dateResponse =>{
        return new Date(dateResponse);
    },

    //helper function to format the date to only get the month and day (who cares about year)
    formatDate: date =>{
        let newDate = ui.parseDate(date).setUTCHours(16);
        let opts = {
            month: 'short',
            day: 'numeric'
        }
        return new Intl.DateTimeFormat('en-CA', opts).format(newDate);
    },

    //format currency (given an amount in cents that will spit out the number properyly formatted)
    formatCurrency: cents =>{
        let money  = Math.ceil(cents/100); //get rid of any decimal and make it dollars
        let formatter = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CDN' });
        return formatter.format(money); 
    },

    //helper function to add the protocol onto the link if it doesnt have it
    addProtocol: url =>{
        //dont want to mutate the data so make a copy
        let newURL = url
        if(url.substring(0,8) != 'https://' || url.substring(0,7) != 'http://'){
            newURL =  'https://' + url
        }
        return newURL;
    },

    //helper function to compare the current date vs the birthdate
    //to see if it is past or not, input parameter is the date value in ms
    //will return a value to say if the date is past or not
    isBirthdayPast: time => {
        let today = new Date(Date.now());
        let comparisonDate = ui.parseDate(time);

        //if the month of the birthday is greater then todays months
        //we know the birthday is coming up and not to be styled differnetly
        //but if the months are equal then we check the day comparison
        //otherwise if the month is less then the current month it will be styled
        //as a past date
        console.log(comparisonDate.getMonth(),  today.getMonth());
        if(comparisonDate.getMonth() > today.getMonth()){
            return undefined;  //return empty string so nothing is added to the classlist
        } else if (comparisonDate.getMonth() == today.getMonth()){
            if(comparisonDate.getDate() > today.getDate() || comparisonDate.getDate() == today.getDate()){
                return undefined;
            } else {
                return 'darken-4';
            }
        } else {
            return 'darken-4';
        }
    },

    //callback function to sort by birthdate
    sortBirthdate: (a, b) =>{
        let a_date = ui.parseDate(a.birthDate);
        let b_date = ui.parseDate(b.birthDate);

        if(a_date.getMonth() == b_date.getMonth()){ //they are the same month return days
            return a_date.getDate() - b_date.getDate();
        } else {
            return a_date.getMonth() - b_date.getMonth(); //if not the same month sort by month
        }
    }
};