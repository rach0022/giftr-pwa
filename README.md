## GIFT-PWA
### https://prof3ssorst3v3.github.io/mad9022/assignments/assign2.html

### To Do: 
- [ ] create icon for web app | have test icon, need to make a better one now
- [x] draw out some paper prototype ideas for this applicationa and decide on which componenets I need to use from materailize
- [x] create x-icon for desktop version | copied from assignment 1
- [x] link materialize library (self hosted for offline use)
- [ ] decide on a colour scheme (add class to body based on colour scheme)
- [x] choose some google fonts to host on site, maybe even add them to the static/ dynamic cache
- [x] decide on design practice (pubsub, seems like the best option so far)
- [x] create some base materialize templates to use
- [x] figure out form validation with materialize forms
- [x] make sure nav bar changes when the person is logged in
- [x] switch to modals for add Gift/Person forms
- [x] fix Gift Modal to not be scrollable
- [x] maybe switch to collections instead of cards for the person/ gift list | only used for gifts as they have one button only
- [x] add GIFTR-SPA functionality like sorting by birthdate, checking if birthdate is past, formatting dates, formatting currency
- [x] add Empty list message for gifts and person list if there are no gifts or people added
- [x] CANCELED | I like it where it is switch signout link to outside of profile section and move to header
- [x] add loader to signin page as it takes a while to gen a token
- [ ] fix up styles and alignment of the badges

### Templates/ Componenets to Decide on Based on Materialize:
- [x] Nav Bar when logged out (needs login, and signup form links) || started creating, now need to decide on how to make signup and login forms to show when the nav is selected, also change isUserAuth to change the anv bar when the user is logged in or out
- [x] Nav Bar when logged in (needs logout and user side nav link)
- [x] User side nav is a button that gets clicked to pull out a side nav that shows info from GET /auth/users/me 
- [x] Card template for people in GET /api/people 
- [x] Card template for gift list from GET /api/people/:personId/gifts
- [x] Form for signup (needs lastName, firstName, email, password) buttons: cancel, submit
- [x] Form for login (needs email, password) buttons: submit, cancel
- [ ] Form for change password (needs new password) buttons: submit, cancel
- [x] Forms are side navs that can get pulled out, possibly done as a template to render them using pub sub methodology
- [x] forms for add person or gift, should slide down from under and be shown once a user clicks a button

### Images to Design:
- [x] Empty Person Silhouette to use when no image URL is defined
- [x] Gift Picture to use when no gift.imageUrl is provided
- [x] Icon for the PWA App in all the sizes needed (sizes to come) | DESIGN A BETTER ONE
- [x] CANCELLED SVG Loader Icon || used preloader from materialize instead

### To Do To Convert to PWA: 
- [x] Add PWA requirements to the head of the html pages (404.html, gifts.html, index.html)
- [x] Create a manifest.json that links to all icons made
- [x] Create a service worker (sw.js) with a global scope and register it in one of the main modules (main.js/ app.js) || HAVE BUGS
- [x] Allow a service worker to cache requests and display them to the user when offline
- [ ] Manage the install process of a pwa by following: https://prof3ssorst3v3.github.io/mad9022/modules/week11/install.html
- [ ] BONUS: you can earn a bonus 5% if you use IndexedDB and the idb-keyval library to save requests for Deleting existing people and gifts or Adding new people or gifts when the user is offline. (https://www.npmjs.com/package/idb-keyval)
- [ ] BONUS: You can earn another 5% if you are able to take any data out of IndexedDB and send it to the API when the the network connection is re-established.


### Reminders: 
- Make sure to init side navs for right and left side seperately. maybe just init inside each seperate module
- Make sure to use Toasts (M.toast({html: info})) for user alerts
- Refactor all fetchs in api to use a function built in requests.js (noticing pattenerns between every request dont need to rewrite that code)

### Bugs: 
- [x] Fix login and signup links dissapearing on larger screens (possibly just a materialize class) || add class show-on-large to links in nav to see on larger screens
- [x] imageUrl for person and product/imageUrl for gifts are not sending properly as the object recieved never has it || fixed everything except for imageURL for gifts, ask steve
- [x] price for gift is always null when sent
- [x] sort birthday is not working
- [x] figure out why date formatted is always one day before the actual date given | solution: setUTCHours(>1) so to say it is past midnight
- [ ] Figure out why Jan 1st is sorted as the last day of the year by my ui.Sort method
- [x] Service worker will not respond with cached page and will always default to caching every item even things that should already be stored in staticCache | was caching the full request not just the url as the key
- [x] unexpeceted json at position 0 when SW gives cached response for person/giftList.js when they run | was building collection regardless of response not just when we get data 
- [x] user can see other users cached data: solution: delete dynamic cache by telling service worker to do that
- [x] user cannot see updated data :  use an online first then cache strategy for giving back files from service worker
- [ ] using a cache first strategy causes the dynamic cache to double cache, should I try and fix this or just let this be, also should i stop limiting the dynamic cache size because it will always be empty when the user logs in
- [ ] icons are 1px x 1px bigger then specified, maybe it was becuase i included the bleed. I planned on remaking them so just dont include the bleed next time and also choose some colours and fonts while you are at it
- [x] auding failing: Does not provide fallback content when JavaScript is not available | solution : find a way to add some html to the body when the page loads by is cleared when the app loads. probs in app.js || WOO can pass the audit!!!