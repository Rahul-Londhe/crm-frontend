import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function ActivityPage() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  const loadLogs = async () => {
    try {
      const token = getToken();
      if (!token) return;

      setLoading(true);

      const res = await fetch(`${API}/activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setLogs(data.logs);
      }

    } catch (err) {
      console.log("Activity Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();

    const interval = setInterval(loadLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📜 Activity Logs</h2>

      {loading && <p>Loading...</p>}

      {logs.length === 0 && <p>No Activity Found</p>}

      {logs.map((log, index) => (
        <div key={index} style={styles.card}>
          <b>{log.action}</b>
          <p>👤 User: {log.user}</p>
          <p>⏰ {new Date(log.time).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    background: "#fff"
  }
};

export default ActivityPage;