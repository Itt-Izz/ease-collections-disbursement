const express = require('express');
const router = express.Router();


// bring the data model
let data = require('../utils/data/data');
router.get('/local_collections', (req, res) => {
    res.render('local_col.html')
})

router.get('/pending_trans', (req, res) => {
    res.render('pending_trans.html')
})
router.get('/recent_members', (req, res) => {
    res.render('recent_members.html')
})
router.get('/remote_review', (req, res) => {
    res.render('remote_review.html')
})
router.get('/defaulters', (req, res) => {
    res.render('defaulters.html')
})
router.get('/reports', (req, res) => {
    res.render('reports.html')
});

/*
 * retrieve regions to add members to
 */
router.get('/get_regions', (req, res) => {
    data.merchant.retrieveRegions(req, res)
})

/*
 * retrieve all clients
 */
router.get('/client_list', (req, res) => {
    data.merchant.retrieveClients(req, res)
});

/*
 * receive and process collections
 */
router.post('/post_colls', (req, res) => {
    /*
     * handle and errors, post to database, and send feedback
     */
    data.merchant.submitColls(req, res)
});

router.get('/new_members', (req, res) => {
    /*
     * service new members request
     */
    data.merchant.retrieveNewMembers(req, res)
});

router.post('/member_info', (req, res) => {
    /*
     * specific member info request
     */
    data.merchant.retrieveSpecific(req, res)
})

router.post('/requestValueByRow', (req, res) => {
    /*
     * request row values
     */
    data.merchant.requestValueByRow(req, res)
})

router.get('/getdefaulters/:period/:q', (req, res) => {
    /*
     * obtain defaulters
     */
    data.merchant.retrieveDefaulters(req, res)
});

// EXPOSE ROUTER TO THE SERVER
module.exports = router;