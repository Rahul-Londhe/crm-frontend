import React from "react";

import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiDollarSign
} from "react-icons/fi";

export default function MobileBottomNav({
  setPage,
  currentPage
}) {
  const user =
  JSON.parse(
    localStorage.getItem("user") || "{}"
  );

const isAdmin =
  user?.role === "admin";

const isHR =
  user?.role === "hr";

const isEmployee =
  user?.role === "employee";

  // ================= ACTIVE STYLE =================

  const isActive = (page) =>
    currentPage === page;

  // ================= BUTTON STYLE =================

  const btnStyle = (page) => ({

    color: isActive(page)
      ? "#2563eb"
      : "#64748b",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "4px",

    border: "none",

    background: "transparent",

    fontSize: "11px",

    fontWeight: "600",

    cursor: "pointer",

    transition: "0.3s",

    width: "100%"

  });

  return (

    <div
      className="
      fixed
      bottom-0
      left-0
      right-0
      bg-white
      border-t
      border-slate-200
      flex
      justify-around
      items-center
   py-3
      md:hidden
      z-50
      shadow-[0_-2px_20px_rgba(0,0,0,0.08)]
      backdrop-blur-lg
      "
    >

      {/* DASHBOARD */}

      <button
        onClick={() => setPage("dashboard")}
        style={btnStyle("dashboard")}
      >

        <FiHome size={24} />

        <span>
          Home
        </span>

      </button>

      {/* LEADS */}

      <button
        onClick={() => setPage("leads")}
        style={btnStyle("leads")}
      >

        <FiUsers size={24} />

        <span>
          Leads
        </span>

      </button>

      {/* TASKS */}

      <button
        onClick={() => setPage("tasks")}
        style={btnStyle("tasks")}
      >

        <FiCheckSquare size={24} />

        <span>
          Tasks
        </span>

      </button>

      {/* INVOICES */}

      {(isAdmin || isHR) ? (

<button
  onClick={() => setPage("invoices")}
  style={btnStyle("invoices")}
>
  <FiDollarSign size={24} />
  <span>Bills</span>
</button>

) : (

<button
  onClick={() => setPage("attendance")}
  style={btnStyle("attendance")}
>
  <FiCheckSquare size={24} />
  <span>Attendance</span>
</button>

)}

    </div>

  );

}