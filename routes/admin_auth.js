/**
 * 
 * all admin authentication will be handled through this route
 */
const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
    res.render('admin/dashboard.html');
});


module.exports = router;