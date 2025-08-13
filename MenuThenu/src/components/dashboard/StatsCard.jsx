import React from "react";

const StatsCards = () => {
  // Data directly inside this component
  const stats = [
    { label: "Menus Created", value: 69 },
    { label: "Total Views", value: 619 },
    { label: "Average Rating", value: 6.9 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-4 flex flex-col items-center justify-center"
        >
          <h3 className="text-gray-500 text-sm">{stat.label}</h3>
          <p className="text-2xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
