import React, { useState } from 'react';
import './TodoItemChangeWindow.css';

// defines windows to add, delete or edit todo items
function TodoItemChangeWindow(props) {
  // POSTs todoItem made from user input to the server (adds new item)
  function addItem(e) {
    e.preventDefault();

    setTodoItems(todoItems.concat(newTodoItem));

    fetch('http://localhost:3001/todoitems',
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTodoItem),
    })
      .then((response) => {
        // the default todoitem
        setNewTodoItem(
          {
            title: '',
            date: 0,
            priority: {
              name: 'low',
              value: 1,
            },
            id: -1,
          }
        );
        setShowWindow({itemListWindow: true});
      });
  }

  // PUTs todoItem made from user input to the server (replaces old version)
  function updateItem(e) {
    e.preventDefault();

    setTodoItems(todoItems.map((todoItem => {
      if (todoItem.id === editId) return newTodoItem;

      return todoItem;
    })));

    fetch(`http://localhost:3001/todoitems/${editId}`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(newTodoItem),
    })
      .then((response) => {
        // the default todoitem
        setNewTodoItem(
          {
            title: '',
            date: 0,
            priority: {
              name: 'low',
              value: 1,
            },
            id: -1,
          }
        );
        setShowWindow({itemListWindow: true});
      });
  }

  function copyTodoItem(todoItem) {
    return {
      title: todoItem.title,
      date: todoItem.date,
      priority: {
        name: todoItem.priority.name,
        value: todoItem.priority.value,
      },
      id: todoItem.id,
    };
  }

  const [newTodoItem, setNewTodoItem] = useState(
    {
      title: '',
      date: 0,
      priority: {
        name: 'low',
        value: 1,
      },
      id: -1,
    }
    );

  const showWindow = props.showWindow;
  const setShowWindow = props.setShowWindow;

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  const editId = props.editId;
  
  if (showWindow.addItemWindow) {
    if (newTodoItem.id === -1) {
      const newTodoItemCopy = copyTodoItem(newTodoItem);
      newTodoItemCopy.id = todoItems.length + 1;
      setNewTodoItem(newTodoItemCopy);
    }
    return (
      <div className="todo-item-form-container">
        <form className="todo-item-form" onSubmit={addItem}>
        <div className="todo-item-input">
            <label htmlFor="title">enter title</label>
            <input type="text" id="title" name="title" value={newTodoItem.title} onChange={(e) => {
              const newTodoItemCopy = copyTodoItem(newTodoItem);
              newTodoItemCopy.title = e.target.value;
              setNewTodoItem(newTodoItemCopy);
            }} />
          </div>
          <div className="todo-item-input">
            <label htmlFor="date">enter date</label>
            <input type="number" id="date" name="date" value={newTodoItem.date} onChange={(e) => {
              const newTodoItemCopy = copyTodoItem(newTodoItem);
              newTodoItemCopy.date = e.target.value;
              setNewTodoItem(newTodoItemCopy);
            }} />
          </div>
          <div className="priority-input">
            <label htmlFor="priority">priority</label>
            <div>
              <div>low</div>
              <input type="radio" id="low-priority" name="priority"
                value="low" checked={newTodoItem.priority.name === 'low'}
                onChange={(e) => {
                  const newTodoItemCopy = copyTodoItem(newTodoItem);
                  newTodoItemCopy.priority.name = 'low';
                  newTodoItemCopy.priority.value = 1;
                  setNewTodoItem(newTodoItemCopy);
                }}
              />
              <div>medium</div>
              <input type="radio" id="medium-priority" name="priority"
                value="medium" checked={newTodoItem.priority.name === 'medium'}
                onChange={(e) => {
                  const newTodoItemCopy = copyTodoItem(newTodoItem);
                  newTodoItemCopy.priority.name = 'medium';
                  newTodoItemCopy.priority.value = 2;
                  setNewTodoItem(newTodoItemCopy);
                }}
              />
              <div>high</div>
              <input type="radio" id="high-priority" name="priority"
                value="high" checked={newTodoItem.priority.name === 'high'}
                onChange={(e) => {
                  const newTodoItemCopy = copyTodoItem(newTodoItem);
                  newTodoItemCopy.priority.name = 'high';
                  newTodoItemCopy.priority.value = 3;
                  setNewTodoItem(newTodoItemCopy);
                }}
              />
             </div>
            </div>
          <input type="submit" />
        </form>
      </div>
    );
  }
  
  if (showWindow.editItemWindow) {
    // gets the item that has the same id that will be edited
    const selectedTodoItem = todoItems.filter((item) => {
      if (item.id === editId) return true;

      return false;
    })[0];

    // if statement to avoid infinite re rendering, done only once to update newTodoItem
    if (newTodoItem.id !== selectedTodoItem.id) {
      setNewTodoItem(selectedTodoItem);
    }

    return (
      <div className="todo-item-form-container">
        <form className="todo-item-form" onSubmit={updateItem}>
          <div className="todo-item-input">
            <label htmlFor="title">enter title</label>
            <input type="text" id="title" name="title" value={newTodoItem.title} onChange={(e) => {
              const newTodoItemCopy = copyTodoItem(newTodoItem);
              newTodoItemCopy.title = e.target.value;
              setNewTodoItem(newTodoItemCopy);
            }} />
          </div>
          <div className="todo-item-input">
            <label htmlFor="date">enter date</label>
            <input type="number" id="date" name="date" value={newTodoItem.date} onChange={(e) => {
              const newTodoItemCopy = copyTodoItem(newTodoItem);
              newTodoItemCopy.date = e.target.value;
              setNewTodoItem(newTodoItemCopy);
            }} />
          </div>
          <div className="priority-input">
            <label htmlFor="priority">priority</label>
            <div>
              <div>low</div>
              <input type="radio" id="low-priority" name="priority"
                value="low" checked={newTodoItem.priority.name === 'low'}
                onChange={(e) => {
                  const newTodoItemCopy = copyTodoItem(newTodoItem);
                  newTodoItemCopy.priority.name = 'low';
                  newTodoItemCopy.priority.value = 1;
                  setNewTodoItem(newTodoItemCopy);
                }}
              />
              <div>medium</div>
              <input type="radio" id="medium-priority" name="priority"
                value="medium" checked={newTodoItem.priority.name === 'medium'}
                onChange={(e) => {
                  const newTodoItemCopy = copyTodoItem(newTodoItem);
                  newTodoItemCopy.priority.name = 'medium';
                  newTodoItemCopy.priority.value = 2;
                  setNewTodoItem(newTodoItemCopy);
                }}
              />
              <div>high</div>
              <input type="radio" id="high-priority" name="priority"
                value="high" checked={newTodoItem.priority.name === 'high'}
                onChange={(e) => {
                  const newTodoItemCopy = copyTodoItem(newTodoItem);
                  newTodoItemCopy.priority.name = 'high';
                  newTodoItemCopy.priority.value = 3;
                  setNewTodoItem(newTodoItemCopy);
                }}
              />
             </div>
            </div>
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default TodoItemChangeWindow;