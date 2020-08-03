import React, { useState } from 'react';
import './TodoListPart.css';
import TodoItem from 'components/TodoItem.js';

function TodoListPart(props) {
  const {
    text, todoItemPart, setShowWindow, setEditedTodoItem,
    setDeletedTodoItem, todoItems, setTodoItems, path
  } = props;

  // is this part of todo list shown or not
  const [showThisPart, setShowThisPart] = useState(true);

  if (!showThisPart) {
    return (
      <div className="todo-list-part-button"
        onClick={() => setShowThisPart(true)}
      >
        <div className="todo-list-part-button-text">
          <div>{text}</div>
        </div>
        <div className="todo-list-part-button-text">
          <div>show</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="todo-list-part-button"
        onClick={() => setShowThisPart(false)}
        onMouseDown={e => (e.preventDefault())}
      >
        <div className="todo-list-part-button-text">
          <div>{text}</div>
        </div>
        <div className="todo-list-part-button-text">
          <div>hide</div>
        </div>
      </div>
      {
          todoItemPart.map(
            todoItem => <TodoItem key={todoItem.id}
                          todoItem={todoItem}
                          setShowWindow={setShowWindow}
                          setEditedTodoItem={setEditedTodoItem}
                          setDeletedTodoItem={setDeletedTodoItem}
                          todoItems={todoItems}
                          setTodoItems={setTodoItems}
                          path={path}
                        />)
        }
    </>
  );
}

export default TodoListPart;