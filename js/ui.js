//use this file to instantiate any materialize js functionality needed for app

let opts = {
    data: {},
    limit: "2"
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.autocomplete');
    var instances = M.Autocomplete.init(elems, opts);
});