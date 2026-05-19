import React from "react";

import {
  FiMenu
} from "react-icons/fi";

export default function MobileTopBar({
  user,
  setSidebarOpen
}) {

  return (

    <div
      className="
      fixed
      top-0
      left-0
      right-0
      h-[65px]
      bg-white
      border-b
      flex
      items-center
      justify-between
      px-4
      z-40
      md:hidden
      shadow-sm
      "
    >

      {/* MENU */}

      <button
        onClick={() => setSidebarOpen(true)}
      >

        <FiMenu size={28} />

      </button>

      {/* LOGO */}

      <h1 className="
      text-xl
      font-bold
      text-blue-600
      ">
        🚀 AI CRM
      </h1>

      {/* USER */}

      <div className="
      w-10
      h-10
      rounded-full
      bg-blue-600
      text-white
      flex
      items-center
      justify-center
      font-bold
      ">
        {user?.name?.charAt(0) || "U"}
      </div>

    </div>

  );

}