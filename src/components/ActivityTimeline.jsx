import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function ActivityTimeline() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const res = await axios.get(`${API}/activity`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      setActivities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Activity Timeline</h2>

      {activities.map((a) => (
        <div
          key={a._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px"
          }}
        >
          <h4>{a.action}</h4>
          <p><b>User:</b> {a.user}</p>
          <p><b>Module:</b> {a.module}</p>
          <p>{a.details}</p>
          <small>{new Date(a.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default ActivityTimeline;