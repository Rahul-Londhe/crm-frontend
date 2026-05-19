import React from "react";

function StatusFilter({ filterStatus, setFilterStatus }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      Filter Status: 
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ marginLeft: "10px" }}>
        <option value="All">All</option>
        <option value="New">New</option>
        <option value="Interested">Interested</option>
        <option value="Closed">Closed</option>
      </select>
    </div>
  );
}

export default StatusFilter;