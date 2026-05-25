import React from "react";
import HiringManagerDashboard from "./HiringManagerDashboard";
import BenchSalesDashboard from "./BenchSalesDashboard";
import RecruiterDashboard from "./RecruiterDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("Role");

  if (role === "Benchsales") {
    return <BenchSalesDashboard />;
  }

  if (role === "Recruiter") {
    return <RecruiterDashboard />;
  }

  // Default to Hiring Manager dashboard for Recruiter or others
  return <HiringManagerDashboard />;
};

export default Dashboard;
