import React, { useEffect, useState } from "react"

function Notifications() {

  const [alerts, setAlerts] = useState([])
  const token = localStorage.getItem("token")

  const fetchNotifications = async () => {
    try {
      const res = await fetch("https://crm-backend-production-eec9.up.railway.app/api/notifications/today", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data.success) {
        setAlerts(data.notifications)
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchNotifications()

    // AUTO REFRESH EVERY 15 sec
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)

  }, [])

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      width: "300px"
    }}>

      <h3>🔔 Notifications</h3>

      {alerts.length === 0 && <p>No alerts</p>}

      {alerts.map(a => (
        <div key={a._id} style={{
          background: "#fff",
          padding: "10px",
          marginBottom: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px"
        }}>
          <b>{a.name}</b>
          <p>📞 {a.phone}</p>
          <p>Follow-up Today</p>
        </div>
      ))}

    </div>
  )
}

export default Notifications