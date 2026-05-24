import React, { useEffect, useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

import API from "./api/api";

function Analytics() {
  const [sourceData, setSourceData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  

  // ================= SAFE FETCH =================
  const fetchData = useCallback(async () => {
    setLoading(true);

try {

  const [
    sourceRes,
    dailyRes,
    monthlyRes
  ] = await Promise.all([

    API.get(
      `/analytics/source?year=${year}`
    ),

    API.get(
      `/analytics/daily?year=${year}`
    ),

    API.get(
      `/analytics/monthly?year=${year}`
    )

  ]);

  // ===== SOURCE =====

  setSourceData(
    sourceRes.data.data || []
  );

  // ===== DAILY =====

  const dailyFormatted =
    (
      dailyRes.data.data || []
    ).map(item => ({

      date:
        `${item._id.day}/${item._id.month}`,

      leads:
        item.count

    }));

  setDailyData(
    dailyFormatted
  );

  // ===== MONTHLY =====

  const monthlyFormatted =
    (
      monthlyRes.data.data || []
    ).map(item => ({

      month:
        `Month ${item._id.month}`,

      leads:
        item.count

    }));

  setMonthlyData(
    monthlyFormatted
  );
    } catch (err) {
      console.log("Analytics Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token, year]);

  // ================= LOAD =================
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, 15000); // ✅ auto refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4444"];

  if (loading) return <h2>Loading Analytics...</h2>;

  return (
    <div style={styles.container}>
      <h2>📊 Advanced Analytics Dashboard</h2>

      {/* YEAR FILTER */}
      <div style={styles.filter}>
        <label>Select Year: </label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>

      {/* ===== PIE ===== */}
      <div style={styles.card}>
        <h3>Leads by Source</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sourceData}
              dataKey="count"
              nameKey="_id"
              outerRadius={100}
              label
            >
              {sourceData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===== DAILY ===== */}
      <div style={styles.card}>
        <h3>Daily Leads</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="leads" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== MONTHLY ===== */}
      <div style={styles.card}>
        <h3>Monthly Leads</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="leads" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    padding: "20px",
    background: "#f5f6fa"
  },
  filter: {
    marginBottom: "20px"
  },
  card: {
    background: "#fff",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  }
};

export default Analytics;