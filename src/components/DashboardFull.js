import React, { useState } from "react";
import LeadForm from "../LeadForm";
import LeadsList from "../LeadsList";
import DashboardCharts from "../DashboardCharts"; // Monthly Leads Graph
import Dashboard from "../Dashboard"; // Advanced dashboard with cards

function DashboardFull() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger LeadsList refresh when a new lead is added
  const handleLeadAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ padding: "20px", background: "#f9fafb", minHeight: "100vh" }}>
      <h1 style={{ marginBottom: "20px" }}>🚀 CRM Dashboard</h1>

      {/* Lead Form */}
      <LeadForm onLeadAdded={handleLeadAdded} />

      {/* Leads List */}
      <LeadsList key={refreshKey} />

      {/* Advanced Charts */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "10px" }}>📊 Monthly Leads & Stats</h2>
        <DashboardCharts />
      </div>

      {/* Full Dashboard with Cards */}
      <div style={{ marginTop: "40px" }}>
        <h2 style={{ marginBottom: "10px" }}>📈 Advanced CRM Overview</h2>
        <Dashboard />
      </div>
    </div>
  );
}

export default DashboardFull;