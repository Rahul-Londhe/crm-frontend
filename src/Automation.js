import React, { useState, useEffect } from "react";

function Automation() {

  const [workflows, setWorkflows] = useState([]);

  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("");
  const [action, setAction] = useState("");

  // ---------------- LOAD SAFE ----------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem("automations");
      if (saved && saved !== "undefined") {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWorkflows(parsed);
        }
      }
    } catch (err) {
      console.log("Storage Error:", err);
      localStorage.removeItem("automations");
    }
  }, []);

  // ---------------- SAVE ----------------
  useEffect(() => {
    localStorage.setItem("automations", JSON.stringify(workflows));
  }, [workflows]);

  // ---------------- CREATE ----------------
  const createWorkflow = () => {

    if (!name.trim() || !trigger || !action) {
      alert("Please fill all fields properly");
      return;
    }

    // ❌ Duplicate check
    const exists = workflows.find(
      w => w.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      alert("Automation with same name already exists");
      return;
    }

    const newWorkflow = {
      id: Date.now(),
      name: name.trim(),
      trigger,
      action,
      active: true
    };

    setWorkflows(prev => [newWorkflow, ...prev]);

    setName("");
    setTrigger("");
    setAction("");
  };

  // ---------------- DELETE ----------------
  const deleteWorkflow = (id) => {
    if (!window.confirm("Delete this automation?")) return;

    setWorkflows(prev => prev.filter(w => w.id !== id));
  };

  // ---------------- TOGGLE ----------------
  const toggleWorkflow = (id) => {
    setWorkflows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, active: !w.active } : w
      )
    );
  };

  // ---------------- TEMPLATE ----------------
  const addTemplate = (type) => {

    let template = null;

    if (type === "welcome") {
      template = {
        id: Date.now(),
        name: "Welcome Message",
        trigger: "New Lead Added",
        action: "Send WhatsApp Message",
        active: true
      };
    }

    if (type === "followup") {
      template = {
        id: Date.now(),
        name: "Follow-up Reminder",
        trigger: "Lead Status Changed",
        action: "Create Follow Up Task",
        active: true
      };
    }

    // ❌ prevent duplicate template
    const exists = workflows.find(w => w.name === template?.name);
    if (exists) {
      alert("Template already added");
      return;
    }

    if (template) {
      setWorkflows(prev => [template, ...prev]);
    }
  };

  // ---------------- UI ----------------
  return (
    <div style={{ padding: "20px" }}>

      <h2>⚙️ Automation Builder</h2>

      <p>Create automation rule:</p>
      <p>If <b>Trigger</b> happens → perform <b>Action</b></p>

      {/* INPUTS */}
      <div style={{ marginBottom: "15px" }}>

        <input
          placeholder="Automation Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", width: "250px" }}
        />

        <br /><br />

        <select
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          style={{ padding: "8px", width: "260px" }}
        >
          <option value="">Select Trigger</option>
          <option>New Lead Added</option>
          <option>Lead Status Changed</option>
          <option>Birthday Reminder</option>
          <option>Payment Due</option>
        </select>

        <br /><br />

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          style={{ padding: "8px", width: "260px" }}
        >
          <option value="">Select Action</option>
          <option>Send WhatsApp Message</option>
          <option>Send Email</option>
          <option>Create Follow Up Task</option>
          <option>Assign Sales Person</option>
        </select>

        <br /><br />

        <button
          onClick={createWorkflow}
          style={{
            padding: "10px 15px",
            background: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "5px"
          }}
        >
          Create Automation
        </button>

      </div>

      {/* TEMPLATES */}
      <h3>⚡ Quick Templates</h3>

      <button onClick={() => addTemplate("welcome")}>
        Welcome Auto Message
      </button>

      <button onClick={() => addTemplate("followup")} style={{ marginLeft: "10px" }}>
        Follow-up System
      </button>

      {/* LIST */}
      <h3 style={{ marginTop: "20px" }}>Active Automations</h3>

      {workflows.length === 0 && (
        <p>No automations created yet.</p>
      )}

      {workflows.map(w => (

        <div key={w.id} style={{
          border: "1px solid #ccc",
          padding: "15px",
          margin: "10px 0",
          borderRadius: "8px",
          background: "#f9fafb"
        }}>

          <b>{w.name}</b>

          <p>
            IF <b>{w.trigger}</b> → THEN <b>{w.action}</b>
          </p>

          <p>
            Status: {w.active ? "🟢 Active" : "🔴 Inactive"}
          </p>

          <button onClick={() => toggleWorkflow(w.id)}>
            Toggle
          </button>

          <button
            onClick={() => deleteWorkflow(w.id)}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              marginLeft: "10px"
            }}
          >
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default Automation;