import React from 'react';
import './ItemMenu.css';

// shows a menu to edit or delete todo items
function ItemMenu(props) {
  const setShowItemMenu = props.setShowItemMenu;
  const setShowWindow = props.setShowWindow;

  const setEditedTodoItem = props.setEditedTodoItem;
  const setDeletedTodoItem = props.setDeletedTodoItem;

  const todoItem = props.todoItem;

  return (
    <div
      className="menu-container"
      onClick={e => e.stopPropagation()}
    >
      <div
        className="menu-button"
        onClick={() => {
          setDeletedTodoItem(todoItem);
          setShowWindow({deleteItemWindow: true})
        }}>
          delete item
      </div>
      <div
        className="menu-button"
        onClick={() => {
          setEditedTodoItem(todoItem);
          setShowWindow({editItemWindow: true})
        }}>
          edit item
      </div>
      <div
        className="menu-button"
        onClick={() => {
          setShowItemMenu(false);
        }}>
          cancel
      </div>
    </div>
  );
}

export default ItemMenu;