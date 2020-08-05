import React from 'react';

import TodoItemForm from './TodoItemForm.js';

// makes window that allows user to edit old todo items
function EditItemWindow(props) {
  // PUTs todoItem made from user input to the server (replaces old version)
  function updateItem(e) {
    e.preventDefault();
    
    const editId = editedTodoItem.id
    const username = credentials.username;
    const password = credentials.password;

    // change the edited todo item to the edited values, other items unchanged
    setTodoItems(todoItems.map((todoItem => {
      if (todoItem.id === editId) return editedTodoItem;

      return todoItem;
    })));

    setShowWindow({itemListWindow: true});
    setEditedTodoItem({});

    fetch(`${path}/todoitems/${username}/${password}/${editId}`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(editedTodoItem),
    });
  }

  const {
    setShowWindow, todoItems, setTodoItems,
    editedTodoItem, setEditedTodoItem,
    path, credentials
  } = props;

  return (
    <TodoItemForm
      handleSubmit={updateItem}
      todoItem={editedTodoItem} setTodoItem={setEditedTodoItem}
      setShowWindow={setShowWindow}
    />
  );
}

export default EditItemWindow;