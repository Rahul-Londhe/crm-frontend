import React from "react";

const colors = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  orange: "#f59e0b"
};

return (

  <div
    style={{
      background:
        colors[color] || "#2563eb",
      borderRadius: "20px",
      padding: "15px",
      color: "#fff"
    }}
  >

    <h3>{title}</h3>

    <h1>{value}</h1>

  </div>

);