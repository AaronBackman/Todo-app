import React from 'react';

function Sort(props) {
  // yyyy-mm-dd to milliseconds since 1970
  function parseDate(date){
    const parts = date.split('-');

    // in a date object months is zero-based
    parts[1] = parts[1] - 1;

    const dateObj = new Date(parts[0], parts[1], parts[2]);

    return dateObj.getTime();
  }

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  const sortByPriority = () => {
    const newTodoItems = todoItems.concat();

    newTodoItems.sort((a, b) => {
      return b.priority.value - a.priority.value;
    });

    setTodoItems(newTodoItems);
  };

  const sortByRemainingTime = () => {
    const newTodoItems = todoItems.concat();

    // sorts the ones that come earlier first
    newTodoItems.sort((a, b) => {
      // changes date string to milliseconds since 1970 and subtracts them
      return parseDate(a.date) - parseDate(b.date);
    });

    setTodoItems(newTodoItems);
  };

  return (
    <div className="sort-bar">
      <div className="sort-bar-text"
        onClick={sortByPriority}>Sort by priority
      </div>
      <div className="sort-bar-text"
        onClick={sortByRemainingTime}>Sort by remaining time
      </div>
    </div>
  );
}

export default Sort;