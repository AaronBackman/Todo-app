import React from 'react';

function LoginForm(props) {
  const {handleSubmit, newCredentials, setNewCredentials} = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
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

        <input type="submit"/>
      </form>
    </div>
  );
}

export default LoginForm;