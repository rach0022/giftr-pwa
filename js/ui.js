/*************************
*
*  @description use this file to instantiate any materialize js functionality needed
*
*  @author Ravi Chandra Rachamalla rach0022@algonquinlive.com
*
*  @version Apr 11, 2020
*
***********************/

let opts = {
    data: {},
    limit: "2"
}

document.addEventListener('DOMContentLoaded', function() {
    var autocompleteElements = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(autocompleteElements, opts);

    // let rightSideNavs = document.querySelectorAll('.sidenav.right');
    // M.Sidenav.init(rightSideNavs, {edge: "right"});

    // let leftSideNavs = document.querySelectorAll('.sidenav.left');
    // M.Sidenav.init(leftSideNavs, {edge: "left"});
});