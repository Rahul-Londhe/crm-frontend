import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiDollarSign,
  FiCheckCircle,
  FiActivity,
  FiAlertTriangle,
  FiUsers
} from "react-icons/fi";
import API from "./api/api"; // ✅ USE GLOBAL API

import {
  Doughnut,
  Bar,
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement
);
const getValidDate = (date) => {

  const d = new Date(date);

  return isNaN(d)
    ? new Date()
    : d;

};
function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= LOAD =================
  const loadData = useCallback(async () => {
    setLoading(true);

    try {
      let leadRes = { data: { leads: [] } };
let invoiceRes = { data: { invoices: [] } };

try {
  leadRes = await API.get("/leads");
} catch (err) {
  console.error("Leads Error:", err.message);
}

try {
  invoiceRes = await API.get("/invoices");
} catch (err) {
  console.error("Invoice Error:", err.message);
}
      setLeads(Array.isArray(leadRes?.data?.leads) ? leadRes.data.leads : []);
      setInvoices(Array.isArray(invoiceRes?.data?.invoices) ? invoiceRes.data.invoices : []);

    } catch (err) {
      console.error("Dashboard Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  
  }, [loadData]);

  // ================= STATS =================
  const stats = useMemo(() => {
    let total = leads.length;
    let closed = 0;
    let revenue = 0;
    let today = 0;
    let monthly = 0;

    const now = new Date();

    leads.forEach(l => {
      const d = l.createdAt ? new Date(l.createdAt) : new Date();

      if (
  l.status?.toLowerCase() === "closed"
) {
        closed++;
        revenue += Number(l.value) || 0;
      }

      if (d.toDateString() === now.toDateString()) today++;

      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) monthly++;
    });

    return { total, closed, revenue, today, monthly };
  }, [leads]);

  const conversion = stats.total
    ? ((stats.closed / stats.total) * 100).toFixed(1)
    : 0;

  const formatCurrency = (n) =>
    "₹ " + new Intl.NumberFormat("en-IN").format(n || 0);

  // ================= DAILY =================
  const dailyGraph = useMemo(() => {
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const data = new Array(7).fill(0);

    leads.forEach(l => {
      const d = getValidDate(l.createdAt);
      data[d.getDay()]++;
    });

    return {
      labels: days,
      datasets: [
  {
    label: "Daily Leads",
    data,
    backgroundColor: "#2563eb"
  }
]
    };
  }, [leads]);

  // ================= MONTHLY =================
  const monthlyGraph = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const data = new Array(12).fill(0);

    leads.forEach(l => {
      const d = getValidDate(l.createdAt);
      data[d.getMonth()]++;
    });

    return {
      labels: months,
      datasets: [
  {
    label: "Monthly Leads",
    data,
    backgroundColor: "#7c3aed"
  }
]
    };
  }, [leads]);

  // ================= REVENUE =================
  const revenueGraph = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const data = new Array(12).fill(0);

    invoices.forEach(inv => {
     const d = getValidDate(inv.createdAt);
      data[d.getMonth()] += Number(inv.amount) || 0;
    });

    return {
      labels: months,
      datasets: [
  {
    label: "Revenue",
    data,
    borderColor: "#16a34a",
    backgroundColor: "#16a34a"
  }
]
    };
  }, [invoices]);

  // ================= STATUS =================
  const statusChart = {

  labels: [
    "New",
    "Contacted",
    "Interested",
    "Closed"
  ],

  datasets: [

    {

      data: [

        leads.filter(
          l =>
            l.status?.toLowerCase() === "new"
        ).length,

        leads.filter(
          l =>
            l.status?.toLowerCase() === "contacted"
        ).length,

        leads.filter(
          l =>
            l.status?.toLowerCase() === "interested"
        ).length,

        leads.filter(
          l =>
            l.status?.toLowerCase() === "closed"
        ).length

      ],

      backgroundColor: [
        "#3b82f6",
        "#f59e0b",
        "#8b5cf6",
        "#22c55e"
      ]

    }

  ]

};

  if (loading) {

  return (

    <div className="
h-screen
flex
items-center
justify-center
text-3xl
font-bold
text-blue-600
bg-slate-100
">

      <h1>
        🚀 Loading CRM Dashboard...
      </h1>

    </div>

  );

}
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "bottom",
    },
  },

  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
  return (
  <div className="
    min-h-screen
    bg-slate-100
    px-3 py-4 md:p-6
  ">
      <div className="
flex
flex-col
xl:flex-row
xl:items-center
xl:justify-between
gap-4
mb-6
">
<div className="
bg-gradient-to-r
from-blue-600
to-violet-600
text-white
p-6
rounded-3xl
shadow-xl
w-full
lg:w-[350px]
">

  <h2>
    Welcome Back 👋
  </h2>

  <p>
    Your CRM analytics are running smoothly.
  </p>

</div>
  <div>
    <h1 className="
text-2xl md:text-3xl
font-bold
text-slate-800
">
      🚀 AI CRM Dashboard
    </h1>

    <p className="
text-slate-500
mt-2
">
      Complete business analytics & lead management
    </p>
  </div>

  <div className="
bg-red-600
text-white
px-5
py-3
rounded-2xl
font-bold
shadow-lg
animate-pulse
">
    🔴 Live CRM
  </div>
  <input

  type="text"

  placeholder="Search Leads..."

  className="
border
border-slate-300
rounded-xl
px-4
py-3
outline-none
w-full
md:w-[250px]
bg-white
"

/>
<button

  onClick={loadData}

  className="
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-3
rounded-xl
transition
shadow-lg
font-semibold
"

>

  🔄 Refresh

</button>

</div>

      <div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
2xl:grid-cols-6
gap-5
mb-6
">

  <Card
    title="Total Leads"
    value={stats.total}
    icon={<FiUsers />}
    color="#2563eb"
  />

  <Card
    title="Today Leads"
    value={stats.today}
    icon={<FiActivity />}
    color="#f59e0b"
  />

  <Card
    title="Monthly Leads"
    value={stats.monthly}
    icon={<FiTrendingUp />}
    color="#7c3aed"
  />

  <Card
    title="Closed Deals"
    value={stats.closed}
    icon={<FiCheckCircle />}
    color="#16a34a"
  />

  <Card
    title="Revenue"
    value={formatCurrency(stats.revenue)}
    icon={<FiDollarSign />}
    color="#dc2626"
  />

  <Card
    title="Conversion %"
    value={conversion + "%"}
    icon={<FiTrendingUp />}
    color="#0f172a"
  />

</div>

     

     

 {/* ================= CHART GRID ================= */}

<div
  className="
  grid
  grid-cols-1
  lg:grid-cols-2
  gap-6
  mb-6
  "
>

  {/* DAILY */}
  <motion.div
    whileHover={{ y: -5 }}
    className="
    bg-white
    rounded-3xl
    shadow-md
    border
    border-slate-200
    p-5
    h-[320px] md:h-[400px]
    overflow-hidden
    "
  >
    <h3 className="text-xl font-bold mb-4 text-slate-700">
      📊 Daily Leads
    </h3>

   <div className="relative h-[300px] w-full">
      <div className="relative w-full h-[300px]">
  <Bar
  redraw={false}
    data={dailyGraph}
    options={{
      ...chartOptions,
      maintainAspectRatio: false
    }}
  />
</div>
    </div>
  </motion.div>

  {/* MONTHLY */}
  <motion.div
    whileHover={{ y: -5 }}
    className="
    bg-white
    rounded-3xl
    shadow-md
    border
    border-slate-200
    p-5
    h-[400px]
    overflow-hidden
    "
  >
    <h3 className="text-xl font-bold mb-4 text-slate-700">
      📅 Monthly Leads
    </h3>

    <div className="h-[300px]">
      <div className="h-[300px] w-full">
  <Bar
    data={monthlyGraph}
    options={{
      ...chartOptions,
      maintainAspectRatio: false
    }}
  />
</div>
    </div>
  </motion.div>

  {/* REVENUE */}
  <motion.div
    whileHover={{ y: -5 }}
    className="
    bg-white
    rounded-3xl
    shadow-md
    border
    border-slate-200
    p-5
    h-[400px]
    overflow-hidden
    "
  >
    <h3 className="text-xl font-bold mb-4 text-slate-700">
      💰 Revenue
    </h3>

    <div className="h-[300px]">
      <div className="h-[300px] w-full">
  <Line
  redraw={false}
    data={revenueGraph}
    options={{
      ...chartOptions,
      maintainAspectRatio: false
    }}
  />
</div>
    </div>
  </motion.div>

  {/* HOT LEADS */}
  <motion.div
    whileHover={{ y: -5 }}
    className="
    bg-white
    rounded-3xl
    shadow-md
    border
    border-slate-200
    p-5
    h-[400px]
    overflow-y-auto
    "
  >
    <h3 className="text-xl font-bold mb-4 text-slate-700">
      🔥 Hot Leads
    </h3>

    {leads.filter(
      l =>
        l.temperature?.toLowerCase() === "hot"
    ).length === 0 ? (

      <p>No Hot Leads Found</p>

    ) : (

      leads
        .filter(
          l =>
            l.temperature?.toLowerCase() === "hot"
        )
        .slice(0, 5)
        .map((lead) => (

          <div
            key={lead._id}
            className="
            p-4
            border-b
            border-slate-200
            rounded-xl
            hover:bg-slate-50
            transition
            "
          >

            <strong>{lead.name}</strong>

            <p>
              📞 {lead.phone}
            </p>

            <p>
              💰 {formatCurrency(lead.value)}
            </p>

          </div>

        ))
    )}

  </motion.div>

</div>
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  color
}) {

  return (

    <motion.div

      whileHover={{
        y: -5
      }}

      className="
      bg-white
      rounded-3xl
      p-5
      shadow-md
      border
      border-slate-200
      relative
      overflow-hidden
      "

    >

      <div
        className="
        absolute
        top-0
        left-0
        w-full
        h-2
        "
        style={{
          background: color
        }}
      />

      <div className="
      flex
      items-center
      justify-between
      ">

        <div>

          <p className="
          text-slate-500
          font-medium
          ">
            {title}
          </p>

          <h1 className="
          text-3xl
          font-bold
          mt-3
          text-slate-800
          ">
            {value}
          </h1>

        </div>

        <div
          className="
          w-14
          h-14
          rounded-2xl
          flex
          items-center
          justify-center
          text-white
          text-2xl
          shadow-lg
          "
          style={{
            background: color
          }}
        >
          {icon}
        </div>

      </div>

    </motion.div>

  );

}
export default Dashboard;