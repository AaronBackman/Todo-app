import React from 'react';
import './App.css';
import TodoList from './TodoList';

function App() {
  return (
    <div className="container">
      <div id="header"></div>
      <div id="content">
        <TodoList />
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
