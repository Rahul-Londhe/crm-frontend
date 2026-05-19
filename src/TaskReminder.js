import React, { useEffect, useState, useRef } from "react";

const API = "http://localhost:5000/api";

function TaskReminder() {

  const [tasks, setTasks] = useState([]);

  // ✅ prevent duplicate alerts
  const shownAlerts = useRef(new Set());

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ---------------- FETCH TASKS ----------------
  const fetchTasks = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.log("Tasks API failed");
        return;
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }

    } catch (err) {
      console.error("Task Fetch Error:", err.message);
    }
  };

  // ---------------- CHECK REMINDER ----------------
  const checkReminder = () => {
    const now = new Date();

    tasks.forEach(task => {

      // ✅ skip invalid tasks
      if (!task.dueDate) return;

      const status = (task.status || "").toLowerCase();
      if (status === "done" || status === "completed") return;

      const due = new Date(task.dueDate);
      const diff = due - now;

      // 🔔 show only once
      if (diff > 0 && diff < 60000) {

        if (!shownAlerts.current.has(task._id)) {
          shownAlerts.current.add(task._id);

          alert(`🔔 Task Due: ${task.title}`);
        }

      }
    });
  };

  // ---------------- INITIAL LOAD ----------------
  useEffect(() => {
    fetchTasks();
  }, []);

  // ---------------- INTERVAL ----------------
  useEffect(() => {

    const interval = setInterval(() => {
      checkReminder();
    }, 30000); // every 30 sec

    return () => clearInterval(interval);

  }, [tasks]);

  return null;
}

export default TaskReminder;