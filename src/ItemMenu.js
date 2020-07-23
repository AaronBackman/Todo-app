import React from 'react';
import './ItemMenu.css';

// shows a menu to edit or delete todo items
function ItemMenu(props) {
  const setShowItemMenu = props.setShowItemMenu;
  const setShowWindow = props.setShowWindow;

  const setEditedTodoItem = props.setEditedTodoItem;
  const setDeletedTodoItem = props.setDeletedTodoItem;

  const todoItem = props.todoItem;


  // give position to the item menu based on the selected todo item
  const todoItemDiv = document.getElementById(todoItem.id);
  const boundingRect = todoItemDiv.getBoundingClientRect();

  // get width of the scroll bar
  const scrollDiv = document.querySelector('.todo-list');
  const scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth - 2 * 1;

  return (
    <div
      style={{left: `${boundingRect.right + scrollBarWidth}px`}}
      className="menu-container"
      onClick={e => e.stopPropagation()}
    >
      <div
        className="menu-button"
        onClick={() => {
          setDeletedTodoItem(todoItem);
          setShowWindow({deleteItemWindow: true})
        }}>
          <div>
            delete item
          </div>
      </div>
      <div
        className="menu-button"
        onClick={() => {
          setEditedTodoItem(todoItem);
          setShowWindow({editItemWindow: true})
        }}>
          <div>
            edit item
          </div>
      </div>
      <div
        className="menu-button"
        onClick={() => {
          setShowItemMenu(false);
        }}>
          <div>
            cancel
          </div>
      </div>
    </div>
  );
}

export default ItemMenu;