import React from "react";
import {
  FiMenu,
  FiBell,
  FiSettings
} from "react-icons/fi";

export default function Topbar({ openSidebar }) {

  return (
    <div
      className="
        bg-white shadow-sm border-b
        px-4 py-3
        flex items-center justify-between
      "
    >

      <div className="flex items-center gap-3">

        <button
          onClick={openSidebar}
          className="lg:hidden text-2xl"
        >
          <FiMenu />
        </button>

        <h2 className="font-bold text-lg">
          CRM Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">

        <button className="relative">
          <FiBell size={20} />
          <span className="
            absolute -top-2 -right-2
            bg-red-500 text-white
            text-xs w-5 h-5 rounded-full
            flex items-center justify-center
          ">
            2
          </span>
        </button>

        <button>
          <FiSettings size={20} />
        </button>

      </div>
    </div>
  );
}