import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import API from "./api/api";
import { io } from "socket.io-client"; 
const socket = io(
  process.env.REACT_APP_SOCKET_URL || "https://crm-backend-production-eec9.up.railway.app/api"
);


function TaskDashboard() {
  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]); // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
  title: "",
  description: "",
  dueDate: "",
  lead: "",
  priority: "Medium",
  assignedTo: ""   // ✅ NEW
});
  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  };

  // ================= LOAD =================
  const loadData = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      setLoading(true);

      const headers = { Authorization: `Bearer ${token}` };

      const [taskRes, leadRes, userRes] = await Promise.all([
  axios.get(`${API}/tasks`, { headers }),
  axios.get(`${API}/leads`, { headers }),
  axios.get(`${API}/users`, { headers }) // ✅ NEW
]);

setTasks(
  (taskRes.data?.tasks || []).sort(
    (a, b) =>
      new Date(b.createdAt) -
      new Date(a.createdAt)
  )
);

setLeads(leadRes.data?.leads || []);

setUsers(userRes.data?.users || []);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
  if (error) {

    const t = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(t);
  }
}, [error]);
useEffect(() => {
  if (success) {

    const t = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(t);
  }
}, [success]);
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user?.companyId) return;

  socket.emit("joinCompany", user.companyId);

  socket.on("taskCreated", (task) => {
    setTasks(prev => [task, ...prev]);
  });

  
    

socket.on("taskUpdated", (updatedTask) => {
  setTasks(prev =>
    prev.map(t =>
      t._id === updatedTask._id
        ? updatedTask
        : t
    )
  );
});

socket.on("taskDeleted", (taskId) => {
  setTasks(prev =>
    prev.filter(t => t._id !== taskId)
  );
});

  return () => {
    socket.off("taskCreated");
    socket.off("taskUpdated");
    socket.off("taskDeleted");
  };
}, []);
  // ================= CREATE =================
  const createTask = async () => {
    setCreating(true);
    try {
      const token = getToken();

      if (!form.title.trim()) {
  return setError("Title required");
}

if (form.title.trim().length < 3) {
  return setError("Title too short");
}

      const payload = { ...form };
      if (form.dueDate) {

  const today = new Date();
  today.setHours(0,0,0,0);

  const selected = new Date(form.dueDate);

  if (selected < today) {
    return setError("Due date cannot be past");
  }
}

// ✅ FIX ASSIGNED USER
if (payload.assignedTo) {
  payload.user = payload.assignedTo;
}
delete payload.assignedTo;

      if (!payload.lead || payload.lead.length !== 24) {
        delete payload.lead;
      }

      if (!payload.dueDate) {
        delete payload.dueDate;
      }

      const res = await axios.post(`${API}/tasks`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(prev => [res.data.task, ...prev]);
      setSuccess("Task Created Successfully");

      setForm({
  title: "",
  description: "",
  dueDate: "",
  lead: "",
  priority: "Medium",
  assignedTo: ""
});

      setShowForm(false);
      setCreating(false);

    } catch (err) {
      console.error(err);
      setError("Create failed");
    }
  };

  // ================= DELETE =================
  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;

    try {
      const token = getToken();

      await axios.delete(`${API}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(prev => prev.filter(t => t._id !== id));

    } catch {
      setError("Delete failed");
    }
  };

  // ================= STATUS =================
  const updateStatus = async (id, status) => {
    try {
      const token = getToken();

      await axios.put(`${API}/tasks/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTasks(prev =>
        prev.map(t => t._id === id ? { ...t, status } : t)
      );

    } catch {
      setError("Update failed");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t =>
      t.title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const getLeadName = (task) => {
    if (task.lead && typeof task.lead === "object") {
      return task.lead.name;
    }
    const lead = leads.find(l => l._id === task.lead);
    return lead ? lead.name : "N/A";
  };

  const getUserName = (task) => {
    if (task.user && typeof task.user === "object") {
      return task.user.name;
    }
    return "N/A";
  };

  return (
    <div style={styles.container}>
      <h2>📋 Task Dashboard</h2>

      <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
        ➕ Add Task
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && (
  <p style={{ color: "green" }}>
    {success}
  </p>
)}

      {showForm && (
        <div style={styles.form}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="date"
            onChange={e => setForm({ ...form, dueDate: e.target.value })}
          />

          <select
            value={form.lead}
            onChange={e => setForm({ ...form, lead: e.target.value })}
          >
            <option value="">Select Lead</option>
            {leads.map(l => (
              <option key={l._id || l.id} value={l._id || l.id}>
                {l.name}
              </option>
            ))}
          </select>
<select
  value={form.priority}
  onChange={e => setForm({ ...form, priority: e.target.value })}
>
  <option value="Low">🟢 Low</option>
  <option value="Medium">🟡 Medium</option>
  <option value="High">🔴 High</option>
</select>
<select
  value={form.assignedTo}
  onChange={e => setForm({ ...form, assignedTo: e.target.value })}
>
  <option value="">Assign User</option>
  {users.map(u => (
    <option key={u._id} value={u._id}>
      {u.name}
    </option>
  ))}
</select>
          <button
  onClick={createTask}
  disabled={creating}
>
  {creating ? "Creating..." : "Create"}
</button>
        </div>
      )}

      <input
        placeholder="Search task..."
        onChange={e => setSearch(e.target.value)}
        style={styles.search}
      />

      {loading && <p>Loading...</p>}
{filteredTasks.length === 0 && (
  <p>No Tasks Found</p>
)}
      {/* ✅ FIXED MAP */}
      {filteredTasks.map(task => (
        <div
          key={task._id}
          style={styles.card(task.priority)}
          onClick={() => setSelectedTask(task)}
        >
          <b>{task.title}</b>

          <p>👤 Lead: {getLeadName(task)}</p>
          <p>👨‍💼 Assigned: {getUserName(task)}</p>

          <p>📅 Created: {formatDateTime(task.createdAt)}</p>
          <p>📌 Due: {formatDateTime(task.dueDate)}</p>

          <select
            value={task.status}
            onClick={(e) => e.stopPropagation()}
            onChange={e => updateStatus(task._id, e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <button
            style={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task._id);
            }}
          >
            Delete
          </button>
        </div>
      ))}

      {/* ✅ FIXED MODAL */}
      {selectedTask && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>

            <h3>{selectedTask.title}</h3>

            <p><b>Description:</b> {selectedTask.description || "N/A"}</p>
            <p><b>Status:</b> {selectedTask.status}</p>
            <p><b>Priority:</b> {selectedTask.priority}</p>

            <p><b>Lead:</b> {getLeadName(selectedTask)}</p>
            <p><b>Assigned:</b> {getUserName(selectedTask)}</p>

            <p><b>Created:</b> {formatDateTime(selectedTask.createdAt)}</p>
            <p><b>Due:</b> {formatDateTime(selectedTask.dueDate)}</p>

            <button onClick={() => setSelectedTask(null)}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  search: { padding: "8px", margin: "10px 0" },
  card: (priority) => ({
    cursor: "pointer",
transition: "0.2s",
  borderLeft: `5px solid ${
    priority === "High" ? "red" :
    priority === "Medium" ? "orange" : "green"
  }`,
  borderRadius: "8px",
  padding: "15px",
  margin: "10px 0",
  background:
  priority === "High"
    ? "#ffe5e5"
    : priority === "Medium"
    ? "#fff4db"
    : "#e8fff1",
}),
  deleteBtn: { background: "red", color: "#fff" },
  addBtn: { marginBottom: "10px", padding: "10px", background: "green", color: "#fff" },
  form: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "15px" },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "90%",
maxWidth: "320px"
  }
};

export default TaskDashboard;