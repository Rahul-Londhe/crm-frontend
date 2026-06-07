import React, { useEffect, useState } from "react";

import API from "./api/api";

function FollowUpAlert({ onClose }) {

  const [leads, setLeads] = useState([]);

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

const loadFollowUps = async () => {

  try {

    const token = getToken();

    if (!token) {
      console.log("No Token");
      return;
    }

    const res = await API.get(
  "/followups/today",
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
);

    console.log(
      "FOLLOWUP RESPONSE:",
      res.data
    );

    if (res.data.success) {

      setLeads(
        Array.isArray(
          res.data.leads
        )
          ? res.data.leads
          : []
      );

    }

  } catch (err) {

    console.log(
      "FOLLOWUP ERROR:",
      err.response?.data ||
      err.message
    );

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