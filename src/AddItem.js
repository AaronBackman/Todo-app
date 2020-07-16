import React from 'react';
import './AddItem.css';

function AddItem(props) {
  const isShown = props.isShown;
  const setIsShown = props.setIsShown;

  const todoItems = props.todoItems;
  const setTodoItems = props.setTodoItems;

  // in this case this component is not shown
  if (!isShown) {
    return (
      <>
      </>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();

    const title = document
                    .getElementById('title')
                    .value;

    const date = document
                    .getElementById('date')
                    .value;

    const priority = (() => {
      const prioritySelection = e.target.priority.value;

      let priority = {};
      let priorityValue;

      switch(prioritySelection) {
        case 'low':
          priorityValue = 1;
          break;
        case 'medium':
          priorityValue = 2;
          break;
        case 'high':
          priorityValue = 3;
          break;
        default:
          break;
      }

      priority = {
        name: prioritySelection,
        value: priorityValue,
      };

      return priority;
    })();

    const todoItem = {
      title: title,
      date: date,
      priority: priority,
      id: todoItems.length + 1,
    };

    fetch('http://localhost:3001/todoitems',
    {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(todoItem),
    })
      .then((response) => {
        setTodoItems(todoItems.concat(todoItem));
        setIsShown(false);
      });
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">enter title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="date">enter date</label>
        <input type="number" id="date" name="date" />
        <input type="radio" id="high-priority" name="priority" value="high" />
        <input type="radio" id="medium-priority" name="priority" value="medium" />
        <input type="radio" id="low-priority" name="priority" value="low" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default AddItem;