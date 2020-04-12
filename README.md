## GIFT-PWA
### https://prof3ssorst3v3.github.io/mad9022/assignments/assign2.html

### To Do: 
- [ ] create icon for web app
- [ ] draw out some paper prototype ideas for this applicationa and decide on which componenets I need to use from materailize
- [ ] create x-icon for desktop version 
- [x] link materialize library (self hosted for offline use)
- [ ] decide on a colour scheme (add class to body based on colour scheme)
- [ ] decide on design practice (pubsub, seems like the best option so far)
- [ ] create some base materialize templates to use
- [ ] figure out form validation with materialize forms
- [ ] make sure nav bar changes when the person is logged in

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

### Reminders: 
- Make sure to init side navs for right and left side seperately. maybe just init inside each seperate module
- MAke sure to use Toasts (M.toast({html: info})) for user alerts

### Bugs: 
- [x] Fix login and signup links dissapearing on larger screens (possibly just a materialize class) || add class show-on-large to links in nav to see on larger screens