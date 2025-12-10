import React from "react";
import { FiBriefcase, FiBarChart2, FiClock, FiDollarSign } from "react-icons/fi";

const iconsMap = {
  "Active Candidates": FiBriefcase,
  "Pipeline Progress": FiBarChart2,
  "Avg. Days to Hire": FiClock,
  "Budget Spents": FiDollarSign,
};

const StatCard = ({ title, value, percent, circle }) => {
  const Icon = iconsMap[title];

  return (
    <div className="card stat-card">
      <div className="stat-header">
        <div className="stat-icon">
          {Icon && <Icon size={16} />}
        </div>

        <span className="green">{percent}</span>
      </div>

      <div className="stat-body">
        <span className="stat-title">{title}</span>
        <div className="stat-value">{value}</div>
      </div>

      {circle && (
        <div className="progress-circle">
          <span>76%</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
