import React from 'react';

function Sort(props) {
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
      return a.date - b.date;
    });

    setTodoItems(newTodoItems);
  };

  return (
    <div className="sort-bar">
      <div onClick={sortByPriority}>Sort by priority</div>
      <div onClick={sortByRemainingTime}>Sort by remaining time</div>
    </div>
  );
}

export default Sort;