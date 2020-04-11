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

    let sideNavs = document.querySelectorAll('.sidenav');
    var sidenavInit = M.Sidenav.init(sideNavs, {edge: "left"});
});