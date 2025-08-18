// src/components/dashboard/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Menus", path: "/admin/menulist" },
    { name: "Analytics", path: "/analytics" },
    { name: "Settings", path: "/settings" },
    { name: "Help", path: "/help" },
  ];

  return (
    <div className="w-60 bg-gray-800 text-white h-screen p-4">
      <nav className="flex flex-col space-y-4">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="hover:bg-gray-700 px-3 py-2 rounded transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
