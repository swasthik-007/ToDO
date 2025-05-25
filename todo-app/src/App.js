import React, { useState, useEffect } from "react";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (task.trim()) {
      if (editIndex !== null) {
        const updated = [...todos];
        updated[editIndex].text = task;
        setTodos(updated);
        setEditIndex(null);
      } else {
        setTodos([...todos, { text: task, completed: false }]);
      }
      setTask("");
    }
  };

  const handleToggle = (i) => {
    const updated = [...todos];
    updated[i].completed = !updated[i].completed;
    setTodos(updated);
  };

  const handleEdit = (i) => {
    setTask(todos[i].text);
    setEditIndex(i);
  };

  const handleDelete = (i) => {
    setTodos(todos.filter((_, index) => index !== i));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📝 To-Do List</h2>
      <div className="input-group mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="btn-group mb-3">
        <button
          className={`btn btn-outline-secondary ${
            filter === "all" ? "active" : ""
          }`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={`btn btn-outline-secondary ${
            filter === "active" ? "active" : ""
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`btn btn-outline-secondary ${
            filter === "completed" ? "active" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <ul className="list-group">
        {filteredTodos.map((todo, index) => (
          <li
            key={index}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              todo.completed ? "list-group-item-success" : ""
            }`}
          >
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => handleToggle(index)}
            >
              {todo.text}
            </span>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEdit(index)}
              >
                ✏️
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(index)}
              >
                ❌
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
