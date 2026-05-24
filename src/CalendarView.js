import React, {
  useEffect,
  useState,
  useMemo
} from "react";

import API from "./api/api";

function CalendarView() {

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD DATA =================
  const loadData = async () => {

    try {

      setLoading(true);

      const [leadsRes, tasksRes] =
        await Promise.all([
          API.get("/leads"),
          API.get("/tasks")
        ]);

      const leadsData = leadsRes.data;
      const tasksData = tasksRes.data;

      let list = [];

      // ===== LEADS =====
      if (
        leadsData?.success &&
        Array.isArray(leadsData.leads)
      ) {

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
      if (
        tasksData?.success &&
        Array.isArray(tasksData.tasks)
      ) {

        tasksData.tasks.forEach(t => {

          if (t?.dueDate) {

            list.push({
              id: "task-" + t._id,
              title: `📋 ${t.title}`,
              date: t.dueDate,
              type: "task",
              priority:
                t.priority || "Medium"
            });

          }

        });

      }

      setEvents(list);

    } catch (err) {

      console.error(err);

      setError("Failed to load calendar");

      if (err?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= SORT =================
  const sortedEvents = useMemo(() => {

    return [...events].sort(
      (a, b) =>
        new Date(a.date) -
        new Date(b.date)
    );

  }, [events]);

  // ================= STATUS =================
  const getStatus = (date) => {

    const today = new Date();

    const d = new Date(date);

    if (
      d.toDateString() ===
      today.toDateString()
    ) {
      return "today";
    }

    if (d < today) {
      return "overdue";
    }

    return "upcoming";

  };

  const getColor = (status) => {

    if (status === "today")
      return "#f59e0b";

    if (status === "overdue")
      return "#ef4444";

    return "#10b981";

  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>📅 Smart Calendar</h2>

      {loading && <p>Loading...</p>}

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {sortedEvents.length === 0 && (
        <p>No events found</p>
      )}

      {sortedEvents.map((e) => {

        const status =
          getStatus(e.date);

        return (

          <div
            key={e.id}

            style={{
              borderLeft:
                `5px solid ${getColor(status)}`,

              background: "#fff",

              padding: "12px",

              marginBottom: "10px",

              borderRadius: "8px",

              boxShadow:
                "0 2px 6px rgba(0,0,0,0.1)"
            }}
          >

            <b>{e.title}</b>

            <p>
              📅 {
                new Date(e.date)
                .toLocaleString()
              }
            </p>

            <p>

              Status:

              {
                status === "today"
                ? " 🟡 Today"
                : status === "overdue"
                ? " 🔴 Overdue"
                : " 🟢 Upcoming"
              }

            </p>

            {e.type === "task" && (
              <p>
                Priority:
                {e.priority}
              </p>
            )}

          </div>

        );

      })}

    </div>

  );

}

export default CalendarView;