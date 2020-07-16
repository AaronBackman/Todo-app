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

    const todoItem = {
      title: title,
      date: date,
      priority: {
        name: "high",
        value: 3,
      },
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
        <input type="text" id="date" name="date" />
        <label htmlFor="priority">select priority</label>
        <input type="radio" name="priority" value="high" />
        <input type="radio" name="priority" value="medium" />
        <input type="radio" name="priority" value="low" />
        <input type="submit" />
      </form>
    </div>
  );
}

export default AddItem;