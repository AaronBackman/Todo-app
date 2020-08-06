import React, { useState, useEffect } from 'react';

import ItemListWindow from './ItemListWindow.js';
import AddItemWindow from './AddItemWindow.js';
import EditItemWindow from './EditItemWindow.js';
import DeleteItemWindow from './DeleteItemWindow.js';

function TodoList(props) {
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

  // done only once
  useEffect(() => {
    const defaultTodoItem = [];
    defaultTodoItem.default = true;

    setTodoItems(defaultTodoItem);
  }, []);

  const path = 'http://localhost:9000';

  const credentials = props.credentials;
  const username = credentials.username;
  const password = credentials.password;

  // credentials have been given correctly => give user's todoitems
  if (!credentials.default && todoItems.default) {
    fetch(path + `/todoitems/${username}/${password}`)
      .then((response => response.json()))
      .then(data => setTodoItems(sortByRemainingTime(data.todoItems)));
  }
  // user has logged out while some todoitems are shown
  // => don't show them anymore
  if (credentials.default && todoItems.length !== 0) {
    const defaultTodoItem = [];
    defaultTodoItem.default = true;

    setTodoItems(defaultTodoItem);
  }

  if (showWindow.itemListWindow) {
    return (
      <ItemListWindow
        todoItems={todoItems} setTodoItems={setTodoItems}
        setEditedTodoItem={setEditedTodoItem}
        setDeletedTodoItem={setDeletedTodoItem}
        setShowWindow={setShowWindow}
        path={path}
        credentials={credentials}
      />
    );
  }

  if (showWindow.addItemWindow) {
    return (
      <AddItemWindow
        setShowWindow={setShowWindow}
        todoItems={todoItems} setTodoItems={setTodoItems}
        path={path}
        credentials={credentials}
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
        credentials={credentials}
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
        credentials={credentials}
      />
    )
  }
}

export default TodoList;