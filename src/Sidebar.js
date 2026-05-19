import React from "react";

import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyCheckAlt,
  FaChartPie,
  FaHistory,
  FaUserShield,
  FaClipboardList,
  FaBuilding
} from "react-icons/fa";

function Sidebar({ setPage, currentPage, user }) {

  const menus = [

    {
      label: "Employees",
      page: "employees",
      icon: <FaUsers />
    },

    {
      label: "Attendance",
      page: "attendance",
      icon: <FaCalendarCheck />
    },

    {
      label: "Leave",
      page: "leave",
      icon: <FaClipboardList />
    },

    {
      label: "Payroll",
      page: "payroll",
      icon: <FaMoneyCheckAlt />
    },

    {
      label: "HR Dashboard",
      page: "hr",
      icon: <FaBuilding />
    },

    {
      label: "Performance",
      page: "performance",
      icon: <FaChartPie />
    },

    {
      label: "Activity",
      page: "activity",
      icon: <FaHistory />
    }

  ];

  if (user?.role === "admin") {

    menus.push({
      label: "Admin Panel",
      page: "admin",
      icon: <FaUserShield />
    });

  }

  return (

    <div style={styles.sidebar}>

      <h2 style={styles.title}>
        HRMS
      </h2>

      {menus.map((item) => (

        <div
          key={item.page}

          onClick={() =>
            setPage(item.page)
          }

          style={{
            ...styles.menu,

            background:
              currentPage === item.page
                ? "#2563eb"
                : "transparent"
          }}
        >

          {item.icon}

          <span>
            {item.label}
          </span>

        </div>

      ))}

    </div>

  );

}

const styles = {

  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
    position: "fixed",
    top: "65px",
    left: 0
  },

  title: {
    marginBottom: "30px"
  },

  menu: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "10px",
    transition: "0.3s"
  }

};

export default Sidebar;