/*

    ANY REGISTRATION, LOGIN, DATA REQUEST TO CLIENT and ANY OPERATION THAT REQUIRES AUTHENTICATION
    IS HANDLED BY THIS ROUTER

*/
const express = require('express');
const router = express.Router();

// bring the authentication model
let auth = require('../utils/auth/auth');
let data = require('../utils/data/data');

router.post('/login', (req, res) => {
    // forward to the login module
    auth.loginRequest(req, res);
})

router.get('/dashboard', (req, res) => {
    if (!req.session.merchant_code) {
        console.log(req.session)
        res.redirect('/')
    } else {
        console.log(req.session)
        res.render('dashboard.html')
    }
});

router.get('/request_collection', (req, res) => {
    // send data entry file
    res.render('data_entry.html')
})
router.get('/add_members', (req, res) => {
    res.render('add_member.html')
})

router.get('/get_regions', (req, res) => {
    /*
        perform the requested operation to get all the regions available in the database
    */
})

router.post('/request_membership', (req, res) => {
    /*
     *  request membership and generate access token for use during authentication
     */
    auth.registerClient(req, res);
});

router.post('/res_auth', (req, res) => {
    /*
     * resend auth code
     */
    auth.resendAuthCode(req, res);
})

router.get('/logout', (req, res) => {
    // kick out the user
    req.session.destroy(() => {
        // destroyed sessions
    })
    res.redirect('/');
});



// expose the router to server
module.exports = router;