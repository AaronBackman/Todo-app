import React, { useState } from 'react';
import './Todolist.css'
import Sort from './Sort.js';

function TodoList() {
  const [todoItems, setTodoItems] = useState([
    {
      title: "cleaning",
      date: Date.now() - 100023400000,
      priority: {
        name: "high",
        value: 3,
      },
    },
    {
      title: "shopping",
      date: Date.now() - 3334,
      priority: {
        name: "low",
        value: 1,
      },
    },
    {
      title: "coding",
      date: Date.now(),
      priority: {
        name: "medium",
        value: 2,
      },
    },
  ]);

  return (
    <>
      <div className="todo-list">
        <Sort todoItems={todoItems} setTodoItems={setTodoItems} />
        {todoItems.map(todoItem => {
          return (
            <div className={'todo-list-item ' + `${todoItem.priority.name + '-priority'}`}>
              <div>{todoItem.title}</div>
              <div>{todoItem.date}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default TodoList;