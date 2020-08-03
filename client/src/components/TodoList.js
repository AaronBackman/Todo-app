import React, { useState, useEffect } from 'react';
import 'components/Todolist.css';
import 'components/TodoItemForm.css';
import 'components/TodoItemDelete.css';

const path = 'http://localhost:9000';

function TodoList() {
  function sortByRemainingTime(todoItems) {
    const newTodoItems = todoItems.concat();

    // sorts the ones that come earlier first
    newTodoItems.sort((a, b) => {
      // changes date string to milliseconds since 1970 and subtracts them
      return parseDate(a.date) - parseDate(b.date);
    });

    return newTodoItems;
  }

  // yyyy-mm-dd to milliseconds since 1970
  function parseDate(date){
    const parts = date.split('-');

    // in a date object months is zero-based
    parts[1] = parts[1] - 1;

    const dateObj = new Date(parts[0], parts[1], parts[2]);

    return dateObj.getTime();
  }

  const [todoItems, setTodoItems] = useState([]);
  // if a window is shown to make and POST a new todo item
  const [showWindow, setShowWindow] = useState({itemListWindow: true});
  const [editedTodoItem, setEditedTodoItem] = useState({});
  const [deletedTodoItem, setDeletedTodoItem] = useState({});

  useEffect(() => {
    fetch(path + '/todoitems')
      .then((response => response.json()))
      .then(data => setTodoItems(sortByRemainingTime(data.todoItems)));
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

export default TodoList;