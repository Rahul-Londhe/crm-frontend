import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";

const API = "http://localhost:5000/api";

function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchActivities();

    socket.on("activity", (activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.off("activity");
    };
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API}/activity`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setActivities(res.data.logs || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        marginTop: 20,
        background: "#fff",
        padding: 15,
        borderRadius: 10,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2>📊 Live Activity Feed</h2>

      {activities.length === 0 ? (
        <p>No Activity Found</p>
      ) : (
        activities.map((a, index) => (
          <div
            key={index}
            style={{
              borderBottom: "1px solid #eee",
              padding: 10
            }}
          >
            <strong>{a.action}</strong>

            <div style={{ color: "gray", fontSize: 13 }}>
              User: {a.user}
            </div>

            <div style={{ fontSize: 12 }}>
              {new Date(a.createdAt || a.time).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default LiveActivityFeed;