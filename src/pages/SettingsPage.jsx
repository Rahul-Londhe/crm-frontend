import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function SettingsPage() {

  const [settings, setSettings] = useState({
    darkMode: false,
    department: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {

    try {

      const res = await axios.get(
        `${API}/settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSettings(res.data.settings);

    } catch (err) {
      console.log(err);
    }

  };

  const saveSettings = async () => {

    try {

      await axios.put(
        `${API}/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Settings Saved");

    } catch (err) {
      console.log(err);
    }

  };

  return (

    <div style={{
      padding: "30px"
    }}>

      <h1 style={{
        fontSize: "30px",
        fontWeight: "bold",
        marginBottom: "20px"
      }}>
        ⚙️ Settings
      </h1>

      {/* DARK MODE */}

      <div style={{
        marginBottom: "20px"
      }}>

        <label
          style={{
            fontSize: "18px",
            marginRight: "10px"
          }}
        >
          Dark Mode
        </label>

        <input
          type="checkbox"
          checked={settings.darkMode}
          onChange={(e) =>
            setSettings({
              ...settings,
              darkMode: e.target.checked
            })
          }
        />

      </div>

      {/* DEPARTMENT */}

      <div style={{
        marginBottom: "20px"
      }}>

        <input
          type="text"
          placeholder="Department"
          value={settings.department}
          onChange={(e) =>
            setSettings({
              ...settings,
              department: e.target.value
            })
          }

          style={{
            padding: "12px",
            width: "300px",
            borderRadius: "10px",
            border: "1px solid #ccc"
          }}
        />

      </div>

      <button
        onClick={saveSettings}

        style={{
          background: "#2563eb",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Save Settings
      </button>

    </div>

  );

}

export default SettingsPage;