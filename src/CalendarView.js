import React, { useEffect, useState, useMemo } from "react";

const API = "http://localhost:5000/api";

function CalendarView() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= LOAD DATA =================
  const loadData = async () => {
    try {
      const token = getToken();
      if (!token) return;

      setLoading(true);

      const headers = { Authorization: `Bearer ${token}` };

      const [leadsRes, tasksRes] = await Promise.all([
        fetch(`${API}/leads`, { headers }),
        fetch(`${API}/tasks`, { headers })
      ]);

      const leadsData = await leadsRes.json();
      const tasksData = await tasksRes.json();

      let list = [];

      // ===== LEADS FOLLOWUPS =====
      if (leadsData?.success && Array.isArray(leadsData.leads)) {
        leadsData.leads.forEach(l => {
          if (l?.nextFollowUp) {
            list.push({
              id: "lead-" + l._id,
              title: `📞 ${l.name}`,
              date: l.nextFollowUp,
              type: "followup"
            });
          }
        });
      }

      // ===== TASKS =====
      if (tasksData?.success && Array.isArray(tasksData.tasks)) {
        tasksData.tasks.forEach(t => {
          if (t?.dueDate) {
            list.push({
              id: "task-" + t._id,
              title: `📋 ${t.title}`,
              date: t.dueDate,
              type: "task",
              priority: t.priority || "Medium"
            });
          }
        });
      }

      setEvents(list);

    } catch (err) {
      console.error(err);
      setError("Failed to load calendar");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= SORT EVENTS =================
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  // ================= DATE STATUS =================
  const getStatus = (date) => {
    const today = new Date();
    const d = new Date(date);

    if (d.toDateString() === today.toDateString()) return "today";
    if (d < today) return "overdue";
    return "upcoming";
  };

  const getColor = (status) => {
    if (status === "today") return "#f59e0b";
    if (status === "overdue") return "#ef4444";
    return "#10b981";
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📅 Smart Calendar</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {sortedEvents.length === 0 && <p>No events found</p>}

      {sortedEvents.map((e) => {
        const status = getStatus(e.date);

        return (
          <div
            key={e.id}
            style={{
              borderLeft: `5px solid ${getColor(status)}`,
              background: "#fff",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >
            <b>{e.title}</b>

            <p>📅 {new Date(e.date).toLocaleString()}</p>

            <p>
              Status:{" "}
              {status === "today"
                ? "🟡 Today"
                : status === "overdue"
                ? "🔴 Overdue"
                : "🟢 Upcoming"}
            </p>

            {e.type === "task" && (
              <p>Priority: {e.priority}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CalendarView;