import React from 'react';

import '../styles/DeleteItemWindow.css';

// used to ask confirmation to delete todo items and delete them
function DeleteItemWindow(props) {
  function deleteItem() {
    const deleteId = deletedTodoItem.id
    const username = credentials.username;
    const password = credentials.password;

    // filter out the todo item that will be deleted
    setTodoItems(todoItems.filter((todoItem => {
      if (todoItem.id === deleteId) return false;

      return true;
    })));

    fetch(`${path}/todoitems/${username}/${password}/${deleteId}`,
    {
      method: "DELETE",
    })
      .then((response) => {
        setShowWindow({itemListWindow: true});
        setDeletedTodoItem({});
      });
  }

  const {
    deletedTodoItem, setDeletedTodoItem,
    todoItems, setTodoItems, setShowWindow,
    path, credentials
  } = props;

  return (
    <div className="delete-container">
      <div className="delete-question">Are you sure?</div>
      <div className="confirm-container">
        <div className="confirm-button" onClick={deleteItem}>delete</div>
        <div className="confirm-button" onClick={() => {
          setShowWindow({itemListWindow: true});
          setDeletedTodoItem({});
        }}>
          cancel
        </div>
      </div>
    </div>
  );
}

export default DeleteItemWindow;