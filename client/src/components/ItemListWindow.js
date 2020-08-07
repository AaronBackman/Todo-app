import React from 'react';

import TodoListPart from './TodoListPart.js';

import '../styles/ItemListWindow.css';

function ItemListWindow(props) {
  // divides into parts containing different todoItems
  // (eg. before today, today, in a week, in a month...)
  function divideIntoPartsByTime(todoItems) {
    // filters items in timerange
    // for example (tomorrow: between days 1 and 2)
    function betweenDays(todoItems, beginDay, endDay) {
      const sorted = todoItems.filter((todoItem) => (
        (parseDate(todoItem.date) >= getTodayTimeStamp() + beginDay * day)
          && (parseDate(todoItem.date) < (getTodayTimeStamp() + endDay * day))
      ));

      return sorted;
    }

    const todoItemsInParts = [];

    // day in milliseconds
    const day = 1000 * 60 * 60 * 24;

    // todoItems that have deadline before today
    const late = todoItems
      .filter((todoItem) => parseDate(todoItem.date) < getTodayTimeStamp());

    todoItemsInParts.push(late);

    // todoItems that have deadline today
    const today = betweenDays(todoItems, 0, 1);
    todoItemsInParts.push(today);

    // todoItems that have deadline tomorrow
    const tomorrow = betweenDays(todoItems, 1, 2);
    todoItemsInParts.push(tomorrow);

    // todoItems that have deadline next week (but after tomorrow)
    const nextWeek = betweenDays(todoItems, 2, 7);
    todoItemsInParts.push(nextWeek);

    // todoItems that have deadline in next two week
    const nextTwoWeeks = betweenDays(todoItems, 7, 14);
    todoItemsInParts.push(nextTwoWeeks);

    // todoItems that have deadline next month
    const nextMonth = betweenDays(todoItems, 14, 31);
    todoItemsInParts.push(nextMonth);

    // todo items that have deadline in a long time (over a month)
    const longTime = todoItems
      .filter((todoItem) => parseDate(todoItem.date) >= (getTodayTimeStamp() + day * 31));
    todoItemsInParts.push(longTime);

    return todoItemsInParts;
  }

  // yyyy-mm-dd to milliseconds since 1970
  function parseDate(date) {
    const parts = date.split('-');

    // in a date object months is zero-based
    parts[1] -= 1;

    const dateObj = new Date(parts[0], parts[1], parts[2]);

    return dateObj.getTime();
  }

  // gets timestamp (milliseconds since 1970) for today morning clock 0:00
  function getTodayTimeStamp() {
    const now = new Date();

    const todayMorning = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    return todayMorning.getTime();
  }

  const {
    todoItems, setTodoItems, setEditedTodoItem,
    setDeletedTodoItem, setShowWindow,
    path, credentials,
  } = props;

  // divides uncompleted todoitems into parts
  const todoItemsInParts = divideIntoPartsByTime(
    todoItems.filter((todoItem) => (todoItem.isCompleted === false)),
  );

  // filters completed todoitems
  const completedTodoItems = todoItems.filter((todoItem) => (todoItem.isCompleted === true));

  return (
    <div
      className="todo-list-container"
      onMouseDown={(e) => (e.preventDefault())}
    >
      <div
        className="todo-list"
        style={{ height: `${window.innerHeight - 144}px` }}
      >
        <TodoListPart
          text="late"
          todoItemPart={todoItemsInParts[0]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="today"
          todoItemPart={todoItemsInParts[1]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="tomorrow"
          todoItemPart={todoItemsInParts[2]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="a week"
          todoItemPart={todoItemsInParts[3]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="2 weeks"
          todoItemPart={todoItemsInParts[4]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="a month"
          todoItemPart={todoItemsInParts[5]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="later"
          todoItemPart={todoItemsInParts[6]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
        <TodoListPart
          text="completed"
          todoItemPart={completedTodoItems}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
          path={path}
          credentials={credentials}
        />
      </div>
      <div
        className="add-item-button"
        onClick={() => {
          setShowWindow({ addItemWindow: true });
        }}
      >
        add new item
      </div>
    </div>
  );
}

export default ItemListWindow;
