import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function TaskForm({ fetchTasks }) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    lead: ""
  });

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= TOKEN =================
  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= LOAD LEADS =================
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await axios.get(`${API}/leads`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setLeads(res.data?.leads || []);
      } catch (err) {
        console.error("Lead Load Error:", err.message);
      }
    };

    loadLeads();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return alert("Enter title");
    }

    setLoading(true);

    try {
      const token = getToken();

      if (!token) {
        alert("Login again");
        return;
      }

      // ✅ VALIDATE LEAD ID
      const validLead =
        form.lead && form.lead.length === 24 ? form.lead : null;

      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate || null,
        lead: validLead,
        status: "Pending"
      };

      const res = await axios.post(`${API}/tasks`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        alert("✅ Task Added");

        fetchTasks?.();

        // RESET FORM
        setForm({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
          lead: ""
        });
      }

    } catch (err) {
      console.error("Task Error:", err?.response?.data || err.message);
      alert(err.response?.data?.message || "❌ Failed to add task");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>

      <input
        placeholder="Task Title"
        value={form.title}
        onChange={(e)=>setForm({...form,title:e.target.value})}
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e)=>setForm({...form,description:e.target.value})}
      />

      <input
        type="date"
        value={form.dueDate}
        onChange={(e)=>setForm({...form,dueDate:e.target.value})}
      />

      <select
        value={form.priority}
        onChange={(e)=>setForm({...form,priority:e.target.value})}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      {/* ✅ LEAD DROPDOWN */}
      <select
        value={form.lead}
        onChange={(e)=>setForm({...form,lead:e.target.value})}
      >
        <option value="">Assign Lead</option>
        {leads.map(l => (
          <option key={l._id} value={l._id}>
            {l.name}
          </option>
        ))}
      </select>

      <button disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>

    </form>
  );
}

// ================= STYLES =================
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "300px"
  }
};

export default TaskForm;