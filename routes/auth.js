/*
    ANY REGISTRATION, LOGIN, DATA REQUEST TO CLIENT and ANY OPERATION THAT REQUIRES AUTHENTICATION
    IS HANDLED BY THIS ROUTER

*/
const express = require('express')
const router = express.Router()
const session = require('../utils/session')

// bring the authentication model
let auth = require('../utils/auth/auth');
let data = require('../utils/data/data');

router.post('/login', (req, res) => {
    // forward to the login module
    auth.loginRequest(req, (status) => {
        status = JSON.parse(status)
        if (status.message == 'authorized') {
            res.redirect('/auth/dashboard')
        }
        if (status.message == 'unauthorized') {
            res.redirect('/?auth-failed')
        }
        if (status.message == 'empty_query') {
            res.redirect('/?empty-query')
        }
    });
})

router.get('/dashboard', (req, res) => {
    if (session.own.find(obj => obj.ipAddrr === req.ip)) {
        res.render('dashboard.html')
    } else {
        res.redirect('/')
    }
})

router.get('/request_collection', (req, res) => {
    console.log(session.own)

    // send data entry file
    res.render('data_entry.html')
})
router.get('/add_members', (req, res) => {
    console.log(session.own)
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
    auth.registerClient(req, res)
});

router.post('/res_auth', (req, res) => {
    /*
     * resend auth code
     */
    auth.resendAuthCode(req, res)
})

router.get('/logout', (req, res) => {
    // kick out the user
    session.destroy(req.ip, (action) => {
        if (action == true) {
            res.redirect('/')
        }
    })
    console.log(session.own)
});



// expose the router to server
module.exports = router;