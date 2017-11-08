// merchant authentication
const express = require('express');
const router = express.Router();
const database = require('../database/dbconfig');
const crypto = require('crypto');

exports.login = (req, res) => {
    let merchant_code = req.body.merchant_code;
    let password = req.body.password;

    res.render('dashboard.html');
};

exports.register = (req, res) => {
    let auth_code = ((new Date() % 7e8).toString(36)).toUpperCase();
    let cred = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        region_code: 1,
        phone: `+254${(req.body.phone).slice(-9)}`,
        id_number: req.body.id_number,
        email: req.body.email,
        auth_code: auth_code,
        auth_status: '0'
    };

    // check if user exists
    database.conn.query(`select * from clients where phone= +254${(req.body.phone).slice(-9)} or id_number= ${req.body.id_number}`, (err, result) => {
        if (err) throw new Error(err);
        if (result.length > 0) {
            // client in records
            res.end(JSON.stringify({ 'message': 'in_records' }));
        } else {
            // create user
            database.conn.query('insert into clients set ? ', cred, (err, rows) => {
                if (err) throw new Error(err);
                /*
                 * send auth code to phone (req.body.phone)
                 */
                res.end(JSON.stringify({ 'message': 'registered' }));
            })
        }
    });
};

exports.registerClerk = (req, res) => {
    let clerk_code = ((new Date() % 7e8).toString(36)).toUpperCase();
    let clerk_pass = (new Date() % 7e9).toString(36);
    /*
     * register clerk
     */

    res.end();
}

exports.res_auth = (req, res) => {
    database.conn.query(`select auth_code from clients where phone= +254${(req.body.phone).slice(-9)}`, (err, results) => {
        if (err) throw new Error(err);
        let auth_c = results[0].auth_code;
        let phone_n = `+254${(req.body.phone).slice(-9)}`;
        /*
         * call the api to send auth code
         */


        res.end();
    });

}