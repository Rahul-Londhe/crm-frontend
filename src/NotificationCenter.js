import React, {
  useEffect,
  useState
} from "react";

import { io } from "socket.io-client";

const API = "http://localhost:5000/api";

const socket = io("http://localhost:5000");

function NotificationCenter() {

  const [notifications, setNotifications] =
    useState([]);

  const [count, setCount] =
    useState(0);

  const [open, setOpen] =
    useState(false);

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications =
    async () => {

      try {

        const res = await fetch(
          `${API}/notifications/all`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json"
            }
          }
        );

        // ✅ CHECK RESPONSE
        if (!res.ok) {
          console.log(
            "Notification API Error"
          );
          return;
        }

        const data = await res.json();

        console.log(
          "NOTIFICATION RESPONSE:",
          data
        );

        if (data.success) {

          setNotifications(
            data.notifications || []
          );

        }

      } catch (err) {

        console.log(
          "FETCH ERROR:",
          err
        );

      }

    };

  // ================= FETCH COUNT =================
  const fetchCount =
    async () => {

      try {

        const res = await fetch(
          `${API}/notifications/unread-count`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json"
            }
          }
        );

        if (!res.ok) {
          console.log(
            "COUNT API ERROR"
          );
          return;
        }

        const data = await res.json();

        console.log(
          "COUNT RESPONSE:",
          data
        );

        if (data.success) {

          setCount(data.count || 0);

        }

      } catch (err) {

        console.log(
          "COUNT ERROR:",
          err
        );

      }

    };

  // ================= MARK AS READ =================
  const markRead =
    async (id) => {

      try {

        const res = await fetch(
          `${API}/notifications/${id}/read`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "application/json"
            }
          }
        );

        if (!res.ok) {
          console.log(
            "MARK READ ERROR"
          );
          return;
        }

        fetchNotifications();
        fetchCount();

      } catch (err) {

        console.log(
          "READ ERROR:",
          err
        );

      }

    };

  // ================= INITIAL LOAD =================
  useEffect(() => {

    if (!token) return;

    fetchNotifications();
    fetchCount();

  }, []);

  // ================= SOCKET =================
  useEffect(() => {

    if (!user?.companyId) return;

    socket.emit(
      "joinCompany",
      user.companyId
    );

    socket.on(
      "notification",
      (notification) => {

        console.log(
          "SOCKET NOTIFICATION:",
          notification
        );

        setNotifications(prev => [
          notification,
          ...prev
        ]);

        setCount(prev => prev + 1);

      }
    );

    return () => {

      socket.off("notification");

    };

  }, [user]);

  return (

    <div style={{
      position: "fixed",
      top: 15,
      right: 20,
      zIndex: 9999
    }}>

      {/* BELL */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          border: "none",
          background: "#007bff",
          color: "#fff",
          borderRadius: "50%",
          width: 50,
          height: 50,
          fontSize: 20,
          cursor: "pointer",
          position: "relative"
        }}
      >
        🔔

        {count > 0 && (
          <span style={{
            position: "absolute",
            top: -5,
            right: -5,
            background: "red",
            color: "#fff",
            borderRadius: "50%",
            width: 22,
            height: 22,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {count}
          </span>
        )}

      </button>

      {/* PANEL */}
      {open && (

        <div style={{
          width: 350,
          maxHeight: 500,
          overflowY: "auto",
          background: "#fff",
          borderRadius: 10,
          padding: 15,
          marginTop: 10,
          boxShadow:
            "0 0 10px rgba(0,0,0,0.2)"
        }}>

          <h3>
            Notifications
          </h3>

          {notifications.length === 0 && (
            <p>No Notifications</p>
          )}

          {notifications.map(n => (

            <div
              key={n._id}

              onClick={() =>
                markRead(n._id)
              }

              style={{
                padding: 10,
                marginBottom: 10,
                borderRadius: 8,
                cursor: "pointer",
                background:
                  n.read
                    ? "#f1f1f1"
                    : "#dbeafe"
              }}
            >

              {/* ✅ FIXED */}
              <strong>
                {n.type?.toUpperCase()}
              </strong>

              <p>
                {n.message}
              </p>

              <small>
                By: {n.user}
              </small>

              <br />

              <small>
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </small>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default NotificationCenter;