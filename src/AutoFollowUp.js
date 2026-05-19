import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

function AutoFollowUp() {

  const [enabled, setEnabled] = useState(true);

  // ✅ GET TOKEN FUNCTION
  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ---------------- LOAD SETTINGS ----------------
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${API}/settings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          localStorage.clear();
          window.location.reload();
          return;
        }

        const data = await res.json();

        if (data?.success && data.settings) {
          setEnabled(data.settings.autoFollowupEnabled ?? true);
        }

      } catch (err) {
        console.error("Settings Load Error:", err);
      }
    };

    loadSettings();
  }, []);

  // ---------------- TOGGLE ----------------
  const toggle = async () => {
    const newState = !enabled;
    setEnabled(newState);

    try {
      const token = getToken();
      if (!token) return;

      await fetch(`${API}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ autoFollowupEnabled: newState })
      });

    } catch (err) {
      console.error("Toggle Error:", err);
    }
  };

  return (
    <div style={{
      background: "#e0f2fe",
      padding: "10px",
      borderRadius: "8px"
    }}>
      <b>AI Auto Follow-up:</b>
      <button onClick={toggle} style={{ marginLeft: "10px" }}>
        {enabled ? "ON" : "OFF"}
      </button>
    </div>
  );
}

export default AutoFollowUp;