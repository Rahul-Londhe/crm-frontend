import React, { useState, useEffect } from "react";
import { FaChartPie }
from "react-icons/fa";
import {
  FaHistory,
  FaTachometerAlt,
  FaUsers,
  FaProjectDiagram,
  FaRobot,
  FaWhatsapp,
  FaEnvelope,
  FaChartLine,
  FaFileInvoiceDollar,
  FaTasks,
  FaUserShield,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaCalendarAlt
} from "react-icons/fa";
  


function TopNavbar({ setPage, currentPage }) {

  const [active, setActive] =
    useState(currentPage || "dashboard");

  const [user, setUser] =
    useState(null);

  // ================= USER =================
  useEffect(() => {

    try {

      const stored =
        localStorage.getItem("user");

      if (
        stored &&
        stored !== "undefined"
      ) {

        setUser(JSON.parse(stored));

      }

    } catch {

      setUser(null);

    }

  }, []);

  // ================= ACTIVE PAGE =================
  useEffect(() => {

    if (currentPage) {
      setActive(currentPage);
    }

  }, [currentPage]);

  // ================= OPEN PAGE =================
  const openPage = (page) => {

    setActive(page);

    if (typeof setPage === "function") {

      setPage(page);

    }

  };

  // ================= LOGOUT =================
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.reload();

  };

  return (

    <div style={styles.navbar}>

      {/* ================= LEFT ================= */}
      <div style={styles.left}>

        <div style={styles.logo}>
          🚀 AI CRM
        </div>

      </div>

      {/* ================= CENTER MENU ================= */}
      <div style={styles.menu}>

  {/* ================= ADMIN MENU ================= */}

  {user?.role === "admin" && (

    <>

     <Menu
  icon={<FaTachometerAlt />}
  page="dashboard"
  active={active}
  onClick={openPage}
  label="Dashboard"
/>

<Menu
  icon={<FaUsers />}
  page="leads"
  active={active}
  onClick={openPage}
  label="Leads"
/>

<Menu
  icon={<FaProjectDiagram />}
  page="pipeline"
  active={active}
  onClick={openPage}
  label="Pipeline"
/>
<Menu
  icon={<FaRobot />}
  page="automation"
  active={active}
  onClick={openPage}
  label="Automation"
/>
<Menu
  icon={<FaWhatsapp />}
  page="whatsapp"
  active={active}
  onClick={openPage}
  label="WhatsApp"
/>
<Menu
  icon={<FaEnvelope />}
  page="ai"
  active={active}
  onClick={openPage}
  label="AI Chat"
/>
<Menu

  icon={<FaTasks />}
  page="tasks"
  active={active}
  onClick={openPage}
  label="Tasks"
/>

<Menu
  icon={<FaChartLine />}
  page="analytics"
  active={active}
  onClick={openPage}
  label="Analytics"
/>

<Menu
  icon={<FaFileInvoiceDollar />}
  page="invoices"
  active={active}
  onClick={openPage}
  label="Invoices"
/>
<Menu
  icon={<FaCalendarAlt />}
  page="meeting-calendar"
  active={active}
  onClick={openPage}
  label="Meetings"
/>
    </>

  )}

  {/* ================= EMPLOYEE MENU ================= */}

  {user?.role === "employee" && (

    <>

      <Menu
        icon={<FaTachometerAlt />}
        page="employee-dashboard"
        active={active}
        onClick={openPage}
        label="Employee Dashboard"
      />

      <Menu
        icon={<FaUsers />}
        page="attendance"
        active={active}
        onClick={openPage}
        label="Attendance"
      />

      <Menu
        icon={<FaTasks />}
        page="leave"
        active={active}
        onClick={openPage}
        label="Leave"
      />

    </>

  )}

</div>
      {/* ================= RIGHT ================= */}
      <div style={styles.right}>

        {/* NOTIFICATION */}
<div
  style={styles.iconBox}
  onClick={() => openPage("notifications")}
>
  <FaBell />
</div>

        {/* SETTINGS */}
<div
  style={styles.iconBox}
  onClick={() => openPage("settings")}
>
  <FaCog />
</div>

        {/* USER */}
        <div style={styles.userBox}>

          👤 {user?.name || "User"}

          <span style={styles.role}>
            ({user?.role || "employee"})
          </span>

        </div>

        {/* LOGOUT */}
        <div
          style={styles.logout}
          onClick={logout}
        >
          <FaSignOutAlt />
        </div>

      </div>

    </div>

  );

}

// ================= MENU =================
function Menu({
  icon,
  page,
  active,
  onClick,
  label
}) {

  const isActive =
    active === page;

  return (

    <div
      title={label}

      onClick={() =>
        onClick(page)
      }

      style={{
        ...styles.menuItem,

        background:
          isActive
            ? "#2563eb"
            : "transparent",

        transform:
          isActive
            ? "scale(1.05)"
            : "scale(1)"
      }}
    >

      {icon}

    </div>

  );

}

// ================= STYLES =================
const styles = {

  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "65px",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "#fff",
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "1px"
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },

  menuItem: {
    fontSize: "18px",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },

  iconBox: {
    background: "#1e293b",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px"
  },

  userBox: {
    background: "#111827",
    padding: "10px 15px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: "500"
  },

  role: {
    marginLeft: "5px",
    color: "#60a5fa"
  },

  logout: {
    background: "#dc2626",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer"
  }

};

export default TopNavbar;