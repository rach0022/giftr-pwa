## GIFT-PWA
### https://prof3ssorst3v3.github.io/mad9022/assignments/assign2.html

### To Do: 
- [ ] create icon for web app
- [x] draw out some paper prototype ideas for this applicationa and decide on which componenets I need to use from materailize
- [ ] create x-icon for desktop version 
- [x] link materialize library (self hosted for offline use)
- [ ] decide on a colour scheme (add class to body based on colour scheme)
- [ ] decide on design practice (pubsub, seems like the best option so far)
- [ ] create some base materialize templates to use
- [ ] figure out form validation with materialize forms
- [ ] make sure nav bar changes when the person is logged in
- [x] switch to modals for add Gift/Person forms
- [x] fix Gift Modal to not be scrollable
- [x] maybe switch to collections instead of cards for the person/ gift list | only used for gifts as they have one button only
- [x] add GIFTR-SPA functionality like sorting by birthdate, checking if birthdate is past, formatting dates, formatting currency
- [x] add Empty list message for gifts and person list if there are no gifts or people added
- [ ] switch signout link to outside of profile section and move to header

### Templates/ Componenets to Decide on Based on Materialize:
- [x] Nav Bar when logged out (needs login, and signup form links) || started creating, now need to decide on how to make signup and login forms to show when the nav is selected, also change isUserAuth to change the anv bar when the user is logged in or out
- [x] Nav Bar when logged in (needs logout and user side nav link)
- [x] User side nav is a button that gets clicked to pull out a side nav that shows info from GET /auth/users/me 
- [x] Card template for people in GET /api/people 
- [ ] Card template for gift list from GET /api/people/:personId/gifts
- [x] Form for signup (needs lastName, firstName, email, password) buttons: cancel, submit
- [x] Form for login (needs email, password) buttons: submit, cancel
- [ ] Form for change password (needs new password) buttons: submit, cancel
- [ ] Forms are side navs that can get pulled out, possibly done as a template to render them using pub sub methodology
- [ ] forms for add person or gift, should slide down from under and be shown once a user clicks a button

### Images to Design:
- [ ] Empty Person Silhouette to use when no image URL is defined
- [ ] Gift Picture to use when no gift.imageUrl is provided
- [ ] Icon for the PWA App in all the sizes needed (sizes to come)
- [ ] SVG Loader Icon

### Reminders: 
- Make sure to init side navs for right and left side seperately. maybe just init inside each seperate module
- Make sure to use Toasts (M.toast({html: info})) for user alerts
- Refactor all fetchs in api to use a function built in requests.js (noticing pattenerns between every request dont need to rewrite that code)

### Bugs: 
- [x] Fix login and signup links dissapearing on larger screens (possibly just a materialize class) || add class show-on-large to links in nav to see on larger screens
- [ ] imageUrl for person and product/imageUrl for gifts are not sending properly as the object recieved never has it || fixed everything except for imageURL for gifts, ask steve
- [x] price for gift is always null when sent
- [x] sort birthday is not working
- [x] figure out why date formatted is always one day before the actual date given | solution: setUTCHours(>1) so to say it is past midnight
- [ ] Figure out why Jan 1st is sorted as the last day of the year by my ui.Sort method