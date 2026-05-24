import React, { useEffect, useState } from "react";
import API from "./api/api";

function AutoFollowUp() {

  const [enabled, setEnabled] = useState(true);

  // ---------------- LOAD SETTINGS ----------------
  useEffect(() => {

    const loadSettings = async () => {

      try {

        const res = await API.get("/settings");

        const data = res.data;

        if (data?.success && data.settings) {
          setEnabled(
            data.settings.autoFollowupEnabled ?? true
          );
        }

      } catch (err) {

        console.error("Settings Load Error:", err);

        if (err?.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }

      }

    };

    loadSettings();

  }, []);

  // ---------------- TOGGLE ----------------
  const toggle = async () => {

    const newState = !enabled;

    setEnabled(newState);

    try {

      await API.put("/settings", {
        autoFollowupEnabled: newState
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

      <button
        onClick={toggle}
        style={{ marginLeft: "10px" }}
      >
        {enabled ? "ON" : "OFF"}
      </button>

    </div>

  );

}

export default AutoFollowUp;