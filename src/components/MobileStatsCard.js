import React from "react";

export default function MobileStatsCard({
  title,
  value,
  color = "blue"
}) {

  return (

    <div
      className={`
      rounded-3xl
      p-4
      text-white
      shadow-lg
      bg-${color}-600
      `}
    >

      <h3 className="text-sm opacity-80">
        {title}
      </h3>

      <h1 className="text-3xl font-bold mt-2">
        {value}
      </h1>

    </div>

  );

}