/**
 * all admin authentication will be handled through this route
 */

const express = require('express');
const router = express.Router();
const auth = require('../utils/auth/admin/admin')

router.post('/login', (req, res) => {
    /*
     * do a credentials verification and authenticate
     */
    auth.requestAuthentication(req, res);
});

router.get('/dashboard', (req, res) => {
    /*
     * render the dashboard
     */
    console.log(req.app.locals.code)
    res.render('admin/dashboard.html');
})

router.post('/merchantRegister', (req, res) => {
    /*
     * register new merchant
     */
    auth.registerMerchant(req, res);
})

router.get('/recoverMerchPwd/:obj', (req, res) => {
    /*
     * recover merchant password
     */
    auth.recoverMerchantPwd(req, res);
})

router.get('/logout', (req, res) => {
    // kick out the user
    req.app.locals.code = undefined;
    res.redirect('/admin');
});

module.exports = router;