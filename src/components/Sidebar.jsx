import React from "react";
import {
  FiUsers,
  FiHome,
  FiDollarSign,
  FiCalendar
} from "react-icons/fi";

export default function Sidebar() {

  const menus = [
    {
      title: "Dashboard",
      icon: <FiHome />,
    },
    {
      title: "Leads",
      icon: <FiUsers />,
    },
    {
      title: "Invoices",
      icon: <FiDollarSign />,
    },
    {
      title: "Calendar",
      icon: <FiCalendar />,
    }
  ];

  return (
    <div className="w-72 h-screen bg-slate-950 text-white p-5">

      <h1 className="text-2xl font-bold mb-10 text-blue-400">
        🚀 AI CRM
      </h1>

      <div className="space-y-2">

        {menus.map((m, i) => (
          <button
            key={i}
            className="
              w-full flex items-center gap-3
              px-4 py-3 rounded-xl
              hover:bg-blue-600
              transition
            "
          >
            {m.icon}
            {m.title}
          </button>
        ))}

      </div>
    </div>
  );
}