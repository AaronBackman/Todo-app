import React, { useState } from 'react';
import './TodoItem.css';
import ItemMenu from './ItemMenu.js';

// component to show a single todo item in a list of todo items
function TodoItem(props) {
  // transforms timestamp to a more readable form (example: 1232436982317 => 2 weeks ago)
  function formatDate(date) {
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

  const todoItem = props.todoItem;

  const setShowWindow = props.setShowWindow;

  const setEditedTodoItem = props.setEditedTodoItem;
  const setDeletedTodoItem = props.setDeletedTodoItem;

  // if true, shows options to edit or delete the item
  const [showItemMenu, setShowItemMenu] = useState(false);

  return (
    <div
      className={'todo-list-item ' + `${todoItem.priority.name + '-priority'}`}
      onClick={() => {
        const toggledShowItemMenu = !showItemMenu
        setShowItemMenu(toggledShowItemMenu)
      }}
    >
      <div>{todoItem.title}</div>
      <div>{formatDate(todoItem.date)}</div>
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