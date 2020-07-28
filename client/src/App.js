import React from 'react';
import './App.css';
import TodoList from './TodoList';

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
