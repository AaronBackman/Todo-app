import React from 'react';

import '../styles/DeleteItemWindow.css';

// used to ask confirmation to delete todo items and delete them
function DeleteItemWindow(props) {
  function deleteItem() {
    const deleteId = deletedTodoItem.id;
    const { username } = credentials;
    const { password } = credentials;

    // filter out the todo item that will be deleted
    setTodoItems(todoItems.filter(((todoItem) => {
      if (todoItem.id === deleteId) return false;

      return true;
    })));

    setShowWindow({ itemListWindow: true });
    setDeletedTodoItem({});

    // send to the server if user is logged in
    if (!credentials.loggedOut) {
      fetch(`${path}/todoitems/${username}/${password}/${deleteId}`,
        {
          method: 'DELETE',
        });
    }
  }

  const {
    deletedTodoItem, setDeletedTodoItem,
    todoItems, setTodoItems, setShowWindow,
    path, credentials,
  } = props;

  return (
    <div className="delete-container">
      <div className="delete-question">Are you sure?</div>
      <div className="confirm-container">
        <div className="confirm-button" onClick={deleteItem}>delete</div>
        <div
          className="confirm-button"
          onClick={() => {
            setShowWindow({ itemListWindow: true });
            setDeletedTodoItem({});
          }}
        >
          cancel
        </div>
      </div>
    </div>
  );
}

export default DeleteItemWindow;
