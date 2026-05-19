import React, { useState, useEffect, useMemo, useCallback } from "react";
import StatusFilter from "./components/StatusFilter";

const API = "http://localhost:5000/api";

function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= FETCH =================
  const fetchLeads = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        setError("Login required");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        setLeads(data.leads || []);
      } else {
        setLeads([]);
      }

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // ================= LOAD =================
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // ================= AUTO REFRESH =================
  useEffect(() => {
    const interval = setInterval(fetchLeads, 5000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  // ================= FILTER =================
  const filteredLeads = useMemo(() => {
    return filterStatus === "All"
      ? leads
      : leads.filter((l) => l.status === filterStatus);
  }, [leads, filterStatus]);

  // ================= STATS =================
  const stats = useMemo(() => {
    let total = leads.length;
    let closed = 0;
    let revenue = 0;

    leads.forEach((l) => {
      if (l.status === "Closed") {
        closed++;
        revenue += Number(l.value) || 0;
      }
    });

    return { total, closed, revenue };
  }, [leads]);
const pendingFollowUps =
  leads.filter(
    l =>
      l.nextFollowUp &&
      new Date(l.nextFollowUp) < new Date()
  ).length;
  const conversion =
    stats.total === 0
      ? 0
      : ((stats.closed / stats.total) * 100).toFixed(1);

  if (loading) return <h3>Loading Dashboard...</h3>;

  return (
    <div style={box}>
      <h2>📊 Leads Dashboard</h2>

      <button onClick={fetchLeads} style={refreshBtn}>
        🔄 Refresh
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <StatusFilter
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      <div style={grid}>
        <Card title="Total Leads" value={stats.total} color="#3b82f6" />
        <Card title="Closed Deals" value={stats.closed} color="#10b981" />
        <Card title="Revenue ₹" value={stats.revenue} color="#ef4444" />
        <Card title="Conversion %" value={conversion + "%"} color="#8b5cf6" />
        <Card
  title="Pending Follow Ups"
  value={pendingFollowUps}
  color="#f59e0b"
/>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Recent Leads</h4>

        {filteredLeads.length === 0 ? (
          <p>No leads found</p>
        ) : (
          filteredLeads.slice(0, 5).map((l, index) => (
            <div key={l._id || index} style={row}>
              <b>{l.name || "No Name"}</b> | {l.phone || "-"} |{" "}
              <span style={{ color: getStatusColor(l.status) }}>
                {l.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function getStatusColor(status) {
  if (status === "Closed") return "green";
  if (status === "Interested") return "orange";
  if (status === "Contacted") return "blue";
  return "gray";
}

function Card({ title, value, color }) {
  return (
    <div style={{ ...card, background: color }}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const box = {
  marginBottom: "20px",
  padding: "20px",
  background: "#fff",
  borderRadius: "10px"
};

const grid = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
  marginTop: "10px"
};

const card = {
  color: "#fff",
  padding: "15px",
  borderRadius: "10px",
  minWidth: "180px",
  textAlign: "center",
  flex: 1
};

const row = {
  padding: "10px",
  borderBottom: "1px solid #eee"
};

const refreshBtn = {
  marginBottom: "10px",
  padding: "6px 12px",
  cursor: "pointer"
};

export default LeadsDashboard;