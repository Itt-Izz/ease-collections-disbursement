const database = require('../../database/dbconfig')
const bcrypt = require('bcrypt')
const session = require('../../session')
const sms = require('../../includes/sms')

/**
 * 
 * top level database query function
 * @param {string} sql
 * @type {Object.<string | number>} opts
 * @param {Function} callback
 */
function queryDatabase(sql, opts, callback) {

    if (opts) {
        database.conn.query(sql, opts, (err, results) => {
            if (err) return callback(err)
            return callback(results)
        })
        return
    }
    database.conn.query(sql, (err, results) => {
        if (err) return callback(err)
        return callback(results)
    })
}

module.exports = {
    /**
     * 
     * check admin details
     * @param {Request} req
     * @param {Function} callback
     */
    checkAdminDetails: (req, callback) => {
        queryDatabase(`select * from admin`, '', (results) => {
            if (results.length > 0) return callback(JSON.stringify({
                message: 'admin_set'
            }))
            return callback(JSON.stringify({
                message: 'set_admin'
            }))
        })
    },
    /**
     * 
     * intiate admin details
     * @param {Request} req
     * @param {Function} callback
     */
    initiateAdmin: (req, callback) => {
        let admCode = ((new Date % 7e8).toString(36)).toUpperCase()
        let admPass = ((new Date % 6e9).toString(27)).toLowerCase()

        let cred = {
            code: admCode,
            password: bcrypt.hashSync(admPass, 10),
            phone: req.body.adminPhone,
            email: req.body.adminEmail
        }

        queryDatabase('insert into admin set ?', cred, (response) => {
            if (response.affectedRows == 1) {
                sms.sendMessage(cred.phone, `Admin code: ${cred.code} and Admin password: ${admPass}`, (smsstatus) => {
                    console.log(admPass)
                    if (smsstatus.code == 'EAI_AGAIN') {
                        queryDatabase('truncate admin', '', (e) => {
                            return callback(JSON.stringify({
                                message: 'network_problem'
                            }))
                        })
                        return
                    }
                    return callback(JSON.stringify({
                        message: 'successfull'
                    }))
                })
                return
            }
            return callback(JSON.stringify({
                message: 'failed'
            }))
        })

    },
    /**
     * authenticate through login
     * @param {Request} req
     * @param {Function} callback
     */
    requestAuthentication: (req, callback) => {
        let cred = {
            auth_code: req.body.auth_code,
            auth_pwd: req.body.auth_pwd
        }
        queryDatabase(`select * from admin where code = ${database.mysql.escape(cred.auth_code)}`, '', (result) => {
            if (result.length > 0) {
                if (bcrypt.compareSync(cred.auth_pwd, result[0].password)) {
                    // set sessions
                    session.init(req.ip, {
                        admin: {
                            code: result[0].code,
                            phone: result[0].phone,
                            email: result[0].email
                        }
                    })
                    return callback(JSON.stringify({ message: "authenticated" }))
                } else {
                    return callback(JSON.stringify({ message: "unauthorized" }))
                }
            }
            return callback(JSON.stringify({ message: "mismatch" }))
        })
    },
    /**
     * `register merchant, send merchant code and login password`
     * @param {Request} req
     * @param {Response} res
     */
    registerMerchant: (req, res) => {
        let pwdHash = ((new Date % 5e8).toString(36)).toUpperCase()
        let cred = {
            merch_fname: req.body.first_name,
            merch_lname: req.body.last_name,
            id_number: req.body.id_number,
            merch_phone: `+254${(req.body.phone).slice(-9)}`,
            merch_email: req.body.email,
            merch_code: ((new Date % 7e8).toString(36)).toUpperCase(),
            merch_secret: ((new Date * 3e3).toString(17)).toLowerCase(),
            merch_password: bcrypt.hashSync(pwdHash, 10),
            region_code: req.body.reg_id
        };

        database.conn.query(`select * from merchants where merch_phone=${database.mysql.escape(cred.merch_phone)} or merch_email=${database.mysql.escape(cred.merch_email)}`, (err, result) => {
            if (err) throw new Error(err)
            if (result.length > 0) {
                res.end(JSON.stringify({
                    'message': 'record_exists'
                }));
            } else {
                sms.sendMessage(cred.merch_phone, `Code: ${cred.merch_code}, Password:${pwdHash}`, (response) => {
                    if (response.code == 'EAI_AGAIN') {
                        res.end(JSON.stringify({
                            'message': 'network_problem'
                        }));
                    } else {
                        // sms api to send the password and the merch_code
                        database.conn.query(`insert into merchants set ?`, cred, (err, results) => {
                            if (err) throw new Error(err)
                            res.end(JSON.stringify({
                                'message': 'success'
                            }));
                        })
                    }
                });
            }
        })
    },
    /**
     * `recover merchant password`
     * @param {Request} req
     * @param {Response} res
     */
    recoverMerchantPwd: (req, res) => {
        let obj = JSON.parse(req.params.obj);
        // generate some other random password
        let pwd = ((new Date % 5e8).toString(36)).toUpperCase()
        let cred = {
            merch_password: bcrypt.hashSync(pwd, 10),
        }

        // check if this user exists
        database.conn.query(`select * from merchants where merch_phone=+254${(obj.phone).slice(-9)} and merch_code=${database.mysql.escape(obj.m_code)}`, (err, results) => {
            if (err) console.log(sql)
            if (results.length > 0) {
                // send sms and update database for the new password
                sms.sendMessage(obj.phone, `New password: ${pwd}`, (response) => {
                    console.log(response)
                    if (response.code == 'EAI_AGAIN') {
                        // network problem and message could not be sent
                        res.end(JSON.stringify({
                            message: "network_problem"
                        }))
                    } else {
                        /*
                         * do a database update and check the number of affectedRows
                         */
                        database.conn.query(`update merchants set merch_password=${database.mysql.escape(cred.merch_password)} where merch_code=${database.mysql.escape(obj.m_code)}`, (err, result) => {
                            if (err) throw new Error(err);
                            if (result.affectedRows == 1) {
                                // end operation
                                res.end(JSON.stringify({
                                    message: "success"
                                }))
                            } else {
                                res.end(JSON.stringify({
                                    message: "error"
                                }))
                            }
                        })
                    }
                })
            } else {
                res.end(JSON.stringify({
                    'message': 'not_exists'
                }))
            }
        })
    }
}