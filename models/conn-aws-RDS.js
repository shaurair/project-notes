require('dotenv').config();
const util = require('util');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB,
    waitForConnections: true,
    connectionLimit: 5
})

pool.getConnection((err, conn) => {
    if(err) throw err;
})
pool.query = util.promisify(pool.query);

module.exports = {
    databasePool:pool
}