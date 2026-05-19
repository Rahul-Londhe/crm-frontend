import React from "react";

function StatCard({
  title,
  value,
  color,
  icon
}) {

  return (

    <div style={{
      ...styles.card,
      borderTop: `5px solid ${color}`
    }}>

      <div style={styles.top}>

        <div>

          <p style={styles.title}>
            {title}
          </p>

          <h1 style={styles.value}>
            {value}
          </h1>

        </div>

        <div style={{
          ...styles.iconBox,
          background: color
        }}>
          {icon}
        </div>

      </div>

    </div>

  );

}

const styles = {

  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "25px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
    transition: "0.3s",
    cursor: "pointer"
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  title: {
    color: "#64748b",
    fontSize: "14px",
    marginBottom: "10px"
  },

  value: {
    fontSize: "32px",
    margin: 0,
    color: "#0f172a"
  },

  iconBox: {
    width: "55px",
    height: "55px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "24px"
  }

};

export default StatCard;