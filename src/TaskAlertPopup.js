import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function TaskAlertPopup() {
  const [tasks, setTasks] = useState([]);
  const [show, setShow] = useState(true);

  const prevCount = useRef(0);
  const intervalRef = useRef(null);

  // ================= TOKEN SAFE =================
  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= SOUND =================
  const playSound = () => {
    try {
      const audio = new Audio(
        "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
      );
      audio.play().catch(() => {});
    } catch {}
  };

  // ================= FETCH ALERTS =================
  const fetchAlerts = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(`${API}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newTasks = res.data?.tasks || [];

      // 🔥 NEW TASK DETECTION
      if (newTasks.length > prevCount.current) {
        playSound();
      }

      prevCount.current = newTasks.length;

      // 🔥 remove duplicates
      const uniqueTasks = Array.from(
        new Map(newTasks.map(t => [t._id, t])).values()
      );

      setTasks(uniqueTasks);

    } catch (err) {
      console.log("Task Alert Error:", err.message);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    fetchAlerts();

    intervalRef.current = setInterval(fetchAlerts, 30000); // 30 sec

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  // ================= AUTO HIDE =================
  useEffect(() => {
    if (tasks.length > 0) {
      const timer = setTimeout(() => {
        setShow(false);
      }, 15000); // 15 sec auto hide

      return () => clearTimeout(timer);
    }
  }, [tasks]);

  if (!show || tasks.length === 0) return null;

  return (
    <div style={styles.popup}>
      <div style={styles.header}>
        <h4>⚠️ Task Alerts</h4>
        <span onClick={() => setShow(false)} style={styles.closeX}>✖</span>
      </div>

      <div style={styles.body}>
        {tasks.slice(0, 5).map(t => (
          <div key={t._id} style={styles.item}>
            ⏰ {t.title}
          </div>
        ))}
      </div>

      <button onClick={() => setShow(false)} style={styles.closeBtn}>
        Close
      </button>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  popup: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#111",
    color: "#fff",
    padding: "15px",
    borderRadius: "12px",
    width: "280px",
    zIndex: 9999,
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  closeX: {
    cursor: "pointer",
    color: "#ff4d4d"
  },

  body: {
    marginTop: "10px"
  },

  item: {
    fontSize: "14px",
    marginBottom: "6px",
    padding: "5px",
    background: "#1f1f1f",
    borderRadius: "6px"
  },

  closeBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "6px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default TaskAlertPopup;