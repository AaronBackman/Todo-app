import React, { useState } from 'react';
import './TodoItem.css';
import ItemMenu from './ItemMenu.js';

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

    fetch(`http://localhost:3001/todoitems/${todoItem.id}`,
      {
        headers: {
          "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(todoItem),
      })
        .then(() => {
          setTodoItems(newTodoItems);
        });
  }

  let todoItem = props.todoItem;

  const {
    todoItems, setTodoItems, setShowWindow,
    setEditedTodoItem, setDeletedTodoItem
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
        const toggledShowItemMenu = !showItemMenu
        setShowItemMenu(toggledShowItemMenu)
      }}
    >
      <div className="todo-item-text">{todoItem.title}</div>
      <div className="todo-item-text">{formatDate(todoItem.date)}</div>

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