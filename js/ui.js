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
        M.Sidenav.init(instances, {edge})
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
    }
};