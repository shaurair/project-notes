const localDB = require('./conn-local-sql');
const rdsDB = require('./conn-aws-RDS');

const selectedDB = localDB;

module.exports = {
    databasePool:selectedDB.databasePool,
    ErrorProcess:selectedDB.ErrorProcess
}