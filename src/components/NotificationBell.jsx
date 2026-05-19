import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const API = "http://localhost:5000/api";
const socket = io("http://localhost:5000");

function NotificationBell() {

  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  const token = localStorage.getItem("token");

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {

      const res = await axios.get(
        `${API}/notifications/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setNotifications(
          res.data.notifications || []
        );
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ================= SOCKET =================
  useEffect(() => {

    fetchNotifications();

    const companyId =
      localStorage.getItem("companyId");

    if (companyId) {
      socket.emit("joinCompany", companyId);
    }

    socket.on(
      "notification",
      (data) => {

        setNotifications(prev => [
          data,
          ...prev
        ]);

      }
    );

    return () => {
      socket.off("notification");
    };

  }, []);

  return (
    <div style={{ position: "relative" }}>

      {/* BELL */}
      <button
        onClick={() => setShow(!show)}
        style={{
          fontSize: "22px",
          border: "none",
          background: "transparent",
          cursor: "pointer"
        }}
      >
        🔔

        {notifications.length > 0 && (
          <span
            style={{
              background: "red",
              color: "#fff",
              borderRadius: "50%",
              padding: "2px 7px",
              fontSize: "12px",
              marginLeft: "5px"
            }}
          >
            {notifications.length}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      {show && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "40px",
            width: "320px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "10px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 999
          }}
        >

          {notifications.length === 0 ? (
            <p style={{ padding: "10px" }}>
              No Notifications
            </p>
          ) : (
            notifications.map((n, i) => (
              <div
                key={i}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee"
                }}
              >
                <b>{n.user}</b>

                <p>{n.message}</p>

                <small>
                  {new Date(
                    n.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            ))
          )}

        </div>
      )}

    </div>
  );
}

export default NotificationBell;