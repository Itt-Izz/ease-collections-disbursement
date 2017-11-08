const mysql = require('mysql');
/**
 * @param: host - host address of the database
 * @param: user - the username associated with the database 
 * @param: password - ''
 */
let config = {
    connectionLimit: 20,
    host: '127.0.0.1',
    user: 'root',
    password: '25812345Dan',
    database: 'county_ps_'
}

let dbInit = () => {
    /**
     *@param: config - this is the config object created above with database credentials
     *@param: county_ps_ - the database to connect to
     */
    let conn = mysql.createPool(config)

    conn.getConnection((err, connection) => {
        if (err) throw new Error(err);
    })
    return conn;
};

/**
 * expose the conn object to interact with the database from
 * other scripts, {query, end, destroy....}
 */
exports.conn = dbInit();
exports.mysql = mysql;