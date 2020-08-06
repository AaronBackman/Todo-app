const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const config = require('../config.js');
const getConnection = require('../lib/dbPool.js').getConnection;

const userTableName = 'userTable';

router.get('/:username/:password', (request, response) => {
  const params = request.params;
  
  getConnection((error, connection) => {
    if (error) console.log('login error', error);

    const query = `SELECT * FROM ${userTableName}
                   WHERE username = '${params.username}' AND
                     password = '${params.password}'`;

    connection.query(query, (error, result) => {
      if (error) console.log('login get error', error);

      if (result.length === 0) {
        response.status(401).send();
      } else {
        response.status(200).send();
      }
    });
    
    connection.release();
  });
});

router.post('/:username/:password', (request, response) => {
  const params = request.params;
  const username = params.username;
  const password = params.password;
  
  getConnection((error, connection) => {
    if (error) console.log('create login error', error);

    const checkIfUserExists = `SELECT * FROM ${userTableName}
                               WHERE username = '${username}'`;

    connection.query(checkIfUserExists, (error, result) => {
      if (error) console.log('sign in check if exists error', error);

      if (result.length === 0) {
        // new credential created
        const addUser = `INSERT INTO ${userTableName} (username, password)
                          VALUES ('${username}', '${password}')`;
  
        connection.query(addUser, error => {
          if (error) console.log('sign in post error', error);

          response.status(201).send();
        });
      } else {
        // no duplicate usernames allowed 
        response.status(403).send();
      }
    });
    
    connection.release();
  });
});

module.exports = router;