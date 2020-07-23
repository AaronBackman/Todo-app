import React, { useState, useEffect } from 'react';
import './Todolist.css';
import './TodoItemForm.css';
import './TodoItemDelete.css';
import Sort from './Sort.js';
import TodoItem from './TodoItem.js';

function TodoList() {
  const [todoItems, setTodoItems] = useState([]);
  // if a window is shown to make and POST a new todo item
  const [showWindow, setShowWindow] = useState({itemListWindow: true});
  const [editedTodoItem, setEditedTodoItem] = useState({});
  const [deletedTodoItem, setDeletedTodoItem] = useState({});

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
        setDeletedTodoItem={setDeletedTodoItem}
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
      <DeleteItemWindow
        deletedTodoItem={deletedTodoItem}
        setDeletedTodoItem={setDeletedTodoItem}
        todoItems={todoItems} setTodoItems={setTodoItems}
        setShowWindow={setShowWindow}
      />
    )
  }
}

function ItemListWindow(props) {
  const todoItems = props.todoItems
  const setTodoItems = props.setTodoItems;

  const setEditedTodoItem = props.setEditedTodoItem;

  const setDeletedTodoItem = props.setDeletedTodoItem;

  const setShowWindow = props.setShowWindow;

  return (
    <div>
      <Sort todoItems={todoItems} setTodoItems={setTodoItems} />
      <div
        className="todo-list"
        style={{height: `${window.innerHeight - 180}px`}}
      >
        {
          todoItems.map(todoItem => <TodoItem key={todoItem.id}
                                      todoItem={todoItem}
                                      setShowWindow={setShowWindow}
                                      setEditedTodoItem={setEditedTodoItem}
                                      setDeletedTodoItem={setDeletedTodoItem}
                                    />)
        }
      </div>
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
        setNewTodoItem({});
        setShowWindow({itemListWindow: true});
      });
  }

  function firstFreeIndex(todoItems) {
    function checkIfNoMatch(item, value) {
      if (item.id === value) return false;

      return true
    }

    let index = 1;
    while (true) {
      // check if id is unused in the array
      if (todoItems.every(item => checkIfNoMatch(item, index))) {
        break;
      }

      // no unused id (smaller than or equal to length) was found
      // => all smaller id values are used, length + 1 will be the new id
      if (index === todoItems.length + 1) {
        break;
      }

      index++;
    }

    return index;
  }

  // date object to yyyy-mm-dd format
  function dateToString(dateObj) {
    const dateParts = [
                        dateObj.getFullYear(),
                        dateObj.getMonth(),
                        dateObj.getDate(),
                      ];

    if (dateParts[1].toString().length === 1) {
      dateParts[1] = '0' + dateParts[1];
      console.log(dateParts);
    }

    if (dateParts[2].toString().length === 1) {
      dateParts[2] = '0' + dateParts[2];
    }
    
    return dateParts.join('-');
  }

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  const setShowWindow = props.setShowWindow;

  const [newTodoItem, setNewTodoItem] = useState(
    {
      title: '',
      date: dateToString(new Date()),
      priority: {
        name: 'low',
        value: 1,
      },
      id: firstFreeIndex(todoItems),
    }
  );

  // it is not defined => set a new default todo item
  if (newTodoItem.id === undefined) {
    setNewTodoItem(
      {
        title: '',
        date: dateToString(new Date()),
        priority: {
          name: 'low',
          value: 1,
        },
        id: firstFreeIndex(todoItems),
      }
    )
  }

  return (
    <ItemForm
      handleSubmit={addItem}
      todoItem={newTodoItem} setTodoItem={setNewTodoItem}
      setShowWindow={setShowWindow}
    />
  );
}



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
      setShowWindow={setShowWindow}
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

  const setShowWindow = props.setShowWindow;

  return (
    <div className="todo-item-form-container">
      <form className="todo-item-form" onSubmit={handleSubmit}>
        <div className="todo-item-input">
          <label htmlFor="title">enter title</label>
          <input type="text" id="title" name="title" value={todoItem.title} onChange={e => {
            const copy = copyTodoItem(todoItem);
            copy.title = e.target.value;
            setTodoItem(copy);
          }} />
        </div>
        <div className="todo-item-input">
          <label htmlFor="date">enter date</label>
          <input type="date" id="date" name="date" value={todoItem.date} onChange={e => {
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
              onChange={() => {
                const copy = copyTodoItem(todoItem);
                copy.priority.name = 'low';
                copy.priority.value = 1;
                setTodoItem(copy);
              }}
            />
            <div>medium</div>
            <input type="radio" id="medium-priority" name="priority"
              value="medium" checked={todoItem.priority.name === 'medium'}
              onChange={() => {
                const copy = copyTodoItem(todoItem);
                copy.priority.name = 'medium';
                copy.priority.value = 2;
                setTodoItem(copy);
              }}
            />
            <div>high</div>
            <input type="radio" id="high-priority" name="priority"
              value="high" checked={todoItem.priority.name === 'high'}
              onChange={() => {
                const copy = copyTodoItem(todoItem);
                copy.priority.name = 'high';
                copy.priority.value = 3;
                setTodoItem(copy);
              }}
            />
           </div>
          </div>
        <input type="submit" />
        <div className="form-cancel-button" onClick={() => {
            setShowWindow({itemListWindow: true});
            setTodoItem({});
          }}>
          cancel
        </div>
      </form>
    </div>
  );
}


// used to ask confirmation to delete todo items and delete them
function DeleteItemWindow(props) {
  function deleteItem() {
    const deleteId = deletedTodoItem.id

    // filter out the todo item that will be deleted
    setTodoItems(todoItems.filter((todoItem => {
      if (todoItem.id === deleteId) return false;

      return true;
    })));

    fetch(`http://localhost:3001/todoitems/${deleteId}`,
    {
      method: "DELETE",
    })
      .then((response) => {
        setShowWindow({itemListWindow: true});
        setDeletedTodoItem({});
      });
  }

  const deletedTodoItem = props.deletedTodoItem;
  const setDeletedTodoItem = props.setDeletedTodoItem;

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  const setShowWindow = props.setShowWindow;

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

export default TodoList;