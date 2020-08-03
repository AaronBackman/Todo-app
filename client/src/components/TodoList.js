import React, { useState, useEffect } from 'react';

import ItemListWindow from './ItemListWindow.js';
import AddItemWindow from './AddItemWindow.js';
import EditItemWindow from './EditItemWindow.js';
import DeleteItemWindow from './DeleteItemWindow.js';

import '../styles/TodoList.css';

function TodoList() {
  function sortByRemainingTime(todoItems) {
    const newTodoItems = todoItems.concat();

    // sorts the ones that come earlier first
    newTodoItems.sort((a, b) => {
      // changes date string to milliseconds since 1970 and subtracts them
      return parseDate(a.date) - parseDate(b.date);
    });

    return newTodoItems;
  }

  // yyyy-mm-dd to milliseconds since 1970
  function parseDate(date){
    const parts = date.split('-');

    // in a date object months is zero-based
    parts[1] = parts[1] - 1;

    const dateObj = new Date(parts[0], parts[1], parts[2]);

    return dateObj.getTime();
  }

  const [todoItems, setTodoItems] = useState([]);
  // if a window is shown to make and POST a new todo item
  const [showWindow, setShowWindow] = useState({itemListWindow: true});
  const [editedTodoItem, setEditedTodoItem] = useState({});
  const [deletedTodoItem, setDeletedTodoItem] = useState({});

  const path = 'http://localhost:9000';

  useEffect(() => {
    fetch(path + '/todoitems')
      .then((response => response.json()))
      .then(data => setTodoItems(sortByRemainingTime(data.todoItems)));
  }, []);

  if (showWindow.itemListWindow) {
    return (
      <ItemListWindow
        todoItems={todoItems} setTodoItems={setTodoItems}
        setEditedTodoItem={setEditedTodoItem}
        setDeletedTodoItem={setDeletedTodoItem}
        setShowWindow={setShowWindow}
        path={path}
      />
    );
  }

  if (showWindow.addItemWindow) {
    return (
      <AddItemWindow
        setShowWindow={setShowWindow}
        todoItems={todoItems} setTodoItems={setTodoItems}
        path={path}
      />
    );
  }

  if (showWindow.editItemWindow) {
    return (
      <EditItemWindow
        setShowWindow={setShowWindow}
        todoItems={todoItems} setTodoItems={setTodoItems}
        editedTodoItem={editedTodoItem} setEditedTodoItem={setEditedTodoItem}
        path={path}
      />
    );
  }

  if (showWindow.deleteItemWindow) {
    return (
      <DeleteItemWindow
        deletedTodoItem={deletedTodoItem}
        setDeletedTodoItem={setDeletedTodoItem}
        todoItems={todoItems} setTodoItems={setTodoItems}
        setShowWindow={setShowWindow}
        path={path}
      />
    )
  }
}

export default TodoList;