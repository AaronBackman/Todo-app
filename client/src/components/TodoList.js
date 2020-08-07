import React, { useState } from 'react';

import ItemListWindow from './ItemListWindow.js';
import AddItemWindow from './AddItemWindow.js';
import EditItemWindow from './EditItemWindow.js';
import DeleteItemWindow from './DeleteItemWindow.js';

function TodoList(props) {
  // if a window is shown to make and POST a new todo item
  const [showWindow, setShowWindow] = useState({itemListWindow: true});
  const [editedTodoItem, setEditedTodoItem] = useState({});
  const [deletedTodoItem, setDeletedTodoItem] = useState({});

  const {todoItems, setTodoItems, credentials, path} = props;

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