import React from 'react';
import './App.css';

function App() {
  const todoItems = [
    {
      title: "cleaning",
      date: Date.now(),
    },
    {
      title: "shopping",
      date: Date.now(),
    },
    {
      title: "coding",
      date: Date.now(),
    },
  ];

  return (
    <div className="container">
      <div id="header"></div>
      <div id="content">
        <div className="todo-list">
          {todoItems.map(todoItem => {
            return (
              <div className="todo-list-item">
                <div>{todoItem.title}</div>
                <div>{todoItem.date}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div id="footer"></div>
    </div>
  );
}

export default App;
