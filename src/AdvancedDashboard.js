import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

function AdvancedDashboard() {

  const [leads, setLeads] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const res = await fetch("http://localhost:5000/leads", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    if (data.success) setLeads(data.leads);
  };

  // GROUP BY MONTH
  const months = Array(12).fill(0);

  leads.forEach(l => {
    const m = new Date(l.createdAt).getMonth();
    months[m]++;
  });

  const data = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets: [
      {
        label: "Monthly Leads",
        data: months,
        backgroundColor: "#3b82f6"
      }
    ]
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2>📊 Advanced Analytics</h2>
      <Bar data={data} />
    </div>
  );
}

export default AdvancedDashboard;