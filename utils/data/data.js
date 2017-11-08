/*
 * response to data requests will be handled here
 */
const fs = require('fs');
const database = require('../database/dbconfig');
const today = parseInt((new Date().getDay() == 0) ? 7 : new Date().getDay());
/**
 * retrieves all clients/members and sends the response as html
 */
exports.retrieveClients = (req, res) => {
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
};

/**
 * submit collections to database,
 * future -> allow only one instance of entering collections,
 * or client side validation : 
 * ****allow data entry between specific period of time******
 * for accuracy and integrity
 */
exports.submitColls = (req, res) => {
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
                            let sql = `update collections set cl_amount= ${curr_amount} where cl_phone= ${database.mysql.escape(req.body[i].cl_phone)}`;
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
};

/**
 * retrieves regions to be used,
 * when entering new members/clients to database
 */
exports.retrieveRegions = (req, res) => {
    database.conn.query(`select * from regions`, (err, results) => {
        if (err) throw new Error(err);
        res.end(JSON.stringify(results));
    })
};

/**
 * retrieves new members, which have been added/joined,
 * in the past one week
 */
exports.retrieveNewMembers = (req, res) => {
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
};

/**
 * retrieves specific members that match the search
 * criteria
 */
exports.retrieveSpecific = (req, res) => {
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
};

/**
 * retrieve row values by their corresponding phone numbers as data-id
 */
exports.requestValueByRow = (req, res) => {
    // check collections for specific client and populate the input

    database.conn.query(`SELECT cl_phone,COALESCE(cl_amount,0) AS cl_amount FROM collections WHERE cl_phone=${req.body.phone} AND DATE(server_date) > DATE_SUB(CURDATE(), INTERVAL ${today} DAY) AND DATE(server_date) < CURDATE() ORDER BY server_date ASC`, (err, results) => {
        if (err) console.log(err);
        res.end(JSON.stringify(results));
    });
}

/**
 * retrieve defaulters
 */
exports.retrieveDefaulters = (req, res) => {
    console.log(req.params)
    database.conn.query(`SELECT first_name,last_name,id_number,phone,time(server_date) as server_date,count(cl_amount) as cl_amount  FROM
    (SELECT clients.first_name,clients.last_name,clients.id_number,clients.phone,cl.cl_amount,time(cl.server_date) as server_date FROM collections AS cl
        RIGHT JOIN clients ON clients.id = cl.cl_code
        WHERE phone like '%${(req.params.q).substr(1,15)}%' or id_number like '%${req.params.q}%') AS c 
        GROUP BY first_name,last_name,id_number,phone,server_date
        `, (err, results) => {
        if (err) console.log(err);

        res.end(JSON.stringify(results));
    });

}