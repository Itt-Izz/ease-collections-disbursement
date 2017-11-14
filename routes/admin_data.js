/**
 * all admin data requests will be handled through this route
 */

const express = require('express');
const router = express.Router();
const data = require('../utils/data/data');


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

router.get('/notifs/:type', (req, res) => {
    /*
     * retrieve notifs count
     */
    data.admin.retrieveNotifs(req, res);
});

router.get('/todayColls', (req, res) => {
    /*
     * retrieve count of todays collections and display in the analytics
     */
    data.admin.retrieveTodayColls(req, res);
})

router.get('/organizeByReg/:region', (req, res) => {
    /*
     * retrieve by selected region, a count
     */
    data.admin.retrieveByRegion(req, res);
})

router.get('/previousMonth', (req, res) => {
    /*
     * retrieve previous 30 days data, for collection and payment requests
     * 
     * DATABASE OPTIMIZATION TO FILTER OUT COLLECTION PAYMENTS REQUESTS NICELY
     */
    data.admin.retrievePreviousMonthCol(req, res);
})

router.get('/previousYear', (req, res) => {
    /*
     * retrieve previous 12 months data, for collections only
     */
    data.admin.retrievePreviousYear(req, res);
})

// expose router to server
module.exports = router;