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

router.get('/allregions', (req, res) => {
    /*
     * retrieve number of regions
     */
    data.admin.retrieveRegTotal(req, res);
});

router.get('/subregions', (req, res) => {
    /*
     * retrieve number of sub regions
     */
    data.admin.retrieveSubRegions(req, res);
})

router.get('/hprodRegion', (req, res) => {
    /*
     * retrieve highest productive region, and amount for the previous 30 days
     */
    data.admin.retrieveHPRegion(req, res);
})

router.get('/hprodSubreg', (req, res) => {
    /*
     * retrieve highest productive subregion, and it's total amount for the previous 30 days
     */
    data.admin.retrieveHRSubRegion(req, res);
});

router.get('/regionsRetrieve', (req, res) => {
    /*
     * retrieve all regions by name and their ids
     */
    data.merchant.retrieveRegions(req, res);
});

router.get('/allCounties', (req, res) => {
    /*
     * retrieves all the regions in the region being considered(returns
     * a record of all the regions, with theid ids)
     */
    data.admin.retrieveCounties(req, res);
})

router.post('/addRegion', (req, res) => {
    /*
     * takes the form data for regions and adds them to the database
     */
    data.admin.registerRegion(req, res);
});


router.get('/allRegionsToadd', (req, res) => {
    /*
     * retrieve all the counties in the region being considered
     */
    data.admin.retrieveAllRegions(req, res);
})

router.post('/addSubregion', (req, res) => {
    /*
     * takes the form data for sub regions and adds them to the database
     */
    data.admin.registerSUBRegion(req, res);
})

router.get('/allRegionsTotal', (req, res) => {
    /*
     * retrieve regions data for today
     */
    data.admin.retrieveTodayRefined(req, res);
})

router.get('/lastSixDays', (req, res) => {
    /*
     * retrieve for the last 6 days for all the regions
     */
    data.admin.retrieveLastSixDays(req, res);
});

router.get('/merchantCodes', (req, res) => {
    /*
     * get all merchant codes
     */
    data.admin.retrieveMerchantCodes(req, res);
})

// expose router to server
module.exports = router;