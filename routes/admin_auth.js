/**
 * all admin authentication will be handled through this route
 */
const express = require('express');
const router = express.Router();
const auth = require('../utils/auth/admin/admin')

router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard.html');
});

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

module.exports = router;