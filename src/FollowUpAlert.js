import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function FollowUpAlert({ onClose }) {

  const [leads, setLeads] = useState([]);

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  const loadFollowUps = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API}/followups`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ FIX: handle 401
      if (res.status === 401) {
        console.log("Unauthorized - login again");
        return;
      }

      if (!res.ok) {
        console.log("API Error:", res.status);
        return;
      }

      const data = await res.json();

      if (data.success) {
        setLeads(Array.isArray(data.leads) ? data.leads : []);
      }

    } catch (err) {
      console.log("FollowUp Error:", err.message);
    }
  };

  useEffect(() => {
    loadFollowUps();
  }, []);

  return (
    <div style={{
      background: "#fff3cd",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "10px"
    }}>
      <b>🔔 Follow Ups</b>

      {leads.length === 0 && <p>No follow-ups</p>}

      {leads.map((l) => (
        <div key={l._id || Math.random()} style={{ marginTop: "5px" }}>
          📞 {l.name || "No Name"} - {l.nextFollowUp ? l.nextFollowUp.slice(0, 10) : "No Date"}
        </div>
      ))}

      {onClose && (
        <button onClick={onClose} style={{ marginTop: "10px" }}>
          Close
        </button>
      )}
    </div>
  );
}

export default FollowUpAlert;