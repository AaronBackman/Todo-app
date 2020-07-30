import React, { useState, useEffect } from 'react';
import './Todolist.css';
import './TodoItemForm.css';
import './TodoItemDelete.css';
import TodoListPart from './TodoListPart.js';

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

function ItemListWindow(props) {
  // divides into parts containing different todoItems
  //(eg. before today, today, in a week, in a month...)
  function divideIntoPartsByTime(todoItems) {
    // filters items in timerange
    //for example (tomorrow: between days 1 and 2)
    function betweenDays(todoItems, beginDay, endDay) {
      const sorted = todoItems.filter(todoItem => {
        return (
          (parseDate(todoItem.date) >= getTodayTimeStamp() + beginDay * day) &&
          (parseDate(todoItem.date) < (getTodayTimeStamp() + endDay * day))
        );
      });

      return sorted;
    }

    const todoItemsInParts = [];

    //day in milliseconds
    const day = 1000 * 60 * 60 * 24;

    // todoItems that have deadline before today
    const late =
      todoItems
        .filter(todoItem => {
          return parseDate(todoItem.date) < getTodayTimeStamp();
        });

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
    const longTime =
      todoItems
        .filter(todoItem => {
          return parseDate(todoItem.date) >= (getTodayTimeStamp() + day * 31);
        });
    todoItemsInParts.push(longTime);

    return todoItemsInParts;
  }

  // yyyy-mm-dd to milliseconds since 1970
  function parseDate(date){
    const parts = date.split('-');

    // in a date object months is zero-based
    parts[1] = parts[1] - 1;

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
    setDeletedTodoItem, setShowWindow
  } = props;

  // divides uncompleted todoitems into parts
  const todoItemsInParts = divideIntoPartsByTime(
    todoItems.filter(todoItem => (todoItem.isCompleted === false))
  );

  // filters completed todoitems
  const completedTodoItems = todoItems.filter(todoItem => (todoItem.isCompleted === true));

  return (
    <div>
      <div
        className="todo-list"
        style={{height: `${window.innerHeight - 131}px`}}
      >
        <TodoListPart
          text="late"
          todoItemPart={todoItemsInParts[0]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="today"
          todoItemPart={todoItemsInParts[1]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="tomorrow"
          todoItemPart={todoItemsInParts[2]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="a week"
          todoItemPart={todoItemsInParts[3]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="2 weeks"
          todoItemPart={todoItemsInParts[4]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="a month"
          todoItemPart={todoItemsInParts[5]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="later"
          todoItemPart={todoItemsInParts[6]}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
        <TodoListPart
          text="completed"
          todoItemPart={completedTodoItems}
          setShowWindow={setShowWindow}
          setEditedTodoItem={setEditedTodoItem}
          setDeletedTodoItem={setDeletedTodoItem}
          todoItems={todoItems}
          setTodoItems={setTodoItems}
        />
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

    fetch(path + '/todoitems',
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

  const {todoItems, setTodoItems, setShowWindow} = props;

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

    fetch(`${path}/todoitems/${editId}`,
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

  const {
    setShowWindow, todoItems, setTodoItems,
    editedTodoItem, setEditedTodoItem
  } = props;

  return (
    <ItemForm
      handleSubmit={updateItem}
      todoItem={editedTodoItem} setTodoItem={setEditedTodoItem}
      setShowWindow={setShowWindow}
    />
  );
}

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


// used to ask confirmation to delete todo items and delete them
function DeleteItemWindow(props) {
  function deleteItem() {
    const deleteId = deletedTodoItem.id

    // filter out the todo item that will be deleted
    setTodoItems(todoItems.filter((todoItem => {
      if (todoItem.id === deleteId) return false;

      return true;
    })));

    fetch(`${path}/todoitems/${deleteId}`,
    {
      method: "DELETE",
    })
      .then((response) => {
        setShowWindow({itemListWindow: true});
        setDeletedTodoItem({});
      });
  }

  const {
    deletedTodoItem, setDeletedTodoItem,
    todoItems, setTodoItems, setShowWindow
  } = props;

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