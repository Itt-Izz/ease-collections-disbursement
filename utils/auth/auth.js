// merchant authentication
const database = require('../database/dbconfig')
const crypto = require('crypto')
const sms = require('../includes/sms')
const bcrypt = require('bcrypt')

/**
 * 
 * `expose all the functions within this module to the other files requiring this files`
 * @module anonymous 
 */
module.exports = {

    /**
     * `merchant login request`
     * @param {Request} req request object
     * @param {Response} res response object
     * @returns {*}
     */
    loginRequest: (req, res) => {
        database.conn.query(`select * from merchants where merch_code=${database.mysql.escape(req.body.merchant_code)}`, (err, results) => {
            if (err) throw new Error(err)
                /*
                 * compare passwords and send back authorization status
                 */
            if (results.length > 0) {
                if (bcrypt.compareSync(req.body.password, results[0].merch_password)) {

                    // authorized, set session

                    req.session.merchant = {
                        merchant_name: results[0].merch_fname,
                        merchant_code: results[0].merch_code,
                        merch_phone: results[0].merch_phone
                    }
                    console.log(req.session)
                    res.end(JSON.stringify({ message: 'authenticated' }))
                } else {

                    // denied access
                    res.end(JSON.stringify({ message: 'unauthorized' }))
                }
            } else {
                res.end(JSON.stringify({ message: 'empty_query' }))
            }
        })
    },

    /**
     *  `register client`
     * @param {Request} req request object
     * @param {Response} res response object
     * @returns {*}
     */
    registerClient: (req, res) => {
        let auth_code = ((new Date() % 7e8).toString(36)).toUpperCase()
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
    },
    /**
     * `resend auth code if client not receive`
     * @param {Request} req request object
     * @param {Response} res response object
     */
    resendAuthCode: (req, res) => {
        database.conn.query(`select auth_code from clients where phone= +254${(req.body.phone).slice(-9)}`, (err, results) => {
            if (err) throw new Error(err)
            let auth_c = results[0].auth_code
            let phone_n = `+254${(req.body.phone).slice(-9)}`
                /*
                 * call the api to send auth code
                 */
            sms.sendMessage(phone_n, 'Confirmation code: ', (response) => {
                // check the response code
                if (response.code == 'EAI_AGAIN') res.end(JSON.stringify({ message: 'network_problem' }))
                res.end(JSON.stringify({ message: 'success_sent' }))
            })
        })
    },
    /**
     * `verify client access to their mobile phone` 
     * updates database status for authorization and authentication
     * @param {Request} req request body
     * @param {Response} res response object
     */
    verifyClientPhoneAccess: (req, res) => {
        // take the code and update database status
        database.conn.query(`update clients set auth_status=1 where `, (err, result) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify({ message: 'authorized' }))
        })
    }

}