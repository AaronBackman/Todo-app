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

// changed to not include nested objects and from object to an array
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
const tableName = 'todoitem';

// gets todoitems from the database and sends back in json format
router.get('/', (request, response, next) => {
  getConnection((error, connection) => {
    if (error) console.log('get connection error', error);

    const createTable = `CREATE TABLE IF NOT EXISTS ${tableName} (
      title VARCHAR(255),
      date VARCHAR(255),
      priorityname VARCHAR(255),
      priorityvalue INT(1),
      iscompleted INT(1),
      id INT(255) PRIMARY KEY
      )`;

    connection.query(createTable, (err, result) => {
      if (error) console.log('get query error', error);
    });

    const sqlQuery = `SELECT * FROM ${tableName}`;

    connection.query(sqlQuery, (error, result, fields) => {
      if (error) console.log('get query error', error);

      response.json({todoItems: toClientFormat(result)});
    });

    connection.release();
  });
});

// gets a todoitem in json  and saves it into the database
router.post('/', (request, response, next) => {
  getConnection((error, connection) => {
    if (error) console.log('post connection error', error);

    const todoItem = request.body;
    const formatedTodoItem = toServerFormat(todoItem);
    const sqlQuery = `INSERT INTO ${tableName} 
                        (
                          title, date, priorityname, priorityvalue, iscompleted, id
                        )
                        VALUES
                        (
                          ?, ?, ?, ?, ?, ?
                        )`;


    connection.query(sqlQuery, formatedTodoItem, error => {
      if (error) console.log('post query error', error);
    });

    connection.release();
  });

  response.end();
});

// gets a todoitem in json and updates the matching todoitem in the database
router.put('/:id', (request, response) => {
  getConnection((error, connection) => {
    if (error) console.log('put connection error', error);

    const todoItem = request.body;

    // should technically be the same as todoItem.id
    const id =request.params.id;

    const sqlQuery = `UPDATE ${tableName}
                      SET title = '${todoItem.title}',
                        date = '${todoItem.date}',
                        priorityname = '${todoItem.priority.name}',
                        priorityvalue = '${todoItem.priority.value}',
                        iscompleted = '${todoItem.isCompleted ? 1: 0}'
                      WHERE id = '${id}'`;

    connection.query(sqlQuery, (error, result) => {
      if (error) console.log('put query error', error);
    });

    connection.release();
  });

  response.end();
});

// gets a todoitem in json and updates the matching todoitem in the database
router.delete('/:id', (request, response) => {
  getConnection((error, connection) => {
    if (error) console.log('delete connection error', error);

    const id =request.params.id;
    const sqlQuery = `DELETE FROM ${tableName} WHERE id = ${id}`;

    connection.query(sqlQuery, (error, result) => {
      if (error) console.log('delete query error', error);
    });

    connection.release();
  });

  response.end();
});

module.exports = router;