import React from 'react';
import '../styles/LogInForm.css';

function LogInForm(props) {
  const {
    handleSubmit,
    newCredentials,
    setNewCredentials,
    setShowLogIn,
    text,
    credentialError,
    setCredentialError,
  } = props;

  return (
    <form className="log-in-form">
      <div className="input-container">
        <label htmlFor="username">username</label>
        <input
          type="text"
          name="username"
          value={newCredentials.username}
          onChange={(e) => {
            const username = e.target.value;
            setNewCredentials(
              {
                username,
                password: newCredentials.password,
                loggedIn: true,
              },
            );

            if (credentialError.message) {
              // clear errors
              setCredentialError({});
            }
          }}
        />
      </div>

      <div className="input-container">
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          value={newCredentials.password}
          onChange={(e) => {
            const password = e.target.value;
            setNewCredentials(
              {
                username: newCredentials.username,
                password,
                loggedIn: true,
              },
            );

            if (credentialError.message) {
              // clear errors
              setCredentialError({});
            }
          }}
        />
      </div>

      <div className="error-message">
        {(() => {
          if (credentialError.message) return credentialError.message;
        })()}
      </div>

      <div className="login-buttons-container">
        <div onClick={handleSubmit} className="login-button">
          <div>{text}</div>
        </div>
        <div
          className="login-button"
          onClick={() => (setShowLogIn({ none: true }))}
        >
          <div>Cancel</div>
        </div>
      </div>
    </form>
  );
}

export default LogInForm;
