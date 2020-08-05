import React from 'react';
import "../styles/LogInForm.css";

function LogInForm(props) {
  const {handleSubmit, newCredentials, setNewCredentials, text} = props;

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
                {username: username, password: newCredentials.password}
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
                {username: newCredentials.username, password: password}
              );
            }}/>
      </div>

      <div onClick={handleSubmit} className="submit-button-container">
        <div>{text}</div>
      </div>
    </form>
  );
}

export default LogInForm;