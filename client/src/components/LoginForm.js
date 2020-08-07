import React from 'react';
import "../styles/LogInForm.css";

function LogInForm(props) {
  const {
    handleSubmit,
    newCredentials,
    setNewCredentials,
    setShowLogIn,
    text
  } = props;

  return (
    <form className="log-in-form">
      <div className="input-container">
        <label htmlFor="username">username</label>
        <input
          type="text" name="username"
          value={newCredentials.username}
          onChange={e => {
            const username = e.target.value;
            setNewCredentials(
                {
                  username: username,
                  password: newCredentials.password,
                  loggedIn: true,
                }
              );
            }}/>
      </div>

      <div className="input-container">
        <label htmlFor="password">password</label>
        <input
          type="password" name="password"
          value={newCredentials.password}
          onChange={e => {
            const password = e.target.value;
            setNewCredentials(
                {
                  username: newCredentials.username,
                  password: password,
                  loggedIn: true,
                }
              );
            }}/>
      </div>

      <div className="login-buttons-container">
        <div onClick={handleSubmit} className="login-button">
          <div>{text}</div>
        </div>
        <div className="login-button"
          onClick={() => (setShowLogIn({none: true}))}
        >
          <div>Cancel</div>
        </div>
      </div>
    </form>
  );
}

export default LogInForm;