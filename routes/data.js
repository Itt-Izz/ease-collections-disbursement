const express = require('express');
const router = express.Router();


// bring the data model
let data = require('../utils/data/data')

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
})

router.get('/get_regions', (req, res) => {
    /*
     * retrieve regions to add members to
     */
    data.merchant.retrieveRegions(req, res)
})


router.get('/client_list', (req, res) => {
    /*
     * retrieve all clients
     */
    data.merchant.retrieveClients(req, res)
})

router.post('/post_colls', (req, res) => {
    /*
     * handle errors, post to database, and send feedback
     */
    data.merchant.submitColls(req, res)
})

router.get('/new_members', (req, res) => {
    /*
     * service new members request
     */
    data.merchant.retrieveNewMembers(req, res)
})

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
})

router.get('/merchantCollections', (req, res) => {
    /*
     * get data specific to req.ip for previous 30 days
     */
    data.merchant.retrievePreviousMonthCol(req, res)
})

router.post('/qRequestChartData', (req, res) => {
    /*
     * get spcific client data to graph
     */
    data.merchant.retrieveClientData(req, res)
})



// EXPOSE ROUTER TO THE SERVER
module.exports = router