import React, { useEffect, useState } from "react";
import API from "../api/api";


function ActivityPage() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);



  const loadLogs = async () => {
    try {
      setLoading(true);

const res =
  await API.get("/activity");

const data =
  res.data;

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