import React from 'react';

// used to ask confirmation to delete todo items and delete them
function DeleteItemWindow(props) {
  function deleteItem() {
    const deleteId = deletedTodoItem.id

    // filter out the todo item that will be deleted
    setTodoItems(todoItems.filter((todoItem => {
      if (todoItem.id === deleteId) return false;

      return true;
    })));

    fetch(`${path}/todoitems/${deleteId}`,
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
    todoItems, setTodoItems, setShowWindow
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