import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (task.trim()) {
      if (editIndex !== null) {
        const updatedTodos = [...todos];
        updatedTodos[editIndex].text = task;
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        setTodos([...todos, { text: task, completed: false }]);
      }
      setTask("");
    }
  };
  const handleEdit = (index) => {
    setTask(todos[index].text);
    setEditIndex(index);
  };

  const handleToggle = (index) => {
    const updatedTodos = [...todos];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    setTodos(updatedTodos);
  };

  const handleDelete = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <div className="App">
      <h2>📝 To-Do List</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} className={todo.completed ? "completed" : ""}>
            <span onClick={() => handleToggle(index)}>{todo.text}</span>
            <button onClick={() => handleEdit(index)}>✏️</button>

            <button onClick={() => handleDelete(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
