import React, { useState } from 'react';
import LogInForm from './LogInForm.js';

function LogIn(props) {
  // checks with the server if the credentials are correct and logs in
  async function handleCredentialsCheck(e) {
    function sortByRemainingTime(todoItems) {
      const newTodoItems = todoItems.concat();
  
      // sorts the ones that come earlier first
      newTodoItems.sort((a, b) => {
        // changes date string to milliseconds since 1970 and subtracts them
        return parseDate(a.date) - parseDate(b.date);
      });
  
      return newTodoItems;
    }
  
    // yyyy-mm-dd to milliseconds since 1970
    function parseDate(date){
      const parts = date.split('-');
  
      // in a date object months is zero-based
      parts[1] = parts[1] - 1;
  
      const dateObj = new Date(parts[0], parts[1], parts[2]);
  
      return dateObj.getTime();
    }



    e.preventDefault();

    const username = newCredentials.username;
    const password = newCredentials.password;

    const url = `${path}/login/${username}/${password}`;

    const loginResponse = await fetch(url)
    const status = loginResponse.status;

    // credentials incorrect => login failed
    if (status !== 200) {
      return;
    }

    // get user's todoitems from the server
    const todoItemsResponse = await fetch(`${path}/todoitems/${username}/${password}`);
    const todoItemsData = await todoItemsResponse.json();
    setTodoItems(sortByRemainingTime(todoItemsData.todoItems));
    setCredentials(newCredentials);
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
          // clears todoItems
          setTodoItems([]);
          // creating a new user was accepted by the server
          setCredentials(newCredentials);
        }
      });
  }
  
  const {
          credentials,
          setCredentials,
          showLogIn,
          setShowLogIn,
          setTodoItems,
          path
        } = props;

  const [newCredentials, setNewCredentials]
    = useState({username: '', password: ''});

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
        handleSubmit={handleCredentialsAdd}
        newCredentials={newCredentials}
        setNewCredentials={setNewCredentials}
        setShowLogIn={setShowLogIn}
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
        setShowLogIn={setShowLogIn}
        text={'log in'}
      />
    );
  }
}

export default LogIn;