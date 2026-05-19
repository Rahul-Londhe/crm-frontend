import React from "react";

function StatusFilter({ filterStatus = "All", setFilterStatus }) {

  const statusList = ["All", "New", "Contacted", "Interested", "Closed"];

  return (
    <div style={{ marginBottom: "15px", fontWeight: "500" }}>
      Filter Status:

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus?.(e.target.value)}
        style={{
          marginLeft: "10px",
          padding: "5px",
          borderRadius: "5px",
          border: "1px solid #ccc"
        }}
      >
        {statusList.map((status, index) => (
          <option key={status || index} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StatusFilter;