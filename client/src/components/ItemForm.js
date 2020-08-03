import React from 'react';

// makes a form used to edit an existing todoitem or add a new todoitem
function ItemForm(props) {
  function copyTodoItem(todoItem) {
    return {
      title: todoItem.title,
      date: todoItem.date,
      priority: {
        name: todoItem.priority.name,
        value: todoItem.priority.value,
      },
      isCompleted: todoItem.isCompleted,
      id: todoItem.id,
    };
  }

  const {handleSubmit, todoItem, setTodoItem, setShowWindow} = props;

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

export default ItemForm;