/**
 *
 * all admin data requests will be handled through this route
 */
const express = require('express');
const router = express.Router();

router.get('/reports', (req, res) => {
    /*
     * render the reports file
     */
    res.render('admin/reports.html');
});

router.get('/regions', (req, res) => {
    /*
     * render the regions file
     */
    res.render('admin/regions.html');
});

router.get('/merchants', (req, res) => {
    /*
     * render the merchants file
     */
    res.render('admin/merchants.html'); 
});

router.get('/conf', (req, res) => {
    /*
     * render the conf file
     */
    res.render('admin/conf.html');
});

router.get('/secure', (req, res) => {
    /*
     * render the secure file
     */
    res.render('admin/secure.html');
});

module.exports = router;
