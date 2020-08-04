import React, {useState} from 'react';

import TodoList from './TodoList.js';
import Login from './Login.js';

import '../styles/App.css';

function App() {
  const [credentials, setCredentials] = useState({default: true});

  return (
    <div className="container">
      <div className="header">
        <Login credentials={credentials} setCredentials={setCredentials}/>
      </div>
      <div className="content">
        <TodoList credentials={credentials} />
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default App;
