import React, { useState } from 'react';
import LogInForm from './LogInForm.js';

function LogIn(props) {
  // checks with the server if the credentials are correct
  function handleCredentialsCheck(e) {
    e.preventDefault();

    const url = 'http://localhost:9000/login/' +
                `${newCredentials.username}/${newCredentials.password}`;

    fetch(url)
      .then(response => {
        if (response.status === 200) {
          // login was accepted by the server
          setCredentials(newCredentials);
        }
      });
  }

  // creates new credentials in the server
  function handleCredentialsAdd(e) {
    e.preventDefault();

    const url = 'http://localhost:9000/login' +
                `/${newCredentials.username}/${newCredentials.password}`;

    fetch(url,
    {
      headers: {
        "content-type": "text/plain",
      },
      method: "POST",
      body: '',
    })
      .then(response => {
        if (response.status === 201) {
          // creating a new user was accepted by the server
          setCredentials(newCredentials);
        }
      });
  }
  
  const {
          credentials, setCredentials, showLogIn, setShowLogIn
        } = props;

  const [newCredentials, setNewCredentials]
    = useState({username: '', password: ''});

  // doesn't show the form when user is already logged in
  if (!credentials.default || showLogIn.none) {
    return (
      <></>
    );
  }

  // form to create a new user (sign-up)
  if (showLogIn.signUp) {
    return (
      <LogInForm
        handleSubmit={handleCredentialsAdd}
        newCredentials={newCredentials}
        setNewCredentials={setNewCredentials}
        text={'sign up'}
      />
    );
  }

  // form to log in
  if (showLogIn.logIn) {
    return (
      <LogInForm
        handleSubmit={handleCredentialsCheck}
        newCredentials={newCredentials}
        setNewCredentials={setNewCredentials}
        text={'log in'}
      />
    );
  }
}

export default LogIn;