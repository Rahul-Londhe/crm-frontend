import React, { useState } from "react";
import TopNavbar from "./TopNavbar";

function Layout({
  children,
  setPage,
  currentPage,
  user
}) {

  const [collapsed, setCollapsed] =
    useState(false);
const isAdmin =
  user?.role === "admin";

const isHR =
  user?.role === "hr";

const isEmployee =
  user?.role === "employee";
  // ================= BUTTON STYLE =================

  const getButtonStyle = (page) => ({

    ...styles.sideBtn,

    background:
      currentPage === page
        ? "#2563eb"
        : "#1e293b",

    justifyContent:
      collapsed
        ? "center"
        : "flex-start"

  });

  // ================= HOVER =================

  const handleMouseEnter = (e) => {

    e.currentTarget.style.transform =
      "translateX(5px)";

  };

  const handleMouseLeave = (e) => {

    e.currentTarget.style.transform =
      "translateX(0px)";

  };

  return (

    <div style={styles.container}>

      {/* ================= TOP NAVBAR ================= */}

      <TopNavbar
        setPage={setPage}
        currentPage={currentPage}
      />

      <div style={styles.body}>

        {/* ================= SIDEBAR ================= */}

        <div
  className="hidden md:flex"
  style={{
    ...styles.sidebar,
            width:
              collapsed
                ? "90px"
                : "240px"
          }}
        >

          {/* COLLAPSE BUTTON */}

          {/* COLLAPSE BUTTON */}

<button
  style={styles.toggleBtn}

  onClick={() =>
    setCollapsed(!collapsed)
  }
>

  {collapsed ? "➡" : "⬅"}

</button>

{/* ================= HR SECTION ================= */}

{(isAdmin || isHR) && (
  <>
  
    {!collapsed && (
      <div style={styles.sectionTitle}>
        HR MANAGEMENT
      </div>
    )}

    <button
      style={getButtonStyle("employees")}
      onClick={() => setPage("employees")}
    >
      {collapsed ? "👨" : "👨 Employees"}
    </button>

  </>
)}

{/* ATTENDANCE */}

{(isAdmin || isHR || isEmployee) && (

<button
  style={getButtonStyle("attendance")}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={() => setPage("attendance")}
>

  {collapsed
    ? "📅"
    : "📅 Attendance"}

</button>

)}

{/* LEAVE */}

<button
  style={getButtonStyle("leave")}

  onMouseEnter={handleMouseEnter}

  onMouseLeave={handleMouseLeave}

  onClick={() =>
    setPage("leave")
  }
>

  {collapsed
    ? "🏖"
    : "🏖 Leave"}

</button>

{/* PAYROLL */}

{(isAdmin || isHR) && (

<button
  style={getButtonStyle("payroll")}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={() => setPage("payroll")}
>

  {collapsed
    ? "💰"
    : "💰 Payroll"}

</button>

)}

{/* ================= MANAGEMENT SECTION ================= */}

{!collapsed && (
  <div style={styles.sectionTitle}>
    MANAGEMENT
  </div>
)}

{/* HR DASHBOARD */}

{(isAdmin || isHR) && (

<button
  style={getButtonStyle("hr")}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={() => setPage("hr")}
>

  {collapsed
    ? "👨‍💼"
    : "👨‍💼 HR Dashboard"}

</button>

)}

{/* PERFORMANCE */}

{(isAdmin || isHR) && (

<button
  style={getButtonStyle("performance")}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={() => setPage("performance")}
>

  {collapsed
    ? "📊"
    : "📊 Performance"}

</button>

)}
{/* ACTIVITY */}

<button
  style={getButtonStyle("activity")}

  onMouseEnter={handleMouseEnter}

  onMouseLeave={handleMouseLeave}

  onClick={() =>
    setPage("activity")
  }
>

  {collapsed
    ? "🕘"
    : "🕘 Activity"}

</button>
<button
  style={getButtonStyle("meeting-calendar")}
  onClick={() =>
    setPage("meeting-calendar")
  }
>

  {collapsed
    ? "📅"
    : "📅 Meetings"}

</button>
{/* ADMIN */}

{isAdmin && (

<button
  style={getButtonStyle("admin")}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  onClick={() => setPage("admin")}
>

  {collapsed
    ? "🔐"
    : "🔐 Admin"}

</button>

)}
{/* SETTINGS */}

<button
  style={getButtonStyle("settings")}

  onMouseEnter={handleMouseEnter}

  onMouseLeave={handleMouseLeave}

  onClick={() => {
  console.log("SETTINGS OPEN");
  setPage("settings");
}}
>

  {collapsed
    ? "⚙️"
    : "⚙️ Settings"}

</button>
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div
          style={{
            ...styles.main,
            marginLeft:
  window.innerWidth < 768
    ? "0px"
    : collapsed
    ? "90px"
    : "240px"
          }}
        >

          {children}

        </div>

      </div>

    </div>

  );

}

// ================= STYLES =================

const styles = {

  container: {

    minHeight: "100vh",

    background: "#f5f7fb"

  },

  body: {

    display: "flex",

    marginTop: "65px"

  },

  sidebar: {

  background: "#0f172a",

  height: "calc(100vh - 65px)",

  padding: "15px",

  display: "flex",

  flexDirection: "column",

  gap: "15px",

  position: "fixed",

  top: "65px",

  left: 0,

  overflowY: "auto",

  WebkitOverflowScrolling: "touch",

  transition: "0.3s"

},

  toggleBtn: {

    padding: "12px",

    border: "none",

    borderRadius: "10px",

    background: "#2563eb",

    color: "#fff",

    cursor: "pointer",

    fontWeight: "bold",

    marginBottom: "10px"

  },
sectionTitle: {

  color: "#94a3b8",

  fontSize: "12px",

  fontWeight: "bold",

  marginTop: "10px",

  marginBottom: "5px",

  letterSpacing: "1px"

},
  sideBtn: {

    padding: "14px",

    border: "none",

    borderRadius: "14px",

    background: "#1e293b",

    color: "#fff",

    cursor: "pointer",

    fontSize: "15px",

    transition: "all 0.3s ease",

    fontWeight: "600",

    display: "flex",

    alignItems: "center",

    gap: "10px",

    boxShadow:
      "0 2px 5px rgba(0,0,0,0.2)"

  },

 main: {

  flex: 1,

  padding:
    window.innerWidth < 768
      ? "10px"
      : "15px",

  transition: "0.3s"

},

};

export default Layout;