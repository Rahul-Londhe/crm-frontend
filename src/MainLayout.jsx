import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-slate-100 min-h-screen">

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static z-50 top-0 left-0 h-screen
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <Sidebar close={() => setOpen(false)} />
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar openSidebar={() => setOpen(true)} />

        <main className="p-3 md:p-5 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}