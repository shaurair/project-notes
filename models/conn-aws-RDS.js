require('dotenv').config();
const util = require('util');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.RDS_HOST,
    port: process.env.RDS_PORT,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB,
    charset: 'UTF8MB4_BIN',
    waitForConnections: true,
    connectionLimit: 5
})

pool.getConnection((err, conn) => {
    if(err) throw err;
})
pool.query = util.promisify(pool.query);

function ErrorProcess(error) {
	console.error(error);
	return  {
		data: {
			message: 'Something wrong while operating database, please refresh and try again',
		},
		statusCode: 500
	}
}

module.exports = {
    databasePool:pool,
    ErrorProcess
}