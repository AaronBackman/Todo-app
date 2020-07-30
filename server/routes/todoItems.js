const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const config = require('../config.js');

const mysqlRootPassword = config.rootPassword;
const mysqlUsername = config.username;
const mysqlUserPassword = config.userPassword;

initDb();

// call to initialize the todoitem database
function initDb() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: mysqlRootPassword,
  });
   
  connection.connect((err) => {
    if (err) throw err;
  
    const createDb = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  
    connection.query(createDb, (err, result) => {
      if (err) throw err;
    });
  
    connection.end(err => {
      if (err) throw err;
    })
  });
}

const databaseName = 'todoDb';

const getConnection = () => mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: mysqlRootPassword,
  database: databaseName
});

const tableName = 'todoitem';

// gets todoitems from the database and sends back in json format
router.get('/', (request, response, next) => {
  function toClientFormat(todoItems) {
    if (!todoItems[0]) {
      return [{}];
    }

    const todoItem = todoItems[0];

    return todoItems.map((todoItem) => ({
      title: todoItem.title,
      date: todoItem.date,
      priority: {
        name: todoItem.priorityname,
        value: todoItem.priorityvalue,
      },
      isCompleted: todoItem.iscompleted === 1 ? true: false,
      id: todoItem.id,
    }));
  }

  const connection = getConnection();

  connection.connect(err => {
    if (err) throw err;
  
    const createTable = `CREATE TABLE IF NOT EXISTS ${tableName} (
                         title VARCHAR(255),
                         date VARCHAR(255),
                         priorityname VARCHAR(255),
                         priorityvalue INT(1),
                         iscompleted INT(1),
                         id INT(255) PRIMARY KEY
                         )`;
  
    connection.query(createTable, (err, result) => {
      if (err) throw err;
    });
  
    const sqlQuery = `SELECT * FROM ${tableName}`;
  
    connection.query(sqlQuery, (err, result, fields) => {
      if (err) throw err;
  
      response.json({todoItems: toClientFormat(result)});
    });

    connection.end();
  });
});

// gets a todoitem in json format and saves it into the database
router.post('/', (request, response, next) => {
  // changed to not include nested objects
  function toServerFormat(todoItem) {
    return [
      todoItem.title,
      todoItem.date,
      todoItem.priority.name,
      todoItem.priority.value,
      todoItem.isCompleted ? 1: 0,
      todoItem.id,
  ];
  }

  const connection = getConnection();

  connection.connect(err => {
    if (err) throw err;

    const todoItem = request.body;

    const sqlQuery = `INSERT INTO ${tableName} 
                        (
                          title, date, priorityname, priorityvalue, iscompleted, id
                        )
                        VALUES
                        (
                          ?, ?, ?, ?, ?, ?
                        )`;

    const formatedTodoItem = toServerFormat(todoItem);

    connection.query(sqlQuery, formatedTodoItem, err => {
      if (err) throw err;
    });
  });

  response.end();
});

module.exports = router;