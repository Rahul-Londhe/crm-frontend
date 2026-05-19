import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const API = "http://localhost:5000/api";

function AnalyticsAdvanced() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(`${API}/analytics/daily`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = await res.json();

    const formatted = (result.data || []).map(item => ({
      date: item._id.date,
      leads: item.count
    }));

    setData(formatted);
  };

  return (
    <div>
      <h2>📊 Advanced Analytics</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="leads" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsAdvanced;