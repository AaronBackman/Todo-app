const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const config = require('../config.js');
const getConnection = require('../lib/dbPool.js').getConnection;

// call to initialize the todoitem database
function initDb() {
  const initialConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: mysqlRootPassword,
  });
   
  initialConnection.connect((error) => {
    if (error) console.log('create db connect error', error);
  
    const createDb = `CREATE DATABASE IF NOT EXISTS ${databaseName}`;
  
    initialConnection.query(createDb, (error, result) => {
      if (error) console.log('create db query error', error);
    });
  
    initialConnection.end();
  });
}

// creates the tables used by the database
function initTables() {
  getConnection((error, connection) => {
    if (error) console.log('get connection error', error);

    // creates table for todoitems
    const createTodoTable = `CREATE TABLE IF NOT EXISTS ${todoTableName} (
      title VARCHAR(255),
      date VARCHAR(255),
      priorityname VARCHAR(255),
      priorityvalue INT(1),
      iscompleted INT(1),
      id INT(255),
      username VARCHAR(255),
      PRIMARY KEY (id, username)
      )`;

    connection.query(createTodoTable, (error, result) => {
      if (error) console.log('create todotable error', error);
    });

    // creates table for username-password combinations
    const createUserTable = `CREATE TABLE IF NOT EXISTS ${userTableName} (
      username VARCHAR(255) PRIMARY KEY,
      password VARCHAR(255)
      )`;

    connection.query(createUserTable, (error, result) => {
      if (error) console.log('create user table error', error);
    });

    connection.release();
  });
}

// changed to not include nested objects and from object to an array
function toServerFormat(todoItem, username) {
  return [
    todoItem.title,
    todoItem.date,
    todoItem.priority.name,
    todoItem.priority.value,
    todoItem.isCompleted ? 1: 0,
    todoItem.id,
    username,
  ];
}

function toClientFormat(todoItems) {
  if (!todoItems[0]) {
    return [{}];
  }

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

const mysqlRootPassword = config.rootPassword;
const databaseName = config.databaseName;
const todoTableName = 'todoTable';
const userTableName = 'userTable';

// gets todoitems from the database and sends back in json format
router.get('/:username/:password', authenticate, (request, response) => {
  getConnection((error, connection) => {
    if (error) console.log('get connection error', error);

    const params = request.params;
    const username = params.username;
    const password = params.password;

    const sqlQuery = `SELECT * FROM ${todoTableName} WHERE username = '${username}'`;

    connection.query(sqlQuery, (error, result, fields) => {
      if (error) console.log('get query error', error);

      response.json({todoItems: toClientFormat(result)});
    });

    connection.release();
  });
});

// gets a todoitem in json  and saves it into the database
router.post('/:username/:password', authenticate, (request, response) => {
  getConnection((error, connection) => {
    if (error) console.log('post connection error', error);

    const params = request.params;
    const username = params.username;
    const password = params.password;

    const todoItem = request.body;
    const formatedTodoItem = toServerFormat(todoItem, username);
    const sqlQuery = `INSERT INTO ${todoTableName} 
                        (
                          title, date, priorityname, priorityvalue, iscompleted, id, username
                        )
                        VALUES
                        (
                          ?, ?, ?, ?, ?, ?, ?
                        )`;


    connection.query(sqlQuery, formatedTodoItem, error => {
      if (error) console.log('post query error', error);
    });

    connection.release();
  });

  response.end();
});

// gets a todoitem in json and updates the matching todoitem in the database
router.put('/:username/:password/:id', authenticate, (request, response) => {
  getConnection((error, connection) => {
    if (error) console.log('put connection error', error);

    const params = request.params;
    const username = params.username;
    const password = params.password;

    const todoItem = request.body;

    // should technically be the same as todoItem.id
    const id =request.params.id;

    const sqlQuery = `UPDATE ${todoTableName}
                      SET title = '${todoItem.title}',
                        date = '${todoItem.date}',
                        priorityname = '${todoItem.priority.name}',
                        priorityvalue = '${todoItem.priority.value}',
                        iscompleted = '${todoItem.isCompleted ? 1: 0}'
                      WHERE id = '${id}' AND username = '${username}'`;

    connection.query(sqlQuery, (error, result) => {
      if (error) console.log('put query error', error);
    });

    connection.release();
  });

  response.end();
});

// gets a todoitem in json and updates the matching todoitem in the database
router.delete('/:username/:password/:id', authenticate, (request, response) => {
  getConnection((error, connection) => {
    if (error) console.log('delete connection error', error);

    const params = request.params;
    const username = params.username;
    const password = params.password;
    const id = params.id;

    const sqlQuery = `DELETE FROM ${todoTableName}
                      WHERE id = '${id}'
                        AND USERNAME = '${username}'`;

    connection.query(sqlQuery, (error, result) => {
      if (error) console.log('delete query error', error);
    });

    connection.release();
  });

  response.end();
});

// middleware to check the request credentials
function authenticate(request, response, next) {
  getConnection((error, connection) => {
    if (error) console.log('authentication connection error', error);

    const params = request.params;
    const username = params.username;
    const password = params.password;

    const sql = `SELECT * FROM ${userTableName}
                 WHERE username = '${username}' AND password = '${password}'`;

    connection.query(sql, (error, result) => {
      if (error) console.log('authentication query error', error);

      if (result.length === 0) {
        console.log(401);
        response.status(401).send();
        // stops going to the next middleware
        next('route');
      } else {
        next();
      }
    });

    console.log('release');
  });
}

module.exports = router;