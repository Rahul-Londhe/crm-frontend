import React, { useEffect, useState, useCallback } from "react";
import {
  FaChartPie,
  FaUsers,
  FaProjectDiagram,
  FaRobot,
  FaWhatsapp,
  FaCogs,
  FaUserCircle,
  FaSignOutAlt,
  FaGlobe,
  FaTasks,
  FaFileInvoiceDollar
} from "react-icons/fa";
import axios from "axios";

const API = process.env.REACT_APP_API || "http://localhost:5000/api";

function Navbar({ setPage, currentPage, logout }) {
  const [pendingTasks, setPendingTasks] = useState(0);
  const [user, setUser] = useState(null);

  // ================= USER =================
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return setUser(null);

      const parsed = JSON.parse(stored);

      // 🔥 ROLE FIX (force lowercase safe)
      if (parsed?.role) {
        parsed.role = parsed.role.toLowerCase();
      }

      setUser(parsed);
    } catch {
      setUser(null);
    }
  }, []);

  // ================= TOKEN =================
  const getToken = () => {
    try {
      const t = localStorage.getItem("token");
      return t && t !== "undefined" && t !== "null" ? t : null;
    } catch {
      return null;
    }
  };

  // ================= LOAD TASKS =================
  const loadTasks = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return setPendingTasks(0);

      const res = await axios.get(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res?.data?.success) {
        const pending = (res.data.tasks || []).filter(
          (t) => t?.status !== "Completed"
        ).length;

        setPendingTasks(pending);
      } else {
        setPendingTasks(0);
      }
    } catch (err) {
      console.error("Task Count Error:", err.message);
      setPendingTasks(0);
    }
  }, []);

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 15000);
    return () => clearInterval(interval);
  }, [loadTasks]);

  // ================= ROLE =================
  const role = user?.role || "employee"; // 🔥 FIX

  const isAdmin = role === "admin";
  const isManager = role === "manager";

  // ================= BUTTON =================
  const btn = (active) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    background: active ? "#2563eb" : "#374151",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    position: "relative",
    transition: "0.2s",
    transform: active ? "scale(1.05)" : "scale(1)"
  });

  const handleNav = (page) => {
    setPage(page);
  };

  return (
    <div style={styles.nav}>
      {/* LEFT */}
      <div style={styles.menu}>
        <button style={btn(currentPage === "dashboard")} onClick={() => handleNav("dashboard")}>
          <FaChartPie /> Dashboard
        </button>

        <button style={btn(currentPage === "leads")} onClick={() => handleNav("leads")}>
          <FaUsers /> Leads
        </button>

        <button style={btn(currentPage === "pipeline")} onClick={() => handleNav("pipeline")}>
          <FaProjectDiagram /> Pipeline
        </button>

        {(isAdmin || isManager) && (
          <button style={btn(currentPage === "automation")} onClick={() => handleNav("automation")}>
            <FaCogs /> Automation
          </button>
        )}

        <button style={btn(currentPage === "ai")} onClick={() => handleNav("ai")}>
          <FaRobot /> AI Chat
        </button>

        <button style={btn(currentPage === "whatsapp")} onClick={() => handleNav("whatsapp")}>
          <FaWhatsapp /> WhatsApp
        </button>

        <button style={btn(currentPage === "tasks")} onClick={() => handleNav("tasks")}>
          <FaTasks /> Tasks

          {pendingTasks > 0 && (
            <span style={styles.badge}>
              {pendingTasks}
            </span>
          )}
        </button>

        <button style={btn(currentPage === "landing")} onClick={() => handleNav("landing")}>
          <FaGlobe /> Website Leads
        </button>

        <button style={btn(currentPage === "invoices")} onClick={() => handleNav("invoices")}>
          <FaFileInvoiceDollar /> Invoices
        </button>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <FaUserCircle size={22} color="#fff" />

        <span style={styles.userText}>
          {user?.name || "User"} ({role})
        </span>

        <button style={styles.logoutBtn} onClick={logout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  nav: {
    background: "#111827",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  },

  menu: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  badge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    padding: "3px 7px",
    fontSize: "10px",
    fontWeight: "bold"
  },

  userText: {
    color: "#fff",
    fontSize: "14px"
  }
};

export default Navbar;