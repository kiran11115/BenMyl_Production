import React from "react";
import HiringManagerDashboard from "./HiringManagerDashboard";
import BenchSalesDashboard from "./BenchSalesDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("Role");

  if (role === "Benchsales") {
    return <BenchSalesDashboard />;
  }

  // Default to Hiring Manager dashboard for Recruiter or others
  return <HiringManagerDashboard />;
};

export default Dashboard;
