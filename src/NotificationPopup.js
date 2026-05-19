import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const API = "http://localhost:5000/api";
const socket = io("http://localhost:5000");

function NotificationPopup() {

  const [alerts, setAlerts] = useState([]);
  const [userInteracted, setUserInteracted] = useState(false);

  const prevIds = useRef(new Set());

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= ENABLE SOUND =================
  useEffect(() => {
    const enableSound = () => setUserInteracted(true);
    window.addEventListener("click", enableSound);

    return () => window.removeEventListener("click", enableSound);
  }, []);

  const playSound = () => {
    if (!userInteracted) return;

    try {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.play().catch(() => {});
    } catch {}
  };

  // ================= LOAD ALERTS =================
  const loadAlerts = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.success && Array.isArray(data.leads)) {

        const today = new Date().toDateString();

        const filtered = data.leads.filter(l =>
          l?.nextFollowUp &&
          new Date(l.nextFollowUp).toDateString() === today
        );

        // ✅ REMOVE DUPLICATES
        const unique = Array.from(
          new Map(filtered.map(item => [item._id, item])).values()
        );

        // ✅ CHECK NEW ALERTS
        const newIds = new Set(unique.map(a => a._id));
        const hasNew = [...newIds].some(id => !prevIds.current.has(id));

        if (hasNew) playSound();

        prevIds.current = newIds;

        setAlerts(unique);
      }

    } catch (err) {
      console.log("Notification Error:", err?.message);
    }
  };

  // ================= SOCKET REALTIME =================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.companyId) {
      socket.emit("joinCompany", user.companyId);
    }

    socket.on("leadFollowup", (lead) => {
      setAlerts(prev => {
        const exists = prev.find(p => p._id === lead._id);
        if (exists) return prev;

        playSound();
        return [lead, ...prev];
      });
    });

    return () => {
      socket.off("leadFollowup");
    };
  }, []);

  // ================= AUTO LOAD =================
  useEffect(() => {
    loadAlerts();

    const interval = setInterval(loadAlerts, 15000);
    return () => clearInterval(interval);

  }, []);

  // ================= REMOVE ALERT =================
  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(a => a._id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div style={styles.container}>

      {alerts.map((a) => (
        <div key={a._id} style={styles.card}>

          <div>
            <b>{a.name}</b>
            <p>📞 {a.phone}</p>
            <p>🔔 Follow-up Today</p>
          </div>

          <button
            onClick={() => removeAlert(a._id)}
            style={styles.closeBtn}
          >
            ✖
          </button>

        </div>
      ))}

    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    position: "fixed",
    top: "20px",
    right: "20px",
    width: "300px",
    zIndex: 9999
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    borderLeft: "5px solid #ef4444",
    animation: "fadeIn 0.3s ease"
  },

  closeBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "5px 8px",
    cursor: "pointer"
  }
};

export default NotificationPopup;