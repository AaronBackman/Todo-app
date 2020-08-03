import React from 'react';

import TodoItemForm from './TodoItemForm.js';

// makes window that allows user to edit old todo items
function EditItemWindow(props) {
  // PUTs todoItem made from user input to the server (replaces old version)
  function updateItem(e) {
    e.preventDefault();
    
    const editId = editedTodoItem.id

    // change the edited todo item to the edited values, other items unchanged
    setTodoItems(todoItems.map((todoItem => {
      if (todoItem.id === editId) return editedTodoItem;

      return todoItem;
    })));

    fetch(`${path}/todoitems/${editId}`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(editedTodoItem),
    })
      .then((response) => {
        setShowWindow({itemListWindow: true});
        setEditedTodoItem({});
      });
  }

  const {
    setShowWindow, todoItems, setTodoItems,
    editedTodoItem, setEditedTodoItem, path
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