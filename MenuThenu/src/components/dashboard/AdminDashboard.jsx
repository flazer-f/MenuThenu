import React from "react";
import StatsCards from "../dashboard/StatsCard.jsx";
import Sidebar from "../dashboard/Sidebar.jsx";

const Dashboard = () => (

    <div className="flex-1 p-12">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <StatsCards />
    </div>
  
);

export default Dashboard;
