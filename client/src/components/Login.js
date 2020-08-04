import React, { useState } from 'react';
import LoginForm from './LoginForm.js';

function Login(props) {
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
  
  const {credentials, setCredentials} = props;

  // if true shows from to create a new user
  const [showCreateNewUser, setShowCreateNewUser] = useState(false);

  const [newCredentials, setNewCredentials]
    = useState({username: '', password: ''});

  if (!credentials.default) {
    return (
      <div onClick={() => setCredentials({default: true})}>
        log out
      </div>
    );
  }

  // form to create a new user
  if (showCreateNewUser) {
    return (
      <>
        <LoginForm
          handleSubmit={handleCredentialsAdd}
          newCredentials={newCredentials}
          setNewCredentials={setNewCredentials}
        />
        <div onClick={() => setShowCreateNewUser(false)}>log in</div>
      </>
    );
  }

  // form to log in
  return (
    <>
      <LoginForm
        handleSubmit={handleCredentialsCheck}
        newCredentials={newCredentials}
        setNewCredentials={setNewCredentials}
      />
      <div onClick={() => setShowCreateNewUser(true)}>sign in</div>
    </>
  );
}

export default Login;