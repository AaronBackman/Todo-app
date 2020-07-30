const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const config = require('../config.js');

const mysqlRootPassword = config.rootPassword;
const mysqlUsername = config.username;
const mysqlUserPassword = config.userPassword;

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: mysqlRootPassword,
});

console.log(config);

con.connect((err) => {
  if (err) throw err;
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

/* GET home page. */
router.get('/', (req, res, next) => {
  res.json(todoItems);
});

module.exports = router;