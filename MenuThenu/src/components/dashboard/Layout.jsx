import React from "react";
import Sidebar from "./Sidebar.jsx";
import { Outlet } from "react-router-dom";

const Layout = () => (
  <div className="flex min-h-screen">
    {/* Sidebar on the left */}
    <Sidebar />

    {/* Main content (Dashboard, MenuList, etc.) */}
    <div className="flex-1 p-12">
      <Outlet />
    </div>
  </div>
);

export default Layout;
