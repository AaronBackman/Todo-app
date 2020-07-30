const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const config = require('../config.js');

const mysqlRootPassword = config.rootPassword;
const mysqlUsername = config.username;
const mysqlUserPassword = config.userPassword;

// call to initialize the todoitem database
function initDb() {
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: mysqlRootPassword,
  });
   
  con.connect((err) => {
    if (err) throw err;
  
    const createDb = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  
    con.query(createDb, (err, result) => {
      if (err) throw err;
    });
  
    con.end(err => {
      if (err) throw err;
    })
  });
}

const databaseName = 'todoDb';

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: mysqlRootPassword,
  database: databaseName
});

con.connect((err) => {
  if (err) throw err;

  const tableName = 'todoitem';

  const createTable = `CREATE TABLE IF NOT EXISTS ${tableName} (
                       title VARCHAR(255), date DATE,
                       priorityname VARCHAR(255),
                       priorityvalue INT(1),
                       iscompleted BOOLEAN,
                       id INT(255) PRIMARY KEY
                       )`;

  con.query(createTable, (err, result) => {
    if (err) throw err;
  });

  const sqlQuery = `SELECT * FROM ${tableName}`;

  con.query(sqlQuery, (err, result, fields) => {
    if (err) throw err;

    console.log(result);
  });
});



const todoItems = [
  {
    "title": "playing chess",
    "date": "2020-07-20",
    "priority": {
      "name": "medium",
      "value": 2
    },
    "isCompleted": true,
    "id": 1
  },
  {
    "title": "eating",
    "date": "2020-07-28",
    "priority": {
      "name": "low",
      "value": 1
    },
    "isCompleted": false,
    "id": 2
  },
  {
    "title": "googling",
    "date": "2020-07-31",
    "priority": {
      "name": "low",
      "value": 1
    },
    "isCompleted": false,
    "id": 3
  },
  {
    "title": "making breakfast",
    "date": "2020-07-02",
    "priority": {
      "name": "low",
      "value": 1
    },
    "isCompleted": false,
    "id": 4
  }
];

router.get('/', (req, res, next) => {
  res.json(todoItems);
});

module.exports = router;