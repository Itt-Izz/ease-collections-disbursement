/**
 * all admin authentication will be handled through this route
 */

const express = require('express')
const router = express.Router()
const session = require('../utils/session')
const auth = require('../utils/auth/admin/admin')

router.get('/checkAdmin', (req, res) => {
    /*
     * check admin details and respond accordingly
     */
    auth.checkAdminDetails(req, (response) => {
        res.end(response)
    })
})

router.post('/initiateAdmin', (req, res) => {
    /*
     * initiate admin details
     */
    auth.initiateAdmin(req, (response) => {
        res.end(response)
    })
})

router.post('/login', (req, res) => {
    /*
     * do a credentials verification and authenticate
     * check if admin data exists in database, else request data
     */
    auth.requestAuthentication(req, (response) => {
        res.end(response)
    })
})

router.get('/dashboard', (req, res) => {
    /*
     * render the dashboard
     */
    if (session.own.find(obj => obj.ipAddrr === req.ip)) {
        res.render('admin/dashboard.html')
    } else {
        res.redirect('/admin')
    }
})

router.post('/merchantRegister', (req, res) => {
    /*
     * register new merchant
     */
    auth.registerMerchant(req, res)
})

router.get('/recoverMerchPwd/:obj', (req, res) => {
    /*
     * recover merchant password
     */
    auth.recoverMerchantPwd(req, res)
})

router.get('/logout', (req, res) => {
    // kick out the user
    session.destroy(req.ip, (action) => {
        if (action == true) {
            res.redirect('/admin')
        }
    })
})

router.get('/merchantPasswordRecovery', (req, res) => {
    /**
     * 
     */
    res.redirect('/?credentials_phone_access')
})

module.exports = router