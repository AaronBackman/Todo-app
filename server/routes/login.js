const express = require('express');

const router = express.Router();

const { getConnection } = require('../lib/dbPool.js');

const userTableName = 'userTable';

router.get('/:username/:password', (request, response) => {
  const { params } = request;

  getConnection((error, connection) => {
    if (error) console.log('login error', error);

    const query = `SELECT * FROM ${userTableName}
                   WHERE username = '${params.username}' AND
                     password = '${params.password}'`;

    connection.query(query, (err, result) => {
      if (err) console.log('login get error', err);

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
  const { params } = request;
  const { username } = params;
  const { password } = params;

  getConnection((error, connection) => {
    if (error) console.log('create login error', error);

    const checkIfUserExists = `SELECT * FROM ${userTableName}
                               WHERE username = '${username}'`;

    connection.query(checkIfUserExists, (err, result) => {
      if (err) console.log('sign in check if exists error', err);

      if (result.length === 0) {
        // new credential created
        const addUser = `INSERT INTO ${userTableName} (username, password)
                          VALUES ('${username}', '${password}')`;

        connection.query(addUser, (innerErr) => {
          if (innerErr) console.log('sign in post error', innerErr);

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
