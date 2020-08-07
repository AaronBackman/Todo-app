import React from 'react';
import '../styles/logInButtons.css'

// buttons to handle logging in and out and signing in
function LogInButtons(props) {
  const {credentials, setCredentials, setShowLogIn, setTodoItems} = props;

  if (!credentials.loggedOut) {
    return (
      <div className="button"
        onClick={() => {
            // clears todoItems
            setTodoItems([]);
            setCredentials({loggedOut: true});
            setShowLogIn({none: true});
          }}
      >
        <div>log out</div>
      </div>
    );
  }

  return (
    <div className="log-in-buttons-container">
      <div className="button"
        onClick={() => setShowLogIn({logIn: true})}
      >
        <div>log in</div>
      </div>

      <div className="button"
        onClick={() => setShowLogIn({signUp: true})}
      >
        <div>sign up</div>
      </div>
    </div>
  );
}

export default LogInButtons;