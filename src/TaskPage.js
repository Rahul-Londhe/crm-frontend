import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function TaskPage() {

  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: ""
  });

  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // ================= SAFE ID =================
  const getId = (task) => task._id || task.id;

  // ---------------- LOAD ----------------
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setTasks(data.tasks || []);
      }

    } catch (err) {
      console.log("Fetch Error:", err);
    }
  };

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  // ---------------- FORM ----------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ---------------- ADD ----------------
  const addTask = async () => {

    if (!form.title.trim()) {
      alert("Enter Task Title");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          status: "Pending"
        })
      });

      const data = await res.json();

      if (data.success) {
        setTasks(prev => [data.task, ...prev]);

        setForm({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: ""
        });
      }

    } catch (err) {
      console.log("Add Error:", err);
    }

    setLoading(false);
  };

  // ---------------- DELETE ----------------
  const deleteTask = async (task) => {

    const id = getId(task);

    if (!id) return alert("Invalid ID");

    if (!window.confirm("Delete this task?")) return;

    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setTasks(prev => prev.filter(t => getId(t) !== id));
      }

    } catch (err) {
      console.log("Delete Error:", err);
    }
  };

  // ---------------- STATUS ----------------
  const changeStatus = async (task, status) => {

    const id = getId(task);

    if (!id) return alert("Invalid ID");

    try {
      const res = await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      const data = await res.json();

      if (data.success) {
        setTasks(prev =>
          prev.map(t => getId(t) === id ? data.task : t)
        );
      }

    } catch (err) {
      console.log("Status Error:", err);
    }
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px" }}>

      <h2>📝 Task Management</h2>

      {/* FORM */}
      <div style={{
        background: "#f9fafb",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "20px"
      }}>

        <input
          name="title"
          placeholder="Task Title *"
          value={form.title}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br /><br />

        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <br /><br />

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
        />

        <br /><br />

        <button onClick={addTask} disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>

      </div>

      {/* LIST */}
      {tasks.map(task => (

        <div key={getId(task)} style={{
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "10px",
          background: "#fff"
        }}>

          <h4>{task.title}</h4>
          <p>{task.description}</p>

          <p>Priority: {task.priority}</p>
          <p>
            Due: {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No Date"}
          </p>

          <select
            value={task.status}
            onChange={(e) => changeStatus(task, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <br /><br />

          <button onClick={() => deleteTask(task)}>
            🗑 Delete
          </button>

        </div>
      ))}

    </div>
  );
}

export default TaskPage;