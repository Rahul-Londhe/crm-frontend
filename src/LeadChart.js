import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const API = "http://localhost:5000/api";

function LeadChart() {
  const [stats, setStats] = useState({
    New: 0,
    Contacted: 0,
    Interested: 0,
    Closed: 0
  });

  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= FETCH FROM LEADS =================
  const fetchStats = async () => {
    try {
      setLoading(true);

      const token = getToken();
      if (!token) return;

      const res = await fetch(`${API}/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();

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

  if (loading) return <h3>Loading Chart...</h3>;

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