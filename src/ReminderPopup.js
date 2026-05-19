import React, { useEffect, useState } from "react";

function ReminderPopup() {

  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem("token");

  // ---------------- FETCH LEADS ----------------
  const fetchReminders = async () => {
    try {
      const res = await fetch("http://localhost:5000/leads", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        const today = new Date().toISOString().split("T")[0];

        // FILTER TODAY FOLLOW UPS
        const dueLeads = (data.leads || []).filter(l => {
          if (!l.nextFollowUp) return false;
          return l.nextFollowUp.split("T")[0] === today;
        });

        setReminders(dueLeads);
      }

    } catch (err) {
      console.log("Reminder Error:", err);
    }
  };

  useEffect(() => {
    fetchReminders();

    // AUTO REFRESH EVERY 30 SEC
    const interval = setInterval(fetchReminders, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!reminders.length) return null;

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "300px",
      zIndex: 9999
    }}>
      {reminders.map((lead, i) => (
        <div key={i} style={{
          background: "#fff",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.2)"
        }}>
          <strong>📞 Follow-Up Reminder</strong>
          <p>{lead.name}</p>
          <p>{lead.phone}</p>
        </div>
      ))}
    </div>
  );
}

export default ReminderPopup;