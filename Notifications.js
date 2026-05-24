import React, { useEffect, useState } from "react";

function Notifications() {

  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // ---------------- FETCH ----------------
  const fetchNotifications = async () => {

    if (!token) return;

    try {
      const res = await fetch("https://crm-backend-production-eec9.up.railway.app/api/notifications/today", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ SAFE CHECK
      if (!res.ok) {
        console.log("Notification API not working");
        return;
      }

      const data = await res.json();

      if (data.success && Array.isArray(data.notifications)) {
        setAlerts(data.notifications);
        setError("");
      } else {
        setAlerts([]);
      }

    } catch (err) {
      console.log("Notification Error:", err);
      setError("Server Error");
    }
  };

  // ---------------- LOAD ----------------
  useEffect(() => {

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 15000);

    return () => clearInterval(interval);

  }, []);

  // ---------------- UI ----------------
  return (
    <div style={container}>

      <h3 style={{ marginBottom: "10px" }}>🔔 Notifications</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {alerts.length === 0 && !error && (
        <p style={{ color: "#888" }}>No alerts</p>
      )}

      {alerts.map(a => (
        <div key={a._id} style={card}>
          <b>{a.name || "No Name"}</b>
          <p>📞 {a.phone || "No Phone"}</p>
          <p style={{ color: "#ef4444", fontWeight: "bold" }}>
            ⏰ Follow-up Today
          </p>
        </div>
      ))}

    </div>
  );
}

// ---------------- STYLE ----------------
const container = {
  position: "fixed",
  top: "20px",
  right: "20px",
  width: "300px",
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  zIndex: 999
};

const card = {
  background: "#fff",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #eee",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

export default Notifications;