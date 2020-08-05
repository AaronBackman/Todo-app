import React, { useState } from 'react';

import TodoItemForm from './TodoItemForm.js';

// makes window that allows user to add new todo items
function AddItemWindow(props) {
  // POSTs todoItem made from user input to the server (adds new item)
  function addItem(e) {
    e.preventDefault();

    const username = credentials.username;
    const password = credentials.password;

    setTodoItems(todoItems.concat(newTodoItem));
    setNewTodoItem({});
    setShowWindow({itemListWindow: true});

    fetch(path + `/todoitems/${username}/${password}`,
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(newTodoItem),
    });
  }

  // return first unused index (id) in todoItems
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
                        dateObj.getMonth() + 1, // date object month is 0 based
                        dateObj.getDate(),
                      ];

    if (dateParts[1].toString().length === 1) {
      dateParts[1] = '0' + dateParts[1];
    }

    if (dateParts[2].toString().length === 1) {
      dateParts[2] = '0' + dateParts[2];
    }
    
    return dateParts.join('-');
  }

  const {todoItems, setTodoItems, setShowWindow, path, credentials} = props;

  const [newTodoItem, setNewTodoItem] = useState(
    {
      title: '',
      date: dateToString(new Date()),
      priority: {
        name: 'low',
        value: 1,
      },
      isCompleted: false,
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
        isCompleted: false,
        id: firstFreeIndex(todoItems),
      }
    )
  }

  return (
    <TodoItemForm
      handleSubmit={addItem}
      todoItem={newTodoItem} setTodoItem={setNewTodoItem}
      setShowWindow={setShowWindow}
    />
  );
}

export default AddItemWindow;