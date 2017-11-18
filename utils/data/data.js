/*
 * response to data requests will be handled here
 */
const fs = require('fs');
const database = require('../database/dbconfig');
const today = parseInt((new Date().getDay() == 0) ? 7 : new Date().getDay());

exports.merchant = {
    /**
     * retrieve defaulters
     */
    retrieveDefaulters: (req, res) => {

        database.conn.query(`SELECT first_name,last_name,id_number,phone,time(server_date) as server_date,count(cl_amount) as cl_amount  FROM
        (SELECT clients.first_name,clients.last_name,clients.id_number,clients.phone,cl.cl_amount,time(cl.server_date) as server_date FROM collections AS cl
            RIGHT JOIN clients ON clients.id = cl.cl_code
            WHERE phone like '%${(req.params.q).substr(1,15)}%' or id_number like '%${req.params.q}%') AS c
            GROUP BY first_name,last_name,id_number,phone,server_date
            `, (err, results) => {
            if (err) console.log(err);

            res.end(JSON.stringify(results));
        });

    },
    /**
     * retrieve row values by their corresponding phone numbers as data-id
     */
    requestValueByRow: (req, res) => {
        // check collections for specific client and populate the input

        database.conn.query(`SELECT cl_phone,COALESCE(cl_amount,0) AS cl_amount FROM collections WHERE cl_phone=${req.body.phone} AND DATE(server_date) > DATE_SUB(CURDATE(), INTERVAL ${today} DAY) AND DATE(server_date) < CURDATE() ORDER BY server_date ASC`, (err, results) => {
            if (err) console.log(err);
            res.end(JSON.stringify(results));
        });
    },

    /**
     * retrieves specific members that match the search
     * criteria
     */
    retrieveSpecific: (req, res) => {
        database.conn.query(`select * from clients where phone like '%${(req.body.q).substr(1,15)}%' or id_number like '%${req.body.q}%' or first_name like '%${req.body.q}%'`, (err, results) => {
            if (err) throw new Error(err);
            let members = ''
            for (let i = 0; i < results.length; i++) {
                members += `
                <div class="card col-lg-4 col-md-4 p-0">
                <div class="card-body">
                    <div class="card-title text-info">${results[i].first_name} ${results[i].last_name}</div>
                    <div><span class="mdi mdi-phone-in-talk"></span> 0${(results[i].phone).slice(-9)}</div>
                    <div><span class="mdi mdi-approval"></span> ${results[i].id_number}</div>
                    <div>
                        <span class="btn btn-sm btn-outline-info">
                        <span class="mdi mdi-bell-ring"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-danger">
                        <span class="mdi mdi-bank"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-dark">
                        <span class="mdi mdi-av-timer"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-primary">
                        <span class="mdi mdi-twitch"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-success">
                        <span class="mdi mdi-clock-alert"></span>
                        </span>
                    </div>
                </div>
                </div>
                `;
            }
            res.set('Content-Type', 'text/html');
            res.status(200).send(members);
        })
    },
    /**
     * retrieves new members, which have been added/joined,
     * in the past one week
     */
    retrieveNewMembers: (req, res) => {
        database.conn.query(`select * from clients where date_joined >= date_add(curdate(),interval -7 day)`, (err, results) => {
            if (err) throw new Error(err);
            let members = ''
            for (let i = 0; i < results.length; i++) {
                members += `
                <div class="card col-lg-4 col-md-4 p-0">
                <div class="card-body">
                    <div class="card-title text-info">${results[i].first_name} ${results[i].last_name}</div>
                    <div><span class="mdi mdi-phone-in-talk"></span> 0${(results[i].phone).slice(-9)}</div>
                    <div><span class="mdi mdi-approval"></span> ${results[i].id_number}</div>
                    <div>
                        <span class="btn btn-sm btn-outline-info">
                        <span class="mdi mdi-bell-ring"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-danger">
                        <span class="mdi mdi-bank"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-dark">
                        <span class="mdi mdi-av-timer"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-primary">
                        <span class="mdi mdi-twitch"></span>
                        </span>
                        <span class="btn btn-sm btn-outline-success">
                        <span class="mdi mdi-clock-alert"></span>
                        </span>
                    </div>
                </div>
                </div>
                `;
            }
            res.set('Content-Type', 'text/html');
            res.status(200).send(members);
        })
    },
    /**
     * retrieves regions to be used,
     * when entering new members/clients to database
     */
    retrieveRegions: (req, res) => {
        database.conn.query(`select * from regions`, (err, results) => {
            if (err) throw new Error(err);
            res.end(JSON.stringify(results));
        })
    },
    /**
     * submit collections to database,
     * future -> allow only one instance of entering collections,
     * or client side validation :
     * **allow data entry between specific period of time**
     * for accuracy and integrity
     */
    submitColls: (req, res) => {
        database.conn.query(`select * from merchants where merch_code = ${database.mysql.escape(req.body[0])}`, (err, results) => {
            if (err) throw new Error(err);
            if (results.length > 0) {

                for (let i = 1; i < req.body.length; i++) {
                    // check if todays collections for i client exist, update if true, else make an insert
                    database.conn.query(`select * from collections where cl_phone= ${database.mysql.escape(req.body[i].cl_phone)} and server_date= CURDATE()`, (er, rows) => {
                        if (er) throw new Error(er);
                        if (rows.length > 0) {
                            // pick amount, sum with incoming amount and update database
                            for (let j = 0; j < rows.length; j++) {
                                let curr_amount = parseFloat(rows[j].cl_amount) + parseFloat(req.body[i].cl_amount);
                                let sql = `update collections set cl_amount= ${curr_amount} where cl_phone= ${database.mysql.escape(req.body[i].cl_phone)} and cl_merch_id = ${database.mysql.escape(req.body[0])}`;
                                // update collection
                                database.conn.query(sql, (errr, updRes) => {
                                    if (errr) throw new Error(errr);
                                });
                            }

                        } else {
                            // do a CLEAN AND FRESH insert
                            database.conn.query(`insert into collections set ?`, req.body[i], (errrr, insRes) => {
                                if (errrr) throw new Error(errrr);
                            })
                        }
                    })
                }
                res.end(JSON.stringify({ 'message': 'verified' }));
            } else {
                /*
                 * WRONG MERCHANT CODE GIVEN
                 */
                res.end(JSON.stringify({ 'message': 'wrong_code' }));
            }
        })
    },
    /**
     * retrieves all clients/members and sends the response as html
     */
    retrieveClients: (req, res) => {
        database.conn.query(`select * from clients`, (err, results) => {
            if (err) throw new Error(err);
            let rows = '';
            for (let i = 0; i < results.length; i++) {
                rows += `
                <tr data-id='${results[i].phone}' data-name='${results[i].first_name} ${results[i].last_name}' data-rep='${results[i].id}'>
                    <td>
                        <label class="custom-control custom-checkbox">
                        <input class="custom-control-input" type="checkbox" value="">
                        <span class="custom-control-indicator"></span>
                        <span class="custom-control-description">${results[i].id}</span>
                        </label>
                    </td>
                    <td>${results[i].first_name}</td>
                    <td>0${results[i].phone.slice(-9)}</td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    <td><input class='form-control form-control-sm' type='text' name='data_input'/></td>
                    </tr>
            `;
            }
            res.set('Content-Type', 'text/html');
            res.status(200).send(rows);
        })
    }
};

// admin data handler
exports.admin = {
    /**
     * retrieve notifications, a count, or specific notification as per the request
     */
    retrieveNotifs: (req, res) => {
        if (req.params.type == 'count') {
            // count notifs
            database.conn.query(`select notif_type, count(notif_type) as count from notifs where status='0' group by(notif_type)`, (err, results) => {
                if (err) throw new Error(err)
                res.end(JSON.stringify(results));
            });
        }
        if (req.params.type == 'error') {
            // retrieve error messages
        }
        if (req.params.type == 'help') {
            // retrieve messages of type help
        }
    },
    /**
     * retrieve today's collections count by sub-regions
     */
    retrieveTodayColls: (req, res) => {
        database.conn.query(`
                        SELECT
                        SUM(c.cl_amount) AS amount,
                        DATE(c.server_date) AS col_date,
                        r.region_name
                    FROM
                        collections c
                            INNER JOIN
                        merchants m ON c.cl_merch_id = m.merch_code
                            INNER JOIN
                        regions r ON m.region_code = r.id
                    WHERE
                        c.server_date = CURDATE()
                    GROUP BY region_name , col_date
            `, (err, results) => {
            if (err) throw new Error(err);
            // send back results
            res.end(JSON.stringify(results));
        });
    },
    /**
     * retrive collections count by selected region or requested area
     */
    retrieveByRegion: (req, res) => {
        if (req.params.region == 'regions') {
            database.conn.query(`
                        SELECT
                        SUM(c.cl_amount) AS amount,
                        DATE(c.server_date) AS col_date,
                        r.region_name
                        FROM
                        collections c
                            INNER JOIN
                        merchants m ON c.cl_merch_id = m.merch_code
                            INNER JOIN
                        regions r ON m.region_code = r.id
                        WHERE
                        c.server_date = CURDATE()
                        GROUP BY region_name , col_date
                    `, (err, results) => {
                if (err) throw new Error(err)
                res.end(JSON.stringify(results));
            })
        }
        if (req.params.region == 'subcounties') {
            database.conn.query(`
                        SELECT
                        SUM(c.cl_amount) AS amount,
                        DATE(c.server_date) AS col_date,
                        cn.constituency_name AS region_name
                    FROM
                        constituencies cn
                            INNER JOIN
                        regions r ON r.constituency_code = cn.id
                            INNER JOIN
                        merchants m ON m.region_code = r.id
                            INNER JOIN
                        collections c ON c.cl_merch_id = m.merch_code
                    WHERE
                        c.server_date = CURDATE()
                    GROUP BY constituency_name , col_date
            `, (err, results) => {
                if (err) throw new Error(err);

                res.end(JSON.stringify(results));
            })
        }
        if (req.params.region == 'county') {
            /*
             * will retrieve county data if need be, where there will be more than one county
             */
        }
    },

    /**
     * retrieves previous 30 days data,
     * for both collections and payment made from farmers request
     */
    retrievePreviousMonthCol: (req, res) => {
        database.conn.query(`
                    SELECT
                    DATE(server_time) date, SUM(cl_amount) amount
                FROM
                    collections
                WHERE
                    DATE(server_date) >= DATE_SUB(CURDATE(), INTERVAL 8 DAY)
                GROUP BY DATE(server_time)
        `, (err, results) => {
            if (err) throw new Error(err);
            res.end(JSON.stringify(results));
        })
    },

    /**
     * retrieves collection for the previous 12 months
     */
    retrievePreviousYear: (req, res) => {
        database.conn.query(`
                    SELECT
                    MONTH(server_time) month, SUM(cl_amount) amount
                FROM
                    collections
                WHERE
                    DATE(server_time) >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY MONTH(server_time)
        `, (err, results) => {
            if (err) throw new Error(err);

            res.end(JSON.stringify(results));

        });
    },

    /**
     * retrieves the total number of regions covered
     */
    retrieveRegTotal: (req, res) => {
        database.conn.query(`select count(constituency_name) number from constituencies`, (err, result) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(result));
        })
    },

    /**
     * retrieve the total number of subregions
     */
    retrieveSubRegions: (req, res) => {
        database.conn.query(`select count(region_name) number from regions`, (err, result) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(result));
        })
    },
    /**
     * highest productive region, for the previous 30 days from curdate()
     */
    retrieveHPRegion: (req, res) => {
        database.conn.query(`
                SELECT 
                SUM(c.cl_amount) amount, cn.constituency_name
            FROM
                constituencies cn
                    INNER JOIN
                regions r ON r.constituency_code = cn.id
                    INNER JOIN
                merchants m ON m.region_code = r.id
                    INNER JOIN
                collections c ON c.cl_merch_id = m.merch_code
            WHERE
                c.server_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY constituency_name
            ORDER BY amount DESC
            LIMIT 1
        `, (err, result) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(result));
        })
    },
    /**
     * retrieve the highest productive sub region, and the prodcution total amount
     * for the previous 30 days from curdate()
     */
    retrieveHRSubRegion: (req, res) => {
        database.conn.query(`
                    SELECT 
                    SUM(c.cl_amount) amount, r.region_name as constituency_name
                FROM
                    regions r
                        INNER JOIN
                    merchants m ON m.region_code = r.id
                        INNER JOIN
                    collections c ON c.cl_merch_id = m.merch_code
                WHERE
                    c.server_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                GROUP BY constituency_name
                ORDER BY amount DESC
                LIMIT 1
        `, (err, result) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(result));
        })
    },
    /**
     * retrieve all the counties in the region being considered,
     * returns the county_name and the id
     */
    retrieveCounties: (req, res) => {
        database.conn.query(`select * from county`, (err, results) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(results));
        })
    },
    /**
     * register regions
     */
    registerRegion: (req, res) => {
        let regionData = {
            constituency_name: req.body.reg_name,
            county_code: req.body.county_id
        }

        // check if record exists
        database.conn.query(`select * from constituencies where constituency_name=${database.mysql.escape(regionData.constituency_name)}`, (err, rows) => {
            if (err) throw new Error(err)
            if (rows.length > 0) {
                res.end(JSON.stringify({ 'message': 'region_exists' }));
            } else {
                database.conn.query(`insert into constituencies set ?`, regionData, (err, results) => {
                    if (err) throw new Error(err)
                    res.end(JSON.stringify({ 'message': 'success' }));
                })
            }
        })
    },
    /**
     * retrieven all the constituencies
     */
    retrieveAllRegions: (req, res) => {
        database.conn.query(`select * from constituencies`, (err, results) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(results));
        })
    },
    /**
     * register sub region
     */
    registerSUBRegion: (req, res) => {
        let regionData = {
            region_name: req.body.subreg_name,
            constituency_code: req.body.reg_id
        }

        // check if record exists
        database.conn.query(`select * from regions where region_name=${database.mysql.escape(regionData.region_name)}`, (err, rows) => {
            if (err) throw new Error(err)
            if (rows.length > 0) {
                res.end(JSON.stringify({ 'message': 'region_exists' }));
            } else {
                database.conn.query(`insert into regions set ?`, regionData, (err, results) => {
                    if (err) throw new Error(err)
                    res.end(JSON.stringify({ 'message': 'success' }));
                })
            }
        })
    },
    /**
     * retrieve todays collection totals and group by regions
     */
    retrieveTodayRefined: (req, res) => {
        database.conn.query(`
                SELECT 
                SUM(c.cl_amount) AS amount,
                r.region_name,
                m.merch_code,
                GROUP_CONCAT(CONCAT(TIME(c.server_time))
                    ORDER BY server_time DESC) time
            FROM
                collections c
                    LEFT JOIN
                merchants m ON c.cl_merch_id = m.merch_code
                    RIGHT JOIN
                regions r ON m.region_code = r.id
            WHERE
                c.server_date = CURDATE()
            GROUP BY region_name , merch_code
        `, (err, results) => {
            if (err) throw new Error(err)
            res.end(JSON.stringify(results));
        })
    }
};