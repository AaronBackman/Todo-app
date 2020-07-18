import React, { useState, useEffect } from 'react';
import './Todolist.css';
import './TodoItemForm.css';
import Sort from './Sort.js';

function TodoList() {
  const [todoItems, setTodoItems] = useState([]);
  // if a window is shown to make and POST a new todo item
  const [showWindow, setShowWindow] = useState({itemListWindow: true});
  const [editedTodoItem, setEditedTodoItem] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/todoitems')
      .then((response => response.json()))
      .then(data => setTodoItems(data));
  }, []);


  if (showWindow.itemListWindow) {
    return (
      <ItemListWindow
        todoItems={todoItems} setTodoItems={setTodoItems}
        setEditedTodoItem={setEditedTodoItem}
        setShowWindow={setShowWindow}
      />
    );
  }

  if (showWindow.addItemWindow) {
    return (
      <AddItemWindow
        setShowWindow={setShowWindow}
        todoItems={todoItems} setTodoItems={setTodoItems}
      />
    );
  }

  if (showWindow.editItemWindow) {
    return (
      <EditItemWindow
        setShowWindow={setShowWindow}
        todoItems={todoItems} setTodoItems={setTodoItems}
        editedTodoItem={editedTodoItem} setEditedTodoItem={setEditedTodoItem}
      />
    );
  }

  if (showWindow.deleteItemWindow) {
    return (
      <>
      </>
    )
  }
}



function ItemListWindow(props) {
  // transforms timestamp to a more readable form (example: 1232436982317 => 2 weeks ago)
  function formatDate(date) {
    const dateNow = Date.now();
    let formatedDate = '';
    // is date in the future or not;
    let inFuture = true;

    if ((date - dateNow) < 0) {
      inFuture = false;
    }

    const dateDiff = Math.abs(date - dateNow);

    // example: shownDateNumbers is 2 if date is in 2 weeks
    let shownDateNumbers;

    // years
    if (dateDiff >= (1000 * 60 * 60 * 24 * 365)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24 * 365));
      formatedDate = `${shownDateNumbers} years`;
    }
    // months
    else if (dateDiff >= (1000 * 60 * 60 * 24 * 30)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24 * 30));
      formatedDate = `${shownDateNumbers} months`;
    }
    // weeks
    else if (dateDiff >= (1000 * 60 * 60 * 24 * 7)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24 * 7));
      formatedDate = `${shownDateNumbers} weeks`;
    }
    // days
    else if (dateDiff >= (1000 * 60 * 60 * 24)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60 * 24));
      formatedDate = `${shownDateNumbers} days`;
    }
    // hours
    else if (dateDiff >= (1000 * 60 * 60)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60 * 60));
      formatedDate = `${shownDateNumbers} hours`;
    }
    // minutes
    else if (dateDiff >= (1000 * 60)) {
      shownDateNumbers = Math.round(dateDiff / (1000 * 60));
      formatedDate = `${shownDateNumbers} minutes`;
    }
    // seconds
    else if (dateDiff >= 0) {
      // the event is basically happening right now
      inFuture = true;
      formatedDate = 'now';
    }

    // takes s from the end if there is only 1 (1 days => 1 day)
    if (shownDateNumbers === 1) {
      formatedDate = formatedDate.slice(0, -1)
    }

    if (!inFuture) {
      formatedDate += ' ago';
    }

    return formatedDate;
  }

  const todoItems = props.todoItems
  const setTodoItems = props.setTodoItems;

  const setEditedTodoItem = props.setEditedTodoItem;

  const setShowWindow = props.setShowWindow;

  return (
    <div className="todo-list">
      <Sort todoItems={todoItems} setTodoItems={setTodoItems} />
      {todoItems.map(todoItem => {
        return (
          <div key={todoItem.id} className={'todo-list-item ' + `${todoItem.priority.name + '-priority'}`}>
            <div>{todoItem.title}</div>
            <div>{formatDate(todoItem.date)}</div>
            <div onClick={() => {
                setEditedTodoItem(todoItem);
                setShowWindow({editItemWindow: true})
              }}>
                edit item
              </div>
          </div>
        );
      })}
      <div className="add-item-button" onClick={() => {
          setShowWindow({addItemWindow: true})
        }}>
          add new item
        </div>
    </div>
  );
}



// makes window that allows user to add new todo items
function AddItemWindow(props) {
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

  const setShowWindow = props.setShowWindow;

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  if (newTodoItem.id === -1) {
    const newTodoItemCopy = copyTodoItem(newTodoItem);
    newTodoItemCopy.id = todoItems.length + 1;
    setNewTodoItem(newTodoItemCopy);
  }
  return (
    <ItemForm
      handleSubmit={addItem}
      todoItem={newTodoItem} setTodoItem={setNewTodoItem}
    />
  );
}



// makes window that allows user to edit old todo items
function EditItemWindow(props) {
  // PUTs todoItem made from user input to the server (replaces old version)
  function updateItem(e) {
    e.preventDefault();
    
    const editId = editedTodoItem.id

    setTodoItems(todoItems.map((todoItem => {
      if (todoItem.id === editId) return editedTodoItem;

      return todoItem;
    })));

    fetch(`http://localhost:3001/todoitems/${editId}`,
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

  const setShowWindow = props.setShowWindow;

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  const editedTodoItem = props.editedTodoItem;
  const setEditedTodoItem = props.setEditedTodoItem;

  return (
    <ItemForm
      handleSubmit={updateItem}
      todoItem={editedTodoItem} setTodoItem={setEditedTodoItem}
    />
  );
}

// makes a form used to edit existing or new todo items
function ItemForm(props) {
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

  const handleSubmit = props.handleSubmit;

  // todo item to be edited or added (stateful value)
  const todoItem = props.todoItem;
  const setTodoItem = props.setTodoItem;

  return (
    <div className="todo-item-form-container">
      <form className="todo-item-form" onSubmit={handleSubmit}>
        <div className="todo-item-input">
          <label htmlFor="title">enter title</label>
          <input type="text" id="title" name="title" value={todoItem.title} onChange={(e) => {
            const copy = copyTodoItem(todoItem);
            copy.title = e.target.value;
            setTodoItem(copy);
          }} />
        </div>
        <div className="todo-item-input">
          <label htmlFor="date">enter date</label>
          <input type="number" id="date" name="date" value={todoItem.date} onChange={(e) => {
            const copy = copyTodoItem(todoItem);
            copy.date = e.target.value;
            setTodoItem(copy);
          }} />
        </div>
        <div className="priority-input">
          <label htmlFor="priority">priority</label>
          <div>
            <div>low</div>
            <input type="radio" id="low-priority" name="priority"
              value="low" checked={todoItem.priority.name === 'low'}
              onChange={(e) => {
                const copy = copyTodoItem(todoItem);
                copy.priority.name = 'low';
                copy.priority.value = 1;
                setTodoItem(copy);
              }}
            />
            <div>medium</div>
            <input type="radio" id="medium-priority" name="priority"
              value="medium" checked={todoItem.priority.name === 'medium'}
              onChange={(e) => {
                const copy = copyTodoItem(todoItem);
                copy.priority.name = 'medium';
                copy.priority.value = 2;
                setTodoItem(copy);
              }}
            />
            <div>high</div>
            <input type="radio" id="high-priority" name="priority"
              value="high" checked={todoItem.priority.name === 'high'}
              onChange={(e) => {
                const copy = copyTodoItem(todoItem);
                copy.priority.name = 'high';
                copy.priority.value = 3;
                setTodoItem(copy);
              }}
            />
           </div>
          </div>
        <input type="submit" />
      </form>
    </div>
  );
}


// used to ask confirmation to delete todo items and delete them
function DeleteItemWindow(props) {
  return (
    <div>

    </div>
  );
}

export default TodoList;