import React from 'react';

import TodoList from './TodoList.js';

import '../styles/App.css';

function App() {
  return (
    <div className="container">
      <div className="header"></div>
      <div className="content">
        <TodoList />
      </div>
      <div className="footer"></div>
    </div>
  );
}

export default App;
