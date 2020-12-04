const mysql = require('mysql');
const config = require('../config.js');

const mysqlUsername = config.username;
const mysqlPassword = config.userPassword;
const databaseName = config.databaseName;
const hostname = config.hostname;

const pool = mysql.createPool({
  connectionLimit: 3,
  host: hostname,
  user: 'root',
  password: mysqlPassword,
  database: databaseName,
});

const getConnection = (callback) => {
  pool.getConnection((error, connection) => {
    callback(error, connection);
  });
};

module.exports.getConnection = getConnection;
