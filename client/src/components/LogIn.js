import React, { useState } from 'react';
import LogInForm from './LogInForm.js';

function LogIn(props) {
  // checks with the server if the credentials are correct and logs in
  async function handleLogIn(e) {
    function sortByRemainingTime(todoItems) {
      const newTodoItems = todoItems.concat();

      // sorts the ones that come earlier first
      newTodoItems.sort((a, b) =>
        // changes date string to milliseconds since 1970 and subtracts them
        parseDate(a.date) - parseDate(b.date));

      return newTodoItems;
    }

    // yyyy-mm-dd to milliseconds since 1970
    function parseDate(date) {
      const parts = date.split('-');

      // in a date object months is zero-based
      parts[1] -= 1;

      const dateObj = new Date(parts[0], parts[1], parts[2]);

      return dateObj.getTime();
    }

    e.preventDefault();

    const { username } = newCredentials;
    const { password } = newCredentials;

    if (username === '') {
      setCredentialError(
        {
          message: 'Username empty',
        },
      );

      return;
    }

    if (password === '') {
      setCredentialError(
        {
          message: 'Password empty',
        },
      );

      return;
    }

    const url = `${path}/login/${username}/${password}`;

    const loginResponse = await fetch(url);
    const { status } = loginResponse;

    // credentials incorrect => login failed
    if (status === 200) {
      // get user's todoitems from the server
      const todoItemsResponse = await fetch(`${path}/todoitems/${username}/${password}`);
      const todoItemsData = await todoItemsResponse.json();
      setTodoItems(sortByRemainingTime(todoItemsData.todoItems));
      setCredentials(newCredentials);
    }

    // incorrect username or password
    if ((status === 401) || (status === 404)) {
      setCredentialError(
        {
          message: 'Incorrect credentials',
        },
      );
    }
  }

  // creates new credentials in the server
  async function handleSignUp(e) {
    e.preventDefault();

    const { username } = newCredentials;
    const { password } = newCredentials;

    if (username === '') {
      setCredentialError(
        {
          message: 'Username empty',
        },
      );

      return;
    }

    if (password === '') {
      setCredentialError(
        {
          message: 'Password empty',
        },
      );

      return;
    }

    const url = `${path}/login/${username}/${password}`;

    const response = await fetch(url,
      {
        headers: {
          'content-type': 'text/plain',
        },
        method: 'POST',
        body: '',
      });

    const { status } = response;

    if (status === 201) {
      // clears todoItems
      setTodoItems([]);
      // creating a new user was accepted by the server
      setCredentials(newCredentials);
    }

    // username is already used (no duplicate usernames allowed)
    if ((status === 403) || (status === 404)) {
      setCredentialError(
        {
          message: 'Username already used',
        },
      );
    }
  }

  const {
    credentials,
    setCredentials,
    showLogIn,
    setShowLogIn,
    setTodoItems,
    path,
  } = props;

  const [newCredentials, setNewCredentials] = useState({ username: '', password: '' });

  // used to handle incorrect passwords/usernames in login
  // or duplicate usernames in sign up
  const [credentialError, setCredentialError] = useState({});

  // doesn't show the form when user is already logged in
  if (!credentials.loggedOut || showLogIn.none) {
    return (
      <></>
    );
  }

  // form to create a new user (sign-up)
  if (showLogIn.signUp) {
    return (
      <LogInForm
        handleSubmit={handleSignUp}
        newCredentials={newCredentials}
        setNewCredentials={setNewCredentials}
        setShowLogIn={setShowLogIn}
        text="sign up"
        credentialError={credentialError}
        setCredentialError={setCredentialError}
      />
    );
  }

  // form to log in
  if (showLogIn.logIn) {
    return (
      <LogInForm
        handleSubmit={handleLogIn}
        newCredentials={newCredentials}
        setNewCredentials={setNewCredentials}
        setShowLogIn={setShowLogIn}
        text="log in"
        credentialError={credentialError}
        setCredentialError={setCredentialError}
      />
    );
  }
}

export default LogIn;
