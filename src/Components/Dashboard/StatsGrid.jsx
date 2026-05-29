import React from "react";

const StatsGrid = ({ data }) => {
  return (
    <div className="stats-grid">
      {data.map((item, index) => (
        <div key={index} className={`stat-card ${item.cardType} ${item.isNonFunctional ? 'non-functional' : ''}`}>
          <div className="stat-header-row">
            <span className="stat-title">{item.label}</span>
            <div className="stat-icon-box">
              <item.icon size={16} />
            </div>
          </div>

          <div className="stat-number">
            {item.value}
          </div>

          <div className="stat-footer-row">
            <span>Last calibrated 5m ago</span>
          </div>

          <div className="green-badge">
            {item.change}
          </div>

          <div className="stat-bottom-link">
            ↗ Optimal Flow
          </div>

          {item.isNonFunctional && (
            <div className="coming-soon-badge">
              Coming Soon
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
