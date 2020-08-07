import React, {useState} from 'react';

import LogInButtons from './LogInButtons';
import TodoList from './TodoList.js';
import LogIn from './LogIn.js';

import '../styles/App.css';

function App() {
  // username and password (if logged in)
  const [credentials, setCredentials] = useState({loggedOut: true});
  // none for nothing, logIn for existing users
  // and signIn for registering new users
  const [showLogIn, setShowLogIn] = useState({none: true});
  const [todoItems, setTodoItems] = useState([]);

  const path = 'http://localhost:9000';

  return (
    <div className="container">
      <div className="header">
        <LogInButtons
          credentials={credentials}
          setCredentials={setCredentials}
          setShowLogIn={setShowLogIn}
          setTodoItems={setTodoItems}
        />
      </div>
      <LogIn
        credentials={credentials}
        setCredentials={setCredentials}
        showLogIn={showLogIn}
        setShowLogIn={setShowLogIn}
        setTodoItems={setTodoItems}
        path={path}
      />
      <div className="content">
        <TodoList
          credentials={credentials}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
        />
      </div>
    </div>
  );
}

export default App;
