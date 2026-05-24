import React, { useState, useEffect, useCallback, useRef } from "react";
// ---------------- PAGES ----------------
import Leads from "./Leads";
import Login from "./Login";
import Register from "./Register";
import Automation from "./Automation";
import AIChat from "./AIChat";
import Layout from "./Layout";
import WhatsAppAutomation from "./WhatsAppAutomation";
import PipelineBoard from "./PipelineBoard";
import LandingPage from "./LandingPage";
import TaskDashboard from "./TaskDashboard";
import LeadsDashboard from "./LeadsDashboard";
import Dashboard from "./Dashboard";
import AdminPanel from "./pages/AdminPanel";
import TaskAlertPopup from "./TaskAlertPopup";
// FEATURES
import CalendarView from "./CalendarView";
import MeetingCalendar
from "./pages/MeetingCalendar";
import NotificationPopup from "./NotificationPopup";
import AutoFollowUp from "./AutoFollowUp";
import TaskReminder from "./TaskReminder";
import FollowUpAlert from "./FollowUpAlert";
import ActivityPage from "./ActivityPage";
import PerformanceDashboard
from "./pages/PerformanceDashboard";
// ANALYTICS
import Analytics from "./Analytics";
import SettingsPage from "./pages/SettingsPage";
// INVOICES
import Invoices from "./Invoices";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import LeavePage
from "./pages/LeavePage";
import PayrollPage
from "./pages/PayrollPage";
import HRDashboard
from "./pages/HRDashboard";
import EmployeeDashboard
from "./pages/EmployeeDashboard";
// 👇 NEW
import UserProfile from "./UserProfile";
import NotificationCenter from "./NotificationCenter";
import MeetingReminder
from "./components/MeetingReminder";
import NotificationSound
from "./NotificationSound";
import LiveNotification
from "./components/LiveNotification";
import MobileBottomNav from "./components/MobileBottomNav";
import MobileTopBar from "./components/MobileTopBar";
import MobileSidebar from "./components/MobileSidebar";
import PWAInstallButton from "./components/PWAInstallButton";
import NotificationBell from "./components/NotificationBell";

import { io } from "socket.io-client";
import API from "./api/api";
const socket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
  autoConnect: true,
  reconnection: true
});
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ================= ROLE HELPERS =================

const isAdmin = user?.role === "admin";

const isHR =
  user?.role === "hr";

const isEmployee =
  user?.role === "employee";
  const [showPopup, setShowPopup] = useState(true);
const socketRef = useRef(null);
  // ================= LOAD STORAGE =================
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (savedToken && savedToken !== "undefined" && savedToken !== "null") {
        setToken(savedToken);
      }

      if (savedUser && savedUser !== "undefined") {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.clear();
    }
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // ================= LOGOUT =================
  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUser(null);
    setLeads([]);
    setPage("dashboard");
  }, []);

  // ================= FETCH LEADS =================
  const fetchLeads = useCallback(async () => {

  if (!token) return;

  setLoading(true);

  try {

    const res = await API.get("/leads");

    if (res.data?.success) {
      setLeads(res.data.leads || []);
    } else {
      setLeads([]);
    }

  } catch (err) {

    console.error("Fetch Leads Error:", err);

    if (err?.response?.status === 401) {
      logout();
    }

    setLeads([]);

  } finally {

    setLoading(false);

  }

}, [token, logout]);
  useEffect(() => {
    if (token) fetchLeads();
  }, [token, fetchLeads]);
// ================= SOCKET =================
useEffect(() => {

  if (!user?.companyId) return;

  socketRef.current = socket;

  // JOIN COMPANY ROOM
  socketRef.current.emit("joinCompany", user.companyId);

  // TASK CREATED
  socketRef.current.on("taskCreated", (task) => {
    console.log("Realtime Task Created:", task);

    fetchLeads();
  });

  // TASK UPDATED
  socketRef.current.on("taskUpdated", (task) => {
    console.log("Realtime Task Updated:", task);

    fetchLeads();
  });

  // TASK DELETED
  socketRef.current.on("taskDeleted", (task) => {
    console.log("Realtime Task Deleted:", task);

    fetchLeads();
  });

  // ACTIVITY
  socketRef.current.on("activity", (activity) => {
    console.log("Realtime Activity:", activity);
  });

  return () => {

  socketRef.current.off("taskCreated");
  socketRef.current.off("taskUpdated");
  socketRef.current.off("taskDeleted");
  socketRef.current.off("activity");

};

}, [user, fetchLeads]);
  // ================= LOGIN SCREEN =================
  if (!token) {
    return (
      <div style={styles.authContainer}>
        <div style={styles.authBox}>
          <h1>🚀 AI CRM</h1>

          {showRegister ? (
            <Register setShowRegister={setShowRegister} />
          ) : (
            <Login setUser={setUser} setToken={setToken} />
          )}

          <button
            style={styles.switchBtn}
            onClick={() => setShowRegister(!showRegister)}
          >
            {showRegister ? "Go to Login" : "Create Account"}
          </button>
        </div>
      </div>
    );
  }

  // ================= ROUTER =================
  const renderPage = () => {
    switch (page) {
      
      case "dashboard":
        return (
          <>
            <Dashboard />
            <LeadsDashboard />
          </>
        );

      case "leads":
        return (
          <Leads
            leads={leads}
            setLeads={setLeads}
            refreshLeads={fetchLeads}
          />
        );

      case "pipeline":
        return <PipelineBoard leads={leads} setLeads={setLeads} />;

      case "automation":
        return <Automation />;

      case "whatsapp":
        return <WhatsAppAutomation />;

      case "ai":
        return <AIChat />;

      case "landing":
        return <LandingPage />;

      case "tasks":
        return <TaskDashboard />;

      case "calendar":
        return <CalendarView />;

        case "meeting-calendar":
  return <MeetingCalendar />;
      case "analytics":
        return <Analytics />;

        case "notifications":
  return <NotificationCenter />;
        case "settings":
  return <SettingsPage />;
  
        case "admin":

  if (!isAdmin) {
    return (
      <div>
        Access Denied
      </div>
    );
  }

  return <AdminPanel />;
  case "employees":

  if (!isAdmin && !isHR) {
    return (
      <div>
        Access Denied
      </div>
    );
  }

  return <EmployeePage />;

  case "attendance":
  return <AttendancePage />;
  case "performance":
  return <PerformanceDashboard />;



case "leave":
  return <LeavePage />;

case "payroll":

  if (!isAdmin && !isHR) {
    return (
      <div>
        Access Denied
      </div>
    );
  }

  return <PayrollPage />;

case "hr":

  if (!isAdmin && !isHR) {
    return (
      <div>
        Access Denied
      </div>
    );
  }

  return <HRDashboard />;

case "employee-dashboard":

  if (!isEmployee) {
    return (
      <div>
        Access Denied
      </div>
    );
  }

  return (
    <EmployeeDashboard />
  );

case "activity":
  return <ActivityPage />;
      case "invoices":
        return <Invoices />;

      default:
        return <LeadsDashboard leads={leads} />;
    }
  };

  // ================= MAIN =================
  return (
    <Layout
  setPage={setPage}
  currentPage={page}
  user={user}
>

      {/* ✅ USER PROFILE + LOGOUT */}
      <UserProfile user={user} logout={logout} />
      <NotificationCenter />

      {showPopup && (
        <>
          <NotificationPopup leads={leads} />
          <FollowUpAlert leads={leads} onClose={() => setShowPopup(false)} />
        </>
      )}

      <AutoFollowUp />

<TaskReminder />

<MeetingReminder />

<TaskAlertPopup />
<LiveNotification />


<NotificationSound />
<PWAInstallButton />
<NotificationBell />
<MobileSidebar
  open={sidebarOpen}
  setOpen={setSidebarOpen}
  setPage={setPage}
  currentPage={page}
/>
<MobileBottomNav
  setPage={setPage}
  currentPage={page}
/>
<MobileTopBar
  user={user}
  setSidebarOpen={setSidebarOpen}
/>
      <div
  style={styles.container}
  className="
  pt-[70px]
  md:pt-0
  "
>
        {loading && <p>Loading...</p>}
        {renderPage()}
      </div>
    </Layout>
  );
}

// ================= STYLES =================
const styles = {
  authContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  authBox: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
    width: "350px",
  },
  switchBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    border: "none",
    background: "#007bff",
    color: "#fff",
    borderRadius: "5px",
    cursor: "pointer",
  },
  container: {
  padding: "20px",
  paddingBottom: "100px"
},
};

export default App;