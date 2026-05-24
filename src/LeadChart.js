import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import API from "./api/api";

function LeadChart() {
  const [stats, setStats] = useState({
    New: 0,
    Contacted: 0,
    Interested: 0,
    Closed: 0
  });

  const [loading, setLoading] = useState(true);



  // ================= FETCH FROM LEADS =================
  const fetchStats = async () => {
    try {
      setLoading(true);

      
      const res = await API.get("/leads");

const data = res.data;

      if (data.success) {
        const leads = data.leads || [];

        // ✅ CALCULATE STATUS COUNT
        const count = {
          New: 0,
          Contacted: 0,
          Interested: 0,
          Closed: 0
        };

        leads.forEach((l) => {
          if (count[l.status] !== undefined) {
            count[l.status]++;
          }
        });

        setStats(count);
      }

    } catch (err) {
      console.log("Chart Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

  fetchStats();

  const interval =
    setInterval(fetchStats, 15000);

  return () =>
    clearInterval(interval);

}, []);

  // ================= CHART DATA =================
  const chartData = {
    labels: ["New", "Contacted", "Interested", "Closed"],
    datasets: [
      {
        label: "Lead Status",
        data: [
          stats.New,
          stats.Contacted,
          stats.Interested,
          stats.Closed
        ],
        backgroundColor: [
          "#3b82f6",
          "#6366f1",
          "#f59e0b",
          "#10b981"
        ],
        borderWidth: 1
      }
    ]
  };
const totalLeads =
  stats.New +
  stats.Contacted +
  stats.Interested +
  stats.Closed;

 if (loading)
  return <h3>Loading Chart...</h3>;

if (totalLeads === 0) {
  return <h3>No Leads Found</h3>;
}

  return (
    <div style={{
      marginTop: "20px",
      padding: "20px",
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
      maxWidth: "500px"
    }}>
      <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
        📊 Lead Status Overview
      </h3>

      <Pie data={chartData} />

      {/* SUMMARY */}
      <div style={{ marginTop: "15px", fontSize: "14px" }}>
        <p>🔵 New: {stats.New}</p>
        <p>🟣 Contacted: {stats.Contacted}</p>
        <p>🟡 Interested: {stats.Interested}</p>
        <p>🟢 Closed: {stats.Closed}</p>
      </div>
    </div>
  );
}

export default LeadChart;