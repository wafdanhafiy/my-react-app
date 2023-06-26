import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const inputRef = useRef(null);

  // Function to export todos as JSON
  const handleExport = () => {
    const data = JSON.stringify(todos, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'todos.json';
    link.click();
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      if (editIndex === -1) {
        // Add new todo
        setTodos([...todos, inputValue]);
        setInputValue(''); // Mengosongkan input setelah menambahkan daftar
      } else {
        // Edit existing todo
        const newTodos = [...todos];
        newTodos[editIndex] = inputValue;
        setTodos(newTodos);
        setEditIndex(-1);
        setInputValue('');
      }
    }
  };

  const handleDeleteTodo = (index) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setInputValue(todos[index]);
  };

  const handleSaveEditTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodos = [...todos];
      newTodos[editIndex] = inputValue;
      setTodos(newTodos);
      setEditIndex(-1);
      setInputValue('');
    }
  };

  const handleCancelEditTodo = () => {
    setEditIndex(-1);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (editIndex === -1) {
        handleAddTodo();
      } else {
        handleSaveEditTodo();
      }
    }
  };

  useEffect(() => {
    if (editIndex !== -1) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editIndex]);

  return (
    <div className="container">
      <h1 className="header">Todo App</h1>
      <div className="add-todo">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a task"
          disabled={editIndex !== -1}
        />
        <button onClick={handleAddTodo}>{editIndex === -1 ? 'Add' : 'Update'}</button>
      </div>
      {todos.length > 0 && (
        <div className="card">
          <ul className="todo-list">
            {todos.map((todo, index) => (
              <li key={index} className="todo-item">
                {editIndex === index ? (
                  <>
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      />
                      <div>
                        <button onClick={handleSaveEditTodo} className="edit-button">Save</button>
                        <button onClick={handleCancelEditTodo}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{todo}</span>
                      <div>
                        <button onClick={() => handleEditTodo(index)} className="edit-button">Edit</button>
                        <button onClick={() => handleDeleteTodo(index)}>Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {todos.length > 0 && (
          <div className="button-group">
            <div className="export-button-container">
              <button onClick={handleExport} className="export-button" disabled={todos.length === 0}>
                Export as JSON
              </button>
            </div>
            <button onClick={() => setTodos([])} className="clear-button" disabled={todos.length === 0}>
              Clear All
            </button>
          </div>
        )}
      </div>
    );
  };
  
export default App;
