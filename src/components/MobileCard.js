import React from "react";

export default function MobileCard({
  children
}) {

  return (

    <div
      className="
      bg-white
      rounded-3xl
      shadow-lg
      border
      border-slate-200
      p-4
      mb-4
      "
    >
      {children}
    </div>

  );

}