import React, { useEffect, useState } from "react";
import API from "./api/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);



function DashboardCharts() {

  const [stats, setStats] = useState({
    total: 0,
    newLeads: 0,
    contacted: 0,
    closed: 0
  });

  const [monthlyData, setMonthlyData] = useState(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    const t = localStorage.getItem("token");
    return t && t !== "undefined" && t !== "null" ? t : null;
  };

  // ================= LOAD ALL =================
  useEffect(() => {
    const loadAll = async () => {
      try {
        const token = getToken();
        if (!token) return;

        setLoading(true);

        // 🔥 ONLY LEADS API (SAFE)
        const res = await API.get("/leads");

        const leads = res?.data?.leads || [];

        // ================= STATS CALC =================
        let total = leads.length;
        let newLeads = 0;
        let contacted = 0;
        let closed = 0;

        let monthly = new Array(12).fill(0);

        leads.forEach(l => {
          // STATUS COUNT
          if (l.status === "New") newLeads++;
          else if (l.status === "Contacted") contacted++;
          else if (l.status === "Closed") closed++;

          // MONTH COUNT
          if (l.createdAt) {
            const d = new Date(l.createdAt);
            if (!isNaN(d)) {
              monthly[d.getMonth()]++;
            }
          }
        });

        setStats({ total, newLeads, contacted, closed });
        setMonthlyData(monthly);

      } catch (err) {
        console.error("Dashboard Error:", err);
        setError("Failed to load data");

        if (err?.response?.status === 401) {
          localStorage.clear();
          window.location.reload();
        }

      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  // ================= CHART =================
  const chartData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Monthly Leads",
        data: monthlyData,
        backgroundColor: "#3b82f6",
        borderRadius: 6
      }
    ]
  };

  return (
    <div style={box}>
      <h3>📈 Monthly Leads Overview</h3>

      {loading ? <p>Loading...</p> : <Bar data={chartData} />}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={flex}>
        <StatBox title="Total Leads" value={stats.total} color="#6366f1" />
        <StatBox title="New Leads" value={stats.newLeads} color="#22c55e" />
        <StatBox title="Contacted" value={stats.contacted} color="#f59e0b" />
        <StatBox title="Closed" value={stats.closed} color="#ef4444" />
      </div>
    </div>
  );
}

// ================= STAT BOX =================
const StatBox = ({ title, value, color }) => (
  <div style={{
    background: color,
    color: "#fff",
    padding: "18px",
    width: "180px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
    transition: "0.3s"
  }}>
    <h4>{title}</h4>
    <h2>{value}</h2>
  </div>
);

// ================= STYLE =================
const box = {
  marginTop: "30px",
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
};

const flex = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap"
};

export default DashboardCharts;