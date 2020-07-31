const config = require('../config.js');

const mysqlRootPassword = config.rootPassword;
const databaseName = config.databaseName;

const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: mysqlRootPassword,
  database: databaseName,
});

const getConnection = (callback) => {
  pool.getConnection((error, connection) => {
    callback(error, connection);
  });
};

module.exports.getConnection = getConnection;