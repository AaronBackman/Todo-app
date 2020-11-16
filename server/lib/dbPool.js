const mysql = require('mysql');
const config = require('../config.js');

const mysqlRootPassword = config.rootPassword;
const { databaseName } = config;

const pool = mysql.createPool({
  connectionLimit: 3,
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
