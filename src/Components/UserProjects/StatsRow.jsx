import React from "react";
import "./Projects.css";

const StatsRow = ({ stats }) => {
  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`stat-card ${stat.cardType || ""} ${stat.isNonFunctional ? "non-functional" : ""}`}
        >
          <div className="stat-header-row">
            <span className="stat-title">{stat.label}</span>
            <div className="stat-icon-box">
              <stat.icon size={16} />
            </div>
          </div>

          <div className="stat-number">
            {stat.value}
          </div>

          <div className="stat-footer-row">
            <span>Last calibrated 5m ago</span>
          </div>

          <div className="green-badge">
            {stat.trend}
          </div>

          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>

          {stat.isNonFunctional && (
            <div className="coming-soon-badge">
              Coming Soon
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsRow;
