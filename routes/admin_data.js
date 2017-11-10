/**
 * 
 * all admin data requests will be handled through this route
 */
const express = require('express');
const router = express.Router();

router.get('/reports', (req, res) => {
    res.render('admin/reports.html');
});


module.exports = router;