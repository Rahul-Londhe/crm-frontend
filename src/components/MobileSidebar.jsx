import React from "react";

import {
  FiHome,
  FiUsers,
  FiCheckSquare,
  FiBarChart2,
  FiSettings,
  FiX,
  FiDollarSign
} from "react-icons/fi";

export default function MobileSidebar({
  open,
  setOpen,
  setPage,
  currentPage
}) {

  const menuStyle = (page) => ({

    background:
      currentPage === page
        ? "#2563eb"
        : "transparent",

    color:
      currentPage === page
        ? "#fff"
        : "#1e293b"

  });

  const MenuButton = ({
    icon,
    label,
    page
  }) => (

    <button

      onClick={() => {

        setPage(page);

        setOpen(false);

      }}

      style={menuStyle(page)}

      className="
      flex
      items-center
      gap-4
      p-4
      rounded-2xl
      font-semibold
      transition-all
      "

    >

      {icon}

      <span>
        {label}
      </span>

    </button>

  );

  return (

    <>

      {/* OVERLAY */}

      {open && (

        <div

          className="
          fixed
          inset-0
          bg-black/40
          z-40
          md:hidden
          "

          onClick={() => setOpen(false)}

        />

      )}

      {/* SIDEBAR */}

      <div

        className={`
        fixed
        top-0
        left-0
        h-full
        w-[280px]
        bg-white
        shadow-2xl
        z-50
        transform
        transition-transform
        duration-300
        md:hidden
        flex
        flex-col
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}

      >

        {/* TOP */}

        <div className="
        flex
        items-center
        justify-between
        p-5
        border-b
        ">

          <h2 className="
          text-2xl
          font-bold
          text-blue-600
          ">
            🚀 AI CRM
          </h2>

          <button
            onClick={() => setOpen(false)}
          >

            <FiX size={28} />

          </button>

        </div>

        {/* MENU */}

        <div className="
        flex
        flex-col
        gap-3
        p-4
        ">

          <MenuButton
            icon={<FiHome size={22} />}
            label="Dashboard"
            page="dashboard"
          />

          <MenuButton
            icon={<FiUsers size={22} />}
            label="Leads"
            page="leads"
          />

          <MenuButton
            icon={<FiCheckSquare size={22} />}
            label="Tasks"
            page="tasks"
          />

          <MenuButton
            icon={<FiBarChart2 size={22} />}
            label="Analytics"
            page="analytics"
          />

          <MenuButton
            icon={<FiDollarSign size={22} />}
            label="Invoices"
            page="invoices"
          />

          <MenuButton
            icon={<FiSettings size={22} />}
            label="Settings"
            page="settings"
          />

        </div>

      </div>

    </>

  );

}