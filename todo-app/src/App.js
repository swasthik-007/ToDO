import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("todos"));
      return Array.isArray(saved) ? saved.filter(Boolean) : [];
    } catch {
      return [];
    }
  });
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const today = new Date().toISOString().slice(0, 10);
    todos.forEach((todo) => {
      if (
        todo &&
        todo.dueDate === today &&
        !todo.completed &&
        Notification.permission === "granted"
      ) {
        new Notification("📝 Task Due Today", {
          body: todo.text,
        });
      }
    });
  }, [todos]);

  const handleAdd = () => {
    if (task.trim()) {
      const newTask = { text: task, completed: false, dueDate };
      if (editIndex !== null) {
        const updated = [...todos];
        updated[editIndex] = newTask;
        setTodos(updated);
        setEditIndex(null);
      } else {
        setTodos([...todos, newTask]);
      }
      setTask("");
      setDueDate("");
    }
  };

  const handleToggle = (index) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const handleEdit = (index) => {
    setTask(todos[index].text);
    setDueDate(todos[index].dueDate || "");
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...todos];
    updated.splice(index, 1);
    setTodos(updated);
  };

  const filteredTodos = todos.filter(Boolean).filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div
      className={`py-5 ${
        darkMode ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{ minHeight: "100vh" }}
    >
      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="d-flex justify-content-center mb-4">
          <motion.h1
            className="fw-bold"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
          >
            📝 To-Do List
          </motion.h1>
        </div>

        <div className="d-flex justify-content-end mb-3">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              id="darkModeSwitch"
            />
            <label className="form-check-label ms-2" htmlFor="darkModeSwitch">
              Dark Mode
            </label>
          </div>
        </div>

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-5">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="col-md-3 d-grid">
                <button className="btn btn-primary" onClick={handleAdd}>
                  {editIndex !== null ? "Update" : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mb-3">
          <div className="btn-group">
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
        </div>

        <ul className="list-group">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.li
                key={index}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  todo.completed ? "list-group-item-success" : ""
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{
                  opacity: 1,
                  y: [0, -8, 0],
                  transition: {
                    y: {
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                    },
                  },
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div
                  className="d-flex flex-column"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleToggle(index)}
                >
                  <span
                    style={{
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                  >
                    {todo.text}
                  </span>
                  {todo.dueDate && (
                    <small className="text-muted">{todo.dueDate}</small>
                  )}
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-outline-warning me-2"
                    onClick={() => handleEdit(index)}
                  >
                    ✏️
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(index)}
                  >
                    ❌
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
     
    </div>
  );
}

export default App;
