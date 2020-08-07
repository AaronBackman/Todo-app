import React, { useState } from 'react';

import ItemMenu from './ItemMenu.js';

import '../styles/TodoItem.css';

// component to show a single todo item in a list of todo items
function TodoItem(props) {
  function copyTodoItem(item) {
    return {
      title: item.title,
      date: item.date,
      priority: {
        name: item.priority.name,
        value: item.priority.value,
      },
      isCompleted: item.isCompleted,
      id: item.id,
    };
  }

  // yyyy-mm-dd date format to mm/dd/yyyy
  function formatDate(date) {
    const dateParts = date.split('-');

    // switch years from the beginning to the end
    const years = dateParts[0];
    dateParts[0] = dateParts[1];
    dateParts[1] = dateParts[2];
    dateParts[2] = years;

    // take 0 from beginning of days and months (but not years)
    for(let i = 0; i < dateParts.length - 1; i++) {
      if (dateParts[i].slice(0, 1) === '0') {
        dateParts[i] = dateParts[i].slice(1);
      }
    }

    // remove year, if it is the current year
    if (Number(dateParts[2]) === new Date().getFullYear()) {
      dateParts.pop();
    }
    
    return dateParts.join('/');
  }

  // function used when todo items is completed/ uncompleted by clicking
  function handleCompletetion(e) {
    e.stopPropagation();

    const username = credentials.username;
    const password = credentials.password;
    
    const newTodoItems = todoItems.map(item => {
      if (item.id === todoItem.id) {
        const todoItemCopy = copyTodoItem(todoItem);
        // toggles the value of isCompleted
        todoItemCopy.isCompleted = !todoItemCopy.isCompleted;

        return todoItemCopy;
      }

      return item;
    })

    // set todoItem to match the updated value
    todoItem = newTodoItems.find(item => {
      if (item.id === todoItem.id) return true;

      return false;
    });

    setTodoItems(newTodoItems);

    // if logged in send to the server
    if (!credentials.loggedOut) {
      fetch(`${path}/todoitems/${username}/${password}/${todoItem.id}`,
        {
          headers: {
            "content-type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(todoItem),
        });
    }
  }

  let todoItem = props.todoItem;

  const {
    todoItems, setTodoItems, setShowWindow,
    setEditedTodoItem, setDeletedTodoItem,
    path, credentials
  } = props;

  // if true, shows options to edit or delete the item
  const [showItemMenu, setShowItemMenu] = useState(false);

  return (
    <div
      id={todoItem.id}
      className={
        'todo-list-item ' +
        `${todoItem.priority.name + '-priority'} ` +
        `${todoItem.isCompleted ?
          'todo-item-completed':
          'todo-item-uncompleted'}`
        }

      onClick={() => {
        const toggledShowItemMenu = !showItemMenu;
        setShowItemMenu(toggledShowItemMenu);
      }}
    >
      <div className="todo-item-text">
        <div>{todoItem.title}</div>
      </div>
      <div className="todo-item-text">
        <div>{formatDate(todoItem.date)}</div>
      </div>

      {todoItem.isCompleted ?
        <i className="material-icons check-box-completed"
        onClick={handleCompletetion}
        >check_box</i>:
        <i className="material-icons check-box-uncompleted"
        onClick={handleCompletetion}
      >check_box_outline_blank</i>}

      {showItemMenu ?
      <ItemMenu
        setShowItemMenu={setShowItemMenu}
        setShowWindow={setShowWindow}
        setEditedTodoItem={setEditedTodoItem}
        setDeletedTodoItem={setDeletedTodoItem}
        todoItem={todoItem}
      /> :
      <></>}
    </div>
  );
}

export default TodoItem;