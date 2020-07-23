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

  // transforms date string to time from now (eg. 2000-2-4 => 20 years ago)
  function formatDate(date) {
    // date string to milliseconds since 1970
    date = Date.parse(date);

    const dateNow = Date.now();
    let formatedDate = '';
    // is date in the future or not;
    let inFuture = true;

    if ((date - dateNow) < 0) {
      inFuture = false;
    }

    const dateDiff = Math.abs(date - dateNow);

    // example: shownDateNumbers is 2 if date is in 2 weeks
    let shownDateNumbers;

    // years
    if (dateDiff >= (1000 * 60 * 60 * 24 * 365)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24 * 365));
      formatedDate = `${shownDateNumbers} years`;
    }
    // months
    else if (dateDiff >= (1000 * 60 * 60 * 24 * 30)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24 * 30));
      formatedDate = `${shownDateNumbers} months`;
    }
    // weeks
    else if (dateDiff >= (1000 * 60 * 60 * 24 * 7)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24 * 7));
      formatedDate = `${shownDateNumbers} weeks`;
    }
    // days
    else if (dateDiff >= (1000 * 60 * 60 * 24)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24));
      formatedDate = `${shownDateNumbers} days`;
    }
    // hours
    else if (dateDiff >= (1000 * 60 * 60)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60));
      formatedDate = `${shownDateNumbers} hours`;
    }
    // minutes
    else if (dateDiff >= (1000 * 60)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60));
      formatedDate = `${shownDateNumbers} minutes`;
    }
    // seconds
    else if (dateDiff >= 0) {
      // the event is basically happening right now
      inFuture = true;
      formatedDate = 'now';
    }

    // takes s from the end if there is only 1 (1 days => 1 day)
    if (shownDateNumbers === 1) {
      formatedDate = formatedDate.slice(0, -1)
    }

    if (!inFuture) {
      formatedDate += ' ago';
    }

    return formatedDate;
  }

  let todoItem = props.todoItem;

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  const setShowWindow = props.setShowWindow;

  const setEditedTodoItem = props.setEditedTodoItem;
  const setDeletedTodoItem = props.setDeletedTodoItem;

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
      <div
        className="complete-button"
        onClick={e => {
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
        }}
      >

      </div>
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