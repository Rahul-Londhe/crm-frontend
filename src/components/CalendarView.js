import React, { useState } from "react";

function CalendarView({ tasks = [] }) {

  const [selectedDate, setSelectedDate] = useState("");

  const filteredTasks = tasks.filter(t =>
    t.dueDate?.slice(0,10) === selectedDate
  );

  return (
    <div style={box}>

      <h3>📅 Task Calendar</h3>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      <div style={{ marginTop: "15px" }}>
        {filteredTasks.length === 0 && <p>No tasks</p>}

        {filteredTasks.map(t => (
          <div key={t._id} style={card}>
            <b>{t.title}</b>
            <p>{t.description}</p>
            <p>Priority: {t.priority}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

const box = {
  marginTop: "20px",
  padding: "20px",
  background: "#fff",
  borderRadius: "10px"
};

const card = {
  padding: "10px",
  border: "1px solid #ddd",
  marginTop: "10px",
  borderRadius: "8px"
};

export default CalendarView;