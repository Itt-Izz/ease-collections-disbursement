// merchant authentication
const database = require('../database/dbconfig')
const crypto = require('crypto')
const sms = require('../includes/sms')
const bcrypt = require('bcrypt')
const session = require('../session')

/**
 * 
 * `expose all the functions within this module to the other files requiring this files`
 * @module anonymous 
 */
module.exports = {

    /**
     * `merchant login request`
     * @param {Request} req request object
     * @param {Function} callback callback function
     * @returns {Function}
     */
    loginRequest: (req, callback) => {
        database.conn.query(`select * from merchants where merch_code=${database.mysql.escape(req.body.merchant_code)}`, (err, results) => {
            if (err) throw new Error(err)
                /*
                 * compare passwords and send back authorization status
                 */
            if (results.length > 0) {
                if (bcrypt.compareSync(req.body.password, results[0].merch_password)) {

                    // authorized, set session
                    session.init(req.ip, {
                        merchant: {
                            merchant_name: results[0].merch_fname,
                            merchant_code: results[0].merch_code,
                            merch_phone: results[0].merch_phone,
                            region_code: results[0].region_code
                        }
                    })

                    return callback(JSON.stringify({ message: 'authorized' }))
                } else {
                    // denied access
                    return callback(JSON.stringify({ message: 'unauthorized' }))
                }
            } else {
                return callback(JSON.stringify({ message: 'empty_query' }))
            }
        })
    },

    /**
     *  `register client`
     * @param {Request} req request object
     * @param {Function} callback callback function
     * @returns {Function}
     */
    registerClient: (req, callback) => {
        let auth_code = ((new Date() % 7e8).toString(36)).toUpperCase()
        let cred = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            region_code: req.body.region_code,
            phone: `+254${(req.body.phone).slice(-9)}`,
            id_number: req.body.id_number,
            email: req.body.email,
            auth_code: auth_code,
            auth_status: '0'
        }

        // check if user exists
        database.conn.query(`select * from clients where phone= +254${(req.body.phone).slice(-9)} or id_number= ${req.body.id_number}`, (err, result) => {
            if (err) throw new Error(err)
            if (result.length > 0) {
                // client in records
                return callback(JSON.stringify({ 'message': 'in_records' }))
            } else {
                // create client
                database.conn.query('insert into clients set ? ', cred, (err, rows) => {
                    if (err) throw new Error(err)

                    /*
                     * send auth code to phone (req.body.phone)
                     */
                    sms.sendMessage(cred.phone, `Confirmation code: ${cred.auth_code}`, (response) => {
                        // check the response code
                        if (response.code == 'EAI_AGAIN') {
                            return callback(JSON.stringify({ message: 'network_problem' }))
                        }
                        return callback(JSON.stringify({ message: 'registered' }))
                    })
                })
            }
        })
    },
    /**
     * `resend auth code if client not receive`
     * @param {Request} req request object
     * @param {Function} callback callback function
     * @returns {Function}
     */
    resendAuthCode: (req, callback) => {
        database.conn.query(`select auth_code from clients where phone= +254${(req.body.phone).slice(-9)}`, (err, results) => {
            if (err) throw new Error(err)
            let auth_c = results[0].auth_code
            let phone_n = `+254${(req.body.phone).slice(-9)}`

            /*
             * call the api to send auth code
             */
            sms.sendMessage(phone_n, `Confirmation code: ${auth_c}`, (response) => {
                // check the response code
                if (response.code == 'EAI_AGAIN') {
                    return callback(JSON.stringify({ message: 'network_problem' }))
                }
                return callback(JSON.stringify({ message: 'success_sent' }))
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